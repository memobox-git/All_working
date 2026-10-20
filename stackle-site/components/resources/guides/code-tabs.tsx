"use client";

import { Children, useContext, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { DeckContext } from "./deck-context";

// Tabbed code samples on a deck slide. The panels arrive server-rendered as children; this only switches
// between them. Without JS every panel stays visible, one under the other.
export function CodeTabs({
  slide,
  tabs,
  label,
  children,
}: {
  slide: number; // zero-based index of the slide in the whole deck
  tabs: { id: string; label: string }[];
  label: string;
  children: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const { request } = useContext(DeckContext);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = Children.toArray(children);

  useEffect(() => {
    if (!request || request.slide !== slide) return;
    const i = tabs.findIndex((t) => t.id === request.tab);
    if (i >= 0) setActive(i);
  }, [request, slide, tabs]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    let i: number;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") i = active === last ? 0 : active + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") i = active === 0 ? last : active - 1;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = last;
    else return;
    e.preventDefault();
    e.stopPropagation();
    setActive(i);
    refs.current[i]?.focus();
  };

  return (
    <div className="grid min-h-0 flex-1 lg:grid-cols-[200px_minmax(0,1fr)]">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKey}
        className="flex min-w-0 gap-1 overflow-x-auto border-b border-night-line p-2 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-3"
      >
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${i}`}
              aria-selected={on}
              aria-controls={`${base}-panel-${i}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`shrink-0 whitespace-nowrap px-3 py-2.5 text-left font-mono text-[12.5px] leading-tight transition-colors ${
                on ? "bg-paper text-ink" : "text-night-muted hover:bg-night-3 hover:text-paper"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="min-h-0 min-w-0">
        {panels.map((p, i) => (
          <div
            key={i}
            role="tabpanel"
            id={`${base}-panel-${i}`}
            aria-labelledby={`${base}-tab-${i}`}
            className={`lg:h-full ${i === active ? "" : "[.js_&]:hidden"}`}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
