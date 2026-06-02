import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import type { LayerToggles } from '@/store';

const LAYER_KEYS: (keyof LayerToggles)[] = ['pois', 'track'];

/** 레이어 토글 패널 (관광 명소 / 이동 궤적). 그림자는 SunPanel 에서 제어. */
export function LayersPanel() {
  const { t } = useTranslation();
  const layers = useAppStore((s) => s.layers);
  const toggleLayer = useAppStore((s) => s.toggleLayer);

  return (
    <section className="panel-block">
      <h2 className="panel-title">{t('panel.layers')}</h2>
      {LAYER_KEYS.map((key) => (
        <label key={key} className="checkbox-row">
          <input
            type="checkbox"
            checked={layers[key]}
            onChange={() => toggleLayer(key)}
          />
          {t(`panel.${key}`)}
        </label>
      ))}
    </section>
  );
}
