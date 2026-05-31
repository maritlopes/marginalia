// screens.jsx — full prototype screens (non-home)

// ─────────────────────────────────────────────────────────────
// Book detail — deep reading view with progress, chapters, theme
// ─────────────────────────────────────────────────────────────
function ScreenBookDetail({ book = null, onNav = () => {}, onOpenSummary = () => {} }) {
  // relê sempre a versão viva do livro na estante (para refletir edições recentes),
  // caindo para o objeto recebido e, por fim, para o livro atual / exemplo.
  const liveBook = (book && book.id) ? (window.BOOKS || []).find(x => x.id === book.id) : null;
  const b = liveBook || book || (typeof currentBook === 'function' ? currentBook() : BOOK_CURRENT);
  const isDemo = !b || (typeof BOOK_CURRENT !== 'undefined' && b.id === BOOK_CURRENT.id);
  const bookNotes = (window.NOTES || []).filter(n => n.book === b.title);
  const pct = typeof b.pct === 'number' ? b.pct : 0;
  const currentPage = b.currentPage || 0;
  const openEditor = () => { if (typeof window.__editBook === 'function') window.__editBook(b); };

  const [tab, setTab] = React.useState('sobre');
  const demoChapters = [
    { n: 'I', title: 'Dívidas e gratidão', pages: '1–24', done: true },
    { n: 'II', title: 'O tempo emprestado', pages: '25–62', done: true },
    { n: 'III', title: 'Sobre o exercício', pages: '63–116', done: true },
    { n: 'IV', title: 'Sobre a natureza', pages: '117–172', done: false, current: true },
    { n: 'V', title: 'Dever e trabalho', pages: '173–218', done: false },
    { n: 'VI', title: 'Indiferença aos bens', pages: '219–262', done: false },
    { n: 'VII', title: 'A cidadania do mundo', pages: '263–304', done: false },
  ];
  const chapters = isDemo ? demoChapters : [];
  // abas: 'sobre' e 'notas' sempre; 'capítulos'/'pontes' só no livro de exemplo
  const tabs = ['sobre', ...(chapters.length ? ['capítulos'] : []), 'notas', ...(isDemo ? ['pontes'] : [])];
  const outrosLivros = (window.BOOKS || []).filter(x => x.id !== b.id);

  return (
    <div style={{
      width: '100%', height: '100%', background: T.bone,
      fontFamily: T.sans, color: T.ink, position: 'relative', overflow: 'auto',
    }}>
      {/* header — warm with cover */}
      <div style={{
        background: T.cream, padding: '56px 24px 24px', position: 'relative',
        borderBottom: `1px solid ${T.hairline}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <button onClick={() => onNav('home')} style={{
            width: 36, height: 36, borderRadius: '50%', background: T.bone,
            border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <Icon name="arrowLeft" size={18}/>
          </button>
          <button onClick={openEditor} aria-label="Editar livro" title="Editar livro" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: T.bone, border: `1px solid ${T.hairline}`, borderRadius: 999,
            padding: '7px 14px', cursor: 'pointer', color: T.brown,
            fontFamily: T.sans, fontSize: 12, fontWeight: 600, letterSpacing: 0.3,
          }}>
            <Icon name="pen" size={15} color={T.terra}/> Editar
          </button>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <BookCover title={b.title} author={b.author} tone={b.tone} cover={b.cover} isbn={b.isbn} w={110} book={b}/>
          <div style={{ flex: 1, paddingTop: 4 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.terra, marginBottom: 6, fontWeight: 600 }}>
              {b.theme || 'Sem tema'}
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 500, lineHeight: 1.05, letterSpacing: -0.4, marginBottom: 4 }}>
              {b.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              {typeof AuthorPortrait !== 'undefined' && <AuthorPortrait name={b.author} size={28}/>}
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, color: T.brown }}>
                {b.author}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 10, color: T.muted, letterSpacing: 0.4 }}>
              <div><span style={{ color: T.ink, fontWeight: 600 }}>{b.pages || '—'}</span> pág</div>
              <div><span style={{ color: T.ink, fontWeight: 600 }}>{bookNotes.length}</span> notas</div>
              <div><span style={{ color: T.ink, fontWeight: 600 }}>{b.started || '—'}</span> início</div>
            </div>
          </div>
        </div>

        {/* progress bar */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
            <div style={{ color: T.muted }}>Leitura</div>
            <div style={{ fontFamily: T.mono, fontVariantNumeric: 'tabular-nums', color: T.ink, fontWeight: 600 }}>
              {currentPage}<span style={{ color: T.muted, fontWeight: 400 }}> / {b.pages || '—'}</span> · {pct}%
            </div>
          </div>
          <LinearProgress pct={pct} height={6}/>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: 'flex', padding: '0 24px', borderBottom: `1px solid ${T.hairline}`, background: T.bone, position: 'sticky', top: 0, zIndex: 10 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'transparent', border: 0, padding: '14px 18px 12px',
            borderBottom: `2px solid ${tab === t ? T.terra : 'transparent'}`,
            color: tab === t ? T.ink : T.muted,
            fontFamily: T.sans, fontSize: 12, fontWeight: 600, letterSpacing: 0.4,
            textTransform: 'uppercase', cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: '20px 24px 120px' }}>
        {tab === 'sobre' && (
          <>
            {b.blurb ? (
              <div style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.5, color: T.ink, marginBottom: 22 }}>
                {b.blurb}
              </div>
            ) : !isDemo && (
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, lineHeight: 1.5, color: T.muted, marginBottom: 22 }}>
                Ainda sem resumo. Toque em <strong style={{ color: T.brown }}>Editar</strong> para acrescentar detalhes deste livro.
              </div>
            )}

            {/* plano de leitura real — atualizar página + cronograma por data-alvo */}
            <PlanoLeitura book={b}/>

            {/* quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
              {isDemo ? (
                <>
                  <QuickCard icon="play" title="Continuar" sub={`pág ${currentPage}`} primary onClick={() => onNav('reader')}/>
                  <QuickCard icon="clock" title="Foco" sub="Sessão com timer" onClick={() => onNav('foco')}/>
                  <QuickCard icon="note" title="Escrever nota" sub="3 hoje" onClick={() => onNav('note')}/>
                  <QuickCard icon="sparkle" title="Pontes" sub={`${PONTES.length} ecos deste livro`} onClick={() => onNav('pontes')}/>
                  <QuickCard icon="quote" title="Síntese" sub="Até onde estou" onClick={onOpenSummary}/>
                  <QuickCard icon="share" title="Conversas" sub="Sobre temas do livro" onClick={() => onNav('conversas')}/>
                </>
              ) : (
                <>
                  <QuickCard icon="note" title="Escrever nota" sub={`${bookNotes.length} ${bookNotes.length === 1 ? 'nota' : 'notas'}`} primary onClick={() => onNav('note')}/>
                  <QuickCard icon="clock" title="Foco" sub="Sessão com timer" onClick={() => onNav('foco')}/>
                  <QuickCard icon="pen" title="Editar livro" sub="Status, páginas, capa" onClick={openEditor}/>
                </>
              )}
            </div>

            {/* temas */}
            {isDemo ? (
              <>
                <SectionTitle>Temas encontrados</SectionTitle>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
                  {['Virtude', 'Natureza', 'Morte', 'Razão', 'Tempo', 'Dever'].map(t => (
                    <div key={t} style={{
                      padding: '6px 12px', background: T.paper, borderRadius: 999,
                      border: `1px solid ${T.hairline}`, fontSize: 12, color: T.brown,
                      fontFamily: T.serif, fontStyle: 'italic',
                    }}>{t}</div>
                  ))}
                </div>
              </>
            ) : (b.theme && b.theme !== 'Sem tema') && (
              <>
                <SectionTitle>Tema</SectionTitle>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
                  <div style={{
                    padding: '6px 12px', background: T.paper, borderRadius: 999,
                    border: `1px solid ${T.hairline}`, fontSize: 12, color: T.brown,
                    fontFamily: T.serif, fontStyle: 'italic',
                  }}>{b.theme}</div>
                </div>
              </>
            )}

            {/* leituras cruzadas (exemplo) / outros na estante (real) */}
            {isDemo ? (
              <>
                <SectionTitle>Leituras cruzadas</SectionTitle>
                <div style={{ display: 'flex', gap: 12, overflowX: 'auto', marginLeft: -24, paddingLeft: 24, paddingRight: 24, paddingBottom: 4 }}>
                  {BOOKS.slice(1,5).map(k => (
                    <div key={k.id} style={{ width: 80, flexShrink: 0 }}>
                      <BookCover title={k.title} author={k.author} tone={k.tone} cover={k.cover} isbn={k.isbn} w={80}/>
                      <div style={{ fontSize: 11, fontFamily: T.serif, fontWeight: 500, marginTop: 8, lineHeight: 1.15 }}>
                        {k.title}
                      </div>
                      <div style={{ fontSize: 10, color: T.muted, fontStyle: 'italic' }}>{k.author}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : outrosLivros.length > 0 && (
              <>
                <SectionTitle>Outros na sua estante</SectionTitle>
                <div style={{ display: 'flex', gap: 12, overflowX: 'auto', marginLeft: -24, paddingLeft: 24, paddingRight: 24, paddingBottom: 4 }}>
                  {outrosLivros.slice(0, 6).map(k => (
                    <div key={k.id} onClick={() => { if (typeof window.__openBook === 'function') window.__openBook(k); }}
                         style={{ width: 80, flexShrink: 0, cursor: 'pointer' }}>
                      <BookCover title={k.title} author={k.author} tone={k.tone} cover={k.cover} isbn={k.isbn} w={80}/>
                      <div style={{ fontSize: 11, fontFamily: T.serif, fontWeight: 500, marginTop: 8, lineHeight: 1.15 }}>
                        {k.title}
                      </div>
                      <div style={{ fontSize: 10, color: T.muted, fontStyle: 'italic' }}>{k.author}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {tab === 'capítulos' && (
          <div style={{ background: T.cream, borderRadius: 12, border: `1px solid ${T.hairline}`, overflow: 'hidden' }}>
            {chapters.map((c, i) => (
              <div key={c.n} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                borderTop: i === 0 ? 'none' : `1px solid ${T.hairline}`,
                background: c.current ? T.paper : 'transparent',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: c.done ? T.olive : (c.current ? T.terra : 'transparent'),
                  color: c.done || c.current ? T.cream : T.muted,
                  border: c.done || c.current ? 'none' : `1px solid ${T.hairline}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: T.serif, fontSize: 12, fontWeight: 500,
                }}>{c.done ? '✓' : c.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500, color: T.ink }}>
                    Livro {c.n} — <span style={{ fontStyle: 'italic' }}>{c.title}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
                    pág {c.pages} {c.current && '· lendo agora'}
                  </div>
                </div>
                {c.current && <div style={{ fontSize: 10, color: T.terra, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>atual</div>}
              </div>
            ))}
          </div>
        )}

        {tab === 'notas' && (
          bookNotes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {bookNotes.map(n => <NoteCard key={n.id} n={n} onClick={() => onNav('note')}/>)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 16px' }}>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 15, color: T.muted, marginBottom: 16, lineHeight: 1.5 }}>
                Nenhuma nota neste livro ainda.<br/>A margem está em branco, à sua espera.
              </div>
              <button onClick={() => onNav('note')} style={{
                background: T.terra, color: T.cream, border: 0, borderRadius: 999,
                padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: T.sans, letterSpacing: 0.3,
              }}>Escrever a primeira nota</button>
            </div>
          )
        )}

        {tab === 'pontes' && (
          <>
            <div style={{
              padding: '14px 16px', background: T.ink, color: T.cream, borderRadius: 12,
              marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Icon name="sparkle" size={18} color={T.ochre}/>
              <div style={{ flex: 1, fontSize: 12, lineHeight: 1.4 }}>
                <span style={{ color: T.ochre, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', fontSize: 10 }}>
                  Pontes deste livro
                </span>
                <div style={{ marginTop: 2 }}>{PONTES.length} ecos — filosofia, música, arte, cinema, história.</div>
              </div>
              <button onClick={() => onNav('pontes')} style={{
                background: T.terra, color: T.cream, border: 0, borderRadius: 999,
                padding: '7px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                fontFamily: T.sans, letterSpacing: 0.3,
              }}>Abrir</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PONTES.slice(0, 4).map(p => <PonteCard key={p.id} p={p}/>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// PlanoLeitura — "onde estou" (atualizar página) + cronograma por data-alvo.
// O ritmo sugerido se recalcula sozinho conforme a página avança.
function PlanoLeitura({ book }) {
  const b = book || {};
  const pages = b.pages || 0;
  const cur = b.currentPage || 0;
  const [editingPage, setEditingPage] = React.useState(false);
  const [pageInput, setPageInput] = React.useState(String(cur));
  const [goal, setGoal] = React.useState(b.goalFinishBy || '');

  const salvarPagina = () => {
    let p = Math.max(0, parseInt(pageInput) || 0);
    if (pages) p = Math.min(p, pages);
    const pct = pages ? Math.min(100, Math.round((p / pages) * 100)) : (b.pct || 0);
    if (typeof MG !== 'undefined' && MG.updateBook) MG.updateBook(b.id, { currentPage: p, pct });
    setEditingPage(false);
  };

  const definirMeta = (val) => {
    setGoal(val);
    if (typeof MG !== 'undefined' && MG.updateBook) MG.updateBook(b.id, { goalFinishBy: val || null });
  };

  const pct = pages ? Math.min(100, Math.round((cur / pages) * 100)) : 0;

  // cronograma
  let plano = null;
  if (pages && goal) {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const fim = new Date(goal + 'T00:00:00');
    const pagsRestantes = Math.max(0, pages - cur);
    const diasRestantes = Math.round((fim - hoje) / 86400000);
    if (pagsRestantes === 0) {
      plano = { tipo: 'fim', msg: 'Você chegou ao fim. Travessia concluída. 🏁' };
    } else if (diasRestantes < 0) {
      plano = { tipo: 'passou', msg: 'A data escolhida já passou — ajuste a meta acima.' };
    } else {
      const dias = Math.max(1, diasRestantes);
      plano = {
        tipo: 'ok',
        ritmo: Math.ceil(pagsRestantes / dias),
        pagsRestantes, dias,
        fim: fim.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      };
    }
  }

  return (
    <>
      <SectionTitle>Plano de leitura</SectionTitle>
      <div style={{ background: T.cream, borderRadius: 12, padding: '16px 18px', border: `1px solid ${T.hairline}`, marginBottom: 22 }}>
        {/* onde estou */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Onde estou</div>
            {editingPage ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="number" value={pageInput} onChange={e => setPageInput(e.target.value)} autoFocus
                  style={{ width: 66, padding: '6px 8px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, color: T.ink, fontFamily: T.sans, fontSize: 14 }}/>
                <span style={{ fontSize: 12, color: T.muted }}>/ {pages || '—'}</span>
                <button onClick={salvarPagina} style={{ background: T.terra, color: T.cream, border: 0, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>OK</button>
              </div>
            ) : (
              <div onClick={() => { setPageInput(String(cur)); setEditingPage(true); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 500 }}>pág {cur}</span>
                <span style={{ fontSize: 11, color: T.terra, fontWeight: 600 }}>· tocar para atualizar</span>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Progresso</div>
            <div style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 500 }}>{pct}%</div>
          </div>
        </div>
        <LinearProgress pct={pct} height={4}/>

        {/* meta de término */}
        <div style={{ marginTop: 14, borderTop: `1px solid ${T.hairline}`, paddingTop: 14 }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Quero terminar até</div>
          <input type="date" value={goal} onChange={e => definirMeta(e.target.value)}
            style={{ padding: '8px 10px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, color: T.ink, fontFamily: T.sans, fontSize: 13 }}/>
          {plano && plano.tipo === 'ok' && (
            <div style={{ marginTop: 12, fontFamily: T.serif, fontSize: 15, lineHeight: 1.45, color: T.ink }}>
              Leia <strong style={{ color: T.terra }}>~{plano.ritmo} páginas por dia</strong> para terminar até {plano.fim}.
              <div style={{ fontSize: 11, color: T.muted, fontFamily: T.sans, marginTop: 4 }}>
                Faltam {plano.pagsRestantes} páginas em {plano.dias} {plano.dias === 1 ? 'dia' : 'dias'}.
              </div>
            </div>
          )}
          {plano && plano.tipo !== 'ok' && (
            <div style={{ marginTop: 12, fontFamily: T.serif, fontSize: 14, fontStyle: 'italic', color: T.brown }}>{plano.msg}</div>
          )}
          {!goal && pages > 0 && (
            <div style={{ marginTop: 8, fontSize: 12, color: T.muted, fontFamily: T.serif, fontStyle: 'italic' }}>
              Escolha uma data e eu sugiro um ritmo diário.
            </div>
          )}
          {!pages && (
            <div style={{ marginTop: 8, fontSize: 12, color: T.muted, fontFamily: T.serif, fontStyle: 'italic' }}>
              Adicione o total de páginas (no botão Editar) para eu calcular o ritmo.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Cartão de Ponte (usado no BookDetail e em ScreenPontes)
function PonteCard({ p, onClick }) {
  const catColors = {
    filosofia: '#6E3F4E', literatura: T.terra, musica: T.olive,
    arte: T.ochre, cinema: T.ink, historia: '#C9836E',
  };
  const c = catColors[p.cat] || T.terra;
  return (
    <div onClick={onClick} style={{
      background: T.cream, borderRadius: 12, padding: '14px 16px',
      border: `1px solid ${T.hairline}`, cursor: onClick ? 'pointer' : 'default',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: c }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{
          fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase',
          color: c, fontWeight: 700,
        }}>{p.cat}</div>
        <div style={{ fontSize: 10, color: T.muted, fontStyle: 'italic' }}>· {p.where}</div>
      </div>
      <div style={{ fontFamily: T.serif, fontSize: 16, fontWeight: 500, lineHeight: 1.15, marginBottom: 2 }}>
        {p.title}
      </div>
      <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, color: T.brown, marginBottom: 8 }}>
        {p.author}
      </div>
      <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.45, fontFamily: T.serif, marginBottom: p.quote ? 8 : 0 }}>
        {p.why}
      </div>
      {p.quote && (
        <div style={{
          fontFamily: T.serif, fontStyle: 'italic', fontSize: 12,
          color: T.brown, borderLeft: `2px solid ${c}`, paddingLeft: 10, marginTop: 8,
          lineHeight: 1.4,
        }}>
          “{p.quote}”
        </div>
      )}
      <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 10, color: T.muted, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600 }}>
        <span style={{ cursor: 'pointer', color: T.terra }}>+ aceitar</span>
        <span style={{ cursor: 'pointer' }}>aprofundar</span>
        <span style={{ cursor: 'pointer' }}>recusar</span>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.muted,
      fontWeight: 600, marginBottom: 10,
    }}>{children}</div>
  );
}

function QuickCard({ icon, title, sub, primary, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: '14px 14px', borderRadius: 12, cursor: 'pointer',
      background: primary ? T.ink : T.cream,
      color: primary ? T.cream : T.ink,
      border: primary ? 'none' : `1px solid ${T.hairline}`,
    }}>
      <Icon name={icon} size={20} color={primary ? T.cream : T.terra}/>
      <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500, marginTop: 10, lineHeight: 1.05 }}>{title}</div>
      <div style={{ fontSize: 11, color: primary ? 'rgba(247,241,228,0.6)' : T.muted, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function NoteCard({ n, onClick }) {
  const kindColor = { 'reflexão': T.terra, 'citação': T.olive, 'pergunta': T.ochre, 'resumo': T.brown }[n.kind];
  const handleShare = (e) => {
    e.stopPropagation();
    if (typeof window.__shareNote === 'function') {
      // procura o livro pelo título da nota; fallback: BOOK_CURRENT
      const matched = (window.BOOKS || []).find(b => b.title === n.book) || BOOK_CURRENT;
      window.__shareNote(n, matched);
    }
  };
  return (
    <div onClick={onClick} style={{
      background: T.cream, borderRadius: 12, padding: '14px 16px',
      border: `1px solid ${T.hairline}`, cursor: 'pointer',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: kindColor }}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', color: kindColor, fontWeight: 600 }}>
          {n.kind} · {n.chapter}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 10, color: T.muted }}>{n.date}</div>
          <button onClick={handleShare} aria-label="Compartilhar" title="Compartilhar margem"
            style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              padding: 4, color: T.muted, lineHeight: 0,
            }}>
            <Icon name="share" size={14} color={T.muted}/>
          </button>
        </div>
      </div>
      <div style={{
        fontFamily: T.serif, fontSize: 14, lineHeight: 1.4,
        fontStyle: n.kind === 'citação' ? 'italic' : 'normal',
        color: T.ink,
      }}>{n.text}</div>
      <div style={{ fontSize: 10, color: T.muted, marginTop: 8, letterSpacing: 0.3 }}>
        {n.book} · pág {n.page}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Reader — focused reading view, page of the book
// ─────────────────────────────────────────────────────────────
function ScreenReader({ onNav = () => {}, onHighlight = () => {} }) {
  const [page, setPage] = React.useState(182);
  const [showChrome, setShowChrome] = React.useState(true);
  return (
    <div style={{
      width: '100%', height: '100%', background: '#F5EEDE',
      fontFamily: T.sans, color: T.ink, position: 'relative', overflow: 'hidden',
    }} onClick={() => setShowChrome(!showChrome)}>

      {/* top chrome */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        padding: '56px 20px 12px',
        background: 'linear-gradient(to bottom, rgba(245,238,222,0.98), rgba(245,238,222,0))',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        opacity: showChrome ? 1 : 0, transition: 'opacity 300ms',
        pointerEvents: showChrome ? 'auto' : 'none',
      }}>
        <button onClick={(e) => { e.stopPropagation(); onNav('book'); }} style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          fontFamily: T.sans, fontSize: 12, color: T.brown, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="arrowLeft" size={16}/> Livro
        </button>
        <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.muted }}>
          Livro IV · pág {page}
        </div>
      </div>

      {/* page — paper */}
      <div style={{
        position: 'absolute', inset: '100px 24px 110px',
        overflow: 'auto', paddingRight: 4,
      }}>
        <div style={{ fontFamily: T.serif, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: T.muted, marginBottom: 16 }}>
          IV · 3
        </div>
        <p style={{ fontFamily: T.serif, fontSize: 18, lineHeight: 1.55, color: T.ink, marginBottom: 18, textWrap: 'pretty' }}>
          Os homens buscam retiros para si — casas no campo, praias, montanhas —
          e costumas também desejá-los apaixonadamente. Mas tudo isso é próprio do
          mais tolo dos homens, porque te é possível, a qualquer hora que desejes,
          retirar-te para dentro de ti mesmo.
        </p>
        <p style={{ fontFamily: T.serif, fontSize: 18, lineHeight: 1.55, color: T.ink, marginBottom: 18 }}>
          <span style={{
            background: '#F2D9A8', padding: '2px 0', boxShadow: '2px 0 0 #F2D9A8, -2px 0 0 #F2D9A8',
          }}>
            Em parte alguma o homem se retira com mais tranquilidade e liberdade do que na própria alma
          </span>
          , sobretudo aquele que tem dentro de si coisas tais que, ao considerá-las,
          alcance imediatamente toda a serenidade.
        </p>
        <p style={{ fontFamily: T.serif, fontSize: 18, lineHeight: 1.55, color: T.ink, marginBottom: 18 }}>
          Serenidade, digo, não é outra coisa senão a boa ordem da mente. Concede-te, pois, continuamente
          esse retiro, e renova-te. Tem à mão, porém, breves e fundamentais preceitos que, ao aparecerem,
          bastem para dissipar todos os pesares…
        </p>
      </div>

      {/* bottom chrome — page indicator + tools */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
        padding: '18px 20px 30px',
        background: 'linear-gradient(to top, rgba(245,238,222,0.98), rgba(245,238,222,0))',
        opacity: showChrome ? 1 : 0, transition: 'opacity 300ms',
        pointerEvents: showChrome ? 'auto' : 'none',
      }}>
        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <ToolBtn icon="bookmark" label="Marcar"/>
          <ToolBtn icon="note" label="Nota" onClick={() => onNav('note')}/>
          <ToolBtn icon="pen" label="Grifar" onClick={onHighlight}/>
          <ToolBtn icon="quote" label="Citar"/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, fontVariantNumeric: 'tabular-nums', width: 42 }}>
            {page}
          </div>
          <input type="range" min={1} max={304} value={page} onChange={e => setPage(+e.target.value)}
            style={{ flex: 1, accentColor: T.terra }}/>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, fontVariantNumeric: 'tabular-nums' }}>
            304
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '10px 0', background: T.cream,
      border: `1px solid ${T.hairline}`, borderRadius: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      color: T.ink, cursor: 'pointer', fontFamily: T.sans, fontSize: 10,
    }}>
      <Icon name={icon} size={18} color={T.brown}/>
      <span style={{ fontWeight: 600, letterSpacing: 0.3 }}>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Note editor
