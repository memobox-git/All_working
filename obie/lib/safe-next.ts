// Where to send someone after they sign in. Only paths on this site are
// allowed, so a crafted link can't bounce a fresh session to another domain.
export function safeNext(next: string | null | undefined, fallback = "/app") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
