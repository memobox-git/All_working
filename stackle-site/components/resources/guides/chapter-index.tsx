"use client";

import { useEffect, useRef, useState } from "react";

export type ChapterIndexItem = { id: string; number: string; label: string; count: number };

// Chapter index for long guides. Below 1200px it is a sticky strip of rounded pills that scrolls sideways;
// from 1200px it is a calm sticky list next to the text (serif numbers, a rounded fill for the current chapter). Plain anchor links, so it works without JS;
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
      className="sticky top-[72px] z-30 min-w-0 self-start border-b hairline bg-paper/95 backdrop-blur-md md:top-[80px] min-[1200px]:border-b-0 min-[1200px]:bg-transparent min-[1200px]:pb-10 min-[1200px]:pl-10 min-[1200px]:pr-4 min-[1200px]:backdrop-blur-none"
    >
      <p className="label hidden pb-5 pt-14 min-[1200px]:inline-flex">{label}</p>
      <ol
        ref={listRef}
        className="flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] md:max-[1199px]:px-10 min-[1200px]:flex-col min-[1200px]:gap-0.5 min-[1200px]:-ml-3.5 min-[1200px]:overflow-visible min-[1200px]:p-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id} className="shrink-0">
              <a
                href={`#${it.id}`}
                data-id={it.id}
                aria-current={on ? "true" : undefined}
                className={`flex items-baseline gap-2.5 whitespace-nowrap rounded-full border px-4 py-2 text-[14.5px] font-medium transition-colors min-[1200px]:gap-3 min-[1200px]:rounded-[10px] min-[1200px]:border-0 min-[1200px]:px-3.5 min-[1200px]:py-2.5 min-[1200px]:text-[15.5px] ${
                  on
                    ? "border-ink bg-ink text-paper min-[1200px]:bg-fill min-[1200px]:text-ink"
                    : "border-line-strong bg-white text-ink-2 hover:border-ink hover:text-ink min-[1200px]:bg-transparent min-[1200px]:hover:bg-fill/60"
                }`}
              >
                <span className={`t-serif text-[14px] tabular-nums min-[1200px]:text-[15px] ${on ? "text-night-muted min-[1200px]:text-ink" : "text-muted"}`}>{it.number}</span>
                <span>{it.label}</span>
                <span className="ml-auto hidden pl-3 text-[13px] font-normal tabular-nums text-muted min-[1200px]:inline">{it.count}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
