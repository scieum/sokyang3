/** 위경도 경계 박스 (남, 서, 북, 동) */
export interface BBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

/** 실제 건물 1동: 외곽선 좌표(경도,위도 평탄 배열) + 높이(m) */
export interface OsmBuilding {
  /** [lon, lat, lon, lat, ...] */
  coords: number[];
  height: number;
}

/** OSM 태그에서 실제 높이(m) 추정: height → building:levels×3.3 → 기본값 */
function estimateHeight(tags: Record<string, string> | undefined): number {
  if (!tags) return 7;
  if (tags.height) {
    const h = parseFloat(tags.height);
    if (!Number.isNaN(h) && h > 0) return h;
  }
  const levels = tags['building:levels'];
  if (levels) {
    const n = parseFloat(levels);
    if (!Number.isNaN(n) && n > 0) return n * 3.3;
  }
  return 7; // 정보 없으면 2층 규모로 가정
}

/**
 * Overpass API 로 해당 영역의 실제 건물 footprint 를 가져온다.
 * 키가 필요 없고 CORS 를 지원한다. 실패 시 빈 배열을 반환한다.
 */
export async function fetchOsmBuildings(
  bbox: BBox,
  maxCount = 1200,
): Promise<OsmBuilding[]> {
  const { south, west, north, east } = bbox;
  const query = `[out:json][timeout:25];(way["building"](${south},${west},${north},${east}););out geom;`;

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (!res.ok) continue;
      const json = await res.json();
      const buildings: OsmBuilding[] = [];

      for (const el of json.elements ?? []) {
        if (el.type !== 'way' || !Array.isArray(el.geometry)) continue;
        const coords: number[] = [];
        for (const pt of el.geometry) coords.push(pt.lon, pt.lat);
        if (coords.length < 8) continue; // 최소 4점(폴리곤)
        buildings.push({ coords, height: estimateHeight(el.tags) });
        if (buildings.length >= maxCount) break;
      }
      return buildings;
    } catch (err) {
      console.warn('[TOT] Overpass 건물 로드 실패:', url, err);
    }
  }
  return [];
}
