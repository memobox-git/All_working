import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Pixel } from "@/components/icons";
import { Inline } from "./inline";
import type { ClusterNode, DiagramBlock, FeatureCard, HierarchyNode, TextItem } from "./types";

// The course readers' special visuals in the editorial look: rounded white cards with soft borders,
// serif titles and numbers, sentence-case pills and thin line icons. Ink only: an ink outline marks the
// one thing to notice. All plain HTML so the text stays readable on phones and in the static HTML.

export const pad2 = (n: number) => String(n).padStart(2, "0");

const CARD = "rounded-[14px] border border-line bg-white";
// A small sentence-case pill, used for tags and diagram labels.
const PILL = "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-medium leading-snug";

// Cards with gaps between them (no shared hairlines, no filler cells).
function CardGrid({ cols, children, label }: { cols: 2 | 3; children: ReactNode; label?: string }) {
  return (
    <div role="list" aria-label={label} className={`my-10 grid gap-3 md:gap-4 ${cols === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
      {children}
    </div>
  );
}

// pipeline (Spark) and steps (Power BI): numbered cards joined by small round arrows; the last card,
// where the flow ends, gets an ink outline.
export function Flow({ items, label }: { items: string[]; label: string }) {
  return (
    <ol
      aria-label={label}
      className="my-10 grid list-none gap-4 p-0 md:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
      style={{ ["--n" as string]: items.length }}
    >
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <li
            key={i}
            className={`relative mt-0 flex items-center gap-4 rounded-[14px] border bg-white px-4 py-3.5 md:min-h-[124px] md:flex-col md:items-start md:justify-between md:gap-6 md:p-5 ${last ? "border-ink" : "border-line"}`}
          >
            <span className={`t-serif w-6 shrink-0 text-[16px] leading-none ${last ? "text-ink" : "text-muted"}`}>{pad2(i + 1)}</span>
            <span className="text-[16px] font-medium leading-tight text-ink">{it}</span>
            {!last && (
              <span
                aria-hidden="true"
                className="absolute -bottom-5 left-3.5 z-10 grid h-6 w-6 place-items-center rounded-full border border-line-strong bg-paper text-ink md:-right-5 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2"
              >
                <ArrowRight size={11} className="rotate-90 md:rotate-0" />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function Cards({ items, columns = 2 }: { items: TextItem[]; columns?: number }) {
  const cols = columns >= 3 ? 3 : 2;
  return (
    <CardGrid cols={cols}>
      {items.map((c, i) => (
        <div role="listitem" key={i} className={`${CARD} p-5 md:p-6`}>
          <p className="t-serif text-[21px] leading-snug tracking-[-0.01em] text-ink">{c.title}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
            <Inline text={c.text} />
          </p>
        </div>
      ))}
    </CardGrid>
  );
}

// feature-cards: a tag (label or badge pill, or a serif number), title and text. The highlighted card
// gets an ink outline and an ink pill.
export function FeatureCards({ items, columns = 2 }: { items: FeatureCard[]; columns?: number }) {
  const cols = columns >= 3 ? 3 : 2;
  return (
    <CardGrid cols={cols}>
      {items.map((c, i) => {
        const tag = c.badge ?? c.label;
        return (
          <div
            role="listitem"
            key={i}
            className={`relative rounded-[14px] border bg-white p-5 md:p-6 ${c.highlight ? "border-ink shadow-[var(--shadow-card)]" : "border-line"}`}
          >
            {c.number ? (
              <span className="t-serif block text-[40px] leading-none tracking-[-0.03em] text-muted">{c.number}</span>
            ) : tag ? (
              <span className={`${PILL} ${c.highlight ? "border-ink bg-ink text-paper" : "border-line-strong bg-paper text-ink-2"}`}>
                {c.highlight && <Pixel name="check" size={12} />}
                {tag}
              </span>
            ) : null}
            <p className="t-serif mt-5 text-[22px] leading-snug tracking-[-0.015em] text-ink">{c.title}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              <Inline text={c.text} />
            </p>
          </div>
        );
      })}
    </CardGrid>
  );
}

// tiles (headline variant): big serif words with the question each one answers.
export function Tiles({ items }: { items: TextItem[] }) {
  return (
    <CardGrid cols={3}>
      {items.map((t, i) => (
        <div role="listitem" key={i} className={`${CARD} p-5 md:p-6`}>
          <span className="t-serif text-[15px] text-muted">{pad2(i + 1)}</span>
          <p className="t-serif mt-4 text-[1.875rem] leading-none tracking-[-0.025em] text-ink md:mt-10 md:text-[2.125rem]">{t.title}</p>
          <p className="mt-2.5 text-[15px] text-muted">{t.text}</p>
        </div>
      ))}
    </CardGrid>
  );
}

export function IconGrid({ items, columns = 2 }: { items: string[]; columns?: number }) {
  return (
    <CardGrid cols={columns >= 3 ? 3 : 2} label="Data sources">
      {items.map((t, i) => (
        <div role="listitem" key={i} className={`${CARD} flex items-center gap-3.5 px-4 py-3.5 text-[15px] text-ink`}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong bg-paper">
            <Pixel name="db" size={17} />
          </span>
          <span>{t}</span>
        </div>
      ))}
    </CardGrid>
  );
}

// checklist-grid: one card with a two-column list of line checks.
export function ChecklistGrid({ items, columns = 2 }: { items: string[]; columns?: number }) {
  return (
    <div role="list" className={`${CARD} my-10 grid gap-x-8 gap-y-3.5 p-5 md:p-6 ${columns >= 3 ? "sm:grid-cols-2 md:grid-cols-3" : "sm:grid-cols-2"}`}>
      {items.map((t, i) => (
        <div role="listitem" key={i} className="flex items-start gap-3 text-[15px] leading-snug text-ink">
          <Pixel name="check" size={17} className="-mt-px text-ink" />
          <span>{t}</span>
        </div>
      ))}
    </div>
  );
}

export function Callout({ title, text }: { title?: string; text: string }) {
  return (
    <aside className="my-8 rounded-[12px] bg-fill px-5 py-4 md:px-6 md:py-5">
      {title && <p className="text-[15px] font-semibold text-ink">{title}</p>}
      <p className={`${title ? "mt-1.5" : ""} text-[16px] leading-relaxed text-ink-2`}>
        <Inline text={text} />
      </p>
    </aside>
  );
}

// practice: the JSON items carry their own "1. " prefixes; the list numbers them, so drop those.
export function Practice({ items }: { items: string[] }) {
  return (
    <section aria-label="Practice" className="my-10 rounded-[12px] bg-fill px-5 pb-2 pt-5 md:px-6 md:pt-6">
      <div className="flex items-center justify-between gap-3 pb-3">
        <span className="label">Practice</span>
        <span className="text-[13.5px] text-muted">{items.length} tasks</span>
      </div>
      <ol className="m-0 list-none p-0">
        {items.map((it, i) => (
          <li key={i} className="mt-0 grid grid-cols-[32px_1fr] gap-2 border-t border-line-strong/60 py-3.5 text-[16px] leading-relaxed">
            <span className="t-serif pt-px text-[16px] text-muted">{pad2(i + 1)}</span>
            <span>
              <Inline text={it.replace(/^\s*\d+\.\s+/, "")} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Takeaways({ items }: { items: string[] }) {
  return (
    <section className="mt-14 rounded-[12px] bg-fill px-5 py-5 md:px-7 md:py-6">
      <h4 className="t-serif text-[1.375rem] leading-tight tracking-[-0.01em] text-ink">Key takeaways</h4>
      <ul className="mt-4">
        {items.map((t, i) => (
          <li key={i} className="flex gap-3 pl-0 before:hidden">
            <Pixel name="check" size={16} className="mt-[5px] text-ink" />
            <span>
              <Inline text={t} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LinkCard({ label, text, link }: { label: string; text: string; link: { label: string; url: string; external?: boolean } }) {
  const external = link.external ?? /^https?:/.test(link.url);
  return (
    <div className={`${CARD} my-10 flex flex-col items-start gap-6 p-5 md:flex-row md:items-end md:justify-between md:gap-10 md:p-7`}>
      <div className="max-w-[440px]">
        <span className="label">{label}</span>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
          <Inline text={text} />
        </p>
      </div>
      <a
        href={link.url}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="btn btn-line btn-chrome max-w-full shrink-0 whitespace-normal text-left no-underline"
      >
        {link.label.replace(/\s*→\s*$/, "")}
        <ArrowUpRight />
      </a>
    </div>
  );
}

/* ---------------------------------------------------------------- diagrams */

// A white frame with a paper canvas inside, like a mounted print.
function Canvas({ label, children, caption, className = "" }: { label?: string; children: ReactNode; caption?: ReactNode; className?: string }) {
  return (
    <figure aria-label={label} className="my-10 rounded-[16px] border border-line bg-white p-2">
      <div className={`rounded-[10px] bg-paper ${className}`}>{children}</div>
      {caption && <figcaption className="px-3 pb-1.5 pt-3 text-[14px] leading-snug text-muted md:px-4">{caption}</figcaption>}
    </figure>
  );
}

function ClusterBox({ node }: { node: ClusterNode }) {
  return (
    <div className={`relative self-center rounded-[14px] border bg-white p-5 ${node.highlight ? "border-ink shadow-[var(--shadow-card)]" : "border-line"}`}>
      {node.eyebrow && <p className="t-mono-sm text-muted">{node.eyebrow}</p>}
      <p className="t-serif mt-2.5 text-[26px] leading-tight tracking-[-0.02em] text-ink">{node.title}</p>
      {node.subtitle && <p className="mt-1 text-[14px] text-muted">{node.subtitle}</p>}
      {node.children?.length ? (
        <div role="list" className="mt-4 grid gap-2 sm:grid-cols-2">
          {node.children.map((c) => {
            const [a, b] = c.split(/\s*·\s*/);
            return (
              <div role="listitem" key={c} className="rounded-[10px] border border-line-soft bg-paper px-3.5 py-3">
                {b ? (
                  <>
                    <p className="text-[12.5px] text-muted">{a}</p>
                    <p className="mt-0.5 text-[15px] font-medium text-ink">{b}</p>
                  </>
                ) : (
                  <p className="text-[15px] font-medium text-ink">{a}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ClusterDiagram({ b }: { b: Extract<DiagramBlock, { diagram: "cluster-architecture" }> }) {
  const [left, right] = b.nodes;
  const raw = (b.edges[0]?.label ?? "").replace(/→/g, "").replace(/\s+/g, " ").trim();
  const label = raw ? raw[0].toUpperCase() + raw.slice(1) : "";
  return (
    <Canvas label={b.ariaLabel} caption={b.caption} className="grid p-4 md:grid-cols-[minmax(0,1fr)_128px_minmax(0,1.5fr)] md:p-7">
      <ClusterBox node={left} />
      <div aria-hidden={!label} className="flex items-center justify-center">
        {/* phone: vertical connector */}
        <div className="flex flex-col items-center py-1 md:hidden">
          <span className="h-5 w-px bg-ink" />
          {label && <span className={`${PILL} border-line-strong bg-white text-ink`}>{label}</span>}
          <span className="h-5 w-px bg-ink" />
          <ArrowRight size={12} className="-mt-1 rotate-90 text-ink" />
        </div>
        {/* tablet and up: horizontal connector */}
        <div className="hidden w-full flex-col items-center gap-2.5 md:flex">
          {label && <span className="px-2 text-center text-[13px] font-medium leading-snug text-ink">{label}</span>}
          <span className="flex w-full items-center text-ink">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
            <span className="h-px flex-1 bg-ink" />
            <ArrowRight size={12} className="-ml-[7px]" />
          </span>
        </div>
      </div>
      <ClusterBox node={right} />
    </Canvas>
  );
}

function HierarchyBox({ node, depth }: { node: HierarchyNode; depth: number }) {
  const kids = node.children ?? [];
  if (!kids.length) {
    return (
      <div role="listitem" className="rounded-[10px] border border-line-soft bg-paper p-4">
        <p className="t-serif text-[20px] leading-tight tracking-[-0.01em] text-ink">{node.label}</p>
        {node.text && <p className="mt-1 text-[14px] text-muted">{node.text}</p>}
      </div>
    );
  }
  const leaves = kids.every((k) => !k.children?.length);
  const even = depth % 2 === 0;
  return (
    <div
      role={depth ? "listitem" : undefined}
      className={`rounded-[12px] p-3 md:p-4 ${even ? "bg-paper" : "border border-line bg-white"}`}
    >
      <span className={`${PILL} ${even ? "border-line-strong bg-white" : "border-line bg-paper"} text-ink`}>
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink" />
        {node.label}
      </span>
      <div role="list" className={`mt-3 grid gap-3 ${leaves && kids.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {kids.map((k) => (
          <HierarchyBox key={k.label} node={k} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
}

function ShuffleDiagram({ b }: { b: Extract<DiagramBlock, { diagram: "shuffle" }> }) {
  const steps = b.label.split("↓").map((s) => s.trim());
  const ins = b.inputs.length;
  const outs = b.outputs.length;
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  const rail = (i: number, extra = "") =>
    steps[i] ? (
      <p className={`flex items-baseline gap-2.5 text-[14px] font-medium text-ink ${extra}`}>
        <span className="t-serif text-[15px] font-normal text-muted">{pad2(i + 1)}</span>
        {cap(steps[i])}
      </p>
    ) : (
      <span />
    );
  return (
    <figure aria-label={`Shuffle: ${steps.join(", then ")}`} className={`${CARD} my-10 p-5 md:p-6`}>
      <div className="grid md:grid-cols-[140px_minmax(0,1fr)] md:items-center md:gap-x-6">
        {rail(0, "pb-2.5 md:pb-0")}
        <div role="list" aria-label="Input partitions" className="grid gap-2" style={{ gridTemplateColumns: `repeat(${ins}, minmax(0, 1fr))` }}>
          {b.inputs.map((t) => (
            <div role="listitem" key={t} className="rounded-[10px] border border-line bg-paper px-1 py-3 text-center text-[14px] text-ink md:text-[15px]">
              {t}
            </div>
          ))}
        </div>
        {rail(1, "hidden md:flex")}
        <div className="relative text-ink-2">
          <svg viewBox="0 0 600 80" preserveAspectRatio="none" className="block h-[72px] w-full md:h-20" aria-hidden="true">
            {b.inputs.flatMap((_, i) =>
              b.outputs.map((__, o) => (
                <line
                  key={`${i}-${o}`}
                  x1={((i + 0.5) * 600) / ins}
                  y1={0}
                  x2={((o + 0.5) * 600) / outs}
                  y2={80}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )),
            )}
          </svg>
          {steps[1] && (
            <span className={`${PILL} absolute inset-0 m-auto h-fit w-fit border-line-strong bg-white text-ink md:hidden`}>{cap(steps[1])}</span>
          )}
        </div>
        {rail(2, "order-last pt-2.5 md:order-none md:pt-0")}
        <div role="list" aria-label="Output partitions" className="grid gap-2" style={{ gridTemplateColumns: `repeat(${outs}, minmax(0, 1fr))` }}>
          {b.outputs.map((t) => (
            <div role="listitem" key={t} className="rounded-[10px] border border-ink bg-white px-2 py-3 text-center text-[15px] font-medium text-ink">
              {t}
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

function SparkUiMock({ b }: { b: Extract<DiagramBlock, { diagram: "spark-ui-mock" }> }) {
  return (
    <figure aria-label="Spark UI, stage view" className="card-float my-10 overflow-hidden">
      <div className="flex items-center gap-4 border-b border-line px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full border border-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full border border-line-strong" />
        </span>
        <span className="text-[13.5px] font-semibold text-ink">Spark UI</span>
      </div>
      <div className="scroll-x border-b border-line">
        <div className="flex min-w-max px-2">
          {b.tabs.map((t) => {
            const on = t === b.activeTab;
            return (
              <span
                key={t}
                aria-current={on ? "true" : undefined}
                className={`px-2.5 py-3 text-[14px] sm:px-3.5 ${on ? "font-medium text-ink shadow-[inset_0_-2px_0_var(--color-ink)]" : "text-muted"}`}
              >
                {t}
              </span>
            );
          })}
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-2 p-2 sm:gap-3 sm:p-3">
        {b.metrics.map((m) => (
          <div key={m.label} className={`flex flex-col rounded-[12px] px-3 py-4 sm:px-5 sm:py-5 ${m.highlight ? "bg-night text-paper" : "bg-paper text-ink"}`}>
            <dt className={`order-2 mt-2 text-[12.5px] leading-snug sm:text-[13.5px] ${m.highlight ? "text-night-muted" : "text-muted"}`}>{m.label}</dt>
            <dd className="t-serif order-1 whitespace-nowrap text-[22px] leading-none tracking-[-0.02em] sm:text-[34px]">{m.value}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="border-t border-line px-4 py-3 text-[13px] leading-snug text-muted">
        Illustration: the numbers are examples, not measurements from a real job.
      </figcaption>
    </figure>
  );
}

function RelationshipDiagram({ b }: { b: Extract<DiagramBlock, { diagram: "relationship" }> }) {
  const box = "rounded-[12px] border bg-white px-6 py-4 t-serif text-[22px] leading-none tracking-[-0.01em] text-ink";
  return (
    <Canvas label={`${b.from} ${b.fromCardinality} to ${b.toCardinality} ${b.to}, ${b.label}`} className="px-5 py-10 md:py-12">
      <div className="flex flex-col items-center sm:flex-row sm:justify-center">
        <div className={`${box} border-ink shadow-[var(--shadow-card)]`}>{b.from}</div>
        <div className="relative flex flex-col items-center sm:flex-row" aria-hidden="true">
          <span className="t-serif px-3 py-1.5 text-[22px] leading-none text-ink">{b.fromCardinality}</span>
          <span className="h-10 w-px bg-ink sm:h-px sm:w-28 md:w-40" />
          <span className="t-serif px-3 py-1.5 text-[22px] leading-none text-ink">{b.toCardinality}</span>
          <span className="absolute left-[calc(50%+16px)] top-1/2 -translate-y-1/2 whitespace-nowrap text-[13px] text-muted sm:left-1/2 sm:top-[calc(50%+12px)] sm:-translate-x-1/2 sm:translate-y-0">
            {b.label}
          </span>
        </div>
        <div className="relative mt-2 sm:mr-2 sm:mt-0">
          <span aria-hidden="true" className="absolute inset-0 -translate-y-2 translate-x-2 rounded-[12px] border border-line bg-white" />
          <span aria-hidden="true" className="absolute inset-0 -translate-y-1 translate-x-1 rounded-[12px] border border-line bg-white" />
          <div className={`relative ${box} border-line-strong`}>{b.to}</div>
        </div>
      </div>
    </Canvas>
  );
}

export function Diagram({ b }: { b: DiagramBlock }) {
  switch (b.diagram) {
    case "cluster-architecture":
      return <ClusterDiagram b={b} />;
    case "execution-hierarchy":
      return (
        <figure aria-label="Execution hierarchy" className={`${CARD} my-10 p-2`}>
          <HierarchyBox node={b.root} depth={0} />
        </figure>
      );
    case "shuffle":
      return <ShuffleDiagram b={b} />;
    case "spark-ui-mock":
      return <SparkUiMock b={b} />;
    case "relationship":
      return <RelationshipDiagram b={b} />;
    default:
      return null;
  }
}
