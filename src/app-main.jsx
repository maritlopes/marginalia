// ─────────────────────────────────────────────────────────────
// Marginalia — App real, full-window, PWA-ready
// (era o <script type="text/babel"> inline do index.html; agora é módulo
//  do bundle Vite. Continua falando com o resto do app via window.*)
// ─────────────────────────────────────────────────────────────

function applyAccent(accent) {
  const map = {
    terracotta: { terra: '#B0533A', terraDeep: '#8E3E2A' },
    olive:      { terra: '#5E6B3E', terraDeep: '#434E2A' },
    ochre:      { terra: '#C48A2C', terraDeep: '#8E6418' },
  };
  Object.assign(window.T, map[accent] || map.terracotta);
}

// Frame — móldura iPhone no desktop, fullscreen no mobile
function DeviceShell({ children, dark = false }) {
  return (
    <div className="device-shell" style={{ background: dark ? '#000' : '#F2F2F7' }}>
      {/* dynamic island — escondido no mobile via CSS */}
      <div className="dynamic-island" style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
      }}/>
      <div className="device-inner" style={{ width: '100%', height: '100%', position: 'relative' }}>
        {children}
      </div>
      {/* home indicator — escondido no mobile via CSS */}
      <div className="home-indicator" style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 139, height: 5, borderRadius: 100,
        background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)',
        zIndex: 60, pointerEvents: 'none',
      }}/>
    </div>
  );
}

// Splash screen — aparece no boot, fade out após ~1.5s
function Splash({ visible }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: '#F4EFE6',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transition: 'opacity 600ms ease',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <img src="logo.png" alt="Marginália" style={{
        width: '70%', maxWidth: 280, height: 'auto', objectFit: 'contain',
      }}/>
    </div>
  );
}

