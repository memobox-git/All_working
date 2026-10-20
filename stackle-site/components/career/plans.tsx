"use client";

import { useState } from "react";
import { startCareerCheckout } from "@/lib/supabase";
import { Pixel } from "@/components/icons";

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
  { key: "monthly" as const, name: "Monthly", price: 250, unit: "/ month", note: "Good if you want to try the service first", featured: false, tag: null as string | null },
  { key: "3month" as const, name: "3 months", price: 499, unit: "/ 3 months", note: "Support for your whole job search", featured: true, tag: "Best value · save $251" },
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
      <div className="grid md:grid-cols-2">
        {plans.map((p, i) => (
          <div key={p.key} className={`relative flex flex-col p-6 md:p-8 ${i ? "border-t md:border-l md:border-t-0" : ""} border-line ${p.featured ? "bg-white outline outline-1 -outline-offset-1 outline-ink" : ""}`}>
            <div className="flex items-center justify-between gap-3 border-b hairline pb-4">
              <span className="t-mono-sm text-muted">{p.featured ? "Most popular" : "Plan"}</span>
              {p.tag && <span className="t-mono-sm bg-ink px-2 py-1 text-paper">{p.tag}</span>}
            </div>
            <h3 className="t-h3 mt-6 flex items-center gap-3">
              {p.featured && <Pixel name="spark" size={20} />} {p.name}
            </h3>
            <p className="t-small mt-2">{p.note}</p>
            <p className="mt-8 flex items-baseline gap-2">
              <span className="t-pixel text-[52px] leading-none tracking-[-0.04em]">${p.price}</span>
              <span className="text-[15px] text-muted">{p.unit}</span>
            </p>
            <p className="t-mono-sm mt-3 text-muted">Secure checkout with Stripe</p>
            <button type="button" onClick={() => go(p.key)} disabled={busy !== null} className={`btn btn-block mt-8 ${p.featured ? "btn-ink" : "btn-line"}`}>
              <Pixel name="spark" size={14} />
              {busy === p.key ? "Opening checkout…" : `Get started for $${p.price}`}
            </button>
          </div>
        ))}
      </div>
      <div className="border-t hairline p-6 md:p-8">
        <p className="t-mono-sm text-muted">Both plans include</p>
        <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {careerIncludes.map((x) => (
            <li key={x} className="flex items-center gap-3 text-[15px]">
              <Pixel name="check" size={13} /> {x}
            </li>
          ))}
        </ul>
        {error && (
          <p role="alert" className="mt-6 border border-ink bg-white p-4 text-[15px]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
