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
    <div className="grid min-h-0 flex-1 gap-3 px-3 pb-3 pt-4 md:px-5 md:pb-5 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-4 lg:pl-8 lg:pt-5">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKey}
        className="flex min-w-0 gap-1.5 overflow-x-auto px-2 py-1 [scrollbar-width:none] md:px-3 lg:flex-col lg:overflow-y-auto lg:p-1 [&::-webkit-scrollbar]:hidden"
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
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-left text-[14px] leading-tight transition-colors ${
                on ? "border-ink bg-ink text-paper" : "border-line-strong bg-white text-ink-2 hover:border-ink hover:text-ink lg:border-transparent lg:bg-transparent lg:hover:border-line-strong"
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
