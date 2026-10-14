/**
 * Catálogo de cestas — coleção de outubro/2026.
 *
 * Todas as fotos vêm do ensaio de outubro/2026 (`public/ensaio/`, gerado por
 * `scripts/exportar-ensaio.py`). As fotos antigas (Instagram e packshots do
 * catálogo em PDF) saíram do site.
 *
 * ⚠️  DOIS TIPOS DE MODELO AQUI
 *
 * 1. **Confirmados** — Café P, Café M e Café G. Itens e preços transcritos
 *    do "Catálogo Le Brunch.pdf" oficial. As bandejas redondas de madeira do
 *    ensaio foram associadas a cada tamanho pela escala da bandeja na mesa.
 *
 * 2. **Rascunho** (`rascunho: true`) — modelos que aparecem no ensaio mas
 *    ainda não têm ficha oficial. O nome é uma proposta, os itens são o que
 *    se vê na foto e o preço fica `null` ("sob consulta") até a Rebeca
 *    passar o valor. Aparecem com o selo "rascunho" só em desenvolvimento.
 */

export type Secao = {
  titulo: string;
  itens: string[];
};

export type Cesta = {
  slug: string;
  nome: string;
  categoria: CategoriaSlug;
  /** Frase curta de vitrine. */
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
  destaque?: boolean;
  /** Modelo ainda sem ficha oficial — nome, itens e preço a confirmar. */
  rascunho?: boolean;
};

export type CategoriaSlug =
  | "pronta-entrega"
  | "essencial"
  | "premium"
  | "presentes"
  | "natal";

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
  /** Sai no mesmo dia — muda o prazo mínimo no modal de pedido. */
  prontaEntrega?: boolean;
  /** Selo curto exibido junto do nome da linha. */
  selo?: string;
  /** Linha com página e identidade visual próprias (ver `/natal`). */
  tema?: "natal";
};

const foto = (nome: string) => `/ensaio/${nome}.webp`;

export const categorias: Categoria[] = [
  {
    slug: "pronta-entrega",
    nome: "Pronta Entrega",
    nomeCurto: "Pronta Entrega",
    chamada: "Para o carinho que não pode esperar",
    descricao:
      "O nosso presente menorzinho — caneca, café para coar e uma foto impressa de quem você ama. Pronto para sair no mesmo dia.",
    foto: foto("cafe-coado-1"),
    prontaEntrega: true,
    selo: "Sai hoje",
  },
  {
    slug: "essencial",
    nome: "Linha Essencial",
    nomeCurto: "Essencial",
    chamada: "O nosso café da manhã de assinatura",
    descricao:
      "As bandejas redondas de madeira que viraram a cara da Le Brunch, em três tamanhos: croissants, pães de queijo, queijos, charcutaria e frutas da estação, montados à mão.",
    foto: foto("cafe-m-1"),
  },
  {
    slug: "premium",
    nome: "Linha Premium",
    nomeCurto: "Premium",
    chamada: "Quando a ocasião pede o extraordinário",
    descricao:
      "A caixa verde da casa com bolinho bentô e as cestas de palha e vime com flores. Para comemorar de verdade.",
    foto: foto("cesta-flores-1"),
  },
  {
    slug: "presentes",
    nome: "Presentes & Mimos",
    nomeCurto: "Presentes",
    chamada: "Um carinho do tamanho certo",
    descricao:
      "A caneca de vidro com a inicial gravada e a cesta das crianças, com balões. Presentes pensados para um gesto que diz muito.",
    foto: foto("box-caneca-1"),
    foco: "50% 55%",
  },
  {
    slug: "natal",
    nome: "Coleção de Natal",
    nomeCurto: "Natal",
    chamada: "Edição limitada · Natal 2026",
    descricao:
      "Latas, caixas e kits com espumante, panetone, tábua de frios e doces finos — embrulhados em veludo verde, laço estrelado e xadrez de Natal.",
    foto: foto("natal-petiscos-1"),
    foco: "50% 70%",
    selo: "Edição limitada",
    tema: "natal",
  },
];

/** Endereço da página de cada linha. A de Natal tem página própria. */
export function hrefCategoria(c: Pick<Categoria, "slug" | "tema">): string {
  return c.tema === "natal" ? "/natal" : `/cestas/${c.slug}`;
}

