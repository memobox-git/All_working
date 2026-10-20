import Link from "next/link";
import type { ReactNode } from "react";
import { Row, SectionHead } from "@/components/row";
import { ResourceCta, ResourceHero } from "@/components/resources/resource-shell";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import type { Phase, Roadmap } from "./data";
import { LessonBody } from "./lesson-body";
import { LessonProvider, TopicButton } from "./lesson-drawer";
import { Md } from "./md";

// The shared roadmap page: hero → page-specific overview rows → guided roadmap (an index of phase cards, then
// one row per phase whose topic cards open lessons in a drawer) → closing CTA. Overview rows alternate white
// and paper; the roadmap head takes whichever tone comes next, and the phases sit on paper.

const pad = (n: number) => String(n).padStart(2, "0");

export type RoadmapTemplateProps = {
  roadmap: Roadmap;
  hero: { title: ReactNode; second?: ReactNode; summary: ReactNode; secondary?: { label: string; href: string; external?: boolean } };
  // Page-specific overview rows; each receives its row number.
  overview: ((n: string) => ReactNode)[];
  roadmapLabel?: string;
  cta: { title: string; body?: string; href: string; label: string };
};

export function RoadmapTemplate({ roadmap, hero, overview, roadmapLabel = "Guided roadmap", cta }: RoadmapTemplateProps) {
  let row = 2;
  const next = () => pad(++row);
  const t = roadmap.totals;
  const topics = roadmap.phases.flatMap((p) => p.topics);
  const headTone = overview.length % 2 === 0 ? "white" : "paper";
  const phaseCols = roadmap.phases.length === 5 ? "md:grid-cols-3 lg:grid-cols-5" : roadmap.phases.length === 3 ? "md:grid-cols-3" : "lg:grid-cols-4";

  return (
    <>
      <ResourceHero
        category="Roadmaps"
        title={hero.title}
        second={hero.second}
        summary={hero.summary}
        meta={[
          { label: "Phases", value: pad(t.phases) },
          { label: "Guided topics", value: pad(t.topics) },
          { label: "Checklist items", value: String(t.checklist) },
          { label: "Free links", value: String(t.links) },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#roadmap" className="btn btn-ink">
            Explore the roadmap <ArrowRight className="rotate-90" />
          </a>
          {hero.secondary &&
            (hero.secondary.external ? (
              <a href={hero.secondary.href} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                {hero.secondary.label} <ArrowUpRight />
              </a>
            ) : (
              <Link href={hero.secondary.href} className="btn btn-line">
                {hero.secondary.label} <ArrowRight />
              </Link>
            ))}
        </div>
      </ResourceHero>

      {overview.map((render, i) => (
        <OverviewSlot key={i}>{render(next())}</OverviewSlot>
      ))}

      <LessonProvider
        storageKey={`stackle:roadmap:${roadmap.slug}`}
        topics={topics.map((l) => ({ id: l.id, n: l.n, title: l.title, phase: l.phaseLabel, total: l.checklist.length }))}
        panels={topics.map((l) => (
          <LessonBody key={l.id} lesson={l} footnote={roadmap.exampleFootnote} />
        ))}
      >
        <Row n={next()} id="roadmap" tone={headTone}>
          <div className="pad sec">
            <SectionHead
              label={roadmapLabel}
              title={roadmap.heading}
              lede={
                <>
                  <Md text={roadmap.intro} />
                  {roadmap.runningExample && (
                    <>
                      {" "}
                      <Md text={roadmap.runningExample} />
                    </>
                  )}
                </>
              }
            />
            <nav aria-label="Phases" className="mt-12 md:mt-16">
              <ol className={`border-b hairline sm:grid sm:grid-cols-2 sm:gap-4 sm:border-0 ${phaseCols}`}>
                {roadmap.phases.map((p) => (
                  <li key={p.id}>
                    <a
                      href={`#${p.id}`}
                      className="group grid grid-cols-[76px_1fr_auto] items-baseline gap-x-3 border-t hairline py-4 sm:flex sm:h-full sm:min-h-[168px] sm:flex-col sm:items-stretch sm:rounded-card sm:border sm:border-line sm:bg-white sm:p-5 sm:shadow-card sm:transition-shadow sm:hover:shadow-[0_30px_60px_-30px_rgba(21,21,19,0.35)]"
                    >
                      <span className="t-serif text-[16px] text-muted">{p.label}</span>
                      <span className="min-w-0 sm:mt-3">
                        <span className="block font-semibold leading-snug">{p.title}</span>
                        <span className="mt-0.5 block text-[14px] text-muted">{p.stage}</span>
                      </span>
                      <span className="flex items-center gap-2 whitespace-nowrap text-[13.5px] text-muted sm:mt-auto sm:justify-between sm:pt-5">
                        {p.topics.length} topics
                        <ArrowRight className="rotate-90 text-ink transition-transform group-hover:translate-y-0.5" />
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </Row>

        {roadmap.phases.map((p) => (
          <PhaseRow key={p.id} n={next()} phase={p} />
        ))}
      </LessonProvider>

      <ResourceCta n={next()} title={cta.title} body={cta.body} courseHref={cta.href} courseLabel={cta.label} />
    </>
  );
}

function OverviewSlot({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function Salary({ phase }: { phase: Phase }) {
  const s = phase.salary;
  return (
    <div className="border-t hairline pt-5">
      <p className="t-mono-sm text-muted">{s.kind === "target" ? "Goal" : "Approx. US salary"}</p>
      {s.kind === "range" ? (
        <>
          <p className="t-serif mt-2.5 text-[28px] leading-none tracking-[-0.02em]">{s.range}</p>
          {s.role && <p className="t-small mt-2">{s.role}</p>}
        </>
      ) : s.kind === "target" ? (
        <p className="t-serif mt-2.5 text-[28px] leading-[1.1] tracking-[-0.02em]">{s.text}</p>
      ) : (
        <>
          <p className="t-serif mt-2.5 text-[28px] leading-none text-muted">—</p>
          <p className="t-small mt-2">{s.text}</p>
        </>
      )}
    </div>
  );
}

// Topic cards sit in the right-hand column: two across, or three when a phase has six.
function PhaseRow({ n, phase }: { n: string; phase: Phase }) {
  const cols = phase.topics.length === 6 || phase.topics.length === 3 ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2";
  return (
    <Row n={n} id={phase.id}>
      <div className="pad grid gap-x-16 gap-y-8 py-16 md:py-20 lg:grid-cols-[260px_1fr]">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="t-serif text-[17px] text-muted">{phase.label}</p>
          <p className="mt-1.5 text-[16px] font-semibold">{phase.stage}</p>
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <h3 className="t-h3 max-w-[680px]">{phase.title}</h3>
          <p className="t-body mt-4 max-w-[680px] text-[17px]">{phase.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tools and skills">
            {phase.skills.map((s) => (
              <li key={s} className="rounded-full border border-line-strong bg-white px-3 py-1.5 text-[13.5px] leading-none text-ink-2">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-start-1 lg:row-start-2">
          <Salary phase={phase} />
        </div>
        <ol aria-label={`${phase.label} topics`} className={`grid min-w-0 gap-4 lg:col-start-2 lg:row-start-2 ${cols}`}>
          {phase.topics.map((t) => (
            <li key={t.id}>
              <TopicButton id={t.id} n={t.n} title={t.title} category={t.category} total={t.checklist.length} />
            </li>
          ))}
        </ol>
      </div>
    </Row>
  );
}
