import "server-only";
import type { JwtPayload, SupabaseClient } from "@supabase/supabase-js";

export type Workspace = { workspace_id: string; workspace_name: string; created: boolean };

export type WorkspaceContext = {
  claims: JwtPayload;
  workspace: Workspace;
  obieId: string;
};

// The signed-in user's workspace and OBIE. First sign-in creates both.
// Returns null when signed out; throws when the workspace can't be opened.
export async function loadWorkspace(supabase: SupabaseClient): Promise<WorkspaceContext | null> {
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const firstName = firstNameOf(claims);
  const { data: workspace, error } = await supabase
    .rpc("ensure_my_workspace", {
      default_name: firstName ? `${firstName}'s workspace` : "My workspace",
    })
    .single<Workspace>();
  if (error || !workspace) throw new Error(error?.message ?? "Workspace not found");

  const { data: obie, error: obieError } = await supabase
    .from("agents")
    .select("id")
    .eq("workspace_id", workspace.workspace_id)
    .eq("path", "obie")
    .single();
  if (obieError || !obie) throw new Error(obieError?.message ?? "OBIE not found");

  return { claims, workspace, obieId: obie.id };
}

export function firstNameOf(claims: JwtPayload): string | null {
  const meta = claims.user_metadata ?? {};
  const full = (meta.full_name ?? meta.name ?? "") as string;
  const first = full.trim().split(/\s+/)[0];
  return first || null;
}
