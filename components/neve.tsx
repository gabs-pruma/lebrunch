import type { CSSProperties } from "react";

/**
 * Neve caindo sobre a página de Natal, desenhada em CSS.
 *
 * Leve de propósito: nenhum JavaScript, nenhuma imagem. Cada floco é um
 * `<span>` que só anima `transform`, então a queda roda no compositor (GPU)
 * e não refaz layout nem pintura a cada quadro. No celular cai metade dos
 * flocos. Com `prefers-reduced-motion` a neve não aparece.
 *
 * As posições saem de um sorteio com semente fixa, para o HTML ser sempre o
 * mesmo. O atraso negativo faz a neve já estar caindo quando a página abre.
 */
const TOTAL = 36;

function sorteio(semente: number) {
  let s = semente;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const aleatorio = sorteio(2026);
const FLOCOS = Array.from({ length: TOTAL }, (_, i) => {
  const tamanho = 3 + aleatorio() * 5;
  const duracao = 11 + aleatorio() * 10;
  return {
    // Espalha pela largura em faixas, com um desvio dentro de cada faixa.
    x: ((i + aleatorio()) / TOTAL) * 100,
    tamanho,
    duracao,
    atraso: -aleatorio() * duracao,
    deriva: (aleatorio() - 0.5) * 80,
    // Flocos maiores parecem mais perto: mais visíveis.
    opacidade: 0.4 + (tamanho / 8) * 0.45,
  };
});

export function Neve() {
  return (
    <div aria-hidden className="neve">
      {FLOCOS.map((f, i) => (
        <span
          key={i}
          style={
            {
              left: `${f.x.toFixed(2)}%`,
              width: `${f.tamanho.toFixed(1)}px`,
              height: `${f.tamanho.toFixed(1)}px`,
              "--d": `${f.duracao.toFixed(1)}s`,
              "--a": `${f.atraso.toFixed(1)}s`,
              "--deriva": `${f.deriva.toFixed(0)}px`,
              "--o": f.opacidade.toFixed(2),
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
