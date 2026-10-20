import { CodeBlock } from "@/components/code-block";
import type { QaBlock, QaVisual } from "./types";

// "/resources/x/stacked-bar-chart.jpg" -> "Sample stacked bar chart"
function visualAlt(v: QaVisual) {
  const name = (v.src.split("/").pop() ?? "").replace(/\.\w+$/, "").replace(/-/g, " ").replace(/\bkpi\b/i, "KPI");
  return name ? `Sample ${name}` : v.alt;
}

// Renders one answer. Paragraph, tip and list HTML is an inline subset (<strong> <em> <code> <br>) from our own JSON.
// Styled by qa.module.css (.cat details > div). The client search and quiz read p, li and pre text from here,
// so tip labels and captions stay out of those tags.
export function QaAnswer({ blocks, visual }: { blocks: QaBlock[]; visual?: QaVisual }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "paragraph":
            return <p key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
          case "tip":
            return (
              <aside key={i}>
                <span>{b.label}</span>
                <p dangerouslySetInnerHTML={{ __html: b.html }} />
              </aside>
            );
          case "list": {
            const List = b.ordered ? "ol" : "ul";
            return (
              <List key={i}>
                {b.items.map((it, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: it }} />
                ))}
              </List>
            );
          }
          case "code":
            // The ASCII chart sketches are stand-ins for the visual example image, as on the old page.
            if (b.kind === "ascii-sketch" && visual) return null;
            return <CodeBlock key={i} code={b.source} language={b.language} />;
        }
      })}
      {visual && (
        <figure>
          <img src={visual.src} alt={visualAlt(visual)} width={visual.width} height={visual.height} loading="lazy" decoding="async" />
          <figcaption>{(visual.label ?? "Visual example").replace(/:\s*$/, "")}</figcaption>
        </figure>
      )}
    </>
  );
}
