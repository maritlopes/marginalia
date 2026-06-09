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
  const bookNotes = (window.NOTES || []).filter(n => (n.bookId && n.bookId === b.id) || (!n.bookId && n.book === b.title));
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
  // abas: 'sobre', 'notas' e 'ecos' sempre; 'capítulos' só no livro de exemplo
  const tabs = ['sobre', ...(chapters.length ? ['capítulos'] : []), 'notas', 'ecos'];
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
            {b.rating > 0 && (
              <div style={{ marginTop: 8 }}>
                <StarRating value={b.rating} size={15}/>
              </div>
            )}
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

            {/* nos livros lidos, a avaliação vem primeiro (protagonista) */}
            {!isDemo && b.status === 'read' && <MinhaAvaliacao book={b}/>}

            {/* plano de leitura real — atualizar página + cronograma por data-alvo */}
            <PlanoLeitura book={b}/>

            {/* nos demais (lendo/tbr/pausado), a avaliação vem depois do plano */}
            {!isDemo && b.status !== 'read' && <MinhaAvaliacao book={b}/>}

            {/* quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
              <QuickCard icon="note" title="Escrever nota" sub={`${bookNotes.length} ${bookNotes.length === 1 ? 'nota' : 'notas'}`} primary onClick={() => { if (typeof window !== 'undefined') window.__editingNote = null; onNav('note'); }}/>
              <QuickCard icon="clock" title="Foco" sub="Sessão com timer" onClick={() => onNav('foco')}/>
              <QuickCard icon="pen" title="Editar livro" sub="Status, páginas, capa" onClick={openEditor}/>
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

            {/* pontes entre obras da sua estante (curadas + mesmo autor) */}
            {!isDemo && <PontesEstante book={b}/>}

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
              <button onClick={() => { window.location.href = buildNotesMailto(bookNotes, b); }} style={{
                alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 7,
                background: 'transparent', border: `1px solid ${T.hairline}`, borderRadius: 999,
                padding: '8px 14px', cursor: 'pointer', color: T.brown,
                fontFamily: T.sans, fontSize: 12, fontWeight: 600, letterSpacing: 0.3,
              }}>
                <Icon name="note" size={14} color={T.terra}/> Enviar todas por e-mail
              </button>
              {bookNotes.map(n => <NoteCard key={n.id} n={n} onClick={() => { if (typeof window !== 'undefined') window.__editingNote = n; onNav('note'); }}/>)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 16px' }}>
              <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 15, color: T.muted, marginBottom: 16, lineHeight: 1.5 }}>
                Nenhuma nota neste livro ainda.<br/>A margem está em branco, à sua espera.
              </div>
              <button onClick={() => { if (typeof window !== 'undefined') window.__editingNote = null; onNav('note'); }} style={{
                background: T.terra, color: T.cream, border: 0, borderRadius: 999,
                padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: T.sans, letterSpacing: 0.3,
              }}>Escrever a primeira nota</button>
            </div>
          )
        )}

        {tab === 'ecos' && <EcosPanel book={b} isDemo={isDemo} onNav={onNav}/>}
      </div>
    </div>
  );
}

// PlanoLeitura — "onde estou" (atualizar página) + cronograma por data-alvo.
// O ritmo sugerido se recalcula sozinho conforme a página avança.
// StarRating — fileira de 5 estrelas. Interativa quando recebe onChange; só exibe quando não.
function StarRating({ value = 0, onChange = null, size = 26, color }) {
  const [hover, setHover] = React.useState(0);
  const active = hover || value;
  const c = color || T.terra;
  return (
    <div style={{ display: 'inline-flex', gap: 4 }} onMouseLeave={onChange ? () => setHover(0) : undefined}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button"
          onClick={onChange ? () => onChange(n === value ? 0 : n) : undefined}
          onMouseEnter={onChange ? () => setHover(n) : undefined}
          aria-label={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`}
          style={{
            background: 'transparent', border: 0, padding: 0, lineHeight: 1,
            cursor: onChange ? 'pointer' : 'default',
            color: n <= active ? c : 'rgba(176,83,58,0.25)',
            fontSize: size, transition: 'color .12s',
          }}>★</button>
      ))}
    </div>
  );
}

// MinhaAvaliacao — estrelas + texto de recomendação no detalhe do livro.
// Grava rating/recommendation no livro (sincroniza) e abre o cartão compartilhável.
function MinhaAvaliacao({ book }) {
  const b = book || {};
  const [rating, setRating] = React.useState(b.rating || 0);
  const [rec, setRec] = React.useState(b.recommendation || '');
  const [editing, setEditing] = React.useState(false);
  const isRead = b.status === 'read';

  React.useEffect(() => { setRating(b.rating || 0); setRec(b.recommendation || ''); }, [b.id]);

  const setStars = (n) => {
    setRating(n);
    if (typeof MG !== 'undefined' && MG.updateBook) MG.updateBook(b.id, { rating: n });
  };
  const salvarRec = () => {
    const v = rec.trim();
    if (typeof MG !== 'undefined' && MG.updateBook) MG.updateBook(b.id, { recommendation: v || null });
    setEditing(false);
  };
  const abrirCartao = () => {
    if (typeof window.__shareRecommendation === 'function') {
      window.__shareRecommendation({ ...b, rating, recommendation: rec.trim() });
    }
  };

  return (
    <>
      <SectionTitle>Sua avaliação</SectionTitle>
      <div style={{ background: T.cream, borderRadius: 12, padding: '16px 18px', border: `1px solid ${T.hairline}`, marginBottom: 22 }}>
        {/* estrelas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: T.muted }}>{isRead ? 'O que você achou?' : 'Já vai avaliando'}</div>
          <StarRating value={rating} onChange={setStars} size={28}/>
        </div>

        {/* recomendação */}
        <div style={{ marginTop: 14, borderTop: `1px solid ${T.hairline}`, paddingTop: 14 }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Por que vale a pena</div>
          {editing ? (
            <div>
              <textarea value={rec} onChange={e => setRec(e.target.value)} autoFocus rows={4}
                placeholder="Em poucas linhas: para quem você recomenda este livro e por quê…"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: `1px solid ${T.hairline}`, borderRadius: 10, background: T.bone, color: T.ink, fontFamily: T.serif, fontSize: 15, lineHeight: 1.5, resize: 'vertical', outline: 'none' }}/>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={salvarRec} style={{ background: T.terra, color: T.cream, border: 0, borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Salvar</button>
                <button onClick={() => { setRec(b.recommendation || ''); setEditing(false); }} style={{ background: 'transparent', color: T.brown, border: `1px solid ${T.hairline}`, borderRadius: 8, padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}>Cancelar</button>
              </div>
            </div>
          ) : rec ? (
            <div onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
              <div style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.5, color: T.ink, fontStyle: 'italic' }}>“{rec}”</div>
              <div style={{ fontSize: 11, color: T.terra, fontWeight: 600, marginTop: 4 }}>tocar para editar</div>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} style={{ background: 'transparent', color: T.brown, border: `1px dashed ${T.hairline}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, fontFamily: T.serif, fontStyle: 'italic', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              Escrever uma recomendação…
            </button>
          )}
        </div>

        {/* cartão compartilhável */}
        {(rating > 0 || rec.trim()) && (
          <button onClick={abrirCartao} style={{ marginTop: 16, width: '100%', padding: '12px', borderRadius: 10, background: T.ink, color: T.cream, border: 0, cursor: 'pointer', fontFamily: T.sans, fontSize: 13, fontWeight: 600, letterSpacing: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Icon name="share" size={15} color={T.cream}/> Criar cartão de recomendação
          </button>
        )}
      </div>
    </>
  );
}

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

// EcosPanel — ressonâncias do livro. No exemplo, mostra a curadoria (PONTES).
// Nos livros reais, gera com IA (função 'ecos' no Supabase) e guarda no livro.
function EcosPanel({ book, isDemo, onNav = () => {} }) {
  const b = book || {};
  const seed = isDemo ? (window.PONTES || []) : (b.ecos || []);
  const [ecos, setEcos] = React.useState(seed);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);

  const gerar = async () => {
    const cloud = window.MGCloud;
    if (!cloud || !cloud.available || !cloud.gerarEcos) {
      setErr('A geração de ecos precisa da nuvem. Tente mais tarde.'); return;
    }
    const u = await cloud.currentUser();
    if (!u) { setErr('Para gerar ecos, entre na sua conta em Biblioteca → Sincronização.'); return; }
    setBusy(true); setErr(null);
    const r = await cloud.gerarEcos(b.title, b.author);
    setBusy(false);
    if (r.error) { setErr('Não consegui gerar agora. Tente novamente em instantes.'); return; }
    const novos = r.ecos || [];
    if (!novos.length) { setErr('Nenhum eco veio desta vez. Tente novamente.'); return; }
    setEcos(novos);
    if (typeof MG !== 'undefined' && MG.updateBook) MG.updateBook(b.id, { ecos: novos });
  };

  // ecos CURADOS À MÃO (obras canônicas) — têm prioridade sobre IA e exemplo
  const curados = (typeof curatedEcos === 'function') ? curatedEcos(b) : null;
  if (curados && curados.length) {
    return (
      <div>
        <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.terra, fontWeight: 700, marginBottom: 4 }}>✦ Curadoria do clube</div>
        <div style={{ fontSize: 11, color: T.muted, fontStyle: 'italic', fontFamily: T.serif, marginBottom: 12 }}>
          Ecos escolhidos à mão para esta obra.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {curados.map((p, i) => <PonteCard key={p.id || i} p={p} book={b}/>)}
        </div>
      </div>
    );
  }

  // exemplo (Meditações): curadoria fixa
  if (isDemo) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ecos.slice(0, 6).map((p, i) => <PonteCard key={p.id || i} p={p} book={b}/>)}
      </div>
    );
  }

  // livro real, ainda sem ecos → convite para gerar
  if (!ecos.length) {
    return (
      <div style={{ textAlign: 'center', padding: '28px 16px' }}>
        <Icon name="sparkle" size={26} color={T.ochre}/>
        <div style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.5, color: T.brown, margin: '12px 0 18px' }}>
          Descubra os <em>ecos</em> de <strong>{b.title}</strong> — outros livros, filmes, música,
          arte e história que ressoam com ele.
        </div>
        <button onClick={gerar} disabled={busy} style={{
          background: T.ink, color: T.cream, border: 0, borderRadius: 999,
          padding: '12px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: T.sans, letterSpacing: 0.3, opacity: busy ? 0.7 : 1,
        }}>{busy ? 'Buscando ressonâncias…' : '✨ Gerar ecos'}</button>
        {err && <div style={{ marginTop: 14, fontSize: 12, color: '#8E3E2A', lineHeight: 1.4 }}>{err}</div>}
      </div>
    );
  }

  // livro real com ecos
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: T.muted, fontStyle: 'italic', fontFamily: T.serif }}>
          {ecos.length} ecos deste livro
        </div>
        <button onClick={gerar} disabled={busy} style={{
          background: 'transparent', border: 0, color: T.terra, fontFamily: T.sans,
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>{busy ? '…' : '↻ regenerar'}</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ecos.map((p, i) => <PonteCard key={i} p={p} book={b}/>)}
      </div>
      {err && <div style={{ marginTop: 12, fontSize: 12, color: '#8E3E2A' }}>{err}</div>}
    </div>
  );
}

