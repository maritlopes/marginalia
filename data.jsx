// data.jsx — seeded content (PT-BR) for a personal study book club

// Capas reais via Open Library — usamos cover ID (mais confiável que ISBN).
// `?default=false` força 404 quando o arquivo de imagem não existe,
// ativando o fallback do BookCover (placeholder de papel).
const COVER = (id) => `https://covers.openlibrary.org/b/id/${id}-L.jpg?default=false`;

// status do livro:
//   'reading' — em leitura agora
//   'read'    — lido (em "Lidos")
//   'tbr'     — to-be-read / vou ler (em "TBR")
//   'paused'  — pausado, talvez voltar
const BOOK_STATUS = {
  reading: { id: 'reading', label: 'Lendo', color: '#B0533A' },
  read:    { id: 'read',    label: 'Lido',  color: '#5E6B3E' },
  tbr:     { id: 'tbr',     label: 'TBR',   color: '#C48A2C' },
  paused:  { id: 'paused',  label: 'Pausado', color: '#8A7E6B' },
};

const BOOK_CURRENT = {
  id: 'meditacoes',
  title: 'Meditações',
  author: 'Marco Aurélio',
  tone: 'terra',
  pages: 304,
  currentPage: 182,
  started: '12 mar',
  startedAt: '2026-03-12',
  theme: 'Estoicismo',
  pct: 60,
  status: 'reading',
  chapter: 'Livro IV — Sobre a natureza',
  blurb: 'Anotações pessoais do imperador romano sobre virtude, razão e a brevidade da vida.',
  nextSession: '22 abr · quinta · 20h',
  cover: COVER(13264786),  // Marco Aurélio — Meditações (edição PT-BR com louro)
};

// Os seeds (exceto Meditações) ficam com placeholders de papel — a busca
// automática do Open Library devolve falsos positivos com frequência (ISBNs
// reciclados, título parecido em livros diferentes). É mais honesto deixar
// o placeholder e a usuária trocar a capa quando quiser (clica → upload/URL).
const BOOKS = [
  BOOK_CURRENT,
  { id: 'etica', title: 'Ética a Nicômaco', author: 'Aristóteles', tone: 'olive', pct: 100, status: 'read', theme: 'Ética clássica', pages: 352, finishedAt: '2025-11-08' },
  { id: 'tao', title: 'Tao Te Ching', author: 'Lao Tsé', tone: 'cream', pct: 100, status: 'read', theme: 'Taoísmo', pages: 144, finishedAt: '2024-05-15' },
  { id: 'carta', title: 'Cartas a Lucílio', author: 'Sêneca', tone: 'ochre', pct: 35, status: 'paused', theme: 'Estoicismo', pages: 488, startedAt: '2026-02-01' },
  { id: 'rep', title: 'A República', author: 'Platão', tone: 'ink', pct: 0, status: 'tbr', theme: 'Filosofia política', pages: 512 },
  { id: 'bhag', title: 'Bhagavad Gita', author: 'Anônimo', tone: 'rose', pct: 0, status: 'tbr', theme: 'Espiritualidade', pages: 208 },
  { id: 'montaigne', title: 'Ensaios', author: 'Montaigne', tone: 'sage', pct: 0, status: 'tbr', theme: 'Humanismo', pages: 640 },
];

const NOTES = [
  {
    id: 'n1',
    book: 'Meditações',
    page: 176,
    chapter: 'IV, 3',
    kind: 'reflexão',
    text: 'Buscar retiros na natureza ou à beira-mar é desnecessário — pode-se, a qualquer hora, retirar-se para dentro de si mesmo. A fortaleza interior.',
    date: 'ontem',
  },
  {
    id: 'n2',
    book: 'Meditações',
    page: 162,
    chapter: 'IV, 17',
    kind: 'citação',
    text: 'Não vivas como se tivesses dez mil anos pela frente. A morte te espreita. Enquanto vives, enquanto é possível — sê bom.',
    date: 'ter, 15 abr',
  },
  {
    id: 'n3',
    book: 'Meditações',
    page: 148,
    chapter: 'III, 10',
    kind: 'pergunta',
    text: 'Por que Marco Aurélio insiste no exercício da morte? Cruzar com "Sobre a brevidade da vida" (Sêneca) p. 42.',
    date: 'sáb, 12 abr',
  },
  {
    id: 'n4',
    book: 'Meditações',
    page: 120,
    chapter: 'II, 11',
    kind: 'resumo',
    text: 'Livro II em 3 pontos: (1) a razão é o guia, (2) o tempo é emprestado, (3) a virtude é o único bem próprio.',
    date: 'qua, 9 abr',
  },
];

