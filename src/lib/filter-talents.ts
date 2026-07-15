import type { MapBounds, Talent, TalentFilters } from "./types";

export const EMPTY_FILTERS: TalentFilters = {
  query: "",
  teams: [],
  skills: [],
  seniority: [],
  availability: [],
};

function matchesQuery(t: Talent, rawQuery: string): boolean {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;
  const haystack = [
    t.name,
    t.role,
    t.team,
    t.department,
    t.location.city,
    t.location.country,
    ...t.skills,
  ]
    .join(" ")
    .toLowerCase();

  // very lightweight "chat" parsing: split into tokens, require each token to
  // appear somewhere in the talent's searchable text (skill/team/city/name/role).
  const tokens = query.split(/\s+/).filter(Boolean);
  return tokens.every((tok) => haystack.includes(tok));
}

export function applyFilters(
  talents: Talent[],
  filters: TalentFilters,
  bounds: MapBounds | null,
  scopeToBounds: boolean,
): Talent[] {
  return talents.filter((t) => {
    if (!matchesQuery(t, filters.query)) return false;
    if (filters.teams.length && !filters.teams.includes(t.team)) return false;
    if (filters.skills.length && !filters.skills.some((s) => t.skills.includes(s))) return false;
    if (filters.seniority.length && !filters.seniority.includes(t.seniority)) return false;
    if (filters.availability.length && !filters.availability.includes(t.availability)) return false;
    if (scopeToBounds && bounds) {
      const { lat, lng } = t.location;
      if (lat < bounds.south || lat > bounds.north) return false;
      // handle antimeridian-crossing boxes gracefully
      if (bounds.west <= bounds.east) {
        if (lng < bounds.west || lng > bounds.east) return false;
      } else if (lng > bounds.east && lng < bounds.west) {
        return false;
      }
    }
    return true;
  });
}
