// src/components/OfflineMapManager.tsx
// S4-04-B: 오프라인 지도 다운로드 관리 UI
// CourseDetail.tsx 지도 섹션 아래에 배치

import { useOfflineMap, type CourseWaypoint } from '../hooks/useOfflineMap';
import { Download, Trash2, RefreshCw, CheckCircle, WifiOff, X } from 'lucide-react';

interface OfflineMapManagerProps {
  courseId: string;
  courseName: string;
  waypoints: CourseWaypoint[];
}

export default function OfflineMapManager({
  courseId,
  courseName,
  waypoints,
}: OfflineMapManagerProps) {
  const {
    status,
    isDownloading,
    error,
    downloadMap,
    deleteMap,
    cancelDownload,
    storageInfo,
  } = useOfflineMap(courseId, waypoints);

  if (!status) return null;

  // 웨이포인트 없으면 표시 안 함
  if (waypoints.length === 0) return null;

  return (
    <div className="bg-white rounded-card shadow-card p-4 mx-4 mt-3">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <WifiOff size={18} className="text-rl-green" />
        <h3 className="text-sm font-bold text-rl-green">오프라인 지도</h3>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-rl-error rounded-btn px-3 py-2 mb-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ── 상태별 UI ── */}

      {/* 1. 다운로드 안 됨 */}
      {!status.isDownloaded && !isDownloading && (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            이 코스의 지도를 다운로드하면{'\n'}인터넷 없이도 사용할 수 있습니다
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">
              예상 용량: {status.sizeEstimate} ({status.tileCount}개 타일)
            </span>
          </div>

          <button
            onClick={downloadMap}
            className="w-full bg-rl-orange text-white font-bold py-3 rounded-btn flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
          >
            <Download size={18} />
            오프라인 지도 다운로드
          </button>
        </div>
      )}

      {/* 2. 다운로드 중 */}
      {isDownloading && (
        <div>
          {/* 프로그레스 바 */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
            <div
              className="bg-rl-green h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${status.downloadProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-rl-green font-bold">
              다운로드 중... {status.downloadProgress}%
            </span>
            <button
              onClick={cancelDownload}
              className="flex items-center gap-1 text-sm text-gray-400 active:text-red-500"
            >
              <X size={14} />
              취소
            </button>
          </div>
        </div>
      )}

      {/* 3. 다운로드 완료 */}
      {status.isDownloaded && !isDownloading && (
        <div>
          {/* 완료 뱃지 */}
          <div className="bg-rl-success rounded-btn px-3 py-2 mb-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-rl-green" />
            <span className="text-sm font-bold text-rl-green">
              오프라인 사용 가능
            </span>
          </div>

          {/* 정보 */}
          <div className="text-xs text-gray-400 space-y-1 mb-3">
            <p>용량: {status.sizeEstimate}</p>
            <p>타일: {status.tileCount}개</p>
            {status.lastUpdated && <p>업데이트: {status.lastUpdated}</p>}
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-2">
            <button
              onClick={deleteMap}
              className="flex-1 border border-red-300 text-red-500 py-2 rounded-btn flex items-center justify-center gap-1 text-sm active:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              삭제
            </button>
            <button
              onClick={downloadMap}
              className="flex-1 border border-rl-green text-rl-green py-2 rounded-btn flex items-center justify-center gap-1 text-sm active:bg-gray-50 transition-colors"
            >
              <RefreshCw size={14} />
              업데이트
            </button>
          </div>
        </div>
      )}

      {/* 스토리지 정보 (하단) */}
      {storageInfo && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-300">
            기기 저장공간: {storageInfo.used} 사용 중 ({storageInfo.percentage}%)
          </p>
        </div>
      )}
    </div>
  );
}