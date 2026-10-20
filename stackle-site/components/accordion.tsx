import type { ReactNode } from "react";

// Disclosure list in the Folistead FAQ style: hairline rows, a round +/- button. Native <details>, works without JS.
export function Accordion({ items, startAt = 1, numbered = false, className = "" }: { items: { q: ReactNode; a: ReactNode; id?: string }[]; startAt?: number; numbered?: boolean; className?: string }) {
  return (
    <div className={`border-t hairline ${className}`}>
      {items.map((it, i) => (
        <details key={i} id={it.id} className="group border-b hairline">
          <summary className={`grid items-center gap-4 py-5 md:py-6 ${numbered ? "grid-cols-[34px_1fr_32px] md:grid-cols-[44px_1fr_32px]" : "grid-cols-[1fr_32px]"}`}>
            {numbered && <span className="t-serif text-[15px] text-muted">{String(i + startAt).padStart(2, "0")}</span>}
            <span className="text-[16.5px] font-semibold leading-snug md:text-[17.5px]">{it.q}</span>
            <span aria-hidden="true" className="relative grid h-8 w-8 place-items-center justify-self-end rounded-full border border-line-strong transition-colors group-open:border-ink group-open:bg-ink group-open:text-paper">
              <span className="absolute h-px w-3 bg-current" />
              <span className="absolute h-3 w-px bg-current transition-transform group-open:scale-y-0" />
            </span>
          </summary>
          <div className={`t-body max-w-[680px] pb-6 pr-12 ${numbered ? "pl-[50px] md:pl-[60px]" : ""}`}>{it.a}</div>
        </details>
      ))}
    </div>
  );
}
