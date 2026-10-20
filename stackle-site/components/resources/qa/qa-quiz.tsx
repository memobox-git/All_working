"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pixel } from "@/components/icons";
import s from "./qa.module.css";

type Item = { n: number; q: string; a: string; c: string };
type Asked = Item & { options: string[]; correct: number; picked: number | null };

const KEYS = "ABCD";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clip(text: string, max = 130) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 60)).replace(/[\s,.;:—-]+$/, "")}…`;
}

// The questions and answers are already in the page, so the quiz reads them from the server-rendered rows
// instead of shipping a second copy. An option is the opening of a real answer (lead-in labels like
// "What it looks like:" dropped); wrong options come from the same category so they are plausible.
function readPool(zoneId: string): Item[] {
  const rows = document.getElementById(zoneId)?.querySelectorAll<HTMLElement>("[data-q]") ?? [];
  const pool: Item[] = [];
  rows.forEach((el) => {
    const q = el.querySelector("h3")?.textContent?.trim() ?? "";
    let text = "";
    for (const p of Array.from(el.querySelectorAll("details > div p, details > div li"))) {
      let t = p.textContent ?? "";
      const lead = p.firstChild;
      if (!text && lead instanceof HTMLElement && lead.tagName === "STRONG" && /:\s*$/.test(lead.textContent ?? "") && t.length > (lead.textContent?.length ?? 0) + 20) {
        t = t.slice(lead.textContent?.length ?? 0);
      }
      text += ` ${t}`;
      if (text.length > 160) break;
    }
    const a = clip(text);
    if (q && a.length >= 30) pool.push({ n: Number(el.dataset.q), q, a, c: el.closest("[data-cat]")?.id ?? "" });
  });
  return pool;
}

function buildRound(pool: Item[], count: number): Asked[] {
  return shuffle(pool)
    .slice(0, count)
    .map((it) => {
      const others = (list: Item[]) => shuffle(list.filter((o) => o.n !== it.n && o.a !== it.a));
      const wrong: string[] = [];
      for (const o of [...others(pool.filter((o) => o.c === it.c)), ...others(pool)]) {
        if (wrong.length === 3) break;
        if (!wrong.includes(o.a)) wrong.push(o.a);
      }
      const options = shuffle([it.a, ...wrong]);
      return { ...it, options, correct: options.indexOf(it.a), picked: null };
    });
}

function Cross({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="shrink-0">
      <path d="m1.5 1.5 7 7m0-7-7 7" strokeLinecap="round" />
    </svg>
  );
}

export function QaQuiz({
  zoneId,
  total,
  count,
  nextLabel,
  finishLabel,
  resultTitle,
  messages,
}: {
  zoneId: string;
  total: number;
  count: number;
  nextLabel: string;
  finishLabel: string;
  resultTitle: string;
  messages: { minPercent: number; text: string }[];
}) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [round, setRound] = useState<Asked[]>([]);
  const [i, setI] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const focusHead = useRef(false);

  const cur = round[i];
  const score = round.filter((r) => r.picked !== null && r.picked === r.correct).length;
  const answered = cur ? cur.picked !== null : false;

  // Each step: bring the top of the quiz card into view, then move focus to its heading.
  useEffect(() => {
    if (focusHead.current) {
      focusHead.current = false;
      const box = boxRef.current;
      if (box && (box.getBoundingClientRect().top < 72 || box.getBoundingClientRect().top > innerHeight * 0.5)) box.scrollIntoView({ block: "start" });
      headRef.current?.focus({ preventScroll: true });
    }
  }, [phase, i]);

  useEffect(() => {
    if (answered) nextRef.current?.focus();
  }, [answered]);

  const start = () => {
    setRound(buildRound(readPool(zoneId), count));
    setI(0);
    setPhase("play");
    focusHead.current = true;
  };
  const pick = (k: number) => {
    if (answered) return;
    setRound((r) => r.map((it, j) => (j === i ? { ...it, picked: k } : it)));
  };
  const next = () => {
    focusHead.current = true;
    if (i + 1 < round.length) setI(i + 1);
    else setPhase("done");
  };

  const pct = round.length ? Math.round((score / round.length) * 100) : 0;
  const message = [...messages].sort((a, b) => b.minPercent - a.minPercent).find((m) => pct >= m.minPercent)?.text;

  const steps = (
    <div className={s.steps} aria-hidden="true">
      {round.map((r, k) => (
        <span
          key={k}
          className={`${s.step} ${r.picked === null ? (k === i && phase === "play" ? s.stepNow : "") : r.picked === r.correct ? s.stepOk : s.stepNo}`}
        />
      ))}
    </div>
  );

  if (phase === "intro") {
    return (
      <div ref={boxRef} className={s.quiz}>
        <div className={`${s.quizBody} ${s.intro}`}>
          <div>
            <p className="t-mono-sm text-muted">
              {count} questions · 4 options · no sign-up
            </p>
            <p className="t-h4 mt-4 max-w-[560px]">Pick the option that answers each question.</p>
            <p className="t-body mt-3 max-w-[560px]">
              Every option is the opening of a real answer on this page. Questions are drawn at random from all {total}, so each round is different.
            </p>
            <button type="button" className="btn btn-ink mt-8" onClick={start}>
              Start the quiz <ArrowRight />
            </button>
          </div>
          <div className={s.legend}>
            <p className="t-mono-sm text-muted">How answers are marked</p>
            <div>
              <span className={`${s.step} ${s.stepOk}`} aria-hidden="true" /> Correct: filled, with a tick
            </div>
            <div>
              <span className={`${s.step} ${s.stepNo}`} aria-hidden="true" /> Wrong: outlined, with a cross
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div ref={boxRef} className={s.quiz}>
        <div className={s.quizHead}>
          <span>{resultTitle.replace(/!$/, "")}</span>
          <span>
            Score <b>{score}</b> / {round.length}
          </span>
        </div>
        {steps}
        <div className={s.quizBody}>
          <p className="t-mono-sm text-muted">You scored</p>
          <p className={`${s.score} mt-4`}>
            {score}
            <span> / {round.length}</span>
          </p>
          <p className="mt-4 text-[15px] text-muted">{pct}% correct</p>
          <h3 ref={headRef} tabIndex={-1} className="t-h4 mt-6 max-w-[560px] outline-none">
            {message}
          </h3>
          <ol className={s.review} aria-label="Your answers">
            {round.map((r) => {
              const ok = r.picked === r.correct;
              return (
                <li key={r.n} className={s.reviewRow}>
                  <span className={`${s.mark} ${ok ? s.markOk : ""}`}>{ok ? <Pixel name="check" size={13} /> : <Cross />}</span>
                  <a href={`#q-${r.n}`}>Q{r.n}</a>
                  <span>
                    {r.q} <span className="sr-only">{ok ? "(correct)" : "(incorrect)"}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn btn-ink" onClick={start}>
              Retry with new questions
            </button>
            <button type="button" className="btn btn-line" onClick={() => setPhase("intro")}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cur) return null;
  const ok = cur.picked === cur.correct;
  return (
    <div ref={boxRef} className={s.quiz}>
      <div className={s.quizHead}>
        <span>
          Question <b>{i + 1}</b> / {round.length}
        </span>
        <span>
          Score <b>{score}</b>
        </span>
      </div>
      {steps}
      <div className={s.quizBody}>
        <p className="t-serif text-[15px] text-muted">Q{cur.n}</p>
        <h3 ref={headRef} tabIndex={-1} className="t-h4 mt-3 max-w-[760px] outline-none">
          {cur.q}
        </h3>
        <div className={s.opts} role="group" aria-label="Options">
          {cur.options.map((o, k) => {
            const isCorrect = k === cur.correct;
            const isPicked = k === cur.picked;
            const state = !answered ? "" : isCorrect ? s.optOk : isPicked ? s.optNo : s.optDim;
            return (
              <button key={k} type="button" className={`${s.opt} ${state}`} aria-disabled={answered} onClick={() => pick(k)}>
                <span className={s.optKey}>{KEYS[k]}</span>
                <span>
                  {o}
                  {answered && isCorrect && (
                    <span className={s.optNote}>
                      <Pixel name="check" size={14} /> {isPicked ? "Your answer: correct" : "Correct answer"}
                    </span>
                  )}
                  {answered && isPicked && !isCorrect && (
                    <span className={s.optNote}>
                      <Cross /> Your answer: incorrect
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className={s.verdict} role="status">
            {answered && (
              <>
                <span className={`${s.mark} ${ok ? s.markOk : ""}`}>{ok ? <Pixel name="check" size={13} /> : <Cross />}</span>
                {ok ? "Correct." : `Not quite. The answer is ${KEYS[cur.correct]}.`}
              </>
            )}
          </p>
          {answered && (
            <button ref={nextRef} type="button" className="btn btn-ink btn-chrome" onClick={next}>
              {i + 1 < round.length ? nextLabel : finishLabel} <ArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
