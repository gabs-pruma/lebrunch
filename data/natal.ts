/**
 * Página da Coleção de Natal (`/natal`).
 *
 * Os modelos em si estão em `data/cestas.ts` (categoria "natal"). Aqui fica
 * só a organização da página: os três jeitos de presentear, a estrela da
 * coleção e as fotos de ambiente do ensaio de outubro/2026.
 */

export const colecaoNatal = {
  ano: 2026,

  /** Modelo em destaque, apresentado em tamanho grande. */
  estrela: "natal-tabua-de-frios",

  grupos: [
    {
      id: "para-brindar",
      titulo: "Para brindar",
      descricao:
        "Mini espumante na bolsa de acrílico, com tag Boas Festas — e um doce para acompanhar.",
      slugs: ["natal-espumante-e-panetone", "natal-boas-festas"],
    },
    {
      id: "para-adocar",
      titulo: "Para adoçar",
      descricao:
        "A caixa de petiscos e as latas estampadas de pinheiro. Doces finos para a mesa de quem você ama.",
      slugs: [
        "natal-caixa-petiscos",
        "natal-lata-de-brownies",
        "natal-lata-e-panetone",
      ],
    },
    {
      id: "lembrancinhas",
      titulo: "Lembrancinhas",
      descricao:
        "A caneca natalina com brownie e o saquinho de algodão com laço de cetim. Para o amigo secreto, a professora, a vizinha.",
      slugs: ["natal-kit-caneca", "natal-saquinho"],
    },
  ],

  ambiente: {
    hero: {
      paisagem: "/ensaio/natal-mesa.webp",
      retrato: "/ensaio/natal-mesa-4.webp",
      alt: "Mesa redonda com a Coleção de Natal da Le Brunch diante da guirlanda iluminada e da cortina de veludo verde",
    },
    rebeca: {
      src: "/ensaio/natal-rebeca.webp",
      alt: "Rebeca Santana, de vestido estampado, arrumando os presentes de Natal sobre a mesa ao lado da guirlanda",
    },
    mesa: {
      src: "/ensaio/natal-mesa-3.webp",
      alt: "Composição com sacos de algodão estampados, caixas verdes com laço estrelado, espumante e lata dourada",
    },
  },
} as const;
