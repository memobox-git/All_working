"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

// Shown when Stripe sends a buyer back to /career after paying. The checkout function's return URL
// isn't visible from here, so this accepts the common shapes (?success, ?payment=success, ?session_id=…).
export function PaidBanner() {
  const [paid, setPaid] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.has("session_id") || q.get("success") === "true" || q.has("success") || q.get("payment") === "success" || q.get("status") === "success") setPaid(true);
  }, []);
  if (!paid) return null;
  return (
    <div role="status" className="border-b border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-1 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-medium">Payment received. Thank you!</p>
        <p className="t-mono-sm text-night-muted">Watch your inbox for the onboarding form · questions: {site.email}</p>
      </div>
    </div>
  );
}
