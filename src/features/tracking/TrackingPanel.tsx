import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import { useTracking } from './useTracking';

/** ② 활동 트래킹 제어 패널 — 시작/정지/지우기 + 누적 거리 표시 */
export function TrackingPanel() {
  const { t } = useTranslation();
  const { error } = useTracking();

  const isTracking = useAppStore((s) => s.isTracking);
  const startTracking = useAppStore((s) => s.startTracking);
  const stopTracking = useAppStore((s) => s.stopTracking);
  const clearTrack = useAppStore((s) => s.clearTrack);
  const trackPoints = useAppStore((s) => s.trackPoints);
  const trackedDistance = useAppStore((s) => s.trackedDistance);

  const distanceKm = (trackedDistance() / 1000).toFixed(2);

  return (
    <section className="panel-block">
      <h2 className="panel-title">{t('tracking.title')}</h2>
      <div className="btn-row">
        {isTracking ? (
          <button className="btn btn-danger" onClick={stopTracking}>
            {t('tracking.stop')}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={startTracking}>
            {t('tracking.start')}
          </button>
        )}
        <button
          className="btn"
          onClick={clearTrack}
          disabled={trackPoints.length === 0}
        >
          {t('tracking.clear')}
        </button>
      </div>
      <p className="metric">
        {t('tracking.distance')}: <strong>{distanceKm} km</strong>
      </p>
      {error === 'denied' && <p className="error">{t('tracking.denied')}</p>}
    </section>
  );
}
