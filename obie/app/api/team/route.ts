import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildAgents, loadBlueprints } from "@/lib/team";
import { loadWorkspace } from "@/lib/workspace";

// Builds the owner's team from the blueprints they switched on.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const ctx = await loadWorkspace(supabase).catch(() => null);
  if (!ctx) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { blueprintIds?: unknown } | null;
  const ids = Array.isArray(body?.blueprintIds)
    ? body.blueprintIds.filter((id): id is string => typeof id === "string").slice(0, 200)
    : [];
  if (!ids.length) return NextResponse.json({ error: "Switch on at least one agent." }, { status: 400 });

  try {
    const blueprints = await loadBlueprints(supabase);
    const agents = await buildAgents(supabase, ctx.workspace.workspace_id, ids, blueprints);
    return NextResponse.json({ agents });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Couldn't build the team. Try again." }, { status: 500 });
  }
}
