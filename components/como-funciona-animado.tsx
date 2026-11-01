"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { clsx } from "@/lib/utils";
import { Simbolo } from "@/components/marca";
import {
  IconeBrilho,
  IconeCheck,
  IconePino,
  IconeRelogio,
  IconeWhatsApp,
} from "@/components/icones";

/**
 * "É aqui que a sua experiência começa": um celular que passa sozinho pelas
 * etapas do pedido (escolher, falar no WhatsApp, endereço, data, receber),
 * em sincronia com a lista ao lado. Entrou no lugar da foto da Rebeca, que
 * já aparece logo abaixo (pedido do Gabriel, 02/11/2026).
 *
 * - Feito em HTML e CSS, não em GIF: nítido em qualquer tela e leve. O
 *   celular é desenhado em 13,5rem e ampliado com `zoom`, para o conteúdo
 *   crescer junto (sem fundo atrás, pedido do Gabriel).
 * - Só avança quando está na tela; tocar numa etapa da lista mostra aquela
 *   cena e para o automático.
 * - Quem pediu menos movimento vê as cenas paradas e troca pela lista.
 * - O celular é decorativo (`aria-hidden`): o conteúdo está na lista.
 */

type Passo = { titulo: string; texto?: string };

/** Quanto tempo cada etapa fica na tela. */
const TEMPO = 3400;

const MENOS_MOVIMENTO = "(prefers-reduced-motion: reduce)";
function assinarMovimento(avisar: () => void) {
  const consulta = window.matchMedia(MENOS_MOVIMENTO);
  consulta.addEventListener("change", avisar);
  return () => consulta.removeEventListener("change", avisar);
}
const pediuMenosMovimento = () => window.matchMedia(MENOS_MOVIMENTO).matches;
const noServidor = () => false;

