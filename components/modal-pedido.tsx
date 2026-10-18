"use client";

import Image from "next/image";
import { LinkTransicao } from "@/components/transicao";
import { useEffect, useId, useRef, useState } from "react";
import {
  IconeWhatsApp,
  IconePessoas,
  IconeCheck,
  IconeSeta,
  IconeRelogio,
} from "@/components/icones";
import { Simbolo } from "@/components/marca";
import { GaleriaCesta } from "@/components/galeria-cesta";
import {
  adicionais as listaAdicionais,
  categoriaDe,
  formatarPreco,
  type Cesta,
} from "@/data/cestas";
import { linkWhatsApp, mensagens, site } from "@/data/site";
import { clsx } from "@/lib/utils";

/**
 * Modal de pedido.
 *
 * Com `comFotos` (clique num card), ele abre primeiro nas fotos: a galeria
 * grande, a ficha do modelo e o botão "Quero esse modelo". É o que a pessoa
 * espera ao tocar num produto — ver as fotos — e só depois ela decide.
 * No celular as fotos dão lugar ao pedido; no desktop a galeria fica à
 * esquerda e o pedido entra no lugar da ficha.
 *
 * O pedido é enxuto de propósito: gavetas (data e hora, o que vem na cesta)
 * e o CTA. A de data abre por padrão, porque é a única decisão que o
 * cliente precisa tomar aqui; a lista de itens fica recolhida para o modal
 * caber na tela do celular sem rolagem longa.
 *
 * Usa o <dialog> nativo e <details> nativos: prender o foco, fechar no Esc,
 * backdrop inerte e o abre/fecha das gavetas vêm de graça, sem dependência.
 */

type Etapa = "fotos" | "pedido";

