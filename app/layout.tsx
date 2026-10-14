import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { comBase, previa } from "@/lib/base";
import { Cormorant_Garamond, Jost, Parisienne } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { FundoDecorativo } from "@/components/fundo-decorativo";
import { DadosEstruturados } from "@/components/dados-estruturados";
import { ObservadorDeRota } from "@/components/transicao";
import { site } from "@/data/site";

/*
  Tipografia — equivalentes livres às fontes do manual da marca:
  The Seasons        → Cormorant Garamond (serifa elegante, alto contraste)
  Codec Pro          → Jost (sans geométrica)
  Brittany Signature → Parisienne (manuscrita de assinatura)
*/
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nomeCompleto} — Cestas de café da manhã premium em São Paulo e Grande ABC`,
    template: `%s · ${site.nome}`,
  },
  description: `${site.descricao} Vencedora do ${site.premio.nome} ${site.premio.ano} na categoria ${site.premio.categoria}.`,
  applicationName: site.nomeCompleto,
  keywords: [
    "cesta de café da manhã",
    "cesta de café da manhã São Paulo",
    "cesta de café da manhã Santo André",
    "cesta premium",
    "brunch corporativo",
    "presente café da manhã",
    "Grande ABC",
    "Melhores no ABC 2026",
    "cesta de Natal",
    "presente de Natal Santo André",
    "kit de Natal corporativo",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.nomeCompleto,
    title: `${site.nomeCompleto} — ${site.assinatura}`,
    description: `${site.descricao} Vencedora do ${site.premio.nome} ${site.premio.ano}.`,
  },
  twitter: { card: "summary_large_image" },
  robots: previa ? { index: false, follow: false } : { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${jost.variable} ${parisienne.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col"
        style={
          { "--textura": `url(${comBase("/textura/papel.webp")})` } as CSSProperties
        }
      >
        <a
          href="#conteudo"
          className="olho sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-full focus:bg-verde-900 focus:px-5 focus:py-3 focus:text-papel"
        >
          Ir para o conteúdo
        </a>
        <FundoDecorativo />
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <WhatsAppFab />
        <DadosEstruturados />
        <ObservadorDeRota />
      </body>
    </html>
  );
}
