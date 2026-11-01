"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { clsx } from "@/lib/utils";
import { semBarraFinal } from "@/lib/base";
import { registrar } from "@/lib/analytics";
import {
  categorias,
  faixasDePreco,
  filtrarCestas,
  opcoesPessoas,
  type Filtros,
} from "@/data/cestas";

/**
 * "Encontre a sua cesta" — os filtros que moram dentro do menu (linha,
 * pessoas, faixa de preço), em chips. O botão já diz quantos modelos vão
 * aparecer e leva ao `/cestas/` filtrado
 * (`?linha=premium&pessoas=2&preco=ate-150`), onde
 * `components/catalogo-filtrado.tsx` mostra o resultado.
 *
 * Os chips são botões com `aria-pressed`, um valor por grupo (tocar de novo
 * desmarca). Opção que zeraria o resultado fica desabilitada.
 */

export const filtrosVazios: Filtros = { linha: "", preco: "", pessoas: "" };

/** Lê os filtros do endereço, ignorando valor que não existe. */
export function filtrosDoEndereco(busca: URLSearchParams): Filtros {
  const valido = (v: string | null, opcoes: readonly { slug: string }[]) =>
    v && opcoes.some((o) => o.slug === v) ? v : "";
  return semPessoasNoNatal({
    linha: valido(busca.get("linha"), categorias),
    preco: valido(busca.get("preco"), faixasDePreco),
    pessoas: valido(busca.get("pessoas"), opcoesPessoas),
  });
}

export function enderecoFiltrado(f: Filtros): string {
  const busca = new URLSearchParams(
    Object.entries(f).filter(([, v]) => v) as [string, string][],
  ).toString();
  return busca ? `/cestas/?${busca}` : "/cestas/";
}

const grupos: { chave: keyof Filtros; rotulo: string; opcoes: { slug: string; nome: string }[] }[] = [
  { chave: "linha", rotulo: "Linha", opcoes: categorias.map((c) => ({ slug: c.slug, nome: c.nomeCurto })) },
  { chave: "pessoas", rotulo: "Para quantas pessoas", opcoes: [...opcoesPessoas] },
  { chave: "preco", rotulo: "Faixa de preço", opcoes: faixasDePreco.map((f) => ({ slug: f.slug, nome: f.curto })) },
];

/**
 * O Natal não se escolhe por número de pessoas: ao escolher a linha de Natal,
 * o filtro de pessoas some e se desfaz.
 */
function semPessoasNoNatal(f: Filtros): Filtros {
  return f.linha === "natal" ? { ...f, pessoas: "" } : f;
}

export function PainelFiltro({
  inicial = filtrosVazios,
  aoIr,
}: {
  inicial?: Filtros;
  /** Chamado ao sair para o resultado (o menu fecha). */
  aoIr?: () => void;
}) {
  const router = useRouter();
  const [filtros, setFiltros] = useState<Filtros>(inicial);
  const total = filtrarCestas(filtros).length;
  const algum = Boolean(filtros.linha || filtros.preco || filtros.pessoas);

  const escolher = (chave: keyof Filtros, valor: string) =>
    setFiltros((f) => semPessoasNoNatal({ ...f, [chave]: f[chave] === valor ? "" : valor }));

  return (
    <div role="search" aria-label="Encontre a sua cesta" className="flex flex-col gap-4">
      {grupos
        .filter((grupo) => !(grupo.chave === "pessoas" && filtros.linha === "natal"))
        .map((grupo) => (
          <div key={grupo.chave} role="group" aria-label={grupo.rotulo} className="flex flex-col gap-2">
            <span className="olho text-tinta-suave">{grupo.rotulo}</span>
            <div className="flex flex-wrap gap-1.5">
              {grupo.opcoes.map((opcao) => {
                const ativo = filtros[grupo.chave] === opcao.slug;
                const zeraria =
                  !ativo &&
                  filtrarCestas(semPessoasNoNatal({ ...filtros, [grupo.chave]: opcao.slug }))
                    .length === 0;
                return (
                  <Chip
                    key={opcao.slug}
                    ativo={ativo}
                    desabilitado={zeraria}
                    onClick={() => escolher(grupo.chave, opcao.slug)}
                  >
                    {opcao.nome}
                  </Chip>
                );
              })}
            </div>
          </div>
        ))}

      <div className="flex items-center gap-4 pt-1">
        <button
          type="button"
          disabled={total === 0}
          onClick={() => {
            aoIr?.();
            registrar("filtro", { ...filtros, resultados: total });
            router.push(enderecoFiltrado(filtros));
          }}
          className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full bg-verde-900 px-5 text-[0.6875rem] tracking-[0.14em] text-papel uppercase transition-colors duration-300 hover:bg-verde-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {total === 0
            ? "Nenhum modelo"
            : algum
              ? `Ver ${total} ${total === 1 ? "modelo" : "modelos"}`
              : `Ver os ${total} modelos`}
        </button>
        {algum ? (
          <button
            type="button"
            onClick={() => setFiltros(filtrosVazios)}
            className="olho inline-flex min-h-11 cursor-pointer items-center text-terra-700 underline decoration-terra-700/30 underline-offset-4"
          >
            Limpar
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Chip({
  ativo,
  desabilitado,
  onClick,
  children,
}: {
  ativo: boolean;
  desabilitado?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      disabled={desabilitado}
      onClick={onClick}
      className={clsx(
        "inline-flex min-h-10 cursor-pointer items-center rounded-full px-3.5 text-[0.8125rem] whitespace-nowrap transition-colors duration-300",
        ativo
          ? "bg-verde-900 text-papel"
          : "text-verde-900 ring-1 ring-verde-900/15 hover:ring-verde-900/45",
        desabilitado && "cursor-not-allowed opacity-35",
      )}
    >
      {children}
    </button>
  );
}

/** O painel já preenchido com o filtro do endereço, quando se está em `/cestas`. */
export function PainelFiltroDoEndereco({ aoIr }: { aoIr?: () => void }) {
  const naVitrine = semBarraFinal(usePathname()) === "/cestas";
  const busca = useSearchParams();
  return <PainelFiltro inicial={naVitrine ? filtrosDoEndereco(busca) : filtrosVazios} aoIr={aoIr} />;
}
