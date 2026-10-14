import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkTransicao as Link } from "@/components/transicao";
import { clsx } from "@/lib/utils";
import { Secao, Olho, Ornamento } from "@/components/ui";
import { BotaoPedido } from "@/components/botao-pedido";
import { GaleriaCesta } from "@/components/galeria-cesta";
import { GradeCestas } from "@/components/grade-cestas";
import { IconePessoas, IconeRelogio, IconeCheck } from "@/components/icones";
import {
  cestas,
  buscarCesta,
  categoriaDe,
  cestasDaCategoria,
  adicionais,
  formatarPreco,
  hrefCategoria,
} from "@/data/cestas";
import { site } from "@/data/site";

export function generateStaticParams() {
  return cestas.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/cestas/modelo/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const cesta = buscarCesta(slug);
  if (!cesta) return {};

  return {
    title: `Cesta ${cesta.nome}`,
    description: `${cesta.chamada} ${
      cesta.preco !== null ? `${formatarPreco(cesta.preco)} + frete.` : ""
    } Entrega em São Paulo e Grande ABC.`,
    alternates: { canonical: `/cestas/modelo/${cesta.slug}` },
  };
}

export default async function CestaPage(
  props: PageProps<"/cestas/modelo/[slug]">,
) {
  const { slug } = await props.params;
  const cesta = buscarCesta(slug);
  if (!cesta) notFound();

  const categoria = categoriaDe(cesta.categoria);
  // no máximo três, para a fileira nunca ficar órfã
  const relacionadas = cestasDaCategoria(cesta.categoria)
    .filter((c) => c.slug !== cesta.slug)
    .slice(0, 3);

  const natal = categoria.tema === "natal";

  return (
    <div className={clsx(natal && "tema-natal natal-catalogo")}>
      <Secao className="!pb-12">
        <nav aria-label="Você está aqui" className="relative mb-8">
          <ol className="olho flex flex-wrap items-center gap-2 text-tinta-suave">
            <li>
              <Link href="/cestas" className="hover:text-verde-900">
                Cestas
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={hrefCategoria(categoria)}
                className="hover:text-verde-900"
              >
                {categoria.nome}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-verde-900">
              {cesta.nome}
            </li>
          </ol>
        </nav>

        <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* foto */}
          <div className="self-start lg:sticky lg:top-28">
            {cesta.imagem ? (
              <GaleriaCesta
                fotos={[cesta.imagem, ...(cesta.fotos ?? [])]}
                nome={cesta.nome}
                foco={cesta.foco}
                escuro={natal}
              />
            ) : null}
          </div>

          {/* informações */}
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-3">
              <Olho>{categoria.nome}</Olho>
              <h1 className="titulo text-[clamp(2.5rem,9vw,4.5rem)]">
                {cesta.nome}
              </h1>
              <p className="text-[1.0625rem] leading-relaxed text-tinta-suave">
                {cesta.chamada}
              </p>
            </div>

            <div className="flex flex-wrap items-end gap-x-8 gap-y-4 border-y borda-fina py-6">
              {cesta.preco !== null ? (
                <p>
                  <span className="titulo block text-[2.75rem] leading-none">
                    {formatarPreco(cesta.preco)}
                  </span>
                  <span className="olho mt-2 block text-tinta-suave">
                    + frete
                  </span>
                </p>
              ) : (
                <p className="titulo text-3xl">Sob consulta</p>
              )}

              <ul className="flex flex-col gap-2 text-[0.875rem] text-tinta-suave">
                {cesta.serve ? (
                  <li className="flex items-center gap-2.5">
                    <IconePessoas className="size-4 shrink-0 text-sage-600" />
                    Serve {cesta.serve}
                  </li>
                ) : null}
                <li className="flex items-center gap-2.5">
                  <IconeRelogio className="size-4 shrink-0 text-sage-600" />
                  Pedido com {site.atendimento.antecedencia}
                </li>
              </ul>
            </div>

            <BotaoPedido
              cesta={cesta}
              prontaEntrega={categoria.prontaEntrega}
              variante={natal ? "ouro" : "verde"}
              rotulo={natal ? "Pedir este presente" : undefined}
              className="w-full sm:w-auto sm:self-start"
            />

            {/* o que vem dentro */}
            <div className="flex flex-col gap-6">
              <h2 className="titulo text-3xl">O que vem na cesta</h2>
              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {cesta.secoes.map((secao) => (
                  <section key={secao.titulo} className="flex flex-col gap-3">
                    <h3 className="olho text-terra-700">{secao.titulo}</h3>
                    <ul className="flex flex-col gap-2">
                      {secao.itens.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed"
                        >
                          <IconeCheck className="mt-0.5 size-4 shrink-0 text-verde-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>

            {/* embalagem */}
            {cesta.embalagens ? (
              <div className="flex flex-col gap-4 border-t borda-fina pt-6">
                <h2 className="titulo text-3xl">Escolha a embalagem</h2>
                <p className="text-[0.9375rem] leading-relaxed text-tinta-suave">
                  É só marcar na hora do pedido.
                </p>
                <ol className="flex flex-col">
                  {cesta.embalagens.map((opcao, i) => (
                    <li
                      key={opcao.nome}
                      className="flex items-baseline gap-4 border-b borda-fina py-3 last:border-0"
                    >
                      <span className="titulo w-6 shrink-0 text-xl text-terra-700 tabular-nums">
                        {i + 1}
                      </span>
                      <span>
                        <span className="block text-[0.9375rem]">{opcao.nome}</span>
                        <span className="block text-[0.875rem] leading-relaxed text-tinta-suave">
                          {opcao.descricao}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {/* adicionais */}
            <details className="group border-t borda-fina pt-6">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-2 text-[1.0625rem]">
                Quer incluir algo a mais?
                <span
                  aria-hidden
                  className="olho text-terra-700 group-open:hidden"
                >
                  ver adicionais
                </span>
                <span
                  aria-hidden
                  className="olho hidden text-terra-700 group-open:inline"
                >
                  fechar
                </span>
              </summary>
              <ul className="mt-4 flex flex-col">
                {adicionais.map((item) => (
                  <li
                    key={item.nome}
                    className="flex items-baseline justify-between gap-4 border-b borda-fina py-3 last:border-0"
                  >
                    <span className="text-[0.9375rem]">{item.nome}</span>
                    <span className="shrink-0 text-[0.9375rem] text-tinta-suave">
                      {formatarPreco(item.preco)}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </Secao>

      {relacionadas.length > 0 ? (
        <Secao fundo="creme">
          <Ornamento className="mb-12" />
          <h2 className="titulo mb-10 text-center text-[clamp(1.75rem,6vw,2.75rem)]">
            {natal ? "Mais presentes de Natal" : `Outras cestas da ${categoria.nome}`}
          </h2>
          <div className={relacionadas.length === 2 ? "mx-auto max-w-4xl" : undefined}>
          <GradeCestas
            cestas={relacionadas}
            colunas={relacionadas.length === 2 ? 2 : 3}
            rotulo={natal ? "Mais presentes de Natal" : `Outras cestas da ${categoria.nome}`}
            prontaEntrega={categoria.prontaEntrega}
            escuro={natal}
          />
          </div>
        </Secao>
      ) : null}
    </div>
  );
}
