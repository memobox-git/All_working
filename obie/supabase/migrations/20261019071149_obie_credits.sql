-- Credits: 2,500 starter credits per workspace plus daily credits that reset
-- at the owner's local midnight and are used first. Owners can read their
-- ledger; only the server (service role) writes it.

-- Daily credits are a per-workspace setting so the founder's own workspace can
-- run a bigger budget. Owners can't change it themselves.
alter table public.workspaces
  add column daily_credits integer not null default 100 check (daily_credits >= 0),
  add column timezone text not null default 'UTC';

revoke update on public.workspaces from authenticated;
grant update (name, timezone) on public.workspaces to authenticated;

alter table public.credit_ledger
  add column channel_id uuid references public.channels (id) on delete set null,
  add column day date,
  add column note text;

create index credit_ledger_channel_id_idx on public.credit_ledger (channel_id);
-- One daily grant and one expiry per workspace per local day.
create unique index credit_ledger_daily_once_idx on public.credit_ledger (workspace_id, day, reason, note)
  where day is not null;

-- A task's estimate is held (reserved) from approval until it finishes.
alter table public.tasks add column reserved boolean not null default false;

-- ---------- Starter credits ----------

create or replace function private.grant_starter_credits()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.credit_ledger (workspace_id, amount, reason, note)
  values (new.id, 2500, 'starter', 'starter');
  return new;
end;
$$;

create trigger workspaces_starter_credits
  after insert on public.workspaces
  for each row execute function private.grant_starter_credits();

insert into public.credit_ledger (workspace_id, amount, reason, note)
select w.id, 2500, 'starter', 'starter'
from public.workspaces w
where not exists (
  select 1 from public.credit_ledger l where l.workspace_id = w.id and l.reason = 'starter'
);

-- ---------- Daily credits ----------

-- Grants today's daily credits (in the workspace's time zone) if not granted
-- yet, and expires whatever was left of the previous daily grant. Spending
-- since a grant counts against that grant first, so daily credits are used
-- before starter credits. Server only.
create or replace function public.obie_claim_daily_credits(ws uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  tz text;
  amount integer;
  today date;
  last_grant public.credit_ledger%rowtype;
  spent numeric;
begin
  select coalesce(nullif(w.timezone, ''), 'UTC'), w.daily_credits into tz, amount
  from public.workspaces w where w.id = ws;
  if not found then return; end if;

  begin
    today := (now() at time zone tz)::date;
  exception when others then
    today := (now() at time zone 'UTC')::date;
  end;

  perform pg_advisory_xact_lock(hashtextextended('obie_daily:' || ws::text, 0));

  select * into last_grant from public.credit_ledger l
  where l.workspace_id = ws and l.reason = 'daily'
  order by l.day desc nulls last limit 1;

  if found and last_grant.day >= today then
    return;
  end if;

  if found then
    select coalesce(-sum(l.amount), 0) into spent
    from public.credit_ledger l
    where l.workspace_id = ws
      and l.created_at >= last_grant.created_at
      and l.reason in ('reserve', 'release', 'refund', 'usage');
    if last_grant.amount - greatest(spent, 0) > 0 then
      insert into public.credit_ledger (workspace_id, amount, reason, day, note)
      values (ws, -(last_grant.amount - greatest(spent, 0)), 'adjustment', last_grant.day, 'daily_expired')
      on conflict do nothing;
    end if;
  end if;

  if amount > 0 then
    insert into public.credit_ledger (workspace_id, amount, reason, day, note)
    values (ws, amount, 'daily', today, 'daily')
    on conflict do nothing;
  end if;
end;
$$;

revoke all on function public.obie_claim_daily_credits(uuid) from public, anon, authenticated;
grant execute on function public.obie_claim_daily_credits(uuid) to service_role;

-- ---------- What the owner sees ----------

-- balance: everything available. daily_left: what's left of today's daily
-- credits (spent first). reserved: held for approved plans still running.
create or replace view public.credit_summary
with (security_invoker = true) as
with latest_daily as (
  select distinct on (l.workspace_id) l.workspace_id, l.amount, l.created_at
  from public.credit_ledger l
  where l.reason = 'daily'
  order by l.workspace_id, l.day desc
)
select
  w.id as workspace_id,
  coalesce((select sum(l.amount) from public.credit_ledger l where l.workspace_id = w.id), 0)::numeric(14, 2) as balance,
  greatest(
    0,
    least(
      coalesce(d.amount, 0) - greatest(
        coalesce((
          select -sum(l.amount) from public.credit_ledger l
          where l.workspace_id = w.id and l.created_at >= d.created_at
            and l.reason in ('reserve', 'release', 'refund', 'usage')
        ), 0),
        0
      ),
      coalesce((select sum(l.amount) from public.credit_ledger l where l.workspace_id = w.id), 0)
    )
  )::numeric(14, 2) as daily_left,
  coalesce((select sum(t.credits_estimate) from public.tasks t where t.workspace_id = w.id and t.reserved), 0)::numeric(14, 2) as reserved,
  w.daily_credits
from public.workspaces w
left join latest_daily d on d.workspace_id = w.id;

alter publication supabase_realtime add table public.credit_ledger;
