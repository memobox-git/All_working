import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { logRun } from "@/lib/ai/runs";
import { createAdminClient } from "@/lib/supabase/admin";
import * as unipile from "@/lib/unipile";
import { writeDraft } from "./draft";
import { InboxError } from "./errors";

// Everything that writes inbox rows lives here and runs with the service role.
// Callers must have already checked that the signed-in owner owns the
// workspace (or, for webhooks, that the request really came from Unipile).
// Every query still filters by workspace_id.

export type ConnectedAccount = {
  id: string;
  workspace_id: string;
  external_account_id: string;
  webhook_id: string | null;
  display_name: string | null;
  reply_guide: string;
};

type Thread = {
  id: string;
  workspace_id: string;
  account_id: string;
  external_chat_id: string;
  contact_name: string | null;
  contact_headline: string | null;
  skipped_through: string | null;
};

const accountColumns = "id, workspace_id, external_account_id, webhook_id, display_name, reply_guide";
const threadColumns = "id, workspace_id, account_id, external_chat_id, contact_name, contact_headline, skipped_through";

// Unipile's guidance is at most about 100 LinkedIn messages a day per account.
// Stay well under it so the account never looks automated.
const DAILY_SEND_LIMIT = 60;

function must<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

// ---------- Accounts ----------

export async function getAccount(admin: SupabaseClient, workspaceId: string) {
  return must(
    await admin
      .from("connected_accounts")
      .select(accountColumns)
      .eq("workspace_id", workspaceId)
      .eq("provider", "linkedin")
      .maybeSingle<ConnectedAccount>(),
  );
}

// Unipile finished a LinkedIn sign-in for this workspace.
export async function saveConnectedAccount(workspaceId: string, externalAccountId: string, origin: string) {
  const admin = createAdminClient();
  const workspace = must(
    await admin.from("workspaces").select("id").eq("id", workspaceId).maybeSingle<{ id: string }>(),
  );
  if (!workspace) return null;

  const existing = await getAccount(admin, workspaceId);
  if (existing?.external_account_id === externalAccountId) return existing; // a reconnect
  if (existing) await disconnectAccount(existing); // a different LinkedIn account replaces the old one

  await ensureInboxAgent(admin, workspaceId);
  const webhookId = await unipile.createMessageWebhook({
    accountId: externalAccountId,
    url: `${origin}/api/unipile/messages`,
  });

  return must(
    await admin
      .from("connected_accounts")
      .insert({
        workspace_id: workspaceId,
        provider: "linkedin",
        external_account_id: externalAccountId,
        webhook_id: webhookId,
      })
      .select(accountColumns)
      .single<ConnectedAccount>(),
  );
}

export async function disconnectAccount(account: ConnectedAccount) {
  // Best effort on Unipile's side: the account may already be gone there.
  if (account.webhook_id) await unipile.deleteWebhook(account.webhook_id).catch(() => {});
  await unipile.deleteAccount(account.external_account_id).catch(() => {});
  // Threads, messages and drafts go with it.
  must(await createAdminClient().from("connected_accounts").delete().eq("id", account.id));
}

export async function saveReplyGuide(workspaceId: string, guide: string) {
  must(
    await createAdminClient()
      .from("connected_accounts")
      .update({ reply_guide: guide.slice(0, 4000) })
      .eq("workspace_id", workspaceId),
  );
}

// The Inbox agent writes every draft, so its model calls are logged under it.
async function ensureInboxAgent(admin: SupabaseClient, workspaceId: string) {
  const find = () =>
    admin
      .from("agents")
      .select("id, path")
      .eq("workspace_id", workspaceId)
      .eq("path", "inbox")
      .maybeSingle<{ id: string; path: string }>();

  const found = must(await find());
  if (found) return found;
  const { error } = await admin
    .from("agents")
    .insert({ workspace_id: workspaceId, name: "Inbox", stack: "inbox", level: "main", path: "inbox" });
  // 23505: a parallel request created it first.
  if (error && error.code !== "23505") throw new Error(error.message);
  return must(await find())!;
}

// ---------- Threads and messages ----------

type IncomingMessage = {
  externalId: string;
  fromOwner: boolean;
  senderName: string | null;
  body: string;
  sentAt: string;
};

async function findOrCreateThread(admin: SupabaseClient, account: ConnectedAccount, chatId: string) {
  const find = () =>
    admin
      .from("inbox_threads")
      .select(threadColumns)
      .eq("account_id", account.id)
      .eq("external_chat_id", chatId)
      .maybeSingle<Thread>();

  const found = must(await find());
  if (found) return found;

  const contact = await contactFor(chatId, null);
  const { error } = await admin.from("inbox_threads").insert({
    workspace_id: account.workspace_id,
    account_id: account.id,
    external_chat_id: chatId,
    ...contact.fields,
  });
  if (error && error.code !== "23505") throw new Error(error.message);
  return must(await find())!;
}

