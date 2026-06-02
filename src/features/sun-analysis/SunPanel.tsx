import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import { getSunInfo } from './sun';
import { SOKCHO_ANCHOR } from '@/lib/constants';

/** ③ 그림자/일조 분석 패널 — 시각 슬라이더 + shadows 토글 + 태양 정보 */
export function SunPanel() {
  const { t } = useTranslation();
  const analysisDate = useAppStore((s) => s.analysisDate);
  const setAnalysisDate = useAppStore((s) => s.setAnalysisDate);
  const shadows = useAppStore((s) => s.layers.shadows);
  const toggleLayer = useAppStore((s) => s.toggleLayer);

  // 0~1439분(하루)을 슬라이더로 제어
  const minutesOfDay = analysisDate.getHours() * 60 + analysisDate.getMinutes();

  const onSlide = (minutes: number) => {
    const next = new Date(analysisDate);
    next.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    setAnalysisDate(next);
  };

  const sun = getSunInfo(analysisDate, SOKCHO_ANCHOR);
  const hh = String(analysisDate.getHours()).padStart(2, '0');
  const mm = String(analysisDate.getMinutes()).padStart(2, '0');

  return (
    <section className="panel-block">
      <h2 className="panel-title">{t('sun.title')}</h2>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={shadows}
          onChange={() => toggleLayer('shadows')}
        />
        {t('panel.shadows')}
      </label>
      <div className="slider-row">
        <span className="metric">
          {t('sun.time')}: {hh}:{mm}
        </span>
        <input
          type="range"
          min={0}
          max={1439}
          value={minutesOfDay}
          onChange={(e) => onSlide(Number(e.target.value))}
        />
      </div>
      <p className="metric">
        ☀︎ {sun.altitude.toFixed(1)}° / {sun.azimuth.toFixed(0)}°
      </p>
    </section>
  );
}
