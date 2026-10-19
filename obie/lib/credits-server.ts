import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "./supabase/admin";
import { creditsForCost } from "./credits";

// Every write to the credit ledger happens here, with the service role, so an
// owner can never grant themselves credits from the browser. Without
// SUPABASE_SERVICE_ROLE_KEY credits are off: plans still run, nothing is
// charged, and the screen says so.

export class NotEnoughCreditsError extends Error {
  constructor(
    public needed: number,
    public available: number,
  ) {
    super(`This plan needs about ${Math.ceil(needed)} credits and you have ${Math.floor(available)}.`);
  }
}

export function creditsEnabled() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function admin() {
  return creditsEnabled() ? createAdminClient() : null;
}

export type CreditSummary = { enabled: boolean; balance: number; dailyLeft: number; reserved: number; daily: number };

// Grants today's daily credits if needed, then returns the balance.
export async function creditSummary(db: SupabaseClient, workspaceId: string): Promise<CreditSummary> {
  const a = admin();
  if (a) await a.rpc("obie_claim_daily_credits", { ws: workspaceId });
  const { data } = await db
    .from("credit_summary")
    .select("balance, daily_left, reserved, daily_credits")
    .eq("workspace_id", workspaceId)
    .maybeSingle();
  return {
    enabled: !!a,
    balance: Number(data?.balance ?? 0),
    dailyLeft: Number(data?.daily_left ?? 0),
    reserved: Number(data?.reserved ?? 0),
    daily: Number(data?.daily_credits ?? 100),
  };
}

async function ledger(
  a: SupabaseClient,
  row: { workspace_id: string; amount: number; reason: string; task_id?: string | null; channel_id?: string | null; note?: string },
) {
  if (!row.amount) return;
  const { error } = await a.from("credit_ledger").insert({ ...row, amount: Math.round(row.amount * 100) / 100 });
  if (error) throw error;
}

// On plan approval: hold the estimate of every task that hasn't run yet.
export async function reservePlan(workspaceId: string, channelId: string) {
  const a = admin();
  if (!a) return { reserved: 0, enabled: false };
  const summary = await creditSummary(a, workspaceId);
  const { data: tasks } = await a
    .from("tasks")
    .select("id, credits_estimate")
    .eq("channel_id", channelId)
    .eq("reserved", false)
    .in("status", ["waiting", "ready"]);
  const total = (tasks ?? []).reduce((sum, t) => sum + Number(t.credits_estimate), 0);
  if (total > summary.balance) throw new NotEnoughCreditsError(total, summary.balance);
  await ledger(a, { workspace_id: workspaceId, amount: -total, reason: "reserve", channel_id: channelId, note: "plan" });
  if (tasks?.length) await a.from("tasks").update({ reserved: true }).in("id", tasks.map((t) => t.id));
  return { reserved: total, enabled: true };
}

// After a task: give back its hold, charge what it really cost, and refund
// failed tasks and redos.
export async function settleTask(
  task: { id: string; workspace_id: string; channel_id: string | null; credits_estimate: number; input: { free_redo?: boolean } },
  ok: boolean,
  costUsd: number,
) {
  const a = admin();
  if (!a) return;
  const { data: row } = await a.from("tasks").select("reserved").eq("id", task.id).single();
  const base = { workspace_id: task.workspace_id, task_id: task.id, channel_id: task.channel_id };
  if (row?.reserved) {
    await ledger(a, { ...base, amount: Number(task.credits_estimate), reason: ok ? "release" : "refund", note: "hold" });
    await a.from("tasks").update({ reserved: false }).eq("id", task.id);
  }
  const used = creditsForCost(costUsd);
  if (ok && used > 0) {
    await ledger(a, { ...base, amount: -used, reason: "usage", note: "model" });
    if (task.input.free_redo) await ledger(a, { ...base, amount: used, reason: "refund", note: "redo" });
  }
}

// A plan that stopped on a failure: let go of the holds on tasks now on hold.
export async function releaseOnHold(channelId: string) {
  const a = admin();
  if (!a) return;
  const { data: tasks } = await a
    .from("tasks")
    .select("id, workspace_id, credits_estimate")
    .eq("channel_id", channelId)
    .eq("status", "waiting")
    .eq("reserved", true);
  if (!tasks?.length) return;
  const total = tasks.reduce((sum, t) => sum + Number(t.credits_estimate), 0);
  await ledger(a, { workspace_id: tasks[0].workspace_id, amount: total, reason: "release", channel_id: channelId, note: "on hold" });
  await a.from("tasks").update({ reserved: false }).in("id", tasks.map((t) => t.id));
}

// A redo: hold credits again for the task and anything waiting on it.
export async function reserveTasks(workspaceId: string, taskIds: string[], channelId: string | null) {
  const a = admin();
  if (!a || !taskIds.length) return;
  const summary = await creditSummary(a, workspaceId);
  const { data: tasks } = await a.from("tasks").select("id, credits_estimate").in("id", taskIds).eq("reserved", false);
  const total = (tasks ?? []).reduce((sum, t) => sum + Number(t.credits_estimate), 0);
  if (total > summary.balance) throw new NotEnoughCreditsError(total, summary.balance);
  await ledger(a, { workspace_id: workspaceId, amount: -total, reason: "reserve", channel_id: channelId, note: "redo" });
  if (tasks?.length) await a.from("tasks").update({ reserved: true }).in("id", tasks.map((t) => t.id));
}
