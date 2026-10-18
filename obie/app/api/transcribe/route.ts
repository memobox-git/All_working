import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transcribe, TranscriptionNotConfiguredError } from "@/lib/transcribe";

// The browser has already uploaded the recording to the voice-notes bucket.
// Here we fetch it as the signed-in user (so storage RLS applies), transcribe
// it, and save the voice note.
const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const pathPattern = new RegExp(`^(${uuid})/${uuid}\\.(webm|mp4|m4a|ogg|wav|mp3)$`);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    path?: unknown;
    durationSeconds?: unknown;
  } | null;
  const path = typeof body?.path === "string" ? body.path : "";
  const match = pathPattern.exec(path);
  if (!match) {
    return NextResponse.json({ error: "Unknown recording." }, { status: 400 });
  }
  const workspaceId = match[1];
  const duration = Number(body?.durationSeconds);

  const { data: audio, error: downloadError } = await supabase.storage
    .from("voice-notes")
    .download(path);
  if (downloadError || !audio) {
    return NextResponse.json({ error: "Recording not found." }, { status: 404 });
  }

  let transcript: string;
  try {
    transcript = await transcribe({ data: audio, filename: path.split("/")[1] });
  } catch (error) {
    if (error instanceof TranscriptionNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Couldn't turn that recording into text. Try again." },
      { status: 502 },
    );
  }

  const { data: note, error: saveError } = await supabase
    .from("voice_notes")
    .insert({
      workspace_id: workspaceId,
      storage_path: path,
      transcript,
      duration_seconds: Number.isFinite(duration) ? Math.round(duration * 100) / 100 : null,
    })
    .select("id")
    .single();
  if (saveError) {
    console.error(saveError);
  }

  return NextResponse.json({ transcript, voiceNoteId: note?.id ?? null });
}
