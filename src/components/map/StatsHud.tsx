"use client";

interface StatsHudProps {
  visibleCount: number;
  totalCount: number;
  teamCount: number;
}

export default function StatsHud({ visibleCount, totalCount, teamCount }: StatsHudProps) {
  return (
    <div className="glass pointer-events-auto hidden rounded-2xl px-4 py-3 sm:block">
      <div className="flex items-center gap-4 font-[family-name:var(--font-data)]">
        <Stat label="Showing" value={visibleCount} accent="text-signal-cyan" />
        <div className="h-8 w-px bg-border-strong" />
        <Stat label="Total talent" value={totalCount} accent="text-ink" />
        <div className="h-8 w-px bg-border-strong" />
        <Stat label="Teams" value={teamCount} accent="text-signal-violet" />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="flex flex-col">
      <span className={`text-lg font-semibold leading-none ${accent}`}>{value}</span>
      <span className="mt-1 text-[10px] uppercase tracking-wide text-ink-faint">{label}</span>
    </div>
  );
}
