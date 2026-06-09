import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { TrackingPanel } from '@/features/tracking/TrackingPanel';
import { SunPanel } from '@/features/sun-analysis/SunPanel';
import { PoiPanel } from '@/features/poi/PoiPanel';
import { LayersPanel } from '@/components/LayersPanel';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Cesium(전역 의존)을 별도 청크로 분리해 지연 로드한다.
// 이렇게 하면 메인 번들이 Cesium 평가와 무관하게 먼저 React 를 마운트하므로,
// Cesium 로드/평가에 문제가 있어도 헤더·패널 UI 는 항상 표시된다.
const CesiumMap = lazy(() =>
  import('@/features/map3d/CesiumMap').then((m) => ({ default: m.CesiumMap })),
);

export function App() {
  const { t } = useTranslation();

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-title">{t('app.title')}</span>
          <span className="brand-subtitle">{t('app.subtitle')}</span>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="app-main">
        <ErrorBoundary>
          <Suspense fallback={<div className="cesium-container" />}>
            <CesiumMap />
          </Suspense>
        </ErrorBoundary>

        <div className="control-stack">
          <LayersPanel />
          <TrackingPanel />
          <SunPanel />
        </div>

        <PoiPanel />
      </main>
    </div>
  );
}
