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
      id: "na-lata",
      titulo: "Na lata",
      descricao:
        "A lata Feliz Natal estampada de pinheiros, com brownies ou com o panetone dentro. Você escolhe se ela vai na sacolinha de tecido ou no Saco de Noel, com laço de cetim vermelho.",
      slugs: ["natal-lata-de-brownies", "natal-lata-de-panetone"],
    },
    {
      id: "para-adocar",
      titulo: "Para adoçar",
      descricao:
        "A caixa de doces finos com laço de veludo e a caneca natalina com brownie. Para a ceia, o amigo secreto, a professora, a vizinha.",
      slugs: ["natal-caixa-petiscos", "natal-kit-caneca"],
    },
  ],

  ambiente: {
    hero: {
      paisagem: "/ensaio/natal-mesa.webp",
      retrato: "/ensaio/natal-mesa-3.webp",
      alt: "Mesa redonda com a Coleção de Natal da Le Brunch diante da guirlanda iluminada e da cortina de veludo verde",
    },
    rebeca: {
      src: "/ensaio/natal-rebeca.webp",
      alt: "Rebeca Santana, de vestido estampado, arrumando os presentes de Natal sobre a mesa ao lado da guirlanda",
    },
    mesa: {
      src: "/ensaio/natal-petiscos-6.webp",
      alt: "Caixa redonda verde da Le Brunch aberta, com castanhas, trufas e doces finos, sob a guirlanda iluminada",
    },
  },
} as const;
