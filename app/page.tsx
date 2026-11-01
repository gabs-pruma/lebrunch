import Image from "next/image";
import type { Metadata } from "next";
import { descricaoInicio, metadadosPagina, tituloInicio } from "@/lib/metadados";
import { Hero } from "@/components/hero";
import { Secao, Ornamento, BotaoLink, Olho } from "@/components/ui";
import { AtalhosRedondos } from "@/components/atalhos-redondos";
import { GradeCestas } from "@/components/grade-cestas";
import { DepoimentosSecao } from "@/components/depoimentos-secao";
import { Revelar } from "@/components/revelar";
import { Traco } from "@/components/ilustracao";
import { Luzes } from "@/components/luzes";
import { LinkTransicao } from "@/components/transicao";
import {
  IconeWhatsApp,
  IconeSeta,
  IconeGoogle,
  IconeEstrela,
  IconeBrilho,
} from "@/components/icones";
import { FotoParallax } from "@/components/foto-parallax";
import {
  cestas,
  cestasDaCategoria,
  comoFunciona,
  faixasDePreco,
  filtrarCestas,
  hrefCategoria,
  linhasDoAno,
} from "@/data/cestas";
import { linkWhatsApp, mensagens, site } from "@/data/site";

export const metadata: Metadata = metadadosPagina({
  tituloSocial: tituloInicio,
  descricao: descricaoInicio,
  caminho: "/",
  og: "inicio",
});

