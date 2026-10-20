"use client";

import { useEffect, useMemo, useState } from "react";
import { ResourceCard } from "@/components/resource-card";
import { Search } from "@/components/icons";
import { resourceGroups, type ResourceItem } from "@/content/resources";

export function Library({ items }: { items: ResourceItem[] }) {
  const [group, setGroup] = useState<string>("All");
  const [q, setQ] = useState("");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("q")) setQ(p.get("q")!);
  }, []);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items.filter((r) => (group === "All" || r.group === group) && (!t || `${r.title} ${r.summary} ${r.group}`.toLowerCase().includes(t)));
  }, [items, group, q]);
  const tabs = ["All", ...resourceGroups];

  return (
    <>
      <div className="sticky top-[72px] z-30 border-b hairline bg-paper/95 backdrop-blur md:top-[80px]">
        <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
          <div role="tablist" aria-label="Resource type" className="pad flex gap-2 overflow-x-auto [scrollbar-width:none]">
            {tabs.map((t) => {
              const n = t === "All" ? items.length : items.filter((r) => r.group === t).length;
              const on = t === group;
              return (
                <button key={t} role="tab" aria-selected={on} onClick={() => setGroup(t)} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[14.5px] font-semibold transition-colors ${on ? "border-ink bg-ink text-paper" : "border-line-strong bg-white hover:border-ink"}`}>
                  {t}
                  <span className={on ? "text-night-muted" : "text-muted"}>{n}</span>
                </button>
              );
            })}
          </div>
          <div className="pad md:pl-0">
            <label className="relative block md:w-[300px]">
              <span className="sr-only">Search the library</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the library" className="field !min-h-[44px] !rounded-full pl-11" />
            </label>
          </div>
        </div>
      </div>
      <p className="pad pb-2 pt-6 text-[14px] text-muted" aria-live="polite">
        {shown.length} {shown.length === 1 ? "resource" : "resources"}
      </p>
      {shown.length ? (
        <div className="pad grid gap-5 pb-20 pt-4 sm:grid-cols-2 lg:grid-cols-3 md:pb-28">
          {shown.map((r) => (
            <ResourceCard key={r.slug} r={r} />
          ))}
        </div>
      ) : (
        <div className="pad py-20 text-center">
          <p className="t-h3">Nothing matches “{q}”.</p>
          <button className="dlink mt-4" onClick={() => { setQ(""); setGroup("All"); }}>Clear the search</button>
        </div>
      )}
    </>
  );
}
