// Supabase Edge Function: periodo-contexto
// Recebe { periodo } (ano, século ou tema — ex.: "século XII", "1922",
// "Revolução Francesa") e pede ao Gemini um retrato do período em cinco
// eixos (história, filosofia, literatura, arte, música), para a caixa
// "Para onde você quer viajar?" da linha do tempo da Marginália.
// A chave fica no segredo GEMINI_API_KEY (a mesma da timeline-suggest).
// verify_jwt desligado: página pública, leitores anônimos; a função é
// somente-geradora (não lê nem escreve dados do projeto).
//
// Cópia de referência — a versão ativa vive no Supabase (deploy 2026-06-10).

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const { periodo } = await req.json();
    const pedido = String(periodo ?? "").trim().slice(0, 120);
    if (!pedido) return json({ error: "pedido vazio" }, 400);

    const key = Deno.env.get("GEMINI_API_KEY");
    if (!key) return json({ error: "GEMINI_API_KEY não configurada" }, 500);

    const prompt =
`Você é o curador da linha do tempo da civilização do clube de leitura "Marginália" (história, filosofia, literatura, arte e música em diálogo contínuo).
O leitor quer viajar até: "${pedido}".

Componha um retrato breve e REAL desse período (ou tema) — vá além do óbvio quando possível:
- "epigrafe": 1 frase em português do Brasil que capture o espírito do período, tom literário e culto, sem clichê.
- "contexto": exatamente 5 itens, um por eixo — hist, phi, lit, art, music — cada um com um acontecimento, obra ou figura REAL e verificável pertinente ao período:
  { "cat": "hist" | "phi" | "lit" | "art" | "music", "ano": "ano de exibição, ex.: '1148' ou '44 a.C.'", "titulo": "nome curto", "nota": "1 frase em português do Brasil conectando ao período" }

Use APENAS fatos consolidados; em dúvida sobre a data, use a mais aceita.
Responda APENAS um objeto JSON (sem texto fora dele):
{ "epigrafe": "...", "contexto": [ ...5 itens... ] }`;

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
        }),
      },
    );

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    let out: Record<string, unknown> = {};
    try {
      const parsed = JSON.parse(text);
      out = Array.isArray(parsed) ? (parsed[0] ?? {}) : parsed;
    } catch {
      out = {};
    }

    const cats = ["hist", "phi", "lit", "art", "music"];
    const contexto = Array.isArray(out.contexto)
      ? (out.contexto as Record<string, unknown>[])
          .filter((c) => c && c.titulo && cats.includes(String(c.cat)))
          .slice(0, 5)
      : [];
    if (!contexto.length) return json({ error: "não consegui compor o período" }, 422);

    return json({ epigrafe: String(out.epigrafe ?? ""), contexto });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
