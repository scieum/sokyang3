/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CESIUM_ION_TOKEN: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_VWORLD_API_KEY: string;
  readonly VITE_KAKAO_MAP_KEY: string;
  readonly VITE_NAVER_MAP_CLIENT_ID: string;
  readonly VITE_DATA_GO_KR_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
