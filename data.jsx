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

// ─────────────────────────────────────────────────────────────
// AS TRÊS VISÕES DA BIBLIOTECA — eixos ortogonais sobre UM só livro
//   posse   →  owned : true  = tenho (Minha biblioteca / catálogo)
//                      false = Lista de desejos (quero comprar)
//   leitura →  status: null/ausente = dorme (só no catálogo)
//                      'tbr'=quero ler · 'reading'/'paused'=lendo · 'read'=lido
// A Estante de leitura é o subconjunto "aceso" (status ≠ null), curado e curto;
// o catálogo é a verdade e o histórico. Um livro pode estar em mais de uma visão.
// Retrocompat (migração virtual, sem reescrever dado): livro sem o campo `owned`
// conta como owned:true — todo livro antigo é um livro que a leitora tem.
// O desejo nasce com owned:false EXPLÍCITO; ao "comprar", vira owned:true (dorme).
// ─────────────────────────────────────────────────────────────
const SHELF_STATUS = ['reading', 'paused', 'tbr', 'read'];
function bookOwned(b)   { return !!b && b.owned !== false; }
function bookOnShelf(b) { return !!b && SHELF_STATUS.indexOf(b.status) !== -1; }
function bookDormant(b) { return bookOwned(b) && !bookOnShelf(b); } // no catálogo, ainda dorme
// MARCA DE LEITURA do acervo (campo `mark`: 'tbr'/'reading'/'read'): intenção que a
// leitora registra fora da Estante — ex.: marcando um laureado na /nobel/. Só vale
// enquanto o livro dorme (sem status); ao "tirar a poeira", vira status real + capa.
function bookMark(b) { return (b && bookDormant(b) && b.mark) ? b.mark : null; }
// Reparte uma lista de livros nas três visões (e nas seções da Estante),
// sem duplicar nenhum dado — tudo derivado dos eixos owned × status.
function libraryViews(books) {
  const bs = Array.isArray(books) ? books : [];
  return {
    desejos:  bs.filter(b => !bookOwned(b)),                              // Lista de desejos
    catalogo: bs.filter(bookOwned),                                      // Minha biblioteca (tudo que tem)
    estante:  bs.filter(bookOnShelf),                                    // Estante de leitura (aceso)
    dormem:   bs.filter(bookDormant),                                    // "Os que ainda dormem"
    lendo:    bs.filter(b => b.status === 'reading' || b.status === 'paused'),
    quero:    bs.filter(b => b.status === 'tbr'),
    lidos:    bs.filter(b => b.status === 'read'),
  };
}

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