// ─────────────────────────────────────────────────────────────
function ScreenNoteEditor({ onNav = () => {} }) {
  const [kind, setKind] = React.useState('reflexão');
  const [text, setText] = React.useState('');
  const [saved, setSaved] = React.useState(false);
  const [shareWith, setShareWith] = React.useState([]); // ids dos grupos
  const joinedGrupos = (typeof MG !== 'undefined' && MG.getJoinedGrupos)
    ? (window.GRUPOS || []).filter(g => MG.isJoinedGrupo(g.id))
    : [];
  const kinds = [
    { id: 'marginal', label: 'Marginal', color: '#6E3F4E' },
    { id: 'reflexão', label: 'Reflexão', color: T.terra },
    { id: 'citação', label: 'Citação', color: T.olive },
    { id: 'conexão', label: 'Conexão', color: '#2E3E55' },
    { id: 'pergunta', label: 'Pergunta', color: T.ochre },
    { id: 'mapa', label: 'Mapa', color: '#8A9670' },
    { id: 'resumo', label: 'Resumo', color: T.brown },
  ];

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed) { onNav('book'); return; }
    if (typeof MG !== 'undefined' && MG.addNote) {
      const cur = window.__viewBook
        || (typeof currentBook === 'function' ? currentBook() : BOOK_CURRENT);
      MG.addNote({
        book: cur.title,
        page: cur.currentPage || 0,
        chapter: cur.chapter || '',
        kind,
        text: trimmed,
        sharedWith: shareWith,
        privacidade: shareWith.length === 0 ? 'privada' : `compartilhada (${shareWith.length})`,
      });
    }
    setSaved(true);
    setTimeout(() => onNav('book'), 400);
  };

  return (
    <div style={{
      width: '100%', height: '100%', background: T.paper,
      fontFamily: T.sans, color: T.ink, position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '56px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${T.hairline}`,
      }}>
        <button onClick={() => onNav('book')} style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          fontSize: 14, color: T.brown,
        }}>Cancelar</button>
        <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500 }}>
          {saved ? 'Salvo na margem' : 'Nova nota'}
        </div>
        <button onClick={handleSave} disabled={saved} style={{
          background: saved ? T.olive : T.ink, color: T.cream, border: 0, borderRadius: 999,
          padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: saved ? 'default' : 'pointer',
          letterSpacing: 0.3, opacity: saved ? 0.85 : 1,
        }}>{saved ? '✓' : 'Salvar'}</button>
      </div>

      <div style={{ padding: '18px 20px 10px' }}>
        <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, marginBottom: 8, fontWeight: 600 }}>
          Tipo de nota
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {kinds.map(k => (
            <button key={k.id} onClick={() => setKind(k.id)} style={{
              padding: '7px 12px', borderRadius: 999,
              background: kind === k.id ? k.color : 'transparent',
              color: kind === k.id ? T.cream : T.ink,
              border: `1px solid ${kind === k.id ? k.color : T.hairline}`,
              fontFamily: T.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>{k.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 20px', borderBottom: `1px solid ${T.hairline}`, display: 'flex', gap: 10, alignItems: 'center' }}>
        <BookCover title={BOOK_CURRENT.title} author={BOOK_CURRENT.author} tone={BOOK_CURRENT.tone} cover={BOOK_CURRENT.cover} isbn={BOOK_CURRENT.isbn} w={36}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: T.serif, fontSize: 13, fontWeight: 500 }}>{BOOK_CURRENT.title}</div>
          <div style={{ fontSize: 10, color: T.muted }}>Livro IV · pág 182</div>
        </div>
        <Icon name="chevron" size={16} color={T.muted}/>
      </div>

      <div style={{ flex: 1, padding: '20px', position: 'relative' }}>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder={kind === 'citação' ? 'Transcrever a passagem…' : 'Escreva sua reflexão…'}
          style={{
            width: '100%', height: '100%', border: 0, outline: 0,
            background: 'transparent', resize: 'none',
            fontFamily: T.serif,
            fontSize: 17, lineHeight: 1.5, color: T.ink,
            fontStyle: kind === 'citação' ? 'italic' : 'normal',
          }}/>
      </div>

      {/* compartilhar com grupos */}
      {joinedGrupos.length > 0 && (
        <div style={{
          padding: '12px 20px', borderTop: `1px solid ${T.hairline}`,
          background: T.bone,
        }}>
          <div style={{
            fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase',
            color: T.muted, fontWeight: 600, marginBottom: 8,
          }}>
            Compartilhar com
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {joinedGrupos.map(g => {
              const on = shareWith.includes(g.id);
              return (
                <button key={g.id} onClick={() => setShareWith(prev =>
                  on ? prev.filter(x => x !== g.id) : [...prev, g.id]
                )} style={{
                  padding: '7px 12px', borderRadius: 999,
                  background: on ? T.olive : 'transparent',
                  color: on ? T.cream : T.brown,
                  border: `1px solid ${on ? T.olive : T.hairline}`,
                  fontFamily: T.sans, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  {on && '✓'} {g.nome}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 6, fontStyle: 'italic', fontFamily: T.serif }}>
            {shareWith.length === 0
              ? 'Sem seleção = nota privada (só você vê)'
              : `Visível aos membros de ${shareWith.length} ${shareWith.length === 1 ? 'grupo' : 'grupos'}`}
          </div>
        </div>
      )}

      <div style={{
        padding: '10px 20px 14px', borderTop: `1px solid ${T.hairline}`,
        background: T.cream, display: 'flex', gap: 12, alignItems: 'center',
        fontSize: 12, color: T.muted,
      }}>
        <Icon name="tag" size={16} color={T.muted}/>
        <div>Adicionar tema</div>
        <div style={{ flex: 1 }}/>
        <Icon name="sparkle" size={16} color={T.terra}/>
        <span style={{ color: T.terra, fontWeight: 600 }}>Sugerir temas</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Themes map — all study themes with book lineage
// ─────────────────────────────────────────────────────────────
function ScreenThemes({ onNav = () => {} }) {
  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 100 }}>
      <div style={{ padding: '56px 24px 16px' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, marginBottom: 6 }}>
          Seu mapa de estudo
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 32, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.05 }}>
          Temas que você <span style={{ fontStyle: 'italic', color: T.terra }}>atravessa</span>
        </div>
        <div style={{ fontSize: 13, color: T.brown, marginTop: 8, lineHeight: 1.4 }}>
          {THEMES_STUDY.length} temas · {NOTES.length + 18} anotações cruzadas
        </div>
      </div>

      {THEMES_STUDY.map(t => <ThemeRow key={t.id} t={t}/>)}

      <div style={{ padding: '16px 24px' }}>
        <button style={{
          width: '100%', padding: '14px 0',
          background: 'transparent', color: T.ink,
          border: `1px dashed ${T.hairline}`, borderRadius: 12,
          fontFamily: T.sans, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="plus" size={16}/> Novo tema de estudo
        </button>
      </div>
    </div>
  );
}

function ThemeRow({ t }) {
  const c = { terra: T.terra, olive: T.olive, ochre: T.ochre, rose: '#C9836E' }[t.color];
  const relatedBooks = BOOKS.filter(b => b.theme === t.title).slice(0,3);
  return (
    <div style={{ padding: '18px 24px', borderTop: `1px solid ${T.hairline}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>
        <div style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 500, letterSpacing: -0.3, flex: 1 }}>
          {t.title}
        </div>
        <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono, fontVariantNumeric: 'tabular-nums' }}>
          {t.count} textos
        </div>
      </div>
      <div style={{ fontSize: 13, color: T.brown, lineHeight: 1.45, marginBottom: 12, fontFamily: T.serif, fontStyle: 'italic' }}>
        {t.summary}
      </div>
      {relatedBooks.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          {relatedBooks.map(b => (
            <div key={b.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <BookSpine title={b.title} tone={b.tone} h={48} w={14}/>
              <div style={{ fontSize: 10, color: T.muted, maxWidth: 90, lineHeight: 1.2 }}>
                <div style={{ color: T.ink, fontFamily: T.serif, fontSize: 11 }}>{b.title}</div>
                <div style={{ fontStyle: 'italic' }}>{b.author}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Schedule — upcoming study sessions + milestones
// ─────────────────────────────────────────────────────────────
function ScreenSchedule({ onNav = () => {} }) {
  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 100 }}>
      <div style={{ padding: '56px 24px 20px' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, marginBottom: 6 }}>
          Abril — maio
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 32, fontWeight: 400, letterSpacing: -0.6 }}>
          Calendário
        </div>
      </div>

      {/* countdown card */}
      <div style={{ padding: '0 24px 20px' }}>
        <div style={{
          background: T.ink, color: T.cream, borderRadius: 16, padding: '20px 22px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -40, top: -40, width: 200, height: 200,
            borderRadius: '50%', background: T.terra, opacity: 0.15,
          }}/>
          <div style={{ fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase', opacity: 0.6, marginBottom: 8 }}>
            Em 4 dias
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 500, lineHeight: 1.1, marginBottom: 10 }}>
            Sessão de estudo:<br/>
            <span style={{ fontStyle: 'italic' }}>Meditações — Livro IV</span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            22 de abril · quinta · 20h00 · sozinho
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 10px', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>
        Próximos eventos
      </div>

      {SCHEDULE.map((s, i) => <ScheduleItem key={i} s={s}/>)}
    </div>
  );
}

function ScheduleItem({ s }) {
  const icons = { sessao: 'book', resumo: 'note', marco: 'target' };
  const colors = { sessao: T.terra, resumo: T.olive, marco: T.ochre };
  return (
    <div style={{
      display: 'flex', gap: 14, padding: '16px 24px',
      borderTop: `1px solid ${T.hairline}`, alignItems: 'center',
    }}>
      <div style={{
        width: 56, textAlign: 'center', padding: '6px 0',
        background: T.cream, borderRadius: 8, border: `1px solid ${T.hairline}`,
      }}>
        <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: T.muted }}>
          {s.month}
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 500, lineHeight: 1 }}>
          {s.date}
        </div>
        <div style={{ fontSize: 9, color: T.muted, marginTop: 2 }}>{s.dow}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Icon name={icons[s.kind]} size={13} color={colors[s.kind]}/>
          <div style={{ fontSize: 10, color: colors[s.kind], fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            {s.label}
          </div>
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500, lineHeight: 1.2, marginBottom: 2 }}>
          {s.detail}
        </div>
        <div style={{ fontSize: 11, color: T.muted }}>{s.time}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Síntese — sheet de resumo curado dos capítulos lidos
// ─────────────────────────────────────────────────────────────
function ScreenSummary({ onClose = () => {} }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(42,38,32,0.4)',
      display: 'flex', alignItems: 'flex-end', zIndex: 50,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: T.paper, borderRadius: '24px 24px 0 0',
        padding: '18px 24px 32px', maxHeight: '80%', overflow: 'auto',
      }}>
        <div style={{ width: 36, height: 4, background: T.hairline, borderRadius: 4, margin: '0 auto 16px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Icon name="sparkle" size={18} color={T.terra}/>
          <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.terra, fontWeight: 600 }}>
            Síntese até a pág 182
          </div>
        </div>

        <div style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 500, letterSpacing: -0.3, lineHeight: 1.15, marginBottom: 14 }}>
          Os livros I–IV em três fios
        </div>

        <SummaryThread n="1" title="A razão como guia interno"
          body="Marco Aurélio retoma repetidamente a ideia de que o daimon — a razão — deve ser o árbitro de cada ação. O mundo externo é indiferente; o que importa é a qualidade do julgamento que faço dele."/>
        <SummaryThread n="2" title="A brevidade como disciplina"
          body="A morte não é metáfora: é o metrônomo do pensamento estoico. Cada livro reencena o mesmo gesto — lembrar que o tempo é curto para que o agir seja bom."/>
        <SummaryThread n="3" title="A fortaleza interior"
          body="No livro IV surge a imagem que você grifou: o retiro para dentro de si mesmo. Tema a cruzar com Sêneca (Cartas 28) e com o Bhagavad Gita (a ação sem apego ao fruto)."/>

        <div style={{
          marginTop: 20, padding: '14px 16px',
          background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12,
        }}>
          <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 8 }}>
            Perguntas para a próxima sessão
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontFamily: T.serif, fontSize: 14, lineHeight: 1.5, color: T.ink }}>
            <li>Se a razão é o guia, como distinguir razão de racionalização?</li>
            <li>A "fortaleza interior" é um recurso ou uma fuga?</li>
            <li>Qual o papel dos afetos nesse sistema?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SummaryThread({ n, title, body }) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%', background: T.terra, color: T.cream,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        fontFamily: T.serif, fontSize: 13, fontWeight: 500,
      }}>{n}</div>
      <div>
        <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 600, lineHeight: 1.2, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.45, color: T.brown }}>{body}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pontes — tela completa com todas as conexões, filtráveis por categoria
// ─────────────────────────────────────────────────────────────
function ScreenPontes({ onNav = () => {} }) {
  const [cat, setCat] = React.useState('todos');
  const list = cat === 'todos' ? PONTES : PONTES.filter(p => p.cat === cat);
  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 100 }}>
      <div style={{ padding: '56px 24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <button onClick={() => onNav('book')} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 12, color: T.brown, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}>
            <Icon name="arrowLeft" size={16}/> Livro
          </button>
          <Icon name="sparkle" size={16} color={T.terra}/>
        </div>

        <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, marginBottom: 6, fontWeight: 600 }}>
          O livro ecoa
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.05 }}>
          Pontes <span style={{ fontStyle: 'italic', color: T.terra }}>entre obras</span>
        </div>
        <div style={{ fontSize: 13, color: T.brown, marginTop: 8, lineHeight: 1.45, fontFamily: T.serif }}>
          Filosofia, música, arte, cinema, história — fios que partem do que você lê e anota. Aceite, aprofunde, recuse.
        </div>
      </div>

      {/* category filter */}
      <div style={{ padding: '8px 24px 18px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {PONTE_CATS.map(c => {
          const active = cat === c.id;
          return (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              padding: '7px 12px', borderRadius: 999, flexShrink: 0,
              background: active ? T.ink : 'transparent',
              color: active ? T.cream : T.brown,
              border: `1px solid ${active ? T.ink : T.hairline}`,
              fontFamily: T.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              letterSpacing: 0.2,
            }}>{c.label}</button>
          );
        })}
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.map(p => <PonteCard key={p.id} p={p}/>)}
      </div>

      {/* glossary inline */}
      <div style={{ padding: '24px 24px 0', marginTop: 28 }}>
        <SectionTitle>Glossário do livro</SectionTitle>
        <div style={{ background: T.paper, border: `1px solid ${T.hairline}`, borderRadius: 12, overflow: 'hidden' }}>
          {GLOSSARIO.map((g, i) => (
            <div key={g.term} style={{
              padding: '12px 16px',
              borderTop: i === 0 ? 'none' : `1px solid ${T.hairline}`,
            }}>
              <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 600, color: T.terra, fontStyle: 'italic' }}>
                {g.term}
              </div>
              <div style={{ fontFamily: T.serif, fontSize: 13, color: T.ink, lineHeight: 1.4, marginTop: 2 }}>
                {g.def}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Desafios temáticos — cards com cronograma e adesão
// ─────────────────────────────────────────────────────────────
function ScreenDesafios({ onNav = () => {} }) {
  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 100 }}>
      <div style={{ padding: '56px 24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>
            Leituras com começo, meio e fim
          </div>
          <BrandMark size={22}/>
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.05 }}>
          Desafios <span style={{ fontStyle: 'italic', color: T.terra }}>em curso</span>
        </div>
        <div style={{ fontSize: 13, color: T.brown, marginTop: 8, lineHeight: 1.45, fontFamily: T.serif }}>
          Curados pela editoria, pela comunidade ou criados por você. Sozinha ou em grupo.
        </div>
      </div>

      <div style={{ padding: '8px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {DESAFIOS.map(d => <DesafioCard key={d.id} d={d}/>)}
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <button style={{
          width: '100%', padding: '14px 0',
          background: 'transparent', color: T.ink,
          border: `1px dashed ${T.hairline}`, borderRadius: 12,
          fontFamily: T.sans, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="plus" size={16}/> Criar desafio próprio
        </button>
      </div>
    </div>
  );
}

function DesafioCard({ d }) {
  const tones = {
    ink: { bg: T.ink, fg: T.cream, sub: 'rgba(247,241,228,0.65)', tagBg: T.terra, tagFg: T.cream, border: T.ink },
    rose: { bg: '#F3DCD0', fg: T.ink, sub: T.brown, tagBg: '#9E5E4A', tagFg: T.cream, border: 'rgba(158,94,74,0.2)' },
    olive: { bg: '#E5E5D2', fg: T.ink, sub: T.brown, tagBg: T.olive, tagFg: T.cream, border: 'rgba(94,107,62,0.2)' },
    ochre: { bg: '#F2E1BD', fg: T.ink, sub: T.brown, tagBg: '#8E6418', tagFg: T.cream, border: 'rgba(142,100,24,0.2)' },
    terra: { bg: '#F2D7CB', fg: T.ink, sub: T.brown, tagBg: T.terra, tagFg: T.cream, border: 'rgba(176,83,58,0.2)' },
    sage: { bg: '#E0E3D2', fg: T.ink, sub: T.brown, tagBg: '#616E4A', tagFg: T.cream, border: 'rgba(97,110,74,0.2)' },
  };
  const t = tones[d.tone] || tones.terra;
  const joined = (typeof MG !== 'undefined' && MG.isJoinedDesafio) ? MG.isJoinedDesafio(d.id) : false;
  const toggle = (e) => {
    e.stopPropagation();
    if (typeof MG === 'undefined') return;
    joined ? MG.leaveDesafio(d.id) : MG.joinDesafio(d.id);
  };
  return (
    <div style={{
      background: t.bg, color: t.fg, borderRadius: 14, padding: '18px 18px',
      border: `1px solid ${t.border}`, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative',
    }}>
      {joined && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '3px 8px', borderRadius: 999,
          background: T.olive, color: T.cream,
          fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
        }}>✓ Em curso</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: joined ? 76 : 0 }}>
        <div style={{
          fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
          padding: '4px 9px', borderRadius: 999, background: t.tagBg, color: t.tagFg,
        }}>{d.tag}</div>
        {d.nivel && (
          <div style={{
            fontFamily: T.serif, fontStyle: 'italic', fontSize: 11,
            color: t.sub, letterSpacing: 0.4,
          }}>nível {d.nivel}</div>
        )}
      </div>
      <div style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 500, lineHeight: 1.1, letterSpacing: -0.3 }}>
        {d.title}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: t.sub, fontFamily: T.serif }}>
        {d.desc}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 10, marginTop: 4,
        borderTop: `1px solid ${d.tone === 'ink' ? 'rgba(247,241,228,0.15)' : T.hairline}`,
      }}>
        <div style={{ fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', color: t.sub, fontWeight: 600 }}>
          <span>{d.duracao}</span>
          {d.lendo ? <span> · {d.lendo.toLocaleString('pt-BR')} lendo</span> : <span> · projeto pessoal</span>}
        </div>
        <button onClick={toggle} style={{
          background: joined ? 'transparent' : t.fg,
          color: joined ? t.sub : t.bg,
          border: `1px solid ${joined ? (d.tone === 'ink' ? 'rgba(247,241,228,0.3)' : T.hairline) : 'transparent'}`,
          borderRadius: 999, padding: '6px 12px',
          fontFamily: T.sans, fontSize: 11, fontWeight: 600, cursor: 'pointer',
          letterSpacing: 0.3,
        }}>
          {joined ? 'Sair' : 'Ingressar'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Níveis — escolha de profundidade (Iniciante / Intermediário / Profundo)
// ─────────────────────────────────────────────────────────────
function ScreenNiveis({ onNav = () => {} }) {
  const [sel, setSel] = React.useState(NIVEL_ATUAL);
  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 100 }}>
      <div style={{ padding: '56px 24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button onClick={() => onNav('home')} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 12, color: T.brown, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}>
            <Icon name="arrowLeft" size={16}/> Voltar
          </button>
        </div>
        <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, marginBottom: 6, fontWeight: 600 }}>
          Como a leitura se adapta a você
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.05 }}>
          A mesma obra, em <span style={{ fontStyle: 'italic', color: T.terra }}>três profundidades</span>
        </div>
        <div style={{ fontSize: 13, color: T.brown, marginTop: 8, lineHeight: 1.45, fontFamily: T.serif }}>
          Você pode mudar o nível por livro — Borges em Profundo, Sally Rooney em Iniciante.
        </div>
      </div>

      <div style={{ padding: '8px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {NIVEIS.map(n => {
          const active = sel === n.id;
          return (
            <div key={n.id} onClick={() => setSel(n.id)} style={{
              background: active ? T.ink : T.cream,
              color: active ? T.cream : T.ink,
              borderRadius: 14, padding: '20px 20px',
              border: `1px solid ${active ? T.ink : T.hairline}`,
              cursor: 'pointer', position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                <div style={{
                  fontFamily: T.serif, fontStyle: 'italic', fontSize: 13,
                  color: active ? T.ochre : T.terra, letterSpacing: 0.6,
                }}>— {n.roman} —</div>
                <div style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 500, letterSpacing: -0.3 }}>
                  {n.label}
                </div>
                {active && (
                  <div style={{
                    marginLeft: 'auto',
                    fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase',
                    color: T.ochre, fontWeight: 700,
                  }}>atual</div>
                )}
              </div>
              <div style={{
                fontFamily: T.serif, fontSize: 14, lineHeight: 1.45,
                color: active ? 'rgba(247,241,228,0.75)' : T.brown,
                fontStyle: 'italic', marginBottom: 14,
              }}>{n.sub}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {n.features.map(f => (
                  <li key={f} style={{
                    padding: '8px 0', display: 'flex', gap: 10, alignItems: 'flex-start',
                    fontSize: 12, color: active ? 'rgba(247,241,228,0.85)' : T.ink, lineHeight: 1.4,
                    borderTop: `1px solid ${active ? 'rgba(247,241,228,0.12)' : T.hairlineSoft}`,
                  }}>
                    <span style={{ color: active ? T.ochre : T.terra, fontWeight: 700 }}>—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Grupos — camada social mínima
// ─────────────────────────────────────────────────────────────
function ScreenGrupos({ onNav = () => {} }) {
  const joinedIds = (typeof MG !== 'undefined' && MG.getJoinedGrupos) ? MG.getJoinedGrupos() : [];
  const meusGrupos = GRUPOS.filter(g => joinedIds.includes(g.id));
  const sugeridosLivroAtual = GRUPOS.filter(g => g.livro === BOOK_CURRENT.title && !joinedIds.includes(g.id));
  const outros = GRUPOS.filter(g => !joinedIds.includes(g.id) && g.livro !== BOOK_CURRENT.title);

  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 120 }}>
      <div style={{ padding: '56px 24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>
            Você nunca lê sozinha
          </div>
          <BrandMark size={22}/>
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.05 }}>
          Grupos & <span style={{ fontStyle: 'italic', color: T.terra }}>projetos</span>
        </div>
        <div style={{ fontSize: 13, color: T.brown, marginTop: 8, lineHeight: 1.45, fontFamily: T.serif }}>
          Pequenos círculos de leitores em torno de um livro ou tema. Ingressar é opcional —
          <em> se não entrar, ninguém vê suas notas.</em>
        </div>
      </div>

      {/* meus grupos */}
      {meusGrupos.length > 0 && (
        <div style={{ padding: '8px 24px 0' }}>
          <SectionLabel color={T.olive}>Meus grupos · {meusGrupos.length}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
            {meusGrupos.map(g => <GrupoCard key={g.id} g={g} joined={true}/>)}
          </div>
        </div>
      )}

      {/* sugeridos pelo livro atual */}
      {sugeridosLivroAtual.length > 0 && (
        <div style={{ padding: '24px 24px 0' }}>
          <SectionLabel color={T.terra}>
            Lendo <em style={{ fontStyle: 'italic' }}>{BOOK_CURRENT.title}</em> com você
          </SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
            {sugeridosLivroAtual.map(g => <GrupoCard key={g.id} g={g} joined={false}/>)}
          </div>
        </div>
      )}

      {/* descobrir outros */}
      <div style={{ padding: '24px 24px 0' }}>
        <SectionLabel color={T.muted}>Outros círculos</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
          {outros.map(g => <GrupoCard key={g.id} g={g} joined={false}/>)}
        </div>
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <button style={{
          width: '100%', padding: '14px 0', marginTop: 8,
          background: 'transparent', color: T.ink,
          border: `1px dashed ${T.hairline}`, borderRadius: 12,
          fontFamily: T.sans, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="plus" size={16}/> Criar grupo próprio
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      paddingBottom: 8, borderBottom: `1px solid ${T.hairline}`,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }}/>
      <div style={{
        fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase',
        color: color, fontWeight: 700,
      }}>
        {children}
      </div>
    </div>
  );
}

function GrupoCard({ g, joined, onOpen }) {
  const toggle = (e) => {
    e.stopPropagation();
    if (typeof MG === 'undefined') return;
    joined ? MG.leaveGrupo(g.id) : MG.joinGrupo(g.id);
  };
  return (
    <div onClick={() => { if (typeof window.__openGrupo === 'function') window.__openGrupo(g); }}
      style={{
      background: T.cream, borderRadius: 12, padding: '14px 16px',
      border: `1px solid ${joined ? T.olive : T.hairline}`, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: joined
          ? `linear-gradient(135deg, ${T.olive}, #434E2A)`
          : `linear-gradient(135deg, ${T.terra}, #6E3F4E)`,
        color: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.serif, fontSize: 18, fontWeight: 500, flexShrink: 0,
      }}>{g.nome[0]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500, lineHeight: 1.15 }}>
          {g.nome}
        </div>
        {g.livro && (
          <div style={{ fontSize: 11, color: T.brown, marginTop: 3, fontFamily: T.serif }}>
            lendo <em style={{ fontStyle: 'italic' }}>{g.livro}</em>{g.livroAutor ? ` · ${g.livroAutor}` : ''}
          </div>
        )}
        <div style={{ fontSize: 10, color: T.muted, marginTop: 4, letterSpacing: 0.3 }}>
          {g.membros} {g.membros === 1 ? 'leitor' : 'leitores'} · {g.tipo}
          {g.ativ && <span style={{ color: T.terra, fontWeight: 600 }}> · {g.ativ}</span>}
        </div>
      </div>
      <button onClick={toggle} style={{
        background: joined ? 'transparent' : T.ink,
        color: joined ? T.brown : T.cream,
        border: `1px solid ${joined ? T.hairline : T.ink}`,
        borderRadius: 999, padding: '7px 12px',
        fontFamily: T.sans, fontSize: 11, fontWeight: 600, cursor: 'pointer',
        letterSpacing: 0.3, flexShrink: 0,
      }}>
        {joined ? 'Sair' : 'Ingressar'}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ScreenGrupoDetalhe — sheet com cronograma, leitores, sessões, conversa
// Aceita um grupo via prop. onClose volta para a lista de grupos.
// ─────────────────────────────────────────────────────────────
function ScreenGrupoDetalhe({ grupo, onClose = () => {} }) {
  const [tab, setTab] = React.useState('cronograma');
  const joined = (typeof MG !== 'undefined' && MG.isJoinedGrupo) ? MG.isJoinedGrupo(grupo.id) : false;
  const toggle = () => {
    if (typeof MG === 'undefined') return;
    joined ? MG.leaveGrupo(grupo.id) : MG.joinGrupo(grupo.id);
  };

  // mock de cronograma (no MVP — virá do backend)
  const cronograma = [
    { semana: 1, periodo: 'até 25 abr', meta: 'Livros I–III', status: 'feito' },
    { semana: 2, periodo: 'até 02 mai', meta: 'Livros IV–V', status: 'em curso' },
    { semana: 3, periodo: 'até 09 mai', meta: 'Livros VI–VII', status: 'pendente' },
    { semana: 4, periodo: 'até 16 mai', meta: 'Livros VIII–IX', status: 'pendente' },
    { semana: 5, periodo: 'até 23 mai', meta: 'Livros X–XI', status: 'pendente' },
    { semana: 6, periodo: 'até 30 mai', meta: 'Livro XII + ensaio final', status: 'pendente' },
  ];
  const sessoes = [
    { dt: '03 mai', dow: 'sex', hora: '19h', titulo: 'Livros IV e V', tipo: 'vídeo (Whereby)' },
    { dt: '10 mai', dow: 'sex', hora: '19h', titulo: 'Livros VI e VII', tipo: 'vídeo (Whereby)' },
  ];
  const leitores = [
    { nome: 'Ana T.', avatar: 'A', cor: T.terra, ativo: 'leu até pág 187' },
    { nome: 'Bruno M.', avatar: 'B', cor: T.olive, ativo: 'comentou ontem' },
    { nome: 'Cláudia S.', avatar: 'C', cor: T.ochre, ativo: 'leu até pág 142' },
    { nome: 'Você', avatar: 'V', cor: T.ink, ativo: joined ? 'membro' : '— ingresse para participar' },
    { nome: 'Daniel P.', avatar: 'D', cor: '#6E3F4E', ativo: 'leu até pág 220' },
    { nome: 'Eva L.', avatar: 'E', cor: '#9E5E4A', ativo: 'comentou hoje' },
  ];
  const conversa = [
    { autor: 'Ana T.', cor: T.terra, t: '14h', text: 'O retiro para dentro de si do Livro IV — me lembrou Pessoa.' },
    { autor: 'Bruno M.', cor: T.olive, t: '15h', text: 'Cruzar com Sêneca, Carta 28 — "animum debes mutare, non caelum".' },
    { autor: 'Cláudia S.', cor: T.ochre, t: 'ontem', text: 'Discordo: para o estoico não é só "ir para dentro" — é exercitar o juízo. Ação na contemplação.' },
  ];

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(42,38,32,0.5)',
      display: 'flex', alignItems: 'flex-end', zIndex: 70,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', height: '94%', background: T.bone,
        borderRadius: '24px 24px 0 0', overflow: 'auto',
        fontFamily: T.sans, color: T.ink,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ width: 36, height: 4, background: T.hairline, borderRadius: 4, margin: '14px auto 6px', flexShrink: 0 }}/>
        <div style={{ padding: '8px 24px 4px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <button onClick={onClose} style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              fontSize: 13, color: T.brown,
            }}>Fechar</button>
            <button onClick={toggle} style={{
              background: joined ? 'transparent' : T.ink,
              color: joined ? T.brown : T.cream,
              border: `1px solid ${joined ? T.hairline : T.ink}`,
              borderRadius: 999, padding: '7px 14px',
              fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>{joined ? 'Sair do grupo' : 'Ingressar'}</button>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: `linear-gradient(135deg, ${joined ? T.olive : T.terra}, #6E3F4E)`,
              color: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: T.serif, fontSize: 22, fontWeight: 500, flexShrink: 0,
            }}>{grupo.nome[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 500, lineHeight: 1.15 }}>
                {grupo.nome}
              </div>
              {grupo.livro && (
                <div style={{ fontSize: 12, color: T.brown, marginTop: 3, fontFamily: T.serif }}>
                  lendo <em style={{ fontStyle: 'italic' }}>{grupo.livro}</em>
                  {grupo.livroAutor ? <> · {grupo.livroAutor}</> : null}
                </div>
              )}
              <div style={{ fontSize: 10, color: T.muted, marginTop: 4, letterSpacing: 0.3 }}>
                {grupo.membros} {grupo.membros === 1 ? 'leitor' : 'leitores'} · {grupo.tipo}
              </div>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div style={{ display: 'flex', padding: '0 16px', borderBottom: `1px solid ${T.hairline}`, flexShrink: 0 }}>
          {[
            { id: 'cronograma', l: 'Cronograma' },
            { id: 'sessoes', l: 'Sessões' },
            { id: 'leitores', l: 'Leitores' },
            { id: 'conversa', l: 'Conversa' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 14px', background: 'transparent', border: 0, cursor: 'pointer',
              borderBottom: `2px solid ${tab === t.id ? T.terra : 'transparent'}`,
              color: tab === t.id ? T.ink : T.muted,
              fontSize: 12, fontWeight: tab === t.id ? 700 : 500,
              fontFamily: T.sans, letterSpacing: 0.4,
            }}>{t.l}</button>
          ))}
        </div>

        <div style={{ padding: '16px 24px 32px', flex: 1 }}>
          {tab === 'cronograma' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cronograma.map(c => {
                const colorMap = { feito: T.olive, 'em curso': T.terra, pendente: T.muted };
                const c1 = colorMap[c.status];
                return (
                  <div key={c.semana} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 0', borderBottom: `1px solid ${T.hairlineSoft}`,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: c.status === 'feito' ? c1 : 'transparent',
                      color: c.status === 'feito' ? T.cream : c1,
                      border: `1px solid ${c1}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: T.serif, fontSize: 13, fontWeight: 500,
                      flexShrink: 0,
                    }}>{c.status === 'feito' ? '✓' : c.semana}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 500 }}>
                        Semana {c.semana} — <span style={{ fontStyle: 'italic' }}>{c.meta}</span>
                      </div>
                      <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
                        {c.periodo}
                      </div>
                    </div>
                    {c.status === 'em curso' && (
                      <div style={{
                        fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase',
                        color: T.terra, fontWeight: 700,
                      }}>aqui</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'sessoes' && (
            <div>
              {sessoes.map((s, i) => (
                <div key={i} style={{
                  background: T.cream, borderRadius: 12, padding: 14,
                  border: `1px solid ${T.hairline}`, marginBottom: 12,
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{
                    width: 50, textAlign: 'center', flexShrink: 0,
                    padding: '8px 0', background: T.parchment, borderRadius: 8,
                  }}>
                    <div style={{ fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', color: T.brown, fontWeight: 700 }}>
                      {s.dow}
                    </div>
                    <div style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 500, color: T.ink, lineHeight: 1 }}>
                      {s.dt.split(' ')[0]}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 500 }}>
                      {s.titulo}
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>
                      {s.hora} · {s.tipo}
                    </div>
                  </div>
                  <button disabled={!joined} style={{
                    padding: '7px 12px', borderRadius: 999,
                    background: joined ? T.terra : 'transparent',
                    color: joined ? T.cream : T.muted,
                    border: `1px solid ${joined ? T.terra : T.hairline}`,
                    fontFamily: T.sans, fontSize: 11, fontWeight: 600,
                    cursor: joined ? 'pointer' : 'not-allowed',
                  }}>{joined ? 'Entrar' : 'Ingresse'}</button>
                </div>
              ))}
              <div style={{
                marginTop: 8, padding: 10, fontSize: 11, color: T.muted,
                fontFamily: T.serif, fontStyle: 'italic', textAlign: 'center',
              }}>
                Encontros por vídeo via Whereby — sem instalação, sem rastreamento.
              </div>
            </div>
          )}

          {tab === 'leitores' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {leitores.map(l => (
                <div key={l.nome} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0', borderBottom: `1px solid ${T.hairlineSoft}`,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: l.cor, color: T.cream,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: T.serif, fontSize: 14, fontWeight: 500, flexShrink: 0,
                  }}>{l.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 500 }}>
                      {l.nome}
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 2, fontStyle: 'italic' }}>
                      {l.ativo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'conversa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {conversa.map((c, i) => (
                <div key={i} style={{
                  background: T.cream, borderRadius: 12, padding: '12px 14px',
                  border: `1px solid ${T.hairlineSoft}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', background: c.cor, color: T.cream,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: T.serif, fontSize: 10, fontWeight: 500,
                    }}>{c.autor[0]}</div>
                    <div style={{ fontFamily: T.serif, fontSize: 12, fontWeight: 600 }}>{c.autor}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{c.t}</div>
                  </div>
                  <div style={{ fontFamily: T.serif, fontSize: 13, lineHeight: 1.5, color: T.ink }}>
                    {c.text}
                  </div>
                </div>
              ))}
              <div style={{ padding: '4px 0', display: 'flex', gap: 8, marginTop: 4 }}>
                <input placeholder={joined ? 'Escreva uma resposta…' : 'Ingresse para participar'}
                  disabled={!joined}
                  style={{
                    flex: 1, padding: '12px 14px', border: `1px solid ${T.hairline}`,
                    borderRadius: 999, background: T.cream, color: T.ink,
                    fontFamily: T.serif, fontSize: 13, outline: 'none',
                    opacity: joined ? 1 : 0.5,
                  }}/>
                <button disabled={!joined} style={{
                  padding: '0 16px', borderRadius: 999,
                  background: joined ? T.ink : T.parchment, color: T.cream,
                  border: 0, cursor: joined ? 'pointer' : 'not-allowed',
                  fontFamily: T.sans, fontSize: 12, fontWeight: 600,
                }}>Enviar</button>
              </div>
              <div style={{
                fontSize: 10, color: T.muted, fontStyle: 'italic',
                fontFamily: T.serif, textAlign: 'center', marginTop: 4,
              }}>
                Conversas privadas no grupo. Nada vaza para fora.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Fase 2 — Círculos de leitura (grupos reais via nuvem)
// ─────────────────────────────────────────────────────────────
function ScreenGruposCloud({ onNav = () => {} }) {
  const cloud = (typeof window !== 'undefined') ? window.MGCloud : null;
  const [user, setUser] = React.useState(undefined);
  const [groups, setGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [pane, setPane] = React.useState(null); // null | 'criar' | 'entrar'
  const [name, setName] = React.useState('');
  const [code, setCode] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState(null);

  const refresh = async () => {
    if (!cloud || !cloud.available) { setLoading(false); return; }
    const u = await cloud.currentUser();
    setUser(u || null);
    if (u) setGroups(await cloud.groups.list());
    setLoading(false);
  };
  React.useEffect(() => { refresh(); }, []);

  const criar = async () => {
    if (!name.trim()) { setMsg('Dê um nome ao círculo.'); return; }
    setBusy(true); setMsg(null);
    const { data, error } = await cloud.groups.create(name);
    setBusy(false);
    if (error) { setMsg('Erro: ' + error.message); return; }
    setName(''); setPane(null); await refresh();
    if (data && window.__openGrupo) window.__openGrupo(data);
  };
  const entrar = async () => {
    if (!code.trim()) { setMsg('Cole o código do convite.'); return; }
    setBusy(true); setMsg(null);
    const { data, error } = await cloud.groups.join(code);
    setBusy(false);
    if (error) { setMsg('Código inválido. Confira e tente de novo.'); return; }
    setCode(''); setPane(null); await refresh();
    if (data && window.__openGrupo) window.__openGrupo(data);
  };

  const inputStyle = { flex: 1, padding: '11px 12px', border: `1px solid ${T.hairline}`, borderRadius: 10, background: T.cream, color: T.ink, fontFamily: T.sans, fontSize: 14, outline: 'none' };
  const btnDark = { padding: '11px 16px', borderRadius: 10, border: 0, background: T.ink, color: T.cream, fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.6 : 1 };
  const btnGhost = { width: '100%', padding: '13px 0', background: 'transparent', color: T.ink, border: `1px dashed ${T.hairline}`, borderRadius: 12, fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 };

  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 120 }}>
      <div style={{ padding: '56px 24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>
            Você nunca lê sozinha
          </div>
          <BrandMark size={22}/>
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.05 }}>
          Seus <span style={{ fontStyle: 'italic', color: T.terra }}>círculos</span>
        </div>
        <div style={{ fontSize: 13, color: T.brown, marginTop: 8, lineHeight: 1.45, fontFamily: T.serif }}>
          Pequenas rodas de leitura com amigos. Crie uma e convide; ou entre com um código.
        </div>
      </div>

      {(!cloud || !cloud.available) ? (
        <div style={{ padding: '20px 24px', fontFamily: T.serif, fontStyle: 'italic', color: T.muted, fontSize: 13 }}>
          A nuvem não está disponível agora.
        </div>
      ) : loading ? (
        <div style={{ padding: '20px 24px', color: T.muted, fontSize: 13, fontFamily: T.serif, fontStyle: 'italic' }}>Carregando…</div>
      ) : !user ? (
        <div style={{ padding: '8px 24px 0' }}>
          <div style={{ background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.5, marginBottom: 12 }}>
              Para usar os círculos, entre na sua conta primeiro.
            </div>
            <button onClick={() => onNav('library')} style={btnDark}>Ir para Sincronização</button>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 10, fontFamily: T.serif, fontStyle: 'italic' }}>
              Em Biblioteca → rodapé → “Sincronização na nuvem”.
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: '8px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {groups.length === 0 && (
              <div style={{ padding: '12px 2px', fontFamily: T.serif, fontStyle: 'italic', color: T.muted, fontSize: 14, lineHeight: 1.5 }}>
                Você ainda não tem círculos. Crie o primeiro ou entre com um código de convite.
              </div>
            )}
            {groups.map((g) => (
              <div key={g.id} onClick={() => window.__openGrupo && window.__openGrupo(g)} style={{
                background: T.cream, borderRadius: 14, padding: '16px 18px',
                border: `1px solid ${T.hairline}`, cursor: 'pointer',
              }}>
                <div style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 500, lineHeight: 1.15 }}>{g.name}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4, fontFamily: T.mono, letterSpacing: 0.3 }}>
                  convite: {g.invite_code}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pane === 'criar' ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do círculo (ex.: Maratona Nobel)" onKeyDown={(e) => e.key === 'Enter' && criar()} autoFocus style={inputStyle}/>
                <button onClick={criar} disabled={busy} style={btnDark}>{busy ? '…' : 'Criar'}</button>
              </div>
            ) : pane === 'entrar' ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="código do convite" onKeyDown={(e) => e.key === 'Enter' && entrar()} autoFocus style={inputStyle}/>
                <button onClick={entrar} disabled={busy} style={btnDark}>{busy ? '…' : 'Entrar'}</button>
              </div>
            ) : (
              <>
                <button onClick={() => { setPane('criar'); setMsg(null); }} style={btnGhost}><Icon name="plus" size={16}/> Criar um círculo</button>
                <button onClick={() => { setPane('entrar'); setMsg(null); }} style={btnGhost}><Icon name="user" size={16}/> Entrar com um código</button>
              </>
            )}
            {pane && <button onClick={() => { setPane(null); setMsg(null); }} style={{ background: 'transparent', border: 0, color: T.brown, fontFamily: T.sans, fontSize: 11, cursor: 'pointer', textDecoration: 'underline', alignSelf: 'flex-start' }}>cancelar</button>}
            {msg && <div style={{ padding: '10px 12px', background: '#F4D9D0', borderRadius: 10, fontSize: 12, color: '#8E3E2A' }}>{msg}</div>}
          </div>
        </>
      )}
    </div>
  );
}

