// lib/storage.jsx — camada simples de persistência em localStorage
// Tudo é guardado em uma única chave 'marginalia.v1' para facilitar export/import.

const KEY = 'marginalia.v1';

const DEFAULT_STATE = {
  // preferências do app
  prefs: {
    accent: 'terracotta',     // terracotta · olive · ochre
    homeVariant: 'A',          // A · B · C
    density: 'comfortable',    // comfortable · compact
    mode: 'light',             // light · dark
    nivel: 'profundo',         // iniciante · intermediario · profundo
    lang: 'pt',                // pt · en
  },
  // biblioteca pessoal — começa vazia, herda dos seeds em data.jsx se vazia
  books: null,
  // notas do leitor — começam vazias
  notes: null,
  // progresso por livro: { [bookId]: { currentPage, lastRead } }
  progress: {},
  // ecos aceitos / recusados: { [ponteId]: 'aceito' | 'recusado' }
  ecos: {},
  // criado em
  createdAt: null,
  updatedAt: null,
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seed = { ...DEFAULT_STATE, createdAt: new Date().toISOString() };
      localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('[Marginália] localStorage indisponível:', e);
    return { ...DEFAULT_STATE };
  }
}

function save(state) {
  try {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(state));
    // agenda envio à nuvem, se a sincronização estiver ativa
    if (typeof window.__onLocalSave === 'function') window.__onLocalSave();
  } catch (e) {
    console.warn('[Marginália] erro ao salvar:', e);
  }
}

