import "server-only";
import { z } from "zod";
import { structuredCall } from "./ai";
import type { Agent } from "./chat-types";
import { TASK_ESTIMATE } from "./credits";
import { conversationHistory, insertAgentMessage, teamText, toModelMessages, type ReplyContext } from "./respond";
import { toProfile } from "./business-profile";

// A main agent turns a goal into a channel, a plan and an approval card.

const PlanSchema = z.object({
  decision: z
    .enum(["chat", "ask_deadline", "plan"])
    .describe("plan: the owner gave a goal with a deadline. ask_deadline: a goal without one. chat: anything else."),
  reply: z.string().describe("What the agent says in the DM"),
  goal: z.string().nullable().describe("The goal in one sentence, for plan"),
  channel_name: z.string().nullable().describe("Short kebab-case channel name, e.g. linkedin-posts-data-eng"),
  deadline: z.string().nullable().describe("Deadline as YYYY-MM-DD, for plan"),
  tasks: z
    .array(
      z.object({
        key: z.string().describe("Short id like t1, t2"),
        title: z.string().describe("Imperative task title, under 60 characters"),
        subagent: z.string().describe("Exact name of the subagent that owns it"),
        instructions: z.string().describe("Everything the nano agent needs to do this one task well"),
        depends_on: z.array(z.string()).describe("Keys of tasks that must finish first"),
        kind: z.enum(["simple", "writing"]).describe("writing: drafting copy or content. simple: research notes, lists, classification"),
        publishes: z.boolean().describe("True when the output would be sent, posted or published in the owner's name"),
      }),
    )
    .describe("For plan: 2 to 12 tasks forming a dependency graph. Empty otherwise."),
});

export async function planReply(ctx: ReplyContext, agents: Map<string, Agent>) {
  const history = await conversationHistory(ctx);
  const subs = [...agents.values()].filter((a) => a.path.startsWith(`${ctx.agent.path}.`) && a.level !== "nano");
  const { data: profileRow } = await ctx.supabase
    .from("business_profiles")
    .select("data")
    .eq("workspace_id", ctx.workspaceId)
    .maybeSingle();
  const today = new Date().toISOString().slice(0, 10);
  const weekday = new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });

  const system = `You are ${ctx.agent.name}, the main ${ctx.agent.stack} agent on a one-person business's AI team. The owner DMs you goals. You turn each goal into a plan your subagents carry out, one small task at a time. Each task is done by a nano agent: one task, one model call, then it disappears. Nano agents only see their own instructions plus the outputs of the tasks they depend on, so write complete instructions.

How to answer:
- A goal with no deadline: decision ask_deadline, and ask by when they need it in one short sentence.
- A goal with a deadline: decision plan. Pick a channel name, set the deadline as a date, and break the work into 2 to 12 tasks across your subagents. Use depends_on so tasks run in the right order (research before drafting, drafting before review). Prefer one task per deliverable (for "5 posts", five drafting tasks) so they can run in parallel. Your reply says in one or two sentences that the plan is in the new channel waiting for approval.
- Anything else: decision chat, and just answer.
- On Day 1 agents produce drafts and outputs only. Nothing is sent, posted or published; mark tasks whose output would be with publishes true so the owner approves them.

Your subagents (use these exact names): ${subs.map((s) => s.name).join(", ") || "none"}. If none fit, give the task to the closest one.

Write like a calm, capable teammate: short, plain sentences, no emojis, no markdown headings. Never use the word "candidate".

<business_profile>${JSON.stringify(toProfile(profileRow?.data))}</business_profile>
<whole_team>
${teamText(agents)}
</whole_team>`;

  const messages = toModelMessages(history, agents);
  const last = messages.at(-1);
  if (last?.role === "user" && typeof last.content === "string") {
    last.content = `${last.content}\n\n(Today is ${weekday}, ${today}.)`;
  }

  const { data: plan } = await structuredCall({
    run: { workspaceId: ctx.workspaceId, agentId: ctx.agent.id, path: ctx.agent.path },
    system,
    messages,
    schema: PlanSchema,
    effort: "medium",
  });

  if (plan.decision !== "plan" || !plan.tasks.length || !plan.goal) {
    return insertAgentMessage(ctx, plan.reply);
  }
  const channelId = await createPlan(ctx, plan, subs);
  return insertAgentMessage(ctx, plan.reply, { data: { channelId } });
}

