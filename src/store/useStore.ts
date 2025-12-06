import { create } from "zustand";
import type { CelestialBody } from "../types";

/** Camera control mode - orbit follows targets, free allows WASD movement */
type CameraMode = "orbit" | "free";

interface AppState {
  /** Currently selected celestial body for info panel */
  selectedBody: CelestialBody | null;
  /** Simulation time scale multiplier */
  timeScale: number;
  /** Whether the simulation is running */
  isPlaying: boolean;
  /** Show orbit path lines */
  showOrbits: boolean;
  /** Show planet name labels */
  showLabels: boolean;
  /** Show asteroid belt */
  showAsteroids: boolean;
  /** Camera control mode (orbit or free) */
  cameraMode: CameraMode;
  /** Mobile: Whether the control panel is expanded */
  isControlsExpanded: boolean;

  selectBody: (body: CelestialBody | null) => void;
  setTimeScale: (scale: number) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  toggleOrbits: () => void;
  toggleLabels: () => void;
  toggleAsteroids: () => void;
  setCameraMode: (mode: CameraMode) => void;
  toggleCameraMode: () => void;
  toggleControlsExpanded: () => void;
  setControlsExpanded: (expanded: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedBody: null,
  timeScale: 1,
  isPlaying: true,
  showOrbits: true,
  showLabels: true,
  showAsteroids: true,
  cameraMode: "orbit",
  isControlsExpanded: false,

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
  toggleControlsExpanded: () =>
    set((state) => ({ isControlsExpanded: !state.isControlsExpanded })),
  setControlsExpanded: (expanded) => set({ isControlsExpanded: expanded }),
}));
