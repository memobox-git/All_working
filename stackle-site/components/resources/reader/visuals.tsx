import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Pixel } from "@/components/icons";
import { Inline } from "./inline";
import type { ClusterNode, DiagramBlock, FeatureCard, HierarchyNode, TextItem } from "./types";

// The course readers' special visuals, redrawn in the Sigil look: hairline boxes that share borders,
// mono labels, ink arrows, and inversion or hatching instead of colour. All plain HTML so the text
// stays readable on phones and in the static HTML.

export const pad2 = (n: number) => String(n).padStart(2, "0");

// A grid whose cells share 1px hairlines like a table. Empty cells at the end of the last row are
// hatched so the frame stays closed.
function CellGrid({ cols, n, children, label }: { cols: 2 | 3; n: number; children: ReactNode; label?: string }) {
  const fill = (cols - (n % cols)) % cols;
  return (
    <div
      role="list"
      aria-label={label}
      className={`my-10 grid gap-px border border-line bg-line ${cols === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}
    >
      {children}
      {Array.from({ length: fill }, (_, i) => (
        <div key={`f${i}`} aria-hidden="true" className={`fill-hatch bg-white ${cols === 3 ? "hidden md:block" : "hidden sm:block"}`} />
      ))}
    </div>
  );
}

// pipeline (Spark) and steps (Power BI): numbered boxes joined by arrows; the last box is inverted.
export function Flow({ items, label }: { items: string[]; label: string }) {
  return (
    <ol aria-label={label} className="my-10 grid list-none border border-line bg-white p-0 md:grid-cols-5">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <li
            key={i}
            className={`relative mt-0 flex items-center gap-4 px-4 py-4 md:min-h-[116px] md:flex-col md:items-start md:justify-between md:gap-6 ${i ? "border-t border-line md:border-l md:border-t-0" : ""} ${last ? "bg-ink text-paper" : ""}`}
          >
            <span className={`t-mono-sm w-5 shrink-0 ${last ? "text-night-muted" : "text-muted"}`}>{pad2(i + 1)}</span>
            <span className="text-[16px] font-medium leading-tight">{it}</span>
            {!last && (
              <span
                aria-hidden="true"
                className="absolute -bottom-3 right-4 z-10 grid h-6 w-6 place-items-center border border-ink bg-paper text-ink md:-right-3 md:bottom-auto md:top-1/2 md:-translate-y-1/2"
              >
                <ArrowRight size={12} className="rotate-90 md:rotate-0" />
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
    <CellGrid cols={cols} n={items.length}>
      {items.map((c, i) => (
        <div role="listitem" key={i} className="bg-white p-5 md:p-6">
          <p className="text-[17px] font-medium tracking-[-0.01em] text-ink">{c.title}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
            <Inline text={c.text} />
          </p>
        </div>
      ))}
    </CellGrid>
  );
}

// feature-cards: a tag (label or badge chip, or a pixel number), title and text. The highlighted card
// gets an inverted chip, an ink frame and corner brackets.
export function FeatureCards({ items, columns = 2 }: { items: FeatureCard[]; columns?: number }) {
  const cols = columns >= 3 ? 3 : 2;
  return (
    <CellGrid cols={cols} n={items.length}>
      {items.map((c, i) => {
        const tag = c.badge ?? c.label;
        return (
          <div
            role="listitem"
            key={i}
            className={`relative bg-white p-5 md:p-6 ${c.highlight ? "corners outline outline-1 -outline-offset-1 outline-ink" : ""}`}
          >
            {c.number ? (
              <span className="t-pixel block text-[36px] leading-none text-ink">{c.number}</span>
            ) : tag ? (
              <span
                className={`t-mono-sm inline-flex items-center gap-2 border px-2 py-1.5 ${c.highlight ? "border-ink bg-ink text-paper" : "border-line text-ink"}`}
              >
                {c.highlight && <span aria-hidden="true" className="h-1.5 w-1.5 bg-paper" />}
                {tag}
              </span>
            ) : null}
            <p className="mt-5 text-[19px] font-medium leading-snug tracking-[-0.015em] text-ink">{c.title}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              <Inline text={c.text} />
            </p>
          </div>
        );
      })}
    </CellGrid>
  );
}

// tiles (headline variant): big words with the question each one answers.
export function Tiles({ items }: { items: TextItem[] }) {
  return (
    <CellGrid cols={3} n={items.length}>
      {items.map((t, i) => (
        <div role="listitem" key={i} className="bg-white p-5 md:p-6">
          <span className="t-mono-sm text-muted">{pad2(i + 1)}</span>
          <p className="mt-4 text-[1.625rem] font-medium leading-none tracking-[-0.035em] text-ink md:mt-10 md:text-[1.875rem]">{t.title}</p>
          <p className="mt-2 text-[15px] text-muted">{t.text}</p>
        </div>
      ))}
    </CellGrid>
  );
}

export function IconGrid({ items, columns = 2 }: { items: string[]; columns?: number }) {
  return (
    <CellGrid cols={columns >= 3 ? 3 : 2} n={items.length} label="Data sources">
      {items.map((t, i) => (
        <div role="listitem" key={i} className="flex items-center gap-3 bg-white px-5 py-4 text-[15px] text-ink">
          <Pixel name="db" size={14} className="text-ink" />
          <span>{t}</span>
        </div>
      ))}
    </CellGrid>
  );
}

export function ChecklistGrid({ items, columns = 2 }: { items: string[]; columns?: number }) {
  return (
    <CellGrid cols={columns >= 3 ? 3 : 2} n={items.length}>
      {items.map((t, i) => (
        <div role="listitem" key={i} className="flex items-baseline gap-3 bg-white px-5 py-3.5 text-[15px] text-ink">
          <Pixel name="check" size={12} className="translate-y-[1px] text-ink" />
          <span>{t}</span>
        </div>
      ))}
    </CellGrid>
  );
}

export function Callout({ title, text }: { title?: string; text: string }) {
  return (
    <aside className="my-8 border-l-2 border-ink bg-fill px-5 py-4 md:px-6 md:py-5">
      {title && <p className="t-mono text-ink">{title}</p>}
      <p className="mt-2 text-[16px] leading-relaxed text-ink-2">
        <Inline text={text} />
      </p>
    </aside>
  );
}

// practice: the JSON items carry their own "1. " prefixes; the list numbers them, so drop those.
export function Practice({ items }: { items: string[] }) {
  return (
    <section aria-label="Practice" className="my-10 border border-ink bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <span className="label">Practice</span>
        <span className="t-mono-sm text-muted">{items.length} tasks</span>
      </div>
      <ol className="m-0 list-none p-0">
        {items.map((it, i) => (
          <li key={i} className={`mt-0 grid grid-cols-[32px_1fr] gap-2 px-5 py-4 text-[16px] leading-relaxed ${i ? "border-t border-line" : ""}`}>
            <span className="t-mono-sm pt-[5px] text-muted">{pad2(i + 1)}</span>
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
    <section className="mt-14 border-t border-ink pt-6">
      <h4 className="t-mono text-ink">Key takeaways</h4>
      <ul className="mt-4">
        {items.map((t, i) => (
          <li key={i}>
            <Inline text={t} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LinkCard({ label, text, link }: { label: string; text: string; link: { label: string; url: string; external?: boolean } }) {
  const external = link.external ?? /^https?:/.test(link.url);
  return (
    <div className="my-10 grid border border-line bg-white md:grid-cols-[minmax(0,1fr)_auto]">
      <div className="p-5 md:p-6">
        <span className="label">{label}</span>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
          <Inline text={text} />
        </p>
      </div>
      <div className="fill-dots flex items-end border-t border-line p-5 md:border-l md:border-t-0 md:p-6">
        <a
          href={link.url}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="dlink text-[16px] text-ink no-underline"
        >
          {link.label.replace(/\s*→\s*$/, "")}
          <ArrowUpRight />
        </a>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- diagrams */

function ClusterBox({ node }: { node: ClusterNode }) {
  return (
    <div className={`relative self-center bg-white p-5 ${node.highlight ? "corners border border-ink" : "border border-line"}`}>
      {node.eyebrow && <p className="t-mono-sm text-muted">{node.eyebrow}</p>}
      <p className="mt-2 text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">{node.title}</p>
      {node.subtitle && <p className="mt-1 text-[14px] text-muted">{node.subtitle}</p>}
      {node.children?.length ? (
        <div role="list" className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-2">
          {node.children.map((c) => {
            const [a, b] = c.split(/\s*·\s*/);
            return (
              <div role="listitem" key={c} className="bg-paper px-3 py-3">
                {b ? (
                  <>
                    <p className="t-mono-sm text-muted">{a}</p>
                    <p className="mt-1 text-[15px] font-medium text-ink">{b}</p>
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
  const label = (b.edges[0]?.label ?? "").replace(/→/g, "").replace(/\s+/g, " ").trim();
  return (
    <figure aria-label={b.ariaLabel} className="my-10 border border-line bg-white">
      <div className="fill-dots grid p-5 md:grid-cols-[minmax(0,1fr)_120px_minmax(0,1.5fr)] md:p-8">
        <ClusterBox node={left} />
        <div aria-hidden={!label} className="flex items-center justify-center">
          {/* phone: vertical connector */}
          <div className="flex flex-col items-center py-1 md:hidden">
            <span className="h-5 w-px bg-ink" />
            <span className="t-mono-sm border border-ink bg-white px-2 py-1 text-ink">{label}</span>
            <span className="h-5 w-px bg-ink" />
            <ArrowRight size={12} className="-mt-1 rotate-90 text-ink" />
          </div>
          {/* tablet and up: horizontal connector */}
          <div className="hidden w-full flex-col items-center gap-2 md:flex">
            <span className="t-mono-sm px-2 text-center leading-snug text-ink">{label}</span>
            <span className="flex w-full items-center text-ink">
              <span className="h-px flex-1 bg-ink" />
              <ArrowRight size={12} className="-ml-[7px]" />
            </span>
          </div>
        </div>
        <ClusterBox node={right} />
      </div>
      {b.caption && (
        <figcaption className="border-t border-line px-5 py-3 text-[14px] leading-snug text-muted md:px-8">{b.caption}</figcaption>
      )}
    </figure>
  );
}

function HierarchyBox({ node, depth }: { node: HierarchyNode; depth: number }) {
  const kids = node.children ?? [];
  if (!kids.length) {
    return (
      <div role="listitem" className="border border-line bg-white p-4">
        <p className="text-[18px] font-medium tracking-[-0.01em] text-ink">{node.label}</p>
        {node.text && <p className="mt-1 text-[14px] text-muted">{node.text}</p>}
      </div>
    );
  }
  const leaves = kids.every((k) => !k.children?.length);
  return (
    <div role={depth ? "listitem" : undefined} className={depth === 0 ? "fill-hatch border border-ink p-3 md:p-4" : "border border-line bg-paper p-3 md:p-4"}>
      <span className="t-mono-sm inline-flex items-center gap-2 border border-line bg-white px-2 py-1.5 text-ink">
        <span aria-hidden="true" className="h-1.5 w-1.5 bg-ink" />
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
  const rail = (i: number, extra = "") =>
    steps[i] ? (
      <p className={`t-mono-sm flex items-center gap-2 text-ink ${extra}`}>
        <span className="text-muted">{pad2(i + 1)}</span>
        {steps[i]}
      </p>
    ) : (
      <span />
    );
  return (
    <figure aria-label={`Shuffle: ${steps.join(", then ")}`} className="my-10 border border-line bg-white p-5 md:p-6">
      <div className="grid md:grid-cols-[132px_minmax(0,1fr)] md:items-center md:gap-x-6">
        {rail(0, "pb-2 md:pb-0")}
        <div role="list" aria-label="Input partitions" className="grid gap-px border border-line bg-line" style={{ gridTemplateColumns: `repeat(${ins}, minmax(0, 1fr))` }}>
          {b.inputs.map((t) => (
            <div role="listitem" key={t} className="bg-paper px-1 py-3 text-center text-[14px] text-ink md:text-[15px]">
              {t}
            </div>
          ))}
        </div>
        {rail(1, "hidden md:flex")}
        <div className="relative">
          <svg viewBox="0 0 600 80" preserveAspectRatio="none" className="block h-[72px] w-full md:h-20" aria-hidden="true">
            {b.inputs.flatMap((_, i) =>
              b.outputs.map((__, o) => (
                <line
                  key={`${i}-${o}`}
                  x1={((i + 0.5) * 600) / ins}
                  y1={0}
                  x2={((o + 0.5) * 600) / outs}
                  y2={80}
                  stroke="#111110"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  vectorEffect="non-scaling-stroke"
                />
              )),
            )}
          </svg>
          {steps[1] && (
            <span className="t-mono-sm absolute inset-0 m-auto h-fit w-fit border border-ink bg-white px-2 py-1 text-ink md:hidden">
              {steps[1]}
            </span>
          )}
        </div>
        {rail(2, "order-last pt-2 md:order-none md:pt-0")}
        <div role="list" aria-label="Output partitions" className="grid gap-px border border-ink bg-ink" style={{ gridTemplateColumns: `repeat(${outs}, minmax(0, 1fr))` }}>
          {b.outputs.map((t) => (
            <div role="listitem" key={t} className="bg-white px-2 py-3 text-center text-[15px] font-medium text-ink">
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
    <figure aria-label="Spark UI, stage view" className="my-10 border border-ink bg-white">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="t-mono-sm text-ink">Spark UI</span>
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2 w-2 border border-ink" />
          <span className="h-2 w-2 border border-ink" />
          <span className="h-2 w-2 bg-ink" />
        </span>
      </div>
      <div className="scroll-x border-b border-line">
        <div className="flex min-w-max">
          {b.tabs.map((t) => {
            const on = t === b.activeTab;
            return (
              <span key={t} aria-current={on ? "true" : undefined} className={`t-mono-sm border-r border-line px-2.5 py-3 sm:px-4 ${on ? "bg-ink text-paper" : "text-muted"}`}>
                {t}
              </span>
            );
          })}
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-px bg-line">
        {b.metrics.map((m) => (
          <div key={m.label} className={`flex flex-col px-3 py-4 sm:px-5 sm:py-5 ${m.highlight ? "bg-ink text-paper" : "bg-white text-ink"}`}>
            <dt className={`t-mono-sm order-2 mt-2 leading-snug ${m.highlight ? "text-night-muted" : "text-muted"}`}>{m.label}</dt>
            <dd className="t-pixel order-1 whitespace-nowrap text-[22px] leading-none sm:text-[34px]">{m.value}</dd>
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
  return (
    <figure aria-label={`${b.from} ${b.fromCardinality} to ${b.toCardinality} ${b.to}, ${b.label}`} className="fill-dots my-10 border border-line px-5 py-10">
      <div className="flex flex-col items-center sm:flex-row sm:justify-center">
        <div className="border border-ink bg-white px-6 py-4 text-[18px] font-medium tracking-[-0.01em] text-ink">{b.from}</div>
        <div className="relative flex flex-col items-center sm:flex-row" aria-hidden="true">
          <span className="px-2.5 py-1.5 font-mono text-[18px] font-medium leading-none text-ink">{b.fromCardinality}</span>
          <span className="h-10 w-px bg-ink sm:h-px sm:w-28 md:w-40" />
          <span className="px-2.5 py-1.5 font-mono text-[18px] font-medium leading-none text-ink">{b.toCardinality}</span>
          <span className="t-mono-sm absolute left-[calc(50%+16px)] top-1/2 -translate-y-1/2 whitespace-nowrap text-muted sm:left-1/2 sm:top-[calc(50%+14px)] sm:-translate-x-1/2 sm:translate-y-0">
            {b.label}
          </span>
        </div>
        <div className="relative mt-2 sm:mr-2 sm:mt-0">
          <span aria-hidden="true" className="absolute inset-0 -translate-y-2 translate-x-2 border border-line bg-white" />
          <span aria-hidden="true" className="absolute inset-0 -translate-y-1 translate-x-1 border border-line bg-white" />
          <div className="relative border border-ink bg-white px-6 py-4 text-[18px] font-medium tracking-[-0.01em] text-ink">{b.to}</div>
        </div>
      </div>
    </figure>
  );
}

export function Diagram({ b }: { b: DiagramBlock }) {
  switch (b.diagram) {
    case "cluster-architecture":
      return <ClusterDiagram b={b} />;
    case "execution-hierarchy":
      return (
        <figure aria-label="Execution hierarchy" className="my-10 border border-line bg-white p-4 md:p-6">
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
