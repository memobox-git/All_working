// Row shapes the workspace screen works with. Safe to import in client code.

export type AgentStatus = "idle" | "working" | "waiting" | "stuck" | "done";

export type Agent = {
  id: string;
  name: string;
  stack: string;
  level: "main" | "sub" | "nano";
  path: string;
  parent_id: string | null;
  status: AgentStatus;
  points: number;
};

export type Channel = {
  id: string;
  name: string;
  goal: string | null;
  deadline: string | null;
  owner_agent_id: string | null;
  status: "active" | "done" | "archived";
  created_at: string;
};

export type Message = {
  id: string;
  channel_id: string | null;
  dm_agent_id: string | null;
  thread_id: string | null;
  author_type: "user" | "agent";
  author_agent_id: string | null;
  kind: "text" | "plan" | "status" | "approval" | "voice";
  body: string;
  data: Record<string, unknown>;
  created_at: string;
};

export type Approval = {
  id: string;
  kind: "plan" | "task";
  task_id: string | null;
  channel_id: string | null;
  summary: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export const MESSAGE_COLUMNS =
  "id, channel_id, dm_agent_id, thread_id, author_type, author_agent_id, kind, body, data, created_at";
export const AGENT_COLUMNS = "id, name, stack, level, path, parent_id, status, points";
export const CHANNEL_COLUMNS = "id, name, goal, deadline, owner_agent_id, status, created_at";
export const APPROVAL_COLUMNS = "id, kind, task_id, channel_id, summary, status, created_at";

// The four statuses the owner sees.
export type Pill = "Waiting" | "Working" | "Done" | "Stuck";
export function pillFor(status: string): Pill | null {
  switch (status) {
    case "waiting":
    case "ready":
    case "pending":
      return "Waiting";
    case "working":
    case "running":
      return "Working";
    case "done":
    case "approved":
      return "Done";
    case "stuck":
    case "failed":
    case "rejected":
      return "Stuck";
    default:
      return null;
  }
}
