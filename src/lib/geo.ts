import type { GeoPosition } from '@/types';

const EARTH_RADIUS_M = 6_371_000;

const toRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * 두 좌표 사이의 거리(미터)를 Haversine 공식으로 계산.
 * 트래킹 누적 이동거리 산출에 사용한다.
 */
export function haversineDistance(a: GeoPosition, b: GeoPosition): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** TrackPoint 배열의 누적 이동거리(미터) */
export function totalDistance(points: GeoPosition[]): number {
  let sum = 0;
  for (let i = 1; i < points.length; i += 1) {
    sum += haversineDistance(points[i - 1], points[i]);
  }
  return sum;
}
