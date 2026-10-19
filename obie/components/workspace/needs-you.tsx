"use client";

import { useEffect, useMemo, useState } from "react";
import type { Agent, Approval, Channel } from "@/lib/chat-types";
import { createClient } from "@/lib/supabase/client";
import { AgentOrb } from "../agent-orb";
import type { View } from "./sidebar";

type TaskOutput = { id: string; title: string; agent_id: string | null; output: { text?: string } | null };

const STACK_ORDER = ["sales", "marketing", "customers", "product", "operations"];

// Everything waiting on the owner, with Approve, Edit and Reject, plus a small
// leaderboard of who has earned the most points.
export function NeedsYou({
  approvals,
  agents,
  channels,
  openView,
}: {
  approvals: Approval[];
  agents: Agent[];
  channels: Channel[];
  openView: (view: View) => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const pending = approvals.filter((a) => a.status === "pending");
  const taskIds = pending.filter((a) => a.task_id).map((a) => a.task_id!);
  const taskKey = taskIds.join(",");
  const [tasks, setTasks] = useState<Map<string, TaskOutput>>(new Map());

  useEffect(() => {
    if (!taskKey) return;
    let cancelled = false;
    supabase
      .from("tasks")
      .select("id, title, agent_id, output")
      .in("id", taskKey.split(","))
      .then(({ data }) => {
        if (!cancelled) setTasks(new Map(((data ?? []) as TaskOutput[]).map((t) => [t.id, t])));
      });
    return () => {
      cancelled = true;
    };
  }, [supabase, taskKey]);

  const agentMap = new Map(agents.map((a) => [a.id, a]));
  const channelName = (id: string | null) => channels.find((c) => c.id === id)?.name;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6">
      <section>
        <h2 className="text-lg font-bold tracking-tight">Waiting for you</h2>
        {pending.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-surface px-4 py-6 text-center text-muted">Nothing needs you right now.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {pending.map((approval) => {
              const task = approval.task_id ? tasks.get(approval.task_id) : null;
              const agent = task?.agent_id ? agentMap.get(task.agent_id) : null;
              return (
                <li key={approval.id}>
                  <ApprovalRow
                    approval={approval}
                    text={task?.output?.text ?? null}
                    agentName={agent?.name ?? null}
                    channelName={channelName(approval.channel_id) ?? null}
                    onOpenChannel={approval.channel_id ? () => openView({ type: "channel", channelId: approval.channel_id! }) : undefined}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Leaderboard agents={agents} />
    </div>
  );
}

function ApprovalRow({
  approval,
  text,
  agentName,
  channelName,
  onOpenChannel,
}: {
  approval: Approval;
  text: string | null;
  agentName: string | null;
  channelName: string | null;
  onOpenChannel?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function decide(decision: "approve" | "reject", editedText?: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/approvals/${approval.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, editedText }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok && res.status !== 409) throw new Error(body.error ?? "Couldn't save that.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that.");
    } finally {
      setBusy(false);
    }
  }

  const value = draft ?? text ?? "";

  return (
    <article className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
        <span className="rounded-full bg-primary-soft px-2 py-0.5 font-semibold text-primary">
          {approval.kind === "plan" ? "Plan" : "Draft"}
        </span>
        {agentName && <span>{agentName}</span>}
        {channelName && (
          <button type="button" onClick={onOpenChannel} className="font-semibold hover:text-foreground">
            #{channelName}
          </button>
        )}
      </div>
      <h3 className="mt-2 font-semibold">{approval.summary}</h3>

      {text !== null &&
        (editing ? (
          <textarea
            value={value}
            onChange={(event) => setDraft(event.target.value)}
            rows={Math.min(14, Math.max(5, value.split("\n").length + 1))}
            className="mt-3 w-full rounded-xl border border-border bg-background p-3 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        ) : (
          <div className="mt-3">
            <p className={`whitespace-pre-wrap rounded-xl bg-surface p-3 text-sm leading-relaxed ${open ? "" : "line-clamp-5"}`}>
              {value}
            </p>
            {value.split("\n").length > 5 || value.length > 400 ? (
              <button type="button" onClick={() => setOpen(!open)} className="mt-1 text-sm font-semibold text-primary">
                {open ? "Show less" : "Show all"}
              </button>
            ) : null}
          </div>
        ))}

      <div className="mt-4 flex flex-wrap gap-2">
        {editing ? (
          <>
            <button
              type="button"
              disabled={busy || !value.trim()}
              onClick={() => decide("approve", value)}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              Save and approve
            </button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-full px-4 py-2 text-sm font-semibold text-muted">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => decide("approve")}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              Approve
            </button>
            {text !== null && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setEditing(true)}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-60"
              >
                Edit
              </button>
            )}
            {approval.kind === "plan" && onOpenChannel && (
              <button type="button" onClick={onOpenChannel} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                See plan
              </button>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => decide("reject")}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted hover:text-foreground disabled:opacity-60"
            >
              Reject
            </button>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-sm">{error}</p>}
    </article>
  );
}

function Leaderboard({ agents }: { agents: Agent[] }) {
  const mains = agents.filter((a) => a.level === "main" && a.path !== "obie");
  const groups = mains
    .map((main) => {
      const members = agents.filter((a) => a.path === main.path || a.path.startsWith(`${main.path}.`));
      return { main, points: members.reduce((sum, a) => sum + a.points, 0) };
    })
    .sort(
      (a, b) =>
        b.points - a.points ||
        (STACK_ORDER.indexOf(a.main.stack) + 99) % 99 - (STACK_ORDER.indexOf(b.main.stack) + 99) % 99,
    );
  const top = agents
    .filter((a) => a.path !== "obie" && a.points !== 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);
  const best = Math.max(1, ...groups.map((g) => g.points));

  return (
    <section>
      <h2 className="text-lg font-bold tracking-tight">Leaderboard</h2>
      <p className="text-sm text-muted">+1 for each approved task, +1 more if on time, -1 if rejected.</p>
      <ul className="mt-3 space-y-2">
        {groups.map(({ main, points }) => (
          <li key={main.id} className="flex items-center gap-3">
            <AgentOrb name={main.name} size={28} />
            <span className="w-28 shrink-0 truncate text-sm font-semibold">{main.name}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
              <span className="block h-full rounded-full bg-primary" style={{ width: `${(Math.max(0, points) / best) * 100}%` }} />
            </span>
            <span className="w-10 shrink-0 text-right text-sm font-bold tabular-nums">{points}</span>
          </li>
        ))}
      </ul>
      {top.length > 0 && (
        <p className="mt-3 text-sm text-muted">
          Top agents: {top.map((a) => `${a.name} (${a.points})`).join(", ")}
        </p>
      )}
    </section>
  );
}
