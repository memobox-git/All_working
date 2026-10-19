-- Channels appear and agents change status while the owner watches.
alter publication supabase_realtime add table public.channels, public.agents;