const THEMES_STUDY = [
  { id: 'estoi', title: 'Estoicismo', count: 3, color: 'terra', summary: 'Virtude, razão, aceitação do que não se controla.' },
  { id: 'etica', title: 'Ética da virtude', count: 2, color: 'olive', summary: 'Aristóteles e o caráter formado pelo hábito.' },
  { id: 'oriente', title: 'Filosofias do Oriente', count: 2, color: 'ochre', summary: 'Tao, Bhagavad Gita — não-ação e dever.' },
  { id: 'brev', title: 'Brevidade da vida', count: 4, color: 'rose', summary: 'Tema recorrente em Sêneca, Marco Aurélio, Montaigne.' },
];


const ACTIVITY = [
  { t: 'há 2h', text: '12 páginas lidas de Meditações', kind: 'read' },
  { t: 'ontem', text: 'Nova nota em IV, 3 — "fortaleza interior"', kind: 'note' },
  { t: 'ter', text: 'Tema "Brevidade da vida" cruzado com Sêneca', kind: 'link' },
  { t: 'sáb', text: 'Resumo do Livro III registrado', kind: 'summary' },
];

// ─────────────────────────────────────────────────────────────
// PONTES — ecos interdisciplinares (camada Marginália)
// Cada ponte conecta a passagem atual a filosofia / música / arte / cinema / história / literatura
// ─────────────────────────────────────────────────────────────
const PONTES = [
  {
    id: 'p1',
    cat: 'filosofia',
    where: 'Holanda · 1677',
    title: 'Ética, Parte V — De libertate humana',
    author: 'Spinoza',
    why: 'A "fortaleza interior" de Marco Aurélio prefigura a liberdade espinosista: livre é quem age pela razão, não pelas paixões externas.',
    quote: 'A mente humana é parte do intelecto infinito de Deus.',
    nivel: 'profundo',
  },
  {
    id: 'p2',
    cat: 'filosofia',
    where: 'Roma · ~65 d.C.',
    title: 'Cartas a Lucílio, Carta 28',
    author: 'Sêneca',
    why: 'Mesmo gesto: você leva a si mesmo para todo lugar — não é a viagem que cura, é o trabalho interior.',
    quote: 'Animum debes mutare, non caelum.',
    nivel: 'todos',
  },
  {
    id: 'p3',
    cat: 'literatura',
    where: 'Índia · séc. II a.C.',
    title: 'Bhagavad Gita, cap. II',
    author: 'Anônimo',
    why: 'Krishna ensina a Arjuna a "ação sem apego ao fruto" — o estoicismo encontra seu paralelo oriental no karma yoga.',
    quote: 'Cumpre o dever; renuncia ao fruto da ação.',
    nivel: 'intermediario',
  },
  {
    id: 'p4',
    cat: 'musica',
    where: 'Alemanha · 1824',
    title: 'Sinfonia nº 9 — Adagio molto e cantabile',
    author: 'Beethoven',
    why: 'A serenidade que Marco Aurélio descreve como "boa ordem da mente" tem som — meditação melódica, hino interior antes do júbilo coletivo.',
    spotify: true,
    nivel: 'todos',
  },
  {
    id: 'p5',
    cat: 'arte',
    where: 'Itália · 1514',
    title: 'São Jerônimo no estúdio',
    author: 'Albrecht Dürer',
    why: 'O retiro para dentro de si feito imagem — luz, livros, silêncio, a cela como câmara da razão.',
    nivel: 'todos',
  },
  {
    id: 'p6',
    cat: 'cinema',
    where: 'EUA · 2014',
    title: 'Interstellar — cena do silêncio',
    author: 'Christopher Nolan',
    why: 'O "retiro para dentro de si" como plano cinematográfico: o tempo se dilata, o ego se reorganiza diante do cosmos.',
    nivel: 'iniciante',
  },
  {
    id: 'p7',
    cat: 'historia',
    where: 'Império Romano · 161–180',
    title: 'O reinado de Marco Aurélio',
    author: 'contexto histórico',
    why: 'Estas páginas foram escritas em campanha militar contra os marcomanos — o estoicismo prático, não a filosofia de gabinete.',
    nivel: 'todos',
  },
  {
    id: 'p8',
    cat: 'literatura',
    where: 'França · 1580',
    title: 'Ensaios, Livro I — "Da solidão"',
    author: 'Montaigne',
    why: 'Montaigne lê Marco Aurélio e responde com prosa — a cela interior vira o ensaio, gênero próprio do pensar consigo.',
    nivel: 'profundo',
  },
];

