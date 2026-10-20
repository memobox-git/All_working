import { CodeBlock } from "@/components/code-block";
import { ArrowRight } from "@/components/icons";
import { CodeTabs } from "./code-tabs";

// Server-rendered slides for the Python for DE deck (content/resources/python-for-de-deck.json).
// Every slide fills the 16:9 stage on desktop and grows to its content on smaller screens.
// The `html` fields in the JSON only use <br>, <em>, <strong> and <code>, written by us.

export type DeckTab = { id: string; label: string; language: string; code: string };
export type DeckItem = {
  type: string;
  tone?: string | null;
  label?: string;
  title?: string;
  html?: string;
  text?: string;
  code?: string;
  language?: string;
  items?: DeckItem[];
};
export type DeckBlock = { type: string; columns?: number; items?: DeckItem[]; html?: string; tone?: string | null };
export type DeckRawSlide = {
  number: number;
  type: "cover" | "section" | "code" | "content" | "pipeline";
  eyebrow?: string;
  title?: string;
  titleHtml?: string;
  subtitle?: string;
  chips?: { label: string; tone: string | null }[];
  description?: string;
  sectionNumber?: string;
  sidebarTitle?: string;
  file?: string;
  heading?: string;
  tabs?: DeckTab[];
  blocks?: DeckBlock[];
  pipelines?: { label: string; steps: { label: string; sub: string; tone: string | null }[] }[];
};

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

// "Python for<br><em>Data Engineering</em>" -> ["Python for", "Data Engineering", true]
function titleLines(s: DeckRawSlide): [string, string | null, boolean] {
  if (!s.titleHtml) return [s.title ?? "", null, false];
  const [a, b] = s.titleHtml.split(/<br\s*\/?>/i);
  if (b === undefined) return [decode(a.replace(/<[^>]+>/g, "")), null, false];
  return [decode(a.replace(/<[^>]+>/g, "")).trim(), decode(b.replace(/<[^>]+>/g, "")).trim(), /<em>/i.test(b)];
}

const htmlCls =
  "[&_code]:bg-fill [&_code]:px-1 [&_code]:py-px [&_code]:font-mono [&_code]:text-[0.86em] [&_code]:text-ink [&_code]:[overflow-wrap:anywhere] [&_strong]:font-semibold [&_strong]:text-ink";