export default function Home() {
  const natal = cestasDaCategoria("natal");
  const vitrineNatal = [
    ...natal.filter((c) => c.destaque),
    ...natal.filter((c) => !c.destaque),
  ].slice(0, 4);
  // os mais pedidos (marcados com `destaque` em data/cestas.ts), sem o Natal
  const destaques = cestas.filter((c) => c.destaque && c.categoria !== "natal");

  return (
    <>
      <AtalhosRedondos />
      <Hero />

      {/* ————— os mais pedidos ————— */}
      <Secao id="modelos" className="scroll-mt-16">
        <div className="flex flex-col gap-5 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <Olho>Os mais pedidos</Olho>
            <h2 className="titulo text-[clamp(1.625rem,6vw,3.5rem)] leading-[1.03]">
              Os favoritos de quem presenteia
            </h2>
          </div>
          <BotaoLink href="/cestas" variante="texto" className="self-start sm:self-auto">
            Ver todos os modelos
            <IconeSeta className="size-4" />
          </BotaoLink>
        </div>
        <GradeCestas cestas={destaques} rotulo="os mais pedidos" />
      </Secao>

      {/* ————— por faixa de preço: o filtro de preço vira um toque ————— */}
      <Secao className="!pt-0">
        <h2 className="titulo mb-5 text-[clamp(1.5rem,5vw,2.5rem)] leading-tight">
          Por faixa de preço
        </h2>
        <ul className="grid grid-cols-3 gap-2 sm:gap-4">
          {faixasDePreco.map((f) => {
            const n = filtrarCestas({ linha: "", pessoas: "", preco: f.slug }).length;
            return (
              <li key={f.slug}>
                <LinkTransicao
                  href={`/cestas/?preco=${f.slug}`}
                  className="flex h-full flex-col justify-between gap-3 rounded-2xl bg-creme p-3.5 transition-colors duration-300 hover:bg-verde-900 hover:text-papel sm:p-6"
                >
                  <span className="titulo text-[1.25rem] leading-[1.05] sm:text-[clamp(1.5rem,3vw,2rem)]">
                    <span className="sm:hidden">{f.curto}</span>
                    <span className="hidden sm:inline">{f.nome}</span>
                  </span>
                  <span className="flex items-center justify-between gap-1 text-[0.75rem] opacity-70 sm:text-[0.8125rem]">
                    {n} {n === 1 ? "modelo" : "modelos"}
                    <IconeSeta className="size-3.5 shrink-0" />
                  </span>
                </LinkTransicao>
              </li>
            );
          })}
        </ul>
      </Secao>

      {/* ————— as linhas, em blocos de foto com o nome por cima ————— */}
      <Secao id="cestas" className="!pt-0">
        <h2 className="titulo mb-5 text-[clamp(1.5rem,5vw,2.5rem)] leading-tight">As linhas</h2>
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5">
          {linhasDoAno.map((categoria, i) => {
            const n = cestasDaCategoria(categoria.slug).length;
            return (
              <li key={categoria.slug}>
                <LinkTransicao
                  href={hrefCategoria(categoria)}
                  className="group relative block aspect-4/3 overflow-hidden rounded-2xl bg-creme sm:aspect-4/5 lg:aspect-5/4"
                  style={{ viewTransitionName: `linha-${categoria.slug}` }}
                >
                  <Image
                    src={categoria.foto}
                    alt={`${categoria.nome} — cestas da Le Brunch`}
                    fill
                    sizes="(min-width: 640px) 46vw, 92vw"
                    loading={i === 0 ? "eager" : "lazy"}
                    style={{ objectPosition: categoria.foco ?? "50% 50%" }}
                    className="object-cover transition-transform duration-[1200ms] ease-suave group-hover:scale-[1.04]"
                  />
                  {/* etiqueta clara sobre a foto, sem véu escondendo a imagem */}
                  <span className="absolute bottom-3 left-3 flex flex-col rounded-xl bg-papel/95 px-3.5 py-2 text-verde-900 shadow-sm backdrop-blur-sm">
                    <span className="titulo flex items-center gap-2 text-[1.25rem] leading-tight sm:text-[1.5rem]">
                      {categoria.nome}
                      <IconeSeta className="size-4 transition-transform duration-400 ease-suave group-hover:translate-x-1" />
                    </span>
                    <span className="text-[0.75rem] text-tinta-suave">{n} modelos</span>
                  </span>
                </LinkTransicao>
              </li>
            );
          })}
        </ul>
      </Secao>

      {/* ————— Coleção de Natal, em faixa compacta ————— */}
      <section
        id="natal"
        aria-labelledby="titulo-natal"
        className="tema-natal relative scroll-mt-16 overflow-hidden"
      >
        <Luzes className="opacity-60" />
        <div className="relative mx-auto grid w-full max-w-site gap-8 px-5 sm:px-8 py-12 sm:py-14 lg:py-16 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-5">
            <p className="olho inline-flex items-center gap-2.5 text-ouro-claro">
              <IconeBrilho className="cintilar size-4" />
              Edição limitada · Natal 2026
            </p>
            <h2
              id="titulo-natal"
              className="titulo text-[clamp(1.75rem,5vw,3.5rem)] leading-[0.98] text-balance"
            >
              O Natal chegou à{" "}
              <span className="script texto-ouro text-[1.1em] leading-none">
                Le Brunch
              </span>
            </h2>
            <p className="max-w-md text-[1rem] leading-relaxed text-papel/75">
              Um presente para agradecer a quem esteve ao seu lado o ano todo e
              celebrar a magia das festas.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <BotaoLink href="/natal" variante="ouro" className="shrink-0 whitespace-nowrap">
                Ver o catálogo de Natal
                <IconeSeta className="size-4" />
              </BotaoLink>
              <span className="olho text-papel/55">{natal.length} presentes</span>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {vitrineNatal.map((c) => (
              <li key={c.slug}>
                <LinkTransicao
                  href={`/cestas/modelo/${c.slug}`}
                  className="group flex flex-col gap-2"
                >
                  <span className="relative block aspect-4/5 overflow-hidden rounded-xl bg-noite-alt ring-1 ring-papel/10">
                    {c.imagem ? (
                      <Image
                        src={c.imagem}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 13vw, (min-width: 640px) 22vw, 45vw"
                        style={{ objectPosition: c.foco ?? "50% 50%" }}
                        className="object-cover transition-transform duration-[1200ms] ease-suave group-hover:scale-[1.08]"
                      />
                    ) : null}
                  </span>
                  <span className="text-[0.8125rem] leading-snug text-papel/80 transition-colors group-hover:text-ouro-claro">
                    {c.nome}
                  </span>
                </LinkTransicao>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ————— como funciona ————— */}
      <Secao id="como-funciona" className="scroll-mt-32 xl:scroll-mt-24">
        {/* título em cima, e embaixo foto e passos lado a lado, da mesma
            altura: a lista começa junto do topo da foto e termina com ela */}
        <div className="flex flex-col gap-5 pb-10 lg:grid lg:grid-cols-[0.9fr_1fr] lg:items-end lg:gap-16">
          <div className="flex flex-col gap-4">
            <Olho>Como funciona</Olho>
            <h2 className="titulo text-[clamp(1.625rem,7vw,3.5rem)] text-balance">
              É aqui que a sua{" "}
              <span className="script text-[1.1em] leading-none text-terra-700">
                experiência começa
              </span>
            </h2>
          </div>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-tinta-suave lg:pb-2">
            Você escolhe a cesta e a data aqui mesmo no site. O pedido chega
            pronto no WhatsApp da Rebeca — sem carrinho, sem robô.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:gap-16">
          <FotoParallax
            src="/ensaio/mesa-itens.webp"
            alt="Itens de uma cesta da Le Brunch dispostos sobre a mesa: café Baggio, caneca de cerâmica, suco de uva, queijos e pão na cesta de palha"
            width={1600}
            height={2400}
            sizes="(min-width: 1024px) 42vw, 92vw"
            className="aspect-3/2 w-full rounded-2xl lg:aspect-auto lg:min-h-80"
          />

          <ol className="flex flex-col justify-between">
            {comoFunciona.map((passo, i) => (
              <li
                key={passo.titulo}
                className="flex gap-4 border-b borda-fina py-5 first:pt-0 last:border-0 last:pb-0"
              >
                {/* largura fixa: na manuscrita o "1" é mais estreito que o
                    "2", e os títulos saíam cada um numa coluna */}
                <span className="script w-7 shrink-0 text-center text-3xl leading-none text-terra-700">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[1.0625rem]">{passo.titulo}</h3>
                  <p className="text-[0.9375rem] leading-relaxed text-tinta-suave">
                    {passo.texto}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Secao>

      {/* ————— conheça a Rebeca ————— */}
      <section className="relative overflow-hidden bg-noite text-papel">
        <div className="mx-auto grid w-full max-w-site items-center gap-8 px-5 sm:px-8 py-12 sm:py-14 lg:py-16 lg:grid-cols-[0.7fr_1fr] lg:gap-16">
          <Revelar>
            <div className="relative">
              <Image
                src="/ensaio/rebeca-retrato.webp"
                alt="Rebeca Santana, da Le Brunch, sentada de camisa branca e calça jeans, sorrindo com a mão no rosto"
                width={853}
                height={1280}
                sizes="(min-width: 1024px) 28vw, 92vw"
                style={{ objectPosition: "50% 30%" }}
                className="cortina aspect-4/3 w-full rounded-2xl object-cover lg:aspect-4/5"
              />
            </div>
          </Revelar>

          <div className="flex flex-col gap-7">
            <p className="olho text-terra-400">Conheça a Le Brunch</p>
            <h2 className="titulo text-[clamp(1.75rem,5vw,3.5rem)] leading-[0.98] text-balance">
              Toda cesta passa pelas mãos da{" "}
              <span className="script text-[1.1em] leading-none text-terra-400">
                Rebeca
              </span>
            </h2>
            <div className="flex max-w-lg flex-col gap-4 text-[1.0625rem] leading-relaxed text-papel/75">
              <p>
                A Le Brunch nasceu de uma vontade simples: fazer com que um
                momento simples se torne extraordinário.
              </p>
              <p>
                Hoje a {site.fundadora.nome} está à frente de cada pedido —
                escolhendo os itens, montando as bandejas e conferindo cada
                detalhe antes de fechar a caixa.
              </p>
            </div>
            <div className="flex flex-col gap-1 border-l border-terra-400/60 pl-5">
              <p className="script text-3xl text-terra-400">{site.fundadora.nome}</p>
            </div>
            <BotaoLink href="/conheca" variante="contornoClaro" className="self-start">
              Ler a nossa história
              <IconeSeta className="size-4" />
            </BotaoLink>
          </div>
        </div>
      </section>

      {/* ————— autoridade: a nota do Google, junto da Rebeca ————— */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center py-10 sm:py-12">
          <a
            href={site.google.perfil}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 text-center transition-opacity duration-300 hover:opacity-80"
          >
            <IconeGoogle className="size-6" />
            <p className="flex items-baseline gap-2">
              <span className="titulo text-[2.5rem] leading-none">
                {site.google.nota.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
              </span>
              <span className="flex gap-0.5 text-terra-700" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <IconeEstrela key={i} className="size-3.5" />
                ))}
              </span>
            </p>
            <p className="olho text-tinta-suave">
              {site.google.avaliacoes} avaliações no Google
            </p>
          </a>
        </div>
      </section>

      <DepoimentosSecao />

      {/* ————— a chamada final ————— */}
      <section className="relative overflow-hidden bg-verde-900 px-5 text-center text-papel sm:px-8 py-12 sm:py-14 lg:py-16">
        <Traco
          nome="pao"
          className="absolute -bottom-6 -left-8 h-40 w-40 -rotate-6 text-papel/[0.07] sm:h-56 sm:w-56"
        />
        <Traco
          nome="trigo"
          className="absolute -top-8 -right-6 h-40 w-40 rotate-12 text-papel/[0.07] sm:h-56 sm:w-56"
        />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-7">
          <Ornamento cor="claro" />
          <h2 className="titulo text-[clamp(1.75rem,9vw,4.25rem)] text-balance">
            Alguém aí merece começar o dia{" "}
            <span className="script text-[1.1em] leading-none text-terra-400">
              assim
            </span>
            ?
          </h2>
          <p className="max-w-xl text-[1.0625rem] leading-relaxed text-papel/80">
            Escolha a cesta, marque o dia e a gente entrega montada. Pedidos com{" "}
            {site.atendimento.antecedencia} — entregamos em{" "}
            {site.atendimento.regiao}.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <BotaoLink href="/cestas" variante="claro">
              Escolher a minha cesta
            </BotaoLink>
            <BotaoLink
              href={linkWhatsApp(mensagens.geral)}
              variante="contornoClaro"
              externo
            >
              <IconeWhatsApp className="size-4" />
              Falar no WhatsApp
            </BotaoLink>
          </div>
        </div>
      </section>
    </>
  );
}