const PONTE_CATS = [
  { id: 'todos', label: 'Todos', color: 'terra' },
  { id: 'filosofia', label: 'Filosofia', color: 'plum' },
  { id: 'literatura', label: 'Literatura', color: 'terra' },
  { id: 'musica', label: 'Música', color: 'olive' },
  { id: 'arte', label: 'Arte', color: 'ochre' },
  { id: 'cinema', label: 'Cinema', color: 'ink' },
  { id: 'historia', label: 'História', color: 'rose' },
];

// ─────────────────────────────────────────────────────────────
// GLOSSÁRIO contextual — termos da obra atual
// ─────────────────────────────────────────────────────────────
const GLOSSARIO = [
  { term: 'daimon', def: 'Em estoicismo: a parte divina/racional dentro de cada homem; o "guia interior" que deve dirigir as ações.' },
  { term: 'ataraxia', def: 'Estado de tranquilidade da alma, livre de paixões perturbadoras. Ideal estoico e epicurista.' },
  { term: 'logos', def: 'Razão universal que ordena o cosmos. Para os estoicos, participar do logos é a virtude.' },
  { term: 'hegemonikon', def: 'A faculdade dirigente da alma — onde reside o juízo, a vontade e a assentimento aos impulsos.' },
];


// SEEDS — listas iniciais (usadas como fallback quando não há nada em Storage)
const NOTES_SEED = NOTES;
const BOOKS_SEED = BOOKS;

// Bridges com Storage — quando o Storage está disponível, mescla persistido + seed.
// Re-execute _refreshLive() depois de addNote/addBook para propagar ao próximo render.
function _refreshLive() {
  if (typeof MG !== 'undefined' && MG.getNotes) {
    const storedBooks = MG.getBooks([]);
    const storedNotes = MG.getNotes([]);
    if (storedBooks.length === 0) {
      // Estante ainda vazia: mostramos os livros de exemplo como vitrine,
      // para a leitora ver como o app funciona antes de cadastrar os seus.
      window.BOOKS = BOOKS_SEED;
      window.__demoShelf = true;   // vitrine: não contar nas estatísticas
    } else {
      window.__demoShelf = false;
      // A leitora já tem livros próprios: a estante passa a mostrar SÓ os dela
      // (os exemplos desaparecem). Um seed que ela tenha editado/adotado
      // continua aparecendo, com as edições aplicadas.
      const storedById = new Map(storedBooks.map(b => [b.id, b]));
      const newBooks = storedBooks.filter(b => !BOOKS_SEED.some(s => s.id === b.id));
      const adoptedSeeds = BOOKS_SEED
        .filter(s => storedById.has(s.id))
        .map(s => ({ ...s, ...storedById.get(s.id) }));
      window.BOOKS = [...newBooks, ...adoptedSeeds];
    }
    // Mesma lógica para as notas: exemplos só enquanto não há nota própria.
    window.NOTES = storedNotes.length ? storedNotes : NOTES_SEED;
  } else {
    window.NOTES = NOTES_SEED;
    window.BOOKS = BOOKS_SEED;
    window.__demoShelf = true;
  }
}

