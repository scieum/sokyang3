import { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { SOKCHO_ANCHOR } from '@/lib/constants';

const ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN;
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export interface ViewerResult {
  viewer: Cesium.Viewer | null;
  error: string | null;
}

/**
 * Cesium Viewer 를 컨테이너에 1회 초기화하고 인스턴스를 반환한다.
 * - API 키가 전혀 없어도 동작하도록 OpenStreetMap 을 기본 베이스맵으로 사용한다.
 *   (ion 토큰 의존 기본 이미지를 쓰면 키 없이 흰 화면이 되므로 명시적으로 지정)
 * - Cesium ion 토큰이 있으면 설정한다.
 * - Google Photorealistic 3D Tiles 키가 있으면 광역 3D 타일을 로드한다.
 * - 초기화 실패 시 error 를 반환해 흰 화면 대신 안내를 표시할 수 있게 한다.
 */
export function useCesiumViewer(
  containerRef: React.RefObject<HTMLDivElement>,
): ViewerResult {
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    let instance: Cesium.Viewer | null = null;
    try {
      if (ION_TOKEN) {
        Cesium.Ion.defaultAccessToken = ION_TOKEN;
      }

      instance = new Cesium.Viewer(containerRef.current, {
        // 키 없이도 보이는 OSM 베이스맵 (ion 의존 제거)
        baseLayer: Cesium.ImageryLayer.fromProviderAsync(
          Promise.resolve(
            new Cesium.OpenStreetMapImageryProvider({
              url: 'https://tile.openstreetmap.org/',
            }),
          ),
          {},
        ),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        timeline: false,
        animation: false,
        shadows: false,
      });

      // 광역 사실적 3D 타일 (Google) — 키가 있을 때만 로드
      if (GOOGLE_KEY) {
        Cesium.Cesium3DTileset.fromUrl(
          `https://tile.googleapis.com/v1/3dtiles/root.json?key=${GOOGLE_KEY}`,
          { showCreditsOnScreen: true },
        )
          .then((tileset) => instance?.scene.primitives.add(tileset))
          .catch((err) => console.warn('[TOT] Google 3D Tiles 로드 실패:', err));
      }

      // 속초 앵커로 카메라 이동
      instance.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          SOKCHO_ANCHOR.longitude,
          SOKCHO_ANCHOR.latitude,
          SOKCHO_ANCHOR.height,
        ),
        duration: 0,
      });

      viewerRef.current = instance;
      setViewer(instance);
    } catch (err) {
      console.error('[TOT] Cesium Viewer 초기화 실패:', err);
      setError(err instanceof Error ? err.message : String(err));
      instance?.destroy();
    }

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
      setViewer(null);
    };
  }, [containerRef]);

  return { viewer, error };
}
