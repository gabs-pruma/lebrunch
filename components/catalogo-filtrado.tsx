"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { GradeCestas } from "@/components/grade-cestas";
import { BotaoLink } from "@/components/ui";
import { Simbolo } from "@/components/marca";
import { filtrosDoEndereco } from "@/components/painel-filtro";
import {
  categoriaDe,
  faixasDePreco,
  filtrarCestas,
  opcoesPessoas,
  type CategoriaSlug,
} from "@/data/cestas";

/**
 * O `/cestas/` filtrado pela faixa da home. Sem filtro no endereço, mostra
 * o catálogo de sempre (`children`, que já vem pronto do servidor); com
 * filtro, só o resultado.
 *
 * O export é estático, então o filtro é lido no navegador. A página entra
 * num `<Suspense>` cujo fallback é o próprio catálogo: quem chega sem
 * filtro não vê nada piscar.
 *
 * Tudo numa grade só, presentes de Natal inclusive (no card claro): a
 * contagem do título é o que a pessoa vê logo abaixo.
 */
export function CatalogoFiltrado({ children }: { children: ReactNode }) {
  const filtros = filtrosDoEndereco(useSearchParams());
  if (!filtros.linha && !filtros.preco && !filtros.pessoas) return children;

  const resultado = filtrarCestas(filtros);
  const resumo = [
    filtros.linha && categoriaDe(filtros.linha as CategoriaSlug).nome,
    faixasDePreco.find((f) => f.slug === filtros.preco)?.nome,
    opcoesPessoas.find((o) => o.slug === filtros.pessoas)?.nome,
  ].filter(Boolean);

  return (
    <>
      <section aria-labelledby="titulo-resultado" className="px-5 py-12 sm:px-8 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <p className="olho text-terra-700">{resumo.join(" · ")}</p>
              <h2 id="titulo-resultado" aria-live="polite" className="titulo text-[clamp(1.625rem,6vw,3rem)] leading-tight">
                {resultado.length === 0
                  ? "Nenhum modelo com esses filtros"
                  : `${resultado.length} ${resultado.length === 1 ? "modelo encontrado" : "modelos encontrados"}`}
              </h2>
            </div>
            <BotaoLink href="/cestas" variante="texto" className="self-start sm:self-auto">
              Ver todos os modelos
            </BotaoLink>
          </div>

          {resultado.length > 0 ? (
            <GradeCestas
              cestas={resultado}
              rotulo="modelos encontrados"
              colunas={resultado.length === 2 || resultado.length === 4 ? 2 : 3}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <Simbolo className="h-7 w-7 text-terra-500" />
              <p className="max-w-sm text-[0.9375rem] leading-relaxed text-tinta-suave">
                Tente outra faixa de preço ou outro número de pessoas — ou
                veja o catálogo inteiro.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
