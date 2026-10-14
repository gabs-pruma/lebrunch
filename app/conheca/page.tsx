import type { Metadata } from "next";
import Image from "next/image";
import { Secao, TituloSecao, Ornamento, BotaoLink, Olho } from "@/components/ui";
import { Revelar } from "@/components/revelar";
import { Logotipo, Simbolo } from "@/components/marca";
import { Traco } from "@/components/ilustracao";
import { SeloPremioChip, SeloPremioMedalha } from "@/components/selo-premio";
import { FotoParallax } from "@/components/foto-parallax";
import { IconeWhatsApp, IconeInstagram } from "@/components/icones";
import { historia } from "@/data/historia";
import { site, linkWhatsApp, mensagens } from "@/data/site";

export const metadata: Metadata = {
  title: "Conheça a Le Brunch",
  description:
    "A história da Le Brunch e da Rebeca Santana, que monta à mão cada cesta de café da manhã entregue em São Paulo e no Grande ABC.",
  alternates: { canonical: "/conheca" },
};

export default function ConhecaPage() {
  return (
    <>
      {/* ————— abertura ————— */}
      <Secao className="!pb-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
          <Simbolo className="h-10 w-10 text-terra-500" />
          <Olho>Conheça a Le Brunch</Olho>
          <h1 className="titulo text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.98] text-balance">
            Quem monta a sua cesta
          </h1>
          <p className="max-w-xl text-[1.0625rem] leading-relaxed text-tinta-suave">
            {historia.abertura}
          </p>
        </div>
      </Secao>

      {/* ————— a história, com o retrato da Rebeca ————— */}
      <Secao className="!pt-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Revelar className="self-start lg:sticky lg:top-28">
            <figure className="relative">
              <span
                aria-hidden
                className="absolute -top-5 -left-5 h-28 w-28 rounded-full bg-creme"
              />
              <Image
                src="/ensaio/rebeca-retrato-2.webp"
                alt="Rebeca Santana, fundadora da Le Brunch, de dólmã verde com a marca bordada, sorrindo de braços cruzados"
                width={1600}
                height={2400}
                loading="eager"
                fetchPriority="high"
                style={{ objectPosition: "50% 30%" }}
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="relative aspect-4/5 w-full rounded-2xl object-cover"
              />
              <figcaption className="olho mt-4 text-tinta-suave">
                {site.fundadora.nome} · {site.fundadora.cargo}
              </figcaption>
            </figure>
          </Revelar>

          <div className="flex flex-col gap-7">
            <TituloSecao olho="A nossa história">
              Tudo passa pela Rebeca
            </TituloSecao>

            <div className="flex flex-col gap-5 text-[1.0625rem] leading-relaxed text-tinta-suave">
              {historia.paragrafos.map((p, i) => (
                <p key={p.slice(0, 24)} className={i === 0 ? "capitular" : undefined}>
                  {p}
                </p>
              ))}
            </div>

            {historia.citacao ? (
              <blockquote className="border-l-2 border-terra-500 pl-6">
                <p className="titulo text-[clamp(1.5rem,4.5vw,2.25rem)] leading-snug text-verde-900">
                  “{historia.citacao}”
                </p>
                <footer className="olho mt-4 text-tinta-suave">
                  {site.fundadora.nome}
                </footer>
              </blockquote>
            ) : null}

            {historia.desde ? (
              <p className="olho text-tinta-suave">
                Desde {historia.desde} em {site.atendimento.base}
              </p>
            ) : null}

            {/* autoridade: prêmio do ABC */}
            <div className="mt-2 border-t borda-fina pt-7">
              <SeloPremioChip />
            </div>

            {/* números reais do perfil do Google */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t borda-fina pt-7 sm:grid-cols-3">
              {[
                {
                  valor: site.google.nota.toLocaleString("pt-BR", {
                    minimumFractionDigits: 1,
                  }),
                  rotulo: "no Google",
                },
                { valor: `${site.google.avaliacoes}`, rotulo: "avaliações" },
                { valor: "24h", rotulo: "de antecedência" },
              ].map((n) => (
                <div key={n.rotulo} className="flex flex-col gap-1">
                  <dt className="titulo text-[2.5rem] leading-none">
                    {n.valor}
                  </dt>
                  <dd className="olho text-tinta-suave">{n.rotulo}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Secao>

      {/* ————— bastidores, foto larga ————— */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <Revelar className="mx-auto w-full max-w-6xl">
          <figure className="flex flex-col gap-4">
            <FotoParallax
              src={historia.bastidores.src}
              alt={historia.bastidores.alt}
              width={historia.bastidores.largura}
              height={historia.bastidores.altura}
              sizes="(min-width: 1280px) 1200px, 96vw"
              zoom
              className="aspect-4/3 w-full rounded-2xl sm:aspect-16/9"
            />
            <figcaption className="flex items-center gap-3 text-[0.9375rem] text-tinta-suave">
              <Simbolo className="h-3.5 w-3.5 shrink-0 text-terra-500" />
              {historia.bastidores.legenda}
            </figcaption>
          </figure>
        </Revelar>
      </section>

      {/* ————— valores ————— */}
      <Secao fundo="verde" className="relative overflow-hidden">
        <Traco
          nome="trigo"
          className="absolute -top-8 -right-8 h-44 w-44 rotate-12 text-papel/[0.07] sm:h-60 sm:w-60"
        />
        <Traco
          nome="pao"
          className="absolute -bottom-10 -left-8 h-44 w-44 -rotate-6 text-papel/[0.06] sm:h-60 sm:w-60"
        />
        <div className="relative">
          <TituloSecao
            olho="No que acreditamos"
            centro
            className="mx-auto"
          >
            Transmitindo emoções, criando momentos
          </TituloSecao>

          <SeloPremioMedalha cor="claro" className="mt-12 sm:mt-14" />

          <ul className="mt-12 grid gap-8 sm:mt-14 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-4 lg:gap-8">
            {historia.valores.map((valor, i) => (
              <li key={valor.titulo}>
                <Revelar atraso={i * 90}>
                  <div className="flex flex-col gap-3 border-t border-papel/20 pt-5">
                    <Simbolo className="h-4 w-4 text-terra-400" />
                    <h3 className="titulo text-2xl">{valor.titulo}</h3>
                    <p className="text-[0.9375rem] leading-relaxed text-papel/75">
                      {valor.texto}
                    </p>
                  </div>
                </Revelar>
              </li>
            ))}
          </ul>
        </div>
      </Secao>

      {/* ————— citação de quem recebeu ————— */}
      <Secao fundo="creme" className="!pb-0">
        <Revelar>
          <figure className="mx-auto max-w-4xl text-center">
            <blockquote className="titulo text-[clamp(1.75rem,5.5vw,3.25rem)] leading-[1.12] text-balance">
              “{historia.destaque.texto}”
            </blockquote>
            <figcaption className="olho mt-7 text-tinta-suave">
              {historia.destaque.autor} · {historia.destaque.origem}
            </figcaption>
          </figure>
        </Revelar>
      </Secao>

      {/* ————— galeria em mosaico ————— */}
      <Secao fundo="creme">
        <TituloSecao
          olho="Nos detalhes"
          descricao="A experiência não termina na cesta: a embalagem, a curadoria e a montagem fazem parte do presente."
        >
          O cuidado que se vê
        </TituloSecao>

        <ul className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-12">
          {historia.galeria.map((foto, i) => (
            <li key={foto.src} className={foto.span}>
              <Revelar atraso={(i % 3) * 80}>
                <figure className="flex flex-col gap-3">
                  <FotoParallax
                    src={foto.src}
                    alt={foto.alt}
                    width={1600}
                    height={2400}
                    foco={foto.foco}
                    sizes="(min-width: 1024px) 50vw, (min-width: 640px) 48vw, 92vw"
                    className={`${foto.aspecto} w-full`}
                  />
                  <figcaption className="olho text-tinta-suave">
                    {foto.legenda}
                  </figcaption>
                </figure>
              </Revelar>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <BotaoLink href={site.instagram.url} variante="contorno" externo>
            <IconeInstagram className="size-4" />
            Ver mais no Instagram
          </BotaoLink>
        </div>
      </Secao>

      {/* ————— chamada final ————— */}
      <Secao className="text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-7">
          <Ornamento />
          <Logotipo className="h-28 w-[13rem] text-verde-900" />
          <p className="script text-[clamp(1.75rem,6vw,2.75rem)] leading-tight text-terra-700">
            {site.assinatura}
          </p>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-tinta-suave">
            Atendemos {site.atendimento.regiao}, com pedidos feitos com{" "}
            {site.atendimento.antecedencia}.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <BotaoLink href="/cestas" variante="solido">
              Ver os modelos
            </BotaoLink>
            <BotaoLink
              href={linkWhatsApp(mensagens.geral)}
              variante="contorno"
              externo
            >
              <IconeWhatsApp className="size-4" />
              Falar com a gente
            </BotaoLink>
          </div>
        </div>
      </Secao>
    </>
  );
}