function Cover({ s, part }: { s: DeckRawSlide; part: number }) {
  const [a, b, em] = titleLines(s);
  return (
    <div className="on-night relative flex h-full min-h-[420px] flex-col justify-between gap-10 overflow-hidden bg-night p-6 text-paper md:p-10 lg:min-h-0 lg:p-12">
      <span aria-hidden="true" className="t-pixel pointer-events-none absolute -bottom-6 right-4 text-[180px] leading-none text-night-3 md:text-[280px]">
        {part + 1}
      </span>
      <span className="label relative self-start">{s.eyebrow}</span>
      <div className="relative">
        <h2 className="text-[clamp(2.5rem,1.4rem+4vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.045em]">
          {a}
          {b && (
            <>
              <br />
              <span className={em ? "t-second" : ""}>{b}</span>
            </>
          )}
        </h2>
        <p className="t-lede mt-5 max-w-[560px]">{s.subtitle}</p>
        {s.chips && (
          <ul className="mt-7 flex flex-wrap gap-2">
            {s.chips.map((c) => (
              <li key={c.label} className={`label ${c.tone ? "" : "label-plain"}`}>
                {c.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Section({ s }: { s: DeckRawSlide }) {
  const [a, b] = titleLines(s);
  return (
    <div className="grid h-full md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]">
      <div className="flex flex-col justify-end p-6 md:p-10 lg:p-12">
        <span className="label self-start">{s.eyebrow}</span>
        <h2 className="t-h2 mt-6">
          {a}
          {b && (
            <>
              <br />
              {b}
            </>
          )}
        </h2>
        <p className="t-lede mt-5 max-w-[520px]">{s.description}</p>
      </div>
      <div aria-hidden="true" className="fill-iso flex min-h-[160px] items-end justify-end border-t hairline p-6 md:border-l md:border-t-0 md:p-10">
        <span className="t-pixel bg-white px-3 text-[96px] leading-none md:text-[160px]">{s.sectionNumber}</span>
      </div>
    </div>
  );
}

function Code({ s, index }: { s: DeckRawSlide; index: number }) {
  const tabs = s.tabs ?? [];
  const title = s.heading?.split(" — ")[1] ?? s.heading ?? "";
  return (
    <div className="on-night flex h-full flex-col bg-night text-paper">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-night-line px-5 py-4 md:px-6">
        <span className="t-mono-sm text-night-muted">{s.sidebarTitle}</span>
        <h2 className="text-[20px] font-medium tracking-[-0.02em] md:text-[22px]">{title}</h2>
      </div>
      <CodeTabs slide={index} tabs={tabs.map((t) => ({ id: t.id, label: t.label }))} label={`${s.heading} code samples`}>
        {tabs.map((t) => (
          <CodeBlock
            key={t.id}
            code={t.code}
            language={t.language}
            filename={s.file}
            className="border-0 lg:flex lg:h-full lg:flex-col [&_pre]:text-[12.5px] [&_pre]:leading-[1.65] lg:[&_pre]:min-h-0 lg:[&_pre]:flex-1 lg:[&_pre]:overflow-auto"
          />
        ))}
      </CodeTabs>
    </div>
  );
}

function Card({ it }: { it: DeckItem }) {
  const codeish = it.title ? /[\[\](){}_./]/.test(it.title) : false;
  return (
    <div className="border hairline bg-paper p-4 md:p-5">
      {it.label && <p className="t-mono-sm text-muted">{it.label}</p>}
      {it.title && <h3 className={`mt-2 ${codeish ? "font-mono text-[16px]" : "text-[18px] font-medium tracking-[-0.01em]"}`}>{it.title}</h3>}
      {it.html && (
        <p className={`text-[14.5px] leading-[1.6] text-ink-2 ${it.label || it.title ? "mt-2" : ""} ${htmlCls}`} dangerouslySetInnerHTML={{ __html: it.html }} />
      )}
    </div>
  );
}

function Callout({ html }: { html: string }) {
  return <p className={`border-l-2 border-ink bg-fill px-4 py-3 text-[15px] leading-[1.6] text-ink-2 ${htmlCls}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

function Item({ it }: { it: DeckItem }) {
  if (it.type === "card") return <Card it={it} />;
  if (it.type === "callout") return <Callout html={it.html ?? ""} />;
  if (it.type === "label") return <p className="t-mono-sm text-muted">{it.text}</p>;
  if (it.type === "code")
    return <CodeBlock code={it.code ?? ""} language={it.language ?? "python"} className="[&_pre]:text-[12.5px] [&_pre]:leading-[1.65]" />;
  if (it.type === "stack")
    return (
      <div className="flex min-w-0 flex-col gap-3">
        {(it.items ?? []).map((x, i) => (
          <Item key={i} it={x} />
        ))}
      </div>
    );
  return null;
}

const COLS: Record<number, string> = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

function Content({ s }: { s: DeckRawSlide }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b hairline px-5 py-4 md:px-8 md:py-5">
        <p className="t-mono-sm text-muted">{s.eyebrow}</p>
        <h2 className="t-h4 mt-2 md:text-[26px]">{s.title}</h2>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 md:p-8">
        {(s.blocks ?? []).map((b, i) =>
          b.type === "grid" ? (
            <div key={i} className={`grid items-start gap-3 md:gap-4 ${COLS[b.columns ?? 2] ?? COLS[2]}`}>
              {(b.items ?? []).map((x, j) => (
                <Item key={j} it={x} />
              ))}
            </div>
          ) : b.type === "callout" ? (
            <Callout key={i} html={b.html ?? ""} />
          ) : null,
        )}
      </div>
    </div>
  );
}

function Pipeline({ s }: { s: DeckRawSlide }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b hairline px-5 py-4 md:px-8 md:py-5">
        <p className="t-mono-sm text-muted">{s.eyebrow}</p>
        <h2 className="t-h4 mt-2 md:text-[26px]">{s.title}</h2>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-8 overflow-y-auto p-5 md:p-8">
        {(s.pipelines ?? []).map((p) => (
          <div key={p.label}>
            <h3 className="t-mono-sm text-muted">{p.label}</h3>
            <ol className="mt-3 flex flex-col lg:flex-row">
              {p.steps.map((st, i) => (
                <li key={st.label} className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center">
                  <div className={`flex-1 border p-3 md:p-4 ${i === p.steps.length - 1 ? "border-ink bg-ink text-paper" : "hairline bg-paper"}`}>
                    <p className="text-[16px] font-medium">{st.label}</p>
                    <p className={`t-mono-sm mt-1.5 ${i === p.steps.length - 1 ? "text-night-muted" : "text-muted"}`}>{st.sub}</p>
                  </div>
                  {i < p.steps.length - 1 && (
                    <span aria-hidden="true" className="grid place-items-center py-1.5 text-muted lg:px-2 lg:py-0">
                      <ArrowRight className="rotate-90 lg:rotate-0" />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeckSlide({ slide, index, part }: { slide: DeckRawSlide; index: number; part: number }) {
  switch (slide.type) {
    case "cover":
      return <Cover s={slide} part={part} />;
    case "section":
      return <Section s={slide} />;
    case "code":
      return <Code s={slide} index={index} />;
    case "pipeline":
      return <Pipeline s={slide} />;
    default:
      return <Content s={slide} />;
  }
}
