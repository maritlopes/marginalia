// home-variants.jsx — three home-screen treatments for Clube de Leitura

// ─────────────────────────────────────────────────────────────
// Shared header (status bar, time) — small so the home feels live
// ─────────────────────────────────────────────────────────────
function StatusBar({ dark = false }) {
  const c = dark ? '#fff' : T.ink;
  return (
    <div style={{
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
  const abrir = () => { if (typeof window !== 'undefined' && window.__openAccount) window.__openAccount(); };
  return (
    <div onClick={abrir} title="Seu perfil · entrar e sincronizar" style={{
      width: size, height: size, borderRadius: '50%', background: T.ink, color: T.cream,
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      fontFamily: T.serif, fontWeight: 500, fontSize: Math.round(size * 0.42),
      boxShadow: ini ? 'none' : '0 0 0 2px ' + T.terra,
    }}>{ini || <Icon name="user" size={Math.round(size * 0.45)} color={T.cream}/>}</div>
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
  const banner = window.HOJE_BANNER || [];
  // começa por um item diferente a cada dia, para o Radar parecer sempre atualizado
  const [bannerIdx, setBannerIdx] = React.useState(() =>
    banner.length ? Math.floor(Date.now() / 86400000) % banner.length : 0);
  React.useEffect(() => {
    if (banner.length === 0) return;
    const id = setInterval(() => setBannerIdx(i => (i + 1) % banner.length), 7000);
    return () => clearInterval(id);
  }, [banner.length]);

  // "Esta semana" REAL — a partir do registro de leitura (segunda a domingo)
  const [hojePag, setHojePag] = React.useState('');
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
    const sessoes = perDay.filter((n) => n > 0).length;
    const ritmo = sessoes ? Math.round(paginas / sessoes) : 0;
    return { paginas, sessoes, ritmo, perDay };
  })();
  const stats = { paginas: semana.paginas, sessoes: semana.sessoes, ritmo: semana.ritmo };
  const mosaico = semana.perDay.map((n) => n > 0);

  const registrarHoje = () => {
    const n = parseInt(hojePag, 10);
    if (!n || n <= 0) return;
    if (typeof MG !== 'undefined' && MG.logReading) MG.logReading(n, (b && b.id) || null);
    setHojePag('');
  };

  // curadoria — mostra 3 na home; "ver mais" abre o banco completo (todas)
  const [showAllCuradoria, setShowAllCuradoria] = React.useState(false);
  const curadoriaAll = (window.CURADORIA || []);
  const curadoria = showAllCuradoria ? curadoriaAll : curadoriaAll.slice(0, 3);

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
        {/* brand + greeting + idioma toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
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

        {/* EM LEITURA — versão compacta */}
        <SectionRule label={tt('em_leitura')}/>
        <div onClick={() => { if (typeof window.__openBook === 'function') window.__openBook(b); else onNav('book'); }} style={{
          padding: '14px 14px 16px', background: T.cream, borderRadius: 12,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 6px 18px rgba(60,40,20,0.05)',
          border: `1px solid ${T.hairline}`, cursor: 'pointer', marginBottom: 22,
        }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <BookCover title={b.title} author={b.author} tone={b.tone}
                       cover={b.cover} isbn={b.isbn} w={68} book={b}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.terra, fontWeight: 600 }}>
                {b.theme}
              </div>
              <div style={{ fontFamily: T.serif, fontSize: 20, lineHeight: 1.1, fontWeight: 500, letterSpacing: -0.4, marginTop: 4 }}>
                {b.title}
              </div>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, color: T.brown, marginTop: 2 }}>
                {b.author}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <LinearProgress pct={b.pct} height={2} style={{ flex: 1 }}/>
                <span style={{ fontSize: 10, fontFamily: T.mono, fontVariantNumeric: 'tabular-nums', color: T.muted }}>
                  {b.pct}%
                </span>
              </div>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); if (typeof window.__openBook === 'function') window.__openBook(b); else onNav('book'); }} style={{
            marginTop: 12, width: '100%', padding: '10px 0',
            background: T.ink, color: T.cream, border: 0, borderRadius: 8,
            fontFamily: T.sans, fontSize: 12, fontWeight: 600, letterSpacing: 0.4,
            textTransform: 'uppercase', cursor: 'pointer',
          }}>{tt('retomar_leitura')}</button>
        </div>

        {/* ESTA SEMANA — stats + mosaico */}
        <SectionRule label={tt('esta_semana')}/>
        <div style={{
          background: T.paper, borderRadius: 12, padding: '14px 16px',
          border: `1px solid ${T.hairline}`, marginBottom: 22,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 14 }}>
            <MicroStat n={stats.paginas} label={tt('paginas')} accent={T.terra}/>
            <MicroStat n={stats.sessoes} label={tt('sessoes')} accent={T.olive}/>
            <MicroStat n={stats.ritmo > 0 ? stats.ritmo : '—'} label={tt('ritmo')} accent={T.ochre}/>
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'space-around' }}>
            {['dia_seg','dia_ter','dia_qua','dia_qui','dia_sex','dia_sab','dia_dom'].map((k, i) => (
              <div key={k} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  height: 24, borderRadius: 4, marginBottom: 4,
                  background: mosaico[i] ? T.terra : T.parchment,
                  opacity: mosaico[i] ? 1 : 0.5,
                }}/>
                <div style={{ fontSize: 9, color: T.muted, fontFamily: T.mono, letterSpacing: 0.5 }}>
                  {tt(k)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.hairline}` }}>
            <span style={{ fontSize: 12, color: T.brown, fontFamily: T.serif }}>Li hoje:</span>
            <input value={hojePag} onChange={(e) => setHojePag(e.target.value)} inputMode="numeric" placeholder="0"
              onKeyDown={(e) => e.key === 'Enter' && registrarHoje()}
              style={{ width: 60, padding: '7px 9px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, color: T.ink, fontFamily: T.sans, fontSize: 13, outline: 'none', textAlign: 'center' }}/>
            <span style={{ fontSize: 12, color: T.muted }}>páginas</span>
            <div style={{ flex: 1 }}/>
            <button onClick={registrarHoje} style={{ padding: '7px 14px', borderRadius: 8, border: 0, background: T.ink, color: T.cream, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Registrar</button>
          </div>
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
          <Icon name="search" size={20} color={T.muted}/>
        </div>

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
                {b.author}
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
