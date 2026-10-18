"use client";

import { useCallback, useState } from "react";
import { Composer } from "./composer";
import { ObieOrb, type ObieState } from "./obie-orb";
import type { VoiceState } from "./use-voice-recorder";

const orbState: Record<VoiceState, ObieState> = {
  idle: "idle",
  recording: "listening",
  working: "working",
};

// The workspace home: OBIE's orb, a greeting and the message box. The orb
// listens while the mic records and works while the recording becomes text.
export function ObieDesk({
  workspaceId,
  title,
  greeting,
}: {
  workspaceId: string;
  title: string;
  greeting: string;
}) {
  const [voice, setVoice] = useState<VoiceState>("idle");
  const [sent, setSent] = useState<string | null>(null);
  const onVoiceStateChange = useCallback((state: VoiceState) => setVoice(state), []);

  return (
    <div className="flex w-full max-w-xl flex-col items-center">
      <ObieOrb size={132} float={voice === "idle"} state={orbState[voice]} />
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-md text-lg leading-relaxed text-muted">{greeting}</p>

      <div className="mt-10 w-full text-left">
        {sent && (
          <div className="mb-4 space-y-2" aria-live="polite">
            <p className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground">
              {sent}
            </p>
            <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-surface px-4 py-2.5 text-sm text-muted">
              Got it. OBIE&apos;s replies arrive in the next build step (Prompt 5).
            </p>
          </div>
        )}
        <Composer workspaceId={workspaceId} onSend={setSent} onVoiceStateChange={onVoiceStateChange} />
      </div>
    </div>
  );
}
