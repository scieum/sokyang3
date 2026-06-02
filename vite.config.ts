import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 프로젝트 사이트는 /<repo>/ 하위 경로에서 서빙되므로
  // 상대 경로 base 를 사용해 어떤 경로에 배포돼도 에셋이 정상 로드되도록 한다.
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
