import { CodeBlock } from "@/components/code-block";
import { ArrowRight } from "@/components/icons";
import type { Cell, Example } from "./data";

// The worked example at the end of each lesson: code, a table, a step diagram or a salary ladder.

function CellText({ c }: { c: Cell }) {
  if (typeof c === "string") return <>{c}</>;
  return (
    <>
      <span aria-hidden="true" className="inline-flex gap-1 align-middle">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`h-2 w-2 rounded-full ${i < c.stars ? "bg-ink" : "border border-line-strong"}`} />
        ))}
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
        <div className="scroll-x rounded-[12px] border border-line bg-white">
          <table className="w-full min-w-[520px] border-collapse text-[14.5px] leading-[1.45]">
            <thead>
              <tr className="border-b hairline bg-paper">
                {example.columns.map((c) => (
                  <th key={c} scope="col" className="t-mono-sm px-4 py-3 text-left text-muted">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {example.rows.map((r, i) => (
                <tr key={i} className="border-b hairline last:border-b-0">
                  {r.map((c, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="px-4 py-3 text-left align-top font-semibold">
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
                <tr className="border-t hairline bg-fill">
                  <th scope="row" colSpan={example.columns.length - 1} className="px-4 py-3 text-left font-semibold">
                    {example.total.label}
                  </th>
                  <td className="t-serif px-4 py-3 text-[17px]">{example.total.value}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      );

    case "flow":
      return (
        <ol className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {example.nodes.map((node, i) => (
            <li key={i} className="flex min-h-[112px] flex-col rounded-[12px] border border-line bg-paper px-4 py-4">
              <span className="flex items-center justify-between text-muted">
                <span className="t-serif text-[15px]">Step {String(i + 1).padStart(2, "0")}</span>
                {i < example.nodes.length - 1 && <ArrowRight size={12} className="text-faint" />}
              </span>
              <span className="mt-auto pt-4 text-[16px] font-semibold leading-snug">{node.label}</span>
              {node.sub && <span className="t-small mt-0.5 text-[14px]">{node.sub}</span>}
            </li>
          ))}
        </ol>
      );

    case "ladder": {
      const total = example.steps.length;
      return (
        <div>
          <ol className="rounded-[12px] border border-line bg-white px-4 sm:px-5">
            {example.steps
              .map((s, i) => ({ ...s, i }))
              .reverse()
              .map((s) => (
                <li key={s.i} className="grid grid-cols-[36px_1fr] items-center gap-x-3 border-b hairline py-3.5 last:border-b-0 sm:grid-cols-[40px_1fr_150px] sm:gap-x-4">
                  <span className="t-serif row-span-2 self-start text-[15px] text-muted sm:row-span-1 sm:self-center">{String(s.i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-semibold">{s.level}</span>
                    <span aria-hidden="true" className="mt-2 block h-1 overflow-hidden rounded-full bg-fill">
                      <span className="block h-full rounded-full bg-ink" style={{ width: `${Math.round(((s.i + 1) / total) * 100)}%` }} />
                    </span>
                  </span>
                  <span className="t-serif col-start-2 pt-1.5 text-[17px] sm:col-start-3 sm:pt-0 sm:text-right">{s.salary}</span>
                </li>
              ))}
          </ol>
          <p className="t-small mt-3 text-[13.5px]">Approximate US salary ranges</p>
        </div>
      );
    }
  }
}
