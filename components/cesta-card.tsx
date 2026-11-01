"use client";

import Image from "next/image";
import { useState } from "react";
import { IconeFotos, IconePessoas, IconeSeta } from "@/components/icones";
import { Simbolo } from "@/components/marca";
import { ModalPedido } from "@/components/modal-pedido";
import { clsx } from "@/lib/utils";
import { formatarPreco, type Cesta } from "@/data/cestas";
import { registrar } from "@/lib/analytics";

/**
 * Card de cesta. Clicar abre o modal já nas fotos do modelo — o instinto de
 * quem toca num produto é ver as fotos. De lá, "Quero esse modelo" leva ao
 * pedido (data + WhatsApp), sem sair da página.
 *
 * Todos os cards têm o mesmo formato: retrato 4:5, canto de 16px e a foto
 * do ensaio enquadrada pelo `foco` da cesta. O card mostra só a capa, com
 * um selo de quantas fotos o modelo tem; as outras carregam no modal.
 * (Setas no próprio card foram tiradas: a pessoa clicava na foto em vez
 * delas.)
 *
 * Sobre o veludo (página de Natal, faixa de Natal) o card sai na variante
 * escura — `escuro` vem da grade. Fora dele, até um presente de Natal sai
 * claro, como no resultado do filtro.
 */
export function CestaCard({
  cesta,
  prioridade,
  nivel = 3,
  escuro = false,
}: {
  cesta: Cesta;
  prioridade?: boolean;
  /** Nível do título do card, conforme a hierarquia da página. */
  nivel?: 2 | 3;
  /** Variante escura, para o card sobre o veludo da Coleção de Natal. */
  escuro?: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  const Titulo = nivel === 2 ? "h2" : "h3";
  const natal = cesta.categoria === "natal";
  const totalFotos = cesta.imagem ? 1 + (cesta.fotos?.length ?? 0) : 0;

  return (
    <article className="group relative flex w-full flex-col">
      <button
        type="button"
        onClick={() => {
          setAberto(true);
          registrar("view_item", { modelo: cesta.nome, linha: cesta.categoria, valor: cesta.preco });
        }}
        aria-haspopup="dialog"
        className="flex flex-1 cursor-pointer flex-col text-left"
      >
        <div
          className={clsx(
            "relative aspect-4/5 overflow-hidden rounded-2xl",
            escuro ? "bg-noite-alt" : "bg-creme",
          )}
        >
          {cesta.imagem ? (
            <Image
              src={cesta.imagem}
              alt={`${cesta.nome}, da Le Brunch`}
              width={800}
              height={1200}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 80vw"
              loading={prioridade ? "eager" : "lazy"}
              style={{ objectPosition: cesta.foco ?? "50% 50%" }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.05]"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center">
              <Simbolo className="h-12 w-12 text-verde-900/15" />
            </span>
          )}

          {totalFotos > 1 ? (
            <span
              className={clsx(
                "absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] tabular-nums backdrop-blur-sm",
                escuro ? "bg-noite/70 text-ouro-claro" : "bg-papel/85 text-verde-900",
              )}
            >
              <IconeFotos className="size-3.5" />
              {totalFotos} fotos
            </span>
          ) : null}

          {/* véu de baixo para a chamada "ver as fotos" */}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span
            aria-hidden
            className="olho absolute inset-x-4 bottom-4 flex translate-y-2 items-center justify-between text-papel opacity-0 transition-[opacity,transform] duration-500 ease-suave group-hover:translate-y-0 group-hover:opacity-100"
          >
            Ver as fotos
            <IconeSeta className="size-4" />
          </span>

          <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {cesta.destaque ? (
              <span
                className={clsx(
                  "olho rounded-full px-3 py-1.5 backdrop-blur-sm",
                  escuro
                    ? "bg-noite/75 text-ouro-claro ring-1 ring-ouro/40"
                    : "border borda-fina bg-papel/90 text-verde-900",
                )}
              >
                {natal ? "Destaque de Natal" : "Mais pedida"}
              </span>
            ) : null}
            {/* Só em desenvolvimento: marca os modelos que ainda são proposta. */}
            {cesta.rascunho && process.env.NODE_ENV === "development" ? (
              <span className="olho rounded-full bg-terra-700 px-3 py-1.5 text-papel">
                rascunho
              </span>
            ) : null}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <Titulo className="titulo text-[1.5rem] leading-tight sm:text-[1.875rem]">{cesta.nome}</Titulo>
            {cesta.preco !== null ? (
              <p className="shrink-0 text-right">
                <span className="text-lg">{formatarPreco(cesta.preco)}</span>
                <span
                  className={clsx(
                    "olho block",
                    escuro ? "text-papel/60" : "text-tinta-suave",
                  )}
                >
                  + frete
                </span>
              </p>
            ) : (
              <span
                className={clsx(
                  "olho shrink-0",
                  escuro ? "text-ouro-claro" : "text-tinta-suave",
                )}
              >
                sob consulta
              </span>
            )}
          </div>

          <p
            className={clsx(
              "flex-1 text-[0.9375rem] leading-relaxed",
              escuro ? "text-papel/70" : "text-tinta-suave",
            )}
          >
            {cesta.chamada}
          </p>

          <div
            className={clsx(
              "mt-1 flex items-center justify-between gap-4 border-t pt-4",
              escuro ? "border-papel/12" : "borda-fina",
            )}
          >
            {cesta.serve ? (
              <span
                className={clsx(
                  "flex items-center gap-2 text-[0.8125rem]",
                  escuro ? "text-papel/65" : "text-tinta-suave",
                )}
              >
                <IconePessoas
                  className={clsx("size-4 shrink-0", escuro ? "text-ouro" : "text-sage-600")}
                />
                Serve {cesta.serve}
              </span>
            ) : (
              <span />
            )}
            <span
              className={clsx(
                "olho inline-flex items-center gap-2",
                escuro && "text-ouro-claro",
              )}
            >
              Ver o modelo
              <IconeSeta className="size-4 transition-transform duration-400 ease-suave group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </button>

      <ModalPedido
        cesta={cesta}
        aberto={aberto}
        onFechar={() => setAberto(false)}
        comFotos
      />
    </article>
  );
}
