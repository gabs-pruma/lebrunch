import Image from "next/image";
import { IconeSeta } from "@/components/icones";
import { LinkTransicao } from "@/components/transicao";
import { clsx } from "@/lib/utils";
import { hrefCategoria, type Categoria } from "@/data/cestas";

/**
 * Uma linha de cesta apresentada como fileira de revista.
 *
 * Em vez de três cartões iguais, cada linha ganha uma fileira própria: a
 * fileira ocupa a largura toda da página, a fotografia preenche metade dela
 * de ponta a ponta, o lado alterna a cada linha e um numeral grande marca a
 * sequência. Nada de moldura nem de sombra.
 *
 * A fileira é full-bleed de propósito, então o recuo do texto é interno —
 * nada de margem negativa, que desperdiçaria foto fora da tela.
 */
export function LinhaEditorial({
  categoria,
  indice,
  quantidade,
  invertida,
}: {
  categoria: Categoria;
  /** Numeral que aparece grande ao lado do nome. */
  indice: number;
  quantidade: number;
  /** true = foto à direita (usado nas linhas pares). */
  invertida?: boolean;
}) {
  const numero = String(indice).padStart(2, "0");

  return (
    <article className="group grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-0">
      <div
        className={clsx(
          "quadro-parallax aspect-4/3 w-full sm:aspect-16/9 lg:aspect-4/3",
          invertida && "lg:order-2",
        )}
        style={{ viewTransitionName: `linha-${categoria.slug}` }}
      >
        <Image
          src={categoria.foto}
          alt={`Cestas da ${categoria.nome} da Le Brunch`}
          width={1600}
          height={2400}
          sizes="(min-width: 1024px) 50vw, 100vw"
          style={{ objectPosition: categoria.foco ?? "50% 50%" }}
          className="transition-transform duration-[1400ms] ease-suave group-hover:scale-[1.03]"
        />
      </div>

      <div
        className={clsx(
          "flex flex-col gap-5 px-5 sm:px-8",
          invertida
            ? "lg:order-1 lg:justify-self-end lg:pr-14 lg:pl-8 xl:pr-20"
            : "lg:pr-8 lg:pl-14 xl:pl-20",
        )}
      >
        <div className="flex items-baseline gap-4">
          <span
            aria-hidden
            className="titulo text-[clamp(2.25rem,5vw,3.5rem)] leading-none text-verde-900/20"
          >
            {numero}
          </span>
          <span className="olho text-tinta-suave">
            {quantidade === 0
              ? "em breve"
              : `${quantidade} ${quantidade === 1 ? "modelo" : "modelos"}`}
          </span>
          {categoria.selo ? (
            <span className="olho rounded-full bg-terra-700 px-3 py-1.5 text-papel">
              {categoria.selo}
            </span>
          ) : null}
        </div>

        <h3 className="titulo max-w-md text-[clamp(2rem,4.5vw,3rem)] leading-[1.02]">
          {categoria.nome}
        </h3>

        <p className="max-w-md text-[1.0625rem] leading-relaxed text-tinta-suave">
          {categoria.descricao}
        </p>

        <LinkTransicao
          href={hrefCategoria(categoria)}
          className="olho inline-flex min-h-11 w-fit items-center gap-2.5 border-b border-verde-900/25 pb-1 transition-colors duration-300 hover:border-verde-900"
        >
          {/* "Ver a Presentes" não fecha a concordância em toda linha; o número
              de modelos serve para qualquer uma */}
          {categoria.tema === "natal"
            ? "Ver a coleção"
            : quantidade === 1
              ? "Ver o modelo"
              : `Ver os ${quantidade} modelos`}
          <IconeSeta className="size-4 transition-transform duration-400 ease-suave group-hover:translate-x-1" />
        </LinkTransicao>
      </div>
    </article>
  );
}
