import { Pixel } from "@/components/icons";
import { Code, DataTable } from "./blocks";
import { GroupHead, Pager, ReaderFrame } from "./course-reader";
import { RichHtml } from "./inline";
import { LevelFilter } from "./level-filter";
import { ReaderNav } from "./reader-nav";
import styles from "./reader.module.css";
import type { Cheatsheet, CsAnswer, CsQuestion, NavGroup } from "./types";
import { pad2 } from "./visuals";

// The DE Masterclass cheat sheet: groups → topics → sections → answered questions, each with a level
// tag. Same frame and index as the course readers, with a level filter instead of lesson paging.

const PIPS: Record<string, number> = { Basic: 1, Intermediate: 2, Advanced: 3 };

export function LevelTag({ level }: { level: string }) {
  const n = PIPS[level];
  return (
    <span className="t-mono-sm inline-flex items-center gap-2 border border-line bg-white px-2 py-1.5 text-ink">
      {n ? (
        <span aria-hidden="true" className="flex gap-[3px]">
          {[1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 w-1.5 ${i <= n ? "bg-ink" : "border border-faint"}`} />
          ))}
        </span>
      ) : level === "Snowflake" ? (
        <Pixel name="spark" size={10} />
      ) : (
        <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 border border-ink" />
      )}
      {level}
    </span>
  );
}

function Answer({ a }: { a: CsAnswer }) {
  if (a.type === "text")
    return (
      <p className="t-body">
        <RichHtml html={a.html} />
      </p>
    );
  if (a.type === "code") return <Code code={a.code} language={a.language} />;
  return (
    <DataTable
      head={a.headers}
      rows={a.rows.map((r) => r.map((c) => (typeof c === "string" ? c : c.text)))}
    />
  );
}

function QuestionRow({ q }: { q: CsQuestion }) {
  return (
    <div data-level={q.level} className={`${styles.q} grid gap-4 border-b border-line py-7 md:grid-cols-[minmax(0,13.5rem)_minmax(0,1fr)] md:gap-8`}>
      <div>
        <h5 className="text-[17px] font-medium leading-snug tracking-[-0.01em] text-ink">{q.question}</h5>
        {q.hint && <p className="mt-1.5 text-[14px] leading-snug text-muted">{q.hint}</p>}
        <div className="mt-3">
          <LevelTag level={q.level} />
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        {q.answer.map((a, i) => (
          <Answer key={i} a={a} />
        ))}
      </div>
    </div>
  );
}

export function cheatsheetMeta(data: Cheatsheet) {
  const topics = data.groups.flatMap((g) => g.topics);
  const qs = topics.flatMap((t) => t.sections.flatMap((s) => s.questions));
  return [
    { label: "Groups", value: String(data.groups.length) },
    { label: "Topics", value: String(topics.length) },
    { label: "Questions", value: String(qs.length) },
    { label: "Code samples", value: String(qs.flatMap((q) => q.answer).filter((a) => a.type === "code").length) },
  ];
}

export function CheatsheetReader({ data, n = "03" }: { data: Cheatsheet; n?: string }) {
  const topics = data.groups.flatMap((g) => g.topics);
  const count = (t: (typeof topics)[number]) => t.sections.reduce((s, x) => s + x.questions.length, 0);
  const all = topics.flatMap((t) => t.sections.flatMap((s) => s.questions));
  let k = 0;
  const groups: NavGroup[] = data.groups.map((g) => ({
    label: g.title,
    items: g.topics.map((t) => ({ id: t.id, num: pad2(++k), title: t.navLabel })),
  }));
  const levels = data.levels.map((level) => ({ level, count: all.filter((q) => q.level === level).length })).filter((l) => l.count);
  let ti = -1;

  return (
    <ReaderFrame
      n={n}
      contentId="cheatsheet"
      contentClassName={styles.root}
      nav={
        <ReaderNav
          groups={groups}
          readerId="reader"
          navLabel="Cheat sheet topics"
          unit="Topic"
          summary={`${topics.length} topics · ${all.length} questions`}
        />
      }
    >
      <div className="border-b border-line pad py-5">
        <LevelFilter targetId="cheatsheet" levels={levels} total={all.length} />
      </div>
      {data.groups.map((g, gIdx) => {
        const gq = g.topics.reduce((s, t) => s + count(t), 0);
        return (
          <section key={g.title} aria-labelledby={`group-${gIdx + 1}`}>
            <GroupHead id={`group-${gIdx + 1}`} kicker={`Part ${pad2(gIdx + 1)}`} title={g.title} note={`${g.topics.length} topics · ${gq} questions`} />
            {g.topics.map((t) => {
              ti += 1;
              const prev = topics[ti - 1] ?? null;
              const next = topics[ti + 1] ?? null;
              const qn = count(t);
              return (
                <article
                  key={t.id}
                  id={t.id}
                  aria-labelledby={`${t.id}-title`}
                  className={`${styles.topic} scroll-mt-14 border-b border-line pad py-12 md:py-16 min-[1200px]:scroll-mt-2`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0 max-w-[720px]">
                      <p className="t-mono flex items-center gap-2 text-muted">
                        <span>Topic {pad2(ti + 1)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{qn === 1 ? "1 question" : `${qn} questions`}</span>
                      </p>
                      <h3 id={`${t.id}-title`} className="t-h3 mt-4">
                        {t.title}
                      </h3>
                      {t.subtitle && <p className="t-lede mt-3">{t.subtitle}</p>}
                    </div>
                    <span aria-hidden="true" className="t-pixel hidden text-[64px] leading-[0.8] text-line md:block">
                      {pad2(ti + 1)}
                    </span>
                  </div>
                  {t.sections.map((s) => (
                    <section key={s.title} className={`${styles.sec} mt-10`}>
                      <h4 className="t-mono flex items-center gap-2 border-b border-ink pb-3 text-ink">
                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-ink" />
                        {s.title}
                      </h4>
                      {s.questions.map((q) => (
                        <QuestionRow key={q.question} q={q} />
                      ))}
                    </section>
                  ))}
                  <p className={`${styles.empty} t-small mt-10 border border-dashed border-line bg-white px-5 py-4`}>
                    No questions at this level in this topic.
                  </p>
                  <Pager className={styles.pager} unit="Topic" prev={prev && { id: prev.id, title: prev.navLabel }} next={next && { id: next.id, title: next.navLabel }} />
                </article>
              );
            })}
          </section>
        );
      })}
    </ReaderFrame>
  );
}
