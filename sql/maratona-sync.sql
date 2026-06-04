-- Maratona Nobel — sincronização entre aparelhos (Supabase)
-- Projeto: rpsiewnsvqpeadwaqsib
-- Aplicar pelo SQL Editor do dashboard (sessão da admin).
-- Tabela própria (não mistura com marginalia_state do app).

create table if not exists public.maratona_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.maratona_state enable row level security;

-- own-row: cada pessoa só lê/escreve a própria linha
drop policy if exists "maratona own row" on public.maratona_state;
create policy "maratona own row" on public.maratona_state
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update, delete on public.maratona_state to authenticated;
