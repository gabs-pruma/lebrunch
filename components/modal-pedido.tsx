"use client";

import Image from "next/image";
import { LinkTransicao } from "@/components/transicao";
import { useEffect, useId, useRef, useState } from "react";
import { IconeWhatsApp, IconePessoas, IconeCheck, IconeSeta } from "@/components/icones";
import { Simbolo } from "@/components/marca";
import { adicionais as listaAdicionais, formatarPreco, type Cesta } from "@/data/cestas";
import { linkWhatsApp, mensagens, site } from "@/data/site";
import { clsx } from "@/lib/utils";

/**
 * Modal de pedido.
 *
 * Enxuto de propósito: duas gavetas (data e hora, o que vem na cesta) e o
 * CTA. A de data abre por padrão, porque é a única decisão que o cliente
 * precisa tomar aqui; a lista de itens fica recolhida para o modal caber na
 * tela do celular sem rolagem longa.
 *
 * Usa o <dialog> nativo e <details> nativos: prender o foco, fechar no Esc,
 * backdrop inerte e o abre/fecha das gavetas vêm de graça, sem dependência.
 */

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
}: {
  cesta: Cesta;
  /** Linha de pronta entrega pode sair no mesmo dia. */
  prontaEntrega?: boolean;
  aberto: boolean;
  onFechar: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();
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
      onClose={onFechar}
      onClick={(e) => {
        if (e.target === ref.current) onFechar();
      }}
      className={clsx("modal-pedido", cesta.categoria === "natal" && "natal")}
    >
      <div className="flex max-h-[88svh] w-full flex-col overflow-hidden rounded-2xl bg-papel text-left">
        {/* topo */}
        <div className="relative flex shrink-0 items-center gap-4 border-b borda-fina bg-creme px-5 py-4 pr-14 sm:px-6 sm:pr-16">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-papel sm:size-16">
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

          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="absolute top-3 right-3 inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-verde-900 transition-colors duration-300 hover:bg-verde-900/8"
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
      </div>
    </dialog>
  );
}