export function ComoFuncionaAnimado({ passos }: { passos: Passo[] }) {
  /** `volta` muda a cada troca, para a barrinha de progresso recomeçar. */
  const [estado, setEstado] = useState({ ativo: 0, volta: 0 });
  const [parado, setParado] = useState(false);
  const [naTela, setNaTela] = useState(false);
  const menosMovimento = useSyncExternalStore(assinarMovimento, pediuMenosMovimento, noServidor);
  const raiz = useRef<HTMLDivElement>(null);
  const { ativo, volta } = estado;
  const automatico = naTela && !parado && !menosMovimento;

  useEffect(() => {
    const no = raiz.current;
    if (!no || typeof IntersectionObserver === "undefined") return;
    const observador = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), {
      threshold: 0.35,
    });
    observador.observe(no);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (!automatico) return;
    const id = setInterval(
      () => setEstado((e) => ({ ativo: (e.ativo + 1) % passos.length, volta: e.volta + 1 })),
      TEMPO,
    );
    return () => clearInterval(id);
  }, [automatico, passos.length]);

  const escolher = (i: number) => {
    setParado(true);
    setEstado((e) => ({ ativo: i, volta: e.volta + 1 }));
  };

  return (
    <div ref={raiz} className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:gap-16">
      {/* ——— o celular ——— */}
      <div
        aria-hidden
        className="relative flex flex-col items-center justify-center gap-6 [zoom:1.15] sm:[zoom:1.25] lg:[zoom:1.3]"
      >
        <Celular>
          <Cena ativa={ativo === 0}>
            <CenaEscolha ativa={ativo === 0} />
          </Cena>
          <Cena ativa={ativo === 1}>
            <CenaWhatsApp ativa={ativo === 1} />
          </Cena>
          <Cena ativa={ativo === 2}>
            <CenaEndereco ativa={ativo === 2} />
          </Cena>
          <Cena ativa={ativo === 3}>
            <CenaData ativa={ativo === 3} />
          </Cena>
          <Cena ativa={ativo === 4}>
            <CenaEntrega ativa={ativo === 4} />
          </Cena>
        </Celular>

        {/* uma barrinha por etapa; a da vez enche no tempo da cena */}
        <div className="flex w-full max-w-[13.5rem] gap-1.5">
          {passos.map((p, i) => (
            <span key={p.titulo} className="relative h-1 flex-1 overflow-hidden rounded-full bg-verde-900/12">
              <span
                key={i === ativo ? `ativo-${volta}` : `parado-${i}`}
                className={clsx(
                  "absolute inset-0 origin-left rounded-full bg-terra-500",
                  i < ativo || (i === ativo && !automatico) ? "scale-x-100" : "scale-x-0",
                  i === ativo && automatico && "barra-etapa",
                )}
                style={i === ativo && automatico ? { animationDuration: `${TEMPO}ms` } : undefined}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ——— a lista: o conteúdo de verdade; tocar mostra a cena ——— */}
      <ol className="flex flex-col justify-between">
        {passos.map((passo, i) => (
          <li key={passo.titulo} className="border-b borda-fina last:border-0">
            <button
              type="button"
              onClick={() => escolher(i)}
              aria-current={i === ativo ? "step" : undefined}
              className={clsx(
                "flex w-full cursor-pointer gap-4 py-5 text-left",
                i === 0 && "pt-0",
                i === passos.length - 1 && "pb-0",
              )}
            >
              {/* largura fixa: na manuscrita o "1" é mais estreito que o
                  "2", e os títulos saíam cada um numa coluna */}
              <span
                className={clsx(
                  "script w-7 shrink-0 text-center text-3xl leading-none transition-colors duration-500",
                  i === ativo ? "text-terra-700" : "text-terra-700/35",
                )}
              >
                {i + 1}
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-[1.0625rem] text-verde-900">{passo.titulo}</span>
                {passo.texto ? (
                  <span className="text-[0.9375rem] leading-relaxed text-tinta-suave">
                    {passo.texto}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ———————————————————————— peças ———————————————————————— */

function Celular({ children }: { children: ReactNode }) {
  return (
    <div className="relative aspect-[9/18] w-[13.5rem] rounded-[2.3rem] bg-verde-900 p-2 shadow-[0_30px_60px_-28px_rgba(0,30,27,0.55)]">
      <div className="relative h-full overflow-hidden rounded-[1.85rem] bg-papel">
        <span className="absolute top-2 left-1/2 z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-verde-900" />
        {children}
      </div>
    </div>
  );
}

function Cena({ ativa, children }: { ativa: boolean; children: ReactNode }) {
  return (
    <div
      className={clsx(
        "absolute inset-0 flex flex-col transition-[opacity,transform] duration-500 ease-suave",
        ativa ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-3 opacity-0",
      )}
    >
      {children}
    </div>
  );
}

/** Elemento que entra (sobe e aparece) quando a cena fica ativa, com atraso. */
function Entra({
  ativa,
  atraso = 0,
  className,
  children,
}: {
  ativa: boolean;
  atraso?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "transition-[opacity,transform] duration-500 ease-suave",
        ativa ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className,
      )}
      style={{ transitionDelay: ativa ? `${atraso}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

function Topo({ children, escuro }: { children: ReactNode; escuro?: boolean }) {
  return (
    <div
      className={clsx(
        "flex shrink-0 items-center gap-2 px-4 pt-9 pb-3",
        escuro ? "bg-verde-900 text-papel" : "border-b borda-fina text-verde-900",
      )}
    >
      {children}
    </div>
  );
}

const MINIATURAS = [
  { chave: "classica", nome: "Clássica" },
  { chave: "premium", nome: "Premium" },
  { chave: "duas-pessoas", nome: "Primavera" },
  { chave: "tres-pessoas", nome: "Presença" },
];

/* 1 — escolha o modelo */
function CenaEscolha({ ativa }: { ativa: boolean }) {
  return (
    <>
      <Topo>
        <Simbolo className="size-4" />
        <span className="text-[0.6875rem] tracking-[0.14em] uppercase">Modelos</span>
      </Topo>
      <div className="grid grid-cols-2 gap-2.5 p-3.5">
        {MINIATURAS.map((m, i) => {
          const escolhida = i === 3;
          return (
            <Entra key={m.chave} ativa={ativa} atraso={80 * i}>
              <div
                className={clsx(
                  "relative aspect-square overflow-hidden rounded-xl ring-offset-2 ring-offset-papel transition-[box-shadow] duration-500",
                  escolhida && ativa ? "ring-2 ring-terra-500 delay-700" : "ring-0",
                )}
              >
                <Image src={`/atalhos/${m.chave}.webp`} alt="" fill sizes="120px" className="object-cover" />
                {escolhida ? (
                  <span
                    className="absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full bg-terra-500 text-papel shadow transition-opacity duration-300"
                    style={{ opacity: ativa ? 1 : 0, transitionDelay: ativa ? "900ms" : "0ms" }}
                  >
                    <IconeCheck className="size-3.5" />
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[0.625rem] text-verde-900">{m.nome}</p>
            </Entra>
          );
        })}
      </div>
      <Entra ativa={ativa} atraso={1300} className="mt-auto px-3.5 pb-5">
        <span className="flex h-8 items-center justify-center rounded-full bg-verde-900 text-[0.5625rem] tracking-[0.14em] text-papel uppercase">
          Quero esse modelo
        </span>
      </Entra>
    </>
  );
}

/* 2 — a conversa no WhatsApp, com a mensagem já pronta */
function CenaWhatsApp({ ativa }: { ativa: boolean }) {
  return (
    <>
      <Topo escuro>
        <span className="grid size-7 place-items-center rounded-full bg-papel/15">
          <Simbolo className="size-3.5" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.75rem]">Le Brunch</span>
          <span className="text-[0.5625rem] text-papel/60">online</span>
        </span>
        <IconeWhatsApp className="ml-auto size-4 text-papel/70" />
      </Topo>
      <div className="flex flex-1 flex-col gap-2.5 bg-creme/70 p-3.5">
        <Entra ativa={ativa} atraso={250} className="ml-auto max-w-[85%]">
          <p className="rounded-2xl rounded-br-sm bg-[#d9eadf] px-3 py-2 text-[0.6875rem] leading-snug text-verde-900">
            Olá! Quero a cesta Presença para sábado, de manhã.
          </p>
        </Entra>
        <Entra ativa={ativa} atraso={1200} className="max-w-[85%]">
          <p className="rounded-2xl rounded-bl-sm bg-papel px-3 py-2 text-[0.6875rem] leading-snug text-verde-900 shadow-sm">
            Que alegria! Já anoto o seu pedido.
          </p>
        </Entra>
        <Entra ativa={ativa} atraso={2000} className="max-w-[60%]">
          <span className="inline-flex gap-1 rounded-2xl rounded-bl-sm bg-papel px-3 py-2.5 shadow-sm">
            {[0, 1, 2].map((p) => (
              <span key={p} className="size-1.5 rounded-full bg-verde-900/35" />
            ))}
          </span>
        </Entra>
      </div>
    </>
  );
}

/* 3 — o endereço, para calcular a entrega */
function CenaEndereco({ ativa }: { ativa: boolean }) {
  return (
    <>
      <Topo>
        <IconePino className="size-4" />
        <span className="text-[0.6875rem] tracking-[0.14em] uppercase">Entrega</span>
      </Topo>
      <div className="relative flex-1 overflow-hidden bg-creme">
        {/* um mapa só de ruas, desenhado */}
        <svg viewBox="0 0 200 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <g stroke="rgb(0 62 57 / 0.12)" strokeWidth="7" fill="none" strokeLinecap="round">
            <path d="M-10 70 C 60 60, 120 90, 210 80" />
            <path d="M-10 170 C 70 160, 130 190, 210 175" />
            <path d="M60 -10 C 55 80, 75 170, 65 270" />
            <path d="M150 -10 C 140 90, 160 180, 145 270" />
          </g>
          <g stroke="rgb(0 62 57 / 0.07)" strokeWidth="3" fill="none">
            <path d="M-10 120 L 210 125" />
            <path d="M105 -10 L 110 270" />
          </g>
        </svg>
        <div
          className={clsx(
            "absolute top-[38%] left-1/2 -translate-x-1/2 transition-[transform,opacity] duration-500 ease-suave",
            ativa ? "translate-y-0 opacity-100 delay-300" : "-translate-y-6 opacity-0",
          )}
        >
          <span className="grid size-10 place-items-center rounded-full bg-terra-500 text-papel shadow-lg">
            <IconePino className="size-5" />
          </span>
        </div>
      </div>
      <Entra ativa={ativa} atraso={900} className="p-3.5">
        <div className="flex items-center gap-2.5 rounded-xl bg-papel p-3 shadow-[0_8px_24px_-14px_rgba(0,30,27,0.4)] ring-1 ring-verde-900/8">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-verde-900 text-papel">
            <IconeCheck className="size-3.5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[0.6875rem] text-verde-900">Taxa de entrega calculada</span>
            <span className="text-[0.5625rem] text-tinta-suave">São Paulo e Grande ABC</span>
          </span>
        </div>
      </Entra>
    </>
  );
}

/* 4 — o dia e o período, com 24h de antecedência */
function CenaData({ ativa }: { ativa: boolean }) {
  const dias = Array.from({ length: 21 }, (_, i) => i + 1);
  const escolhido = 13;
  return (
    <>
      <Topo>
        <IconeRelogio className="size-4" />
        <span className="text-[0.6875rem] tracking-[0.14em] uppercase">Data da entrega</span>
      </Topo>
      <div className="p-3.5">
        <div className="grid grid-cols-7 gap-1 text-center">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
            <span key={i} className="text-[0.5625rem] text-tinta-suave">
              {d}
            </span>
          ))}
          {dias.map((d) => (
            <span
              key={d}
              className={clsx(
                "grid aspect-square place-items-center rounded-full text-[0.625rem] transition-[background-color,color] duration-500",
                d === escolhido && ativa
                  ? "bg-verde-900 text-papel delay-500"
                  : d < 6
                    ? "text-verde-900/30"
                    : "text-verde-900",
              )}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-2 px-3.5 pb-5">
        <Entra ativa={ativa} atraso={900}>
          <div className="flex gap-1.5">
            {["Manhã", "Tarde"].map((p, i) => (
              <span
                key={p}
                className={clsx(
                  "flex h-7 flex-1 items-center justify-center rounded-full text-[0.625rem]",
                  i === 0 ? "bg-terra-500 text-papel" : "text-verde-900 ring-1 ring-verde-900/15",
                )}
              >
                {p}
              </span>
            ))}
          </div>
        </Entra>
        <Entra ativa={ativa} atraso={1300}>
          <p className="flex items-center justify-center gap-1.5 text-[0.5625rem] text-tinta-suave">
            <IconeRelogio className="size-3" />
            com 24h de antecedência
          </p>
        </Entra>
      </div>
    </>
  );
}

/* 5 — a cesta chega */
function CenaEntrega({ ativa }: { ativa: boolean }) {
  return (
    <>
      <div className="relative flex-1 overflow-hidden">
        <Image
          src="/ensaio/presenca-1.webp"
          alt=""
          fill
          sizes="240px"
          style={{ objectPosition: "50% 55%" }}
          className={clsx(
            "object-cover transition-transform duration-[3000ms] ease-suave",
            ativa ? "scale-105" : "scale-100",
          )}
        />
        {[
          "top-[18%] left-[14%] size-4",
          "top-[30%] right-[12%] size-3",
          "bottom-[22%] left-[22%] size-3",
        ].map((pos, i) => (
          <span
            key={pos}
            className={clsx(
              "absolute text-papel drop-shadow transition-opacity duration-500",
              pos,
              ativa ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDelay: ativa ? `${400 + 250 * i}ms` : "0ms" }}
          >
            <IconeBrilho className="cintilar h-full w-full" />
          </span>
        ))}
      </div>
      <Entra ativa={ativa} atraso={600} className="flex flex-col items-center gap-1 px-4 pt-3.5 pb-6 text-center">
        <Simbolo className="size-4 text-terra-500" />
        <p className="titulo text-[1.125rem] leading-tight text-verde-900">Entregue com carinho</p>
        <p className="text-[0.5625rem] tracking-[0.14em] text-tinta-suave uppercase">no dia e na hora escolhidos</p>
      </Entra>
    </>
  );
}
