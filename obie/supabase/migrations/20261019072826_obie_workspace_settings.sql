-- Owner settings: where agents run, default deadline, approval mode, notifications.
alter table public.workspaces
  add column settings jsonb not null default '{"runtime":"cloud","default_deadline_days":7,"approval_mode":"draft_only","notify_approvals":true,"notify_done":true}'::jsonb;

grant update (settings) on public.workspaces to authenticated;
