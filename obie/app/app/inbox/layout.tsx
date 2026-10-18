import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ObieOrb } from "@/components/obie-orb";
import { isUnipileConfigured } from "@/lib/unipile";
import { requireWorkspace } from "@/lib/workspace";
import { connectLinkedIn } from "./actions";
import { ConnectStatus, InboxPanes, LiveRefresh, SyncButton, ThreadList, type ThreadItem } from "./ui";

export const metadata: Metadata = { title: "Inbox | OBIE" };

export default function InboxLayout({ children }: LayoutProps<"/app/inbox">) {
  return (
    <div className="flex h-dvh flex-col pt-[env(safe-area-inset-top)]">
      <Suspense fallback={<Opening />}>
        <InboxBody>{children}</InboxBody>
      </Suspense>
    </div>
  );
}

type ThreadRow = Omit<ThreadItem, "draft"> & {
  reply_drafts: { needs_owner: boolean }[];
};

async function InboxBody({ children }: { children: React.ReactNode }) {
  const { supabase, workspace } = await requireWorkspace();
  const { data: account } = await supabase
    .from("connected_accounts")
    .select("display_name")
    .eq("workspace_id", workspace.id)
    .maybeSingle<{ display_name: string | null }>();

  if (!account) {
    return (
      <>
        <LiveRefresh workspaceId={workspace.id} />
        <Header />
        <ConnectScreen />
      </>
    );
  }

  const { data } = await supabase
    .from("inbox_threads")
    .select("id, contact_name, last_message_at, last_message_preview, needs_reply, reply_drafts(needs_owner)")
    .eq("workspace_id", workspace.id)
    .in("reply_drafts.status", ["pending", "sending"])
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(100)
    .returns<ThreadRow[]>();
  const threads: ThreadItem[] = (data ?? []).map(({ reply_drafts, ...thread }) => ({
    ...thread,
    draft: reply_drafts[0] ?? null,
  }));

  return (
    <>
      <LiveRefresh workspaceId={workspace.id} />
      <InboxPanes
        header={<Header accountName={account.display_name} connected />}
        list={<ThreadList threads={threads} />}
      >
        {children}
      </InboxPanes>
    </>
  );
}

function Header({ accountName, connected = false }: { accountName?: string | null; connected?: boolean }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 lg:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <Link href="/app" aria-label="Back to workspace" className="-ml-2 rounded-full p-2 hover:bg-surface">
          <ObieOrb size={24} />
        </Link>
        <h1 className="font-extrabold tracking-tight">Inbox</h1>
        {connected && (
          <span className="truncate text-sm text-muted">
            LinkedIn{accountName ? ` · ${accountName}` : ""}
          </span>
        )}
      </div>
      {connected && (
        <div className="flex shrink-0 items-center gap-1">
          <SyncButton />
          <Link
            href="/app/inbox/settings"
            aria-label="Inbox settings"
            className="flex size-9 items-center justify-center rounded-full hover:bg-surface"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
              <path
                d="M3 6h8m4 0h2M3 14h2m4 0h8M13 4v4M7 12v4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
      )}
    </header>
  );
}

const connectSteps = [
  "Tap Connect LinkedIn and sign in on Unipile's secure page.",
  "OBIE pulls in your recent conversations and drafts replies to the ones waiting on you.",
  "Read each draft, edit it if you like, and tap Send. Nothing goes out until you do.",
];

function ConnectScreen() {
  return (
    <main className="flex flex-1 justify-center overflow-y-auto px-4 py-10">
      <div className="w-full max-w-md">
        <ObieOrb size={64} />
        <h2 className="mt-6 text-2xl font-extrabold tracking-tight">Reply to LinkedIn messages faster</h2>
        <p className="mt-2 leading-relaxed text-muted">
          OBIE&apos;s Inbox agent reads your LinkedIn DMs and drafts each reply in your voice. You approve every
          one.
        </p>

        <ol className="mt-6 space-y-3">
          {connectSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <Suspense>
          <ConnectStatus />
        </Suspense>

        {isUnipileConfigured ? (
          <form action={connectLinkedIn} className="mt-8">
            <button
              type="submit"
              className="h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Connect LinkedIn
            </button>
          </form>
        ) : (
          <p className="mt-8 rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed">
            LinkedIn isn&apos;t set up yet. Add <code className="font-semibold">UNIPILE_DSN</code>,{" "}
            <code className="font-semibold">UNIPILE_API_KEY</code> and{" "}
            <code className="font-semibold">UNIPILE_WEBHOOK_SECRET</code> to Vercel, then redeploy.
          </p>
        )}

        <p className="mt-6 text-xs leading-relaxed text-muted">
          LinkedIn has no official messaging API, so OBIE connects through Unipile. To protect your account,
          OBIE only replies in conversations you already have, and sends at most 60 replies a day.
        </p>
      </div>
    </main>
  );
}

function Opening() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <ObieOrb size={72} state="working" />
      <p className="mt-6 text-muted">Opening your inbox...</p>
    </main>
  );
}
