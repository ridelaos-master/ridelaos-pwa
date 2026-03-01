// src/hooks/useGeolocation.ts
// S4-05-A: 실시간 위치 추적 훅 (Geolocation API)

import { useState, useEffect, useCallback, useRef } from 'react';

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number; // 미터
  speed: number | null; // m/s
  heading: number | null; // 방위각 (0~360)
  timestamp: number;
}

interface UseGeolocationReturn {
  position: GeoPosition | null;
  isTracking: boolean;
  error: string | null;
  startTracking: () => void;
  stopTracking: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('이 기기에서 위치 서비스를 사용할 수 없습니다.');
      return;
    }

    setError(null);
    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
          timestamp: pos.timestamp,
        });
        setError(null);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('위치 권한이 거부되었습니다. 설정에서 허용해주세요.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('위치 정보를 가져올 수 없습니다.');
            break;
          case err.TIMEOUT:
            setError('위치 요청 시간이 초과되었습니다.');
            break;
          default:
            setError('위치를 가져오는 중 오류가 발생했습니다.');
        }
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  // 언마운트 시 추적 중지
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    position,
    isTracking,
    error,
    startTracking,
    stopTracking,
  };
}