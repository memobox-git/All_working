import Link from "next/link";
import type { ReactNode } from "react";
import { Row, SectionHead } from "@/components/row";
import { ResourceCta, ResourceHero } from "@/components/resources/resource-shell";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { CellGrid, type Cols } from "./cell-grid";
import type { Phase, Roadmap } from "./data";
import { LessonBody } from "./lesson-body";
import { LessonProvider, TopicButton } from "./lesson-drawer";
import { Md } from "./md";

// The shared roadmap page: hero → page-specific overview rows → guided roadmap (one framed row per phase,
// topics open lessons in a drawer) → closing CTA. Rows are numbered in order down the page.

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
        <Row n={next()} id="roadmap">
          <div className="pad sec pb-10 md:pb-14">
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
          </div>
          <nav aria-label="Phases" className="border-t border-line">
            <CellGrid
              cols={{ base: 2, md: roadmap.phases.length > 5 ? 4 : roadmap.phases.length === 4 ? 4 : 3, lg: roadmap.phases.length === 5 ? 5 : 4 }}
              items={roadmap.phases.map((p) => (
                <a key={p.id} href={`#${p.id}`} className="group flex h-full min-h-[120px] flex-col px-5 py-5 transition-colors hover:bg-white md:px-6">
                  <span className="t-mono-sm flex items-center justify-between gap-2 text-muted">
                    <span>
                      {p.label}
                      <span className="hidden md:inline"> · {p.stage}</span>
                    </span>
                    <ArrowRight size={12} className="rotate-90 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="mt-3 font-medium leading-[1.3] tracking-[-0.01em]">{p.title}</span>
                  <span className="t-mono-sm mt-auto pt-4 text-muted">{p.topics.length} topics</span>
                </a>
              ))}
            />
          </nav>
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
    <div className="border-t border-line pt-4">
      <p className="t-mono-sm text-muted">{s.kind === "target" ? "Goal" : "Approx. US salary"}</p>
      {s.kind === "range" ? (
        <>
          <p className="mt-2 font-mono text-[17px] tracking-[-0.01em]">{s.range}</p>
          {s.role && <p className="t-small mt-1">{s.role}</p>}
        </>
      ) : s.kind === "target" ? (
        <p className="mt-2 font-mono text-[17px] tracking-[-0.01em]">{s.text}</p>
      ) : (
        <>
          <p className="mt-2 font-mono text-[17px] tracking-[-0.01em]">—</p>
          <p className="t-small mt-1">{s.text}</p>
        </>
      )}
    </div>
  );
}

// 4 or 5 topics fill one row on desktop; otherwise rows of 3 (or 2 for a pair).
function topicCols(n: number): Cols {
  if (n === 4) return { base: 1, sm: 2, lg: 4 };
  if (n === 5) return { base: 1, sm: 2, lg: 5 };
  if (n <= 2) return { base: 1, sm: 2 };
  return { base: 1, sm: 2, lg: 3 };
}

function PhaseRow({ n, phase }: { n: string; phase: Phase }) {
  return (
    <Row n={n} id={phase.id}>
      <div className="pad grid gap-x-12 gap-y-6 pb-10 pt-8 md:pb-12 md:pt-14 lg:grid-cols-[260px_1fr] lg:grid-rows-[auto_1fr]">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="t-mono">{phase.label}</p>
          <p className="t-mono-sm mt-2 text-muted">{phase.stage}</p>
        </div>
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <h3 className="t-h3 max-w-[680px]">{phase.title}</h3>
          <p className="t-body mt-4 max-w-[680px] text-[17px]">{phase.description}</p>
          <div className="mt-6">
            <p className="t-mono-sm text-muted">Tools and skills</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {phase.skills.map((s) => (
                <li key={s} className="t-mono-sm border border-line bg-white px-2.5 py-1.5 text-ink">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lg:col-start-1 lg:row-start-2">
          <Salary phase={phase} />
        </div>
      </div>
      <div className="border-t border-line">
        <CellGrid
          as="ol"
          label={`${phase.label} topics`}
          cols={topicCols(phase.topics.length)}
          items={phase.topics.map((t) => (
            <TopicButton key={t.id} id={t.id} n={t.n} title={t.title} category={t.category} total={t.checklist.length} />
          ))}
        />
      </div>
    </Row>
  );
}
