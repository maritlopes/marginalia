# Marginália — memória do projeto

App de leitura (PWA) do Clube Marginália, em português do Brasil. Site: clubemarginalia.com.br
(GitHub Pages; o workflow `.github/workflows/deploy.yml` publica a cada push na `main`).
A dona do projeto não é programadora: explique em linguagem simples, faça o merge quando ela pedir
e confirme antes de mexer no banco de produção.

## Como o código funciona
- React 18 + Vite, mas os arquivos conversam por **globais no `window`** (ordem de carga em `src/main.jsx`):
  `lib/storage.jsx` (estado em localStorage, objeto `MG`) → `tokens.jsx` → `data.jsx` → `home-variants.jsx`
  (Home, calendário, cartão do dia, O que ficou) → `screens.jsx` (livro, Diário, biblioteca, acervo,
  Retrospectiva, círculos, desafios) → `lib/cloud.jsx` (Supabase) → `src/app-main.jsx` (rotas).
- **A cada mudança visível, suba a versão do cache em `sw.js`** (`marginalia-vNNN`), senão o celular fica com a versão velha.
- Build: `npx vite build`. Testes de tela: Playwright com Chromium já instalado; abrir `/?app=1` (sem isso a raiz vai para `/clube/`).
- Datas: use `diaLocal`, `inicioDoDia`, `fimDoDia` (em `lib/storage.jsx`). Nunca `new Date('AAAA-MM-DD')` nem `toISOString().slice(0,10)` para dias (fuso de Brasília).

## Dados e sincronização
- Estado único `marginalia.v1` (books, notes, readingLog, ficou, challenges, progress, prefs…), sincronizado
  inteiro na tabela `marginalia_state` (Supabase, projeto `rpsiewnsvqpeadwaqsib`).
- `lib/cloud.jsx`: todo envio **puxa e mescla antes** de subir; falha de leitura nunca é tratada como nuvem vazia.
  Listas unidas por id (vence o `updatedAt` do item); apagar é **lápide** (`deleted:true`), nunca remover do array.
  Diário (`d_<data>`) mesclado livro a livro; chaves inteiras (`dailyGoal`, `clubeAjustes`, `joinedGrupos`,
  `joinedDesafios`) pelo carimbo em `_carimbos`.
- Gatilho `protect_marginalia_state` no banco impede zerar books/notes/challenges/readingLog/ficou/progress/ecos.
- Backup diário: `take_daily_snapshot()` às 06:00 UTC (cron), guarda 30 dias em `db_snapshots`.

## "O que ficou" (diário de sentimentos)
- Um registro por livro por dia: sentimento (até **60 palavras**) + frase opcional. Aparece no cartão do dia
  (recolhido até tocar no livro), na aba **Diário** do livro (que absorveu as antigas Notas) e em
  "O ano em frases" na Retrospectiva.
- Entrada direta do Claude: skill `skills/o-que-ficou/SKILL.md` (instalada à parte na conta da dona) chama
  `select public.ficou_enviar(email, dia, título, sentimento, frase)` → tabela `ficou_inbox` → o app busca ao
  sincronizar e marca como recebido. SQL em `sql/ficou-inbox.sql`. Para as outras pessoas: "Trazer de outra margem" (colar texto).

## Decisões de texto
- **Círculos** (não "Grupos"); "clube" só para a Marginália; **a** Marginália; linguagem **neutra**.
- Convite da Maratona Nobel **adormecido** até `2027-07-01` (`MARATONA_CONVITE` em `screens.jsx` e
  `data-convite-desde` em `clube/index.html`). Quando voltar, revisar o texto para a edição de 2027.

## Histórico
- 2026-11-04: calendário por meses + cartão do dia; Retrospectiva tocável e "O ano em frases"; O que ficou + skill;
  Diário único; constância; auditoria completa (dados, datas, banco, textos). PRs #2 a #11.

## Ideias em espera
- Ritmo do clube nos Círculos ("você está N páginas à frente da meta do clube").
- Comparar anos na Retrospectiva.
- Avaliar se quem ainda não foi aprovado pode criar círculo / entrar por código de convite (`create_group`, `join_group`).
- "Começar do zero" ainda zera livros sem lápide (o gatilho do banco protege a nuvem).
