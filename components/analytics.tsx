"use client";

import { useEffect } from "react";
import { DOMINIO_OFICIAL, GA_ID, modeloDaMensagem, registrar } from "@/lib/analytics";

/**
 * Carrega o GA4 só no domínio oficial e registra os cliques que levam ao
 * WhatsApp como `generate_lead` (o evento de contato recomendado pelo GA4),
 * com o modelo quando a mensagem já vem pronta. Fica no `layout.tsx`.
 */
export function Analytics() {
  useEffect(() => {
    if (window.location.hostname !== DOMINIO_OFICIAL) return;

    const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag() {
      // o gtag.js lê o objeto `arguments`, não um array
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("config", GA_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    const aoClicar = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href*='wa.me']:not([data-sem-lead])");
      if (!(link instanceof HTMLAnchorElement)) return;
      const modelo = modeloDaMensagem(link.href);
      registrar("generate_lead", {
        metodo: "whatsapp",
        pagina: window.location.pathname,
        ...(modelo ? { modelo } : {}),
      });
    };
    document.addEventListener("click", aoClicar, { capture: true });
    return () => document.removeEventListener("click", aoClicar, { capture: true });
  }, []);

  return null;
}
