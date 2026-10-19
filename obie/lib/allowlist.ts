// OBIE is private for now: only these emails can open /app or call the API,
// so strangers can't spend the owner's AI credits. Set ALLOWED_EMAILS
// (comma separated) to change the list.
const DEFAULT_ALLOWED = ["crispusroshan88@gmail.com", "crispusroshan@gmail.com", "cris@stackle.io"];

export function allowedEmails() {
  const fromEnv = (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_ALLOWED;
}

export function isAllowedEmail(email: unknown) {
  return typeof email === "string" && allowedEmails().includes(email.trim().toLowerCase());
}
