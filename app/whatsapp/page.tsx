import type { Metadata } from "next";
import { metadadosPagina } from "@/lib/metadados";
import { Secao } from "@/components/ui";
import { Simbolo } from "@/components/marca";
import { DesvioWhatsApp } from "@/components/desvio-whatsapp";
import { linkWhatsApp, mensagens } from "@/data/site";

/**
 * Desvio do link do WhatsApp da bio do Instagram.
 *
 * O link `wa.me` com mensagem pronta, colado direto no Instagram, chegava
 * codificado no app do celular ("Ol%C3%A1%21%20Vim…"): o Instagram guarda o
 * texto codificado duas vezes. Na bio vai este endereço, sem nada para
 * codificar (`/whatsapp/?utm_source=instagram&utm_medium=bio&utm_content=whatsapp`),
 * e a mensagem é montada aqui. De quebra o GA4 passa a contar esses toques.
 * Fora do índice e do sitemap: não é página de conteúdo.
 */
export const metadata: Metadata = {
  ...metadadosPagina({
    titulo: "Abrindo o WhatsApp",
    tituloSocial: "Fale com a Le Brunch no WhatsApp",
    descricao: "Fale com a Le Brunch pelo WhatsApp e escolha a sua cesta de café da manhã.",
    caminho: "/whatsapp/",
    og: "inicio",
  }),
  robots: { index: false, follow: true },
};

export default function WhatsAppPage() {
  const href = linkWhatsApp(mensagens.instagram);

  return (
    <Secao>
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
        <Simbolo className="h-10 w-10 text-terra-500" />
        <h1 className="titulo text-[clamp(1.875rem,8vw,3rem)] leading-[1.05]">
          Abrindo o WhatsApp…
        </h1>
        <p className="text-[1.0625rem] leading-relaxed text-tinta-suave">
          Se ele não abrir sozinho, toque no botão.
        </p>
        <DesvioWhatsApp href={href} />
      </div>
    </Secao>
  );
}
