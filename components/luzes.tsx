import type { CSSProperties } from "react";
import { clsx } from "@/lib/utils";

/**
 * Pisca-pisca desfocado (bokeh) das fotos de Natal, desenhado em CSS.
 *
 * Posições fixas — nada de aleatório, para o HTML do servidor e o do
 * cliente serem iguais. Cada luz pisca no próprio ritmo (`--d`) e com a
 * própria defasagem (`--a`). Decorativo e inerte.
 */
const LUZES: Array<[x: number, y: number, tamanho: number, duracao: number, atraso: number, opacidade: number]> = [
  [4, 8, 10, 3.2, 0, 0.9], [11, 22, 6, 4.1, 0.6, 0.7], [17, 6, 14, 3.6, 1.2, 0.55],
  [24, 16, 8, 2.8, 0.3, 0.85], [31, 4, 5, 4.4, 1.8, 0.8], [38, 19, 12, 3.4, 0.9, 0.5],
  [45, 9, 7, 3.0, 2.1, 0.9], [52, 25, 10, 4.6, 0.2, 0.6], [59, 7, 16, 3.8, 1.5, 0.45],
  [66, 18, 6, 2.6, 0.7, 0.9], [72, 5, 9, 3.3, 2.4, 0.75], [79, 21, 13, 4.2, 1.1, 0.5],
  [85, 10, 7, 3.1, 0.4, 0.85], [91, 26, 11, 3.9, 1.9, 0.6], [96, 6, 6, 2.9, 1.3, 0.9],
  [8, 34, 5, 3.7, 2.6, 0.6], [28, 31, 7, 4.3, 0.8, 0.55], [63, 33, 6, 3.5, 2.2, 0.6],
  [88, 38, 8, 4.0, 0.1, 0.5], [47, 36, 5, 3.2, 1.6, 0.5],
];

export function Luzes({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx("luzes", className)}>
      {LUZES.map(([x, y, t, d, a, o], i) => (
        <span
          key={i}
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              width: `${t * 2}px`,
              height: `${t * 2}px`,
              "--d": `${d}s`,
              "--a": `${a}s`,
              "--o": o,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
