"use client";

import { useEffect } from "react";
import { IconeWhatsApp } from "@/components/icones";
import { BotaoLink } from "@/components/ui";

/** Quanto o desvio espera o GA4 confirmar o evento antes de seguir. */
const ESPERA_MAXIMA = 1500;

/**
 * Leva ao WhatsApp assim que a página abre (`/whatsapp/`), depois de contar
 * o toque no GA4 como `whatsapp_instagram` — evento separado do
 * `generate_lead`, que mede só os cliques feitos dentro do site.
 *
 * O GA4 é montado pelo `components/analytics.tsx` no mesmo ciclo de
 * efeitos, por isso o envio espera uma volta (`setTimeout`). Sem GA4
 * (prévia, `localhost`, bloqueador), segue na hora. `location.replace`
 * tira esta página do histórico: voltar do WhatsApp cai no Instagram.
 */
export function DesvioWhatsApp({ href }: { href: string }) {
  useEffect(() => {
    let foi = false;
    const seguir = () => {
      if (foi) return;
      foi = true;
      window.location.replace(href);
    };

    const espera = window.setTimeout(seguir, ESPERA_MAXIMA);
    const volta = window.setTimeout(() => {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
      if (!gtag) return seguir();
      gtag("event", "whatsapp_instagram", {
        metodo: "whatsapp",
        pagina: window.location.pathname,
        event_callback: seguir,
        event_timeout: ESPERA_MAXIMA - 200,
      });
    }, 0);

    return () => {
      window.clearTimeout(espera);
      window.clearTimeout(volta);
    };
  }, [href]);

  // `data-sem-lead`: o toque já foi contado ao abrir a página.
  return (
    <BotaoLink href={href} externo data-sem-lead="">
      <IconeWhatsApp className="size-5" />
      Abrir o WhatsApp
    </BotaoLink>
  );
}
