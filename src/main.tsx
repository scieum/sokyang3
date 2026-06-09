import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './i18n';
import './index.css';

/** 부팅 스플래시 제거 (마운트 성공 시) */
function removeSplash(): void {
  document.getElementById('boot-splash')?.remove();
  // 자동 새로고침 가드 해제 (다음 세션에서 다시 자가복구 가능하도록)
  try {
    sessionStorage.removeItem('tot-reloaded');
  } catch {
    /* sessionStorage 사용 불가 환경 무시 */
  }
}

/** 부팅 단계 오류를 스플래시에 표시 */
function showBootError(err: unknown): void {
  const msg = document.getElementById('boot-splash-msg');
  if (msg) {
    msg.textContent =
      'TOT 로딩 오류: ' + (err instanceof Error ? err.message : String(err));
    msg.style.color = '#f87171';
  }
}

try {
  const queryClient = new QueryClient();
  const container = document.getElementById('root');
  if (!container) throw new Error('#root 요소를 찾을 수 없습니다.');

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );

  // 첫 페인트 이후 스플래시 제거 — React 마운트가 실제로 일어났음을 보장.
  // rAF 가 (백그라운드 탭 등) 지연되어도 확실히 제거되도록 타임아웃도 함께 둔다.
  requestAnimationFrame(() => requestAnimationFrame(removeSplash));
  setTimeout(removeSplash, 1500);
} catch (err) {
  showBootError(err);
  throw err;
}
