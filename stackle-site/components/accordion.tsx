import type { ReactNode } from "react";

// Numbered disclosure list in the Sigil "Questions" style. Native <details>, so it works without JS.
export function Accordion({ items, startAt = 1, numbered = true, className = "" }: { items: { q: ReactNode; a: ReactNode; id?: string }[]; startAt?: number; numbered?: boolean; className?: string }) {
  return (
    <div className={`border-t hairline ${className}`}>
      {items.map((it, i) => (
        <details key={i} id={it.id} className="group border-b hairline">
          <summary className={`grid items-center gap-3 py-5 md:py-6 ${numbered ? "grid-cols-[36px_1fr_20px] md:grid-cols-[52px_1fr_24px]" : "grid-cols-[1fr_20px] md:grid-cols-[1fr_24px]"}`}>
            {numbered && <span className="t-mono-sm text-muted">{String(i + startAt).padStart(2, "0")}</span>}
            <span className="text-[17px] font-medium tracking-[-0.01em] md:text-[19px]">{it.q}</span>
            <span aria-hidden="true" className="relative h-3 w-3 justify-self-end">
              <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
              <span className="absolute left-1/2 top-0 h-3 w-px bg-current transition-transform group-open:scale-y-0" />
            </span>
          </summary>
          <div className={`t-body pb-6 pr-6 md:pr-12 ${numbered ? "pl-[48px] md:pl-[64px]" : ""}`}>{it.a}</div>
        </details>
      ))}
    </div>
  );
}
