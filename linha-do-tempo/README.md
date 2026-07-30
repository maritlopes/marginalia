# Linha do Tempo da Civilização

Página estática (`index.html`) publicada pelo GitHub Pages a cada push na `main`
(workflow `.github/workflows/deploy.yml`). O domínio `clubemarginalia.com.br`
aponta para o GitHub Pages — não há deploy pela Netlify.

## Onde vivem os eventos (três camadas)

1. **Base histórica** — 331 cards escritos direto no HTML. Congelada: não
   receber eventos novos aqui.
2. **`EXTRA_EVENTS`** — array JS no fim do `index.html`. Eventos adicionais
   versionados no git; a página monta os cards em tempo de execução com
   `makeEventCard` e os encaixa na era e posição cronológica certas.
3. **Curadoria Viva** — tabela `timeline_entries` no Supabase. A página busca
   as entradas com `status = 'validada'` ao abrir, em qualquer aparelho.
   O botão ✦ (canto inferior esquerdo) abre o painel da administradora:
   sugerir (à mão ou com rascunho preenchido pela IA via função
   `timeline-suggest`), validar pendentes, exportar a linha em Markdown.

**Regra de uso: evento novo entra pela Curadoria (✦).** As camadas 1 e 2 só
mudam em manutenção de código.

Consequência importante para quem inspecionar este repositório: cards da
Curadoria (ex.: Saramago 1998, Krasznahorkai 2025) **não aparecem em nenhum
arquivo versionado** — existem só no banco e são injetados em tempo de
execução. A página no ar mostrando um card que não está no git não é
divergência de deploy; é a camada 3 funcionando.
