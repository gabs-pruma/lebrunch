"use client";

import { useSyncExternalStore } from "react";
import { IconeWhatsApp } from "@/components/icones";
import { linkWhatsApp, mensagens } from "@/data/site";
import { clsx } from "@/lib/utils";

/**
 * Botão flutuante de WhatsApp.
 *
 * Só aparece depois que a pessoa passa da primeira dobra: na abertura ele
 * cobriria as ações do hero e tiraria do site quem ainda não viu nenhuma
 * cesta. A partir daí ele acompanha a rolagem como atalho de pedido.
 */

function assinarScroll(avisar: () => void) {
  window.addEventListener("scroll", avisar, { passive: true });
  window.addEventListener("resize", avisar);
  return () => {
    window.removeEventListener("scroll", avisar);
    window.removeEventListener("resize", avisar);
  };
}

const passouDaDobra = () => window.scrollY > window.innerHeight * 0.75;
const noServidor = () => false;

export function WhatsAppFab() {
  const visivel = useSyncExternalStore(
    assinarScroll,
    passouDaDobra,
    noServidor,
  );

  return (
    <a
      href={linkWhatsApp(mensagens.geral)}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!visivel}
      tabIndex={visivel ? undefined : -1}
      className={clsx(
        "fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex min-h-13 items-center gap-2.5 rounded-full bg-verde-600 pr-5 pl-4 text-papel shadow-[0_8px_28px_-8px_rgba(0,62,57,0.55)] sm:right-6 sm:bottom-6",
        "transition-[opacity,transform] duration-500 ease-suave hover:bg-verde-900",
        visivel
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <IconeWhatsApp className="size-6 shrink-0" />
      <span className="text-[0.8125rem] tracking-[0.1em] uppercase">
        Pedir agora
      </span>
    </a>
  );
}
