import { after, NextResponse, type NextRequest } from "next/server";
import { NotEnoughCreditsError, reservePlan } from "@/lib/credits-server";
import { createClient } from "@/lib/supabase/server";
import { promoteReady, runWorker } from "@/lib/worker";
import { loadWorkspace } from "@/lib/workspace";

export const maxDuration = 60;

// Approve, edit-and-approve, or reject a plan or a single output.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const ctx = await loadWorkspace(supabase).catch(() => null);
  if (!ctx) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const workspaceId = ctx.workspace.workspace_id;

  const body = (await request.json().catch(() => null)) as { decision?: unknown; editedText?: unknown } | null;
  const decision = body?.decision === "approve" ? "approved" : body?.decision === "reject" ? "rejected" : null;
  if (!decision) return NextResponse.json({ error: "Approve or reject." }, { status: 400 });
  const editedText = typeof body?.editedText === "string" ? body.editedText.trim().slice(0, 20000) : null;

  // Only a pending approval can be decided, so a double tap does nothing twice.
  const { data: approval } = await supabase
    .from("approvals")
    .update({ status: decision, decided_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending")
    .select("id, kind, task_id, channel_id, summary")
    .maybeSingle();
  if (!approval) return NextResponse.json({ error: "Already decided." }, { status: 409 });

  const { data: channel } = approval.channel_id
    ? await supabase.from("channels").select("id, owner_agent_id").eq("id", approval.channel_id).maybeSingle()
    : { data: null };
  const say = (text: string, status: string, extra: Record<string, unknown> = {}) =>
    supabase.from("messages").insert({
      workspace_id: workspaceId,
      channel_id: approval.channel_id,
      author_type: "agent",
      author_agent_id: channel?.owner_agent_id ?? ctx.obieId,
      kind: "status",
      body: text,
      data: { status, approvalId: approval.id, ...extra },
    });

  if (approval.kind === "plan" && channel) {
    if (decision === "approved") {
      let reserved = { reserved: 0, enabled: false };
      try {
        reserved = await reservePlan(workspaceId, channel.id);
      } catch (error) {
        // Put the approval back so the owner can try again later.
        await supabase.from("approvals").update({ status: "pending", decided_at: null }).eq("id", approval.id);
        if (error instanceof NotEnoughCreditsError) {
          return NextResponse.json({ error: error.message }, { status: 402 });
        }
        console.error(error);
        return NextResponse.json({ error: "Couldn't reserve credits. Try again." }, { status: 500 });
      }
      await promoteReady(supabase, channel.id);
      if (channel.owner_agent_id) await supabase.from("agents").update({ status: "working" }).eq("id", channel.owner_agent_id);
      await say(
        reserved.enabled
          ? `Approved. ${Math.round(reserved.reserved)} credits are reserved and the team is starting now.`
          : "Approved. The team is starting now. (Credits aren't switched on yet, so nothing was reserved.)",
        "running",
      );
      after(() => runWorker(supabase, { workspaceId, budgetMs: 45_000 }).catch((e) => console.error(e)));
    } else {
      await supabase.from("tasks").update({ status: "failed" }).eq("channel_id", channel.id).neq("status", "done");
      await supabase.from("channels").update({ status: "archived" }).eq("id", channel.id);
      await say("Plan rejected. DM me what to change and I'll make a new one.", "stuck");
    }
    return NextResponse.json({ ok: true, status: decision });
  }

  if (approval.kind === "task" && approval.task_id) {
    const { data: task } = await supabase
      .from("tasks")
      .select("id, agent_id, title, output, deadline, finished_at")
      .eq("id", approval.task_id)
      .maybeSingle();
    if (task) {
      if (decision === "approved" && editedText) {
        await supabase
          .from("tasks")
          .update({ output: { ...(task.output ?? {}), text: editedText, edited: true } })
          .eq("id", task.id);
      }
      // Points: +1 approved, +1 more if it was on time, -1 rejected.
      const onTime = !!task.finished_at && (!task.deadline || new Date(task.finished_at) <= new Date(task.deadline));
      const delta = decision === "approved" ? 1 + (onTime ? 1 : 0) : -1;
      if (task.agent_id) {
        const { data: agent } = await supabase.from("agents").select("points").eq("id", task.agent_id).single();
        if (agent) await supabase.from("agents").update({ points: agent.points + delta }).eq("id", task.agent_id);
      }
      await say(
        decision === "approved"
          ? `Approved${editedText ? " with your edits" : ""}: ${task.title}. ${delta > 1 ? "+2 points (on time)." : "+1 point."}`
          : `Rejected: ${task.title}. -1 point. It can be redone for free.`,
        decision === "approved" ? "done" : "stuck",
        decision === "rejected" ? { redoTaskId: task.id } : {},
      );
    }
  }

  return NextResponse.json({ ok: true, status: decision });
}
