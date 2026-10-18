/**
 * Conteúdo da página "Conheça a Le Brunch".
 *
 * ⚠️  TEXTO PARA REVISÃO DA REBECA
 * Os parágrafos abaixo são um rascunho escrito a partir do que a própria
 * marca já afirma (manual de marca, catálogo e página corporativa no ar):
 * cestas montadas à mão, curadoria de itens, atendimento pessoal e o
 * posicionamento "transmitindo emoções, criando momentos".
 *
 * As fotos vêm do ensaio de outubro/2026 (`public/ensaio/`).
 *
 * Nada aqui inventa fatos da biografia da Rebeca. Os campos marcados como
 * `null` e os itens com "REVISAR" precisam da história real dela antes de
 * o site ir ao ar:
 *   - `desde`: ano de fundação
 *   - `citacao`: uma frase dela, nas palavras dela
 *   - o parágrafo de origem ("como tudo começou")
 */

export const historia = {
  /** Ano de fundação — preencher depois de confirmar com a Rebeca. */
  desde: null as number | null,

  abertura:
    "A Le Brunch existe para uma coisa só: fazer com que um café da manhã comum vire uma lembrança que a pessoa guarda.",

  paragrafos: [
    // REVISAR: substituir pelo relato real de como a Rebeca começou.
    "Tudo começa numa cozinha e numa vontade muito simples — a de cuidar de alguém à distância. Presentear com comida é isso: é dizer “pensei em você” de um jeito que a pessoa sente no primeiro café.",
    "Foi essa ideia que virou a Le Brunch. Cada cesta é montada à mão, item por item, com uma curadoria escolhida com critério: croissants, pães selecionados, queijos e charcutaria, frutas frescas da estação, doces finos e café para coar.",
    "Nada sai daqui no automático. A Rebeca acompanha cada pedido — escolhe os itens, monta a bandeja e confere os detalhes antes de fechar a caixa. É por isso que pedimos 24h de antecedência: o que a gente entrega não dá para apressar.",
  ],

  /** REVISAR: frase da Rebeca, nas palavras dela. */
  citacao: null as string | null,

  valores: [
    {
      titulo: "Transmitir emoções",
      texto:
        "A cesta é o meio. O que a gente entrega de verdade é a reação de quem abre a caixa.",
    },
    {
      titulo: "Criar momentos",
      texto:
        "Um café da manhã que para o dia da pessoa — e que ela lembra tempo depois.",
    },
    {
      titulo: "Cuidar do detalhe",
      texto:
        "Da escolha da fruta ao laço da embalagem, tudo passa pelo mesmo olhar.",
    },
    {
      titulo: "Atender de perto",
      texto:
        "Sem carrinho e sem robô: a conversa é direta, do primeiro oi até a entrega.",
    },
  ],

  /** Foto larga: a Coleção de Natal montada sobre a mesa. */
  bastidores: {
    src: "/ensaio/natal-mesa.webp",
    largura: 2600,
    altura: 1733,
    alt: "Mesa redonda com a Coleção de Natal da Le Brunch — sacos de algodão estampados, caixas verdes com laço estrelado, kits com espumante e lata dourada — diante da guirlanda iluminada",
    legenda: "A Coleção de Natal 2026, montada peça por peça",
  },

  /**
   * Citação de abertura da galeria — avaliação real do Google, não texto
   * nosso. Enquanto a Rebeca não passar uma frase dela (`citacao`), quem
   * fala é quem recebeu.
   */
  destaque: {
    texto:
      "A entrega foi rápida e os croissants chegaram ainda quentinhos para a presenteada, que ficou emocionada com o presente.",
    autor: "lebirolli",
    origem: "avaliação no Google",
  },

  /**
   * Fotos do ensaio de outubro/2026, montadas em mosaico assimétrico:
   * `span` é a fração de 12 colunas, `aspecto` a proporção da moldura e
   * `foco` o ponto da foto que fica no recorte.
   */
  galeria: [
    {
      src: "/ensaio/cafe-g-1.webp",
      alt: "Bandeja redonda de madeira Café G vista de cima, com croissants, pães de queijo, morangos, uvas, geleia e suco de uva",
      legenda: "A bandeja Café G, no capricho de sempre",
      span: "lg:col-span-7",
      aspecto: "aspect-4/3",
      foco: "50% 55%",
    },
    {
      src: "/ensaio/rebeca-cesta-1.webp",
      alt: "Rebeca Santana sorrindo enquanto segura a Cesta Flores do Campo, de dólmã verde com a marca bordada",
      legenda: "Montada e conferida pela Rebeca",
      span: "lg:col-span-5",
      aspecto: "aspect-3/4",
      foco: "50% 40%",
    },
    {
      src: "/ensaio/cesta-bouquet-5.webp",
      alt: "Cesta de palha com buquê de flores, café Baggio, iogurte e pão no saquinho de tecido florido",
      legenda: "Flores que chegam junto",
      span: "lg:col-span-4",
      aspecto: "aspect-square",
      foco: "50% 60%",
    },
    {
      src: "/ensaio/cafe-coado-5.webp",
      alt: "Caixa de madeira com café, coador de pano, caneca de cerâmica e foto impressa",
      legenda: "Presentes com a cara de quem recebe",
      span: "lg:col-span-4",
      aspecto: "aspect-square",
      foco: "50% 55%",
    },
    {
      src: "/ensaio/box-caneca-3.webp",
      alt: "Caixa chapéu verde da Le Brunch com caneca de vidro gravada, café e brownie sobre a mesa",
      legenda: "Caneca com a inicial gravada",
      span: "lg:col-span-4",
      aspecto: "aspect-square",
      foco: "50% 62%",
    },
    {
      src: "/ensaio/mesa-itens.webp",
      alt: "Itens de uma cesta da Le Brunch espalhados sobre a mesa: café Baggio, caneca, suco de uva, queijos e pães na cesta de palha",
      legenda: "Curadoria item por item",
      span: "lg:col-span-12",
      aspecto: "aspect-4/3 sm:aspect-21/9",
      foco: "50% 42%",
    },
  ],

} as const;