async function contactFor(chatId: string, chatName: string | null) {
  const attendees = await unipile.listAttendees(chatId).catch(() => []);
  const others = attendees.filter((a) => !a.is_self);
  const self = attendees.find((a) => a.is_self);
  const first = others[0];
  return {
    attendees,
    ownerName: self?.name ?? null,
    fields: {
      contact_name: chatName || others.map((a) => a.name).filter(Boolean).join(", ") || null,
      contact_headline: others.length === 1 ? (first.specifics?.headline ?? first.specifics?.occupation ?? null) : null,
      contact_profile_url: others.length === 1 ? (first.profile_url ?? null) : null,
    },
  };
}

// Saves messages, skipping ones already stored. Returns the newly stored ones.
async function saveMessages(admin: SupabaseClient, thread: Thread, messages: IncomingMessage[]) {
  if (!messages.length) return [];
  const rows = messages.map((m) => ({
    workspace_id: thread.workspace_id,
    thread_id: thread.id,
    external_message_id: m.externalId,
    direction: m.fromOwner ? "out" : "in",
    sender_name: m.senderName,
    body: m.body,
    sent_at: m.sentAt,
  }));
  return must(
    await admin
      .from("inbox_messages")
      .upsert(rows, { onConflict: "thread_id,external_message_id", ignoreDuplicates: true })
      .select("id, direction"),
  ) as { id: string; direction: "in" | "out" }[];
}

// Brings the thread's preview and needs_reply in line with its newest message.
async function refreshThreadSummary(admin: SupabaseClient, thread: Thread) {
  const latest = must(
    await admin
      .from("inbox_messages")
      .select("direction, body, sent_at")
      .eq("thread_id", thread.id)
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle<{ direction: "in" | "out"; body: string; sent_at: string }>(),
  );
  if (!latest) return;
  const skipped = thread.skipped_through && new Date(latest.sent_at) <= new Date(thread.skipped_through);
  must(
    await admin
      .from("inbox_threads")
      .update({
        last_message_at: latest.sent_at,
        last_message_preview: latest.body.slice(0, 200),
        needs_reply: latest.direction === "in" && !skipped,
      })
      .eq("id", thread.id),
  );
}

// The owner replied some other way (the LinkedIn app), so an open draft is moot.
async function closeOpenDraft(admin: SupabaseClient, threadId: string) {
  const open = must(
    await admin
      .from("reply_drafts")
      .update({ status: "skipped", decided_at: new Date().toISOString() })
      .eq("thread_id", threadId)
      .eq("status", "pending")
      .select("approval_id"),
  ) as { approval_id: string | null }[];
  // Nobody decided anything, so the approval is withdrawn, not rejected.
  const approvalIds = open.map((d) => d.approval_id).filter((id): id is string => Boolean(id));
  if (approvalIds.length) must(await admin.from("approvals").delete().in("id", approvalIds));
}

// ---------- Webhook: a new message ----------

export type MessageWebhook = {
  event?: string;
  account_id?: string;
  account_info?: { user_id?: string };
  chat_id?: string;
  message_id?: string;
  message?: string | null;
  timestamp?: string;
  sender?: { attendee_name?: string; attendee_provider_id?: string };
  attachments?: { type?: string }[];
};

// Stores a message from Unipile's webhook. Returns the thread to draft a
// reply for when it's a new message from the other person.
export async function recordWebhookMessage(payload: MessageWebhook) {
  if (payload.event !== "message_received" || !payload.account_id || !payload.chat_id || !payload.message_id) {
    return null;
  }
  const admin = createAdminClient();
  const account = must(
    await admin
      .from("connected_accounts")
      .select(accountColumns)
      .eq("external_account_id", payload.account_id)
      .maybeSingle<ConnectedAccount>(),
  );
  if (!account) return null;

  // Unipile's documented test for "the owner sent this": the sender is the
  // account's own LinkedIn user.
  const fromOwner =
    Boolean(payload.account_info?.user_id) && payload.account_info?.user_id === payload.sender?.attendee_provider_id;
  const body = unipile.messageBody(payload.message, payload.attachments);
  if (!body) return null;

  const thread = await findOrCreateThread(admin, account, payload.chat_id);
  const saved = await saveMessages(admin, thread, [
    {
      externalId: payload.message_id,
      fromOwner,
      senderName: payload.sender?.attendee_name ?? null,
      body,
      sentAt: payload.timestamp ?? new Date().toISOString(),
    },
  ]);
  await refreshThreadSummary(admin, thread);
  if (!saved.length) return null; // a retry of a delivery we already have

  if (fromOwner) {
    await closeOpenDraft(admin, thread.id);
    return null;
  }
  return { workspaceId: account.workspace_id, threadId: thread.id, messageId: saved[0].id };
}

