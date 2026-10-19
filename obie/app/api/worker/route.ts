import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { runWorker } from "@/lib/worker";
import { loadWorkspace } from "@/lib/workspace";

export const maxDuration = 60;

// POST: the signed-in owner's screen nudges the worker for their workspace.
export async function POST() {
  const supabase = await createClient();
  const ctx = await loadWorkspace(supabase).catch(() => null);
  if (!ctx) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const result = await runWorker(supabase, { workspaceId: ctx.workspace.workspace_id, budgetMs: 40_000 });
  return NextResponse.json(result);
}

// GET: the scheduled backup (every minute) runs every workspace's queue.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Not allowed." }, { status: 401 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not set." }, { status: 503 });
  }
  const result = await runWorker(createAdminClient(), { budgetMs: 20_000 });
  return NextResponse.json(result);
}
