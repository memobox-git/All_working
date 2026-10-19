"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BusinessProfile } from "@/lib/business-profile";
import { Composer } from "./composer";
import { ObieOrb, type ObieState } from "./obie-orb";
import { ProfileCard } from "./profile-card";
import type { VoiceState } from "./use-voice-recorder";

export type ChatMessage = { id: string; role: "user" | "obie"; body: string };

// OBIE's onboarding: a full-screen chat, voice or text, that ends with the
// Business Profile card.
export function OnboardingChat({
  workspaceId,
  greeting,
  initialMessages,
  initialProfile,
}: {
  workspaceId: string;
  greeting: string;
  initialMessages: ChatMessage[];
  initialProfile: BusinessProfile | null;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages.length ? initialMessages : [{ id: "greeting", role: "obie", body: greeting }],
  );
  const [profile, setProfile] = useState<BusinessProfile | null>(initialProfile);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voice, setVoice] = useState<VoiceState>("idle");
  const onVoiceStateChange = useCallback((state: VoiceState) => setVoice(state), []);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking, profile]);

  async function send(text: string) {
    setError(null);
    const id = crypto.randomUUID();
    setMessages((current) => [...current, { id, role: "user", body: text }]);
    setThinking(true);
    try {
      const res = await fetch("/api/obie/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        reply?: string;
        profile?: BusinessProfile;
        ready?: boolean;
        error?: string;
      };
      if (!res.ok || !body.reply) throw new Error(body.error ?? "OBIE didn't answer. Try again.");
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "obie", body: body.reply! }]);
      if (body.ready && body.profile) setProfile(body.profile);
      return true;
    } catch (err) {
      // Nothing was saved: take the message back out and return it to the box.
      setMessages((current) => current.filter((message) => message.id !== id));
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      return false;
    } finally {
      setThinking(false);
    }
  }

  const orb: ObieState = voice === "recording" ? "listening" : thinking || voice === "working" ? "working" : "idle";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4">
      <div className="flex flex-col items-center pt-6 pb-4 text-center">
        <ObieOrb size={72} state={orb} />
        <p className="mt-3 text-sm font-semibold text-muted">Getting to know your business</p>
      </div>

      <ol className="flex-1 space-y-3 pb-4" aria-live="polite">
        {messages.map((message) => (
          <li key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <p
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 leading-relaxed ${
                message.role === "user"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md bg-surface text-foreground"
              }`}
            >
              {message.body}
            </p>
          </li>
        ))}
        {thinking && (
          <li className="flex justify-start">
            <p className="rounded-2xl rounded-bl-md bg-surface px-4 py-2.5 text-muted">
              <span className="sr-only">OBIE is thinking</span>
              <span className="inline-flex gap-1" aria-hidden>
                <span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted" />
              </span>
            </p>
          </li>
        )}
      </ol>

      {profile && (
        <div className="pb-4">
          <ProfileCard key={JSON.stringify(profile)} initial={profile} onSaved={() => router.refresh()} />
        </div>
      )}

      {error && (
        <p className="mb-2 rounded-xl bg-surface px-3 py-2 text-sm text-foreground" role="alert">
          {error}
        </p>
      )}

      <div ref={bottom} className="sticky bottom-0 bg-background pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Composer
          workspaceId={workspaceId}
          placeholder={profile ? "Anything to change? Tell OBIE" : "Type or talk to OBIE"}
          onSend={send}
          onVoiceStateChange={onVoiceStateChange}
          disabled={thinking}
        />
      </div>
    </div>
  );
}
