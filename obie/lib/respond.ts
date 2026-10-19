import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { structuredCall } from "./ai";
import { toProfile } from "./business-profile";
import { AGENT_COLUMNS, MESSAGE_COLUMNS, type Agent, type Message } from "./chat-types";
import { designStack } from "./custom-stack";
import { buildAgents, loadBlueprints } from "./team";

export type ReplyContext = {
  supabase: SupabaseClient;
  workspaceId: string;
  obieId: string;
  agent: Agent; // who answers
  place: { dmAgentId: string } | { channelId: string };
  threadId: string | null;
};

// Shared voice for every agent the owner talks to.
const HOUSE_RULES = `Write like a calm, capable teammate: short, plain sentences, no jargon, no emojis, no markdown headings. Never use the word "candidate". Anything sent, posted or published in the owner's name, or anything that costs money, needs the owner's approval first: offer drafts, never claim you sent or posted something.`;

export async function conversationHistory(ctx: ReplyContext, limit = 30) {
  let query = ctx.supabase.from("messages").select(MESSAGE_COLUMNS).order("created_at", { ascending: false }).limit(limit);
  query = "dmAgentId" in ctx.place ? query.eq("dm_agent_id", ctx.place.dmAgentId) : query.eq("channel_id", ctx.place.channelId);
  query = ctx.threadId ? query.or(`id.eq.${ctx.threadId},thread_id.eq.${ctx.threadId}`) : query.is("thread_id", null);
  const { data } = await query;
  return ((data ?? []) as Message[]).reverse();
}

export function toModelMessages(history: Message[], agents: Map<string, Agent>): Anthropic.Beta.BetaMessageParam[] {
  return history
    .filter((m) => m.body.trim())
    .map((m) => {
      if (m.author_type === "user") return { role: "user" as const, content: m.body };
      const who = m.author_agent_id ? agents.get(m.author_agent_id)?.name : null;
      return { role: "assistant" as const, content: who ? `[${who}] ${m.body}` : m.body };
    });
}

export async function insertAgentMessage(
  ctx: ReplyContext,
  body: string,
  extra: { kind?: Message["kind"]; data?: Record<string, unknown>; authorId?: string; threadId?: string | null } = {},
) {
  const { data, error } = await ctx.supabase
    .from("messages")
    .insert({
      workspace_id: ctx.workspaceId,
      ...("dmAgentId" in ctx.place ? { dm_agent_id: ctx.place.dmAgentId } : { channel_id: ctx.place.channelId }),
      thread_id: extra.threadId === undefined ? ctx.threadId : extra.threadId,
      author_type: "agent",
      author_agent_id: extra.authorId ?? ctx.agent.id,
      kind: extra.kind ?? "text",
      body,
      data: extra.data ?? {},
    })
    .select(MESSAGE_COLUMNS)
    .single();
  if (error) throw error;
  return data as Message;
}

export async function loadAgents(supabase: SupabaseClient, workspaceId: string) {
  const { data } = await supabase.from("agents").select(AGENT_COLUMNS).eq("workspace_id", workspaceId);
  return new Map(((data ?? []) as Agent[]).map((a) => [a.id, a]));
}

async function profileText(ctx: ReplyContext) {
  const { data } = await ctx.supabase
    .from("business_profiles")
    .select("data")
    .eq("workspace_id", ctx.workspaceId)
    .maybeSingle();
  return JSON.stringify(toProfile(data?.data));
}

export function teamText(agents: Map<string, Agent>) {
  const all = [...agents.values()].filter((a) => a.path !== "obie");
  return all
    .filter((a) => a.level === "main")
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((main) => {
      const subs = all.filter((a) => a.path.startsWith(`${main.path}.`)).map((a) => a.name);
      return `- ${main.name} (${main.stack}): ${subs.join(", ") || "no subagents"}`;
    })
    .join("\n");
}

// ---------- OBIE, the front desk ----------

