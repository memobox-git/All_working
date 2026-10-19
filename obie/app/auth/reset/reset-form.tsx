"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function ResetForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setError(
        error.message.includes("session")
          ? "This link has expired. Go back to sign in and ask for a new password email."
          : error.message,
      );
      return;
    }
    router.replace("/app");
  }

  return (
    <form onSubmit={save} className="mt-8 space-y-3">
      <label htmlFor="new-password" className="block text-sm font-semibold">
        New password
      </label>
      <input
        id="new-password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <p className="text-xs text-muted">At least 8 characters.</p>
      <button
        type="submit"
        disabled={saving || password.length < 8}
        className="h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save password"}
      </button>
      {error && (
        <p role="alert" className="rounded-xl bg-surface p-3 text-sm leading-relaxed">
          {error}
        </p>
      )}
    </form>
  );
}
