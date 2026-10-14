/**
 * Avaliações reais do perfil do Google da Le Brunch.
 *
 * Copiadas do perfil em 09/09/2026, quando a empresa tinha nota 5,0 com 119
 * avaliações. O texto está como o cliente escreveu (inclusive emojis e a
 * pontuação original) — nada foi reescrito.
 *
 * Como a média é 5,0 em 119 avaliações, todas as avaliações listadas são de
 * 5 estrelas. Ao incluir uma nova, copie o texto na íntegra e confirme a nota
 * no perfil antes de marcar `verificado: true`.
 */

export type Depoimento = {
  nome: string;
  nota: 1 | 2 | 3 | 4 | 5;
  texto: string;
  /** Quando foi publicada, como o Google mostra. */
  quando?: string;
  ocasiao?: string;
  /** true = avaliação real copiada do perfil do Google */
  verificado: boolean;
};

export const depoimentos: Depoimento[] = [
  {
    nome: "lebirolli",
    nota: 5,
    texto:
      "Só tenho a agradecer a Rebeca. Me atendeu com muita agilidade e principalmente com atenção e carinho. A entrega foi rápida e os croissants chegaram ainda quentinhos para a presenteada que ficou emocionada com o presente. Obrigada! Super recomendo!!!",
    quando: "há 7 meses",
    verificado: true,
  },
  {
    nome: "Alannis Soares",
    nota: 5,
    texto:
      "Super recomendo!!! Pedi uma cesta para minha mãe de aniversário e veio tudo perfeito. Trabalho impecável e excelente, com certeza pedirei outras vezes e indicarei 🥰",
    quando: "há 2 meses",
    ocasiao: "Aniversário",
    verificado: true,
  },
  {
    nome: "Noelle Bueno",
    nota: 5,
    texto:
      "Recebi uma cesta maravilhosa de dia das mães do meu esposo e filhos e estava tudo impecável! Uma cheiro maravilhoso, ingredientes frescos e de muita qualidade. A cesta é enorme, o cuidado e amor se percebe em cada detalhe.",
    quando: "há um ano",
    ocasiao: "Dia das Mães",
    verificado: true,
  },
  {
    nome: "Jacqueline Oliveira Prestes",
    nota: 5,
    texto:
      "Encomendei duas cestas, e só tenho elogios! Que capricho! Que delicadas! Perfeitas. Atendimento impecável, produtos de qualidade e fresquinhos. Comprem!!",
    quando: "há 3 meses",
    verificado: true,
  },
  {
    nome: "Cibele Smanioto",
    nota: 5,
    texto:
      "Trabalho impecável, cesta linda, produtos de excelente qualidade. A Rebeca foi super atenciosa e solicita.",
    quando: "há 5 meses",
    verificado: true,
  },
];

/** Só vão ao ar avaliações reais conferidas no perfil do Google. */
export const depoimentosReais = depoimentos.filter((d) => d.verificado);
