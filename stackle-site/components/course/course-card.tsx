import Link from "next/link";
import { type Course, fmtPrice } from "@/lib/courses";
import { ArrowUpRight, Pixel } from "@/components/icons";
import { IsoHub, IsoPipeline, IsoSchedule } from "@/components/illustrations";
import { NextCohortLine } from "./live-cohorts";

export function CourseCard({ course, n }: { course: Course; n: number }) {
  const c = course.copy;
  const open = course.cohorts.length > 0;
  const Art = c.glyph === "flow" ? IsoHub : c.glyph === "db" ? IsoPipeline : IsoSchedule;
  const artProps = c.glyph === "flow" ? { tools: ["LLMs", "RAG", "Agents", "Evals"], center: "App" } : {};
  return (
    <article className="reveal group panel relative flex flex-col" style={{ ["--d" as string]: `${n * 0.08}s` }}>
      <div className="fill-iso relative grid aspect-[16/10] place-items-center overflow-hidden border-b hairline p-6">
        <Art className="h-full max-h-[220px] w-full" {...artProps} />
        <span className="t-mono-sm absolute left-4 top-4 text-muted">{String(n).padStart(2, "0")}</span>
        {!open && <span className="label absolute right-4 top-4">Waitlist</span>}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="t-mono-sm flex flex-wrap gap-x-3 gap-y-1 text-muted">
          <span>{c.category}</span>
          <span aria-hidden="true">·</span>
          <span>{course.weeks} weeks</span>
          {course.level && (
            <>
              <span aria-hidden="true">·</span>
              <span>{course.level}</span>
            </>
          )}
        </p>
        <h3 className="t-h3 mt-4">
          <Link href={`/courses/${course.slug}`} className="after:absolute after:inset-0">
            {c.title}
          </Link>
        </h3>
        <p className="t-body mt-3 text-muted">{c.subtitle}</p>
        <div className="mt-auto pt-8">
          <div className="flex items-end justify-between gap-4 border-t hairline pt-5">
            <div>
              <p className="t-mono-sm text-muted">
                <NextCohortLine courseId={course.id} initial={course.cohorts} />
              </p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="t-pixel text-[34px] leading-none">{fmtPrice(course.price)}</span>
                <span className="t-mono-sm text-muted">USD</span>
              </p>
            </div>
            <span className="grid h-11 w-11 place-items-center border border-ink transition-colors group-hover:bg-ink group-hover:text-paper" aria-hidden="true">
              {open ? <ArrowUpRight /> : <Pixel name="bolt" size={12} />}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
