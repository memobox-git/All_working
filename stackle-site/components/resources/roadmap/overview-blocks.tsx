import { Row, SectionHead } from "@/components/row";
import { ArrowRight } from "@/components/icons";
import { CellGrid } from "./cell-grid";
import type { SalaryRow } from "./data";
import { PipelineDemo, type PipelineDemoText } from "./pipeline-demo";

// Page-specific overview rows that sit between the hero and the guided roadmap.
// Data engineering: CapabilityMap (+ the pipeline demo). AI engineer and data analyst: Stack, SalaryTable, Roles.

const pad = (n: number) => String(n).padStart(2, "0");

// ---------- data engineering: capability map ----------

type Skill = { name: string; detail: string };
export type CapabilityMapData = {
  heading: string;
  intro: string;
  technical: {
    title: string;
    subtitle: string;
    bands: { label: string; numbered: boolean; skills: Skill[] }[];
    choices: { label: string; options: string[] }[];
  };
  core: { title: string; subtitle: string; skills: Skill[] };
  note: string;
};

function SkillCell({ n, skill }: { n?: string; skill: Skill }) {
  return (
    <div className="flex h-full flex-col px-5 pb-6 pt-5">
      <span className="t-mono-sm text-muted">{n ?? "■"}</span>
      <span className="mt-8 text-[17px] font-medium tracking-[-0.01em]">{skill.name}</span>
      <span className="t-small mt-1">{skill.detail}</span>
    </div>
  );
}

