"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type VoiceState = "idle" | "recording" | "working";

const MAX_SECONDS = 180;

// Formats the browser can record, best first. iPhone Safari records audio/mp4;
// Chrome and Android record audio/webm.
const RECORDING_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
const EXTENSIONS: Record<string, string> = {
  "audio/webm": "webm",
  "audio/mp4": "mp4",
  "audio/x-m4a": "m4a",
  "audio/ogg": "ogg",
};

// Records from the microphone, uploads the audio to the workspace's
// voice-notes folder, and hands back the transcript.
export function useVoiceRecorder({
  workspaceId,
  onTranscript,
}: {
  workspaceId: string;
  onTranscript: (text: string) => void;
}) {
  const [state, setState] = useState<VoiceState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const discard = useRef(false);
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const releaseMic = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }, []);

  useEffect(() => releaseMic, [releaseMic]);

  const upload = useCallback(
    async (blob: Blob, durationSeconds: number) => {
      setState("working");
      try {
        const type = blob.type.split(";")[0] || "audio/webm";
        const path = `${workspaceId}/${crypto.randomUUID()}.${EXTENSIONS[type] ?? "webm"}`;
        const { error: uploadError } = await createClient()
          .storage.from("voice-notes")
          .upload(path, blob, { contentType: type });
        if (uploadError) throw new Error("Couldn't save the recording. Try again.");

        const res = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path, durationSeconds }),
        });
        const body = (await res.json().catch(() => ({}))) as { transcript?: string; error?: string };
        if (!res.ok) throw new Error(body.error ?? "Couldn't turn that recording into text.");
        if (body.transcript) onTranscriptRef.current(body.transcript);
        else setError("OBIE didn't catch any words. Try again a little closer to the mic.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      } finally {
        setState("idle");
      }
    },
    [workspaceId],
  );

  const start = useCallback(async () => {
    if (state !== "idle") return;
    setError(null);
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("This browser can't record audio. Try Safari or Chrome.");
      return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Allow microphone access to talk to OBIE.");
      return;
    }

    const mimeType = RECORDING_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
    const rec = new MediaRecorder(stream.current, mimeType ? { mimeType } : undefined);
    chunks.current = [];
    discard.current = false;
    rec.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.current.push(event.data);
    };
    rec.onstop = () => {
      const duration = (Date.now() - startedAt.current) / 1000;
      releaseMic();
      if (discard.current) {
        setState("idle");
        return;
      }
      const blob = new Blob(chunks.current, { type: rec.mimeType || mimeType || "audio/webm" });
      void upload(blob, duration);
    };

    recorder.current = rec;
    startedAt.current = Date.now();
    setSeconds(0);
    setState("recording");
    rec.start();
    timer.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      setSeconds(elapsed);
      if (elapsed >= MAX_SECONDS && rec.state === "recording") rec.stop();
    }, 250);
  }, [releaseMic, state, upload]);

  // Stop and transcribe.
  const finish = useCallback(() => {
    if (recorder.current?.state === "recording") recorder.current.stop();
  }, []);

  // Stop and throw the recording away.
  const cancel = useCallback(() => {
    discard.current = true;
    if (recorder.current?.state === "recording") recorder.current.stop();
    else releaseMic();
  }, [releaseMic]);

  return { state, seconds, error, start, finish, cancel, clearError: () => setError(null) };
}
