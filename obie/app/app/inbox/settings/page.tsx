import Link from "next/link";
import { Suspense } from "react";
import { requireWorkspace } from "@/lib/workspace";
import { DisconnectButton, ReplyGuideForm } from "./forms";

export default function InboxSettings() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <Settings />
    </Suspense>
  );
}

async function Settings() {
  const { supabase, workspace } = await requireWorkspace();
  const { data: account } = await supabase
    .from("connected_accounts")
    .select("display_name, reply_guide")
    .eq("workspace_id", workspace.id)
    .maybeSingle<{ display_name: string | null; reply_guide: string }>();
  if (!account) return null;

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
        <h2 className="font-bold">Inbox settings</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:px-6">
        <div className="max-w-xl space-y-10">
          <section>
            <h3 className="text-lg font-bold">How OBIE writes your replies</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              OBIE copies your tone from messages you&apos;ve already sent. Add what it can&apos;t learn from them:
              what you offer, links to share, what to say no to.
            </p>
            <ReplyGuideForm initial={account.reply_guide} />
          </section>

          <section>
            <h3 className="text-lg font-bold">LinkedIn</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Account</dt>
                <dd className="font-semibold">{account.display_name ?? "Connected"}</dd>
              </div>
            </dl>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
              <li>Every reply waits for you to tap Send.</li>
              <li>OBIE sends at most 60 replies a day, to protect your account.</li>
              <li>Replies you send from the LinkedIn app clear the draft here.</li>
            </ul>
            <DisconnectButton />
          </section>
        </div>
      </div>
    </>
  );
}
