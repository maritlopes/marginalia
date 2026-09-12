// home-variants.jsx — three home-screen treatments for Clube de Leitura

// ─────────────────────────────────────────────────────────────
// Shared header (status bar, time) — small so the home feels live
// ─────────────────────────────────────────────────────────────
function StatusBar({ dark = false }) {
  const c = dark ? '#fff' : T.ink;
  return (
    <div className="app-statusbar" style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px 28px 8px', fontFamily: T.sans,
      fontSize: 15, fontWeight: 600, color: c, letterSpacing: -0.2,
    }}>
      <div>9:41</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="0.6" fill={c}/><rect x="4.5" y="4.5" width="3" height="6.5" rx="0.6" fill={c}/><rect x="9" y="2" width="3" height="9" rx="0.6" fill={c}/><rect x="13.5" y="0" width="3" height="11" rx="0.6" fill={c}/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={c} strokeOpacity="0.45" fill="none"/><rect x="2" y="2" width="17" height="7" rx="1.2" fill={c}/></svg>
      </div>
    </div>
  );
}

// Bottom tab bar (not floating — warm bone surface)
function TabBar({ active = 'home', dark = false, onClick = () => {} }) {
  const tt = (typeof t === 'function') ? t : (k) => k;
  const tabs = [
    { id: 'home',     label: tt('tab_home'),     icon: 'home' },
    { id: 'library',  label: tt('tab_library'),  icon: 'book' },
    { id: 'desafios', label: tt('tab_desafios'), icon: 'target' },
    { id: 'grupos',   label: tt('tab_grupos'),   icon: 'share' },
  ];
  const bg = dark ? 'rgba(30,26,22,0.92)' : 'rgba(247,241,228,0.92)';
  const border = dark ? 'rgba(255,255,255,0.08)' : T.hairline;
  const activeC = dark ? '#F7E7D6' : T.ink;
  const mutedC = dark ? 'rgba(247,231,214,0.4)' : T.muted;
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      background: bg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${border}`,
      paddingTop: 10, paddingBottom: 30,
      display: 'flex', justifyContent: 'space-around',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onClick(t.id)} style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: active === t.id ? activeC : mutedC,
          fontFamily: T.sans, fontSize: 10, letterSpacing: 0.3,
          padding: '4px 6px',
        }}>
          <Icon name={t.icon} size={22} strokeWidth={active === t.id ? 2 : 1.5}/>
          <span style={{ fontWeight: active === t.id ? 600 : 500 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Variant A: "Mesa de trabalho" — editorial/literary
// Nova entrada convidativa: brand → banner curatorial → leitura atual →
// stats da semana → curadoria → para você
// ─────────────────────────────────────────────────────────────
// Avatar do usuário logado — iniciais do nome (convidado) ou do e-mail; ícone neutro se deslogado
function UserAvatar({ size = 36 }) {
  const [ini, setIni] = React.useState(null);
  // re-lê quando o estado de login/sincronização muda (corrige avatar preso no e-mail)
  const tick = (typeof window !== 'undefined' && window.__cloudStatus) || '';
  React.useEffect(() => {
    let alive = true;
    const c = window.MGCloud;
    if (c && c.available && c.currentUser) {
      c.currentUser().then((u) => {
        if (!alive) return;
        if (!u) { setIni(null); return; }
        const nm = (u.user_metadata && u.user_metadata.name) || (u.email || '').split('@')[0] || '';
        const parts = nm.replace(/[^A-Za-zÀ-ÿ ]/g, ' ').trim().split(/\s+/).filter(Boolean);
        const s = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]) : nm.slice(0, 2);
        setIni((s || '?').toUpperCase());
      }).catch(() => {});
    }
    return () => { alive = false; };
  }, [tick]);
  // caminho único e robusto: leva à tela de login da Biblioteca (form inline, confiável no modo app)
  const abrir = () => {
    if (typeof window === 'undefined') return;
    window.__scrollToSync = true;
    if (window.__setRoute) window.__setRoute('library');
  };
  // <button> (não <div>): no iOS em modo standalone/tela-inicial, toques em <div onClick>
  // não disparam de forma confiável; um botão nativo sempre recebe o toque.
  return (
    <button type="button" onClick={abrir} title="Seu perfil · entrar e sincronizar" style={{
      width: size, height: size, borderRadius: '50%', background: T.ink, color: T.cream,
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      fontFamily: T.serif, fontWeight: 500, fontSize: Math.round(size * 0.42),
      boxShadow: ini ? 'none' : '0 0 0 2px ' + T.terra,
      border: 0, padding: 0, margin: 0, lineHeight: 1, flexShrink: 0,
      WebkitAppearance: 'none', appearance: 'none', WebkitTapHighlightColor: 'transparent',
    }}>{ini || <Icon name="user" size={Math.round(size * 0.45)} color={T.cream}/>}</button>
  );
}

// LoginPrompt — boas-vindas + entrada por e-mail na PRIMEIRA tela (some após logar).
// Caminho único de entrada (a conta-convidada temporária saiu). O formulário
// (EmailLoginCard, definido em screens.jsx) entra aqui inline; se a leitora
// chegou por um link de convite (window.__pendingJoin), o texto se adapta.
function LoginPrompt() {
  const [user, setUser] = React.useState(undefined);
  const tick = (typeof window !== 'undefined' && window.__cloudStatus) || '';
  React.useEffect(() => {
    let alive = true;
    const c = (typeof window !== 'undefined') ? window.MGCloud : null;
    if (c && c.available && c.currentUser) {
      c.currentUser().then((u) => { if (alive) setUser(u); }).catch(() => { if (alive) setUser(null); });
    } else { setUser(null); }
    return () => { alive = false; };
  }, [tick]);
  if (user === undefined || user) return null; // carregando, ou já conectada → não aparece

  const invited = (typeof window !== 'undefined') && !!window.__pendingJoin;
  return (
    <div style={{
      border: `1px solid ${T.hairline}`, borderRadius: 14, padding: 18, marginBottom: 18,
      background: T.cream, color: T.ink, fontFamily: T.sans,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <div style={{ marginBottom: 8, opacity: 0.85 }}>{typeof BrandMark !== 'undefined' ? <BrandMark size={34}/> : null}</div>
        <div style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 500, letterSpacing: -0.3, marginBottom: 6 }}>
          {invited ? 'Você foi convidada para a Marginália' : 'Entre na Marginália'}
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 13.5, color: T.brown, lineHeight: 1.5, maxWidth: 330, margin: '0 auto' }}>
          {invited
            ? 'Um clube de leitura íntimo e curado, onde cada livro é uma porta. Entre com seu e-mail para participar — Mariana confirma seu acesso e o seu lugar fica guardado.'
            : 'Entre com seu e-mail para guardar seus livros e notas e tê-los iguais em todos os aparelhos. Um código de 6 dígitos chega no e-mail — sem senha.'}
        </div>
      </div>
      {typeof EmailLoginCard !== 'undefined' ? <EmailLoginCard onLoggedIn={(u) => setUser(u)}/> : null}
    </div>
  );
}

function HomeVariantA({ onNav = () => {} }) {
  const b = (typeof currentBook === 'function' ? currentBook() : BOOK_CURRENT);
  const lang = (typeof I18n !== 'undefined') ? I18n.current() : 'pt';
  const tt = (typeof t === 'function') ? t : (k) => k;
  const greeting = (typeof I18n !== 'undefined') ? I18n.greeting() : 'Olá';
  const dateStr = (typeof I18n !== 'undefined') ? I18n.formatDate() : '';

  // primeiro nome da usuária (do nome salvo na nuvem), para a saudação
  const [firstName, setFirstName] = React.useState('');
  const nameTick = (typeof window !== 'undefined' && window.__cloudStatus) || '';
  React.useEffect(() => {
    let alive = true;
    const c = window.MGCloud;
    if (c && c.available && c.currentUser) c.currentUser().then((u) => {
      if (!alive || !u) return;
      const nm = (u.user_metadata && u.user_metadata.name) || '';
      setFirstName(nm ? nm.trim().split(/\s+/)[0] : '');
    }).catch(() => {});
    return () => { alive = false; };
  }, [nameTick]);

  // banner rotativo — troca a cada 7 segundos
  // sazonal: efemérides só entram no mês delas (junho mostra efemérides de junho);
  // o resto (citação, prêmio, lançamento…) é atemporal e aparece sempre.
  const _bannerAll = window.HOJE_BANNER || [];
  const banner = window.curInSeason ? _bannerAll.filter((it) => window.curInSeason(it)) : _bannerAll;
  // começa por um item diferente a cada dia, para o Radar parecer sempre atualizado
  const [bannerIdx, setBannerIdx] = React.useState(() =>
    banner.length ? Math.floor(Date.now() / 86400000) % banner.length : 0);
  React.useEffect(() => {
    if (banner.length === 0) return;
    const id = setInterval(() => setBannerIdx(i => (i + 1) % banner.length), 7000);
    return () => clearInterval(id);
  }, [banner.length]);

  // "Esta semana" REAL — a partir do registro de leitura (segunda a domingo)
  const semana = (() => {
    const log = (typeof MG !== 'undefined' && MG.getReadingLog) ? MG.getReadingLog() : [];
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const dow = (now.getDay() + 6) % 7; // 0=segunda … 6=domingo
    const monday = new Date(now); monday.setDate(now.getDate() - dow);
    const keyOf = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const perDay = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      const k = keyOf(d);
      perDay.push(log.filter((e) => e.date === k).reduce((s, e) => s + (e.pages || 0), 0));
    }
    const paginas = perDay.reduce((s, n) => s + n, 0);
    const minutos = log.filter((e) => e && e.date >= keyOf(monday) && e.date <= keyOf(now)).reduce((s, e) => s + (e.minutes || 0), 0);
    const sessoes = perDay.filter((n) => n > 0).length;
    const ritmo = sessoes ? Math.round(paginas / sessoes) : 0;
    return { paginas, minutos, sessoes, ritmo, perDay };
  })();
  const stats = { paginas: semana.paginas, sessoes: semana.sessoes, ritmo: semana.ritmo };

  // o hábito diário — hoje, sequência de dias, calendário do mês (tudo derivado do diário)
  const st = (typeof MG !== 'undefined' && MG.readingStats) ? MG.readingStats(b && b.id) : null;
  const goalD = st ? st.goal : null;
  const hojeT = (st && st.hoje) || { pages: 0, minutes: 0 };
  const hojeLeu = hojeT.pages > 0 || hojeT.minutes > 0;
  const anelPct = goalD ? Math.max(goalD.pages ? (hojeT.pages / goalD.pages) * 100 : 0, goalD.minutes ? (hojeT.minutes / goalD.minutes) * 100 : 0) : 0;
  const [editGoal, setEditGoal] = React.useState(false);
  const [goalP, setGoalP] = React.useState('');
  const [goalM, setGoalM] = React.useState('');
  const abrirMeta = () => { setGoalP(goalD && goalD.pages ? String(goalD.pages) : ''); setGoalM(goalD && goalD.minutes ? String(goalD.minutes) : ''); setEditGoal(true); };
  const salvarMeta = () => { if (typeof MG !== 'undefined' && MG.setDailyGoal) MG.setDailyGoal({ pages: goalP, minutes: goalM }); setEditGoal(false); };
  const removerMeta = () => { if (typeof MG !== 'undefined' && MG.setDailyGoal) MG.setDailyGoal(null); setEditGoal(false); };
  const nomeMes = (() => { const n = new Date().toLocaleDateString('pt-BR', { month: 'long' }); return n.charAt(0).toUpperCase() + n.slice(1); })();
  // registros do dia (tocar num dia do calendário) — para conferir e CORRIGIR o que foi lançado
  const hojeK = (() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })();
  const [diaSel, setDiaSel] = React.useState(null);
  const diaAtivo = diaSel || hojeK;
  // UM registro por dia: a linha do dia é editável (acrescentar ou corrigir os totais)
  const registrosDia = ((typeof MG !== 'undefined' && MG.getReadingLog) ? MG.getReadingLog() : []).filter((e) => e && e.date === diaAtivo);
  const diaTot = registrosDia.reduce((acc, e) => ({ pages: acc.pages + (e.pages || 0), minutes: acc.minutes + (e.minutes || 0), bookId: acc.bookId || e.bookId }), { pages: 0, minutes: 0, bookId: null });
  const [diaP, setDiaP] = React.useState('');
  const [diaM, setDiaM] = React.useState('');
  const [diaSalvo, setDiaSalvo] = React.useState(false);
  React.useEffect(() => { setDiaP(diaTot.pages ? String(diaTot.pages) : ''); setDiaM(diaTot.minutes ? String(diaTot.minutes) : ''); setChipLivro(null); }, [diaAtivo, diaTot.pages, diaTot.minutes]);
  // em qual livro? — os livros em leitura viram chips; a diferença salva vai para o escolhido
  const lendoAgora = (window.BOOKS || []).filter((x) => x && !x.deleted && (x.status === 'reading' || x.status === 'paused'));
  const [chipLivro, setChipLivro] = React.useState(null);
  const livroDia = chipLivro || diaTot.bookId || (b && b.id) || null;
  const diaBooks = registrosDia.reduce((acc, e) => { const bk = e.books || (e.bookId ? { [e.bookId]: { pages: e.pages || 0, minutes: e.minutes || 0 } } : {}); Object.keys(bk).forEach((id) => { const x = acc[id] || (acc[id] = { pages: 0, minutes: 0 }); x.pages += bk[id].pages || 0; x.minutes += bk[id].minutes || 0; }); return acc; }, {});
  const reparticao = Object.keys(diaBooks).filter((id) => diaBooks[id].pages + diaBooks[id].minutes > 0);
  const diaMudou = (parseInt(diaP, 10) || 0) !== diaTot.pages || (parseInt(diaM, 10) || 0) !== diaTot.minutes;
  const salvarDia = () => {
    if (!diaMudou) return;
    if (typeof MG !== 'undefined' && MG.setDayTotals) MG.setDayTotals(diaAtivo, { pages: diaP, minutes: diaM, bookId: livroDia });
    setDiaSalvo(true);
  };
  const apagarDia = () => { if (typeof MG !== 'undefined' && MG.setDayTotals) MG.setDayTotals(diaAtivo, { pages: 0, minutes: 0 }); setDiaSalvo(false); };
  const tituloLivro = (id) => { const bk = (window.BOOKS || []).find((x) => x.id === id); return bk ? bk.title : null; };
  const fmtDia = (k) => { const m = String(k).match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${parseInt(m[3], 10)}/${m[2]}` : k; };


  // curadoria — mostra 3 na home; "ver mais" abre o banco completo (todas)
  const [showAllCuradoria, setShowAllCuradoria] = React.useState(false);
  const curadoriaAll = (window.CURADORIA || []);
  // Mostra 3 por vez. Sazonal: as EFEMÉRIDES só do mês corrente entram na rotação
  // (em junho, só efemérides de junho); o resto — você sabia?, conexão, contexto,
  // novidade — é atemporal e gira sempre. Os 3 cards são uma MISTURA: até 2
  // efemérides do mês + curiosidades/conexões preenchendo. "Ver todas" mostra o
  // banco inteiro (inclusive efemérides de outros meses, para navegar).
  const _curInSeason = window.curInSeason
    ? curadoriaAll.filter((c) => window.curInSeason(c))
    : curadoriaAll;
  const _curRotate = (arr) => {
    const s = arr.length ? (Math.floor(Date.now() / 86400000) % arr.length) : 0;
    return [...arr.slice(s), ...arr.slice(0, s)];
  };
  const _curEf = _curRotate(_curInSeason.filter((c) => c.kind === 'efemeride'));
  const _curAt = _curRotate(_curInSeason.filter((c) => c.kind !== 'efemeride'));
  const _curPick = [];
  for (let i = 0; i < Math.min(2, _curEf.length); i++) _curPick.push(_curEf[i]);
  for (const a of _curAt) { if (_curPick.length >= 3) break; _curPick.push(a); }
  for (const e of _curEf) { if (_curPick.length >= 3) break; if (!_curPick.includes(e)) _curPick.push(e); }
  const curadoria = showAllCuradoria ? curadoriaAll : _curPick.slice(0, 3);

  // sugestões para o livro atual
  const sugestoes = (window.SUGESTOES_POR_LIVRO || {})[b.id] || [];

  return (
    <div style={{
      width: '100%', height: '100%', background: T.bone,
      fontFamily: T.sans, color: T.ink, position: 'relative',
      overflow: 'auto', paddingBottom: 100,
    }}>
      {/* paper grain */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.4), transparent 60%), radial-gradient(circle at 80% 90%, rgba(180,140,100,0.08), transparent 50%)',
        pointerEvents: 'none',
      }}/>
      <StatusBar/>

      <div style={{ padding: '6px 24px 0', position: 'relative' }}>
        {/* brand + greeting + idioma toggle — escondido no frame de site (WebNav já é o topo) */}
        <div className="home-brandbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="symbol.png" alt="Marginália" width="44" height="44"
                 style={{ display: 'block', objectFit: 'contain' }}/>
            <div>
              <div style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 500, letterSpacing: -0.3, color: T.terraDeep || '#8E3E2A', lineHeight: 1 }}>
                Marginália
              </div>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1.2, marginTop: 4, fontFamily: T.serif }}>
                {greeting}{firstName ? `, ${firstName}` : ''} · <span style={{ color: T.brown }}>{dateStr}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* seletor de idioma — duas opções visíveis, a atual destacada */}
            {/* toggle EN escondido até a tradução das telas internas estar completa */}
            {false && typeof I18n !== 'undefined' && (
              <div title={tt('idioma')} style={{
                display: 'flex', border: `1px solid ${T.hairline}`,
                borderRadius: 999, overflow: 'hidden',
              }}>
                {['pt', 'en'].map((lng) => (
                  <button key={lng} onClick={() => I18n.setLang(lng)} style={{
                    padding: '5px 10px', border: 0, cursor: 'pointer',
                    background: lang === lng ? T.ink : 'transparent',
                    color: lang === lng ? T.cream : T.brown,
                    fontFamily: T.mono, fontSize: 10, fontWeight: 600, letterSpacing: 1,
                  }}>{lng.toUpperCase()}</button>
                ))}
              </div>
            )}
            <UserAvatar size={36}/>
          </div>
        </div>

        {/* cartão de login/sincronização — só para quem ainda não entrou */}
        <LoginPrompt/>

        {/* ✨ HOJE NA MARGINÁLIA — banner rotativo */}
        {banner.length > 0 && (() => {
          const item = banner[bannerIdx];
          const accentMap = {
            terra: T.terra, olive: T.olive, ochre: T.ochre,
            plum: '#6E3F4E', rose: '#9E5E4A',
          };
          const accent = accentMap[item.accent] || T.terra;
          const headline = item[`headline_${lang}`] || item.headline_pt;
          const sub = item[`sub_${lang}`] || item.sub_pt;
          const kindLabel = tt('cat_' + item.kind, item.kind);
          return (
            <div style={{
              padding: '16px 18px 18px', background: T.ink, color: T.cream,
              borderRadius: 14, marginBottom: 22, position: 'relative',
              overflow: 'hidden',
            }}>
              {/* gradiente de cor de acento por categoria */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.18,
                background: `radial-gradient(circle at 90% 0%, ${accent}, transparent 60%)`,
              }}/>
              <div style={{ position: 'relative' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                }}>
                  <span style={{
                    fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase',
                    fontWeight: 700, color: accent,
                  }}>✨ {tt('hoje_marginalia')}</span>
                  <span style={{
                    fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase',
                    color: 'rgba(247,241,228,0.5)', fontWeight: 600,
                  }}>· {kindLabel}</span>
                </div>
                <div style={{
                  fontFamily: T.serif, fontSize: 19, lineHeight: 1.2, fontWeight: 500,
                  letterSpacing: -0.3, marginBottom: 6,
                }}>
                  {headline}
                </div>
                <div style={{
                  fontSize: 12, color: 'rgba(247,241,228,0.7)', lineHeight: 1.4,
                  fontFamily: T.serif, fontStyle: 'italic',
                }}>
                  {sub}
                </div>
                {/* dots indicador */}
                <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
                  {banner.map((_, i) => (
                    <div key={i} style={{
                      width: i === bannerIdx ? 14 : 4, height: 4,
                      borderRadius: 999,
                      background: i === bannerIdx ? T.cream : 'rgba(247,241,228,0.3)',
                      transition: 'width 300ms',
                    }}/>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* MEMÓRIA — aniversário do livro / marcos suaves */}
        {(() => {
          const memorias = (typeof window.computeMemorias === 'function')
            ? window.computeMemorias({ books: window.BOOKS, notes: window.NOTES })
            : [];
          if (memorias.length === 0) return null;
          // pega 1 memória aleatória estável (baseada no dia do mês — varia por dia)
          const dayOfMonth = new Date().getDate();
          const m = memorias[dayOfMonth % memorias.length];
          // converte *texto* em <em>texto</em>
          const parts = m.text.split('*');
          return (
            <div style={{
              padding: '14px 18px', marginBottom: 22,
              borderLeft: `3px solid #6E3F4E`,
              background: 'rgba(110,63,78,0.05)',
              borderRadius: '0 10px 10px 0',
            }}>
              <div style={{
                fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase',
                color: '#6E3F4E', fontWeight: 700, marginBottom: 6,
              }}>
                ⊕ Memória
              </div>
              <div style={{
                fontFamily: T.serif, fontSize: 15, lineHeight: 1.4, color: T.ink,
              }}>
                {parts.map((p, i) =>
                  i % 2 === 1
                    ? <em key={i} style={{ color: T.terra, fontStyle: 'italic' }}>{p}</em>
                    : <span key={i}>{p}</span>
                )}
              </div>
            </div>
          );
        })()}

        {/* EM LEITURA — uma entrada IGUAL para cada livro aberto (o último registrado primeiro) */}
        <SectionRule label={tt('em_leitura')}/>
        <div style={{ marginBottom: 10 }}>
          {(window.__demoShelf ? [b] : [b, ...(window.BOOKS || []).filter((x) => x && !x.deleted && (x.status === 'reading' || x.status === 'paused') && x.id !== b.id)])
            .map((x) => <LeituraCard key={x.id} book={x} onNav={onNav} label={tt('retomar_leitura')}/>)}
        </div>

        {/* LEITURAS DO CLUBE — o app conhece o calendário; só aparece para quem tem livro do clube */}
        {(() => {
          const lista = (typeof window.clubeAgora === 'function') ? window.clubeAgora() : [];
          if (!lista.length) return null;
          const fmt = (iso) => { const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${parseInt(m[3], 10)}/${m[2]}` : iso; };
          const btn = { padding: '7px 12px', borderRadius: 8, border: `1px solid ${T.terra}`, background: 'transparent', color: T.terra, fontFamily: T.sans, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' };
          const ok = { fontSize: 11.5, color: T.olive, fontFamily: T.sans, fontWeight: 600, padding: '7px 0' };
          return lista.map((c) => {
            const bk = c.book; const cur = (bk && bk.currentPage) || 0; const tot = (bk && bk.pages) || 0;
            const naEstante = !!(bk && bk.status);
            const lido = !!(bk && bk.status === 'read');
            const ritmo = (tot && cur < tot && c.diasFim > 0) ? Math.ceil((tot - cur) / c.diasFim) : null;
            const metaJa = !!(bk && bk.goalFinishBy === c.livro.fim);
            const wgJa = !!(bk && bk.weekGoal && c.meta && c.meta.page && bk.weekGoal.page === c.meta.page);
            const quando = c.diasMeta === 0 ? 'é hoje' : (c.diasMeta === 1 ? 'amanhã' : `faltam ${c.diasMeta} dias`);
            return (
              <div key={c.clube.id}>
                <SectionRule label="Leituras do clube"/>
                <div style={{ background: T.paper, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '14px 16px', marginBottom: 22 }}>
                  <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.terra, fontWeight: 600 }}>{c.clube.nome} · {c.clube.sub}</div>
                  <div onClick={() => { if (bk && typeof window.__openBook === 'function') window.__openBook(bk); }} style={{ fontFamily: T.serif, fontSize: 19, lineHeight: 1.15, fontWeight: 500, letterSpacing: -0.3, marginTop: 4, color: T.ink, cursor: bk ? 'pointer' : 'default' }}>{c.livro.title}</div>
                  <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 12.5, color: T.brown, marginTop: 2 }}>
                    {c.livro.author} · {c.aindaNaoAbriu ? `abre em ${fmt(c.livro.abre)}` : `de ${fmt(c.livro.abre)} a ${fmt(c.livro.fim)}`}
                  </div>
                  {c.meta && (
                    <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(176,83,58,0.07)', borderRadius: 8 }}>
                      <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: T.terra, fontWeight: 700 }}>
                        {c.meta.abertura ? 'Abertura' : 'Meta da semana'} · sáb {fmt(c.meta.data)} · {quando}
                      </div>
                      <div style={{ fontFamily: T.serif, fontSize: 15, color: T.ink, marginTop: 2 }}>{c.meta.meta}</div>
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: T.brown, marginTop: 10, fontFamily: T.sans, lineHeight: 1.5 }}>
                    {!bk ? 'Ainda não está na sua biblioteca.'
                      : lido ? '✓ Você já leu este.'
                      : !naEstante ? 'Está no seu acervo, adormecido.'
                      : tot ? <>Você está na <strong>pág {cur}</strong> de {tot}{ritmo ? <> · ~<strong style={{ color: T.terra }}>{ritmo} pág/dia</strong> até {fmt(c.livro.fim)}</> : null}</>
                      : 'Na sua estante — sem total de páginas (ponha no Editar para eu calcular o ritmo).'}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    {bk && !naEstante && <button onClick={() => { if (typeof window.__tirarPoeira === 'function') window.__tirarPoeira(bk); }} style={btn}>Despertar para a estante</button>}
                    {bk && naEstante && !lido && !metaJa && <button onClick={() => { if (typeof MG !== 'undefined') MG.updateBook(bk.id, { goalFinishBy: c.livro.fim }); }} style={btn}>Meta no plano: terminar até {fmt(c.livro.fim)}</button>}
                    {bk && naEstante && !lido && metaJa && <span style={ok}>✓ Meta do plano: até {fmt(c.livro.fim)}</span>}
                    {bk && naEstante && !lido && c.meta && c.meta.page && !wgJa && c.meta.page > cur && <button onClick={() => { if (typeof MG !== 'undefined') MG.updateBook(bk.id, { weekGoal: { from: cur, page: c.meta.page, until: c.meta.data } }); }} style={btn}>Meta da semana: pág {c.meta.page}</button>}
                    {bk && naEstante && !lido && wgJa && <span style={ok}>✓ Meta da semana: pág {c.meta.page}</span>}
                  </div>
                  {c.proximo && (
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 8, fontFamily: T.serif, fontStyle: 'italic' }}>Depois: {c.proximo.title} · abre {fmt(c.proximo.abre)}</div>
                  )}
                </div>
              </div>
            );
          });
        })()}

        {/* SUA LEITURA, DIA A DIA — hoje + sequência + semana + calendário do mês + Li hoje */}
        <SectionRule label="Sua leitura, dia a dia"/>
        <div style={{
          background: T.paper, borderRadius: 12, padding: '14px 16px',
          border: `1px solid ${T.hairline}`, marginBottom: 22,
        }}>
          {/* hoje + sequência */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <AnelDoDia pct={anelPct} temMeta={!!goalD} cumpriu={!!(st && st.hojeCumpriu)} leu={hojeLeu}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.serif, fontSize: 16, color: T.ink, lineHeight: 1.3 }}>
                {hojeLeu ? (
                  <>Hoje: <strong style={{ color: T.terra }}>{hojeT.pages} pág</strong>{hojeT.minutes ? <> · <strong style={{ color: T.terra }}>{hojeT.minutes} min</strong></> : null}</>
                ) : (
                  <span style={{ color: T.brown, fontStyle: 'italic' }}>Hoje ainda sem leitura.</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: T.brown, marginTop: 3 }}>
                {goalD ? (
                  <>meta: {[goalD.pages ? `${goalD.pages} pág` : null, goalD.minutes ? `${goalD.minutes} min` : null].filter(Boolean).join(' ou ')} por dia · <button onClick={abrirMeta} style={{ background: 'transparent', border: 0, padding: 0, color: T.terra, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>ajustar</button></>
                ) : (
                  <button onClick={abrirMeta} style={{ background: 'transparent', border: 0, padding: 0, color: T.terra, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Definir uma meta diária →</button>
                )}
              </div>
              {st && st.streak > 0 && (
                <div style={{ fontSize: 12, color: T.olive, marginTop: 5, fontFamily: T.serif }}>
                  <strong>{st.streak} {st.streak === 1 ? 'dia' : 'dias'}</strong> {st.streak === 1 ? 'seguido' : 'seguidos'} com um livro nas mãos{st.hojeFalta ? ' — hoje ainda não' : ''}.
                </div>
              )}
            </div>
          </div>

          {editGoal && (
            <div style={{ background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>Meta diária — o dia conta ao bater qualquer uma das duas</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontFamily: T.serif, fontSize: 13, color: T.ink }}>
                <input value={goalP} onChange={(e) => setGoalP(e.target.value)} inputMode="numeric" placeholder="20" autoFocus
                  style={{ width: 52, padding: '6px 8px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, color: T.ink, fontFamily: T.sans, fontSize: 13, textAlign: 'center' }}/>
                <span>páginas</span><span style={{ color: T.muted }}>ou</span>
                <input value={goalM} onChange={(e) => setGoalM(e.target.value)} inputMode="numeric" placeholder="30"
                  style={{ width: 52, padding: '6px 8px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, color: T.ink, fontFamily: T.sans, fontSize: 13, textAlign: 'center' }}/>
                <span>min por dia</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={salvarMeta} style={{ background: T.terra, color: T.cream, border: 0, borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Salvar</button>
                <button onClick={() => setEditGoal(false)} style={{ background: 'transparent', color: T.brown, border: `1px solid ${T.hairline}`, borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}>Cancelar</button>
                {goalD && <button onClick={removerMeta} style={{ background: 'transparent', color: T.muted, border: 0, padding: '7px 8px', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>remover meta</button>}
              </div>
            </div>
          )}

          {/* esta semana */}
          <div style={{ fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: T.brown, fontWeight: 600, marginBottom: 6 }}>Esta semana</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 14 }}>
            <MicroStat n={stats.paginas} label="páginas" accent={T.terra}/>
            {st && st.last7.minutes > 0 && <MicroStat n={semana.minutos} label="minutos" accent={T.terra}/>}
            <MicroStat n={stats.sessoes} label="dias" accent={T.olive}/>
            <MicroStat n={stats.ritmo > 0 ? stats.ritmo : '—'} label="pág/dia" accent={T.ochre}/>
          </div>

          {/* calendário do mês — numerado e clicável: tocar num dia mostra (e corrige) os registros */}
          {st && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontFamily: T.serif, fontSize: 14, color: T.ink, fontWeight: 500 }}>{nomeMes}</span>
                <span style={{ fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', color: T.brown, fontWeight: 600 }}>{st.diasLidosMes} {st.diasLidosMes === 1 ? 'dia' : 'dias'} com leitura</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'].map((l, i) => (
                  <div key={'h' + i} style={{ textAlign: 'center', fontSize: 9, color: T.brown, fontFamily: T.sans, fontWeight: 600, letterSpacing: 0.4, paddingBottom: 2 }}>{l}</div>
                ))}
                {Array.from({ length: st.primeiroDow }).map((_, i) => <div key={'v' + i}/>)}
                {st.mes.map((d) => {
                  const sel = d.key === diaAtivo;
                  const bg = d.meta ? T.terra : (d.leu ? 'rgba(176,83,58,0.55)' : (d.futuro ? 'transparent' : T.parchment));
                  const fg = d.meta ? T.cream : (d.leu ? T.ink : (d.futuro ? T.muted : T.brown));
                  return (
                    <button key={d.key} type="button" onClick={() => setDiaSel(d.key)} title={`${d.dia}: ${d.pages} pág · ${d.minutes} min`} style={{
                      aspectRatio: '1', minHeight: 30, borderRadius: 6, padding: 0, cursor: 'pointer',
                      background: bg, color: fg,
                      border: sel ? `2px solid ${T.ink}` : (d.hoje ? `2px solid ${T.terra}` : (d.futuro ? `1px dashed ${T.hairline}` : `1px solid ${T.hairline}`)),
                      boxSizing: 'border-box', fontFamily: T.sans, fontSize: 11, fontWeight: (d.hoje || sel) ? 700 : 500,
                      opacity: d.futuro ? 0.55 : 1, WebkitTapHighlightColor: 'transparent',
                    }}>{d.dia}</button>
                  );
                })}
              </div>
              <div style={{ fontSize: 10.5, color: T.brown, marginTop: 6, fontFamily: T.serif, fontStyle: 'italic' }}>
                {goalD ? 'cheio = meta cumprida · claro = leu, abaixo da meta · ' : 'claro = leu · '}toque num dia para ver ou corrigir
              </div>

              {/* a linha do dia — um registro só, editável: acrescentar ou corrigir */}
              <div style={{ marginTop: 12, background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: T.brown, fontWeight: 600 }}>
                    {diaAtivo === hojeK ? 'Li hoje' : `Li em ${fmtDia(diaAtivo)}`}
                  </span>
                  {diaAtivo !== hojeK && (
                    <button onClick={() => setDiaSel(null)} style={{ background: 'transparent', border: 0, padding: 0, color: T.terra, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>voltar a hoje</button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <input value={diaP} onChange={(e) => { setDiaP(e.target.value); setDiaSalvo(false); }} inputMode="numeric" placeholder="0"
                    onKeyDown={(e) => e.key === 'Enter' && salvarDia()}
                    style={{ width: 56, padding: '8px 6px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, color: T.ink, fontFamily: T.sans, fontSize: 15, outline: 'none', textAlign: 'center' }}/>
                  <span style={{ fontSize: 12, color: T.brown }}>pág</span>
                  <input value={diaM} onChange={(e) => { setDiaM(e.target.value); setDiaSalvo(false); }} inputMode="numeric" placeholder="0"
                    onKeyDown={(e) => e.key === 'Enter' && salvarDia()}
                    style={{ width: 56, padding: '8px 6px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, color: T.ink, fontFamily: T.sans, fontSize: 15, outline: 'none', textAlign: 'center' }}/>
                  <span style={{ fontSize: 12, color: T.brown }}>min</span>
                  <div style={{ flex: 1 }}/>
                  <button onClick={salvarDia} disabled={!diaMudou} style={{ padding: '8px 14px', borderRadius: 8, border: 0, background: diaMudou ? T.ink : T.parchment, color: diaMudou ? T.cream : T.brown, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: diaMudou ? 'pointer' : 'default' }}>
                    {diaSalvo && !diaMudou ? '✓ Salvo' : 'Salvar'}
                  </button>
                </div>
                {lendoAgora.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: T.brown }}>em qual livro?</span>
                    {lendoAgora.map((x) => {
                      const on = livroDia === x.id;
                      return (
                        <button key={x.id} onClick={() => { setChipLivro(x.id); setDiaSalvo(false); }} style={{ padding: '4px 10px', borderRadius: 999, border: `1px solid ${on ? T.ink : T.hairline}`, background: on ? T.ink : 'transparent', color: on ? T.cream : T.brown, fontFamily: T.sans, fontSize: 11, fontWeight: 600, cursor: 'pointer', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.title}</button>
                      );
                    })}
                  </div>
                )}
                <div style={{ fontSize: 11, color: T.brown, marginTop: 8, fontFamily: T.serif, fontStyle: 'italic', lineHeight: 1.4 }}>
                  Um registro por dia: altere os totais para acrescentar ou corrigir.
                  {reparticao.length > 1 ? ' · ' + reparticao.map((id) => `${tituloLivro(id) || 'outro'} ${diaBooks[id].pages ? diaBooks[id].pages + ' pág' : ''}${diaBooks[id].pages && diaBooks[id].minutes ? ' · ' : ''}${diaBooks[id].minutes ? diaBooks[id].minutes + ' min' : ''}`).join(' · ') : (diaTot.bookId && tituloLivro(diaTot.bookId) ? ` · ${tituloLivro(diaTot.bookId)}` : '')}
                  {(diaTot.pages || diaTot.minutes) ? <> · <button onClick={apagarDia} style={{ background: 'transparent', border: 0, padding: 0, color: T.muted, fontSize: 11, cursor: 'pointer', textDecoration: 'underline', fontFamily: T.serif, fontStyle: 'italic' }}>apagar o dia</button></> : null}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUAS METAS */}
        {(() => {
          const challenges = (typeof MG !== 'undefined' && MG.getChallenges) ? MG.getChallenges() : [];
          const ativas = challenges.filter(c => {
            if (c.period === 'open') return true;
            if (!c.endsAt) return true;
            return new Date(c.endsAt).getTime() >= Date.now();
          });
          if (ativas.length === 0) {
            return (
              <>
                <SectionRule label={tt('suas_metas') !== 'suas_metas' ? tt('suas_metas') : 'Suas metas'}/>
                <div onClick={() => onNav('metas')} style={{
                  padding: '14px 16px', background: 'transparent',
                  border: `1px dashed ${T.hairline}`, borderRadius: 12,
                  cursor: 'pointer', marginBottom: 22, textAlign: 'center',
                  fontFamily: T.serif, fontSize: 13, fontStyle: 'italic', color: T.muted,
                }}>
                  Você ainda não tem uma meta de leitura.
                  <div style={{
                    marginTop: 6, fontSize: 11, fontStyle: 'normal', fontWeight: 600,
                    letterSpacing: 0.4, textTransform: 'uppercase', color: T.terra,
                    fontFamily: T.sans,
                  }}>Criar uma →</div>
                </div>
              </>
            );
          }
          // pega a primeira ativa
          const c = ativas[0];
          const progress = MG.computeChallengeProgress(c);
          const periodLabel = (window.CHALLENGE_PERIODS || []).find(p => p.id === c.period)?.label_pt || c.period;
          let daysLabel = '';
          if (c.endsAt) {
            const days = Math.ceil((new Date(c.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            if (days > 0) daysLabel = `${days} ${days === 1 ? 'dia' : 'dias'} restantes`;
          }
          return (
            <>
              <SectionRule label="Sua meta" action={ativas.length > 1 ? `+${ativas.length - 1} →` : 'editar →'}/>
              <div onClick={() => onNav('metas')} style={{
                padding: '14px 16px', background: T.cream, borderRadius: 12,
                border: `1px solid ${T.hairline}`, cursor: 'pointer', marginBottom: 22,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: T.terra }}/>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', color: T.terra, fontWeight: 700 }}>
                    {periodLabel}
                  </div>
                  {daysLabel && (
                    <div style={{ fontSize: 10, color: T.muted, letterSpacing: 0.3 }}>{daysLabel}</div>
                  )}
                </div>
                <div style={{ fontFamily: T.serif, fontSize: 16, fontWeight: 500, lineHeight: 1.15, marginBottom: 10 }}>
                  {c.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    fontFamily: T.serif, fontSize: 22, fontWeight: 500, color: T.ink,
                    fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5, lineHeight: 1,
                  }}>
                    {progress.value}<span style={{ fontSize: 12, color: T.muted, fontWeight: 400 }}> / {progress.target}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <LinearProgress pct={progress.pct} height={3}/>
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono, fontVariantNumeric: 'tabular-nums' }}>
                    {progress.pct}%
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* CURADORIA */}
        {curadoria.length > 0 && (
          <>
            <SectionRule label={tt('curadoria')}
              action={curadoriaAll.length > 3 ? (showAllCuradoria ? 'ver menos' : tt('ver_mais') + ' →') : null}
              onAction={() => setShowAllCuradoria(v => !v)}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
              {curadoria.map(c => {
                const title = c[`title_${lang}`] || c.title_pt;
                const desc = c[`desc_${lang}`] || c.desc_pt;
                return (
                  <div key={c.id} style={{
                    padding: '12px 14px', background: T.cream, borderRadius: 10,
                    border: `1px solid ${T.hairline}`, cursor: 'pointer',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}>
                    {(() => {
                      // ÂNCORA EDITORIAL: o rótulo diz POR QUE o card aparece hoje.
                      // Só caímos na data quando ela é o argumento (ex.: 1947).
                      const anchor = c[`anchor_${lang}`] || c.anchor_pt;
                      if (anchor) {
                        return (
                          <div style={{
                            width: 58, flexShrink: 0, paddingRight: 10,
                            borderRight: `1px solid ${T.hairline}`,
                            display: 'flex', alignItems: 'center',
                          }}>
                            <div style={{
                              fontSize: 8.5, letterSpacing: 0.8, textTransform: 'uppercase',
                              color: T.terra, fontWeight: 700, lineHeight: 1.3,
                            }}>{anchor}</div>
                          </div>
                        );
                      }
                      const dp = (c.date || '').trim().split(/\s+/);
                      const hasMonth = dp.length >= 2;       // formato 'DD mmm'
                      const top = hasMonth ? dp[1] : '';      // mês (ou vazio p/ datas livres)
                      const big = hasMonth ? dp[0] : (c.date || ''); // dia OU ano ('1947')
                      return (
                        <div style={{
                          width: 58, textAlign: 'center', flexShrink: 0,
                          paddingRight: 10, borderRight: `1px solid ${T.hairline}`,
                          display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        }}>
                          {top && (
                            <div style={{ fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>
                              {top}
                            </div>
                          )}
                          <div style={{ fontFamily: T.serif, fontSize: big.length > 4 ? 15 : 18, fontWeight: 500, lineHeight: 1.05, marginTop: top ? 2 : 0 }}>
                            {big}
                          </div>
                        </div>
                      );
                    })()}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>
                        {title}
                      </div>
                      <div style={{ fontSize: 11, color: T.muted, marginTop: 3, lineHeight: 1.35, fontFamily: T.serif, fontStyle: 'italic' }}>
                        {desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* PARA VOCÊ — sugestões */}
        {sugestoes.length > 0 && (
          <>
            <SectionRule label={tt('para_voce')}/>
            <div style={{ fontSize: 11, color: T.brown, marginBottom: 10, fontFamily: T.serif, fontStyle: 'italic' }}>
              {lang === 'pt' ? 'Porque você lê' : 'Because you read'} <em style={{ color: T.terra }}>{b.title}</em>:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
              {sugestoes.map((s, i) => (
                <div key={i} style={{
                  padding: '10px 14px', background: 'transparent',
                  borderLeft: `2px solid ${T.terra}`, paddingLeft: 14,
                  cursor: 'pointer',
                }}>
                  <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>
                    {s.title}
                  </div>
                  <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 11, color: T.brown, marginTop: 2 }}>
                    {s.author}
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 4, lineHeight: 1.35 }}>
                    {s[`why_${lang}`] || s.why_pt}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PARA GUARDAR — citação literária do dia (gira pela coleção) */}
        <SectionRule label={tt('prompt_de_hoje')}/>
        {(() => {
          const frases = window.FRASES_MARCANTES || [];
          const f = frases.length ? frases[Math.floor(Date.now() / 86400000) % frases.length] : null;
          if (!f) return null;
          return (
            <div style={{
              padding: '16px 18px', background: T.cream,
              border: `1px solid ${T.hairline}`, borderRadius: 12, marginBottom: 22,
            }}>
              <div style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.45, color: T.ink, fontStyle: 'italic' }}>
                “{lang === 'pt' ? f.pt : (f.en || f.pt)}”
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, gap: 12 }}>
                <div style={{ fontFamily: T.serif, fontSize: 12, color: T.brown }}>
                  — {f.autor}{f.obra ? `, ${f.obra}` : ''}
                </div>
                <button
                  onClick={() => {
                    if (typeof window.__shareNote === 'function') {
                      window.__shareNote(
                        { text: (lang === 'pt' ? f.pt : (f.en || f.pt)), kind: 'citação' },
                        { title: f.obra || '', author: f.autor || '' }
                      );
                    }
                  }}
                  aria-label="Compartilhar citação"
                  style={{
                    flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                    background: 'transparent', border: 0, cursor: 'pointer', padding: '2px 0',
                    color: T.terra, fontFamily: T.sans, fontSize: 10, fontWeight: 700,
                    letterSpacing: 0.6, textTransform: 'uppercase',
                  }}>
                  <Icon name="share" size={13} color={T.terra}/> compartilhar
                </button>
              </div>
            </div>
          );
        })()}

        {/* GUIA — convite pro passeio por todas as funcionalidades do app */}
        <button onClick={() => { if (typeof window.__abrirGuia === 'function') window.__abrirGuia(); }} style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px', background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12, marginBottom: 22,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(176,83,58,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="compass" size={20} color={T.terra}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.serif, fontSize: 15.5, fontWeight: 500, color: T.ink, lineHeight: 1.2 }}>✦ Guia da Marginália</div>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, color: T.brown, marginTop: 3 }}>Um passeio por tudo que o app faz — passo a passo.</div>
          </div>
          <div style={{ color: T.terra, fontSize: 16, flexShrink: 0 }}>→</div>
        </button>

        {/* PORTAL — convite para a linha do tempo (linha amiga) */}
        <a href="/linha-do-tempo/" style={{ textDecoration: 'none', display: 'block', marginBottom: 22 }}>
          <div style={{
            background: T.ink, color: T.cream, borderRadius: 14, padding: '18px 18px 16px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -22, top: -22, opacity: 0.1, pointerEvents: 'none' }}>
              <svg viewBox="0 0 36 36" width="110" height="110" fill="none">
                <circle cx="18" cy="18" r="16.5" stroke={T.cream} strokeWidth="1"/>
                <path d="M18 3 L18 33 M3 18 L33 18 M8 8 L28 28 M28 8 L8 28" stroke={T.cream} strokeWidth="1" strokeLinecap="round"/>
                <circle cx="18" cy="18" r="3" fill={T.cream}/>
              </svg>
            </div>
            <div style={{ fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase', color: T.ochre, fontWeight: 700, marginBottom: 8 }}>
              ✦ Portal · linha amiga
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 500, lineHeight: 1.15, marginBottom: 8 }}>
              Atravesse o tempo
            </div>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, lineHeight: 1.5, color: 'rgba(247,241,228,0.82)', marginBottom: 12, maxWidth: '92%' }}>
              Cada livro é uma porta — esta abre para 5.500 anos. Da escrita cuneiforme à IA: história, filosofia, literatura, arte e música em diálogo contínuo.
            </div>
            <div style={{ fontSize: 11, letterSpacing: 0.6, fontWeight: 700, color: T.ochre, textTransform: 'uppercase' }}>
              Entrar na linha do tempo →
            </div>
          </div>
        </a>

        {/* PORTAL — convite para a Travessia (viagem via ficção, página irmã) */}
        <a href="/viagem-no-tempo/" style={{ textDecoration: 'none', display: 'block', marginBottom: 22 }}>
          <div style={{
            background: T.ink, color: T.cream, borderRadius: 14, padding: '18px 18px 16px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -10, top: -6, opacity: 0.14, pointerEvents: 'none' }}>
              <svg viewBox="0 0 24 24" width="104" height="104" fill="none" style={{ transform: 'rotate(14deg)' }}>
                <path d="m21 3-7 19-3.5-8.5L2 10Z" stroke={T.cream} strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M21 3 10.5 13.5" stroke={T.cream} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase', color: T.ochre, fontWeight: 700, marginBottom: 8 }}>
              ✦ Portal · viagem via ficção
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 500, lineHeight: 1.15, marginBottom: 8 }}>
              Travessia
            </div>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, lineHeight: 1.5, color: 'rgba(247,241,228,0.82)', marginBottom: 12, maxWidth: '92%' }}>
              Doze estações pela história, com a ficção como máquina do tempo — sem prazo, no seu ritmo. Passaporte com carimbos de chegada e a mala com os seus livros.
            </div>
            <div style={{ fontSize: 11, letterSpacing: 0.6, fontWeight: 700, color: T.ochre, textTransform: 'uppercase' }}>
              Embarcar →
            </div>
          </div>
        </a>

        {/* PORTAL — convite para a Tapeçaria do Tempo (página irmã) */}
        <a href="/tapecaria/" style={{ textDecoration: 'none', display: 'block', marginBottom: 22 }}>
          <div style={{
            background: T.ink, color: T.cream, borderRadius: 14, padding: '18px 18px 16px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -14, top: -14, opacity: 0.12, pointerEvents: 'none' }}>
              <svg viewBox="0 0 24 24" width="108" height="108" fill="none">
                <path d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" stroke={T.cream} strokeWidth="0.9"/>
                <path d="M5 2v20M9 2v20M13 2v20M17 2v20M21 2v20" stroke={T.cream} strokeWidth="0.9" opacity="0.7"/>
              </svg>
            </div>
            <div style={{ fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase', color: T.ochre, fontWeight: 700, marginBottom: 8 }}>
              ✦ Portal · o acervo tecido na história
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 500, lineHeight: 1.15, marginBottom: 8 }}>
              A Tapeçaria do Tempo
            </div>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, lineHeight: 1.5, color: 'rgba(247,241,228,0.82)', marginBottom: 12, maxWidth: '92%' }}>
              Cada livro seu envolto nas vozes do seu tempo — o que se pensava, a música, as artes, o cinema. O fio de cada obra, tecido uma vez, guardado pra sempre.
            </div>
            <div style={{ fontSize: 11, letterSpacing: 0.6, fontWeight: 700, color: T.ochre, textTransform: 'uppercase' }}>
              Puxar o fio →
            </div>
          </div>
        </a>

        {/* PORTAL — convite para o Nobel de Literatura (página irmã) */}
        <a href="/nobel/" style={{ textDecoration: 'none', display: 'block', marginBottom: 22 }}>
          <div style={{
            background: T.ink, color: T.cream, borderRadius: 14, padding: '18px 18px 16px',
            position: 'relative', overflow: 'hidden',
          }}>
            <img src="/nobel-medal.png" alt="" style={{ position: 'absolute', right: -16, top: -16, width: 116, height: 116, opacity: 0.16, pointerEvents: 'none' }}/>
            <div style={{ fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase', color: T.ochre, fontWeight: 700, marginBottom: 8 }}>
              ✦ Portal · página irmã
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 500, lineHeight: 1.15, marginBottom: 8 }}>
              Nobel de Literatura
            </div>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, lineHeight: 1.5, color: 'rgba(247,241,228,0.82)', marginBottom: 12, maxWidth: '92%' }}>
              Cada laureado, de 1901 até hoje, e os cotados de cada ano. Marque o que leu, organize sua estante e guarde a sua nota — à margem do mais célebre prêmio das letras.
            </div>
            <div style={{ fontSize: 11, letterSpacing: 0.6, fontWeight: 700, color: T.ochre, textTransform: 'uppercase' }}>
              Entrar no Nobel →
            </div>
          </div>
        </a>

        {/* EM TESTE — chamada leve de feedback */}
        {typeof FeedbackButton !== 'undefined' && (
          <>
            <SectionRule label="Em teste"/>
            <FeedbackButton variant="inline"/>
          </>
        )}
      </div>

      {/* barra de navegação agora é a global (fixa no rodapé), renderizada pelo app */}
    </div>
  );
}

// auxiliares de seção (compartilhados pelas variantes)
function SectionRule({ label, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 1, background: T.hairline }}/>
      {action && (
        <div onClick={onAction} style={{ fontSize: 10, color: T.terra, letterSpacing: 0.6, fontWeight: 600, cursor: onAction ? 'pointer' : 'default' }}>
          {action}
        </div>
      )}
    </div>
  );
}

// LeituraCard — a entrada de um livro em leitura na Home: capa, progresso, "Retomar"
// e "Li agora" (soma no dia de hoje, neste livro). Uma igual para cada livro aberto.
function LeituraCard({ book: x, onNav = () => {}, label = 'Retomar leitura' }) {
  const [addP, setAddP] = React.useState('');
  const [addM, setAddM] = React.useState('');
  const abrir = () => { if (typeof window.__openBook === 'function') window.__openBook(x); else onNav('book'); };
  const somar = () => {
    const n = parseInt(addP, 10) || 0, m = parseInt(addM, 10) || 0;
    if (n <= 0 && m <= 0) return;
    if (typeof MG !== 'undefined' && MG.logReading) MG.logReading(n, x.id, { minutes: m, src: 'hoje' });
    setAddP(''); setAddM('');
  };
  const pct = x.pages ? Math.min(100, Math.round(((x.currentPage || 0) / x.pages) * 100)) : (x.pct || 0);
  const ativo = !!(parseInt(addP, 10) || parseInt(addM, 10));
  const inp = { width: 46, padding: '6px 4px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, color: T.ink, fontFamily: T.sans, fontSize: 13, outline: 'none', textAlign: 'center' };
  return (
    <div onClick={abrir} style={{
      padding: '14px 14px 16px', background: T.cream, borderRadius: 12,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 6px 18px rgba(60,40,20,0.05)',
      border: `1px solid ${T.hairline}`, cursor: 'pointer', marginBottom: 12,
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <BookCover title={x.title} author={x.author} tone={x.tone} cover={x.cover} isbn={x.isbn} w={68} book={x}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: x.status === 'paused' ? T.muted : T.terra, fontWeight: 600 }}>
            {x.status === 'paused' ? 'pausado' : (x.theme || 'lendo')}
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 20, lineHeight: 1.1, fontWeight: 500, letterSpacing: -0.4, marginTop: 4 }}>{x.title}</div>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, color: T.brown, marginTop: 2 }}>
            {x.author}{x.nobel && typeof NobelMark !== 'undefined' && <NobelMark nobel={x.nobel} size={12}/>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <LinearProgress pct={pct} height={2} style={{ flex: 1 }}/>
            <span style={{ fontSize: 10, fontFamily: T.mono, fontVariantNumeric: 'tabular-nums', color: T.muted, whiteSpace: 'nowrap' }}>
              {x.pages ? `pág ${x.currentPage || 0} · ` : ''}{pct}%
            </span>
          </div>
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); abrir(); }} style={{
        marginTop: 12, width: '100%', padding: '10px 0',
        background: T.ink, color: T.cream, border: 0, borderRadius: 8,
        fontFamily: T.sans, fontSize: 12, fontWeight: 600, letterSpacing: 0.4,
        textTransform: 'uppercase', cursor: 'pointer',
      }}>{label}</button>
      {!window.__demoShelf && (
        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.hairline}`, flexWrap: 'wrap', cursor: 'default' }}>
          <span style={{ fontSize: 12, color: T.brown, fontFamily: T.serif }}>Li agora:</span>
          <input value={addP} onChange={(e) => setAddP(e.target.value)} inputMode="numeric" placeholder="0" onKeyDown={(e) => e.key === 'Enter' && somar()} style={inp}/>
          <span style={{ fontSize: 11, color: T.brown }}>pág</span>
          <input value={addM} onChange={(e) => setAddM(e.target.value)} inputMode="numeric" placeholder="0" onKeyDown={(e) => e.key === 'Enter' && somar()} style={inp}/>
          <span style={{ fontSize: 11, color: T.brown }}>min</span>
          <div style={{ flex: 1 }}/>
          <button onClick={somar} disabled={!ativo} style={{ padding: '6px 12px', borderRadius: 8, border: 0, background: ativo ? T.terra : T.parchment, color: ativo ? T.cream : T.brown, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ somar</button>
        </div>
      )}
    </div>
  );
}

// AnelDoDia — o dia se preenche conforme a meta diária (páginas OU minutos)
function AnelDoDia({ pct = 0, temMeta = false, cumpriu = false, leu = false }) {
  const r = 22, c = 2 * Math.PI * r, p = Math.max(0, Math.min(100, pct));
  const cor = cumpriu ? T.olive : T.terra;
  return (
    <svg width="58" height="58" viewBox="0 0 58 58" style={{ flexShrink: 0 }} aria-label="leitura de hoje">
      <circle cx="29" cy="29" r={r} fill="none" stroke={T.parchment} strokeWidth="5"/>
      {temMeta && p > 0 ? (
        <circle cx="29" cy="29" r={r} fill="none" stroke={cor} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${(c * p) / 100} ${c}`} transform="rotate(-90 29 29)" style={{ transition: 'stroke-dasharray .6s ease' }}/>
      ) : (leu ? <circle cx="29" cy="29" r={r} fill="none" stroke="rgba(176,83,58,0.38)" strokeWidth="5"/> : null)}
      <text x="29" y="33.5" textAnchor="middle" fontFamily={T.serif} fontSize={temMeta && !cumpriu ? 12 : 15} fill={temMeta && cumpriu ? T.olive : T.ink}>
        {temMeta ? (cumpriu ? '✓' : `${Math.round(p)}%`) : (leu ? '✓' : '·')}
      </text>
    </svg>
  );
}

function MicroStat({ n, label, accent }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
      <div style={{
        fontFamily: T.serif, fontSize: 22, fontWeight: 500,
        color: accent, lineHeight: 1, letterSpacing: -0.5,
      }}>{n}</div>
      <div style={{
        fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase',
        color: T.muted, marginTop: 4, fontWeight: 600,
      }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Variant B: "Linha do tempo" — journal / daily study rhythm
// Emphasizes the habit + today's reading as a vertical timeline
// ─────────────────────────────────────────────────────────────
function HomeVariantB({ onNav = () => {} }) {
  const b = (typeof currentBook === 'function' ? currentBook() : BOOK_CURRENT);
  const streak = 14;
  const days = ['S','T','Q','Q','S','S','D'];
  const read =  [ 1,  1,  1,  1,  1,  0,  1];
  return (
    <div style={{
      width: '100%', height: '100%', background: T.paper,
      fontFamily: T.sans, color: T.ink, position: 'relative', overflow: 'hidden',
    }}>
      <StatusBar/>

      <div style={{ padding: '6px 24px 0' }}>
        {/* perfil no topo */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
          <UserAvatar size={32}/>
        </div>
        <LoginPrompt/>
        {/* greeting */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: T.muted, marginBottom: 6 }}>
            Boa tarde, Laura
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 30, lineHeight: 1.05, fontWeight: 400, letterSpacing: -0.6 }}>
            Quinze minutos<br/>
            <span style={{ fontStyle: 'italic', color: T.terra }}>bastam hoje.</span>
          </div>
        </div>

        {/* streak strip */}
        <div style={{
          background: T.cream, borderRadius: 12, padding: '14px 16px',
          border: `1px solid ${T.hairline}`, marginBottom: 22,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 54, height: 54, borderRadius: '50%',
            background: `conic-gradient(${T.terra} ${(streak/21)*360}deg, ${T.parchment} 0)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: T.cream,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 500, lineHeight: 1 }}>{streak}</div>
              <div style={{ fontSize: 8, color: T.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>dias</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Ritmo de estudo</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {days.map((d,i) => (
                <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 9, color: T.muted, marginBottom: 3 }}>{d}</div>
                  <div style={{
                    height: 6, borderRadius: 4,
                    background: read[i] ? T.terra : T.parchment,
                    opacity: read[i] ? 1 : 0.6,
                  }}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* timeline */}
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.muted, marginBottom: 12 }}>
          Hoje — 18 de abril
        </div>

        <div style={{ position: 'relative', paddingLeft: 28 }}>
          {/* vertical line */}
          <div style={{ position: 'absolute', left: 7, top: 8, bottom: 20, width: 1, background: T.hairline }}/>

          {/* entry 1: read */}
          <TimelineItem dot={T.terra} time="" title={`Ler ${b.title}`} sub={b.pct ? `${b.pct}% lido · continue de onde parou` : 'Continue de onde parou'}
            primary
            body={
              <div onClick={() => { if (typeof window.__openBook === 'function') window.__openBook(b); else onNav('book'); }} style={{
                marginTop: 10, display: 'flex', gap: 12, alignItems: 'center',
                padding: 12, background: T.cream, borderRadius: 8, border: `1px solid ${T.hairline}`,
                cursor: 'pointer',
              }}>
                <BookCover title={b.title} author={b.author} tone={b.tone} cover={b.cover} isbn={b.isbn} w={52}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>{b.pages ? `pág ${b.currentPage || 0} de ${b.pages}` : (b.currentPage ? `pág ${b.currentPage}` : 'em leitura')}</div>
                  <LinearProgress pct={b.pct || 0} height={3}/>
                  <div style={{ fontSize: 10, color: T.muted, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                    {b.pct || 0}%{b.pages ? ` · restam ~${Math.max(0, Math.round(((b.pages || 0) - (b.currentPage || 0)) / 20))}h de leitura` : ''}
                  </div>
                </div>
              </div>
            }
          />

          <TimelineItem dot={T.olive} time="20:20" title="Anotar 1 reflexão"
            sub="Mínimo 3 linhas · marca pensamentos cruzados"/>

          <TimelineItem dot={T.ochre} time="20:30" title="Resenhar o dia"
            sub="30 segundos · marca chaves para revisitar"/>

          <TimelineItem dot={T.muted} time="qui 22" title="Sessão de estudo"
            sub="Consolidar o Livro IV · 45 min" future/>
        </div>
      </div>

      {/* barra de navegação agora é a global (fixa no rodapé), renderizada pelo app */}
    </div>
  );
}

function TimelineItem({ dot, time, title, sub, body, primary, future }) {
  return (
    <div style={{ marginBottom: 18, position: 'relative' }}>
      <div style={{
        position: 'absolute', left: -28, top: 3,
        width: 15, height: 15, borderRadius: '50%',
        background: future ? T.paper : dot,
        border: `2px solid ${future ? T.hairline : dot}`,
        boxShadow: primary ? `0 0 0 4px ${dot}22` : 'none',
      }}/>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, fontVariantNumeric: 'tabular-nums', width: 40 }}>
          {time}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: primary ? 600 : 500, color: future ? T.muted : T.ink, letterSpacing: -0.2 }}>
            {title}
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{sub}</div>
          {body}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Variant C: "Mapa de temas" — conceptual, study-oriented
// A garden of themes; current book at center, themes around
// ─────────────────────────────────────────────────────────────
function HomeVariantC({ onNav = () => {} }) {
  const b = (typeof currentBook === 'function' ? currentBook() : BOOK_CURRENT);
  return (
    <div style={{
      width: '100%', height: '100%', background: T.bone,
      fontFamily: T.sans, color: T.ink, position: 'relative', overflow: 'hidden',
    }}>
      <StatusBar/>
      <div style={{ padding: '6px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>Seu estudo</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name="search" size={20} color={T.muted}/>
            <UserAvatar size={32}/>
          </div>
        </div>

        <LoginPrompt/>

        {/* focus card — book at center */}
        <div style={{
          position: 'relative', padding: '24px 20px 20px',
          background: T.ink, borderRadius: 18, color: T.cream, overflow: 'hidden',
          marginBottom: 22,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(180,83,58,0.3), transparent 40%)',
            pointerEvents: 'none',
          }}/>
          <div style={{ position: 'relative', display: 'flex', gap: 18 }}>
            <BookCover title={b.title} author={b.author} tone={b.tone} cover={b.cover} isbn={b.isbn} w={70} book={b}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>
                Em estudo
              </div>
              <div style={{ fontFamily: T.serif, fontSize: 20, lineHeight: 1.1, fontWeight: 500, marginBottom: 4 }}>
                {b.title}
              </div>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, opacity: 0.7, marginBottom: 14 }}>
                {b.author}{b.nobel && typeof NobelMark !== 'undefined' && <NobelMark nobel={b.nobel} size={13}/>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ProgressRing pct={b.pct} size={36} stroke={2.5} color="#E9B47A" track="rgba(255,255,255,0.15)"
                  label={<span style={{ color: T.cream, fontSize: 10 }}>{b.pct}%</span>} />
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  Livro IV de VII<br/>
                  <span style={{ opacity: 0.5 }}>{b.pages - b.currentPage} pág restantes</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', marginTop: 18, display: 'flex', gap: 8 }}>
            <button onClick={() => { if (typeof window.__openBook === 'function') window.__openBook(b); else onNav('book'); }} style={{
              flex: 1, padding: '10px 0', background: T.terra, color: T.cream,
              border: 0, borderRadius: 8, fontFamily: T.sans, fontWeight: 600, fontSize: 13,
              cursor: 'pointer',
            }}>Continuar</button>
            <button style={{
              padding: '10px 14px', background: 'rgba(255,255,255,0.08)', color: T.cream,
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
              fontFamily: T.sans, fontWeight: 500, fontSize: 13, cursor: 'pointer',
            }}>+ Nota</button>
          </div>
        </div>

        {/* themes grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.muted }}>
            Temas em estudo
          </div>
          <div style={{ fontSize: 11, color: T.terra, fontWeight: 600 }}>Ver todos</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {THEMES_STUDY.slice(0,4).map(t => <ThemeTile key={t.id} t={t}/>)}
        </div>

        {/* recent notes strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.muted }}>
            Notas recentes
          </div>
          <div style={{ fontSize: 11, color: T.terra, fontWeight: 600 }}>+ Nova</div>
        </div>
        <div style={{
          background: T.cream, borderRadius: 12, padding: '14px 16px',
          border: `1px solid ${T.hairline}`,
        }}>
          <div style={{ fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', color: T.terra, fontWeight: 600, marginBottom: 6 }}>
            Citação · IV, 17
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 14, lineHeight: 1.4, fontStyle: 'italic', color: T.ink }}>
            “Não vivas como se tivesses dez mil anos pela frente…”
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: T.muted }}>Meditações · pág 162 · anteontem</div>
        </div>
      </div>
      {/* barra de navegação agora é a global (fixa no rodapé), renderizada pelo app */}
    </div>
  );
}

function ThemeTile({ t }) {
  const c = { terra: T.terra, olive: T.olive, ochre: T.ochre, rose: '#C9836E' }[t.color];
  return (
    <div style={{
      padding: '14px 14px 16px', background: T.cream, borderRadius: 12,
      border: `1px solid ${T.hairline}`, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: c }}/>
      <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: T.muted, marginBottom: 4 }}>
        {t.count} textos
      </div>
      <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500, letterSpacing: -0.2, marginBottom: 6, lineHeight: 1.1 }}>
        {t.title}
      </div>
      <div style={{ fontSize: 10, color: T.brown, lineHeight: 1.35 }}>{t.summary}</div>
    </div>
  );
}

Object.assign(window, { HomeVariantA, HomeVariantB, HomeVariantC, StatusBar, TabBar, SectionRule, MicroStat });