// Livro "atual" mostrado na home e no detalhe quando nenhum livro específico
// foi escolhido: o que está em leitura; se nenhum, o primeiro pausado; senão o
// primeiro da estante; e, por fim, o livro de exemplo (estante vazia).
function currentBook() {
  const bs = window.BOOKS || [];
  const reading = bs.filter(b => b.status === 'reading');
  if (reading.length) {
    // o livro marcado como "Lendo" mais recentemente fica em primeiro
    reading.sort((a, b) => String(b.readingSince || '').localeCompare(String(a.readingSince || '')));
    return reading[0];
  }
  return bs.find(b => b.status === 'paused') || bs[0] || BOOK_CURRENT;
}

// ─────────────────────────────────────────────────────────────
// FRASES MARCANTES — citações de livros para a seção "Para guardar".
// A home escolhe uma por dia (gira pela coleção). { pt, en, autor, obra }
// ─────────────────────────────────────────────────────────────
const FRASES_MARCANTES = [
  { pt: 'Um leitor vive mil vidas antes de morrer. Quem nunca lê vive uma só.', en: 'A reader lives a thousand lives before dying. The man who never reads lives only one.', autor: 'George R. R. Martin', obra: 'Uma Dança com Dragões' },
  { pt: 'Os verdadeiros analfabetos são os que aprenderam a ler e não leem.', en: 'The true illiterates are those who learned to read and do not read.', autor: 'Mario Quintana', obra: 'Da Preguiça como Método de Trabalho' },
  { pt: 'Se podes olhar, vê. Se podes ver, repara.', en: 'If you can look, see. If you can see, observe.', autor: 'José Saramago', obra: 'Ensaio sobre a Cegueira' },
  { pt: 'O poeta é um fingidor. Finge tão completamente que chega a fingir que é dor a dor que deveras sente.', en: 'The poet is a faker. He fakes so completely that he even fakes the pain he truly feels.', autor: 'Fernando Pessoa', obra: 'Autopsicografia' },
  { pt: 'Um livro deve ser o machado para o mar congelado dentro de nós.', en: 'A book must be the axe for the frozen sea within us.', autor: 'Franz Kafka', obra: 'Carta a Oskar Pollak' },
  { pt: 'Verde, que te quero verde.', en: 'Green, how I want you green.', autor: 'Federico García Lorca', obra: 'Romance Sonâmbulo' },
  { pt: 'Viver é muito perigoso.', en: 'Living is very dangerous.', autor: 'Guimarães Rosa', obra: 'Grande Sertão: Veredas' },
  { pt: 'Tudo no mundo começou com um sim.', en: 'Everything in the world began with a yes.', autor: 'Clarice Lispector', obra: 'A Hora da Estrela' },
  { pt: 'Ao vencedor, as batatas.', en: 'To the victor, the potatoes.', autor: 'Machado de Assis', obra: 'Quincas Borba' },
  { pt: 'O essencial é invisível aos olhos.', en: 'What is essential is invisible to the eye.', autor: 'Saint-Exupéry', obra: 'O Pequeno Príncipe' },
  { pt: 'Navegar é preciso; viver não é preciso.', en: 'To sail is necessary; to live is not.', autor: 'Fernando Pessoa', obra: 'Navegar é Preciso' },
  { pt: 'A liberdade é pouco. O que desejo ainda não tem nome.', en: 'Freedom is not enough. What I want still has no name.', autor: 'Clarice Lispector', obra: 'Perto do Coração Selvagem' },
  { pt: 'A beleza salvará o mundo.', en: 'Beauty will save the world.', autor: 'Dostoiévski', obra: 'O Idiota' },
  { pt: 'Todas as famílias felizes se parecem; cada infeliz o é à sua maneira.', en: 'All happy families are alike; each unhappy family is unhappy in its own way.', autor: 'Tolstói', obra: 'Anna Kariênina' },
  { pt: 'Sempre imaginei o Paraíso como uma espécie de biblioteca.', en: 'I have always imagined that Paradise will be a kind of library.', autor: 'Jorge Luis Borges', obra: 'Poema dos Dons' },
  { pt: 'No meio do caminho tinha uma pedra.', en: 'In the middle of the road there was a stone.', autor: 'Carlos Drummond de Andrade', obra: 'No Meio do Caminho' },
  { pt: 'É a tua hora e a tua vez. É hora e vez. De abrir a casa para a alegria.', en: 'It is your hour and your turn — to open the house to joy.', autor: 'Cora Coralina', obra: 'Vintém de Cobre' },
  { pt: 'Um quarto só seu — e dinheiro — para escrever ficção.', en: 'A room of one’s own and money, to write fiction.', autor: 'Virginia Woolf', obra: 'Um Teto Todo Seu' },
];

