import { ControlPanel } from "./ControlPanel";
import { InfoPanel } from "./InfoPanel";
import { useStore } from "../../store/useStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { Hand } from "lucide-react";

/**
 * Overlay component - Contains all UI overlays on top of the 3D scene
 * Responsive: Adjusts layout and hides keyboard-specific instructions on mobile
 */
export function Overlay() {
  const { isMobile, isTouchDevice } = useIsMobile();

  /** Use selector to only subscribe to cameraMode state */
  const cameraMode = useStore((state) => state.cameraMode);

  return (
    <>
      <ControlPanel />
      <InfoPanel />

      {/* Title / Brand - Responsive positioning */}
      <div
        className={`fixed z-40 pointer-events-none ${
          isMobile ? "top-4 left-4" : "top-6 left-6"
        }`}
      >
        <h1
          className={`font-light tracking-[0.2em] text-white opacity-80 ${
            isMobile ? "text-lg" : "text-2xl"
          }`}
        >
          SOLAR<span className="font-bold opacity-100">SYSTEM</span>
        </h1>
        <p
          className={`uppercase tracking-widest text-white/40 mt-1 ${
            isMobile ? "text-[8px]" : "text-[10px]"
          }`}
        >
          Interactive 3D Demo
        </p>
      </div>

      {/* Free Camera Mode Instructions - Desktop only (requires keyboard) */}
      {cameraMode === "free" && !isTouchDevice && (
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

      {/* Mobile Touch Instructions - Show briefly on first load */}
      {isMobile && <MobileTouchHint />}
    </>
  );
}

/**
 * Mobile touch hint component - Shows gesture instructions
 * Displays briefly on mobile to help users understand touch controls
 */
function MobileTouchHint() {
  const selectedBody = useStore((state) => state.selectedBody);

  // Don't show if a body is selected (user has already interacted)
  if (selectedBody) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
      <div className="flex flex-col items-center gap-3 text-white/40 animate-pulse">
        <Hand size={32} className="rotate-12" />
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider">
            Pinch to zoom
          </p>
          <p className="text-xs font-medium uppercase tracking-wider">
            Drag to rotate
          </p>
          <p className="text-xs font-medium uppercase tracking-wider mt-1 text-white/60">
            Tap a planet to learn more
          </p>
        </div>
      </div>
    </div>
  );
}
