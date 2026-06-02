import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';

/**
 * Geolocation watchPosition 으로 사용자 이동을 추적하여 스토어에 누적한다.
 * isTracking 이 true 인 동안에만 watch 를 유지하고, 정지 시 해제한다.
 */
export function useTracking() {
  const isTracking = useAppStore((s) => s.isTracking);
  const addTrackPoint = useAppStore((s) => s.addTrackPoint);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isTracking) return;
    if (!('geolocation' in navigator)) {
      setError('geolocation-unavailable');
      return;
    }

    setError(null);
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        addTrackPoint({
          position: {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
            height: pos.coords.altitude ?? 0,
          },
          timestamp: pos.timestamp,
        });
      },
      (err) => {
        // 권한 거부/저정밀 상황 처리
        setError(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable');
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTracking, addTrackPoint]);

  return { error };
}
