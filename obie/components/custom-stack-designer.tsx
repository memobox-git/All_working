"use client";

import { useState, type FormEvent } from "react";
import { AgentOrb } from "./agent-orb";
import { ObieOrb } from "./obie-orb";

export type CustomStackDesign = {
  name: string;
  summary: string;
  main: { role: string; does: string };
  subagents: { role: string; does: string; needs: string }[];
  overlap: { stack: string; suggestion: string } | null;
};

export type BuiltAgent = { id: string; name: string; stack: string; level: string; path: string };

// Ask OBIE for a custom stack: OBIE designs it on screen, the owner reviews
// it and taps Build.
export function CustomStackDesigner({
  initialRequest = "",
  onBuilt,
  onCancel,
}: {
  initialRequest?: string;
  onBuilt: (agents: BuiltAgent[]) => void;
  onCancel?: () => void;
}) {
  const [request, setRequest] = useState(initialRequest);
  const [design, setDesign] = useState<CustomStackDesign | null>(null);
  const [busy, setBusy] = useState<"design" | "build" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ask(event?: FormEvent) {
    event?.preventDefault();
    if (!request.trim()) return;
    setBusy("design");
    setError(null);
    try {
      const res = await fetch("/api/obie/custom-stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request }),
      });
      const body = (await res.json().catch(() => ({}))) as { design?: CustomStackDesign; error?: string };
      if (!res.ok || !body.design) throw new Error(body.error ?? "OBIE couldn't design that stack.");
      setDesign(body.design);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  async function build() {
    if (!design) return;
    setBusy("build");
    setError(null);
    try {
      const res = await fetch("/api/team/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design }),
      });
      const body = (await res.json().catch(() => ({}))) as { agents?: BuiltAgent[]; error?: string };
      if (!res.ok || !body.agents) throw new Error(body.error ?? "Couldn't build that stack.");
      onBuilt(body.agents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <ObieOrb size={36} state={busy ? "working" : "idle"} />
        <div>
          <h3 className="font-bold tracking-tight">Ask OBIE for a custom stack</h3>
          <p className="text-sm text-muted">Describe the area of your business you want covered.</p>
        </div>
      </div>

      <form onSubmit={ask} className="mt-4">
        <textarea
          rows={2}
          value={request}
          onChange={(event) => setRequest(event.target.value)}
          placeholder="I want a Podcast stack that finds guests and preps episodes"
          className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={!request.trim() || busy !== null}
            className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
          >
            {busy === "design" ? "OBIE is designing..." : design ? "Design again" : "Design it"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-4 py-2.5 text-sm font-semibold text-muted hover:text-foreground"
            >
              Close
            </button>
          )}
        </div>
      </form>

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-surface px-3 py-2 text-sm">
          {error}
        </p>
      )}

      {design && (
        <div className="mt-5 rounded-xl bg-surface p-4">
          {design.overlap && (
            <p className="mb-4 rounded-lg border border-accent bg-background px-3 py-2 text-sm">
              This overlaps with your <strong className="capitalize">{design.overlap.stack}</strong> stack.{" "}
              {design.overlap.suggestion}
            </p>
          )}
          <div className="flex items-center gap-3">
            <AgentOrb name={design.main.role} size={40} />
            <div>
              <p className="font-bold">{design.name}</p>
              <p className="text-sm text-muted">{design.summary}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {design.subagents.map((sub) => (
              <li key={sub.role} className="flex gap-3">
                <AgentOrb name={sub.role} size={30} variant="sub" />
                <div className="text-sm">
                  <p className="font-semibold">{sub.role}</p>
                  <p>{sub.does}</p>
                  <p className="text-muted">Needs: {sub.needs}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={build}
            disabled={busy !== null}
            className="mt-5 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
          >
            {busy === "build" ? "Building..." : design.overlap ? "Build it anyway" : "Build"}
          </button>
        </div>
      )}
    </section>
  );
}