function ScreenGrupoDetalheCloud({ grupo, onClose = () => {} }) {
  const cloud = (typeof window !== 'undefined') ? window.MGCloud : null;
  const [members, setMembers] = React.useState([]);
  const [challenges, setChallenges] = React.useState([]);
  const [progressMap, setProgressMap] = React.useState({}); // challengeId -> [rows]
  const [creating, setCreating] = React.useState(false);
  const [cTitle, setCTitle] = React.useState('');
  const [cTarget, setCTarget] = React.useState(6);
  const [copied, setCopied] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const myReadCount = ((typeof window !== 'undefined' && window.BOOKS) || []).filter((b) => b.status === 'read').length;
  const inviteBase = window.location.origin + window.location.pathname.replace(/(index|Marginalia)\.html$/, '');
  const inviteLink = inviteBase + '?join=' + (grupo.invite_code || '');

  const load = async () => {
    if (!cloud || !cloud.available) return;
    setMembers(await cloud.groups.members(grupo.id));
    const chs = await cloud.groups.challenges(grupo.id);
    setChallenges(chs);
    const pm = {};
    for (const ch of chs) {
      await cloud.groups.pushProgress(ch.id, myReadCount); // publica minha contribuição
      pm[ch.id] = await cloud.groups.progress(ch.id);
    }
    setProgressMap(pm);
  };
  React.useEffect(() => { load(); }, []);

  const criarDesafio = async () => {
    if (!cTitle.trim()) return;
    setBusy(true);
    const { error } = await cloud.groups.createChallenge(grupo.id, { title: cTitle.trim(), type: 'count', target: parseInt(cTarget) || 6 });
    setBusy(false);
    if (!error) { setCTitle(''); setCreating(false); await load(); }
  };

  const copiar = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(inviteLink).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const sair = async () => {
    if (!window.confirm('Sair deste círculo?')) return;
    await cloud.groups.leave(grupo.id);
    onClose();
    if (window.__rerender) window.__rerender();
  };

  const initials = (email) => (email || '?').slice(0, 2).toUpperCase();

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(42,38,32,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 80 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: T.bone, borderRadius: '24px 24px 0 0', padding: '14px 22px 32px', maxHeight: '94%', overflow: 'auto', fontFamily: T.sans, color: T.ink }}>
        <div style={{ width: 36, height: 4, background: T.hairline, borderRadius: 4, margin: '0 auto 16px' }}/>

        <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 4 }}>Círculo de leitura</div>
        <div style={{ fontFamily: T.serif, fontSize: 26, fontWeight: 500, letterSpacing: -0.4, lineHeight: 1.1, marginBottom: 16 }}>{grupo.name}</div>

        {/* convite */}
        <div style={{ background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.terra, fontWeight: 700, marginBottom: 6 }}>Convidar amigos</div>
          <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, lineHeight: 1.45, marginBottom: 10 }}>
            Mande este link no WhatsApp. Quem abrir entra no círculo (precisa entrar com o e-mail).
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1, fontFamily: T.mono, fontSize: 11, color: T.ink, background: T.bone, border: `1px solid ${T.hairline}`, borderRadius: 8, padding: '9px 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inviteLink}</div>
            <button onClick={copiar} style={{ padding: '9px 14px', borderRadius: 8, border: 0, background: T.ink, color: T.cream, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{copied ? 'Copiado!' : 'Copiar'}</button>
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 8, fontFamily: T.mono }}>código: {grupo.invite_code}</div>
        </div>

        {/* membros */}
        <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 10 }}>Membros · {members.length}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {members.map((m) => (
            <div key={m.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: T.ink, color: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 12 }}>{initials(m.email)}</div>
              <div style={{ flex: 1, fontSize: 13, color: T.ink, fontFamily: T.serif }}>{m.email}</div>
              {m.role === 'owner' && <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.terra, fontWeight: 700 }}>dona</div>}
            </div>
          ))}
        </div>

        {/* desafios compartilhados */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>Desafio do círculo</div>
          {!creating && <button onClick={() => setCreating(true)} style={{ background: 'transparent', border: 0, color: T.terra, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ novo</button>}
        </div>

        {creating && (
          <div style={{ background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
            <input value={cTitle} onChange={(e) => setCTitle(e.target.value)} placeholder="Nome (ex.: Maratona Nobel)" autoFocus style={{ width: '100%', padding: '9px 10px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, fontFamily: T.sans, fontSize: 13, marginBottom: 8, outline: 'none' }}/>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: T.muted }}>Meta (livros):</span>
              <input type="number" value={cTarget} onChange={(e) => setCTarget(e.target.value)} style={{ width: 64, padding: '8px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, fontFamily: T.sans, fontSize: 13, outline: 'none' }}/>
              <div style={{ flex: 1 }}/>
              <button onClick={() => setCreating(false)} style={{ background: 'transparent', border: 0, color: T.brown, fontSize: 12, cursor: 'pointer' }}>cancelar</button>
              <button onClick={criarDesafio} disabled={busy} style={{ padding: '8px 14px', borderRadius: 8, border: 0, background: T.ink, color: T.cream, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{busy ? '…' : 'Criar'}</button>
            </div>
          </div>
        )}

        {challenges.length === 0 && !creating && (
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.muted, fontSize: 13, marginBottom: 22 }}>
            Nenhum desafio ainda. Crie um e leiam juntos rumo à meta.
          </div>
        )}

        {challenges.map((ch) => {
          const rows = progressMap[ch.id] || [];
          const total = rows.reduce((s, r) => s + (r.value || 0), 0);
          const pct = Math.min(100, Math.round((total / Math.max(1, ch.target)) * 100));
          return (
            <div key={ch.id} style={{ background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
              <div style={{ fontFamily: T.serif, fontSize: 17, fontWeight: 500, marginBottom: 8 }}>{ch.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 500, letterSpacing: -0.5 }}>{total}<span style={{ fontSize: 12, color: T.muted }}> / {ch.target}</span></div>
                <div style={{ flex: 1 }}><LinearProgress pct={pct} height={5} color={T.terra}/></div>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>{pct}%</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {rows.map((r) => (
                  <div key={r.user_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.brown }}>
                    <span style={{ fontFamily: T.serif }}>{r.email}</span>
                    <span style={{ fontFamily: T.mono }}>{r.value} {r.value === 1 ? 'livro' : 'livros'}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <button onClick={sair} style={{ marginTop: 14, width: '100%', padding: '11px', borderRadius: 10, border: `1px solid ${T.hairline}`, background: 'transparent', color: '#8E3E2A', fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Sair do círculo</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Adicionar livro — busca por ISBN ou título via Open Library
// ─────────────────────────────────────────────────────────────
function ScreenAddBook({ onNav = () => {} }) {
  const [mode, setMode] = React.useState('isbn'); // 'isbn' | 'title'
  const [query, setQuery] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [results, setResults] = React.useState(null); // null | [] | array
  const [error, setError] = React.useState(null);

  const search = async () => {
    if (!query.trim() || typeof Sources === 'undefined') return;
    setBusy(true); setError(null); setResults(null);
    try {
      if (mode === 'isbn') {
        const isbn = query.replace(/[^0-9X]/gi, '');
        const r = await Sources.lookupISBN(isbn);
        setResults(r ? [{ ...r, isbn }] : []);
      } else {
        const list = await Sources.searchByTitle(query);
        setResults(list);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const adopt = (r) => {
    if (typeof MG === 'undefined' || !MG.addBook) return;
    const id = (r.title || 'livro').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) + '-' + Date.now().toString(36).slice(-4);
    MG.addBook({
      id,
      title: r.title,
      author: r.author,
      pages: r.pages || null,
      pct: 0,
      currentPage: 0,
      status: 'reading',          // entra direto em "Lendo agora"
      cover: r.cover || null,     // preserva a capa encontrada na busca
      isbn: r.isbn || null,
      tone: ['terra','olive','ochre','rose','sage','ink'][Math.floor(Math.random()*6)],
      theme: r.subjects?.[0] || 'Sem tema',
      year: r.year || null,
      addedAt: new Date().toISOString(),
    });
    onNav('library');
  };

  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 100 }}>
      <div style={{ padding: '56px 24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <button onClick={() => onNav('home')} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 12, color: T.brown, fontWeight: 600,
            letterSpacing: 0.4, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}>
            <Icon name="arrowLeft" size={16}/> Voltar
          </button>
        </div>
        <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, marginBottom: 6, fontWeight: 600 }}>
          Acrescentar à biblioteca
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.05 }}>
          Que livro <span style={{ fontStyle: 'italic', color: T.terra }}>você abre agora?</span>
        </div>
      </div>

      {/* tabs ISBN / título */}
      <div style={{ padding: '8px 24px 0', display: 'flex', gap: 8 }}>
        {[{id:'isbn', l:'Por ISBN'}, {id:'title', l:'Por título'}].map(t => (
          <button key={t.id} onClick={() => { setMode(t.id); setResults(null); }} style={{
            padding: '8px 14px', borderRadius: 999,
            background: mode === t.id ? T.ink : 'transparent',
            color: mode === t.id ? T.cream : T.brown,
            border: `1px solid ${mode === t.id ? T.ink : T.hairline}`,
            fontFamily: T.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>{t.l}</button>
        ))}
      </div>

      {/* input + buscar */}
      <div style={{ padding: '14px 24px 0', display: 'flex', gap: 8 }}>
        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder={mode === 'isbn' ? 'ex.: 9788535914849' : 'ex.: Mefisto Klaus Mann'}
          style={{
            flex: 1, padding: '12px 14px', border: `1px solid ${T.hairline}`,
            borderRadius: 10, background: T.cream, color: T.ink,
            fontFamily: T.sans, fontSize: 14, outline: 'none',
          }}/>
        <button onClick={search} disabled={busy || !query.trim()} style={{
          background: T.ink, color: T.cream, border: 0, borderRadius: 10,
          padding: '0 18px', fontSize: 12, fontWeight: 600, cursor: busy ? 'wait' : 'pointer',
          letterSpacing: 0.3, opacity: (busy || !query.trim()) ? 0.6 : 1,
        }}>{busy ? '…' : 'Buscar'}</button>
      </div>

      {/* hint */}
      <div style={{ padding: '10px 24px 4px', fontSize: 11, color: T.muted, lineHeight: 1.4, fontFamily: T.serif, fontStyle: 'italic' }}>
        {mode === 'isbn'
          ? 'O ISBN está na contracapa, abaixo do código de barras. Pode colar com ou sem hífens.'
          : 'Digite parte do título — algumas palavras já bastam. Inclua o autor para refinar.'}
      </div>

      {/* resultados */}
      <div style={{ padding: '14px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {error && (
          <div style={{ padding: 12, background: '#F4D9D0', borderRadius: 10, fontSize: 12, color: '#8E3E2A' }}>
            Erro: {error}
          </div>
        )}
        {results && results.length === 0 && (
          <div style={{ padding: '20px 0', fontSize: 13, color: T.muted, fontStyle: 'italic', fontFamily: T.serif, textAlign: 'center' }}>
            Nenhum livro encontrado. Tente outra busca.
          </div>
        )}
        {results && results.map((r, i) => (
          <div key={i} onClick={() => adopt(r)} style={{
            display: 'flex', gap: 12, padding: 12,
            background: T.cream, borderRadius: 12, border: `1px solid ${T.hairline}`,
            cursor: 'pointer', alignItems: 'flex-start',
          }}>
            {r.cover ? (
              <img src={r.cover} alt={r.title} style={{
                width: 56, height: 84, objectFit: 'cover', borderRadius: 3,
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)', flexShrink: 0,
              }} onError={e => e.target.style.display='none'}/>
            ) : (
              <BookCover title={r.title} author={r.author} tone="cream" w={56}/>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500, lineHeight: 1.2, marginBottom: 4 }}>
                {r.title}
              </div>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, color: T.brown, marginBottom: 6 }}>
                {r.author}
              </div>
              <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, letterSpacing: 0.3 }}>
                {[r.year, r.pages && (r.pages + ' pág'), r.publisher].filter(Boolean).join(' · ')}
              </div>
            </div>
            <Icon name="plus" size={18} color={T.terra}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ScreenMetas — tela de Reading Challenges (metas pessoais)
// ─────────────────────────────────────────────────────────────
function ScreenMetas({ onNav = () => {} }) {
  const challenges = (typeof MG !== 'undefined' && MG.getChallenges) ? MG.getChallenges() : [];
  const ativas = challenges.filter(c => {
    if (c.period === 'open') return true;
    if (!c.endsAt) return true;
    return new Date(c.endsAt).getTime() >= Date.now();
  });
  const finalizadas = challenges.filter(c => {
    if (c.period === 'open') return false;
    return c.endsAt && new Date(c.endsAt).getTime() < Date.now();
  });

  const handleNew = () => {
    if (typeof window.__editChallenge === 'function') window.__editChallenge({});
  };
  const [showSug, setShowSug] = React.useState(false);
  const sugAbertas = ativas.length === 0 || showSug;

  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 120 }}>
      <div style={{ padding: '56px 24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <button onClick={() => onNav('home')} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 12, color: T.brown, fontWeight: 600,
            letterSpacing: 0.4, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}>
            <Icon name="arrowLeft" size={16}/> Voltar
          </button>
          <BrandMark size={22}/>
        </div>
        <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, marginBottom: 6, fontWeight: 600 }}>
          Suas metas
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.05 }}>
          Reading <span style={{ fontStyle: 'italic', color: T.terra }}>challenges</span>
        </div>
        <div style={{ fontSize: 13, color: T.brown, marginTop: 8, lineHeight: 1.45, fontFamily: T.serif }}>
          Pequenos contratos com você mesma. Sem ostentação.
          <em> Mude, abandone, ajuste — sem culpa.</em>
        </div>
      </div>

      {/* metas em curso */}
      {ativas.length > 0 ? (
        <div style={{ padding: '16px 24px 0' }}>
          <SectionLabel color={T.terra}>Em curso · {ativas.length}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
            {ativas.map(c => <ChallengeCard key={c.id} challenge={c}/>)}
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 24px 0', fontFamily: T.serif, fontStyle: 'italic',
                      color: T.muted, fontSize: 13, lineHeight: 1.5, textAlign: 'center' }}>
          Você ainda não tem metas em curso.<br/>
          Toque no <strong>+</strong> para criar a primeira.
        </div>
      )}

      {/* finalizadas */}
      {finalizadas.length > 0 && (
        <div style={{ padding: '24px 24px 0' }}>
          <SectionLabel color={T.olive}>Finalizadas · {finalizadas.length}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
            {finalizadas.map(c => <ChallengeCard key={c.id} challenge={c} finished/>)}
          </div>
        </div>
      )}

      {/* botão criar */}
      <div style={{ padding: '24px 24px 0' }}>
        <button onClick={handleNew} style={{
          width: '100%', padding: '14px 0',
          background: 'transparent', color: T.ink,
          border: `1px dashed ${T.hairline}`, borderRadius: 12,
          fontFamily: T.sans, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="plus" size={16}/> Nova meta
        </button>
      </div>

      {/* nota sobre compartilhamento futuro */}
      <div style={{ padding: '16px 24px 0' }}>
        <div style={{
          background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12,
          padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <Icon name="sparkle" size={16} color={T.ochre}/>
          <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, lineHeight: 1.45 }}>
            Por enquanto, seus desafios são <em>pessoais</em> — um contrato só com você.
            Em breve você poderá convidar amigos; quando o compartilhamento chegar,
            o ingresso será livre.
          </div>
        </div>
      </div>

      {/* sugestões — sempre acessíveis via botão "pedir sugestão" */}
      <div style={{ padding: '20px 24px 0' }}>
        {ativas.length > 0 && (
          <button onClick={() => setShowSug(v => !v)} style={{
            width: '100%', padding: '12px 0', background: 'transparent', color: T.ochre,
            border: `1px dashed ${T.hairline}`, borderRadius: 12,
            fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: 0.3,
          }}>
            <Icon name="sparkle" size={16} color={T.ochre}/>
            {showSug ? 'Esconder sugestões' : 'Quer uma sugestão de desafio?'}
          </button>
        )}
        {sugAbertas && (
          <div style={{ marginTop: ativas.length > 0 ? 14 : 0 }}>
            <SectionLabel color={T.ochre}>{ativas.length === 0 ? 'Sugestões pra começar' : 'Sugestões pra você'}</SectionLabel>
            <div style={{ fontSize: 12, color: T.muted, fontFamily: T.serif, fontStyle: 'italic', margin: '6px 0 10px' }}>
              Toque em uma para adotá-la como sua.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(window.CHALLENGE_SUGESTOES || []).map((s, i) => (
                <ChallengeSuggestion key={i} suggestion={s}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChallengeCard({ challenge: c, finished }) {
  const progress = MG.computeChallengeProgress(c);
  const periodLabel = (window.CHALLENGE_PERIODS || []).find(p => p.id === c.period)?.label_pt || c.period;
  const expand = () => { if (typeof window.__editChallenge === 'function') window.__editChallenge(c); };

  // dias restantes
  let daysLabel = '';
  if (c.endsAt) {
    const end = new Date(c.endsAt).getTime();
    const days = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
    daysLabel = days > 0 ? `${days} ${days === 1 ? 'dia' : 'dias'} restantes` : 'expirou';
  }

  // paleta colorida (mesma do desafio antigo): um tom pastel por desafio,
  // escolhido de forma estável a partir do id/título.
  const TONES = {
    terra: { bg: '#F2D7CB', tag: '#B0533A', border: 'rgba(176,83,58,0.25)' },
    ochre: { bg: '#F2E1BD', tag: '#8E6418', border: 'rgba(142,100,24,0.25)' },
    olive: { bg: '#E5E5D2', tag: '#5E6B3E', border: 'rgba(94,107,62,0.25)' },
    rose:  { bg: '#F3DCD0', tag: '#9E5E4A', border: 'rgba(158,94,74,0.25)' },
    sage:  { bg: '#E0E3D2', tag: '#616E4A', border: 'rgba(97,110,74,0.25)' },
  };
  const order = ['terra', 'ochre', 'olive', 'rose', 'sage'];
  let h = 0; const key = String(c.id || c.title || '');
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const t = TONES[order[h % order.length]];

  return (
    <div onClick={expand} style={{
      background: finished ? T.cream : t.bg, color: T.ink, borderRadius: 14, padding: '16px 18px',
      border: `1px solid ${finished ? T.hairline : t.border}`, cursor: 'pointer',
      position: 'relative', overflow: 'hidden', opacity: finished ? 0.85 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{
          fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
          padding: '4px 9px', borderRadius: 999, background: t.tag, color: T.cream,
        }}>{periodLabel}</div>
        {finished && (
          <div style={{
            padding: '3px 8px', borderRadius: 999,
            background: T.olive, color: T.cream,
            fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700,
          }}>✓ {progress.pct}%</div>
        )}
      </div>
      <div style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 500, lineHeight: 1.12, letterSpacing: -0.3, marginBottom: c.description ? 4 : 10 }}>
        {c.title}
      </div>
      {c.description && (
        <div style={{ fontFamily: T.serif, fontSize: 12.5, fontStyle: 'italic', color: T.brown, lineHeight: 1.4, marginBottom: 12 }}>
          {c.description}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          fontFamily: T.serif, fontSize: 24, fontWeight: 500, color: T.ink,
          fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5,
        }}>
          {progress.value}<span style={{ fontSize: 13, color: T.brown, fontWeight: 400 }}> / {progress.target}</span>
        </div>
        <div style={{ flex: 1 }}>
          <LinearProgress pct={progress.pct} height={5} color={t.tag}/>
        </div>
        <div style={{ fontSize: 11, color: T.brown, fontFamily: T.mono, fontVariantNumeric: 'tabular-nums' }}>
          {progress.pct}%
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.brown, letterSpacing: 0.4 }}>
        <span>{progress.unit}</span>
        {daysLabel && <span>{daysLabel}</span>}
      </div>
    </div>
  );
}

function ChallengeSuggestion({ suggestion: s }) {
  const adopt = () => {
    if (typeof MG === 'undefined') return;
    const win = window.periodWindow(s.period);
    MG.addChallenge({
      title: s.title_pt,
      type: s.type,
      target: s.target,
      period: s.period,
      startsAt: win.startsAt,
      endsAt: win.endsAt,
      filter: s.filter || null,
      color: T.terra,
    });
  };
  return (
    <div onClick={adopt} style={{
      padding: '12px 14px', background: 'transparent',
      border: `1px dashed ${T.hairline}`, borderRadius: 10,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ fontFamily: T.serif, fontSize: 13 }}>{s.title_pt}</div>
      <div style={{ fontSize: 10, color: T.terra, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
        adotar →
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ChallengeEditorSheet — sheet pra criar/editar meta
// ─────────────────────────────────────────────────────────────
function ChallengeEditorSheet({ challenge = null, onClose = () => {} }) {
  const isEdit = !!challenge?.id;
  const [title, setTitle] = React.useState(challenge?.title || '');
  const [type, setType] = React.useState(challenge?.type || 'count');
  const [target, setTarget] = React.useState(challenge?.target || 12);
  const [period, setPeriod] = React.useState(challenge?.period || 'year');
  const [filterTheme, setFilterTheme] = React.useState(challenge?.filter?.theme || '');
  const [filterAuthor, setFilterAuthor] = React.useState(challenge?.filter?.author || '');
  const [customStart, setCustomStart] = React.useState(challenge?.startsAt || '');
  const [customEnd, setCustomEnd] = React.useState(challenge?.endsAt || '');
  const [description, setDescription] = React.useState(challenge?.description || '');
  const [error, setError] = React.useState(null);

  const types = window.CHALLENGE_TYPES || [];
  const periods = window.CHALLENGE_PERIODS || [];

  const handleSave = () => {
    if (!title.trim()) { setError('Dê um nome à sua meta.'); return; }
    if (typeof MG === 'undefined') { onClose(); return; }
    const win = window.periodWindow(period, new Date(), customStart, customEnd);
    const filter = (type === 'theme' && filterTheme) ? { theme: filterTheme.trim() }
                 : (type === 'author' && filterAuthor) ? { author: filterAuthor.trim() }
                 : null;
    const patch = {
      title: title.trim(),
      description: description.trim() || null,
      type,
      target: parseInt(target) || 1,
      period,
      startsAt: win.startsAt,
      endsAt: win.endsAt,
      filter,
    };
    if (isEdit) {
      MG.updateChallenge(challenge.id, patch);
    } else {
      MG.addChallenge({ ...patch, color: T.terra });
    }
    onClose();
  };

  const handleDelete = () => {
    if (!isEdit) return;
    MG.removeChallenge(challenge.id);
    onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(42,38,32,0.5)',
      display: 'flex', alignItems: 'flex-end', zIndex: 80,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: T.paper, borderRadius: '24px 24px 0 0',
        padding: '14px 20px 28px', maxHeight: '92%', overflow: 'auto',
        fontFamily: T.sans, color: T.ink,
      }}>
        <div style={{ width: 36, height: 4, background: T.hairline, borderRadius: 4, margin: '0 auto 14px' }}/>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontSize: 13, color: T.brown,
          }}>Cancelar</button>
          <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500 }}>
            {isEdit ? 'Editar meta' : 'Nova meta'}
          </div>
          <button onClick={handleSave} style={{
            background: T.ink, color: T.cream, border: 0, borderRadius: 999,
            padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.3,
          }}>Salvar</button>
        </div>

        {/* tipo de meta */}
        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Tipo de meta</FieldLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {types.map(t => (
              <button key={t.id} onClick={() => setType(t.id)} style={{
                padding: '12px 14px', borderRadius: 10, textAlign: 'left',
                background: type === t.id ? T.ink : T.cream,
                color: type === t.id ? T.cream : T.ink,
                border: `1px solid ${type === t.id ? T.ink : T.hairline}`,
                cursor: 'pointer', fontFamily: T.sans, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Icon name={t.icon} size={14}
                      color={type === t.id ? T.cream : T.brown}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{t.label_pt}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, fontStyle: 'italic',
                                fontFamily: T.serif, marginTop: 2 }}>{t.hint_pt}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* nome */}
        <FieldLabel>Nome da meta</FieldLabel>
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="ex.: 12 livros em 2026"
          style={{
            width: '100%', padding: '10px 12px', border: `1px solid ${T.hairline}`,
            borderRadius: 8, background: T.cream, color: T.ink,
            fontFamily: T.serif, fontSize: 14, outline: 'none', marginBottom: 14,
          }}/>

        {/* descrição (opcional) */}
        <FieldLabel>Descrição (opcional)</FieldLabel>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Para que serve esta meta? Ex.: Reler os Nobel de Literatura que me marcaram."
          rows={2}
          style={{
            width: '100%', padding: '10px 12px', border: `1px solid ${T.hairline}`,
            borderRadius: 8, background: T.cream, color: T.ink, resize: 'vertical',
            fontFamily: T.serif, fontSize: 13, outline: 'none', marginBottom: 14, lineHeight: 1.4,
          }}/>

        {/* target — esconde para 'free' */}
        {type !== 'free' && (
          <>
            <FieldLabel>{type === 'pages' ? 'Páginas alvo' : 'Quantos livros'}</FieldLabel>
            <input type="number" value={target} onChange={e => setTarget(e.target.value)}
              placeholder={type === 'pages' ? '6000' : '12'} min={1}
              style={{
                width: '100%', padding: '10px 12px', border: `1px solid ${T.hairline}`,
                borderRadius: 8, background: T.cream, color: T.ink,
                fontFamily: T.serif, fontSize: 14, outline: 'none', marginBottom: 14,
              }}/>
          </>
        )}

        {/* filtros opcionais por tema/autor */}
        {type === 'theme' && (
          <>
            <FieldLabel>Tema (palavra-chave)</FieldLabel>
            <input value={filterTheme} onChange={e => setFilterTheme(e.target.value)}
              placeholder="ex.: estoicismo, sertão, autoras"
              style={{
                width: '100%', padding: '10px 12px', border: `1px solid ${T.hairline}`,
                borderRadius: 8, background: T.cream, color: T.ink,
                fontFamily: T.serif, fontSize: 14, outline: 'none', marginBottom: 14,
              }}/>
          </>
        )}
        {type === 'author' && (
          <>
            <FieldLabel>Autor (palavra-chave)</FieldLabel>
            <input value={filterAuthor} onChange={e => setFilterAuthor(e.target.value)}
              placeholder="ex.: Lispector, Rosa, Marco Aurélio"
              style={{
                width: '100%', padding: '10px 12px', border: `1px solid ${T.hairline}`,
                borderRadius: 8, background: T.cream, color: T.ink,
                fontFamily: T.serif, fontSize: 14, outline: 'none', marginBottom: 14,
              }}/>
          </>
        )}

        {/* período */}
        <FieldLabel>Período</FieldLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {periods.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)} style={{
              padding: '8px 12px', borderRadius: 999,
              background: period === p.id ? T.ink : 'transparent',
              color: period === p.id ? T.cream : T.brown,
              border: `1px solid ${period === p.id ? T.ink : T.hairline}`,
              fontFamily: T.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>{p.label_pt}</button>
          ))}
        </div>

        {period === 'custom' && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <FieldLabel>Início</FieldLabel>
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', border: `1px solid ${T.hairline}`,
                  borderRadius: 8, background: T.cream, color: T.ink,
                  fontFamily: T.sans, fontSize: 13, outline: 'none',
                }}/>
            </div>
            <div style={{ flex: 1 }}>
              <FieldLabel>Fim</FieldLabel>
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', border: `1px solid ${T.hairline}`,
                  borderRadius: 8, background: T.cream, color: T.ink,
                  fontFamily: T.sans, fontSize: 13, outline: 'none',
                }}/>
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 12, padding: '8px 10px', background: '#F4D9D0',
                        borderRadius: 6, fontSize: 11, color: '#8E3E2A' }}>
            {error}
          </div>
        )}

        {isEdit && (
          <button onClick={handleDelete} style={{
            width: '100%', padding: '12px', borderRadius: 10,
            background: 'transparent', color: '#8E3E2A',
            border: `1px solid #F4D9D0`, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 12, fontWeight: 500, marginTop: 14,
          }}>
            Apagar meta
          </button>
        )}
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase',
      color: T.muted, fontWeight: 600, marginBottom: 6,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// ShareNoteSheet — gera card de citação compartilhável
// ─────────────────────────────────────────────────────────────
function ShareNoteSheet({ note, book, onClose = () => {} }) {
  const [canvas, setCanvas] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const previewRef = React.useRef(null);

  // Gera o canvas
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof Share === 'undefined') return;
      await Share.preloadSymbol();
      if (cancelled) return;
      const c = await Share.renderQuoteCard({ note, book });
      if (cancelled) return;
      setCanvas(c);
    })();
    return () => { cancelled = true; };
  }, [note, book]);

  // Quando o canvas existe E o ref está pronto, anexa ao preview
  React.useEffect(() => {
    if (!canvas || !previewRef.current) return;
    previewRef.current.innerHTML = '';
    const display = canvas.cloneNode(true);
    display.getContext('2d').drawImage(canvas, 0, 0);
    display.style.width = '100%';
    display.style.height = 'auto';
    display.style.display = 'block';
    display.style.borderRadius = '12px';
    display.style.border = `1px solid ${T.hairline}`;
    previewRef.current.appendChild(display);
  }, [canvas]);

  const loading = !canvas;

  const handleDownload = () => {
    if (!canvas) return;
    const safeTitle = (book.title || 'citacao').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    Share.download(canvas, `marginalia-${safeTitle}.png`);
  };

  const handleCopy = async () => {
    if (!canvas) return;
    const ok = await Share.copyToClipboard(canvas);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!canvas) return;
    const ok = await Share.share(canvas, note, book);
    if (!ok) handleDownload();
  };

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(42,38,32,0.55)',
      display: 'flex', alignItems: 'flex-end', zIndex: 80,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: T.paper, borderRadius: '24px 24px 0 0',
        padding: '14px 20px 28px', maxHeight: '92%', overflow: 'auto',
        fontFamily: T.sans, color: T.ink,
      }}>
        <div style={{ width: 36, height: 4, background: T.hairline, borderRadius: 4, margin: '0 auto 14px' }}/>

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontSize: 13, color: T.brown,
          }}>Fechar</button>
          <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500 }}>
            Compartilhar margem
          </div>
          <div style={{ width: 50 }}/>
        </div>

        {/* preview do card — sempre renderiza o div ref, mostra placeholder por cima quando carregando */}
        <div style={{ marginBottom: 18, position: 'relative' }}>
          <div ref={previewRef}/>
          {loading && (
            <div style={{
              position: 'absolute', inset: 0,
              width: '100%', aspectRatio: 1, background: T.cream, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.muted, fontFamily: T.serif, fontStyle: 'italic',
            }}>gerando…</div>
          )}
        </div>

        {/* explicação */}
        <div style={{
          fontSize: 12, color: T.brown, fontFamily: T.serif, fontStyle: 'italic',
          textAlign: 'center', marginBottom: 18, lineHeight: 1.5,
        }}>
          1080×1080 · pronto para Instagram, WhatsApp, e-mail
        </div>

        {/* ações */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleShare} style={{
            padding: '14px', borderRadius: 12,
            background: T.ink, color: T.cream, border: 0, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 14, fontWeight: 600, letterSpacing: 0.4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name="share" size={16} color={T.cream}/> Compartilhar
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleDownload} style={{
              flex: 1, padding: '12px', borderRadius: 12,
              background: T.cream, color: T.ink,
              border: `1px solid ${T.hairline}`, cursor: 'pointer',
              fontFamily: T.sans, fontSize: 13, fontWeight: 500,
            }}>Baixar PNG</button>
            <button onClick={handleCopy} style={{
              flex: 1, padding: '12px', borderRadius: 12,
              background: copied ? T.olive : T.cream,
              color: copied ? T.cream : T.ink,
              border: `1px solid ${copied ? T.olive : T.hairline}`, cursor: 'pointer',
              fontFamily: T.sans, fontSize: 13, fontWeight: 500,
            }}>{copied ? '✓ Copiado' : 'Copiar imagem'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BrandMark — pequeno selo da Marginália para canto das telas
// ─────────────────────────────────────────────────────────────
function BrandMark({ size = 26, opacity = 0.5 }) {
  return (
    <img src="symbol.png" alt="Marginália"
      width={size} height={size}
      style={{
        display: 'block', objectFit: 'contain',
        opacity, flexShrink: 0,
      }}/>
  );
}

// ─────────────────────────────────────────────────────────────
// ScreenConversas — conversas temáticas que atravessam livros
// Cada tema agrupa leitores discutindo o conceito (não um livro só)
// ─────────────────────────────────────────────────────────────
function ScreenConversas({ onNav = () => {} }) {
  const conversas = [
    {
      id: 'estoi', tema: 'Estoicismo', cor: T.terra, leitores: 142, atividade: '14 mensagens hoje',
      books: ['Meditações', 'Cartas a Lucílio', 'Manual de Epicteto'],
      ultima: { autor: 'Helena R.', t: '2h', text: 'A diferença entre razão e racionalização — alguém tem leitura recente sobre isso?' },
    },
    {
      id: 'orient', tema: 'Filosofia oriental', cor: T.olive, leitores: 89, atividade: 'Sessão sex 20h',
      books: ['Tao Te Ching', 'Bhagavad Gita', 'Diamond Sutra'],
      ultima: { autor: 'Pedro K.', t: 'ontem', text: 'O paralelo entre wu wei e karma yoga — Krishna e Lao Tsé se tocam.' },
    },
    {
      id: 'brev', tema: 'Brevidade da vida', cor: '#9E5E4A', leitores: 67, atividade: '3 notas hoje',
      books: ['Sobre a brevidade da vida', 'Meditações', 'Ensaios'],
      ultima: { autor: 'Marina V.', t: '4h', text: 'Sêneca diz que a vida não é curta — nós é que a desperdiçamos. Posicionamento profundo.' },
    },
    {
      id: 'sertao', tema: 'Brasil profundo', cor: T.ochre, leitores: 38, atividade: 'Acioli em curso',
      books: ['Grande Sertão: Veredas', 'Torto Arado', 'Com armas sonolentas'],
      ultima: { autor: 'Lucas A.', t: '6h', text: 'Itamar Vieira Jr e a continuidade com Rosa — a oralidade como técnica.' },
    },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 120 }}>
      <div style={{ padding: '56px 24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <button onClick={() => onNav('home')} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 12, color: T.brown, fontWeight: 600,
            letterSpacing: 0.4, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}>
            <Icon name="arrowLeft" size={16}/> Voltar
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>
            Atravessam vários livros
          </div>
          <BrandMark size={22}/>
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.05 }}>
          Conversas <span style={{ fontStyle: 'italic', color: T.terra }}>temáticas</span>
        </div>
        <div style={{ fontSize: 13, color: T.brown, marginTop: 8, lineHeight: 1.45, fontFamily: T.serif }}>
          Discussões em torno de conceitos que atravessam autores e épocas.
          <em> Aberto a quem entrar.</em>
        </div>
      </div>

      <div style={{ padding: '8px 24px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {conversas.map(c => (
          <div key={c.id} style={{
            background: T.cream, borderRadius: 14, padding: '16px 18px',
            border: `1px solid ${T.hairline}`, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 10, position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: c.cor,
            }}/>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                fontFamily: T.serif, fontSize: 20, fontWeight: 500, letterSpacing: -0.3,
              }}>
                {c.tema}
              </div>
              <div style={{
                fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase',
                color: c.cor, fontWeight: 700,
              }}>{c.atividade}</div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.serif, fontStyle: 'italic' }}>
              através de {c.books.join(' · ')}
            </div>
            <div style={{
              padding: '10px 12px', background: T.bone, borderRadius: 8,
              borderLeft: `2px solid ${c.cor}`,
            }}>
              <div style={{ fontSize: 11, color: T.brown, marginBottom: 3 }}>
                <strong>{c.ultima.autor}</strong> · <span style={{ color: T.muted }}>{c.ultima.t}</span>
              </div>
              <div style={{ fontFamily: T.serif, fontSize: 13, lineHeight: 1.4, color: T.ink, fontStyle: 'italic' }}>
                "{c.ultima.text}"
              </div>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 10, color: T.muted, paddingTop: 6,
              borderTop: `1px solid ${T.hairlineSoft}`, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
            }}>
              <span>{c.leitores} leitores</span>
              <span style={{ color: T.terra }}>Entrar na conversa →</span>
            </div>
          </div>
        ))}

        <button style={{
          width: '100%', padding: '14px 0', marginTop: 8,
          background: 'transparent', color: T.ink,
          border: `1px dashed ${T.hairline}`, borderRadius: 12,
          fontFamily: T.sans, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="plus" size={16}/> Iniciar conversa sobre tema
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ScreenFoco — sessão de leitura com timer (estilo Pomodoro)
// O livro vira o relógio: as páginas se desenham conforme o tempo passa.
// ─────────────────────────────────────────────────────────────
function ScreenFoco({ onNav = () => {} }) {
  const [duration, setDuration] = React.useState(25 * 60); // segundos
  const [remaining, setRemaining] = React.useState(25 * 60);
  const [running, setRunning] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [customMin, setCustomMin] = React.useState('');

  const presets = [25, 30, 40, 50];

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(id);
          setRunning(false);
          setDone(true);
          // toca um beep curto via Web Audio
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = 528;
            osc.connect(gain); gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);
            osc.start(); osc.stop(ctx.currentTime + 1.6);
          } catch {}
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = () => { setDone(false); setRunning(true); };
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setRemaining(duration); setDone(false); };
  const setMinutes = (m) => {
    const s = m * 60;
    setDuration(s); setRemaining(s); setRunning(false); setDone(false);
  };
  const setCustom = () => {
    const m = parseInt(customMin);
    if (m > 0 && m <= 240) setMinutes(m);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const pct = duration ? (1 - remaining / duration) * 100 : 0;

  // calcula quantas páginas representam o tempo decorrido (assumindo 12 pág/sessão de 25 min)
  const paginasNaSessao = Math.round(((duration - remaining) / 60) * 0.5);
  const totalPaginas = Math.round((duration / 60) * 0.5);

  const b = BOOK_CURRENT;

  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 80, position: 'relative' }}>
      <div style={{ padding: '56px 24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={() => onNav('home')} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 12, color: T.brown, fontWeight: 600,
            letterSpacing: 0.4, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}>
            <Icon name="arrowLeft" size={16}/> Voltar
          </button>
          <BrandMark size={22}/>
        </div>
        <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, marginBottom: 6, fontWeight: 600 }}>
          Sessão de leitura
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.05 }}>
          Foco <span style={{ fontStyle: 'italic', color: T.terra }}>na página</span>
        </div>
      </div>

      {/* livro como relógio — o "preenchimento" sobe conforme o tempo passa */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
        <div style={{ position: 'relative', width: 180, height: 260 }}>
          {/* contorno do livro */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 4,
            background: T.parchment, border: `1px solid ${T.hairline}`,
            overflow: 'hidden',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5), 0 8px 24px rgba(0,0,0,0.1)',
          }}>
            {/* preenchimento "tinta" subindo */}
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              height: `${pct}%`,
              background: `linear-gradient(180deg, ${T.terra} 0%, ${T.terraDeep || '#8E3E2A'} 100%)`,
              transition: 'height 0.9s ease-out',
            }}/>
            {/* sublinhado horizontal a cada quarto — "linhas do livro" */}
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute', left: '12%', right: '12%',
                top: `${10 + i * 11}%`,
                height: 1,
                background: pct > ((i+1) * 11) ? T.cream : T.hairline,
                opacity: 0.5,
              }}/>
            ))}
          </div>

          {/* tempo restante centralizado */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: T.serif, fontSize: 48, fontWeight: 500,
              color: pct > 50 ? T.cream : T.ink,
              fontVariantNumeric: 'tabular-nums', letterSpacing: -1,
              textShadow: pct > 50 ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
              transition: 'color 1s',
            }}>{mm}:{ss}</div>
            <div style={{
              fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase',
              color: pct > 50 ? 'rgba(247,241,228,0.8)' : T.muted,
              fontWeight: 600, marginTop: 4,
            }}>
              {done ? 'sessão concluída' : (running ? 'em curso' : 'pronto')}
            </div>
          </div>
        </div>
      </div>

      {/* contexto do livro */}
      <div style={{ textAlign: 'center', padding: '0 24px 14px' }}>
        <div style={{ fontFamily: T.serif, fontSize: 16, fontWeight: 500 }}>{b.title}</div>
        <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, color: T.brown }}>{b.author}</div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 8, fontFamily: T.serif }}>
          {running || done
            ? <>~{paginasNaSessao} de ~{totalPaginas} páginas no ritmo</>
            : <>~{totalPaginas} páginas previstas nessa sessão</>}
        </div>
      </div>

      {/* duração */}
      <div style={{ padding: '0 24px 16px' }}>
        <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.muted, marginBottom: 8, fontWeight: 600 }}>
          Duração
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {presets.map(m => (
            <button key={m} onClick={() => setMinutes(m)} disabled={running} style={{
              padding: '8px 14px', borderRadius: 999,
              background: duration === m * 60 ? T.ink : 'transparent',
              color: duration === m * 60 ? T.cream : T.brown,
              border: `1px solid ${duration === m * 60 ? T.ink : T.hairline}`,
              fontFamily: T.sans, fontSize: 12, fontWeight: 500,
              cursor: running ? 'not-allowed' : 'pointer',
              opacity: running ? 0.5 : 1,
            }}>{m} min</button>
          ))}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <input type="number" value={customMin} onChange={e => setCustomMin(e.target.value)}
              placeholder="…"
              disabled={running}
              style={{
                width: 50, padding: '8px 10px', borderRadius: 999,
                border: `1px solid ${T.hairline}`,
                background: T.cream, color: T.ink,
                fontFamily: T.sans, fontSize: 12, outline: 'none', textAlign: 'center',
              }}/>
            <button onClick={setCustom} disabled={running || !customMin} style={{
              padding: '8px 12px', borderRadius: 999,
              background: 'transparent', color: T.brown,
              border: `1px solid ${T.hairline}`,
              fontFamily: T.sans, fontSize: 11, fontWeight: 600,
              cursor: (running || !customMin) ? 'not-allowed' : 'pointer',
              opacity: (running || !customMin) ? 0.5 : 1,
            }}>min</button>
          </div>
        </div>
      </div>

      {/* controles */}
      <div style={{ padding: '0 24px', display: 'flex', gap: 10 }}>
        {!running && !done && (
          <button onClick={start} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: T.ink, color: T.cream, border: 0, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 14, fontWeight: 600,
            letterSpacing: 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name="play" size={14} color={T.cream}/> Começar leitura
          </button>
        )}
        {running && (
          <button onClick={pause} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: T.terra, color: T.cream, border: 0, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 14, fontWeight: 600, letterSpacing: 0.4,
          }}>Pausar</button>
        )}
        {done && (
          <button onClick={reset} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: T.olive, color: T.cream, border: 0, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 14, fontWeight: 600, letterSpacing: 0.4,
          }}>Nova sessão</button>
        )}
        {!running && remaining !== duration && !done && (
          <button onClick={reset} style={{
            padding: '14px 18px', borderRadius: 12,
            background: 'transparent', color: T.brown,
            border: `1px solid ${T.hairline}`, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 13, fontWeight: 500,
          }}>Reiniciar</button>
        )}
      </div>

      <div style={{ padding: '20px 24px 0', textAlign: 'center', fontSize: 11, color: T.muted, fontFamily: T.serif, fontStyle: 'italic' }}>
        O livro se preenche conforme o tempo passa. <br/>
        Quando completa, escreva uma nota ou volte amanhã.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ScreenLibrary — toda a biblioteca, em três seções (Lendo / Lidos / TBR)
