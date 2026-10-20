"use client";

import { useEffect, useState } from "react";
import { type Cohort, fmtDate, fmtDays, fmtPrice, fmtRange, daysUntil } from "@/lib/courses";
import { joinWaitlist, type WaitlistResult } from "@/lib/supabase";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { useLiveCohorts } from "./live-cohorts";

// Price, cohort picker and the hand-off to the learner app (learn.stackle.io), which handles sign-up,
// Stripe checkout and the dashboard exactly as before.
export function EnrollPanel({
  courseId,
  slug,
  title,
  price,
  careerPrice,
  weeks,
  level,
  initial,
  appUrl,
  bookCall,
}: {
  courseId: string;
  slug: string;
  title: string;
  price: number;
  careerPrice: number;
  weeks: number;
  level: string;
  initial: Cohort[];
  appUrl: string;
  bookCall: string;
}) {
  const cohorts = useLiveCohorts(courseId, initial);
  const [pick, setPick] = useState<string | null>(initial[0]?.id ?? null);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  useEffect(() => {
    if (!cohorts.find((c) => c.id === pick)) setPick(cohorts[0]?.id ?? null);
  }, [cohorts, pick]);
  const chosen = cohorts.find((c) => c.id === pick);

  return (
    <div className="panel">
      <div className="border-b hairline p-6">
        <p className="t-mono-sm text-muted">Tuition</p>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="t-serif text-[56px] leading-none tracking-[-0.03em]">{fmtPrice(price)}</span>
          <span className="text-[14px] text-muted">USD</span>
        </p>
        <dl className="mt-6 grid grid-cols-2 overflow-hidden rounded-[10px] border hairline">
          <div className="p-3">
            <dt className="t-mono-sm text-muted">Duration</dt>
            <dd className="mt-1.5 font-medium">{weeks} weeks</dd>
          </div>
          <div className="border-l hairline p-3">
            <dt className="t-mono-sm text-muted">Level</dt>
            <dd className="mt-1.5 font-medium capitalize">{level || "All levels"}</dd>
          </div>
        </dl>
      </div>

      {cohorts.length ? (
        <div className="p-6">
          <fieldset>
            <legend className="t-mono-sm flex w-full justify-between text-muted">
              <span>Choose a cohort</span>
              <span>{cohorts.length} open</span>
            </legend>
            <div className="mt-3 grid gap-2">
              {cohorts.map((k) => {
                const d = now === null ? -1 : daysUntil(k.start, now);
                const on = k.id === pick;
                return (
                  <label key={k.id} className={`flex cursor-pointer items-center gap-3 rounded-[10px] border p-3 transition-colors ${on ? "border-ink bg-paper" : "border-line hover:border-ink"}`}>
                    <input type="radio" name={`cohort-${slug}`} value={k.id} checked={on} onChange={() => setPick(k.id)} className="sr-only" />
                    <span aria-hidden="true" className={`grid h-[18px] w-[18px] place-items-center rounded-full border ${on ? "border-ink" : "border-line-strong"}`}>
                      {on && <span className="h-2 w-2 rounded-full bg-ink" />}
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium">{fmtRange(k.start, k.end)}</span>
                      <span className="t-mono-sm text-muted">{fmtDays(k.days)}</span>
                    </span>
                    {d >= 0 && d <= 7 && <span className="rounded-full bg-ink px-2 py-1 text-[11.5px] font-semibold text-paper">{d <= 0 ? "Today" : `${d}d left`}</span>}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <a href={`${appUrl}/courses/${slug}${chosen ? `?cohort=${chosen.id}` : ""}`} className="btn btn-ink btn-block mt-5">
            Enroll{chosen ? ` · starts ${fmtDate(chosen.start, { month: "short", day: "numeric" })}` : ""}
            <ArrowRight />
          </a>
          <p className="t-small mt-3 text-center">You&apos;ll create your account and pay securely with Stripe.</p>
        </div>
      ) : (
        <Waitlist slug={slug} title={title} />
      )}

      <div className="border-t hairline p-6">
        <p className="t-mono-sm text-muted">Career track · {fmtPrice(careerPrice)}</p>
        <p className="t-small mt-2">Everything in the course plus 1:1 job help: a resume rewrite, referral support and mock interviews.</p>
        <a href={bookCall} target="_blank" rel="noreferrer" className="dlink mt-4 text-[15px]">
          Book a call to join <ArrowUpRight />
        </a>
      </div>
    </div>
  );
}

function Waitlist({ slug, title }: { slug: string; title: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | WaitlistResult>("idle");
  return (
    <form
      className="p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
        setState("busy");
        setState(await joinWaitlist(email, `course:${slug}`));
      }}
    >
      <p className="t-mono-sm text-muted">Next cohort</p>
      <p className="mt-2 font-medium">Not scheduled yet. Get an email when it opens.</p>
      {state === "joined" || state === "already" ? (
        <p role="status" className="mt-4 rounded-[10px] border border-ink bg-paper p-3 text-[15px]">
          {state === "joined" ? `You're on the list for the ${title}.` : "You're already on the list. We'll email you."}
        </p>
      ) : (
        <>
          <label htmlFor={`wl-${slug}`} className="sr-only">Email</label>
          <input id={`wl-${slug}`} type="email" required autoComplete="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="field mt-4" />
          <button type="submit" className="btn btn-ink btn-block mt-3" disabled={state === "busy"}>
            {state === "busy" ? "Adding you…" : "Notify me"}
          </button>
          {state === "error" && <p role="alert" className="t-small mt-3">Something went wrong. Please try again.</p>}
        </>
      )}
    </form>
  );
}
