import type { MetadataRoute } from "next";
import { cestas, linhasDoAno } from "@/data/cestas";
import { site } from "@/data/site";

// gerado uma vez no build (export estático para o GitHub Pages)
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  // Barra final: é o endereço que o export publica e o canônico de cada
  // página. Sem ela, todo link do sitemap passaria por um redirecionamento.
  return [
    { url: `${site.url}/`, lastModified: agora, priority: 1 },
    { url: `${site.url}/cestas/`, lastModified: agora, priority: 0.9 },
    { url: `${site.url}/natal/`, lastModified: agora, priority: 0.9 },
    { url: `${site.url}/conheca/`, lastModified: agora, priority: 0.7 },
    ...linhasDoAno.map((c) => ({
      url: `${site.url}/cestas/${c.slug}/`,
      lastModified: agora,
      priority: 0.8,
    })),
    ...cestas.map((c) => ({
      url: `${site.url}/cestas/modelo/${c.slug}/`,
      lastModified: agora,
      priority: 0.7,
    })),
  ];
}
