import Link from "next/link";
import { type Course, fmtPrice } from "@/lib/courses";
import { ArrowRight, Pixel } from "@/components/icons";
import { NextCohortLine } from "./live-cohorts";

export function CourseCard({ course, n }: { course: Course; n: number }) {
  const c = course.copy;
  const open = course.cohorts.length > 0;
  return (
    <article className="reveal panel group relative flex flex-col p-6 transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(21,21,19,0.35)] md:p-8" style={{ ["--d" as string]: `${n * 0.06}s` }}>
      <div className="flex items-start justify-between gap-4">
        <span className="icon-tile">
          <Pixel name={c.glyph} size={20} />
        </span>
        <span className="text-[13.5px] text-muted">{open ? `from ${fmtPrice(course.price)}` : "Waitlist open"}</span>
      </div>
      <p className="t-mono-sm mt-7 text-muted">
        {c.category} · {course.weeks} weeks{course.level ? ` · ${course.level}` : ""}
      </p>
      <h3 className="t-h3 mt-3">
        <Link href={`/courses/${course.slug}`} className="after:absolute after:inset-0 after:rounded-[16px]">
          {c.title}
        </Link>
      </h3>
      <p className="t-body mt-3">{c.subtitle}</p>
      <ul className="dot-list mt-5 grid gap-1.5 text-[14.5px] text-ink-2">
        {c.outcomes.slice(0, 3).map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <div className="flex items-end justify-between gap-4 border-t hairline pt-5">
          <span className="text-[14px] text-muted">
            <NextCohortLine courseId={course.id} initial={course.cohorts} />
          </span>
          <span className="inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold">
            {open ? "Explore" : "Get notified"} <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
