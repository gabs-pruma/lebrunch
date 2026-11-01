/**
 * Página da Coleção de Natal (`/natal`).
 *
 * Os modelos em si estão em `data/cestas.ts` (categoria "natal"). Aqui fica
 * só a organização da página: a Doce Natal (caixa de doces) em destaque e os outros presentes
 * numa grade só, na ordem do catálogo de Natal aprovado em 31/10/2026. O
 * catálogo não abre páginas de linha no Natal, então o site também não.
 */

export const colecaoNatal = {
  ano: 2026,

  /**
   * Modelo em destaque, logo na entrada dos presentes — com poucas linhas,
   * para os outros modelos virem logo depois (pedido do Gabriel, 01/11/2026).
   */
  estrela: "natal-caixa-de-doces",

  /** Condições do catálogo de Natal. */
  condicoes: [
    "Acima de 5 unidades, condição especial: consulte",
    "Reservas somente mediante pagamento",
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
      src: "/ensaio/natal-doces-4.webp",
      alt: "Caixa redonda verde da Le Brunch aberta, com castanhas, trufas e doces finos, sob a guirlanda iluminada",
    },
  },
} as const;