// Cartão de Ponte (usado no BookDetail / ecos)
function PonteCard({ p, onClick, book }) {
  const [deep, setDeep] = React.useState(p.deep || null);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const podeAprofundar = !!(book && book.title && typeof window !== 'undefined'
    && window.MGCloud && window.MGCloud.available && window.MGCloud.aprofundarEco);
  const aprofundar = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (busy || deep) return;
    const cloud = window.MGCloud;
    const u = cloud.currentUser ? await cloud.currentUser() : null;
    if (!u) { setErr('Para aprofundar, entre na sua conta em Biblioteca → Sincronização.'); return; }
    setBusy(true); setErr(null);
    const r = await cloud.aprofundarEco(book, p);
    setBusy(false);
    if (r.error || !r.deep) { setErr('Não consegui aprofundar agora. Tente de novo.'); return; }
    setDeep(r.deep);
  };
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
      {deep && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.hairline}`,
          fontFamily: T.serif, fontSize: 12.5, lineHeight: 1.5, color: T.ink }}>
          {deep}
        </div>
      )}
      {!deep && podeAprofundar && (
        <button type="button" onClick={aprofundar} disabled={busy} style={{
          marginTop: 10, background: 'transparent', border: 0, color: T.terra,
          fontFamily: T.sans, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          cursor: 'pointer', padding: 0, WebkitAppearance: 'none', appearance: 'none', WebkitTapHighlightColor: 'transparent',
        }}>{busy ? 'aprofundando…' : 'aprofundar →'}</button>
      )}
      {err && <div style={{ marginTop: 8, fontSize: 11, color: '#8E3E2A', lineHeight: 1.4 }}>{err}</div>}
    </div>
  );
}

// PontesEstante — livros que conversam com o livro aberto.
// Curadas (pares canônicos) + mesmo autor; cada uma diz POR QUE conversam.
// Ponte com livro DA estante → tocar abre o livro. Ponte com livro FORA da
// estante → vira convite de leitura com "+ quero ler" (adiciona como tbr) —
// estantes crescem devagar, a ponte chega antes do livro.
function PontesEstante({ book }) {
  const b = book || {};
  const pontes = (typeof pontesNaEstante === 'function')
    ? pontesNaEstante(b, (typeof window !== 'undefined' && window.BOOKS) || [])
    : [];
  if (!pontes.length) return null;
  const quererLer = (e, s) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof MG === 'undefined' || !MG.addBook) return;
    const id = (s.title || 'livro').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) + '-' + Date.now().toString(36).slice(-4);
    MG.addBook({ id, title: s.title, author: s.author, pages: null, pct: 0, currentPage: 0, status: 'tbr' });
  };
  return (
    <>
      <SectionTitle>Pontes</SectionTitle>
      <div style={{ fontSize: 11, color: T.muted, fontStyle: 'italic', fontFamily: T.serif, marginTop: -6, marginBottom: 12 }}>
        Livros que conversam com este.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
        {pontes.map((p, i) => {
          const ehSugestao = p.kind === 'sugestao';
          const alvo = ehSugestao ? p.suggest : p.book;
          return (
            <div key={(p.book && p.book.id) || (alvo && alvo.title) || i}
                 onClick={ehSugestao ? undefined : () => { if (typeof window.__openBook === 'function') window.__openBook(p.book); }}
                 style={{
                   display: 'flex', gap: 12, alignItems: 'flex-start', background: T.cream,
                   borderRadius: 12, padding: '12px 14px', border: `1px solid ${T.hairline}`,
                   cursor: ehSugestao ? 'default' : 'pointer', position: 'relative', overflow: 'hidden',
                 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: ehSugestao ? T.ochre : T.terra }}/>
              <div style={{ flexShrink: 0 }}>
                <BookCover title={alvo.title} author={alvo.author} tone={alvo.tone} cover={alvo.cover} isbn={alvo.isbn} w={46}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, letterSpacing: 1.3, textTransform: 'uppercase', color: ehSugestao ? T.ochre : T.terra, fontWeight: 700, marginBottom: 3 }}>{p.motif}</div>
                <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500, lineHeight: 1.15 }}>{alvo.title}</div>
                <div style={{ fontSize: 10, color: T.muted, fontStyle: 'italic', marginBottom: p.why ? 5 : 0 }}>{alvo.author}</div>
                {p.why && <div style={{ fontSize: 12, color: T.brown, lineHeight: 1.45, fontFamily: T.serif }}>{p.why}</div>}
                {ehSugestao && (
                  <button type="button" onClick={(e) => quererLer(e, alvo)} style={{
                    marginTop: 8, background: 'transparent', border: `1px solid ${T.hairline}`,
                    borderRadius: 999, padding: '5px 12px', color: T.brown, cursor: 'pointer',
                    fontFamily: T.sans, fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
                    WebkitAppearance: 'none', appearance: 'none', WebkitTapHighlightColor: 'transparent',
                  }}>＋ quero ler</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
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

// monta um link mailto: com uma ou várias notas — para enviar/arquivar por e-mail
// ─────────────────────────────────────────────────────────────
// Taxonomia da margem — vocabulário ÚNICO de tipo+cor de nota.
// Tudo (editor, cartão, exportação) lê daqui. id estável.
// ─────────────────────────────────────────────────────────────
const NOTE_KINDS = [
  { id: 'citação',     label: 'Citação',     color: '#5E6B3E', hint: 'Uma passagem transcrita', italic: true },
  { id: 'ressonância', label: 'Ressonância', color: '#B0533A', hint: 'O que ecoou em você' },
  { id: 'dúvida',      label: 'Dúvida',      color: '#C48A2C', hint: 'Uma pergunta em aberto' },
  { id: 'conexão',     label: 'Conexão',     color: '#2E3E55', hint: 'Uma ponte com outra obra ou ideia' },
];
// notas antigas → novo vocabulário (não reescreve os dados; só traduz na exibição)
const NOTE_KIND_ALIAS = {
  'reflexão': 'ressonância', 'marginal': 'ressonância', 'resumo': 'citação',
  'pergunta': 'dúvida', 'mapa': 'conexão',
};
function noteKind(id) {
  const key = NOTE_KIND_ALIAS[id] || id;
  return NOTE_KINDS.find(k => k.id === key) || null;
}
function noteKindColor(id) {
  const k = noteKind(id);
  return k ? k.color : '#9A8E7B'; // neutro p/ tipo desconhecido (nunca fica sem cor)
}
function noteKindLabel(id) {
  const k = noteKind(id);
  return k ? k.label : (id || 'Nota');
}

function buildNotesMailto(notes, book) {
  const list = Array.isArray(notes) ? notes : [notes];
  const title = (book && book.title) || 'leitura';
  const author = (book && book.author) || '';
  const subject = list.length > 1
    ? `Marginália — minhas notas de ${title} (${list.length})`
    : `Marginália — nota sobre ${title}`;
  const blocks = list.map(n => {
    const meta = [];
    if (n.kind) meta.push(noteKindLabel(n.kind));
    if (n.page) meta.push('pág ' + n.page);
    return `"${(n.text || '').trim()}"` + (meta.length ? `\n  ${meta.join(' · ')}` : '');
  });
  const header = list.length > 1 ? `Minhas notas de "${title}"${author ? ' — ' + author : ''}\n\n` : '';
  const footer = `\n\n— ${title}${author ? ', ' + author : ''}\nAnotado no Marginália · Clube de Leitura`;
  const body = header + blocks.join('\n\n———\n\n') + footer;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Monta as notas em Markdown (pronto para colar/importar no Obsidian),
// agrupadas por livro, cada nota como blockquote com sua margem (cor/cap./pág./data).
function buildNotesMarkdown(notes, books) {
  const list = (Array.isArray(notes) ? notes : [notes]).filter(Boolean);
  const byId = {};
  (books || []).forEach(b => { if (b && b.id) byId[b.id] = b; });
  const grupos = {};
  list.forEach(n => {
    const key = n.bookId || n.book || '__sem-livro';
    (grupos[key] = grupos[key] || []).push(n);
  });
  const data = new Date().toISOString().slice(0, 10);
  let out = `# Notas de leitura — Marginália\n\n*Exportado em ${data}*\n`;
  Object.keys(grupos).forEach(key => {
    const arr = grupos[key];
    const bk = byId[key];
    const title = (bk && bk.title) || arr[0].book || 'Sem título';
    const author = (bk && bk.author) || '';
    out += `\n## ${title}${author ? ' — ' + author : ''}\n`;
    arr.forEach(n => {
      const meta = [];
      if (n.kind) meta.push(noteKindLabel(n.kind));
      if (n.chapter) meta.push(n.chapter);
      if (n.page) meta.push('pág. ' + n.page);
      if (n.date) meta.push(n.date);
      const body = (n.text || '').trim().replace(/\n/g, '\n> ');
      out += `\n> ${body}\n`;
      if (meta.length) out += `>\n> — *${meta.join(' · ')}*\n`;
    });
  });
  return out;
}

function NoteCard({ n, onClick }) {
  const kindColor = noteKindColor(n.kind);
  const kindLabel = noteKindLabel(n.kind);
  const handleShare = (e) => {
    e.stopPropagation();
    if (typeof window.__shareNote === 'function') {
      // procura o livro pelo título da nota; fallback: BOOK_CURRENT
      const matched = (window.BOOKS || []).find(b => (n.bookId && b.id === n.bookId) || b.title === n.book) || BOOK_CURRENT;
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
          {kindLabel}{n.chapter ? ' · ' + n.chapter : ''}
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
function ScreenNoteEditor({ onNav = () => {} }) {
  // se veio de tocar numa nota, edita ela; senão, é nota nova
  const editing = (typeof window !== 'undefined') ? window.__editingNote : null;
  const initialKind = editing
    ? ((typeof noteKind === 'function' && noteKind(editing.kind) && noteKind(editing.kind).id) || editing.kind || 'ressonância')
    : 'ressonância';
  const [kind, setKind] = React.useState(initialKind);
  const [text, setText] = React.useState(editing ? (editing.text || '') : '');
  const [saved, setSaved] = React.useState(false);
  // o livro REAL ao qual a nota pertence (não o exemplo)
  const cur = window.__viewBook || (typeof currentBook === 'function' ? currentBook() : BOOK_CURRENT) || {};
  const kinds = NOTE_KINDS;
  const kindInfo = noteKind(kind);

  const fechar = () => { if (typeof window !== 'undefined') window.__editingNote = null; onNav('book'); };

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed) { fechar(); return; }
    if (typeof MG !== 'undefined') {
      if (editing && editing.id && MG.updateNote) {
        MG.updateNote(editing.id, { kind, text: trimmed });
      } else if (MG.addNote) {
        MG.addNote({
          bookId: cur.id,
          book: cur.title,
          page: cur.currentPage || 0,
          chapter: cur.chapter || '',
          kind,
          text: trimmed,
        });
      }
    }
    if (typeof window !== 'undefined') window.__editingNote = null;
    setSaved(true);
    setTimeout(() => onNav('book'), 400);
  };

  const apagar = () => {
    if (!editing || !editing.id) return;
    if (typeof window !== 'undefined' && window.confirm && !window.confirm('Apagar esta nota? Não dá para desfazer.')) return;
    if (typeof MG !== 'undefined' && MG.removeNote) MG.removeNote(editing.id);
    if (typeof window !== 'undefined') window.__editingNote = null;
    onNav('book');
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
        <button onClick={fechar} style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          fontSize: 14, color: T.brown,
        }}>Cancelar</button>
        <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500 }}>
          {saved ? 'Salvo na margem' : (editing ? 'Editar nota' : 'Nova nota')}
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
          {kinds.map(k => {
            const on = kind === k.id;
            return (
              <button key={k.id} onClick={() => setKind(k.id)} style={{
                padding: '7px 12px', borderRadius: 999,
                background: on ? k.color : 'transparent',
                color: on ? T.cream : T.ink,
                border: `1px solid ${on ? k.color : T.hairline}`,
                fontFamily: T.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: on ? T.cream : k.color,
                }}/>
                {k.label}
              </button>
            );
          })}
        </div>
        {kindInfo && (
          <div style={{ fontSize: 11, color: T.muted, fontFamily: T.serif, fontStyle: 'italic', marginTop: 8 }}>
            {kindInfo.hint}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 20px', borderBottom: `1px solid ${T.hairline}`, display: 'flex', gap: 10, alignItems: 'center' }}>
        <BookCover title={cur.title} author={cur.author} tone={cur.tone} cover={cur.cover} isbn={cur.isbn} w={36}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: T.serif, fontSize: 13, fontWeight: 500, overflowWrap: 'anywhere' }}>{cur.title || 'Sua leitura'}</div>
          <div style={{ fontSize: 10, color: T.muted }}>{cur.chapter ? cur.chapter + ' · ' : ''}{cur.currentPage ? 'pág ' + cur.currentPage : (cur.author || '')}</div>
        </div>
        <Icon name="chevron" size={16} color={T.muted}/>
      </div>

      <div style={{ flex: 1, padding: '20px', position: 'relative' }}>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder={kind === 'citação' ? 'Transcrever a passagem…' : 'Escreva na margem…'}
          style={{
            width: '100%', height: '100%', border: 0, outline: 0,
            background: 'transparent', resize: 'none',
            fontFamily: T.serif,
            fontSize: 17, lineHeight: 1.5, color: T.ink,
            fontStyle: (kindInfo && kindInfo.italic) ? 'italic' : 'normal',
          }}/>
      </div>

      {editing && (
        <div style={{ padding: '0 20px 4px' }}>
          <button onClick={apagar} style={{
            background: 'transparent', border: `1px solid ${T.hairline}`, color: '#8E3E2A',
            borderRadius: 10, padding: '9px 14px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: T.sans,
          }}>Apagar nota</button>
        </div>
      )}

      <div style={{
        padding: '12px 20px 16px', borderTop: `1px solid ${T.hairline}`,
        background: T.cream, fontSize: 11, color: T.muted,
        fontFamily: T.serif, fontStyle: 'italic', lineHeight: 1.45,
      }}>
        Esta nota fica na sua margem, privada. Para dividir com um círculo, use
        “Compartilhar uma nota de leitura” no mural do círculo.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Themes map — all study themes with book lineage
