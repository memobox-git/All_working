// Thin fetch helpers for the stackle-base Supabase project. Only public data (RLS allows anonymous reads of
// published courses, their cohorts and weeks) and the two anonymous writes the old site also made:
// the waitlist insert and the career checkout function.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://wvdwisoaotkuyvcyybps.supabase.co";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const hasSupabase = Boolean(SUPABASE_ANON_KEY);

const headers = () => ({ apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` });

export async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { ...headers(), ...(init?.headers ?? {}) } });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

export type WaitlistResult = "joined" | "already" | "error";

export async function joinWaitlist(email: string, source: string): Promise<WaitlistResult> {
  if (!hasSupabase) return "error";
  const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), user_type: "general", first_name: "", last_name: "", referral_source: source }),
  });
  if (res.ok) return "joined";
  if (res.status === 409) return "already";
  try {
    const body = await res.json();
    if (body?.code === "23505") return "already";
  } catch {}
  return "error";
}

// Starts a Stripe Checkout session for the career service. Plans: "monthly" ($250) or "3month" ($499).
export async function startCareerCheckout(plan: "monthly" | "3month"): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/create-resume-checkout`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) throw new Error(data?.error || `Checkout failed (${res.status})`);
  return data.url as string;
}
