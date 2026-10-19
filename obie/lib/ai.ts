import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

// Every model call in OBIE goes through this file, so each one is logged in
// agent_runs with its tokens, cost and the agent that made it.

export const MODELS = {
  main: "claude-sonnet-5-5", // main agents, planning, writing
  nano: "claude-haiku-5-5", // nano jobs, classification, routing
  deep: "claude-opus-5-5", // rare deep planning
} as const;

// US dollars per million tokens: [input, output].
const PRICES: Record<string, [number, number]> = {
  "claude-sonnet-5-5": [2, 10],
  "claude-haiku-5-5": [0.1, 0.5],
  "claude-opus-5-5": [4, 20],
  "claude-opus-5": [5, 25],
  "claude-opus-4-8": [5, 25],
  "claude-fable-5-1": [10, 50],
};

export class AiNotConfiguredError extends Error {
  constructor() {
    super("OBIE's brain isn't switched on yet: add ANTHROPIC_API_KEY to the site's environment variables.");
  }
}

let client: Anthropic | null = null;
function anthropic() {
  if (!process.env.ANTHROPIC_API_KEY) throw new AiNotConfiguredError();
  client ??= new Anthropic();
  return client;
}

export type RunContext = {
  workspaceId: string;
  agentId?: string | null;
  taskId?: string | null;
  path?: string | null;
};

type Usage = {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
};

export function costUsd(model: string, usage: Usage) {
  const [inPrice, outPrice] = PRICES[model] ?? PRICES[MODELS.main];
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  const input = usage.input_tokens * inPrice + cacheWrite * inPrice * 1.25 + cacheRead * inPrice * 0.1;
  return (input + usage.output_tokens * outPrice) / 1_000_000;
}

// One structured call: the reply is parsed against `schema`. Refusals fall
// back to the server's default model chain.
export async function structuredCall<S extends z.ZodType>({
  run,
  model = MODELS.main,
  system,
  messages,
  schema,
  effort = "low",
  maxTokens = 8000,
}: {
  run: RunContext;
  model?: string;
  system: string;
  messages: Anthropic.Beta.BetaMessageParam[];
  schema: S;
  effort?: "low" | "medium" | "high";
  maxTokens?: number;
}): Promise<{ data: z.infer<S>; costUsd: number }> {
  const startedAt = new Date();
  const response = await anthropic().beta.messages.parse({
    model,
    max_tokens: maxTokens,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages,
    output_config: { effort, format: betaZodOutputFormat(schema) },
  });

  const cost = costUsd(response.model, response.usage);
  await logRun(run, response.model, response.usage, cost, startedAt);

  if (response.stop_reason === "refusal" || !response.parsed_output) {
    throw new Error(`Model returned no usable output (stop_reason: ${response.stop_reason}).`);
  }
  return { data: response.parsed_output as z.infer<S>, costUsd: cost };
}

async function logRun(run: RunContext, model: string, usage: Usage, cost: number, startedAt: Date) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("agent_runs not logged: SUPABASE_SERVICE_ROLE_KEY is not set.");
    return;
  }
  const { error } = await createAdminClient()
    .from("agent_runs")
    .insert({
      workspace_id: run.workspaceId,
      agent_id: run.agentId ?? null,
      task_id: run.taskId ?? null,
      path: run.path ?? null,
      model,
      input_tokens:
        usage.input_tokens + (usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0),
      output_tokens: usage.output_tokens,
      cost_usd: Number(cost.toFixed(6)),
      started_at: startedAt.toISOString(),
      ended_at: new Date().toISOString(),
    });
  if (error) console.error("agent_runs insert failed", error);
}
