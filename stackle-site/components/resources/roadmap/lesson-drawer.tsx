"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Menu } from "@/components/icons";
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
          <div className="flex min-h-[60px] items-center justify-between gap-3 border-b border-line bg-white pl-5 pr-3 md:pl-8">
            <p className="t-mono-sm whitespace-nowrap text-muted">
              {meta && (
                <>
                  {meta.phase} <span aria-hidden="true">·</span> Topic {meta.n}
                  <span className="hidden sm:inline"> of {String(topics.length).padStart(2, "0")}</span>
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center border border-line hover:border-ink disabled:opacity-40 disabled:hover:border-line"
                onClick={() => prevTopic && open(prevTopic.id)}
                disabled={!prevTopic}
                aria-label={prevTopic ? `Previous topic: ${prevTopic.title}` : "No previous topic"}
              >
                <ArrowLeft />
              </button>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center border border-line hover:border-ink disabled:opacity-40 disabled:hover:border-line"
                onClick={() => nextTopic && open(nextTopic.id)}
                disabled={!nextTopic}
                aria-label={nextTopic ? `Next topic: ${nextTopic.title}` : "No next topic"}
              >
                <ArrowRight />
              </button>
              <button type="button" className="btn btn-line btn-chrome gap-2 px-3" onClick={close}>
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

// One cell of a phase's topic grid.
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
      className="group flex h-full min-h-[120px] w-full flex-col gap-4 px-5 py-5 sm:min-h-[148px] sm:gap-5 text-left transition-colors hover:bg-white aria-expanded:bg-ink aria-expanded:text-paper md:px-6 md:py-6"
    >
      <span className="flex w-full items-center justify-between gap-3">
        <span className="t-mono-sm text-muted group-aria-expanded:text-night-muted">{n}</span>
        <span className="t-mono-sm flex items-center gap-2 text-muted transition-colors group-hover:text-ink group-aria-expanded:text-paper">
          Open <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
      <span className="text-[18px] font-medium leading-[1.25] tracking-[-0.015em]">{title}</span>
      <span className="mt-auto flex w-full items-end justify-between gap-3">
        <span className="t-mono-sm text-muted group-aria-expanded:text-night-muted">{category}</span>
        {done > 0 && (
          <span className="t-mono-sm whitespace-nowrap" aria-label={`${done} of ${total} checklist items done`}>
            {done === total ? "Done" : `${done}/${total}`}
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
        <div className="relative h-[2px] flex-1">
          <div className="seg absolute inset-0" />
          <div className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${(done / items.length) * 100}%` }} />
        </div>
        <p className="t-mono-sm whitespace-nowrap text-muted" aria-live="polite">
          {done}/{items.length} done
        </p>
        {done > 0 && (
          <button type="button" className="t-mono-sm text-muted underline decoration-dashed underline-offset-4 hover:text-ink" onClick={() => reset(id)}>
            Clear
          </button>
        )}
      </div>
      <ul className="mt-4 border-t border-line">
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
    <nav aria-label="Lesson sections" className="sticky top-0 z-10 border-y border-line bg-paper/95 backdrop-blur-sm">
      <ul className="flex overflow-x-auto px-2 py-2 sm:gap-1 md:px-6">
        {sections.map((s) => (
          <li key={s.key} className="shrink-0">
            <button
              type="button"
              className="t-mono-sm px-1.5 py-2 text-muted transition-colors hover:bg-white hover:text-ink sm:px-2.5"
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
