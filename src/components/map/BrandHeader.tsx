"use client";

import { Globe2 } from "lucide-react";

export default function BrandHeader() {
  return (
    <div className="glass pointer-events-auto flex items-center gap-2 rounded-full px-3.5 py-2.5">
      <Globe2 size={18} className="text-signal-cyan" />
      <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-ink">
        Talent Atlas
      </span>
    </div>
  );
}