/* ———————————————————————— Pronta Entrega ———————————————————————— */

const prontaEntrega: Cesta[] = [
  {
    slug: "caixa-cafe-coado",
    nome: "Caixa Café Coado",
    categoria: "pronta-entrega",
    chamada:
      "Caixa de madeira com café, coador de pano, caneca de cerâmica e uma foto impressa de quem você ama. Sai no mesmo dia.",
    preco: null,
    serve: "1 pessoa",
    imagem: foto("cafe-coado-1"),
    fotos: [foto("cafe-coado-2"), foto("cafe-coado-3"), foto("cafe-coado-4")],
    foco: "50% 50%",
    destaque: true,
    rascunho: true,
    secoes: [
      {
        titulo: "Para o café",
        itens: [
          "Café Chocolate Trufado 250g — Baggio",
          "Coador de Pano",
          "Caneca de Cerâmica",
        ],
      },
      { titulo: "Doces", itens: ["Brownie"] },
      {
        titulo: "Personalizado",
        itens: ["Foto Impressa", "Caixa de Madeira com a marca Le Brunch"],
      },
    ],
  },
];

/* ——————————————————————— Linha Essencial ——————————————————————— */

const essencial: Cesta[] = [
  {
    slug: "cafe-p",
    nome: "Café P",
    categoria: "essencial",
    chamada: "O clássico da casa: enxuto no tamanho, generoso no cuidado.",
    preco: 243,
    serve: "1 a 2 pessoas",
    imagem: foto("cafe-p-1"),
    fotos: [foto("cafe-p-2"), foto("cafe-p-3")],
    foco: "50% 55%",
    secoes: [
      {
        titulo: "Salgados",
        itens: [
          "Croissants",
          "Tortaninho de Calabresa",
          "Pães de Queijo Recheados",
          "Torradas Slim Toast",
          "1 Queijo e 1 Charcutaria",
          "Manteiga Francesa",
        ],
      },
      {
        titulo: "Doces",
        itens: [
          "Biscoitos Finos",
          "Stroopwafel",
          "Doce de Leite, Nutella ou Geleia",
          "Castanhas",
          "Chocolate",
        ],
      },
      {
        titulo: "Bebidas",
        itens: [
          "Café para Coar — Drip Coffee",
          "Sachê de Chá Inglês — Twinings",
          "Suco Integral — 300ml",
        ],
      },
      { titulo: "Frutas", itens: ["Frutas da Estação", "Frutas Secas"] },
    ],
  },
  {
    slug: "cafe-m",
    nome: "Café M",
    categoria: "essencial",
    chamada: "Mais variedade de doces e queijos para dividir com calma.",
    preco: 303,
    serve: "2 pessoas",
    imagem: foto("cafe-m-1"),
    fotos: [foto("cafe-m-2"), foto("cafe-m-3"), foto("cafe-m-4")],
    foco: "50% 60%",
    destaque: true,
    secoes: [
      {
        titulo: "Salgados",
        itens: [
          "Croissants",
          "Tortaninho de Calabresa",
          "Pães de Queijo Recheados",
          "Torradas Slim Toast",
          "2 Queijos e 1 Charcutaria",
          "Manteiga Francesa",
        ],
      },
      {
        titulo: "Doces",
        itens: [
          "Muffin",
          "Biscoitos Finos",
          "Stroopwafel",
          "Doce de Leite ou Nutella",
          "Geleia",
          "Iogurte ou Pudim",
          "Castanhas",
          "Chocolate",
        ],
      },
      {
        titulo: "Bebidas",
        itens: [
          "Café para Coar — Drip Coffee",
          "Sachê de Chá Inglês — Twinings",
          "Suco Integral — 300ml",
        ],
      },
      {
        titulo: "Frutas",
        itens: ["Frutas Frescas da Estação", "Frutas Secas"],
      },
    ],
  },
  {
    slug: "cafe-g",
    nome: "Café G",
    categoria: "essencial",
    chamada:
      "A mesa completa: pães selecionados, curadoria ampliada e suco de 500ml.",
    preco: 343,
    serve: "2 a 3 pessoas",
    imagem: foto("cafe-g-1"),
    fotos: [foto("cafe-g-2"), foto("cafe-g-3"), foto("cafe-g-4"), foto("cafe-g-5")],
    foco: "50% 55%",
    destaque: true,
    secoes: [
      {
        titulo: "Salgados",
        itens: [
          "Croissants",
          "Pães Selecionados",
          "Pães de Queijo Recheados",
          "Torradas Slim Toast",
          "2 Queijos e 1 Charcutaria",
          "Manteiga Francesa",
        ],
      },
      {
        titulo: "Doces",
        itens: [
          "Muffin",
          "Biscoitos Finos",
          "Stroopwafel",
          "Doce de Leite ou Nutella",
          "Geleia",
          "Iogurte ou Pudim",
          "Castanhas",
          "Chocolate",
        ],
      },
      {
        titulo: "Bebidas",
        itens: [
          "Café para Coar — Drip Coffee",
          "Sachê de Chá Inglês — Twinings",
          "Suco Integral — 500ml",
        ],
      },
      {
        titulo: "Frutas",
        itens: ["Frutas Frescas da Estação", "Frutas Secas"],
      },
    ],
  },
];

