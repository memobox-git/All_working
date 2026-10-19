"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AGENT_COLUMNS,
  APPROVAL_COLUMNS,
  CHANNEL_COLUMNS,
  MESSAGE_COLUMNS,
  type Agent,
  type Approval,
  type Channel,
  type Message,
} from "@/lib/chat-types";
import { createClient } from "@/lib/supabase/client";
import { Composer } from "../composer";
import { Avatar } from "./avatar";
import { ApprovalCard, OutputCard, PlanCard, RedoButton, TASK_COLUMNS, type TaskRow } from "./cards";
import { NeedsYou } from "./needs-you";
import { MessageItem } from "./message-item";
import { isPage, PAGE_TITLES, sameView, Sidebar, type View } from "./sidebar";
import { BoardPage, ConnectorsPage, ProfilePage, SettingsPage } from "./pages";
import { StatusPill } from "./status-pill";

export type WorkspaceProps = {
  workspaceId: string;
  workspaceName: string;
  email?: string;
  initialAgents: Agent[];
  initialChannels: Channel[];
  initialApprovals: Approval[];
  initialView: View;
  initialThreadId: string | null;
  initialCredits: CreditBadgeData;
  timezone: string;
};

export type CreditBadgeData = { enabled: boolean; balance: number; dailyLeft: number };

function viewKey(view: View) {
  return view.type === "dm" ? view.agentId : view.type === "channel" ? view.channelId : view.type;
}

function inView(message: Message, view: View) {
  if (view.type === "dm") return message.dm_agent_id === view.agentId;
  if (view.type === "channel") return message.channel_id === view.channelId;
  return false;
}

