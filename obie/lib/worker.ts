import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { MODELS, structuredCall } from "./ai";
import { toProfile } from "./business-profile";
import { creditsForCost } from "./credits";
import { releaseOnHold, settleTask } from "./credits-server";

// The worker: picks tasks whose dependencies are done and runs each one as a
// nano agent (one task, one model call, only the context it needs). It saves
// the output, posts a short status in the subagent's thread, then unlocks the
// next tasks. Safe to run many times at once: a task is claimed atomically.

type Task = {
  id: string;
  workspace_id: string;
  channel_id: string | null;
  agent_id: string | null;
  title: string;
  input: { key?: string; instructions?: string; kind?: "simple" | "writing"; publishes?: boolean; free_redo?: boolean };
  output: { text?: string; summary?: string } | null;
  depends_on: string[];
  status: "waiting" | "ready" | "running" | "done" | "failed";
  credits_estimate: number;
  started_at: string | null;
};

const TASK_COLUMNS =
  "id, workspace_id, channel_id, agent_id, title, input, output, depends_on, status, credits_estimate, started_at";

const NanoOutputSchema = z.object({
  output: z.string().describe("The finished deliverable, ready for the owner to read or use"),
  summary: z.string().describe("One short sentence on what you produced, for the status update"),
});

export type WorkerResult = { ran: number; failed: number; remaining: number };

export async function runWorker(
  db: SupabaseClient,
  { workspaceId, budgetMs = 40_000 }: { workspaceId?: string; budgetMs?: number } = {},
): Promise<WorkerResult> {
  const started = Date.now();
  // Every query is limited to one workspace when one is given.
  const ws = workspaceId ? [workspaceId] : null;

  // Tasks stuck in "running" (a function died mid-task) go back in the queue.
  let stale = db
    .from("tasks")
    .update({ status: "ready", started_at: null })
    .eq("status", "running")
    .lt("started_at", new Date(Date.now() - 5 * 60_000).toISOString());
  if (ws) stale = stale.in("workspace_id", ws);
  await stale;

  let ran = 0;
  let failed = 0;
  while (Date.now() - started < budgetMs) {
    let pick = db.from("tasks").select("id").eq("status", "ready");
    if (ws) pick = pick.in("workspace_id", ws);
    const { data: next } = await pick.order("created_at", { ascending: true }).limit(1);
    if (!next?.length) break;

    // Claim it: only one worker wins the update from ready to running.
    const { data: claimed } = await db
      .from("tasks")
      .update({ status: "running", started_at: new Date().toISOString() })
      .eq("id", next[0].id)
      .eq("status", "ready")
      .select(TASK_COLUMNS);
    const task = claimed?.[0] as Task | undefined;
    if (!task) continue;

    const ok = await runTask(db, task);
    if (ok) ran += 1;
    else failed += 1;
  }

  let left = db.from("tasks").select("id", { count: "exact", head: true }).in("status", ["ready", "running"]);
  if (ws) left = left.in("workspace_id", ws);
  const { count } = await left;
  return { ran, failed, remaining: count ?? 0 };
}

async function runTask(db: SupabaseClient, task: Task): Promise<boolean> {
  const ws = task.workspace_id;
  const [{ data: channel }, { data: agent }, { data: profileRow }, { data: deps }] = await Promise.all([
    db.from("channels").select("id, name, goal, deadline, owner_agent_id").eq("id", task.channel_id ?? "").maybeSingle(),
    db.from("agents").select("id, name, path, stack").eq("id", task.agent_id ?? "").maybeSingle(),
    db.from("business_profiles").select("data").eq("workspace_id", ws).maybeSingle(),
    task.depends_on.length
      ? db.from("tasks").select("title, output").in("id", task.depends_on)
      : Promise.resolve({ data: [] as { title: string; output: Task["output"] }[] }),
  ]);

  const threadId = await subagentThread(db, task);
  const post = (body: string, data: Record<string, unknown>) =>
    db.from("messages").insert({
      workspace_id: ws,
      channel_id: task.channel_id,
      thread_id: threadId,
      author_type: "agent",
      author_agent_id: task.agent_id,
      kind: "status",
      body,
      data: { nano: task.title, taskId: task.id, ...data },
    });

  if (task.agent_id) await db.from("agents").update({ status: "working" }).eq("id", task.agent_id);
  await post(`Working on: ${task.title}`, { status: "running" });

  const profile = toProfile(profileRow?.data);
  const writing = task.input.kind === "writing";
  const context = [
    `<business>${profile.business_name ?? "The business"}: ${profile.summary ?? profile.offer ?? ""}. Buyers: ${profile.buyers ?? "unknown"}.</business>`,
    channel ? `<goal>${channel.goal}</goal>` : "",
    ...(deps ?? [])
      .filter((d) => d.output?.text)
      .map((d) => `<input from="${d.title}">\n${d.output!.text!.slice(0, 6000)}\n</input>`),
    `<task>${task.title}\n\n${task.input.instructions ?? ""}</task>`,
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    const { data, costUsd } = await structuredCall({
      run: { workspaceId: ws, agentId: task.agent_id, taskId: task.id, path: agent?.path ?? null },
      model: writing ? MODELS.main : MODELS.nano,
      system: `You are a nano agent working for ${agent?.name ?? "a subagent"} on a one-person business's AI team. You do exactly one task, then you're done. Produce the deliverable itself, complete and ready to use, not a description of it. This is a draft for the owner: never claim anything was sent, posted or published. Plain language, no emojis. Never use the word "candidate".`,
      messages: [{ role: "user", content: context }],
      schema: NanoOutputSchema,
      effort: writing ? "medium" : "low",
      maxTokens: writing ? 12000 : 6000,
    });

    await db
      .from("tasks")
      .update({
        status: "done",
        output: { text: data.output, summary: data.summary },
        credits_used: creditsForCost(costUsd),
        finished_at: new Date().toISOString(),
      })
      .eq("id", task.id);
    await post(data.summary, { status: "done", output: data.output });

    if (task.input.publishes) {
      const { data: approval } = await db
        .from("approvals")
        .insert({ workspace_id: ws, kind: "task", task_id: task.id, channel_id: task.channel_id, summary: `Approve: ${task.title}` })
        .select("id")
        .single();
      if (approval) {
        await db.from("messages").insert({
          workspace_id: ws,
          channel_id: task.channel_id,
          thread_id: threadId,
          author_type: "agent",
          author_agent_id: task.agent_id,
          kind: "approval",
          body: `This would go out in your name, so it waits for you: ${task.title}`,
          data: { approvalId: approval.id, taskId: task.id },
        });
      }
    }
    await settleTask(task, true, costUsd).catch((e) => console.error("settle failed", e));
    await afterTask(db, task, true);
    return true;
  } catch (error) {
    console.error("task failed", task.id, error);
    await db.from("tasks").update({ status: "failed", finished_at: new Date().toISOString() }).eq("id", task.id);
    await post(`Couldn't finish this one. ${error instanceof Error && /ANTHROPIC/.test(error.message) ? error.message : "It can be redone."}`, {
      status: "failed",
    });
    await settleTask(task, false, 0).catch((e) => console.error("settle failed", e));
    await afterTask(db, task, false);
    return false;
  }
}

