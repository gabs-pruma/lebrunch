import Image from "next/image";
import type { Metadata } from "next";
import { descricaoInicio, metadadosPagina, tituloInicio } from "@/lib/metadados";
import { Hero } from "@/components/hero";
import { Secao, Ornamento, BotaoLink, Olho } from "@/components/ui";
import { LinhaEditorial } from "@/components/linha-editorial";
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
import { SeloPremioMedalha } from "@/components/selo-premio";
import { FotoParallax } from "@/components/foto-parallax";
import { GaleriaDetalhes, type FotoDetalhe } from "@/components/galeria-detalhes";
import {
  cestas,
  cestasDaCategoria,
  comoFunciona,
  linhasDoAno,
} from "@/data/cestas";
import { linkWhatsApp, mensagens, site } from "@/data/site";

export const metadata: Metadata = metadadosPagina({
  tituloSocial: tituloInicio,
  descricao: descricaoInicio,
  caminho: "/",
  og: "inicio",
});

/** Fotos de detalhe das cestas, para a galeria. */
const DETALHES: FotoDetalhe[] = [
  // abre no trabalho da Rebeca (o bentô decorado), não num item de mercado
  { src: "/ensaio/caixa-verde-2.webp", alt: "Caixa verde redonda com bolinho bentô decorado, croissants, uvas e morango", legenda: "Caixa Verde Bentô" },
  { src: "/ensaio/cafe-g-3.webp", alt: "Detalhe da bandeja Café G com pães de queijo, morangos, uvas, kiwi, queijo e iogurte", legenda: "Café G" },
  { src: "/ensaio/cesta-flores-6.webp", alt: "Flores do campo, suco de uva, café Baggio, manteiga e bolo de chocolate dentro da cesta de palha", legenda: "Cesta Flores do Campo" },
  { src: "/ensaio/cafe-m-6.webp", alt: "Croissants, pães de queijo, manteiga Isigny, stroopwafel, laranja desidratada e morangos na bandeja do Café M", legenda: "Café M" },
  { src: "/ensaio/cafe-coado-7.webp", alt: "Caixa de madeira com café Baggio, coador de pano e caneca de cerâmica", legenda: "Caixa Café Coado" },
  { src: "/ensaio/cesta-bouquet-3.webp", alt: "Cesta de palha com flores cor-de-rosa, pão no saquinho de tecido florido com laço vermelho e iogurte grego", legenda: "Cesta Bouquet" },
  { src: "/ensaio/cesta-kids-2.webp", alt: "Caixote de madeira com bolo de chocolate, Kinder Ovo, M&M's e suco", legenda: "Cesta Kids" },
  { src: "/ensaio/box-caneca-4.webp", alt: "Caixa redonda verde da Le Brunch com caneca de vidro, café Baggio e ramo de eucalipto", legenda: "Box Caneca com Inicial" },
];

