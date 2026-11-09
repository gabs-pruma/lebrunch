/**
 * Catálogo de cestas — versão de lançamento (novembro/2026).
 *
 * Tudo aqui vem dos dois catálogos que a Rebeca aprovou em 31/10/2026, na
 * pasta `catalogo-portfolio/` do projeto: o da marca ("Catalogo Le Brunch -
 * FINAL.pdf", 11 modelos em duas linhas) e o de Natal ("Catalogo Natal Le
 * Brunch - FINAL.pdf", 7 modelos). Nomes, itens, preços, "serve" e a frase
 * de cada modelo são os do catálogo — não edite à mão sem uma nova versão
 * dele. A capa de cada modelo é a foto que o catálogo usa; as outras são do
 * mesmo modelo no ensaio de outubro/2026 (`scripts/exportar-ensaio.py`).
 */

export type Secao = {
  titulo: string;
  itens: string[];
};

export type Cesta = {
  slug: string;
  nome: string;
  categoria: CategoriaSlug;
  /** Frase curta de vitrine (a frase do modelo no catálogo). */
  chamada: string;
  /** Preço em reais, sem o frete. `null` quando ainda é sob consulta. */
  preco: number | null;
  /** Ex.: "2 pessoas" */
  serve?: string;
  /** Foto de capa (retrato 2:3, do ensaio). */
  imagem: string | null;
  /**
   * Ponto focal da foto (`object-position`) para os recortes 4:5 e
   * quadrados. Nas fotos de Natal o produto fica na metade de baixo, sob a
   * guirlanda — por isso o foco desce.
   */
  foco?: string;
  /** Ângulos extras da mesma cesta, para a galeria da página do modelo. */
  fotos?: string[];
  secoes: Secao[];
  /** Observação do catálogo (personalização, variação, consulta de valor). */
  observacao?: string;
  /** Dias de antecedência do pedido, quando passa do padrão de 24h. */
  antecedenciaDias?: number;
  /**
   * Opções de embalagem do mesmo modelo. A primeira é a padrão; o modal de
   * pedido pergunta qual a pessoa quer e manda a escolha na mensagem.
   */
  embalagens?: Embalagem[];
  destaque?: boolean;
  /** Modelo ainda sem ficha oficial — nome, itens e preço a confirmar. */
  rascunho?: boolean;
};

export type Embalagem = {
  nome: string;
  descricao: string;
};

export type CategoriaSlug = "classica" | "premium" | "natal";

/** Faixas de preço do filtro (preço da cesta, sem o frete). */
export const faixasDePreco = [
  { slug: "ate-150", nome: "Até R$ 150", curto: "Até R$150", min: 0, max: 150 },
  { slug: "150-300", nome: "R$ 150 a R$ 300", curto: "R$150–300", min: 150.01, max: 300 },
  { slug: "acima-300", nome: "Acima de R$ 300", curto: "+R$300", min: 300.01, max: Infinity },
] as const;

export type Categoria = {
  slug: CategoriaSlug;
  nome: string;
  /** Nome curto, para o menu do topo. */
  nomeCurto: string;
  chamada: string;
  descricao: string;
  /** Foto da linha (retrato), para atalhos e fileiras editoriais. */
  foto: string;
  foco?: string;
  /** Selo curto exibido junto do nome da linha. */
  selo?: string;
  /** Linha com página e identidade visual próprias (ver `/natal`). */
  tema?: "natal";
};

const foto = (nome: string) => `/ensaio/${nome}.webp`;

