"use client";

import type { Agent, Channel } from "@/lib/chat-types";
import { Avatar } from "./avatar";
import { StatusPill } from "./status-pill";

export type View = { type: "dm"; agentId: string } | { type: "channel"; channelId: string } | { type: "needs" };

export function sameView(a: View, b: View) {
  if (a.type !== b.type) return false;
  if (a.type === "dm" && b.type === "dm") return a.agentId === b.agentId;
  if (a.type === "channel" && b.type === "channel") return a.channelId === b.channelId;
  return true;
}

const STACK_ORDER = ["sales", "marketing", "customers", "product", "operations"];
// Default stacks in their usual order, custom stacks after them.
function stackRank(stack: string) {
  const i = STACK_ORDER.indexOf(stack);
  return i === -1 ? STACK_ORDER.length : i;
}

// Needs you, then Agents (OBIE pinned, then main agents only), then Channels.
export function Sidebar({
  workspaceName,
  agents,
  channels,
  needsCount,
  view,
  unread,
  onOpen,
  footer,
}: {
  workspaceName: string;
  agents: Agent[];
  channels: Channel[];
  needsCount: number;
  view: View;
  unread: Set<string>;
  onOpen: (view: View) => void;
  footer?: React.ReactNode;
}) {
  const obie = agents.find((a) => a.path === "obie");
  const mains = agents
    .filter((a) => a.level === "main" && a.path !== "obie")
    .sort((a, b) => stackRank(a.stack) - stackRank(b.stack) || a.name.localeCompare(b.name));
  const visibleChannels = channels.filter((c) => c.status !== "archived");
  const item = (active: boolean) =>
    `flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[15px] transition-colors ${
      active ? "bg-primary text-primary-foreground" : "hover:bg-background"
    }`;

  return (
    <nav className="flex h-full flex-col bg-surface" aria-label="Workspace">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <span className="font-extrabold tracking-tight">OBIE</span>
        <span className="text-muted">/</span>
        <span className="truncate font-semibold">{workspaceName}</span>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-2 pb-4">
        <button type="button" onClick={() => onOpen({ type: "needs" })} className={item(view.type === "needs")}>
          <span className="flex size-6 items-center justify-center" aria-hidden>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6ZM10 19a2 2 0 0 0 4 0" />
            </svg>
          </span>
          <span className="flex-1 font-semibold">Needs you</span>
          {needsCount > 0 && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">{needsCount}</span>
          )}
        </button>

        <div>
          <h2 className="px-2.5 pb-1 text-xs font-semibold tracking-wide text-muted uppercase">Agents</h2>
          <ul className="space-y-0.5">
            {[obie, ...mains].filter(Boolean).map((agent) => {
              const a = agent!;
              const active = view.type === "dm" && view.agentId === a.id;
              return (
                <li key={a.id}>
                  <button type="button" onClick={() => onOpen({ type: "dm", agentId: a.id })} className={item(active)}>
                    <Avatar agent={a} size={24} obieState={a.status === "working" ? "working" : "idle"} />
                    <span className={`min-w-0 flex-1 truncate ${unread.has(a.id) ? "font-bold" : ""}`}>{a.name}</span>
                    {a.status !== "idle" && !active && <StatusPill status={a.status} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className="px-2.5 pb-1 text-xs font-semibold tracking-wide text-muted uppercase">Channels</h2>
          {visibleChannels.length === 0 ? (
            <p className="px-2.5 text-sm text-muted">DM a main agent with a goal and it opens a channel for it.</p>
          ) : (
            <ul className="space-y-0.5">
              {visibleChannels.map((c) => {
                const active = view.type === "channel" && view.channelId === c.id;
                return (
                  <li key={c.id}>
                    <button type="button" onClick={() => onOpen({ type: "channel", channelId: c.id })} className={item(active)}>
                      <span className={`w-6 text-center ${active ? "" : "text-muted"}`} aria-hidden>
                        #
                      </span>
                      <span className={`min-w-0 flex-1 truncate ${unread.has(c.id) ? "font-bold" : ""}`}>{c.name}</span>
                      {c.status === "done" && !active && <StatusPill status="done" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      {footer}
    </nav>
  );
}
