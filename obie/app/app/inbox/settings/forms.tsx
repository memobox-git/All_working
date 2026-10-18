"use client";

import { useState, useTransition } from "react";
import { disconnectLinkedIn, saveReplyGuide } from "../actions";

const example = `For example:
I run a 12-week program for people moving into data engineering.
- Anyone asking how to join: send them [your apply link].
- I don't take freelance projects. Say no kindly.
- Offer a free 15-minute call to people with serious questions: [your booking link]
- Keep it friendly and short. Sign off with my first name.`;

export function ReplyGuideForm({ initial }: { initial: string }) {
  const [guide, setGuide] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          await saveReplyGuide(guide);
          setSaved(true);
        });
      }}
    >
      <label htmlFor="guide" className="sr-only">
        Reply guide
      </label>
      <textarea
        id="guide"
        value={guide}
        onChange={(event) => {
          setGuide(event.target.value);
          setSaved(false);
        }}
        rows={8}
        maxLength={4000}
        placeholder={example}
        className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-base leading-relaxed outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        {saved && (
          <span role="status" className="text-sm text-muted">
            Saved. New drafts follow it.
          </span>
        )}
      </div>
    </form>
  );
}

export function DisconnectButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Disconnect LinkedIn? OBIE deletes the conversations and drafts it saved.")) return;
        startTransition(() => disconnectLinkedIn());
      }}
      className="mt-6 h-11 rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:bg-surface disabled:opacity-60"
    >
      {pending ? "Disconnecting..." : "Disconnect LinkedIn"}
    </button>
  );
}
