/** 지리 좌표 (위도/경도/고도) */
export interface GeoPosition {
  longitude: number;
  latitude: number;
  height?: number;
}

/** 재고/예약 가능 상태 */
export type AvailabilityStatus = 'inStock' | 'low' | 'soldOut';

/** 메뉴 항목 */
export interface MenuItem {
  /** 표시 이름 (현지 콘텐츠) */
  name: string;
  /** 가격 (KRW) */
  price: number;
}

/** 이동 소요 시간 (분) — 기준점(속초 앵커)에서의 추정치 */
export interface TravelTimes {
  walk?: number;
  car?: number;
  transit?: number;
}

/**
 * POI 상세 정보.
 * 현재는 샘플 데이터이며, 추후 Kakao/Naver/공공데이터 API(TanStack Query)로 대체한다.
 */
export interface PoiDetails {
  /** 소개 문구 */
  description?: string;
  /** 운영시간 문자열 (예: "매일 10:00–21:00") */
  hours?: string;
  address?: string;
  phone?: string;
  /** 평점 (0–5) */
  rating?: number;
  /** 리뷰 수 */
  reviewCount?: number;
  /** 가격대 표기 (예: "₩₩") */
  priceRange?: string;
  menu?: MenuItem[];
  travel?: TravelTimes;
  availability?: AvailabilityStatus;
  /**
   * 피크 시간대 기준 평균 대기 시간(분).
   * 이 값이 있으면 현재 시각·요일을 반영해 예상 웨이팅을 산출한다.
   * 대기 개념이 없는 장소(자연·사찰 등)는 생략한다.
   */
  waitBaseline?: number;
  /** 인테리어/외관 사진 URL 목록 */
  photos?: string[];
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
  /** 상세 정보 (운영시간·메뉴·평점·이동시간·재고·사진 등) */
  details?: PoiDetails;
}

/** 트래킹 한 지점 (좌표 + 타임스탬프) */
export interface TrackPoint {
  position: GeoPosition;
  timestamp: number;
}

/** 지원 언어 코드 */
export type LanguageCode = 'ko' | 'en' | 'zh' | 'ja' | 'ar' | 'fr' | 'de' | 'it';