export const categorias: Categoria[] = [
  {
    slug: "classica",
    nome: "Linha Clássica",
    nomeCurto: "Clássica",
    chamada: "Na nossa base de madeira",
    descricao:
      "Os cafés da manhã na base de madeira, do Cafezinho, para uma pessoa, à Presença, para a mesa toda — e ainda a caixa do café coado e a cesta das crianças.",
    foto: foto("presenca-3"),
  },
  {
    slug: "premium",
    nome: "Linha Premium",
    nomeCurto: "Premium",
    chamada: "Caixas e cestas para ocasiões especiais",
    descricao:
      "A caixa com caneca personalizada, a caixa redonda com bentô cake, a gaveta de frios para brindar e as cestas de vime com flores naturais.",
    foto: foto("primavera-1"),
    foco: "50% 60%",
  },
  {
    slug: "natal",
    nome: "Coleção de Natal",
    nomeCurto: "Natal",
    chamada: "Edição limitada · Natal 2026",
    descricao:
      "Presentes para agradecer a quem esteve junto durante o ano e desejar felicidade e saúde para o ano que se inicia — para a família, um cliente especial ou o funcionário que merece reconhecimento.",
    foto: foto("natal-doces-3"),
    foco: "50% 70%",
    selo: "Edição limitada",
    tema: "natal",
  },
];

/** Endereço da página de cada linha. A de Natal tem página própria. */
export function hrefCategoria(c: Pick<Categoria, "slug" | "tema">): string {
  return c.tema === "natal" ? "/natal" : `/cestas/${c.slug}`;
}

const cartao = "Cartão com a Sua Mensagem";
const canecaPersonalizada =
  "Caneca personalizada com a inicial do nome ou uma frase. Consulte a disponibilidade.";

/* ———————————————————————— Linha Clássica ———————————————————————— */