// ─────────────────────────────────────────────────────────────
function ScreenLibrary({ onNav = () => {} }) {
  const [filter, setFilter] = React.useState('all');
  const [view, setView] = React.useState('grid'); // grid | list
  const [sort, setSort] = React.useState('added'); // added | title | progress
  const [query, setQuery] = React.useState('');

  const all = window.BOOKS || [];

  // estatísticas
  const stats = React.useMemo(() => {
    const thisYear = new Date().getFullYear();
    const lidosNoAno = all.filter(b => {
      if (b.status !== 'read') return false;
      if (b.finishedAt) return new Date(b.finishedAt).getFullYear() === thisYear;
      return true; // sem data = conta no ano corrente
    }).length;
    const totalLidos = all.filter(b => b.status === 'read').length;
    const paginasAtravessadas = all.reduce((sum, b) => {
      if (b.status === 'read') return sum + (b.pages || 0);
      if (b.status === 'reading') return sum + (b.currentPage || Math.round((b.pct || 0) * (b.pages || 0) / 100));
      return sum;
    }, 0);
    return { lidosNoAno, totalLidos, paginasAtravessadas, total: all.length };
  }, [all]);

  // ordenação
  const sortFn = {
    added: (a, b) => (b.addedAt || '').localeCompare(a.addedAt || ''),
    title: (a, b) => (a.title || '').localeCompare(b.title || '', 'pt-BR'),
    progress: (a, b) => (b.pct || 0) - (a.pct || 0),
  }[sort];

  // busca
  const q = query.trim().toLowerCase();
  const matches = q
    ? all.filter(b =>
        (b.title || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.theme || '').toLowerCase().includes(q))
    : all;

  const sections = [
    { id: 'reading', label: 'Lendo agora', accent: T.terra,
      books: [...matches.filter(b => b.status === 'reading')].sort(sortFn) },
    { id: 'tbr', label: 'TBR — para ler', accent: T.ochre,
      books: [...matches.filter(b => b.status === 'tbr')].sort(sortFn) },
    { id: 'paused', label: 'Pausados', accent: T.muted,
      books: [...matches.filter(b => b.status === 'paused')].sort(sortFn) },
    { id: 'read', label: 'Lidos', accent: T.olive,
      books: [...matches.filter(b => b.status === 'read')].sort(sortFn) },
    { id: 'unset', label: 'Sem categoria', accent: T.brown,
      books: [...matches.filter(b => !b.status)].sort(sortFn) },
  ].filter(s => s.books.length > 0);

  const filters = [
    { id: 'all', l: 'Tudo' },
    { id: 'reading', l: 'Lendo' },
    { id: 'tbr', l: 'TBR' },
    { id: 'read', l: 'Lidos' },
  ];

  const visibleSections = filter === 'all'
    ? sections
    : sections.filter(s => s.id === filter);

  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, overflow: 'auto', paddingBottom: 120 }}>
      <div style={{ padding: '56px 24px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>
            Sua biblioteca
          </div>
          <BrandMark size={22}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.05 }}>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{all.length}</span>{' '}
            <span style={{ fontStyle: 'italic', color: T.terra }}>livros</span>
          </div>
          <button onClick={() => setView(view === 'grid' ? 'list' : 'grid')} style={{
            background: 'transparent', border: `1px solid ${T.hairline}`, borderRadius: 8,
            padding: '6px 8px', cursor: 'pointer', color: T.brown,
          }}>
            <Icon name={view === 'grid' ? 'list' : 'grid'} size={16}/>
          </button>
        </div>
      </div>

      {/* estatísticas */}
      <div style={{
        margin: '6px 24px 14px', padding: '14px 16px',
        background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12,
        display: 'flex', justifyContent: 'space-between', gap: 14,
      }}>
        <Stat n={stats.lidosNoAno} label={`lidos em ${new Date().getFullYear()}`} accent={T.olive}/>
        <Stat n={stats.totalLidos} label="lidos no total" accent={T.terra}/>
        <Stat n={stats.paginasAtravessadas.toLocaleString('pt-BR')} label="páginas atravessadas" accent={T.ochre} small/>
      </div>

      {/* busca */}
      <div style={{ padding: '0 24px 10px', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 36, top: '50%', transform: 'translateY(-50%)',
          color: T.muted, pointerEvents: 'none',
        }}>
          <Icon name="search" size={14} color={T.muted}/>
        </div>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="buscar por título, autor, tema…"
          style={{
            width: '100%', padding: '10px 14px 10px 38px', border: `1px solid ${T.hairline}`,
            borderRadius: 999, background: T.paper, color: T.ink,
            fontFamily: T.sans, fontSize: 13, outline: 'none',
          }}/>
      </div>

      {/* filtros + ordenação */}
      <div style={{ padding: '4px 24px 0', display: 'flex', gap: 6, overflowX: 'auto', alignItems: 'center' }}>
        {filters.map(f => {
          const active = filter === f.id;
          const count = f.id === 'all' ? all.length : (sections.find(s => s.id === f.id)?.books.length || 0);
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '8px 12px', borderRadius: 999, flexShrink: 0,
              background: active ? T.ink : 'transparent',
              color: active ? T.cream : T.brown,
              border: `1px solid ${active ? T.ink : T.hairline}`,
              fontFamily: T.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {f.l}
              <span style={{ fontSize: 10, fontFamily: T.mono, opacity: 0.7, fontVariantNumeric: 'tabular-nums' }}>
                {count}
              </span>
            </button>
          );
        })}
        <div style={{ flex: 1 }}/>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          padding: '8px 10px', borderRadius: 999, background: 'transparent',
          border: `1px solid ${T.hairline}`, color: T.brown,
          fontFamily: T.sans, fontSize: 11, fontWeight: 500, cursor: 'pointer',
          flexShrink: 0,
        }}>
          <option value="added">Adicionado</option>
          <option value="title">Título A→Z</option>
          <option value="progress">Progresso</option>
        </select>
      </div>

      {/* sections */}
      <div style={{ padding: '20px 0 0' }}>
        {visibleSections.length === 0 && (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: T.muted, fontFamily: T.serif, fontStyle: 'italic' }}>
            {q ? `Nada encontrado para "${q}".` : 'Nada por aqui ainda. Toque no + para acrescentar.'}
          </div>
        )}
        {visibleSections.map(s => (
          <LibrarySection key={s.id} section={s} view={view}/>
        ))}
      </div>

      <BackupPanel/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BackupPanel — exportar / importar / começar do zero
