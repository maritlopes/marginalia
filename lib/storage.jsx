// lib/storage.jsx — camada simples de persistência em localStorage
// Tudo é guardado em uma única chave 'marginalia.v1' para facilitar export/import.

const KEY = 'marginalia.v1';

// ── Datas no fuso de quem lê ──────────────────────────────────────────────
// 'YYYY-MM-DD' puro, lido com new Date(), vira meia-noite em UTC = 21h da VÉSPERA no
// Brasil. E um carimbo ISO (toISOString) cortado em 10 caracteres dá o dia em UTC.
// Estas três funções dão sempre o dia/instante LOCAL.
// diaLocal(v): 'YYYY-MM-DD' (de uma data pura ou de um carimbo ISO), ou '' se inválido
function diaLocal(v) {
  const s = String(v || '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (!s) return '';
  const d = new Date(s);
  if (isNaN(d.getTime())) return s.slice(0, 10);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
// início (00:00:00) e fim (23:59:59.999) de um dia 'YYYY-MM-DD' no horário local, em ms
function inicioDoDia(ymd) { const m = String(ymd || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : NaN; }
function fimDoDia(ymd) { const m = String(ymd || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3], 23, 59, 59, 999).getTime() : NaN; }
window.diaLocal = diaLocal; window.inicioDoDia = inicioDoDia; window.fimDoDia = fimDoDia;

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
  // O QUE FICOU — um registro por livro por dia: { id: 'f_<dia>_<livro>', day, bookId, sentimento, frase, origem }
  ficou: [],
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

  // notes — como livros e o diário: cada nota tem `updatedAt` e apagar vira LÁPIDE
  // (deleted:true), senão a nota apagada voltaria pelo outro aparelho no sync.
  // getNotes devolve só as vivas; as lápides ficam no estado só para propagar.
  _rawNotes() { const s = load(); return Array.isArray(s.notes) ? s.notes : []; },
  getNotes(seedNotes = []) {
    const s = load();
    return s.notes === null ? seedNotes : (Array.isArray(s.notes) ? s.notes : []).filter(n => n && !n.deleted);
  },
  // grava a lista de notas VIVAS; a nota viva que sumiu da lista vira lápide
  setNotes(notes) {
    const s = load();
    const agora = new Date().toISOString();
    const novos = (notes || []).filter(Boolean);
    const ids = new Set(novos.map(n => n.id));
    const antigos = Array.isArray(s.notes) ? s.notes : [];
    const lapides = antigos
      .filter(n => n && n.id != null && !ids.has(n.id))
      .map(n => n.deleted ? n : { id: n.id, bookId: n.bookId || null, deleted: true, updatedAt: agora });
    s.notes = [...novos, ...lapides];
    save(s);
  },
  addNote(note) {
    const notes = this.getNotes();
    const withId = { id: 'n_' + Date.now(), date: 'agora', ...note, updatedAt: new Date().toISOString() };
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
    const next = this.getNotes().map(n => n.id === noteId ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n);
    this.setNotes(next);
    if (typeof window._refreshLive === 'function') window._refreshLive();
    if (typeof window.__rerender === 'function') window.__rerender();
    return next;
  },

  // ── DIÁRIO DE LEITURA: UM registro por dia (id 'd_<data>') com páginas e minutos ──
  // Tudo o que a leitora registra num dia (Li hoje · Onde estou · Foco) SOMA na linha do
  // dia; ela pode abrir a linha e alterar os totais (acrescentar ou corrigir).
  // Remoção é por LÁPIDE (deleted:true + updatedAt) — o sync une por id e nunca apaga,
  // então uma linha apagada de verdade voltaria pelo outro aparelho. Registros antigos
  // (ids 'r_…', vários por dia) são dobrados na linha do dia na primeira escrita daquele dia.
  getReadingLog() {
    const s = load();
    return (Array.isArray(s.readingLog) ? s.readingLog : []).filter(e => e && !e.deleted);
  },
  _dayEntry(s, date) {
    const log = Array.isArray(s.readingLog) ? s.readingLog : [];
    const vivos = log.filter(e => e && !e.deleted && e.date === date);
    if (!vivos.length) return { log, entry: null };
    // prefere a linha canônica do dia; senão a mais antiga (dobra as outras nela)
    const canon = vivos.find(e => e.id === 'd_' + date) || vivos[vivos.length - 1];
    const agora = new Date().toISOString();
    let pages = 0, minutes = 0, bookId = canon.bookId || null;
    const books = {};
    const addB = (id, p, m) => { if (!id) return; const x = books[id] || (books[id] = { pages: 0, minutes: 0 }); x.pages += p || 0; x.minutes += m || 0; };
    for (const e of vivos) {
      pages += e.pages || 0; minutes += e.minutes || 0; if (!bookId && e.bookId) bookId = e.bookId;
      if (e.books) Object.keys(e.books).forEach(id => addB(id, e.books[id].pages, e.books[id].minutes));
      else addB(e.bookId, e.pages, e.minutes);
    }
    const entry = { ...canon, id: 'd_' + date, date, pages, minutes, bookId, books, updatedAt: agora };
    // todo registro vivo do dia que NÃO é a linha canônica vira lápide (inclusive o que
    // serviu de base, se tinha id antigo) — só assim a dobra não desfaz no sync
    const next = log
      .filter(e => !(e && e.id === 'd_' + date))
      .map(e => (e && !e.deleted && e.date === date) ? { ...e, deleted: true, updatedAt: agora } : e);
    return { log: [entry, ...next], entry };
  },
  logReading(pages, bookId, opts) {
    const o = opts || {};
    const n = Math.max(0, parseInt(pages, 10) || 0);
    const min = Math.max(0, parseInt(o.minutes, 10) || 0);
    if (!n && !min) return null;
    const s = load();
    const d = new Date();
    const date = o.date || (d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'));
    const { log, entry } = this._dayEntry(s, date);
    const agora = new Date().toISOString();
    let next;
    if (entry) {
      const books = { ...(entry.books || {}) };
      if (bookId) { const x = books[bookId] || { pages: 0, minutes: 0 }; books[bookId] = { pages: x.pages + n, minutes: x.minutes + min, updatedAt: agora }; }
      const upd = { ...entry, pages: entry.pages + n, minutes: entry.minutes + min, bookId: bookId || entry.bookId || null, books, src: o.src || entry.src || 'hoje', updatedAt: agora };
      next = log.map(e => e.id === entry.id ? upd : e);
    } else {
      const books = bookId ? { [bookId]: { pages: n, minutes: min, updatedAt: agora } } : {};
      next = [{ id: 'd_' + date, date, pages: n, minutes: min, bookId: bookId || null, books, src: o.src || 'hoje', updatedAt: agora }, ...log];
    }
    s.readingLog = next;
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
    return next.find(e => e.id === 'd_' + date) || null;
  },
  // define os TOTAIS do dia (acrescentar ou corrigir); zerar os dois = apaga o dia
  setDayTotals(date, totals) {
    const t = totals || {};
    const pages = Math.max(0, parseInt(t.pages, 10) || 0);
    const minutes = Math.max(0, parseInt(t.minutes, 10) || 0);
    const s = load();
    const { log, entry } = this._dayEntry(s, date);
    const agora = new Date().toISOString();
    let next;
    if (!pages && !minutes) {
      next = entry ? log.map(e => e.id === entry.id ? { ...e, deleted: true, updatedAt: agora } : e) : log;
    } else if (entry) {
      // a DIFERENÇA vai para o livro escolhido (chips "em qual livro?"); nunca abaixo de zero
      const books = { ...(entry.books || {}) };
      const bid = t.bookId || entry.bookId || null;
      if (bid) { const x = books[bid] || { pages: 0, minutes: 0 }; books[bid] = { pages: Math.max(0, x.pages + (pages - entry.pages)), minutes: Math.max(0, x.minutes + (minutes - entry.minutes)), updatedAt: agora }; }
      // a repartição nunca pode somar mais que o total do dia: se passou (corrigiu para baixo
      // mais do que o livro escolhido tinha), os outros livros encolhem na mesma proporção
      for (const campo of ['pages', 'minutes']) {
        const total = campo === 'pages' ? pages : minutes;
        const soma = Object.keys(books).reduce((a, id) => a + (books[id][campo] || 0), 0);
        if (soma > total) {
          const outros = Object.keys(books).filter(id => id !== bid);
          const somaOutros = outros.reduce((a, id) => a + (books[id][campo] || 0), 0);
          const sobra = Math.max(0, total - (bid && books[bid] ? books[bid][campo] || 0 : 0));
          let usado = 0;
          outros.forEach((id, i) => {
            const v = i === outros.length - 1 ? Math.max(0, sobra - usado) : (somaOutros ? Math.floor((books[id][campo] || 0) * sobra / somaOutros) : 0);
            usado += v;
            books[id] = { ...books[id], [campo]: v, updatedAt: agora };
          });
        }
      }
      next = log.map(e => e.id === entry.id ? { ...e, pages, minutes, bookId: bid, books, updatedAt: agora } : e);
    } else {
      const books = t.bookId ? { [t.bookId]: { pages, minutes, updatedAt: agora } } : {};
      next = [{ id: 'd_' + date, date, pages, minutes, bookId: t.bookId || null, books, src: 'hoje', updatedAt: agora }, ...log];
    }
    s.readingLog = next;
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },
  // compatibilidade: corrigir/remover por id (viram lápide, nunca somem do array)
  updateReading(id, patch) {
    const s = load();
    const log = Array.isArray(s.readingLog) ? s.readingLog : [];
    const pages = Math.max(0, parseInt(patch && patch.pages, 10) || 0);
    const minutes = Math.max(0, parseInt(patch && patch.minutes, 10) || 0);
    const agora = new Date().toISOString();
    s.readingLog = log.map(e => e && e.id === id ? ((!pages && !minutes) ? { ...e, deleted: true, updatedAt: agora } : { ...e, pages, minutes, updatedAt: agora }) : e);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },
  removeReading(id) {
    const s = load();
    const agora = new Date().toISOString();
    s.readingLog = (Array.isArray(s.readingLog) ? s.readingLog : []).map(e => e && e.id === id ? { ...e, deleted: true, updatedAt: agora } : e);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
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
    s._carimbos = { ...(s._carimbos || {}), dailyGoal: new Date().toISOString() }; // o sync escolhe a versão mais recente DESTA chave
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
    return s.dailyGoal;
  },
  // AJUSTES DO CALENDÁRIO DO CLUBE — quando o clube muda uma data ou uma meta,
  // ela corrige no app e a correção vale por cima do calendário de data.jsx:
  //   clubeAjustes = { [clubeId]: { [título do livro]: { abre, fim, metas:[{data,meta,page?}] } } }
  // Chave escalar do estado (como dailyGoal): sincroniza pelo `...older, ...newer`
  // do mergeStates — vence o aparelho que gravou por último.
  getClubeAjustes() {
    const s = load();
    return (s.clubeAjustes && typeof s.clubeAjustes === 'object') ? s.clubeAjustes : {};
  },
  setClubeAjuste(clubeId, livroTitle, ajuste) {
    const s = load();
    const all = (s.clubeAjustes && typeof s.clubeAjustes === 'object') ? { ...s.clubeAjustes } : {};
    const doClube = { ...(all[clubeId] || {}) };
    if (ajuste) doClube[livroTitle] = ajuste; else delete doClube[livroTitle];
    if (Object.keys(doClube).length) all[clubeId] = doClube; else delete all[clubeId];
    s.clubeAjustes = all;
    s._carimbos = { ...(s._carimbos || {}), clubeAjustes: new Date().toISOString() }; // o sync escolhe a versão mais recente DESTA chave
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
    return all;
  },

  // qual livro do clube está em curso, quando ela quer dizer à mão (clube sem calendário
  // ou fora da ordem). Fica no mesmo balaio dos ajustes, sob a chave de controle `_atual`.
  getClubeAtual(clubeId) {
    const c = this.getClubeAjustes()[clubeId];
    return (c && typeof c._atual === 'string') ? c._atual : null;
  },
  setClubeAtual(clubeId, titulo) {
    return this.setClubeAjuste(clubeId, '_atual', titulo || null);
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
    // parte DESTE livro: a repartição `books` quando existe; senão o registro inteiro se era dele
    const parteDoLivro = (e) => {
      if (!bookId) return null;
      if (e.books && e.books[bookId]) return { date: e.date, pages: e.books[bookId].pages || 0, minutes: e.books[bookId].minutes || 0 };
      if (!e.books && e.bookId === bookId) return e;
      return null;
    };
    const b7 = soma(e7.map(parteDoLivro).filter(x => x && (x.pages > 0 || x.minutes > 0)));
    // páginas por hora: só registros com páginas E minutos (últimos 60 dias); precisa de ≥ 20 min somados
    const k60 = janela(60);
    const ambos = log.filter(e => e && k60.includes(e.date) && e.pages > 0 && e.minutes > 0);
    const mAmbos = ambos.reduce((a, e) => a + e.minutes, 0);
    const pAmbos = ambos.reduce((a, e) => a + e.pages, 0);
    const pagesPerHour = mAmbos >= 20 ? Math.round(pAmbos / (mAmbos / 60)) : null;
    // constância: em quantos dos últimos 30 dias houve leitura. A janela termina hoje — ou
    // ontem, se hoje ainda não leu (como a sequência) — e, para quem começou há menos de 30
    // dias, conta só desde o primeiro registro (nunca cobra dias de antes de começar).
    const constancia = (() => {
      const datas = Object.keys(byDay).filter(k => leu(byDay[k])).sort();
      if (!datas.length) return null;
      const fimJ = new Date(hoje); if (!leu(byDay[hojeK])) fimJ.setDate(fimJ.getDate() - 1);
      const primeiro = new Date(datas[0] + 'T00:00:00');
      const desde = Math.round((fimJ - primeiro) / 86400000) + 1;
      const n = Math.max(1, Math.min(30, desde));
      let lidos = 0;
      for (let i = 0; i < n; i++) { const c = new Date(fimJ); c.setDate(fimJ.getDate() - i); if (leu(byDay[keyOf(c)])) lidos++; }
      return { lidos, janela: n };
    })();
    // calendário do mês corrente
    const { mes, primeiroDow, diasLidosMes } = this.monthCalendar(hoje.getFullYear(), hoje.getMonth());
    return {
      goal, hoje: hojeT, hojeCumpriu: cumpriu(hojeT), streak, hojeFalta, constancia,
      last7: { pages: g7.pages, minutes: g7.minutes, days: g7.days.size },
      book7: { pages: b7.pages, minutes: b7.minutes, days: b7.days.size },
      pagesPerHour, mes, primeiroDow, diasLidosMes,
    };
  },
  // calendário de UM mês qualquer (m = 0..11) — para navegar pelos meses anteriores
  monthCalendar(y, m) {
    const keyOf = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const hojeK = keyOf(hoje);
    const pref = y + '-' + String(m + 1).padStart(2, '0') + '-';
    const byDay = {};
    for (const e of this.getReadingLog()) {
      if (!e || !e.date || !String(e.date).startsWith(pref)) continue;
      const d = byDay[e.date] || (byDay[e.date] = { pages: 0, minutes: 0 });
      d.pages += e.pages || 0; d.minutes += e.minutes || 0;
    }
    const goal = this.getDailyGoal();
    const cumpriu = (d) => !!goal && !!d && ((goal.pages > 0 && d.pages >= goal.pages) || (goal.minutes > 0 && d.minutes >= goal.minutes));
    const leu = (d) => !!d && (d.pages > 0 || d.minutes > 0);
    const nDias = new Date(y, m + 1, 0).getDate();
    const mes = [];
    for (let dd = 1; dd <= nDias; dd++) {
      const k = keyOf(new Date(y, m, dd));
      const d = byDay[k];
      mes.push({ dia: dd, key: k, pages: d ? d.pages : 0, minutes: d ? d.minutes : 0, leu: leu(d), meta: cumpriu(d), hoje: k === hojeK, futuro: k > hojeK });
    }
    const primeiroDow = (new Date(y, m, 1).getDay() + 6) % 7; // 0 = segunda
    const diasLidosMes = mes.filter(x => x.leu).length;
    const paginasMes = mes.reduce((a, x) => a + x.pages, 0);
    const minutosMes = mes.reduce((a, x) => a + x.minutes, 0);
    return { y, m, mes, primeiroDow, diasLidosMes, paginasMes, minutosMes };
  },
  // tudo o que aconteceu num dia: páginas por livro (do diário), livros começados e
  // terminados naquele dia (datas do livro) e notas escritas nele (o id da nota é o carimbo)
  dayDetail(date) {
    const books = (typeof window !== 'undefined' && window.BOOKS) || [];
    const achar = (id) => books.find(b => b && b.id === id) || null;
    const doDia = this.getReadingLog().filter(e => e && e.date === date);
    let pages = 0, minutes = 0;
    const porLivro = {};
    let semLivro = { pages: 0, minutes: 0 };
    for (const e of doDia) {
      pages += e.pages || 0; minutes += e.minutes || 0;
      const bk = e.books && Object.keys(e.books).length ? e.books : (e.bookId ? { [e.bookId]: { pages: e.pages || 0, minutes: e.minutes || 0 } } : null);
      if (!bk) { semLivro.pages += e.pages || 0; semLivro.minutes += e.minutes || 0; continue; }
      let pb = 0, mb = 0;
      Object.keys(bk).forEach(id => { const x = porLivro[id] || (porLivro[id] = { pages: 0, minutes: 0 }); x.pages += bk[id].pages || 0; x.minutes += bk[id].minutes || 0; pb += bk[id].pages || 0; mb += bk[id].minutes || 0; });
      // o que o total do dia tem a mais do que a repartição fica "sem livro"
      semLivro.pages += Math.max(0, (e.pages || 0) - pb); semLivro.minutes += Math.max(0, (e.minutes || 0) - mb);
    }
    const ficouDia = this.getFicou({ day: date });
    for (const f of ficouDia) if (!porLivro[f.bookId]) porLivro[f.bookId] = { pages: 0, minutes: 0 };
    const livros = Object.keys(porLivro)
      .filter(id => porLivro[id].pages + porLivro[id].minutes > 0 || ficouDia.some(f => f.bookId === id))
      .map(id => ({ id, book: achar(id), pages: porLivro[id].pages, minutes: porLivro[id].minutes, ficou: ficouDia.find(f => f.bookId === id) || null }))
      .sort((a, b) => b.pages - a.pages || b.minutes - a.minutes);
    const dia10 = (v) => diaLocal(v);
    const marcos = [];
    for (const b of books) {
      if (!b || b.deleted) continue;
      if (dia10(b.startedAt || b.readingSince) === date) marcos.push({ tipo: 'comecou', book: b });
      if (dia10(b.finishedAt) === date) marcos.push({ tipo: 'terminou', book: b });
    }
    const keyOf = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const notas = (this.getNotes() || []).filter(n => {
      const t = n && n.id && String(n.id).match(/^n_(\d{12,14})$/);
      return t && keyOf(new Date(parseInt(t[1], 10))) === date;
    });
    return { date, pages, minutes, livros, semLivro, marcos, notas };
  },
  // ── O QUE FICOU: o sentimento que uma leitura deixou num dia (um por livro por dia) ──
  // id determinístico ('f_<dia>_<livro>') — o sync une por id; apagar é lápide.
  FICOU_MAX_PALAVRAS: 60,
  contarPalavras(t) { return String(t || '').trim().split(/\s+/).filter(Boolean).length; },
  getFicou(filtro) {
    const s = load();
    let l = (Array.isArray(s.ficou) ? s.ficou : []).filter(x => x && !x.deleted);
    if (filtro && filtro.day) l = l.filter(x => x.day === filtro.day);
    if (filtro && filtro.bookId) l = l.filter(x => x.bookId === filtro.bookId);
    return l.sort((a, b) => String(a.day).localeCompare(String(b.day)));
  },
  setFicou(day, bookId, dados) {
    if (!day || !bookId) return null;
    const d = dados || {};
    const sentimento = String(d.sentimento || '').trim();
    const frase = String(d.frase || '').trim().replace(/^["“”«»']+|["“”«»']+$/g, '').trim();
    const s = load();
    const lista = Array.isArray(s.ficou) ? s.ficou : [];
    const id = 'f_' + day + '_' + bookId;
    const agora = new Date().toISOString();
    const antes = lista.find(x => x && x.id === id);
    const resto = lista.filter(x => !(x && x.id === id));
    let novo;
    if (!sentimento && !frase) novo = antes ? { ...antes, deleted: true, updatedAt: agora } : null;
    else novo = { ...(antes || {}), id, day, bookId, sentimento, frase, origem: d.origem || (antes && antes.origem) || 'app', deleted: false, createdAt: (antes && antes.createdAt) || agora, updatedAt: agora };
    s.ficou = novo ? [novo, ...resto] : resto;
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
    return novo;
  },
  // acha o livro da estante pelo título (sem acento/caixa; aceita título parcial; prefere o que está em leitura)
  acharLivroPorTitulo(titulo) {
    const norm = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
    const livros = ((typeof window !== 'undefined' && window.BOOKS) || []).filter(b => b && !b.deleted && b.title);
      const n = norm(titulo); if (!n) return null;
      const peso = (b) => (b.status === 'reading' ? 0 : b.status === 'paused' ? 1 : 2);
      const cands = livros.filter(b => norm(b.title) === n)
        .concat(livros.filter(b => { const bt = norm(b.title); return bt !== n && bt.length > 2 && (n.includes(bt) || bt.includes(n)); }));
      cands.sort((a, b) => (norm(a.title) === n ? 0 : 1) - (norm(b.title) === n ? 0 : 1) || peso(a) - peso(b));
      return cands[0] || null;
  },
  // lê o bloco "O QUE FICOU" colado do Claude (ou escrito à mão):
  //   O QUE FICOU · 04/11/2026
  //   Livro: Middlemarch
  //   Sentimento: …
  //   Frase: "…"
  // (vários livros = vários "Livro:"). Devolve { day, itens: [{ titulo, bookId, sentimento, frase }] }.
  parseFicou(texto) {
    const t = String(texto || '').replace(/\r/g, '');
    const pad = (n) => String(n).padStart(2, '0');
    const hoje = new Date();
    let day = hoje.getFullYear() + '-' + pad(hoje.getMonth() + 1) + '-' + pad(hoje.getDate());
    // a data vem do cabeçalho ("O QUE FICOU · 04/11/2026") ou da primeira linha — nunca do
    // meio do texto ("li 1/3 do livro" não é uma data) — e só vale se for um dia que existe
    const primeira = t.split('\n').find(l => l.trim()) || '';
    const rotulo = /^\s*(?:[-*•]\s*)?(?:📖|\*{0,2}(?:livro|sentimento|frase)\b)/i;
    const cabecalho = t.split('\n').find(l => /o que ficou/i.test(l)) || (rotulo.test(primeira) ? '' : primeira);
    const valida = (y, m, d) => { const dt = new Date(y, m - 1, d); return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d; };
    const iso = cabecalho.match(/(\d{4})-(\d{2})-(\d{2})/);
    const br = cabecalho.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
    if (iso && valida(+iso[1], +iso[2], +iso[3])) day = `${iso[1]}-${iso[2]}-${iso[3]}`;
    else if (br) { let y = br[3] ? parseInt(br[3], 10) : hoje.getFullYear(); if (y < 100) y += 2000; if (valida(y, +br[2], +br[1])) day = `${y}-${pad(br[2])}-${pad(br[1])}`; }
    const acharLivro = (titulo) => this.acharLivroPorTitulo(titulo);
    const itens = [];
    let cur = null, campo = null;
    for (const raw of t.split('\n')) {
      const linha = raw.trim();
      if (!linha) { campo = null; continue; }
      const mL = linha.match(/^(?:[-*•]\s*)?(?:📖\s*|\*{0,2}livro\*{0,2}\s*[:：]\s*)(.+)$/i);
      if (mL) { cur = { titulo: mL[1].replace(/\*+/g, '').trim(), sentimento: '', frase: '' }; itens.push(cur); campo = null; continue; }
      const mS = linha.match(/^(?:[-*•]\s*)?\*{0,2}sentimento\*{0,2}\s*[:：]\s*(.*)$/i);
      const mF = linha.match(/^(?:[-*•]\s*)?\*{0,2}frase(?: marcante)?\*{0,2}\s*[:：]\s*(.*)$/i);
      if (mS || mF) {
        if (!cur) { cur = { titulo: '', sentimento: '', frase: '' }; itens.push(cur); }
        campo = mS ? 'sentimento' : 'frase';
        cur[campo] = ((mS || mF)[1] || '').trim();
        continue;
      }
      if (cur && campo) cur[campo] = (cur[campo] + ' ' + linha).trim();
    }
    // texto solto (sem "Sentimento:"/"Frase:"): o texto inteiro vira o sentimento, para conferir
    if (!itens.length) {
      const corpo = t.split('\n').map(l => l.trim())
        .filter(l => l && !/^o que ficou\b/i.test(l) && !/^(?:[-*•]\s*)?(?:📖\s*|\*{0,2}livro\*{0,2}\s*[:：])/i.test(l))
        .join(' ').replace(/\s+/g, ' ').trim();
      const mLivro = t.match(/^(?:[-*•]\s*)?(?:📖\s*|\*{0,2}livro\*{0,2}\s*[:：]\s*)(.+)$/im);
      if (corpo) itens.push({ titulo: mLivro ? mLivro[1].replace(/\*+/g, '').trim() : '', sentimento: corpo, frase: '' });
    }
    const limpo = itens
      .map(x => ({ ...x, sentimento: x.sentimento.replace(/\*+/g, '').trim(), frase: x.frase.replace(/\*+/g, '').trim().replace(/^["“”«»']+|["“”«»']+$/g, '').trim() }))
      .filter(x => x.sentimento || x.frase)
      .map(x => { const b = acharLivro(x.titulo); return { ...x, bookId: b ? b.id : null }; });
    return { day, itens: limpo };
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
    s._carimbos = { ...(s._carimbos || {}), joinedGrupos: new Date().toISOString() }; // o sync escolhe a versão mais recente DESTA chave
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },
  leaveGrupo(id) {
    const s = load();
    s.joinedGrupos = (s.joinedGrupos || []).filter(x => x !== id);
    s._carimbos = { ...(s._carimbos || {}), joinedGrupos: new Date().toISOString() }; // o sync escolhe a versão mais recente DESTA chave
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },

  getJoinedDesafios() { return load().joinedDesafios || []; },
  isJoinedDesafio(id) { return this.getJoinedDesafios().includes(id); },
  joinDesafio(id) {
    const s = load();
    s.joinedDesafios = s.joinedDesafios || [];
    if (!s.joinedDesafios.includes(id)) s.joinedDesafios.push(id);
    s._carimbos = { ...(s._carimbos || {}), joinedDesafios: new Date().toISOString() }; // o sync escolhe a versão mais recente DESTA chave
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },
  leaveDesafio(id) {
    const s = load();
    s.joinedDesafios = (s.joinedDesafios || []).filter(x => x !== id);
    s._carimbos = { ...(s._carimbos || {}), joinedDesafios: new Date().toISOString() }; // o sync escolhe a versão mais recente DESTA chave
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },

  // ─── metas / reading challenges ──────────────────────────────
  // Cada meta: { id, title, type, target, period, startsAt, endsAt, filter, color, createdAt }
  // type: 'count' | 'pages' | 'theme' | 'author' | 'free'
  // period: 'month' | 'bimester' | 'trimester' | 'semester' | 'year' | 'custom' | 'open'
  getChallenges() { return (load().challenges || []).filter(c => c && !c.deleted); },
  addChallenge(challenge) {
    const s = load();
    s.challenges = s.challenges || [];
    const id = challenge.id || ('m_' + Date.now().toString(36));
    const agora = new Date().toISOString();
    const created = { id, createdAt: agora, ...challenge, updatedAt: agora };
    s.challenges.push(created);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
    return created;
  },
  updateChallenge(id, patch) {
    const s = load();
    const agora = new Date().toISOString();
    s.challenges = (s.challenges || []).map(c => c.id === id ? { ...c, ...patch, updatedAt: agora } : c);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },
  // remoção por LÁPIDE: o merge une por id e nunca apaga — sem a lápide, a cópia
  // velha de outro aparelho ressuscitaria a meta (mesma regra dos livros).
  removeChallenge(id) {
    const s = load();
    const agora = new Date().toISOString();
    s.challenges = (s.challenges || []).map(c => c && c.id === id ? { id, deleted: true, updatedAt: agora } : c);
    save(s);
    if (typeof window.__rerender === 'function') window.__rerender();
  },
  // Calcula progresso de uma meta com base nos livros atuais
  computeChallengeProgress(challenge) {
    const books = window.BOOKS || [];
    let pool = books.filter(b => b.status === 'read');
    // filtro por data, se a meta tem janela
    if (challenge.startsAt && challenge.endsAt && challenge.period !== 'open') {
      const s = inicioDoDia(challenge.startsAt);
      const e = fimDoDia(challenge.endsAt);
      pool = pool.filter(b => {
        // meio-dia local do dia do fim: um livro terminado em 1º/jan conta na meta de janeiro
        const t = b.finishedAt ? new Date(diaLocal(b.finishedAt) + 'T12:00:00').getTime() : null;
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
