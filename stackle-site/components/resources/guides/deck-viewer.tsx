"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Row } from "@/components/row";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { DeckContext, type TabRequest } from "./deck-context";

export type DeckPart = { title: string; start: number; count: number };
export type DeckSlideMeta = {
  part: number;
  title: string;
  kind: string; // small mono context line, e.g. "Section 01 · Code"
  items: { label: string; tab?: string }[]; // outline sub-links (code tabs or topics on the slide)
};

const pad = (n: number) => String(n).padStart(2, "0");

// Before hydration the server-rendered first slide is shown, or the one named in the URL hash (via :target),
// so a shared #slide-12 link doesn't flash slide 1. Once the viewer is ready, React state takes over.
const PRE_HYDRATION_CSS = `
.js .deck:not([data-ready]):has(.deck-slide:target) .deck-slide:not(:target){display:none}
.js .deck:not([data-ready]) .deck-slide:target{display:block}
`;

type Nav = { seq: number; mode: "none" | "scroll" | "focus" };

export function DeckViewer({
  brand,
  label,
  parts,
  slides,
  nodes,
}: {
  brand: string;
  label: string;
  parts: DeckPart[];
  slides: DeckSlideMeta[];
  nodes: ReactNode[]; // the server-rendered slides, in order
}) {
  const total = slides.length;
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [request, setRequest] = useState<TabRequest | null>(null);
  const [nav, setNav] = useState<Nav>({ seq: 0, mode: "none" });
  const activeRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const go = useCallback(
    (i: number, mode: Nav["mode"] = "none", writeHash = true) => {
      const next = Math.max(0, Math.min(total - 1, i));
      activeRef.current = next;
      setActive(next);
      if (writeHash) window.history.replaceState(null, "", `#slide-${next + 1}`);
      setNav((v) => ({ seq: v.seq + 1, mode }));
    },
    [total],
  );

  // Read #slide-N on load and follow later hash changes (hero links, edited URLs, back/forward).
  useEffect(() => {
    const fromHash = () => {
      const m = /^#slide-(\d+)$/.exec(window.location.hash);
      const n = m ? Number(m[1]) : NaN;
      return n >= 1 && n <= total ? n - 1 : null;
    };
    const first = fromHash();
    if (first !== null) {
      activeRef.current = first;
      setActive(first);
    }
    setReady(true);
    const onHash = () => {
      const i = fromHash();
      if (i !== null) go(i, "scroll", false);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [go, total]);

  // Left/right arrow keys move through the deck while it is on screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("input, textarea, select, [contenteditable], [role='tablist'], pre")) return;
      const r = rootRef.current?.getBoundingClientRect();
      if (!r || r.bottom < 120 || r.top > window.innerHeight - 120) return;
      e.preventDefault();
      go(activeRef.current + (e.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // After a jump, bring the stage back into view (and move focus to the slide when asked).
  useEffect(() => {
    const stage = stageRef.current;
    if (nav.seq === 0 || !stage) return;
    const top = stage.getBoundingClientRect().top;
    if (nav.mode === "none") {
      // Prev/Next or arrow keys after scrolling down a long (phone) slide: start the new one at its top.
      if (top < 64) stage.scrollIntoView({ block: "start" });
    } else if (top < 64 || top > window.innerHeight * 0.5) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      stage.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    }
    if (nav.mode === "focus") slideRefs.current[activeRef.current]?.focus({ preventScroll: true });
  }, [nav]);

  const jump = (e: MouseEvent, i: number, tab?: string) => {
    e.preventDefault();
    if (tab) setRequest((r) => ({ slide: i, tab, seq: (r?.seq ?? 0) + 1 }));
    go(i, "focus");
  };

  const cur = slides[active];

  return (
    <DeckContext.Provider value={{ request }}>
      <style>{PRE_HYDRATION_CSS}</style>
      <div ref={rootRef} className="deck" data-ready={ready ? "" : undefined}>
        <Row n="03" id="deck" tone="white">
          <div role="region" aria-roledescription="slide deck" aria-label={label}>
            <div className="flex items-center justify-between gap-4 border-b hairline px-5 py-3.5 md:px-8">
              <span className="t-mono hidden sm:inline">{brand}</span>
              <span className="t-mono truncate text-muted">{parts[cur.part].title}</span>
              <span className="t-mono shrink-0 tabular-nums">
                {pad(active + 1)} <span className="text-muted">/ {total}</span>
              </span>
            </div>

            <div className="fill-dots px-3 py-3 md:px-8 md:py-8">
              <div
                ref={stageRef}
                className="relative border border-ink bg-white lg:[.js_&]:aspect-video lg:[.js_&]:overflow-hidden"
              >
                {nodes.map((node, i) => (
                  <div
                    key={i}
                    id={`slide-${i + 1}`}
                    ref={(el) => {
                      slideRefs.current[i] = el;
                    }}
                    tabIndex={-1}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${total}: ${slides[i].title}`}
                    className={`deck-slide outline-none lg:[.js_&]:h-full ${i === active ? "" : "[.js_&]:hidden"}`}
                  >
                    {node}
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 z-20 flex items-center gap-3 border-t hairline bg-paper/95 px-3 py-3 backdrop-blur-md md:static md:bg-white md:px-8 md:py-4 md:backdrop-blur-none">
              <button type="button" className="btn btn-line btn-chrome" onClick={() => go(active - 1)} disabled={active === 0}>
                <ArrowLeft /> <span>Prev</span>
              </button>
              <div className="min-w-0 flex-1">
                <p className="t-mono text-center tabular-nums md:hidden">
                  Slide {active + 1} <span className="text-muted">of {total}</span>
                </p>
                <div className="hidden items-center gap-3 md:flex" aria-label="Jump to slide" role="group">
                  {parts.map((p, pi) => (
                    <div key={pi} className="flex flex-1" style={{ flexGrow: p.count }}>
                      {Array.from({ length: p.count }, (_, k) => {
                        const i = p.start + k;
                        const on = i === active;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => go(i)}
                            aria-label={`Slide ${i + 1}: ${slides[i].title}`}
                            aria-current={on ? "step" : undefined}
                            className="group flex-1 py-2.5"
                          >
                            <span className={`block h-1.5 border-r border-white transition-colors ${on ? "bg-ink" : "bg-line group-hover:bg-muted"}`} />
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" className="btn btn-ink btn-chrome" onClick={() => go(active + 1)} disabled={active === total - 1}>
                <span>Next</span> <ArrowRight />
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {ready ? `Slide ${active + 1} of ${total}: ${cur.title}` : ""}
            </p>
          </div>
        </Row>

        <Row n="04" id="outline">
          <div className="pad flex flex-wrap items-end justify-between gap-4 pb-8 pt-12 md:pt-16">
            <div>
              <span className="label">Outline</span>
              <h2 className="t-h3 mt-5">Every slide, by part.</h2>
            </div>
            <p className="t-mono text-muted">
              {total} slides · {parts.length} parts · <span className="kbd">←</span> <span className="kbd">→</span> to move
            </p>
          </div>
          <div className="grid border-t hairline md:grid-cols-3">
            {parts.map((p, pi) => (
              <div key={pi} className={`hairline ${pi ? "border-t md:border-l md:border-t-0" : ""}`}>
                <h3 className="t-mono flex items-center justify-between gap-3 border-b hairline px-5 py-4 md:px-6">
                  <span>{p.title}</span>
                  <span className="text-muted">{p.count}</span>
                </h3>
                <ol>
                  {Array.from({ length: p.count }, (_, k) => {
                    const i = p.start + k;
                    const s = slides[i];
                    const on = i === active;
                    return (
                      <li key={i} className={`border-b hairline last:border-b-0 ${on ? "bg-ink text-paper" : ""}`}>
                        <a
                          href={`#slide-${i + 1}`}
                          onClick={(e) => jump(e, i)}
                          aria-current={on ? "true" : undefined}
                          className={`grid grid-cols-[34px_1fr] gap-x-2 px-5 pb-2 pt-3 md:px-6 ${on ? "" : "hover:bg-white"} ${s.items.length ? "" : "pb-3"}`}
                        >
                          <span className={`t-mono-sm pt-[3px] tabular-nums ${on ? "text-night-muted" : "text-muted"}`}>{pad(i + 1)}</span>
                          <span>
                            <span className="block text-[15px] font-medium leading-snug">{s.title}</span>
                            <span className={`t-mono-sm mt-1 block ${on ? "text-night-muted" : "text-muted"}`}>{s.kind}</span>
                          </span>
                        </a>
                        {s.items.length > 0 && (
                          <ul className="flex flex-wrap gap-1.5 pb-3 pl-[61px] pr-5 md:pl-[66px] md:pr-6">
                            {s.items.map((it) => (
                              <li key={it.label}>
                                <a
                                  href={`#slide-${i + 1}`}
                                  onClick={(e) => jump(e, i, it.tab)}
                                  className={`inline-block border px-1.5 py-0.5 font-mono text-[11.5px] leading-snug transition-colors ${
                                    on
                                      ? "border-night-line text-night-muted hover:border-paper hover:text-paper"
                                      : "border-line text-ink-2 hover:border-ink hover:bg-ink hover:text-paper"
                                  }`}
                                >
                                  {it.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </Row>
      </div>
    </DeckContext.Provider>
  );
}
