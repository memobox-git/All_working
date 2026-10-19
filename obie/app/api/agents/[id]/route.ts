import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Renames an agent. RLS makes sure it belongs to the signed-in owner.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { name?: unknown } | null;
  const name = typeof body?.name === "string" ? body.name.trim().replace(/\s+/g, " ").slice(0, 40) : "";
  if (!name) return NextResponse.json({ error: "Give the agent a name." }, { status: 400 });

  const { data, error } = await supabase
    .from("agents")
    .update({ name })
    .eq("id", id)
    .neq("path", "obie")
    .select("id, name")
    .maybeSingle();
  if (error) return NextResponse.json({ error: "Couldn't rename the agent." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Agent not found." }, { status: 404 });
  return NextResponse.json(data);
}
