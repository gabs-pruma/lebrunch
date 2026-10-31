import Image from "next/image";
import { LinkTransicao } from "@/components/transicao";
import { clsx } from "@/lib/utils";
import { atalhos } from "@/data/home";

/**
 * Bolinhas com foto logo abaixo do cabeçalho, rolando de lado no celular
 * (como os stories) — o filtro que não parece formulário. Cada uma leva a
 * uma linha ou ao `/cestas/` filtrado. Dados em `data/home.ts`.
 */
export function AtalhosRedondos() {
  return (
    <nav aria-label="Atalhos para os modelos" className="border-b borda-fina">
      <ul className="rolagem-lateral mx-auto flex w-full max-w-site gap-4 overflow-x-auto px-5 py-4 sm:justify-center sm:gap-7 sm:px-8">
        {atalhos.map((a) => (
          <li key={a.chave} className="shrink-0">
            <LinkTransicao href={a.href} className="group flex w-16 flex-col items-center gap-2 text-center sm:w-20">
              <span
                className={clsx(
                  "relative block size-16 overflow-hidden rounded-full ring-1 ring-offset-2 ring-offset-papel transition-[box-shadow] duration-300 sm:size-20",
                  "natal" in a && a.natal ? "ring-ouro" : "ring-verde-900/15 group-hover:ring-verde-900/50",
                )}
              >
                <Image
                  src={`/atalhos/${a.chave}.webp`}
                  alt=""
                  width={240}
                  height={240}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="text-[0.75rem] leading-tight text-verde-900">{a.rotulo}</span>
            </LinkTransicao>
          </li>
        ))}
      </ul>
    </nav>
  );
}
