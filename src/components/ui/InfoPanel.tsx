import {
  X,
  Ruler,
  Clock,
  Thermometer,
  Activity,
  ChevronDown,
} from "lucide-react";
import { useStore } from "../../store/useStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useState } from "react";

/**
 * InfoPanel component - Displays details about selected celestial body
 * Responsive: Side panel on desktop, bottom sheet on mobile
 */
export function InfoPanel() {
  const { isMobile } = useIsMobile();

  /** Use individual selectors to prevent re-renders from unrelated state changes */
  const selectedBody = useStore((state) => state.selectedBody);
  const selectBody = useStore((state) => state.selectBody);

  /** Mobile bottom sheet expansion state */
  const [isExpanded, setIsExpanded] = useState(false);

  if (!selectedBody) return null;

  // Mobile Layout - Bottom sheet
  if (isMobile) {
    return (
      <div
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isExpanded ? "bottom-0" : "bottom-[68px]"
        }`}
      >
        {/* Drag handle / header area */}
        <div
          className="bg-black/95 backdrop-blur-md border-t border-x border-white/20 rounded-t-2xl cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Pull indicator */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 bg-white/30 rounded-full" />
          </div>

          {/* Header with title */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-light tracking-wider text-white">
                {selectedBody.name}
              </h2>
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] uppercase tracking-widest text-white/70 font-bold">
                {selectedBody.type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="w-8 h-8 flex items-center justify-center text-white/60"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectBody(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable content */}
        <div
          className={`bg-black/95 backdrop-blur-md border-x border-white/20 overflow-hidden transition-all duration-300 ease-out ${
            isExpanded ? "max-h-[60vh] pb-24" : "max-h-0"
          }`}
        >
          <div className="px-4 pt-2">
            {/* Description */}
            <p className="text-sm text-white/70 leading-relaxed mb-4 pb-4 border-b border-white/10">
              {selectedBody.description}
            </p>

            {/* Details grid - 2 columns on mobile */}
            <div className="grid grid-cols-2 gap-3">
              <MobileInfoCard
                icon={<Ruler size={16} />}
                label="Diameter"
                value={selectedBody.details.diameter}
              />
              <MobileInfoCard
                icon={<Activity size={16} />}
                label="Distance"
                value={selectedBody.details.distanceFromSun}
                sub="from Sun"
              />
              <MobileInfoCard
                icon={<Clock size={16} />}
                label="Orbital Period"
                value={selectedBody.details.orbitalPeriod}
              />
              <MobileInfoCard
                icon={<Clock size={16} />}
                label="Day Length"
                value={selectedBody.details.dayLength}
              />
              <MobileInfoCard
                icon={<Thermometer size={16} />}
                label="Avg Temp"
                value={selectedBody.details.temp}
                className="col-span-2"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout - Side panel
  return (
    <div className="fixed top-6 right-6 w-80 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-2xl z-50 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-light tracking-wider text-white">
            {selectedBody.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] uppercase tracking-widest text-white/70 font-bold">
              {selectedBody.type}
            </span>
          </div>
        </div>
        <button
          onClick={() => selectBody(null)}
          className="text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-sm text-white/70 leading-relaxed mb-6 border-b border-white/10 pb-6">
        {selectedBody.description}
      </p>

      <div className="space-y-4">
        <InfoRow
          icon={<Ruler size={16} />}
          label="Diameter"
          value={selectedBody.details.diameter}
        />
        <InfoRow
          icon={<Activity size={16} />}
          label="Distance"
          value={selectedBody.details.distanceFromSun}
          sub="from Sun"
        />
        <InfoRow
          icon={<Clock size={16} />}
          label="Orbital Period"
          value={selectedBody.details.orbitalPeriod}
        />
        <InfoRow
          icon={<Clock size={16} />}
          label="Day Length"
          value={selectedBody.details.dayLength}
        />
        <InfoRow
          icon={<Thermometer size={16} />}
          label="Avg Temp"
          value={selectedBody.details.temp}
        />
      </div>
    </div>
  );
}

/**
 * Desktop info row component
 */
function InfoRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3 text-white/50 group-hover:text-white/80 transition-colors">
        {icon}
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide">
            {label}
          </span>
          {sub && <span className="text-[10px] opacity-50">{sub}</span>}
        </div>
      </div>
      <span className="text-sm font-mono text-white/90">{value}</span>
    </div>
  );
}

/**
 * Mobile info card component for grid layout
 */
function MobileInfoCard({
  icon,
  label,
  value,
  sub,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-white/5 rounded-xl p-3 border border-white/10 ${className}`}
    >
      <div className="flex items-center gap-2 text-white/50 mb-1">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-sm font-mono text-white/90">{value}</p>
      {sub && <p className="text-[10px] text-white/40 mt-0.5">{sub}</p>}
    </div>
  );
}
