"use client";

import { ArrowLeft, Briefcase, MapPin, Users } from "lucide-react";
import type { NetworkLink, Talent } from "@/lib/types";

const AVAILABILITY_LABEL: Record<Talent["availability"], string> = {
  available: "Available now",
  engaged: "Currently engaged",
  "not-available": "Not available",
};

interface TalentDetailProps {
  talent: Talent;
  manager: Talent | null;
  reports: Talent[];
  collaboratorCount: number;
  onBack: () => void;
  onSelectTalent: (id: string) => void;
}

export default function TalentDetail({
  talent,
  manager,
  reports,
  collaboratorCount,
  onBack,
  onSelectTalent,
}: TalentDetailProps) {
  return (
    <div className="flex h-full flex-col">
      <button
        onClick={onBack}
        className="mb-3 flex w-fit items-center gap-1.5 text-xs font-medium text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft size={14} />
        Back to results
      </button>

      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-signal-amber/15 font-[family-name:var(--font-display)] text-lg font-semibold text-signal-amber">
          {talent.initials}
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-[family-name:var(--font-display)] text-base font-semibold text-ink">
            {talent.name}
          </h2>
          <p className="text-sm text-ink-muted">{talent.role}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-ink-faint">
            <MapPin size={12} />
            {talent.location.city}, {talent.location.country}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 font-[family-name:var(--font-data)] text-xs">
        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-ink-muted">
          {AVAILABILITY_LABEL[talent.availability]}
        </span>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-ink-muted capitalize">
          {talent.seniority}
        </span>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-ink-muted">
          {talent.yearsExperience}y exp
        </span>
      </div>

      <Section title="Skills">
        <div className="flex flex-wrap gap-1.5">
          {talent.skills.map((s) => (
            <span key={s} className="rounded-full bg-signal-cyan/10 px-2.5 py-1 text-xs text-signal-cyan">
              {s}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Team">
        <div className="flex items-center gap-2 text-sm text-ink">
          <Briefcase size={14} className="text-ink-muted" />
          {talent.team} · {talent.department}
        </div>
      </Section>

      {manager && (
        <Section title="Reports to">
          <TalentChip talent={manager} onClick={() => onSelectTalent(manager.id)} />
        </Section>
      )}

      {reports.length > 0 && (
        <Section title={`Direct reports (${reports.length})`}>
          <div className="flex flex-col gap-1.5">
            {reports.slice(0, 5).map((r) => (
              <TalentChip key={r.id} talent={r} onClick={() => onSelectTalent(r.id)} />
            ))}
          </div>
        </Section>
      )}

      <Section title="Network">
        <div className="flex items-center gap-2 text-sm text-ink">
          <Users size={14} className="text-signal-violet" />
          {collaboratorCount} connection{collaboratorCount === 1 ? "" : "s"} in the network graph
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="mb-1.5 text-[10px] font-[family-name:var(--font-data)] uppercase tracking-wide text-ink-faint">
        {title}
      </p>
      {children}
    </div>
  );
}

function TalentChip({ talent, onClick }: { talent: Talent; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-left transition hover:bg-white/[0.07]"
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal-cyan/15 text-[10px] font-semibold text-signal-cyan">
        {talent.initials}
      </div>
      <span className="truncate text-xs text-ink">{talent.name}</span>
    </button>
  );
}

export function countCollaborators(links: NetworkLink[], talentId: string): number {
  return links.filter((l) => l.sourceId === talentId || l.targetId === talentId).length;
}
