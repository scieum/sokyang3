import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';

/**
 * ④ POI 정보 패널 — 선택된 마커의 운영정보/예약 링크 표시.
 * 운영정보·리뷰는 추후 공공데이터/Kakao/Naver API(TanStack Query)로 보강한다.
 */
export function PoiPanel() {
  const { t } = useTranslation();
  const poi = useAppStore((s) => s.selectedPoi);
  const setSelectedPoi = useAppStore((s) => s.setSelectedPoi);

  if (!poi) return null;

  return (
    <aside className="poi-panel">
      <button
        className="poi-close"
        aria-label={t('poi.panel.close')}
        onClick={() => setSelectedPoi(null)}
      >
        ×
      </button>
      <h2 className="poi-name">{t(poi.nameKey)}</h2>
      <p className="poi-meta">
        {t('poi.panel.category')}: {t(`category.${poi.category}`)}
      </p>
      {poi.link && (
        <a className="btn btn-primary" href={poi.link} target="_blank" rel="noreferrer">
          {t('poi.panel.book')}
        </a>
      )}
    </aside>
  );
}