async function createPlan(ctx: ReplyContext, plan: z.infer<typeof PlanSchema>, subs: Agent[]) {
  const { supabase, workspaceId, agent } = ctx;
  const { data: ws } = await supabase.from("workspaces").select("settings").eq("id", workspaceId).maybeSingle();
  const defaultDays = Number((ws?.settings as { default_deadline_days?: number } | null)?.default_deadline_days) || 7;
  const deadline = parseDeadline(plan.deadline, defaultDays);
  const name = slug(plan.channel_name ?? plan.goal ?? "new-goal");

  const { data: channel, error } = await supabase
    .from("channels")
    .insert({ workspace_id: workspaceId, name, goal: plan.goal, deadline, owner_agent_id: agent.id })
    .select("id")
    .single();
  if (error) throw error;

  // Resolve subagents by name, falling back to the first one.
  const byName = new Map(subs.map((s) => [s.name.toLowerCase(), s]));
  const owner = (n: string) => byName.get(n.toLowerCase()) ?? subs[0] ?? agent;
  const tasks = plan.tasks.slice(0, 12);
  const ids = new Map(tasks.map((t) => [t.key, crypto.randomUUID()]));

  const rows = tasks.map((t) => ({
    id: ids.get(t.key)!,
    workspace_id: workspaceId,
    channel_id: channel.id,
    agent_id: owner(t.subagent).id,
    title: t.title.slice(0, 120),
    input: { key: t.key, instructions: t.instructions, kind: t.kind, publishes: t.publishes },
    depends_on: t.depends_on.map((k) => ids.get(k)).filter((id): id is string => !!id && id !== ids.get(t.key)),
    status: "waiting",
    deadline,
    credits_estimate: TASK_ESTIMATE[t.kind],
  }));
  breakCycles(rows);
  const { error: taskError } = await supabase.from("tasks").insert(rows);
  if (taskError) throw taskError;

  const total = rows.reduce((sum, r) => sum + r.credits_estimate, 0);
  const place: ReplyContext = { ...ctx, place: { channelId: channel.id }, threadId: null };

  await insertAgentMessage(place, `Plan for "${plan.goal}"`, {
    kind: "plan",
    data: { total, deadline },
  });

  // One thread per subagent, where its nano agents post updates.
  const involved = [...new Set(rows.map((r) => r.agent_id))];
  const { error: rootError } = await supabase.from("messages").insert(
    involved.map((id, i) => {
      const count = rows.filter((r) => r.agent_id === id).length;
      return {
        workspace_id: workspaceId,
        channel_id: channel.id,
        author_type: "agent",
        author_agent_id: id,
        kind: "status",
        body: `${count} ${count === 1 ? "task" : "tasks"} for me in this plan. Updates go in this thread.`,
        data: { status: "waiting", subagentThread: id },
        created_at: new Date(Date.now() + i + 1).toISOString(),
      };
    }),
  );
  if (rootError) throw rootError;

  const { data: approval, error: approvalError } = await supabase
    .from("approvals")
    .insert({
      workspace_id: workspaceId,
      kind: "plan",
      channel_id: channel.id,
      summary: `Run the plan for "${plan.goal}": ${rows.length} tasks, about ${total} credits`,
    })
    .select("id")
    .single();
  if (approvalError) throw approvalError;

  await supabase.from("messages").insert({
    workspace_id: workspaceId,
    channel_id: channel.id,
    author_type: "agent",
    author_agent_id: agent.id,
    kind: "approval",
    body: `Ready to start when you are. This plan will use about ${total} credits.`,
    data: { approvalId: approval.id, total },
    created_at: new Date(Date.now() + involved.length + 2).toISOString(),
  });

  return channel.id as string;
}

// End of the given day (UTC), or the workspace's default deadline from now.
function parseDeadline(value: string | null, defaultDays: number) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3], 23, 59, 0));
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return new Date(Date.now() + defaultDays * 864e5).toISOString();
}

function slug(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "new-goal"
  );
}

// A model can produce a dependency loop; drop the edges that close one.
function breakCycles(rows: { id: string; depends_on: string[] }[]) {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const state = new Map<string, "visiting" | "done">();
  const visit = (row: { id: string; depends_on: string[] }) => {
    state.set(row.id, "visiting");
    row.depends_on = row.depends_on.filter((dep) => {
      const next = byId.get(dep);
      if (!next) return false;
      if (state.get(dep) === "visiting") return false;
      if (!state.has(dep)) visit(next);
      return true;
    });
    state.set(row.id, "done");
  };
  for (const row of rows) if (!state.has(row.id)) visit(row);
}