export function CapabilityMap({ n, data }: { n: string; data: CapabilityMapData }) {
  let count = 0;
  return (
    <Row n={n} id="capability-map">
      <div className="pad sec pb-10 md:pb-14">
        <SectionHead label="Capability map" title={data.heading} lede={data.intro} />
      </div>
      <div className="grid border-t border-line lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <div className="pad flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-6">
            <h3 className="t-h4">{data.technical.title}</h3>
            <p className="t-mono-sm text-muted">{data.technical.subtitle}</p>
          </div>
          {data.technical.bands.map((band) => {
            const items = band.skills.map((s) => {
              const num = band.numbered ? pad(++count) : undefined;
              return <SkillCell key={s.name} n={num} skill={s} />;
            });
            return (
              <div key={band.label}>
                <p className="t-mono-sm pad border-t border-line bg-white py-3 text-muted">{band.label}</p>
                <CellGrid
                  className="border-t border-line"
                  cols={band.skills.length === 5 ? { base: 2, md: 3, lg: 5 } : { base: 2, md: 4 }}
                  items={items}
                />
              </div>
            );
          })}
          <div className="grid gap-px border-t border-line bg-line md:grid-cols-2">
            {data.technical.choices.map((c) => (
              <div key={c.label} className="bg-paper px-5 py-5">
                <p className="t-mono-sm text-muted">{c.label}</p>
                <ul className="mt-4 grid grid-cols-3 border border-ink bg-white">
                  {c.options.map((o, i) => (
                    <li key={o} className={`flex items-center justify-center px-2 py-3 text-center text-[15px] font-medium leading-tight ${i > 0 ? "border-l border-ink" : ""}`}>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <aside aria-labelledby="core-skills" className="border-t border-line bg-white lg:border-l lg:border-t-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-6 md:px-8 lg:px-6">
            <h3 id="core-skills" className="t-h4">
              {data.core.title}
            </h3>
            <p className="t-mono-sm text-muted">{data.core.subtitle}</p>
          </div>
          <ol className="border-t border-line">
            {data.core.skills.map((s, i) => (
              <li key={s.name} className="grid grid-cols-[48px_1fr] border-b border-line">
                <span className="t-mono-sm border-r border-line px-3 py-4 text-muted">{pad(i + 1)}</span>
                <span className="px-4 py-4">
                  <span className="block font-medium">{s.name}</span>
                  <span className="t-small mt-0.5 block">{s.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
      <div className="grid border-t border-line md:grid-cols-[200px_1fr]">
        <p className="t-mono-sm fill-hatch pad flex items-center bg-paper py-4 text-ink md:border-r md:border-line">
          <span className="bg-paper px-1.5 py-1">Note</span>
        </p>
        <p className="pad py-5 text-[17px] font-medium tracking-[-0.01em]">{data.note}</p>
      </div>
    </Row>
  );
}

// ---------- AI engineer / data analyst: the stack ----------

export type StackData = { heading: string; intro: string; items: { name: string }[]; caption: string };

export function Stack({ n, data }: { n: string; data: StackData }) {
  const last = data.items.length - 1;
  return (
    <Row n={n} id="the-field">
      <div className="pad sec pb-10 md:pb-14">
        <SectionHead label="The field" title={data.heading} lede={data.intro} />
      </div>
      <CellGrid
        as="ol"
        className="border-t border-line"
        cols={{ base: 2, md: 3, lg: 6 }}
        items={data.items.map((it, i) => (
          <div key={it.name} className="flex h-full min-h-[132px] flex-col px-5 py-5">
            <span className="t-mono-sm flex items-center justify-between text-muted">
              {pad(i + 1)}
              {i < last && <ArrowRight size={12} className="text-faint" />}
            </span>
            <span className="t-h4 mt-auto pt-6">{it.name}</span>
          </div>
        ))}
      />
      <p className="t-mono-sm pad border-t border-line bg-white py-4 text-muted">{data.caption.replace(/\s—\s/, ": ")}</p>
    </Row>
  );
}

// ---------- salary table ----------

export type SalaryTableData = { heading: string; intro: string; rows: SalaryRow[]; footnote: string };

export function SalaryTable({ n, data }: { n: string; data: SalaryTableData }) {
  const note = data.footnote.replace(/^\*\s*/, "");
  return (
    <Row n={n} id="salaries">
      <div className="pad sec pb-10 md:pb-14">
        <SectionHead label="Career progression" title={data.heading} lede={data.intro} />
      </div>
      <div className="border-t border-line">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Typical role and approximate US salary range for each phase of the roadmap</caption>
          <thead>
            <tr className="border-b border-line bg-white">
              <th scope="col" className="t-mono-sm pad py-3 font-normal text-muted">Phase</th>
              <th scope="col" className="t-mono-sm hidden py-3 pr-4 font-normal text-muted md:table-cell">Stage</th>
              <th scope="col" className="t-mono-sm py-3 pr-4 font-normal text-muted">Typical role</th>
              <th scope="col" className="t-mono-sm py-3 pr-5 text-right font-normal text-muted md:pr-8">Approx. US salary</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.phase} className={`border-b border-line last:border-b-0 ${r.isTarget ? "bg-ink text-paper" : ""}`}>
                <th scope="row" className="pad py-4 align-top font-normal">
                  <span className="t-mono block">{r.phase}</span>
                  <span className={`t-small mt-1 block md:hidden ${r.isTarget ? "!text-night-muted" : ""}`}>{r.stage}</span>
                </th>
                <td className="hidden py-4 pr-4 align-top font-medium md:table-cell">{r.stage}</td>
                <td className={`py-4 pr-4 align-top ${r.isTarget ? "" : "text-ink-2"}`}>{r.role}</td>
                <td className="py-4 pr-5 text-right align-top font-mono text-[15px] md:pr-8">{r.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="t-small pad border-t border-line py-4">Approximate US ranges. {note}</p>
    </Row>
  );
}

// ---------- roles and compensation ----------

export type RolesData = {
  heading: string;
  intro: string;
  items: { title: string; level: string; salary: string; skills: string[] }[];
  footnote: string;
};

export function Roles({ n, data, note }: { n: string; data: RolesData; note: string }) {
  return (
    <Row n={n} id="roles">
      <div className="pad sec pb-10 md:pb-14">
        <SectionHead label="Roles and compensation" title={data.heading} lede={data.intro} />
      </div>
      <CellGrid
        className="border-t border-line"
        cols={{ base: 1, sm: 2, lg: 3 }}
        items={data.items.map((r) => (
          <div key={r.title} className="flex h-full flex-col px-5 py-6 md:px-6">
            <span className="t-mono-sm self-start border border-line bg-white px-2 py-1 text-muted">{r.level}</span>
            <h3 className="t-h4 mt-6">{r.title}</h3>
            <p className="mt-3 font-mono text-[17px]">{r.salary}</p>
            <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label="Key skills">
              {r.skills.map((s) => (
                <li key={s} className="t-mono-sm border border-line px-2 py-1 text-ink-2">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      />
      <p className="t-small pad border-t border-line py-4">{note}</p>
    </Row>
  );
}

// ---------- data engineering: live pipeline demo ----------

export function PipelineSection({ n, heading, intro, request, text }: { n: string; heading: string; intro: string; request: string; text: PipelineDemoText }) {
  return (
    <Row n={n} id="pipeline-demo">
      <div className="pad sec pb-10 md:pb-14">
        <SectionHead label="Live pipeline demo" title={heading} lede={intro} />
        <p className="t-mono-sm mt-6 text-muted">
          <span className="text-ink">GET</span> {request.replace(/^GET\s+/, "")}&amp;skip=random
        </p>
      </div>
      <div className="border-t border-line bg-white">
        <PipelineDemo text={text} />
      </div>
    </Row>
  );
}
