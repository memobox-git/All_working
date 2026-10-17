-- OBIE core schema.
-- Every table carries workspace_id (directly, or as its primary key) so OBIE
-- can grow past one owner per workspace without a rewrite.

create extension if not exists ltree with schema extensions;

-- ---------- Types ----------

create type public.agent_level as enum ('main', 'sub', 'nano');
create type public.agent_status as enum ('idle', 'working', 'waiting', 'stuck', 'done');
create type public.channel_status as enum ('active', 'done', 'archived');
create type public.message_author as enum ('user', 'agent');
create type public.message_kind as enum ('text', 'plan', 'status', 'approval', 'voice');
create type public.task_status as enum ('waiting', 'ready', 'running', 'done', 'failed');
create type public.approval_kind as enum ('plan', 'task');
create type public.approval_status as enum ('pending', 'approved', 'rejected');
create type public.credit_reason as enum ('starter', 'daily', 'reserve', 'release', 'refund', 'adjustment');

-- ---------- Workspaces ----------

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index workspaces_owner_id_idx on public.workspaces (owner_id);

create table public.business_profiles (
  workspace_id uuid primary key references public.workspaces (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  confirmed_at timestamptz
);

-- ---------- Agents ----------

-- The agent catalog. Rows without a workspace are the shared catalog every
-- workspace can read. Custom blueprints a workspace designs with OBIE carry
-- that workspace's id.
create table public.blueprints (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces (id) on delete cascade,
  pack text,
  stack text not null,
  role text not null,
  level public.agent_level not null,
  description text,
  default_model text,
  tools jsonb not null default '[]'::jsonb,
  is_custom boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  constraint blueprints_custom_owned check (is_custom = (workspace_id is not null))
);
create index blueprints_workspace_id_idx on public.blueprints (workspace_id);
create index blueprints_created_by_idx on public.blueprints (created_by);

-- OBIE itself is an agent row too (stack 'obie', path 'obie'), so DMs with
-- OBIE work the same way as DMs with any main agent.
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  blueprint_id uuid references public.blueprints (id) on delete set null,
  name text not null,
  stack text not null,
  level public.agent_level not null,
  parent_id uuid references public.agents (id) on delete cascade,
  path extensions.ltree not null, -- sales, sales.1, sales.1.2
  points integer not null default 0,
  status public.agent_status not null default 'idle',
  created_at timestamptz not null default now(),
  unique (workspace_id, path)
);
create index agents_path_idx on public.agents using gist (path);
create index agents_parent_id_idx on public.agents (parent_id);
create index agents_blueprint_id_idx on public.agents (blueprint_id);

-- ---------- Channels and messages ----------

create table public.channels (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  goal text,
  deadline timestamptz,
  owner_agent_id uuid references public.agents (id) on delete set null,
  status public.channel_status not null default 'active',
  created_at timestamptz not null default now()
);
create index channels_workspace_id_idx on public.channels (workspace_id);
create index channels_owner_agent_id_idx on public.channels (owner_agent_id);

-- A message lives in a channel or in a DM with an agent, never both.
-- thread_id points at the thread's first message; nano agent chatter goes there.
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  channel_id uuid references public.channels (id) on delete cascade,
  dm_agent_id uuid references public.agents (id) on delete cascade,
  thread_id uuid references public.messages (id) on delete cascade,
  author_type public.message_author not null,
  author_agent_id uuid references public.agents (id) on delete set null,
  kind public.message_kind not null default 'text',
  body text not null default '',
  data jsonb not null default '{}'::jsonb, -- extra payload: plan graph, approval id, voice note id
  created_at timestamptz not null default now(),
  constraint messages_one_place check ((channel_id is null) <> (dm_agent_id is null))
);
create index messages_workspace_id_idx on public.messages (workspace_id);
create index messages_channel_created_idx on public.messages (channel_id, created_at);
create index messages_dm_created_idx on public.messages (dm_agent_id, created_at);
create index messages_thread_created_idx on public.messages (thread_id, created_at);
create index messages_author_agent_id_idx on public.messages (author_agent_id);

-- ---------- Tasks and approvals ----------

-- Tasks form a dependency graph: a task becomes ready when every task in
-- depends_on is done.
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  channel_id uuid references public.channels (id) on delete cascade,
  agent_id uuid references public.agents (id) on delete set null,
  title text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  depends_on uuid[] not null default '{}',
  status public.task_status not null default 'waiting',
  deadline timestamptz,
  credits_estimate numeric(14, 2) not null default 0,
  credits_used numeric(14, 2) not null default 0,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);
create index tasks_workspace_status_idx on public.tasks (workspace_id, status);
create index tasks_channel_id_idx on public.tasks (channel_id);
create index tasks_agent_id_idx on public.tasks (agent_id);
create index tasks_depends_on_idx on public.tasks using gin (depends_on);

-- kind 'plan' approves a whole channel plan (and its credits);
-- kind 'task' approves one output before it is sent, posted or published.
create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  kind public.approval_kind not null default 'task',
  task_id uuid references public.tasks (id) on delete cascade,
  channel_id uuid references public.channels (id) on delete cascade,
  summary text not null,
  status public.approval_status not null default 'pending',
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
create index approvals_workspace_status_idx on public.approvals (workspace_id, status);
create index approvals_task_id_idx on public.approvals (task_id);
create index approvals_channel_id_idx on public.approvals (channel_id);

-- ---------- Credits ----------

-- Positive amounts add credits (starter, daily, release, refund); negative
-- amounts take them (reserve). The balance is the sum.
create table public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  amount numeric(14, 2) not null,
  reason public.credit_reason not null,
  task_id uuid references public.tasks (id) on delete set null,
  created_at timestamptz not null default now()
);
create index credit_ledger_workspace_created_idx on public.credit_ledger (workspace_id, created_at);
create index credit_ledger_task_id_idx on public.credit_ledger (task_id);

create view public.credit_balances
with (security_invoker = true) as
select workspace_id, sum(amount)::numeric(14, 2) as balance
from public.credit_ledger
group by workspace_id;

-- ---------- Voice and model logs ----------

create table public.voice_notes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  storage_path text not null,
  transcript text,
  duration_seconds numeric(8, 2),
  created_at timestamptz not null default now()
);
create index voice_notes_workspace_id_idx on public.voice_notes (workspace_id);

-- One row per model call: tokens, cost, and which agent made it.
create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  agent_id uuid references public.agents (id) on delete set null,
  task_id uuid references public.tasks (id) on delete set null,
  model text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cost_usd numeric(12, 6) not null default 0,
  path extensions.ltree,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);
create index agent_runs_workspace_started_idx on public.agent_runs (workspace_id, started_at);
create index agent_runs_agent_id_idx on public.agent_runs (agent_id);
create index agent_runs_task_id_idx on public.agent_runs (task_id);
