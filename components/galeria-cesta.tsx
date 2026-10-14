"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SetasFoto } from "@/components/setas-foto";
import { clsx } from "@/lib/utils";

/**
 * Galeria da cesta: foto grande em retrato 4:5 com trilha de miniaturas.
 * Setas sobre a foto passam de uma em uma, e no celular dá para arrastar
 * com o dedo para os lados.
 *
 * Todas as fotos ficam empilhadas na moldura e a escolhida entra com
 * fusão — nada de piscar branco ao trocar. Quando o modelo só tem uma
 * foto, a trilha não é renderizada. As miniaturas são botões de verdade,
 * com `aria-current`, para funcionarem no teclado e no leitor de tela.
 */
export function GaleriaCesta({
  fotos,
  nome,
  foco,
  escuro,
  semPrioridade,
}: {
  /** A primeira é a foto de capa. */
  fotos: string[];
  nome: string;
  /** `object-position` da cesta. */
  foco?: string;
  /** Variante sobre o veludo da Coleção de Natal. */
  escuro?: boolean;
  /** true quando a galeria não é a imagem principal da página. */
  semPrioridade?: boolean;
}) {
  const [ativa, setAtiva] = useState(0);
  const toque = useRef<{ x: number; y: number } | null>(null);
  const n = fotos.length;
  const posicao = { objectPosition: foco ?? "50% 50%" };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={clsx(
          "relative aspect-4/5 w-full touch-pan-y overflow-hidden rounded-2xl",
          escuro ? "bg-noite-alt" : "bg-creme",
        )}
        onPointerDown={(e) => {
          if (e.pointerType === "touch") toque.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const inicio = toque.current;
          toque.current = null;
          if (!inicio || n < 2) return;
          const dx = e.clientX - inicio.x;
          // arrasto horizontal de verdade, não uma rolagem torta
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - inicio.y)) {
            setAtiva((ativa + (dx < 0 ? 1 : -1) + n) % n);
          }
        }}
        onPointerCancel={() => {
          toque.current = null;
        }}
      >
        {fotos.map((foto, i) => (
          <Image
            key={foto}
            src={foto}
            alt={i === ativa ? `Cesta ${nome} da Le Brunch — foto ${i + 1} de ${fotos.length}` : ""}
            aria-hidden={i !== ativa || undefined}
            width={1600}
            height={2400}
            loading={i === 0 && !semPrioridade ? "eager" : "lazy"}
            fetchPriority={i === 0 && !semPrioridade ? "high" : undefined}
            sizes="(min-width: 1024px) 46vw, 92vw"
            style={posicao}
            className={clsx(
              "absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 ease-suave",
              i === ativa ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
            )}
          />
        ))}
        <SetasFoto total={n} ativa={ativa} aoMudar={setAtiva} nome={nome} escuro={escuro} />
      </div>

      {fotos.length > 1 ? (
        <ul className="flex gap-3">
          {fotos.map((foto, i) => (
            <li key={foto} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setAtiva(i)}
                aria-current={i === ativa ? "true" : undefined}
                aria-label={`Ver foto ${i + 1} de ${fotos.length} da cesta ${nome}`}
                className={clsx(
                  "relative block aspect-square w-full cursor-pointer overflow-hidden rounded-xl transition-[opacity,box-shadow] duration-300",
                  escuro ? "bg-noite-alt" : "bg-creme",
                  i === ativa
                    ? escuro
                      ? "ring-1 ring-ouro"
                      : "ring-1 ring-verde-900/45"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={foto}
                  alt=""
                  width={300}
                  height={450}
                  sizes="15vw"
                  style={posicao}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
