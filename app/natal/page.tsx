import type { Metadata } from "next";
import Image, { getImageProps } from "next/image";
import { notFound } from "next/navigation";
import { BotaoLink } from "@/components/ui";
import { GradeCestas } from "@/components/grade-cestas";
import { GaleriaCesta } from "@/components/galeria-cesta";
import { BotaoPedido } from "@/components/botao-pedido";
import { Revelar } from "@/components/revelar";
import { Luzes } from "@/components/luzes";
import { Neve } from "@/components/neve";
import { FotoParallax } from "@/components/foto-parallax";
import { Simbolo } from "@/components/marca";
import {
  IconeBrilho,
  IconeCheck,
  IconePresente,
  IconeRelogio,
  IconeSeta,
  IconeWhatsApp,
} from "@/components/icones";
import { buscarCesta, cestasDaCategoria, formatarPreco } from "@/data/cestas";
import { colecaoNatal } from "@/data/natal";
import { linkWhatsApp, mensagens, site } from "@/data/site";

export const metadata: Metadata = {
  title: `Coleção de Natal ${colecaoNatal.ano}`,
  description: `Presentes de Natal da Le Brunch: latas, caixa de petiscos, kits com espumante e panetone e a caixa Tábua & Merlot. Entrega em ${site.atendimento.regiao}.`,
  alternates: { canonical: "/natal" },
};

