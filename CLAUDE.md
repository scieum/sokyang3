# CLAUDE.md — TOT (Travel of Traveler)

> 이 문서는 Claude Code가 본 저장소에서 작업할 때 항상 참조하는 프로젝트 컨텍스트입니다.
> 기술 스택·아키텍처·컨벤션·로드맵을 일관되게 유지하기 위한 단일 기준 문서(Single Source of Truth)입니다.

---

## 1. 프로젝트 개요 (Project Overview)

- **제품명:** TOT (Travel of Traveler)
- **인터페이스 컨셉:** "Track of Traveler" — 여행자의 이동 궤적을 3D 지형 위에 시각화
- **한 줄 정의:** 속초·고성·양양을 3D로 미리 **'소유(Experience 3D)'**하게 만드는 관광 특화 웹앱
- **공간 범위:** 속초 시내(동명동·조양동 등 고밀도 구역)를 앵커로 설정하고, 고성·양양의 주요 관광 포인트를 연결
- **핵심 차별점:**
  - **데이터의 입체적 시각화** — 단순 위치 표시를 넘어선 디지털 트윈
  - **활동 트래킹** — 사용자가 걸어온 길을 3D 궤적으로 가시화
  - **스마트 분석** — 시간대별 그림자/일조 시뮬레이션, 상권 혼잡도

---

## 2. 기술 스택 (Tech Stack)

| 구분 | 선택 | 비고 |
|------|------|------|
| 언어/빌드 | **TypeScript + Vite** | strict 모드 |
| UI 프레임워크 | **React 18** | 함수형 컴포넌트 + Hooks |
| 3D/지도 엔진 | **CesiumJS** | 지구 좌표계·지형·타일링 |
| 3D 타일 데이터 | **Google Photorealistic 3D Tiles** | 광역 관광 벨트 시각화 |
| 3D 보조 렌더링 | Three.js / WebGL | 랜드마크 커스텀 메쉬가 필요할 때만 |
| 상태관리 | **Zustand** | 위치·트랙·레이어 토글 등 경량 전역 상태 |
| 다국어(i18n) | **react-i18next + i18next** | ko/en/zh/ja/ar/fr/de/it |
| 분석 엔진 | **SunCalc** | 태양 고도각/그림자 연산 |
| 위치 | **HTML5 Geolocation API** | 실시간 트래킹 |
| 데이터 패칭 | **TanStack Query** | 공공데이터/Kakao·Naver API 캐싱 |
| 스타일 | **Tailwind CSS** (권장) | 대안: CSS Modules |

---

## 3. 외부 API 및 데이터 소스

> 모든 키는 `.env.local`에 보관하고 **절대 커밋하지 않습니다.** 템플릿은 `.env.example`로 제공합니다.

| API / 데이터 | 용도 | 환경변수 키 | 발급처 |
|--------------|------|-------------|--------|
| V-World 3D API | 속초·주변 3D 수치지형도·건물 모델링 | `VITE_VWORLD_API_KEY` | 국가공간정보포털 |
| Google Maps Platform (3D Tiles) | 광역 고해상도 사실적 3D 타일 | `VITE_GOOGLE_MAPS_API_KEY` | Google Cloud |
| Cesium ion | Cesium 자산·지형·토큰 | `VITE_CESIUM_ION_TOKEN` | Cesium ion |
| Kakao Maps API | POI·상권·리뷰·예약 연동 | `VITE_KAKAO_MAP_KEY` | Kakao Developers |
| Naver Maps API | POI·지도 보조 | `VITE_NAVER_MAP_CLIENT_ID` | Naver Cloud Platform |
| 공공데이터포털 관광 API | 관광지 운영정보·문화재 정보 | `VITE_DATA_GO_KR_KEY` | 공공데이터포털 |

추가 데이터: 라이다(LiDAR)·정밀 수치지도(디지털 트윈용)는 공공데이터 포털을 통해 별도 확보.

---

## 4. 디렉토리 구조 (제안)

```
src/
  components/        # 재사용 UI (마커, 패널, 언어 스위처 등)
  features/
    map3d/           # Cesium viewer 초기화, 3D Tiles 로딩
    tracking/        # Geolocation 트래킹·궤적 렌더링
    sun-analysis/    # SunCalc 그림자/일조 시뮬레이션
    poi/             # 관광/상권 정보 연동·마커
  i18n/              # i18next 설정 + locales/{ko,en,zh,ja,ar,fr,de,it}.json
  store/             # Zustand 스토어
  lib/               # API 클라이언트, 좌표 변환 유틸
  types/             # 공용 타입
  App.tsx
  main.tsx
public/
.env.example
```

---

## 5. 핵심 기능 명세 (MVP 4종)

