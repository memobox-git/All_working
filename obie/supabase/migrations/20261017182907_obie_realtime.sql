-- Live updates for the workspace screen. Realtime respects RLS, so each owner
-- only receives changes to their own rows.
alter publication supabase_realtime add table public.messages, public.tasks, public.approvals;
