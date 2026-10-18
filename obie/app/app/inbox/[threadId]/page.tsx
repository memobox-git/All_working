import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireWorkspace } from "@/lib/workspace";
import { DraftPanel, type OpenDraft } from "../draft-panel";
import { Avatar, RelativeTime } from "../ui";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function ThreadPage({ params }: PageProps<"/app/inbox/[threadId]">) {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      {params.then(({ threadId }) => (
        <Conversation threadId={threadId} />
      ))}
    </Suspense>
  );
}

type Message = { id: string; direction: "in" | "out"; body: string; sent_at: string };

async function Conversation({ threadId }: { threadId: string }) {
  if (!uuid.test(threadId)) notFound();
  const { supabase } = await requireWorkspace();

  const [{ data: thread }, { data: messages }, { data: draft }] = await Promise.all([
    supabase
      .from("inbox_threads")
      .select("id, contact_name, contact_headline, contact_profile_url, needs_reply")
      .eq("id", threadId)
      .maybeSingle<{
        id: string;
        contact_name: string | null;
        contact_headline: string | null;
        contact_profile_url: string | null;
        needs_reply: boolean;
      }>(),
    supabase
      .from("inbox_messages")
      .select("id, direction, body, sent_at")
      .eq("thread_id", threadId)
      .order("sent_at", { ascending: false })
      .limit(50)
      .returns<Message[]>(),
    supabase
      .from("reply_drafts")
      .select("id, body, category, needs_owner, note, status, error")
      .eq("thread_id", threadId)
      .in("status", ["pending", "sending"])
      .maybeSingle<OpenDraft>(),
  ]);
  if (!thread) notFound();

  return (
    <>
      <header className="flex items-center gap-3 border-b border-border px-4 py-3 lg:px-6">
        <Link
          href="/app/inbox"
          aria-label="Back to inbox"
          className="-ml-2 flex size-9 items-center justify-center rounded-full hover:bg-surface lg:hidden"
        >
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
            <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Avatar name={thread.contact_name} size={36} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{thread.contact_name ?? "LinkedIn member"}</p>
          {thread.contact_headline && <p className="truncate text-xs text-muted">{thread.contact_headline}</p>}
        </div>
        {thread.contact_profile_url && (
          <a
            href={thread.contact_profile_url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-surface"
          >
            Profile
          </a>
        )}
      </header>

      {/* column-reverse keeps the newest message in view without any script. */}
      <div className="flex min-h-0 flex-1 flex-col-reverse gap-2 overflow-y-auto px-4 py-4 lg:px-6">
        {(messages ?? []).map((message) => (
          <Bubble key={message.id} message={message} />
        ))}
      </div>

      <DraftPanel threadId={thread.id} draft={draft ?? null} needsReply={thread.needs_reply} />
    </>
  );
}

function Bubble({ message }: { message: Message }) {
  const mine = message.direction === "out";
  return (
    <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      <p
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed lg:max-w-[70%] ${
          mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-surface"
        }`}
      >
        {message.body}
      </p>
      <RelativeTime iso={message.sent_at} className="mt-1 px-1 text-[11px] text-muted" />
    </div>
  );
}
