type ProgressTrackProps = {
  label: string;
  value: number;
  max: number;
  helper?: string;
  hue?: "teal" | "purple" | "green";
};

const hueClass = {
  teal: "from-cyan-400 to-teal-400 shadow-[0_0_18px_rgba(45,212,191,0.55)]",
  purple: "from-fuchsia-400 to-violet-500 shadow-[0_0_18px_rgba(168,85,247,0.55)]",
  green: "from-emerald-400 to-lime-400 shadow-[0_0_18px_rgba(74,222,128,0.55)]",
} as const;

export function ProgressTrack({ label, value, max, helper, hue = "teal" }: ProgressTrackProps) {
  const safeMax = Math.max(max, 1);
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100));

  return (
    <article className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4 backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm text-slate-200">{label}</p>
        <p className="text-xs text-slate-400">{percent.toFixed(0)}%</p>
      </div>
      <div className="h-3 rounded-full bg-slate-800/90">
        <div
          className={`h-3 rounded-full bg-gradient-to-r transition-all duration-1000 ease-out ${hueClass[hue]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {helper && <p className="mt-2 text-xs text-slate-400">{helper}</p>}
    </article>
  );
}