// The main screen, Slack style: sidebar, conversation, and threads on the
// right (a bottom sheet on the phone). Everything updates live.
export function Workspace(props: WorkspaceProps) {
  const { workspaceId } = props;
  const supabase = useMemo(() => createClient(), []);
  const [agents, setAgents] = useState(props.initialAgents);
  const [channels, setChannels] = useState(props.initialChannels);
  const [approvals, setApprovals] = useState(props.initialApprovals);
  const [view, setView] = useState<View>(props.initialView);
  const [threadId, setThreadId] = useState<string | null>(props.initialThreadId);
  // Messages of the open conversation, tagged with the view they belong to.
  const [loaded, setLoaded] = useState<{ key: string; messages: Message[] } | null>(null);
  const [waiting, setWaiting] = useState<Record<string, boolean>>({});
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [credits, setCredits] = useState(props.initialCredits);
  const [unread, setUnread] = useState<Set<string>>(new Set());
  const [drawer, setDrawer] = useState(false);
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  const key = viewKey(view);
  const loading = !isPage(view) && loaded?.key !== key;
  const messages = useMemo(() => (loaded?.key === key ? loaded.messages : []), [loaded, key]);
  const setMessages = useCallback((update: (list: Message[]) => Message[], forKey?: string) => {
    setLoaded((current) =>
      current && (!forKey || current.key === forKey) ? { key: current.key, messages: update(current.messages) } : current,
    );
  }, []);

  const agentMap = useMemo(() => new Map(agents.map((a) => [a.id, a])), [agents]);
  const pending = approvals.filter((a) => a.status === "pending");

  // Keep the URL in step so a refresh reopens the same place.
  useEffect(() => {
    const params = new URLSearchParams();
    if (view.type === "dm") params.set("dm", view.agentId);
    if (view.type === "channel") params.set("c", view.channelId);
    if (isPage(view)) params.set("view", view.type);
    if (threadId) params.set("t", threadId);
    window.history.replaceState(null, "", `/app?${params}`);
  }, [view, threadId]);

  // Load the open conversation, threads included.
  useEffect(() => {
    if (isPage(view)) return;
    let cancelled = false;
    let query = supabase.from("messages").select(MESSAGE_COLUMNS).order("created_at", { ascending: true }).limit(500);
    query = view.type === "dm" ? query.eq("dm_agent_id", view.agentId) : query.eq("channel_id", view.channelId);
    query.then(({ data }) => {
      if (cancelled) return;
      setLoaded({ key: viewKey(view), messages: (data ?? []) as Message[] });
    });
    if (view.type === "channel") {
      supabase
        .from("tasks")
        .select(TASK_COLUMNS)
        .eq("channel_id", view.channelId)
        .order("created_at", { ascending: true })
        .then(({ data }) => {
          if (!cancelled) setTasks((data ?? []) as TaskRow[]);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [supabase, view]);

  // Live updates.
  useEffect(() => {
    const filter = `workspace_id=eq.${workspaceId}`;
    const channel = supabase
      .channel(`workspace:${workspaceId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter }, ({ new: row }) => {
        const message = row as Message;
        const current = viewRef.current;
        if (inView(message, current)) {
          setMessages(
            (list) => (list.some((m) => m.id === message.id) ? list : [...list, message]),
            viewKey(current),
          );
        } else {
          const key = message.dm_agent_id ?? message.channel_id;
          if (key) setUnread((set) => new Set(set).add(key));
        }
        if (message.author_type === "agent" && message.kind !== "status") {
          const key = message.dm_agent_id ?? message.channel_id;
          if (key) setWaiting((w) => ({ ...w, [key]: false }));
        }
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages", filter }, ({ new: row }) => {
        const message = row as Message;
        setMessages((list) => list.map((m) => (m.id === message.id ? message : m)));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "agents", filter }, ({ eventType, new: row, old }) => {
        if (eventType === "DELETE") setAgents((list) => list.filter((a) => a.id !== (old as Agent).id));
        else
          setAgents((list) => {
            const agent = row as Agent;
            return list.some((a) => a.id === agent.id) ? list.map((a) => (a.id === agent.id ? agent : a)) : [...list, agent];
          });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "channels", filter }, ({ eventType, new: row, old }) => {
        if (eventType === "DELETE") setChannels((list) => list.filter((c) => c.id !== (old as Channel).id));
        else
          setChannels((list) => {
            const c = row as Channel;
            return list.some((x) => x.id === c.id) ? list.map((x) => (x.id === c.id ? c : x)) : [c, ...list];
          });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "credit_ledger", filter }, () => {
        void supabase
          .from("credit_summary")
          .select("balance, daily_left")
          .eq("workspace_id", workspaceId)
          .maybeSingle()
          .then(({ data }) => {
            if (data) setCredits((c) => ({ ...c, balance: Number(data.balance), dailyLeft: Number(data.daily_left) }));
          });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks", filter }, ({ eventType, new: row }) => {
        if (eventType === "DELETE") return;
        const task = row as TaskRow;
        const current = viewRef.current;
        if (current.type !== "channel" || task.channel_id !== current.channelId) return;
        setTasks((list) => (list.some((t) => t.id === task.id) ? list.map((t) => (t.id === task.id ? task : t)) : [...list, task]));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "approvals", filter }, ({ eventType, new: row, old }) => {
        if (eventType === "DELETE") setApprovals((list) => list.filter((a) => a.id !== (old as Approval).id));
        else
          setApprovals((list) => {
            const a = row as Approval;
            return list.some((x) => x.id === a.id) ? list.map((x) => (x.id === a.id ? a : x)) : [a, ...list];
          });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, workspaceId, setMessages]);

  // Daily credits reset at the owner's local midnight: remember their time zone.
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz !== props.timezone) void supabase.from("workspaces").update({ timezone: tz }).eq("id", workspaceId);
  }, [supabase, workspaceId, props.timezone]);

  // Realtime can miss events while a phone sleeps: refresh lists on focus.
  useEffect(() => {
    function refresh() {
      if (document.visibilityState !== "visible") return;
      void Promise.all([
        supabase.from("agents").select(AGENT_COLUMNS).eq("workspace_id", workspaceId),
        supabase.from("channels").select(CHANNEL_COLUMNS).eq("workspace_id", workspaceId).order("created_at", { ascending: false }),
        supabase.from("approvals").select(APPROVAL_COLUMNS).eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(200),
      ]).then(([a, c, ap]) => {
        if (a.data) setAgents(a.data as Agent[]);
        if (c.data) setChannels(c.data as Channel[]);
        if (ap.data) setApprovals(ap.data as Approval[]);
      });
      const current = viewRef.current;
      if (!isPage(current)) {
        let query = supabase.from("messages").select(MESSAGE_COLUMNS).order("created_at", { ascending: true }).limit(500);
        query = current.type === "dm" ? query.eq("dm_agent_id", current.agentId) : query.eq("channel_id", current.channelId);
        void query.then(({ data }) => {
          if (data && sameView(viewRef.current, current)) setLoaded({ key: viewKey(current), messages: data as Message[] });
        });
      }
    }
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, [supabase, workspaceId]);

  const openView = useCallback((next: View) => {
    setView((current) => (sameView(current, next) ? current : next));
    setThreadId(null);
    setDrawer(false);
    setUnread((set) => {
      const copy = new Set(set);
      copy.delete(viewKey(next));
      return copy;
    });
  }, []);

  const send = useCallback(
    async (text: string, inThread: string | null) => {
      const current = viewRef.current;
      if (isPage(current)) return false;
      const key = viewKey(current);
      setWaiting((w) => ({ ...w, [key]: true }));
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            threadId: inThread,
            ...(current.type === "dm" ? { dmAgentId: current.agentId } : { channelId: current.channelId }),
          }),
        });
        const body = (await res.json().catch(() => ({}))) as { messages?: Message[]; error?: string };
        if (!res.ok) throw new Error(body.error ?? "Couldn't send that.");
        setMessages((list) => {
          const ids = new Set(list.map((m) => m.id));
          return [...list, ...(body.messages ?? []).filter((m) => !ids.has(m.id))];
        }, key);
        return true;
      } catch (error) {
        alert(error instanceof Error ? error.message : "Couldn't send that.");
        return false;
      } finally {
        setWaiting((w) => ({ ...w, [key]: false }));
      }
    },
    [setMessages],
  );

  const roots = messages.filter((m) => !m.thread_id);
  const replyCounts = new Map<string, number>();
  for (const m of messages) if (m.thread_id) replyCounts.set(m.thread_id, (replyCounts.get(m.thread_id) ?? 0) + 1);
  const threadRoot = threadId ? messages.find((m) => m.id === threadId) : null;
  const threadReplies = threadId ? messages.filter((m) => m.thread_id === threadId) : [];

  const channelTasks = view.type === "channel" ? tasks.filter((t) => t.channel_id === view.channelId) : [];
  // If tasks sit ready with nothing running (the server-side run ended or
  // never started), nudge the worker. Claims are atomic, so extra nudges are harmless.
  const hasReady = channelTasks.some((t) => t.status === "ready");
  const hasRunning = channelTasks.some((t) => t.status === "running");
  const nudging = useRef(false);
  useEffect(() => {
    if (!hasReady || hasRunning) return;
    const timer = setTimeout(() => {
      if (nudging.current) return;
      nudging.current = true;
      fetch("/api/worker", { method: "POST" })
        .catch(() => undefined)
        .finally(() => {
          nudging.current = false;
        });
    }, 4000);
    return () => clearTimeout(timer);
  }, [hasReady, hasRunning]);

  const renderCard = (m: Message) => {
    if (m.kind === "plan") return <PlanCard message={m} tasks={channelTasks} agents={agentMap} />;
    if (m.kind === "approval") return <ApprovalCard approval={approvals.find((a) => a.id === m.data?.approvalId)} />;
    if (typeof m.data?.output === "string") return <OutputCard text={m.data.output} />;
    const redo = m.data?.redoTaskId ?? (m.data?.status === "failed" ? m.data?.taskId : null);
    if (typeof redo === "string") return <RedoButton taskId={redo} />;
    return null;
  };
  const dmAgent = view.type === "dm" ? agentMap.get(view.agentId) : null;
  const channel = view.type === "channel" ? channels.find((c) => c.id === view.channelId) : null;
  const owner = channel?.owner_agent_id ? agentMap.get(channel.owner_agent_id) : null;
  const isWaiting = !!waiting[key];

  const title =
    isPage(view) ? PAGE_TITLES[view.type] : view.type === "dm" ? (dmAgent?.name ?? "Agent") : `# ${channel?.name ?? "channel"}`;

  const sidebar = (
    <Sidebar
      workspaceName={props.workspaceName}
      agents={agents}
      channels={channels}
      needsCount={pending.length}
      view={view}
      unread={unread}
      onOpen={openView}
      footer={
        <div className="border-t border-border p-3">
          <p className="truncate px-1 text-xs text-muted">{props.email}</p>
          <form action="/auth/signout" method="post" className="mt-2">
            <button type="submit" className="w-full rounded-full border border-border px-3 py-1.5 text-sm font-semibold hover:bg-background">
              Sign out
            </button>
          </form>
        </div>
      }
    />
  );

  return (
    <div className="flex h-dvh overflow-hidden pt-[env(safe-area-inset-top)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">{sidebar}</aside>

      {/* Phone drawer */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-foreground/30" onClick={() => setDrawer(false)} />
          <aside className="drawer-in absolute inset-y-0 left-0 w-[82%] max-w-xs shadow-xl">{sidebar}</aside>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-3 py-2.5 lg:px-5">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawer(true)}
            className="flex size-10 items-center justify-center rounded-full hover:bg-surface lg:hidden"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            {(pending.length > 0 || unread.size > 0) && (
              <span className="absolute mt-[-18px] ml-[18px] size-2.5 rounded-full bg-accent" aria-hidden />
            )}
          </button>
          {dmAgent && <Avatar agent={dmAgent} size={28} obieState={isWaiting || dmAgent.status === "working" ? "working" : "idle"} />}
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-bold">{title}</h1>
            {channel && (
              <p className="truncate text-xs text-muted">
                {owner ? `${owner.name} · ` : ""}
                {channel.goal}
                {channel.deadline ? ` · due ${new Date(channel.deadline).toLocaleDateString([], { month: "short", day: "numeric" })}` : ""}
              </p>
            )}
          </div>
          {dmAgent && dmAgent.status !== "idle" && <StatusPill status={dmAgent.status} />}
          <CreditBadge credits={credits} />
        </header>

        {isPage(view) ? (
          <div className="flex-1 overflow-y-auto">
            {view.type === "needs" && <NeedsYou approvals={approvals} agents={agents} channels={channels} openView={openView} />}
            {view.type === "board" && <BoardPage workspaceId={workspaceId} agents={agentMap} channels={channels} openView={openView} />}
            {view.type === "profile" && <ProfilePage workspaceId={workspaceId} />}
            {view.type === "connectors" && <ConnectorsPage />}
            {view.type === "settings" && <SettingsPage workspaceId={workspaceId} />}
          </div>
        ) : (
          <>
            <MessageList
              key={key}
              loading={loading}
              messages={roots}
              agents={agentMap}
              replyCounts={replyCounts}
              onOpenThread={setThreadId}
              renderCard={renderCard}
              waitingFor={isWaiting ? (dmAgent ?? owner ?? null) : null}
              empty={
                dmAgent ? (
                  <EmptyDm agent={dmAgent} />
                ) : (
                  <p className="p-6 text-center text-muted">Nothing here yet.</p>
                )
              }
            />
            <div className="border-t border-border px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:px-5">
              <Composer
                workspaceId={workspaceId}
                placeholder={dmAgent ? `Message ${dmAgent.name}` : `Message #${channel?.name ?? "channel"}`}
                onSend={(text) => send(text, null)}
                disabled={isWaiting}
              />
            </div>
          </>
        )}
      </main>

      {/* Thread: right pane on desktop, bottom sheet on the phone */}
      {threadRoot && !isPage(view) && (
        <>
          <button
            type="button"
            aria-label="Close thread"
            className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
            onClick={() => setThreadId(null)}
          />
          <aside
            className="sheet-up fixed inset-x-0 bottom-0 z-40 flex h-[85dvh] flex-col rounded-t-2xl bg-background shadow-2xl lg:static lg:z-auto lg:h-auto lg:w-[400px] lg:shrink-0 lg:rounded-none lg:border-l lg:border-border lg:shadow-none"
            aria-label="Thread"
          >
            <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-border lg:hidden" aria-hidden />
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-bold">Thread</h2>
              <button
                type="button"
                onClick={() => setThreadId(null)}
                className="rounded-full px-3 py-1 text-sm font-semibold text-muted hover:bg-surface hover:text-foreground"
              >
                Close
              </button>
            </header>
            <MessageList
              loading={false}
              messages={[threadRoot, ...threadReplies]}
              agents={agentMap}
              replyCounts={new Map()}
              renderCard={renderCard}
              waitingFor={null}
              empty={null}
            />
            <div className="border-t border-border px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              <Composer workspaceId={workspaceId} placeholder="Reply in thread" onSend={(text) => send(text, threadRoot.id)} disabled={isWaiting} />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function MessageList({
  loading,
  messages,
  agents,
  replyCounts,
  onOpenThread,
  renderCard,
  waitingFor,
  empty,
}: {
  loading: boolean;
  messages: Message[];
  agents: Map<string, Agent>;
  replyCounts: Map<string, number>;
  onOpenThread?: (id: string) => void;
  renderCard: (m: Message) => React.ReactNode;
  waitingFor: Agent | null;
  empty: React.ReactNode;
}) {
  const end = useRef<HTMLDivElement>(null);
  const last = messages.at(-1)?.id;
  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [last, waitingFor, loading]);

  return (
    <div className="flex-1 overflow-y-auto py-3">
      {loading ? (
        <p className="p-6 text-center text-muted">Loading...</p>
      ) : messages.length === 0 && !waitingFor ? (
        empty
      ) : (
        <ol>
          {messages.map((m) => (
            <MessageItem
              key={m.id}
              message={m}
              agents={agents}
              replies={replyCounts.get(m.id) ?? 0}
              onOpenThread={onOpenThread ? () => onOpenThread(m.id) : undefined}
              renderCard={renderCard}
            />
          ))}
          {waitingFor && (
            <li className="flex items-center gap-3 px-4 py-2" aria-live="polite">
              <Avatar agent={waitingFor} size={34} obieState="working" />
              <span className="text-sm text-muted">{waitingFor.name} is working on it...</span>
            </li>
          )}
        </ol>
      )}
      <div ref={end} />
    </div>
  );
}

function EmptyDm({ agent }: { agent: Agent }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <Avatar agent={agent} size={64} />
      <p className="mt-4 font-bold">{agent.name}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">
        {agent.path === "obie"
          ? "Ask OBIE anything about your team, or to add an agent or a whole new stack."
          : `Give ${agent.name} a goal with a deadline. It will plan the work in a new channel.`}
      </p>
    </div>
  );
}

function CreditBadge({ credits }: { credits: CreditBadgeData }) {
  if (!credits.enabled) {
    return (
      <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted" title="Credits switch on once the server key is set">
        Credits off
      </span>
    );
  }
  return (
    <span
      className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold tabular-nums"
      title={`${Math.floor(credits.dailyLeft)} of today's daily credits left; they're used first.`}
    >
      {Math.floor(credits.balance).toLocaleString()} credits
      <span className="hidden font-normal text-muted sm:inline"> · {Math.floor(credits.dailyLeft)} daily left</span>
    </span>
  );
}
