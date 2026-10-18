-- Private bucket for voice notes. Files live at <workspace_id>/<file>, so a
-- file belongs to whoever owns the workspace named by its folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('voice-notes', 'voice-notes', false, 26214400, array['audio/*'])
on conflict (id) do nothing;

create or replace function private.owns_storage_folder(object_name text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select case
    when (storage.foldername(object_name))[1]
      ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then private.is_workspace_owner(((storage.foldername(object_name))[1])::uuid)
    else false
  end;
$$;

revoke all on function private.owns_storage_folder(text) from public;
grant execute on function private.owns_storage_folder(text) to authenticated;

create policy "OBIE owners upload voice notes" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'voice-notes' and private.owns_storage_folder(name));

create policy "OBIE owners read voice notes" on storage.objects
  for select to authenticated
  using (bucket_id = 'voice-notes' and private.owns_storage_folder(name));

create policy "OBIE owners delete voice notes" on storage.objects
  for delete to authenticated
  using (bucket_id = 'voice-notes' and private.owns_storage_folder(name));