const MG = {
  // estado completo
  getState: load,
  setState: save,

  // prefs
  getPrefs() { return load().prefs; },
  setPrefs(patch) {
    const s = load();
    s.prefs = { ...s.prefs, ...patch };
    save(s);
    return s.prefs;
  },

  // books — usa fallback dos seeds se a biblioteca local for nula
  getBooks(seedBooks = []) {
    const s = load();
    return s.books === null ? seedBooks : s.books;
  },
  setBooks(books) {
    const s = load();
    s.books = books;
    save(s);
  },
  addBook(book) {
    const books = this.getBooks();
    const next = [...books, book];
    this.setBooks(next);
    if (typeof window._refreshLive === 'function') window._refreshLive();
    if (typeof window.__rerender === 'function') window.__rerender();
    return next;
  },
  updateBook(bookId, patch) {
    // copy-on-write: se o livro é seed (não está em storage ainda),
    // copia o seed para storage com o patch aplicado; futuras edições gridam.
    const stored = this.getBooks([]);
    const inStorage = stored.find(b => b.id === bookId);
    let next;
    if (inStorage) {
      next = stored.map(b => b.id === bookId ? { ...b, ...patch } : b);
    } else {
      // procura no seed (window.BOOKS_SEED) e copia
      const seed = (typeof window.BOOKS_SEED !== 'undefined')
        ? window.BOOKS_SEED.find(b => b.id === bookId)
        : null;
      if (seed) {
        next = [...stored, { ...seed, ...patch }];
      } else {
        return stored;
      }
    }
    this.setBooks(next);
    if (typeof window._refreshLive === 'function') window._refreshLive();
    if (typeof window.__rerender === 'function') window.__rerender();
    return next;
  },

  removeBook(bookId) {
    const stored = this.getBooks([]);
    const gone = stored.find(b => b.id === bookId);
    const next = stored.filter(b => b.id !== bookId);
    this.setBooks(next);
    // remove também as notas desse livro (por id; notas antigas, pelo título)
    if (gone) {
      const notes = this.getNotes();
      const kept = notes.filter(n => n.bookId !== bookId && (!gone.title || n.book !== gone.title));
      if (kept.length !== notes.length) this.setNotes(kept);
    }
    // limpa também o progresso guardado desse livro
    const s = load();
    if (s.progress && s.progress[bookId]) { delete s.progress[bookId]; save(s); }
    if (typeof window._refreshLive === 'function') window._refreshLive();
    if (typeof window.__rerender === 'function') window.__rerender();
    return next;
  },

  // notes
  getNotes(seedNotes = []) {
    const s = load();
    return s.notes === null ? seedNotes : s.notes;
  },
  setNotes(notes) {
    const s = load();
    s.notes = notes;
    save(s);
  },
  addNote(note) {
    const notes = this.getNotes();
    const withId = { id: 'n_' + Date.now(), date: 'agora', ...note };
    const next = [withId, ...notes];
    this.setNotes(next);
    if (typeof window._refreshLive === 'function') window._refreshLive();
    if (typeof window.__rerender === 'function') window.__rerender();
    return withId;
  },
  removeNote(noteId) {
    const next = this.getNotes().filter(n => n.id !== noteId);
    this.setNotes(next);
    if (typeof window._refreshLive === 'function') window._refreshLive();
    if (typeof window.__rerender === 'function') window.__rerender();
    return next;
  },

  // registro de leitura (páginas lidas por dia) — alimenta "Esta semana" e o ritmo
  getReadingLog() {
    const s = load();
    return Array.isArray(s.readingLog) ? s.readingLog : [];
  },
  logReading(pages, bookId) {
    const n = parseInt(pages, 10);
    if (!n || n <= 0) return null;
    const s = load();
    const log = Array.isArray(s.readingLog) ? s.readingLog : [];
    const d = new Date();
    const date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const entry = { id: 'r_' + Date.now(), date, pages: n, bookId: bookId || null };
    s.readingLog = [entry, ...log];
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
    return entry;
  },
  removeReading(id) {
    const s = load();
    s.readingLog = (Array.isArray(s.readingLog) ? s.readingLog : []).filter(e => e.id !== id);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },

  // progresso de leitura
  getProgress(bookId) {
    return load().progress[bookId] || null;
  },
  setProgress(bookId, currentPage) {
    const s = load();
    s.progress[bookId] = { currentPage, lastRead: new Date().toISOString() };
    save(s);
  },

  // ecos
  getEco(ponteId) { return load().ecos[ponteId] || null; },
  setEco(ponteId, status) {
    const s = load();
    s.ecos[ponteId] = status;
    save(s);
  },

  // ─── adesão social ──────────────────────────────────────────
  // grupos e desafios em que a pessoa entrou — sempre opt-in
  getJoinedGrupos() { return load().joinedGrupos || []; },
  isJoinedGrupo(id) { return this.getJoinedGrupos().includes(id); },
  joinGrupo(id) {
    const s = load();
    s.joinedGrupos = s.joinedGrupos || [];
    if (!s.joinedGrupos.includes(id)) s.joinedGrupos.push(id);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },
  leaveGrupo(id) {
    const s = load();
    s.joinedGrupos = (s.joinedGrupos || []).filter(x => x !== id);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },

  getJoinedDesafios() { return load().joinedDesafios || []; },
  isJoinedDesafio(id) { return this.getJoinedDesafios().includes(id); },
  joinDesafio(id) {
    const s = load();
    s.joinedDesafios = s.joinedDesafios || [];
    if (!s.joinedDesafios.includes(id)) s.joinedDesafios.push(id);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },
  leaveDesafio(id) {
    const s = load();
    s.joinedDesafios = (s.joinedDesafios || []).filter(x => x !== id);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },

  // ─── metas / reading challenges ──────────────────────────────
  // Cada meta: { id, title, type, target, period, startsAt, endsAt, filter, color, createdAt }
  // type: 'count' | 'pages' | 'theme' | 'author' | 'free'
  // period: 'month' | 'bimester' | 'trimester' | 'semester' | 'year' | 'custom' | 'open'
  getChallenges() { return load().challenges || []; },
  addChallenge(challenge) {
    const s = load();
    s.challenges = s.challenges || [];
    const id = challenge.id || ('m_' + Date.now().toString(36));
    const created = { id, createdAt: new Date().toISOString(), ...challenge };
    s.challenges.push(created);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
    return created;
  },
  updateChallenge(id, patch) {
    const s = load();
    s.challenges = (s.challenges || []).map(c => c.id === id ? { ...c, ...patch } : c);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },
  removeChallenge(id) {
    const s = load();
    s.challenges = (s.challenges || []).filter(c => c.id !== id);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },
  // Calcula progresso de uma meta com base nos livros atuais
  computeChallengeProgress(challenge) {
    const books = window.BOOKS || [];
    let pool = books.filter(b => b.status === 'read');
    // filtro por data, se a meta tem janela
    if (challenge.startsAt && challenge.endsAt && challenge.period !== 'open') {
      const s = new Date(challenge.startsAt).getTime();
      const e = new Date(challenge.endsAt).getTime();
      pool = pool.filter(b => {
        const t = b.finishedAt ? new Date(b.finishedAt).getTime() : null;
        // sem data: conta sempre (MVP — usuária pode editar livro depois)
        return t === null || (t >= s && t <= e);
      });
    }
    // filtro por tema
    if (challenge.filter?.theme) {
      pool = pool.filter(b => (b.theme || '').toLowerCase().includes(challenge.filter.theme.toLowerCase()));
    }
    // filtro por autor
    if (challenge.filter?.author) {
      pool = pool.filter(b => (b.author || '').toLowerCase().includes(challenge.filter.author.toLowerCase()));
    }
    let progress;
    if (challenge.type === 'pages') {
      const sum = pool.reduce((acc, b) => acc + (b.pages || 0), 0);
      progress = { value: sum, target: challenge.target, unit: 'páginas' };
    } else if (challenge.type === 'free') {
      // meta livre — só guarda título/descrição, não calcula auto
      progress = { value: 0, target: 1, unit: 'projeto' };
    } else {
      progress = { value: pool.length, target: challenge.target, unit: 'livros' };
    }
    progress.pct = Math.min(100, Math.round((progress.value / Math.max(1, progress.target)) * 100));
    progress.books = pool.map(b => b.id);
    return progress;
  },

  // export / import — para backup manual
  exportJSON() {
    return JSON.stringify(load(), null, 2);
  },
  importJSON(json) {
    try {
      const parsed = JSON.parse(json);
      // valida que parece mesmo um backup da Marginália, para não corromper o estado
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
      const okArr = (v) => v === null || v === undefined || Array.isArray(v);
      if (!okArr(parsed.books) || !okArr(parsed.notes) || !okArr(parsed.challenges)) return false;
      // coage campos esperados para o formato certo antes de salvar
      const clean = {
        ...parsed,
        books: Array.isArray(parsed.books) ? parsed.books : null,
        notes: Array.isArray(parsed.notes) ? parsed.notes : null,
        challenges: Array.isArray(parsed.challenges) ? parsed.challenges : [],
      };
      save(clean);
      return true;
    } catch {
      return false;
    }
  },
  reset() {
    localStorage.removeItem(KEY);
  },
};

window.MG = MG;