const classica: Cesta[] = [
  {
    slug: "cafezinho",
    nome: "Cafezinho",
    categoria: "classica",
    chamada: "O mimo certo para lembrar de alguém em qualquer dia",
    preco: 129,
    serve: "1 pessoa",
    imagem: foto("cafezinho-1"),
    fotos: [foto("cafezinho-2")],
    foco: "50% 50%",
    secoes: [
      { titulo: "Salgados", itens: ["Croissant", "Torradas Slim Toast"] },
      { titulo: "Doces", itens: ["Geleia", "Biscoitos Finos", "Castanhas Caramelizadas"] },
      { titulo: "Bebidas", itens: ["Suco Integral 250 ml"] },
      { titulo: "Frutas", itens: ["Frutas Frescas da Estação"] },
      { titulo: "Acompanha", itens: [cartao] },
    ],
  },
  {
    slug: "despertar",
    nome: "Despertar",
    categoria: "classica",
    chamada: "Um bom-dia caprichado, com tudo o que uma manhã especial pede",
    preco: 229,
    serve: "1 a 2 pessoas",
    imagem: foto("despertar-1"),
    foco: "50% 55%",
    secoes: [
      {
        titulo: "Salgados",
        itens: [
          "Croissant",
          "Pães de Queijo Recheados",
          "Tortaninho de Calabresa",
          "Mini Cinnamon Roll",
          "Torradas Slim Toast",
          "Manteiga Francesa",
          "Queijo",
          "Charcutaria",
        ],
      },
      {
        titulo: "Doces",
        itens: ["Geleia", "Stroopwafel", "Biscoitos Finos", "Chocolate", "Castanhas Caramelizadas"],
      },
      {
        titulo: "Bebidas",
        itens: ["Café para Coar (Drip Coffee)", "Sachê de Chá Inglês Twinings", "Suco Integral 250 ml"],
      },
      { titulo: "Frutas", itens: ["Frutas Frescas da Estação"] },
      { titulo: "Acompanha", itens: [cartao] },
    ],
  },
  {
    slug: "encanto",
    nome: "Encanto",
    categoria: "classica",
    chamada: "Uma manhã sem pressa, com variedade para saborear com calma",
    preco: 309,
    serve: "até 3 pessoas",
    imagem: foto("encanto-1"),
    fotos: [foto("encanto-2"), foto("encanto-3")],
    foco: "50% 60%",
    destaque: true,
    secoes: [
      {
        titulo: "Salgados",
        itens: [
          "Croissants",
          "Pães de Queijo Recheados",
          "Tortaninho de Calabresa",
          "Tortaninho de Canela",
          "Torradas Slim Toast",
          "Manteiga Francesa",
          "2 Tipos de Queijo",
          "Charcutaria",
        ],
      },
      {
        titulo: "Doces",
        itens: [
          "Iogurte ou Pudim",
          "Geleia",
          "Nutella ou Doce de Leite",
          "Stroopwafel",
          "Biscoitos Finos",
          "Chocolate",
          "Castanhas Caramelizadas",
        ],
      },
      {
        titulo: "Bebidas",
        itens: ["Café para Coar (Drip Coffee)", "Sachê de Chá Inglês Twinings", "Suco Integral 250 ml"],
      },
      { titulo: "Frutas", itens: ["Frutas Frescas da Estação"] },
      { titulo: "Acompanha", itens: [cartao] },
    ],
  },
  {
    slug: "presenca",
    nome: "Presença",
    categoria: "classica",
    chamada: "A mesa completa, para estar presente nos momentos que importam",
    preco: 379,
    serve: "3 a 4 pessoas",
    imagem: foto("presenca-1"),
    fotos: [foto("presenca-2"), foto("presenca-3")],
    foco: "50% 55%",
    destaque: true,
    secoes: [
      {
        titulo: "Salgados",
        itens: [
          "Croissants",
          "Pães de Queijo Recheados",
          "Seleção de Pães Artesanais",
          "Cinnamon Roll",
          "Torradas Slim Toast",
          "Manteiga Francesa",
          "2 Tipos de Queijo",
          "Charcutaria",
        ],
      },
      {
        titulo: "Doces",
        itens: [
          "Iogurte ou Pudim",
          "Geleia",
          "Nutella ou Doce de Leite",
          "Stroopwafel",
          "Biscoitos Finos",
          "Chocolates",
          "Castanhas Caramelizadas",
        ],
      },
      {
        titulo: "Bebidas",
        itens: ["Café para Coar (Drip Coffee)", "Sachê de Chá Inglês Twinings", "Suco Integral 500 ml"],
      },
      { titulo: "Frutas", itens: ["Frutas Frescas da Estação"] },
      { titulo: "Acompanha", itens: [cartao] },
    ],
  },
  {
    slug: "fazenda",
    nome: "Fazenda",
    categoria: "classica",
    chamada: "Para quem ama o ritual do café coado, como se faz na fazenda",
    preco: 229,
    serve: "1 pessoa",
    imagem: foto("fazenda-1"),
    fotos: [foto("fazenda-2"), foto("fazenda-3"), foto("fazenda-4"), foto("fazenda-5")],
    foco: "50% 50%",
    destaque: true,
    observacao: canecaPersonalizada,
    secoes: [
      { titulo: "Doces", itens: ["Brownie"] },
      { titulo: "Bebidas", itens: ["Café Moído 250 g"] },
      {
        titulo: "Acompanha",
        itens: ["Caneca Personalizada", "Coador de Pano", "Foto Polaroide", cartao],
      },
    ],
  },
  {
    slug: "aquarela",
    nome: "Aquarela",
    categoria: "classica",
    chamada: "A alegria da infância em cores, sabores e balões",
    preco: 279,
    serve: "1 criança",
    imagem: foto("aquarela-1"),
    fotos: [foto("aquarela-2"), foto("aquarela-3"), foto("aquarela-4")],
    foco: "50% 60%",
    secoes: [
      { titulo: "Salgados", itens: ["Pães de Queijo Recheados", "Pães de Brioche"] },
      { titulo: "Doces", itens: ["Bolo Decorado", "Oreo", "M&M's", "Balas Fini", "Kinder Ovo"] },
      { titulo: "Bebidas", itens: ["Suco Integral"] },
      { titulo: "Frutas", itens: ["Frutas Frescas da Estação"] },
      { titulo: "Acompanha", itens: ["Balões", "Mini Baleiro", cartao] },
    ],
  },
];

/* ———————————————————————— Linha Premium ———————————————————————— */