async function subagentThread(db: SupabaseClient, task: Task) {
  if (!task.channel_id || !task.agent_id) return null;
  const { data } = await db
    .from("messages")
    .select("id")
    .eq("channel_id", task.channel_id)
    .is("thread_id", null)
    .eq("data->>subagentThread", task.agent_id)
    .limit(1);
  return data?.[0]?.id ?? null;
}

// Unlock dependents, update statuses, and wrap up the channel when done.
async function afterTask(db: SupabaseClient, task: Task, ok: boolean) {
  if (task.agent_id) {
    const { count } = await db
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("agent_id", task.agent_id)
      .eq("status", "running");
    if (!count) await db.from("agents").update({ status: ok ? "idle" : "stuck" }).eq("id", task.agent_id);
  }
  if (!task.channel_id) return;
  await promoteReady(db, task.channel_id);

  const { data: all } = await db.from("tasks").select("status").eq("channel_id", task.channel_id);
  const statuses = (all ?? []).map((t) => t.status as Task["status"]);
  if (statuses.some((s) => s === "ready" || s === "running")) return;
  if (statuses.some((s) => s === "waiting") && !statuses.some((s) => s === "failed")) return;

  const { data: channel } = await db
    .from("channels")
    .select("id, workspace_id, owner_agent_id, status, name")
    .eq("id", task.channel_id)
    .single();
  if (!channel || channel.status === "done") return;
  const done = statuses.filter((s) => s === "done").length;
  const failedCount = statuses.filter((s) => s === "failed").length;
  const onHold = statuses.filter((s) => s === "waiting").length;
  const { count: waitingApprovals } = await db
    .from("approvals")
    .select("id", { count: "exact", head: true })
    .eq("channel_id", channel.id)
    .eq("kind", "task")
    .eq("status", "pending");

  if (!failedCount) await db.from("channels").update({ status: "done" }).eq("id", channel.id);
  else await releaseOnHold(channel.id).catch((e) => console.error("release failed", e));
  if (channel.owner_agent_id) {
    await db.from("agents").update({ status: failedCount ? "stuck" : "idle" }).eq("id", channel.owner_agent_id);
  }
  await db.from("messages").insert({
    workspace_id: channel.workspace_id,
    channel_id: channel.id,
    author_type: "agent",
    author_agent_id: channel.owner_agent_id,
    kind: "status",
    body: failedCount
      ? `${done} of ${statuses.length} tasks are done. ${failedCount} got stuck${onHold ? `, so ${onHold} more ${onHold === 1 ? "is" : "are"} on hold` : ""}. Stuck tasks can be redone.`
      : `All ${done} tasks are done.${waitingApprovals ? ` ${waitingApprovals} ${waitingApprovals === 1 ? "draft is" : "drafts are"} waiting for you in Needs you.` : ""}`,
    data: { status: failedCount ? "stuck" : "done" },
  });
}

// Waiting tasks whose dependencies are all done become ready.
export async function promoteReady(db: SupabaseClient, channelId: string) {
  const { data: tasks } = await db.from("tasks").select("id, status, depends_on").eq("channel_id", channelId);
  const done = new Set((tasks ?? []).filter((t) => t.status === "done").map((t) => t.id));
  const ready = (tasks ?? [])
    .filter((t) => t.status === "waiting" && (t.depends_on as string[]).every((d) => done.has(d)))
    .map((t) => t.id);
  if (ready.length) await db.from("tasks").update({ status: "ready" }).in("id", ready).eq("status", "waiting");
  return ready.length;
}