// ─────────────────────────────────────────────────────────────
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

function ScreenAguardandoApp() {
  const cloud = (typeof window !== 'undefined') ? window.MGCloud : null;
  const [checking, setChecking] = React.useState(false);

  const finalizar = async () => {
    // aprovada: se veio de um convite, entra no círculo; depois libera o app
    const jc = (typeof window !== 'undefined') ? window.__pendingJoin : null;
    if (jc && cloud && cloud.groups) {
      window.__pendingJoin = null;
      try {
        const jr = await cloud.groups.join(jc);
        if (jr && !jr.error && jr.data && window.__openGrupo) {
          if (window.__rerender) window.__rerender();
          setTimeout(() => window.__openGrupo(jr.data), 60);
          return;
        }
      } catch (e) { /* segue */ }
    }
    if (window.__rerender) window.__rerender();
  };

  React.useEffect(() => {
    let alive = true;
    const id = setInterval(async () => {
      if (!cloud || !cloud.refreshAppStatus) return;
      const s = await cloud.refreshAppStatus();
      if (alive && s && s !== 'pending') finalizar();
    }, 6000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const verificar = async () => {
    setChecking(true);
    const s = (cloud && cloud.refreshAppStatus) ? await cloud.refreshAppStatus() : null;
    setChecking(false);
    if (s && s !== 'pending') finalizar(); else if (window.__rerender) window.__rerender();
  };
  const sair = async () => { if (cloud && cloud.signOut) await cloud.signOut(); if (window.__rerender) window.__rerender(); };

  return (
    <div style={{ width: '100%', height: '100%', background: T.bone, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center', fontFamily: T.sans, color: T.ink }}>
      <div style={{ marginBottom: 18 }}>{typeof BrandMark !== 'undefined' ? <BrandMark size={52} opacity={0.85}/> : null}</div>
      <div style={{ fontFamily: T.serif, fontSize: 25, fontWeight: 500, letterSpacing: -0.4, marginBottom: 12 }}>Quase lá!</div>
      <div style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.5, color: T.brown, maxWidth: 300, marginBottom: 8 }}>
        Seu acesso à Marginália está <strong>aguardando aprovação</strong> da curadora. Assim que ela liberar, o app abre sozinho.
      </div>
      <div style={{ fontSize: 12, color: T.muted, fontFamily: T.serif, fontStyle: 'italic', marginBottom: 26 }}>Pode fechar e voltar depois — seu lugar está guardado.</div>
      <button onClick={verificar} disabled={checking} style={{ padding: '12px 22px', borderRadius: 10, border: 0, background: T.ink, color: T.cream, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 12, opacity: checking ? 0.6 : 1 }}>{checking ? 'verificando…' : 'Já fui aprovada? Verificar'}</button>
      <button onClick={sair} style={{ background: 'transparent', border: 0, color: T.muted, fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>sair</button>
    </div>
  );
}

// Painel da administradora — aprova/recusa quem entrou no app (porta única)
function AppAdminPanel() {
  const cloud = (typeof window !== 'undefined') ? window.MGCloud : null;
  const [pending, setPending] = React.useState([]);
  const [grupos, setGrupos] = React.useState([]);
  const [copied, setCopied] = React.useState(false);
  const [curPending, setCurPending] = React.useState([]);
  const load = async () => {
    if (cloud && cloud.appPending) setPending(await cloud.appPending());
    if (cloud && cloud.groups) setGrupos(await cloud.groups.list());
    if (cloud && cloud.curadoria) setCurPending(await cloud.curadoria.pending());
  };
  React.useEffect(() => { load(); }, []);
  if (!cloud || !cloud.available || !(typeof window !== 'undefined' && window.__isAppAdmin)) return null;

  const inviteBase = window.location.origin + window.location.pathname.replace(/(index|Marginalia)\.html$/, '');
  const g0 = grupos[0];
  const inviteLink = inviteBase + (g0 && g0.invite_code ? '?join=' + g0.invite_code : '');
  const copiar = () => { if (navigator.clipboard) navigator.clipboard.writeText(inviteLink).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }); };

  const nome = (m) => (m.name && m.name.trim()) || ((m.email || '').split('@')[0]) || 'Leitor(a)';
  const ini = (m) => { const n = nome(m).replace(/[^A-Za-zÀ-ÿ ]/g, ' ').trim().split(/\s+/).filter(Boolean); return ((n.length >= 2 ? n[0][0] + n[n.length - 1][0] : nome(m).slice(0, 2)) || '?').toUpperCase(); };
  const aprovar = async (id) => { setPending((p) => p.filter((x) => x.user_id !== id)); await cloud.appApprove(id); await load(); };
  const recusar = async (id) => { setPending((p) => p.filter((x) => x.user_id !== id)); await cloud.appReject(id); await load(); };

  // curadoria do clube — aprovação de conteúdo editorial (rascunho → validado)
  const CUR_BLOCKS = { radar: 'Radar', curadoria: 'Curadoria', para_guardar: 'Para guardar', ecos: 'Ecos' };
  const curPreview = (it) => {
    const d = it.data || {};
    if (it.block === 'para_guardar') return '“' + (d.pt || '') + '” — ' + [d.autor, d.obra].filter(Boolean).join(', ');
    if (it.block === 'radar') return d.headline_pt || '(sem título)';
    if (it.block === 'curadoria') return d.title_pt || '(sem título)';
    if (it.block === 'ecos') { const bk = it.book_key ? it.book_key.replace(/\b\w/g, (c) => c.toUpperCase()) : ''; return (bk ? bk + ' · ' : '') + (d.title || '') + (d.author ? ' (' + d.author + ')' : ''); }
    return '(item)';
  };
  const validarCur = async (id) => { setCurPending((p) => p.filter((x) => x.id !== id)); await cloud.curadoria.validate(id); };
  const descartarCur = async (id) => { setCurPending((p) => p.filter((x) => x.id !== id)); await cloud.curadoria.discard(id); };

  return (
    <div style={{ marginBottom: 22, borderBottom: `1px solid ${T.hairline}`, paddingBottom: 20 }}>
      {/* convidar para o clube — link do app (porta única) */}
      <div style={{ background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.terra, fontWeight: 700, marginBottom: 6 }}>Convidar para o clube</div>
        <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, lineHeight: 1.45, marginBottom: 10 }}>
          Mande este link. Quem abrir entra no app e <strong>aguarda a sua aprovação</strong> (aqui em cima). Depois de aprovada, a pessoa já participa dos círculos e maratonas. Pode reencaminhar à vontade — ninguém entra sem o seu ok.
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, fontFamily: T.mono, fontSize: 11, color: T.ink, background: T.bone, border: `1px solid ${T.hairline}`, borderRadius: 8, padding: '9px 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inviteLink}</div>
          <button onClick={copiar} style={{ padding: '9px 14px', borderRadius: 8, border: 0, background: T.ink, color: T.cream, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{copied ? 'Copiado!' : 'Copiar'}</button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.terra, fontWeight: 700 }}>Administradora · pessoas aguardando</div>
        <button onClick={load} style={{ background: 'transparent', border: 0, color: T.terra, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>↻ atualizar</button>
      </div>
      {pending.length === 0 ? (
        <div style={{ fontSize: 12, color: T.muted, fontFamily: T.serif, fontStyle: 'italic' }}>Ninguém aguardando aprovação no momento. Quem abrir o app aparece aqui.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pending.map((m) => (
            <div key={m.user_id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.ink, color: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 11, flexShrink: 0 }}>{ini(m)}</div>
              <div style={{ flex: 1, fontSize: 13, color: T.ink, fontFamily: T.serif, overflowWrap: 'anywhere' }}>{nome(m)}{m.email ? <span style={{ fontSize: 11, color: T.muted }}> · {m.email}</span> : null}</div>
              <button onClick={() => aprovar(m.user_id)} style={{ padding: '6px 12px', borderRadius: 8, border: 0, background: T.olive, color: T.cream, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Aprovar</button>
              <button onClick={() => recusar(m.user_id)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${T.hairline}`, background: 'transparent', color: T.brown, fontSize: 12, cursor: 'pointer' }}>Recusar</button>
            </div>
          ))}
        </div>
      )}

      {/* curadoria do clube — conteúdo editorial a aprovar (rotina semanal) */}
      <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${T.hairline}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.terra, fontWeight: 700 }}>Curadoria do clube · a aprovar</div>
          <button onClick={load} style={{ background: 'transparent', border: 0, color: T.terra, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>↻ atualizar</button>
        </div>
        <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, lineHeight: 1.45, marginBottom: 10 }}>
          Conteúdo novo (Radar, Curadoria, Para guardar, Ecos) proposto pela rotina. <strong>Validar</strong> publica para todos; <strong>Descartar</strong> remove.
        </div>
        {curPending.length === 0 ? (
          <div style={{ fontSize: 12, color: T.muted, fontFamily: T.serif, fontStyle: 'italic' }}>Nada para aprovar agora. Itens novos da rotina aparecem aqui.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {curPending.map((it) => (
              <div key={it.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.terra, fontWeight: 700, marginBottom: 3 }}>{CUR_BLOCKS[it.block] || it.block}</div>
                  <div style={{ fontSize: 12.5, color: T.ink, fontFamily: T.serif, lineHeight: 1.4, overflowWrap: 'anywhere' }}>{curPreview(it)}</div>
                </div>
                <button onClick={() => validarCur(it.id)} style={{ padding: '6px 12px', borderRadius: 8, border: 0, background: T.olive, color: T.cream, fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>Validar</button>
                <button onClick={() => descartarCur(it.id)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${T.hairline}`, background: 'transparent', color: T.brown, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>Descartar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [memberCounts, setMemberCounts] = React.useState({});
  const [openList, setOpenList] = React.useState([]); // círculos abertos p/ entrar

  const entrarAberto = async (g) => {
    setBusy(true); setMsg(null);
    const { data, error } = await cloud.groups.joinOpenGroup(g.id);
    setBusy(false);
    if (error) { setMsg('Não consegui entrar agora. Tente de novo.'); return; }
    await refresh();
    if (data && window.__openGrupo) window.__openGrupo(data);
  };

  const refresh = async () => {
    if (!cloud || !cloud.available) { setLoading(false); return; }
    const u = await cloud.currentUser();
    setUser(u || null);
    if (u) {
      const gs = await cloud.groups.list();
      setGroups(gs);
      const counts = {};
      for (const g of gs) {
        try { counts[g.id] = (await cloud.groups.members(g.id)).length; } catch { counts[g.id] = null; }
      }
      setMemberCounts(counts);
      // círculos abertos que ainda não sou membro
      try {
        const og = await cloud.groups.openGroups();
        const meus = new Set(gs.map((g) => g.id));
        setOpenList((og || []).filter((g) => !meus.has(g.id)));
      } catch (e) { setOpenList([]); }
    }
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
    // círculos são livres para quem já é aprovado no app — entra direto
    const { data, error } = await cloud.groups.join(code);
    setBusy(false);
    if (error) { setMsg('Código inválido. Confira e tente de novo.'); return; }
    setCode(''); setPane(null); await refresh();
    if (data && window.__openGrupo) window.__openGrupo(data);
  };

  const [guestName, setGuestName] = React.useState('');
  const pendingInvite = (typeof window !== 'undefined') && !!window.__pendingJoin;
  const entrarConvidado = async () => {
    if (!guestName.trim()) { setMsg('Digite um nome para entrar.'); return; }
    const jcode = window.__pendingJoin || (code && code.trim()) || null;
    setBusy(true); setMsg(null);
    const r = await cloud.signInGuest(guestName);
    if (r.error) { setBusy(false); setMsg('Não consegui entrar: ' + r.error.message); return; }
    // porta do app: registra e checa aprovação
    const st = (cloud.refreshAppStatus) ? await cloud.refreshAppStatus() : 'approved';
    setBusy(false);
    if (st === 'pending') {
      if (jcode) window.__pendingJoin = jcode; // guarda o círculo para entrar após aprovação
      if (window.__rerender) window.__rerender(); // a tela de espera assume
      return;
    }
    // aprovado(a) → entra no círculo direto
    window.__pendingJoin = null;
    if (jcode) {
      const jr = await cloud.groups.join(jcode, guestName);
      await refresh();
      if (jr && !jr.error && jr.data && window.__openGrupo) { window.__openGrupo(jr.data); return; }
    }
    await refresh();
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
          {pendingInvite && (
            <div style={{ fontFamily: T.serif, fontSize: 15, color: T.brown, fontStyle: 'italic', marginBottom: 14, lineHeight: 1.5 }}>
              Você foi convidada(o) para um círculo de leitura. Entre com um nome para participar:
            </div>
          )}
          <div style={{ background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.terra, fontWeight: 700, marginBottom: 8 }}>
              Entrar rápido
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={guestName} onChange={e => setGuestName(e.target.value)}
                placeholder="seu nome (ex.: Ana)" onKeyDown={e => e.key === 'Enter' && entrarConvidado()}
                autoCapitalize="words" style={inputStyle}/>
              <button onClick={entrarConvidado} disabled={busy} style={btnDark}>{busy ? '…' : 'Entrar'}</button>
            </div>
            <div style={{ marginTop: 10, padding: '9px 11px', background: '#F6EFE0',
                          border: `1px solid ${T.hairline}`, borderRadius: 8, fontSize: 11,
                          color: T.brown, fontFamily: T.serif, lineHeight: 1.45 }}>
              ⚠️ Sem e-mail, sem senha — só um nome. É uma <strong>conta temporária</strong>,
              que vive só neste aparelho: se você limpar o navegador ou trocar de celular,
              os livros e anotações se perdem. Para guardar de verdade, prefira <strong>entrar com e-mail</strong> abaixo.
            </div>
          </div>
          <div style={{ textAlign: 'center', margin: '14px 0 0' }}>
            <button onClick={() => onNav('library')} style={{ background: 'transparent', border: 0, color: T.brown, fontFamily: T.sans, fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
              ou entre com seu e-mail (conta permanente)
            </button>
          </div>
          {msg && <div style={{ marginTop: 12, padding: '10px 12px', background: '#F4D9D0', borderRadius: 10, fontSize: 12, color: '#8E3E2A' }}>{msg}</div>}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 500, lineHeight: 1.15 }}>{g.name}</div>
                  {memberCounts[g.id] != null && (
                    <div style={{ fontSize: 11, color: T.terra, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {memberCounts[g.id]} {memberCounts[g.id] === 1 ? 'membro' : 'membros'}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4, fontFamily: T.mono, letterSpacing: 0.3 }}>
                  convite: {g.invite_code}
                </div>
              </div>
            ))}
          </div>

          {/* círculos abertos para entrar (desafios disponibilizados por outras pessoas) */}
          {openList.length > 0 && (
            <div style={{ padding: '22px 24px 0' }}>
              <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 4 }}>
                Abertos para entrar · {openList.length}
              </div>
              <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, fontStyle: 'italic', marginBottom: 12, lineHeight: 1.45 }}>
                Desafios disponibilizados pelo clube. Entre e leiam juntos.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {openList.map((g) => (
                  <div key={g.id} style={{
                    background: T.cream, borderRadius: 14, padding: '14px 16px',
                    border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#E5E5D2', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="share" size={16} color={T.olive}/></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: T.serif, fontSize: 16, fontWeight: 500, lineHeight: 1.15, overflowWrap: 'anywhere' }}>{g.name}</div>
                      <div style={{ fontSize: 10, color: T.muted, fontFamily: T.sans, letterSpacing: 0.3, marginTop: 2 }}>círculo aberto</div>
                    </div>
                    <button onClick={() => entrarAberto(g)} disabled={busy} style={{
                      padding: '8px 16px', borderRadius: 999, border: 0, background: T.olive, color: T.cream,
                      fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: busy ? 'wait' : 'pointer', flexShrink: 0, opacity: busy ? 0.6 : 1,
                    }}>Entrar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

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

// Cartão de desafio curado: 'list' (lista da dona, cada um marca ✓) ou 'theme' (cada um lança os seus)
function ChallengeCardCloud({ ch, members, me, labelFor, onChanged }) {
  const cloud = (typeof window !== 'undefined') ? window.MGCloud : null;
  const [books, setBooks] = React.useState([]);
  const [dones, setDones] = React.useState([]);
  const [adding, setAdding] = React.useState(false);
  const [nt, setNt] = React.useState('');
  const [na, setNa] = React.useState('');
  const [ny, setNy] = React.useState('');
  const [nc, setNc] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const isOwner = !!(me && ch.created_by === me.id);
  const isList = ch.kind === 'list';

  const reload = async () => {
    if (!cloud) return;
    setBooks(await cloud.groups.challengeBooks(ch.id));
    setDones(await cloud.groups.challengeDones(ch.id));
  };
  React.useEffect(() => { reload(); }, [ch.id]);

  const addBook = async () => {
    if (!nt.trim() || !na.trim()) return;
    setBusy(true);
    const r = await cloud.groups.addChallengeBook(ch.id, {
      title: nt.trim(), author: na.trim(),
      year: ny ? parseInt(ny) : null, country: nc.trim() || null, position: books.length,
    });
    setBusy(false);
    if (!r || !r.error) { setNt(''); setNa(''); setNy(''); setNc(''); setAdding(false); await reload(); }
  };
  const removeBook = async (id) => { if (!window.confirm('Remover este livro do desafio?')) return; await cloud.groups.removeChallengeBook(id); await reload(); };
  const toggleDone = async (bookId, done) => { await cloud.groups.toggleBookDone(bookId, done); await reload(); };
  const iDid = (bookId) => !!(me && dones.some((d) => d.book_id === bookId && d.user_id === me.id));

  const perMember = members.map((m) => ({
    id: m.user_id, label: labelFor(m.user_id, m.email),
    n: isList ? dones.filter((d) => d.user_id === m.user_id).length
              : books.filter((b) => b.created_by === m.user_id).length,
  })).filter((p) => p.n > 0).sort((a, b) => b.n - a.n);

  const target = isList ? books.length : (ch.target || 0);
  const myTotal = isList ? (me ? dones.filter((d) => d.user_id === me.id).length : 0)
                         : (me ? books.filter((b) => b.created_by === me.id).length : 0);
  const myPct = target ? Math.min(100, Math.round((myTotal / target) * 100)) : 0;
  const myBooks = isList ? books : books.filter((b) => me && b.created_by === me.id);
  const canAdd = (isList && isOwner) || !isList;

  const ciStyle = { width: '100%', padding: '8px 10px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, color: T.ink, fontFamily: T.sans, fontSize: 13, marginBottom: 6, outline: 'none' };

  return (
    <div style={{ background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <div style={{ fontFamily: T.serif, fontSize: 17, fontWeight: 500, overflowWrap: 'anywhere' }}>{ch.title}</div>
          <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.olive, fontWeight: 700, marginTop: 2 }}>{isList ? 'Lista curada' : 'Tema aberto'}</div>
        </div>
        {isOwner && <button onClick={() => { if (window.confirm('Apagar este desafio e todos os seus livros?')) cloud.groups.deleteChallenge(ch.id).then(onChanged); }} style={{ background: 'transparent', border: 0, color: T.muted, fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>apagar</button>}
      </div>
      {ch.description && <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, fontStyle: 'italic', marginTop: 4, overflowWrap: 'anywhere' }}>{!isList ? 'Critério: ' : ''}{ch.description}</div>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
        <div style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 500, letterSpacing: -0.5 }}>{myTotal}<span style={{ fontSize: 12, color: T.muted }}> / {target || '—'}</span></div>
        <div style={{ flex: 1 }}><LinearProgress pct={myPct} height={5} color={T.terra}/></div>
        <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>{isList ? 'que li' : 'meus'}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
        {myBooks.length === 0 && (
          <div style={{ fontSize: 12, color: T.muted, fontStyle: 'italic', fontFamily: T.serif, marginBottom: 6 }}>
            {isList ? (isOwner ? 'Adicione os livros da lista abaixo.' : 'A dona ainda não lançou os livros.') : 'Você ainda não lançou livros. Adicione os que leu.'}
          </div>
        )}
        {myBooks.map((b) => (
          <div key={b.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 0', borderTop: `1px solid ${T.hairline}` }}>
            {isList && (
              <button onClick={() => toggleDone(b.id, !iDid(b.id))} title="marcar que li" style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, cursor: 'pointer', border: `1px solid ${iDid(b.id) ? T.terra : T.hairline}`, background: iDid(b.id) ? T.terra : 'transparent', color: T.cream, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{iDid(b.id) ? '✓' : ''}</button>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.serif, fontSize: 14, color: T.ink, overflowWrap: 'anywhere' }}>{b.title}</div>
              <div style={{ fontSize: 11, color: T.muted, fontFamily: T.serif }}>{[b.author, b.year, b.country].filter(Boolean).join(' · ')}</div>
            </div>
            {((isList && isOwner) || (!isList && me && b.created_by === me.id)) && (
              <button onClick={() => removeBook(b.id)} title="remover" style={{ background: 'transparent', border: 0, color: T.muted, fontSize: 16, lineHeight: 1, cursor: 'pointer', flexShrink: 0 }}>×</button>
            )}
          </div>
        ))}
      </div>

      {canAdd && (adding ? (
        <div style={{ background: T.bone, border: `1px solid ${T.hairline}`, borderRadius: 10, padding: 10, marginBottom: 4 }}>
          <input value={nt} onChange={(e) => setNt(e.target.value)} placeholder="Título *" autoFocus style={ciStyle}/>
          <input value={na} onChange={(e) => setNa(e.target.value)} placeholder="Autor *" style={ciStyle}/>
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={ny} onChange={(e) => setNy(e.target.value)} placeholder="Ano" inputMode="numeric" style={{ ...ciStyle, width: 90 }}/>
            <input value={nc} onChange={(e) => setNc(e.target.value)} placeholder="País (opcional)" style={ciStyle}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 2 }}>
            <button onClick={() => setAdding(false)} style={{ background: 'transparent', border: 0, color: T.brown, fontSize: 12, cursor: 'pointer' }}>cancelar</button>
            <button onClick={addBook} disabled={busy || !nt.trim() || !na.trim()} style={{ padding: '7px 14px', borderRadius: 8, border: 0, background: T.ink, color: T.cream, fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: (busy || !nt.trim() || !na.trim()) ? 0.5 : 1 }}>{busy ? '…' : 'Adicionar'}</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ background: 'transparent', border: `1px dashed ${T.hairline}`, borderRadius: 8, padding: '8px 12px', width: '100%', color: T.terra, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ {isList ? 'adicionar livro à lista' : 'adicionar um livro que li'}</button>
      ))}

      {perMember.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 10, borderTop: `1px solid ${T.hairline}`, paddingTop: 8 }}>
          <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 2 }}>Placar</div>
          {perMember.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12, color: T.brown }}>
              <span style={{ fontFamily: T.serif, overflowWrap: 'anywhere' }}>{p.label}</span>
              <span style={{ fontFamily: T.mono, flexShrink: 0 }}>{p.n}{target ? ' / ' + target : ''}</span>
            </div>
          ))}
        </div>
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
  const [cKind, setCKind] = React.useState('list'); // 'list' (lista curada) | 'theme' (tema aberto)
  const [cDesc, setCDesc] = React.useState(''); // critério/descrição do desafio
  const [copied, setCopied] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  const [msgText, setMsgText] = React.useState('');
  const [notePicker, setNotePicker] = React.useState(false);
  const [me, setMe] = React.useState(null);
  const [pending, setPending] = React.useState([]);

  const myReadCount =((typeof window !== 'undefined' && window.BOOKS) || []).filter((b) => b.status === 'read').length;
  const inviteBase = window.location.origin + window.location.pathname.replace(/(index|Marginalia)\.html$/, '');
  const inviteLink = inviteBase + '?join=' + (grupo.invite_code || '');

  const load = async () => {
    if (!cloud || !cloud.available) return;
    const _u = await cloud.currentUser();
    setMe(_u ? { id: _u.id, name: (_u.user_metadata && _u.user_metadata.name) || '' } : null);
    setMembers(await cloud.groups.members(grupo.id));
    setPending(await cloud.groups.pendingRequests(grupo.id));
    setPosts(await cloud.groups.posts(grupo.id));
    const chs = await cloud.groups.challenges(grupo.id);
    setChallenges(chs);
    const pm = {};
    for (const ch of chs) {
      if (ch.kind && ch.kind !== 'count') continue; // desafios curados cuidam do próprio placar
      await cloud.groups.pushProgress(ch.id, myReadCount); // publica minha contribuição
      pm[ch.id] = await cloud.groups.progress(ch.id);
    }
    setProgressMap(pm);
  };
  React.useEffect(() => { load(); }, []);

  const criarDesafio = async () => {
    if (!cTitle.trim()) return;
    setBusy(true);
    const { error } = await cloud.groups.createChallenge(grupo.id, {
      title: cTitle.trim(),
      kind: cKind,
      type: 'count',
      description: cDesc.trim() || null,
      target: cKind === 'theme' ? (parseInt(cTarget) || 6) : 0, // lista curada: meta = nº de livros
    });
    setBusy(false);
    if (!error) { setCTitle(''); setCDesc(''); setCreating(false); await load(); }
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

  const publicar = async () => {
    if (!msgText.trim()) return;
    setBusy(true);
    const r = await cloud.groups.post(grupo.id, { kind: 'mensagem', body: msgText.trim() });
    setBusy(false);
    if (!r || !r.error) { setMsgText(''); await load(); }
  };
  const compartilharNota = async (n) => {
    setNotePicker(false); setBusy(true);
    const r = await cloud.groups.post(grupo.id, { kind: 'nota', body: n.text || '', book_title: n.book || null });
    setBusy(false);
    if (!r || !r.error) await load();
  };
  const minhasNotas = ((typeof window !== 'undefined' && window.NOTES) || []).filter((n) => n && n.text);

  // nome de exibição: nunca mostra e-mail cru (privacidade) — usa só a parte antes do @
  const displayName = (v) => {
    const s = (v || '').trim();
    if (!s) return 'Membro';
    return s.includes('@') ? s.split('@')[0] : s;
  };
  // rótulo do membro: meu nome salvo; nome de exibição guardado no servidor; ou parte antes do @
  const labelFor = (userId, raw) => {
    if (me && userId === me.id && me.name) return me.name;
    const mm = members.find((x) => x.user_id === userId);
    if (mm && mm.display_name && mm.display_name.trim()) return mm.display_name;
    return displayName(raw);
  };
  const initials = (v) => {
    const parts = displayName(v).replace(/[^A-Za-zÀ-ÿ ]/g, ' ').trim().split(/\s+/).filter(Boolean);
    const s = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]) : displayName(v).slice(0, 2);
    return (s || '?').toUpperCase();
  };

  const isOwner = !!(me && members.some((m) => m.user_id === me.id && m.role === 'owner'));
  const aprovar = async (userId) => { setPending((ps) => ps.filter((p) => p.user_id !== userId)); await cloud.groups.approveRequest(grupo.id, userId); await load(); };
  const recusar = async (userId) => { setPending((ps) => ps.filter((p) => p.user_id !== userId)); await cloud.groups.rejectRequest(grupo.id, userId); await load(); };

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(42,38,32,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 80 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: T.bone, borderRadius: '24px 24px 0 0', padding: '14px 22px 32px', maxHeight: '94%', overflow: 'auto', fontFamily: T.sans, color: T.ink }}>
        <div style={{ width: 36, height: 4, background: T.hairline, borderRadius: 4, margin: '0 auto 16px' }}/>

        <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 4 }}>Círculo de leitura</div>
        <div style={{ fontFamily: T.serif, fontSize: 26, fontWeight: 500, letterSpacing: -0.4, lineHeight: 1.1, marginBottom: 16 }}>{grupo.name}</div>

        {/* convite agora vive na área de administradora (Biblioteca → Sincronização) */}
        {isOwner && (
          <div style={{ fontSize: 11, color: T.muted, fontFamily: T.serif, fontStyle: 'italic', marginBottom: 18, lineHeight: 1.4 }}>
            Para convidar gente, use o link em <strong style={{ color: T.brown }}>Biblioteca → Sincronização → Convidar para o clube</strong> — é onde você aprova e libera o acesso.
          </div>
        )}

        {/* membros */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>Membros · {members.length}</div>
          <button onClick={load} style={{ background: 'transparent', border: 0, color: T.terra, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>↻ atualizar</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {members.map((m) => (
            <div key={m.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: T.ink, color: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 12, flexShrink: 0 }}>{initials(labelFor(m.user_id, m.email))}</div>
              <div style={{ flex: 1, fontSize: 13, color: T.ink, fontFamily: T.serif, overflowWrap: 'anywhere' }}>{labelFor(m.user_id, m.email)}{me && m.user_id === me.id ? ' (você)' : ''}</div>
              {m.role === 'owner' && <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.terra, fontWeight: 700 }}>dona</div>}
            </div>
          ))}
        </div>

        {/* pedidos pendentes — só a dona vê e aprova */}
        {isOwner && pending.length > 0 && (
          <div style={{ background: '#F6EFE0', border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '12px 14px', marginBottom: 22 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: T.terra, fontWeight: 700, marginBottom: 8 }}>Pedidos para entrar · {pending.length}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pending.map((p) => (
                <div key={p.user_id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.ink, color: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 11, flexShrink: 0 }}>{initials(p.requester_name)}</div>
                  <div style={{ flex: 1, fontSize: 13, color: T.ink, fontFamily: T.serif, overflowWrap: 'anywhere' }}>{displayName(p.requester_name)}</div>
                  <button onClick={() => aprovar(p.user_id)} style={{ padding: '6px 12px', borderRadius: 8, border: 0, background: T.olive, color: T.cream, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Aprovar</button>
                  <button onClick={() => recusar(p.user_id)} title="recusar" style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${T.hairline}`, background: 'transparent', color: T.brown, fontSize: 12, cursor: 'pointer' }}>Recusar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* desafios compartilhados */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>Desafio do círculo</div>
          {!creating && <button onClick={() => setCreating(true)} style={{ background: 'transparent', border: 0, color: T.terra, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ novo</button>}
        </div>

        {creating && (
          <div style={{ background: T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
            <input value={cTitle} onChange={(e) => setCTitle(e.target.value)} placeholder="Nome (ex.: 6 ganhadores do Nobel)" autoFocus style={{ width: '100%', padding: '9px 10px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, fontFamily: T.sans, fontSize: 13, marginBottom: 8, outline: 'none' }}/>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginBottom: 6 }}>Formato</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {[
                { id: 'list', icon: 'list', label: 'Lista curada', sub: 'você define os livros' },
                { id: 'theme', icon: 'globe', label: 'Tema aberto', sub: 'cada um lança os seus' },
              ].map((o) => (
                <button key={o.id} onClick={() => setCKind(o.id)} style={{
                  flex: 1, textAlign: 'left', padding: '9px 11px', borderRadius: 10, cursor: 'pointer',
                  border: `1px solid ${cKind === o.id ? T.ink : T.hairline}`,
                  background: cKind === o.id ? T.ink : 'transparent', color: cKind === o.id ? T.cream : T.brown,
                }}>
                  <div style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name={o.icon} size={13} color={cKind === o.id ? T.cream : T.brown}/> {o.label}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.8, marginTop: 1 }}>{o.sub}</div>
                </button>
              ))}
            </div>
            {cKind === 'theme' && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: T.muted }}>Meta (livros por pessoa):</span>
                <input type="number" value={cTarget} onChange={(e) => setCTarget(e.target.value)} style={{ width: 64, padding: '8px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, fontFamily: T.sans, fontSize: 13, outline: 'none' }}/>
              </div>
            )}
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginBottom: 6 }}>Descrição e regras</div>
            <textarea value={cDesc} onChange={(e) => setCDesc(e.target.value)} rows={3}
              placeholder={cKind === 'theme' ? 'Critério e regras — ex.: ser ganhador do Nobel; vale qualquer edição; conta só o que terminar.' : 'Descrição e regras (opcional) — ex.: os títulos premiados; leiam na ordem que quiserem.'}
              style={{ width: '100%', padding: '9px 10px', border: `1px solid ${T.hairline}`, borderRadius: 8, background: T.bone, color: T.ink, fontFamily: T.sans, fontSize: 13, marginBottom: 10, outline: 'none', resize: 'vertical', lineHeight: 1.45 }}/>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.serif, fontStyle: 'italic', marginBottom: 10 }}>
              {cKind === 'list' ? 'Depois de criar, você lança os livros (título, autor, ano…) e cada um marca os que leu.' : 'Cada membro adiciona os próprios livros que leu (seguindo o critério) rumo à meta.'}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setCreating(false)} style={{ background: 'transparent', border: 0, color: T.brown, fontSize: 12, cursor: 'pointer' }}>cancelar</button>
              <button onClick={criarDesafio} disabled={busy || !cTitle.trim()} style={{ padding: '8px 14px', borderRadius: 8, border: 0, background: T.ink, color: T.cream, fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: (busy || !cTitle.trim()) ? 0.5 : 1 }}>{busy ? '…' : 'Criar'}</button>
            </div>
          </div>
        )}

        {challenges.length === 0 && !creating && (
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.muted, fontSize: 13, marginBottom: 22 }}>
            Nenhum desafio ainda. Crie um e leiam juntos rumo à meta.
          </div>
        )}

        {challenges.map((ch) => {
          // desafios curados (lista / tema): cartão próprio
          if (ch.kind === 'list' || ch.kind === 'theme') {
            return <ChallengeCardCloud key={ch.id} ch={ch} members={members} me={me} labelFor={labelFor} onChanged={load}/>;
          }
          // legado: desafio por contagem
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
                {rows.filter((r) => (r.value || 0) > 0).map((r) => (
                  <div key={r.user_id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12, color: T.brown }}>
                    <span style={{ fontFamily: T.serif, overflowWrap: 'anywhere' }}>{labelFor(r.user_id, r.email)}</span>
                    <span style={{ fontFamily: T.mono, flexShrink: 0 }}>{r.value} {r.value === 1 ? 'livro' : 'livros'}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* mural do círculo — recados + notas compartilhadas */}
        <div style={{ marginTop: 8, borderTop: `1px solid ${T.hairline}`, paddingTop: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 12 }}>Mural · conversas e notas</div>

          {posts.length === 0 && (
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', color: T.muted, fontSize: 13, marginBottom: 12 }}>
              Ainda sem recados. Comece a conversa ou compartilhe uma nota de leitura.
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            {posts.map((p) => (
              <div key={p.id} style={{ background: p.kind === 'nota' ? T.paper : T.cream, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: '12px 14px', position: 'relative', overflow: 'hidden' }}>
                {p.kind === 'nota' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: T.olive }}/>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: T.ink, color: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 10, flexShrink: 0 }}>{initials(p.author_name)}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.brown, overflowWrap: 'anywhere' }}>{p.author_name}</div>
                  {p.kind === 'nota' && <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.olive, fontWeight: 700 }}>nota</div>}
                </div>
                <div style={{ fontFamily: T.serif, fontSize: 14, lineHeight: 1.45, color: T.ink, fontStyle: p.kind === 'nota' ? 'italic' : 'normal', overflowWrap: 'anywhere' }}>{p.body}</div>
                {p.book_title && <div style={{ fontSize: 11, color: T.muted, marginTop: 6, fontFamily: T.serif }}>— sobre {p.book_title}</div>}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input value={msgText} onChange={(e) => setMsgText(e.target.value)} placeholder="Escreva um recado…"
              onKeyDown={(e) => e.key === 'Enter' && publicar()}
              style={{ flex: 1, padding: '11px 12px', border: `1px solid ${T.hairline}`, borderRadius: 10, background: T.cream, color: T.ink, fontFamily: T.sans, fontSize: 14, outline: 'none' }}/>
            <button onClick={publicar} disabled={busy} style={{ padding: '11px 16px', borderRadius: 10, border: 0, background: T.ink, color: T.cream, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Publicar</button>
          </div>
          <button onClick={() => setNotePicker((v) => !v)} style={{ marginTop: 8, width: '100%', padding: '11px', borderRadius: 10, border: `1px dashed ${notePicker ? T.terra : T.hairline}`, background: notePicker ? T.cream : 'transparent', color: T.terra, fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {notePicker
              ? <><Icon name="x" size={14} color={T.terra}/> fechar</>
              : <><Icon name="note" size={14} color={T.terra}/> Compartilhar uma nota de leitura</>}
          </button>
          {notePicker && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {minhasNotas.length === 0
                ? <div style={{ fontSize: 12, color: T.muted, fontStyle: 'italic', fontFamily: T.serif, padding: '4px 2px' }}>Você ainda não tem notas para compartilhar. Escreva uma nota num livro e ela aparece aqui.</div>
                : <div style={{ fontSize: 11, color: T.muted, fontFamily: T.serif, fontStyle: 'italic', marginBottom: 2 }}>Toque numa nota sua para publicá-la no mural:</div>}
              {minhasNotas.slice(0, 12).map((n, i) => (
                <div key={i} onClick={() => compartilharNota(n)} style={{ cursor: 'pointer', background: T.cream, border: `1px dashed ${T.hairline}`, borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontFamily: T.serif, fontSize: 13, lineHeight: 1.35, color: T.ink, overflowWrap: 'anywhere' }}>{(n.text || '').slice(0, 90)}{(n.text || '').length > 90 ? '…' : ''}</div>
                  {n.book && <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>— {n.book}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={sair} style={{ marginTop: 18, width: '100%', padding: '11px', borderRadius: 10, border: `1px solid ${T.hairline}`, background: 'transparent', color: '#8E3E2A', fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Sair do círculo</button>
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
  const [addStatus, setAddStatus] = React.useState('tbr'); // 'tbr' (quero ler) | 'reading' (lendo agora)

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
      status: addStatus,          // "quero ler" (padrão) ou "lendo agora", à escolha
      readingSince: addStatus === 'reading' ? new Date().toISOString() : undefined,
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
        {results && results.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: T.muted, fontFamily: T.sans }}>Adicionar como:</span>
            {[{ id: 'tbr', label: 'Quero ler' }, { id: 'reading', label: 'Lendo agora' }].map((o) => (
              <button key={o.id} onClick={() => setAddStatus(o.id)} style={{
                padding: '6px 12px', borderRadius: 20, cursor: 'pointer', fontFamily: T.sans, fontSize: 12, fontWeight: 600,
                border: `1px solid ${addStatus === o.id ? T.ink : T.hairline}`,
                background: addStatus === o.id ? T.ink : 'transparent',
                color: addStatus === o.id ? T.cream : T.brown,
              }}>{o.label}</button>
            ))}
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

      {/* PORTAL — convite para a Maratona Nobel (desafio do clube) */}
      <div style={{ padding: '8px 24px 0' }}>
        <a href="/maratona-nobel/" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ background: T.ink, color: T.cream, borderRadius: 14, padding: '18px 18px 16px', position: 'relative', overflow: 'hidden' }}>
            <img src="/nobel-medal.png" alt="" style={{ position: 'absolute', right: -16, top: -16, width: 118, height: 118, opacity: 0.18, pointerEvents: 'none' }}/>
            <div style={{ fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase', color: T.ochre, fontWeight: 700, marginBottom: 8 }}>
              ✦ Convite · desafio do clube
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 500, lineHeight: 1.15, marginBottom: 8 }}>
              Maratona Nobel
            </div>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, lineHeight: 1.5, color: 'rgba(247,241,228,0.82)', marginBottom: 12, maxWidth: '86%' }}>
              O jogo de leitura do Nobel — de junho a outubro. Idealização e curadoria de Jamile e João; acompanhe as leituras por aqui.
            </div>
            <div style={{ fontSize: 11, letterSpacing: 0.6, fontWeight: 700, color: T.ochre, textTransform: 'uppercase' }}>
              Entrar na Maratona →
            </div>
          </div>
        </a>
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
                <ChallengeSuggestion key={i} suggestion={s} onAdopt={() => setShowSug(true)}/>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {c.sharedGroupId && (
            <div title={'Disponibilizado' + (c.sharedGroupName ? ' · ' + c.sharedGroupName : '')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 999, background: T.cream,
              border: `1px solid ${t.border}`, color: t.tag,
              fontSize: 9, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700,
            }}><Icon name="share" size={11} color={t.tag}/> disponibilizado</div>
          )}
          {finished && (
            <div style={{
              padding: '3px 8px', borderRadius: 999,
              background: T.olive, color: T.cream,
              fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700,
            }}>✓ {progress.pct}%</div>
          )}
        </div>
      </div>
      <div style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 500, lineHeight: 1.12, letterSpacing: -0.3, marginBottom: c.description ? 4 : 10 }}>
        {c.title}
      </div>
      {c.description && (
        <div style={{ fontFamily: T.serif, fontSize: 12.5, fontStyle: 'italic', color: T.brown, lineHeight: 1.4, marginBottom: c.sharedGroupId ? 6 : 12 }}>
          {c.description}
        </div>
      )}
      {c.sharedGroupId && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9.5,
                      color: t.tag, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 12 }}>
          <Icon name="sparkle" size={12} color={t.tag}/> círculo · {c.sharedGroupName || 'criado'}
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

function ChallengeSuggestion({ suggestion: s, onAdopt = () => {} }) {
  const [done, setDone] = React.useState(false);
  const adopt = () => {
    if (done || typeof MG === 'undefined') return;
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
    setDone(true);
    onAdopt();               // mantém as sugestões abertas para mostrar o feedback
  };
  return (
    <div onClick={adopt} style={{
      padding: '12px 14px', background: done ? '#E5E5D2' : 'transparent',
      border: `1px ${done ? 'solid' : 'dashed'} ${done ? 'rgba(94,107,62,0.4)' : T.hairline}`, borderRadius: 10,
      cursor: done ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'background 200ms ease',
    }}>
      <div style={{ fontFamily: T.serif, fontSize: 13 }}>{s.title_pt}</div>
      <div style={{ fontSize: 10, color: done ? T.olive : T.terra, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
        {done ? <><Icon name="target" size={12} color={T.olive}/> adotada</> : 'adotar →'}
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

  // disponibilizar: cria um CÍRCULO NOVO (com o nome do desafio) — segue pessoal E abre roda
  const [shareBusy, setShareBusy] = React.useState(false);
  const [shareMsg, setShareMsg] = React.useState(null);
  const [shared, setShared] = React.useState(
    challenge?.sharedGroupId
      ? { id: challenge.sharedGroupId, name: challenge.sharedGroupName, invite_code: challenge.sharedGroupCode }
      : null
  );

  const types = window.CHALLENGE_TYPES || [];
  const periods = window.CHALLENGE_PERIODS || [];

  const shareToCircle = async () => {
    setShareMsg(null);
    const cloud = (typeof window !== 'undefined') ? window.MGCloud : null;
    if (!cloud || !cloud.available) { setShareMsg('A sincronização na nuvem não está disponível agora.'); return; }
    const user = await cloud.currentUser();
    if (!user) { setShareMsg('Entre na sua conta em Biblioteca → Sincronização para disponibilizar o desafio.'); return; }
    const nome = (title.trim() || challenge.title || 'Círculo de leitura');
    setShareBusy(true);
    // 1) cria um CÍRCULO NOVO com o nome do desafio
    const cg = await cloud.groups.create(nome);
    if (cg && cg.error) { setShareBusy(false); setShareMsg('Não consegui criar o círculo: ' + (cg.error.message || 'erro')); return; }
    const grupo = (cg && cg.data) ? cg.data : null;
    if (!grupo || !grupo.id) { setShareBusy(false); setShareMsg('Não consegui criar o círculo agora. Tente de novo.'); return; }
    // 2) cria o desafio dentro do círculo novo (tema aberto: cada um traz os seus)
    let desc = (description || '').trim();
    const crit = filterTheme ? ('Tema: ' + filterTheme.trim())
               : filterAuthor ? ('Autor: ' + filterAuthor.trim()) : '';
    if (crit) desc = desc ? (desc + ' · ' + crit) : crit;
    const tgt = (type === 'pages' || type === 'free') ? 6 : (parseInt(target) || 6);
    const r = await cloud.groups.createChallenge(grupo.id, {
      title: nome, kind: 'theme', type: 'count', description: desc || null, target: tgt,
    });
    if (r && r.error) { setShareMsg('Círculo criado, mas o desafio não entrou: ' + (r.error.message || 'erro')); }
    const chId = (r && r.data && r.data.id) || null;
    // abre o círculo para todos os usuários poderem descobrir e entrar
    try { await cloud.groups.setOpen(grupo.id, true); } catch (e) { /* ok */ }
    // busca o grupo COMPLETO (garante o código de convite, que o create pode não devolver)
    let full = grupo;
    try { const all = await cloud.groups.list(); const f = (all || []).find(g => g.id === grupo.id); if (f) full = f; } catch (e) { /* ok */ }
    setShareBusy(false);
    // 3) marca a meta pessoal como disponibilizada (guarda o círculo p/ reabrir)
    MG.updateChallenge(challenge.id, {
      sharedGroupId: full.id, sharedGroupName: full.name,
      sharedGroupCode: full.invite_code || null, sharedChallengeId: chId,
    });
    setShared({ id: full.id, name: full.name, invite_code: full.invite_code || null });
  };

  const abrirCirculo = async () => {
    if (!shared || typeof window.__openGrupo !== 'function') return;
    let g = shared;
    const cloud = (typeof window !== 'undefined') ? window.MGCloud : null;
    if (cloud && cloud.available && shared.id) {
      try { const all = await cloud.groups.list(); const f = (all || []).find(x => x.id === shared.id); if (f) g = f; } catch (e) { /* ok */ }
    }
    onClose();
    window.__openGrupo(g);
  };

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

        {/* descrição e regras (opcional) */}
        <FieldLabel>Descrição e regras (opcional)</FieldLabel>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder={"Para que serve esta meta e como ela vale?\nEx.: Reler os Nobel que me marcaram. Vale relê-los; conta só o que terminar no ano."}
          rows={4}
          style={{
            width: '100%', padding: '10px 12px', border: `1px solid ${T.hairline}`,
            borderRadius: 8, background: T.cream, color: T.ink, resize: 'vertical',
            fontFamily: T.serif, fontSize: 13, outline: 'none', marginBottom: 14, lineHeight: 1.45,
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

        {/* disponibilizar para o círculo — segue pessoal E entra no grupo */}
        {isEdit && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.hairline}` }}>
            <FieldLabel>Disponibilizar para o círculo</FieldLabel>
            {shared ? (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '11px 13px',
                              background: '#E5E5D2', border: `1px solid ${T.hairline}`, borderRadius: 10,
                              fontSize: 12.5, color: T.brown, fontFamily: T.serif, lineHeight: 1.45, marginBottom: 10 }}>
                  <Icon name="sparkle" size={15} color={T.olive}/>
                  <span>Disponibilizado: virou o círculo <strong>{shared.name}</strong>. Ele aparece na aba <strong>Grupos</strong> — convide amigos por lá. Continua sendo seu desafio pessoal.</span>
                </div>
                <button onClick={abrirCirculo} style={{
                  width: '100%', padding: '11px', borderRadius: 10,
                  background: 'transparent', color: T.ink, border: `1px solid ${T.hairline}`, cursor: 'pointer',
                  fontFamily: T.sans, fontSize: 13, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>Abrir o círculo →</button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, lineHeight: 1.45, marginBottom: 10 }}>
                  Cria um <strong>círculo novo</strong> com o nome desta meta. Ele aparece na aba <strong>Grupos</strong>,
                  os amigos entram e cada um traz os próprios livros rumo à meta — e ela continua sendo seu desafio pessoal.
                </div>
                <button onClick={shareToCircle} disabled={shareBusy} style={{
                  width: '100%', padding: '12px', borderRadius: 10,
                  background: T.olive, color: T.cream, border: 0, cursor: shareBusy ? 'wait' : 'pointer',
                  fontFamily: T.sans, fontSize: 13, fontWeight: 600, letterSpacing: 0.3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: shareBusy ? 0.6 : 1,
                }}>
                  <Icon name="sparkle" size={15} color={T.cream}/> {shareBusy ? 'Criando o círculo…' : 'Disponibilizar para o círculo'}
                </button>
              </>
            )}
            {shareMsg && (
              <div style={{ marginTop: 10, padding: '8px 10px', background: '#F6EFE0',
                            border: `1px solid ${T.hairline}`, borderRadius: 8, fontSize: 12,
                            color: T.brown, fontFamily: T.serif, lineHeight: 1.4 }}>
                {shareMsg}
              </div>
            )}
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
  const fileRef = React.useRef(null); // PNG pronto p/ navigator.share (iOS exige chamar no gesto do toque)

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

  // pré-gera o PNG quando o card fica pronto — toque em "Compartilhar" chama navigator.share
  // na hora (iOS standalone não abre o menu se houver um await antes da chamada).
  React.useEffect(() => {
    fileRef.current = null;
    if (!canvas) return;
    const safe = (book.title || 'citacao').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    canvas.toBlob((blob) => {
      if (blob) fileRef.current = new File([blob], `marginalia-${safe}.png`, { type: 'image/png' });
    }, 'image/png');
  }, [canvas]);

  const handleShare = async () => {
    const file = fileRef.current;
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `${book.title} — ${book.author}`, text: note.text });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
      }
    }
    handleDownload();
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
          <button onClick={() => { window.location.href = buildNotesMailto(note, book); }} style={{
            padding: '12px', borderRadius: 12,
            background: 'transparent', color: T.brown,
            border: `1px solid ${T.hairline}`, cursor: 'pointer',
            fontFamily: T.sans, fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name="note" size={15} color={T.terra}/> Enviar por e-mail (texto)
          </button>
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

  const b = (typeof window.currentBook === 'function' ? window.currentBook() : null) || BOOK_CURRENT;

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
              background: 'linear-gradient(180deg, rgba(176,83,58,0.30) 0%, rgba(176,83,58,0.50) 100%)',
              transition: 'height 0.9s ease-out',
            }}/>
            {/* sublinhado horizontal a cada quarto — "linhas do livro" */}
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute', left: '12%', right: '12%',
                top: `${10 + i * 11}%`,
                height: 1,
                background: T.hairline,
                opacity: 0.5,
              }}/>
            ))}
          </div>

          {/* tempo restante centralizado */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          }}>
            <div style={{ marginBottom: 8, opacity: 0.9 }}>
              <Icon name="hourglass" size={22} color={T.terra} strokeWidth={1.5}/>
            </div>
            <div style={{
              fontFamily: T.serif, fontSize: 48, fontWeight: 500,
              color: T.ink,
              fontVariantNumeric: 'tabular-nums', letterSpacing: -1,
            }}>{mm}:{ss}</div>
            <div style={{
              fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase',
              color: T.muted,
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

  // estatísticas — na vitrine (estante vazia, exemplos) os números de leitura ficam zerados
  const stats = React.useMemo(() => {
    const counted = (typeof window !== 'undefined' && window.__demoShelf) ? [] : all;
    const thisYear = new Date().getFullYear();
    const lidosNoAno = counted.filter(b => {
      if (b.status !== 'read') return false;
      if (b.finishedAt) return new Date(b.finishedAt).getFullYear() === thisYear;
      return true; // sem data = conta no ano corrente
    }).length;
    const totalLidos = counted.filter(b => b.status === 'read').length;
    const paginasAtravessadas = counted.reduce((sum, b) => {
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
// showAdmin=false esconde o painel de administradora (usado no mini-perfil do avatar).
function CloudAccount({ showAdmin = true } = {}) {
  const cloud = (typeof window !== 'undefined') ? window.MGCloud : null;
  const [user, setUser] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [step, setStep] = React.useState('idle'); // idle | sent
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState(null);
  const [nome, setNome] = React.useState('');
  const status = (typeof window !== 'undefined' && window.__cloudStatus) || '';
  const syncRef = React.useRef(null);
  // quando se chega aqui vindo do cartão/avatar da home, rola até a seção de login
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.__scrollToSync) {
      window.__scrollToSync = false;
      setTimeout(() => { if (syncRef.current && syncRef.current.scrollIntoView) syncRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 300);
    }
  }, []);

  React.useEffect(() => {
    let alive = true;
    if (cloud && cloud.available) cloud.currentUser().then(u => {
      if (!alive) return;
      setUser(u);
      if (u) setNome((u.user_metadata && u.user_metadata.name) || '');
    });
    return () => { alive = false; };
  }, []);

  const salvarNome = async () => {
    if (!nome.trim() || !cloud.setName) return;
    setBusy(true); setMsg(null);
    const { error } = await cloud.setName(nome.trim());
    setBusy(false);
    if (error) { setMsg('Não foi possível salvar o nome: ' + error.message); return; }
    const u = await cloud.currentUser();
    setUser(u);
    setMsg('Nome salvo! Seu avatar e seus recados no grupo agora usam "' + nome.trim() + '".');
    if (typeof window !== 'undefined' && window.__rerender) window.__rerender();
  };

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
    // porta do app: se ficou pendente, a tela de espera assume (mantém o convite guardado)
    if (typeof window !== 'undefined' && window.__appStatus === 'pending') {
      if (window.__rerender) window.__rerender();
      return;
    }
    // veio de um link de convite? entra direto (círculos são livres p/ aprovados)
    if (typeof window !== 'undefined' && window.__pendingJoin && cloud.groups) {
      const jc = window.__pendingJoin; window.__pendingJoin = null;
      setMsg('Conectada! Entrando no círculo…');
      const r = await cloud.groups.join(jc);
      if (r && !r.error && r.data) { if (window.__openGrupo) window.__openGrupo(r.data); return; }
      setMsg('Conectada! (não encontrei o círculo do convite — confira o link.)');
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
    <>
    {showAdmin && <AppAdminPanel/>}
    <div ref={syncRef} style={{ marginBottom: 22, borderBottom: `1px solid ${T.hairline}`, paddingBottom: 20 }}>
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

          <div style={{ fontSize: 11, color: T.muted, fontFamily: T.sans, fontWeight: 600, marginBottom: 6 }}>Seu nome (aparece no avatar e nos recados do grupo)</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input type="text" placeholder="ex.: Mariana Lopes"
              value={nome} onChange={e => setNome(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && salvarNome()} style={inputStyle}/>
            <button onClick={salvarNome} disabled={busy} style={btnDark}>{busy ? '…' : 'Salvar'}</button>
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
    </>
  );
}

// AccountSheet — mini-perfil deslizante aberto ao tocar no avatar da home.
// Reaproveita o login/sincronização do CloudAccount, sem o painel de admin.
function AccountSheet({ onClose = () => {} }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(42,38,32,0.55)',
      display: 'flex', alignItems: 'flex-end', zIndex: 90,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: T.paper, borderRadius: '24px 24px 0 0',
        padding: '14px 20px 28px', maxHeight: '92%', overflow: 'auto',
        fontFamily: T.sans, color: T.ink,
      }}>
        <div style={{ width: 36, height: 4, background: T.hairline, borderRadius: 4, margin: '0 auto 14px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: 0, cursor: 'pointer', fontSize: 13, color: T.brown,
          }}>Fechar</button>
          <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500 }}>Seu perfil</div>
          <div style={{ width: 50 }}/>
        </div>
        <CloudAccount showAdmin={false}/>
      </div>
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

  const baixarMd = () => {
    const notes = window.NOTES || [];
    if (!notes.length) { flash('Você ainda não tem notas para exportar.'); return; }
    const md = buildNotesMarkdown(notes, window.BOOKS || []);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `marginalia-notas-${d}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash('Notas exportadas em Markdown — abra o arquivo no Obsidian.');
  };

  const copiarMd = async () => {
    const notes = window.NOTES || [];
    if (!notes.length) { flash('Você ainda não tem notas para exportar.'); return; }
    const md = buildNotesMarkdown(notes, window.BOOKS || []);
    try {
      await navigator.clipboard.writeText(md);
      flash('Markdown copiado — cole numa nota nova do Obsidian.');
    } catch (e) {
      flash('Não consegui copiar sozinho. Use "Baixar .md".');
    }
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

      {/* Levar para o Obsidian — exportar notas em Markdown */}
      <div style={{ borderTop: `1px solid ${T.hairline}`, paddingTop: 20, marginTop: 22 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 6 }}>
          Levar para o Obsidian
        </div>
        <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, fontStyle: 'italic', lineHeight: 1.45, marginBottom: 12 }}>
          Exporte suas notas em Markdown, agrupadas por livro — prontas para colar no seu
          caderno digital. O Marginália alimenta o seu sistema, sem virar mais um silo.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={baixarMd} style={btn()}>↓ Baixar .md</button>
          <button onClick={copiarMd} style={btn()}>⧉ Copiar</button>
        </div>
      </div>

      {/* Feedback de teste */}
      <div style={{ borderTop: `1px solid ${T.hairline}`, paddingTop: 20, marginTop: 22 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 10 }}>
          Em teste
        </div>
        {typeof FeedbackButton !== 'undefined' && <FeedbackButton variant="block"/>}
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
                         cover={b.cover} isbn={b.isbn} w={94}/>
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
                         cover={b.cover} isbn={b.isbn} w={42}/>
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

  // busca na internet (Open Library) — preenche capa/autor/ano/páginas
  const [bq, setBq] = React.useState('');
  const [bBusy, setBBusy] = React.useState(false);
  const [bResults, setBResults] = React.useState(null); // null | [] | array
  const [bErr, setBErr] = React.useState(null);

  const searchOnline = async () => {
    if (!bq.trim() || typeof Sources === 'undefined') return;
    setBBusy(true); setBErr(null); setBResults(null);
    try {
      const list = await Sources.searchByTitle(bq.trim());
      setBResults(list);
    } catch (e) { setBErr(e.message || 'falha na busca'); }
    finally { setBBusy(false); }
  };
  const applyResult = async (r) => {
    if (r.title) setTitle(r.title);
    if (r.author && r.author !== 'Desconhecido') setAuthor(r.author);
    if (r.year) setYear(String(r.year).slice(0, 4));
    if (r.pages) setPages(String(r.pages));
    if (r.publisher) setPublisher(r.publisher);
    if (r.cover) setCover(r.cover);
    setBResults(null); setBq('');
    // enriquece pela edição (ISBN) o que faltou — páginas/ano/editora/capa
    if (r.isbn && typeof Sources !== 'undefined' && (!r.pages || !r.year || !r.publisher || !r.cover)) {
      try {
        const d = await Sources.lookupISBN(String(r.isbn).replace(/[^0-9X]/gi, ''));
        if (d) {
          if (!r.pages && d.pages) setPages(String(d.pages));
          if (!r.year && d.year) { const m = String(d.year).match(/\d{4}/); if (m) setYear(m[0]); }
          if (!r.publisher && d.publisher) setPublisher(d.publisher);
          if (!r.cover && d.cover) setCover(d.cover);
        }
      } catch (e) { /* segue com o que já tem */ }
    }
  };

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

        {/* busca na internet — só ao adicionar livro novo */}
        {!isEdit && (
          <div style={{ marginBottom: 18 }}>
            <FieldLabel>Buscar na internet</FieldLabel>
            <div style={{ display: 'flex', gap: 6 }}>
              <input value={bq} onChange={e => setBq(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchOnline()}
                placeholder="título e autor — ex.: Mefisto Klaus Mann"
                style={{ flex: 1, padding: '10px 12px', border: `1px solid ${T.hairline}`,
                         borderRadius: 10, background: T.cream, color: T.ink,
                         fontFamily: T.sans, fontSize: 13, outline: 'none' }}/>
              <button onClick={searchOnline} disabled={bBusy || !bq.trim()} style={{
                background: T.terra, color: T.cream, border: 0, borderRadius: 10,
                padding: '0 16px', fontSize: 12, fontWeight: 600, cursor: bBusy ? 'wait' : 'pointer',
                letterSpacing: 0.3, opacity: (bBusy || !bq.trim()) ? 0.6 : 1,
              }}>{bBusy ? '…' : 'Buscar'}</button>
            </div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.serif, fontStyle: 'italic', marginTop: 6, lineHeight: 1.4 }}>
              Acha capa, autor e dados sozinho. Toque num resultado para preencher — depois é só ajustar e salvar.
            </div>
            {bErr && <div style={{ marginTop: 8, padding: '8px 10px', background: '#F4D9D0', borderRadius: 8, fontSize: 11, color: '#8E3E2A' }}>Erro: {bErr}</div>}
            {bResults && bResults.length === 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: T.muted, fontStyle: 'italic', fontFamily: T.serif }}>
                Nada encontrado. Tente outras palavras ou preencha à mão abaixo.
              </div>
            )}
            {bResults && bResults.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {bResults.slice(0, 8).map((r, i) => (
                  <div key={i} onClick={() => applyResult(r)} style={{
                    display: 'flex', gap: 10, padding: 10, background: T.cream,
                    borderRadius: 10, border: `1px solid ${T.hairline}`, cursor: 'pointer', alignItems: 'flex-start',
                  }}>
                    {r.cover
                      ? <img src={r.cover} alt={r.title} style={{ width: 40, height: 60, objectFit: 'cover', borderRadius: 3, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} onError={e => e.target.style.display = 'none'}/>
                      : <div style={{ width: 40, height: 60, borderRadius: 3, background: T.bone, border: `1px solid ${T.hairline}`, flexShrink: 0 }}/>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>{r.title}</div>
                      <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, color: T.brown, marginTop: 2 }}>{r.author}</div>
                      <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, letterSpacing: 0.3, marginTop: 2 }}>{[r.year, r.pages && (r.pages + ' pág'), r.publisher].filter(Boolean).join(' · ')}</div>
                    </div>
                    <Icon name="plus" size={16} color={T.terra}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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

// ─────────────────────────────────────────────────────────────
// FeedbackButton — recado leve de quem está testando (vai por e-mail)
// variant 'inline' = chamada discreta na home; 'block' = botão no painel
// ─────────────────────────────────────────────────────────────
function FeedbackButton({ variant = 'block' }) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [nome, setNome] = React.useState('');
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const u = window.MGCloud ? await window.MGCloud.currentUser() : null;
        if (u) setNome((u.user_metadata && u.user_metadata.name) || u.email || '');
      } catch (e) { /* sem conta tudo bem */ }
    })();
  }, [open]);

  const enviar = () => {
    const t = text.trim();
    if (!t) return;
    const ver = window.APP_VERSION || '';
    const subject = 'Marginália — feedback de teste';
    const body = t + '\n\n———\n' +
      (nome ? `De: ${nome}\n` : '') +
      `Enviado de clubemarginalia.com.br${ver ? ' · v' + ver : ''}`;
    window.location.href = 'mailto:maritei2010@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    setSent(true);
    setTimeout(() => { setOpen(false); setSent(false); setText(''); }, 1400);
  };

  const trigger = variant === 'inline' ? (
    <div onClick={() => setOpen(true)} style={{
      padding: '13px 16px', background: 'transparent',
      border: `1px dashed ${T.hairline}`, borderRadius: 12, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 11, marginBottom: 8,
    }}>
      <Icon name="note" size={16} color={T.terra}/>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 500, color: T.ink }}>
          Conte o que você achou
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 1, lineHeight: 1.3 }}>
          O app está em teste — sua impressão ajuda a moldar o clube.
        </div>
      </div>
    </div>
  ) : (
    <button onClick={() => setOpen(true)} style={{
      width: '100%', padding: '11px 12px', borderRadius: 10, cursor: 'pointer',
      fontFamily: T.sans, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
      border: `1px solid ${T.hairline}`, background: T.cream, color: T.ink,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      <Icon name="note" size={14} color={T.terra}/> Enviar feedback
    </button>
  );

  return (
    <>
      {trigger}
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: 'absolute', inset: 0, background: 'rgba(42,38,32,0.55)',
          display: 'flex', alignItems: 'flex-end', zIndex: 90,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', background: T.paper, borderRadius: '24px 24px 0 0',
            padding: '14px 20px 28px', maxHeight: '92%', overflow: 'auto',
            fontFamily: T.sans, color: T.ink,
          }}>
            <div style={{ width: 36, height: 4, background: T.hairline, borderRadius: 4, margin: '0 auto 14px' }}/>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <button onClick={() => setOpen(false)} style={{
                background: 'transparent', border: 0, cursor: 'pointer', fontSize: 13, color: T.brown,
              }}>Fechar</button>
              <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500 }}>Feedback</div>
              <div style={{ width: 50 }}/>
            </div>

            {sent ? (
              <div style={{
                padding: '24px 8px', textAlign: 'center',
                fontFamily: T.serif, fontSize: 15, color: T.ink, lineHeight: 1.5,
              }}>
                Obrigada 💛<br/>
                <span style={{ fontSize: 13, color: T.brown, fontStyle: 'italic' }}>
                  Abrindo seu e-mail para enviar…
                </span>
              </div>
            ) : (
              <>
                <div style={{
                  fontSize: 12, color: T.brown, fontFamily: T.serif, fontStyle: 'italic',
                  marginBottom: 12, lineHeight: 1.5,
                }}>
                  O que está funcionando? O que travou ou incomodou? Toda impressão ajuda.
                </div>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Escreva aqui…"
                  rows={5}
                  style={{
                    width: '100%', padding: '12px 14px', border: `1px solid ${T.hairline}`,
                    borderRadius: 12, background: T.cream, color: T.ink,
                    fontFamily: T.serif, fontSize: 14, lineHeight: 1.5, outline: 'none',
                    resize: 'vertical', boxSizing: 'border-box', marginBottom: 12,
                  }}/>
                <button onClick={enviar} disabled={!text.trim()} style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: text.trim() ? T.ink : T.hairline,
                  color: T.cream, border: 0, cursor: text.trim() ? 'pointer' : 'default',
                  fontFamily: T.sans, fontSize: 14, fontWeight: 600, letterSpacing: 0.4,
                }}>Enviar</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// ShareRecommendationSheet — cartão de recomendação (livro + estrelas + texto)
// ─────────────────────────────────────────────────────────────
function ShareRecommendationSheet({ book, onClose = () => {} }) {
  const [canvas, setCanvas] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const previewRef = React.useRef(null);
  const fileRef = React.useRef(null); // PNG pronto p/ navigator.share (iOS exige chamar no gesto do toque)

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof Share === 'undefined' || !Share.renderRecommendationCard) return;
      await Share.preloadSymbol();
      if (cancelled) return;
      const c = await Share.renderRecommendationCard({ book });
      if (cancelled) return;
      setCanvas(c);
    })();
    return () => { cancelled = true; };
  }, [book]);

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
  const note = { text: (book.recommendation || '').trim() || book.title };

  const handleDownload = () => {
    if (!canvas) return;
    const safeTitle = (book.title || 'recomendacao').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    Share.download(canvas, `marginalia-recomendacao-${safeTitle}.png`);
  };
  const handleCopy = async () => {
    if (!canvas) return;
    const ok = await Share.copyToClipboard(canvas);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  // pré-gera o PNG assim que o card fica pronto, para que o toque em "Compartilhar"
  // chame navigator.share IMEDIATAMENTE — no iOS standalone o gesto não pode esperar um await.
  React.useEffect(() => {
    fileRef.current = null;
    if (!canvas) return;
    const safe = (book.title || 'recomendacao').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    canvas.toBlob((blob) => {
      if (blob) fileRef.current = new File([blob], `marginalia-recomendacao-${safe}.png`, { type: 'image/png' });
    }, 'image/png');
  }, [canvas]);

  const handleShare = async () => {
    const file = fileRef.current;
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `${book.title} — ${book.author}`, text: note.text });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return; // a leitora fechou o menu — tudo certo
      }
    }
    handleDownload(); // sem Web Share: cai para baixar o PNG
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={onClose} style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 13, color: T.brown }}>Fechar</button>
          <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 500 }}>Cartão de recomendação</div>
          <div style={{ width: 50 }}/>
        </div>

        <div style={{ marginBottom: 18, position: 'relative' }}>
          <div ref={previewRef}/>
          {loading && (
            <div style={{
              position: 'absolute', inset: 0, width: '100%', aspectRatio: 1,
              background: T.cream, borderRadius: 12, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: T.muted, fontFamily: T.serif, fontStyle: 'italic',
            }}>gerando…</div>
          )}
        </div>

        <div style={{ fontSize: 12, color: T.brown, fontFamily: T.serif, fontStyle: 'italic', textAlign: 'center', marginBottom: 18, lineHeight: 1.5 }}>
          1080×1080 · pronto para Instagram, WhatsApp, e-mail
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleShare} style={{
            padding: '14px', borderRadius: 12, background: T.ink, color: T.cream,
            border: 0, cursor: 'pointer', fontFamily: T.sans, fontSize: 14, fontWeight: 600,
            letterSpacing: 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name="share" size={16} color={T.cream}/> Compartilhar
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleDownload} style={{
              flex: 1, padding: '12px', borderRadius: 12, background: T.cream, color: T.ink,
              border: `1px solid ${T.hairline}`, cursor: 'pointer', fontFamily: T.sans, fontSize: 13, fontWeight: 500,
            }}>Baixar PNG</button>
            <button onClick={handleCopy} style={{
              flex: 1, padding: '12px', borderRadius: 12,
              background: copied ? T.olive : T.cream, color: copied ? T.cream : T.ink,
              border: `1px solid ${copied ? T.olive : T.hairline}`, cursor: 'pointer',
              fontFamily: T.sans, fontSize: 13, fontWeight: 500,
            }}>{copied ? 'Copiado ✓' : 'Copiar'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenBookDetail, ScreenNoteEditor,
  ScreenAddBook, ScreenLibrary, ScreenFoco,
  ScreenMetas, ChallengeCard, ChallengeSuggestion, ChallengeEditorSheet, FieldLabel,
  BookEditorSheet, LibrarySection, Stat, BrandMark, ShareNoteSheet,
  ShareRecommendationSheet, StarRating, MinhaAvaliacao,
  PonteCard, PontesEstante, SectionLabel, FeedbackButton, buildNotesMarkdown,
  NOTE_KINDS, noteKind, noteKindColor, noteKindLabel,
});
