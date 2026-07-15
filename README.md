# Talent Atlas UI

A map-first talent discovery tool for globally distributed orgs — browse talent,
teams, and networks on a world map, zoom to drill in, filter by criteria, and
search "this area" the way you'd find hotels on Google Maps.

This is the **frontend map UI**, built against mock data, per the current scope.
No backend is wired up yet — see "Next steps" below.

## Stack

- **Next.js 16** (App Router, `src/` dir) + **TypeScript**
- **Tailwind CSS v4** — dark theme by default (see design tokens in `src/app/globals.css`)
- **MapLibre GL JS** — open-source vector basemap (CARTO Dark Matter style, no API key)
- **deck.gl** — WebGL overlay for clustering, talent nodes, and animated network arcs
- **supercluster** — zoom-based point clustering
- **pnpm** as the package manager

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Production build:

```bash
pnpm build
pnpm start
```

## What's implemented

- **World map, default view**: ~260 mock talents across 16 global hub cities,
  clustered client-side with `supercluster` and re-clustered as you pan/zoom.
- **Zoom to drill in**: clusters show a count and break apart into individual
  talent nodes as you zoom past their expansion threshold (click a cluster to
  fly to it).
- **Network view**: pulsing, animated `ArcLayer` connections show reporting
  lines, team collaboration, and cross-region mentorship links — toggle on/off
  via the "Network links" chip.
- **Search**: top search bar does lightweight token matching against name,
  role, team, skills, and location. Toggle **"This area"** to scope results to
  whatever's currently visible on the map — the "search like Google Maps"
  behavior you asked for.
- **Filters**: availability and seniority chips, composable with search.
- **Results panel**: right-hand sidebar on tablet/desktop, bottom sheet
  (draggable open/closed) on mobile. Selecting a talent shows a detail view
  with skills, manager, direct reports, and network connection count.
- **Responsive**: fluid Tailwind breakpoints — tested down to narrow phones
  (incl. Z Fold outer/inner widths), through tablets, to ultrawide desktop.
  No device-specific branching; the map itself is naturally full-bleed and
  scales at any viewport.

## Project structure

```
src/
  app/
    layout.tsx        # root layout, dark theme, font-role CSS variables
    globals.css        # design tokens (color/type/glass/motion)
    page.tsx           # composes the map + floating UI, owns shared state
  components/map/
    MapCanvas.tsx       # MapLibre + deck.gl overlay, clustering, arcs
    BrandHeader.tsx
    SearchBar.tsx
    FilterChips.tsx
    StatsHud.tsx
    ResultsPanel.tsx    # sidebar (desktop) / bottom sheet (mobile)
    TalentCard.tsx
    TalentDetail.tsx
  hooks/
    useTalentClusters.ts  # supercluster wrapper
  lib/
    types.ts            # Talent / Team / NetworkLink types
    mock-data.ts         # deterministic mock data generator
    filter-talents.ts    # search + filter logic
```

## Design system

Dark "global ops" aesthetic — deep navy canvas, electric-cyan for talent nodes
and primary links, warm amber for selection/search state, glass-morphic
floating panels over a full-bleed map. See the token comments in
`src/app/globals.css` for the full palette.

Type roles (`--font-display` / `--font-body` / `--font-data`) currently use
curated system-font stacks rather than `next/font/google`, so `pnpm build`
never depends on reaching Google Fonts — useful in sandboxed CI/build
environments. If you have unrestricted network access and want the exact
Space Grotesk / Inter / JetBrains Mono look, swap in `next/font/local` with
bundled `.woff2` files (see the comment in `src/app/layout.tsx`).

## Next steps (not yet built)

- Wire up to a real backend (FastAPI, per your stack) via
  `NEXT_PUBLIC_API_BASE_URL` in `.env.local` — replace `src/lib/mock-data.ts`
  reads with API calls / React Query.
- Real chat/NL search (currently a token-matching stand-in) — swap in an LLM
  endpoint that returns structured filters.
- Auth + org-scoped data access.
- Persisted saved searches / saved views.
