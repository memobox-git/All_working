import Anthropic from "@anthropic-ai/sdk";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PORTRAIT_TOKEN, SYSTEM_PROMPT, STYLES, userInstruction, type StyleKey } from "@/lib/prompt";
import { InputError, resumeToContent } from "@/lib/resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MODEL = process.env.PORTFOLIO_MODEL || "claude-opus-5-5";
const EFFORT = (process.env.PORTFOLIO_EFFORT || "low") as "low" | "medium" | "high";

export type BuildEvent =
  | { type: "mode"; mode: "live" | "demo"; model?: string }
  | { type: "thinking"; text: string }
  | { type: "html"; text: string }
  | { type: "done"; ms: number; outputTokens?: number; truncated?: boolean }
  | { type: "error"; message: string };

function hasCredentials() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  const text = form.get("text");
  const notes = String(form.get("notes") || "").slice(0, 1000);
  const styleRaw = String(form.get("style") || "auto");
  const style: StyleKey = styleRaw in STYLES ? (styleRaw as StyleKey) : "auto";
  const hasPhoto = form.get("photo") === "1";
  const demo = form.get("demo") === "1" || !hasCredentials();

  const encoder = new TextEncoder();
  const started = Date.now();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: BuildEvent) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
      try {
        if (demo) {
          send({ type: "mode", mode: "demo" });
          await replayDemo(send, req.signal, hasPhoto);
        } else {
          const content = await resumeToContent(
            file instanceof File ? file : null,
            typeof text === "string" ? text : null,
          );
          send({ type: "mode", mode: "live", model: MODEL });
          const result = await streamFromClaude(content, style, notes, hasPhoto, send, req.signal);
          send({ type: "done", ms: Date.now() - started, ...result });
          controller.close();
          return;
        }
        send({ type: "done", ms: Date.now() - started });
      } catch (err) {
        send({ type: "error", message: describeError(err) });
      }
      controller.close();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

async function streamFromClaude(
  resume: Anthropic.Beta.BetaContentBlockParam[],
  style: StyleKey,
  notes: string,
  hasPhoto: boolean,
  send: (e: BuildEvent) => void,
  signal: AbortSignal,
) {
  // Org-level keys that aren't scoped to a workspace must name one on every request.
  const workspace = process.env.ANTHROPIC_WORKSPACE_ID;
  const client = new Anthropic(workspace ? { defaultHeaders: { "anthropic-workspace-id": workspace } } : {});
  const stream = client.beta.messages.stream(
    {
      model: MODEL,
      max_tokens: 32000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      thinking: { type: "adaptive", display: "summarized" },
      output_config: { effort: EFFORT },
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: [...resume, { type: "text", text: userInstruction(style, notes, hasPhoto) }] }],
    },
    { signal },
  );

  for await (const event of stream) {
    if (event.type !== "content_block_delta") continue;
    if (event.delta.type === "thinking_delta") send({ type: "thinking", text: event.delta.thinking });
    else if (event.delta.type === "text_delta") send({ type: "html", text: event.delta.text });
  }

  const final = await stream.finalMessage();
  if (final.stop_reason === "refusal") {
    throw new Error("Claude declined to build from this resume. Check the file and try again.");
  }
  return { outputTokens: final.usage.output_tokens, truncated: final.stop_reason === "max_tokens" };
}

const DEMO_THINKING = [
  "Reading the resume: Senior Data Engineer, six years across ThoughtWorks, Junglee Games and InfoObjects.\n",
  "The strongest signals are quantified: 30–50% cost cut, ~20K records/sec CDC, 80% less manual work, 15-minute SLA.\n",
  "Direction: an engineering schematic. Paper-white sheet, cobalt ink, condensed technical type, a pipeline drawn as Fig. 1.\n",
  "Lead with the numbers, then four case studies with small to-scale charts, then the timeline.\n",
];

async function replayDemo(send: (e: BuildEvent) => void, signal: AbortSignal, hasPhoto: boolean) {
  let html = await readFile(path.join(process.cwd(), "fixtures", "demo-portfolio.html"), "utf8");
  if (hasPhoto) {
    html = html.replace(
      '<div class="plate" aria-hidden="true"><span class="mono">RK</span></div>',
      `<div class="plate"><img src="${PORTRAIT_TOKEN}" alt="Portrait of Rahul Kumar"></div>`,
    );
  }
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  for (const line of DEMO_THINKING) {
    for (const word of line.split(/(?<= )/)) {
      if (signal.aborted) return;
      send({ type: "thinking", text: word });
      await sleep(45);
    }
    await sleep(250);
  }

  let i = 0;
  while (i < html.length) {
    if (signal.aborted) return;
    const size = 40 + Math.floor(Math.random() * 50);
    const chunk = html.slice(i, i + size);
    i += size;
    send({ type: "html", text: chunk });
    await sleep(chunk.includes("<!--@step") ? 650 : 48);
  }
}

function describeError(err: unknown): string {
  if (err instanceof InputError) return err.message;
  if (err instanceof Anthropic.AuthenticationError) return "The Anthropic API key was rejected. Check ANTHROPIC_API_KEY.";
  if (err instanceof Anthropic.RateLimitError) return "Too many builds at once. Wait a moment and try again.";
  if (err instanceof Anthropic.BadRequestError) return `The request was rejected: ${err.message}`;
  if (err instanceof Anthropic.APIError) return `Claude API error (${err.status}). Try again.`;
  if (err instanceof Error && err.name === "AbortError") return "Build stopped.";
  return err instanceof Error ? err.message : "Something went wrong. Try again.";
}