// People often send two or three messages in a row. Drafting only for the
// newest one saves a model call per extra message.
export async function draftIfStillNewest(workspaceId: string, threadId: string, messageId: string) {
  const newest = must(
    await createAdminClient()
      .from("inbox_messages")
      .select("id")
      .eq("thread_id", threadId)
      .eq("direction", "in")
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle<{ id: string }>(),
  );
  if (newest?.id === messageId) await draftReply(workspaceId, threadId);
}

// ---------- Sync ----------

// Pulls recent chats and messages, for the first connect and "Sync now".
// Returns the threads worth drafting a reply for right away.
export async function syncAccount(account: ConnectedAccount, options = { chats: 25, messages: 30 }) {
  const admin = createAdminClient();
  const chats = (await unipile.listChats(account.external_account_id, options.chats)).filter(
    // Read-only chats can't be answered, and sponsored ones are ads.
    (chat) => !chat.read_only && chat.content_type !== "sponsored",
  );

  let ownerName = account.display_name;
  await forEachLimit(chats, 4, async (chat) => {
    const [contact, messages] = await Promise.all([
      contactFor(chat.id, chat.name),
      unipile.listMessages(chat.id, options.messages),
    ]);
    ownerName ??= contact.ownerName;
    const names = new Map(contact.attendees.map((a) => [a.id, a.name]));

    // Leave out fields Unipile didn't return, so a failed attendee lookup
    // doesn't wipe a name we already have.
    const known = Object.fromEntries(Object.entries(contact.fields).filter(([, value]) => value != null));
    const { error } = await admin.from("inbox_threads").upsert(
      {
        workspace_id: account.workspace_id,
        account_id: account.id,
        external_chat_id: chat.id,
        ...known,
      },
      { onConflict: "account_id,external_chat_id" },
    );
    if (error) throw new Error(error.message);
    const thread = must(
      await admin
        .from("inbox_threads")
        .select(threadColumns)
        .eq("account_id", account.id)
        .eq("external_chat_id", chat.id)
        .single<Thread>(),
    );

    await saveMessages(
      admin,
      thread,
      messages
        .filter((m) => !m.hidden && !m.deleted && !m.is_event)
        .map((m) => ({
          externalId: m.id,
          fromOwner: unipile.isFromOwner(m),
          senderName: (m.sender_attendee_id && names.get(m.sender_attendee_id)) || null,
          body: unipile.messageBody(m.text, m.attachments),
          sentAt: m.timestamp,
        }))
        .filter((m) => m.body),
    );
    await refreshThreadSummary(admin, thread);
  });

  must(
    await admin
      .from("connected_accounts")
      .update({ last_synced_at: new Date().toISOString(), display_name: ownerName })
      .eq("id", account.id),
  );

  // Recent conversations still waiting on the owner, with no draft yet.
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const waiting = must(
    await admin
      .from("inbox_threads")
      .select("id, reply_drafts(id, status)")
      .eq("workspace_id", account.workspace_id)
      .eq("needs_reply", true)
      .gte("last_message_at", twoWeeksAgo)
      .order("last_message_at", { ascending: false })
      .limit(10),
  ) as { id: string; reply_drafts: { status: string }[] }[];

  return waiting
    .filter((t) => !t.reply_drafts.some((d) => d.status === "pending" || d.status === "sending"))
    .slice(0, 5)
    .map((t) => t.id);
}

// ---------- Drafting ----------

