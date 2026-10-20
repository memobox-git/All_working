import type { ReactNode } from "react";
import { CopyButton } from "@/components/copy-button";
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
    <p key={`n${i}`}>
      <span className="inline-flex rounded-full border border-line-strong bg-white px-3 py-1 text-[13.5px] leading-snug text-ink-2">
        {t.trim().slice(1, -1)}
      </span>
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
        <ul className="overflow-hidden rounded-[14px] border border-line bg-white">
          {bullets.map((t, i) => (
            <li key={i} className="mt-0 flex gap-3.5 border-t hairline px-4 py-3 first:border-t-0 before:hidden md:px-5">
              <span aria-hidden="true" className="mt-[5px] h-[18px] w-[18px] shrink-0 rounded-[6px] border border-line-strong bg-paper" />
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

// "Good" / "Bad" always appears as a word next to the icon.
function Verdict({ good, label }: { good: boolean; label: string }) {
  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center gap-1.5 self-start rounded-full px-3 text-[13px] font-semibold leading-none ${
        good ? "bg-ink text-paper" : "border border-line-strong bg-paper text-ink"
      }`}
    >
      {good ? <Pixel name="check" size={14} /> : <PixelCross size={14} />}
      {label}
    </span>
  );
}

function Examples({ items }: { items: ExampleItem[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((it, i) => (
        <li
          key={i}
          className="mt-0 flex flex-col gap-3 rounded-[12px] border border-line bg-white p-4 before:hidden sm:flex-row sm:items-start sm:gap-4 md:px-5"
        >
          <Verdict good={it.kind === "good"} label={it.label} />
          <span className="text-ink">{it.text}</span>
        </li>
      ))}
    </ul>
  );
}

type Marker = "do" | "avoid" | null;
const markerFor = (title: string): Marker =>
  /^(do|what makes a great)/i.test(title) && !/^don/i.test(title) ? "do" : /avoid|^don't/i.test(title) ? "avoid" : null;

function MarkerIcon({ marker }: { marker: Exclude<Marker, null> }) {
  return marker === "do" ? (
    <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-paper">
      <Pixel name="check" size={15} />
    </span>
  ) : (
    <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong bg-paper text-ink">
      <PixelCross size={15} />
    </span>
  );
}

function Subsection({ title, items, pair }: { title: string; items: (string | ExampleItem)[]; pair: boolean }) {
  const examples = items.filter((x): x is ExampleItem => typeof x !== "string");
  const strings = items.filter((x): x is string => typeof x === "string");
  const marker = pair ? markerFor(title) : null;
  return (
    <div className={marker ? "rounded-[16px] border border-line bg-white p-5 md:p-6" : ""}>
      <h4 className="flex items-center gap-3 text-[16.5px] font-semibold leading-snug text-ink">
        {marker && <MarkerIcon marker={marker} />}
        {title}
      </h4>
      {examples.length > 0 && (
        <div className="mt-4">
          <Examples items={examples} />
        </div>
      )}
      {strings.length > 0 &&
        (/formula/i.test(title) && strings.length === 1 ? (
          <p className="t-serif mt-4 rounded-[12px] border border-line bg-white px-5 py-4 text-[19px] leading-[1.45] tracking-[-0.005em] text-ink md:text-[21px]">
            {strings[0]}
          </p>
        ) : marker ? (
          <ul className="mt-4 space-y-2.5">
            {strings.map((t, i) => (
              <li key={i} className="mt-0 flex gap-3 pl-0 text-[16px] leading-[1.6] before:hidden">
                <span className={`mt-[0.3em] shrink-0 ${marker === "do" ? "text-ink" : "text-muted"}`} aria-hidden="true">
                  {marker === "do" ? <Pixel name="check" size={16} /> : <PixelCross size={16} />}
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
    <aside aria-label={label} className="mt-8 rounded-[12px] bg-fill px-5 py-5 md:px-6 md:py-6">
      <p className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
        <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-white">
          <Pixel name="bolt" size={14} />
        </span>
        {label}
      </p>
      <ul className="mt-3.5 space-y-2">
        {items.map((t, i) => (
          <li key={i} className="mt-0 flex gap-3 pl-0 text-[16px] leading-[1.6] before:hidden">
            <ArrowRight size={13} className="mt-[0.45em] text-muted" />
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
    <div className="scroll-x mt-8 rounded-[14px] border border-line bg-white px-5 md:px-6">
      <table className={`[&_tr:last-child>td]:border-b-0 [&_th]:pt-4 ${wide ? "min-w-[540px]" : ""}`}>
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

// [Placeholders] in a template get a soft highlight so they're easy to spot; the copy button copies the plain text.
function withPlaceholders(text: string): ReactNode[] {
  return text.split(/(\[[^\]\n]+\])/g).map((part, i) =>
    i % 2 ? (
      <span key={i} className="rounded-[5px] bg-fill px-1 text-ink [box-decoration-break:clone]">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function Template({ label, text }: { label: string; text: string }) {
  return (
    <figure className="panel overflow-hidden">
      <figcaption className="flex items-center justify-between gap-3 border-b hairline py-2 pl-5 pr-2">
        <span className="flex min-w-0 items-center gap-2.5 py-1 text-[15px] font-semibold leading-snug text-ink">
          <Pixel name="chat" size={17} className="text-muted" />
          {label}
        </span>
        <CopyButton text={text} className="shrink-0 rounded-full text-ink-2! hover:bg-fill hover:text-ink!" />
      </figcaption>
      <p className="whitespace-pre-wrap break-words px-5 py-5 text-[15.5px] leading-[1.7] text-ink-2">{withPlaceholders(text)}</p>
    </figure>
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
          <span className="t-serif shrink-0 text-[17px] tabular-nums text-muted">
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
          <div className={`mt-7 grid gap-7 ${pair ? "gap-4 md:grid-cols-2 md:gap-5" : ""}`}>
            {subs.map((sub) => (
              <Subsection key={sub.title} title={sub.title} items={sub.items} pair={pair} />
            ))}
          </div>
        )}
        {s.tips && s.tips.length > 0 && <Tips items={s.tips} label={tipLabel} />}
        {s.table && <Table table={s.table} caption={s.title} />}
      </div>
      {/* Outside .prose-s, whose paragraph and list spacing would otherwise reach into the cards. */}
      {s.templates && s.templates.length > 0 && (
        <div className="mt-8 grid gap-4">
          {s.templates.map((t) => (
            <Template key={t.label} label={t.label} text={t.text} />
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
      className="group scroll-mt-[64px] min-[1200px]:scroll-mt-0"
    >
      <div className="pad">
        <div className="border-t hairline py-14 group-first:border-t-0 md:py-20">
          <span className="label">Chapter {chapter.number}</span>
          <h2 id={`${chapter.id}-title`} className="t-h2 mt-6 max-w-[820px]">
            {chapter.title}
            <br />
            <span className="t-second">{chapter.subtitle}</span>
          </h2>
          <blockquote className="t-lede mt-7 max-w-[640px]">
            <p>{chapter.intro}</p>
          </blockquote>
          <div className="mt-12 max-w-[720px] space-y-12 md:mt-16 md:space-y-14">
            {chapter.sections.map((s, i) => (
              <Section key={i} chapter={chapter} s={s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
