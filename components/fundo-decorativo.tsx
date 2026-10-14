import { Traco, Aquarela } from "@/components/ilustracao";

/**
 * Pano de fundo do site.
 *
 * As ilustrações do catálogo impresso deixam de ser enfeite do primeiro
 * bloco e passam a ser o papel de parede de todas as páginas: uma camada
 * fixa atrás do conteúdo, acompanhando a textura de papel do `body`.
 *
 * A camada é fixa de propósito — o conteúdo desliza por cima dela, como
 * numa folha impressa. Tudo aqui é decorativo e inerte a cliques.
 *
 * As seções em creme usam fundo levemente translúcido para que esta camada
 * continue aparecendo por baixo.
 */
export function FundoDecorativo() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      <div className="fundo-deriva absolute inset-0">
        {/* Colocação deliberadamente assimétrica: com a fotografia real
            carregando o design, o papel de parede recuou. Três marcas
            grandes em vez de oito nos cantos. */}
        <Aquarela
          nome="ramo"
          className="absolute -top-12 -left-14 w-44 rotate-[14deg] opacity-[0.22] sm:w-60 lg:-left-10 lg:w-80"
        />
        <Aquarela
          nome="flor-petalas"
          className="absolute top-[46%] -right-12 w-24 -rotate-12 opacity-[0.16] sm:w-36 lg:-right-6 lg:w-48"
        />
        <Traco
          nome="pao"
          className="absolute bottom-[8%] left-[8%] h-36 w-36 -rotate-6 text-verde-900/[0.055] sm:h-52 sm:w-52 lg:h-64 lg:w-64"
        />
      </div>
    </div>
  );
}
