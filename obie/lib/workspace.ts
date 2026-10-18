import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// The signed-in owner's workspace. RLS only returns workspaces they own, so a
// row coming back is the ownership check. /app creates the workspace on first
// sign-in, so anyone without one is sent there.
export async function requireWorkspace() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name")
    .order("created_at")
    .limit(1)
    .maybeSingle<{ id: string; name: string }>();
  if (!workspace) redirect("/app");

  return { supabase, workspace, claims: data.claims };
}
