import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

// Unipile doesn't sign its callbacks, so each one carries a shared secret: in
// the notify_url query string for account callbacks, and in the Unipile-Auth
// header for message webhooks.
export function isUnipileSecret(value: string | null) {
  const expected = process.env.UNIPILE_WEBHOOK_SECRET;
  if (!expected || !value) return false;
  const digest = (text: string) => createHash("sha256").update(text).digest();
  return timingSafeEqual(digest(value), digest(expected));
}
