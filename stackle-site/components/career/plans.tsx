"use client";

import { useState } from "react";
import { startCareerCheckout } from "@/lib/supabase";
import { ArrowRight, Pixel } from "@/components/icons";

// The resume + LinkedIn service plans. Prices and plan keys match the create-resume-checkout
// Supabase function the old site used.
export const careerIncludes = [
  "ATS-friendly resume rewrite",
  "LinkedIn profile optimisation",
  "Role positioning strategy",
  "Resume marketing kit (templates)",
  "Application strategy playbook",
  "1:1 review call (30–45 min)",
  "2+ revision rounds",
  "Satisfaction guarantee",
];

const plans = [
  { key: "monthly" as const, name: "Monthly", price: 250, unit: "/ month", note: "Good if you want to try the service first.", featured: false, tag: null as string | null },
  { key: "3month" as const, name: "Three months", price: 499, unit: "/ 3 months", note: "Support for your whole job search.", featured: true, tag: "Best value · save $251" },
];

export function CareerPlans() {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function go(plan: "monthly" | "3month") {
    setBusy(plan);
    setError(null);
    try {
      const url = await startCareerCheckout(plan);
      window.location.assign(url);
    } catch {
      setError("Checkout didn't open. Please try again, or email hello@stackle.io and we'll sort it out.");
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2">
        {plans.map((p) => (
          <div key={p.key} className={`relative flex flex-col rounded-[16px] border p-6 md:p-8 ${p.featured ? "border-ink bg-ink text-paper shadow-[0_30px_60px_-30px_rgba(21,21,19,0.6)]" : "border-line bg-white shadow-[0_10px_30px_-14px_rgba(21,21,19,0.16)]"}`}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="t-h3">{p.name}</h3>
              {p.tag && <span className="rounded-full border border-night-line px-3 py-1 text-[12px] font-semibold text-paper">{p.tag}</span>}
            </div>
            <p className={`mt-2 text-[15px] ${p.featured ? "text-night-muted" : "text-muted"}`}>{p.note}</p>
            <p className="mt-8 flex items-baseline gap-2">
              <span className="t-serif text-[56px] leading-none tracking-[-0.03em]">${p.price}</span>
              <span className={`text-[15px] ${p.featured ? "text-night-muted" : "text-muted"}`}>{p.unit}</span>
            </p>
            <button type="button" onClick={() => go(p.key)} disabled={busy !== null} className={`btn btn-block mt-8 ${p.featured ? "btn-paper" : "btn-ink"}`}>
              {busy === p.key ? "Opening checkout…" : `Get started for $${p.price}`} <ArrowRight />
            </button>
            <p className={`mt-3 text-center text-[13px] ${p.featured ? "text-night-muted" : "text-muted"}`}>Secure checkout with Stripe</p>
          </div>
        ))}
      </div>
      <div className="panel mt-5 p-6 md:p-8">
        <p className="t-mono-sm text-muted">Both plans include</p>
        <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {careerIncludes.map((x) => (
            <li key={x} className="flex items-center gap-3 text-[15px] text-ink-2">
              <Pixel name="check" size={17} className="text-ink" /> {x}
            </li>
          ))}
        </ul>
        {error && (
          <p role="alert" className="mt-6 rounded-[10px] border border-ink bg-paper p-4 text-[15px]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
