import { Traco } from "@/components/ilustracao";
import { Simbolo } from "@/components/marca";
import { clsx } from "@/lib/utils";
import { site } from "@/data/site";

/**
 * Selo do Prêmio Melhores no ABC 2026.
 *
 * O selo original do prêmio é preto com dourado, o que brigaria com o papel,
 * o verde e o terracota da Le Brunch. Então o prêmio é dito na linguagem da
 * própria marca: o trigo do catálogo espelhado faz o papel do louro. O link
 * leva ao perfil do prêmio, para quem quiser conferir.
 */

const { premio } = site;

/** Pílula compacta, para barras de credibilidade e rodapé. */
export function SeloPremioChip({
  className,
  cor = "escuro",
}: {
  className?: string;
  cor?: "escuro" | "claro";
}) {
  return (
    <a
      href={premio.url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "inline-flex min-h-11 items-center gap-2.5 rounded-full border px-4 py-2 transition-colors duration-300",
        cor === "escuro"
          ? "border-verde-900/15 text-verde-900 hover:border-verde-900/35"
          : "border-papel/25 text-papel hover:border-papel/50",
        className,
      )}
    >
      <Simbolo
        className={clsx(
          "h-4 w-4 shrink-0",
          cor === "escuro" ? "text-terra-700" : "text-terra-400",
        )}
      />
      <span className="text-left text-[0.8125rem] leading-tight">
        <strong className="font-normal">Vencedora</strong> do {premio.nome}{" "}
        {premio.ano}
        <span
          className={clsx(
            "block text-[0.75rem]",
            cor === "escuro" ? "text-tinta-suave" : "text-papel/65",
          )}
        >
          {premio.categoria}
        </span>
      </span>
    </a>
  );
}

/** Medalhão, para o momento de autoridade da página. */
export function SeloPremioMedalha({
  className,
  cor = "escuro",
}: {
  className?: string;
  cor?: "escuro" | "claro";
}) {
  const claro = cor === "claro";

  return (
    <div className={clsx("flex flex-col items-center gap-4", className)}>
      <div className="flex items-center gap-2 sm:gap-5">
        <Traco
          nome="trigo"
          className={clsx(
            "h-14 w-14 shrink-0 -scale-x-100 sm:h-24 sm:w-24",
            claro ? "text-papel/55" : "text-verde-900/45",
          )}
        />

        <div className="flex flex-col items-center gap-1 text-center">
          <p
            className={clsx(
              "olho",
              claro ? "text-terra-400" : "text-terra-700",
            )}
          >
            Vencedora {premio.ano}
          </p>
          <p className="titulo text-[clamp(1.25rem,4vw,2rem)] leading-tight text-balance">
            {premio.nome}
          </p>
          <p
            className={clsx(
              "olho text-pretty",
              claro ? "text-terra-400" : "text-terra-700",
            )}
          >
            {premio.categoria}
          </p>
        </div>

        <Traco
          nome="trigo"
          className={clsx(
            "h-14 w-14 shrink-0 sm:h-24 sm:w-24",
            claro ? "text-papel/55" : "text-verde-900/45",
          )}
        />
      </div>

      <a
        href={premio.url}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          "olho inline-flex min-h-11 items-center underline decoration-current/30 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-current",
          claro ? "text-papel/70" : "text-tinta-suave",
        )}
      >
        {premio.temporada} · {premio.organizador}
      </a>
    </div>
  );
}
