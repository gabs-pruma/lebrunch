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
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {lista.map((categoria) => {
            const natal = categoria.tema === "natal";
            const n = cestasDaCategoria(categoria.slug).length;
            return (
              <li key={categoria.slug}>
                <LinkTransicao
                  href={hrefCategoria(categoria)}
                  className="group relative flex aspect-16/9 items-end overflow-hidden rounded-2xl p-5 text-papel sm:aspect-4/5"
                >
                  <Image
                    src={categoria.foto}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 30vw, 92vw"
                    style={{ objectPosition: categoria.foco ?? "50% 50%" }}
                    className="-z-10 object-cover transition-transform duration-[1200ms] ease-suave group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden
                    className={clsx(
                      "absolute inset-0 -z-10 bg-gradient-to-t to-transparent",
                      // o degradê sobe até o rótulo: no cartão baixo do celular,
                      // o "3 modelos" caía na parte clara da foto
                      natal
                        ? "from-noite/90 via-noite/50 via-55%"
                        : "from-verde-900/90 via-verde-900/50 via-55%",
                    )}
                  />
                  <span className="flex w-full items-end justify-between gap-3">
                    <span className="flex flex-col gap-1">
                      <span
                        className={clsx(
                          "olho inline-flex items-center gap-1.5",
                          natal ? "text-ouro-claro" : "text-papel/85",
                        )}
                      >
                        {natal ? <IconeBrilho className="size-3" /> : null}
                        {categoria.selo ?? `${n} ${n === 1 ? "modelo" : "modelos"}`}
                      </span>
                      <span className="titulo text-[1.875rem] leading-none">
                        {categoria.nome}
                      </span>
                    </span>
                    <IconeSeta className="size-5 shrink-0 transition-transform duration-400 ease-suave group-hover:translate-x-1" />
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
