import type { Metadata } from "next";
import { metadadosPagina } from "@/lib/metadados";
import Image from "next/image";
import { Secao, TituloSecao, Ornamento, BotaoLink, Olho } from "@/components/ui";
import { Revelar } from "@/components/revelar";
import { Simbolo } from "@/components/marca";
import {
  IconeWhatsApp,
  IconeCheck,
  IconePessoas,
  IconeRelogio,
} from "@/components/icones";
import {
  pacotes,
  pilares,
  diferenciais,
  condicoes,
  etapas,
} from "@/data/corporativo";
import { linkWhatsApp, mensagens, site } from "@/data/site";
import { formatarPreco } from "@/data/cestas";

/*
  Fora do ar por decisão do cliente (set/2026): o corporativo entra em outra
  etapa. A página segue montada e funcionando em /corporativo, mas saiu do
  menu, do rodapé e do sitemap, e está com `noindex` para não ser encontrada
  em buscas antes do lançamento.

  Para reativar: apagar o `robots` abaixo, devolver a rota ao `app/sitemap.ts`
  e recolocar o item no menu (`components/site-header.tsx`) e no rodapé.
*/
export const metadata: Metadata = {
  ...metadadosPagina({
    titulo: "Brunch corporativo",
    descricao:
      "Coffee breaks, eventos e reuniões com a curadoria da Le Brunch. Montagem e desmontagem inclusas, a partir de 15 pessoas, em São Paulo e no Grande ABC.",
    caminho: "/corporativo/",
    og: "corporativo",
  }),
  robots: { index: false, follow: false },
};

