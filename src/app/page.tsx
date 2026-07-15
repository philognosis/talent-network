"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { talents, networkLinks, teams } from "@/lib/mock-data";
import { applyFilters, EMPTY_FILTERS } from "@/lib/filter-talents";
import type { AvailabilityStatus, MapBounds, SeniorityLevel } from "@/lib/types";

import BrandHeader from "@/components/map/BrandHeader";
import SearchBar from "@/components/map/SearchBar";
import FilterChips from "@/components/map/FilterChips";
import StatsHud from "@/components/map/StatsHud";
import ResultsPanel from "@/components/map/ResultsPanel";

// MapLibre/deck.gl touch window/canvas APIs — load client-side only.
const MapCanvas = dynamic(() => import("@/components/map/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-canvas">
      <p className="font-[family-name:var(--font-data)] text-xs text-ink-faint">Loading map…</p>
    </div>
  ),
});

export default function Home() {
  const [query, setQuery] = useState("");
  const [scopeToBounds, setScopeToBounds] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityStatus[]>([]);
  const [seniority, setSeniority] = useState<SeniorityLevel[]>([]);
  const [showNetwork, setShowNetwork] = useState(true);
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  const filters = useMemo(
    () => ({ ...EMPTY_FILTERS, query, availability, seniority }),
    [query, availability, seniority],
  );

  const filteredTalents = useMemo(
    () => applyFilters(talents, filters, mapBounds, scopeToBounds),
    [filters, mapBounds, scopeToBounds],
  );

  function toggleAvailability(status: AvailabilityStatus) {
    setAvailability((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  }
  function toggleSeniority(level: SeniorityLevel) {
    setSeniority((prev) => (prev.includes(level) ? prev.filter((s) => s !== level) : [...prev, level]));
  }

  function handleSelectTalent(id: string | null) {
    setSelectedTalentId(id);
    if (id) {
      const t = talents.find((x) => x.id === id);
      if (t) setFlyToTarget({ lat: t.location.lat, lng: t.location.lng, zoom: 7 });
    }
  }

  return (
    <main className="relative h-full w-full">
      <MapCanvas
        talents={filteredTalents}
        links={networkLinks}
        selectedTalentId={selectedTalentId}
        onSelectTalent={handleSelectTalent}
        showNetwork={showNetwork}
        flyToTarget={flyToTarget}
        onBoundsChange={setMapBounds}
      />

      {/* Floating UI layer — pointer-events disabled on the wrapper so map drag still works
          between controls; individual controls opt back in via pointer-events-auto. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <BrandHeader />
          <div className="hidden sm:block">
            <StatsHud
              visibleCount={filteredTalents.length}
              totalCount={talents.length}
              teamCount={teams.length}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-col items-center gap-2 sm:mt-4">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            scopeToBounds={scopeToBounds}
            onToggleScope={() => setScopeToBounds((v) => !v)}
            resultCount={filteredTalents.length}
          />
          <FilterChips
            availability={availability}
            onToggleAvailability={toggleAvailability}
            seniority={seniority}
            onToggleSeniority={toggleSeniority}
            showNetwork={showNetwork}
            onToggleNetwork={() => setShowNetwork((v) => !v)}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0">
        <ResultsPanel
          talents={filteredTalents}
          allTalents={talents}
          links={networkLinks}
          selectedTalentId={selectedTalentId}
          onSelectTalent={handleSelectTalent}
        />
      </div>
    </main>
  );
}