/* ———————————————————————— Linha Premium ———————————————————————— */

const premium: Cesta[] = [
  {
    slug: "caixa-verde-bento",
    nome: "Caixa Verde Bentô",
    categoria: "premium",
    chamada:
      "A caixa redonda verde da casa, com bolinho bentô decorado no centro e laço de cetim.",
    preco: null,
    serve: "2 pessoas",
    imagem: foto("caixa-verde-1"),
    fotos: [foto("caixa-verde-2"), foto("caixa-verde-3"), foto("caixa-verde-4")],
    foco: "50% 65%",
    rascunho: true,
    secoes: [
      {
        titulo: "Salgados",
        itens: [
          "Croissants",
          "Pães de Queijo",
          "Queijo e Charcutaria",
          "Torradas",
        ],
      },
      {
        titulo: "Doces",
        itens: [
          "Bolinho Bentô Cake Decorado",
          "Stroopwafel",
          "Geleia",
          "Castanhas Caramelizadas",
        ],
      },
      {
        titulo: "Bebidas",
        itens: [
          "Suco de Uva Integral — Casa Madeira",
          "Café para Coar — Baggio",
          "Sachê de Chá — Twinings",
        ],
      },
      { titulo: "Frutas", itens: ["Uvas", "Morangos", "Laranja Desidratada"] },
    ],
  },
  {
    slug: "cesta-flores-do-campo",
    nome: "Cesta Flores do Campo",
    categoria: "premium",
    chamada:
      "Cesta de palha com buquê de flores do campo, bolo de chocolate e café para coar.",
    preco: null,
    serve: "2 pessoas",
    imagem: foto("cesta-flores-1"),
    fotos: [foto("cesta-flores-2"), foto("cesta-flores-3"), foto("cesta-flores-4")],
    foco: "50% 50%",
    rascunho: true,
    secoes: [
      {
        titulo: "Doces",
        itens: [
          "Bolo de Chocolate",
          "Iogurte — Delicari",
          "Geleia",
          "Pão Doce",
        ],
      },
      { titulo: "Salgados", itens: ["Seleção de Queijos", "Torradas"] },
      {
        titulo: "Bebidas",
        itens: [
          "Suco de Uva Integral — Casa Madeira",
          "Drip Coffee Chocolate Trufado — Baggio",
        ],
      },
      { titulo: "Para presentear", itens: ["Buquê de Flores do Campo", "Cesta de Palha"] },
    ],
  },
  {
    slug: "cesta-bouquet",
    nome: "Cesta Bouquet",
    categoria: "premium",
    chamada:
      "Cesta de vime arredondada, com flores, café e guardanapo de tecido para a mesa posta.",
    preco: null,
    serve: "1 a 2 pessoas",
    imagem: foto("cesta-bouquet-1"),
    fotos: [foto("cesta-bouquet-2"), foto("cesta-bouquet-3"), foto("cesta-bouquet-4")],
    foco: "50% 50%",
    rascunho: true,
    secoes: [
      {
        titulo: "Doces",
        itens: ["Pão Doce Artesanal", "Iogurte — Delicari", "Geleia"],
      },
      {
        titulo: "Bebidas",
        itens: [
          "Suco de Uva Integral — Casa Madeira",
          "Drip Coffee — Baggio",
        ],
      },
      {
        titulo: "Para presentear",
        itens: ["Buquê de Flores", "Guardanapo de Tecido", "Cesta de Vime"],
      },
    ],
  },
];

