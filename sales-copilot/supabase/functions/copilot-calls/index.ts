// copilot-calls: saves and lists Live Sales Copilot calls in public.copilot_calls.
//
// The page is public, so this function does its own authentication: every
// request must carry an x-copilot-code header matching the COPILOT_SYNC_CODE
// secret (Supabase → Edge Functions → Secrets). The table has RLS on with no
// policies, so only this function (service role) can read or write it.
//
//   GET    ?limit=30   list recent calls (summary columns) + total
//   GET    ?id=<uuid>  one call in full
//   POST   {call}      create or update a call (upsert by id)
//   DELETE ?id=<uuid>  delete a call
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const CORS = {
  // Access is gated by the sync code header, not by origin or cookies.
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-copilot-code",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400",
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BODY_BYTES = 4_000_000;
const SUMMARY = "id, started_at, ended_at, mode, title, notes, line_count, suggestion_count, has_wrap_up, updated_at";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

async function sha256(text: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}

// Hash both sides to the same length, then compare without an early exit.
async function sameCode(given: string, expected: string) {
  const [a, b] = await Promise.all([sha256(given), sha256(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

const text = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : null);
const isoDate = (v: unknown) => (typeof v === "string" && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : null);

function cleanTranscript(v: unknown) {
  if (!Array.isArray(v)) return null;
  return v.slice(0, 20_000).flatMap((l) =>
    l && typeof l === "object" && typeof l.text === "string"
      ? [{ who: text(l.who, 20) ?? "call", text: l.text.slice(0, 20_000), t: Number.isFinite(l.t) ? Math.max(0, Math.round(l.t)) : 0 }]
      : []
  );
}

function cleanSuggestions(v: unknown) {
  if (!Array.isArray(v)) return null;
  return v.slice(0, 2_000).flatMap((s) =>
    s && typeof s === "object" && typeof s.text === "string"
      ? [{ time: text(s.time, 40), trigger: text(s.trigger, 20), question: text(s.question, 2_000), text: s.text.slice(0, 20_000) }]
      : []
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  const expected = Deno.env.get("COPILOT_SYNC_CODE") ?? "";
  if (expected.length < 8) {
    return json({
      error: "not_configured",
      message: "Add a secret named COPILOT_SYNC_CODE (at least 8 characters) in Supabase → Edge Functions → Secrets, then enter the same code in the copilot's Settings.",
    }, 503);
  }
  const given = req.headers.get("x-copilot-code") ?? "";
  if (!given || !(await sameCode(given, expected))) {
    return json({ error: "bad_code", message: "Wrong sync code." }, 401);
  }

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id !== null && !UUID.test(id)) return json({ error: "bad_request", message: "Invalid call id." }, 400);

  try {
    if (req.method === "GET" && id) {
      const { data, error } = await db.from("copilot_calls").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? json({ call: data }) : json({ error: "not_found", message: "That call no longer exists." }, 404);
    }

    if (req.method === "GET") {
      const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 30));
      const { data, error, count } = await db.from("copilot_calls")
        .select(SUMMARY, { count: "exact" })
        .order("started_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return json({ calls: data, total: count ?? data.length });
    }

    if (req.method === "POST") {
      const raw = await req.text();
      if (raw.length > MAX_BODY_BYTES) return json({ error: "too_large", message: "This call is too large to save." }, 413);
      let call: Record<string, unknown> | undefined;
      try { call = JSON.parse(raw)?.call; } catch { /* handled below */ }
      const transcript = cleanTranscript(call?.transcript);
      const suggestions = cleanSuggestions(call?.suggestions);
      const startedAt = isoDate(call?.started_at);
      if (!call || typeof call.id !== "string" || !UUID.test(call.id) || !startedAt || !transcript || !suggestions) {
        return json({ error: "bad_request", message: "Expected {call: {id, started_at, transcript[], suggestions[]}}." }, 400);
      }
      const row: Record<string, unknown> = {
        id: call.id,
        started_at: startedAt,
        ended_at: isoDate(call.ended_at),
        mode: text(call.mode, 20),
        title: text(call.title, 200),
        notes: text(call.notes, 5_000),
        transcript,
        suggestions,
        line_count: transcript.length,
        suggestion_count: suggestions.length,
        updated_at: new Date().toISOString(),
      };
      // A save without a wrap-up (e.g. autosave) must not erase one saved earlier.
      if (typeof call.wrap_up === "string") {
        row.wrap_up = call.wrap_up.slice(0, 200_000);
        row.has_wrap_up = row.wrap_up !== "";
      }
      const { error } = await db.from("copilot_calls").upsert(row, { onConflict: "id" });
      if (error) throw error;
      return json({ ok: true, id: call.id });
    }

    if (req.method === "DELETE" && id) {
      const { error } = await db.from("copilot_calls").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: "method_not_allowed" }, 405);
  } catch (err) {
    console.error("copilot-calls", err);
    return json({ error: "server_error", message: "The database couldn't complete that request." }, 500);
  }
});