/** A Brinde está nos dois catálogos; no de Natal, com as fotos da guirlanda. */
const brinde: Omit<Cesta, "slug" | "categoria" | "imagem" | "fotos" | "foco"> = {
  nome: "Brinde",
  chamada: "Para brindar e compartilhar bons momentos à mesa",
  preco: 389,
  serve: "2 a 3 pessoas",
  observacao: "Disponível com vinho ou espumante. Consulte valores.",
  secoes: [
    {
      titulo: "Salgados",
      itens: ["Queijo Amarelo", "Queijo Brie", "Salame", "Lombo Canadense", "Presunto Cru"],
    },
    { titulo: "Doces", itens: ["Geleia", "Castanhas Caramelizadas"] },
    { titulo: "Bebidas", itens: ["Suco Integral 750 ml"] },
    { titulo: "Frutas", itens: ["Frutas Frescas da Estação", "Frutas Secas"] },
    { titulo: "Acompanha", itens: [cartao] },
  ],
};

const premium: Cesta[] = [
  {
    slug: "pausa",
    nome: "Pausa",
    categoria: "premium",
    chamada: "Um convite para desacelerar e aproveitar um momento só seu",
    preco: 179,
    serve: "1 pessoa",
    imagem: foto("pausa-1"),
    fotos: [foto("pausa-2"), foto("pausa-3"), foto("pausa-4")],
    foco: "50% 60%",
    observacao: canecaPersonalizada,
    secoes: [
      { titulo: "Doces", itens: ["Brownie", "Mel"] },
      {
        titulo: "Bebidas",
        itens: ["Café para Coar (Drip Coffee)", "Sachê de Chá Inglês Twinings"],
      },
      { titulo: "Acompanha", itens: ["Caneca Personalizada", "Pegador de Mel", cartao] },
    ],
  },
  {
    slug: "comemore",
    nome: "Comemore",
    categoria: "premium",
    chamada: "Para celebrar as datas especiais com um bolo feito para a ocasião",
    preco: 379,
    serve: "2 pessoas",
    imagem: foto("comemore-7"),
    fotos: [foto("comemore-3"), foto("comemore-1"), foto("comemore-2")],
    foco: "50% 50%",
    antecedenciaDias: 3,
    secoes: [
      {
        titulo: "Salgados",
        itens: [
          "Croissants",
          "Pães de Queijo Recheados",
          "Tortaninho de Calabresa",
          "Torradas Slim Toast",
          "Manteiga Francesa",
          "Queijo",
          "Charcutaria",
        ],
      },
      {
        titulo: "Doces",
        itens: [
          "Bentô Cake Personalizado",
          "Geleia",
          "Stroopwafel",
          "Biscoitos Finos",
          "Castanhas Caramelizadas",
        ],
      },
      {
        titulo: "Bebidas",
        itens: ["Café para Coar (Drip Coffee)", "Sachê de Chá Inglês Twinings", "Suco Integral 250 ml"],
      },
      { titulo: "Frutas", itens: ["Frutas Frescas da Estação"] },
      { titulo: "Acompanha", itens: [cartao] },
    ],
  },
  {
    ...brinde,
    slug: "brinde",
    categoria: "premium",
    imagem: foto("brinde-1"),
    fotos: [
      foto("brinde-4"),
      foto("brinde-5"),
      foto("brinde-2"),
      foto("brinde-6"),
      foto("brinde-3"),
      foto("brinde-7"),
    ],
    foco: "50% 50%",
  },
  {
    slug: "primavera",
    nome: "Primavera",
    categoria: "premium",
    chamada: "A delicadeza das flores para começar o dia com leveza",
    preco: 349,
    serve: "1 a 2 pessoas",
    imagem: foto("primavera-1"),
    fotos: [foto("primavera-2"), foto("primavera-3"), foto("primavera-4"), foto("primavera-5")],
    foco: "50% 60%",
    secoes: [
      { titulo: "Salgados", itens: ["Pão Rústico", "Manteiga Francesa"] },
      { titulo: "Doces", itens: ["Bolo Caseiro (consulte os sabores)", "Iogurte", "Geleia"] },
      { titulo: "Bebidas", itens: ["Café para Coar (Drip Coffee)", "Suco Integral 250 ml"] },
      { titulo: "Acompanha", itens: ["Buquê de Flores Naturais", cartao] },
    ],
  },
  {
    slug: "extraordinario",
    nome: "Extraordinário",
    categoria: "premium",
    chamada: "Flores naturais e fartura para tornar o dia de alguém inesquecível",
    preco: 429,
    serve: "2 a 3 pessoas",
    imagem: foto("extraordinario-1"),
    fotos: [
      foto("extraordinario-2"),
      foto("extraordinario-3"),
      foto("extraordinario-4"),
      foto("extraordinario-5"),
      foto("extraordinario-6"),
      foto("extraordinario-7"),
      // a versão café, sem flores
      foto("mesa-itens"),
    ],
    foco: "50% 60%",
    observacao:
      "Também disponível sem flores: no lugar do buquê, vão café moído 250 g e uma xícara.",
    secoes: [
      {
        titulo: "Salgados",
        itens: ["Pão Rústico", "Torradas Slim Toast", "Manteiga Francesa", "Queijo", "Charcutaria"],
      },
      {
        titulo: "Doces",
        itens: ["Bolo Decorado", "Iogurte ou Pudim", "Geleia", "Castanhas Caramelizadas"],
      },
      {
        titulo: "Bebidas",
        itens: ["Café para Coar (Drip Coffee)", "Sachê de Chá Inglês Twinings", "Suco Integral 500 ml"],
      },
      { titulo: "Frutas", itens: ["Frutas Frescas da Estação"] },
      { titulo: "Acompanha", itens: ["Buquê de Flores Naturais", cartao] },
    ],
  },
];

