import type { ReactNode } from "react";
import { ResourceHero, ResourceCta } from "@/components/resources/resource-shell";
import { Row, SectionHead } from "@/components/row";
import { QaControls } from "./qa-controls";
import { QaQuestionRow } from "./qa-question";
import { QaQuiz } from "./qa-quiz";
import { pad2, qaFilters, qaStats } from "./lib";
import type { QaData } from "./types";
import s from "./qa.module.css";

const ZONE = "qa";

// Shared template for the interview-question pages. Everything is rendered here on the server, so every
// question and answer is in the static HTML; the client parts (toolbar, quiz) only work on that HTML.
//   01-02 hero · 03 sticky toolbar · 04 questions by category · 05 quiz (if the JSON has one) · CTA
export function QaPage({
  data,
  title,
  second,
  summary,
  meta,
  heroExtra,
}: {
  data: QaData;
  title: ReactNode;
  second: ReactNode;
  summary: ReactNode;
  meta: { label: string; value: string }[];
  heroExtra?: ReactNode;
}) {
  const stats = qaStats(data);
  const quiz = data.quiz;

  return (
    <>
      <ResourceHero category="Interview Prep" title={title} second={second} summary={summary} meta={meta}>
        {heroExtra}
      </ResourceHero>

      <div id={ZONE} className={s.zone}>
        <Row n="03" tone="white" showInlineNum={false} className={s.sticky}>
          <QaControls zoneId={ZONE} total={stats.total} filters={qaFilters(data)} placeholder={`Search ${stats.total} questions and answers`} />
        </Row>

        <Row n="04" id="questions" className={s.list}>
          <div className={s.layout}>
            <aside className={s.aside}>
              <nav aria-label="Categories" className={s.side}>
                <p className={`t-mono-sm text-muted ${s.sideTitle}`}>{data.categories.length} categories</p>
                <ol>
                  {data.categories.map((c) => (
                    <li key={c.id} data-cat-link={c.id}>
                      <a href={`#${c.id}`} className={s.sideLink} data-side-link={c.id}>
                        <span className={s.num}>{pad2(c.number)}</span>
                        <span>{c.name}</span>
                        <span className={s.cnt} data-cat-n={c.id}>
                          {c.questions.length}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <div className="min-w-0">
              <nav aria-label="Categories" className={s.catChips}>
                {data.categories.map((c) => (
                  <a key={c.id} href={`#${c.id}`} className={s.catChip} data-cat-link={c.id}>
                    <span className={s.num}>{pad2(c.number)}</span>
                    {c.name}
                    <span className={s.cnt} data-cat-n={c.id}>
                      {c.questions.length}
                    </span>
                  </a>
                ))}
              </nav>

              {data.categories.map((c) => (
                <section key={c.id} id={c.id} className={s.cat} data-cat aria-labelledby={`${c.id}-h`}>
                  <header className={s.catHead}>
                    <div>
                      <span className={s.catNum}>Category {pad2(c.number)}</span>
                      <h2 id={`${c.id}-h`} className="t-h3">
                        {c.name}
                      </h2>
                    </div>
                    <span className={s.catCount} data-cat-count={c.id}>
                      {c.questions.length} questions
                    </span>
                  </header>
                  {c.questions.map((q) => (
                    <QaQuestionRow key={q.n} q={q} />
                  ))}
                </section>
              ))}

              <div className={s.empty} data-qa-empty hidden>
                <span className="label">No matches</span>
                <p className="t-h3 mt-6">No questions match that search.</p>
                <p className="t-lede mt-3 max-w-[520px]">Try a shorter word, another spelling, or a different filter.</p>
                <button type="button" className="btn btn-line btn-chrome mt-8" data-qa-reset>
                  Clear search and filters
                </button>
              </div>
            </div>
          </div>
        </Row>
      </div>

      {quiz && (
        <Row n="05" id="quiz" tone="white">
          <div className="pad sec">
            <SectionHead
              label="Quiz"
              title="Test yourself."
              second={`${quiz.questionCount} random questions.`}
              lede="A quick self-check before the interview. Your score stays on this page; nothing is saved or sent."
            />
            <div className="mt-10 md:mt-14">
              <QaQuiz
                zoneId={ZONE}
                total={stats.total}
                count={quiz.questionCount}
                nextLabel={quiz.nextLabel}
                finishLabel={quiz.finishLabel}
                resultTitle={quiz.result.title}
                messages={quiz.result.messages}
              />
            </div>
          </div>
        </Row>
      )}

      <ResourceCta n={quiz ? "06" : "05"} />
    </>
  );
}
