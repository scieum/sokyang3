/** 지리 좌표 (위도/경도/고도) */
export interface GeoPosition {
  longitude: number;
  latitude: number;
  height?: number;
}

/** 관광/상권 POI */
export interface Poi {
  id: string;
  /** i18n 키 또는 표시 이름 */
  nameKey: string;
  category: 'landmark' | 'market' | 'hotel' | 'restaurant' | 'culture' | 'nature';
  position: GeoPosition;
  /** B2B 예약/광고 링크 (선택) */
  link?: string;
}

/** 트래킹 한 지점 (좌표 + 타임스탬프) */
export interface TrackPoint {
  position: GeoPosition;
  timestamp: number;
}

/** 지원 언어 코드 */
export type LanguageCode = 'ko' | 'en' | 'zh' | 'ja' | 'ar' | 'fr' | 'de' | 'it';
