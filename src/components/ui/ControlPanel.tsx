import {
  Play,
  Pause,
  Orbit,
  Type,
  Hexagon,
  Move3d,
  MousePointer2,
} from "lucide-react";
import { useStore } from "../../store/useStore";

export function ControlPanel() {
  /** Use individual selectors to prevent re-renders from unrelated state changes */
  const isPlaying = useStore((state) => state.isPlaying);
  const togglePlay = useStore((state) => state.togglePlay);
  const timeScale = useStore((state) => state.timeScale);
  const setTimeScale = useStore((state) => state.setTimeScale);
  const showOrbits = useStore((state) => state.showOrbits);
  const toggleOrbits = useStore((state) => state.toggleOrbits);
  const showLabels = useStore((state) => state.showLabels);
  const toggleLabels = useStore((state) => state.toggleLabels);
  const showAsteroids = useStore((state) => state.showAsteroids);
  const toggleAsteroids = useStore((state) => state.toggleAsteroids);
  const cameraMode = useStore((state) => state.cameraMode);
  const toggleCameraMode = useStore((state) => state.toggleCameraMode);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center gap-6 text-white/90 shadow-2xl z-50">
      {/* Playback Controls */}
      <button
        onClick={togglePlay}
        className="hover:text-white hover:scale-110 transition-all"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause size={24} fill="currentColor" />
        ) : (
          <Play size={24} fill="currentColor" />
        )}
      </button>

      {/* Speed Slider */}
      <div className="flex flex-col gap-1 w-32">
        <div className="flex justify-between text-[10px] uppercase tracking-wider text-white/50 font-bold">
          <span>Speed</span>
          <span>{timeScale.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={timeScale}
          onChange={(e) => setTimeScale(parseFloat(e.target.value))}
          className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
        />
      </div>

      <div className="w-px h-8 bg-white/20" />

      {/* Camera Mode Toggle */}
      <button
        onClick={toggleCameraMode}
        className={`transition-all hover:scale-110 flex items-center gap-2 px-3 py-1.5 rounded-full ${
          cameraMode === "free"
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-white/10 text-white/70 border border-white/10"
        }`}
        title={
          cameraMode === "free"
            ? "Switch to Orbit Camera"
            : "Switch to Free Camera (WASD + Mouse)"
        }
      >
        {cameraMode === "free" ? (
          <>
            <Move3d size={18} />
            <span className="text-xs font-medium uppercase tracking-wider">
              Free
            </span>
          </>
        ) : (
          <>
            <MousePointer2 size={18} />
            <span className="text-xs font-medium uppercase tracking-wider">
              Orbit
            </span>
          </>
        )}
      </button>

      <div className="w-px h-8 bg-white/20" />

      {/* Toggles */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleOrbits}
          className={`transition-all hover:scale-110 ${
            showOrbits ? "text-blue-400" : "text-white/40"
          }`}
          title="Toggle Orbits"
        >
          <Orbit size={20} />
        </button>

        <button
          onClick={toggleLabels}
          className={`transition-all hover:scale-110 ${
            showLabels ? "text-blue-400" : "text-white/40"
          }`}
          title="Toggle Labels"
        >
          <Type size={20} />
        </button>

        <button
          onClick={toggleAsteroids}
          className={`transition-all hover:scale-110 ${
            showAsteroids ? "text-blue-400" : "text-white/40"
          }`}
          title="Toggle Asteroid Belt"
        >
          <Hexagon size={20} />
        </button>
      </div>
    </div>
  );
}
