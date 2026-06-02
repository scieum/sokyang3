import SunCalc from 'suncalc';
import type { GeoPosition } from '@/types';

export interface SunInfo {
  /** 태양 고도각 (도) */
  altitude: number;
  /** 태양 방위각 (도, 북=0 기준) */
  azimuth: number;
}

/**
 * 특정 시각·위치의 태양 고도/방위각을 계산한다.
 * Cesium 광원·그림자 시뮬레이션의 입력값이자 패널 표시용.
 */
export function getSunInfo(date: Date, pos: GeoPosition): SunInfo {
  const { altitude, azimuth } = SunCalc.getPosition(
    date,
    pos.latitude,
    pos.longitude,
  );
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  return {
    altitude: toDeg(altitude),
    // SunCalc 방위각은 남쪽 기준 → 북쪽(0) 기준으로 변환
    azimuth: (toDeg(azimuth) + 180) % 360,
  };
}
