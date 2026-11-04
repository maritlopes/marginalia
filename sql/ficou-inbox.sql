-- O QUE FICOU: caixa de entrada (aplicada no Supabase em 2026-11-04, migração "ficou_inbox").
-- A skill do Claude grava aqui SÓ pela função ficou_enviar (executada pelo conector, com
-- acesso de administradora; anon/authenticated não podem chamá-la). O app da leitora lê o
-- que é dela (RLS), transforma em "O que ficou" e marca consumed_at.
create table if not exists public.ficou_inbox (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  book_title text not null check (char_length(book_title) between 1 and 300),
  sentimento text not null default '' check (char_length(sentimento) <= 900),
  frase text not null default '' check (char_length(frase) <= 400),
  origem text not null default 'claude',
  created_at timestamptz not null default now(),
  consumed_at timestamptz
);
create index if not exists ficou_inbox_pendentes on public.ficou_inbox (user_id) where consumed_at is null;

alter table public.ficou_inbox enable row level security;
create policy "ficou_inbox: dona lê" on public.ficou_inbox for select to authenticated
  using (user_id = auth.uid());
create policy "ficou_inbox: dona marca recebido" on public.ficou_inbox for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.ficou_enviar(
  p_email text, p_day date, p_book_title text, p_sentimento text, p_frase text default ''
) returns uuid
language plpgsql security definer set search_path = public, auth
as $$
declare
  v_user uuid;
  v_id uuid;
  v_sent text := btrim(coalesce(p_sentimento, ''));
  v_frase text := btrim(coalesce(p_frase, ''), E' \t\n"“”');
  v_palavras int;
begin
  select id into v_user from auth.users where lower(email) = lower(btrim(p_email)) limit 1;
  if v_user is null then raise exception 'Leitora não encontrada para o e-mail %', p_email; end if;
  if btrim(coalesce(p_book_title, '')) = '' then raise exception 'Falta o título do livro'; end if;
  if v_sent = '' and v_frase = '' then raise exception 'Falta o sentimento (ou a frase)'; end if;
  v_palavras := coalesce(array_length(regexp_split_to_array(nullif(v_sent, ''), '\s+'), 1), 0);
  if v_palavras > 60 then raise exception 'O sentimento tem % palavras — o limite é 60. Encurte e envie de novo.', v_palavras; end if;
  insert into public.ficou_inbox (user_id, day, book_title, sentimento, frase)
  values (v_user, p_day, btrim(p_book_title), v_sent, v_frase)
  returning id into v_id;
  return v_id;
end;
$$;
revoke all on function public.ficou_enviar(text, date, text, text, text) from public, anon, authenticated;
