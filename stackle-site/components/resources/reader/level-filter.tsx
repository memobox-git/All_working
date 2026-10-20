"use client";

import { useState } from "react";

// Cheat sheet filter: All / Basic / Intermediate / … Sets data-filter on the content wrapper; the CSS
// in reader.module.css hides the rows that do not match, so the questions stay server-rendered.
export function LevelFilter({ targetId, levels, total }: { targetId: string; levels: { level: string; count: number }[]; total: number }) {
  const [cur, setCur] = useState<string | null>(null);
  const options = [{ level: null as string | null, count: total }, ...levels];
  const pick = (level: string | null) => {
    setCur(level);
    const el = document.getElementById(targetId);
    if (!el) return;
    if (level) el.setAttribute("data-filter", level);
    else el.removeAttribute("data-filter");
  };
  const shown = cur ? (levels.find((l) => l.level === cur)?.count ?? 0) : total;
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p className="t-mono-sm text-muted" aria-live="polite">
        {cur ? `Showing ${shown} of ${total} questions` : `All ${total} questions`}
      </p>
      <div role="group" aria-label="Filter questions by level" className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = cur === o.level;
          return (
            <button
              key={o.level ?? "all"}
              type="button"
              aria-pressed={on}
              onClick={() => pick(o.level)}
              className={`t-mono-sm inline-flex min-h-9 items-center gap-2 border px-3 transition-colors ${on ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink hover:border-ink"}`}
            >
              {o.level ?? "All"}
              <span className={on ? "text-night-muted" : "text-muted"}>{o.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
