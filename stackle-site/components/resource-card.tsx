import Link from "next/link";
import type { ResourceItem } from "@/content/resources";
import { ArrowRight, Pixel } from "./icons";

export function ResourceCard({ r, className = "" }: { r: ResourceItem; n?: number; className?: string }) {
  return (
    <Link href={`/resources/${r.slug}`} className={`panel group relative flex min-h-[290px] flex-col p-6 transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(21,21,19,0.35)] md:p-7 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="icon-tile">
          <Pixel name={r.glyph} size={19} />
        </span>
        {r.badge && <span className="rounded-full border border-line-strong px-2.5 py-1 text-[12px] font-semibold text-ink-2">{r.badge}</span>}
      </div>
      <p className="t-mono-sm mt-7 text-muted">{r.group}</p>
      <h3 className="t-h4 mt-2">{r.title}</h3>
      <p className="t-small mt-3">{r.summary}</p>
      <div className="mt-auto flex items-end justify-between pt-6">
        <span className="flex items-baseline gap-2">
          <span className="t-pixel text-[30px] leading-none">{r.stat.value}</span>
          <span className="text-[13px] text-muted">{r.stat.label}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold">
          Open <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
