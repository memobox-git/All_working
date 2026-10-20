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

// A small round arrow button that fills with ink when its card is hovered.
function ArrowDot({ dir }: { dir: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
    >
      {dir === "left" ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
    </span>
  );
}

// "Previous / Next" at the end of a lesson or topic: two rounded cards. The last one points back to
// the library.
export function Pager({ prev, next, unit, className = "" }: { prev: Ref; next: Ref; unit: string; className?: string }) {
  const card =
    "group flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-white p-5 transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[var(--shadow-card)] md:px-6";
  const title = "t-serif text-[19px] leading-snug tracking-[-0.01em] text-ink";
  const meta = "flex items-center gap-3 text-[14px] text-muted";
  return (
    <div className={`mt-14 grid max-w-[720px] gap-3 sm:grid-cols-2 ${className}`}>
      {prev ? (
        <a href={`#${prev.id}`} className={card}>
          <span className={meta}>
            <ArrowDot dir="left" /> Previous {unit.toLowerCase()}
          </span>
          <span className={title}>{prev.title}</span>
        </a>
      ) : (
        <div aria-hidden="true" className="hidden sm:block" />
      )}
      {next ? (
        <a href={`#${next.id}`} className={`${card} sm:items-end sm:text-right`}>
          <span className={meta}>
            Next {unit.toLowerCase()} <ArrowDot dir="right" />
          </span>
          <span className={title}>{next.title}</span>
        </a>
      ) : (
        <Link href="/resources" className={`${card} sm:items-end sm:text-right`}>
          <span className={meta}>
            Complete <ArrowDot dir="right" />
          </span>
          <span className={title}>Back to resources</span>
        </Link>
      )}
    </div>
  );
}

// Heading for a module (or a cheat-sheet group) inside the reader column: an eyebrow and a serif
// title over a hairline.
export function GroupHead({ id, kicker, title, note }: { id: string; kicker: string; title: string; note: string }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line pb-6 pt-16 md:pb-8 md:pt-24">
      <h2 id={id} className="flex flex-col items-start gap-4">
        <span className="label">{kicker}</span>{" "}
        <span className="t-serif text-[2rem] leading-[1.05] tracking-[-0.02em] text-ink md:text-[2.5rem]">{title}</span>
      </h2>
      <p className="text-[14px] text-muted">{note}</p>
    </header>
  );
}

// "Lesson 04 · 8 min", the title, and a large faint serif number on the right.
export function ItemHead({ id, meta, title, num, children }: { id: string; meta: ReactNode[]; title: string; num: string; children?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0 max-w-[720px]">
        <p className="t-serif flex items-center gap-2 text-[16px] text-muted">
          {meta.map((m, i) => (
            <span key={i} className="contents">
              {i > 0 && <span aria-hidden="true">·</span>}
              <span>{m}</span>
            </span>
          ))}
        </p>
        <h3 id={`${id}-title`} className="t-h3 mt-3">
          {title}
        </h3>
        {children}
      </div>
      <span aria-hidden="true" className="t-serif -mt-2 hidden select-none text-[104px] leading-[0.8] tracking-[-0.05em] text-line md:block">
        {num}
      </span>
    </div>
  );
}

// Shared frame: sticky index on the left (1200px+) or a sticky bar (below), content on the right.
export function ReaderFrame({ n, nav, children, contentId, contentClassName = "" }: { n: string; nav: ReactNode; children: ReactNode; contentId?: string; contentClassName?: string }) {
  return (
    <Row n={n}>
      <div id="reader" className="min-[1200px]:grid min-[1200px]:grid-cols-[300px_minmax(0,1fr)]">
        {nav}
        <div
          id={contentId}
          className={`pad min-w-0 pb-16 md:pb-24 min-[1200px]:!pl-8 [&>section:first-child>header]:pt-10 md:[&>section:first-child>header]:pt-12 [&>section>article:last-child]:border-b-0 ${contentClassName}`}
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
                  className="scroll-mt-14 border-b border-line py-12 md:py-16 min-[1200px]:scroll-mt-2"
                >
                  <ItemHead id={l.id} meta={[`Lesson ${pad2(l.number)}`, `${l.minutes} min`]} title={l.title} num={pad2(l.number)} />
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
