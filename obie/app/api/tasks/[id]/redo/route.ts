import { after, NextResponse } from "next/server";
import { NotEnoughCreditsError, reserveTasks } from "@/lib/credits-server";
import { createClient } from "@/lib/supabase/server";
import { runWorker } from "@/lib/worker";
import { loadWorkspace } from "@/lib/workspace";

export const maxDuration = 60;

// Runs a stuck or rejected task again. Rejected drafts are redone for free;
// tasks that were waiting on a stuck one get going again too.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const ctx = await loadWorkspace(supabase).catch(() => null);
  if (!ctx) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const workspaceId = ctx.workspace.workspace_id;

  const { data: task } = await supabase
    .from("tasks")
    .select("id, title, status, channel_id, agent_id, depends_on, input")
    .eq("id", id)
    .maybeSingle();
  if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });

  const { data: rejected } = await supabase
    .from("approvals")
    .select("id")
    .eq("task_id", task.id)
    .eq("status", "rejected")
    .limit(1);
  const wasRejected = task.status === "done" && !!rejected?.length;
  if (task.status !== "failed" && !wasRejected) {
    return NextResponse.json({ error: "Only stuck or rejected tasks can be redone." }, { status: 400 });
  }

  // Everything in the channel still waiting downstream of this task.
  const { data: siblings } = await supabase
    .from("tasks")
    .select("id, status, depends_on")
    .eq("channel_id", task.channel_id ?? "");
  const all = siblings ?? [];
  const downstream = new Set<string>();
  let grew = true;
  while (grew) {
    grew = false;
    for (const t of all) {
      if (t.status !== "waiting" || downstream.has(t.id)) continue;
      if ((t.depends_on as string[]).some((d) => d === task.id || downstream.has(d))) {
        downstream.add(t.id);
        grew = true;
      }
    }
  }

  try {
    await reserveTasks(workspaceId, [task.id, ...downstream], task.channel_id);
  } catch (error) {
    if (error instanceof NotEnoughCreditsError) return NextResponse.json({ error: error.message }, { status: 402 });
    console.error(error);
    return NextResponse.json({ error: "Couldn't reserve credits. Try again." }, { status: 500 });
  }

  const done = new Set(all.filter((t) => t.status === "done" && t.id !== task.id).map((t) => t.id));
  const ready = (task.depends_on as string[]).every((d) => done.has(d));
  await supabase
    .from("tasks")
    .update({
      status: ready ? "ready" : "waiting",
      started_at: null,
      finished_at: null,
      input: { ...(task.input ?? {}), free_redo: wasRejected },
    })
    .eq("id", task.id);
  if (task.channel_id) {
    await supabase.from("channels").update({ status: "active" }).eq("id", task.channel_id).neq("status", "archived");
    const { data: channel } = await supabase.from("channels").select("owner_agent_id").eq("id", task.channel_id).single();
    await supabase.from("messages").insert({
      workspace_id: workspaceId,
      channel_id: task.channel_id,
      author_type: "agent",
      author_agent_id: channel?.owner_agent_id ?? task.agent_id,
      kind: "status",
      body: `Redoing: ${task.title}${wasRejected ? " (free, since you rejected the first one)" : ""}.`,
      data: { status: "running" },
    });
  }
  if (task.agent_id) await supabase.from("agents").update({ status: "working" }).eq("id", task.agent_id);
  after(() => runWorker(supabase, { workspaceId, budgetMs: 45_000 }).catch((e) => console.error(e)));
  return NextResponse.json({ ok: true });
}
