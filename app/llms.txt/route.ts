import {
  adicionais,
  antecedenciaDe,
  categorias,
  cestas,
  cestasDaCategoria,
  formatarPreco,
  hrefCategoria,
} from "@/data/cestas";
import { site } from "@/data/site";

/**
 * `/llms.txt` — resumo do negócio em texto corrido, para assistentes de IA
 * (ChatGPT, Gemini, Perplexity, Claude) responderem sobre a Le Brunch com os
 * dados certos. Segue a proposta de llmstxt.org: título, resumo e listas de
 * links.
 *
 * Sai de `data/`, como o resto do site: preço, modelo ou horário novo
 * entra aqui sozinho. Só dado confirmado — modelo sem preço sai "sob
 * consulta", e pagamento sai de `site.pagamento` (nunca "sem juros").
 */
export const dynamic = "force-static";

const url = (caminho: string) => `${site.url}${caminho}`;

function texto(): string {
  const { pagamento, horarios, atendimento, google } = site;
  const parcelado = pagamento.parcelado.maximo
    ? `em até ${pagamento.parcelado.maximo}x no ${pagamento.parcelado.meio}`
    : `parcelado no ${pagamento.parcelado.meio}`;

  const linhas: string[] = [
    `# ${site.nomeCompleto}`,
    "",
    `> ${site.descricao}`,
    "",
    `A ${site.nome} monta à mão cestas de café da manhã, presentes e kits de Natal em ${atendimento.base} e entrega em ${atendimento.regiao}. Conduzida por ${site.fundadora.nome}. Nota ${google.nota.toFixed(1).replace(".", ",")} no Google, com ${google.avaliacoes} avaliações.`,
    "",
    "## Como pedir",
    "",
    `- Pelo WhatsApp ${site.telefone} (https://wa.me/${site.whatsapp}). No site, cada modelo abre um formulário que já monta a mensagem com o modelo, a data e o período de entrega. Nos presentes de Natal o pedido vai direto para o WhatsApp, e a disponibilidade é confirmada no atendimento.`,
    `- Pedidos com ${atendimento.antecedencia}.${cestas.filter((c) => c.antecedenciaDias).map((c) => ` ${c.nome}: ${antecedenciaDe(c)}.`).join("")}`,
    `- A taxa de entrega é calculada pelo endereço. Preços abaixo não incluem o frete.`,
    `- Pagamento: ${pagamento.aVista} à vista, ou ${parcelado} (${pagamento.parcelado.ressalva}).`,
    `- Atendimento: ${horarios.atendimento.map((h) => `${h.dias.toLowerCase()}, ${h.horas}`).join("; ")}. Entregas: ${horarios.entregas.map((h) => `${h.dias.toLowerCase()}, ${h.horas.toLowerCase()}`).join("; ")}.`,
    `- Adicionais: ${adicionais.map((a) => `${a.nome} (${formatarPreco(a.preco)})`).join(", ")}.`,
    "",
  ];

  for (const categoria of categorias) {
    const modelos = cestasDaCategoria(categoria.slug);
    if (modelos.length === 0) continue;
    linhas.push(`## ${categoria.nome}`, "", `${categoria.descricao} ${url(`${hrefCategoria(categoria)}/`)}`, "");
    for (const c of modelos) {
      const preco = c.preco !== null ? `${formatarPreco(c.preco)} + frete` : "preço sob consulta";
      const serve = c.serve ? ` Serve ${c.serve}.` : "";
      const obs = c.observacao ? ` ${c.observacao}` : "";
      const itens = c.secoes.flatMap((s) => s.itens).join(", ");
      linhas.push(
        `- [${c.nome}](${url(`/cestas/modelo/${c.slug}/`)}): ${c.chamada}. ${preco}.${serve} Itens: ${itens}.${obs}`,
      );
    }
    linhas.push("");
  }

  linhas.push(
    "## Páginas",
    "",
    `- [Todos os modelos](${url("/cestas/")})`,
    `- [Coleção de Natal](${url("/natal/")})`,
    `- [Conheça a Le Brunch](${url("/conheca/")}): a história da marca e da ${site.fundadora.nome}`,
    `- [Avaliações no Google](${google.perfil})`,
    `- [Instagram ${site.instagram.usuario}](${site.instagram.url})`,
    "",
  );

  return linhas.join("\n");
}

export function GET() {
  return new Response(texto(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
