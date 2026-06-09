import { create } from 'zustand';
import type { Poi, TrackPoint } from '@/types';
import { totalDistance } from '@/lib/geo';

/** 레이어 토글 상태 */
export interface LayerToggles {
  pois: boolean;
  buildings: boolean;
  track: boolean;
  shadows: boolean;
}

interface AppState {
  /** 선택된 POI (정보 패널 표시용) */
  selectedPoi: Poi | null;
  setSelectedPoi: (poi: Poi | null) => void;

  /** 트래킹 상태 */
  isTracking: boolean;
  trackPoints: TrackPoint[];
  startTracking: () => void;
  stopTracking: () => void;
  addTrackPoint: (point: TrackPoint) => void;
  clearTrack: () => void;
  /** 누적 이동거리(미터) */
  trackedDistance: () => number;

  /** 그림자/일조 분석 — 시뮬레이션 시각 */
  analysisDate: Date;
  setAnalysisDate: (date: Date) => void;

  /** 레이어 토글 */
  layers: LayerToggles;
  toggleLayer: (key: keyof LayerToggles) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedPoi: null,
  setSelectedPoi: (poi) => set({ selectedPoi: poi }),

  isTracking: false,
  trackPoints: [],
  startTracking: () => set({ isTracking: true }),
  stopTracking: () => set({ isTracking: false }),
  addTrackPoint: (point) =>
    set((state) => ({ trackPoints: [...state.trackPoints, point] })),
  clearTrack: () => set({ trackPoints: [] }),
  trackedDistance: () =>
    totalDistance(get().trackPoints.map((p) => p.position)),

  analysisDate: new Date(),
  setAnalysisDate: (date) => set({ analysisDate: date }),

  layers: { pois: true, buildings: true, track: true, shadows: false },
  toggleLayer: (key) =>
    set((state) => ({ layers: { ...state.layers, [key]: !state.layers[key] } })),
}));
