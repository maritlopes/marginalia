// lib/sources.jsx — fontes externas (Open Library + Wikipedia)
// Tudo é client-side, sem API keys. Cache leve em memória + sessionStorage.

const CACHE = {};

function _cacheGet(k) {
  if (CACHE[k] !== undefined) return CACHE[k];
  try {
    const raw = sessionStorage.getItem('mg:src:' + k);
    if (raw) {
      const parsed = JSON.parse(raw);
      CACHE[k] = parsed;
      return parsed;
    }
  } catch {}
  return undefined;
}
function _cacheSet(k, v) {
  CACHE[k] = v;
  try { sessionStorage.setItem('mg:src:' + k, JSON.stringify(v)); } catch {}
}

const Sources = {
  // ─── OPEN LIBRARY ───────────────────────────────────────────
  // Capa por ISBN: usa o endpoint covers.openlibrary.org direto via <img src>
  // (não precisa de fetch — economiza request)
  coverByISBN(isbn, size = 'L') {
    if (!isbn) return null;
    return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`;
  },

  // Busca livro por ISBN — retorna { title, author, pages, year, cover }
  async lookupISBN(isbn) {
    if (!isbn) return null;
    const k = 'isbn:' + isbn;
    const cached = _cacheGet(k);
    if (cached) return cached;
    try {
      const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
      const data = await res.json();
      const book = data['ISBN:' + isbn];
      if (!book) { _cacheSet(k, null); return null; }
      const result = {
        title: book.title,
        author: (book.authors?.[0]?.name) || 'Desconhecido',
        pages: book.number_of_pages || null,
        year: book.publish_date || null,
        publisher: book.publishers?.[0]?.name || null,
        cover: book.cover?.large || book.cover?.medium || this.coverByISBN(isbn),
        subjects: (book.subjects || []).slice(0, 5).map(s => s.name || s),
        olKey: book.key,
      };
      _cacheSet(k, result);
      return result;
    } catch (e) {
      console.warn('[Marginália] lookup ISBN falhou', isbn, e);
      return null;
    }
  },

  // Busca por título — útil quando não há ISBN
  async searchByTitle(query, limit = 5) {
    if (!query) return [];
    const k = 'q:' + query;
    const cached = _cacheGet(k);
    if (cached) return cached;
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
      const data = await res.json();
      const results = (data.docs || []).map(d => ({
        title: d.title,
        author: (d.author_name || ['Desconhecido'])[0],
        year: d.first_publish_year,
        isbn: (d.isbn || [])[0] || null,
        cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg` : null,
        olKey: d.key,
      }));
      _cacheSet(k, results);
      return results;
    } catch (e) {
      console.warn('[Marginália] busca por título falhou', query, e);
      return [];
    }
  },

  // ─── WIKIPEDIA (autor) ──────────────────────────────────────
  // Resumo do autor (em pt) com retrato — REST API gratuita
  async authorSummary(name, lang = 'pt') {
    if (!name) return null;
    const k = `wiki:${lang}:${name}`;
    const cached = _cacheGet(k);
    if (cached !== undefined) return cached;
    try {
      const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
      if (!res.ok) {
        // fallback para inglês se PT não tem
        if (lang === 'pt') return this.authorSummary(name, 'en');
        _cacheSet(k, null);
        return null;
      }
      const data = await res.json();
      const result = {
        title: data.title,
        extract: data.extract,
        thumbnail: data.thumbnail?.source || null,
        portrait: data.originalimage?.source || data.thumbnail?.source || null,
        url: data.content_urls?.desktop?.page || null,
        lang,
      };
      _cacheSet(k, result);
      return result;
    } catch (e) {
      console.warn('[Marginália] Wikipedia falhou', name, e);
      return null;
    }
  },
};

window.Sources = Sources;
