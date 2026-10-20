import { CodeBlock } from "@/components/code-block";
import { ArrowRight } from "@/components/icons";
import type { Cell, Example } from "./data";

// The worked example at the end of each lesson: code, a table, a step diagram or a salary ladder.

function CellText({ c }: { c: Cell }) {
  if (typeof c === "string") return <>{c}</>;
  return (
    <>
      <span aria-hidden="true" className="tracking-[0.15em]">
        {"■".repeat(c.stars)}
      </span>
      <span className="sr-only">{c.stars} of 5</span>
    </>
  );
}

export function ExampleView({ example }: { example: Example }) {
  switch (example.kind) {
    case "code":
      return <CodeBlock code={example.code} language={example.language} filename={example.filename} />;

    case "table":
      return (
        <div className="scroll-x border border-line bg-white">
          <table className="w-full min-w-[520px] border-collapse text-[14.5px] leading-[1.45]">
            <thead>
              <tr className="border-b border-line">
                {example.columns.map((c) => (
                  <th key={c} scope="col" className="t-mono-sm px-4 py-3 text-left font-normal text-muted">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {example.rows.map((r, i) => (
                <tr key={i} className="border-b border-line last:border-b-0">
                  {r.map((c, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="px-4 py-3 text-left align-top font-medium">
                        <CellText c={c} />
                      </th>
                    ) : (
                      <td key={j} className="px-4 py-3 align-top text-ink-2">
                        <CellText c={c} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
            {example.total && (
              <tfoot>
                <tr className="bg-ink text-paper">
                  <th scope="row" colSpan={example.columns.length - 1} className="t-mono-sm px-4 py-3 text-left font-normal">
                    {example.total.label}
                  </th>
                  <td className="px-4 py-3 font-medium">{example.total.value}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      );

    case "flow":
      return (
        <ol className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3">
          {example.nodes.map((node, i) => (
            <li key={i} className="flex min-h-[104px] flex-col bg-white px-4 py-4">
              <span className="t-mono-sm flex items-center justify-between text-muted">
                <span>Step {String(i + 1).padStart(2, "0")}</span>
                {i < example.nodes.length - 1 && <ArrowRight size={12} className="text-faint" />}
              </span>
              <span className="mt-auto pt-4 text-[17px] font-medium tracking-[-0.01em]">{node.label}</span>
              {node.sub && <span className="t-small mt-0.5">{node.sub}</span>}
            </li>
          ))}
          {example.nodes.length % 2 === 1 && <li aria-hidden="true" className="fill-hatch bg-white md:hidden" />}
          {Array.from({ length: (3 - (example.nodes.length % 3)) % 3 }, (_, i) => (
            <li key={`f${i}`} aria-hidden="true" className="fill-hatch hidden bg-white md:block" />
          ))}
        </ol>
      );

    case "ladder": {
      const total = example.steps.length;
      return (
        <div>
          <ol className="border border-line bg-white">
            {example.steps
              .map((s, i) => ({ ...s, i }))
              .reverse()
              .map((s) => (
                <li key={s.i} className="grid grid-cols-[44px_1fr] items-center border-b border-line last:border-b-0 sm:grid-cols-[52px_1fr_auto]">
                  <span className="t-mono-sm row-span-2 self-stretch border-r border-line px-3 py-4 text-muted sm:row-span-1">{String(s.i + 1).padStart(2, "0")}</span>
                  <span className="px-4 pt-3 sm:py-4">
                    <span className="block font-medium">{s.level}</span>
                    <span
                      aria-hidden="true"
                      className="fill-hatch mt-2 block h-1.5 border border-line"
                      style={{ width: `${Math.round(((s.i + 1) / total) * 100)}%` }}
                    />
                  </span>
                  <span className="col-start-2 px-4 pb-3 pt-2 font-mono text-[14px] sm:col-start-3 sm:py-4 sm:text-right">{s.salary}</span>
                </li>
              ))}
          </ol>
          <p className="t-mono-sm mt-3 text-muted">Approximate US salary ranges</p>
        </div>
      );
    }
  }
}
