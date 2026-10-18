"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { IconeSeta } from "@/components/icones";

export type FotoDetalhe = { src: string; alt: string; legenda: string };

/**
 * Galeria de fotos de detalhe, em rolagem lateral.
 *
 * No celular a trilha vai de ponta a ponta da tela e a pessoa arrasta. No
 * desktop ela fica dentro da coluna do site, com as duas bordas alinhadas
 * ao resto da página, quatro fotos por vez e setas ao lado do título — a
 * trilha que vazava só pela direita deixava a seção torta.
 *
 * Todas as fotos têm o mesmo tamanho: o efeito de crescer no centro foi
 * tirado porque desalinhava as fotos e as legendas.
 */
export function GaleriaDetalhes({
  fotos,
  rotulo,
  children,
}: {
  fotos: FotoDetalhe[];
  /** Rótulo acessível da região rolável. */
  rotulo: string;
  /** Título da seção (fica à esquerda das setas). */
  children: ReactNode;
}) {
  const trilha = useRef<HTMLUListElement>(null);

  const deslizar = (direcao: 1 | -1) => {
    const no = trilha.current;
    const item = no?.querySelector("li");
    if (!no || !item) return;
    const vao = parseFloat(getComputedStyle(no).columnGap) || 0;
    no.scrollBy({ left: (item.getBoundingClientRect().width + vao) * direcao, behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-site px-5 sm:px-8">
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-4">{children}</div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => deslizar(d)}
              aria-label={d === -1 ? "Fotos anteriores" : "Mais fotos"}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-verde-900/20 text-verde-900 transition-colors duration-300 hover:border-verde-900 hover:bg-verde-900 hover:text-papel"
            >
              <IconeSeta className={d === -1 ? "size-4 rotate-180" : "size-4"} />
            </button>
          ))}
        </div>
      </div>

      <ul
        ref={trilha}
        tabIndex={0}
        aria-label={rotulo}
        className="rolagem-lateral -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:gap-5 lg:px-0"
      >
        {fotos.map((foto) => (
          <li
            key={foto.src}
            className="w-[72%] shrink-0 snap-start sm:w-[40%] lg:w-[calc((100%-3*1.25rem)/4)]"
          >
            <figure className="flex flex-col gap-3">
              <Image
                src={foto.src}
                alt={foto.alt}
                width={1600}
                height={2400}
                sizes="(min-width: 1024px) 18rem, (min-width: 640px) 40vw, 72vw"
                className="aspect-3/4 w-full rounded-2xl object-cover"
              />
              <figcaption className="olho text-tinta-suave">{foto.legenda}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