/* ———————————————————————— Coleção de Natal ———————————————————————— */

/**
 * Na ordem do catálogo de Natal: do menor preço ao maior.
 *
 * - Sem "serve": no Natal a quantidade de pessoas não importa, e os modelos
 *   ficam fora do filtro de pessoas (pedido do Gabriel, 01/11/2026).
 * - A primeira foto é sempre o presente aberto, mostrando o que vem dentro;
 *   a fechada (e a da mão segurando) vai para o fim da galeria. Exceção:
 *   Celebrar e Alegria abrem com o kit dentro da bag de acrílico (Rebeca).
 */
const natal: Cesta[] = [
  {
    slug: "natal-lata-brownie",
    nome: "Gratidão",
    categoria: "natal",
    chamada: "Um carinho de Natal para lembrar de quem é especial",
    preco: 79,
    imagem: foto("natal-lata-brownie-2"),
    fotos: [foto("natal-lata-brownie-4"), foto("natal-lata-brownie-3"), foto("natal-lata-brownie-1")],
    foco: "50% 70%",
    secoes: [
      { titulo: "Doces", itens: ["Brownies"] },
      { titulo: "Acompanha", itens: ["Bolsinha de Linho", cartao] },
    ],
  },
  {
    slug: "natal-caixa-carrinho",
    nome: "Magia de Natal",
    categoria: "natal",
    chamada: "Um mimo para aquecer as manhãs de dezembro",
    preco: 89,
    imagem: foto("natal-carrinho-3"),
    fotos: [foto("natal-carrinho-4"), foto("natal-carrinho-5"), foto("natal-carrinho-1")],
    foco: "50% 78%",
    secoes: [
      { titulo: "Presente", itens: ["Caneca de Natal"] },
      { titulo: "Doces", itens: ["Brownie"] },
      { titulo: "Acompanha", itens: [cartao] },
    ],
  },
  {
    slug: "natal-lata-alta-panetone",
    nome: "Afeto",
    categoria: "natal",
    chamada: "O sabor do Natal em um presente simples e certeiro",
    preco: 129,
    imagem: foto("natal-lata-alta-1"),
    foco: "50% 75%",
    secoes: [
      { titulo: "Doces", itens: ["Panetone Artesanal"] },
      { titulo: "Acompanha", itens: ["Bolsinha de Linho", cartao] },
    ],
  },
  {
    slug: "natal-acrilico-espumante-lata",
    nome: "Celebrar",
    categoria: "natal",
    chamada: "Para brindar o fim de ano com quem você gosta",
    preco: 219,
    imagem: foto("natal-acrilico-lata-1"),
    fotos: [foto("natal-acrilico-lata-2"), foto("natal-acrilico-lata-4"), foto("natal-acrilico-lata-5")],
    foco: "50% 70%",
    secoes: [
      { titulo: "Bebidas", itens: ["Espumante Freixenet"] },
      { titulo: "Frutas", itens: ["Mix de Nuts", "Frutas Secas"] },
      { titulo: "Acompanha", itens: [cartao] },
    ],
  },
  {
    slug: "natal-acrilico-espumante-panetone",
    nome: "Alegria",
    categoria: "natal",
    chamada: "O brinde e o panetone para celebrar a ceia",
    preco: 239,
    imagem: foto("natal-acrilico-panetone-1"),
    fotos: [foto("natal-acrilico-panetone-2"), foto("natal-acrilico-panetone-5")],
    foco: "50% 70%",
    secoes: [
      { titulo: "Doces", itens: ["Panetone Artesanal"] },
      { titulo: "Bebidas", itens: ["Espumante Freixenet"] },
      { titulo: "Acompanha", itens: [cartao] },
    ],
  },
  {
    slug: "natal-caixa-de-doces",
    nome: "Doce Natal",
    categoria: "natal",
    chamada: "Doces finos para adoçar as festas de fim de ano",
    preco: 259,
    imagem: foto("natal-doces-3"),
    fotos: [foto("natal-doces-2"), foto("natal-doces-1"), foto("natal-doces-5")],
    foco: "50% 75%",
    destaque: true,
    secoes: [
      {
        titulo: "Doces",
        itens: ["Trufas Belgas", "Mendiants", "Pepitas de Ouro", "Castanhas Caramelizadas"],
      },
      { titulo: "Acompanha", itens: [cartao] },
    ],
  },
  {
    ...brinde,
    nome: "Noite Feliz",
    serve: undefined,
    slug: "natal-brinde",
    categoria: "natal",
    imagem: foto("natal-brinde-2"),
    fotos: [
      foto("natal-brinde-3"),
      foto("natal-brinde-6"),
      foto("natal-brinde-4"),
      foto("natal-brinde-1"),
    ],
    foco: "50% 65%",
    destaque: true,
  },
];

