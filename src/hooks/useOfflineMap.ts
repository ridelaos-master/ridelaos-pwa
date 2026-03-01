// src/hooks/useOfflineMap.ts
// S4-04-A: 오프라인 지도 다운로드 관리 훅
// Cache API를 사용하여 Mapbox 타일을 코스별로 다운로드/삭제

import { useState, useCallback, useEffect } from 'react';

// ─── 타입 정의 ───────────────────────────────────────────

export interface CourseWaypoint {
  id: string;
  course_id: string;
  name_ko: string;
  lat: number;
  lng: number;
  type: 'start' | 'waypoint' | 'end' | 'rest';
}

export interface OfflineMapStatus {
  courseId: string;
  isDownloaded: boolean;
  downloadProgress: number; // 0~100
  tileCount: number;
  sizeBytes: number;
  sizeEstimate: string; // "약 15MB"
  lastUpdated: string | null;
}

interface UseOfflineMapReturn {
  status: OfflineMapStatus | null;
  isDownloading: boolean;
  error: string | null;
  downloadMap: () => Promise<void>;
  deleteMap: () => Promise<void>;
  cancelDownload: () => void;
  storageInfo: { used: string; available: string; percentage: number } | null;
}

// ─── 상수 ────────────────────────────────────────────────

const MAPBOX_STYLE = 'mapbox/outdoors-v12';
const ZOOM_LEVELS = [8, 9, 10, 11, 12, 13, 14];
const MAX_TILES = 500; // Mapbox 무료 티어 고려
const BBOX_PADDING = 0.05; // 바운딩 박스 여유 (도 단위)
const CACHE_PREFIX = 'offline-map-';
const STATUS_PREFIX = 'offline-map-status-';

// ─── 유틸리티 함수 ───────────────────────────────────────

/** 위경도 → 타일 좌표 변환 */
function lngLatToTile(lng: number, lat: number, zoom: number): { x: number; y: number } {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
  return { x, y };
}

/** 웨이포인트들의 바운딩 박스 계산 */
function getBoundingBox(waypoints: CourseWaypoint[]): {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
} {
  const lngs = waypoints.map((w) => w.lng);
  const lats = waypoints.map((w) => w.lat);
  return {
    minLng: Math.min(...lngs) - BBOX_PADDING,
    maxLng: Math.max(...lngs) + BBOX_PADDING,
    minLat: Math.min(...lats) - BBOX_PADDING,
    maxLat: Math.max(...lats) + BBOX_PADDING,
  };
}

/** 바운딩 박스 + 줌 레벨 → 필요한 타일 URL 목록 생성 */
function generateTileUrls(
  waypoints: CourseWaypoint[],
  token: string
): string[] {
  if (waypoints.length === 0) return [];

  const bbox = getBoundingBox(waypoints);
  const urls: string[] = [];

  for (const zoom of ZOOM_LEVELS) {
    const topLeft = lngLatToTile(bbox.minLng, bbox.maxLat, zoom);
    const bottomRight = lngLatToTile(bbox.maxLng, bbox.minLat, zoom);

    for (let x = topLeft.x; x <= bottomRight.x; x++) {
      for (let y = topLeft.y; y <= bottomRight.y; y++) {
        urls.push(
          `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/${zoom}/${x}/${y}?access_token=${token}`
        );
      }
    }

    // 타일 수 제한 초과 시 더 높은 줌 레벨 중단
    if (urls.length >= MAX_TILES) {
      break;
    }
  }

  return urls.slice(0, MAX_TILES);
}

/** 바이트 → 읽기 쉬운 문자열 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/** 타일 수 기반 용량 추정 (타일당 평균 ~30KB) */
function estimateSize(tileCount: number): string {
  const estimatedBytes = tileCount * 30 * 1024;
  return `약 ${formatBytes(estimatedBytes)}`;
}

/** localStorage에 상태 저장 */
function saveStatus(courseId: string, status: Omit<OfflineMapStatus, 'courseId'>): void {
  try {
    localStorage.setItem(STATUS_PREFIX + courseId, JSON.stringify(status));
  } catch {
    // localStorage 실패 시 무시
  }
}

/** localStorage에서 상태 읽기 */
function loadStatus(courseId: string): OfflineMapStatus | null {
  try {
    const raw = localStorage.getItem(STATUS_PREFIX + courseId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { courseId, ...parsed };
  } catch {
    return null;
  }
}

/** 스토리지 사용량 확인 */
async function getStorageEstimate(): Promise<{
  used: string;
  available: string;
  percentage: number;
} | null> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      return {
        used: formatBytes(used),
        available: formatBytes(quota - used),
        percentage: quota > 0 ? Math.round((used / quota) * 100) : 0,
      };
    }
  } catch {
    // 미지원 브라우저
  }
  return null;
}

// ─── 메인 훅 ─────────────────────────────────────────────

