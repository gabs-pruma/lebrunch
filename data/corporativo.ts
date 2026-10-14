/**
 * Brunch corporativo.
 *
 * Conteúdo e valores transcritos da página no ar em lp.lebrunchcestas.com.br.
 * Os totais são a base para 15 pessoas (mínimo de atendimento).
 *
 * A CONFIRMAR com a Rebeca: a página antiga exibia um "por pessoa"
 * (~R$128 / R$145 / R$162) que não fecha com o total dividido por 15
 * (R$170 / R$193 / R$217). Aqui optamos por mostrar apenas o total da base,
 * para não publicar um valor por pessoa incorreto.
 */

export type PacoteCorporativo = {
  slug: string;
  ordem: string;
  nome: string;
  subtitulo: string;
  total: number;
  itens: string[];
  destaque?: boolean;
};

export const pacotes: PacoteCorporativo[] = [
  {
    slug: "essencial",
    ordem: "Opção 01",
    nome: "Essencial",
    subtitulo: "Café Clássico",
    total: 2550,
    itens: [
      "3 opções de salgados",
      "2 bolos, brownie e carolinas",
      "Café, chá e suco",
      "Montagem e desmontagem inclusas",
    ],
  },
  {
    slug: "equilibrio",
    ordem: "Opção 02",
    nome: "Equilíbrio",
    subtitulo: "Café Gourmet",
    total: 2900,
    destaque: true,
    itens: [
      "4 opções de salgados",
      "Tábua de queijos e frios",
      "2 bolos, brownie e extras",
      "Café, chá e suco",
      "Montagem e desmontagem inclusas",
    ],
  },
  {
    slug: "experiencia-completa",
    ordem: "Opção 03",
    nome: "Experiência Completa",
    subtitulo: "Café Premium",
    total: 3250,
    itens: [
      "6 opções de salgados",
      "Caixas individuais de degustação por convidado",
      "3 opções de sobremesa",
      "Café, chá e suco",
      "Montagem e desmontagem inclusas",
    ],
  },
];

export const pilares = [
  {
    titulo: "Curadoria de sabores",
    texto:
      "Cada item é escolhido com o mesmo critério das nossas cestas — nada entra na mesa por acaso.",
  },
  {
    titulo: "Montagem completa",
    texto:
      "Chegamos antes, montamos a mesa e desmontamos depois. Sua equipe só precisa aparecer.",
  },
  {
    titulo: "Hospitalidade de marca",
    texto:
      "A mesa comunica cuidado. É a sua empresa dizendo obrigado sem precisar de discurso.",
  },
];

export const diferenciais = [
  "Mesa apresentada com curadoria e estética de marca",
  "Seleção criteriosa de ingredientes",
  "Equipe discreta durante todo o evento",
  "Atendimento pessoal da Rebeca, à frente de cada evento",
];

export const condicoes = [
  { titulo: "Mínimo", texto: "15 pessoas" },
  { titulo: "Antecedência", texto: "15 dias" },
  { titulo: "Montagem", texto: "Montagem e desmontagem inclusas" },
  {
    titulo: "Cancelamento",
    texto:
      "Até 7 dias de antecedência. Cancelamentos fora deste prazo: cobrança de 50%.",
  },
  {
    titulo: "Pagamento",
    texto: "Sinal de 50% no fechamento do contrato. Saldo até 2 dias antes.",
  },
];

export const etapas = [
  {
    titulo: "Conte o seu momento",
    texto:
      "Data, número de pessoas e o que a empresa quer celebrar. Uma conversa por WhatsApp resolve.",
  },
  {
    titulo: "Recebe a proposta",
    texto:
      "Enviamos o pacote adequado, com o cardápio e o valor fechado — sem surpresa depois.",
  },
  {
    titulo: "A gente cuida do resto",
    texto:
      "Montagem, serviço e desmontagem no dia. Você acompanha a reação da equipe.",
  },
];
