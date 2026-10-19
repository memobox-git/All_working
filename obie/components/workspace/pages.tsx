"use client";

import { useEffect, useMemo, useState } from "react";
import { toProfile, type BusinessProfile } from "@/lib/business-profile";
import { pillFor, type Agent, type Channel, type Pill } from "@/lib/chat-types";
import { createClient } from "@/lib/supabase/client";
import type { View } from "@/lib/views";
import { AgentOrb } from "../agent-orb";
import { ProfileCard } from "../profile-card";
import { StatusPill } from "./status-pill";

// ---------- Board ----------

type BoardTask = {
  id: string;
  title: string;
  status: string;
  deadline: string | null;
  depends_on: string[];
  channel_id: string | null;
  agent_id: string | null;
};

const COLUMNS: Pill[] = ["Waiting", "Working", "Stuck", "Done"];

// Every task across all channels: deadline, status and what it's waiting on.
export function BoardPage({
  workspaceId,
  agents,
  channels,
  openView,
}: {
  workspaceId: string;
  agents: Map<string, Agent>;
  channels: Channel[];
  openView: (view: View) => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [tasks, setTasks] = useState<BoardTask[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      supabase
        .from("tasks")
        .select("id, title, status, deadline, depends_on, channel_id, agent_id")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(500)
        .then(({ data }) => {
          if (!cancelled) setTasks((data ?? []) as BoardTask[]);
        });
    void load();
    const channel = supabase
      .channel(`board:${workspaceId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks", filter: `workspace_id=eq.${workspaceId}` }, () => void load())
      .subscribe();
    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [supabase, workspaceId]);

  const live = new Set(channels.filter((c) => c.status !== "archived").map((c) => c.id));
  const visible = (tasks ?? []).filter((t) => !t.channel_id || live.has(t.channel_id));
  const titles = new Map((tasks ?? []).map((t) => [t.id, t]));
  const channelName = (id: string | null) => channels.find((c) => c.id === id)?.name;

  if (tasks === null) return <p className="p-6 text-center text-muted">Loading...</p>;
  if (!visible.length) {
    return (
      <p className="m-6 rounded-2xl bg-surface px-4 py-8 text-center text-muted">
        No tasks yet. DM a main agent with a goal and its plan shows up here.
      </p>
    );
  }

  return (
    <div className="grid gap-4 p-4 lg:grid-cols-4 lg:p-5">
      {COLUMNS.map((column) => {
        const items = visible.filter((t) => pillFor(t.status) === column);
        return (
          <section key={column} className="min-w-0 rounded-2xl bg-surface p-3">
            <h2 className="flex items-center justify-between px-1 pb-2 text-sm font-bold">
              {column}
              <span className="text-xs font-semibold text-muted">{items.length}</span>
            </h2>
            <ul className="space-y-2">
              {items.map((task) => {
                const agent = task.agent_id ? agents.get(task.agent_id) : null;
                const waitingOn = task.depends_on
                  .map((d) => titles.get(d))
                  .filter((d): d is BoardTask => !!d && d.status !== "done");
                const late = task.deadline && task.status !== "done" && new Date(task.deadline) < new Date();
                return (
                  <li key={task.id} className="rounded-xl border border-border bg-background p-3 text-sm">
                    <div className="flex items-start gap-2">
                      {agent && <AgentOrb name={agent.name} size={22} variant="sub" />}
                      <p className="min-w-0 flex-1 font-semibold">{task.title}</p>
                      <StatusPill status={task.status} />
                    </div>
                    <p className="mt-1.5 text-xs text-muted">
                      {task.channel_id && (
                        <button
                          type="button"
                          className="font-semibold hover:text-foreground"
                          onClick={() => openView({ type: "channel", channelId: task.channel_id! })}
                        >
                          #{channelName(task.channel_id) ?? "channel"}
                        </button>
                      )}
                      {task.deadline && (
                        <span className={late ? "font-semibold text-foreground" : ""}>
                          {" "}
                          · due {new Date(task.deadline).toLocaleDateString([], { month: "short", day: "numeric" })}
                          {late ? " (late)" : ""}
                        </span>
                      )}
                    </p>
                    {waitingOn.length > 0 && (
                      <p className="mt-1 text-xs text-muted">Waiting on: {waitingOn.map((w) => w.title).join(", ")}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// ---------- Profile ----------

export function ProfilePage({ workspaceId }: { workspaceId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    supabase
      .from("business_profiles")
      .select("data")
      .eq("workspace_id", workspaceId)
      .maybeSingle()
      .then(({ data }) => setProfile(toProfile(data?.data)));
  }, [supabase, workspaceId]);

  if (!profile) return <p className="p-6 text-center text-muted">Loading...</p>;
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <p className="mb-4 text-sm text-muted">Your agents read this before every plan. Keep it current.</p>
      <ProfileCard initial={profile} submitLabel="Save changes" />
    </div>
  );
}

// ---------- Connectors ----------

const CONNECTORS = [
  {
    name: "Google Calendar",
    does: "Lets Booking and Scheduling see your free time and draft invites.",
    steps: ["Sign in with Google", "Pick the calendars OBIE can see", "Choose your working hours"],
  },
  {
    name: "Gmail (send)",
    does: "Sends the emails you approve, from your own address.",
    steps: ["Sign in with Google", "Allow sending only", "Every email still waits for your approval"],
  },
  {
    name: "Google Drive",
    does: "Saves drafts, worksheets and materials into a folder you choose.",
    steps: ["Sign in with Google", "Pick or create an OBIE folder"],
  },
  {
    name: "Slack",
    does: "Posts approved updates to your community or team channels.",
    steps: ["Add the OBIE app to your Slack", "Pick the channels it can post in"],
  },
  {
    name: "WhatsApp",
    does: "Drafts replies to customer messages for you to approve.",
    steps: ["Connect a WhatsApp Business number", "Choose which chats OBIE can read"],
  },
  {
    name: "LinkedIn",
    does: "Publishes the posts you approve and reads comments to reply to.",
    steps: ["Sign in with LinkedIn", "Allow posting on your behalf", "Every post waits for your approval"],
  },
  {
    name: "Stripe",
    does: "Lets Payments track invoices, payments and refunds.",
    steps: ["Sign in to Stripe", "Allow read access to payments"],
  },
];

// Setup cards: steps, a connect button and a status. All coming soon on Day 1.
export function ConnectorsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <p className="mb-5 text-sm text-muted">
        Connectors let agents act in your tools. Anything sent, posted or paid for always waits for your approval.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {CONNECTORS.map((c) => (
          <li key={c.name} className="flex flex-col rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold">{c.name}</h2>
              <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted">Coming soon</span>
            </div>
            <p className="mt-1 text-sm text-muted">{c.does}</p>
            <ol className="mt-3 flex-1 space-y-1.5 text-sm">
              {c.steps.map((step, i) => (
                <li key={step} className="flex gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted">Status: not connected</span>
              <button
                type="button"
                disabled
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-50"
              >
                Connect
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Settings ----------

type Settings = {
  runtime: "cloud" | "local";
  default_deadline_days: number;
  approval_mode: "draft_only";
  notify_approvals: boolean;
  notify_done: boolean;
};

const DEFAULTS: Settings = {
  runtime: "cloud",
  default_deadline_days: 7,
  approval_mode: "draft_only",
  notify_approvals: true,
  notify_done: true,
};

export function SettingsPage({ workspaceId }: { workspaceId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [meta, setMeta] = useState<{ timezone: string; daily: number } | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("workspaces")
      .select("settings, timezone, daily_credits")
      .eq("id", workspaceId)
      .single()
      .then(({ data }) => {
        setSettings({ ...DEFAULTS, ...((data?.settings as Partial<Settings>) ?? {}) });
        setMeta({ timezone: data?.timezone ?? "UTC", daily: data?.daily_credits ?? 100 });
      });
  }, [supabase, workspaceId]);

  async function save(next: Settings) {
    setSettings(next);
    setStatus("Saving...");
    const { error } = await supabase.from("workspaces").update({ settings: next }).eq("id", workspaceId);
    setStatus(error ? "Couldn't save. Try again." : "Saved");
  }

  if (!settings || !meta) return <p className="p-6 text-center text-muted">Loading...</p>;

  const row = "flex flex-wrap items-center justify-between gap-3 border-b border-border py-4 last:border-0";
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="rounded-2xl border border-border bg-background px-4">
        <div className={row}>
          <div>
            <p className="font-semibold">Where agents run</p>
            <p className="text-sm text-muted">Local (on your own computer) comes later.</p>
          </div>
          <div className="flex rounded-full bg-surface p-1 text-sm font-semibold">
            <span className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground">Cloud</span>
            <span className="px-3 py-1.5 text-muted" title="Coming later">
              Local
            </span>
          </div>
        </div>

        <label className={row}>
          <div>
            <p className="font-semibold">Default deadline</p>
            <p className="text-sm text-muted">Used when you don&apos;t give one.</p>
          </div>
          <span className="flex items-center gap-2 text-sm">
            <input
              type="number"
              min={1}
              max={90}
              inputMode="numeric"
              value={settings.default_deadline_days}
              onChange={(e) => setSettings({ ...settings, default_deadline_days: Number(e.target.value) })}
              onBlur={() =>
                save({ ...settings, default_deadline_days: Math.min(90, Math.max(1, Math.round(settings.default_deadline_days || 7))) })
              }
              className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-base outline-none focus:border-primary"
            />
            days
          </span>
        </label>

        <div className={row}>
          <div>
            <p className="font-semibold">Approval mode</p>
            <p className="text-sm text-muted">Agents draft everything; you approve before anything goes out.</p>
          </div>
          <span className="rounded-full bg-primary-soft px-3 py-1.5 text-sm font-semibold text-primary">Draft only</span>
        </div>

        <ToggleRow
          className={row}
          label="Tell me when something needs approval"
          on={settings.notify_approvals}
          onChange={(v) => save({ ...settings, notify_approvals: v })}
        />
        <ToggleRow
          className={row}
          label="Tell me when a goal is done"
          on={settings.notify_done}
          onChange={(v) => save({ ...settings, notify_done: v })}
        />

        <div className={row}>
          <div>
            <p className="font-semibold">Daily credits</p>
            <p className="text-sm text-muted">Reset at midnight, {meta.timezone} time. Used before your other credits.</p>
          </div>
          <span className="text-sm font-bold tabular-nums">{meta.daily.toLocaleString()} a day</span>
        </div>
      </div>
      {status && (
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {status}
        </p>
      )}
    </div>
  );
}

function ToggleRow({ className, label, on, onChange }: { className: string; label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={className}>
      <p className="font-semibold">{label}</p>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-primary" : "bg-border"}`}
      >
        <span className={`absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
