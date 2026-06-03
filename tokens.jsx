// tokens.jsx — shared design tokens for Clube de Leitura
const T = {
  // surfaces
  bone: '#EFE8DA',       // canvas bg
  cream: '#F7F1E4',      // card bg
  paper: '#FBF6EA',      // inset panels
  parchment: '#E8DFC9',  // edges / dividers
  // ink — escurecidos um pouco para mais contraste/legibilidade (mantendo o tom quente)
  ink: '#2A2620',
  brown: '#5C4F3E',   // texto secundário (era #6A5D4E)
  muted: '#6E6352',   // rótulos/legendas (era #8A7E6B — o que mais "lavava")
  hairline: 'rgba(42,38,32,0.16)',     // divisórias um pouco mais definidas (era 0.12)
  hairlineSoft: 'rgba(42,38,32,0.09)',
  // accents
  terra: '#B0533A',       // terracotta — primary
  terraDeep: '#8E3E2A',
  olive: '#5E6B3E',       // secondary
  oliveDeep: '#434E2A',
  ochre: '#C48A2C',       // highlight
  // fonts
  serif: '"Fraunces", "Iowan Old Style", "Hoefler Text", Georgia, serif',
  sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
};

// Book covers — real cover image when ISBN/cover provided, paper-striped placeholder otherwise
// All covers are 2:3ish ratio; size controlled by parent width
// Optional props:
//   isbn — if provided, fetches real cover from Open Library
//   cover — direct URL override (takes precedence over isbn)
function BookCover({ title, author, tone = 'terra', w = 84, h, stripe = true, style = {}, isbn, cover, onClick, book }) {
  // se onClick estiver presente, OU houver `book`, a capa vira clicável
  // (clicar abre o editor via window.__editBook).
  const clickable = !!(onClick || book);
  const handleClick = clickable ? (e) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (onClick) onClick(e);
    else if (book && typeof window.__editBook === 'function') window.__editBook(book);
  } : undefined;
  const interactiveStyle = clickable ? { cursor: 'pointer' } : {};
  const H = h || Math.round(w * 1.45);
  const tones = {
    terra:  { bg: '#B0533A', fg: '#F7E7D6', band: '#8E3E2A' },
    olive:  { bg: '#5E6B3E', fg: '#EAE4CE', band: '#434E2A' },
    ochre:  { bg: '#C48A2C', fg: '#2A2620', band: '#8E6418' },
    ink:    { bg: '#2A2620', fg: '#E8DFC9', band: '#4A3F33' },
    cream:  { bg: '#E8DFC9', fg: '#2A2620', band: '#C8BDA3' },
    sage:   { bg: '#8A9670', fg: '#F2EEDD', band: '#616E4A' },
    rose:   { bg: '#C9836E', fg: '#3A251C', band: '#9E5E4A' },
  };
  const c = tones[tone] || tones.terra;

  // resolve real cover URL
  const realCoverUrl = cover || (isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false` : null);
  const [imgFailed, setImgFailed] = React.useState(false);

  // Render real cover when available and not failed
  if (realCoverUrl && !imgFailed) {
    return (
      <div onClick={handleClick} style={{
        width: w, height: H, position: 'relative', borderRadius: 2,
        boxShadow: '0 1px 2px rgba(0,0,0,0.15), 0 6px 14px rgba(0,0,0,0.12), inset -2px 0 0 rgba(0,0,0,0.1), inset 1px 0 0 rgba(255,255,255,0.07)',
        overflow: 'hidden', flexShrink: 0, background: c.bg,
        ...interactiveStyle,
        ...style,
      }}>
        <img
          src={realCoverUrl}
          alt={title}
          loading="lazy"
          onError={() => setImgFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
        />
      </div>
    );
  }
  // horizontal stripes for paper feel
  const stripeBg = stripe
    ? `repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,0,0,0.04) 3px 4px)`
    : 'none';
  return (
    <div onClick={handleClick} style={{
      width: w, height: H, background: c.bg, color: c.fg,
      position: 'relative', borderRadius: 2,
      boxShadow: '0 1px 2px rgba(0,0,0,0.15), 0 6px 14px rgba(0,0,0,0.12), inset -2px 0 0 rgba(0,0,0,0.1), inset 1px 0 0 rgba(255,255,255,0.07)',
      fontFamily: T.serif,
      overflow: 'hidden',
      flexShrink: 0,
      ...interactiveStyle,
      ...style,
    }}>
      {/* dica de edição quando placeholder */}
      {clickable && (
        <div style={{
          position: 'absolute', top: 6, right: 6, zIndex: 5,
          width: 22, height: 22, borderRadius: '50%',
          background: 'rgba(0,0,0,0.25)', color: c.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, lineHeight: 1, pointerEvents: 'none',
        }}>✎</div>
      )}
      {/* stripes */}
      <div style={{ position: 'absolute', inset: 0, background: stripeBg, pointerEvents: 'none' }}/>
      {/* decorative rule */}
      <div style={{
        position: 'absolute', left: '10%', right: '10%', top: '14%',
        height: 1, background: c.fg, opacity: 0.5,
      }}/>
      <div style={{
        position: 'absolute', left: '10%', right: '10%', bottom: '14%',
        height: 1, background: c.fg, opacity: 0.5,
      }}/>
      {/* title */}
      <div style={{
        position: 'absolute', top: '18%', left: '10%', right: '10%',
        fontSize: Math.max(9, w * 0.13), lineHeight: 1.1,
        fontWeight: 600, letterSpacing: -0.2,
        textWrap: 'balance',
      }}>{title}</div>
      {/* author */}
      <div style={{
        position: 'absolute', bottom: '16%', left: '10%', right: '10%',
        fontSize: Math.max(7, w * 0.08), lineHeight: 1.2,
        fontStyle: 'italic', opacity: 0.85,
      }}>{author}</div>
      {/* center ornament */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        width: w * 0.12, height: w * 0.12,
        borderRadius: '50%',
        border: `1px solid ${c.fg}`, opacity: 0.4,
      }}/>
    </div>
  );
}

// small book spine for shelf rows
function BookSpine({ title, author, tone = 'terra', h = 120, w = 26 }) {
  const tones = {
    terra:  '#B0533A', olive:  '#5E6B3E', ochre:  '#C48A2C',
    ink:    '#2A2620', cream:  '#E8DFC9', sage:   '#8A9670',
    rose:   '#C9836E', plum: '#6E3F4E', navy: '#2E3E55',
  };
  const bg = tones[tone] || tones.terra;
  const fg = (tone === 'cream' || tone === 'ochre') ? '#2A2620' : '#F7E7D6';
  return (
    <div style={{
      width: w, height: h, background: bg, color: fg,
      borderRadius: 1,
      boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.2), inset 1px 0 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.serif, fontSize: Math.max(7, w * 0.3),
      flexShrink: 0,
    }}>
      <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap', padding: '6px 0', fontWeight: 500, letterSpacing: 0.3 }}>
        {title}
      </div>
    </div>
  );
}

// inline icons (stroked, paper-ink feel)
function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.6 }) {
  const s = strokeWidth;
  const paths = {
    home: <><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z"/></>,
    book: <><path d="M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4V4z"/><path d="M4 4v12a4 4 0 014-4h12"/></>,
    bookmark: <><path d="M6 3h12v18l-6-4-6 4V3z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    note: <><path d="M5 3h10l4 4v14H5V3z"/><path d="M15 3v4h4M8 12h8M8 16h8M8 8h4"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5L13 13l-4.5 2.5L11 11l4.5-2.5z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    chevron: <><path d="M9 6l6 6-6 6"/></>,
    quote: <><path d="M7 7h4v6H7a2 2 0 01-2-2V9a2 2 0 012-2zM15 7h4v6h-4a2 2 0 01-2-2V9a2 2 0 012-2z"/></>,
    flame: <><path d="M12 3c0 4-4 5-4 9a4 4 0 008 0c0-2-1-3-2-4M12 21a6 6 0 006-6c0-3-2-4-3-5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill={color}/></>,
    leaf: <><path d="M4 20c0-8 6-14 16-16-1 10-7 16-15 16M4 20l8-8"/></>,
    stack: <><path d="M4 7l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4"/></>,
    tag: <><path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="8" cy="8" r="1.5" fill={color}/></>,
    pen: <><path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3"/></>,
    x: <><path d="M6 6l12 12M18 6L6 18"/></>,
    play: <><path d="M7 4v16l14-8L7 4z" fill={color}/></>,
    share: <><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 11l8-4M8 13l8 4"/></>,
    sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></>,
    arrowRight: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    arrowLeft: <><path d="M19 12H5M11 6l-6 6 6 6"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1" fill={color}/><circle cx="4" cy="12" r="1" fill={color}/><circle cx="4" cy="18" r="1" fill={color}/></>,
    hourglass: <><path d="M7 3h10M7 21h10M7 3l5 9 5-9M7 21l5-9 5 9"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// Circular progress (for "N% lido")
function ProgressRing({ pct = 0, size = 44, stroke = 3, color = T.terra, track = T.parchment, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      {label !== undefined && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.serif, fontSize: size * 0.3, fontWeight: 500, color: T.ink, letterSpacing: -0.5,
        }}>{label}</div>
      )}
    </div>
  );
}

// horizontal progress (for reading linear)
function LinearProgress({ pct = 0, height = 4, color = T.terra, track = T.parchment, style = {} }) {
  return (
    <div style={{ height, background: track, borderRadius: height, overflow: 'hidden', ...style }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: height, transition: 'width 400ms ease' }}/>
    </div>
  );
}

// Retrato do autor — busca thumbnail na Wikipedia (via lib/sources.jsx)
// Cache em sessionStorage; fallback para um monograma serifado se não encontrado.
function AuthorPortrait({ name, size = 56, style = {} }) {
  const [src, setSrc] = React.useState(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    if (!name || typeof Sources === 'undefined') return;
    Sources.authorSummary(name).then(function (r) {
      if (cancelled) return;
      if (r && r.thumbnail) setSrc(r.thumbnail);
      else setFailed(true);
    }).catch(function () { if (!cancelled) setFailed(true); });
    return function () { cancelled = true; };
  }, [name]);

  const initials = (name || '?').split(/\s+/).map(s => s[0]).slice(0, 2).join('').toUpperCase();

  if (src && !failed) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        background: T.parchment, flexShrink: 0,
        boxShadow: 'inset 0 0 0 1px rgba(42,38,32,0.1)',
        ...style,
      }}>
        <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover',
                   filter: 'sepia(0.15) contrast(0.95)', display: 'block' }}/>
      </div>
    );
  }

  // fallback — monograma
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: T.parchment, color: T.brown, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.serif, fontSize: size * 0.4, fontWeight: 500,
      letterSpacing: -0.5, fontStyle: 'italic',
      boxShadow: 'inset 0 0 0 1px rgba(42,38,32,0.1)',
      ...style,
    }}>{initials}</div>
  );
}

// expor explicitamente — Object.assign abaixo não estava capturando AuthorPortrait
window.AuthorPortrait = AuthorPortrait;
Object.assign(window, { T, BookCover, BookSpine, Icon, ProgressRing, LinearProgress, AuthorPortrait });
