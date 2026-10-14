import Image from "next/image";
import { clsx } from "@/lib/utils";

/**
 * Foto com parallax dentro da própria moldura.
 *
 * A imagem é renderizada 14% mais alta que a moldura e desliza conforme a
 * página rola (ver `.quadro-parallax` no globals.css). Onde a animação de
 * rolagem não é suportada — ou para quem pediu menos movimento — a foto
 * fica parada, sem perder enquadramento.
 *
 * Use só em foto grande e decorativa, no máximo 3 ou 4 por página.
 */
export function FotoParallax({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  zoom,
  prioridade,
  foco,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  /** Classes de proporção e canto, ex.: "aspect-16/9 rounded-2xl". */
  className?: string;
  /** Acrescenta um zoom lento de saída. */
  zoom?: boolean;
  prioridade?: boolean;
  /** `object-position` da foto dentro da moldura. */
  foco?: string;
}) {
  return (
    <div
      className={clsx("quadro-parallax", zoom && "foto-zoom", className)}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={prioridade ? "eager" : "lazy"}
        fetchPriority={prioridade ? "high" : undefined}
        style={foco ? { objectPosition: foco } : undefined}
      />
    </div>
  );
}
