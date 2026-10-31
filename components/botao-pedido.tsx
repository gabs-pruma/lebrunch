"use client";

import { useState } from "react";
import { ModalPedido } from "@/components/modal-pedido";
import { clsx } from "@/lib/utils";
import type { Cesta } from "@/data/cestas";

/**
 * Botão que abre o modal de pedido. Usado na página da cesta, para que o
 * fluxo de escolher data e sair para o WhatsApp seja o mesmo dos cards.
 */
export function BotaoPedido({
  cesta,
  className,
  rotulo,
  variante = "verde",
}: {
  cesta: Cesta;
  className?: string;
  rotulo?: string;
  /** "ouro" para a Coleção de Natal. */
  variante?: "verde" | "ouro";
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className={clsx(
          "inline-flex min-h-13 cursor-pointer items-center justify-center gap-2.5 rounded-full px-7 text-[0.8125rem] tracking-[0.14em] uppercase transition-[background-color,transform] duration-300 ease-suave active:scale-[0.985]",
          variante === "ouro"
            ? "bg-ouro text-noite hover:bg-ouro-claro"
            : "bg-verde-900 text-papel hover:bg-verde-700",
          className,
        )}
      >
        {rotulo ?? "Quero esse modelo"}
      </button>

      <ModalPedido
        cesta={cesta}
        aberto={aberto}
        onFechar={() => setAberto(false)}
      />
    </>
  );
}