// Fica no rodapé da Biblioteca. Tudo é local (localStorage); o backup
// é um arquivo .json que a leitora guarda onde quiser.
// ─────────────────────────────────────────────────────────────
// CloudAccount — entrar/sair da sincronização na nuvem (Supabase, Fase 1).
// Login por código de 6 dígitos enviado por e-mail.
function CloudAccount() {
  const cloud = (typeof window !== 'undefined') ? window.MGCloud : null;
  const [user, setUser] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [step, setStep] = React.useState('idle'); // idle | sent
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState(null);
  const status = (typeof window !== 'undefined' && window.__cloudStatus) || '';

  React.useEffect(() => {
    let alive = true;
    if (cloud && cloud.available) cloud.currentUser().then(u => { if (alive) setUser(u); });
    return () => { alive = false; };
  }, []);

  if (!cloud || !cloud.available) return null;

  const enviar = async () => {
    if (!email.trim()) { setMsg('Digite seu e-mail.'); return; }
    setBusy(true); setMsg(null);
    const { error } = await cloud.sendCode(email);
    setBusy(false);
    if (error) setMsg('Não foi possível enviar: ' + error.message);
    else { setStep('sent'); setMsg('Enviamos um código de 6 dígitos para ' + email.trim() + '. Confira seu e-mail (e a caixa de spam).'); }
  };

  const entrar = async () => {
    if (!code.trim()) { setMsg('Digite o código.'); return; }
    setBusy(true); setMsg(null);
    const { error } = await cloud.verifyCode(email, code);
    setBusy(false);
    if (error) { setMsg('Código inválido ou expirado. Tente novamente.'); return; }
    const u = await cloud.currentUser();
    setUser(u); setStep('idle'); setCode('');
    // veio de um link de convite? entra no círculo automaticamente
    if (typeof window !== 'undefined' && window.__pendingJoin && cloud.groups) {
      const jc = window.__pendingJoin; window.__pendingJoin = null;
      setMsg('Conectada! Entrando no círculo…');
      const r = await cloud.groups.join(jc);
      if (r && !r.error && r.data) {
        if (window.__openGrupo) window.__openGrupo(r.data);
        return;
      }
      setMsg('Conectada! (não encontrei o círculo do convite — pode entrar pelo código em Grupos.)');
      return;
    }
    setMsg('Conectada! Seus aparelhos vão sincronizar.');
  };

  const sair = async () => {
    await cloud.signOut();
    setUser(null); setEmail(''); setCode(''); setStep('idle'); setMsg('Você saiu. Este aparelho deixa de sincronizar.');
  };

  const inputStyle = {
    flex: 1, padding: '11px 12px', border: `1px solid ${T.hairline}`,
    borderRadius: 10, background: T.cream, color: T.ink,
    fontFamily: T.sans, fontSize: 14, outline: 'none',
  };
  const btnDark = {
    padding: '11px 16px', borderRadius: 10, border: 0, background: T.ink, color: T.cream,
    fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.2,
    opacity: busy ? 0.6 : 1,
  };

  return (
    <div style={{ marginBottom: 22, borderBottom: `1px solid ${T.hairline}`, paddingBottom: 20 }}>
      <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 6 }}>
        Sincronização na nuvem
      </div>

      {user ? (
        <>
          <div style={{ fontSize: 13, color: T.ink, fontFamily: T.serif, lineHeight: 1.5, marginBottom: 4 }}>
            Conectada como <strong>{user.email}</strong>.
          </div>
          <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, fontStyle: 'italic', marginBottom: 12 }}>
            Seus livros e notas sincronizam entre seus aparelhos automaticamente.{status ? ` · ${status}` : ''}
          </div>
          <button onClick={sair} style={{
            padding: '9px 14px', borderRadius: 10, border: `1px solid ${T.hairline}`,
            background: 'transparent', color: T.brown, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>Sair desta conta</button>
        </>
      ) : (
        <>
          <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, fontStyle: 'italic', lineHeight: 1.45, marginBottom: 12 }}>
            Entre com seu e-mail para que celular e computador fiquem sempre iguais. Você recebe um código de 6 dígitos — sem senha.
          </div>
          {step === 'idle' ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" inputMode="email" autoCapitalize="none" placeholder="seu@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && enviar()} style={inputStyle}/>
              <button onClick={enviar} disabled={busy} style={btnDark}>{busy ? '…' : 'Enviar código'}</button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" inputMode="numeric" placeholder="código de 6 dígitos"
                  value={code} onChange={e => setCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && entrar()} style={inputStyle}/>
                <button onClick={entrar} disabled={busy} style={btnDark}>{busy ? '…' : 'Entrar'}</button>
              </div>
              <button onClick={() => { setStep('idle'); setMsg(null); }} style={{
                marginTop: 8, background: 'transparent', border: 0, color: T.brown,
                fontFamily: T.sans, fontSize: 11, cursor: 'pointer', padding: 0, textDecoration: 'underline',
              }}>usar outro e-mail</button>
            </div>
          )}
        </>
      )}

      {msg && (
        <div style={{ marginTop: 12, padding: '10px 12px', background: '#EFE8DA', borderRadius: 10, fontSize: 12, color: T.brown, lineHeight: 1.4 }}>
          {msg}
        </div>
      )}
    </div>
  );
}

