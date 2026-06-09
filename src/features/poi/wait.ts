import type { Poi } from '@/types';

export type CongestionLevel = 'low' | 'medium' | 'high';

export interface WaitPrediction {
  /** 예상 대기 시간(분) */
  minutes: number;
  /** 혼잡도 등급 */
  level: CongestionLevel;
}

/**
 * 카테고리별 시간대(0–23시) 혼잡 계수(0–1).
 * 식당은 점심·저녁, 시장은 한낮, 랜드마크(속초아이)는 오후·야간에 피크.
 */
function timeFactor(category: Poi['category'], hour: number): number {
  const curves: Partial<Record<Poi['category'], number[]>> = {
    // 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
    restaurant: [
      0, 0, 0, 0, 0, 0, 0.1, 0.2, 0.3, 0.3, 0.4, 0.7, 1.0, 0.9, 0.5, 0.4,
      0.4, 0.6, 0.9, 1.0, 0.7, 0.4, 0.2, 0.1,
    ],
    market: [
      0, 0, 0, 0, 0, 0, 0.1, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0, 0.9, 0.9, 0.8,
      0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0,
    ],
    landmark: [
      0.1, 0.1, 0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.6, 0.6, 0.7, 0.7,
      0.7, 0.8, 0.9, 1.0, 1.0, 0.9, 0.6, 0.3,
    ],
  };
  const curve = curves[category];
  if (!curve) return 0.4; // 기본 완만한 곡선
  return curve[Math.max(0, Math.min(23, hour))];
}

/**
 * 현재 시각·요일을 반영해 예상 웨이팅을 산출한다.
 * baseline(피크 평균 대기)에 시간대 계수와 주말 가중치를 곱한다.
 */
export function predictWaitTime(
  poi: Poi,
  now: Date = new Date(),
): WaitPrediction | null {
  const baseline = poi.details?.waitBaseline;
  if (baseline == null) return null;

  const hour = now.getHours();
  const day = now.getDay(); // 0=일, 6=토
  const isWeekend = day === 0 || day === 6;

  const factor = timeFactor(poi.category, hour);
  const weekendMult = isWeekend ? 1.4 : 1.0;

  const minutes = Math.round(baseline * factor * weekendMult);

  let level: CongestionLevel = 'low';
  if (minutes >= 25) level = 'high';
  else if (minutes >= 10) level = 'medium';

  return { minutes, level };
}
