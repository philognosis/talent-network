"use client";

import { Search, MapPinned, X, Sparkles } from "lucide-react";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  scopeToBounds: boolean;
  onToggleScope: () => void;
  resultCount: number;
}

export default function SearchBar({
  query,
  onQueryChange,
  scopeToBounds,
  onToggleScope,
  resultCount,
}: SearchBarProps) {
  return (
    <div className="pointer-events-auto w-full max-w-xl">
      <div className="glass flex items-center gap-2 rounded-full px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
        <Search size={18} className="shrink-0 text-ink-muted" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search talent, teams, skills — or ask in plain language…"
          className="min-w-0 flex-1 bg-transparent font-[family-name:var(--font-body)] text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
        {query && (
          <button
            aria-label="Clear search"
            onClick={() => onQueryChange("")}
            className="shrink-0 rounded-full p-1 text-ink-muted transition hover:bg-white/10 hover:text-ink"
          >
            <X size={16} />
          </button>
        )}
        <div className="mx-1 h-5 w-px shrink-0 bg-border-strong" />
        <button
          onClick={onToggleScope}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
            scopeToBounds
              ? "bg-signal-cyan/15 text-signal-cyan ring-1 ring-signal-cyan/40"
              : "text-ink-muted hover:bg-white/10 hover:text-ink"
          }`}
          title="Limit search to what's visible on the map"
        >
          <MapPinned size={14} />
          <span className="hidden sm:inline">This area</span>
        </button>
      </div>
      {query && (
        <div className="mt-2 flex items-center gap-1.5 pl-4 font-[family-name:var(--font-data)] text-xs text-ink-muted">
          <Sparkles size={12} className="text-signal-violet" />
          <span>
            {resultCount} match{resultCount === 1 ? "" : "es"}
            {scopeToBounds ? " in this area" : " worldwide"}
          </span>
        </div>
      )}
    </div>
  );
}
