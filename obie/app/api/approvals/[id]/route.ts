import { after, NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { promoteReady, runWorker } from "@/lib/worker";
import { loadWorkspace } from "@/lib/workspace";

export const maxDuration = 60;

// Approve or reject a plan or a single output.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const ctx = await loadWorkspace(supabase).catch(() => null);
  if (!ctx) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const workspaceId = ctx.workspace.workspace_id;

  const body = (await request.json().catch(() => null)) as { decision?: unknown } | null;
  const decision = body?.decision === "approve" ? "approved" : body?.decision === "reject" ? "rejected" : null;
  if (!decision) return NextResponse.json({ error: "Approve or reject." }, { status: 400 });

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
  const say = (text: string, status: string) =>
    supabase.from("messages").insert({
      workspace_id: workspaceId,
      channel_id: approval.channel_id,
      author_type: "agent",
      author_agent_id: channel?.owner_agent_id ?? ctx.obieId,
      kind: "status",
      body: text,
      data: { status, approvalId: approval.id },
    });

  if (approval.kind === "plan" && channel) {
    if (decision === "approved") {
      await promoteReady(supabase, channel.id);
      if (channel.owner_agent_id) await supabase.from("agents").update({ status: "working" }).eq("id", channel.owner_agent_id);
      await say("Approved. The team is starting now.", "running");
      after(() => runWorker(supabase, { workspaceId, budgetMs: 45_000 }).catch((e) => console.error(e)));
    } else {
      await supabase.from("tasks").update({ status: "failed" }).eq("channel_id", channel.id).neq("status", "done");
      await supabase.from("channels").update({ status: "archived" }).eq("id", channel.id);
      await say("Plan rejected. DM me what to change and I'll make a new one.", "stuck");
    }
  } else if (approval.kind === "task" && approval.channel_id) {
    await say(decision === "approved" ? `Approved: ${approval.summary.replace(/^Approve: /, "")}` : `Rejected: ${approval.summary.replace(/^Approve: /, "")}`, decision === "approved" ? "done" : "stuck");
  }

  return NextResponse.json({ ok: true, status: decision });
}
