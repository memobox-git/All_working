"use client";

import { useState } from "react";
import type { Agent, Approval, Message } from "@/lib/chat-types";
import { formatCredits } from "@/lib/credits";
import { AgentOrb } from "../agent-orb";
import { StatusPill } from "./status-pill";

export type TaskRow = {
  id: string;
  channel_id: string | null;
  agent_id: string | null;
  title: string;
  depends_on: string[];
  status: string;
  credits_estimate: number;
  credits_used: number;
  deadline: string | null;
};

export const TASK_COLUMNS = "id, channel_id, agent_id, title, depends_on, status, credits_estimate, credits_used, deadline";

// The plan: who does what, in which order, and what it costs.
export function PlanCard({ message, tasks, agents }: { message: Message; tasks: TaskRow[]; agents: Map<string, Agent> }) {
  const titles = new Map(tasks.map((t) => [t.id, t.title]));
  const total = tasks.reduce((sum, t) => sum + Number(t.credits_estimate), 0) || Number(message.data?.total ?? 0);
  const done = tasks.filter((t) => t.status === "done").length;
  const deadline = typeof message.data?.deadline === "string" ? new Date(message.data.deadline) : null;

  return (
    <div className="mt-2 max-w-2xl rounded-xl border border-border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2 text-sm">
        <span className="font-semibold">
          {tasks.length} tasks{tasks.length ? ` · ${done} done` : ""}
        </span>
        <span className="text-muted">
          About {formatCredits(total)} credits
          {deadline ? ` · due ${deadline.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}` : ""}
        </span>
      </div>
      <ol className="divide-y divide-border">
        {tasks.map((task, i) => {
          const agent = task.agent_id ? agents.get(task.agent_id) : null;
          const waitingOn = task.depends_on.map((d) => titles.get(d)).filter(Boolean);
          return (
            <li key={task.id} className="flex items-start gap-3 px-3 py-2.5">
              <span className="mt-0.5 w-5 shrink-0 text-right text-xs font-semibold text-muted">{i + 1}</span>
              {agent && <AgentOrb name={agent.name} size={24} variant="sub" />}
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">{task.title}</p>
                <p className="text-muted">
                  {agent?.name ?? "Agent"} · ~{formatCredits(Number(task.credits_estimate))} cr
                  {waitingOn.length > 0 && ` · after ${waitingOn.join(", ")}`}
                </p>
              </div>
              <StatusPill status={task.status} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// Approve or reject, inline wherever the request appears.
export function ApprovalCard({ approval }: { approval: Approval | undefined }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!approval) return null;

  async function decide(decision: "approve" | "reject") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/approvals/${approval!.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok && res.status !== 409) throw new Error(body.error ?? "Couldn't save that.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-2 flex max-w-2xl flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary-soft px-3 py-2.5">
      <p className="min-w-0 flex-1 text-sm font-semibold">{approval.summary}</p>
      {approval.status === "pending" ? (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => decide("reject")}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            Reject
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => decide("approve")}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Saving..." : "Approve"}
          </button>
        </div>
      ) : (
        <StatusPill status={approval.status} />
      )}
      {error && <p className="w-full text-sm">{error}</p>}
    </div>
  );
}

// A nano agent's finished output, folded away until asked for.
export function OutputCard({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1.5 max-w-2xl">
      <button type="button" onClick={() => setOpen(!open)} className="text-sm font-semibold text-primary hover:underline">
        {open ? "Hide output" : "Show output"}
      </button>
      {open && (
        <div className="mt-1.5 whitespace-pre-wrap rounded-xl border border-border bg-background p-3 text-sm leading-relaxed">
          {text}
        </div>
      )}
    </div>
  );
}
