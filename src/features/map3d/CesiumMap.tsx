import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { useTranslation } from 'react-i18next';
import { useCesiumViewer } from './useCesiumViewer';
import { useAppStore } from '@/store';
import { SEED_POIS } from '@/lib/constants';
import type { Poi } from '@/types';

/** 카테고리별 3D 건물(입체) 형상: 높이(m)·반경(m)·색상. 자연(산)은 건물 없음. */
const BUILDING: Record<
  Poi['category'],
  { height: number; radius: number; color: string } | null
> = {
  landmark: { height: 70, radius: 14, color: '#22d3ee' },
  hotel: { height: 90, radius: 26, color: '#818cf8' },
  restaurant: { height: 16, radius: 16, color: '#fb923c' },
  market: { height: 14, radius: 30, color: '#f472b6' },
  culture: { height: 22, radius: 24, color: '#a3e635' },
  nature: null,
};

/**
 * 3D 지도 본체.
 * - POI 마커(① 랜드마크 표시), 클릭 시 정보 패널 연동(④)
 * - 트래킹 궤적 폴리라인(②)
 * - 그림자/일조 분석 시각·shadows 토글(③)
 */
export function CesiumMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { viewer, error } = useCesiumViewer(containerRef);
  const { t } = useTranslation();

  const setSelectedPoi = useAppStore((s) => s.setSelectedPoi);
  const trackPoints = useAppStore((s) => s.trackPoints);
  const layers = useAppStore((s) => s.layers);
  const analysisDate = useAppStore((s) => s.analysisDate);

  // ① POI 마커 배치 + 클릭 핸들러
  useEffect(() => {
    if (!viewer) return;

    const entities: Cesium.Entity[] = [];

    SEED_POIS.forEach((poi) => {
      // 마커(점 + 라벨)
      entities.push(
        viewer.entities.add({
          id: `poi-${poi.id}`,
          position: Cesium.Cartesian3.fromDegrees(
            poi.position.longitude,
            poi.position.latitude,
            poi.position.height ?? 0,
          ),
          point: {
            pixelSize: 12,
            color: Cesium.Color.fromCssColorString('#2dd4bf'),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: t(poi.nameKey),
            font: '14px sans-serif',
            pixelOffset: new Cesium.Cartesian2(0, -20),
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString('#0f172aCC'),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        }),
      );

      // 3D 입체 건물 (자연 카테고리는 제외)
      const b = BUILDING[poi.category];
      if (b) {
        entities.push(
          viewer.entities.add({
            id: `bldg-${poi.id}`,
            position: Cesium.Cartesian3.fromDegrees(
              poi.position.longitude,
              poi.position.latitude,
            ),
            ellipse: {
              semiMinorAxis: b.radius,
              semiMajorAxis: b.radius,
              height: 0,
              extrudedHeight: b.height,
              material: Cesium.Color.fromCssColorString(b.color).withAlpha(0.9),
              outline: true,
              outlineColor: Cesium.Color.WHITE.withAlpha(0.35),
            },
          }),
        );
      }
    });

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      const picked = viewer.scene.pick(movement.position);
      if (Cesium.defined(picked) && typeof picked.id?.id === 'string') {
        const id: string = picked.id.id.replace(/^(poi|bldg)-/, '');
        const poi: Poi | undefined = SEED_POIS.find((p) => p.id === id);
        if (poi) setSelectedPoi(poi);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      entities.forEach((e) => viewer.entities.remove(e));
      handler.destroy();
    };
  }, [viewer, t, setSelectedPoi]);

  // POI 레이어 토글
  useEffect(() => {
    if (!viewer) return;
    SEED_POIS.forEach((poi) => {
      const marker = viewer.entities.getById(`poi-${poi.id}`);
      if (marker) marker.show = layers.pois;
      const bldg = viewer.entities.getById(`bldg-${poi.id}`);
      if (bldg) bldg.show = layers.pois;
    });
  }, [viewer, layers.pois]);

  // ② 트래킹 궤적 폴리라인
  useEffect(() => {
    if (!viewer) return;
    const ID = 'track-polyline';
    viewer.entities.removeById(ID);

    if (layers.track && trackPoints.length >= 2) {
      viewer.entities.add({
        id: ID,
        polyline: {
          positions: trackPoints.map((p) =>
            Cesium.Cartesian3.fromDegrees(
              p.position.longitude,
              p.position.latitude,
              p.position.height ?? 0,
            ),
          ),
          width: 5,
          material: Cesium.Color.fromCssColorString('#f97316'),
          clampToGround: true,
        },
      });
    }
  }, [viewer, trackPoints, layers.track]);

  // ③ 그림자/일조 분석 — 시각 반영 + shadows 토글
  useEffect(() => {
    if (!viewer) return;
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(analysisDate);
    viewer.shadows = layers.shadows;
    viewer.scene.globe.enableLighting = layers.shadows;
  }, [viewer, analysisDate, layers.shadows]);

  return (
    <>
      <div ref={containerRef} className="cesium-container" />
      {error && (
        <div className="map-error">
          <p>⚠️ 3D 지도를 불러오지 못했습니다.</p>
          <code>{error}</code>
        </div>
      )}
    </>
  );
}
