-- Comunicar+ — schema do Supabase (com login).
-- Cole este arquivo no SQL Editor do painel do Supabase (Database > SQL Editor)
-- para criar a tabela de progresso.
--
-- Cada usuario logado (via Supabase Auth) tem uma linha propria, identificada
-- por usuario_id = auth.uid(). As politicas de RLS abaixo garantem que cada
-- pessoa so consegue ler/escrever o proprio progresso.
--
-- O app guarda o progresso do dia (metas diarias, streak em andamento) no
-- localStorage — ver src/context/AppContext.tsx — e sincroniza um resumo
-- (mascote, total de estrelas por area, sequencia) com esta tabela sempre
-- que o usuario esta logado.

create table if not exists progresso (
  usuario_id uuid primary key references auth.users (id) on delete cascade,
  mascote_id text not null default 'leo',
  estrelas_por_area jsonb not null default '{}'::jsonb,
  sequencia integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

alter table progresso enable row level security;

create policy "Ver o proprio progresso" on progresso
  for select using (auth.uid() = usuario_id);

create policy "Criar o proprio progresso" on progresso
  for insert with check (auth.uid() = usuario_id);

create policy "Atualizar o proprio progresso" on progresso
  for update using (auth.uid() = usuario_id);
