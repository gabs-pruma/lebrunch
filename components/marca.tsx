import { clsx } from "@/lib/utils";
import { comBase } from "@/lib/base";

/**
 * Logo e símbolo da Le Brunch.
 *
 * Os SVGs em /public/marca foram vetorizados a partir do logo oficial do
 * Catálogo Le Brunch. Usamos `mask-image` em vez de <img> para que a marca
 * herde a cor do texto (`currentColor`) — o mesmo arquivo serve para o
 * logo verde no papel e para o logo claro sobre o verde profundo.
 */

type MarcaProps = {
  className?: string;
  titulo?: string;
};

const mascara = (arquivo: string) => ({
  maskImage: `url(${comBase(`/marca/${arquivo}`)})`,
  WebkitMaskImage: `url(${comBase(`/marca/${arquivo}`)})`,
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
  maskSize: "contain",
  WebkitMaskSize: "contain",
});

/** Marca completa: símbolo acima do logotipo. Proporção 915 × 455. */
export function Logotipo({ className, titulo = "Le Brunch" }: MarcaProps) {
  return (
    <span
      role="img"
      aria-label={titulo}
      className={clsx("block bg-current", className)}
      style={mascara("lebrunch.svg")}
    />
  );
}

/** Apenas o logotipo "LeBRUNCH". Proporção 915 × 117. */
export function Wordmark({ className, titulo = "Le Brunch" }: MarcaProps) {
  return (
    <span
      role="img"
      aria-label={titulo}
      className={clsx("block bg-current", className)}
      style={mascara("wordmark.svg")}
    />
  );
}

/** Apenas o símbolo (quadrifólio). Proporção 277 × 275. */
export function Simbolo({
  className,
  "aria-hidden": ariaHidden = true,
}: MarcaProps & { "aria-hidden"?: boolean }) {
  return (
    <span
      aria-hidden={ariaHidden || undefined}
      role={ariaHidden ? undefined : "img"}
      aria-label={ariaHidden ? undefined : "Símbolo Le Brunch"}
      className={clsx("block bg-current", className)}
      style={mascara("simbolo.svg")}
    />
  );
}
