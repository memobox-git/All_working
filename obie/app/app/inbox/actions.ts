"use server";

import { refresh, revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { InboxError } from "@/lib/inbox/errors";
import * as store from "@/lib/inbox/store";
import { createAdminClient } from "@/lib/supabase/admin";
import { createHostedAuthLink, isUnipileConfigured } from "@/lib/unipile";
import { requireWorkspace } from "@/lib/workspace";

export type ActionResult = { error?: string };

// Each action re-reads the row through the owner's own Supabase client first.
// RLS only returns their rows, so a row coming back is the ownership check;
// the store then does the write with the service role.

export async function connectLinkedIn() {
  const { workspace } = await requireWorkspace();
  if (!isUnipileConfigured) redirect("/app/inbox");

  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const secret = encodeURIComponent(process.env.UNIPILE_WEBHOOK_SECRET ?? "");
  const url = await createHostedAuthLink({
    name: workspace.id,
    notifyUrl: `${origin}/api/unipile/accounts?secret=${secret}`,
    successUrl: `${origin}/app/inbox?connected=1`,
    failureUrl: `${origin}/app/inbox?connect=failed`,
  });
  redirect(url);
}

export async function syncInbox(): Promise<ActionResult> {
  const { workspace } = await requireWorkspace();
  const account = await store.getAccount(createAdminClient(), workspace.id);
  if (!account) return { error: "Connect LinkedIn first." };
  try {
    const threadIds = await store.syncAccount(account);
    after(() => store.draftMany(workspace.id, threadIds));
  } catch (error) {
    console.error("sync failed", error);
    return { error: "Couldn't reach LinkedIn. Try again in a minute." };
  }
  refresh();
  return {};
}

export async function requestDraft(threadId: string, instruction?: string): Promise<ActionResult> {
  const { supabase, workspace } = await requireWorkspace();
  const { data: thread } = await supabase.from("inbox_threads").select("id").eq("id", threadId).maybeSingle();
  if (!thread) return { error: "That conversation is gone." };
  try {
    await store.draftReply(workspace.id, threadId, instruction?.slice(0, 500));
  } catch (error) {
    return { error: messageOf(error, "OBIE couldn't write a draft. Try again.") };
  }
  refresh();
  return {};
}

export async function sendReply(draftId: string, body: string): Promise<ActionResult> {
  const { supabase, workspace } = await requireWorkspace();
  const { data: draft } = await supabase.from("reply_drafts").select("id").eq("id", draftId).maybeSingle();
  if (!draft) return { error: "That reply is gone." };
  try {
    await store.sendDraft(workspace.id, draftId, body);
  } catch (error) {
    refresh();
    return { error: messageOf(error, "The reply didn't send. Try again.") };
  }
  refresh();
  return {};
}

export async function skipReply(draftId: string): Promise<ActionResult> {
  const { supabase, workspace } = await requireWorkspace();
  const { data: draft } = await supabase.from("reply_drafts").select("id").eq("id", draftId).maybeSingle();
  if (!draft) return { error: "That reply is gone." };
  await store.skipDraft(workspace.id, draftId);
  refresh();
  return {};
}

export async function saveReplyGuide(guide: string): Promise<ActionResult> {
  const { workspace } = await requireWorkspace();
  await store.saveReplyGuide(workspace.id, guide);
  refresh();
  return {};
}

export async function disconnectLinkedIn() {
  const { workspace } = await requireWorkspace();
  const account = await store.getAccount(createAdminClient(), workspace.id);
  if (account) await store.disconnectAccount(account);
  // The inbox layout is shared with this page, so drop its cached copy.
  revalidatePath("/app/inbox", "layout");
  redirect("/app/inbox");
}

function messageOf(error: unknown, fallback: string) {
  if (error instanceof InboxError) return error.message;
  console.error(error);
  return fallback;
}
