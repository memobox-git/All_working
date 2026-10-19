"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { safeNext } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

const linkErrors: Record<string, string> = {
  link: "That email link expired, or it was opened in a different browser from the one you asked in. Ask for a new one here.",
  provider: "Google sign-in didn't finish. Try again, or use your email.",
};

type GoogleState = "checking" | "on" | "off";
type Mode = "signin" | "signup" | "reset";

const TITLES: Record<Mode, string> = {
  signin: "Sign in",
  signup: "Create account",
  reset: "Email me a password link",
};

// Email and password, plus Google when it's switched on. "Set or reset
// password" emails a link for accounts made before passwords existed.
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const supabase = useMemo(() => (isSupabaseConfigured ? createClient() : null), []);

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(linkErrors[searchParams.get("error") ?? ""] ?? null);
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
        <code className="font-semibold">.env.example</code> to the site, then redeploy.
      </p>
    );
  }

  const callbackUrl = (to: string) => `${window.location.origin}/auth/callback?next=${encodeURIComponent(to)}`;

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    const address = email.trim();
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: address, password });
        if (error) {
          throw new Error(
            error.message.toLowerCase().includes("invalid")
              ? "That email and password don't match. New here? Create an account. Signed in before with an email link? Set a password first."
              : error.message,
          );
        }
        router.replace(next);
        router.refresh();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: address,
          password,
          options: { emailRedirectTo: callbackUrl(next) },
        });
        if (error) {
          throw new Error(
            error.message.toLowerCase().includes("registered")
              ? "There's already an account with that email. Sign in, or set a password if you used an email link before."
              : error.message,
          );
        }
        if (data.session) {
          router.replace(next);
          router.refresh();
        } else {
          setNotice(`Check ${address} to confirm your account, then sign in.`);
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(address, {
          redirectTo: callbackUrl("/auth/reset"),
        });
        if (error) throw new Error(error.status === 429 ? "Too many emails in a short time. Wait a minute, then try again." : error.message);
        setNotice(`We sent a link to ${address}. Open it in this browser to set your password.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function continueWithGoogle() {
    if (!supabase) return;
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl(next) },
    });
    if (error) setError(error.message);
  }

  const input =
    "h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="mt-8">
      {mode !== "reset" && (
        <div className="mb-6 grid grid-cols-2 rounded-full bg-surface p-1 text-sm font-semibold" role="tablist">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={`rounded-full py-2 transition-colors ${mode === m ? "bg-background shadow-sm" : "text-muted"}`}
            >
              {TITLES[m]}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
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
          className={input}
        />
        {mode !== "reset" && (
          <>
            <label htmlFor="password" className="block pt-1 text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={mode === "signup" ? 8 : undefined}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={input}
            />
            {mode === "signup" && <p className="text-xs text-muted">At least 8 characters.</p>}
          </>
        )}
        <button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {busy ? "One moment..." : TITLES[mode]}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        {mode === "reset" ? (
          <button type="button" onClick={() => switchMode("signin")} className="font-semibold text-primary">
            Back to sign in
          </button>
        ) : (
          <button type="button" onClick={() => switchMode("reset")} className="font-semibold text-primary">
            Set or reset password
          </button>
        )}
      </div>

      {notice && (
        <p role="status" className="mt-4 rounded-xl bg-primary-soft p-3 text-sm leading-relaxed">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-surface p-3 text-sm leading-relaxed">
          {error}
        </p>
      )}

      {google === "on" && mode !== "reset" && (
        <>
          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          <button
            type="button"
            onClick={continueWithGoogle}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-background font-semibold transition-colors hover:bg-surface"
          >
            <GoogleMark />
            Continue with Google
          </button>
        </>
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