/* ———————————————————————— Presentes & Mimos ———————————————————————— */

const presentes: Cesta[] = [
  {
    slug: "box-caneca-inicial",
    nome: "Box Caneca com Inicial",
    categoria: "presentes",
    chamada:
      "Caixa chapéu verde com caneca de vidro gravada com a inicial, café, mel e um ramo de eucalipto.",
    preco: null,
    serve: "1 pessoa",
    imagem: foto("box-caneca-1"),
    fotos: [foto("box-caneca-2"), foto("box-caneca-3")],
    foco: "50% 55%",
    rascunho: true,
    secoes: [
      {
        titulo: "Personalizado",
        itens: ["Caneca de Vidro com Inicial Gravada"],
      },
      {
        titulo: "Para o café",
        itens: ["Café — Baggio", "Mel com Pegador de Madeira"],
      },
      { titulo: "Doces", itens: ["Brownie"] },
      { titulo: "Para presentear", itens: ["Caixa Chapéu Verde", "Ramo de Eucalipto"] },
    ],
  },
  {
    slug: "cesta-kids",
    nome: "Cesta Kids",
    categoria: "presentes",
    chamada:
      "Caixote de madeira com balões, bolo de chocolate e as guloseimas que fazem a festa das crianças.",
    preco: null,
    serve: "1 criança",
    imagem: foto("cesta-kids-1"),
    fotos: [foto("cesta-kids-2"), foto("cesta-kids-3"), foto("cesta-kids-4")],
    foco: "50% 60%",
    rascunho: true,
    secoes: [
      {
        titulo: "Doces",
        itens: ["Bolo de Chocolate Decorado", "Kinder Ovo", "M&M's", "Guloseimas"],
      },
      { titulo: "Bebidas", itens: ["Suco de Laranja Natural"] },
      { titulo: "Frutas", itens: ["Uvas"] },
      {
        titulo: "Para presentear",
        itens: ["Balões", "Guardanapo de Bolinhas", "Caixote de Madeira"],
      },
    ],
  },
];

/* ———————————————————————— Coleção de Natal ———————————————————————— */

