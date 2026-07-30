-- Viagem no Tempo via Ficção — sincronização entre aparelhos (Supabase)
-- Projeto: rpsiewnsvqpeadwaqsib
-- Aplicar pelo SQL Editor do dashboard (sessão da admin), uma vez.
-- Tabela própria (não mistura com marginalia_state nem maratona_state).

create table if not exists public.viagem_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.viagem_state enable row level security;

-- own-row: cada pessoa só lê/escreve a própria linha
drop policy if exists "viagem own row" on public.viagem_state;
create policy "viagem own row" on public.viagem_state
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update, delete on public.viagem_state to authenticated;
