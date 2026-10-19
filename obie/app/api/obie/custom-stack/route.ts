import { NextResponse, type NextRequest } from "next/server";
import { AiNotConfiguredError, structuredCall } from "@/lib/ai";
import { toProfile } from "@/lib/business-profile";
import { CUSTOM_STACK_SYSTEM, CustomStackSchema } from "@/lib/custom-stack";
import { createClient } from "@/lib/supabase/server";
import { loadWorkspace } from "@/lib/workspace";

// OBIE designs a custom stack from the owner's request. Nothing is saved
// until the owner taps Build.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const ctx = await loadWorkspace(supabase).catch(() => null);
  if (!ctx) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const workspaceId = ctx.workspace.workspace_id;

  const body = (await request.json().catch(() => null)) as { request?: unknown } | null;
  const ask = typeof body?.request === "string" ? body.request.trim().slice(0, 2000) : "";
  if (!ask) return NextResponse.json({ error: "Tell OBIE what the stack should do." }, { status: 400 });

  const [{ data: profileRow }, { data: blueprints }, { data: agents }] = await Promise.all([
    supabase.from("business_profiles").select("data").eq("workspace_id", workspaceId).maybeSingle(),
    supabase.from("blueprints").select("stack, role, level, parent_id").neq("stack", "obie"),
    supabase.from("agents").select("stack, name, level").eq("workspace_id", workspaceId),
  ]);

  const stacks = new Map<string, Set<string>>();
  for (const b of blueprints ?? []) {
    if (!stacks.has(b.stack)) stacks.set(b.stack, new Set());
    if (b.level !== "main") stacks.get(b.stack)!.add(b.role);
  }
  for (const a of agents ?? []) {
    if (a.stack === "obie") continue;
    if (!stacks.has(a.stack)) stacks.set(a.stack, new Set());
    if (a.level !== "main") stacks.get(a.stack)!.add(a.name);
  }
  const stackList = [...stacks].map(([stack, roles]) => `- ${stack}: ${[...roles].join(", ")}`).join("\n");

  try {
    const { data } = await structuredCall({
      run: { workspaceId, agentId: ctx.obieId, path: "obie" },
      system: CUSTOM_STACK_SYSTEM,
      messages: [
        {
          role: "user",
          content: `<existing_stacks>\n${stackList}\n</existing_stacks>\n<business_profile>${JSON.stringify(
            toProfile(profileRow?.data),
          )}</business_profile>\n\nThe owner asks: ${ask}`,
        },
      ],
      schema: CustomStackSchema,
      effort: "medium",
    });
    return NextResponse.json({ design: data });
  } catch (error) {
    if (error instanceof AiNotConfiguredError) return NextResponse.json({ error: error.message }, { status: 503 });
    console.error(error);
    return NextResponse.json({ error: "OBIE couldn't design that stack. Try again." }, { status: 502 });
  }
}
