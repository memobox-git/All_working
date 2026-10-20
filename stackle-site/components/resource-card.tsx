import Link from "next/link";
import type { ResourceItem } from "@/content/resources";
import { ArrowUpRight, Pixel } from "./icons";

export function ResourceCard({ r, n, className = "" }: { r: ResourceItem; n?: number; className?: string }) {
  return (
    <Link href={`/resources/${r.slug}`} className={`group relative flex min-h-[300px] flex-col bg-white p-6 transition-colors hover:bg-paper md:p-7 ${className}`}>
      <div className="flex items-start justify-between">
        <span className="grid h-12 w-12 place-items-center border border-line bg-paper transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
          <Pixel name={r.glyph} size={18} />
        </span>
        <span className="flex items-center gap-2">
          {r.badge && <span className="t-mono-sm border border-ink px-1.5 py-1">{r.badge}</span>}
          {n !== undefined && <span className="t-mono-sm text-muted">{String(n).padStart(2, "0")}</span>}
        </span>
      </div>
      <p className="t-mono-sm mt-8 text-muted">{r.group}</p>
      <h3 className="t-h4 mt-2">{r.title}</h3>
      <p className="t-small mt-3">{r.summary}</p>
      <div className="mt-auto flex items-end justify-between pt-6">
        <span className="flex items-baseline gap-2">
          <span className="t-pixel text-[28px] leading-none">{r.stat.value}</span>
          <span className="t-mono-sm text-muted">{r.stat.label}</span>
        </span>
        <ArrowUpRight size={16} className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>
    </Link>
  );
}