export default function Home() {
  const natal = cestasDaCategoria("natal");
  const vitrineNatal = natal.slice(0, 4);
  // o destaque da home são os modelos do ano todo: as mais pedidas primeiro
  const doAno = cestas.filter((c) => c.categoria !== "natal");
  const vitrine = [
    ...doAno.filter((c) => c.destaque),
    ...doAno.filter((c) => !c.destaque),
  ].slice(0, 6);

  return (
    <>
      <Hero />

      {/* ————— os modelos do dia a dia: a vitrine principal ————— */}
      <Secao id="modelos" className="scroll-mt-16 pt-10 sm:pt-12 lg:pt-14">
        <div className="flex flex-col gap-5 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <Olho>Para qualquer dia do ano</Olho>
            <h2 className="titulo text-[clamp(2rem,6vw,3.5rem)] leading-[1.03]">
              Os modelos do dia a dia
            </h2>
          </div>
          <BotaoLink href="/cestas" variante="texto" className="self-start sm:self-auto">
            Ver todos os {doAno.length} modelos
            <IconeSeta className="size-4" />
          </BotaoLink>
        </div>
        <GradeCestas cestas={vitrine} rotulo="os modelos do dia a dia" />
      </Secao>

      {/* ————— as linhas do ano todo, em fileiras editoriais ————— */}
      <section id="cestas" className="overflow-hidden py-12 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-site px-5 sm:px-8">
          <div className="flex flex-col gap-5 border-b borda-fina pb-10 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="titulo max-w-xl text-[clamp(2rem,6vw,3.5rem)] leading-[1.03] text-balance">
              Quatro linhas, uma mesma obsessão pelo detalhe
            </h2>
            <p className="max-w-xs text-[0.9375rem] leading-relaxed text-tinta-suave">
              Do presente que sai hoje à cesta de palha com flores que vira o
              centro da comemoração.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-12 sm:mt-14 lg:mt-14 lg:gap-10">
          {linhasDoAno.map((categoria, i) => (
            <Revelar key={categoria.slug}>
              <LinhaEditorial
                categoria={categoria}
                indice={i + 1}
                quantidade={cestasDaCategoria(categoria.slug).length}
                invertida={i % 2 === 1}
              />
            </Revelar>
          ))}
        </div>
      </section>

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
              className="titulo text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.98] text-balance"
            >
              O Natal chegou à{" "}
              <span className="script texto-ouro text-[1.1em] leading-none">
                Le Brunch
              </span>
            </h2>
            <p className="max-w-md text-[1rem] leading-relaxed text-papel/75">
              Latas estampadas, caixas com laço estrelado, espumante, panetone e
              tábua de frios — para a família, os amigos e a sua equipe.
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

      {/* ————— galeria de detalhes ————— */}
      <section aria-labelledby="titulo-detalhes" className="py-12 sm:py-14 lg:py-16">
        <GaleriaDetalhes fotos={DETALHES} rotulo="Fotos de detalhe das cestas">
          <Olho>Feito à mão</Olho>
          <h2
            id="titulo-detalhes"
            className="titulo max-w-2xl text-[clamp(2rem,6vw,3.5rem)] leading-[1.03] text-balance"
          >
            Cada item escolhido no dia,{" "}
            <span className="script text-[1.1em] leading-none text-terra-700">
              de perto
            </span>
          </h2>
        </GaleriaDetalhes>
      </section>

      {/* ————— como funciona ————— */}
      <Secao>
        {/* título em cima, e embaixo foto e passos lado a lado, da mesma
            altura: a lista começa junto do topo da foto e termina com ela */}
        <div className="flex flex-col gap-5 pb-10 lg:grid lg:grid-cols-[0.9fr_1fr] lg:items-end lg:gap-16">
          <div className="flex flex-col gap-4">
            <Olho>Como funciona</Olho>
            <h2 className="titulo text-[clamp(2rem,7vw,3.5rem)] text-balance">
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
                alt="Rebeca Santana, fundadora da Le Brunch, de dólmã verde com a marca bordada, sorrindo de braços cruzados"
                width={1600}
                height={2400}
                sizes="(min-width: 1024px) 28vw, 92vw"
                style={{ objectPosition: "50% 25%" }}
                className="cortina aspect-4/3 w-full rounded-2xl object-cover lg:aspect-4/5"
              />
            </div>
          </Revelar>

          <div className="flex flex-col gap-7">
            <p className="olho text-terra-400">Conheça a Le Brunch</p>
            <h2 className="titulo text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.98] text-balance">
              Toda cesta passa pelas mãos da{" "}
              <span className="script text-[1.1em] leading-none text-terra-400">
                Rebeca
              </span>
            </h2>
            <div className="flex max-w-lg flex-col gap-4 text-[1.0625rem] leading-relaxed text-papel/75">
              <p>
                A Le Brunch nasceu de uma vontade simples: fazer com que um café
                da manhã comum virasse uma lembrança que a pessoa guarda.
              </p>
              <p>
                Hoje a {site.fundadora.nome} está à frente de cada pedido —
                escolhendo os itens, montando as bandejas e conferindo cada
                detalhe antes de fechar a caixa.
              </p>
            </div>
            <div className="flex flex-col gap-1 border-l border-terra-400/60 pl-5">
              <p className="script text-3xl text-terra-400">{site.fundadora.nome}</p>
              <p className="olho text-papel/55">{site.fundadora.cargo}</p>
            </div>
            <BotaoLink href="/conheca" variante="contornoClaro" className="self-start">
              Ler a nossa história
              <IconeSeta className="size-4" />
            </BotaoLink>
          </div>
        </div>
      </section>

      {/* ————— autoridade: prêmio e nota do Google, junto da Rebeca ————— */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-7 py-10 sm:flex-row sm:justify-center sm:gap-14 sm:py-12">
          <SeloPremioMedalha />
          <span aria-hidden className="h-px w-16 bg-verde-900/12 sm:h-20 sm:w-px" />
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
          <h2 className="titulo text-[clamp(2.25rem,9vw,4.25rem)] text-balance">
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
