"use client";

import { IconeDivisa } from "@/components/icones";
import { clsx } from "@/lib/utils";

/**
 * Setas de anterior/próxima sobre a foto de uma cesta, com o contador
 * "2 / 5". A lista dá a volta: da última foto, "próxima" leva à primeira.
 *
 * Fica por cima da moldura (`absolute inset-0`), sem capturar o clique no
 * resto da foto.
 */
export function SetasFoto({
  total,
  ativa,
  aoMudar,
  nome,
  escuro,
}: {
  total: number;
  ativa: number;
  aoMudar: (indice: number) => void;
  nome: string;
  escuro?: boolean;
}) {
  if (total < 2) return null;

  const ir = (passo: number) => aoMudar((ativa + passo + total) % total);
  const botao = clsx(
    "pointer-events-auto flex size-10 cursor-pointer items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-[opacity,background-color,transform] duration-300 active:scale-95",
    escuro
      ? "bg-noite/70 text-ouro-claro ring-1 ring-ouro/35 hover:bg-noite/90"
      : "bg-papel/85 text-verde-900 hover:bg-papel",
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <span
        className={clsx(
          "absolute top-3 right-3 rounded-full px-2.5 py-1 text-[0.75rem] tabular-nums backdrop-blur-sm",
          escuro ? "bg-noite/70 text-ouro-claro" : "bg-papel/85 text-verde-900",
        )}
        aria-live="polite"
      >
        <span className="sr-only">Foto </span>
        {ativa + 1}
        <span aria-hidden> / </span>
        <span className="sr-only"> de </span>
        {total}
      </span>
      <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
        <button
          type="button"
          onClick={() => ir(-1)}
          aria-label={`Foto anterior da cesta ${nome}`}
          className={botao}
        >
          <IconeDivisa className="size-5 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => ir(1)}
          aria-label={`Próxima foto da cesta ${nome}`}
          className={botao}
        >
          <IconeDivisa className="size-5" />
        </button>
      </div>
    </div>
  );
}
