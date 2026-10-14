"use client";

import { useRef } from "react";
import { CestaCard } from "@/components/cesta-card";
import { Revelar } from "@/components/revelar";
import { IconeSeta } from "@/components/icones";
import { clsx } from "@/lib/utils";
import type { Cesta } from "@/data/cestas";

/**
 * Grade de cestas.
 *
 * No celular vira um carrossel com encaixe (`scroll-snap`): o próximo card
 * espia na borda e a pessoa arrasta de lado, em vez de rolar a página
 * inteira para ver quatro modelos. A partir de `lg` volta a ser grade de
 * três colunas.
 *
 * O carrossel é rolagem nativa — sem biblioteca. O contêiner recebe
 * `tabIndex` e rótulo porque região rolável precisa ser alcançável pelo
 * teclado; as setas são um atalho a mais, não a única forma de navegar.
 */
export function GradeCestas({
  cestas,
  prontaEntrega,
  rotulo,
  escuro,
  colunas = 3,
}: {
  cestas: Cesta[];
  prontaEntrega?: boolean;
  /** Setas claras, para a grade sobre o veludo da Coleção de Natal. */
  escuro?: boolean;
  /** Colunas no desktop. Use 2 para grupos de dois, sem fileira órfã. */
  colunas?: 2 | 3;
  /** Nome da linha, para o rótulo acessível do carrossel. */
  rotulo: string;
}) {
  const trilha = useRef<HTMLUListElement>(null);

  const deslizar = (direcao: 1 | -1) => {
    const no = trilha.current;
    if (!no) return;
    const card = no.querySelector("li");
    const passo = card ? card.getBoundingClientRect().width + 16 : no.clientWidth * 0.8;
    no.scrollBy({ left: passo * direcao, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={trilha}
        tabIndex={0}
        role="group"
        aria-label={`Modelos: ${rotulo}`}
        className={clsx(
          "rolagem-lateral -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:snap-none lg:gap-x-5 lg:gap-y-12 lg:overflow-visible lg:px-0 lg:pb-0",
          colunas === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3",
        )}
      >
        {cestas.map((cesta, i) => (
          <li
            key={cesta.slug}
            className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-auto lg:shrink"
          >
            <Revelar atraso={(i % colunas) * 80}>
              <CestaCard
                cesta={cesta}
                prontaEntrega={prontaEntrega}
                prioridade={i === 0}
              />
            </Revelar>
          </li>
        ))}
      </ul>

      {/* setas: atalho no desktop e no tablet, onde há espaço na margem */}
      {cestas.length > 3 ? (
        <div className="mt-5 hidden justify-end gap-2 sm:flex lg:hidden">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => deslizar(d)}
              aria-label={d === -1 ? "Ver modelos anteriores" : "Ver mais modelos"}
              className={clsx(
                "inline-flex size-11 cursor-pointer items-center justify-center rounded-full border transition-colors duration-300",
                escuro
                  ? "border-papel/25 text-papel hover:border-ouro hover:bg-ouro hover:text-noite"
                  : "border-verde-900/20 text-verde-900 hover:border-verde-900 hover:bg-verde-900 hover:text-papel",
              )}
            >
              <IconeSeta className={d === -1 ? "size-4 rotate-180" : "size-4"} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
