import { LinkTransicao as Link } from "@/components/transicao";
import { Logotipo, Simbolo } from "@/components/marca";
import { Traco } from "@/components/ilustracao";
import { SeloPremioChip } from "@/components/selo-premio";
import {
  IconeInstagram,
  IconeWhatsApp,
  IconePino,
  IconeRelogio,
} from "@/components/icones";
import { site, linkWhatsApp, mensagens } from "@/data/site";
import { categorias, hrefCategoria } from "@/data/cestas";

export function SiteFooter() {
  const ano = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-verde-900 px-5 pt-16 pb-8 text-papel sm:px-8 sm:pt-24">
      {/* marca d'água, como no verso do catálogo */}
      <Simbolo className="pointer-events-none absolute -right-16 -bottom-16 h-72 w-72 text-papel/[0.05]" />
      <Traco
        nome="trigo"
        className="absolute -top-10 -left-6 h-48 w-48 rotate-12 text-papel/[0.06]"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* No celular, duas colunas (Modelos ao lado dos horários): numa
            coluna só o rodapé passava de duas telas e meia. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:gap-10 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1fr] lg:gap-8">
          <div className="col-span-2 flex flex-col gap-6 md:col-span-1">
            <Logotipo className="h-24 w-[11rem] text-papel" />
            <p className="script max-w-xs text-2xl text-terra-400">
              {site.assinatura}
            </p>
            <SeloPremioChip cor="claro" />

            <div className="flex gap-3">
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${site.instagram.usuario}`}
                className="inline-flex size-11 items-center justify-center rounded-full border border-papel/25 transition-colors duration-300 hover:border-papel hover:bg-papel hover:text-verde-900"
              >
                <IconeInstagram className="size-5" />
              </a>
              <a
                href={linkWhatsApp(mensagens.geral)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${site.telefone}`}
                className="inline-flex size-11 items-center justify-center rounded-full border border-papel/25 transition-colors duration-300 hover:border-papel hover:bg-papel hover:text-verde-900"
              >
                <IconeWhatsApp className="size-5" />
              </a>
            </div>
          </div>

          <nav aria-label="Modelos">
            <h2 className="olho text-papel/65">Modelos</h2>
            <ul className="mt-5 flex flex-col gap-1">
              {categorias.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={hrefCategoria(c)}
                    className="inline-flex min-h-11 items-center text-[0.9375rem] text-papel/85 transition-colors duration-300 hover:text-papel"
                  >
                    {c.nome}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/cestas"
                  className="inline-flex min-h-11 items-center text-[0.9375rem] text-papel/85 transition-colors duration-300 hover:text-papel"
                >
                  Todos os modelos
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col gap-8">
            <div>
              <h2 className="olho text-papel/65">Atendimento</h2>
              <ul className="mt-5 flex flex-col gap-3 text-[0.9375rem] text-papel/85">
                <li>
                  <a
                    href={linkWhatsApp(mensagens.geral)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center transition-colors duration-300 hover:text-papel"
                  >
                    {site.telefone}
                  </a>
                </li>
                {site.horarios.atendimento.map((h) => (
                  <li key={h.dias} className="flex flex-col">
                    <span className="text-papel/60">{h.dias}</span>
                    <span>{h.horas}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* entrega sai antes de o atendimento abrir — daí a separação */}
            <div>
              <h2 className="olho text-papel/65">Entregas</h2>
              <ul className="mt-5 flex flex-col gap-3 text-[0.9375rem] text-papel/85">
                {site.horarios.entregas.map((h) => (
                  <li key={h.dias} className="flex flex-col">
                    <span className="text-papel/60">{h.dias}</span>
                    <span>{h.horas}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h2 className="olho text-papel/65">Le Brunch</h2>
            <ul className="mt-5 flex flex-col gap-1 text-[0.9375rem] text-papel/85">
              <li>
                <Link
                  href="/conheca"
                  className="inline-flex min-h-11 items-center transition-colors duration-300 hover:text-papel"
                >
                  Conheça a Le Brunch
                </Link>
              </li>
              <li>
                <a
                  href={site.google.perfil}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center transition-colors duration-300 hover:text-papel"
                >
                  Avaliações no Google
                </a>
              </li>
            </ul>

            <h2 className="olho mt-8 text-papel/65">Pagamento</h2>
            <p className="mt-4 text-[0.875rem] leading-relaxed text-papel/75">
              {site.pagamento.aVista} à vista, ou{" "}
              {site.pagamento.parcelado.maximo
                ? `em até ${site.pagamento.parcelado.maximo}x no `
                : "parcelado no "}
              {site.pagamento.parcelado.meio} —{" "}
              {site.pagamento.parcelado.ressalva}.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-papel/15 pt-8 text-[0.8125rem] text-papel/65">
          <ul className="flex flex-col gap-3 sm:flex-row sm:gap-8">
            <li className="flex items-center gap-2.5">
              <IconePino className="size-4 shrink-0 text-terra-400" />
              Entregamos em {site.atendimento.regiao}
            </li>
            <li className="flex items-center gap-2.5">
              <IconeRelogio className="size-4 shrink-0 text-terra-400" />
              Pedidos com {site.atendimento.antecedencia}
            </li>
          </ul>

          {/* dados cadastrais */}
          <address className="flex flex-col gap-1 not-italic text-papel/55">
            <span>
              {site.cadastro.razaoSocial} · CNPJ {site.cadastro.cnpj}
            </span>
            <span>
              {site.cadastro.endereco} · {site.cadastro.cidade} · CEP{" "}
              {site.cadastro.cep}
            </span>
          </address>

          <p className="text-papel/55">
            © {ano} {site.nomeCompleto}
          </p>
        </div>
      </div>
    </footer>
  );
}
