import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

// Refreshes the Supabase session cookie on every request, so Server Components
// always see a valid session.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const noCacheHeaders: Record<string, string> = {};

  // Until Supabase keys are set (Day 1 deploy), let every request through.
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        Object.assign(noCacheHeaders, headers);
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Responses that set auth cookies must never be cached by a CDN.
        for (const [key, value] of Object.entries(noCacheHeaders)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // Don't put code between createServerClient and getClaims: getClaims is what
  // refreshes an expired session.
  await supabase.auth.getClaims();

  return response;
}
