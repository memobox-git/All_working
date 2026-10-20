"use client";

import { useEffect, useRef, useState } from "react";

export type ChapterIndexItem = { id: string; number: string; label: string; count: number };

// Chapter index for long guides. Below 1200px it is a sticky strip of chips that scrolls sideways;
// from 1200px it is a sticky column next to the text. Plain anchor links, so it works without JS;
// the script only marks the chapter currently in view.
export function ChapterIndex({ items, label = "Chapters" }: { items: ChapterIndexItem[]; label?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerWidth >= 1200 ? 160 : 200;
      let current = items[0]?.id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) current = it.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  // Keep the active chip visible in the sideways strip.
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth + 1) return;
    const a = list.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!a) return;
    const lr = list.getBoundingClientRect();
    const ar = a.getBoundingClientRect();
    const left = list.scrollLeft + (ar.left - lr.left) - (list.clientWidth - ar.width) / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [active]);

  return (
    <nav
      aria-label={label}
      className="sticky top-[68px] z-30 min-w-0 self-start border-b hairline bg-paper/95 backdrop-blur-md md:top-[72px] min-[1200px]:border-b-0 min-[1200px]:bg-transparent min-[1200px]:backdrop-blur-none"
    >
      <p className="t-mono-sm hidden px-6 pb-4 pt-10 text-muted min-[1200px]:block">{label}</p>
      <ol
        ref={listRef}
        className="flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] md:max-[1199px]:px-8 min-[1200px]:block min-[1200px]:overflow-visible hairline min-[1200px]:border-t min-[1200px]:px-0 min-[1200px]:py-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id} className="shrink-0">
              <a
                href={`#${it.id}`}
                data-id={it.id}
                aria-current={on ? "true" : undefined}
                className={`group flex items-center gap-2 whitespace-nowrap border px-3 py-2.5 transition-colors min-[1200px]:gap-3 min-[1200px]:border-0 min-[1200px]:border-b min-[1200px]:px-6 min-[1200px]:py-4 ${
                  on
                    ? "border-ink bg-ink text-paper min-[1200px]:border-ink"
                    : "border-line bg-white text-ink hover:border-ink min-[1200px]:border-line min-[1200px]:bg-transparent min-[1200px]:hover:bg-white"
                }`}
              >
                <span className={`t-mono-sm tabular-nums ${on ? "text-night-muted" : "text-muted"}`}>{it.number}</span>
                <span className="t-mono">{it.label}</span>
                <span className={`t-mono-sm ml-auto hidden pl-3 tabular-nums min-[1200px]:inline ${on ? "text-night-muted" : "text-muted"}`}>
                  {it.count}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
