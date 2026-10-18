"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useVoiceRecorder, type VoiceState } from "./use-voice-recorder";

// A held press longer than this is hold-to-talk: releasing sends.
const HOLD_MS = 450;

// The message box used everywhere OBIE takes input: text, plus a mic that
// turns speech into editable text.
export function Composer({
  workspaceId,
  placeholder = "Message OBIE",
  onSend,
  onVoiceStateChange,
}: {
  workspaceId: string;
  placeholder?: string;
  onSend: (text: string) => void;
  onVoiceStateChange?: (state: VoiceState) => void;
}) {
  const [text, setText] = useState("");
  const textarea = useRef<HTMLTextAreaElement>(null);
  const pressedAt = useRef(0);

  const voice = useVoiceRecorder({
    workspaceId,
    onTranscript: (transcript) => {
      setText((current) => (current.trim() ? `${current.trimEnd()} ${transcript}` : transcript));
      requestAnimationFrame(() => textarea.current?.focus());
    },
  });

  useEffect(() => {
    onVoiceStateChange?.(voice.state);
  }, [voice.state, onVoiceStateChange]);

  // Grow the box with its content, up to about six lines.
  useEffect(() => {
    const el = textarea.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 168)}px`;
  }, [text]);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const message = text.trim();
    if (!message || voice.state !== "idle") return;
    onSend(message);
    setText("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  // Tap to start, tap to stop. Or hold, then let go to stop.
  function onMicDown() {
    if (voice.state === "recording") {
      voice.finish();
      return;
    }
    pressedAt.current = Date.now();
    void voice.start();
  }
  function onMicUp() {
    if (voice.state === "recording" && Date.now() - pressedAt.current > HOLD_MS) voice.finish();
  }

  const recording = voice.state === "recording";
  const working = voice.state === "working";

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={`flex items-end gap-2 rounded-2xl border bg-background p-2 transition-colors ${
          recording ? "border-primary ring-2 ring-primary/20" : "border-border"
        }`}
      >
        <button
          type="button"
          aria-label={recording ? "Stop and turn into text" : "Talk instead of typing"}
          aria-pressed={recording}
          disabled={working}
          onPointerDown={onMicDown}
          onPointerUp={onMicUp}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (recording) voice.finish();
              else void voice.start();
            }
          }}
          className={`flex size-11 shrink-0 touch-none select-none items-center justify-center rounded-full transition-colors disabled:opacity-50 ${
            recording
              ? "bg-primary text-primary-foreground"
              : "bg-surface text-foreground hover:bg-primary-soft"
          }`}
        >
          {recording ? <StopIcon /> : <MicIcon />}
        </button>

        {recording ? (
          <div className="flex min-h-11 flex-1 items-center justify-between gap-3 px-1" aria-live="polite">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <span className="size-2 animate-pulse rounded-full bg-primary" aria-hidden />
              Listening {formatTime(voice.seconds)}
            </span>
            <button
              type="button"
              onClick={voice.cancel}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        ) : (
          <textarea
            ref={textarea}
            rows={1}
            value={text}
            disabled={working}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={working ? "Turning your voice into text..." : placeholder}
            className="max-h-42 min-h-11 flex-1 resize-none bg-transparent px-1 py-2.5 text-base leading-6 outline-none placeholder:text-muted disabled:opacity-60"
          />
        )}

        {!recording && (
          <button
            type="submit"
            aria-label="Send"
            disabled={!text.trim() || working}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover disabled:bg-surface disabled:text-muted"
          >
            <SendIcon />
          </button>
        )}
      </div>

      <p className="mt-2 min-h-5 px-2 text-xs text-muted" aria-live="polite">
        {voice.error ??
          (recording
            ? "Tap the square to finish. If you're holding, just let go."
            : "Tap the mic to talk, or hold it down while you speak.")}
      </p>
    </form>
  );
}

function formatTime(total: number) {
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
