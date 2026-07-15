"use client";

import type { AvailabilityStatus, SeniorityLevel } from "@/lib/types";

interface FilterChipsProps {
  availability: AvailabilityStatus[];
  onToggleAvailability: (status: AvailabilityStatus) => void;
  seniority: SeniorityLevel[];
  onToggleSeniority: (level: SeniorityLevel) => void;
  showNetwork: boolean;
  onToggleNetwork: () => void;
}

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; label: string; dot: string }[] = [
  { value: "available", label: "Available", dot: "bg-signal-cyan" },
  { value: "engaged", label: "Engaged", dot: "bg-ink-muted" },
  { value: "not-available", label: "Not available", dot: "bg-signal-danger" },
];

const SENIORITY_OPTIONS: SeniorityLevel[] = ["junior", "mid", "senior", "staff", "lead"];

export default function FilterChips({
  availability,
  onToggleAvailability,
  seniority,
  onToggleSeniority,
  showNetwork,
  onToggleNetwork,
}: FilterChipsProps) {
  return (
    <div className="pointer-events-auto scroll-thin flex max-w-full items-center gap-2 overflow-x-auto pb-1">
      <button
        onClick={onToggleNetwork}
        className={`glass shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
          showNetwork ? "text-signal-violet ring-1 ring-signal-violet/40" : "text-ink-muted"
        }`}
      >
        Network links
      </button>
      <div className="h-4 w-px shrink-0 bg-border-strong" />
      {AVAILABILITY_OPTIONS.map((opt) => {
        const active = availability.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => onToggleAvailability(opt.value)}
            className={`glass flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              active ? "text-ink ring-1 ring-signal-cyan/40" : "text-ink-muted"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${opt.dot}`} />
            {opt.label}
          </button>
        );
      })}
      <div className="h-4 w-px shrink-0 bg-border-strong" />
      {SENIORITY_OPTIONS.map((level) => {
        const active = seniority.includes(level);
        return (
          <button
            key={level}
            onClick={() => onToggleSeniority(level)}
            className={`glass shrink-0 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
              active ? "text-signal-amber ring-1 ring-signal-amber/40" : "text-ink-muted"
            }`}
          >
            {level}
          </button>
        );
      })}
    </div>
  );
}
