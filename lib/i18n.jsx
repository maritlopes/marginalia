// lib/i18n.jsx — tradução PT/EN minimalista
// uso: t('chave') retorna a string no idioma atual (de MG.getPrefs().lang)
// fallback: PT se a chave não existir em EN

const DICT = {
  // ─── header / brand ──────────────────────────────────────────
  brand: { pt: 'Marginália', en: 'Marginália' },
  tagline: { pt: 'clube de leitura & conversas', en: 'reading club & conversations' },

  // ─── tabs ────────────────────────────────────────────────────
  tab_home: { pt: 'Hoje', en: 'Today' },
  tab_library: { pt: 'Biblioteca', en: 'Library' },
  tab_desafios: { pt: 'Desafios', en: 'Challenges' },
  tab_grupos: { pt: 'Grupos', en: 'Circles' },
  tab_niveis: { pt: 'Nível', en: 'Level' },

  // ─── home sections ───────────────────────────────────────────
  hoje_marginalia: { pt: 'Radar literário', en: 'Literary radar' },
  em_leitura: { pt: 'Em leitura', en: 'Currently reading' },
  esta_semana: { pt: 'Esta semana', en: 'This week' },
  curadoria: { pt: 'Curadoria', en: 'Curation' },
  para_voce: { pt: 'Para você', en: 'For you' },
  prompt_de_hoje: { pt: 'Prompt de hoje', en: 'Today’s prompt' },
  proxima_sessao: { pt: 'Próxima sessão', en: 'Next session' },

  // ─── actions ─────────────────────────────────────────────────
  retomar_leitura: { pt: 'Retomar leitura', en: 'Resume reading' },
  escrever_nota: { pt: 'Escrever nota', en: 'Write a note' },
  ver_mais: { pt: 'ver mais', en: 'see more' },
  ver_tudo: { pt: 'ver tudo', en: 'see all' },

  // ─── stats labels ────────────────────────────────────────────
  paginas: { pt: 'páginas', en: 'pages' },
  pagina: { pt: 'pág', en: 'p.' },
  sessoes: { pt: 'sessões', en: 'sessions' },
  ritmo: { pt: 'ritmo', en: 'pace' },
  livros: { pt: 'livros', en: 'books' },
  notas: { pt: 'notas', en: 'notes' },
  lidos_em: { pt: 'lidos em', en: 'read in' },
  lidos_no_total: { pt: 'lidos no total', en: 'total read' },
  paginas_atravessadas: { pt: 'páginas atravessadas', en: 'pages traversed' },

  // ─── curadoria categories ────────────────────────────────────
  cat_premio: { pt: 'Prêmio', en: 'Award' },
  cat_lancamento: { pt: 'Lançamento', en: 'Release' },
  cat_efemeride: { pt: 'Efeméride', en: 'On this day' },
  cat_reedicao: { pt: 'Reedição', en: 'Reissue' },
  cat_citacao: { pt: 'Citação', en: 'Quote' },
  cat_resenha: { pt: 'Resenha', en: 'Review' },

  // ─── days (mosaic) ───────────────────────────────────────────
  dia_seg: { pt: 'S', en: 'M' },
  dia_ter: { pt: 'T', en: 'T' },
  dia_qua: { pt: 'Q', en: 'W' },
  dia_qui: { pt: 'Q', en: 'T' },
  dia_sex: { pt: 'S', en: 'F' },
  dia_sab: { pt: 'S', en: 'S' },
  dia_dom: { pt: 'D', en: 'S' },

  // ─── library ─────────────────────────────────────────────────
  sua_biblioteca: { pt: 'Sua biblioteca', en: 'Your library' },
  buscar_placeholder: { pt: 'buscar por título, autor, tema…', en: 'search by title, author, theme…' },
  sort_added: { pt: 'Adicionado', en: 'Added' },
  sort_title: { pt: 'Título A→Z', en: 'Title A→Z' },
  sort_progress: { pt: 'Progresso', en: 'Progress' },
  status_lendo: { pt: 'Lendo', en: 'Reading' },
  status_lido: { pt: 'Lido', en: 'Read' },
  status_tbr: { pt: 'TBR', en: 'TBR' },
  status_pausado: { pt: 'Pausado', en: 'Paused' },
  tudo: { pt: 'Tudo', en: 'All' },

  // ─── month names (curated content shows dates) ───────────────
  mes_jan: { pt: 'jan', en: 'jan' },
  mes_fev: { pt: 'fev', en: 'feb' },
  mes_mar: { pt: 'mar', en: 'mar' },
  mes_abr: { pt: 'abr', en: 'apr' },
  mes_mai: { pt: 'mai', en: 'may' },
  mes_jun: { pt: 'jun', en: 'jun' },
  mes_jul: { pt: 'jul', en: 'jul' },
  mes_ago: { pt: 'ago', en: 'aug' },
  mes_set: { pt: 'set', en: 'sep' },
  mes_out: { pt: 'out', en: 'oct' },
  mes_nov: { pt: 'nov', en: 'nov' },
  mes_dez: { pt: 'dez', en: 'dec' },

  // ─── language switcher ───────────────────────────────────────
  idioma: { pt: 'Idioma', en: 'Language' },
  lang_pt: { pt: 'Português', en: 'Portuguese' },
  lang_en: { pt: 'Inglês', en: 'English' },

  // ─── greetings (rotam por hora) ──────────────────────────────
  bom_dia: { pt: 'Bom dia', en: 'Good morning' },
  boa_tarde: { pt: 'Boa tarde', en: 'Good afternoon' },
  boa_noite: { pt: 'Boa noite', en: 'Good evening' },
};

const I18n = {
  // pega o idioma atual a partir das prefs (default pt)
  current() {
    if (typeof MG !== 'undefined' && MG.getPrefs) {
      return MG.getPrefs().lang || 'pt';
    }
    return 'pt';
  },

  // traduz uma chave; se não existir, retorna a chave (visível em dev)
  t(key, fallback) {
    const lang = this.current();
    const entry = DICT[key];
    if (!entry) return fallback || key;
    return entry[lang] || entry.pt || fallback || key;
  },

  // troca de idioma (persiste em MG)
  setLang(lang) {
    if (typeof MG !== 'undefined' && MG.setPrefs) {
      MG.setPrefs({ lang });
    }
    if (typeof window.__rerender === 'function') window.__rerender();
  },

  // saudação por hora do dia
  greeting() {
    const h = new Date().getHours();
    if (h < 12) return this.t('bom_dia');
    if (h < 18) return this.t('boa_tarde');
    return this.t('boa_noite');
  },

  // formato de data localizado (ex.: "Quinta · 6 de maio" ou "Thursday · May 6")
  formatDate(d = new Date()) {
    const lang = this.current();
    const locale = lang === 'en' ? 'en-US' : 'pt-BR';
    const dow = d.toLocaleDateString(locale, { weekday: 'long' });
    const dt = d.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
    // capitaliza dia da semana
    const dowCap = dow.charAt(0).toUpperCase() + dow.slice(1);
    return lang === 'en' ? `${dowCap} · ${dt}` : `${dowCap} · ${dt}`;
  },
};

window.I18n = I18n;
window.t = I18n.t.bind(I18n);