/** Filete dourado com a estrela ao centro. */
function FileteOuro({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-4 ${className ?? ""}`}>
      <span className="filete-ouro h-px w-full max-w-32" />
      <IconeBrilho className="size-4 shrink-0 text-ouro" />
      <span className="filete-ouro h-px w-full max-w-32" />
    </div>
  );
}

export default function NatalPage() {
  const todas = cestasDaCategoria("natal");
  const estrela = buscarCesta(colecaoNatal.estrela);
  if (!estrela || todas.length === 0) notFound();

  const { hero } = colecaoNatal.ambiente;
  const comum = { alt: hero.alt, sizes: "100vw" } as const;
  const {
    props: { srcSet: heroPaisagem },
  } = getImageProps({ ...comum, src: hero.paisagem, width: 2600, height: 1733 });
  const { props: heroRetrato } = getImageProps({
    ...comum,
    src: hero.retrato,
    width: 1600,
    height: 2400,
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <div className="tema-natal">
      <Neve />
      {/* ————— abertura ————— */}
      <section className="relative isolate flex min-h-[max(38rem,100svh)] flex-col justify-end overflow-hidden">
        <div className="hero-imagem absolute inset-0 -z-10">
          <picture>
            <source media="(min-aspect-ratio: 1/1)" srcSet={heroPaisagem} sizes="100vw" />
            <img
              {...heroRetrato}
              alt={hero.alt}
              className="absolute inset-0 h-full w-full object-cover object-[50%_60%]"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-noite via-noite/45 to-noite/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-noite/70 via-transparent to-transparent" />
        </div>
        <Luzes className="-z-10 opacity-60 mix-blend-screen" />

        <div className="mx-auto w-full max-w-7xl px-5 pt-32 pb-12 sm:px-8 sm:pb-16 lg:pb-20">
          <div className="flex max-w-2xl flex-col items-start gap-6">
            <p className="olho inline-flex items-center gap-2.5 rounded-full bg-noite/50 px-4 py-2 text-ouro-claro ring-1 ring-ouro/35 backdrop-blur-md">
              <IconeBrilho className="cintilar size-3.5" />
              Edição limitada · Natal {colecaoNatal.ano}
            </p>
            <h1 className="titulo text-[clamp(3.25rem,11vw,7.5rem)] leading-[0.88] text-balance">
              Coleção de{" "}
              <span className="script texto-ouro block text-[1.05em] leading-[1.05]">
                Natal
              </span>
            </h1>
            <p className="max-w-lg text-[1.0625rem] leading-relaxed text-papel/80">
              Veludo verde, laço estrelado, xadrez vermelho e muito dourado.
              {` ${todas.length}`} presentes montados à mão pela Rebeca — para
              a ceia, para o brinde e para adoçar quem você ama.
            </p>
            <div className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row">
              <BotaoLink href="#presentes" variante="ouro">
                Ver os presentes
              </BotaoLink>
              <BotaoLink
                href={linkWhatsApp(mensagens.natalCorporativo)}
                variante="contornoClaro"
                externo
              >
                <IconePresente className="size-4" />
                Presentes para empresas
              </BotaoLink>
            </div>
          </div>

          {/* índice da página */}
          <nav
            aria-label="Seções da Coleção de Natal"
            className="mt-12 border-t border-papel/15 pt-5 sm:mt-16"
          >
            <ul className="rolagem-lateral -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              {[
                { id: "a-estrela", rotulo: "Para a ceia" },
                ...colecaoNatal.grupos.map((g) => ({ id: g.id, rotulo: g.titulo })),
                { id: "empresas", rotulo: "Para empresas" },
              ].map((item) => (
                <li key={item.id} className="shrink-0">
                  <a
                    href={`#${item.id}`}
                    className="olho inline-flex min-h-11 items-center rounded-full px-4 text-papel/80 ring-1 ring-papel/20 transition-colors hover:bg-ouro hover:text-noite hover:ring-ouro"
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ————— a estrela da coleção ————— */}
      <section
        id="presentes"
        aria-labelledby="a-estrela"
        className="relative scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24 lg:py-28"
      >
        <div className="mx-auto w-full max-w-6xl">
          <FileteOuro className="mb-12" />
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="self-start lg:sticky lg:top-28">
              {estrela.imagem ? (
                <GaleriaCesta
                  fotos={[estrela.imagem, ...(estrela.fotos ?? [])]}
                  nome={estrela.nome}
                  foco={estrela.foco}
                  escuro
                  semPrioridade
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-7">
              <p className="olho text-ouro-claro">A estrela da ceia</p>
              <h2
                id="a-estrela"
                className="titulo scroll-mt-28 text-[clamp(2.5rem,7vw,4.25rem)] leading-[0.98]"
              >
                {estrela.nome}
              </h2>
              <p className="text-[1.0625rem] leading-relaxed text-papel/75">
                {estrela.chamada} Abre a tampa, puxa a gaveta: a ceia chega
                pronta para ir à mesa.
              </p>

              <div className="flex flex-wrap items-end gap-x-8 gap-y-3 border-y border-papel/12 py-6">
                {estrela.preco !== null ? (
                  <p>
                    <span className="titulo block text-[2.75rem] leading-none">
                      {formatarPreco(estrela.preco)}
                    </span>
                    <span className="olho mt-2 block text-papel/60">+ frete</span>
                  </p>
                ) : (
                  <p className="titulo text-3xl text-ouro-claro">Sob consulta</p>
                )}
                {estrela.serve ? (
                  <p className="text-[0.9375rem] text-papel/70">Serve {estrela.serve}</p>
                ) : null}
              </div>

              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {estrela.secoes.map((secao) => (
                  <section key={secao.titulo} className="flex flex-col gap-3">
                    <h3 className="olho text-ouro">{secao.titulo}</h3>
                    <ul className="flex flex-col gap-2">
                      {secao.itens.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-papel/85"
                        >
                          <IconeCheck className="mt-0.5 size-4 shrink-0 text-ouro" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <BotaoPedido
                cesta={estrela}
                variante="ouro"
                rotulo="Pedir este presente"
                className="w-full sm:w-auto sm:self-start"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ————— os grupos ————— */}
      {colecaoNatal.grupos.map((grupo, i) => {
        const modelos = grupo.slugs
          .map((slug) => buscarCesta(slug))
          .filter((c) => c !== undefined);
        return (
          <section
            key={grupo.id}
            aria-labelledby={grupo.id}
            className={`relative px-5 py-16 sm:px-8 sm:py-20 ${i % 2 === 0 ? "bg-noite-alt/60" : ""}`}
          >
            <div
              className={
                modelos.length === 2
                  ? "mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-3 lg:gap-5"
                  : "mx-auto w-full max-w-6xl"
              }
            >
              <div
                className={
                  modelos.length === 2
                    ? // Os grupos de dois alternam o lado do texto no desktop.
                      `flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start ${i % 2 === 1 ? "lg:order-last lg:pl-8" : "lg:pr-8"}`
                    : "mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between"
                }
              >
                <div className="flex flex-col gap-3">
                  <p className="olho text-ouro">
                    {String(i + 1).padStart(2, "0")} · {modelos.length} presentes
                  </p>
                  <h2
                    id={grupo.id}
                    className="titulo scroll-mt-28 text-[clamp(2.25rem,6vw,3.75rem)] leading-none"
                  >
                    {grupo.titulo}
                  </h2>
                </div>
                <p className="max-w-sm text-[0.9375rem] leading-relaxed text-papel/70">
                  {grupo.descricao}
                </p>
              </div>
              <div className={modelos.length === 2 ? "lg:col-span-2" : undefined}>
                <GradeCestas
                  cestas={modelos}
                  rotulo={grupo.titulo}
                  escuro
                  colunas={modelos.length === 2 ? 2 : 3}
                />
              </div>
            </div>
          </section>
        );
      })}

      {/* ————— feito à mão ————— */}
      <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
        <Luzes className="opacity-40" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="order-last flex flex-col gap-6 lg:order-first">
            <p className="olho text-ouro-claro">Embrulhado à mão</p>
            <h2 className="titulo text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.02] text-balance">
              O laço também é{" "}
              <span className="script texto-ouro text-[1.1em] leading-none">presente</span>
            </h2>
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-papel/75">
              Cada kit sai da cozinha da Le Brunch fechado pela {site.fundadora.nome}:
              veludo verde, fita estrelada, xadrez de Natal e a tag Boas Festas.
              Quem recebe abre um presente antes mesmo de provar.
            </p>
            <ul className="flex flex-col gap-3 text-[0.9375rem] text-papel/80">
              <li className="flex items-center gap-3">
                <IconeRelogio className="size-5 shrink-0 text-ouro" />
                Pedidos com {site.atendimento.antecedencia} — quanto antes, melhor para garantir a data
              </li>
              <li className="flex items-center gap-3">
                <Simbolo className="h-4 w-4 shrink-0 text-ouro" />
                Entregamos em {site.atendimento.regiao}
              </li>
            </ul>
          </div>

          <Revelar>
            <div className="relative">
              <FotoParallax
                src={colecaoNatal.ambiente.rebeca.src}
                alt={colecaoNatal.ambiente.rebeca.alt}
                width={1600}
                height={2400}
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="aspect-4/5 w-full rounded-2xl"
              />
            </div>
          </Revelar>
        </div>
      </section>

      {/* ————— para empresas ————— */}
      <section
        id="empresas"
        aria-labelledby="titulo-empresas"
        className="scroll-mt-20 px-5 pb-16 sm:px-8 sm:pb-24"
      >
        <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl bg-papel text-verde-900 lg:grid-cols-2">
          <div className="relative min-h-72">
            <Image
              src={colecaoNatal.ambiente.mesa.src}
              alt={colecaoNatal.ambiente.mesa.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              style={{ objectPosition: "50% 62%" }}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-6 p-8 sm:p-12 lg:p-14">
            <p className="olho inline-flex items-center gap-2 text-natal">
              <IconePresente className="size-4" />
              Natal corporativo
            </p>
            <h2
              id="titulo-empresas"
              className="titulo text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] text-balance"
            >
              Presentes para a equipe e para os clientes
            </h2>
            <p className="text-[1rem] leading-relaxed text-tinta-suave">
              Os kits com espumante, as latas e a Caixa de Petiscos foram feitos
              para presentear em quantidade, todos com a mesma embalagem. Conte
              quantas pessoas e o orçamento — a gente monta a proposta. Para
              pedidos de empresa, {site.atendimento.antecedenciaCorporativa}.
            </p>
            <BotaoLink
              href={linkWhatsApp(mensagens.natalCorporativo)}
              variante="solido"
              externo
              className="self-start"
            >
              <IconeWhatsApp className="size-4" />
              Pedir orçamento
            </BotaoLink>
          </div>
        </div>
      </section>

      {/* ————— fecho ————— */}
      <section className="relative overflow-hidden px-5 py-20 text-center sm:px-8 sm:py-28">
        <Luzes className="opacity-80" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-7">
          <FileteOuro />
          <h2 className="titulo text-[clamp(2.5rem,8vw,4.75rem)] leading-[0.98] text-balance">
            Boas{" "}
            <span className="script texto-ouro text-[1.1em] leading-none">Festas</span>
          </h2>
          <p className="max-w-md text-[1.0625rem] leading-relaxed text-papel/75">
            Não sabe qual escolher? Conte para quem é — a Rebeca sugere o
            presente certo e já calcula o frete para o seu endereço.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <BotaoLink href={linkWhatsApp(mensagens.natal)} variante="ouro" externo>
              <IconeWhatsApp className="size-4" />
              Falar no WhatsApp
            </BotaoLink>
            <BotaoLink href="/cestas" variante="contornoClaro">
              Ver as cestas do ano todo
              <IconeSeta className="size-4" />
            </BotaoLink>
          </div>
        </div>
      </section>
    </div>
  );
}
