import Link from "next/link";
import type { ReactNode } from "react";
import { Row } from "@/components/row";
import { ArrowUpRight, Pixel } from "@/components/icons";
import { site } from "@/content/site";

// The top and bottom of every /resources/* page, so the library feels like one product.
// Pages put their own content between <ResourceHero> and <ResourceCta>, in <Row>s numbered from "03".

export function ResourceHero({
  category,
  title,
  second,
  summary,
  meta = [],
  children,
}: {
  category: string; // e.g. "Roadmaps"
  title: ReactNode;
  second?: ReactNode; // optional muted second line of the title
  summary?: ReactNode;
  meta?: { label: string; value: string }[]; // up to 4 stat cells, e.g. { label: "Questions", value: "295" }
  children?: ReactNode; // optional extra (buttons, search) under the summary
}) {
  return (
    <>
      <Row n="01" tone="white" showInlineNum={false}>
        <nav aria-label="Breadcrumb" className="t-mono pad flex items-center gap-2 py-4 text-muted">
          <Link href="/resources" className="hover:text-ink">Resources</Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink">{category}</span>
          <span className="ml-auto hidden items-center gap-2 sm:flex">
            <Pixel name="star" size={11} /> Free
          </span>
        </nav>
      </Row>
      <Row n="02">
        <div className="pad pb-12 pt-10 md:pb-16 md:pt-20">
          <div className="reveal max-w-[900px]">
            <span className="label">{category}</span>
            <h1 className="t-display mt-6">
              {title}
              {second && (
                <>
                  <br />
                  <span className="t-second">{second}</span>
                </>
              )}
            </h1>
            {summary && <p className="t-lede mt-6 max-w-[640px]">{summary}</p>}
            {children && <div className="mt-8">{children}</div>}
          </div>
        </div>
        {meta.length > 0 && (
          <dl className="grid grid-cols-2 border-t hairline md:grid-cols-4">
            {meta.slice(0, 4).map((m, i) => (
              <div key={m.label} className={`corners flex flex-col px-5 py-6 md:px-8 md:py-8 ${i % 2 ? "border-l hairline" : ""} ${i > 1 ? "border-t hairline md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}>
                <dt className="t-mono-sm order-2 mt-3 text-muted">{m.label}</dt>
                <dd className="t-pixel order-1 text-[40px] leading-none md:text-[52px]">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Row>
    </>
  );
}

// Closing band: points readers at the matching cohort and the free newsletter.
export function ResourceCta({
  n = "99",
  title = "Turn this into a job offer.",
  body = "Learn it live with Chris in a small cohort: real projects, code reviews and mock interviews with someone who has hired 200+ engineers.",
  courseHref = "/courses",
  courseLabel = "See the next cohorts",
}: {
  n?: string;
  title?: string;
  body?: string;
  courseHref?: string;
  courseLabel?: string;
}) {
  return (
    <Row n={n} tone="night">
      <div className="pad sec grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div className="reveal">
          <span className="label">Go further</span>
          <h2 className="t-h2 mt-6 max-w-[620px]">{title}</h2>
          <p className="t-lede mt-5 max-w-[560px]">{body}</p>
        </div>
        <div className="reveal flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch">
          <Link href={courseHref} className="btn btn-paper">
            <Pixel name="spark" size={14} /> {courseLabel}
          </Link>
          <a href={site.bookCall} target="_blank" rel="noreferrer" className="btn btn-line">
            Book a free call <ArrowUpRight />
          </a>
        </div>
      </div>
    </Row>
  );
}
