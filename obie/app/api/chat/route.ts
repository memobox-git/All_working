import { NextResponse, type NextRequest } from "next/server";
import { AiNotConfiguredError } from "@/lib/ai";
import { AGENT_COLUMNS, MESSAGE_COLUMNS, type Agent, type Message } from "@/lib/chat-types";
import { respond, type ReplyContext } from "@/lib/respond";
import { createClient } from "@/lib/supabase/server";
import { loadWorkspace } from "@/lib/workspace";

// The owner posts in a DM, a channel or a thread; the right agent answers.
// Both messages reach the screen through Realtime as well as this response.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const ctx = await loadWorkspace(supabase).catch(() => null);
  if (!ctx) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const workspaceId = ctx.workspace.workspace_id;

  const body = (await request.json().catch(() => null)) as {
    text?: unknown;
    dmAgentId?: unknown;
    channelId?: unknown;
    threadId?: unknown;
  } | null;
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 8000) : "";
  const dmAgentId = typeof body?.dmAgentId === "string" ? body.dmAgentId : null;
  const channelId = typeof body?.channelId === "string" ? body.channelId : null;
  const threadId = typeof body?.threadId === "string" ? body.threadId : null;
  if (!text) return NextResponse.json({ error: "Say something first." }, { status: 400 });
  if (!dmAgentId === !channelId) return NextResponse.json({ error: "Pick a conversation." }, { status: 400 });

  // Who answers: the DM's agent, or the agent that owns the channel (OBIE if none).
  let agentId = dmAgentId;
  if (channelId) {
    const { data: channel } = await supabase.from("channels").select("owner_agent_id").eq("id", channelId).maybeSingle();
    if (!channel) return NextResponse.json({ error: "Channel not found." }, { status: 404 });
    agentId = channel.owner_agent_id ?? ctx.obieId;
  }
  const { data: agent } = await supabase.from("agents").select(AGENT_COLUMNS).eq("id", agentId!).maybeSingle();
  if (!agent) return NextResponse.json({ error: "Agent not found." }, { status: 404 });
  if (dmAgentId && (agent as Agent).level !== "main") {
    return NextResponse.json({ error: "You can DM OBIE and main agents." }, { status: 400 });
  }

  const { data: mine, error: insertError } = await supabase
    .from("messages")
    .insert({
      workspace_id: workspaceId,
      dm_agent_id: dmAgentId,
      channel_id: channelId,
      thread_id: threadId,
      author_type: "user",
      body: text,
    })
    .select(MESSAGE_COLUMNS)
    .single();
  if (insertError) return NextResponse.json({ error: "Couldn't send that." }, { status: 500 });

  const replyCtx: ReplyContext = {
    supabase,
    workspaceId,
    obieId: ctx.obieId,
    agent: agent as Agent,
    place: dmAgentId ? { dmAgentId } : { channelId: channelId! },
    threadId,
  };

  try {
    const reply = await respond(replyCtx);
    return NextResponse.json({ messages: [mine as Message, reply] });
  } catch (error) {
    const message =
      error instanceof AiNotConfiguredError ? error.message : "The agent couldn't answer just now. Try again in a moment.";
    if (!(error instanceof AiNotConfiguredError)) console.error(error);
    // Keep the owner's message and say what went wrong in the conversation.
    const { data: note } = await supabase
      .from("messages")
      .insert({
        workspace_id: workspaceId,
        dm_agent_id: dmAgentId,
        channel_id: channelId,
        thread_id: threadId,
        author_type: "agent",
        author_agent_id: (agent as Agent).id,
        kind: "status",
        body: message,
        data: { status: "stuck" },
      })
      .select(MESSAGE_COLUMNS)
      .single();
    return NextResponse.json({ messages: [mine as Message, ...(note ? [note as Message] : [])] });
  }
}
