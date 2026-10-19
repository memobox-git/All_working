"use client";

import { useState } from "react";
import type { Agent, Message } from "@/lib/chat-types";
import { AgentOrb } from "../agent-orb";
import type { CustomStackDesign } from "../custom-stack-designer";
import { Avatar } from "./avatar";
import { StatusPill } from "./status-pill";

export type MessageExtras = {
  replies?: number;
  onOpenThread?: () => void;
};

// One message: avatar, author, time and a body that depends on its kind.
// Plan and approval cards plug in through `renderCard`.
export function MessageItem({
  message,
  agents,
  replies = 0,
  onOpenThread,
  renderCard,
}: {
  message: Message;
  agents: Map<string, Agent>;
  renderCard?: (message: Message) => React.ReactNode;
} & MessageExtras) {
  const agent = message.author_agent_id ? agents.get(message.author_agent_id) : null;
  const nano = typeof message.data?.nano === "string" ? (message.data.nano as string) : null;
  const author = message.author_type === "user" ? "You" : nano ? `${nano}` : (agent?.name ?? "Agent");
  const card = renderCard?.(message);

  return (
    <li className="group flex gap-3 px-4 py-2 hover:bg-surface/60">
      <Avatar agent={message.author_type === "user" ? null : agent} nano={!!nano} size={nano ? 24 : 34} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-bold">{author}</span>
          {nano && agent && <span className="text-xs text-muted">nano agent for {agent.name}</span>}
          <time className="text-xs text-muted" dateTime={message.created_at}>
            {formatTime(message.created_at)}
          </time>
          {message.kind === "status" && typeof message.data?.status === "string" && (
            <StatusPill status={message.data.status as string} />
          )}
        </p>
        {message.body && (
          <p className={`mt-0.5 whitespace-pre-wrap break-words leading-relaxed ${message.kind === "status" ? "text-sm text-muted" : ""}`}>
            {message.body}
          </p>
        )}
        {card}
        {Array.isArray(message.data?.addedAgents) && (message.data.addedAgents as unknown[]).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {(message.data.addedAgents as { id: string; name: string }[]).map((a) => (
              <span key={a.id} className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold">
                <AgentOrb name={a.name} size={18} variant="sub" /> Added {a.name}
              </span>
            ))}
          </div>
        )}
        {message.data?.customStack ? <StackDesignCard design={message.data.customStack as CustomStackDesign} /> : null}
        {onOpenThread && (replies > 0 || message.kind === "plan") && (
          <button
            type="button"
            onClick={onOpenThread}
            className="mt-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {replies > 0 ? `${replies} ${replies === 1 ? "reply" : "replies"}` : "Open thread"}
          </button>
        )}
      </div>
      {onOpenThread && replies === 0 && message.kind !== "plan" && (
        <button
          type="button"
          onClick={onOpenThread}
          className="h-fit shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-muted opacity-0 hover:bg-surface hover:text-foreground focus:opacity-100 group-hover:opacity-100"
        >
          Reply
        </button>
      )}
    </li>
  );
}

function StackDesignCard({ design }: { design: CustomStackDesign }) {
  const [state, setState] = useState<"idle" | "building" | "built" | "error">("idle");

  async function build() {
    setState("building");
    const res = await fetch("/api/team/custom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ design }),
    });
    setState(res.ok ? "built" : "error");
  }

  return (
    <div className="mt-2 max-w-lg rounded-xl border border-border bg-background p-3">
      {design.overlap && (
        <p className="mb-3 rounded-lg border border-accent px-3 py-2 text-sm">
          Overlaps with <strong className="capitalize">{design.overlap.stack}</strong>. {design.overlap.suggestion}
        </p>
      )}
      <div className="flex items-center gap-2">
        <AgentOrb name={design.main.role} size={30} />
        <div>
          <p className="font-bold">{design.name}</p>
          <p className="text-sm text-muted">{design.summary}</p>
        </div>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {design.subagents.map((s) => (
          <li key={s.role}>
            <span className="font-semibold">{s.role}:</span> {s.does} <span className="text-muted">Needs {s.needs}.</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={state === "building" || state === "built"}
        onClick={build}
        className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {state === "built" ? "Built" : state === "building" ? "Building..." : design.overlap ? "Build it anyway" : "Build"}
      </button>
      {state === "error" && <span className="ml-3 text-sm text-muted">Couldn&apos;t build it. Try again.</span>}
    </div>
  );
}

export function formatTime(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return sameDay ? time : `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}
