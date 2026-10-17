-- Row-level security: only a workspace's owner can see or change its rows.
-- Credits and model logs are read-only for the owner; only the server
-- (service role, which bypasses RLS) writes them, so nobody can grant
-- themselves credits from the browser.

create schema if not exists private;
grant usage on schema private to authenticated;

-- True when the signed-in user owns the workspace. Security definer so policies
-- on other tables can check ownership without tripping RLS on workspaces.
create or replace function private.is_workspace_owner(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspaces w
    where w.id = ws
      and w.owner_id = (select auth.uid())
  );
$$;

revoke all on function private.is_workspace_owner(uuid) from public;
grant execute on function private.is_workspace_owner(uuid) to authenticated;

-- ---------- workspaces ----------

alter table public.workspaces enable row level security;

create policy "Owners read their workspaces" on public.workspaces
  for select to authenticated
  using (owner_id = (select auth.uid()));

create policy "Users create workspaces they own" on public.workspaces
  for insert to authenticated
  with check (owner_id = (select auth.uid()));

create policy "Owners update their workspaces" on public.workspaces
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Owners delete their workspaces" on public.workspaces
  for delete to authenticated
  using (owner_id = (select auth.uid()));

-- ---------- blueprints: shared catalog plus each workspace's custom ones ----------

alter table public.blueprints enable row level security;

create policy "Read the catalog and own custom blueprints" on public.blueprints
  for select to authenticated
  using (workspace_id is null or private.is_workspace_owner(workspace_id));

create policy "Owners add custom blueprints" on public.blueprints
  for insert to authenticated
  with check (is_custom and private.is_workspace_owner(workspace_id));

create policy "Owners update custom blueprints" on public.blueprints
  for update to authenticated
  using (is_custom and private.is_workspace_owner(workspace_id))
  with check (is_custom and private.is_workspace_owner(workspace_id));

create policy "Owners delete custom blueprints" on public.blueprints
  for delete to authenticated
  using (is_custom and private.is_workspace_owner(workspace_id));

-- ---------- owner read and write ----------

alter table public.business_profiles enable row level security;
create policy "Owners manage business profiles" on public.business_profiles
  for all to authenticated
  using (private.is_workspace_owner(workspace_id))
  with check (private.is_workspace_owner(workspace_id));

alter table public.agents enable row level security;
create policy "Owners manage agents" on public.agents
  for all to authenticated
  using (private.is_workspace_owner(workspace_id))
  with check (private.is_workspace_owner(workspace_id));

alter table public.channels enable row level security;
create policy "Owners manage channels" on public.channels
  for all to authenticated
  using (private.is_workspace_owner(workspace_id))
  with check (private.is_workspace_owner(workspace_id));

alter table public.messages enable row level security;
create policy "Owners manage messages" on public.messages
  for all to authenticated
  using (private.is_workspace_owner(workspace_id))
  with check (private.is_workspace_owner(workspace_id));

alter table public.tasks enable row level security;
create policy "Owners manage tasks" on public.tasks
  for all to authenticated
  using (private.is_workspace_owner(workspace_id))
  with check (private.is_workspace_owner(workspace_id));

alter table public.approvals enable row level security;
create policy "Owners manage approvals" on public.approvals
  for all to authenticated
  using (private.is_workspace_owner(workspace_id))
  with check (private.is_workspace_owner(workspace_id));

alter table public.voice_notes enable row level security;
create policy "Owners manage voice notes" on public.voice_notes
  for all to authenticated
  using (private.is_workspace_owner(workspace_id))
  with check (private.is_workspace_owner(workspace_id));

-- ---------- owner read only (the server writes these) ----------

alter table public.credit_ledger enable row level security;
create policy "Owners read their credit ledger" on public.credit_ledger
  for select to authenticated
  using (private.is_workspace_owner(workspace_id));

alter table public.agent_runs enable row level security;
create policy "Owners read their agent runs" on public.agent_runs
  for select to authenticated
  using (private.is_workspace_owner(workspace_id));
