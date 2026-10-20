import Link from "next/link";
import type { ReactNode } from "react";
import { Row } from "@/components/row";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { LessonBody } from "./blocks";
import { ReaderNav } from "./reader-nav";
import type { Course, NavGroup } from "./types";
import { pad2 } from "./visuals";

// The long-form course reader shared by /resources/apache-spark-architecture and /resources/power-bi.
// Every lesson is rendered into the static HTML as an <article id="<lesson-id>">, so #<lesson-id> deep
// links work without JavaScript; the client index only tracks the position and opens the phone sheet.

export function courseMeta(course: Course) {
  const lessons = course.modules.flatMap((m) => m.lessons);
  const minutes = lessons.reduce((s, l) => s + l.minutes, 0);
  const code = lessons.flatMap((l) => l.blocks).filter((b) => b.type === "code").length;
  return [
    { label: "Modules", value: String(course.modules.length) },
    { label: "Lessons", value: String(lessons.length) },
    { label: "Minutes in total", value: String(minutes) },
    { label: "Code samples", value: String(code) },
  ];
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

type Ref = { id: string; title: string } | null;

// "Previous / Next" at the end of a lesson or topic. The last one points back to the library.
export function Pager({ prev, next, unit, className = "" }: { prev: Ref; next: Ref; unit: string; className?: string }) {
  const cell = "group flex flex-col gap-2 bg-white p-5 transition-colors hover:bg-fill md:px-6";
  return (
    <div className={`mt-14 grid max-w-[720px] border border-line sm:grid-cols-2 ${className}`}>
      {prev ? (
        <a href={`#${prev.id}`} className={cell}>
          <span className="t-mono-sm flex items-center gap-2 text-muted">
            <ArrowLeft size={12} /> Previous {unit.toLowerCase()}
          </span>
          <span className="text-[16px] font-medium leading-snug text-ink">{prev.title}</span>
        </a>
      ) : (
        <div aria-hidden="true" className="fill-hatch hidden sm:block" />
      )}
      {next ? (
        <a href={`#${next.id}`} className={`${cell} sm:items-end sm:text-right ${prev ? "border-t border-line sm:border-l sm:border-t-0" : "sm:border-l sm:border-line"}`}>
          <span className="t-mono-sm flex items-center gap-2 text-muted">
            Next {unit.toLowerCase()} <ArrowRight size={12} />
          </span>
          <span className="text-[16px] font-medium leading-snug text-ink">{next.title}</span>
        </a>
      ) : (
        <Link href="/resources" className={`${cell} sm:items-end sm:text-right ${prev ? "border-t border-line sm:border-l sm:border-t-0" : ""}`}>
          <span className="t-mono-sm flex items-center gap-2 text-muted">
            Complete <ArrowRight size={12} />
          </span>
          <span className="text-[16px] font-medium leading-snug text-ink">Back to resources</span>
        </Link>
      )}
    </div>
  );
}

// Header band for a module (or a cheat-sheet group) inside the reader column.
export function GroupHead({ id, kicker, title, note }: { id: string; kicker: string; title: string; note: string }) {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line bg-white pad py-4">
      <h2 id={id} className="text-[16px] font-medium tracking-[-0.01em] text-ink">
        <span className="t-mono mr-3 text-muted">{kicker}</span>
        {title}
      </h2>
      <p className="t-mono-sm text-muted">{note}</p>
    </header>
  );
}

// Shared frame: sticky index on the left (1200px+) or a sticky bar (below), content on the right.
export function ReaderFrame({ n, nav, children, contentId, contentClassName = "" }: { n: string; nav: ReactNode; children: ReactNode; contentId?: string; contentClassName?: string }) {
  return (
    <Row n={n}>
      <div id="reader" className="min-[1200px]:grid min-[1200px]:grid-cols-[272px_minmax(0,1fr)]">
        {nav}
        <div
          id={contentId}
          className={`min-w-0 min-[1200px]:border-l min-[1200px]:border-line [&>section:last-child>article:last-child]:border-b-0 ${contentClassName}`}
        >
          {children}
        </div>
      </div>
    </Row>
  );
}

export function CourseReader({ course, n = "03", navLabel, sidebarExtra }: { course: Course; n?: string; navLabel: string; sidebarExtra?: ReactNode }) {
  const lessons = course.modules.flatMap((m) => m.lessons);
  const minutes = lessons.reduce((s, l) => s + l.minutes, 0);
  const groups: NavGroup[] = course.modules.map((m) => ({
    label: m.label,
    items: m.lessons.map((l) => ({ id: l.id, num: pad2(l.number), title: l.title })),
  }));
  let gi = -1;

  return (
    <ReaderFrame
      n={n}
      nav={
        <ReaderNav
          groups={groups}
          readerId="reader"
          navLabel={navLabel}
          unit="Lesson"
          summary={`${plural(lessons.length, "lesson")} · ${minutes} min`}
          progressLabel={course.reader.progressLabel ?? "Progress"}
          extra={sidebarExtra}
        />
      }
    >
      {course.modules.map((m) => {
        const [num, ...rest] = m.label.split(/\s*·\s*/);
        const name = rest.join(" · ") || m.label;
        const mMin = m.lessons.reduce((s, l) => s + l.minutes, 0);
        return (
          <section key={m.id} aria-labelledby={`module-${m.id}`}>
            <GroupHead id={`module-${m.id}`} kicker={`Module ${num}`} title={name} note={`${plural(m.lessons.length, "lesson")} · ${mMin} min`} />
            {m.lessons.map((l) => {
              gi += 1;
              const prev = lessons[gi - 1] ?? null;
              const next = lessons[gi + 1] ?? null;
              return (
                <article
                  key={l.id}
                  id={l.id}
                  aria-labelledby={`${l.id}-title`}
                  className="scroll-mt-14 border-b border-line pad py-12 md:py-16 min-[1200px]:scroll-mt-2"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0 max-w-[720px]">
                      <p className="t-mono flex items-center gap-2 text-muted">
                        <span>Lesson {pad2(l.number)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{l.minutes} min</span>
                      </p>
                      <h3 id={`${l.id}-title`} className="t-h3 mt-4">
                        {l.title}
                      </h3>
                    </div>
                    <span aria-hidden="true" className="t-pixel hidden text-[64px] leading-[0.8] text-line md:block">
                      {pad2(l.number)}
                    </span>
                  </div>
                  <div className="mt-8">
                    <LessonBody blocks={l.blocks} />
                  </div>
                  <Pager unit="Lesson" prev={prev && { id: prev.id, title: prev.title }} next={next && { id: next.id, title: next.title }} />
                </article>
              );
            })}
          </section>
        );
      })}
    </ReaderFrame>
  );
}
