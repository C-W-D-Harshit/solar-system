import { create } from "zustand";
import type { CelestialBody } from "../types";

/** Camera control mode - orbit follows targets, free allows WASD movement */
type CameraMode = "orbit" | "free";

interface AppState {
  selectedBody: CelestialBody | null;
  timeScale: number;
  isPlaying: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  showAsteroids: boolean;
  cameraMode: CameraMode;

  selectBody: (body: CelestialBody | null) => void;
  setTimeScale: (scale: number) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  toggleOrbits: () => void;
  toggleLabels: () => void;
  toggleAsteroids: () => void;
  setCameraMode: (mode: CameraMode) => void;
  toggleCameraMode: () => void;
}

export const useStore = create<AppState>((set) => ({
  selectedBody: null,
  timeScale: 1,
  isPlaying: true,
  showOrbits: true,
  showLabels: true,
  showAsteroids: true,
  cameraMode: "orbit",

  selectBody: (body) => set({ selectedBody: body }),
  setTimeScale: (scale) => set({ timeScale: scale }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  toggleAsteroids: () =>
    set((state) => ({ showAsteroids: !state.showAsteroids })),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleCameraMode: () =>
    set((state) => ({
      cameraMode: state.cameraMode === "orbit" ? "free" : "orbit",
    })),
}));
