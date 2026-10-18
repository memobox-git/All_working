"use client";

import Link from "next/link";
import { useRouter, useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, useTransition, type ReactNode } from "react";
import { ObieOrb } from "@/components/obie-orb";
import { createClient } from "@/lib/supabase/client";
import { syncInbox } from "./actions";

// Desktop: thread list on the left, the open conversation on the right.
// Phone: one pane at a time, so the list hides while a conversation is open.
export function InboxPanes({ header, list, children }: { header: ReactNode; list: ReactNode; children: ReactNode }) {
  const detailOpen = useSelectedLayoutSegment() !== null;
  return (
    <>
      <div className={detailOpen ? "hidden lg:block" : undefined}>{header}</div>
      <div className="flex min-h-0 flex-1">
        <aside
          className={`${detailOpen ? "hidden lg:flex" : "flex"} w-full flex-col overflow-y-auto border-border lg:w-96 lg:shrink-0 lg:border-r`}
        >
          {list}
        </aside>
        <section className={`${detailOpen ? "flex" : "hidden lg:flex"} min-w-0 flex-1 flex-col`}>{children}</section>
      </div>
    </>
  );
}

export type ThreadItem = {
  id: string;
  contact_name: string | null;
  last_message_at: string | null;
  last_message_preview: string | null;
  needs_reply: boolean;
  draft: { needs_owner: boolean } | null;
};

export function ThreadList({ threads }: { threads: ThreadItem[] }) {
  const active = useSelectedLayoutSegment();
  const waiting = threads.filter((t) => t.needs_reply || t.draft);
  const rest = threads.filter((t) => !t.needs_reply && !t.draft);

  if (!threads.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <ObieOrb size={56} />
        <p className="mt-4 font-semibold">No conversations yet</p>
        <p className="mt-1 max-w-xs text-sm text-muted">
          New LinkedIn messages show up here. Tap Sync to pull in recent ones.
        </p>
      </div>
    );
  }

  return (
    <nav aria-label="Conversations" className="pb-[env(safe-area-inset-bottom)]">
      {waiting.length > 0 && <ListHeading>Waiting on you ({waiting.length})</ListHeading>}
      {waiting.map((t) => (
        <ThreadRow key={t.id} thread={t} active={active === t.id} />
      ))}
      {rest.length > 0 && <ListHeading>Everything else</ListHeading>}
      {rest.map((t) => (
        <ThreadRow key={t.id} thread={t} active={active === t.id} />
      ))}
    </nav>
  );
}

function ListHeading({ children }: { children: ReactNode }) {
  return <h2 className="px-4 pt-5 pb-2 text-xs font-bold uppercase tracking-wider text-muted">{children}</h2>;
}

function ThreadRow({ thread, active }: { thread: ThreadItem; active: boolean }) {
  return (
    <Link
      href={`/app/inbox/${thread.id}`}
      aria-current={active ? "page" : undefined}
      className={`mx-2 flex gap-3 rounded-xl px-2 py-3 transition-colors ${active ? "bg-primary-soft" : "hover:bg-surface"}`}
    >
      <Avatar name={thread.contact_name} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className={`truncate ${thread.needs_reply ? "font-bold" : "font-semibold"}`}>
            {thread.contact_name ?? "LinkedIn member"}
          </span>
          {thread.last_message_at && (
            <RelativeTime iso={thread.last_message_at} className="shrink-0 text-xs text-muted" />
          )}
        </span>
        <span className="mt-0.5 block truncate text-sm text-muted">{thread.last_message_preview}</span>
        {thread.draft && (
          <span className="mt-1.5 flex gap-1.5">
            <Pill tone="blue">Reply ready</Pill>
            {thread.draft.needs_owner && <Pill tone="yellow">Needs your input</Pill>}
          </span>
        )}
      </span>
    </Link>
  );
}

export function Pill({ tone, children }: { tone: "blue" | "yellow" | "plain"; children: ReactNode }) {
  const tones = {
    blue: "bg-primary-soft text-primary ring-1 ring-inset ring-primary/20",
    yellow: "bg-accent text-accent-foreground",
    plain: "bg-surface text-muted",
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function Avatar({ name, size = 40 }: { name: string | null; size?: number }) {
  const initials =
    (name ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?";
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary"
    >
      {initials}
    </span>
  );
}

const noSubscribe = () => () => {};

// Times render in the viewer's own time zone, so they're written on the
// client only. The server sends an empty <time> with the exact timestamp.
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const onClient = useSyncExternalStore(noSubscribe, () => true, () => false);
  return (
    <time dateTime={iso} className={className}>
      {onClient ? formatWhen(iso) : null}
    </time>
  );
}

function formatWhen(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const minutes = Math.round((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  const days = (now.getTime() - date.getTime()) / 86_400_000;
  if (days < 6) return date.toLocaleDateString(undefined, { weekday: "short" });
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

export function SyncButton() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-2">
      {error && <span className="hidden text-xs text-muted sm:inline">{error}</span>}
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await syncInbox();
            setError(result.error ?? null);
          })
        }
        className="flex h-9 items-center gap-2 rounded-full border border-border px-3 text-sm font-semibold transition-colors hover:bg-surface disabled:opacity-60"
      >
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden className={pending ? "animate-spin" : undefined}>
          <path
            d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6M16.5 3.5v3.2h-3.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {pending ? "Syncing" : "Sync"}
      </button>
    </div>
  );
}

// Re-renders the page when the server changes an inbox row: a new message, a
// fresh draft, or the LinkedIn account finishing its connection.
export function LiveRefresh({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 300);
    };
    const channel = supabase.channel(`inbox-${workspaceId}`);
    for (const table of ["connected_accounts", "inbox_threads", "reply_drafts"]) {
      channel.on("postgres_changes", { event: "*", schema: "public", table, filter: `workspace_id=eq.${workspaceId}` }, refresh);
    }
    channel.subscribe();
    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [router, workspaceId]);
  return null;
}

// Shown on the connect screen after Unipile sends the owner back.
export function ConnectStatus() {
  const params = useSearchParams();
  if (params.get("connected")) {
    return (
      <div role="status" className="mt-6 flex items-center gap-3 rounded-2xl bg-primary-soft p-4 text-left text-sm">
        <ObieOrb size={32} state="working" />
        <span>LinkedIn is connecting. Your conversations appear here in a few seconds.</span>
      </div>
    );
  }
  if (params.get("connect") === "failed") {
    return (
      <p role="alert" className="mt-6 rounded-2xl bg-surface p-4 text-left text-sm">
        LinkedIn didn&apos;t connect. Try again, and finish any security check LinkedIn asks for.
      </p>
    );
  }
  return null;
}
