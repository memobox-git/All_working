import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

// Pages that need a signed-in user.
const protectedPrefix = "/app";

// Refreshes the Supabase session cookie on every request, so Server Components
// always see a valid session, and keeps signed-out visitors out of /app.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const noCacheHeaders: Record<string, string> = {};
  const path = request.nextUrl.pathname;
  const isProtected = path === protectedPrefix || path.startsWith(`${protectedPrefix}/`);

  // Until Supabase keys are set, nobody can sign in, so /app goes to /login,
  // which explains what is missing.
  if (!isSupabaseConfigured) {
    return isProtected ? redirectTo(request, "/login") : response;
  }

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
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);

  if (!signedIn && isProtected) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", path + request.nextUrl.search);
    return carryCookies(response, NextResponse.redirect(login), noCacheHeaders);
  }
  if (signedIn && path === "/login") {
    return carryCookies(response, NextResponse.redirect(new URL("/app", request.url)), noCacheHeaders);
  }

  return response;
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

// A redirect must keep any refreshed session cookies, or the user is signed out.
function carryCookies(from: NextResponse, to: NextResponse, headers: Record<string, string>) {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie);
  }
  for (const [key, value] of Object.entries(headers)) {
    to.headers.set(key, value);
  }
  return to;
}
