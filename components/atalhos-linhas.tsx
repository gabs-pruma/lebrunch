import Image from "next/image";
import { LinkTransicao } from "@/components/transicao";
import { IconeBrilho, IconeSeta } from "@/components/icones";
import { clsx } from "@/lib/utils";
import {
  categorias,
  cestasDaCategoria,
  hrefCategoria,
  type CategoriaSlug,
} from "@/data/cestas";

/**
 * "Continue navegando": as outras linhas em foto, no fim da página de uma
 * linha. A pessoa nunca chega a um beco sem saída — sempre há a próxima
 * vitrine a um toque, inclusive a Coleção de Natal.
 */
export function AtalhosLinhas({ excluir }: { excluir?: CategoriaSlug }) {
  const lista = categorias.filter((c) => c.slug !== excluir);

  return (
    <nav aria-label="Outras linhas de cesta" className="px-5 sm:px-8 py-12 sm:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <p className="olho text-terra-700">Continue navegando</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-5">
          {lista.map((categoria) => {
            const natal = categoria.tema === "natal";
            const n = cestasDaCategoria(categoria.slug).length;
            return (
              <li key={categoria.slug}>
                <LinkTransicao
                  href={hrefCategoria(categoria)}
                  className="group relative block aspect-4/3 overflow-hidden rounded-2xl bg-creme lg:aspect-5/4"
                >
                  <Image
                    src={categoria.foto}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 46vw, 92vw"
                    style={{ objectPosition: categoria.foco ?? "50% 50%" }}
                    className="object-cover transition-transform duration-[1200ms] ease-suave group-hover:scale-[1.04]"
                  />
                  {/* etiqueta sobre a foto, sem véu escondendo a imagem (como nas linhas da home) */}
                  <span
                    className={clsx(
                      "absolute bottom-3 left-3 flex flex-col rounded-xl px-3.5 py-2 shadow-sm backdrop-blur-sm",
                      natal ? "bg-noite/90 text-papel" : "bg-papel/95 text-verde-900",
                    )}
                  >
                    <span className="titulo flex items-center gap-2 text-[1.25rem] leading-tight sm:text-[1.5rem]">
                      {categoria.nome}
                      <IconeSeta className="size-4 transition-transform duration-400 ease-suave group-hover:translate-x-1" />
                    </span>
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1.5 text-[0.75rem]",
                        natal ? "text-ouro-claro" : "text-tinta-suave",
                      )}
                    >
                      {natal ? <IconeBrilho className="size-3" /> : null}
                      {categoria.selo ?? `${n} ${n === 1 ? "modelo" : "modelos"}`}
                    </span>
                  </span>
                </LinkTransicao>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