export async function draftReply(workspaceId: string, threadId: string, redoInstruction?: string) {
  const admin = createAdminClient();
  const startedAt = new Date();

  const thread = must(
    await admin
      .from("inbox_threads")
      .select(threadColumns)
      .eq("id", threadId)
      .eq("workspace_id", workspaceId)
      .maybeSingle<Thread>(),
  );
  if (!thread) throw new InboxError("That conversation is gone.");

  const [account, agent, profile, recent, voice, open] = await Promise.all([
    admin.from("connected_accounts").select(accountColumns).eq("id", thread.account_id).single<ConnectedAccount>(),
    ensureInboxAgent(admin, workspaceId),
    admin.from("business_profiles").select("data").eq("workspace_id", workspaceId).maybeSingle<{ data: unknown }>(),
    admin
      .from("inbox_messages")
      .select("id, direction, body, sent_at")
      .eq("thread_id", thread.id)
      .order("sent_at", { ascending: false })
      .limit(30),
    admin
      .from("inbox_messages")
      .select("body")
      .eq("workspace_id", workspaceId)
      .eq("direction", "out")
      .neq("thread_id", thread.id)
      .order("sent_at", { ascending: false })
      .limit(12),
    admin
      .from("reply_drafts")
      .select("id, status, body")
      .eq("thread_id", thread.id)
      .in("status", ["pending", "sending"])
      .maybeSingle<{ id: string; status: string; body: string }>(),
  ]);

  const conversation = (must(recent) as { id: string; direction: string; body: string; sent_at: string }[]).reverse();
  if (!conversation.length) throw new InboxError("There's nothing in this conversation to reply to yet.");
  const openDraft = must(open);
  if (openDraft?.status === "sending") throw new InboxError("A reply is being sent right now.");
  const latestInbound = [...conversation].reverse().find((m) => m.direction === "in");

  const { draft, model, usage } = await writeDraft({
    ownerName: must(account).display_name,
    replyGuide: must(account).reply_guide,
    businessProfile: must(profile)?.data ?? null,
    contactName: thread.contact_name,
    contactHeadline: thread.contact_headline,
    conversation: conversation.map((m) => ({ fromOwner: m.direction === "out", body: m.body, sentAt: m.sent_at })),
    voiceExamples: (must(voice) as { body: string }[]).map((m) => m.body).filter(Boolean),
    redo: redoInstruction !== undefined && openDraft ? { instruction: redoInstruction, previous: openDraft.body } : undefined,
  });

  await logRun(admin, { workspaceId, agentId: agent.id, agentPath: agent.path, model, usage, startedAt });

  // If they wrote again while this draft was being written, a newer draft run
  // covers both messages, so this one steps aside.
  if (redoInstruction === undefined && latestInbound) {
    const newest = must(
      await admin
        .from("inbox_messages")
        .select("id")
        .eq("thread_id", thread.id)
        .eq("direction", "in")
        .order("sent_at", { ascending: false })
        .limit(1)
        .maybeSingle<{ id: string }>(),
    );
    if (newest && newest.id !== latestInbound.id) return;
  }

  const fields = {
    body: draft.reply,
    category: draft.category,
    needs_owner: draft.needs_owner,
    note: draft.note,
    reply_to_message_id: latestInbound?.id ?? null,
    error: null,
  };
  await saveOpenDraft(admin, thread, fields);
}

async function saveOpenDraft(admin: SupabaseClient, thread: Thread, fields: Record<string, unknown>) {
  const updateOpen = async () =>
    must(
      await admin
        .from("reply_drafts")
        .update(fields)
        .eq("thread_id", thread.id)
        .eq("status", "pending")
        .select("id"),
    ) as { id: string }[];

  if ((await updateOpen()).length) return;

  const approval = must(
    await admin
      .from("approvals")
      .insert({
        workspace_id: thread.workspace_id,
        kind: "reply",
        summary: `Reply to ${thread.contact_name ?? "a LinkedIn message"} on LinkedIn`,
      })
      .select("id")
      .single<{ id: string }>(),
  );
  const { error } = await admin
    .from("reply_drafts")
    .insert({ workspace_id: thread.workspace_id, thread_id: thread.id, approval_id: approval.id, ...fields });
  if (!error) return;

  // 23505: another draft run opened one first (or it's being sent). Drop the
  // spare approval and update the open draft instead.
  must(await admin.from("approvals").delete().eq("id", approval.id));
  if (error.code !== "23505") throw new Error(error.message);
  await updateOpen();
}

// ---------- Owner decisions ----------

