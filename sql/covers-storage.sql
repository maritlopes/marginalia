-- Capas dos livros no Storage (bucket público "covers"): cada leitora grava
-- só na própria pasta (<user_id>/<hash>.jpg); o estado guarda só o link.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('covers', 'covers', true, 1048576, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "covers: dona lê a própria pasta" on storage.objects for select to authenticated
  using (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "covers: dona envia na própria pasta" on storage.objects for insert to authenticated
  with check (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "covers: dona atualiza na própria pasta" on storage.objects for update to authenticated
  using (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);
