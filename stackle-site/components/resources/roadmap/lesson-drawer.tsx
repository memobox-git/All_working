"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Menu, Pixel } from "@/components/icons";
import styles from "./roadmap.module.css";

// The interactive layer of a roadmap page. Every lesson is rendered on the server (passed in as `panels`) and
// sits in the HTML inside the hidden drawer; this component only decides which one is visible.
// - Topic buttons open their lesson, set aria-expanded, and write #<topic-id> to the URL.
// - #<topic-id> deep links (on load and on hashchange) open the matching lesson.
// - Esc, the close button and the backdrop close it; focus moves into the drawer and back to the topic.
// - Checklist ticks are kept per page in localStorage (best effort: storage can be blocked).

export type TopicMeta = { id: string; n: string; title: string; phase: string; total: number };

type Ctx = {
  openId: string | null;
  open: (id: string) => void;
  checked: Record<string, number[]>;
  toggle: (id: string, i: number) => void;
  reset: (id: string) => void;
};

const LessonCtx = createContext<Ctx | null>(null);

function useLessons() {
  const c = useContext(LessonCtx);
  if (!c) throw new Error("Roadmap lesson components must sit inside <LessonProvider>");
  return c;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function LessonProvider({
  storageKey,
  topics,
  panels,
  children,
}: {
  storageKey: string;
  topics: TopicMeta[];
  panels: ReactNode[];
  children: ReactNode;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, number[]>>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const prevOpen = useRef<string | null>(null);
  const ids = useMemo(() => new Set(topics.map((t) => t.id)), [topics]);
  const index = topics.findIndex((t) => t.id === openId);
  const meta = index >= 0 ? topics[index] : null;

  // Saved checklist progress.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const v: unknown = raw ? JSON.parse(raw) : null;
      if (v && typeof v === "object") {
        const clean: Record<string, number[]> = {};
        for (const [k, list] of Object.entries(v as Record<string, unknown>)) {
          if (Array.isArray(list)) clean[k] = list.filter((x): x is number => Number.isInteger(x));
        }
        setChecked(clean);
      }
    } catch {
      /* storage blocked or corrupt: start empty */
    }
  }, [storageKey]);

  const save = useCallback(
    (next: Record<string, number[]>) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  const toggle = useCallback(
    (id: string, i: number) =>
      setChecked((prev) => {
        const set = new Set(prev[id] ?? []);
        if (set.has(i)) set.delete(i);
        else set.add(i);
        const next = { ...prev, [id]: [...set].sort((a, b) => a - b) };
        save(next);
        return next;
      }),
    [save],
  );

  const reset = useCallback(
    (id: string) =>
      setChecked((prev) => {
        const next = { ...prev };
        delete next[id];
        save(next);
        return next;
      }),
    [save],
  );

  const open = useCallback(
    (id: string) => {
      if (!ids.has(id)) return;
      setOpenId(id);
      try {
        window.history.replaceState(window.history.state, "", `#${id}`);
      } catch {}
    },
    [ids],
  );

  const close = useCallback(() => {
    setOpenId(null);
    try {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    } catch {}
  }, []);

  // Deep links: #<topic-id> on load and whenever the hash changes.
  useEffect(() => {
    const fromHash = () => {
      let id = "";
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {}
      if (ids.has(id)) setOpenId(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [ids]);

  // Focus in on open (and on prev/next), back to the topic button on close; lock page scroll while open.
  useEffect(() => {
    const prev = prevOpen.current;
    prevOpen.current = openId;
    if (openId) {
      document.body.style.overflow = "hidden";
      bodyRef.current?.scrollTo(0, 0);
      document.getElementById(`lesson-${openId}-title`)?.focus({ preventScroll: true });
    } else if (prev) {
      document.body.style.overflow = "";
      document.getElementById(prev)?.focus();
    }
  }, [openId]);

  useEffect(() => () => void (document.body.style.overflow = ""), []);

  // Esc closes; Tab stays inside the dialog.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active && dialogRef.current.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId, close]);

  const prevTopic = index > 0 ? topics[index - 1] : null;
  const nextTopic = index >= 0 && index < topics.length - 1 ? topics[index + 1] : null;
  const ctx = useMemo(() => ({ openId, open, checked, toggle, reset }), [openId, open, checked, toggle, reset]);

  return (
    <LessonCtx.Provider value={ctx}>
      {children}
      <div className={styles.root} hidden={!openId}>
        <div className={styles.backdrop} onClick={close} aria-hidden="true" />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={openId ? `lesson-${openId}-title` : undefined}
          className={styles.sheet}
        >
          <div className="flex min-h-[64px] items-center justify-between gap-3 border-b hairline pl-5 pr-3 md:pl-8 md:pr-4">
            <p className="whitespace-nowrap text-[14px] text-muted">
              {meta && (
                <>
                  <span className="t-serif text-[15px] text-ink">{meta.phase}</span> <span aria-hidden="true">·</span> Topic {meta.n}
                  <span className="hidden sm:inline"> of {String(topics.length).padStart(2, "0")}</span>
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-white transition-colors hover:border-ink disabled:opacity-40 disabled:hover:border-line-strong"
                onClick={() => prevTopic && open(prevTopic.id)}
                disabled={!prevTopic}
                aria-label={prevTopic ? `Previous topic: ${prevTopic.title}` : "No previous topic"}
              >
                <ArrowLeft />
              </button>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-white transition-colors hover:border-ink disabled:opacity-40 disabled:hover:border-line-strong"
                onClick={() => nextTopic && open(nextTopic.id)}
                disabled={!nextTopic}
                aria-label={nextTopic ? `Next topic: ${nextTopic.title}` : "No next topic"}
              >
                <ArrowRight />
              </button>
              <button type="button" className="btn btn-line btn-chrome ml-1 h-10 min-h-0 gap-2 rounded-full px-4" onClick={close}>
                <Menu open />
                Close
              </button>
            </div>
          </div>
          <div ref={bodyRef} className={styles.body}>
            {topics.map((t, i) => (
              <div key={t.id} id={`lesson-${t.id}`} hidden={t.id !== openId}>
                {panels[i]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LessonCtx.Provider>
  );
}

// One card in a phase's topic grid.
export function TopicButton({ id, n, title, category, total }: { id: string; n: string; title: string; category: string; total: number }) {
  const { openId, open, checked } = useLessons();
  const done = checked[id]?.length ?? 0;
  return (
    <button
      id={id}
      type="button"
      aria-expanded={openId === id}
      aria-controls={`lesson-${id}`}
      aria-haspopup="dialog"
      onClick={() => open(id)}
      className="panel group flex h-full min-h-[176px] w-full flex-col p-5 text-left transition-[box-shadow,border-color,background-color] hover:border-line-strong hover:shadow-[0_30px_60px_-30px_rgba(21,21,19,0.35)] aria-expanded:border-ink aria-expanded:bg-ink aria-expanded:text-paper md:p-6"
    >
      <span className="flex w-full items-start justify-between gap-3">
        <span className="t-serif text-[16px] leading-none text-muted group-aria-expanded:text-night-muted">{n}</span>
        <span className="rounded-full border border-line px-2.5 py-1 text-[12.5px] leading-none text-ink-2 group-aria-expanded:border-night-line group-aria-expanded:text-night-muted">
          {category}
        </span>
      </span>
      <span className="t-serif mt-5 text-[21px] leading-[1.2] tracking-[-0.01em]">{title}</span>
      <span className="mt-auto flex w-full items-center justify-between gap-3 pt-6">
        <span className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold">
          Open lesson <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </span>
        {done > 0 && (
          <span
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-fill px-2.5 py-1 text-[12.5px] font-medium leading-none text-ink group-aria-expanded:bg-night-3 group-aria-expanded:text-paper"
            aria-label={`${done} of ${total} checklist items done`}
          >
            {done === total ? (
              <>
                <Pixel name="check" size={13} /> Done
              </>
            ) : (
              `${done} of ${total} done`
            )}
          </span>
        )}
      </span>
    </button>
  );
}

// Tickable checklist inside a lesson. The items are part of the server HTML; ticks are restored after load.
export function Checklist({ id, items }: { id: string; items: string[] }) {
  const { checked, toggle, reset } = useLessons();
  const set = new Set(checked[id] ?? []);
  const done = items.filter((_, i) => set.has(i)).length;
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-fill" aria-hidden="true">
          <div className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-300" style={{ width: `${(done / items.length) * 100}%` }} />
        </div>
        <p className="whitespace-nowrap text-[13.5px] text-muted" aria-live="polite">
          {done} of {items.length} done
        </p>
        {done > 0 && (
          <button type="button" className="text-[13.5px] font-semibold text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-ink" onClick={() => reset(id)}>
            Clear
          </button>
        )}
      </div>
      <ul className="mt-3 border-t hairline">
        {items.map((it, i) => (
          <li key={i}>
            <label className={styles.item}>
              <input type="checkbox" className={styles.check} checked={set.has(i)} onChange={() => toggle(id, i)} />
              <span>{it}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Jump links between a lesson's sections (scrolls the drawer, not the page, and leaves the URL alone).
export function SectionNav({ id, sections }: { id: string; sections: { key: string; label: string }[] }) {
  return (
    <nav aria-label="Lesson sections" className="sticky top-0 z-10 border-y hairline bg-white/95 backdrop-blur-sm">
      <ul className="flex gap-2 overflow-x-auto px-5 py-3 md:px-8">
        {sections.map((s) => (
          <li key={s.key} className="shrink-0">
            <button
              type="button"
              className="rounded-full border border-line px-3.5 py-1.5 text-[14px] font-medium text-ink-2 transition-colors hover:border-ink hover:text-ink"
              onClick={() => {
                const el = document.getElementById(`lesson-${id}-${s.key}`);
                if (!el) return;
                const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
                el.focus({ preventScroll: true });
              }}
            >
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
