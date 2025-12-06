import {
  Play,
  Pause,
  Orbit,
  Type,
  Hexagon,
  Move3d,
  MousePointer2,
  Settings,
  ChevronDown,
  Rocket,
  Music,
} from "lucide-react";
import { useStore } from "../../store/useStore";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * ControlPanel component - Bottom control bar for simulation controls
 * Responsive design: collapsible on mobile, full bar on desktop
 */
export function ControlPanel() {
  const { isMobile, isTouchDevice } = useIsMobile();

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
  const galacticMotion = useStore((state) => state.galacticMotion);
  const toggleGalacticMotion = useStore((state) => state.toggleGalacticMotion);
  const musicEnabled = useStore((state) => state.musicEnabled);
  const toggleMusic = useStore((state) => state.toggleMusic);
  const isControlsExpanded = useStore((state) => state.isControlsExpanded);
  const toggleControlsExpanded = useStore(
    (state) => state.toggleControlsExpanded
  );

  // Mobile Layout - Collapsible bottom sheet
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out">
        {/* Expanded Controls Panel */}
        <div
          className={`bg-black/90 backdrop-blur-md border-t border-white/20 transition-all duration-300 ease-out overflow-hidden ${
            isControlsExpanded ? "max-h-80 py-4" : "max-h-0 py-0"
          }`}
        >
          <div className="px-4 space-y-4">
            {/* Speed Control */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs uppercase tracking-wider text-white/50 font-bold">
                <span>Simulation Speed</span>
                <span className="text-white/80">{timeScale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={timeScale}
                onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer touch-pan-x [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>

            {/* Toggle Options Grid */}
            <div className="grid grid-cols-2 gap-3">
              <MobileToggleButton
                active={showOrbits}
                onClick={toggleOrbits}
                icon={<Orbit size={20} />}
                label="Orbits"
              />
              <MobileToggleButton
                active={showLabels}
                onClick={toggleLabels}
                icon={<Type size={20} />}
                label="Labels"
              />
              <MobileToggleButton
                active={showAsteroids}
                onClick={toggleAsteroids}
                icon={<Hexagon size={20} />}
                label="Asteroids"
              />
              <MobileToggleButton
                active={galacticMotion}
                onClick={toggleGalacticMotion}
                icon={<Rocket size={20} />}
                label="Galactic"
              />
              <MobileToggleButton
                active={musicEnabled}
                onClick={toggleMusic}
                icon={<Music size={20} />}
                label="Music"
              />
            </div>

            {/* Camera Mode - Only show on non-touch devices */}
            {!isTouchDevice && (
              <button
                onClick={toggleCameraMode}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  cameraMode === "free"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/10 text-white/70 border border-white/10"
                }`}
              >
                {cameraMode === "free" ? (
                  <>
                    <Move3d size={20} />
                    <span className="text-sm font-medium">Free Camera</span>
                  </>
                ) : (
                  <>
                    <MousePointer2 size={20} />
                    <span className="text-sm font-medium">Orbit Camera</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Collapsed Bottom Bar */}
        <div className="bg-black/90 backdrop-blur-md border-t border-white/20 px-4 py-3 flex items-center justify-between">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" className="text-white" />
            ) : (
              <Play size={24} fill="currentColor" className="text-white" />
            )}
          </button>

          {/* Quick Toggles */}
          <div className="flex items-center gap-2">
            <QuickToggleButton
              active={showOrbits}
              onClick={toggleOrbits}
              icon={<Orbit size={18} />}
            />
            <QuickToggleButton
              active={showLabels}
              onClick={toggleLabels}
              icon={<Type size={18} />}
            />
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={toggleControlsExpanded}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
            aria-label={
              isControlsExpanded ? "Collapse controls" : "Expand controls"
            }
          >
            {isControlsExpanded ? (
              <ChevronDown size={24} className="text-white" />
            ) : (
              <Settings size={24} className="text-white/80" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // Desktop Layout - Full horizontal bar
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
          max="50"
          step="0.5"
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

        <button
          onClick={toggleMusic}
          className={`transition-all hover:scale-110 ${
            musicEnabled ? "text-blue-400" : "text-white/40"
          }`}
          title="Toggle Background Music"
        >
          <Music size={20} />
        </button>
      </div>

      <div className="w-px h-8 bg-white/20" />

      {/* Galactic Motion Toggle */}
      <button
        onClick={toggleGalacticMotion}
        className={`transition-all hover:scale-110 flex items-center gap-2 px-3 py-1.5 rounded-full ${
          galacticMotion
            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
            : "bg-white/10 text-white/70 border border-white/10"
        }`}
        title={
          galacticMotion
            ? "Disable Galactic Motion"
            : "Enable Galactic Motion - Sun moves forward, planets form helical paths"
        }
      >
        <Rocket size={18} />
        <span className="text-xs font-medium uppercase tracking-wider">
          Galactic
        </span>
      </button>
    </div>
  );
}

/**
 * Mobile toggle button with label for expanded panel
 */
function MobileToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all active:scale-95 ${
        active
          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
          : "bg-white/5 text-white/50 border border-white/10"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">
        {label}
      </span>
    </button>
  );
}

/**
 * Quick toggle button for collapsed bottom bar
 */
function QuickToggleButton({
  active,
  onClick,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 ${
        active ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/40"
      }`}
    >
      {icon}
    </button>
  );
}
