"use client";

import { useState, useTransition } from "react";
import { ObieOrb } from "@/components/obie-orb";
import { requestDraft, sendReply, skipReply } from "./actions";
import { Pill } from "./ui";

export type OpenDraft = {
  id: string;
  body: string;
  category: string | null;
  needs_owner: boolean;
  note: string | null;
  status: "pending" | "sending";
  error: string | null;
};

const categoryLabels: Record<string, string> = {
  question: "Question",
  opportunity: "Opportunity",
  networking: "Networking",
  recruiting: "Recruiting",
  sales_pitch: "Sales pitch",
  thanks: "Thanks",
  spam: "Spam",
  other: "Message",
};

const redoIdeas = ["Shorter", "Warmer", "More formal", "Say no politely", "Ask for a call"];

// The approval step. Nothing reaches LinkedIn until the owner taps Send.
export function DraftPanel({
  threadId,
  draft,
  needsReply,
}: {
  threadId: string;
  draft: OpenDraft | null;
  needsReply: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [working, setWorking] = useState<"draft" | "send" | "skip" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(kind: "draft" | "send" | "skip", action: () => Promise<{ error?: string }>) {
    setError(null);
    setWorking(kind);
    startTransition(async () => {
      const result = await action();
      setError(result.error ?? null);
      setWorking(null);
    });
  }

  if (pending && working === "draft") {
    return (
      <Panel>
        <div className="flex items-center gap-3 py-2" role="status">
          <ObieOrb size={32} state="working" />
          <span className="text-sm text-muted">OBIE is writing a reply...</span>
        </div>
      </Panel>
    );
  }

  if (!draft) {
    return (
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {needsReply ? "No reply drafted yet." : "You're all caught up here."}
          </p>
          <button
            type="button"
            onClick={() => run("draft", () => requestDraft(threadId))}
            className={needsReply ? primaryButton : secondaryButton}
          >
            {needsReply ? "Draft a reply" : "Draft a follow-up"}
          </button>
        </div>
        {error && <ErrorLine>{error}</ErrorLine>}
      </Panel>
    );
  }

  return (
    <Panel>
      {/* Remount when the server writes a new draft, so the editor picks it up. */}
      <DraftEditor
        key={`${draft.id}:${draft.body}`}
        threadId={threadId}
        draft={draft}
        busy={pending ? working : draft.status === "sending" ? "send" : null}
        error={error ?? draft.error}
        run={run}
      />
    </Panel>
  );
}

function DraftEditor({
  threadId,
  draft,
  busy,
  error,
  run,
}: {
  threadId: string;
  draft: OpenDraft;
  busy: "draft" | "send" | "skip" | null;
  error: string | null;
  run: (kind: "draft" | "send" | "skip", action: () => Promise<{ error?: string }>) => void;
}) {
  const [body, setBody] = useState(draft.body);
  const [redoOpen, setRedoOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const hasPlaceholder = /\[[^\]]+\]/.test(body);
  const send = () => run("send", () => sendReply(draft.id, body));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">Your reply</span>
        {draft.category && <Pill tone="plain">{categoryLabels[draft.category] ?? "Message"}</Pill>}
        {draft.needs_owner && <Pill tone="yellow">Needs your input</Pill>}
      </div>
      {draft.note && <p className="mt-2 text-sm text-muted">{draft.note}</p>}

      <label htmlFor="reply" className="sr-only">
        Reply
      </label>
      <textarea
        id="reply"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey) && !busy) send();
        }}
        rows={Math.min(10, Math.max(3, body.split("\n").length + 1))}
        disabled={Boolean(busy)}
        className="mt-3 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-base leading-relaxed outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
      />
      {hasPlaceholder && (
        <p className="mt-2 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
          Fill in the parts in [square brackets] before you send.
        </p>
      )}
      {error && <ErrorLine>{error}</ErrorLine>}

      {redoOpen && (
        <form
          className="mt-3 rounded-xl border border-border p-3"
          onSubmit={(event) => {
            event.preventDefault();
            run("draft", () => requestDraft(threadId, instruction));
          }}
        >
          <label htmlFor="redo" className="text-sm font-semibold">
            What should change?
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {redoIdeas.map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => setInstruction(idea)}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition-colors hover:bg-surface"
              >
                {idea}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              id="redo"
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              placeholder="Mention my free 15-minute call"
              className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-background px-3 text-base outline-none focus:border-primary"
            />
            <button type="submit" className={secondaryButton}>
              Redo
            </button>
          </div>
        </form>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={send} disabled={Boolean(busy) || !body.trim()} className={primaryButton}>
          {busy === "send" ? "Sending..." : "Send"}
        </button>
        <button
          type="button"
          onClick={() => setRedoOpen((open) => !open)}
          disabled={Boolean(busy)}
          className={secondaryButton}
        >
          Redo
        </button>
        <button
          type="button"
          onClick={() => run("skip", () => skipReply(draft.id))}
          disabled={Boolean(busy)}
          className="h-11 rounded-full px-4 text-sm font-semibold text-muted transition-colors hover:text-foreground disabled:opacity-60"
        >
          {busy === "skip" ? "Skipping..." : "Skip"}
        </button>
        <span className="ml-auto hidden text-xs text-muted lg:inline">Ctrl or Cmd + Enter to send</span>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-border bg-background px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:px-6">
      {children}
    </div>
  );
}

function ErrorLine({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-3 rounded-xl bg-surface px-3 py-2 text-sm">
      {children}
    </p>
  );
}

const primaryButton =
  "h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60";
const secondaryButton =
  "h-11 rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:bg-surface disabled:opacity-60";
