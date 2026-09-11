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
    // falha ao persistir (armazenamento cheio?) NÃO pode ser silenciosa: a
    // leitora acharia que salvou e perderia a edição ao fechar. Avisa no
    // status da nuvem (visível na Conta). NÃO agenda push aqui — o push lê o
    // localStorage (que ficou com o estado VELHO) e regrediria a nuvem.
    console.error('[Marginália] FALHA ao salvar neste aparelho:', e);
    window.__cloudStatus = '⚠️ Não consegui gravar neste aparelho (armazenamento cheio?) — a última edição pode se perder';
    if (typeof window.__rerender === 'function') window.__rerender();
  }
}

// Acende a medalha do Nobel num livro recém-criado, casando o autor com a
// lista de laureados (window.nobelForAuthor, definida em data.jsx). Roda em
// runtime — data.jsx já carregou quando a leitora adiciona um livro.
function enrichNobel(book) {
  if (!book || book.nobel) return book;
  const fn = (typeof window !== 'undefined') && window.nobelForAuthor;
  if (!fn) return book;
  const nobel = fn(book.author);
  return nobel ? { ...book, nobel } : book;
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
    book = { ...enrichNobel(book), updatedAt: new Date().toISOString() };
    const books = this.getBooks();
    const next = [...books, book];
    this.setBooks(next);
    // nasceu direto na Estante? ganha lugar no mapa da Travessia
    if (book.status && typeof window.__situarNaTravessia === 'function') {
      window.__situarNaTravessia(book);
    }
    if (typeof window._refreshLive === 'function') window._refreshLive();
    if (typeof window.__rerender === 'function') window.__rerender();
    return next;
  },
  updateBook(bookId, patch) {
    // se o autor mudou, reavalia a medalha do Nobel (acende ou apaga)
    if (patch && Object.prototype.hasOwnProperty.call(patch, 'author') && !('nobel' in patch)) {
      const fn = (typeof window !== 'undefined') && window.nobelForAuthor;
      if (fn) patch = { ...patch, nobel: fn(patch.author) || undefined };
    }
    // carimbo de edição por livro — no merge da nuvem, a edição mais recente
    // DESTE livro prevalece (não é sobrescrita por um aparelho com estado mais
    // novo no geral mas com versão velha do livro). Ver unionById em lib/cloud.jsx.
    patch = { ...patch, updatedAt: new Date().toISOString() };
    // copy-on-write: se o livro é seed (não está em storage ainda),
    // copia o seed para storage com o patch aplicado; futuras edições gridam.
    const stored = this.getBooks([]);
    const inStorage = stored.find(b => b.id === bookId);
    // status ANTES da edição (conta também o livro-vitrine ainda só no seed)
    const seedAntes = (!inStorage && typeof window !== 'undefined' && window.BOOKS_SEED)
      ? window.BOOKS_SEED.find(b => b.id === bookId) : null;
    const statusAntes = ((inStorage || seedAntes || {}).status) || null;
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
    // SAIU DO ACERVO E ENTROU NA ESTANTE: é o momento em que o livro deixa de
    // dormir, e o único em que vale gastar uma chamada de IA para situá-lo no
    // tempo. O mapa da Travessia se completa assim, uma leitura de cada vez.
    if (patch.status && !statusAntes && typeof window.__situarNaTravessia === 'function') {
      const vivo = next.find(b => b.id === bookId);
      if (vivo) window.__situarNaTravessia(vivo);
    }
    if (typeof window._refreshLive === 'function') window._refreshLive();
    if (typeof window.__rerender === 'function') window.__rerender();
    return next;
  },

  removeBook(bookId) {
    const stored = this.getBooks([]);
    const gone = stored.find(b => b.id === bookId);
    // TOMBSTONE, não deleção: o merge da nuvem é união por id e "nunca apaga" —
    // um item removido de verdade REAPARECERIA quando outro aparelho (que ainda
    // o tem) sincronizasse. Marcar deleted:true com carimbo novo faz a remoção
    // VENCER no unionById e se propagar a todos os aparelhos. A UI filtra os
    // tombstones em _refreshLive (data.jsx). A capa é descartada para o
    // tombstone não pesar no payload.
    const next = stored.map(b => b.id === bookId
      ? { id: b.id, title: b.title, author: b.author, deleted: true, cover: null, status: null, mark: null, updatedAt: new Date().toISOString() }
      : b);
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
  updateNote(noteId, patch) {
    const next = this.getNotes().map(n => n.id === noteId ? { ...n, ...patch } : n);
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
  // Cada registro: { id, date, pages, minutes, bookId, src }. Páginas E/OU minutos —
  // vale registrar só o tempo (Foco) ou só as páginas (Li hoje / Onde estou).
  // src: 'hoje' (Li hoje na Home) · 'plano' (atualizou a página no Plano) · 'foco' (sessão do timer)
  logReading(pages, bookId, opts) {
    const o = opts || {};
    const n = Math.max(0, parseInt(pages, 10) || 0);
    const min = Math.max(0, parseInt(o.minutes, 10) || 0);
    if (!n && !min) return null;
    const s = load();
    const log = Array.isArray(s.readingLog) ? s.readingLog : [];
    const d = new Date();
    const date = o.date || (d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'));
    const entry = { id: 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), date, pages: n, minutes: min, bookId: bookId || null, src: o.src || 'hoje' };
    s.readingLog = [entry, ...log];
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
    return entry;
  },
  // meta diária — { pages, minutes } (qualquer um dos dois batido = dia cumprido); null = sem meta
  getDailyGoal() {
    const s = load();
    const g = s.dailyGoal;
    if (!g || (!g.pages && !g.minutes)) return null;
    return { pages: parseInt(g.pages, 10) || 0, minutes: parseInt(g.minutes, 10) || 0 };
  },
  setDailyGoal(goal) {
    const s = load();
    const pages = goal ? Math.max(0, parseInt(goal.pages, 10) || 0) : 0;
    const minutes = goal ? Math.max(0, parseInt(goal.minutes, 10) || 0) : 0;
    s.dailyGoal = (pages || minutes) ? { pages, minutes } : null;
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
    return s.dailyGoal;
  },
  // Estatísticas do diário — tudo derivado do readingLog (nada é gravado).
  // hoje · sequência de dias seguidos · últimos 7 dias (geral e do livro) ·
  // páginas por hora · calendário do mês. bookId é opcional (ritmo daquele livro).
  readingStats(bookId) {
    const log = this.getReadingLog();
    const keyOf = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const hojeK = keyOf(hoje);
    const byDay = {};
    for (const e of log) {
      if (!e || !e.date) continue;
      const d = byDay[e.date] || (byDay[e.date] = { pages: 0, minutes: 0 });
      d.pages += e.pages || 0; d.minutes += e.minutes || 0;
    }
    const goal = this.getDailyGoal();
    const cumpriu = (d) => !!goal && !!d && ((goal.pages > 0 && d.pages >= goal.pages) || (goal.minutes > 0 && d.minutes >= goal.minutes));
    const leu = (d) => !!d && (d.pages > 0 || d.minutes > 0);
    const hojeT = byDay[hojeK] || { pages: 0, minutes: 0 };
    // sequência: dias seguidos com leitura terminando hoje — ou ontem, se hoje ainda não leu
    let streak = 0; let hojeFalta = false;
    { const c = new Date(hoje);
      if (!leu(byDay[keyOf(c)])) { hojeFalta = true; c.setDate(c.getDate() - 1); }
      while (leu(byDay[keyOf(c)])) { streak++; c.setDate(c.getDate() - 1); if (streak > 3660) break; } }
    if (hojeFalta && streak === 0) hojeFalta = false;
    // últimos 7 dias (hoje incluso)
    const janela = (n) => { const ks = []; for (let i = 0; i < n; i++) { const c = new Date(hoje); c.setDate(hoje.getDate() - i); ks.push(keyOf(c)); } return ks; };
    const k7 = janela(7);
    const soma = (entries) => entries.reduce((a, e) => ({ pages: a.pages + (e.pages || 0), minutes: a.minutes + (e.minutes || 0), days: a.days.add(e.date) }), { pages: 0, minutes: 0, days: new Set() });
    const e7 = log.filter(e => e && k7.includes(e.date));
    const g7 = soma(e7);
    const b7 = soma(bookId ? e7.filter(e => e.bookId === bookId) : []);
    // páginas por hora: só registros com páginas E minutos (últimos 60 dias); precisa de ≥ 20 min somados
    const k60 = janela(60);
    const ambos = log.filter(e => e && k60.includes(e.date) && e.pages > 0 && e.minutes > 0);
    const mAmbos = ambos.reduce((a, e) => a + e.minutes, 0);
    const pAmbos = ambos.reduce((a, e) => a + e.pages, 0);
    const pagesPerHour = mAmbos >= 20 ? Math.round(pAmbos / (mAmbos / 60)) : null;
    // calendário do mês corrente
    const y = hoje.getFullYear(), m = hoje.getMonth();
    const nDias = new Date(y, m + 1, 0).getDate();
    const mes = [];
    for (let dd = 1; dd <= nDias; dd++) {
      const k = keyOf(new Date(y, m, dd));
      const d = byDay[k];
      mes.push({ dia: dd, key: k, pages: d ? d.pages : 0, minutes: d ? d.minutes : 0, leu: leu(d), meta: cumpriu(d), hoje: k === hojeK, futuro: k > hojeK });
    }
    const primeiroDow = (new Date(y, m, 1).getDay() + 6) % 7; // 0 = segunda
    const diasLidosMes = mes.filter(x => x.leu).length;
    return {
      goal, hoje: hojeT, hojeCumpriu: cumpriu(hojeT), streak, hojeFalta,
      last7: { pages: g7.pages, minutes: g7.minutes, days: g7.days.size },
      book7: { pages: b7.pages, minutes: b7.minutes, days: b7.days.size },
      pagesPerHour, mes, primeiroDow, diasLidosMes,
    };
  },
  // corrigir um registro (páginas e/ou minutos lançados errado); zerar os dois = remover
  updateReading(id, patch) {
    const s = load();
    const log = Array.isArray(s.readingLog) ? s.readingLog : [];
    const pages = Math.max(0, parseInt(patch && patch.pages, 10) || 0);
    const minutes = Math.max(0, parseInt(patch && patch.minutes, 10) || 0);
    s.readingLog = (!pages && !minutes)
      ? log.filter(e => e.id !== id)
      : log.map(e => e.id === id ? { ...e, pages, minutes, updatedAt: new Date().toISOString() } : e);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
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

// ─── capas leves ──────────────────────────────────────────────
// Comprime uma imagem (dataURL ou URL) para miniatura JPEG leve.
// As capas aparecem com no máximo ~120px de largura; 360px preserva
// nitidez em telas retina (3x). Capa embutida grande estoura o limite
// de localStorage do iOS (~5 MB) e a Biblioteca não persiste no iPad.
function compressCover(src, maxW = 300, maxH = 450, quality = 0.62) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxW / img.width, maxH / img.height);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        const cx = cv.getContext('2d');
        cx.fillStyle = '#fff'; cx.fillRect(0, 0, w, h); // PNG transparente → fundo branco
        cx.drawImage(img, 0, 0, w, h);
        resolve(cv.toDataURL('image/jpeg', quality));
      } catch (e) { reject(e); }
    };
    img.onerror = () => reject(new Error('imagem inválida'));
    img.src = src;
  });
}

