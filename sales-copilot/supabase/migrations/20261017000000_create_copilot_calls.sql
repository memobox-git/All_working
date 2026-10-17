-- Calls saved by Live Sales Copilot through the copilot-calls edge function.
-- Applied to the Stacklebot project (oshlofyxapvmgxvkldub).
create table if not exists public.copilot_calls (
  id uuid primary key,
  started_at timestamptz not null,
  ended_at timestamptz,
  mode text,
  title text,
  notes text,
  transcript jsonb not null default '[]'::jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  wrap_up text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.copilot_calls is 'Calls saved by Live Sales Copilot via the copilot-calls edge function. RLS on with no policies: only the service role can read or write.';

create index if not exists copilot_calls_started_at_idx on public.copilot_calls (started_at desc);

-- No policies on purpose: anon and authenticated clients can't see or change rows.
alter table public.copilot_calls enable row level security;

-- Summary columns for the Calls list, kept current by the edge function.
alter table public.copilot_calls
  add column if not exists line_count int not null default 0,
  add column if not exists suggestion_count int not null default 0,
  add column if not exists has_wrap_up boolean not null default false;
