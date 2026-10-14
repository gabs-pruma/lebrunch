import { GaleriaCesta } from "@/components/galeria-cesta";
import { BotaoPedido } from "@/components/botao-pedido";
import { IconeCheck, IconePessoas, IconeRelogio } from "@/components/icones";
import { formatarPreco, type Cesta } from "@/data/cestas";
import { site } from "@/data/site";

/**
 * Uma cesta só, em tamanho grande: galeria de um lado, ficha do outro.
 *
 * Usado quando a linha tem um único modelo (a Pronta Entrega) — um card
 * sozinho numa grade de três colunas pareceria vitrine vazia.
 */
export function CestaDestaque({
  cesta,
  prontaEntrega,
  selo,
  nivel = 2,
}: {
  cesta: Cesta;
  prontaEntrega?: boolean;
  /** Selo da linha, ex.: "Sai hoje". */
  selo?: string;
  nivel?: 2 | 3;
}) {
  const Titulo = nivel === 2 ? "h2" : "h3";

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {cesta.imagem ? (
        <div className="self-start lg:sticky lg:top-28">
          <GaleriaCesta
            fotos={[cesta.imagem, ...(cesta.fotos ?? [])]}
            nome={cesta.nome}
            foco={cesta.foco}
            semPrioridade
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          {selo ? (
            <span className="olho self-start rounded-full bg-terra-700 px-3 py-1.5 text-papel">
              {selo}
            </span>
          ) : null}
          <Titulo className="titulo text-[clamp(2.25rem,6vw,3.75rem)] leading-none">
            {cesta.nome}
          </Titulo>
          <p className="text-[1.0625rem] leading-relaxed text-tinta-suave">
            {cesta.chamada}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-x-8 gap-y-4 border-y borda-fina py-6">
          {cesta.preco !== null ? (
            <p>
              <span className="titulo block text-[2.5rem] leading-none">
                {formatarPreco(cesta.preco)}
              </span>
              <span className="olho mt-2 block text-tinta-suave">+ frete</span>
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
              {prontaEntrega
                ? "Pode sair hoje, conforme a agenda do dia"
                : `Pedido com ${site.atendimento.antecedencia}`}
            </li>
          </ul>
        </div>

        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
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

        <BotaoPedido
          cesta={cesta}
          prontaEntrega={prontaEntrega}
          className="w-full sm:w-auto sm:self-start"
        />
      </div>
    </div>
  );
}
