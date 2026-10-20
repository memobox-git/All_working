import { QaAnswer } from "./qa-answer";
import { questionText, searchKey } from "./lib";
import type { QaQuestion } from "./types";

// One question row. The data-* attributes are what the client toolbar filters on; the answer sits in a
// native <details> so it is in the static HTML and works without JavaScript. No class names on purpose:
// the row is styled from its category section (.cat in qa.module.css), which keeps ~300 rows light.
export function QaQuestionRow({ q }: { q: QaQuestion }) {
  return (
    <article
      id={`q-${q.n}`}
      data-q={q.n}
      data-type={q.type.toLowerCase()}
      data-diff={q.difficulty.toLowerCase()}
      data-faang={String(q.faang)}
      data-s={searchKey(q)}
    >
      <details>
        <summary>
          <span>Q{q.n}</span>
          <span>
            <h3>{questionText(q)}</h3>
            <span>
              <span>{q.type}</span>
              <span>{q.difficulty}</span>
              {q.faang && <b>FAANG</b>}
              {q.company && <span>{q.company}</span>}
            </span>
          </span>
          <i />
        </summary>
        <div>
          <QaAnswer blocks={q.answer.blocks} visual={q.visualExample} />
          <a href={`#q-${q.n}`}>Link to Q{q.n}</a>
        </div>
      </details>
    </article>
  );
}
