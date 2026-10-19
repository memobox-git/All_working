import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { redirectUrl } from "@/lib/redirect-url";
import { safeNext } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/server";

// Password emails, confirmation links and Google sign-in all land here. A `code` comes from the
// standard flow; `token_hash` comes from an email template that links here
// directly. Either way the session cookie is set, then we open the workspace.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (searchParams.get("error")) {
    return toLogin(request, "provider");
  }

  const supabase = await createClient();
  let failed = true;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = Boolean(error);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    failed = Boolean(error);
  }

  if (failed) {
    return toLogin(request, "link");
  }
  return NextResponse.redirect(redirectUrl(request, next));
}

function toLogin(request: NextRequest, reason: string) {
  return NextResponse.redirect(redirectUrl(request, `/login?error=${reason}`));
}