// ─────────────────────────────────────────────────────────────
// HOJE NA MARGINÁLIA — banner rotativo (curadoria editorial)
// Cada item: {kind, headline_pt, headline_en, sub_pt, sub_en, accent}
// kind: 'premio' | 'lancamento' | 'efemeride' | 'reedicao' | 'citacao' | 'resenha'
// ─────────────────────────────────────────────────────────────
// Atualizado semanalmente (rotina de segunda) — semana de 2 a 8 de junho de 2026.
const HOJE_BANNER = [
  {
    id: 'h1', kind: 'efemeride', accent: 'olive',
    headline_pt: '6 de junho · nascimento de Thomas Mann (1875)',
    headline_en: 'June 6 · birth of Thomas Mann (1875)',
    sub_pt: '"A Montanha Mágica" e "Doutor Fausto" — releia o mestre.',
    sub_en: 'Revisit the master of "The Magic Mountain".',
  },
  {
    id: 'h2', kind: 'efemeride', accent: 'plum',
    headline_pt: '3 de junho · há 102 anos, a morte de Kafka (1924)',
    headline_en: 'June 3 · 102 years since Kafka’s death (1924)',
    sub_pt: 'O Processo, O Castelo, A Metamorfose.',
    sub_en: 'The Trial, The Castle, The Metamorphosis.',
  },
  {
    id: 'h3', kind: 'premio', accent: 'ochre',
    headline_pt: 'Prêmio Jabuti 2026: inscrições encerradas',
    headline_en: 'Jabuti Award 2026: entries are closed',
    sub_pt: 'Finalistas e vencedores saem no segundo semestre.',
    sub_en: 'Finalists and winners come in the second half of the year.',
  },
  {
    id: 'h4', kind: 'citacao', accent: 'terra',
    headline_pt: '"Que outros se gabem das páginas que escreveram; eu me orgulho das que li."',
    headline_en: '"Let others boast of the pages they have written; I take pride in those I have read."',
    sub_pt: 'Jorge Luis Borges',
    sub_en: 'Jorge Luis Borges',
  },
  {
    id: 'h5', kind: 'efemeride', accent: 'rose',
    headline_pt: '5 de junho · Federico García Lorca (1898)',
    headline_en: 'June 5 · Federico García Lorca (1898)',
    sub_pt: 'Poesia e teatro que pulsam até hoje.',
    sub_en: 'Poetry and theatre that still pulse today.',
  },
  {
    id: 'h6', kind: 'lancamento', accent: 'sage',
    headline_pt: 'Junho nas livrarias: biografia de Dercy Gonçalves',
    headline_en: 'June in bookstores: a biography of Dercy Gonçalves',
    sub_pt: 'Por Adriana Negreiros · Objetiva.',
    sub_en: 'By Adriana Negreiros · Objetiva.',
  },
];

