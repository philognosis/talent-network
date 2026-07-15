import dynamic from "next/dynamic";

// Entire app shell is client-only — maplibre-gl accesses localStorage at
// module-init time, which crashes Next.js SSR even with "use client" pages
// (Next.js still server-renders "use client" components for the initial HTML).
// Loading everything dynamically with ssr: false is the correct boundary.
const HomeClient = dynamic(() => import("@/components/map/HomeClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#070a10]">
      <p className="font-mono text-xs text-white/30">Loading…</p>
    </div>
  ),
});

export default function Page() {
  return <HomeClient />;
}