const natal: Cesta[] = [
  {
    slug: "natal-tabua-de-frios",
    nome: "Caixa Tábua & Merlot",
    categoria: "natal",
    chamada:
      "A caixa verde de gaveta: suco de uva Merlot em cima, tábua de queijos e frios embaixo, com laço estrelado.",
    preco: null,
    serve: "2 pessoas",
    imagem: foto("natal-vinho-frios-1"),
    fotos: [
      foto("natal-vinho-frios-2"),
      foto("natal-vinho-frios-5"),
      foto("natal-vinho-frios-3"),
      foto("natal-vinho-frios-4"),
    ],
    foco: "50% 55%",
    destaque: true,
    rascunho: true,
    secoes: [
      { titulo: "Bebida", itens: ["Suco de Uva Varietal Merlot — Casa Madeira"] },
      {
        titulo: "Tábua",
        itens: [
          "Queijo Brie",
          "Queijos Amarelos",
          "Presunto Cru",
          "Salame em Rosa",
          "Torradas",
          "Geleia",
          "Castanhas Caramelizadas",
        ],
      },
      {
        titulo: "Frutas",
        itens: ["Morangos", "Mirtilos", "Uvas", "Laranja Desidratada", "Physalis"],
      },
    ],
  },
  {
    slug: "natal-caixa-petiscos",
    nome: "Caixa de Petiscos",
    categoria: "natal",
    chamada:
      "Caixa redonda com quatro divisões de doces finos e castanhas, fechada com laço de veludo estrelado.",
    preco: null,
    imagem: foto("natal-petiscos-1"),
    fotos: [foto("natal-petiscos-3"), foto("natal-petiscos-2"), foto("natal-petiscos-4"), foto("natal-petiscos-5")],
    foco: "50% 72%",
    destaque: true,
    rascunho: true,
    secoes: [
      {
        titulo: "Na caixa",
        itens: [
          "Castanhas Caramelizadas",
          "Trufas de Chocolate",
          "Mendiants de Chocolate com Pistache e Frutas",
          "Castanhas com Cobertura Dourada",
        ],
      },
      {
        titulo: "Para presentear",
        itens: ["Caixa Redonda Verde", "Laço de Veludo Estrelado"],
      },
    ],
  },
  {
    slug: "natal-espumante-e-panetone",
    nome: "Kit Brinde & Panetone",
    categoria: "natal",
    chamada:
      "Bolsa de acrílico com espumante e panetone embrulhado em veludo verde. Pronto para entregar.",
    preco: null,
    imagem: foto("natal-espumante-panetone-1"),
    fotos: [
      foto("natal-espumante-panetone-3"),
      foto("natal-espumante-panetone-2"),
      foto("natal-espumante-panetone-4"),
    ],
    foco: "50% 70%",
    rascunho: true,
    secoes: [
      { titulo: "Bebida", itens: ["Espumante Freixenet Semi Seco — mini"] },
      { titulo: "Doce", itens: ["Panetone de Chocolate"] },
      {
        titulo: "Para presentear",
        itens: ["Bolsa de Acrílico", "Embrulho de Veludo Estrelado", "Tag Boas Festas"],
      },
    ],
  },
  {
    // As fotos 69/70/68 ("espumante-lata") são o mesmo kit, com a lata
    // fechada e o laço — a Rebeca confirmou que é um modelo só.
    slug: "natal-boas-festas",
    nome: "Kit Boas Festas",
    categoria: "natal",
    chamada:
      "Espumante e uma lata dourada de frutas secas e castanhas, fechada com laço de organza estrelado e a tag Boas Festas.",
    preco: null,
    imagem: foto("natal-boas-festas-1"),
    fotos: [
      foto("natal-espumante-lata-1"),
      foto("natal-boas-festas-3"),
      foto("natal-espumante-lata-2"),
      foto("natal-boas-festas-2"),
      foto("natal-espumante-lata-3"),
    ],
    foco: "50% 65%",
    rascunho: true,
    secoes: [
      { titulo: "Bebida", itens: ["Espumante Freixenet Semi Seco — mini"] },
      {
        titulo: "Na lata",
        itens: ["Damascos", "Tâmaras", "Pistaches", "Castanhas Caramelizadas"],
      },
      {
        titulo: "Para presentear",
        itens: ["Lata Dourada", "Laço de Organza Estrelado", "Bolsa de Acrílico", "Tag Boas Festas"],
      },
    ],
  },
  {
    slug: "natal-lata-de-brownies",
    nome: "Lata de Brownies",
    categoria: "natal",
    chamada:
      "Lata Feliz Natal estampada de pinheiros, cheia de brownies, com a sacolinha de tecido combinando.",
    preco: null,
    imagem: foto("natal-lata-cookies-1"),
    fotos: [foto("natal-lata-cookies-2"), foto("natal-lata-cookies-3"), foto("natal-lata-cookies-4")],
    foco: "50% 72%",
    rascunho: true,
    secoes: [
      { titulo: "Doces", itens: ["Brownies"] },
      {
        titulo: "Para presentear",
        itens: ["Lata Feliz Natal", "Sacola de Tecido com Pinheiros"],
      },
    ],
  },
  {
    slug: "natal-lata-e-panetone",
    nome: "Lata & Panetone",
    categoria: "natal",
    chamada:
      "A lata Feliz Natal alta, com mini panetone de chocolate e a sacolinha de tecido.",
    preco: null,
    imagem: foto("natal-lata-panetone-1"),
    fotos: [foto("natal-lata-panetone-2"), foto("natal-lata-panetone-3")],
    foco: "50% 75%",
    rascunho: true,
    secoes: [
      { titulo: "Doces", itens: ["Mini Panetone de Chocolate", "Recheio da lata (a confirmar)"] },
      {
        titulo: "Para presentear",
        itens: ["Lata Feliz Natal", "Sacola de Tecido com Pinheiros"],
      },
    ],
  },
  {
    slug: "natal-kit-caneca",
    nome: "Kit Caneca de Natal",
    categoria: "natal",
    chamada:
      "Caneca natalina, brownie e a caixinha do caminhãozinho de Natal com laço xadrez.",
    preco: null,
    imagem: foto("natal-caneca-1"),
    fotos: [foto("natal-caneca-2"), foto("natal-caneca-3"), foto("natal-caneca-4")],
    foco: "50% 75%",
    rascunho: true,
    secoes: [
      { titulo: "Doces", itens: ["Brownie"] },
      {
        titulo: "Para presentear",
        itens: [
          "Caneca Natalina",
          "Porta-copo Xadrez",
          "Caixa Feliz Natal com Laço Xadrez",
        ],
      },
    ],
  },
  {
    slug: "natal-saquinho",
    nome: "Saco de Noel",
    categoria: "natal",
    chamada:
      "Saquinho de algodão estampado com pinheiro e laço de cetim vermelho.",
    preco: null,
    imagem: foto("natal-saquinho-1"),
    fotos: [foto("natal-saquinho-2")],
    foco: "50% 78%",
    rascunho: true,
    secoes: [
      { titulo: "Recheio", itens: ["A confirmar"] },
      {
        titulo: "Para presentear",
        itens: ["Saco de Algodão Estampado", "Laço de Cetim Vermelho"],
      },
    ],
  },
];

