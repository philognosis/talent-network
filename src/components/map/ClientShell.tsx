"use client";

import dynamic from "next/dynamic";

const HomeClient = dynamic(() => import("./HomeClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#070a10]">
      <p className="font-mono text-xs text-white/30">Loading…</p>
    </div>
  ),
});

export default function ClientShell() {
  return <HomeClient />;
}