// WebNav — cabeçalho de SITE (logo + menu no topo), só no navegador desktop (modo web).
// Substitui a barra de baixo (cara de app) para o Marginália parecer uma página web.
function WebNav({ active = 'home', onClick = () => {}, dark = false }) {
  const items = [
    { id: 'home', label: 'Hoje' },
    { id: 'library', label: 'Biblioteca' },
    { id: 'desafios', label: 'Desafios' },
    { id: 'grupos', label: 'Grupos' },
  ];
  const bg = dark ? '#1A1612' : '#F7F1E4';
  const border = dark ? 'rgba(255,255,255,0.08)' : '#E3D9C4';
  const ink = dark ? '#F7E7D6' : '#2A2620';
  const muted = dark ? 'rgba(247,231,214,0.55)' : '#9A8E7B';
  const terra = '#B0533A';
  return (
    <div className="web-nav" style={{
      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: 62, background: bg, borderBottom: `1px solid ${border}`,
      position: 'relative', zIndex: 30,
    }}>
      <button onClick={() => onClick('home')} style={{
        display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 0, cursor: 'pointer',
      }}>
        <img src="symbol.png" alt="" style={{ width: 26, height: 26, objectFit: 'contain' }}/>
        <span style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, fontWeight: 600, color: terra, letterSpacing: -0.2 }}>Marginália</span>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {items.map(it => (
          <button key={it.id} onClick={() => onClick(it.id)} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            padding: '8px 14px', margin: 0,
            fontFamily: 'Inter, sans-serif', fontSize: 14.5,
            fontWeight: active === it.id ? 600 : 500,
            color: active === it.id ? ink : muted,
            borderBottom: `2px solid ${active === it.id ? terra : 'transparent'}`,
          }}>{it.label}</button>
        ))}
        <button onClick={() => { if (typeof window.__openAccount === 'function') window.__openAccount(); }}
          aria-label="Sua conta" title="Sua conta" style={{
          marginLeft: 12, width: 34, height: 34, borderRadius: '50%', cursor: 'pointer',
          background: dark ? '#2A2620' : '#EFE6D4', border: `1px solid ${border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: terra,
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={terra} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Roteador interno do app
function MarginaliaApp() {
  // hidrata dados live a partir do MG (mescla com seeds)
  if (typeof window._refreshLive === 'function') window._refreshLive();

  const [prefs, setPrefs] = React.useState(() => MG.getPrefs());
  const [route, setRoute] = React.useState('home');
  const [bookReturn, setBookReturn] = React.useState('library'); // rota de origem ao abrir um livro (pra o "voltar" do detalhe retornar pra lá)
  const routeRef = React.useRef('home');
  routeRef.current = route;
  const [showSplash, setShowSplash] = React.useState(true);

  // splash de boas-vindas: 1.5s, depois fade out
  React.useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 700);
    return () => clearTimeout(t);
  }, []);
  const [editingBook, setEditingBook] = React.useState(null);
  const [detailBook, setDetailBook] = React.useState(null);
  const [openGrupo, setOpenGrupo] = React.useState(null);
  const [sharingNote, setSharingNote] = React.useState(null);
  const [sharingRec, setSharingRec] = React.useState(null);
  const [editingChallenge, setEditingChallenge] = React.useState(null);
  const [showAccount, setShowAccount] = React.useState(false);
  const [showWelcome, setShowWelcome] = React.useState(false);
  const [showChegada, setShowChegada] = React.useState(false);
  const [dustBook, setDustBook] = React.useState(null);
  const [showAlimentar, setShowAlimentar] = React.useState(false);
  const [, forceRender] = React.useReducer(x => x + 1, 0);

  // modo web desktop: navegador (não instalado) em tela larga → frame de site (nav no topo)
  const calcWebDesktop = () => {
    try { return document.documentElement.classList.contains('web-mode') && window.innerWidth >= 768; }
    catch (e) { return false; }
  };
  const [webDesktop, setWebDesktop] = React.useState(calcWebDesktop);
  React.useEffect(() => {
    const onR = () => setWebDesktop(calcWebDesktop());
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);

  // expõe re-render global para que Storage.add* possa propagar mudanças à UI
  React.useEffect(() => {
    window.__rerender = () => {
      if (typeof window._refreshLive === 'function') window._refreshLive();
      forceRender();
    };
    window.__editBook = (book) => setEditingBook(book);
    window.__openBook = (book) => { window.__viewBook = book; setDetailBook(book); setBookReturn(routeRef.current === 'book' ? 'library' : routeRef.current); setRoute('book'); };
    window.__openGrupo = (g) => setOpenGrupo(g);
    window.__shareNote = (note, book) => setSharingNote({ note, book });
    window.__shareRecommendation = (book) => setSharingRec(book);
    window.__editChallenge = (c) => setEditingChallenge(c);
    window.__openAccount = () => setShowAccount(true);
    window.__welcomeNewMember = () => setShowWelcome(true);
    window.__tirarPoeira = (book) => setDustBook(book); // ritual: desperta um adormecido do acervo
    window.__alimentar = () => setShowAlimentar(true); // painel unificado de adicionar (o "+")
    window.__abrirChegada = () => setShowChegada(true); // primeira porta (rever a apresentação)
    window.__setRoute = setRoute; // útil para deep-linking e debug
    return () => {
      delete window.__rerender; delete window.__editBook; delete window.__openBook;
      delete window.__openGrupo; delete window.__shareNote; delete window.__shareRecommendation;
      delete window.__editChallenge; delete window.__openAccount; delete window.__welcomeNewMember;
      delete window.__tirarPoeira; delete window.__abrirChegada; delete window.__setRoute;
      delete window.__alimentar;
    };
  }, []);

  // boas-vindas pós-aprovação no caso de a pessoa ter fechado a tela de espera e
  // voltado já aprovada (a marca 'mg_was_pending' fica deste aparelho). O caminho
  // ao vivo (aprovação enquanto a tela de espera está aberta) usa __welcomeNewMember.
  React.useEffect(() => {
    const id = setTimeout(() => {
      try {
        if (localStorage.getItem('mg_was_pending') === '1'
            && window.__appStatus && window.__appStatus !== 'pending') {
          localStorage.removeItem('mg_was_pending');
          setShowWelcome(true);
        }
      } catch (e) {}
    }, 1200); // dá tempo de a aprovação resolver no boot
    return () => clearTimeout(id);
  }, []);

  // aplica acento ao carregar e a cada mudança
  React.useEffect(() => { applyAccent(prefs.accent); }, [prefs.accent]);

  // link de convite ?join=código — entra no círculo (se logada) ou guarda para depois
  React.useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('join');
    if (!code) return;
    const t = setTimeout(async () => {
      if (!window.MGCloud || !window.MGCloud.available) return;
      const u = await window.MGCloud.currentUser();
      if (u) {
        const { data, error } = await window.MGCloud.groups.join(code);
        window.history.replaceState({}, '', window.location.pathname);
        if (!error && data) setOpenGrupo(data);
        else setRoute('grupos');
      } else {
        // deslogada: guarda o convite e fica na HOME, onde as boas-vindas + o
        // login por e-mail aparecem em destaque (não joga mais em Círculos).
        window.__pendingJoin = code;
        setRoute('home');
      }
    }, 1600);
    return () => clearTimeout(t);
  }, []);

  // Link dedicado do Acervo: abrir em #acervo cai direto na página (bookmarkável,
  // dá pra adicionar à tela inicial); e a URL reflete quando se entra/sai do acervo.
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#acervo') setRoute('acervo');
  }, []);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const base = window.location.pathname + window.location.search;
    if (route === 'acervo' && window.location.hash !== '#acervo') window.history.replaceState({}, '', base + '#acervo');
    else if (route !== 'acervo' && window.location.hash === '#acervo') window.history.replaceState({}, '', base);
  }, [route]);

  const HomeComp = prefs.homeVariant === 'B' ? HomeVariantB
                 : prefs.homeVariant === 'C' ? HomeVariantC
                 : HomeVariantA;

  const body = (() => {
    switch (route) {
      case 'home':      return <HomeComp onNav={setRoute}/>;
      case 'metas':     return <ScreenMetas onNav={setRoute}/>;
      case 'library':   return <ScreenLibrary onNav={setRoute}/>;
      case 'acervo':    return <ScreenAcervo onNav={setRoute}/>;
      case 'book':      return <ScreenBookDetail book={detailBook} onNav={setRoute} back={bookReturn}/>;
      case 'note':      return <ScreenNoteEditor onNav={setRoute}/>;
      case 'desafios':  return <ScreenMetas onNav={setRoute}/>;
      case 'grupos':    return <ScreenGruposCloud onNav={setRoute}/>;
      case 'foco':      return <ScreenFoco onNav={setRoute}/>;
      case 'addBook':   return <ScreenAddBook onNav={setRoute}/>;
      default:          return <HomeComp onNav={setRoute}/>;
    }
  })();

  // tab bar ativa em qualquer rota exceto Home (que tem sua própria) e note/addBook (full-screen)
  const showTabs = !['note', 'addBook'].includes(route);
  const showFab = ['home', 'book', 'library'].includes(route);

  // mapa rota → tab ativa no tab bar
  const tabForRoute = {
    library: 'library', book: 'library', acervo: 'library',
    desafios: 'desafios', metas: 'desafios',
    grupos: 'grupos',
  };

  // PORTA ÚNICA DO APP: quem entrou mas ainda não foi aprovada vê a tela de espera
  if (typeof window !== 'undefined' && window.__appStatus === 'pending' && typeof ScreenAguardandoApp !== 'undefined') {
    return (
      <DeviceShell dark={prefs.mode === 'dark'}>
        <ScreenAguardandoApp/>
      </DeviceShell>
    );
  }

  return (
    <DeviceShell dark={prefs.mode === 'dark'}>
      {webDesktop && showTabs && typeof WebNav !== 'undefined' && (
        <WebNav
          active={tabForRoute[route] || 'home'}
          onClick={(id) => setRoute(id)}
          dark={prefs.mode === 'dark'}
        />
      )}
      <div className="app-scroll">{body}</div>
      {showTabs && !webDesktop && typeof TabBar !== 'undefined' && (
        <TabBar
          active={tabForRoute[route] || 'home'}
          onClick={(id) => setRoute(id)}
        />
      )}
      {showFab && (
        <button
          aria-label="Adicionar livro"
          onClick={() => setShowAlimentar(true)}
          style={{
            position: 'absolute', right: 18, bottom: 96, zIndex: 70,
            width: 52, height: 52, borderRadius: '50%',
            background: '#2A2620', color: '#F7F1E4',
            border: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 300, lineHeight: 1, paddingBottom: 4,
            boxShadow: '0 6px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(247,241,228,0.08)',
          }}
        >+</button>
      )}
      {showWelcome && typeof WelcomeNewMember !== 'undefined' && (
        <WelcomeNewMember onClose={() => {
          setShowWelcome(false);
          // encadeia a primeira porta (Grande Sertão), só na 1ª vez
          let seen = false;
          try { seen = localStorage.getItem('mg_seen_chegada') === '1'; } catch (e) {}
          if (!seen && typeof ChegadaSequence !== 'undefined') setShowChegada(true);
        }}/>
      )}
      {showChegada && typeof ChegadaSequence !== 'undefined' && (
        <ChegadaSequence onClose={() => setShowChegada(false)}/>
      )}
      {editingBook !== null && (
        <BookEditorSheet
          book={editingBook.id ? editingBook : null}
          onClose={() => setEditingBook(null)}
        />
      )}
      {showAlimentar && typeof AlimentarSheet !== 'undefined' && (
        <AlimentarSheet onClose={() => setShowAlimentar(false)}/>
      )}
      {dustBook !== null && typeof TirarPoeiraSheet !== 'undefined' && (
        <TirarPoeiraSheet
          book={dustBook}
          onClose={() => setDustBook(null)}
        />
      )}
      {openGrupo !== null && (
        <ScreenGrupoDetalheCloud
          grupo={openGrupo}
          onClose={() => setOpenGrupo(null)}
        />
      )}
      {sharingNote !== null && (
        <ShareNoteSheet
          note={sharingNote.note}
          book={sharingNote.book}
          onClose={() => setSharingNote(null)}
        />
      )}
      {sharingRec !== null && typeof ShareRecommendationSheet !== 'undefined' && (
        <ShareRecommendationSheet
          book={sharingRec}
          onClose={() => setSharingRec(null)}
        />
      )}
      {editingChallenge !== null && (
        <ChallengeEditorSheet
          challenge={editingChallenge.id ? editingChallenge : null}
          onClose={() => setEditingChallenge(null)}
        />
      )}
      {showAccount && typeof AccountSheet !== 'undefined' && (
        <AccountSheet onClose={() => setShowAccount(false)}/>
      )}
      <Splash visible={showSplash}/>
    </DeviceShell>
  );
}

// registro do service worker — offline básico + auto-atualização
if ('serviceWorker' in navigator) {
  // Quando um novo service worker assume o controle, recarrega a página uma vez
  // para que a versão recém-publicada entre em vigor automaticamente.
  let _swRefreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (_swRefreshing) return;
    _swRefreshing = true;
    window.location.reload();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      // procura atualização a cada abertura; se houver, instala e troca na hora
      reg.update();
    }).catch(() => {
      // service worker é progressive — falha silencia
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(<MarginaliaApp/>);
