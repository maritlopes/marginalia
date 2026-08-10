// sw.js — service worker para Marginália
// Estratégia: NETWORK-FIRST para os arquivos do próprio app (HTML, JSX, manifest),
// para que novas versões publicadas cheguem sempre que houver internet; o cache
// serve apenas como reserva offline. Network-first também para as APIs externas.

// ⚠️ BUMPAR esta versão a CADA deploy de mudança no app — é o que força o
// PWA instalado do iPhone a buscar a versão nova (o app fica residente e só
// recarrega quando o service worker muda; sw.js idêntico = celular travado na
// versão velha, enquanto o computador atualiza por recarregar a página).
const CACHE = 'marginalia-v66';
// O app agora é um bundle Vite com hash no nome (ex.: /assets/index-abc123.js);
// o nome muda a cada versão e não dá pra listar aqui — o network-first abaixo
// guarda o bundle no cache na primeira visita e o offline segue funcionando.
const ASSETS = [
  './',
  './manifest.json',
  './icon.svg',
  './symbol.png',
  './logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS).catch(() => null))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// network-first genérico: tenta a rede, atualiza o cache, e cai no cache se
// offline OU se o servidor responder erro (404/5xx). O caso do 404 importa:
// depois de um deploy, o bundle antigo (hash velho) some do GitHub Pages — se um
// index.html velho saiu do cache e pede esse bundle, sem o fallback a resposta
// 404 chegava ao navegador e o app abria como página em branco.
function networkFirst(request) {
  return fetch(request).then((res) => {
    if (res && res.ok) {                       // só guarda respostas boas (evita cachear 503/erros)
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(request, copy));
      return res;
    }
    return caches.match(request).then((hit) => hit || res);
  }).catch(() => caches.match(request));
}

self.addEventListener('fetch', (event) => {
  // Só tratamos GET; deixamos o resto passar direto.
  if (event.request.method !== 'GET') return;
  event.respondWith(networkFirst(event.request));
});
