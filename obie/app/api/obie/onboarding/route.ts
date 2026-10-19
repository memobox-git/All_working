import type Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { AiNotConfiguredError, structuredCall } from "@/lib/ai";
import { toProfile } from "@/lib/business-profile";
import { findUrls, OBIE_GREETING, ONBOARDING_SYSTEM, OnboardingTurnSchema, readPage } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/server";
import { loadWorkspace } from "@/lib/workspace";

// One turn of OBIE's onboarding chat: save the owner's message, ask the model
// for OBIE's reply and the updated Business Profile, save the reply.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const ctx = await loadWorkspace(supabase).catch(() => null);
  if (!ctx) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { workspace, obieId } = ctx;
  const workspaceId = workspace.workspace_id;

  const body = (await request.json().catch(() => null)) as { text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 8000) : "";
  if (!text) return NextResponse.json({ error: "Say something first." }, { status: 400 });

  const { data: history, error: historyError } = await supabase
    .from("messages")
    .select("author_type, body, data")
    .eq("dm_agent_id", obieId)
    .is("thread_id", null)
    .order("created_at", { ascending: true })
    .limit(80);
  if (historyError) return NextResponse.json({ error: "Couldn't load the chat." }, { status: 500 });

  const past = history.length ? history : [{ author_type: "agent", body: OBIE_GREETING, data: {} }];
  const lastProfile = [...past].reverse().find((m) => m.author_type === "agent" && m.data?.profile)?.data?.profile;

  // Pasted links: read the page so OBIE can fill in what it can.
  const pages = await Promise.all(findUrls(text).map(async (url) => ({ url, content: await readPage(url) })));
  const pageNotes = pages
    .map(({ url, content }) =>
      content
        ? `<page url="${url}">\n${content}\n</page>`
        : `<page url="${url}">Couldn't read this page. Don't pretend you did.</page>`,
    )
    .join("\n");

  const messages: Anthropic.Beta.BetaMessageParam[] = past.map((m) => ({
    role: m.author_type === "user" ? "user" : "assistant",
    content: m.body,
  }));
  messages.push({
    role: "user",
    content: [
      text,
      pageNotes,
      `<current_profile>${JSON.stringify(toProfile(lastProfile))}</current_profile>`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  });

  let turn;
  try {
    ({ data: turn } = await structuredCall({
      run: { workspaceId, agentId: obieId, path: "obie" },
      system: ONBOARDING_SYSTEM,
      messages,
      schema: OnboardingTurnSchema,
    }));
  } catch (error) {
    if (error instanceof AiNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error(error);
    return NextResponse.json({ error: "OBIE lost its train of thought. Try sending that again." }, { status: 502 });
  }

  // Save the exchange only once OBIE has answered, so a failed turn leaves no
  // half-finished conversation. The greeting is stored with the first message.
  const rows = [];
  if (history.length === 0) {
    rows.push({ author_type: "agent", author_agent_id: obieId, body: OBIE_GREETING, data: {} });
  }
  rows.push({ author_type: "user", author_agent_id: null, body: text, data: {} });
  rows.push({
    author_type: "agent",
    author_agent_id: obieId,
    body: turn.reply,
    data: { profile: turn.profile, ready: turn.ready },
  });
  const now = Date.now();
  const { error: insertError } = await supabase.from("messages").insert(
    rows.map((row, i) => ({
      ...row,
      workspace_id: workspaceId,
      dm_agent_id: obieId,
      // Distinct timestamps keep the order stable when sorting by created_at.
      created_at: new Date(now - (rows.length - i)).toISOString(),
    })),
  );
  if (insertError) {
    console.error(insertError);
    return NextResponse.json({ error: "Couldn't save the chat. Try again." }, { status: 500 });
  }

  // Keep the draft so a refresh still shows the card; confirming stamps it.
  if (turn.ready) {
    await supabase
      .from("business_profiles")
      .upsert({ workspace_id: workspaceId, data: turn.profile }, { onConflict: "workspace_id" });
  }

  return NextResponse.json(turn);
}