export default function CorporativoPage() {
  return (
    <>
      {/* ————— abertura ————— */}
      <section className="relative overflow-hidden bg-verde-900 px-5 pt-14 pb-12 text-papel sm:px-8 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16">
        <Simbolo className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 text-papel/[0.05]" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
              <Simbolo className="h-5 w-5 shrink-0 text-terra-400" />
              <Olho className="text-terra-400">Le Brunch Corporativo</Olho>
            </div>

            <h1 className="titulo text-[clamp(2.5rem,9vw,4.75rem)] text-balance">
              Uma pausa que{" "}
              <span className="script text-[1.05em] leading-[0.9] text-terra-400">
                transforma
              </span>{" "}
              o ambiente de trabalho
            </h1>

            <p className="max-w-md text-[1.0625rem] leading-relaxed text-papel/80">
              Coffee breaks, eventos e reuniões com a mesma curadoria das
              nossas cestas. A gente monta, serve e desmonta — sua equipe só
              precisa aparecer.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <BotaoLink
                href={linkWhatsApp(mensagens.corporativo)}
                variante="claro"
                externo
              >
                <IconeWhatsApp className="size-4" />
                Pedir orçamento
              </BotaoLink>
              <BotaoLink href="#pacotes" variante="contornoClaro">
                Ver os pacotes
              </BotaoLink>
            </div>

            <ul className="mt-2 flex flex-col gap-2.5 text-[0.8125rem] text-papel/70 sm:flex-row sm:gap-7">
              <li className="flex items-center gap-2.5">
                <IconePessoas className="size-4 shrink-0 text-terra-400" />
                Mínimo 15 pessoas
              </li>
              <li className="flex items-center gap-2.5">
                <IconeRelogio className="size-4 shrink-0 text-terra-400" />
                {site.atendimento.antecedenciaCorporativa}
              </li>
            </ul>
          </div>

          <div className="relative">
            <Image
              src="/ensaio/natal-mesa.webp"
              alt="Mesa com kits de presente da Le Brunch: caixas verdes com laço, espumante, latas e sacos de algodão"
              width={2600}
              height={1733}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="aspect-4/3 w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* ————— pilares ————— */}
      <Secao>
        <TituloSecao
          olho="Por que a Le Brunch"
          script="sem discurso"
          centro
          descricao="Três coisas que a sua equipe percebe antes de provar qualquer item da mesa."
          className="mx-auto"
        >
          Hospitalidade
        </TituloSecao>

        <ul className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-3 sm:gap-6">
          {pilares.map((p, i) => (
            <li key={p.titulo}>
              <Revelar atraso={i * 100}>
                <div className="flex flex-col gap-3">
                  <Simbolo className="h-4 w-4 text-terra-500" />
                  <h3 className="titulo text-2xl">{p.titulo}</h3>
                  <p className="text-[0.9375rem] leading-relaxed text-tinta-suave">
                    {p.texto}
                  </p>
                </div>
              </Revelar>
            </li>
          ))}
        </ul>
      </Secao>

      {/* ————— pacotes ————— */}
      <Secao fundo="creme" id="pacotes">
        <TituloSecao
          olho="Pacotes"
          descricao="Valores de referência para a base de 15 pessoas. Acima disso, montamos a proposta conforme o número de convidados e o formato do evento."
        >
          Escolha o formato
        </TituloSecao>

        <ul className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-3">
          {pacotes.map((pacote, i) => (
            <li key={pacote.slug} className="flex">
              <Revelar atraso={i * 100} className="flex w-full">
                <article
                  className={
                    pacote.destaque
                      ? "relative flex w-full flex-col gap-6 rounded-2xl bg-verde-900 p-7 text-papel sm:p-8"
                      : "relative flex w-full flex-col gap-6 rounded-2xl border borda-fina bg-papel p-7 sm:p-8"
                  }
                >
                  {pacote.destaque ? (
                    <span className="olho absolute -top-3 left-7 rounded-full bg-terra-700 px-3 py-1.5 text-papel">
                      Mais escolhido
                    </span>
                  ) : null}

                  <div className="flex flex-col gap-2">
                    <Olho
                      className={
                        pacote.destaque ? "text-terra-400" : "text-terra-700"
                      }
                    >
                      {pacote.ordem}
                    </Olho>
                    <h3 className="titulo text-[2rem] leading-tight">
                      {pacote.nome}
                    </h3>
                    <p
                      className={
                        pacote.destaque
                          ? "script text-xl text-terra-400"
                          : "script text-xl text-terra-700"
                      }
                    >
                      {pacote.subtitulo}
                    </p>
                  </div>

                  <div
                    className={
                      pacote.destaque
                        ? "border-y border-papel/20 py-5"
                        : "border-y borda-fina py-5"
                    }
                  >
                    <p className="titulo text-[2.5rem] leading-none">
                      {formatarPreco(pacote.total)}
                    </p>
                    <p
                      className={
                        pacote.destaque
                          ? "olho mt-2 text-papel/60"
                          : "olho mt-2 text-tinta-suave"
                      }
                    >
                      base 15 pessoas
                    </p>
                  </div>

                  <ul className="flex flex-1 flex-col gap-2.5">
                    {pacote.itens.map((item) => (
                      <li
                        key={item}
                        className={
                          pacote.destaque
                            ? "flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-papel/85"
                            : "flex items-start gap-2.5 text-[0.9375rem] leading-relaxed"
                        }
                      >
                        <IconeCheck
                          className={
                            pacote.destaque
                              ? "mt-0.5 size-4 shrink-0 text-terra-400"
                              : "mt-0.5 size-4 shrink-0 text-verde-600"
                          }
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <BotaoLink
                    href={linkWhatsApp(
                      mensagens.corporativoPacote(pacote.nome),
                    )}
                    variante={pacote.destaque ? "claro" : "contorno"}
                    externo
                    className="w-full"
                  >
                    Pedir orçamento
                  </BotaoLink>
                </article>
              </Revelar>
            </li>
          ))}
        </ul>
      </Secao>

      {/* ————— diferenciais ————— */}
      <Secao>
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <TituloSecao olho="No detalhe" script="no lugar">
              Tudo pensado
            </TituloSecao>
            <Image
              src="/ensaio/natal-boas-festas-4.webp"
              alt="Kit com mini espumante, lata dourada de frutas secas e tag Boas Festas na bolsa de acrílico"
              width={1600}
              height={2400}
              style={{ objectPosition: "50% 62%" }}
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="aspect-3/2 w-full rounded-2xl object-cover"
            />
          </div>

          <ul className="flex flex-col">
            {diferenciais.map((item) => (
              <li
                key={item}
                className="flex items-start gap-4 border-b borda-fina py-5 first:border-t"
              >
                <Simbolo className="mt-1 h-3.5 w-3.5 shrink-0 text-terra-500" />
                <span className="text-[1.0625rem] leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Secao>

      {/* ————— como funciona ————— */}
      <Secao fundo="verde">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <Olho className="text-terra-400">Como funciona</Olho>
            <h2 className="titulo text-[clamp(2rem,7vw,3.5rem)] text-balance">
              Três conversas e{" "}
              <span className="script text-[1.1em] leading-none text-terra-400">
                está resolvido
              </span>
            </h2>
          </div>

          <ol className="flex flex-col">
            {etapas.map((etapa, i) => (
              <li
                key={etapa.titulo}
                className="flex gap-5 border-b border-papel/15 py-5 first:pt-0 last:border-0 last:pb-0"
              >
                <span className="script shrink-0 text-3xl leading-none text-terra-400">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[1.0625rem]">{etapa.titulo}</h3>
                  <p className="text-[0.9375rem] leading-relaxed text-papel/70">
                    {etapa.texto}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Secao>

      {/* ————— condições ————— */}
      <Secao fundo="creme">
        <TituloSecao olho="Combinado é combinado">
          Condições
        </TituloSecao>

        <dl className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {condicoes.map((c) => (
            <div
              key={c.titulo}
              className="flex flex-col gap-2 border-t borda-fina pt-5"
            >
              <dt className="olho text-terra-700">{c.titulo}</dt>
              <dd className="text-[0.9375rem] leading-relaxed text-tinta">
                {c.texto}
              </dd>
            </div>
          ))}
        </dl>
      </Secao>

      {/* ————— chamada final ————— */}
      <Secao className="text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-7">
          <Ornamento />
          <h2 className="titulo text-[clamp(2rem,8vw,3.75rem)] text-balance">
            Vamos montar o café da{" "}
            <span className="script text-[1.1em] leading-none text-terra-700">
              sua equipe
            </span>
          </h2>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-tinta-suave">
            Conte a data e o número de pessoas. Enviamos a proposta com cardápio
            e valor fechado.
          </p>
          <BotaoLink
            href={linkWhatsApp(mensagens.corporativo)}
            variante="solido"
            externo
          >
            <IconeWhatsApp className="size-4" />
            Falar com a Rebeca
          </BotaoLink>
        </div>
      </Secao>
    </>
  );
}