export const cestas: Cesta[] = [...classica, ...premium, ...natal];

/** Adicionais do catálogo da marca (31/10/2026). */
export const adicionais = [
  { nome: "Croissant 60 g", preco: 10 },
  { nome: "Cinnamon Roll 90 g", preco: 10 },
  { nome: "Geleia", preco: 14 },
  { nome: "Nutella", preco: 14 },
  { nome: "Doce de Leite", preco: 10 },
  { nome: "Foto Polaroide", preco: 14 },
  { nome: "Bentô Cake", preco: 100 },
];

/**
 * Os passos do "É aqui que a sua experiência começa", na ordem e com as
 * palavras da abertura do catálogo (31/10/2026). O `texto` só entra onde o
 * site acrescenta algo; a Rebeca é apresentada no bloco seguinte da home,
 * por isso não aparece aqui.
 */
export const comoFunciona: { titulo: string; texto?: string }[] = [
  { titulo: "Escolha a opção ideal para você" },
  {
    titulo: "Entre em contato conosco pelo WhatsApp",
    texto: "O botão de pedido já leva a mensagem pronta, com o modelo e a data.",
  },
  {
    titulo: "Informe o endereço",
    texto: "Para calcularmos a taxa de entrega — atendemos São Paulo e o Grande ABC.",
  },
  {
    titulo: "Peça com no mínimo 24h de antecedência",
    texto: "E receba a sua cesta cuidadosamente montada no dia e no horário escolhidos.",
  },
  { titulo: "Desfrute de momentos inesquecíveis" },
];

