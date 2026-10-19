import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Blueprint } from "./recommender";

export type AgentRow = {
  id: string;
  name: string;
  stack: string;
  level: "main" | "sub" | "nano";
  path: string;
  parent_id: string | null;
  blueprint_id: string | null;
};

export const BLUEPRINT_COLUMNS = "id, slug, parent_id, stack, role, level, description, is_custom, sort_order";
const AGENT_COLUMNS = "id, name, stack, level, path, parent_id, blueprint_id";

export async function loadBlueprints(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("blueprints").select(BLUEPRINT_COLUMNS).order("sort_order");
  if (error) throw error;
  return data as Blueprint[];
}

// Turns a stack name into a safe ltree label: "Podcast Studio" -> podcast_studio.
export function stackKey(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40) || "custom"
  );
}

// Creates agents for the chosen blueprints, with paths like sales, sales.1 and
// sales.1.2. Safe to call again: blueprints that already have an agent are
// skipped, and new subagents take the next free number.
export async function buildAgents(
  supabase: SupabaseClient,
  workspaceId: string,
  chosenIds: string[],
  blueprints: Blueprint[],
): Promise<AgentRow[]> {
  const byId = new Map(blueprints.map((b) => [b.id, b]));
  const chosen = new Set(chosenIds.filter((id) => byId.has(id)));

  // A chosen subagent brings its parents along.
  for (const id of [...chosen]) {
    let parent = byId.get(id)?.parent_id;
    while (parent) {
      chosen.add(parent);
      parent = byId.get(parent)?.parent_id ?? null;
    }
  }

  const { data: existingRows, error } = await supabase
    .from("agents")
    .select(AGENT_COLUMNS)
    .eq("workspace_id", workspaceId);
  if (error) throw error;
  const existing = existingRows as AgentRow[];
  const agentFor = new Map(existing.filter((a) => a.blueprint_id).map((a) => [a.blueprint_id!, a]));
  const created: AgentRow[] = [];

  const depthOf = (b: Blueprint) => (b.parent_id ? (byId.get(b.parent_id)?.parent_id ? 2 : 1) : 0);
  for (const depth of [0, 1, 2]) {
    const level = [...chosen]
      .map((id) => byId.get(id)!)
      .filter((b) => depthOf(b) === depth && !agentFor.has(b.id))
      .sort((a, b) => a.sort_order - b.sort_order);
    if (!level.length) continue;

    const rows = [];
    const nextChild = new Map<string, number>();
    for (const b of level) {
      let path: string;
      let parentId: string | null = null;
      if (depth === 0) {
        const key = stackKey(b.stack);
        const same = existing.find((a) => a.path === key);
        if (same) {
          // The stack already has a main agent: hang the new subagents under it.
          agentFor.set(b.id, same);
          continue;
        }
        path = key;
      } else {
        const parent = agentFor.get(b.parent_id!);
        if (!parent) continue;
        parentId = parent.id;
        if (!nextChild.has(parent.id)) {
          const used = [...existing, ...created]
            .filter((a) => a.parent_id === parent.id)
            .map((a) => Number(a.path.split(".").pop()))
            .filter(Number.isFinite);
          nextChild.set(parent.id, Math.max(0, ...used) + 1);
        }
        const n = nextChild.get(parent.id)!;
        nextChild.set(parent.id, n + 1);
        path = `${parent.path}.${n}`;
      }
      rows.push({
        workspace_id: workspaceId,
        blueprint_id: b.id,
        name: b.role,
        stack: stackKey(b.stack),
        level: b.level,
        parent_id: parentId,
        path,
      });
    }
    if (!rows.length) continue;

    const { data, error: insertError } = await supabase.from("agents").insert(rows).select(AGENT_COLUMNS);
    if (insertError) throw insertError;
    for (const agent of data as AgentRow[]) {
      created.push(agent);
      if (agent.blueprint_id) agentFor.set(agent.blueprint_id, agent);
    }
  }

  // Catalog order (Sales, Marketing, ...), then by path within a stack.
  const stackOrder = new Map(
    blueprints.filter((b) => b.level === "main").map((b) => [stackKey(b.stack), b.sort_order]),
  );
  return created.sort(
    (a, b) =>
      (stackOrder.get(a.stack) ?? 999) - (stackOrder.get(b.stack) ?? 999) ||
      a.path.localeCompare(b.path, undefined, { numeric: true }),
  );
}