export async function sendDraft(workspaceId: string, draftId: string, body: string) {
  const text = body.trim();
  if (!text) throw new InboxError("The reply is empty.");
  if (text.length > 8000) throw new InboxError("LinkedIn messages can be at most 8,000 characters.");

  const admin = createAdminClient();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("reply_drafts")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId)
    .eq("status", "sent")
    .gte("decided_at", dayAgo);
  if ((count ?? 0) >= DAILY_SEND_LIMIT) {
    throw new InboxError(
      `OBIE has sent ${DAILY_SEND_LIMIT} replies in the last 24 hours. To keep your LinkedIn account safe, send the rest from LinkedIn or try again tomorrow.`,
    );
  }

  const draft = must(
    await admin
      .from("reply_drafts")
      .select("thread_id")
      .eq("id", draftId)
      .eq("workspace_id", workspaceId)
      .maybeSingle<{ thread_id: string }>(),
  );
  if (!draft) throw new InboxError("That reply is gone.");
  const thread = must(
    await admin
      .from("inbox_threads")
      .select(threadColumns)
      .eq("id", draft.thread_id)
      .eq("workspace_id", workspaceId)
      .single<Thread>(),
  );
  const account = must(
    await admin
      .from("connected_accounts")
      .select(accountColumns)
      .eq("id", thread.account_id)
      .eq("workspace_id", workspaceId)
      .single<ConnectedAccount>(),
  );

  // Claim the draft, so a double tap (or a second device) can't send it twice.
  const claimed = must(
    await admin
      .from("reply_drafts")
      .update({ status: "sending", body: text, error: null })
      .eq("id", draftId)
      .eq("status", "pending")
      .select("id, approval_id")
      .maybeSingle<{ id: string; approval_id: string | null }>(),
  );
  if (!claimed) throw new InboxError("This reply was already sent or skipped.");

  let messageId: string | null;
  try {
    messageId = await unipile.sendMessage({
      accountId: account.external_account_id,
      chatId: thread.external_chat_id,
      text,
    });
  } catch (error) {
    const reason = sendFailure(error);
    must(await admin.from("reply_drafts").update({ status: "pending", error: reason }).eq("id", claimed.id));
    throw new InboxError(reason);
  }

  const now = new Date().toISOString();
  must(
    await admin
      .from("reply_drafts")
      .update({ status: "sent", external_message_id: messageId, decided_at: now })
      .eq("id", claimed.id),
  );
  if (claimed.approval_id) {
    must(await admin.from("approvals").update({ status: "approved", decided_at: now }).eq("id", claimed.approval_id));
  }
  // Unipile's webhook reports this message too; whichever lands first wins.
  if (messageId) {
    await saveMessages(admin, thread, [
      { externalId: messageId, fromOwner: true, senderName: account.display_name, body: text, sentAt: now },
    ]);
    await refreshThreadSummary(admin, thread);
  } else {
    must(await admin.from("inbox_threads").update({ needs_reply: false }).eq("id", thread.id));
  }
}

function sendFailure(error: unknown) {
  if (error instanceof unipile.UnipileError) {
    if (error.status === 401) {
      return "LinkedIn signed OBIE out. In Inbox settings, disconnect and connect LinkedIn again, then send.";
    }
    if (error.status === 429 || error.status >= 500) {
      return "LinkedIn is busy right now. Wait a few minutes, then send again.";
    }
    if (error.status === 422) return "LinkedIn didn't accept this message. Check it, then send again.";
  }
  return "The reply didn't send. Try again in a moment.";
}

export async function skipDraft(workspaceId: string, draftId: string) {
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const skipped = must(
    await admin
      .from("reply_drafts")
      .update({ status: "skipped", decided_at: now })
      .eq("id", draftId)
      .eq("workspace_id", workspaceId)
      .eq("status", "pending")
      .select("approval_id, thread_id, reply_to_message_id")
      .maybeSingle<{ approval_id: string | null; thread_id: string; reply_to_message_id: string | null }>(),
  );
  if (!skipped) return;
  if (skipped.approval_id) {
    must(await admin.from("approvals").update({ status: "rejected", decided_at: now }).eq("id", skipped.approval_id));
  }
  // Out of "Needs reply" until they write again. Skipping covers the message
  // the draft answered, so anything newer still counts.
  const repliedTo = skipped.reply_to_message_id
    ? must(
        await admin
          .from("inbox_messages")
          .select("sent_at")
          .eq("id", skipped.reply_to_message_id)
          .maybeSingle<{ sent_at: string }>(),
      )
    : null;
  const thread = must(
    await admin
      .from("inbox_threads")
      .update({ skipped_through: repliedTo?.sent_at ?? now })
      .eq("id", skipped.thread_id)
      .select(threadColumns)
      .single<Thread>(),
  );
  await refreshThreadSummary(admin, thread);
}

// ---------- Helpers ----------

async function forEachLimit<T>(items: T[], limit: number, run: (item: T) => Promise<void>) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: Math.min(limit, queue.length) }, async () => {
      for (let item = queue.shift(); item !== undefined; item = queue.shift()) await run(item);
    }),
  );
}

export async function draftMany(workspaceId: string, threadIds: string[]) {
  await forEachLimit(threadIds, 2, (threadId) =>
    draftReply(workspaceId, threadId).catch((error) => console.error("draft failed", threadId, error)),
  );
}