MG.compressCover = compressCover;

// Migração única do legado: recomprime capas base64 pesadas já guardadas.
// Roda no aparelho que tem as capas (Mac/celular); o push leva o slim à
// nuvem e o iPad passa a conseguir persistir a Biblioteca.
MG.slimLegacyCovers = async function () {
  const FAT = 18000, SLIM_VER = 2;
  const books = this.getBooks([]);
  // coverSlim marca capa já recomprimida — evita reprocessar a cada abertura
  // quando a miniatura ainda fica acima do limiar (imagens que comprimem mal)
  const fat = books.filter(b => b && typeof b.cover === 'string'
    && b.cover.startsWith('data:') && b.cover.length > FAT && b.coverSlim !== SLIM_VER);
  let done = 0;
  for (const b of fat) {
    try {
      const slim = await compressCover(b.cover);
      if (slim && slim.length < b.cover.length) { this.updateBook(b.id, { cover: slim, coverSlim: SLIM_VER }); done++; } else { this.updateBook(b.id, { coverSlim: SLIM_VER }); }
    } catch (e) { console.warn('[Marginália] capa não recomprimida:', b.title, e); }
  }
  if (done) console.info('[Marginália] capas recomprimidas:', done);
  return done;
};

// agenda a migração depois do boot do app (barata quando não há capa gorda)
setTimeout(() => { MG.slimLegacyCovers().catch(() => {}); }, 3000);

// Migração leve: acende a medalha 🏅 nos livros JÁ na Biblioteca cujo autor é
// laureado mas que entraram antes desta detecção (idempotente — só toca livros
// sem campo nobel). Resolve o caso da leitora que adicionou um Nobel e não viu
// a moeda. Roda uma vez por boot, depois que data.jsx expôs nobelForAuthor.
MG.detectNobelInLibrary = function () {
  if (typeof window === 'undefined' || !window.nobelForAuthor) return 0;
  const books = this.getBooks([]);
  let done = 0;
  for (const b of books) {
    if (!b || b.nobel || b.deleted) continue;
    const nobel = window.nobelForAuthor(b.author);
    if (nobel) { this.updateBook(b.id, { nobel }); done++; }
  }
  if (done) console.info('[Marginália] medalhas Nobel acesas:', done);
  return done;
};
setTimeout(() => { try { MG.detectNobelInLibrary(); } catch (e) {} }, 3500);

window.MG = MG;
