import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { LinkTransicao as Link } from "@/components/transicao";
import { Secao, TituloSecao, BotaoLink, Olho } from "@/components/ui";
import { GradeCestas } from "@/components/grade-cestas";
import { AtalhosLinhas } from "@/components/atalhos-linhas";
import { CestaDestaque } from "@/components/cesta-destaque";
import { Simbolo } from "@/components/marca";
import { IconeWhatsApp } from "@/components/icones";
import {
  categorias,
  cestasDaCategoria,
  linhasDoAno,
  type CategoriaSlug,
} from "@/data/cestas";
import { linkWhatsApp, mensagens, site } from "@/data/site";

/** Uma rota estática por linha de cesta. */
export function generateStaticParams() {
  // A Coleção de Natal tem página própria, em /natal.
  return linhasDoAno.map((c) => ({ categoria: c.slug }));
}

function acharCategoria(slug: string) {
  return categorias.find((c) => c.slug === slug);
}

export async function generateMetadata(
  props: PageProps<"/cestas/[categoria]">,
): Promise<Metadata> {
  const { categoria } = await props.params;
  const encontrada = acharCategoria(categoria);
  if (!encontrada) return {};

  return {
    title: encontrada.nome,
    description: encontrada.descricao,
    alternates: { canonical: `/cestas/${encontrada.slug}` },
  };
}

export default async function CategoriaPage(
  props: PageProps<"/cestas/[categoria]">,
) {
  const { categoria: slug } = await props.params;
  const categoria = acharCategoria(slug);
  if (!categoria) notFound();
  if (categoria.tema === "natal") redirect("/natal");

  const modelos = cestasDaCategoria(categoria.slug as CategoriaSlug);

  return (
    <>
      <Secao className="!pb-12">
        <nav aria-label="Você está aqui" className="relative mb-8">
          <ol className="olho flex items-center gap-2 text-tinta-suave">
            <li>
              <Link href="/cestas" className="hover:text-verde-900">
                Modelos
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-verde-900">
              {categoria.nome}
            </li>
          </ol>
        </nav>

        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
          <div className="flex flex-col items-start gap-5">
            <TituloSecao
              nivel={1}
              olho={categoria.chamada}
              descricao={categoria.descricao}
            >
              {categoria.nome}
            </TituloSecao>
            {categoria.selo ? (
              <span className="olho rounded-full bg-terra-700 px-3 py-1.5 text-papel">
                {categoria.selo}
              </span>
            ) : null}
          </div>

          <div
            className="relative order-first aspect-4/3 w-full overflow-hidden rounded-2xl sm:aspect-16/9 lg:order-last lg:aspect-4/5"
            style={{ viewTransitionName: `linha-${categoria.slug}` }}
          >
            <Image
              src={categoria.foto}
              alt={`Cesta representativa da ${categoria.nome}`}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 40vw, 92vw"
              style={{ objectPosition: categoria.foco ?? "50% 50%" }}
              className="object-cover"
            />
          </div>
        </div>
      </Secao>

      <Secao fundo="creme" className="!pt-14">
        {modelos.length === 1 ? (
          <CestaDestaque
            cesta={modelos[0]}
            prontaEntrega={categoria.prontaEntrega}
            selo={categoria.selo}
          />
        ) : modelos.length > 1 ? (
          <GradeCestas
            cestas={modelos}
            prontaEntrega={categoria.prontaEntrega}
            rotulo={categoria.nome}
            colunas={modelos.length === 2 || modelos.length === 4 ? 2 : 3}
          />
        ) : (
          /* Estado vazio — a linha existe, os modelos ainda estão sendo criados. */
          <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-8 text-center">
            <Simbolo className="h-8 w-8 text-terra-500" />
            <Olho>Novos modelos em breve</Olho>
            <h2 className="titulo text-[clamp(1.75rem,6vw,2.75rem)] text-balance">
              Estamos finalizando esta linha
            </h2>
            <p className="text-[0.9375rem] leading-relaxed text-tinta-suave">
              Os modelos da {categoria.nome} estão sendo criados. Enquanto isso,
              fale com a gente no WhatsApp: conseguimos montar uma opção sob
              medida para o seu momento.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <BotaoLink
                href={linkWhatsApp(mensagens.categoria(categoria.nome))}
                variante="solido"
                externo
              >
                <IconeWhatsApp className="size-4" />
                Falar no WhatsApp
              </BotaoLink>
              <BotaoLink href="/cestas" variante="contorno">
                Ver as outras linhas
              </BotaoLink>
            </div>
          </div>
        )}
      </Secao>

      {modelos.length > 0 ? (
        <Secao className="text-center">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
            <p className="text-[0.9375rem] leading-relaxed text-tinta-suave">
              Os valores não incluem o frete.{" "}
              {categoria.prontaEntrega
                ? "Peça pelo WhatsApp e confirmamos se sai hoje"
                : `Pedidos com ${site.atendimento.antecedencia}`}{" "}
              — entregamos em {site.atendimento.regiao}.
            </p>
            <BotaoLink
              href={linkWhatsApp(mensagens.categoria(categoria.nome))}
              variante="solido"
              externo
            >
              <IconeWhatsApp className="size-4" />
              Pedir pelo WhatsApp
            </BotaoLink>
          </div>
        </Secao>
      ) : null}

      <AtalhosLinhas excluir={categoria.slug} />
    </>
  );
}
