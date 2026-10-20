"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

export type Step = { key: string; title: string; second: string; tag: string; body: string; art: ReactNode };

// Four steps as tabs with a dotted progress bar that auto-advances (paused on hover, focus or reduced motion).
export function HowItWorks({ steps }: { steps: Step[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  useEffect(() => {
    if (paused || reduce.current) return;
    const t = setTimeout(() => setI((v) => (v + 1) % steps.length), 6000);
    return () => clearTimeout(t);
  }, [i, paused, steps.length]);
  const s = steps[i];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}>
      <div role="tablist" aria-label="How a cohort works" className="grid grid-cols-2 border-y hairline md:grid-cols-4">
        {steps.map((st, k) => (
          <button
            key={st.key}
            role="tab"
            id={`hiw-tab-${k}`}
            aria-selected={k === i}
            aria-controls="hiw-panel"
            onClick={() => setI(k)}
            className={`flex flex-col items-start gap-3 border-line px-5 py-4 text-left transition-colors md:px-6 ${k % 2 ? "border-l" : ""} ${k > 1 ? "border-t md:border-t-0" : ""} ${k === 2 ? "md:border-l" : ""} ${k === i ? "bg-white" : "hover:bg-white/60"}`}
          >
            <span className="relative block h-[2px] w-full">
              <span className="seg absolute inset-0" />
              <span
                key={`${i}-${paused}`}
                className={`seg seg-on absolute inset-y-0 left-0 ${k < i ? "w-full" : k === i ? (paused ? "w-full" : "hiw-fill") : "w-0"}`}
              />
            </span>
            <span className="t-mono-sm text-muted">{st.key}</span>
            <span className={`text-[16px] font-medium tracking-[-0.01em] ${k === i ? "text-ink" : "text-muted"}`}>{st.title} {st.second}</span>
          </button>
        ))}
      </div>
      <div id="hiw-panel" role="tabpanel" aria-labelledby={`hiw-tab-${i}`} className="grid md:grid-cols-2">
        <div className="corners flex min-h-[340px] flex-col bg-white p-6 md:min-h-[440px] md:p-10">
          <h3 className="t-h2">
            {s.title}
            <br />
            <span className="t-second">{s.second}</span>
          </h3>
          <div className="mt-auto pt-10">
            <span className="label">{s.tag}</span>
            <p className="t-body mt-4 max-w-[420px] text-muted">{s.body}</p>
          </div>
        </div>
        <div className="fill-iso grid min-h-[280px] place-items-center border-t hairline p-8 md:border-l md:border-t-0">
          <div key={s.key} className="w-full max-w-[380px] animate-[hiw-in_.5s_ease]">{s.art}</div>
        </div>
      </div>
      <style>{`
        .hiw-fill { animation: hiw-fill 6s linear forwards; }
        @keyframes hiw-fill { from { width: 0 } to { width: 100% } }
        @keyframes hiw-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
}
