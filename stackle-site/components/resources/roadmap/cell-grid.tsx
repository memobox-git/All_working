import type { ReactNode } from "react";

// Hairline grid: cells sit on a 1px "line" background with a 1px gap, so neighbours share one border like a
// table. Incomplete last rows are filled with hatched placeholder cells at every breakpoint.

type N = 1 | 2 | 3 | 4 | 5 | 6;
export type Cols = { base: N; sm?: N; md?: N; lg?: N };

const COLS = {
  base: { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6" },
  sm: { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6" },
  md: { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6" },
  lg: { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6" },
} as const;

const SHOW = {
  base: { true: "block", false: "hidden" },
  sm: { true: "sm:block", false: "sm:hidden" },
  md: { true: "md:block", false: "md:hidden" },
  lg: { true: "lg:block", false: "lg:hidden" },
} as const;

type Bp = keyof typeof COLS;
const BPS: Bp[] = ["base", "sm", "md", "lg"];

export function CellGrid({
  cols,
  items,
  as: Tag = "ul",
  cellClassName = "bg-paper",
  fillerClassName = "bg-paper fill-hatch",
  className = "",
  label,
}: {
  cols: Cols;
  items: ReactNode[];
  as?: "ul" | "ol";
  cellClassName?: string;
  fillerClassName?: string;
  className?: string;
  label?: string;
}) {
  const eff: Record<Bp, number> = { base: cols.base, sm: 0, md: 0, lg: 0 };
  eff.sm = cols.sm ?? eff.base;
  eff.md = cols.md ?? eff.sm;
  eff.lg = cols.lg ?? eff.md;
  const need = (bp: Bp) => (eff[bp] - (items.length % eff[bp])) % eff[bp];
  const fillers = Math.max(...BPS.map(need));
  const colClass = BPS.map((bp) => (bp === "base" || cols[bp] ? COLS[bp][(bp === "base" ? cols.base : cols[bp]) as N] : "")).join(" ");

  return (
    <Tag className={`grid gap-px bg-line ${colClass} ${className}`} aria-label={label}>
      {items.map((it, i) => (
        <li key={i} className={cellClassName}>
          {it}
        </li>
      ))}
      {Array.from({ length: fillers }, (_, i) => {
        let prev: boolean | null = null;
        const vis = BPS.map((bp) => {
          const v = i < need(bp);
          const cls = prev === v ? "" : SHOW[bp][String(v) as "true" | "false"];
          prev = v;
          return cls;
        }).join(" ");
        return <li key={`f${i}`} aria-hidden="true" className={`${fillerClassName} ${vis}`} />;
      })}
    </Tag>
  );
}
