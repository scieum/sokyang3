import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAppStore } from '@/store';
import type { AvailabilityStatus, TravelTimes } from '@/types';

/** ₩ 가격 포맷 */
const formatPrice = (krw: number) => `₩${krw.toLocaleString('ko-KR')}`;

/** 재고 상태 → 배지 색상 클래스 */
const availabilityClass: Record<AvailabilityStatus, string> = {
  inStock: 'badge-ok',
  low: 'badge-warn',
  soldOut: 'badge-danger',
};

function TravelRow({ travel }: { travel: TravelTimes }) {
  const { t } = useTranslation();
  const items: { key: keyof TravelTimes; icon: string }[] = [
    { key: 'walk', icon: '🚶' },
    { key: 'car', icon: '🚗' },
    { key: 'transit', icon: '🚌' },
  ];
  return (
    <div className="travel-row">
      {items.map(({ key, icon }) =>
        travel[key] != null ? (
          <div key={key} className="travel-item" title={t(`poi.panel.${key}`)}>
            <span className="travel-icon">{icon}</span>
            <span className="travel-min">
              {travel[key]}
              {t('poi.panel.min')}
            </span>
          </div>
        ) : null,
      )}
    </div>
  );
}

/**
 * ④ POI 상세 정보 패널.
 * 클릭한 장소의 소개·운영시간·메뉴/가격·평점·이동시간·재고·사진을 표시한다.
 * 현재 데이터는 샘플이며, 추후 Kakao/Naver/공공데이터 API(TanStack Query)로 대체한다.
 */
export function PoiPanel() {
  const { t } = useTranslation();
  const poi = useAppStore((s) => s.selectedPoi);
  const setSelectedPoi = useAppStore((s) => s.setSelectedPoi);
  const [brokenPhotos, setBrokenPhotos] = useState<Record<number, boolean>>({});

  if (!poi) return null;
  const d = poi.details;

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

      <div className="poi-tags">
        <span className="chip">{t(`category.${poi.category}`)}</span>
        {d?.priceRange && <span className="chip">{d.priceRange}</span>}
        {d?.rating != null && (
          <span className="chip chip-rating">
            ★ {d.rating.toFixed(1)}
            {d.reviewCount != null && (
              <span className="muted"> · {d.reviewCount.toLocaleString()}</span>
            )}
          </span>
        )}
        {d?.availability && (
          <span className={`chip ${availabilityClass[d.availability]}`}>
            {t(`poi.availability.${d.availability}`)}
          </span>
        )}
      </div>

      {!d && <p className="poi-meta">{t('poi.panel.noInfo')}</p>}

      {/* 사진 갤러리 */}
      {d?.photos && d.photos.length > 0 && (
        <div className="poi-gallery">
          {d.photos.map((src, i) =>
            brokenPhotos[i] ? (
              <div key={i} className="poi-photo poi-photo-fallback">
                🖼️
              </div>
            ) : (
              <img
                key={i}
                className="poi-photo"
                src={src}
                alt={`${t(poi.nameKey)} ${i + 1}`}
                loading="lazy"
                onError={() =>
                  setBrokenPhotos((prev) => ({ ...prev, [i]: true }))
                }
              />
            ),
          )}
        </div>
      )}

      {d?.description && <p className="poi-desc">{d.description}</p>}

      {/* 이동 소요 시간 */}
      {d?.travel && (
        <section className="poi-section">
          <h3 className="poi-section-title">{t('poi.panel.travel')}</h3>
          <TravelRow travel={d.travel} />
        </section>
      )}

      {/* 메뉴 / 가격 */}
      {d?.menu && d.menu.length > 0 && (
        <section className="poi-section">
          <h3 className="poi-section-title">{t('poi.panel.menu')}</h3>
          <ul className="menu-list">
            {d.menu.map((item) => (
              <li key={item.name} className="menu-item">
                <span>{item.name}</span>
                <span className="menu-price">{formatPrice(item.price)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 기본 정보 */}
      <dl className="poi-info">
        {d?.hours && (
          <>
            <dt>{t('poi.panel.hours')}</dt>
            <dd>{d.hours}</dd>
          </>
        )}
        {d?.address && (
          <>
            <dt>{t('poi.panel.address')}</dt>
            <dd>{d.address}</dd>
          </>
        )}
        {d?.phone && (
          <>
            <dt>{t('poi.panel.phone')}</dt>
            <dd>
              <a href={`tel:${d.phone}`}>{d.phone}</a>
            </dd>
          </>
        )}
      </dl>

      {poi.link && (
        <a
          className="btn btn-primary poi-book"
          href={poi.link}
          target="_blank"
          rel="noreferrer"
        >
          {t('poi.panel.book')}
        </a>
      )}

      <p className="poi-sample-note">{t('poi.panel.sampleNote')}</p>
    </aside>
  );
}
