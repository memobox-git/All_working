-- Inbox: LinkedIn DMs through Unipile. New messages arrive by webhook, the
-- Inbox agent drafts a reply, and nothing is sent until the owner approves it.
--
-- Owners can only read these tables. Every write goes through server code
-- (service role) after it checks ownership, because the Unipile ids stored
-- here decide which LinkedIn account a reply is sent from. A row an owner
-- could edit would let them point a reply at someone else's chat.

-- A reply waiting for the owner is an approval like any other, so the
-- Needs you page can list it next to plans and task outputs.
alter type public.approval_kind add value if not exists 'reply';

create type public.inbox_provider as enum ('linkedin');
create type public.inbox_direction as enum ('in', 'out');
create type public.reply_draft_status as enum ('pending', 'sending', 'sent', 'skipped');

-- One connected LinkedIn account per workspace (for now).
create table public.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  provider public.inbox_provider not null,
  external_account_id text not null unique, -- Unipile account id
  webhook_id text, -- Unipile webhook for this account's new messages
  display_name text,
  -- The owner's notes for the Inbox agent: who they are, what they offer,
  -- links to share, what to turn down.
  reply_guide text not null default '',
  connected_at timestamptz not null default now(),
  last_synced_at timestamptz,
  unique (workspace_id, provider)
);

create table public.inbox_threads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  account_id uuid not null references public.connected_accounts (id) on delete cascade,
  external_chat_id text not null, -- Unipile chat id
  contact_name text,
  contact_headline text,
  contact_profile_url text,
  last_message_at timestamptz,
  last_message_preview text,
  -- True while the newest message is from the other person and the owner
  -- hasn't skipped it.
  needs_reply boolean not null default false,
  skipped_through timestamptz, -- the owner chose not to reply up to here
  created_at timestamptz not null default now(),
  unique (account_id, external_chat_id)
);
create index inbox_threads_workspace_last_idx on public.inbox_threads (workspace_id, last_message_at desc);

create table public.inbox_messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  thread_id uuid not null references public.inbox_threads (id) on delete cascade,
  external_message_id text not null, -- Unipile message id
  direction public.inbox_direction not null,
  sender_name text,
  body text not null default '',
  sent_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (thread_id, external_message_id)
);
create index inbox_messages_thread_sent_idx on public.inbox_messages (thread_id, sent_at);
create index inbox_messages_workspace_direction_idx on public.inbox_messages (workspace_id, direction, sent_at desc);

create table public.reply_drafts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  thread_id uuid not null references public.inbox_threads (id) on delete cascade,
  reply_to_message_id uuid references public.inbox_messages (id) on delete set null,
  approval_id uuid references public.approvals (id) on delete set null,
  body text not null,
  category text,
  -- The Inbox agent needs something only the owner knows (a price, a date).
  needs_owner boolean not null default false,
  note text,
  status public.reply_draft_status not null default 'pending',
  error text, -- the last send failure, shown on the draft
  external_message_id text, -- set once sent
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
-- At most one open draft per thread.
create unique index reply_drafts_one_open_idx on public.reply_drafts (thread_id)
  where status in ('pending', 'sending');
create index reply_drafts_workspace_status_idx on public.reply_drafts (workspace_id, status);
create index reply_drafts_reply_to_message_id_idx on public.reply_drafts (reply_to_message_id);
create index reply_drafts_approval_id_idx on public.reply_drafts (approval_id);
create index inbox_threads_account_id_idx on public.inbox_threads (account_id);

-- ---------- RLS: owners read, the server writes ----------

alter table public.connected_accounts enable row level security;
create policy "Owners read their connected accounts" on public.connected_accounts
  for select to authenticated
  using (private.is_workspace_owner(workspace_id));

alter table public.inbox_threads enable row level security;
create policy "Owners read their inbox threads" on public.inbox_threads
  for select to authenticated
  using (private.is_workspace_owner(workspace_id));

alter table public.inbox_messages enable row level security;
create policy "Owners read their inbox messages" on public.inbox_messages
  for select to authenticated
  using (private.is_workspace_owner(workspace_id));

alter table public.reply_drafts enable row level security;
create policy "Owners read their reply drafts" on public.reply_drafts
  for select to authenticated
  using (private.is_workspace_owner(workspace_id));

-- Live updates for the Inbox screen.
alter publication supabase_realtime add table public.connected_accounts, public.inbox_threads, public.reply_drafts;
