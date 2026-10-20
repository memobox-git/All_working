import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { Inline } from "./inline";
import type { Block } from "./types";
import { Callout, Cards, ChecklistGrid, Diagram, FeatureCards, Flow, IconGrid, LinkCard, Practice, Takeaways, Tiles } from "./visuals";

const LANG_LABEL: Record<string, string> = {
  python: "Python",
  bash: "Bash",
  dax: "DAX",
  "powerquery-m": "Power Query M",
  sql: "SQL",
  text: "Text",
};

// <CodeBlock> inside .prose-s would pick up the inline-code chip style (.prose-s code), so reset it here.
export function Code({ code, language = "text", className = "" }: { code: string; language?: string; className?: string }) {
  return (
    <CodeBlock
      code={code}
      language={language}
      filename={LANG_LABEL[language] ?? language}
      className={`[&_code]:bg-transparent [&_code]:p-0 [&_code]:[font-size:inherit] ${className}`}
    />
  );
}

// A table in a hairline frame that scrolls sideways instead of widening the page.
export function DataTable({ head, rows, className = "" }: { head: ReactNode[]; rows: ReactNode[][]; className?: string }) {
  const wide = head.length >= 4;
  return (
    <div className={`scroll-x border border-line bg-white ${className}`}>
      <table className={`m-0 w-full border-collapse text-left text-[15px] leading-snug ${wide ? "min-w-[540px]" : ""}`}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                scope="col"
                className="border-b border-line bg-fill px-3 py-2.5 align-bottom font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-muted md:px-4"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const last = i === rows.length - 1;
            return (
              <tr key={i}>
                {r.map((c, j) => (
                  <td
                    key={j}
                    className={`px-3 py-3 align-top md:px-4 ${last ? "border-b-0" : "border-b border-line"} ${j === 0 ? "font-medium text-ink" : "text-ink-2"}`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case "lede":
      return (
        <p className="text-[1.1875rem] leading-[1.5] tracking-[-0.01em] text-ink md:text-[1.375rem]">
          <Inline text={b.text} />
        </p>
      );
    case "heading":
      return (
        <h4 className="mt-12 text-[1.375rem] font-medium leading-tight tracking-[-0.02em] text-ink md:text-[1.5rem]">
          <Inline text={b.text} />
        </h4>
      );
    case "paragraph":
      return (
        <p>
          <Inline text={b.text} />
        </p>
      );
    case "list": {
      const items = b.items.map((t, i) => (
        <li key={i}>
          <Inline text={t} />
        </li>
      ));
      return b.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case "callout":
      return <Callout title={b.title} text={b.text} />;
    case "code":
      return <Code code={b.code} language={b.language} className="my-8" />;
    case "table":
      return (
        <DataTable
          className="my-8"
          head={b.head.map((h, i) => <Inline key={i} text={h} />)}
          rows={b.rows.map((r) => r.map((c, i) => <Inline key={i} text={c} />))}
        />
      );
    case "cards":
      return <Cards items={b.items} columns={b.columns} />;
    case "takeaways":
      return <Takeaways items={b.items} />;
    case "practice":
      return <Practice items={b.items} />;
    case "pipeline":
      return <Flow items={b.items} label="Pipeline" />;
    case "steps":
      return <Flow items={b.items} label="Workflow steps" />;
    case "tiles":
      return <Tiles items={b.items} />;
    case "icon-grid":
      return <IconGrid items={b.items} columns={b.columns} />;
    case "checklist-grid":
      return <ChecklistGrid items={b.items} columns={b.columns} />;
    case "feature-cards":
      return <FeatureCards items={b.items} columns={b.columns} />;
    case "link-card":
      return <LinkCard label={b.label} text={b.text} link={b.link} />;
    case "diagram":
      return <Diagram b={b} />;
    default:
      return null;
  }
}

export function LessonBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-s max-w-[720px]">
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} />
      ))}
    </div>
  );
}
