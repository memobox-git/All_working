import type { JwtPayload } from "@supabase/supabase-js";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ObieDesk } from "@/components/obie-desk";
import { ObieOrb } from "@/components/obie-orb";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "OBIE" };

type Workspace = { workspace_id: string; workspace_name: string; created: boolean };

export default function AppHome() {
  return (
    <div className="flex min-h-dvh flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <Suspense fallback={<Opening />}>
        <WorkspaceHome />
      </Suspense>
    </div>
  );
}

async function WorkspaceHome() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login");

  const firstName = firstNameOf(claims);
  // First sign-in creates the workspace and OBIE; later sign-ins just open it.
  const { data: workspace, error } = await supabase
    .rpc("ensure_my_workspace", {
      default_name: firstName ? `${firstName}'s workspace` : "My workspace",
    })
    .single<Workspace>();

  if (error || !workspace) {
    return (
      <Centered>
        <ObieOrb size={72} />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">OBIE couldn&apos;t open your workspace</h1>
        <p className="mt-2 max-w-sm text-muted">Refresh the page to try again.</p>
        {error && <p className="mt-4 text-xs text-muted">{error.message}</p>}
      </Centered>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 lg:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <ObieOrb size={28} />
          <span className="font-extrabold tracking-tight">OBIE</span>
          <span className="text-muted">/</span>
          <span className="truncate font-semibold">{workspace.workspace_name}</span>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden text-sm text-muted sm:inline">{claims.email}</span>
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

      <Centered>
        <ObieDesk
          workspaceId={workspace.workspace_id}
          title={workspace.created ? "Welcome to OBIE" : "Welcome back"}
          greeting={`${firstName ? `Hi ${firstName}. ` : "Hi. "}I'm OBIE, your front desk. I'll learn your business, then build your team.`}
        />
        <Link href="/" className="mt-6 text-sm font-semibold text-primary">
          Back to home
        </Link>
      </Centered>
    </>
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
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      {children}
    </main>
  );
}

function firstNameOf(claims: JwtPayload): string | null {
  const meta = claims.user_metadata ?? {};
  const full = (meta.full_name ?? meta.name ?? "") as string;
  const first = full.trim().split(/\s+/)[0];
  return first || null;
}