// ─────────────────────────────────────────────────────────────
// CURADORIA — lista mais longa (visualizada em "ver mais")
// ─────────────────────────────────────────────────────────────
// Atualizada semanalmente (rotina de segunda) — semana de 2 a 8 de junho de 2026.
// CURADORIA = voz editorial do clube: curiosidades, conexões, contexto, tema do mês.
// ÂNCORA EDITORIAL: cada card diz POR QUE existe — por um RÓTULO ou por uma DATA.
//  • `anchor_pt`/`anchor_en` → rótulo contextual (você sabia?, conexão literária, contexto…).
//  • `date` → quando a DATA é o argumento: toda EFEMÉRIDE (a tarja mostra o dia do fato,
//    ex.: '03 jun') e anos que enquadram a obra (ex.: '1947'). ATEMPORAL: a efeméride traz
//    a data do próprio fato, nunca "hoje"/"esta semana" (o conteúdo não é atualizado todo dia).
const CURADORIA = [
  { id: 'c1', kind: 'curiosidade', anchor_pt: 'você sabia?', anchor_en: 'did you know?',
    title_pt: '"Doutor Fausto" nasceu no exílio',
    title_en: '"Doctor Faustus" was born in exile',
    desc_pt: 'Mann o escreveu na Califórnia (1943–47), inspirado em Nietzsche e na música de Schoenberg.',
    desc_en: 'Mann wrote it in California (1943–47), drawing on Nietzsche and Schoenberg’s music.' },
  { id: 'c2', kind: 'efemeride', date: '05 jun',
    title_pt: '5 de junho: nasce Federico García Lorca (1898)',
    title_en: 'June 5: Federico García Lorca is born (1898)',
    desc_pt: 'Poeta e dramaturgo de Granada — "Romancero Gitano" e "A Casa de Bernarda Alba".',
    desc_en: 'Poet and playwright from Granada — "Gypsy Ballads" and "The House of Bernarda Alba".' },
  { id: 'c3', kind: 'efemeride', date: '03 jun',
    title_pt: 'Kafka morreu num 3 de junho — e quase levou seus livros',
    title_en: 'Kafka died on a June 3 — nearly taking his books with him',
    desc_pt: 'Pediu a Max Brod que queimasse tudo; o amigo desobedeceu e salvou "O Processo".',
    desc_en: 'He asked Max Brod to burn it all; the friend disobeyed and saved "The Trial".' },
  { id: 'c4', kind: 'conexao', anchor_pt: 'conexão literária', anchor_en: 'literary connection',
    title_pt: 'Leu "Doutor Fausto"? Leia o "Fausto" de Goethe',
    title_en: 'Read "Doctor Faustus"? Try Goethe’s "Faust"',
    desc_pt: 'O mito do pacto com o diabo, na fonte que Mann revisita.',
    desc_en: 'The pact-with-the-devil myth, at the source Mann revisits.' },
  { id: 'c5', kind: 'contexto', date: '1947',
    title_pt: 'O mundo em que "Doutor Fausto" veio à luz',
    title_en: 'The world "Doctor Faustus" came into',
    desc_pt: 'Publicado dois anos após a guerra, o romance lê a tragédia alemã pela música.',
    desc_en: 'Out two years after the war, it reads Germany’s tragedy through music.' },
];

// ─────────────────────────────────────────────────────────────
// PARA VOCÊ — sugestões personalizadas por livro lido
// chave: id do livro → array de sugestões
// ─────────────────────────────────────────────────────────────
const SUGESTOES_POR_LIVRO = {
  'meditacoes': [
    { title: 'Cartas a Lucílio', author: 'Sêneca', why_pt: 'O outro pilar do estoicismo romano — em forma epistolar.', why_en: 'The other pillar of Roman stoicism — in letter form.' },
    { title: 'Manual de Epicteto', author: 'Epicteto', why_pt: 'O estoicismo praticado por um ex-escravo. Curto e direto.', why_en: 'Stoicism practiced by a former slave. Short and direct.' },
    { title: 'Bhagavad Gita', author: 'Anônimo', why_pt: 'O paralelo oriental: ação sem apego ao fruto.', why_en: 'The Eastern parallel: action without attachment to fruit.' },
  ],
};

