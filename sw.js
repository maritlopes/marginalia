// sw.js — service worker para Marginália
// Estratégia: NETWORK-FIRST para os arquivos do próprio app (HTML, JSX, manifest),
// para que novas versões publicadas cheguem sempre que houver internet; o cache
// serve apenas como reserva offline. Network-first também para as APIs externas.

const CACHE = 'marginalia-v5';
const ASSETS = [
  './',
  './Marginalia.html',
  './manifest.json',
  './icon.svg',
  './symbol.png',
  './tokens.jsx',
  './data.jsx',
  './lib/storage.jsx',
  './lib/sources.jsx',
  './lib/i18n.jsx',
  './lib/share.jsx',
  './frames/ios-frame.jsx',
  './home-variants.jsx',
  './screens.jsx',
  './lib/cloud.jsx',
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

// network-first genérico: tenta a rede, atualiza o cache, e só cai no cache se offline.
function networkFirst(request) {
  return fetch(request).then((res) => {
    if (res && res.ok) {                       // só guarda respostas boas (evita cachear 503/erros)
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(request, copy));
    }
    return res;
  }).catch(() => caches.match(request));
}

self.addEventListener('fetch', (event) => {
  // Só tratamos GET; deixamos o resto passar direto.
  if (event.request.method !== 'GET') return;
  event.respondWith(networkFirst(event.request));
});
