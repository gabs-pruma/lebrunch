import type { ComponentProps, ReactNode } from "react";
import { clsx } from "@/lib/utils";
import { Simbolo } from "@/components/marca";
import { LinkTransicao } from "@/components/transicao";

/* ————————————————————————— Botões ————————————————————————— */

const base =
  "inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-[0.8125rem] tracking-[0.14em] uppercase " +
  "transition-[background-color,color,border-color,transform] duration-300 ease-suave cursor-pointer " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const variantes = {
  solido:
    "bg-verde-900 text-papel hover:bg-verde-700 active:scale-[0.985] rounded-full",
  contorno:
    "border border-verde-900/25 text-verde-900 hover:border-verde-900 hover:bg-verde-900 hover:text-papel active:scale-[0.985] rounded-full",
  claro:
    "bg-papel text-verde-900 hover:bg-creme active:scale-[0.985] rounded-full",
  contornoClaro:
    "border border-papel/35 text-papel hover:bg-papel hover:text-verde-900 active:scale-[0.985] rounded-full",
  texto:
    "px-0 min-h-11 text-verde-900 border-b border-verde-900/30 hover:border-verde-900 rounded-none",
  ouro:
    "bg-ouro text-noite hover:bg-ouro-claro active:scale-[0.985] rounded-full",
  contornoOuro:
    "border border-ouro/50 text-ouro-claro hover:bg-ouro hover:text-noite active:scale-[0.985] rounded-full",
} as const;

type Variante = keyof typeof variantes;

export function BotaoLink({
  href,
  variante = "solido",
  className,
  externo,
  children,
  ...resto
}: {
  href: string;
  variante?: Variante;
  externo?: boolean;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href">) {
  const classes = clsx(base, variantes[variante], className);

  if (externo) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...resto}
      >
        {children}
      </a>
    );
  }

  return (
    <LinkTransicao href={href} className={classes}>
      {children}
    </LinkTransicao>
  );
}

/* ————————————————————————— Estrutura ————————————————————————— */

export function Secao({
  children,
  className,
  id,
  fundo = "papel",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  fundo?: "papel" | "creme" | "verde" | "transparente";
}) {
  const fundos = {
    papel: "",
    creme: "bg-creme/85",
    verde: "bg-verde-900 text-papel",
    transparente: "",
  } as const;

  return (
    <section
      id={id}
      className={clsx(
        "px-5 py-14 sm:px-8 sm:py-18 lg:py-20",
        fundos[fundo],
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/** Sobrelinha em caixa alta — o "olho" editorial do catálogo. */
export function Olho({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={clsx("olho text-terra-700", className)}>{children}</p>
  );
}

export function TituloSecao({
  olho,
  children,
  script,
  descricao,
  centro,
  className,
  nivel = 2,
}: {
  olho?: string;
  children: ReactNode;
  /** Palavra final manuscrita, como nos títulos do catálogo. */
  script?: string;
  descricao?: ReactNode;
  centro?: boolean;
  className?: string;
  /** 1 quando este é o título da página; 2 para uma seção interna. */
  nivel?: 1 | 2;
}) {
  const Titulo = nivel === 1 ? "h1" : "h2";

  return (
    <header
      className={clsx(
        centro && "mx-auto max-w-2xl text-center",
        "flex flex-col gap-4",
        className,
      )}
    >
      {olho ? <Olho>{olho}</Olho> : null}
      <Titulo className="titulo text-[clamp(2rem,7vw,3.5rem)] text-balance">
        {children}
        {script ? (
          <>
            {" "}
            <span className="script ml-1 text-[1.15em] leading-none text-terra-700">
              {script}
            </span>
          </>
        ) : null}
      </Titulo>
      {descricao ? (
        <div className="max-w-prose text-[0.9375rem] leading-relaxed text-tinta-suave">
          {descricao}
        </div>
      ) : null}
    </header>
  );
}

/** Filete decorativo com o símbolo da marca ao centro. */
export function Ornamento({
  className,
  cor = "verde",
}: {
  className?: string;
  cor?: "verde" | "claro";
}) {
  return (
    <div
      aria-hidden
      className={clsx(
        "flex items-center justify-center gap-4",
        cor === "verde" ? "text-verde-900/25" : "text-papel/30",
        className,
      )}
    >
      <span className="h-px w-full max-w-24 bg-current" />
      <Simbolo
        className={clsx(
          "h-5 w-5 shrink-0",
          cor === "verde" ? "text-terra-500" : "text-papel/70",
        )}
      />
      <span className="h-px w-full max-w-24 bg-current" />
    </div>
  );
}
