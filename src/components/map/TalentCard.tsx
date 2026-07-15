"use client";

import { MapPin } from "lucide-react";
import type { Talent } from "@/lib/types";

const AVAILABILITY_LABEL: Record<Talent["availability"], string> = {
  available: "Available",
  engaged: "Engaged",
  "not-available": "Not available",
};

const AVAILABILITY_DOT: Record<Talent["availability"], string> = {
  available: "bg-signal-cyan",
  engaged: "bg-ink-muted",
  "not-available": "bg-signal-danger",
};

interface TalentCardProps {
  talent: Talent;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function TalentCard({ talent, selected, onSelect }: TalentCardProps) {
  return (
    <button
      onClick={() => onSelect(talent.id)}
      className={`w-full rounded-xl border p-3 text-left transition ${
        selected
          ? "border-signal-amber/50 bg-signal-amber/10"
          : "border-transparent bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-signal-cyan/15 font-[family-name:var(--font-display)] text-sm font-semibold text-signal-cyan">
          {talent.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-ink">{talent.name}</p>
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${AVAILABILITY_DOT[talent.availability]}`} />
          </div>
          <p className="truncate text-xs text-ink-muted">{talent.role}</p>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-ink-faint">
            <MapPin size={11} />
            <span className="truncate">
              {talent.location.city}, {talent.location.country}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {talent.skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-ink-muted"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-2 text-[10px] font-[family-name:var(--font-data)] uppercase tracking-wide text-ink-faint">
        {AVAILABILITY_LABEL[talent.availability]} · {talent.yearsExperience}y exp
      </p>
    </button>
  );
}
