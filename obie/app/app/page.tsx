import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ObieDesk } from "@/components/obie-desk";
import { ObieOrb } from "@/components/obie-orb";
import { OnboardingChat, type ChatMessage } from "@/components/onboarding-chat";
import { toProfile } from "@/lib/business-profile";
import { OBIE_GREETING } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/server";
import { firstNameOf, loadWorkspace, type WorkspaceContext } from "@/lib/workspace";

export const metadata: Metadata = { title: "OBIE" };

export default function AppHome() {
  return (
    <div className="flex min-h-dvh flex-col pt-[env(safe-area-inset-top)]">
      <Suspense fallback={<Opening />}>
        <WorkspaceHome />
      </Suspense>
    </div>
  );
}

async function WorkspaceHome() {
  const supabase = await createClient();
  let ctx: WorkspaceContext | null;
  try {
    ctx = await loadWorkspace(supabase);
  } catch (error) {
    return (
      <Centered>
        <ObieOrb size={72} />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">OBIE couldn&apos;t open your workspace</h1>
        <p className="mt-2 max-w-sm text-muted">Refresh the page to try again.</p>
        <p className="mt-4 text-xs text-muted">{error instanceof Error ? error.message : null}</p>
      </Centered>
    );
  }
  if (!ctx) redirect("/login");
  const { claims, workspace, obieId } = ctx;

  const { data: profileRow } = await supabase
    .from("business_profiles")
    .select("data, confirmed_at")
    .eq("workspace_id", workspace.workspace_id)
    .maybeSingle();

  const header = <Header workspaceName={workspace.workspace_name} email={claims.email} />;

  if (!profileRow?.confirmed_at) {
    const { data: rows } = await supabase
      .from("messages")
      .select("id, author_type, body, data")
      .eq("dm_agent_id", obieId)
      .is("thread_id", null)
      .order("created_at", { ascending: true })
      .limit(200);
    const messages: ChatMessage[] = (rows ?? []).map((row) => ({
      id: row.id,
      role: row.author_type === "user" ? "user" : "obie",
      body: row.body,
    }));
    const lastObie = [...(rows ?? [])].reverse().find((row) => row.author_type === "agent");
    const draft = lastObie?.data?.ready ? toProfile(lastObie.data.profile) : null;

    return (
      <>
        {header}
        <OnboardingChat
          workspaceId={workspace.workspace_id}
          greeting={OBIE_GREETING}
          initialMessages={messages}
          initialProfile={draft}
        />
      </>
    );
  }

  const firstName = firstNameOf(claims);
  return (
    <>
      {header}
      <Centered>
        <ObieDesk
          workspaceId={workspace.workspace_id}
          title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          greeting="Your Business Profile is saved. Next, I'll recommend your team."
        />
      </Centered>
    </>
  );
}

function Header({ workspaceName, email }: { workspaceName: string; email?: string }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 lg:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <ObieOrb size={28} />
        <span className="font-extrabold tracking-tight">OBIE</span>
        <span className="text-muted">/</span>
        <span className="truncate font-semibold">{workspaceName}</span>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className="hidden text-sm text-muted sm:inline">{email}</span>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}

function Opening() {
  return (
    <Centered>
      <ObieOrb size={96} state="working" />
      <p className="mt-6 text-muted">Opening your workspace...</p>
    </Centered>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">{children}</main>
  );
}
