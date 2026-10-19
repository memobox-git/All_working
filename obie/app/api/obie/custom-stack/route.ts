import { NextResponse, type NextRequest } from "next/server";
import { AiNotConfiguredError } from "@/lib/ai";
import { designStack } from "@/lib/custom-stack";
import { createClient } from "@/lib/supabase/server";
import { loadWorkspace } from "@/lib/workspace";

// OBIE designs a custom stack from the owner's request. Nothing is saved
// until the owner taps Build.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const ctx = await loadWorkspace(supabase).catch(() => null);
  if (!ctx) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { request?: unknown } | null;
  const ask = typeof body?.request === "string" ? body.request.trim().slice(0, 2000) : "";
  if (!ask) return NextResponse.json({ error: "Tell OBIE what the stack should do." }, { status: 400 });

  try {
    const design = await designStack(supabase, { workspaceId: ctx.workspace.workspace_id, obieId: ctx.obieId }, ask);
    return NextResponse.json({ design });
  } catch (error) {
    if (error instanceof AiNotConfiguredError) return NextResponse.json({ error: error.message }, { status: 503 });
    console.error(error);
    return NextResponse.json({ error: "OBIE couldn't design that stack. Try again." }, { status: 502 });
  }
}
