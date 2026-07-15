"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Users2 } from "lucide-react";
import type { NetworkLink, Talent } from "@/lib/types";
import TalentCard from "./TalentCard";
import TalentDetail, { countCollaborators } from "./TalentDetail";

interface ResultsPanelProps {
  talents: Talent[];
  allTalents: Talent[];
  links: NetworkLink[];
  selectedTalentId: string | null;
  onSelectTalent: (id: string | null) => void;
}

export default function ResultsPanel({
  talents,
  allTalents,
  links,
  selectedTalentId,
  onSelectTalent,
}: ResultsPanelProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const selected = selectedTalentId ? allTalents.find((t) => t.id === selectedTalentId) ?? null : null;

  const manager = selected?.managerId ? allTalents.find((t) => t.id === selected.managerId) ?? null : null;
  const reports = selected ? allTalents.filter((t) => t.managerId === selected.id) : [];
  const collaboratorCount = selected ? countCollaborators(links, selected.id) : 0;

  const body = selected ? (
    <TalentDetail
      talent={selected}
      manager={manager}
      reports={reports}
      collaboratorCount={collaboratorCount}
      onBack={() => onSelectTalent(null)}
      onSelectTalent={onSelectTalent}
    />
  ) : (
    <div className="flex flex-col gap-2">
      {talents.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Users2 size={22} className="text-ink-faint" />
          <p className="text-sm text-ink-muted">No talent matches these filters.</p>
          <p className="text-xs text-ink-faint">Try widening your search or zooming out.</p>
        </div>
      ) : (
        talents
          .slice(0, 60)
          .map((t) => (
            <TalentCard key={t.id} talent={t} selected={t.id === selectedTalentId} onSelect={onSelectTalent} />
          ))
      )}
    </div>
  );

  return (
    <>
      {/* Desktop / tablet: right-hand sidebar */}
      <aside className="glass scroll-thin pointer-events-auto absolute top-0 right-0 hidden h-full w-[22rem] max-w-[92vw] flex-col overflow-y-auto rounded-l-2xl p-4 sm:flex">
        <PanelHeader count={talents.length} showing={!selected} />
        {body}
      </aside>

      {/* Mobile: bottom sheet */}
      <div
        className={`glass scroll-thin pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-2xl transition-[height] duration-300 ease-out sm:hidden ${
          mobileExpanded ? "h-[75vh]" : "h-[30vh]"
        }`}
      >
        <button
          onClick={() => setMobileExpanded((v) => !v)}
          className="flex shrink-0 items-center justify-center gap-1.5 py-2 text-ink-faint"
          aria-label="Toggle results sheet"
        >
          <span className="h-1 w-10 rounded-full bg-border-strong" />
        </button>
        <div className="flex items-center justify-between px-4">
          <PanelHeader count={talents.length} showing={!selected} compact />
          <button onClick={() => setMobileExpanded((v) => !v)} className="p-2 text-ink-muted">
            {mobileExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
        <div className="scroll-thin flex-1 overflow-y-auto px-4 pb-4">{body}</div>
      </div>
    </>
  );
}

function PanelHeader({ count, showing, compact }: { count: number; showing: boolean; compact?: boolean }) {
  if (!showing) return null;
  return (
    <div className={compact ? "" : "mb-3"}>
      <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-ink">
        Talent in view
      </h2>
      <p className="font-[family-name:var(--font-data)] text-xs text-ink-faint">{count} people</p>
    </div>
  );
}
