"use client";

import { useState, type FormEvent } from "react";
import { TALK_CHANNELS, type BusinessProfile } from "@/lib/business-profile";

type TextField = Exclude<keyof BusinessProfile, "talk_channels" | "hours_per_week">;

const FIELDS: { key: TextField; label: string; long?: boolean }[] = [
  { key: "business_name", label: "Business name" },
  { key: "offer", label: "What you sell", long: true },
  { key: "price", label: "Price" },
  { key: "buyers", label: "Who buys it", long: true },
  { key: "found_via", label: "Where customers find you", long: true },
  { key: "goal", label: "Your goal", long: true },
  { key: "goal_deadline", label: "By when" },
  { key: "time_sinks", label: "What eats your time", long: true },
  { key: "website", label: "Website or LinkedIn" },
  { key: "summary", label: "Summary", long: true },
];

// The Business Profile as an editable card. Used at the end of onboarding and
// on the Profile page.
export function ProfileCard({
  initial,
  title = "Your Business Profile",
  submitLabel = "Looks right, save it",
  onSaved,
}: {
  initial: BusinessProfile;
  title?: string;
  submitLabel?: string;
  onSaved?: () => void;
}) {
  const [profile, setProfile] = useState<BusinessProfile>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function set<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setMessage(null);
  }

  function toggleChannel(channel: (typeof TALK_CHANNELS)[number]) {
    const has = profile.talk_channels.includes(channel);
    set("talk_channels", has ? profile.talk_channels.filter((c) => c !== channel) : [...profile.talk_channels, channel]);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Couldn't save the profile.");
      setMessage("Saved.");
      onSaved?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Couldn't save the profile.");
    } finally {
      setSaving(false);
    }
  }

  const input =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <form onSubmit={save} className="w-full rounded-2xl border border-border bg-surface p-4 text-left sm:p-6">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted">Fix anything that&apos;s off, then save.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label, long }) => (
          <label key={key} className={`block ${long ? "sm:col-span-2" : ""}`}>
            <span className="mb-1.5 block text-sm font-semibold">{label}</span>
            {long ? (
              <textarea
                rows={2}
                value={profile[key] ?? ""}
                onChange={(event) => set(key, event.target.value || null)}
                className={`${input} resize-y`}
              />
            ) : (
              <input
                value={profile[key] ?? ""}
                onChange={(event) => set(key, event.target.value || null)}
                className={input}
              />
            )}
          </label>
        ))}

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Hours a week</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={168}
            value={profile.hours_per_week ?? ""}
            onChange={(event) => set("hours_per_week", event.target.value === "" ? null : Number(event.target.value))}
            className={input}
          />
        </label>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-semibold">Where you talk to customers</legend>
          <div className="flex flex-wrap gap-2">
            {TALK_CHANNELS.map((channel) => {
              const on = profile.talk_channels.includes(channel);
              return (
                <button
                  key={channel}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleChannel(channel)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-primary-soft"
                  }`}
                >
                  {channel}
                </button>
              );
            })}
          </div>
          {profile.talk_channels.includes("Other") && (
            <input
              placeholder="Where else?"
              value={profile.talk_channels_other ?? ""}
              onChange={(event) => set("talk_channels_other", event.target.value || null)}
              className={`${input} mt-3`}
            />
          )}
        </fieldset>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        {message && (
          <span className="text-sm text-muted" aria-live="polite">
            {message}
          </span>
        )}
      </div>
    </form>
  );
}
