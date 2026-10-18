import type { NextRequest } from "next/server";

// Absolute URL for a redirect from a route handler, on the host the visitor
// actually used. Behind Netlify, request.url can be the deploy's own
// permalink host, and a redirect there would drop the session cookie.
export function redirectUrl(request: NextRequest, path: string) {
  const host = request.headers.get("x-forwarded-host");
  if (!host) return new URL(path, request.url);
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return new URL(path, `${proto}://${host}`);
}