### ① 3D 지도 + 랜드마크 표시
- **목적:** 속초 시내 3D 지형 위에 주요 랜드마크/POI 마커·메쉬 표시
- **라이브러리:** Cesium Viewer + Google 3D Tiles
- **담당:** `features/map3d/`
- **구현 포인트:** 카시아 속초, 속초디오션자이, 속초아이 등 대형 건축물/명소를 3D 메쉬 또는 마커로 배치. 신흥사·박물관 등 넓은 부지는 '캠퍼스 모델'로 입체화.
- **주의:** 3D Tiles 로딩 비용이 크므로 카메라 범위 기반 LOD/컬링 고려.

### ② 실시간 위치 트래킹 궤적
- **목적:** 사용자 이동 경로를 3D 지형 위 궤적으로 가시화하고 이동거리 산출
- **라이브러리:** Geolocation `watchPosition` → Cesium `Cartesian3` 변환 → `PolylineGraphics`
- **담당:** `features/tracking/`
- **구현 포인트:** 좌표 누적 → 폴리라인 갱신, 누적 거리 계산.
- **주의:** 권한 거부/저정밀 상황 처리, 백그라운드 배터리 영향 고려.

### ③ 그림자/일조 분석 엔진
- **목적:** 시간대별 그림자 길이·일조 차폐 구역 시뮬레이션 ('스마트 분석 엔진')
- **라이브러리:** SunCalc(태양 위치) + Cesium `shadows`/조명 시스템
- **담당:** `features/sun-analysis/`
- **구현 포인트:** 날짜·시각 슬라이더 → 태양 고도/방위각 연산 → Cesium 광원 갱신.

### ④ 관광/상권 정보 연동
- **목적:** 관광지 운영정보·POI·리뷰·상권 혼잡도 연동
- **라이브러리:** TanStack Query + 공공데이터/Kakao/Naver API
- **담당:** `features/poi/`
- **구현 포인트:** POI 마커 클릭 → 운영정보 패널. B2B(호텔·식당) 마커는 예약/광고 링크 연결.

---

## 6. 다국어(i18n) 정책

- **지원 언어:** 한국어(ko), 영어(en), 중국어 간체(zh), 일본어(ja), 아랍어(ar), 프랑스어(fr), 독일어(de), 이탈리아어(it)
- **라이브러리:** `react-i18next` + `i18next`
- **locale 파일:** `src/i18n/locales/<lang>.json`, 키 네이밍은 `영역.화면.요소` 형태 (예: `map.panel.title`)
- **아랍어 RTL:** 언어 전환 시 `<html dir="rtl">` 동적 토글, 레이아웃 미러링 주의(아이콘 방향·패딩 등)
- **언어 스위처:** 헤더에 상시 노출. 선택값은 `localStorage`에 영속화하여 재방문 시 유지.

---

## 7. 코딩 컨벤션

- TypeScript **strict** 모드 사용
- 함수형 컴포넌트 + Hooks, **named export** 우선
- 네이밍: 컴포넌트 파일/폴더는 `PascalCase`, 그 외 `camelCase`
- ESLint + Prettier 적용 (저장 시 포맷)
- 커밋 메시지는 명확·서술형 (한국어 허용)

---

## 8. 개발 / 실행 명령어

```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 (Vite, 기본 http://localhost:5173)
npm run build      # 프로덕션 빌드
npm run preview    # 빌드 결과 미리보기
npm run lint       # ESLint 검사
npm run format     # Prettier 포맷
```

> 참고: 위 스크립트는 프로젝트 스캐폴딩(`package.json`) 생성 후 활성화됩니다.

---

## 9. 작업 브랜치 규칙

- **개발 브랜치:** `claude/busy-hypatia-RakaA`
- **푸시:** `git push -u origin claude/busy-hypatia-RakaA`
- **PR:** 사용자가 명시적으로 요청할 때만 생성
- 지정 브랜치 외 다른 브랜치로의 푸시 금지

---

## 10. 로드맵 (16주, 4단계)

| 단계 | 기간 | 핵심 작업 |
|------|------|-----------|
| **Step 1** 기획·데이터 설계 | 1~4주 | 공간 범위 확정(속초 앵커 + 고성·양양 레이어), UX/UI 프로토타이핑('Track of Traveler' 인터페이스) |
| **Step 2** 3D 환경 구축 | 5~8주 | 랜드마크 모델링(카시아 속초·속초아이 등), 캠퍼스 모델(신흥사·박물관) 구현 |
| **Step 3** 핵심 기능 개발 | 9~12주 | 활동 트래킹 엔진, 그림자 시뮬레이션·상권 혼잡도 분석 |
| **Step 4** 비즈니스 연동·최적화 | 13~16주 | B2B 파트너십(호텔·식당 예약/광고), WebGL 경량화·모바일 브라우저 최적화 |

---

## 참고 (Notes)

- **현재 상태:** 저장소는 초기화 단계이며, 본 CLAUDE.md 작성이 첫 산출물입니다.
- **다음 단계:** 사용자 승인 시 Vite + React + TypeScript 프로젝트 스캐폴딩 및 Cesium 초기화부터 진행합니다.
- 이 문서는 의사결정이 바뀔 때마다 갱신합니다.
