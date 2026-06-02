import { useTranslation } from 'react-i18next';
import { CesiumMap } from '@/features/map3d/CesiumMap';
import { TrackingPanel } from '@/features/tracking/TrackingPanel';
import { SunPanel } from '@/features/sun-analysis/SunPanel';
import { PoiPanel } from '@/features/poi/PoiPanel';
import { LayersPanel } from '@/components/LayersPanel';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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
        <CesiumMap />

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