function BackupPanel() {
  const fileRef = React.useRef(null);
  const [msg, setMsg] = React.useState(null);
  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(null), 3500); };

  const exportar = () => {
    if (typeof MG === 'undefined' || !MG.exportJSON) return;
    const json = MG.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `marginalia-backup-${d}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash('Backup exportado. Guarde o arquivo .json em lugar seguro.');
  };

  const importar = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = MG.importJSON(String(reader.result));
      if (ok) {
        if (typeof window._refreshLive === 'function') window._refreshLive();
        if (typeof window.__rerender === 'function') window.__rerender();
        flash('Backup restaurado com sucesso.');
      } else {
        flash('Arquivo inválido — não foi possível restaurar.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const comecarDoZero = () => {
    const ok = window.confirm(
      'Começar do zero?\n\nIsto apaga TODOS os seus livros e anotações deste aparelho. ' +
      'Não dá para desfazer. Exporte um backup antes, por garantia.'
    );
    if (!ok) return;
    MG.setBooks([]);
    MG.setNotes([]);
    const s = MG.getState();
    s.progress = {};
    MG.setState(s);
    if (typeof window._refreshLive === 'function') window._refreshLive();
    if (typeof window.__rerender === 'function') window.__rerender();
    flash('Pronto — estante limpa. Toque no + para acrescentar seus livros.');
  };

  const btn = (extra = {}) => ({
    flex: 1, padding: '11px 12px', borderRadius: 10, cursor: 'pointer',
    fontFamily: T.sans, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
    border: `1px solid ${T.hairline}`, background: T.cream, color: T.ink, ...extra,
  });

  return (
    <div style={{ padding: '28px 24px 8px' }}>
      <CloudAccount/>
      <div style={{ borderTop: `1px solid ${T.hairline}`, paddingTop: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 6 }}>
          Backup e dados
        </div>
        <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, fontStyle: 'italic', lineHeight: 1.45, marginBottom: 12 }}>
          Suas anotações ficam guardadas só neste aparelho. Exporte um backup de tempos em tempos —
          é um arquivo que você pode restaurar aqui depois, ou levar para outro aparelho.
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button onClick={exportar} style={btn({ background: T.ink, color: T.cream, border: 0 })}>
            ↓ Exportar backup
          </button>
          <button onClick={() => fileRef.current && fileRef.current.click()} style={btn()}>
            ↑ Importar
          </button>
        </div>
        <button onClick={comecarDoZero} style={btn({ width: '100%', flex: 'none', color: '#8E3E2A', background: 'transparent' })}>
          Começar do zero
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={importar} style={{ display: 'none' }}/>
        {msg && (
          <div style={{ marginTop: 12, padding: '10px 12px', background: '#EFE8DA', borderRadius: 10, fontSize: 12, color: T.brown, lineHeight: 1.4 }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ n, label, accent, small }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
      <div style={{
        fontFamily: T.serif, fontSize: small ? 22 : 28, fontWeight: 500,
        color: accent, lineHeight: 1, letterSpacing: -0.5,
      }}>{n}</div>
      <div style={{
        fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase',
        color: T.muted, marginTop: 4, fontWeight: 600, lineHeight: 1.2,
      }}>{label}</div>
    </div>
  );
}

function LibrarySection({ section, view }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        padding: '0 24px 10px', display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: `1px solid ${T.hairline}`,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: section.accent }}/>
        <div style={{
          fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase',
          color: section.accent, fontWeight: 700,
        }}>
          {section.label}
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, fontVariantNumeric: 'tabular-nums' }}>
          {section.books.length}
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{
          padding: '14px 24px 0', display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
        }}>
          {section.books.map(b => (
            <div key={b.id}
                 onClick={() => { if (typeof window.__openBook === 'function') window.__openBook(b); }}
                 style={{ display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
              <BookCover title={b.title} author={b.author} tone={b.tone}
                         cover={b.cover} isbn={b.isbn} w={94} book={b}/>
              <div style={{ fontFamily: T.serif, fontSize: 11, fontWeight: 500, lineHeight: 1.15, color: T.ink }}>
                {b.title}
              </div>
              <div style={{ fontSize: 9, color: T.muted, fontStyle: 'italic', fontFamily: T.serif }}>
                {b.author}
              </div>
              {typeof b.pct === 'number' && b.pct > 0 && b.pct < 100 && (
                <LinearProgress pct={b.pct} height={2}/>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '6px 24px 0', display: 'flex', flexDirection: 'column' }}>
          {section.books.map(b => (
            <div key={b.id}
              onClick={() => { if (typeof window.__openBook === 'function') window.__openBook(b); }}
              style={{
                display: 'flex', gap: 12, padding: '12px 0',
                borderBottom: `1px solid ${T.hairlineSoft}`, alignItems: 'center', cursor: 'pointer',
              }}>
              <BookCover title={b.title} author={b.author} tone={b.tone}
                         cover={b.cover} isbn={b.isbn} w={42} book={b}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 500, lineHeight: 1.15 }}>
                  {b.title}
                </div>
                <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 11, color: T.brown, marginTop: 2 }}>
                  {b.author}
                </div>
                {typeof b.pct === 'number' && b.pct > 0 && b.pct < 100 && (
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LinearProgress pct={b.pct} height={2} style={{ flex: 1 }}/>
                    <span style={{ fontSize: 9, color: T.muted, fontFamily: T.mono, fontVariantNumeric: 'tabular-nums' }}>
                      {b.pct}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BookEditorSheet — folha modal para criar OU editar livro
// Aceita um book opcional. Se ausente, cria novo.
// Permite trocar capa por: upload de arquivo · URL · placeholder
// ─────────────────────────────────────────────────────────────
function BookEditorSheet({ book = null, onClose = () => {} }) {
  const isEdit = !!book?.id;
  const [title, setTitle] = React.useState(book?.title || '');
  const [author, setAuthor] = React.useState(book?.author || '');
  const [publisher, setPublisher] = React.useState(book?.publisher || '');
  const [year, setYear] = React.useState(book?.year || '');
  const [pages, setPages] = React.useState(book?.pages || '');
  const [tone, setTone] = React.useState(book?.tone || 'terra');
  const [status, setStatus] = React.useState(book?.status || 'tbr');
  const [currentPage, setCurrentPage] = React.useState(book?.currentPage || '');
  const [cover, setCover] = React.useState(book?.cover || '');
  const [urlInput, setUrlInput] = React.useState('');
  const [uploadError, setUploadError] = React.useState(null);
  const fileRef = React.useRef(null);

  const tones = [
    { id: 'terra', label: 'terra', bg: '#B0533A' },
    { id: 'olive', label: 'azeitona', bg: '#5E6B3E' },
    { id: 'ochre', label: 'ocre', bg: '#C48A2C' },
    { id: 'rose', label: 'rosa', bg: '#C9836E' },
    { id: 'sage', label: 'sálvia', bg: '#8A9670' },
    { id: 'cream', label: 'creme', bg: '#E8DFC9' },
    { id: 'ink', label: 'tinta', bg: '#2A2620' },
  ];

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { setUploadError('Selecione uma imagem.'); return; }
    if (f.size > 800 * 1024) { setUploadError('Imagem muito grande (máx 800 KB).'); return; }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.onerror = () => setUploadError('Erro ao ler o arquivo.');
    reader.readAsDataURL(f);
  };

  const useUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    setCover(u);
    setUrlInput('');
  };

  const usePlaceholder = () => setCover('');

  const handleSave = () => {
    if (!title.trim()) { setUploadError('Título é obrigatório.'); return; }
    if (typeof MG === 'undefined' || !MG.addBook) { onClose(); return; }
    const pagesNum = parseInt(pages) || null;
    const cpNum = Math.max(0, parseInt(currentPage) || 0);
    const cpClamped = pagesNum ? Math.min(cpNum, pagesNum) : cpNum;
    const pctCalc = pagesNum ? Math.min(100, Math.round((cpClamped / pagesNum) * 100)) : (book?.pct || 0);
    const patch = {
      title: title.trim(),
      author: author.trim() || 'Anônimo',
      publisher: publisher.trim() || null,
      year: year.toString().trim() || null,
      pages: pagesNum,
      currentPage: cpClamped,
      pct: pctCalc,
      tone,
      status,
      cover: cover || null,
      // marca quando virou "Lendo", para a home priorizar o mais recente
      ...(status === 'reading' ? { readingSince: new Date().toISOString() } : {}),
    };
    if (isEdit) {
      MG.updateBook(book.id, patch);
    } else {
      const id = (title || 'livro').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) + '-' + Date.now().toString(36).slice(-4);
      MG.addBook({
        id, ...patch, theme: 'Sem tema',
        addedAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(42,38,32,0.5)',
      display: 'flex', alignItems: 'flex-end', zIndex: 80,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: T.paper, borderRadius: '24px 24px 0 0',
        padding: '14px 20px 28px', maxHeight: '92%', overflow: 'auto',
        fontFamily: T.sans, color: T.ink,
      }}>
        {/* drag handle */}
        <div style={{ width: 36, height: 4, background: T.hairline, borderRadius: 4, margin: '0 auto 14px' }}/>

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontSize: 13, color: T.brown,
          }}>Cancelar</button>
          <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500 }}>
            {isEdit ? 'Editar livro' : 'Novo livro'}
          </div>
          <button onClick={handleSave} style={{
            background: T.ink, color: T.cream, border: 0, borderRadius: 999,
            padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.3,
          }}>Salvar</button>
        </div>

        {/* preview da capa */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <BookCover title={title || 'Sem título'} author={author || 'Sem autor'}
                     tone={tone} cover={cover || null} w={120}/>
        </div>

        {/* opções de capa */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, marginBottom: 8, fontWeight: 600 }}>
            Capa
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            <button onClick={() => fileRef.current?.click()} style={{
              flex: 1, minWidth: 90, padding: '10px 8px', borderRadius: 10,
              background: T.cream, color: T.ink,
              border: `1px solid ${T.hairline}`, cursor: 'pointer',
              fontFamily: T.sans, fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon name="stack" size={14}/> Do meu telefone
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile}
                   style={{ display: 'none' }}/>
            <button onClick={usePlaceholder} style={{
              flex: 1, minWidth: 90, padding: '10px 8px', borderRadius: 10,
              background: !cover ? T.ink : T.cream, color: !cover ? T.cream : T.ink,
              border: `1px solid ${!cover ? T.ink : T.hairline}`, cursor: 'pointer',
              fontFamily: T.sans, fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon name="book" size={14}/> Capa de papel
            </button>
          </div>
          {/* URL da web */}
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && useUrl()}
              placeholder="ou cole URL de uma imagem da web"
              style={{
                flex: 1, padding: '10px 12px', border: `1px solid ${T.hairline}`,
                borderRadius: 10, background: T.cream, color: T.ink,
                fontFamily: T.sans, fontSize: 12, outline: 'none',
              }}/>
            <button onClick={useUrl} disabled={!urlInput.trim()} style={{
              background: T.terra, color: T.cream, border: 0, borderRadius: 10,
              padding: '0 14px', fontSize: 12, fontWeight: 600,
              cursor: urlInput.trim() ? 'pointer' : 'default',
              opacity: urlInput.trim() ? 1 : 0.5, letterSpacing: 0.3,
            }}>Usar</button>
          </div>
          {uploadError && (
            <div style={{ marginTop: 8, padding: '8px 10px', background: '#F4D9D0',
                          borderRadius: 6, fontSize: 11, color: '#8E3E2A' }}>
              {uploadError}
            </div>
          )}
          {!cover && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.muted, marginBottom: 6, fontWeight: 600 }}>
                Cor do papel
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {tones.map(c => (
                  <button key={c.id} onClick={() => setTone(c.id)} title={c.label} style={{
                    width: 26, height: 26, borderRadius: '50%', background: c.bg,
                    border: `2px solid ${tone === c.id ? T.ink : 'transparent'}`,
                    cursor: 'pointer',
                  }}/>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* status do livro */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, marginBottom: 8, fontWeight: 600 }}>
            Status
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'reading', l: 'Lendo', c: T.terra },
              { id: 'tbr',     l: 'TBR',   c: T.ochre },
              { id: 'paused',  l: 'Pausado', c: T.muted },
              { id: 'read',    l: 'Lido',  c: T.olive },
            ].map(s => (
              <button key={s.id} onClick={() => setStatus(s.id)} style={{
                padding: '8px 14px', borderRadius: 999,
                background: status === s.id ? s.c : 'transparent',
                color: status === s.id ? T.cream : T.brown,
                border: `1px solid ${status === s.id ? s.c : T.hairline}`,
                fontFamily: T.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}>{s.l}</button>
            ))}
          </div>
        </div>

        {/* metadata fields */}
        <FieldRow label="Título" value={title} onChange={setTitle} placeholder="ex.: Mefisto"/>
        <FieldRow label="Autor" value={author} onChange={setAuthor} placeholder="ex.: Klaus Mann"/>
        <FieldRow label="Editora" value={publisher} onChange={setPublisher} placeholder="ex.: Companhia das Letras"/>
        <div style={{ display: 'flex', gap: 10 }}>
          <FieldRow label="Ano" value={year} onChange={setYear} placeholder="2020" small/>
          <FieldRow label="Páginas" value={pages} onChange={setPages} placeholder="304" small type="number"/>
        </div>
        <FieldRow label="Página atual (progresso)" value={currentPage} onChange={setCurrentPage} placeholder="0" type="number"/>

        {isEdit && (
          <button onClick={() => {
            const ok = window.confirm(`Remover "${book.title}" da sua estante?\n\nIsto apaga o livro e suas notas. Não dá para desfazer.`);
            if (!ok) return;
            if (typeof MG !== 'undefined' && MG.removeBook) MG.removeBook(book.id);
            if (typeof window.__setRoute === 'function') window.__setRoute('library');
            onClose();
          }} style={{
            width: '100%', marginTop: 18, padding: '12px', borderRadius: 10,
            background: 'transparent', border: `1px solid ${T.hairline}`,
            color: '#8E3E2A', fontFamily: T.sans, fontSize: 13, fontWeight: 600,
            letterSpacing: 0.3, cursor: 'pointer',
          }}>Remover livro da estante</button>
        )}
      </div>
    </div>
  );
}

function FieldRow({ label, value, onChange, placeholder, small, type = 'text' }) {
  return (
    <div style={{ marginBottom: 12, flex: small ? 1 : 'auto' }}>
      <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.muted, marginBottom: 4, fontWeight: 600 }}>
        {label}
      </div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 12px', border: `1px solid ${T.hairline}`,
          borderRadius: 8, background: T.cream, color: T.ink,
          fontFamily: T.serif, fontSize: 14, outline: 'none',
        }}/>
    </div>
  );
}

Object.assign(window, {
  ScreenBookDetail, ScreenReader, ScreenNoteEditor,
  ScreenThemes, ScreenSchedule, ScreenSummary,
  ScreenPontes, ScreenDesafios, ScreenNiveis, ScreenGrupos,
  ScreenAddBook, ScreenLibrary, ScreenFoco, ScreenConversas, ScreenGrupoDetalhe,
  ScreenMetas, ChallengeCard, ChallengeSuggestion, ChallengeEditorSheet, FieldLabel,
  BookEditorSheet, LibrarySection, Stat, BrandMark, ShareNoteSheet,
  PonteCard, DesafioCard, GrupoCard, SectionLabel,
});
