import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ObieOrb } from "@/components/obie-orb";
import { OnboardingChat, type ChatMessage } from "@/components/onboarding-chat";
import { TeamBuilder, type TeamRow, type TeamStack } from "@/components/team-builder";
import { PAGES, type PageType, type View } from "@/lib/views";
import { Workspace } from "@/components/workspace/workspace";
import { toProfile } from "@/lib/business-profile";
import {
  AGENT_COLUMNS,
  APPROVAL_COLUMNS,
  CHANNEL_COLUMNS,
  type Agent,
  type Approval,
  type Channel,
} from "@/lib/chat-types";
import { OBIE_GREETING } from "@/lib/onboarding";
import { recommendTeam, type Pick } from "@/lib/recommender";
import { createClient } from "@/lib/supabase/server";
import { creditSummary } from "@/lib/credits-server";
import { loadBlueprints } from "@/lib/team";
import { loadWorkspace, type WorkspaceContext } from "@/lib/workspace";

export const metadata: Metadata = { title: "OBIE" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function AppHome({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh flex-col">
          <Opening />
        </div>
      }
    >
      <WorkspaceHome searchParams={searchParams} />
    </Suspense>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col pt-[env(safe-area-inset-top)]">{children}</div>;
}

async function WorkspaceHome({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient();
  let ctx: WorkspaceContext | null;
  try {
    ctx = await loadWorkspace(supabase);
  } catch (error) {
    return (
      <Page>
      <Centered>
        <ObieOrb size={72} />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">OBIE couldn&apos;t open your workspace</h1>
        <p className="mt-2 max-w-sm text-muted">Refresh the page to try again.</p>
        <p className="mt-4 text-xs text-muted">{error instanceof Error ? error.message : null}</p>
      </Centered>
      </Page>
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
      <Page>
        {header}
        <OnboardingChat
          workspaceId={workspace.workspace_id}
          greeting={OBIE_GREETING}
          initialMessages={messages}
          initialProfile={draft}
        />
      </Page>
    );
  }

  const { count: teamSize } = await supabase
    .from("agents")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspace.workspace_id)
    .neq("path", "obie");

  if (!teamSize) {
    const { stacks, suggestions } = recommendTeam(toProfile(profileRow.data), await loadBlueprints(supabase));
    const row = (p: Pick): TeamRow => ({
      id: p.blueprint.id,
      parentId: p.blueprint.parent_id,
      role: p.blueprint.role,
      reason: p.reason,
      credits: p.weeklyCredits,
      depth: p.depth,
      on: p.on,
    });
    const teamStacks: TeamStack[] = stacks.map((s) => ({
      stack: s.stack,
      title: s.title,
      main: row(s.main),
      agents: s.agents.map(row),
    }));
    return (
      <Page>
        {header}
        <TeamBuilder stacks={teamStacks} suggestions={suggestions} />
      </Page>
    );
  }

  const params = await searchParams;
  const one = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : null);
  const [{ data: agents }, { data: channels }, { data: approvals }, credits, { data: wsRow }] = await Promise.all([
    supabase.from("agents").select(AGENT_COLUMNS).eq("workspace_id", workspace.workspace_id),
    supabase
      .from("channels")
      .select(CHANNEL_COLUMNS)
      .eq("workspace_id", workspace.workspace_id)
      .order("created_at", { ascending: false }),
    supabase
      .from("approvals")
      .select(APPROVAL_COLUMNS)
      .eq("workspace_id", workspace.workspace_id)
      .order("created_at", { ascending: false })
      .limit(200),
    creditSummary(supabase, workspace.workspace_id),
    supabase.from("workspaces").select("timezone").eq("id", workspace.workspace_id).maybeSingle(),
  ]);
  const agentList = (agents ?? []) as Agent[];
  const channelList = (channels ?? []) as Channel[];
  const dm = one("dm");
  const c = one("c");
  const initialView: View =
    (PAGES as readonly string[]).includes(one("view") ?? "")
      ? { type: one("view") as PageType }
      : c && channelList.some((x) => x.id === c)
        ? { type: "channel", channelId: c }
        : dm && agentList.some((a) => a.id === dm && a.level === "main")
          ? { type: "dm", agentId: dm }
          : { type: "dm", agentId: obieId };

  return (
    <Workspace
      workspaceId={workspace.workspace_id}
      workspaceName={workspace.workspace_name}
      email={claims.email}
      initialAgents={agentList}
      initialChannels={channelList}
      initialApprovals={(approvals ?? []) as Approval[]}
      initialView={initialView}
      initialThreadId={one("t")}
      initialCredits={{ enabled: credits.enabled, balance: credits.balance, dailyLeft: credits.dailyLeft }}
      timezone={wsRow?.timezone ?? "UTC"}
    />
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
