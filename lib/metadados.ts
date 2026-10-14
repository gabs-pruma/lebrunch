import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Metadados de página: título, descrição, endereço canônico e a prévia de
 * compartilhamento (Open Graph), tudo de uma vez.
 *
 * O Next não herda `openGraph` campo a campo: a página que não declara o
 * seu fica com o do layout, e o link de uma cesta colado no WhatsApp
 * mostraria o título e a foto da home. Por isso toda página passa por aqui.
 *
 * `caminho` sempre com barra final — é o endereço que o export publica
 * (`trailingSlash`), e o canônico tem de ser o endereço que responde 200.
 */

/** Título e descrição da home — também o padrão do layout. */
export const tituloInicio = `${site.nomeCompleto} — Cestas de café da manhã em SP e Grande ABC`;
export const descricaoInicio = `${site.descricao} ${site.premio.nome} ${site.premio.ano}.`;

/** Imagem gerada por `scripts/gerar-og.py`, em `public/og/<chave>.jpg`. */
export function imagemOg(chave: string): string {
  return `/og/${chave}.jpg`;
}

export function metadadosPagina({
  titulo,
  tituloSocial,
  descricao,
  caminho,
  og,
}: {
  /** Título da aba; o layout acrescenta " · Le Brunch". Omita na home. */
  titulo?: string;
  /** Título da prévia, quando não for "<titulo> · Le Brunch". */
  tituloSocial?: string;
  descricao: string;
  caminho: string;
  /** Chave da imagem de compartilhamento (ver `imagemOg`). */
  og: string;
}): Metadata {
  const social = tituloSocial ?? `${titulo} · ${site.nome}`;
  const imagem = { url: imagemOg(og), width: 1200, height: 630, alt: social };
  return {
    ...(titulo ? { title: titulo } : {}),
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.nomeCompleto,
      title: social,
      description: descricao,
      url: caminho,
      images: [imagem],
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description: descricao,
      images: [imagem.url],
    },
  };
}
