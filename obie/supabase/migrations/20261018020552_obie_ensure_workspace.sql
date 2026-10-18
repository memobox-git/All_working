-- First sign-in creates the user's workspace and OBIE; later sign-ins just
-- return it. Runs as the caller, so RLS still applies, and a per-user
-- advisory lock keeps two racing first requests from creating two workspaces.
create or replace function public.ensure_my_workspace(default_name text default 'My workspace')
returns table (workspace_id uuid, workspace_name text, created boolean)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  ws public.workspaces%rowtype;
begin
  if uid is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('obie_workspace:' || uid::text, 0));

  select * into ws
  from public.workspaces w
  where w.owner_id = uid
  order by w.created_at
  limit 1;

  if found then
    return query select ws.id, ws.name, false;
    return;
  end if;

  insert into public.workspaces (name, owner_id)
  values (coalesce(nullif(trim(default_name), ''), 'My workspace'), uid)
  returning * into ws;

  -- OBIE is the front desk of every workspace.
  insert into public.agents (workspace_id, name, stack, level, path)
  values (ws.id, 'OBIE', 'obie', 'main', 'obie');

  return query select ws.id, ws.name, true;
end;
$$;

revoke all on function public.ensure_my_workspace(text) from public, anon;
grant execute on function public.ensure_my_workspace(text) to authenticated;
