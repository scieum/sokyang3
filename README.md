# TOT — Travel of Traveler

속초·고성·양양을 3D로 미리 **'소유(Experience 3D)'**하게 만드는 관광 특화 웹앱.
여행자의 이동 궤적을 3D 지형 위에 시각화하는 *"Track of Traveler"* 인터페이스.

> 프로젝트 전체 컨텍스트(기술 스택·아키텍처·로드맵)는 [`CLAUDE.md`](./CLAUDE.md) 참조.

## 기술 스택

- **React 18 + TypeScript + Vite**
- **CesiumJS + Google Photorealistic 3D Tiles** (3D 지도/지형)
- **Zustand** (전역 상태), **TanStack Query** (데이터 패칭)
- **react-i18next** (8개 언어: ko/en/zh/ja/ar/fr/de/it, 아랍어 RTL)
- **SunCalc** (그림자/일조 분석), **HTML5 Geolocation** (트래킹)

## MVP 기능 (초안)

| 기능 | 위치 |
|------|------|
| ① 3D 지도 + 랜드마크 마커 | `src/features/map3d/` |
| ② 실시간 위치 트래킹 궤적 | `src/features/tracking/` |
| ③ 그림자/일조 분석 엔진 | `src/features/sun-analysis/` |
| ④ 관광/상권 정보 패널 | `src/features/poi/` |

## 시작하기

```bash
npm install
cp .env.example .env.local   # API 키 입력 (키 없이도 기본 지형으로 구동)
npm run dev                  # http://localhost:5173
```

### 환경변수

`.env.local`에 발급받은 키를 입력합니다 (`.env.example` 템플릿 참고).
키가 없어도 앱은 기본 Cesium 지형으로 동작하며, 다음 키 입력 시 기능이 활성화됩니다.

- `VITE_CESIUM_ION_TOKEN` — Cesium ion 지형/자산
- `VITE_GOOGLE_MAPS_API_KEY` — Google Photorealistic 3D Tiles
- `VITE_VWORLD_API_KEY` / `VITE_KAKAO_MAP_KEY` / `VITE_NAVER_MAP_CLIENT_ID` / `VITE_DATA_GO_KR_KEY`

## 스크립트

```bash
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드 (tsc + vite)
npm run preview   # 빌드 미리보기
npm run lint      # ESLint
npm run format    # Prettier
```