// ─────────────────────────────────────────────────────────────
// ECOS CURADOS — ressonâncias feitas à mão para obras canônicas.
// Quando o livro aberto casa com uma chave aqui, o app mostra ESTES ecos
// (curadoria do clube) no lugar de gerar com IA. Somamos obras lote a lote.
// Casa pelo título (ignora acentos/pontuação; basta o miolo do título bater).
// ─────────────────────────────────────────────────────────────
function _normTitle(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}
const ECOS_CURADOS = {
  'grande sertao': [
    { id: 'gs1', cat: 'literatura', where: 'Alemanha · 1808',
      title: 'Fausto, Primeira Parte', author: 'Goethe',
      why: 'O suposto pacto de Riobaldo nas Veredas-Mortas ecoa o mito fáustico — só que aqui "o diabo existe é que não existe", e a alma fica na dúvida para sempre.',
      quote: 'Duas almas, ai!, habitam o meu peito.', nivel: 'profundo' },
    { id: 'gs2', cat: 'filosofia', where: 'Grécia · séc. V a.C.',
      title: 'Fragmentos — sobre o rio', author: 'Heráclito',
      why: 'A "travessia" de Riobaldo é o rio de Heráclito: ninguém atravessa o mesmo sertão duas vezes — viver é mudar de margem. Por isso "viver é muito perigoso".',
      quote: 'Não se entra duas vezes no mesmo rio.', nivel: 'profundo' },
    { id: 'gs3', cat: 'literatura', where: 'Brasil · 1902',
      title: 'Os Sertões', author: 'Euclides da Cunha',
      why: 'O mesmo sertão que Euclides mede com a ciência, Rosa atravessa com o mito — a reportagem e a epopeia do mesmo Brasil profundo.',
      nivel: 'intermediario' },
    { id: 'gs4', cat: 'musica', where: 'Brasil · 1930',
      title: 'Bachianas Brasileiras nº 2 — O Trenzinho do Caipira', author: 'Villa-Lobos',
      why: 'O interior do Brasil feito som: Villa-Lobos veste Bach de sertão, como Rosa veste a epopeia de fala roceira.',
      spotify: true, nivel: 'todos' },
    { id: 'gs5', cat: 'arte', where: 'Brasil · 1944',
      title: 'Os Retirantes', author: 'Candido Portinari',
      why: 'A dureza do sertão em tinta — os corpos secos, os urubus, a terra de pedra: o avesso trágico da epopeia de Rosa.',
      nivel: 'todos' },
    { id: 'gs6', cat: 'cinema', where: 'Brasil · 1964',
      title: 'Deus e o Diabo na Terra do Sol', author: 'Glauber Rocha',
      why: 'O sertão místico do Cinema Novo — beato, cangaceiro e coronel; o mesmo bem-e-mal sem fronteira que atormenta Riobaldo, virado imagem.',
      nivel: 'intermediario' },
    { id: 'gs7', cat: 'historia', where: 'Sertão · início do séc. XX',
      title: 'O mundo dos jagunços e do cangaço', author: 'contexto histórico',
      why: 'Riobaldo e Diadorim vivem o sertão dos bandos armados, coronéis e vinganças — o chão de Lampião, antes do asfalto e da lei do Estado.',
      nivel: 'todos' },
  ],
  'doutor fausto': [
    { id: 'df1', cat: 'literatura', where: 'Alemanha · 1808',
      title: 'Fausto, Primeira Parte', author: 'Goethe',
      why: 'A fonte do mito que Mann revisita: o pacto pela grandeza. Em Leverkühn, o diabo não compra a alma — compra vinte e quatro anos de genialidade, ao preço de jamais amar.',
      nivel: 'todos' },
    { id: 'df2', cat: 'musica', where: 'Viena · 1923',
      title: 'Suíte para piano, op. 25', author: 'Arnold Schoenberg',
      why: 'A primeira obra inteiramente dodecafônica — o método que Mann empresta a Leverkühn. Schoenberg protestou, e o romance ganhou uma nota final devolvendo ao "contemporâneo" a invenção.',
      spotify: true, nivel: 'profundo' },
    { id: 'df3', cat: 'filosofia', where: 'Alemanha · 1888',
      title: 'Ecce Homo', author: 'Nietzsche',
      why: 'A vida de Leverkühn refaz a de Nietzsche quase cena a cena — a infecção, o colapso, o longo silêncio. Mann dizia ter escrito, em segredo, um romance sobre ele.',
      nivel: 'profundo' },
    { id: 'df4', cat: 'musica', where: 'Viena · 1822',
      title: 'Sonata para piano nº 32, op. 111', author: 'Beethoven',
      why: 'A conferência de Kretzschmar — "por que Beethoven não escreveu um terceiro movimento" — é uma das grandes páginas do romance: a despedida da forma, antes de Leverkühn despedir-se da harmonia.',
      spotify: true, nivel: 'intermediario' },
    { id: 'df5', cat: 'filosofia', where: 'Alemanha · 1949',
      title: 'Filosofia da Nova Música', author: 'Theodor Adorno',
      why: 'Adorno leu os capítulos musicais do romance ainda em manuscrito e emprestou a Mann sua teoria — o próprio diabo, no capítulo XXV, fala por trechos que ecoam o filósofo.',
      nivel: 'profundo' },
    { id: 'df6', cat: 'cinema', where: 'Hungria · 1981',
      title: 'Mephisto', author: 'István Szabó',
      why: 'Do romance de Klaus Mann, filho de Thomas: o ator que vende o talento ao Reich. O mesmo pacto do pai, descido do mito à carreira — e ao aplauso.',
      nivel: 'intermediario' },
    { id: 'df7', cat: 'historia', where: 'Alemanha · 1933–1945',
      title: 'O pacto de uma nação', author: 'contexto histórico',
      why: 'Mann escreve no exílio californiano enquanto a Alemanha arde: a biografia de Leverkühn é alegoria do país que entregou a alma — música e barbárie na mesma partitura.',
      nivel: 'todos' },
  ],
  'dom casmurro': [
    { id: 'dc1', cat: 'literatura', where: 'Londres · c. 1603',
      title: 'Otelo, o Mouro de Veneza', author: 'Shakespeare',
      why: 'O próprio Bento assiste a Otelo e sai do teatro armando o paralelo: Capitu como Desdêmona. Mas em Machado o lenço não aparece — a prova do ciúme é só o olhar de quem acusa.',
      quote: 'Cuidado, senhor, com o ciúme: é o monstro de olhos verdes.', nivel: 'todos' },
    { id: 'dc2', cat: 'musica', where: 'Milão · 1887',
      title: 'Otello', author: 'Giuseppe Verdi',
      why: 'No capítulo IX, o tenor Marcolini ensina: "a vida é uma ópera". O romance inteiro canta essa partitura — e Verdi acabara de estrear a sua tragédia do ciúme na Scala.',
      spotify: true, nivel: 'intermediario' },
    { id: 'dc3', cat: 'literatura', where: 'EUA · 1960',
      title: 'The Brazilian Othello of Machado de Assis', author: 'Helen Caldwell',
      why: 'O livro que virou a mesa: uma helenista americana releu Bento como narrador que se condena ao narrar. Desde então, a pergunta "Capitu traiu?" trocou de réu.',
      nivel: 'profundo' },
    { id: 'dc4', cat: 'literatura', where: 'França · 1913',
      title: 'Um amor de Swann', author: 'Marcel Proust',
      why: 'Swann e Bento sofrem do mesmo mal: o ciúme que fabrica as próprias provas. Nos dois, a mulher amada importa menos que o tribunal interior que a julga.',
      nivel: 'profundo' },
    { id: 'dc5', cat: 'cinema', where: 'Brasil · 2008',
      title: 'Capitu', author: 'Luiz Fernando Carvalho',
      why: 'A microssérie veste o Rio oitocentista de ópera e anacronismo — e devolve a Capitu os "olhos de ressaca" em close: a força que arrasta, sem nunca confessar.',
      nivel: 'todos' },
    { id: 'dc6', cat: 'historia', where: 'Rio de Janeiro · Segundo Reinado',
      title: 'A corte dos agregados e bacharéis', author: 'contexto histórico',
      why: 'Engenho Novo, Glória, missas e favores: o Brasil de Bento é o da dependência pessoal — José Dias vive de agradar, e até o amor se negocia entre vizinhos de sobrado.',
      nivel: 'todos' },
  ],
  'montanha magica': [
    { id: 'mm1', cat: 'musica', where: 'Viena · 1827',
      title: 'Der Lindenbaum (A tília), do ciclo Winterreise', author: 'Franz Schubert',
      why: 'A canção que Hans Castorp ama acima de todas — e que leva consigo para a guerra, na última cena. Mann a chama de "fruto da morte": a beleza que seduz para o abismo.',
      spotify: true, nivel: 'intermediario' },
    { id: 'mm2', cat: 'literatura', where: 'França · 1913–1927',
      title: 'Em busca do tempo perdido', author: 'Marcel Proust',
      why: 'Os dois grandes romances do tempo, escritos em paralelo: lá embaixo o tempo galopa, na montanha ele dilata — sete anos que passam como sete dias, e vice-versa.',
      nivel: 'profundo' },
    { id: 'mm3', cat: 'filosofia', where: 'Alemanha · 1918',
      title: 'O declínio do Ocidente', author: 'Oswald Spengler',
      why: 'O duelo Settembrini × Naphta respira este ar de fim de civilização: razão iluminista e absolutismo místico disputando a alma de um engenheiro burguês.',
      nivel: 'profundo' },
    { id: 'mm4', cat: 'arte', where: 'Suíça · 1914–1915',
      title: 'A agonia de Valentine Godé-Darel', author: 'Ferdinand Hodler',
      why: 'Enquanto Mann inventava seu sanatório, Hodler pintava, tela após tela, a amada morrendo — a doença como paisagem íntima, na mesma Suíça do romance.',
      nivel: 'intermediario' },
    { id: 'mm5', cat: 'cinema', where: 'Itália · 2015',
      title: 'A Juventude (Youth)', author: 'Paolo Sorrentino',
      why: 'Um hotel nos Alpes suíços onde o tempo paira: velhos artistas, curas e varandas — o sanatório de Davos reencarnado em imagem contemporânea.',
      nivel: 'todos' },
    { id: 'mm6', cat: 'historia', where: 'Sarajevo · 28 de junho de 1914',
      title: 'O estopim da Grande Guerra', author: 'contexto histórico',
      why: 'O "trovão" que encerra o romance: o tiro de Sarajevo esvazia o sanatório e atira Hans Castorp, depois de sete anos suspensos, na lama das trincheiras.',
      nivel: 'todos' },
  ],
  'hora da estrela': [
    { id: 'he1', cat: 'musica', where: 'Milão · 1832',
      title: 'Una furtiva lagrima (O elixir do amor)', author: 'Gaetano Donizetti',
      why: 'A ária que Macabéa ouve na Rádio Relógio e que a faz chorar sem saber por quê — a beleza atravessando, por um instante, uma vida a que quase nada foi dado.',
      spotify: true, nivel: 'todos' },
    { id: 'he2', cat: 'cinema', where: 'Brasil · 1985',
      title: 'A Hora da Estrela', author: 'Suzana Amaral',
      why: 'Marcélia Cartaxo deu rosto a Macabéa e levou o Urso de Prata em Berlim: o filme encontra a dignidade exata — sem piedade, sem caricatura — que o romance exige.',
      nivel: 'todos' },
    { id: 'he3', cat: 'literatura', where: 'Brasil · 1938',
      title: 'Vidas Secas', author: 'Graciliano Ramos',
      why: 'Antes de Macabéa, Fabiano: nordestinos a quem faltam as palavras. Graciliano seca a frase, Clarice a inunda — dois caminhos opostos para dizer quem não sabe se dizer.',
      quote: 'Você é um bicho, Fabiano.', nivel: 'intermediario' },
    { id: 'he4', cat: 'filosofia', where: 'França · 1947',
      title: 'A gravidade e a graça', author: 'Simone Weil',
      why: 'Rodrigo S.M. se obriga a olhar Macabéa devagar, sem desviar — o exercício que Weil chamou de atenção: a forma mais rara de generosidade, e a única que salva.',
      quote: 'A atenção é a forma mais rara e mais pura da generosidade.', nivel: 'profundo' },
    { id: 'he5', cat: 'historia', where: 'Brasil · anos 1950–1970',
      title: 'O êxodo nordestino', author: 'contexto histórico',
      why: 'Macabéa, alagoana datilógrafa no Rio, é uma entre milhões: as décadas em que o Nordeste se despejou no Sudeste — e a cidade grande aprendeu a não os ver.',
      nivel: 'todos' },
  ],
};
// casa pelo miolo do título (ex.: "Grande Sertão: Veredas" → 'grande sertao')
function curatedEcos(book) {
  const t = _normTitle(book && book.title);
  if (!t) return null;
  for (const key in ECOS_CURADOS) {
    if (t.indexOf(key) !== -1) return ECOS_CURADOS[key];
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// PONTES ENTRE OBRAS — liga os livros DA SUA ESTANTE entre si
// ─────────────────────────────────────────────────────────────
// O diferencial da leitora: enquanto os ECOS apontam para FORA (música, arte,
// cinema), as PONTES ligam DOIS LIVROS. Duas fontes:
//   1. curadas à mão (pares canônicos abaixo) — `a`/`b` = miolos de título
//      normalizados que casam o livro aberto; `aT/aA` e `bT/bA` = título/autor
//      de exibição de cada lado; `motif` = rótulo curto; `why` = por que
//      conversam. Se o OUTRO livro está na estante → vira link pra ele; se NÃO
//      está → vira SUGESTÃO com "+ quero ler" (estantes crescem devagar — a
//      ponte é também um convite de leitura).
//   2. automática por MESMO AUTOR (rótulo "Mesma pena", só dentro da estante).
const PONTES_OBRAS = [
  { a: 'doutor fausto', aT: 'Doutor Fausto', aA: 'Thomas Mann',
    b: 'fausto', bX: 'doutor fausto', bT: 'Fausto', bA: 'Goethe', motif: 'O pacto',
    why: 'O "Fausto" de Goethe é a fonte do mito — o sábio que vende a alma ao diabo. Mann reescreve a lenda no século XX e faz dela a alegoria de uma Alemanha que pactua com a própria ruína.' },
  { a: 'doutor fausto', aT: 'Doutor Fausto', aA: 'Thomas Mann',
    b: 'grande sertao', bT: 'Grande Sertão: Veredas', bA: 'João Guimarães Rosa', motif: 'O pacto e a travessia',
    why: 'Riobaldo crê ter vendido a alma nas Veredas-Mortas; o compositor de Mann assina o seu pacto pela música. Dois homens à beira do abismo — só que no sertão "o diabo existe é que não existe".' },
  { a: 'grande sertao', aT: 'Grande Sertão: Veredas', aA: 'João Guimarães Rosa',
    b: 'cabeca do santo', bT: 'A Cabeça do Santo', bA: 'Socorro Acioli', motif: 'O Brasil profundo',
    why: 'O sertão mítico de Rosa e a cidadezinha de milagres de Socorro Acioli pisam o mesmo chão: o Nordeste onde o sagrado popular, o sonho e a violência se misturam sem fronteira.' },
  { a: 'montanha magica', aT: 'A Montanha Mágica', aA: 'Thomas Mann',
    b: 'graca infinita', bT: 'Graça Infinita', bA: 'David Foster Wallace', motif: 'O romance-mundo',
    why: 'Um sanatório nos Alpes, uma clínica na América: dois romances-enciclopédia que prendem o leitor num lugar fechado e o transformam num mundo inteiro — o tempo, a doença e o tédio como matéria de arte.' },
  { a: 'intermitencias da morte', aT: 'As Intermitências da Morte', aA: 'José Saramago',
    b: 'mattia pascal', bT: 'O Falecido Mattia Pascal', bA: 'Luigi Pirandello', motif: 'A morte que falha',
    why: 'Em Saramago a morte simplesmente para de agir; em Pirandello um homem é dado por morto e ganha uma vida nova. Duas fábulas sobre o que acontece quando a morte erra a página.' },
  { a: 'grande sertao', aT: 'Grande Sertão: Veredas', aA: 'João Guimarães Rosa',
    b: 'guimaraes rosa biografia', bT: 'João Guimarães Rosa — Biografia', bA: 'Leonencio Nossa', motif: 'A obra e a vida',
    why: 'O romance e a biografia de quem o escreveu — atravesse a ficção e depois o sertão real de João Guimarães Rosa: diplomata, médico e ouvinte incansável da fala do interior.' },
  // pares canônicos universais — para estantes que ainda estão começando
  { a: 'dom casmurro', aT: 'Dom Casmurro', aA: 'Machado de Assis',
    b: 'otelo', bT: 'Otelo', bA: 'Shakespeare', motif: 'O ciúme',
    why: 'O ciúme que corrói Bentinho ecoa o mouro de Veneza — e Machado cita a peça dentro do próprio romance. Ler os dois é ver a mesma dúvida com trezentos anos de distância.' },
  { a: 'cem anos de solidao', aT: 'Cem Anos de Solidão', aA: 'Gabriel García Márquez',
    b: 'pedro paramo', bT: 'Pedro Páramo', bA: 'Juan Rulfo', motif: 'A semente do realismo mágico',
    why: 'García Márquez dizia saber "Pedro Páramo" de cor — a cidade de mortos de Rulfo abriu a porta por onde Macondo entrou na literatura.' },
  { a: 'ensaio sobre a cegueira', aT: 'Ensaio sobre a Cegueira', aA: 'José Saramago',
    b: 'a peste', bT: 'A Peste', bA: 'Albert Camus', motif: 'A epidemia como espelho',
    why: 'Uma cidade posta em quarentena, uma cegueira branca que se alastra: duas alegorias em que a doença revela o que as pessoas são quando a ordem cai.' },
  { a: 'crime e castigo', aT: 'Crime e Castigo', aA: 'Dostoiévski',
    b: 'o estrangeiro', bT: 'O Estrangeiro', bA: 'Albert Camus', motif: 'O crime e a consciência',
    why: 'Raskólnikov mata por ideia e é devorado pela culpa; Meursault mata por sol e indiferença. Dois assassinos diante do tribunal — um por dentro, outro por fora.' },
  { a: '1984', aT: '1984', aA: 'George Orwell',
    b: 'admiravel mundo novo', bT: 'Admirável Mundo Novo', bA: 'Aldous Huxley', motif: 'Duas distopias',
    why: 'Orwell temia os que proibiriam livros; Huxley, um mundo em que ninguém quereria lê-los. As duas profecias conversam — e cada época decide qual acertou mais.' },
  { a: 'a hora da estrela', aT: 'A Hora da Estrela', aA: 'Clarice Lispector',
    b: 'vidas secas', bT: 'Vidas Secas', bA: 'Graciliano Ramos', motif: 'Os esquecidos',
    why: 'Macabéa e a família de Fabiano: retirantes nordestinos diante de um país que não os vê. Graciliano os narra por fora, com a secura do chão; Clarice, por dentro, até o último suspiro.' },
];
const _PONTE_AUTOR_IGNORA = ['', 'anonimo', 'anonymous', 'varios', 'vario', 'desconhecido', 'contexto historico'];
// Pontes para o livro aberto. Curadas: na estante → {book}; fora → {suggest}.
function pontesNaEstante(book, allBooks) {
  if (!book) return [];
  const me = _normTitle(book.title);
  const mine = allBooks || (typeof window !== 'undefined' ? window.BOOKS : []) || [];
  const out = [];
  const usados = new Set([book.id]);
  const sugeridos = new Set();
  // 1) curadas — casa o título aberto com um dos lados do par e busca o outro
  // (`aX`/`bX` = exclusão: 'fausto' casa Goethe mas NÃO 'doutor fausto' de Mann)
  const _hit = (t, inc, exc) => t.indexOf(inc) !== -1 && (!exc || t.indexOf(exc) === -1);
  for (const p of PONTES_OBRAS) {
    let alvo = null, alvoX = null, alvoT = null, alvoA = null;
    if (_hit(me, p.a, p.aX)) { alvo = p.b; alvoX = p.bX; alvoT = p.bT; alvoA = p.bA; }
    else if (_hit(me, p.b, p.bX)) { alvo = p.a; alvoX = p.aX; alvoT = p.aT; alvoA = p.aA; }
    if (!alvo) continue;
    const outro = mine.find((x) => !usados.has(x.id) && _hit(_normTitle(x.title), alvo, alvoX));
    if (outro) {
      out.push({ book: outro, motif: p.motif, why: p.why, kind: 'curada' });
      usados.add(outro.id);
    } else if (!sugeridos.has(alvo)) {
      // o outro lado não está na estante → ponte vira convite de leitura
      out.push({ suggest: { title: alvoT, author: alvoA }, motif: p.motif, why: p.why, kind: 'sugestao' });
      sugeridos.add(alvo);
    }
  }
  // 2) mesmo autor (ignora autorias genéricas)
  const myA = _normTitle(book.author);
  if (myA && _PONTE_AUTOR_IGNORA.indexOf(myA) === -1) {
    for (const x of mine) {
      if (usados.has(x.id)) continue;
      if (_normTitle(x.author) === myA) {
        out.push({ book: x, motif: 'Mesma pena', why: 'Outra obra de ' + (book.author || 'mesmo autor') + ' na sua estante.', kind: 'autor' });
        usados.add(x.id);
      }
    }
  }
  return out;
}

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
  { pt: 'A vida inteira que podia ter sido e que não foi.', en: 'The whole life that could have been and was not.', autor: 'Manuel Bandeira', obra: 'Pneumotórax' },
  { pt: 'As estirpes condenadas a cem anos de solidão não tinham uma segunda oportunidade sobre a terra.', en: 'Lineages condemned to one hundred years of solitude did not have a second chance on earth.', autor: 'Gabriel García Márquez', obra: 'Cem Anos de Solidão' },
  { pt: 'Quando nasci, um anjo esbelto, desses que tocam trombeta, anunciou: vai carregar bandeira.', en: 'When I was born, a lean angel, the kind that plays the trumpet, announced: she will carry a flag.', autor: 'Adélia Prado', obra: 'Com Licença Poética' },
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
  {
    id: 'h7', kind: 'efemeride', accent: 'plum',
    headline_pt: '16 de novembro · nasce José Saramago (1922)',
    headline_en: 'November 16 · José Saramago is born (1922)',
    sub_pt: 'O único Nobel da língua portuguesa — "Ensaio sobre a Cegueira".',
    sub_en: 'The only Nobel laureate writing in Portuguese — "Blindness".',
  },
  {
    id: 'h8', kind: 'efemeride', accent: 'olive',
    headline_pt: '31 de outubro · nasce Drummond, poeta de Itabira (1902)',
    headline_en: 'October 31 · Drummond, the poet of Itabira, is born (1902)',
    sub_pt: '"No meio do caminho tinha uma pedra."',
    sub_en: '"In the middle of the road there was a stone."',
  },
  {
    id: 'h9', kind: 'citacao', accent: 'sage',
    headline_pt: '"Eu canto porque o instante existe e a minha vida está completa."',
    headline_en: '"I sing because the moment exists and my life is complete."',
    sub_pt: 'Cecília Meireles',
    sub_en: 'Cecília Meireles',
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
  { id: 'c6', kind: 'efemeride', date: '21 jun',
    title_pt: '21 de junho: nasce Machado de Assis (1839)',
    title_en: 'June 21: Machado de Assis is born (1839)',
    desc_pt: 'O menino pobre do Rio que fundou a Academia Brasileira de Letras e a presidiu até o fim.',
    desc_en: 'The poor boy from Rio who founded the Brazilian Academy of Letters and led it to the end.' },
  { id: 'c7', kind: 'conexao', anchor_pt: 'conexão literária', anchor_en: 'literary connection',
    title_pt: 'Leu "Grande Sertão"? Atravesse "Os Sertões"',
    title_en: 'Read "The Devil to Pay in the Backlands"? Cross into "Os Sertões"',
    desc_pt: 'O sertão mítico de Guimarães Rosa e o sertão histórico de Euclides da Cunha — duas faces do mesmo Brasil profundo.',
    desc_en: 'Guimarães Rosa’s mythic backlands and Euclides da Cunha’s historical one — two faces of Brazil’s deep interior.' },
  { id: 'c8', kind: 'premio', anchor_pt: 'no radar', anchor_en: 'on the radar',
    title_pt: 'Nobel de Literatura 2025: László Krasznahorkai',
    title_en: '2025 Nobel Prize in Literature: László Krasznahorkai',
    desc_pt: 'O húngaro das frases-rio, premiado por uma obra que, em meio ao terror apocalíptico, reafirma a arte.',
    desc_en: 'The Hungarian of river-long sentences, honored for work that, amid apocalyptic terror, reaffirms art.' },
  { id: 'c9', kind: 'efemeride', date: '09 dez',
    title_pt: 'Clarice Lispector morre na véspera de seu aniversário',
    title_en: 'Clarice Lispector dies on the eve of her birthday',
    desc_pt: 'Partiu em 9 de dezembro de 1977, um dia antes de completar 57 anos. "Tudo no mundo começou com um sim."',
    desc_en: 'She left on December 9, 1977, a day before turning 57. "Everything in the world began with a yes."' },
  { id: 'c10', kind: 'curiosidade', anchor_pt: 'você sabia?', anchor_en: 'did you know?',
    title_pt: 'O Dia Mundial do Livro é 23 de abril por um motivo',
    title_en: 'World Book Day falls on April 23 for a reason',
    desc_pt: 'Data ligada à morte de Cervantes e de Shakespeare, em 1616 — a UNESCO a consagrou ao livro.',
    desc_en: 'A date tied to the deaths of Cervantes and Shakespeare in 1616 — UNESCO made it the day of the book.' },
  { id: 'c11', kind: 'efemeride', date: '19 nov',
    title_pt: 'Guimarães Rosa morre 3 dias após tomar posse na Academia',
    title_en: 'Guimarães Rosa dies 3 days after taking his Academy seat',
    desc_pt: 'Adiou a cerimônia por quatro anos, temendo a emoção; morreu em 19 de novembro de 1967.',
    desc_en: 'He postponed the ceremony for four years, fearing the emotion; he died on November 19, 1967.' },
  { id: 'c12', kind: 'conexao', anchor_pt: 'conexão literária', anchor_en: 'literary connection',
    title_pt: '"Dom Casmurro" conversa com o "Otelo" de Shakespeare',
    title_en: '"Dom Casmurro" speaks with Shakespeare’s "Othello"',
    desc_pt: 'O ciúme que corrói Bentinho ecoa o mouro de Veneza — e Machado cita a peça dentro do romance.',
    desc_en: 'The jealousy that corrodes Bentinho echoes the Moor of Venice — and Machado cites the play within the novel.' },
  { id: 'c13', kind: 'contexto', anchor_pt: 'contexto histórico', anchor_en: 'historical context',
    title_pt: 'O "boom" que levou a América Latina ao mundo',
    title_en: 'The "boom" that carried Latin America to the world',
    desc_pt: '"Cem Anos de Solidão" (1967), de García Márquez, abriu caminho para Cortázar, Vargas Llosa e Fuentes.',
    desc_en: '"One Hundred Years of Solitude" (1967), by García Márquez, opened the way for Cortázar, Vargas Llosa and Fuentes.' },
];

// ─────────────────────────────────────────────────────────────
// SAZONALIDADE — efeméride só aparece no MÊS dela
// ─────────────────────────────────────────────────────────────
// Regra (Radar e Curadoria): um card com `kind:'efemeride'` só entra na
// rotação do dia DENTRO do seu mês (em junho, só efemérides de junho). Todo o
// resto — você sabia?, conexão, contexto, no radar, citação, lançamento — é
// ATEMPORAL e aparece em qualquer mês (a data ali, quando há, é curiosidade,
// não o argumento do card). O mês da efeméride vem de, nesta ordem:
//   1. `item.month` (1–12, override explícito — opcional, à prova de futuro);
//   2. `item.date` no formato 'DD mmm' (ex.: '21 jun') — usado na Curadoria;
//   3. "DD de <mês>" no texto (headline/título) — usado no Radar (sem `date`).
// Efeméride sem mês legível nunca é escondida (fallback seguro).
const _CUR_MAB = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 };
const _CUR_MFULL = { janeiro: 1, fevereiro: 2, 'março': 3, marco: 3, abril: 4, maio: 5, junho: 6, julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12 };
function _curEfemerideMonth(item) {
  if (!item) return null;
  if (item.month >= 1 && item.month <= 12) return item.month;
  if (item.date) {
    const m = String(item.date).toLowerCase().match(/\b(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\b/);
    if (m) return _CUR_MAB[m[1]];
  }
  const txt = (item.headline_pt || item.title_pt || '').toLowerCase();
  const t = txt.match(/\b\d{1,2}\s+de\s+(janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\b/);
  if (t) return _CUR_MFULL[t[1].replace('marco', 'março')] || _CUR_MFULL[t[1]] || null;
  return null;
}
// true = pode aparecer agora. Atemporal sempre; efeméride só no mês corrente.
function curInSeason(item, now) {
  if (!item || item.kind !== 'efemeride') return true;
  const m = _curEfemerideMonth(item);
  if (m == null) return true;
  return m === ((now || new Date()).getMonth() + 1);
}
window.curInSeason = curInSeason;

// Expõe os blocos editoriais (sementes) no window para que a rotina/nuvem
// possa FUNDIR itens validados da tabela curadoria_items nos mesmos arrays
// que a home renderiza (ver loadCuradoria em lib/cloud.jsx). Mesma referência:
// dar push aqui faz a home enxergar o conteúdo novo após um re-render.
window.HOJE_BANNER = HOJE_BANNER;
window.CURADORIA = CURADORIA;
window.FRASES_MARCANTES = FRASES_MARCANTES;
window.ECOS_CURADOS = ECOS_CURADOS;
window.PONTES_OBRAS = PONTES_OBRAS;
window.pontesNaEstante = pontesNaEstante;

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

// ─── Laureados do Nobel de Literatura ────────────────────────────────────
// Fonte: a lista da página /nobel/ (defaultData), categorias dos VENCEDORES
// (1901–2025). Serve para acender a medalha 🏅 quando a leitora adiciona à
// Biblioteca um livro de autor laureado. Triplas [autor, ano, país].
// ⚠️ Espelho manual: ao incluir um novo laureado, atualizar aqui E em /nobel/.
const NOBEL_LAUREATES = [
  ['Sully Prudhomme',1901,'França'],['Theodor Mommsen',1902,'Alemanha'],
  ['Bjørnstjerne Bjørnson',1903,'Noruega'],['Frédéric Mistral',1904,'França'],
  ['José Echegaray',1904,'Espanha'],['Henryk Sienkiewicz',1905,'Polônia'],
  ['Giosuè Carducci',1906,'Itália'],['Rudyard Kipling',1907,'Reino Unido'],
  ['Rudolf Eucken',1908,'Alemanha'],['Selma Lagerlöf',1909,'Suécia'],
  ['Paul Heyse',1910,'Alemanha'],['Maurice Maeterlinck',1911,'Bélgica'],
  ['Gerhart Hauptmann',1912,'Alemanha'],['Rabindranath Tagore',1913,'Índia'],
  ['Romain Rolland',1915,'França'],['Verner von Heidenstam',1916,'Suécia'],
  ['Karl Gjellerup',1917,'Dinamarca'],['Henrik Pontoppidan',1917,'Dinamarca'],
  ['Carl Spitteler',1919,'Suíça'],['Knut Hamsun',1920,'Noruega'],
  ['Anatole France',1921,'França'],['Jacinto Benavente',1922,'Espanha'],
  ['W.B. Yeats',1923,'Irlanda'],['William Butler Yeats',1923,'Irlanda'],
  ['Władysław Reymont',1924,'Polônia'],['George Bernard Shaw',1925,'Irlanda'],
  ['Grazia Deledda',1926,'Itália'],['Henri Bergson',1927,'França'],
  ['Sigrid Undset',1928,'Noruega'],['Thomas Mann',1929,'Alemanha'],
  ['Sinclair Lewis',1930,'EUA'],['Erik Axel Karlfeldt',1931,'Suécia'],
  ['John Galsworthy',1932,'Reino Unido'],['Ivan Bunin',1933,'Rússia'],
  ['Luigi Pirandello',1934,'Itália'],['Eugene O’Neill',1936,'EUA'],
  ['Roger Martin du Gard',1937,'França'],['Pearl S. Buck',1938,'EUA'],
  ['Frans Eemil Sillanpää',1939,'Finlândia'],['Johannes V. Jensen',1944,'Dinamarca'],
  ['Gabriela Mistral',1945,'Chile'],['Hermann Hesse',1946,'Alemanha'],
  ['Herman Hesse',1946,'Alemanha'], // alias p/ o typo comum (um 'n' só) — sem ambiguidade

  ['André Gide',1947,'França'],['T.S. Eliot',1948,'Reino Unido'],
  ['Thomas Stearns Eliot',1948,'Reino Unido'],['William Faulkner',1949,'EUA'],
  ['Bertrand Russell',1950,'Reino Unido'],['Pär Lagerkvist',1951,'Suécia'],
  ['François Mauriac',1952,'França'],['Winston Churchill',1953,'Reino Unido'],
  ['Ernest Hemingway',1954,'EUA'],['Halldór Laxness',1955,'Islândia'],
  ['Juan Ramón Jiménez',1956,'Espanha'],['Albert Camus',1957,'França'],
  ['Boris Pasternak',1958,'URSS'],['Salvatore Quasimodo',1959,'Itália'],
  ['Saint-John Perse',1960,'França'],['Ivo Andrić',1961,'Iugoslávia'],
  ['John Steinbeck',1962,'EUA'],['Giorgos Seferis',1963,'Grécia'],
  ['Jean-Paul Sartre',1964,'França'],['Mikhail Sholokhov',1965,'URSS'],
  ['Shmuel Yosef Agnon',1966,'Israel'],['Nelly Sachs',1966,'Alemanha/Suécia'],
  ['Miguel Ángel Asturias',1967,'Guatemala'],['Yasunari Kawabata',1968,'Japão'],
  ['Samuel Beckett',1969,'Irlanda'],['Aleksandr Solzhenitsyn',1970,'URSS'],
  ['Pablo Neruda',1971,'Chile'],['Heinrich Böll',1972,'Alemanha'],
  ['Patrick White',1973,'Austrália'],['Eyvind Johnson',1974,'Suécia'],
  ['Harry Martinson',1974,'Suécia'],['Eugenio Montale',1975,'Itália'],
  ['Saul Bellow',1976,'EUA'],['Vicente Aleixandre',1977,'Espanha'],
  ['Isaac Bashevis Singer',1978,'EUA'],['Odysseas Elytis',1979,'Grécia'],
  ['Czesław Miłosz',1980,'Polônia'],['Elias Canetti',1981,'Bulgária/Reino Unido'],
  ['Gabriel García Márquez',1982,'Colômbia'],['William Golding',1983,'Reino Unido'],
  ['Jaroslav Seifert',1984,'Tcheco-Eslováquia'],['Claude Simon',1985,'França'],
  ['Wole Soyinka',1986,'Nigéria'],['Joseph Brodsky',1987,'URSS/EUA'],
  ['Naguib Mahfouz',1988,'Egito'],['Camilo José Cela',1989,'Espanha'],
  ['Octavio Paz',1990,'México'],['Nadine Gordimer',1991,'África do Sul'],
  ['Derek Walcott',1992,'Santa Lúcia'],['Toni Morrison',1993,'EUA'],
  ['Kenzaburō Ōe',1994,'Japão'],['Seamus Heaney',1995,'Irlanda'],
  ['Wisława Szymborska',1996,'Polônia'],['Dario Fo',1997,'Itália'],
  ['José Saramago',1998,'Portugal'],['Günter Grass',1999,'Alemanha'],
  ['Gao Xingjian',2000,'China/França'],['V.S. Naipaul',2001,'Trinidad/Reino Unido'],
  ['Vidiadhar Surajprasad Naipaul',2001,'Trinidad/Reino Unido'],
  ['Imre Kertész',2002,'Hungria'],['J.M. Coetzee',2003,'África do Sul'],
  ['John Maxwell Coetzee',2003,'África do Sul'],['Elfriede Jelinek',2004,'Áustria'],
  ['Harold Pinter',2005,'Reino Unido'],['Orhan Pamuk',2006,'Turquia'],
  ['Doris Lessing',2007,'Reino Unido'],['J.M.G. Le Clézio',2008,'França'],
  ['Jean-Marie Gustave Le Clézio',2008,'França'],['Herta Müller',2009,'Romênia/Alemanha'],
  ['Mario Vargas Llosa',2010,'Peru'],['Tomas Tranströmer',2011,'Suécia'],
  ['Mo Yan',2012,'China'],['Alice Munro',2013,'Canadá'],
  ['Patrick Modiano',2014,'França'],['Svetlana Alexievich',2015,'Bielorrússia'],
  ['Bob Dylan',2016,'EUA'],['Kazuo Ishiguro',2017,'Reino Unido'],
  ['Olga Tokarczuk',2018,'Polônia'],['Peter Handke',2019,'Áustria'],
  ['Louise Glück',2020,'EUA'],['Abdulrazak Gurnah',2021,'Tanzânia/Reino Unido'],
  ['Annie Ernaux',2022,'França'],['Jon Fosse',2023,'Noruega'],
  ['Han Kang',2024,'Coreia do Sul'],['László Krasznahorkai',2025,'Hungria'],
];

function _normNobelName(s) {
  return (s || '').toString().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}
const _NOBEL_BY_NAME = {};
const _NOBEL_TOKENS = [];
NOBEL_LAUREATES.forEach(([author, ano, pais]) => {
  const n = _normNobelName(author);
  if (!_NOBEL_BY_NAME[n]) _NOBEL_BY_NAME[n] = { ano, pais };
  const toks = n.split(' ');
  _NOBEL_TOKENS.push({ first: toks[0], last: toks[toks.length - 1], ano, pais });
});

// Devolve { ano, pais } se o autor for laureado, senão null.
// Match: nome normalizado exato; depois primeiro+último nome ambos presentes
// (cobre acentos perdidos, ordem trocada e nomes do meio extra; exige os dois
// para não confundir parentes homônimos — ex. Heinrich ≠ Thomas Mann).
function nobelForAuthor(author) {
  const n = _normNobelName(author);
  if (!n) return null;
  if (_NOBEL_BY_NAME[n]) return _NOBEL_BY_NAME[n];
  const toks = n.split(' ');
  for (const L of _NOBEL_TOKENS) {
    if (L.first.length >= 2 && L.last.length >= 3
        && toks.indexOf(L.first) !== -1 && toks.indexOf(L.last) !== -1) {
      return { ano: L.ano, pais: L.pais };
    }
  }
  return null;
}

Object.assign(window, {
  NOBEL_LAUREATES, nobelForAuthor,
  BOOK_CURRENT, NOTES_SEED, BOOKS_SEED, THEMES_STUDY, ACTIVITY,
  PONTES, PONTE_CATS, GLOSSARIO, ECOS_CURADOS, curatedEcos,
  PONTES_OBRAS, pontesNaEstante,
  BOOK_STATUS, SHELF_STATUS, bookOwned, bookOnShelf, bookDormant, bookMark, libraryViews,
  HOJE_BANNER, FRASES_MARCANTES, CURADORIA, SUGESTOES_POR_LIVRO,
  CHALLENGE_TYPES, CHALLENGE_PERIODS, CHALLENGE_SUGESTOES, periodWindow,
  computeMemorias,
  _refreshLive,
  currentBook,
});

_refreshLive();
