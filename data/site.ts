/**
 * Dados institucionais da Le Brunch.
 *
 * Fontes verificadas:
 * - Perfil do Google da empresa ("Le Brunch", Santo André): nota, número de
 *   avaliações, telefone, endereço e horário de funcionamento
 * - Dados cadastrais (razão social, CNPJ, endereço completo): informados
 *   pelo cliente
 * - Região de atendimento: "atendemos São Paulo e o grande ABC" (Catálogo)
 *
 * A CONFIRMAR: `email` (segue `null`, então não aparece no site).
 */

export const site = {
  nome: "Le Brunch",
  nomeCompleto: "Le Brunch Cestas",
  assinatura: "onde os momentos simples se tornam extraordinários.",
  slogan: "Transmitindo emoções, criando momentos!",
  descricao:
    "Cestas de café da manhã premium entregues montadas em São Paulo e no Grande ABC. Curadoria artesanal para presentear com emoção.",
  url: "https://www.lebrunchcestas.com.br",

  fundadora: {
    nome: "Rebeca Santana",
    cargo: "CEO & Fundadora",
  },

  telefone: "(11) 94984-5858",
  whatsapp: "5511949845858",
  email: null as string | null,

  instagram: {
    usuario: "@lebrunch_cestas",
    url: "https://www.instagram.com/lebrunch_cestas/",
  },

  google: {
    /** Dados lidos do perfil do Google em 09/09/2026. */
    nota: 5.0,
    avaliacoes: 119,
    perfil: "https://www.google.com/search?q=le+brunch+cestas",
    // TODO: trocar pelo link direto de avaliação quando tivermos o place_id:
    // https://search.google.com/local/writereview?placeid=SEU_PLACE_ID
    avaliar: "https://www.google.com/search?q=le+brunch+cestas",
  },

  /**
   * Prêmio Melhores no ABC — 2ª Temporada 2026.
   * Vencedora na categoria "Loja de Cestas de Café", organizado por
   * @melhoresnoabc. Fonte: destaque do Instagram do prêmio.
   */
  premio: {
    nome: "Prêmio Melhores no ABC",
    temporada: "2ª Temporada",
    ano: 2026,
    categoria: "Loja de Cestas de Café",
    organizador: "@melhoresnoabc",
    url: "https://www.instagram.com/melhoresnoabc/",
  },

  atendimento: {
    regiao: "São Paulo e todo o Grande ABC",
    base: "Santo André · SP",
    antecedencia: "24h de antecedência",
    antecedenciaCorporativa: "15 dias de antecedência",
  },

  /**
   * Atendimento e entrega são coisas diferentes: o pedido é atendido no
   * horário comercial, mas a entrega sai bem mais cedo. A separação evita a
   * dúvida de quem quer receber às 7h da manhã.
   *
   * `atendimento` vem do perfil do Google. `entregas` reproduz as faixas
   * oferecidas no modal de pedido.
   * A CONFIRMAR: o horário final da entrega no fim de semana.
   */
  horarios: {
    atendimento: [
      { dias: "Segunda a sexta", horas: "09:00 – 19:00" },
      { dias: "Sábado e domingo", horas: "09:00 – 13:00" },
    ],
    entregas: [
      { dias: "Segunda a sexta", horas: "07:00 – 18:00" },
      { dias: "Sábado e domingo", horas: "07:00 – 13:00" },
    ],
  },

  /**
   * Formas de pagamento.
   *
   * A Le Brunch parcela no cartão por link de pagamento, e a taxa da
   * operadora entra no valor — por isso NÃO se anuncia "sem juros" aqui.
   * A CONFIRMAR: em quantas parcelas (deixe `maximo` em `null` enquanto não
   * souber; o texto se adapta e não cita número nenhum).
   */
  pagamento: {
    aVista: "Pix ou transferência",
    parcelado: {
      maximo: null as number | null,
      meio: "cartão de crédito por link de pagamento",
      ressalva: "a taxa da operadora entra no valor final",
    },
  },

  /** Dados cadastrais para o rodapé. */
  cadastro: {
    razaoSocial: "Rebeca Saraiva Santana",
    cnpj: "44.402.749/0001-30",
    endereco: "Rua Icó, 80 — Parque Jaçatuba",
    cidade: "Santo André / SP",
    cep: "09290-500",
  },
} as const;

/** Monta um link de WhatsApp com mensagem pré-preenchida. */
export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const mensagens = {
  geral:
    "Olá! Vim pelo site da Le Brunch e gostaria de saber mais sobre as cestas de café da manhã.",
  cesta: (nome: string) =>
    `Olá! Vim pelo site da Le Brunch e me interessei pela cesta ${nome}. Pode me passar mais detalhes?`,
  categoria: (nome: string) =>
    `Olá! Vim pelo site da Le Brunch e gostaria de conhecer as opções da ${nome}.`,
  natal:
    "Olá! Vim pelo site da Le Brunch e gostaria de saber mais sobre a Coleção de Natal.",
  natalCorporativo:
    "Olá! Vim pelo site da Le Brunch e gostaria de um orçamento de presentes de Natal para a minha empresa (equipe/clientes).",
  corporativo:
    "Olá! Vim pelo site da Le Brunch e gostaria de um orçamento de brunch corporativo para a minha empresa.",
  corporativoPacote: (nome: string) =>
    `Olá! Vim pelo site da Le Brunch e gostaria de um orçamento do pacote ${nome} para a minha empresa.`,

  /**
   * Pedido montado no modal: já vai com modelo, data e período escolhidos,
   * para a Rebeca receber tudo na primeira mensagem.
   */
  pedido: ({
    cesta,
    preco,
    data,
    periodo,
    embalagem,
    adicionais,
    total,
    observacao,
  }: {
    cesta: string;
    preco: string | null;
    data: string | null;
    periodo: string | null;
    /** Embalagem escolhida, nos modelos que oferecem mais de uma. */
    embalagem?: string | null;
    /** Itens extras escolhidos no modal, já formatados. */
    adicionais?: Array<{ nome: string; quantidade: number; valor: string }>;
    /** Soma da cesta com os adicionais, sem o frete. */
    total?: string | null;
    /** Recado livre que a pessoa escreveu no modal. */
    observacao?: string | null;
  }) => {
    const linhas = [
      "Olá! Vim pelo site da Le Brunch e gostaria de pedir:",
      "",
      `• Cesta: ${cesta}${preco ? ` (${preco} + frete)` : ""}`,
    ];
    if (data) linhas.push(`• Data da entrega: ${data}`);
    if (periodo) linhas.push(`• Período: ${periodo}`);
    if (embalagem) linhas.push(`• Embalagem: ${embalagem}`);

    const extras = adicionais?.filter((a) => a.quantidade > 0) ?? [];
    if (extras.length > 0) {
      linhas.push("• Adicionais:");
      for (const a of extras) {
        linhas.push(`   – ${a.quantidade}x ${a.nome} (${a.valor})`);
      }
      if (total) linhas.push(`• Total dos itens: ${total} + frete`);
    }

    const recado = observacao?.trim();
    if (recado) {
      // Numa lista de bullets, quebra de linha do usuário viraria bagunça:
      // as linhas seguintes entram indentadas sob o mesmo item.
      linhas.push(`• Observações: ${recado.replace(/\n+/g, "\n  ")}`);
    }

    linhas.push("", "Pode confirmar a disponibilidade e a taxa de entrega?");
    return linhas.join("\n");
  },
} as const;
