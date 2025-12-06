import { ControlPanel } from "./ControlPanel";
import { InfoPanel } from "./InfoPanel";
import { useStore } from "../../store/useStore";

export function Overlay() {
  /** Use selector to only subscribe to cameraMode state */
  const cameraMode = useStore((state) => state.cameraMode);

  return (
    <>
      <ControlPanel />
      <InfoPanel />

      {/* Title / Brand */}
      <div className="fixed top-6 left-6 z-40 pointer-events-none">
        <h1 className="text-2xl font-light tracking-[0.2em] text-white opacity-80">
          SOLAR<span className="font-bold opacity-100">SYSTEM</span>
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
          Interactive 3D Demo
        </p>
      </div>

      {/* Free Camera Mode Instructions */}
      {cameraMode === "free" && (
        <div className="fixed top-6 right-6 z-40 bg-black/60 backdrop-blur-sm border border-emerald-500/30 rounded-lg px-4 py-3 text-white/80 animate-fade-in">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            Free Camera Mode
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-white/60">
            <span className="text-white/40">Move</span>
            <span className="font-mono">W A S D</span>
            <span className="text-white/40">Up / Down</span>
            <span className="font-mono">Space / Shift</span>
            <span className="text-white/40">Look</span>
            <span className="font-mono">Click + Mouse</span>
            <span className="text-white/40">Boost</span>
            <span className="font-mono">Ctrl</span>
            <span className="text-white/40">Exit Look</span>
            <span className="font-mono">Esc</span>
          </div>
        </div>
      )}
    </>
  );
}
