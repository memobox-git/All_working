import "server-only";

// Unipile connects the owner's LinkedIn account and gives us its DMs over a
// REST API (LinkedIn has no public messaging API). One Unipile API key serves
// every workspace, so always pass the account id that belongs to the caller.
// Docs: https://developer.unipile.com

// The DSN from the Unipile dashboard, e.g. api8.unipile.com:13851 (with or
// without https://).
const dsn = (process.env.UNIPILE_DSN ?? "").trim().replace(/\/+$/, "");
const baseUrl = /^https?:\/\//.test(dsn) ? dsn : `https://${dsn}`;
const apiKey = process.env.UNIPILE_API_KEY ?? "";

export const isUnipileConfigured = Boolean(dsn && apiKey && process.env.UNIPILE_WEBHOOK_SECRET);

export class UnipileError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isUnipileConfigured) {
    throw new Error("Unipile is not configured. Set UNIPILE_DSN, UNIPILE_API_KEY and UNIPILE_WEBHOOK_SECRET.");
  }
  const headers = new Headers(init.headers);
  headers.set("X-API-KEY", apiKey);
  headers.set("Accept", "application/json");
  if (typeof init.body === "string") headers.set("Content-Type", "application/json");

  const res = await fetch(`${baseUrl}/api/v1${path}`, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new UnipileError(`Unipile ${init.method ?? "GET"} ${path} failed (${res.status}): ${detail.slice(0, 300)}`, res.status);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

// ---------- Connecting an account ----------

// A link to Unipile's hosted LinkedIn sign-in. When it finishes, Unipile POSTs
// { status, account_id, name } to notifyUrl, with `name` echoed back.
export async function createHostedAuthLink(options: {
  name: string;
  notifyUrl: string;
  successUrl: string;
  failureUrl: string;
}) {
  const { url } = await call<{ url: string }>("/hosted/accounts/link", {
    method: "POST",
    body: JSON.stringify({
      type: "create",
      providers: ["LINKEDIN"],
      api_url: baseUrl,
      expiresOn: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      name: options.name,
      notify_url: options.notifyUrl,
      success_redirect_url: options.successUrl,
      failure_redirect_url: options.failureUrl,
    }),
  });
  return url;
}

export async function deleteAccount(accountId: string) {
  await call(`/accounts/${encodeURIComponent(accountId)}`, { method: "DELETE" });
}

// A webhook for one account's new messages. Unipile sends the secret back in
// the Unipile-Auth header on every delivery.
export async function createMessageWebhook(options: { accountId: string; url: string }) {
  const { webhook_id } = await call<{ webhook_id: string }>("/webhooks", {
    method: "POST",
    body: JSON.stringify({
      request_url: options.url,
      source: "messaging",
      name: `obie-${options.accountId}`,
      events: ["message_received"],
      account_ids: [options.accountId],
      format: "json",
      headers: [
        { key: "Content-Type", value: "application/json" },
        { key: "Unipile-Auth", value: process.env.UNIPILE_WEBHOOK_SECRET },
      ],
    }),
  });
  return webhook_id;
}

export async function deleteWebhook(webhookId: string) {
  await call(`/webhooks/${encodeURIComponent(webhookId)}`, { method: "DELETE" });
}

// ---------- Reading ----------

export type UnipileChat = {
  id: string;
  account_id: string;
  name: string | null;
  timestamp: string | null;
  read_only?: number;
  content_type?: string | null;
};

export type UnipileMessage = {
  id: string;
  chat_id: string;
  text: string | null;
  timestamp: string;
  is_sender: number | boolean;
  sender_attendee_id?: string;
  hidden?: number;
  deleted?: number;
  is_event?: number;
  attachments?: { type?: string }[];
};

export type UnipileAttendee = {
  id: string;
  name: string | null;
  is_self: number;
  profile_url?: string | null;
  specifics?: { headline?: string | null; occupation?: string | null };
};

type List<T> = { items: T[]; cursor: string | null };

export async function listChats(accountId: string, limit: number) {
  const params = new URLSearchParams({ account_id: accountId, limit: String(limit) });
  return (await call<List<UnipileChat>>(`/chats?${params}`)).items;
}

// Newest first, as Unipile returns them.
export async function listMessages(chatId: string, limit: number) {
  const params = new URLSearchParams({ limit: String(limit) });
  return (await call<List<UnipileMessage>>(`/chats/${encodeURIComponent(chatId)}/messages?${params}`)).items;
}

export async function listAttendees(chatId: string) {
  return (await call<List<UnipileAttendee>>(`/chats/${encodeURIComponent(chatId)}/attendees`)).items;
}

// ---------- Sending ----------

// Sends into an existing chat. Passing account_id makes Unipile refuse a chat
// that belongs to a different account. Returns the new message id when
// Unipile knows it.
export async function sendMessage(options: { accountId: string; chatId: string; text: string }) {
  const form = new FormData();
  form.set("account_id", options.accountId);
  form.set("text", options.text);
  const { message_id } = await call<{ message_id: string | null }>(
    `/chats/${encodeURIComponent(options.chatId)}/messages`,
    { method: "POST", body: form },
  );
  return message_id;
}

// ---------- Helpers ----------

// Unipile's docs disagree on whether is_sender is 0/1 or a boolean.
export function isFromOwner(message: Pick<UnipileMessage, "is_sender">) {
  return message.is_sender === true || message.is_sender === 1;
}

export function messageBody(text: string | null | undefined, attachments: { type?: string }[] = []) {
  const trimmed = text?.trim();
  if (trimmed) return trimmed;
  if (attachments.length) return `[${attachments[0].type ?? "attachment"}]`;
  return "";
}
