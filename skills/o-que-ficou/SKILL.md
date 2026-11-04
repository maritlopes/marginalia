---
name: o-que-ficou
description: Diário de leitura do Clube Marginália. Use quando a leitora disser "o que ficou de hoje", "o que ficou", "regera" (sobre esse rascunho) ou "manda pro Marginália" numa conversa sobre um livro. Escreve um rascunho curto do sentimento que a leitura deixou (até 60 palavras) e uma frase marcante, por livro, ajusta até ela aprovar e, só com "manda pro Marginália", envia para o app pelo conector do Supabase.
---

# O que ficou — diário de leitura do Clube Marginália

A leitora conversa sobre os livros que está lendo. No fim, ela quer guardar **o que ficou**:
o sentimento que a leitura deixou nela naquele dia, não um resumo do enredo.

## 1. Rascunho — quando ela disser "o que ficou de hoje" (ou "o que ficou")

Releia a conversa do dia e escreva **um bloco por livro** de que vocês falaram:

- **Sentimento:** no máximo **60 palavras**, em primeira pessoa, no tom dela. O que marcou,
  o que tocou, o que ficou ecoando. Nada de resumo de enredo, nada de análise acadêmica.
- **Frase:** uma frase marcante do livro ou da conversa (opcional, curta, sem aspas extras).
- **Livro:** o título como ela o chama (o app reconhece o título mesmo sem acento ou subtítulo).
- **Data:** hoje, a não ser que ela diga que a leitura foi em outro dia.

Mostre sempre neste formato, dentro de um bloco de código:

```
O QUE FICOU · DD/MM/AAAA
Livro: <título>
Sentimento: <até 60 palavras>
Frase: "<frase>"
```

Conte as palavras antes de mostrar. Termine perguntando, numa linha só, se ela quer
mandar, regerar ou ajustar algo.

## 2. Ajustes

- **"regera"**: escreva uma versão realmente diferente (outro ângulo, outra imagem), não um
  sinônimo da anterior.
- **Sugestão** ("mais curto", "fala mais da Dorothea", "menos triste"): ajuste e mostre de novo.
- Ela pode mudar o texto à mão. Respeite exatamente o que ela escreveu.
- Repita quantas vezes ela quiser. **Nunca envie nesta etapa.**

## 3. Envio — SÓ quando ela disser "manda pro Marginália" (ou "manda pro clube", "pode mandar")

Envie a última versão aprovada, **um envio por livro**, usando a ferramenta `execute_sql`
do conector **Supabase**, no projeto `rpsiewnsvqpeadwaqsib`, com exatamente esta forma:

```sql
select public.ficou_enviar(
  'maritei2010@gmail.com',      -- e-mail da leitora no app
  'AAAA-MM-DD',                 -- data da leitura
  'Título do livro',
  'Sentimento (até 60 palavras)',
  'Frase marcante'              -- ou '' se não houver
);
```

Regras de segurança, sem exceção:

- A **única** instrução SQL permitida nesta skill é `select public.ficou_enviar(...)`.
  Nunca rode `insert`, `update`, `delete`, `alter`, `drop` nem consultas a outras tabelas.
- Escape apóstrofos dobrando-os (`'` vira `''`), por exemplo `'d''Os Lusíadas'`.
- Se a função recusar (por exemplo, mais de 60 palavras), mostre o motivo, encurte junto com
  ela e só envie de novo quando ela aprovar.
- Se o conector do Supabase não estiver disponível na conversa, diga isso e ofereça o bloco
  pronto para ela copiar e usar em **"Trazer de outra margem"** no app (no Diário do livro ou no cartão do dia).

Depois de enviar, confirme em uma linha: "Mandei para o Marginália: <livro(s)>, <data>.
Aparece no app na próxima vez que você abrir." Se algum título não existir na estante dela,
o app avisa na página inicial e ela escolhe o livro lá.
