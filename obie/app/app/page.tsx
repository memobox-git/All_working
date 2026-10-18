import type { JwtPayload } from "@supabase/supabase-js";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
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
        <ObieOrb size={132} float />
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {workspace.created ? "Welcome to OBIE" : "Welcome back"}
        </h1>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-muted">
          {firstName ? `Hi ${firstName}. ` : "Hi. "}
          I&apos;m OBIE, your front desk. I&apos;ll learn your business, then build your team.
        </p>
        <Link
          href="/app/inbox"
          className="mt-8 flex w-full max-w-sm items-center gap-4 rounded-2xl border border-border p-4 text-left transition-colors hover:bg-surface"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-bold">Inbox</span>
            <span className="mt-0.5 block text-sm text-muted">
              LinkedIn messages with a reply drafted in your voice. You approve each one.
            </span>
          </span>
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden className="shrink-0 text-muted">
            <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <p className="mt-4 max-w-sm rounded-2xl bg-surface px-4 py-2.5 text-sm text-muted">
          OBIE&apos;s onboarding chat arrives in the next build step.
        </p>
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
