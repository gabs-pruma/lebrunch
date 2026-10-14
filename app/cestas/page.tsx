import type { Metadata } from "next";
import Image from "next/image";
import { FotoParallax } from "@/components/foto-parallax";
import { Secao, TituloSecao, Ornamento, BotaoLink } from "@/components/ui";
import { GradeCestas } from "@/components/grade-cestas";
import { CestaDestaque } from "@/components/cesta-destaque";
import { Revelar } from "@/components/revelar";
import { IconeSeta } from "@/components/icones";
import { Traco } from "@/components/ilustracao";
import { IconeWhatsApp } from "@/components/icones";
import { Luzes } from "@/components/luzes";
import { IconeBrilho } from "@/components/icones";
import {
  categorias,
  cestasDaCategoria,
  adicionais,
  formatarPreco,
  linhasDoAno,
  hrefCategoria,
} from "@/data/cestas";
import { linkWhatsApp, mensagens, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Cestas de café da manhã",
  description:
    "Conheça as linhas Pronta Entrega, Essencial, Premium e Presentes & Mimos e a Coleção de Natal da Le Brunch. Cestas de café da manhã montadas à mão e entregues em São Paulo e no Grande ABC.",
  alternates: { canonical: "/cestas" },
};

export default function CestasPage() {
  return (
    <>
      <Secao className="!pb-10">
        <div>
          <TituloSecao
            nivel={1}
            olho="Cestas de café da manhã"
            descricao="Quatro linhas para o ano todo e uma coleção de Natal. Uma mesma obsessão: que a pessoa que abre a caixa sinta que alguém pensou nela de verdade."
          >
            Escolha a cesta para cada momento
          </TituloSecao>
        </div>
      </Secao>

      {/* abertura em fotografia: três cestas do ensaio lado a lado */}
      <div className="mb-14 grid grid-cols-3 gap-2 px-2 sm:gap-4 sm:px-4">
        {[
          { src: "/ensaio/cafe-g-4.webp", alt: "Bandeja Café G sobre a mesa, diante da cortina de veludo verde", foco: "50% 60%" },
          { src: "/ensaio/cesta-flores-3.webp", alt: "Cesta Flores do Campo de palha, com buquê, bolo de chocolate e café", foco: "50% 50%" },
          { src: "/ensaio/cafe-coado-3.webp", alt: "Caixa Café Coado de madeira, com café, coador de pano e caneca", foco: "50% 55%" },
        ].map((foto, i) => (
          <div key={foto.src} className="relative aspect-3/4 overflow-hidden rounded-xl sm:rounded-2xl lg:aspect-4/5">
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              loading={i === 1 ? "eager" : "lazy"}
              fetchPriority={i === 1 ? "high" : undefined}
              sizes="33vw"
              style={{ objectPosition: foto.foco }}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* índice das linhas — âncoras para as seções abaixo */}
      <section className="px-5 pb-14 sm:px-8">
        <nav aria-label="Linhas de cesta" className="mx-auto w-full max-w-6xl">
          <ul className="flex flex-col border-t borda-fina">
            {categorias.map((categoria, i) => (
              <li key={categoria.slug} className="border-b borda-fina">
                <a
                  href={categoria.tema ? hrefCategoria(categoria) : `#${categoria.slug}`}
                  className="group flex min-h-16 items-center gap-5 py-4"
                >
                  <span
                    aria-hidden
                    className="titulo w-10 shrink-0 text-2xl leading-none text-verde-900/25"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="titulo flex-1 text-[clamp(1.5rem,4vw,2.25rem)] leading-tight transition-colors duration-300 group-hover:text-verde-600">
                    {categoria.nome}
                  </span>
                  {categoria.selo && !categoria.tema ? (
                    <span className="olho hidden shrink-0 rounded-full bg-terra-700 px-3 py-1.5 text-papel sm:block">
                      {categoria.selo}
                    </span>
                  ) : categoria.selo ? (
                    <span className="olho hidden shrink-0 items-center gap-1.5 rounded-full bg-noite px-3 py-1.5 text-ouro-claro sm:inline-flex">
                      <IconeBrilho className="size-3" />
                      {categoria.selo}
                    </span>
                  ) : (
                    <span className="olho hidden shrink-0 text-tinta-suave sm:block">
                      {cestasDaCategoria(categoria.slug).length} modelos
                    </span>
                  )}
                  <IconeSeta className="size-4 shrink-0 rotate-90 text-verde-900/40 transition-transform duration-400 ease-suave group-hover:translate-y-1" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* todos os modelos, agrupados por linha */}
      {linhasDoAno.map((categoria) => {
        const modelos = cestasDaCategoria(categoria.slug);
        if (modelos.length === 0) return null;

        return (
          <Secao
            key={categoria.slug}
            id={categoria.slug}
            fundo={categoria.slug === "essencial" || categoria.slug === "presentes" ? "creme" : "papel"}
          >
            <div>
              <TituloSecao olho={categoria.chamada}>
                {categoria.nome}
              </TituloSecao>

              <div className="mt-10 sm:mt-14">
                {modelos.length === 1 ? (
                  <CestaDestaque
                    cesta={modelos[0]}
                    prontaEntrega={categoria.prontaEntrega}
                    selo={categoria.selo}
                    nivel={3}
                  />
                ) : (
                  <GradeCestas
                    cestas={modelos}
                    prontaEntrega={categoria.prontaEntrega}
                    rotulo={categoria.nome}
                    colunas={modelos.length === 2 || modelos.length === 4 ? 2 : 3}
                  />
                )}
              </div>
            </div>
          </Secao>
        );
      })}

      {/* Coleção de Natal, no veludo */}
      <section
        id="natal"
        aria-labelledby="titulo-natal-cestas"
        className="tema-natal relative overflow-hidden px-5 py-14 sm:px-8 sm:py-18 lg:py-20"
      >
        <Luzes className="opacity-50" />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4">
              <p className="olho inline-flex items-center gap-2 text-ouro-claro">
                <IconeBrilho className="cintilar size-3.5" />
                Edição limitada
              </p>
              <h2
                id="titulo-natal-cestas"
                className="titulo text-[clamp(2rem,7vw,3.5rem)] leading-none"
              >
                Coleção de{" "}
                <span className="script texto-ouro text-[1.15em]">Natal</span>
              </h2>
            </div>
            <BotaoLink href="/natal" variante="contornoOuro" className="self-start lg:self-auto">
              Ver a página da coleção
              <IconeSeta className="size-4" />
            </BotaoLink>
          </div>
          <GradeCestas cestas={cestasDaCategoria("natal")} rotulo="Coleção de Natal" escuro />
        </div>
      </section>

      {/* faixa editorial com foto real */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <Revelar className="mx-auto w-full max-w-6xl">
          <figure className="relative overflow-hidden rounded-2xl">
            <FotoParallax
              src="/ensaio/cafe-g-3.webp"
              alt="Detalhe da bandeja Café G, com croissants, pães de queijo, morangos, uvas e iogurte"
              width={1600}
              height={2400}
              foco="50% 45%"
              sizes="(min-width: 1280px) 1200px, 96vw"
              zoom
              className="aspect-4/3 w-full sm:aspect-21/9"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-verde-900/85 to-transparent px-6 pt-16 pb-6 sm:px-10 sm:pb-8">
              <p className="script text-[clamp(1.5rem,4vw,2.5rem)] leading-tight text-terra-400">
                cada item escolhido no dia
              </p>
              <p className="mt-1 max-w-md text-[0.875rem] leading-relaxed text-papel/80">
                Pães e croissants da manhã, frutas da estação e uma curadoria
                que não repete por repetir.
              </p>
            </figcaption>
          </figure>
        </Revelar>
      </section>

      {/* adicionais */}
      <Secao fundo="creme">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-8">
            <TituloSecao
              olho="Personalize"
              descricao="Dá para incluir itens extras em qualquer cesta. Peça no WhatsApp junto com o pedido."
            >
              Um carinho
            </TituloSecao>
            <Image
              src="/ensaio/mesa-itens.webp"
              alt="Itens da Le Brunch dispostos sobre a mesa: café Baggio, caneca de cerâmica, suco de uva e queijos ao lado da cesta de palha"
              width={1600}
              height={2400}
              style={{ objectPosition: "50% 45%" }}
              sizes="(min-width: 1024px) 42vw, 92vw"
              className="aspect-4/3 w-full rounded-2xl object-cover"
            />
          </div>

          <ul className="flex flex-col">
            {adicionais.map((item) => (
              <li
                key={item.nome}
                className="flex items-baseline justify-between gap-4 border-b borda-fina py-4 first:border-t"
              >
                <span className="text-[1.0625rem]">{item.nome}</span>
                <span className="shrink-0 text-tinta-suave">
                  {formatarPreco(item.preco)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Secao>

      {/* ————— como pagar ————— */}
      <Secao className="!pt-0">
        <div className="grid gap-8 border-t borda-fina pt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div>
            <h2 className="titulo text-[clamp(1.75rem,4.5vw,2.5rem)] leading-tight">
              Como pagar
            </h2>
            <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-tinta-suave">
              O acerto é combinado no WhatsApp, junto com a taxa de entrega.
            </p>
          </div>

          <div className="flex flex-col gap-2 border-t borda-fina pt-5 sm:border-0 sm:pt-0">
            <h3 className="olho text-terra-700">À vista</h3>
            <p className="text-[1.0625rem]">{site.pagamento.aVista}</p>
            <p className="text-[0.875rem] leading-relaxed text-tinta-suave">
              O valor da cesta é o que está aqui, mais o frete.
            </p>
          </div>

          <div className="flex flex-col gap-2 border-t borda-fina pt-5 sm:border-0 sm:pt-0">
            <h3 className="olho text-terra-700">Parcelado</h3>
            <p className="text-[1.0625rem]">
              {site.pagamento.parcelado.maximo
                ? `Em até ${site.pagamento.parcelado.maximo}x no cartão`
                : "Cartão de crédito"}
            </p>
            <p className="text-[0.875rem] leading-relaxed text-tinta-suave">
              Por {site.pagamento.parcelado.meio} —{" "}
              {site.pagamento.parcelado.ressalva}, e ele aparece no orçamento
              antes de você fechar.
            </p>
          </div>
        </div>
      </Secao>

      <Secao fundo="verde" className="relative overflow-hidden text-center">
        <Traco
          nome="trigo"
          className="absolute -bottom-6 -left-6 h-40 w-40 rotate-12 text-papel/[0.07] sm:h-52 sm:w-52"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-7">
          <Ornamento cor="claro" />
          <h2 className="titulo text-[clamp(2rem,8vw,3.5rem)] text-balance">
            Não sabe qual escolher? A gente ajuda.
          </h2>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-papel/75">
            Conte para quem é e qual é a ocasião. Sugerimos a cesta certa e já
            calculamos o frete para o seu endereço. Os valores não incluem a
            taxa de entrega — atendemos {site.atendimento.regiao}.
          </p>
          <BotaoLink
            href={linkWhatsApp(mensagens.geral)}
            variante="claro"
            externo
          >
            <IconeWhatsApp className="size-4" />
            Falar no WhatsApp
          </BotaoLink>
        </div>
      </Secao>
    </>
  );
}
