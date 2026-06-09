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
    details: {
      description: '청초호 변에 위치한 대관람차. 속초 야경 명소로 인기.',
      hours: '매일 11:00–22:00',
      address: '강원특별자치도 속초시 청호해안길 2',
      phone: '033-637-3949',
      rating: 4.3,
      reviewCount: 1840,
      priceRange: '₩',
      travel: { walk: 22, car: 6, transit: 14 },
      availability: 'inStock',
      photos: [
        'https://picsum.photos/seed/sokcho-eye-1/640/360',
        'https://picsum.photos/seed/sokcho-eye-2/640/360',
      ],
    },
  },
  {
    id: 'sokcho-market',
    nameKey: 'poi.sokchoMarket',
    category: 'market',
    position: { longitude: 128.5925, latitude: 38.2045 },
    details: {
      description: '속초의 대표 전통시장. 닭강정·오징어순대 등 먹거리로 유명.',
      hours: '매일 08:00–21:00 (점포별 상이)',
      address: '강원특별자치도 속초시 중앙로147번길 16',
      phone: '033-633-3501',
      rating: 4.5,
      reviewCount: 5210,
      priceRange: '₩₩',
      travel: { walk: 18, car: 5, transit: 11 },
      availability: 'inStock',
      photos: [
        'https://picsum.photos/seed/sokcho-market-1/640/360',
        'https://picsum.photos/seed/sokcho-market-2/640/360',
      ],
    },
  },
  {
    id: 'bongpo-meoguri',
    nameKey: 'poi.bongpoMeoguri',
    category: 'restaurant',
    position: { longitude: 128.5961, latitude: 38.2247 },
    link: 'https://map.naver.com/',
    details: {
      description: '봉포항 인근의 물회·생선구이 전문점. 신선한 해산물로 현지인에게도 인기.',
      hours: '매일 09:00–21:00 (브레이크타임 15:30–16:30)',
      address: '강원특별자치도 속초시 영랑해안길 223',
      phone: '033-631-2021',
      rating: 4.6,
      reviewCount: 3120,
      priceRange: '₩₩',
      menu: [
        { name: '모둠물회', price: 18000 },
        { name: '성게비빔밥', price: 16000 },
        { name: '생선구이정식', price: 15000 },
        { name: '대게라면', price: 9000 },
      ],
      travel: { walk: 41, car: 9, transit: 23 },
      availability: 'low',
      photos: [
        'https://picsum.photos/seed/bongpo-1/640/360',
        'https://picsum.photos/seed/bongpo-2/640/360',
        'https://picsum.photos/seed/bongpo-3/640/360',
      ],
    },
  },
  {
    id: 'cassia-sokcho',
    nameKey: 'poi.cassiaSokcho',
    category: 'hotel',
    position: { longitude: 128.5972, latitude: 38.1956 },
    link: 'https://www.kensington.co.kr/',
    details: {
      description: '속초 해변에 인접한 레지던스형 호텔. 객실에서 동해 전망 조망 가능.',
      hours: '체크인 15:00 / 체크아웃 11:00',
      address: '강원특별자치도 속초시 대포항길 186',
      phone: '033-630-7700',
      rating: 4.4,
      reviewCount: 2780,
      priceRange: '₩₩₩',
      travel: { walk: 35, car: 8, transit: 20 },
      availability: 'low',
      photos: [
        'https://picsum.photos/seed/cassia-1/640/360',
        'https://picsum.photos/seed/cassia-2/640/360',
      ],
    },
  },
  {
    id: 'seoraksan',
    nameKey: 'poi.seoraksan',
    category: 'nature',
    position: { longitude: 128.4655, latitude: 38.1192 },
    details: {
      description: '설악산 국립공원. 케이블카·울산바위·비룡폭포 등 명소가 모여 있는 대표 자연 관광지.',
      hours: '연중무휴 (탐방로별 입산통제 상이)',
      address: '강원특별자치도 속초시 설악산로 833',
      phone: '033-801-0900',
      rating: 4.7,
      reviewCount: 9430,
      priceRange: '₩',
      travel: { walk: 180, car: 22, transit: 45 },
      availability: 'inStock',
      photos: [
        'https://picsum.photos/seed/seoraksan-1/640/360',
        'https://picsum.photos/seed/seoraksan-2/640/360',
      ],
    },
  },
  {
    id: 'sinheungsa',
    nameKey: 'poi.sinheungsa',
    category: 'culture',
    position: { longitude: 128.4675, latitude: 38.1685 },
    details: {
      description: '설악산 자락의 천년 고찰. 통일대불(청동좌불)로 유명.',
      hours: '매일 05:00–19:00',
      address: '강원특별자치도 속초시 설악산로 1137',
      phone: '033-636-7044',
      rating: 4.6,
      reviewCount: 2150,
      priceRange: '₩',
      travel: { walk: 165, car: 20, transit: 42 },
      availability: 'inStock',
      photos: [
        'https://picsum.photos/seed/sinheungsa-1/640/360',
        'https://picsum.photos/seed/sinheungsa-2/640/360',
      ],
    },
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