// ─────────────────────────────────────────────────────────────
// Helpers para metas (challenges) — calcula janela de cada período
// ─────────────────────────────────────────────────────────────
function periodWindow(period, ref = new Date(), customStart, customEnd) {
  const y = ref.getFullYear();
  const m = ref.getMonth();
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  switch (period) {
    case 'month': {
      const s = new Date(y, m, 1);
      const e = new Date(y, m+1, 0);
      return { startsAt: fmt(s), endsAt: fmt(e), label: ref.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) };
    }
    case 'bimester': {
      const s = new Date(y, m, 1);
      const e = new Date(y, m+2, 0);
      return { startsAt: fmt(s), endsAt: fmt(e), label: 'Bimestre' };
    }
    case 'trimester': {
      const s = new Date(y, m, 1);
      const e = new Date(y, m+3, 0);
      return { startsAt: fmt(s), endsAt: fmt(e), label: 'Trimestre' };
    }
    case 'semester': {
      const s = new Date(y, m, 1);
      const e = new Date(y, m+6, 0);
      return { startsAt: fmt(s), endsAt: fmt(e), label: 'Semestre' };
    }
    case 'year': {
      return { startsAt: `${y}-01-01`, endsAt: `${y}-12-31`, label: `Ano ${y}` };
    }
    case 'custom': {
      return { startsAt: customStart || fmt(ref), endsAt: customEnd || fmt(ref), label: 'Personalizado' };
    }
    case 'open':
    default:
      return { startsAt: null, endsAt: null, label: 'Sem prazo' };
  }
}

// Tipos de meta disponíveis no editor
const CHALLENGE_TYPES = [
  { id: 'count',  label_pt: 'Por número de livros',  label_en: 'By number of books',  hint_pt: 'ex.: 12 livros em 2026', icon: 'book' },
  { id: 'pages',  label_pt: 'Por número de páginas', label_en: 'By total pages',      hint_pt: 'ex.: 5.000 páginas',     icon: 'list' },
  { id: 'theme',  label_pt: 'Por tema',              label_en: 'By theme',            hint_pt: 'ex.: 4 livros de filosofia oriental', icon: 'tag' },
  { id: 'author', label_pt: 'Por autor',             label_en: 'By author',           hint_pt: 'ex.: toda obra de Clarice Lispector', icon: 'user' },
  { id: 'free',   label_pt: 'Personalizada',         label_en: 'Custom',              hint_pt: 'meta livre, com seu nome e descrição', icon: 'pen' },
];

const CHALLENGE_PERIODS = [
  { id: 'month',     label_pt: 'Mensal',         label_en: 'Monthly' },
  { id: 'bimester',  label_pt: 'Bimensal',       label_en: 'Bimonthly' },
  { id: 'trimester', label_pt: 'Trimestral',     label_en: 'Quarterly' },
  { id: 'semester',  label_pt: 'Semestral',      label_en: 'Semestral' },
  { id: 'year',      label_pt: 'Anual',          label_en: 'Yearly' },
  { id: 'custom',    label_pt: 'Personalizado',  label_en: 'Custom dates' },
  { id: 'open',      label_pt: 'Sem prazo',      label_en: 'Open ended' },
];

// Sugestões de seed de metas (não persistidas — apenas inspiração no editor)
const CHALLENGE_SUGESTOES = [
  { title_pt: '12 livros em 2026', type: 'count', target: 12, period: 'year' },
  { title_pt: '6.000 páginas em 2026', type: 'pages', target: 6000, period: 'year' },
  { title_pt: 'Mês de estoicismo', type: 'theme', target: 2, period: 'month', filter: { theme: 'estoicismo' } },
  { title_pt: 'Trimestre de Clarice', type: 'author', target: 3, period: 'trimester', filter: { author: 'Lispector' } },
  { title_pt: 'Vozes femininas — bimestre', type: 'count', target: 2, period: 'bimester' },
];

