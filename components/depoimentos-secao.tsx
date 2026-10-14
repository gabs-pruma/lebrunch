import { Secao, TituloSecao, Ornamento, BotaoLink } from "@/components/ui";
import { IconeEstrela, IconeGoogle } from "@/components/icones";
import { Revelar } from "@/components/revelar";
import { depoimentos, depoimentosReais } from "@/data/depoimentos";
import { site } from "@/data/site";

function Estrelas({ nota }: { nota: number }) {
  return (
    <p className="flex gap-0.5 text-terra-700" aria-label={`Nota ${nota} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconeEstrela key={i} preenchida={i <= nota} className="size-4" />
      ))}
    </p>
  );
}

export function DepoimentosSecao() {
  const temReais = depoimentosReais.length > 0;
  const lista = temReais ? depoimentosReais : depoimentos;

  return (
    <Secao fundo="creme" id="depoimentos">
      <div className="flex flex-col items-center gap-6">
        <TituloSecao
          olho="Quem já presenteou"
          centro
          descricao="A melhor parte do nosso trabalho chega depois — no recado de quem abriu a caixa."
        >
          O que dizem de quem recebeu
        </TituloSecao>

        {/* nota agregada do perfil do Google */}
        <a
          href={site.google.perfil}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-3 rounded-full border borda-fina bg-papel px-5 py-2.5 transition-colors duration-300 hover:border-verde-900/30"
        >
          <IconeGoogle className="size-5 shrink-0" />
          <span className="flex items-baseline gap-1.5">
            <span className="titulo text-2xl leading-none">
              {site.google.nota.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
              })}
            </span>
            <Estrelas nota={5} />
          </span>
          <span className="text-[0.8125rem] text-tinta-suave">
            {site.google.avaliacoes} avaliações
          </span>
        </a>
      </div>

      {/* Aviso só em desenvolvimento, caso alguém volte a usar placeholders. */}
      {!temReais && process.env.NODE_ENV === "development" ? (
        <p className="mx-auto mt-8 max-w-2xl rounded-lg border border-terra-500/40 bg-terra-200/40 px-4 py-3 text-center text-[0.8125rem] text-terra-700">
          <strong>Pendência de conteúdo:</strong> estes depoimentos são
          placeholders. Substitua por avaliações reais do Google em{" "}
          <code>data/depoimentos.ts</code> e marque{" "}
          <code>verificado: true</code>.
        </p>
      ) : null}

      {/* colunas em vez de grade: com 5 depoimentos a grade deixava um vão
          na segunda fileira. Assim eles fluem e o bloco fecha inteiro. */}
      <ul className="mt-12 gap-5 sm:mt-14 sm:columns-2 lg:columns-3 [&>li]:mb-5 [&>li]:break-inside-avoid">
        {lista.map((d, i) => (
          <li key={`${d.nome}-${i}`}>
            <Revelar atraso={i * 90}>
              <figure className="flex w-full flex-col gap-4 rounded-2xl border borda-fina bg-papel p-6">
                <div className="flex items-center justify-between gap-3">
                  <Estrelas nota={d.nota} />
                  <IconeGoogle className="size-4 shrink-0" />
                </div>
                <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-tinta">
                  “{d.texto}”
                </blockquote>
                <figcaption className="border-t borda-fina pt-4">
                  <p className="text-[0.9375rem] text-verde-900">{d.nome}</p>
                  <p className="olho mt-1 text-tinta-suave">
                    {[d.ocasiao, d.quando].filter(Boolean).join(" · ")}
                  </p>
                </figcaption>
              </figure>
            </Revelar>
          </li>
        ))}
      </ul>

      <Ornamento className="mt-14" />

      <div className="mt-10 flex flex-col items-center gap-4 text-center">
        <p className="max-w-md text-[0.9375rem] leading-relaxed text-tinta-suave">
          Já recebeu uma cesta Le Brunch? Sua avaliação ajuda outras pessoas a
          presentear com confiança.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <BotaoLink href={site.google.avaliar} variante="solido" externo>
            <IconeGoogle className="size-4" />
            Avaliar no Google
          </BotaoLink>
          <BotaoLink href={site.google.perfil} variante="contorno" externo>
            Ler todas as avaliações
          </BotaoLink>
        </div>
      </div>
    </Secao>
  );
}
