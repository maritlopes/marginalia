// lib/sources.jsx — fontes externas (Google Books + Open Library + Wikipedia)
// Cache leve em memória + sessionStorage.

// Chave da API do Google Books (restrita por referrer ao domínio do app — pode
// ficar no código, igual à chave pública do Supabase). Vazia = usa sem chave
// (cota global compartilhada, sujeita a 429). Cole a chave entre as aspas:
const GOOGLE_BOOKS_KEY = 'AIzaSyBZfN2cMIPWl5ehNmC5bzeefSIl-vVZxoI';

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

  // Busca por título — usa Google Books (melhor cobertura PT, traz páginas e ano da
  // edição), com Open Library como reserva. Útil quando não há ISBN.
  async searchByTitle(query, limit = 8) {
    if (!query) return [];
    const k = 'gq:' + query;
    const cached = _cacheGet(k);
    if (cached) return cached;
    let results = [];
    try {
      let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${limit}&printType=books&country=BR`;
      if (GOOGLE_BOOKS_KEY) url += '&key=' + GOOGLE_BOOKS_KEY;
      const res = await fetch(url);
      const data = await res.json();
      results = (data.items || []).map(it => {
        const v = it.volumeInfo || {};
        let cover = (v.imageLinks && (v.imageLinks.thumbnail || v.imageLinks.smallThumbnail)) || null;
        if (cover) cover = cover.replace(/^http:/, 'https:').replace(/&edge=curl/, '').replace(/zoom=\d/, 'zoom=2');
        const ids = v.industryIdentifiers || [];
        const isbnObj = ids.find(x => x.type === 'ISBN_13') || ids.find(x => x.type === 'ISBN_10') || ids[0];
        return {
          title: v.title + (v.subtitle ? ': ' + v.subtitle : ''),
          author: (v.authors && v.authors[0]) || 'Desconhecido',
          year: v.publishedDate ? String(v.publishedDate).slice(0, 4) : null,
          pages: v.pageCount || null,
          publisher: v.publisher || null,
          cover,
          isbn: isbnObj ? isbnObj.identifier : null,
          subjects: v.categories || [],
          lang: v.language || null,
        };
      }).filter(r => r.title);
      // edições em português primeiro (a usuária lê em PT) — ordenação estável
      results.sort((a, b) => (b.lang === 'pt' ? 1 : 0) - (a.lang === 'pt' ? 1 : 0));
    } catch (e) {
      console.warn('[Marginália] Google Books falhou', query, e);
    }
    // reserva: Open Library, se o Google não trouxe nada
    if (!results.length) {
      try { results = await this._searchOpenLibrary(query, limit); } catch { results = []; }
    }
    _cacheSet(k, results);
    return results;
  },

  // reserva: busca por título no Open Library
  async _searchOpenLibrary(query, limit = 8) {
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=title,author_name,first_publish_year,isbn,cover_i,number_of_pages_median,publisher,key`);
    const data = await res.json();
    return (data.docs || []).map(d => ({
      title: d.title,
      author: (d.author_name || ['Desconhecido'])[0],
      year: d.first_publish_year || null,
      pages: d.number_of_pages_median || null,
      publisher: (d.publisher || [])[0] || null,
      isbn: (d.isbn || [])[0] || null,
      cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg` : null,
      olKey: d.key,
    }));
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