// ─────────────────────────────────────────────────────────────
// MEMÓRIA — gera frases sobre o tempo que passa entre você e os livros
// "Faz X dias que abriu Meditações", "Há Y meses você terminou Tao",
// "Esta semana faz 1 ano de Z" — convite poético, não notificação.
// ─────────────────────────────────────────────────────────────
function computeMemorias({ books, notes, today = new Date() } = {}) {
  // na vitrine (estante de exemplos) não há memórias reais
  if (typeof window !== 'undefined' && window.__demoShelf) return [];
  const out = [];
  const dayMs = 1000 * 60 * 60 * 24;

  function daysBetween(d1, d2) {
    return Math.floor((d2.getTime() - new Date(d1).getTime()) / dayMs);
  }

  function plural(n, sing, plur) { return n === 1 ? sing : plur; }

  function timeWord(days) {
    if (days < 7) return `${days} ${plural(days, 'dia', 'dias')}`;
    if (days < 30) {
      const w = Math.round(days / 7);
      return `${w} ${plural(w, 'semana', 'semanas')}`;
    }
    if (days < 365) {
      const m = Math.round(days / 30);
      return `${m} ${plural(m, 'mês', 'meses')}`;
    }
    let y = Math.floor(days / 365);
    let restMonths = Math.round((days - y * 365) / 30);
    if (restMonths >= 12) { y += Math.floor(restMonths / 12); restMonths = restMonths % 12; }
    if (restMonths === 0) return `${y} ${plural(y, 'ano', 'anos')}`;
    return `${y} ${plural(y, 'ano', 'anos')} e ${restMonths} ${plural(restMonths, 'mês', 'meses')}`;
  }

  // 1. Livros em leitura — quanto tempo desde abertura
  const reading = (books || []).filter(b => b.status === 'reading' && b.startedAt);
  reading.forEach(b => {
    const days = daysBetween(b.startedAt, today);
    if (days < 0) return;
    let text;
    if (days === 0) text = `Você começou *${b.title}* hoje.`;
    else if (days < 7) text = `Faz ${days} ${plural(days, 'dia', 'dias')} que abriu *${b.title}*.`;
    else if (days < 30) text = `Há ${timeWord(days)} você lê *${b.title}*. Sem pressa.`;
    else if (days < 90) text = `${timeWord(days)} caminhando com *${b.title}*.`;
    else if (days < 180) text = `*${b.title}* te acompanha há ${timeWord(days)}. Vale uma sessão hoje?`;
    else text = `Faz ${timeWord(days)} desde a primeira página de *${b.title}*. O ritmo é seu.`;
    out.push({ kind: 'leitura_em_curso', text, days, bookId: b.id });
  });

  // 2. Livros lidos — quanto tempo desde o término
  const finished = (books || []).filter(b => b.status === 'read' && b.finishedAt);
  finished.forEach(b => {
    const days = daysBetween(b.finishedAt, today);
    if (days < 0) return;
    let text;
    if (days === 0) text = `Hoje você terminou *${b.title}*.`;
    else if (days === 30) text = `Faz um mês que terminou *${b.title}*. O que ficou?`;
    else if (days === 180) text = `Há seis meses você fechou *${b.title}*.`;
    else if (days === 365) text = `Faz exatamente um ano de *${b.title}*. Releia uma página.`;
    else if (days % 365 === 0 && days >= 365) text = `${days/365} ${plural(days/365, 'ano', 'anos')} desde *${b.title}*.`;
    else if (days < 30) text = `Há ${timeWord(days)} você fechou *${b.title}*.`;
    else if (days < 365) text = `*${b.title}* fechou há ${timeWord(days)}.`;
    else text = `*${b.title}* — lido faz ${timeWord(days)}.`;
    out.push({ kind: 'lido_passado', text, days, bookId: b.id });
  });

  // 3. Pausados há muito — convite suave
  const paused = (books || []).filter(b => b.status === 'paused' && b.startedAt);
  paused.forEach(b => {
    const days = daysBetween(b.startedAt, today);
    if (days < 30) return;
    out.push({
      kind: 'pausado',
      text: `*${b.title}* está em pausa há ${timeWord(days)}. Voltar ou liberar?`,
      days, bookId: b.id,
    });
  });

  return out;
}

Object.assign(window, {
  BOOK_CURRENT, NOTES_SEED, BOOKS_SEED, THEMES_STUDY, ACTIVITY,
  PONTES, PONTE_CATS, GLOSSARIO,
  BOOK_STATUS, HOJE_BANNER, FRASES_MARCANTES, CURADORIA, SUGESTOES_POR_LIVRO,
  CHALLENGE_TYPES, CHALLENGE_PERIODS, CHALLENGE_SUGESTOES, periodWindow,
  computeMemorias,
  _refreshLive,
  currentBook,
});

_refreshLive();