export const cestas: Cesta[] = [
  ...prontaEntrega,
  ...essencial,
  ...premium,
  ...presentes,
  ...natal,
];

/**
 * Modelo confirmado que não entrou no ensaio de outubro/2026, então está
 * fora da vitrine (as fotos antigas saíram do site). Para voltar, basta
 * fotografar, preencher `imagem` e mover para `essencial`.
 */
export const foraDaVitrine: Cesta[] = [
  {
    slug: "cafe-com-bento-cake",
    nome: "Café com Bentô Cake",
    categoria: "essencial",
    chamada: "Com bolinho bentô personalizado — o recado escrito no doce.",
    preco: 330,
    serve: "2 pessoas",
    imagem: null,
    secoes: [
      {
        titulo: "Salgados",
        itens: [
          "Croissants",
          "Pães Selecionados",
          "Pães de Queijo Recheados",
          "Torradas Slim Toast",
          "2 Queijos e 1 Charcutaria",
          "Manteiga Francesa",
        ],
      },
      {
        titulo: "Doces",
        itens: [
          "Bolinho Bentô Cake Personalizado",
          "Biscoitos Finos",
          "Stroopwafel",
          "Doce de Leite, Geleia ou Nutella",
          "Castanhas",
          "Chocolate",
        ],
      },
      {
        titulo: "Bebidas",
        itens: [
          "Café para Coar — Drip Coffee",
          "Sachê de Chá Inglês — Twinings",
          "Suco Integral — 500ml",
        ],
      },
      {
        titulo: "Frutas",
        itens: ["Frutas Frescas da Estação", "Frutas Secas"],
      },
    ],
  },
];

/** Adicionais do catálogo oficial. */
export const adicionais = [
  { nome: "Croissant 60g", preco: 10 },
  { nome: "Cinnamon Roll 90g", preco: 10 },
  { nome: "Geleia", preco: 10 },
  { nome: "Nutella", preco: 10 },
  { nome: "Doce de Leite", preco: 10 },
  { nome: "Bentô Cake", preco: 100 },
];

export const comoFunciona = [
  {
    titulo: "Escolha a sua cesta",
    texto: "Encontre a opção ideal para o momento e para quem vai receber.",
  },
  {
    titulo: "Escolha a data da entrega",
    texto: "No próprio site você já marca o dia e o período da surpresa.",
  },
  {
    titulo: "Fale com a gente no WhatsApp",
    texto:
      "O pedido chega pronto para a Rebeca, com modelo e data já preenchidos.",
  },
  {
    titulo: "Informe o endereço",
    texto:
      "Calculamos a taxa de entrega na hora — atendemos São Paulo e o Grande ABC.",
  },
  {
    titulo: "Desfrute de momentos inesquecíveis",
    texto: "O resto é a emoção de quem abre a caixa.",
  },
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

/** As linhas do ano todo, sem a coleção sazonal. */
export const linhasDoAno = categorias.filter((c) => !c.tema);

export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