function BotaoFechar({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Fechar"
      className={clsx(
        "inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-verde-900 transition-colors duration-300 hover:bg-verde-900/8",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        aria-hidden
      >
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    </button>
  );
}

type Periodo = "cedo" | "manha" | "tarde";

/**
 * Faixas de entrega. As entregas saem mais cedo que o horário de
 * atendimento: começam às 07:00. Sábado e domingo o atendimento encerra às
 * 13:00, então a faixa da tarde não é oferecida.
 */
const periodos: Record<
  Periodo,
  { rotulo: string; faixa: string; fimDeSemana: boolean }
> = {
  cedo: { rotulo: "Bem cedo", faixa: "07:00 – 09:00", fimDeSemana: true },
  manha: { rotulo: "Manhã", faixa: "09:00 – 12:00", fimDeSemana: true },
  tarde: { rotulo: "Tarde", faixa: "12:00 – 18:00", fimDeSemana: false },
};

const ordemPeriodos: Periodo[] = ["cedo", "manha", "tarde"];

/** Teto do recado: a mensagem inteira viaja numa URL de WhatsApp. */
const LIMITE_OBS = 400;

/** Data de hoje no fuso local, como "AAAA-MM-DD". */
function hojeISO(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function somarDias(iso: string, dias: number): string {
  const [a, m, d] = iso.split("-").map(Number);
  // Meia-noite local (nunca UTC): "2026-09-12" em UTC voltaria um dia no Brasil.
  const data = new Date(a, m - 1, d + dias);
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

function paraDataLocal(iso: string): Date {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
}

function formatarData(iso: string): string {
  return paraDataLocal(iso).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatarDataCurta(iso: string): string {
  return paraDataLocal(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function ehFimDeSemana(iso: string): boolean {
  const dia = paraDataLocal(iso).getDay();
  return dia === 0 || dia === 6;
}

export function ModalPedido({
  cesta,
  prontaEntrega,
  aberto,
  onFechar,
  comFotos,
}: {
  cesta: Cesta;
  /** Linha de pronta entrega pode sair no mesmo dia. */
  prontaEntrega?: boolean;
  aberto: boolean;
  onFechar: () => void;
  /** Abre nas fotos do modelo antes do pedido (usado pelos cards). */
  comFotos?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const voltar = useRef<HTMLButtonElement>(null);
  const idTitulo = useId();

  const fotos = cesta.imagem ? [cesta.imagem, ...(cesta.fotos ?? [])] : [];
  const comGaleria = Boolean(comFotos) && fotos.length > 0;
  const etapaInicial: Etapa = comGaleria ? "fotos" : "pedido";
  const [etapa, setEtapa] = useState<Etapa>(etapaInicial);
  const linha = categoriaDe(cesta.categoria);

  const quero = () => {
    setEtapa("pedido");
    // o foco vai junto para o pedido, senão fica num botão que sumiu
    requestAnimationFrame(() => voltar.current?.focus());
  };
  const idObs = useId();
  const idObsDica = useId();

  const dataMinima = prontaEntrega ? hojeISO() : somarDias(hojeISO(), 1);
  const [data, setData] = useState(dataMinima);
  const [periodo, setPeriodo] = useState<Periodo>("manha");
  const [observacao, setObservacao] = useState("");
  /** Índice da embalagem escolhida; a primeira é a padrão. */
  const [embalagem, setEmbalagem] = useState(0);
  const embalagemEscolhida = cesta.embalagens?.[embalagem];
  /** Quantidade escolhida de cada adicional, indexada pelo nome. */
  const [extras, setExtras] = useState<Record<string, number>>({});

  const fimDeSemana = ehFimDeSemana(data);
  const periodoEfetivo: Periodo =
    fimDeSemana && !periodos[periodo].fimDeSemana ? "manha" : periodo;

  // Abre e fecha o <dialog> nativo conforme o estado do React.
  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  // Trava a rolagem do fundo enquanto o modal está aberto.
  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [aberto]);

  const qtdItensCesta = cesta.secoes.reduce((n, s) => n + s.itens.length, 0);

  const escolhidos = listaAdicionais
    .map((a) => ({ ...a, quantidade: extras[a.nome] ?? 0 }))
    .filter((a) => a.quantidade > 0);

  const somaExtras = escolhidos.reduce(
    (n, a) => n + a.preco * a.quantidade,
    0,
  );
  const totalItens = (cesta.preco ?? 0) + somaExtras;
  const qtdExtras = escolhidos.reduce((n, a) => n + a.quantidade, 0);

  const mudarExtra = (nome: string, passo: 1 | -1) =>
    setExtras((atual) => {
      const proximo = Math.min(10, Math.max(0, (atual[nome] ?? 0) + passo));
      return { ...atual, [nome]: proximo };
    });

  const obsLimpa = observacao.trim();
  const resumoObs = obsLimpa
    ? obsLimpa.length > 26
      ? `${obsLimpa.slice(0, 26)}…`
      : obsLimpa
    : "opcional";

  const mensagem = mensagens.pedido({
    cesta: cesta.nome,
    preco: cesta.preco !== null ? formatarPreco(cesta.preco) : null,
    data: formatarData(data),
    periodo: `${periodos[periodoEfetivo].rotulo} (${periodos[periodoEfetivo].faixa})`,
    embalagem: embalagemEscolhida?.nome ?? null,
    adicionais: escolhidos.map((a) => ({
      nome: a.nome,
      quantidade: a.quantidade,
      valor: formatarPreco(a.preco * a.quantidade),
    })),
    total: cesta.preco !== null ? formatarPreco(totalItens) : null,
    observacao,
  });

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      onClose={() => {
        // reabre sempre do começo: nas fotos, se o modal tiver fotos
        setEtapa(etapaInicial);
        onFechar();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onFechar();
      }}
      className={clsx(
        "modal-pedido",
        cesta.categoria === "natal" && "natal",
        comGaleria && "com-fotos",
      )}
    >
      <div
        className={clsx(
          "flex max-h-[88svh] w-full flex-col overflow-hidden rounded-2xl bg-papel text-left",
          comGaleria &&
            "lg:grid lg:h-[min(88svh,47rem)] lg:grid-cols-[minmax(0,29rem)_minmax(0,1fr)]",
          // nas fotos, o celular rola galeria e ficha juntas
          comGaleria && etapa === "fotos" && "overflow-y-auto overscroll-contain lg:overflow-hidden",
        )}
      >
        {comGaleria ? (
          <div
            className={clsx(
              "bg-creme lg:block lg:overflow-y-auto lg:p-5",
              etapa === "fotos" ? "block" : "hidden",
            )}
          >
            {/* topo do celular: nome, preço e o fechar, sempre à mão */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-creme/95 py-1 pr-1.5 pl-5 backdrop-blur-sm lg:hidden">
              <p aria-hidden className="flex min-w-0 items-baseline gap-2.5">
                <span className="titulo truncate text-[1.375rem] leading-tight">{cesta.nome}</span>
                <span className="olho shrink-0 text-tinta-suave">
                  {cesta.preco !== null ? formatarPreco(cesta.preco) : "sob consulta"}
                </span>
              </p>
              <BotaoFechar onClick={onFechar} />
            </div>
            <div className="px-3 pb-3 sm:px-4 lg:p-0">
              {aberto ? (
                <GaleriaCesta
                  fotos={fotos}
                  nome={cesta.nome}
                  foco={cesta.foco}
                  semPrioridade
                  compacta
                />
              ) : null}
            </div>
          </div>
        ) : null}

        <div
          className={clsx(
            "flex min-h-0 flex-1 flex-col",
            comGaleria && "lg:h-full",
          )}
        >
          {etapa === "fotos" ? (
            <>
              {/* ficha do modelo */}
              <div className="relative flex flex-col gap-5 px-5 pt-5 pb-6 sm:px-7 lg:flex-1 lg:overflow-y-auto lg:pt-8">
                <div className="absolute top-3 right-3 hidden lg:block">
                <BotaoFechar onClick={onFechar} />
              </div>
                <div className="flex flex-col gap-2 lg:pr-10">
                  <p className="olho hidden text-terra-700 lg:block">{linha.nome}</p>
                  <h2 id={idTitulo} className="titulo text-[2.25rem] leading-none sm:text-[2.75rem]">
                    {cesta.nome}
                  </h2>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-y borda-fina py-4">
                  {cesta.preco !== null ? (
                    <p>
                      <span className="titulo block text-[2rem] leading-none">
                        {formatarPreco(cesta.preco)}
                      </span>
                      <span className="olho mt-1.5 block text-tinta-suave">+ frete</span>
                    </p>
                  ) : (
                    <p className="titulo text-[1.75rem] leading-none">Sob consulta</p>
                  )}
                  <ul className="flex flex-col gap-1.5 text-[0.8125rem] text-tinta-suave">
                    {cesta.serve ? (
                      <li className="flex items-center gap-2">
                        <IconePessoas className="size-4 shrink-0 text-sage-600" />
                        Serve {cesta.serve}
                      </li>
                    ) : null}
                    <li className="flex items-center gap-2">
                      <IconeRelogio className="size-4 shrink-0 text-sage-600" />
                      {prontaEntrega
                        ? "Pode sair hoje"
                        : `Pedido com ${site.atendimento.antecedencia}`}
                    </li>
                  </ul>
                </div>

                <p className="text-[0.9375rem] leading-relaxed text-tinta-suave">
                  {cesta.chamada}
                </p>

                <div className="-mb-4 columns-1 gap-x-7 sm:columns-2">
                  {cesta.secoes.map((secao) => (
                    <section key={secao.titulo} className="break-inside-avoid pb-4">
                      <h3 className="olho mb-2 text-terra-700">{secao.titulo}</h3>
                      <ul className="flex flex-col gap-1.5">
                        {secao.itens.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-[0.875rem] leading-relaxed"
                          >
                            <IconeCheck className="mt-0.5 size-3.5 shrink-0 text-verde-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>

              <div className="sticky bottom-0 z-20 shrink-0 border-t borda-fina bg-papel px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">
                <button
                  type="button"
                  onClick={quero}
                  className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-verde-900 px-6 text-[0.8125rem] tracking-[0.14em] text-papel uppercase transition-[background-color,transform] duration-300 ease-suave hover:bg-verde-700 active:scale-[0.985]"
                >
                  Quero esse modelo
                  <IconeSeta className="size-4" />
                </button>
                <p className="mt-2.5 text-center text-[0.75rem] leading-relaxed text-tinta-suave">
                  Em seguida você escolhe a data e a hora — o pedido vai pronto
                  para o WhatsApp.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* topo */}
              <div className="relative flex shrink-0 items-center gap-4 border-b borda-fina bg-creme px-5 py-4 pr-14 sm:px-6 sm:pr-16">
                {comGaleria ? (
                  <button
                    ref={voltar}
                    type="button"
                    onClick={() => setEtapa("fotos")}
                    aria-label="Voltar às fotos do modelo"
                    className="-ml-2 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-verde-900 transition-colors duration-300 hover:bg-verde-900/8"
                  >
                    <IconeSeta className="size-5 rotate-180" />
                  </button>
                ) : null}
                <div
                  className={clsx(
                    "relative size-14 shrink-0 overflow-hidden rounded-full bg-papel sm:size-16",
                    comGaleria && "lg:hidden",
                  )}
                >
                  {cesta.imagem ? (
                    <Image
                      src={cesta.imagem}
                      alt=""
                      width={200}
                      height={300}
                      style={{ objectPosition: cesta.foco ?? "50% 50%" }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Simbolo className="h-5 w-5 text-verde-900/25" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="olho text-terra-700">Montar pedido</p>
                  <h2 id={idTitulo} className="titulo truncate text-2xl sm:text-3xl">
                    {cesta.nome}
                  </h2>
                </div>

                {cesta.preco !== null ? (
                  <p className="hidden shrink-0 text-right sm:block">
                    <span className="text-lg">{formatarPreco(cesta.preco)}</span>
                    <span className="olho block text-tinta-suave">+ frete</span>
                  </p>
                ) : null}

                <BotaoFechar onClick={onFechar} className="absolute top-3 right-3" />
              </div>

              {/* gavetas */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* data e hora */}
                <details open className="gaveta">
                  <summary>
                    <span className="gaveta-titulo">Data e hora</span>
                    <span className="gaveta-resumo">
                      {formatarDataCurta(data)} · {periodos[periodoEfetivo].rotulo}
                    </span>
                  </summary>

                  <div className="px-5 pb-6 sm:px-6">
                    <label className="block">
                      <span className="mb-2 block text-[0.875rem] text-tinta-suave">
                        Dia da entrega
                      </span>
                      <input
                        type="date"
                        value={data}
                        min={dataMinima}
                        onChange={(e) => setData(e.target.value || dataMinima)}
                        className="w-full min-h-12 rounded-xl border border-verde-900/20 bg-papel px-4 text-[1rem] text-verde-900 transition-colors duration-300 focus:border-verde-600"
                      />
                    </label>

                    <fieldset className="mt-4 border-0 p-0">
                      <legend className="mb-2 text-[0.875rem] text-tinta-suave">
                        Faixa de entrega
                      </legend>
                      <div className="grid grid-cols-3 gap-2">
                        {ordemPeriodos.map((p) => {
                          const bloqueado = fimDeSemana && !periodos[p].fimDeSemana;
                          const marcado = periodoEfetivo === p;
                          return (
                            <label
                              key={p}
                              className={clsx(
                                "flex min-h-14 cursor-pointer flex-col justify-center rounded-xl border px-2 py-2 text-center transition-colors duration-300",
                                marcado
                                  ? "border-verde-900 bg-verde-900 text-papel"
                                  : "border-verde-900/20 hover:border-verde-900/45",
                                bloqueado &&
                                  "cursor-not-allowed opacity-40 hover:border-verde-900/20",
                              )}
                            >
                              <input
                                type="radio"
                                name={`periodo-${cesta.slug}`}
                                value={p}
                                checked={marcado}
                                disabled={bloqueado}
                                onChange={() => setPeriodo(p)}
                                className="sr-only"
                              />
                              <span className="text-[0.8125rem] leading-tight">
                                {periodos[p].rotulo}
                              </span>
                              <span
                                className={clsx(
                                  "mt-0.5 text-[0.6875rem] tabular-nums",
                                  marcado ? "text-papel/70" : "text-tinta-suave",
                                )}
                              >
                                {periodos[p].faixa}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-tinta-suave">
                      {prontaEntrega
                        ? "Pronta entrega: sujeito à disponibilidade do dia."
                        : `Pedidos com ${site.atendimento.antecedencia}.`}
                      {fimDeSemana
                        ? " Aos sábados e domingos entregamos somente até as 13h."
                        : ""}
                    </p>
                  </div>
                </details>

                {/* embalagem, só nos modelos que têm mais de uma */}
                {cesta.embalagens && embalagemEscolhida ? (
                  <details className="gaveta">
                    <summary>
                      <span className="gaveta-titulo">Embalagem</span>
                      <span className="gaveta-resumo">{embalagemEscolhida.nome}</span>
                    </summary>

                    <fieldset className="border-0 px-5 pb-6 sm:px-6">
                      <legend className="sr-only">Embalagem</legend>
                      <div className="flex flex-col gap-2">
                        {cesta.embalagens.map((opcao, i) => {
                          const marcado = embalagem === i;
                          return (
                            <label
                              key={opcao.nome}
                              className={clsx(
                                "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors duration-300",
                                marcado
                                  ? "border-verde-900 bg-verde-900 text-papel"
                                  : "border-verde-900/20 hover:border-verde-900/45",
                              )}
                            >
                              <input
                                type="radio"
                                name={`embalagem-${cesta.slug}`}
                                value={i}
                                checked={marcado}
                                onChange={() => setEmbalagem(i)}
                                className="sr-only"
                              />
                              <span
                                aria-hidden
                                className={clsx(
                                  "mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border",
                                  marcado ? "border-papel" : "border-verde-900/40",
                                )}
                              >
                                {marcado ? <span className="size-2 rounded-full bg-papel" /> : null}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[0.9375rem] leading-snug">
                                  {opcao.nome}
                                </span>
                                <span
                                  className={clsx(
                                    "mt-0.5 block text-[0.8125rem] leading-relaxed",
                                    marcado ? "text-papel/75" : "text-tinta-suave",
                                  )}
                                >
                                  {opcao.descricao}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  </details>
                ) : null}

                {/* adicionais */}
                <details className="gaveta">
                  <summary>
                    <span className="gaveta-titulo">Adicionais</span>
                    <span className="gaveta-resumo">
                      {qtdExtras > 0
                        ? `${qtdExtras} ${qtdExtras === 1 ? "item" : "itens"} · ${formatarPreco(somaExtras)}`
                        : "opcional"}
                    </span>
                  </summary>

                  <div className="px-5 pb-6 sm:px-6">
                    <ul className="flex flex-col">
                      {listaAdicionais.map((item) => {
                        const qtd = extras[item.nome] ?? 0;
                        return (
                          <li
                            key={item.nome}
                            className="flex items-center gap-3 border-b borda-fina py-3 last:border-0"
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[0.9375rem]">
                                {item.nome}
                              </span>
                              <span className="text-[0.8125rem] text-tinta-suave">
                                {formatarPreco(item.preco)}
                              </span>
                            </span>

                            <span className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() => mudarExtra(item.nome, -1)}
                                disabled={qtd === 0}
                                aria-label={`Remover um ${item.nome}`}
                                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-verde-900 transition-colors duration-300 hover:bg-verde-900/8 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
                                  <path d="M6 12h12" />
                                </svg>
                              </button>

                              <output
                                aria-label={`Quantidade de ${item.nome}`}
                                className="w-6 text-center text-[0.9375rem] tabular-nums"
                              >
                                {qtd}
                              </output>

                              <button
                                type="button"
                                onClick={() => mudarExtra(item.nome, 1)}
                                aria-label={`Adicionar um ${item.nome}`}
                                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-verde-900 transition-colors duration-300 hover:bg-verde-900/8"
                              >
                                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
                                  <path d="M12 6v12M6 12h12" />
                                </svg>
                              </button>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </details>

                {/* recado para a Rebeca */}
                <details className="gaveta">
                  <summary>
                    <span className="gaveta-titulo">Observações</span>
                    <span className="gaveta-resumo">{resumoObs}</span>
                  </summary>

                  <div className="px-5 pb-6 sm:px-6">
                    <label htmlFor={idObs} className="mb-2 block text-[0.875rem] text-tinta-suave">
                      Algum recado para a Rebeca?
                    </label>
                    <textarea
                      id={idObs}
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value.slice(0, LIMITE_OBS))}
                      maxLength={LIMITE_OBS}
                      rows={4}
                      aria-describedby={idObsDica}
                      placeholder="Ex.: mensagem para o cartão, restrição alimentar, ponto de referência da entrega, nome de quem vai receber…"
                      className="w-full resize-y rounded-xl border border-verde-900/20 bg-papel px-4 py-3 text-[0.9375rem] leading-relaxed text-verde-900 transition-colors duration-300 placeholder:text-tinta-suave/60 focus:border-verde-600"
                    />
                    <p
                      id={idObsDica}
                      className="mt-2 flex items-center justify-between gap-3 text-[0.8125rem] text-tinta-suave"
                    >
                      <span>Vai junto na mensagem do WhatsApp.</span>
                      <span className="shrink-0 tabular-nums">
                        {observacao.length}/{LIMITE_OBS}
                      </span>
                    </p>
                  </div>
                </details>

                {/* o que vem na cesta */}
                <details className="gaveta">
                  <summary>
                    <span className="gaveta-titulo">O que vem nessa cesta</span>
                    <span className="gaveta-resumo">{qtdItensCesta} itens</span>
                  </summary>

                  <div className="px-5 pb-6 sm:px-6">
                    <div className="-mb-5 columns-1 gap-x-7 sm:columns-2">
                      {cesta.secoes.map((secao) => (
                        <section key={secao.titulo} className="break-inside-avoid pb-5">
                          <h3 className="olho mb-2 text-terra-700">{secao.titulo}</h3>
                          <ul className="flex flex-col gap-1.5">
                            {secao.itens.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-[0.875rem] leading-relaxed"
                              >
                                <IconeCheck className="mt-0.5 size-3.5 shrink-0 text-verde-600" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t borda-fina pt-4">
                      {cesta.serve ? (
                        <span className="flex items-center gap-2 text-[0.8125rem] text-tinta-suave">
                          <IconePessoas className="size-4 shrink-0 text-sage-600" />
                          Serve {cesta.serve}
                        </span>
                      ) : (
                        <span />
                      )}
                      <LinkTransicao
                        href={`/cestas/modelo/${cesta.slug}`}
                        className="olho inline-flex min-h-11 items-center gap-2 text-verde-900 underline decoration-verde-900/25 underline-offset-4 hover:decoration-verde-900"
                      >
                        Ver a página da cesta
                        <IconeSeta className="size-4" />
                      </LinkTransicao>
                    </div>
                  </div>
                </details>
              </div>

              {/* rodapé fixo com a ação */}
              <div className="shrink-0 border-t borda-fina bg-papel px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
                {cesta.preco !== null ? (
                  <dl className="mb-3 flex flex-col gap-1 text-[0.875rem]">
                    {qtdExtras > 0 ? (
                    <>
                        <div className="flex items-baseline justify-between gap-3 text-tinta-suave">
                          <dt>Cesta</dt>
                          <dd className="tabular-nums">
                            {formatarPreco(cesta.preco)}
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-3 text-tinta-suave">
                          <dt>Adicionais</dt>
                          <dd className="tabular-nums">
                            {formatarPreco(somaExtras)}
                          </dd>
                        </div>
                    </>
                    ) : null}
                    <div className="flex items-baseline justify-between gap-3 border-t borda-fina pt-2">
                      <dt className="olho text-tinta-suave">Total</dt>
                      <dd className="text-lg tabular-nums">
                        {formatarPreco(totalItens)}{" "}
                        <span className="text-[0.75rem] text-tinta-suave">
                          + frete
                        </span>
                      </dd>
                    </div>
                  </dl>
                ) : null}

                <a
                  href={linkWhatsApp(mensagem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-verde-600 px-6 text-[0.8125rem] tracking-[0.14em] uppercase text-papel transition-colors duration-300 hover:bg-verde-900"
                >
                  <IconeWhatsApp className="size-5" />
                  Pedir no WhatsApp
                </a>
                <p className="mt-2.5 text-center text-[0.75rem] leading-relaxed text-tinta-suave">
                  A mensagem já vai com a cesta, a data, a faixa
                  {cesta.embalagens ? ", a embalagem" : ""} e o seu recado.
                  <br className="hidden sm:inline" />{" "}
                  {site.pagamento.aVista} à vista, ou{" "}
                  {site.pagamento.parcelado.maximo
                    ? `em até ${site.pagamento.parcelado.maximo}x no `
                    : "parcelado no "}
                  {site.pagamento.parcelado.meio}.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
