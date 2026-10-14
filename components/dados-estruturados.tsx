import { site } from "@/data/site";
import { cestas } from "@/data/cestas";

/**
 * JSON-LD de negócio local — ajuda o Google a ligar o site ao perfil da
 * empresa (o mesmo que recebe as avaliações). Sem endereço de rua: a base
 * é residencial, então declaramos apenas a cidade e a área atendida.
 */
export function DadosEstruturados() {
  const menorPreco = Math.min(
    ...cestas.filter((c) => c.preco !== null).map((c) => c.preco as number),
  );

  const dados = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": `${site.url}/#negocio`,
    name: site.nomeCompleto,
    description: site.descricao,
    url: site.url,
    telephone: `+${site.whatsapp}`,
    slogan: site.slogan,
    priceRange: `R$${menorPreco}+`,
    servesCuisine: "Café da manhã",
    founder: {
      "@type": "Person",
      name: site.fundadora.nome,
      jobTitle: site.fundadora.cargo,
    },
    award: `${site.premio.nome} ${site.premio.ano} — ${site.premio.categoria}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.google.nota,
      reviewCount: site.google.avaliacoes,
      bestRating: 5,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "09:00",
        closes: "13:00",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santo André",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    areaServed: [
      { "@type": "City", name: "São Paulo" },
      { "@type": "City", name: "Santo André" },
      { "@type": "City", name: "São Bernardo do Campo" },
      { "@type": "City", name: "São Caetano do Sul" },
      { "@type": "AdministrativeArea", name: "Grande ABC" },
    ],
    sameAs: [site.instagram.url],
  };

  return (
    <script
      type="application/ld+json"
      // JSON gerado a partir de dados nossos, sem entrada de usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
