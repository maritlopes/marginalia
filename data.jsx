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

const SCHEDULE = [
  { date: '22', dow: 'qui', month: 'abr', label: 'Sessão de estudo', detail: 'Meditações — Livro IV', time: '20h00', kind: 'sessao' },
  { date: '25', dow: 'dom', month: 'abr', label: 'Resumo semanal', detail: 'Consolidar notas da semana', time: 'manhã', kind: 'resumo' },
  { date: '29', dow: 'qui', month: 'abr', label: 'Sessão de estudo', detail: 'Meditações — Livros V–VI', time: '20h00', kind: 'sessao' },
  { date: '06', dow: 'qui', month: 'mai', label: 'Fim do livro', detail: 'Ensaio final + marcos', time: '20h00', kind: 'marco' },
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
// NÍVEIS de leitura — herança do Marginália
// ─────────────────────────────────────────────────────────────
const NIVEIS = [
  {
    id: 'iniciante',
    roman: 'I',
    label: 'Iniciante',
    sub: 'Descobrindo o prazer da leitura profunda',
    features: [
      'Linguagem coloquial e didática',
      '1–2 conexões por sessão',
      'Glossário ativo para palavras difíceis',
      'Prompts de compreensão básica',
    ],
  },
  {
    id: 'intermediario',
    roman: 'II',
    label: 'Intermediário',
    sub: 'Expandindo o repertório com naturalidade',
    features: [
      'Linguagem equilibrada',
      '3–5 conexões inesperadas por sessão',
      'Glossário sob demanda',
      'Prompts de análise estrutural',
      'Mapas conceituais sugeridos',
    ],
  },
  {
    id: 'profundo',
    roman: 'III',
    label: 'Profundo',
    sub: 'Crítica, teoria e bibliografia',
    features: [
      'Linguagem técnica, sem simplificação',
      '5–10 pontes eruditas com bibliografia',
      'Comparativos entre obras e autores',
      'Prompts críticos e teóricos',
      'Comunidade acadêmica',
    ],
  },
];

const NIVEL_ATUAL = 'profundo'; // Mari = leitora avançada

// ─────────────────────────────────────────────────────────────
// DESAFIOS temáticos — leituras com começo, meio e fim
// ─────────────────────────────────────────────────────────────
const DESAFIOS = [
  {
    id: 'd1',
    tag: 'Em destaque',
    title: 'Volta ao mundo em 5 contos',
    desc: 'Cinco continentes, cinco vozes contemporâneas, cinco semanas. Pontes para a música e o cinema de cada país.',
    duracao: '5 semanas',
    lendo: 1247,
    featured: true,
    tone: 'ink',
  },
  {
    id: 'd2',
    tag: 'Vozes femininas',
    title: 'Doze autoras, doze meses',
    desc: 'Lispector, Woolf, Adichie, Ferrante, Han Kang, Carson e outras — uma por mês.',
    duracao: '12 meses',
    lendo: 489,
    tone: 'rose',
  },
  {
    id: 'd3',
    tag: 'Filosofia ↔ Literatura',
    title: 'Mann lê Schopenhauer',
    desc: 'A Montanha Mágica em diálogo com O Mundo como Vontade. Para nível Profundo.',
    duracao: '8 semanas',
    lendo: 132,
    nivel: 'profundo',
    tone: 'olive',
  },
  {
    id: 'd4',
    tag: 'Sertão',
    title: 'Brasil profundo em 4 romances',
    desc: 'Rosa, Acioli, Ana Paula Maia, Itamar Vieira Jr. — cartografia literária do sertão.',
    duracao: '16 semanas',
    lendo: 298,
    tone: 'ochre',
  },
  {
    id: 'd5',
    tag: 'Relâmpago',
    title: 'Um conto num fim de semana',
    desc: 'Tchekhov, Borges, Lispector ou Munro. Comece sexta, termine domingo, encontro de 1h.',
    duracao: '3 dias',
    lendo: 61,
    tone: 'terra',
  },
  {
    id: 'd6',
    tag: 'Estudo pessoal',
    title: 'Meu projeto: Estoicismo',
    desc: 'Marco Aurélio → Sêneca → Epicteto. Cronograma próprio, sem grupo. Em curso.',
    duracao: '6 semanas · vc',
    lendo: null,
    proprio: true,
    tone: 'sage',
  },
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

// ─────────────────────────────────────────────────────────────
// GRUPOS — camada social mínima
// ─────────────────────────────────────────────────────────────
const GRUPOS = [
  // grupo temático sobre o julgamento como tema literário (Kafka, Dostoiévski, Camus)
  // — sem qualquer referência a profissões.
  { id: 'g1', nome: 'O processo & afins', membros: 47, ativ: 'Kafka em curso · 2 notas hoje', tipo: 'aberto',
    tema: 'O julgamento na literatura', livro: 'O Processo', livroAutor: 'Franz Kafka' },
  { id: 'g2', nome: 'Estoicos contemporâneos', membros: 142, ativ: 'Sessão sex 19h', tipo: 'aberto',
    tema: 'Estoicismo', livro: 'Meditações', livroAutor: 'Marco Aurélio' },
  { id: 'g3', nome: 'Sertão e seus avatares', membros: 27, ativ: 'Acioli em curso', tipo: 'fechado',
    tema: 'Brasil profundo', livro: 'Com armas sonolentas', livroAutor: 'Carola Saavedra' },
  { id: 'g4', nome: 'Marco Aurélio · leitura lenta', membros: 34, ativ: 'Livro IV em curso', tipo: 'aberto',
    tema: 'Estoicismo', livro: 'Meditações', livroAutor: 'Marco Aurélio' },
  { id: 'g5', nome: 'Filosofia oriental ao vivo', membros: 89, ativ: 'Tao quintas 20h', tipo: 'aberto',
    tema: 'Filosofia oriental', livro: 'Tao Te Ching', livroAutor: 'Lao Tsé' },
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
    } else {
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
const HOJE_BANNER = [
  {
    id: 'h7', kind: 'premio', accent: 'olive',
    headline_pt: 'Nobel de Literatura: releia o laureado',
    headline_en: 'Nobel Prize in Literature: revisit the laureate',
    sub_pt: 'Um bom momento para conhecer uma voz nova.',
    sub_en: 'A good moment to meet a new voice.',
  },
  {
    id: 'h8', kind: 'efemeride', accent: 'ochre',
    headline_pt: 'Hoje na literatura: um aniversário para celebrar',
    headline_en: 'Today in literature: a birthday to celebrate',
    sub_pt: 'Grandes autores nasceram em todos os dias do ano.',
    sub_en: 'Great authors were born on every day of the year.',
  },
  {
    id: 'h9', kind: 'citacao', accent: 'plum',
    headline_pt: '"O que vale na vida não é o ponto de partida, mas a caminhada."',
    headline_en: '"What matters in life is not the starting point, but the journey."',
    sub_pt: 'Cora Coralina',
    sub_en: 'Cora Coralina',
  },
  {
    id: 'h10', kind: 'reedicao', accent: 'sage',
    headline_pt: 'Reedição: clássicos brasileiros em capa dura',
    headline_en: 'Reissue: Brazilian classics in hardcover',
    sub_pt: 'Machado, Clarice, Guimarães Rosa de cara nova.',
    sub_en: 'Machado, Clarice, Guimarães Rosa with a fresh look.',
  },
  {
    id: 'h11', kind: 'resenha', accent: 'terra',
    headline_pt: 'Resenha da semana: um romance que vale a travessia',
    headline_en: 'Review of the week: a novel worth the crossing',
    sub_pt: 'Da redação de leitores como você.',
    sub_en: 'From readers like you.',
  },
  {
    id: 'h12', kind: 'lancamento', accent: 'rose',
    headline_pt: 'Lançamentos do mês: o que chega às livrarias',
    headline_en: "This month's releases: what's hitting the shelves",
    sub_pt: 'Ficção, ensaio e poesia para acompanhar.',
    sub_en: 'Fiction, essay and poetry to follow.',
  },
  {
    id: 'h1', kind: 'premio', accent: 'terra',
    headline_pt: 'Prêmio Camões 2026: Mia Couto',
    headline_en: 'Camões Prize 2026: Mia Couto',
    sub_pt: 'Pela obra de uma vida. Releia "Terra Sonâmbula".',
    sub_en: 'For a lifetime of work. Revisit "Sleepwalking Land".',
  },
  {
    id: 'h2', kind: 'lancamento', accent: 'olive',
    headline_pt: 'Lançamento: "Os Anéis de Saturno" reedição',
    headline_en: 'New release: "The Rings of Saturn" reissue',
    sub_pt: 'W. G. Sebald · Companhia das Letras · maio 2026',
    sub_en: 'W. G. Sebald · Companhia das Letras · May 2026',
  },
  {
    id: 'h3', kind: 'efemeride', accent: 'ochre',
    headline_pt: '6 de maio · nascimento de Sigmund Freud (1856)',
    headline_en: 'May 6 · birth of Sigmund Freud (1856)',
    sub_pt: '"O Mal-Estar na Civilização" segue atual.',
    sub_en: '"Civilization and Its Discontents" remains current.',
  },
  {
    id: 'h4', kind: 'citacao', accent: 'plum',
    headline_pt: '"O essencial é invisível aos olhos."',
    headline_en: '"What is essential is invisible to the eye."',
    sub_pt: 'Saint-Exupéry · O Pequeno Príncipe',
    sub_en: 'Saint-Exupéry · The Little Prince',
  },
  {
    id: 'h5', kind: 'reedicao', accent: 'rose',
    headline_pt: 'Reedição: "Grande Sertão: Veredas" em capa dura',
    headline_en: 'Reissue: "The Devil to Pay in the Backlands" hardcover',
    sub_pt: 'Guimarães Rosa · Nova Fronteira · 70 anos da publicação',
    sub_en: 'Guimarães Rosa · Nova Fronteira · 70 years since release',
  },
  {
    id: 'h6', kind: 'resenha', accent: 'terra',
    headline_pt: 'Resenha em destaque: Itamar Vieira Junior por Eliane Brum',
    headline_en: 'Featured review: Itamar Vieira Junior by Eliane Brum',
    sub_pt: 'Sobre "Salvar o Fogo" — quatro cinco um, abril 2026',
    sub_en: 'On "Salvar o Fogo" — quatro cinco um, April 2026',
  },
];

// ─────────────────────────────────────────────────────────────
// CURADORIA — lista mais longa (visualizada em "ver mais")
// ─────────────────────────────────────────────────────────────
const CURADORIA = [
  { id: 'c1', kind: 'premio', date: '04 mai',
    title_pt: 'Prêmio Jabuti 2026 — finalistas anunciados',
    title_en: 'Jabuti Award 2026 — finalists announced',
    desc_pt: '40 categorias, mais de 600 obras inscritas.',
    desc_en: '40 categories, over 600 entries.' },
  { id: 'c2', kind: 'lancamento', date: '02 mai',
    title_pt: '"Solenóide" de Mircea Cărtărescu chega ao Brasil',
    title_en: '"Solenoid" by Mircea Cărtărescu lands in Brazil',
    desc_pt: 'Romance-monstro romeno, 800+ páginas.',
    desc_en: 'A monstrous Romanian novel, 800+ pages.' },
  { id: 'c3', kind: 'efemeride', date: '01 mai',
    title_pt: '50 anos de "Cem Anos de Solidão"',
    title_en: '50 years of "One Hundred Years of Solitude"',
    desc_pt: 'García Márquez completaria 99 anos este ano.',
    desc_en: 'García Márquez would have turned 99 this year.' },
  { id: 'c4', kind: 'reedicao', date: '28 abr',
    title_pt: 'Clarice Lispector ganha box completo dos contos',
    title_en: 'Clarice Lispector complete short stories box set',
    desc_pt: 'Rocco · 5 volumes · novo posfácio de Hélène Cixous.',
    desc_en: 'Rocco · 5 volumes · new afterword by Hélène Cixous.' },
  { id: 'c5', kind: 'premio', date: '25 abr',
    title_pt: 'Booker International 2026: vence "Heart Lamp"',
    title_en: 'Booker International 2026: "Heart Lamp" wins',
    desc_pt: 'Banu Mushtaq, contos da Índia rural.',
    desc_en: 'Banu Mushtaq, stories from rural India.' },
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
  BOOK_CURRENT, NOTES_SEED, BOOKS_SEED, THEMES_STUDY, SCHEDULE, ACTIVITY,
  PONTES, PONTE_CATS, NIVEIS, NIVEL_ATUAL, DESAFIOS, GLOSSARIO, GRUPOS,
  BOOK_STATUS, HOJE_BANNER, FRASES_MARCANTES, CURADORIA, SUGESTOES_POR_LIVRO,
  CHALLENGE_TYPES, CHALLENGE_PERIODS, CHALLENGE_SUGESTOES, periodWindow,
  computeMemorias,
  _refreshLive,
  currentBook,
});

_refreshLive();
