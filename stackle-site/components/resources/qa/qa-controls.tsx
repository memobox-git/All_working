"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "@/components/icons";
import type { QaFilterDef } from "./types";
import s from "./qa.module.css";

// The toolbar: search, single-select filter, live count, expand/collapse. It never receives the questions:
// it filters the server-rendered rows inside #zoneId by toggling `hidden`, reading their data-* attributes.
// Answer text is indexed from the DOM the first time someone searches.
export function QaControls({ zoneId, total, filters, placeholder }: { zoneId: string; total: number; filters: QaFilterDef[]; placeholder: string }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [shown, setShown] = useState(total);
  const barRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useRef<Map<HTMLElement, string> | null>(null);
  const touched = useRef(false);
  const scrollTo = useRef<HTMLElement | null>(null);

  // Apply search + filter to the rows, the category groups, the category index and the empty state.
  useEffect(() => {
    const zone = document.getElementById(zoneId);
    if (!zone) return;
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!touched.current && !terms.length && filter === "all") return; // first render: the HTML is already right
    touched.current = true;

    const items = zone.querySelectorAll<HTMLElement>("[data-q]");
    if (terms.length && !index.current) {
      const map = new Map<HTMLElement, string>();
      items.forEach((el) => {
        const text = Array.from(el.querySelectorAll("details > div p, details > div li, details > div pre"), (n) => n.textContent ?? "").join(" ");
        map.set(el, `${el.dataset.s ?? ""} ${text}`.toLowerCase().replace(/\s+/g, " "));
      });
      index.current = map;
    }
    const f = filters.find((x) => x.id === filter);
    const perCat = new Map<string, number>();
    let n = 0;
    items.forEach((el) => {
      const okFilter = !f?.attr || el.dataset[f.attr] === f.value;
      const text = terms.length ? (index.current?.get(el) ?? "") : "";
      const ok = okFilter && terms.every((t) => text.includes(t));
      el.hidden = !ok;
      if (ok) {
        n++;
        const c = el.closest("[data-cat]")?.id ?? "";
        perCat.set(c, (perCat.get(c) ?? 0) + 1);
      }
    });
    zone.querySelectorAll<HTMLElement>("[data-cat]").forEach((sec) => (sec.hidden = !perCat.get(sec.id)));
    zone.querySelectorAll<HTMLElement>("[data-cat-link]").forEach((el) => (el.hidden = !perCat.get(el.dataset.catLink ?? "")));
    zone.querySelectorAll<HTMLElement>("[data-cat-n]").forEach((el) => (el.textContent = String(perCat.get(el.dataset.catN ?? "") ?? 0)));
    zone.querySelectorAll<HTMLElement>("[data-cat-count]").forEach((el) => {
      const c = perCat.get(el.dataset.catCount ?? "") ?? 0;
      el.textContent = `${c} question${c === 1 ? "" : "s"}`;
    });
    const empty = zone.querySelector<HTMLElement>("[data-qa-empty]");
    if (empty) empty.hidden = n > 0;
    setShown(n);
    // If the reader is deep in the list, bring the top of the (now shorter) list back under the toolbar.
    // Layout offsets only: right after hiding rows the scroll offset can be stale, so rects can't be trusted.
    const list = document.getElementById("questions");
    const bar = barRef.current?.closest("section");
    if (list && bar) {
      const head = parseFloat(getComputedStyle(zone).getPropertyValue("--qa-head")) || 0;
      const target = list.offsetTop - head - bar.offsetHeight;
      if (window.scrollY > target + 1) window.scrollTo(0, target);
    }
    if (scrollTo.current && !scrollTo.current.hidden) {
      scrollTo.current.scrollIntoView();
      scrollTo.current = null;
    }
  }, [query, filter, filters, zoneId]);

  // Deep links (#q-12): open the answer, and clear the filters first if they hide it.
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!/^q-\d+$/.test(id)) return;
      const el = document.getElementById(id);
      const details = el?.querySelector("details");
      if (!el || !details) return;
      details.open = true;
      if (el.hidden) {
        scrollTo.current = el;
        setQuery("");
        setFilter("all");
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  // Keep the sticky offsets (side index, anchor scroll margins) equal to the toolbar's real height.
  useEffect(() => {
    const zone = document.getElementById(zoneId);
    const row = barRef.current?.closest("section");
    if (!zone || !row || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => zone.style.setProperty("--qa-bar", `${Math.ceil(row.getBoundingClientRect().height)}px`));
    ro.observe(row);
    return () => ro.disconnect();
  }, [zoneId]);

  // The empty state's "Clear" button lives in the server-rendered list.
  useEffect(() => {
    const btn = document.getElementById(zoneId)?.querySelector("[data-qa-reset]");
    const reset = () => {
      setQuery("");
      setFilter("all");
      inputRef.current?.focus();
    };
    btn?.addEventListener("click", reset);
    return () => btn?.removeEventListener("click", reset);
  }, [zoneId]);

  // Mark the category in view in the side index.
  useEffect(() => {
    const zone = document.getElementById(zoneId);
    if (!zone || typeof IntersectionObserver === "undefined") return;
    const sections = Array.from(zone.querySelectorAll<HTMLElement>("[data-cat]"));
    const links = zone.querySelectorAll<HTMLElement>("[data-side-link]");
    const inView = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inView.add(e.target.id) : inView.delete(e.target.id)));
        const current = sections.find((sec) => inView.has(sec.id))?.id;
        links.forEach((a) => (a.dataset.sideLink === current ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current")));
      },
      { rootMargin: "-180px 0px -60% 0px" },
    );
    sections.forEach((sec) => io.observe(sec));
    return () => io.disconnect();
  }, [zoneId]);

  const setAll = (open: boolean) => {
    document.getElementById(zoneId)?.querySelectorAll<HTMLElement>("[data-q]").forEach((el) => {
      const d = el.querySelector("details");
      if (d && !(open && el.hidden)) d.open = open;
    });
  };

  return (
    <div ref={barRef} className={s.bar}>
      <div className={s.search}>
        <Search />
        <input
          ref={inputRef}
          type="search"
          className={s.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          placeholder={placeholder}
          aria-label="Search questions and answers"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
        />
        {query && (
          <button
            type="button"
            className={s.clear}
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            Clear
          </button>
        )}
      </div>
      <div role="group" aria-label="Filter questions" className={s.chips}>
        <span className={s.chipLabel} aria-hidden="true">
          Filter
        </span>
        {filters.map((f) => (
          <button key={f.id} type="button" className={s.chip} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className={s.meta}>
        <p className={s.count} aria-live="polite" aria-atomic="true">
          <b>{shown}</b> / {total} questions
        </p>
        <button type="button" className={s.tool} onClick={() => setAll(true)} aria-label="Expand all answers">
          Expand<span className={s.toolAll}> all</span>
        </button>
        <button type="button" className={s.tool} onClick={() => setAll(false)} aria-label="Collapse all answers">
          Collapse<span className={s.toolAll}> all</span>
        </button>
      </div>
    </div>
  );
}
