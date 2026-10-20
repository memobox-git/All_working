import Link from "next/link";
import type { ReactNode } from "react";
import { Row } from "@/components/row";
import { ArrowRight } from "@/components/icons";
import { site } from "@/content/site";

// The top and bottom of every /resources/* page, so the library feels like one product.
// Pages put their own content between <ResourceHero> and <ResourceCta>, in <Row>s.

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
  second?: ReactNode; // optional italic second line of the title
  summary?: ReactNode;
  meta?: { label: string; value: string }[]; // up to 4 stats, e.g. { label: "Questions", value: "295" }
  children?: ReactNode; // optional extra (buttons, search) under the summary
}) {
  return (
    <section className="fill-ruled">
      <div className="mx-auto max-w-[1200px] px-5 pb-14 pt-8 md:px-10 md:pb-20 md:pt-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[14px] text-muted">
          <Link href="/resources" className="hover:text-ink">Free resources</Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink-2">{category}</span>
        </nav>
        <div className="reveal mt-10 max-w-[880px] md:mt-14">
          <span className="label">{category}</span>
          <h1 className="t-display mt-6">
            {title}
            {second && (
              <>
                {" "}
                <span className="t-second">{second}</span>
              </>
            )}
          </h1>
          {summary && <p className="t-lede mt-6 max-w-[640px]">{summary}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {meta.length > 0 && (
          <dl className="reveal mt-12 grid grid-cols-2 gap-x-8 gap-y-8 md:mt-16 md:grid-cols-4">
            {meta.slice(0, 4).map((m) => (
              <div key={m.label} className="flex flex-col border-t border-line-strong pt-5">
                <dt className="order-2 mt-2 text-[14px] text-muted">{m.label}</dt>
                <dd className="t-serif order-1 text-[40px] leading-none tracking-[-0.03em] md:text-[52px]">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

// Closing card: points readers at the matching cohort and a free call. Light, so it never stacks
// against the dark footer.
export function ResourceCta({
  n,
  title = "Turn this into a job offer.",
  body = "Learn it live with Chris in a small cohort: three sessions a week, real projects, and feedback from someone who has interviewed 200+ engineers.",
  courseHref = "/courses",
  courseLabel = "See the next cohorts",
}: {
  n?: string;
  title?: string;
  body?: string;
  courseHref?: string;
  courseLabel?: string;
}) {
  const external = courseHref.startsWith("http");
  return (
    <Row n={n}>
      <div className="pad py-16 md:py-24">
        <div className="panel grid gap-8 p-7 md:grid-cols-[1.4fr_1fr] md:items-end md:p-12">
          <div className="reveal min-w-0">
            <span className="label">Go further</span>
            <h2 className="t-h2 mt-5 max-w-[620px]">{title}</h2>
            <p className="t-body mt-4 max-w-[560px]">{body}</p>
          </div>
          <div className="reveal flex min-w-0 flex-col gap-3 sm:flex-row md:flex-col md:items-stretch">
            {external ? (
              <a href={courseHref} className="btn btn-ink whitespace-normal py-3 text-center leading-snug">
                {courseLabel} <ArrowRight />
              </a>
            ) : (
              <Link href={courseHref} className="btn btn-ink whitespace-normal py-3 text-center leading-snug">
                {courseLabel} <ArrowRight />
              </Link>
            )}
            <a href={site.bookCall} target="_blank" rel="noreferrer" className="btn btn-line">
              Book a free call
            </a>
          </div>
        </div>
      </div>
    </Row>
  );
}
