import { NextResponse, type NextRequest } from "next/server";
import { BusinessProfileSchema } from "@/lib/business-profile";
import { createClient } from "@/lib/supabase/server";
import { loadWorkspace } from "@/lib/workspace";

// Saves the owner's Business Profile and marks it confirmed.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const ctx = await loadWorkspace(supabase).catch(() => null);
  if (!ctx) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { profile?: unknown } | null;
  const parsed = BusinessProfileSchema.safeParse(body?.profile);
  if (!parsed.success) return NextResponse.json({ error: "Some profile fields look wrong." }, { status: 400 });

  const { error } = await supabase.from("business_profiles").upsert(
    {
      workspace_id: ctx.workspace.workspace_id,
      data: parsed.data,
      confirmed_at: new Date().toISOString(),
    },
    { onConflict: "workspace_id" },
  );
  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Couldn't save the profile. Try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
