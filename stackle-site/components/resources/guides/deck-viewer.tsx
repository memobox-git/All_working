"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Row } from "@/components/row";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { DeckContext, type TabRequest } from "./deck-context";

export type DeckPart = { title: string; start: number; count: number };
export type DeckSlideMeta = {
  part: number;
  title: string;
  kind: string; // small context line under the title, e.g. "Section 01 · Code"
  items: { label: string; tab?: string }[]; // outline sub-links (code tabs or topics on the slide)
};

const pad = (n: number) => String(n).padStart(2, "0");

// "Part 1 — Python Basics" -> ["Part 1", "Python Basics"]
const splitPart = (t: string): [string, string | null] => {
  const m = /^(.+?)\s+—\s+(.+)$/.exec(t);
  return m ? [m[1], m[2]] : [t, null];
};

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
  const stageRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
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

  // Left/right arrow keys move through the deck while the stage is on screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("input, textarea, select, [contenteditable], [role='tablist'], pre")) return;
      const r = stageRef.current?.getBoundingClientRect();
      if (!r || r.bottom < 120 || r.top > window.innerHeight - 120) return;
      e.preventDefault();
      go(activeRef.current + (e.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // After a jump, bring the deck (counter bar + stage) back into view, and move focus to the slide when asked.
  useEffect(() => {
    const region = regionRef.current;
    const stage = stageRef.current;
    if (nav.seq === 0 || !region || !stage) return;
    const top = region.getBoundingClientRect().top;
    if (nav.mode === "none") {
      // Prev/Next or arrow keys after scrolling down a long (phone) slide: start the new one at its top.
      if (stage.getBoundingClientRect().top < 64) region.scrollIntoView({ block: "start" });
    } else if (top < 64 || top > window.innerHeight * 0.5) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      region.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    }
    if (nav.mode === "focus") slideRefs.current[activeRef.current]?.focus({ preventScroll: true });
  }, [nav]);

  const jump = (e: MouseEvent, i: number, tab?: string) => {
    e.preventDefault();
    if (tab) setRequest((r) => ({ slide: i, tab, seq: (r?.seq ?? 0) + 1 }));
    go(i, "focus");
  };

  const cur = slides[active];

  const [partLabel, partName] = splitPart(parts[cur.part].title);

  return (
    <DeckContext.Provider value={{ request }}>
      <style>{PRE_HYDRATION_CSS}</style>
      <div className="deck" data-ready={ready ? "" : undefined}>
        <Row id="deck" tone="white">
          <div className="pad pb-10 pt-8 md:pb-14 md:pt-10">
            {/* On desktop the 16:9 stage is sized so the header, slide and controls fit the window together. */}
            <div
              ref={regionRef}
              role="region"
              aria-roledescription="slide deck"
              aria-label={label}
              className="lg:[.js_&]:mx-auto lg:[.js_&]:max-w-[max(640px,calc((100svh-280px)*16/9))]"
            >
              <div className="flex items-end justify-between gap-4 pb-4 md:pb-5">
                <div className="min-w-0">
                  <span className="label hidden sm:inline-flex">{brand}</span>
                  <p className="truncate text-[15px] text-ink-2 sm:mt-2.5">
                    <span className="font-semibold text-ink">{partLabel}</span>
                    {partName && <span className="text-muted"> · {partName}</span>}
                  </p>
                </div>
                <p className="t-serif shrink-0 text-[22px] leading-none tabular-nums md:text-[26px]">
                  {pad(active + 1)} <span className="text-muted">/ {total}</span>
                </p>
              </div>

              <div
                ref={stageRef}
                className="relative overflow-hidden rounded-[16px] border border-line bg-white shadow-float lg:[.js_&]:aspect-video"
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

              <div className="sticky bottom-0 z-20 -mx-5 mt-4 flex items-center gap-3 border-t hairline bg-white/95 px-5 py-3 backdrop-blur-md md:static md:mx-0 md:mt-6 md:gap-6 md:border-t-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
                <button type="button" className="btn btn-line btn-chrome" onClick={() => go(active - 1)} disabled={active === 0}>
                  <ArrowLeft /> <span>Prev</span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="md:hidden">
                    <p className="text-center text-[14.5px] leading-none text-muted">
                      Slide <span className="t-serif text-[17px] tabular-nums text-ink">{active + 1}</span> of {total}
                    </p>
                    <span aria-hidden="true" className="seg mx-auto mt-2.5 block max-w-[140px] overflow-hidden">
                      <span className="seg-on block h-full rounded-[2px] transition-[width] duration-300" style={{ width: `${((active + 1) / total) * 100}%` }} />
                    </span>
                  </div>
                  <div className="hidden items-center gap-4 md:flex" aria-label="Jump to slide" role="group">
                    {parts.map((p, pi) => (
                      <div key={pi} className="flex flex-1 gap-[3px]" style={{ flexGrow: p.count }}>
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
                              className="group flex-1 rounded-full py-3"
                            >
                              <span
                                className={`block rounded-full transition-[background-color,height] duration-200 ${
                                  on ? "h-[5px] bg-ink" : i < active ? "h-[3px] bg-ink/70" : "h-[3px] bg-line-strong group-hover:bg-muted"
                                }`}
                              />
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
          </div>
        </Row>

        <Row id="outline">
          <div className="pad py-16 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="label">Outline</span>
                <h2 className="t-h2 mt-6">
                  Every slide, <span className="t-second">by part.</span>
                </h2>
              </div>
              <p className="t-small">
                {total} slides · {parts.length} parts
                <span className="hidden lg:inline">
                  {" "}
                  · <span className="kbd">←</span> <span className="kbd">→</span> to move
                </span>
              </p>
            </div>
            <div className="mt-10 grid items-start gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
              {parts.map((p, pi) => {
                const [pl, pn] = splitPart(p.title);
                return (
                  <div key={pi} className="panel p-2 md:p-2.5">
                    <h3 className="flex items-start justify-between gap-3 px-3 pb-4 pt-4 md:px-4">
                      <span>
                        <span className="t-mono-sm block text-muted">{pl}</span>
                        {pn && <span className="t-serif mt-2 block text-[24px] leading-tight tracking-[-0.01em]">{pn}</span>}
                      </span>
                      <span className="shrink-0 pt-px text-[13px] text-muted">{p.count} slides</span>
                    </h3>
                    <ol className="border-t hairline pt-2">
                      {Array.from({ length: p.count }, (_, k) => {
                        const i = p.start + k;
                        const s = slides[i];
                        const on = i === active;
                        return (
                          <li key={i} className={`rounded-[10px] transition-colors ${on ? "bg-fill" : ""}`}>
                            <a
                              href={`#slide-${i + 1}`}
                              onClick={(e) => jump(e, i)}
                              aria-current={on ? "true" : undefined}
                              className={`grid grid-cols-[32px_1fr] gap-x-2 rounded-[10px] px-3 py-2.5 md:px-4 ${on ? "" : "hover:bg-paper"}`}
                            >
                              <span className={`t-serif pt-px text-[15px] tabular-nums ${on ? "text-ink" : "text-muted"}`}>{pad(i + 1)}</span>
                              <span>
                                <span className="block text-[15px] font-medium leading-snug">{s.title}</span>
                                <span className="mt-0.5 block text-[13px] text-muted">{s.kind}</span>
                              </span>
                            </a>
                            {s.items.length > 0 && (
                              <ul className="flex flex-wrap gap-1.5 pb-3 pl-[52px] pr-3 md:pl-[56px] md:pr-4">
                                {s.items.map((it) => (
                                  <li key={it.label}>
                                    <a
                                      href={`#slide-${i + 1}`}
                                      onClick={(e) => jump(e, i, it.tab)}
                                      className="inline-block rounded-full border border-line bg-white px-2.5 py-1 text-[12.5px] leading-snug text-ink-2 transition-colors hover:border-ink hover:text-ink"
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
                );
              })}
            </div>
          </div>
        </Row>
      </div>
    </DeckContext.Provider>
  );
}
