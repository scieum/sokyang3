import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 프로젝트 사이트는 /<repo>/ 하위 경로에서 서빙된다.
  // 상대 base('./')를 쓰면 에셋과 Cesium 정적 파일이 dist 루트에 올바르게 복사되고,
  // GitHub Pages 가 끝 슬래시 없는 URL(/sokyang3)을 /sokyang3/ 로 자동 리다이렉트하므로
  // 상대 경로로도 정상 동작한다. (절대 base 는 vite-plugin-cesium 의 복사 경로를 깨뜨림)
  base: './',
  plugins: [react(), cesium()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});
