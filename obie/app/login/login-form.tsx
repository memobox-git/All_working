"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { safeNext } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

const linkErrors: Record<string, string> = {
  link: "That sign-in link expired or was already used. Send yourself a new one.",
  provider: "Google sign-in didn't finish. Try again, or use your email.",
};

type GoogleState = "checking" | "on" | "off";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const supabase = useMemo(() => (isSupabaseConfigured ? createClient() : null), []);

  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(
    linkErrors[searchParams.get("error") ?? ""] ?? null,
  );
  const [google, setGoogle] = useState<GoogleState>("checking");

  // Ask Supabase whether Google sign-in is switched on, so the button never
  // leads to a dead end.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetch(`${supabaseUrl}/auth/v1/settings`, { headers: { apikey: supabaseAnonKey } })
      .then((res) => res.json())
      .then((settings) => setGoogle(settings?.external?.google ? "on" : "off"))
      .catch(() => setGoogle("off"));
  }, []);

  if (!supabase) {
    return (
      <p className="mt-8 rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed">
        Sign-in isn&apos;t connected yet. Add the Supabase keys from{" "}
        <code className="font-semibold">.env.example</code> to Vercel, then redeploy.
      </p>
    );
  }

  const callbackUrl = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function sendLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setSending(true);
    setError(null);
    const address = email.trim();
    const { error } = await supabase.auth.signInWithOtp({
      email: address,
      options: { emailRedirectTo: callbackUrl() },
    });
    setSending(false);
    if (error) {
      setError(
        error.status === 429
          ? "Too many sign-in emails in a short time. Wait a minute, then try again."
          : error.message,
      );
      return;
    }
    setSentTo(address);
  }

  async function continueWithGoogle() {
    if (!supabase) return;
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl() },
    });
    if (error) setError(error.message);
  }

  if (sentTo) {
    return (
      <div className="mt-8 rounded-2xl border border-border bg-surface p-5" role="status">
        <p className="font-semibold">Check your email</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We sent a sign-in link to <span className="font-semibold text-foreground">{sentTo}</span>.
          Open it on this device, in this browser.
        </p>
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="mt-4 text-sm font-semibold text-primary"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={google !== "on"}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-background font-semibold transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
      >
        <GoogleMark />
        Continue with Google
      </button>
      {google === "off" && (
        <p className="mt-2 text-center text-xs text-muted">
          Google sign-in isn&apos;t switched on yet. Use your email for now.
        </p>
      )}

      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={sendLink} className="space-y-3">
        <label htmlFor="email" className="block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@business.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={sending}
          className="h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {sending ? "Sending..." : "Email me a sign-in link"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-surface p-3 text-sm leading-relaxed">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
