import { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { SOKCHO_ANCHOR } from '@/lib/constants';

const ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN;
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Cesium Viewer 를 컨테이너에 1회 초기화하고 인스턴스를 반환한다.
 * - Cesium ion 토큰이 있으면 설정한다.
 * - Google Photorealistic 3D Tiles 키가 있으면 광역 3D 타일을 로드한다.
 * - 카메라는 속초 앵커로 초기 이동한다.
 */
export function useCesiumViewer(containerRef: React.RefObject<HTMLDivElement>) {
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    if (ION_TOKEN) {
      Cesium.Ion.defaultAccessToken = ION_TOKEN;
    }

    const instance = new Cesium.Viewer(containerRef.current, {
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
        .then((tileset) => instance.scene.primitives.add(tileset))
        .catch((err) =>
          console.warn('[TOT] Google 3D Tiles 로드 실패:', err),
        );
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

    return () => {
      instance.destroy();
      viewerRef.current = null;
      setViewer(null);
    };
  }, [containerRef]);

  return viewer;
}
