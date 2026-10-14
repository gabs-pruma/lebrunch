import Image from "next/image";
import { clsx } from "@/lib/utils";
import { comBase } from "@/lib/base";

/**
 * Ilustrações do catálogo impresso, usadas como marca d'água nas seções.
 *
 * Os traços de padaria (pão, rosca, croissant, trigo) foram extraídos do
 * "Catálogo Le Brunch.pdf" como máscaras, então são aplicados com
 * `mask-image` e herdam a cor do texto — funcionam sobre o papel e sobre o
 * verde profundo. As aquarelas (ramo e flores) têm cor própria e entram
 * como imagem normal.
 */

export type Traco = "pao" | "rosca" | "croissant" | "trigo";
export type Aquarela = "ramo" | "flor-haste" | "flor-margarida" | "flor-petalas";

/** Desenho a traço, na cor do texto. Sempre decorativo. */
export function Traco({
  nome,
  className,
}: {
  nome: Traco;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={clsx("pointer-events-none block bg-current", className)}
      style={{
        maskImage: `url(${comBase(`/ilustracoes/${nome}.webp`)})`,
        WebkitMaskImage: `url(${comBase(`/ilustracoes/${nome}.webp`)})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

const proporcoes: Record<Aquarela, [number, number]> = {
  ramo: [425, 620],
  "flor-haste": [249, 620],
  "flor-margarida": [308, 305],
  "flor-petalas": [583, 618],
};

/** Aquarela botânica do catálogo. Sempre decorativa. */
export function Aquarela({
  nome,
  className,
}: {
  nome: Aquarela;
  className?: string;
}) {
  const [w, h] = proporcoes[nome];
  return (
    <Image
      src={`/ilustracoes/${nome}.webp`}
      alt=""
      aria-hidden
      width={w}
      height={h}
      /* A camada de fundo é fixa e já está à vista no primeiro quadro:
         lazy só provocaria um piscar do papel de parede. */
      loading="eager"
      className={clsx("pointer-events-none select-none", className)}
    />
  );
}
