import "server-only";

// The only file that knows which transcription provider OBIE uses. To switch,
// add the provider below and set TRANSCRIBE_PROVIDER.

export class TranscriptionNotConfiguredError extends Error {}

type Audio = { data: Blob; filename: string };

export async function transcribe(audio: Audio): Promise<string> {
  const provider = process.env.TRANSCRIBE_PROVIDER ?? "elevenlabs";
  switch (provider) {
    case "elevenlabs":
      return elevenLabs(audio);
    default:
      throw new TranscriptionNotConfiguredError(
        `Transcription provider "${provider}" isn't set up yet. Add it in lib/transcribe.ts or set TRANSCRIBE_PROVIDER=elevenlabs.`,
      );
  }
}

// ElevenLabs Scribe: POST multipart audio, get { text } back.
async function elevenLabs({ data, filename }: Audio): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new TranscriptionNotConfiguredError(
      "Voice isn't set up yet: add ELEVENLABS_API_KEY to the site's environment variables.",
    );
  }

  const form = new FormData();
  form.append("model_id", "scribe_v2");
  form.append("file", data, filename);

  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": apiKey },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`ElevenLabs transcription failed (${res.status}): ${await res.text()}`);
  }
  const body = (await res.json()) as { text?: string };
  return (body.text ?? "").trim();
}
