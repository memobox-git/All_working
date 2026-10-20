import type { ReactNode } from "react";

// Numbered disclosure list in the Sigil "Questions" style. Native <details>, so it works without JS.
export function Accordion({ items, startAt = 1, className = "" }: { items: { q: ReactNode; a: ReactNode; id?: string }[]; startAt?: number; className?: string }) {
  return (
    <div className={`border-t hairline ${className}`}>
      {items.map((it, i) => (
        <details key={i} id={it.id} className="group border-b hairline">
          <summary className="grid grid-cols-[36px_1fr_20px] items-center gap-3 py-5 md:grid-cols-[52px_1fr_24px] md:py-6">
            <span className="t-mono-sm text-muted">{String(i + startAt).padStart(2, "0")}</span>
            <span className="text-[17px] font-medium tracking-[-0.01em] md:text-[19px]">{it.q}</span>
            <span aria-hidden="true" className="relative h-3 w-3 justify-self-end">
              <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
              <span className="absolute left-1/2 top-0 h-3 w-px bg-current transition-transform group-open:scale-y-0" />
            </span>
          </summary>
          <div className="t-body pb-6 pl-[48px] pr-6 md:pl-[64px] md:pr-12">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
