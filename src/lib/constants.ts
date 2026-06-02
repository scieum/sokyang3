import type { LanguageCode, Poi } from '@/types';

/** 속초 시내 앵커 좌표 (대략 중심부) */
export const SOKCHO_ANCHOR = {
  longitude: 128.5918,
  latitude: 38.207,
  height: 1500,
} as const;

/**
 * 주요 랜드마크/POI 초기 시드 데이터.
 * 실제 운영정보는 추후 공공데이터/Kakao/Naver API로 보강한다.
 */
export const SEED_POIS: Poi[] = [
  {
    id: 'sokcho-eye',
    nameKey: 'poi.sokchoEye',
    category: 'landmark',
    position: { longitude: 128.5949, latitude: 38.2086 },
  },
  {
    id: 'sokcho-market',
    nameKey: 'poi.sokchoMarket',
    category: 'market',
    position: { longitude: 128.5925, latitude: 38.2045 },
  },
  {
    id: 'cassia-sokcho',
    nameKey: 'poi.cassiaSokcho',
    category: 'hotel',
    position: { longitude: 128.5972, latitude: 38.1956 },
  },
  {
    id: 'seoraksan',
    nameKey: 'poi.seoraksan',
    category: 'nature',
    position: { longitude: 128.4655, latitude: 38.1192 },
  },
  {
    id: 'sinheungsa',
    nameKey: 'poi.sinheungsa',
    category: 'culture',
    position: { longitude: 128.4675, latitude: 38.1685 },
  },
];

/** 언어 코드 → 표시 라벨 (네이티브 표기) */
export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ar: 'العربية',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
};

/** RTL(우→좌) 표기 언어 */
export const RTL_LANGUAGES: LanguageCode[] = ['ar'];
