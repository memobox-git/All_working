import { NextResponse, type NextRequest } from "next/server";
import { CustomStackSchema } from "@/lib/custom-stack";
import { createClient } from "@/lib/supabase/server";
import { buildAgents, loadBlueprints, stackKey } from "@/lib/team";
import { loadWorkspace } from "@/lib/workspace";

// Saves a custom stack OBIE designed as the workspace's own blueprints
// (is_custom = true), then builds its agents.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const ctx = await loadWorkspace(supabase).catch(() => null);
  if (!ctx) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const workspaceId = ctx.workspace.workspace_id;
  const userId = ctx.claims.sub;

  const body = (await request.json().catch(() => null)) as { design?: unknown } | null;
  const parsed = CustomStackSchema.safeParse(body?.design);
  if (!parsed.success || !parsed.data.subagents.length) {
    return NextResponse.json({ error: "That stack design looks incomplete." }, { status: 400 });
  }
  const design = parsed.data;

  let stack = stackKey(design.name);
  const { data: taken } = await supabase.from("blueprints").select("stack").eq("stack", stack).limit(1);
  const { data: takenAgent } = await supabase
    .from("agents")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("path", stack)
    .limit(1);
  if (taken?.length || takenAgent?.length) stack = `${stack}_${Date.now().toString(36).slice(-4)}`;

  try {
    const { data: main, error: mainError } = await supabase
      .from("blueprints")
      .insert({
        workspace_id: workspaceId,
        is_custom: true,
        created_by: userId,
        pack: "Custom",
        stack,
        role: design.main.role.slice(0, 40),
        level: "main",
        description: design.main.does,
        default_model: "claude-sonnet-5-5",
        sort_order: 100,
      })
      .select("id")
      .single();
    if (mainError) throw mainError;

    const { data: subs, error: subsError } = await supabase
      .from("blueprints")
      .insert(
        design.subagents.slice(0, 5).map((sub, i) => ({
          workspace_id: workspaceId,
          is_custom: true,
          created_by: userId,
          pack: "Custom",
          stack,
          role: sub.role.slice(0, 40),
          level: "sub",
          parent_id: main.id,
          description: sub.does,
          tools: [{ needs: sub.needs }],
          default_model: "claude-sonnet-5-5",
          sort_order: 101 + i,
        })),
      )
      .select("id");
    if (subsError) throw subsError;

    const blueprints = await loadBlueprints(supabase);
    const agents = await buildAgents(
      supabase,
      workspaceId,
      [main.id, ...subs.map((s) => s.id)],
      blueprints,
    );
    return NextResponse.json({ agents });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Couldn't build that stack. Try again." }, { status: 500 });
  }
}
