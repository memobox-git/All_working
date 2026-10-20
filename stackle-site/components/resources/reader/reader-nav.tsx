"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Menu, Pixel } from "@/components/icons";
import type { NavGroup } from "./types";

const pad2 = (n: number) => String(n).padStart(2, "0");
const DESKTOP = "(min-width: 1200px)";

// The reader's index. At 1200px and up it is a sticky sidebar; below that it is a sticky bar with the
// current lesson, a dotted progress strip and a "Contents" button that opens a bottom sheet.
// It only receives titles and anchors; the lesson bodies are server-rendered next to it.
export function ReaderNav({
  groups,
  readerId,
  navLabel,
  unit,
  summary,
  progressLabel = "Progress",
  extra,
}: {
  groups: NavGroup[];
  readerId: string; // element that wraps all lessons, used for the progress fraction
  navLabel: string;
  unit: string; // "Lesson" or "Topic"
  summary: string; // e.g. "13 lessons · 138 min"
  progressLabel?: string;
  extra?: ReactNode; // optional footer in the desktop sidebar
}) {
  const items = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const [active, setActive] = useState(0);
  const [pct, setPct] = useState(0);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const sideListRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetListRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const refocus = useRef(true);

  // Which lesson is under the reading line, and how far through the reader the page is.
  useEffect(() => {
    const reader = document.getElementById(readerId);
    const els = items.map((it) => document.getElementById(it.id));
    const desk = window.matchMedia(DESKTOP);
    let raf = 0;
    const measure = () => {
      raf = 0;
      const top = desk.matches ? 72 : (barRef.current?.getBoundingClientRect().bottom ?? 124);
      const line = top + Math.min(96, window.innerHeight * 0.15);
      let idx = 0;
      els.forEach((el, i) => {
        if (el && el.offsetHeight > 0 && el.getBoundingClientRect().top <= line) idx = i;
      });
      if (reader) {
        const r = reader.getBoundingClientRect();
        // At the end of the reader the last lesson may be too short to reach the line.
        if (r.bottom <= window.innerHeight + 2) {
          for (let i = els.length - 1; i >= 0; i--) {
            if (els[i] && els[i]!.offsetHeight > 0) {
              idx = i;
              break;
            }
          }
        }
        const p = (window.innerHeight - r.top) / Math.max(1, r.height);
        setPct(Math.round(Math.max(0, Math.min(1, p)) * 100));
      }
      setActive(idx);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    const ro = reader && "ResizeObserver" in window ? new ResizeObserver(schedule) : null;
    if (ro && reader) ro.observe(reader);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      ro?.disconnect();
    };
  }, [items, readerId]);

  // Old links used ?lesson=<id>; send them to the matching anchor.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("lesson");
    if (!id || window.location.hash || !items.some((it) => it.id === id)) return;
    document.getElementById(id)?.scrollIntoView();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}#${id}`);
  }, [items]);

  // Keep the current lesson visible inside a scrolling list.
  useEffect(() => {
    for (const list of [sideListRef.current, sheetListRef.current]) {
      if (!list || list.clientHeight === 0) continue;
      const a = list.querySelector<HTMLElement>(`[data-i="${active}"]`);
      if (!a) continue;
      const top = a.offsetTop;
      if (top < list.scrollTop + 24 || top + a.offsetHeight > list.scrollTop + list.clientHeight - 24) {
        list.scrollTop = Math.max(0, top - list.clientHeight / 3);
      }
    }
  }, [active, open]);

  // Contents sheet: lock page scroll, close on Escape, keep Tab inside, return focus on close.
  useEffect(() => {
    if (!open) return;
    refocus.current = true;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desk = window.matchMedia(DESKTOP);
    const onDesk = () => desk.matches && setOpen(false);
    desk.addEventListener("change", onDesk);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;
      const f = sheetRef.current.querySelectorAll<HTMLElement>("a[href], button");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    sheetRef.current?.querySelector<HTMLElement>("button")?.focus();
    const toggle = toggleRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      desk.removeEventListener("change", onDesk);
      if (refocus.current) toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  const current = items[active] ?? items[0];
  const counter = `${pad2(active + 1)}/${pad2(items.length)}`;

  const bar = (className: string) => (
    <div
      className={`h-[2px] ${className}`}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="seg absolute inset-0" />
      <div className="seg seg-on absolute inset-y-0 left-0" style={{ width: `${pct}%` }} />
    </div>
  );

  const list = (onPick?: () => void) => {
    let i = -1;
    return groups.map((g) => (
      <div key={g.label} className="pt-5">
        <p className="t-mono-sm px-5 pb-2 text-muted">{g.label}</p>
        <ol>
          {g.items.map((it) => {
            i += 1;
            const idx = i;
            const cur = idx === active;
            return (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  data-i={idx}
                  aria-current={cur ? "location" : undefined}
                  onClick={onPick}
                  className={`grid grid-cols-[24px_minmax(0,1fr)_10px] items-baseline gap-2 px-5 py-[9px] text-[14px] leading-snug transition-colors ${cur ? "bg-ink text-paper" : "text-ink-2 hover:bg-white hover:text-ink"}`}
                >
                  <span className={`t-mono-sm ${cur ? "text-night-muted" : "text-muted"}`}>{it.num}</span>
                  <span>{it.title}</span>
                  {idx < active ? <Pixel name="check" size={10} className="self-center text-muted" /> : <span />}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    ));
  };

  const closeSheet = (returnFocus: boolean) => {
    refocus.current = returnFocus;
    setOpen(false);
  };

  return (
    <div className="sticky top-[68px] z-30 md:top-[72px] min-[1200px]:h-[calc(100dvh-72px)] min-[1200px]:self-start">
      {/* below 1200px: current lesson bar */}
      <div ref={barRef} className="relative flex h-14 items-center gap-3 border-y border-line bg-paper pl-3 pr-4 md:pl-4 min-[1200px]:hidden">
        <button
          ref={toggleRef}
          type="button"
          className="btn btn-line btn-chrome shrink-0 !min-h-[38px] gap-2 !px-3"
          aria-expanded={open}
          aria-controls="reader-contents"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <Menu />
          Contents
        </button>
        <p className="min-w-0 flex-1 truncate text-[14px] text-ink">
          <span className="t-mono-sm mr-2 text-muted">{counter}</span>
          {current?.title}
        </p>
        {bar("absolute inset-x-0 -bottom-px")}
      </div>

      {/* 1200px and up: sticky sidebar */}
      <div className="hidden h-full flex-col min-[1200px]:flex">
        <div className="border-b border-line px-5 pb-5 pt-6">
          <p className="t-mono-sm text-muted">Contents</p>
          <p className="mt-2 text-[15px] font-medium tracking-[-0.01em] text-ink">{summary}</p>
          <div className="t-mono-sm mt-5 flex items-center justify-between">
            <span className="text-muted">{progressLabel}</span>
            <span className="text-ink">
              {unit} {counter}
            </span>
          </div>
          {bar("relative mt-3")}
        </div>
        <nav ref={sideListRef} aria-label={navLabel} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
          {list()}
        </nav>
        {extra && <div className="border-t border-line px-5 py-4">{extra}</div>}
      </div>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[60] min-[1200px]:hidden">
            <div className="absolute inset-0 bg-ink/40" aria-hidden="true" onClick={() => closeSheet(true)} />
            <div
              ref={sheetRef}
              id="reader-contents"
              role="dialog"
              aria-modal="true"
              aria-label={navLabel}
              className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col border-t border-ink bg-paper"
            >
              <div className="flex items-center justify-between gap-3 border-b border-line py-2 pl-5 pr-3">
                <div>
                  <p className="t-mono-sm text-muted">Contents</p>
                  <p className="mt-1 text-[15px] font-medium tracking-[-0.01em] text-ink">{summary}</p>
                </div>
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center border border-ink text-ink"
                  aria-label="Close contents"
                  onClick={() => closeSheet(true)}
                >
                  <Menu open />
                </button>
              </div>
              <nav ref={sheetListRef} aria-label={navLabel} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
                {list(() => closeSheet(false))}
              </nav>
              <div className="border-t border-line px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-3">
                <div className="t-mono-sm flex items-center justify-between">
                  <span className="text-muted">{progressLabel}</span>
                  <span className="text-ink">
                    {unit} {counter}
                  </span>
                </div>
                {bar("relative mt-2")}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