export function cestasDaCategoria(slug: CategoriaSlug): Cesta[] {
  return cestas.filter((c) => c.categoria === slug);
}

export function buscarCesta(slug: string): Cesta | undefined {
  return cestas.find((c) => c.slug === slug);
}

export function categoriaDe(slug: CategoriaSlug): Categoria {
  const encontrada = categorias.find((c) => c.slug === slug);
  if (!encontrada) throw new Error(`Categoria desconhecida: ${slug}`);
  return encontrada;
}

/**
 * Quantas pessoas a cesta serve, lido do "serve" do catálogo ("1 a 2
 * pessoas", "até 3 pessoas", "1 criança"...): [mínimo, máximo].
 *
 * "Até 3 pessoas" é o tamanho da cesta, não um "de 1 a 3": a Encanto não
 * aparece em "1 pessoa" (o Gabriel viu esse erro no filtro, nov/2026).
 */
export function pessoasDe(cesta: Pick<Cesta, "serve">): [number, number] | null {
  const n = cesta.serve?.match(/\d+/g)?.map(Number);
  if (!n?.length) return null;
  return [n[0], n[n.length - 1]];
}

/** Opções de "para quantas pessoas" do filtro. */
export const opcoesPessoas = [
  { slug: "1", nome: "1 pessoa", aceita: ([min]: [number, number]) => min <= 1 },
  { slug: "2", nome: "2 pessoas", aceita: ([min, max]: [number, number]) => min <= 2 && max >= 2 },
  { slug: "3", nome: "3 ou mais", aceita: ([, max]: [number, number]) => max >= 3 },
] as const;

export type Filtros = { linha: string; preco: string; pessoas: string };

/** A cesta passa no filtro? Valor vazio é "qualquer um". */
export function passaNoFiltro(c: Cesta, f: Filtros): boolean {
  if (f.linha && c.categoria !== f.linha) return false;
  if (f.preco) {
    const faixa = faixasDePreco.find((x) => x.slug === f.preco);
    if (faixa && (c.preco === null || c.preco < faixa.min || c.preco > faixa.max)) return false;
  }
  if (f.pessoas) {
    const opcao = opcoesPessoas.find((x) => x.slug === f.pessoas);
    const faixa = pessoasDe(c);
    if (opcao && (!faixa || !opcao.aceita(faixa))) return false;
  }
  return true;
}

/**
 * O resultado do filtro. Sem linha escolhida, a Noite Feliz sai: é a
 * mesma Brinde da Linha Premium, com outras fotos.
 */
export function filtrarCestas(f: Filtros): Cesta[] {
  return cestas.filter(
    (c) => passaNoFiltro(c, f) && (f.linha || c.slug !== "natal-brinde"),
  );
}

/** As linhas do ano todo, sem a coleção sazonal. */
export const linhasDoAno = categorias.filter((c) => !c.tema);

/**
 * Os modelos de Natal não reservam dia e período pelo site: o pedido vai
 * direto para o WhatsApp, e a Rebeca confirma a disponibilidade (pedido
 * dela, 02/11/2026).
 */
export function pedeDisponibilidade(cesta: Pick<Cesta, "categoria">): boolean {
  return cesta.categoria === "natal";
}

/** "Pedido com 24h de antecedência", ou "Consulte a disponibilidade" no Natal. */
export function prazoDe(cesta: Pick<Cesta, "categoria" | "antecedenciaDias">): string {
  return pedeDisponibilidade(cesta)
    ? "Consulte a disponibilidade"
    : `Pedido com ${antecedenciaDe(cesta)}`;
}

/** "24h de antecedência", ou os dias do modelo que pede mais tempo. */
export function antecedenciaDe(cesta: Pick<Cesta, "antecedenciaDias">): string {
  return cesta.antecedenciaDias && cesta.antecedenciaDias > 1
    ? `${cesta.antecedenciaDias} dias de antecedência`
    : "24h de antecedência";
}

export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
