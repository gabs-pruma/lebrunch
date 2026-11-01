import type { Metadata } from "next";
import { metadadosPagina } from "@/lib/metadados";
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
  IconePresente,
  IconeRelogio,
  IconeSeta,
  IconeWhatsApp,
} from "@/components/icones";
import { buscarCesta, cestasDaCategoria, formatarPreco } from "@/data/cestas";
import { colecaoNatal } from "@/data/natal";
import { linkWhatsApp, mensagens, site } from "@/data/site";

export const metadata: Metadata = metadadosPagina({
  titulo: `Coleção de Natal ${colecaoNatal.ano}`,
  descricao: `Presentes de Natal da Le Brunch: latas com brownie e panetone, caixa de doces finos, kits com espumante e a Brinde, com tábua de frios. Entrega em ${site.atendimento.regiao}.`,
  caminho: "/natal/",
  og: "natal",
});

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
  const outros = todas.filter((c) => c.slug !== estrela.slug);

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

        <div className="mx-auto w-full max-w-site px-5 pt-16 pb-12 sm:px-8 sm:pb-16 lg:pb-20">
          <div className="flex max-w-2xl flex-col items-start gap-6">
            <p className="olho inline-flex items-center gap-2.5 rounded-full bg-noite/50 px-4 py-2 text-ouro-claro ring-1 ring-ouro/35 backdrop-blur-md">
              <IconeBrilho className="cintilar size-3.5" />
              Edição limitada · Natal {colecaoNatal.ano}
            </p>
            <h1 className="titulo text-[clamp(2.5rem,11vw,7.5rem)] leading-[0.88] text-balance">
              Coleção de{" "}
              <span className="script texto-ouro block text-[1.05em] leading-[1.05]">
                Natal
              </span>
            </h1>
            <p className="max-w-lg text-[1.0625rem] leading-relaxed text-papel/80">
              A magia do Natal mora nos gestos de carinho. Presentes montados
              à mão pela {site.fundadora.nome} para agradecer, celebrar e estar
              perto de quem você ama.
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
        </div>
      </section>

      {/* ————— os presentes: o destaque em poucas linhas e, logo depois, os outros ————— */}
      <section
        id="presentes"
        aria-labelledby="a-estrela"
        className="relative scroll-mt-20 px-5 sm:px-8 py-12 sm:py-14 lg:py-16"
      >
        <div className="mx-auto w-full max-w-6xl">
          <FileteOuro className="mb-10 sm:mb-12" />
          <div className="grid gap-7 lg:grid-cols-2 lg:items-center lg:gap-16">
            {estrela.imagem ? (
              <GaleriaCesta
                fotos={[estrela.imagem, ...(estrela.fotos ?? [])]}
                nome={estrela.nome}
                foco={estrela.foco}
                escuro
                semPrioridade
              />
            ) : null}

            <div className="flex flex-col items-start gap-5">
              <p className="olho text-ouro-claro">Destaque de Natal</p>
              <h2
                id="a-estrela"
                className="titulo scroll-mt-28 text-[clamp(1.875rem,7vw,4.25rem)] leading-[0.98]"
              >
                {estrela.nome}
              </h2>
              <p className="max-w-md text-[1.0625rem] leading-relaxed text-papel/75">
                {estrela.chamada}.
              </p>
              {estrela.preco !== null ? (
                <p className="flex items-baseline gap-3">
                  <span className="titulo text-[2.25rem] leading-none">
                    {formatarPreco(estrela.preco)}
                  </span>
                  <span className="olho text-papel/60">+ frete</span>
                </p>
              ) : null}
              <div className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row sm:items-center sm:gap-6">
                <BotaoPedido cesta={estrela} variante="ouro" rotulo="Pedir este presente" />
                <BotaoLink href={`/cestas/modelo/${estrela.slug}`} variante="contornoOuro">
                  Ver o que vem dentro
                  <IconeSeta className="size-4" />
                </BotaoLink>
              </div>
            </div>
          </div>

          {/* os outros presentes, na ordem do catálogo (do menor preço) */}
          <div className="mt-14 flex flex-col gap-3 sm:mt-20">
            <p className="olho text-ouro">{outros.length} presentes</p>
            <h2
              id="titulo-presentes"
              className="titulo mb-8 text-[clamp(1.75rem,6vw,3.75rem)] leading-none sm:mb-12"
            >
              Mais presentes de Natal
            </h2>
          </div>
          <GradeCestas cestas={outros} rotulo="Mais presentes de Natal" escuro />
        </div>
      </section>

      {/* ————— feito à mão ————— */}
      <section className="relative overflow-hidden px-5 sm:px-8 py-12 sm:py-14 lg:py-16">
        <Luzes className="opacity-40" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="order-last flex flex-col gap-6 lg:order-first">
            <p className="olho text-ouro-claro">Embrulhado à mão</p>
            <h2 className="titulo text-[clamp(1.75rem,6vw,3.75rem)] leading-[1.02] text-balance">
              O laço também é{" "}
              <span className="script texto-ouro text-[1.1em] leading-none">presente</span>
            </h2>
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-papel/75">
              A magia do Natal está em agradecer. Agradecer a quem esteve junto
              durante o ano: a família, um cliente especial, o funcionário que
              merece reconhecimento. E desejar felicidade e saúde para o ano
              que começa. Cada presente sai embrulhado à mão pela{" "}
              {site.fundadora.nome}, para levar esse carinho até quem você
              escolher.
            </p>
            <ul className="flex flex-col gap-3 text-[0.9375rem] text-papel/80">
              <li className="flex items-center gap-3">
                <IconeRelogio className="size-5 shrink-0 text-ouro" />
                Consulte a disponibilidade — quanto antes, melhor para garantir a data
              </li>
              <li className="flex items-center gap-3">
                <Simbolo className="h-4 w-4 shrink-0 text-ouro" />
                Entregamos em {site.atendimento.regiao}
              </li>
              {colecaoNatal.condicoes.map((condicao) => (
                <li key={condicao} className="flex items-center gap-3">
                  <IconePresente className="size-5 shrink-0 text-ouro" />
                  {condicao}
                </li>
              ))}
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
        className="scroll-mt-20 px-5 pb-12 sm:px-8 sm:pb-14 lg:pb-16"
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
              className="titulo text-[clamp(1.625rem,5vw,3.25rem)] leading-[1.02] text-balance"
            >
              Presentes para a equipe e para os clientes
            </h2>
            <p className="text-[1rem] leading-relaxed text-tinta-suave">
              Agradeça a quem fez o seu ano acontecer. Os presentes de Natal
              podem ser pedidos em quantidade, todos com a mesma embalagem.
              Conte quantas pessoas e o orçamento — a gente monta a proposta.
              Para pedidos de empresa, {site.atendimento.antecedenciaCorporativa}.
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
      <section className="relative overflow-hidden px-5 text-center sm:px-8 py-12 sm:py-14 lg:py-16">
        <Luzes className="opacity-80" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-7">
          <FileteOuro />
          <h2 className="titulo text-[clamp(1.875rem,8vw,4.75rem)] leading-[0.98] text-balance">
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
              Ver os modelos do ano todo
              <IconeSeta className="size-4" />
            </BotaoLink>
          </div>
        </div>
      </section>
    </div>
  );
}
