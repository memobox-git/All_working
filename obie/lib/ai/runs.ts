import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";

// USD per million tokens. Cache writes (5 minute TTL) cost 1.25x input.
const pricing: Record<string, { input: number; output: number; cacheRead: number }> = {
  "claude-opus-5-5": { input: 4, output: 20, cacheRead: 0.2 },
  "claude-sonnet-5-5": { input: 2, output: 10, cacheRead: 0.2 },
  "claude-sonnet-5": { input: 2, output: 10, cacheRead: 0.2 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cacheRead: 0.01 },
};

type Usage = Pick<
  Anthropic.Beta.BetaUsage,
  "input_tokens" | "output_tokens" | "cache_creation_input_tokens" | "cache_read_input_tokens"
>;

export function costUsd(model: string, usage: Usage) {
  const price = pricing[model] ?? pricing["claude-sonnet-5-5"];
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  return (
    (usage.input_tokens * price.input +
      cacheWrite * price.input * 1.25 +
      cacheRead * price.cacheRead +
      usage.output_tokens * price.output) /
    1_000_000
  );
}

// One agent_runs row per model call: tokens, cost, and which agent made it.
// Needs the service-role client, because owners can only read agent_runs.
export async function logRun(
  admin: SupabaseClient,
  run: {
    workspaceId: string;
    agentId: string | null;
    agentPath: string | null;
    model: string;
    usage: Usage;
    startedAt: Date;
  },
) {
  const { error } = await admin.from("agent_runs").insert({
    workspace_id: run.workspaceId,
    agent_id: run.agentId,
    path: run.agentPath,
    model: run.model,
    input_tokens:
      run.usage.input_tokens +
      (run.usage.cache_creation_input_tokens ?? 0) +
      (run.usage.cache_read_input_tokens ?? 0),
    output_tokens: run.usage.output_tokens,
    cost_usd: costUsd(run.model, run.usage),
    started_at: run.startedAt.toISOString(),
    ended_at: new Date().toISOString(),
  });
  // A missing log line shouldn't throw away a finished draft.
  if (error) console.error("agent_runs insert failed", error.message);
}
