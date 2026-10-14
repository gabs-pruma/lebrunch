"use client";

import Image from "next/image";
import { useState } from "react";
import { IconePessoas, IconeSeta } from "@/components/icones";
import { Simbolo } from "@/components/marca";
import { ModalPedido } from "@/components/modal-pedido";
import { clsx } from "@/lib/utils";
import { categoriaDe, formatarPreco, type Cesta } from "@/data/cestas";

/**
 * Card de cesta. Clicar abre o modal de pedido (data + WhatsApp) em vez de
 * levar para outra página — o cliente decide sem perder o contexto.
 *
 * Todos os cards têm o mesmo formato: retrato 4:5, canto de 16px e a foto
 * do ensaio enquadrada pelo `foco` da cesta. No desktop, passar o mouse
 * revela um segundo ângulo da mesma cesta.
 *
 * As cestas da Coleção de Natal saem na variante escura, sobre o veludo.
 */
export function CestaCard({
  cesta,
  prioridade,
  nivel = 3,
  prontaEntrega,
}: {
  cesta: Cesta;
  prioridade?: boolean;
  /** Nível do título do card, conforme a hierarquia da página. */
  nivel?: 2 | 3;
  /** Linha de pronta entrega pode sair no mesmo dia. */
  prontaEntrega?: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  const Titulo = nivel === 2 ? "h2" : "h3";
  const natal = cesta.categoria === "natal";
  const linha = categoriaDe(cesta.categoria);
  // a linha manda: um card de Pronta Entrega fora da página dela continua
  // oferecendo entrega no mesmo dia
  const mesmoDia = prontaEntrega ?? linha.prontaEntrega;
  const segunda = cesta.fotos?.[0];
  const foco = { objectPosition: cesta.foco ?? "50% 50%" };

  return (
    <article className="group flex w-full flex-col">
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="flex flex-1 cursor-pointer flex-col text-left"
      >
        <div
          className={clsx(
            "relative aspect-4/5 overflow-hidden rounded-2xl",
            natal ? "bg-noite-alt" : "bg-creme",
          )}
        >
          {cesta.imagem ? (
            <>
              <Image
                src={cesta.imagem}
                alt={`Cesta ${cesta.nome} da Le Brunch`}
                width={800}
                height={1200}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 80vw"
                loading={prioridade ? "eager" : "lazy"}
                style={foco}
                className="absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-[1400ms] ease-suave group-hover:scale-[1.05]"
              />
              {segunda ? (
                <Image
                  src={segunda}
                  alt=""
                  width={800}
                  height={1200}
                  sizes="(min-width: 1024px) 30vw, 1px"
                  style={foco}
                  className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-[opacity,transform] duration-[900ms] ease-suave group-hover:scale-[1.03] group-hover:opacity-100 lg:block"
                />
              ) : null}
            </>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center">
              <Simbolo className="h-12 w-12 text-verde-900/15" />
            </span>
          )}

          {/* véu de baixo para a chamada "pedir" */}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span
            aria-hidden
            className="olho absolute inset-x-4 bottom-4 flex translate-y-2 items-center justify-between text-papel opacity-0 transition-[opacity,transform] duration-500 ease-suave group-hover:translate-y-0 group-hover:opacity-100"
          >
            Montar meu pedido
            <IconeSeta className="size-4" />
          </span>

          <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {linha.prontaEntrega && linha.selo ? (
              <span className="olho rounded-full bg-terra-700 px-3 py-1.5 text-papel">
                {linha.selo}
              </span>
            ) : null}
            {cesta.destaque ? (
              <span
                className={clsx(
                  "olho rounded-full px-3 py-1.5 backdrop-blur-sm",
                  natal
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
            <Titulo className="titulo text-[1.875rem] leading-tight">{cesta.nome}</Titulo>
            {cesta.preco !== null ? (
              <p className="shrink-0 text-right">
                <span className="text-lg">{formatarPreco(cesta.preco)}</span>
                <span
                  className={clsx(
                    "olho block",
                    natal ? "text-papel/60" : "text-tinta-suave",
                  )}
                >
                  + frete
                </span>
              </p>
            ) : (
              <span
                className={clsx(
                  "olho shrink-0",
                  natal ? "text-ouro-claro" : "text-tinta-suave",
                )}
              >
                sob consulta
              </span>
            )}
          </div>

          <p
            className={clsx(
              "flex-1 text-[0.9375rem] leading-relaxed",
              natal ? "text-papel/70" : "text-tinta-suave",
            )}
          >
            {cesta.chamada}
          </p>

          <div
            className={clsx(
              "mt-1 flex items-center justify-between gap-4 border-t pt-4",
              natal ? "border-papel/12" : "borda-fina",
            )}
          >
            {cesta.serve ? (
              <span
                className={clsx(
                  "flex items-center gap-2 text-[0.8125rem]",
                  natal ? "text-papel/65" : "text-tinta-suave",
                )}
              >
                <IconePessoas
                  className={clsx("size-4 shrink-0", natal ? "text-ouro" : "text-sage-600")}
                />
                Serve {cesta.serve}
              </span>
            ) : (
              <span />
            )}
            <span
              className={clsx(
                "olho inline-flex items-center gap-2",
                natal && "text-ouro-claro",
              )}
            >
              Pedir
              <IconeSeta className="size-4 transition-transform duration-400 ease-suave group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </button>

      <ModalPedido
        cesta={cesta}
        prontaEntrega={mesmoDia}
        aberto={aberto}
        onFechar={() => setAberto(false)}
      />
    </article>
  );
}
