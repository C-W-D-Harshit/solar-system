import { X, Ruler, Clock, Thermometer, Activity } from "lucide-react";
import { useStore } from "../../store/useStore";

export function InfoPanel() {
  /** Use individual selectors to prevent re-renders from unrelated state changes */
  const selectedBody = useStore((state) => state.selectedBody);
  const selectBody = useStore((state) => state.selectBody);

  if (!selectedBody) return null;

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
