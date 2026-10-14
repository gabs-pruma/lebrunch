/**
 * Carregador do `next/image` para o export estático.
 *
 * O GitHub Pages não roda o otimizador de imagens do Next, então as fotos
 * saem como estão em `public/` (WebP de 1600px, já comprimidas pelo
 * `scripts/exportar-ensaio.py`). O carregador só acrescenta o prefixo do
 * site publicado.
 */
import { comBase } from "@/lib/base";

export default function carregadorImagem({ src }: { src: string; width: number; quality?: number }) {
  return comBase(src);
}