const ObieTurnSchema = z.object({
  reply: z.string().describe("What OBIE says"),
  action: z
    .enum(["none", "add_agent", "design_stack"])
    .describe("add_agent: add one catalog agent. design_stack: design a custom stack for the owner to review."),
  blueprint_slug: z.string().nullable().describe("For add_agent: the catalog slug to add"),
  stack_request: z.string().nullable().describe("For design_stack: the owner's request in one or two sentences"),
});

async function obieReply(ctx: ReplyContext, agents: Map<string, Agent>) {
  const history = await conversationHistory(ctx);
  const blueprints = await loadBlueprints(ctx.supabase);
  const built = new Set(
    (
      await ctx.supabase.from("agents").select("blueprint_id").eq("workspace_id", ctx.workspaceId)
    ).data?.map((a) => a.blueprint_id) ?? [],
  );
  const addable = blueprints
    .filter((b) => !b.is_custom && b.slug && b.stack !== "obie" && !built.has(b.id))
    .map((b) => `${b.slug} (${b.role}${b.level === "main" ? " stack" : ""})`)
    .join(", ");

  const system = `You are OBIE, the front desk of the owner's AI team. You know the business and the team, answer questions, and point the owner to the right agent ("DM Marketing with that goal"). Main agents plan goals in channels and their subagents do the work; you don't run goals yourself.

You can also change the team:
- add_agent: when the owner asks for an agent that's in the addable catalog below, set blueprint_slug and confirm in your reply.
- design_stack: when they want a whole new area covered (a custom stack), set stack_request; their design appears below your reply for them to review and build.
Otherwise action is none.

${HOUSE_RULES}

<business_profile>${await profileText(ctx)}</business_profile>
<team>
${teamText(agents) || "No team yet."}
</team>
<addable_catalog>${addable || "Everything in the catalog is already on the team."}</addable_catalog>`;

  const { data: turn } = await structuredCall({
    run: { workspaceId: ctx.workspaceId, agentId: ctx.obieId, path: "obie" },
    system,
    messages: toModelMessages(history, agents),
    schema: ObieTurnSchema,
  });

  const data: Record<string, unknown> = {};
  let body = turn.reply;
  if (turn.action === "add_agent" && turn.blueprint_slug) {
    const blueprint = blueprints.find((b) => b.slug === turn.blueprint_slug && !b.is_custom);
    if (blueprint) {
      const created = await buildAgents(ctx.supabase, ctx.workspaceId, [blueprint.id], blueprints);
      data.addedAgents = created.map((a) => ({ id: a.id, name: a.name, path: a.path }));
      if (!created.length) body += "\n\nThat agent is already on your team.";
    }
  } else if (turn.action === "design_stack" && turn.stack_request) {
    data.customStack = await designStack(ctx.supabase, { workspaceId: ctx.workspaceId, obieId: ctx.obieId }, turn.stack_request);
  }
  return insertAgentMessage(ctx, body, { data });
}

// ---------- Main agents ----------

async function agentChatReply(ctx: ReplyContext, agents: Map<string, Agent>) {
  const history = await conversationHistory(ctx);
  const subs = [...agents.values()].filter((a) => a.path.startsWith(`${ctx.agent.path}.`)).map((a) => a.name);
  const system = `You are ${ctx.agent.name}, the main ${ctx.agent.stack} agent on a one-person business's AI team. Your subagents: ${
    subs.join(", ") || "none yet"
  }. You turn the owner's goals into plans your subagents carry out.

${HOUSE_RULES}

<business_profile>${await profileText(ctx)}</business_profile>`;
  const { data } = await structuredCall({
    run: { workspaceId: ctx.workspaceId, agentId: ctx.agent.id, path: ctx.agent.path },
    system,
    messages: toModelMessages(history, agents),
    schema: z.object({ reply: z.string() }),
  });
  return insertAgentMessage(ctx, data.reply);
}

// Picks who answers and how. OBIE runs the front desk; main agents chat
// about their area.
export async function respond(ctx: ReplyContext) {
  const agents = await loadAgents(ctx.supabase, ctx.workspaceId);
  if (ctx.agent.id === ctx.obieId) return obieReply(ctx, agents);
  return agentChatReply(ctx, agents);
}
