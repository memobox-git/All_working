import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  // Only this device: signing out on the laptop shouldn't sign out the phone.
  await supabase.auth.signOut({ scope: "local" });
  // 303 so the browser follows with a GET.
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
