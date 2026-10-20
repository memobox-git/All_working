import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { ArrowRight, Pixel } from "@/components/icons";
import { PixelCross } from "./glyphs";

// Long-form renderer for one chapter of the LinkedIn Bible (content/resources/linkedin-bible.json).
// Each section renders in the source order: body, subsections, tips, table, templates.

export type ExampleItem = { kind: string; label: string; text: string };
export type GuideSection = {
  number: number | null;
  title: string;
  body?: string[];
  bodyStyle?: string;
  subsections?: { title: string; items: (string | ExampleItem)[] }[];
  tips?: string[];
  table?: { headers: string[]; rows: string[][] };
  templates?: { label: string; text: string }[];
};
export type GuideChapterData = {
  id: string;
  number: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  intro: string;
  sections: GuideSection[];
};

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Some "Tips" boxes in the source hold lists that are not tips. Give those boxes an honest label.
const TIP_LABELS: Record<string, string> = {
  "01-8": "What to feature",
  "05-6": "Questions to ask",
  "05-8": "Reasons to reach out",
};

// "Pros: Signals availability..." -> bold the short lead-in before the colon.
function rich(text: string): ReactNode {
  const m = /^([^:"\[\]]{2,32}):\s+(.+)$/s.exec(text);
  if (!m) return text;
  return (
    <>
      <strong>{m[1]}:</strong> {m[2]}
    </>
  );
}

const isNote = (t: string) => /^\(.+\)$/.test(t.trim());
const isLeadIn = (t: string) => t.trim().endsWith(":");

function Body({ items, style, checklist }: { items: string[]; style?: string; checklist: boolean }) {
  const notes = items.filter(isNote);
  const rest = items.filter((t) => !isNote(t));
  const noteEls = notes.map((t, i) => (
    <p key={`n${i}`} className="t-mono-sm text-muted">
      {t.trim().slice(1, -1)}
    </p>
  ));
  if (style !== "bullets" || rest.length < 2) {
    return (
      <>
        {noteEls}
        {rest.map((t, i) => (
          <p key={i}>{rich(t)}</p>
        ))}
      </>
    );
  }
  // Lead-in sentences ("Before hitting send, ask:") read as paragraphs, the items after them as a list.
  let split = 0;
  rest.forEach((t, i) => {
    if (isLeadIn(t)) split = i + 1;
  });
  const paras = rest.slice(0, split);
  const bullets = rest.slice(split);
  return (
    <>
      {noteEls}
      {paras.map((t, i) => (
        <p key={`p${i}`}>{rich(t)}</p>
      ))}
      {checklist ? (
        <ul className="border-t hairline">
          {bullets.map((t, i) => (
            <li key={i} className="mt-0 flex gap-3 border-b hairline py-2.5 pl-0 before:hidden">
              <span aria-hidden="true" className="mt-[7px] h-3.5 w-3.5 shrink-0 border border-ink bg-white" />
              <span>{rich(t)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          {bullets.map((t, i) => (
            <li key={i}>{rich(t)}</li>
          ))}
        </ul>
      )}
    </>
  );
}

function Examples({ items }: { items: ExampleItem[] }) {
  return (
    <ul className="border-t hairline">
      {items.map((it, i) => {
        const good = it.kind === "good";
        return (
          <li key={i} className="mt-0 grid grid-cols-[76px_1fr] items-start gap-4 border-b hairline py-3.5 pl-0 before:hidden">
            <span
              className={`t-mono-sm inline-flex h-7 items-center gap-2 px-2 ${good ? "bg-ink text-paper" : "border border-ink bg-white text-ink"}`}
            >
              {good ? <Pixel name="check" size={11} /> : <PixelCross size={9} />}
              {it.label}
            </span>
            <span>{it.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

type Marker = "do" | "avoid" | null;
const markerFor = (title: string): Marker =>
  /^(do|what makes a great)/i.test(title) && !/^don/i.test(title) ? "do" : /avoid|^don't/i.test(title) ? "avoid" : null;

function Subsection({ title, items, pair }: { title: string; items: (string | ExampleItem)[]; pair: boolean }) {
  const examples = items.filter((x): x is ExampleItem => typeof x !== "string");
  const strings = items.filter((x): x is string => typeof x === "string");
  const marker = pair ? markerFor(title) : null;
  return (
    <div>
      <h4 className="t-mono-sm flex items-center gap-2 text-muted">
        {marker === "do" && <Pixel name="check" size={11} className="text-ink" />}
        {marker === "avoid" && <PixelCross size={9} className="text-ink" />}
        {title}
      </h4>
      {examples.length > 0 && (
        <div className="mt-3">
          <Examples items={examples} />
        </div>
      )}
      {strings.length > 0 &&
        (/formula/i.test(title) && strings.length === 1 ? (
          <p className="mt-3 border hairline bg-white px-4 py-3 font-mono text-[14px] leading-[1.6] text-ink">{strings[0]}</p>
        ) : marker ? (
          <ul className="mt-3">
            {strings.map((t, i) => (
              <li key={i} className="flex gap-3 pl-0 before:hidden">
                <span className="mt-[0.45em] shrink-0" aria-hidden="true">
                  {marker === "do" ? <Pixel name="check" size={11} /> : <PixelCross size={9} />}
                </span>
                <span>{rich(t)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-3">
            {strings.map((t, i) => (
              <li key={i}>{rich(t)}</li>
            ))}
          </ul>
        ))}
    </div>
  );
}

function Tips({ items, label }: { items: string[]; label: string }) {
  return (
    <aside aria-label={label} className="mt-7 border hairline bg-white px-5 py-5 md:px-6">
      <p className="t-mono-sm flex items-center gap-2 text-muted">
        <Pixel name="bolt" size={11} className="text-ink" />
        {label}
      </p>
      <ul className="mt-3">
        {items.map((t, i) => (
          <li key={i} className="flex gap-3 pl-0 text-[16px] leading-[1.6] before:hidden">
            <ArrowRight size={13} className="mt-[0.4em]" />
            <span>{rich(t)}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Table({ table, caption }: { table: NonNullable<GuideSection["table"]>; caption: string }) {
  const wide = table.headers.length >= 3;
  return (
    <div className="scroll-x mt-7 border-t hairline">
      <table className={wide ? "min-w-[540px]" : ""}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {table.headers.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={j === 0 ? "font-medium text-ink" : ""}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ chapter, s }: { chapter: GuideChapterData; s: GuideSection }) {
  const id = s.number != null ? `${chapter.id}-${s.number}` : `${chapter.id}-${slugify(s.title)}`;
  const subs = s.subsections ?? [];
  const pair = subs.length === 2 && markerFor(subs[0].title) === "do" && markerFor(subs[1].title) === "avoid";
  const tipLabel = TIP_LABELS[`${chapter.number}-${s.number}`] ?? (s.tips?.length === 1 ? "Tip" : "Tips");
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-[64px] border-t hairline pt-10 md:pt-12 min-[1200px]:scroll-mt-0">
      <div className="flex items-baseline gap-4">
        {s.number != null && (
          <span className="t-mono-sm shrink-0 text-muted">
            {chapter.number}.{String(s.number).padStart(2, "0")}
          </span>
        )}
        <h3 id={`${id}-h`} className="t-h4">
          {s.title}
        </h3>
      </div>
      <div className="prose-s mt-5">
        {s.body && <Body items={s.body} style={s.bodyStyle} checklist={/checklist/i.test(s.title)} />}
        {subs.length > 0 && (
          <div className={`mt-7 grid gap-7 ${pair ? "md:grid-cols-2 md:gap-8" : ""}`}>
            {subs.map((sub) => (
              <Subsection key={sub.title} title={sub.title} items={sub.items} pair={pair} />
            ))}
          </div>
        )}
        {s.tips && s.tips.length > 0 && <Tips items={s.tips} label={tipLabel} />}
        {s.table && <Table table={s.table} caption={s.title} />}
      </div>
      {/* Outside .prose-s, whose inline-code styling would otherwise reach into the code window. */}
      {s.templates && s.templates.length > 0 && (
        <div className="mt-7 grid gap-4">
          {s.templates.map((t) => (
            <CodeBlock
              key={t.label}
              language="text"
              filename={t.label}
              code={t.text}
              className="[&_pre]:whitespace-pre-wrap [&_pre]:break-words"
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function GuideChapter({ chapter }: { chapter: GuideChapterData }) {
  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-[64px] border-t hairline first:border-t-0 min-[1200px]:scroll-mt-0"
    >
      <div className="pad py-14 md:py-20">
        <div className="max-w-[720px]">
          <span className="label">Chapter {chapter.number}</span>
          <h2 id={`${chapter.id}-title`} className="t-h2 mt-6">
            {chapter.title}
            <br />
            <span className="t-second">{chapter.subtitle}</span>
          </h2>
          <blockquote className="mt-8 border-l-2 border-ink pl-5 text-[1.1875rem] leading-[1.55] text-ink-2">
            <p>{chapter.intro}</p>
          </blockquote>
          <div className="mt-12 space-y-12 md:mt-16 md:space-y-14">
            {chapter.sections.map((s, i) => (
              <Section key={i} chapter={chapter} s={s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