export function useOfflineMap(
  courseId: string,
  waypoints: CourseWaypoint[]
): UseOfflineMapReturn {
  const [status, setStatus] = useState<OfflineMapStatus | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<{
    used: string;
    available: string;
    percentage: number;
  } | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const cacheName = CACHE_PREFIX + courseId;

  // 초기 상태 로드
  useEffect(() => {
    const saved = loadStatus(courseId);
    if (saved) {
      setStatus(saved);
    } else {
      // 타일 수 추정
      const tileUrls = generateTileUrls(waypoints, mapboxToken);
      setStatus({
        courseId,
        isDownloaded: false,
        downloadProgress: 0,
        tileCount: tileUrls.length,
        sizeBytes: 0,
        sizeEstimate: estimateSize(tileUrls.length),
        lastUpdated: null,
      });
    }

    // 스토리지 정보
    getStorageEstimate().then(setStorageInfo);
  }, [courseId, waypoints, mapboxToken]);

  // 다운로드
  const downloadMap = useCallback(async () => {
    if (isDownloading || !mapboxToken || waypoints.length === 0) return;

    setIsDownloading(true);
    setError(null);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const tileUrls = generateTileUrls(waypoints, mapboxToken);
      const totalTiles = tileUrls.length;

      if (totalTiles === 0) {
        setError('웨이포인트 데이터가 없습니다.');
        setIsDownloading(false);
        return;
      }

      const cache = await caches.open(cacheName);
      let downloaded = 0;
      let totalBytes = 0;

      // 동시 다운로드 제한 (5개씩)
      const BATCH_SIZE = 5;
      for (let i = 0; i < totalTiles; i += BATCH_SIZE) {
        if (controller.signal.aborted) {
          throw new Error('cancelled');
        }

        const batch = tileUrls.slice(i, i + BATCH_SIZE);
        const results = await Promise.allSettled(
          batch.map(async (url) => {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            totalBytes += blob.size;
            await cache.put(url, new Response(blob, {
              headers: {
                'Content-Type': response.headers.get('Content-Type') || 'image/png',
                'X-Offline-Map': courseId,
              },
            }));
          })
        );

        // 실패한 타일은 카운트하되 중단하지 않음
        downloaded += results.filter((r) => r.status === 'fulfilled').length;

        const progress = Math.round((downloaded / totalTiles) * 100);
        setStatus((prev) => prev ? { ...prev, downloadProgress: progress } : prev);
      }

      // 완료 상태 저장
      const now = new Date().toISOString().split('T')[0]; // "2026-03-01"
      const finalStatus: OfflineMapStatus = {
        courseId,
        isDownloaded: true,
        downloadProgress: 100,
        tileCount: downloaded,
        sizeBytes: totalBytes,
        sizeEstimate: formatBytes(totalBytes),
        lastUpdated: now,
      };

      setStatus(finalStatus);
      saveStatus(courseId, {
        isDownloaded: true,
        downloadProgress: 100,
        tileCount: downloaded,
        sizeBytes: totalBytes,
        sizeEstimate: formatBytes(totalBytes),
        lastUpdated: now,
      });

      // 스토리지 정보 갱신
      const newStorage = await getStorageEstimate();
      setStorageInfo(newStorage);
    } catch (err) {
      if ((err as Error).message === 'cancelled') {
        setError(null); // 사용자가 취소한 경우 에러 표시 안 함
      } else {
        setError('다운로드 중 오류가 발생했습니다. 네트워크를 확인해주세요.');
        console.error('[OfflineMap] Download error:', err);
      }
    } finally {
      setIsDownloading(false);
      setAbortController(null);
    }
  }, [courseId, waypoints, mapboxToken, cacheName, isDownloading]);

  // 삭제
  const deleteMap = useCallback(async () => {
    try {
      await caches.delete(cacheName);
      localStorage.removeItem(STATUS_PREFIX + courseId);

      const tileUrls = generateTileUrls(waypoints, mapboxToken);
      setStatus({
        courseId,
        isDownloaded: false,
        downloadProgress: 0,
        tileCount: tileUrls.length,
        sizeBytes: 0,
        sizeEstimate: estimateSize(tileUrls.length),
        lastUpdated: null,
      });

      const newStorage = await getStorageEstimate();
      setStorageInfo(newStorage);
    } catch (err) {
      setError('삭제 중 오류가 발생했습니다.');
      console.error('[OfflineMap] Delete error:', err);
    }
  }, [courseId, waypoints, mapboxToken, cacheName]);

  // 취소
  const cancelDownload = useCallback(() => {
    if (abortController) {
      abortController.abort();
    }
  }, [abortController]);

  return {
    status,
    isDownloading,
    error,
    downloadMap,
    deleteMap,
    cancelDownload,
    storageInfo,
  };
}

// ─── 유틸리티 export (OfflineMapManager에서 사용) ─────────

export { formatBytes, getStorageEstimate };

/** 모든 다운로드된 코스 목록 조회 */
export async function getAllDownloadedMaps(): Promise<OfflineMapStatus[]> {
  const results: OfflineMapStatus[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STATUS_PREFIX)) {
      try {
        const courseId = key.replace(STATUS_PREFIX, '');
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.isDownloaded) {
            results.push({ courseId, ...parsed });
          }
        }
      } catch {
        // 파싱 실패 무시
      }
    }
  }
  return results;
}