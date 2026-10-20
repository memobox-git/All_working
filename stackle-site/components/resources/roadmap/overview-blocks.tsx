import { Row, SectionHead } from "@/components/row";
import { ArrowRight } from "@/components/icons";
import type { SalaryRow } from "./data";
import { PipelineDemo, type PipelineDemoText } from "./pipeline-demo";

// Page-specific overview rows that sit between the hero and the guided roadmap.
// Data engineering: CapabilityMap (+ the pipeline demo). AI engineer and data analyst: Stack, SalaryTable, Roles.
// Bands alternate white and paper in page order: white, paper, white.

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

function SkillCard({ n, skill }: { n?: string; skill: Skill }) {
  return (
    <li className="panel flex h-full flex-col p-4 md:p-5">
      {n ? (
        <span className="t-serif text-[15px] leading-none text-muted">{n}</span>
      ) : (
        <span aria-hidden="true" className="mt-1 block h-2 w-2 rounded-full border border-ink" />
      )}
      <span className="mt-6 text-[16.5px] font-semibold leading-snug">{skill.name}</span>
      <span className="mt-1 text-[14px] leading-[1.45] text-muted">{skill.detail}</span>
    </li>
  );
}

export function CapabilityMap({ n, data }: { n: string; data: CapabilityMapData }) {
  let count = 0;
  return (
    <Row n={n} id="capability-map" tone="white">
      <div className="pad sec">
        <SectionHead label="Capability map" title={data.heading} lede={data.intro} />
        <div className="mt-12 grid gap-x-8 gap-y-10 md:mt-16 xl:grid-cols-[1fr_340px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="t-h4">{data.technical.title}</h3>
              <p className="text-[14.5px] text-muted">{data.technical.subtitle}</p>
            </div>
            {data.technical.bands.map((band) => (
              <div key={band.label} className="mt-7">
                <p className="t-mono-sm text-muted">{band.label}</p>
                <ul className={`mt-3 grid grid-cols-2 gap-3 ${band.skills.length === 5 ? "md:grid-cols-3 xl:grid-cols-5" : "md:grid-cols-4"}`}>
                  {band.skills.map((s) => (
                    <SkillCard key={s.name} n={band.numbered ? pad(++count) : undefined} skill={s} />
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {data.technical.choices.map((c) => (
                <div key={c.label} className="rounded-card border border-line bg-paper p-5">
                  <p className="t-mono-sm text-muted">{c.label}</p>
                  <ul className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
                    {c.options.map((o, i) => (
                      <li key={o} className="flex items-center gap-2">
                        {i > 0 && (
                          <span aria-hidden="true" className="t-serif text-[15px] italic text-muted">
                            or
                          </span>
                        )}
                        <span className="rounded-full border border-line-strong bg-white px-3.5 py-2 text-[14.5px] font-medium leading-none">{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <aside aria-labelledby="core-skills" className="panel self-start p-6 md:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 id="core-skills" className="t-h4">
                {data.core.title}
              </h3>
              <p className="text-[14.5px] text-muted">{data.core.subtitle}</p>
            </div>
            <ol className="mt-5">
              {data.core.skills.map((s, i) => (
                <li key={s.name} className="grid grid-cols-[36px_1fr] border-t hairline py-3.5">
                  <span className="t-serif pt-px text-[15px] text-muted">{pad(i + 1)}</span>
                  <span>
                    <span className="block font-semibold">{s.name}</span>
                    <span className="mt-0.5 block text-[14px] text-muted">{s.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
        <div className="relative mt-10 overflow-hidden rounded-card bg-fill px-6 py-6 md:px-8 md:py-7">
          <span className="absolute inset-y-0 left-0 w-[3px] bg-ink" aria-hidden="true" />
          <p className="t-mono-sm text-muted">Note</p>
          <p className="t-serif mt-3 max-w-[820px] text-[21px] leading-[1.35] tracking-[-0.01em] md:text-[24px]">{data.note}</p>
        </div>
      </div>
    </Row>
  );
}

// ---------- AI engineer / data analyst: the stack ----------

export type StackData = { heading: string; intro: string; items: { name: string }[]; caption: string };

export function Stack({ n, data }: { n: string; data: StackData }) {
  const last = data.items.length - 1;
  return (
    <Row n={n} id="the-field" tone="white">
      <div className="pad sec">
        <SectionHead label="The field" title={data.heading} lede={data.intro} />
        <ol className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-16 md:grid-cols-3 lg:grid-cols-6">
          {data.items.map((it, i) => (
            <li key={it.name} className="border-t border-line-strong pt-5">
              <span className="flex items-center justify-between text-muted">
                <span className="t-serif text-[16px]">{pad(i + 1)}</span>
                {i < last && <ArrowRight size={12} className="text-faint" />}
              </span>
              <span className="t-h4 mt-4 block">{it.name}</span>
            </li>
          ))}
        </ol>
        <p className="t-mono-sm mt-10 text-muted">{data.caption.replace(/\s—\s/, ": ")}</p>
      </div>
    </Row>
  );
}

// ---------- salary table ----------

export type SalaryTableData = { heading: string; intro: string; rows: SalaryRow[]; footnote: string };

export function SalaryTable({ n, data }: { n: string; data: SalaryTableData }) {
  const note = data.footnote.replace(/^\*\s*/, "");
  return (
    <Row n={n} id="salaries">
      <div className="pad sec">
        <SectionHead label="Career progression" title={data.heading} lede={data.intro} />
        <div className="panel mt-12 px-2 py-2 sm:px-4 md:mt-16 md:px-6 md:py-3">
          <table className="w-full border-separate border-spacing-0 text-left">
            <caption className="sr-only">Typical role and approximate US salary range for each phase of the roadmap</caption>
            <thead>
              <tr>
                <th scope="col" className="t-mono-sm px-3 py-3.5 text-muted">Phase</th>
                <th scope="col" className="t-mono-sm hidden py-3.5 pr-4 text-muted md:table-cell">Stage</th>
                <th scope="col" className="t-mono-sm py-3.5 pr-4 text-muted">Typical role</th>
                <th scope="col" className="t-mono-sm px-3 py-3.5 text-right text-muted">Approx. US salary</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => {
                // The goal row gets a soft rounded highlight instead of a border.
                const cell = r.isTarget ? "bg-fill py-4 font-semibold" : "border-t hairline py-4";
                return (
                  <tr key={r.phase}>
                    <th scope="row" className={`px-3 align-middle font-normal ${cell} ${r.isTarget ? "rounded-l-[10px]" : ""}`}>
                      <span className="t-serif block text-[16px] text-muted">{r.phase}</span>
                      <span className="mt-0.5 block text-[14px] text-ink-2 md:hidden">{r.stage}</span>
                    </th>
                    <td className={`hidden pr-4 align-middle font-semibold md:table-cell ${cell}`}>{r.stage}</td>
                    <td className={`pr-4 align-middle text-[15px] ${r.isTarget ? "" : "text-ink-2"} ${cell}`}>{r.role}</td>
                    <td className={`t-serif px-3 text-right align-middle text-[16px] sm:text-[19px] ${r.isTarget ? "rounded-r-[10px]" : "whitespace-nowrap"} ${cell}`}>{r.salary}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-4">Approximate US ranges. {note}</p>
      </div>
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
    <Row n={n} id="roles" tone="white">
      <div className="pad sec">
        <SectionHead label="Roles and compensation" title={data.heading} lede={data.intro} />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {data.items.map((r) => (
            <li key={r.title} className="panel flex h-full flex-col p-6 md:p-7">
              <span className="self-start rounded-full border border-line-strong px-2.5 py-1 text-[12.5px] font-semibold leading-none text-ink-2">{r.level}</span>
              <h3 className="t-h4 mt-6">{r.title}</h3>
              <p className="t-serif mt-3 text-[26px] leading-tight tracking-[-0.02em] text-ink-2">{r.salary}</p>
              <div className="mt-auto pt-6">
                <ul className="flex flex-wrap gap-1.5 border-t hairline pt-5" aria-label="Key skills">
                  {r.skills.map((s) => (
                    <li key={s} className="rounded-full bg-fill px-2.5 py-1 text-[13px] leading-snug text-ink-2">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <p className="t-small mt-6">{note}</p>
      </div>
    </Row>
  );
}

// ---------- data engineering: live pipeline demo ----------

export function PipelineSection({ n, heading, intro, request, text }: { n: string; heading: string; intro: string; request: string; text: PipelineDemoText }) {
  return (
    <Row n={n} id="pipeline-demo">
      <div className="pad sec">
        <SectionHead label="Live pipeline demo" title={heading} lede={intro} />
        <p className="mt-6 inline-flex max-w-full items-baseline gap-2 rounded-[10px] border border-line-strong bg-white px-3.5 py-2 font-mono text-[12.5px] leading-[1.5] text-ink-2">
          <span className="font-semibold text-ink">GET</span>
          <span className="min-w-0 break-all">{request.replace(/^GET\s+/, "")}&amp;skip=random</span>
        </p>
        <div className="mt-10 md:mt-12">
          <PipelineDemo text={text} />
        </div>
      </div>
    </Row>
  );
}
