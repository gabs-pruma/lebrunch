"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { clsx } from "@/lib/utils";
import { Wordmark, Simbolo } from "@/components/marca";
import { LinkTransicao } from "@/components/transicao";
import { IconeBrilho, IconeSeta, IconeWhatsApp } from "@/components/icones";
import {
  categorias,
  cestasDaCategoria,
  hrefCategoria,
} from "@/data/cestas";
import { linkWhatsApp, mensagens } from "@/data/site";
import { semBarraFinal } from "@/lib/base";

/**
 * Cabeçalho.
 *
 * - Nas páginas que abrem com foto ou vídeo sangrado (home e Natal) ele
 *   começa transparente, em cima da imagem, e ganha fundo ao rolar.
 * - Rolando para baixo ele se recolhe; ao menor gesto para cima, volta.
 *   Quem lê ganha a tela inteira, quem procura o menu acha na hora.
 * - "Cestas" abre um painel com as quatro linhas em foto (desktop). No
 *   celular o menu ocupa a tela, com as linhas em miniatura.
 * - O filete fino no rodapé do cabeçalho mostra quanto da página já foi
 *   lido (CSS ligado ao scroll, ver `.barra-progresso`).
 */

/** Páginas cuja primeira dobra é imagem sangrada atrás do cabeçalho. */
const SOBREPOSTAS = ["/", "/natal"];

/* ——— rolagem como estado externo (sem setState em efeito) ——— */
let ultimoY = 0;
let estado = "topo"; // "topo" | "visivel" | "oculto"

function assinarRolagem(avisar: () => void) {
  ultimoY = window.scrollY;
  const aoRolar = () => {
    const y = window.scrollY;
    const anterior = estado;
    if (y < 24) estado = "topo";
    else if (y > ultimoY + 6 && y > 320) estado = "oculto";
    else if (y < ultimoY - 6) estado = "visivel";
    else if (estado === "topo") estado = "visivel";
    ultimoY = y;
    if (estado !== anterior) avisar();
  };
  window.addEventListener("scroll", aoRolar, { passive: true });
  return () => window.removeEventListener("scroll", aoRolar);
}
const lerRolagem = () => estado;
const rolagemNoServidor = () => "topo";

export function SiteHeader() {
  const caminho = semBarraFinal(usePathname());
  const [menuAberto, setMenuAberto] = useState(false);
  const [painelAberto, setPainelAberto] = useState(false);
  const rolagem = useSyncExternalStore(
    assinarRolagem,
    lerRolagem,
    rolagemNoServidor,
  );
  const fecharPainel = useRef<ReturnType<typeof setTimeout>>(undefined);

  const natal = caminho === "/natal" || caminho.startsWith("/cestas/modelo/natal-");
  const sobreposto =
    SOBREPOSTAS.includes(caminho) && rolagem === "topo" && !menuAberto;
  const oculto = rolagem === "oculto" && !menuAberto && !painelAberto;
  /** Texto claro: em cima da foto, no menu aberto ou no tema de Natal. */
  const claro = sobreposto || menuAberto || natal;

  // Fecha tudo ao trocar de página.
  const [caminhoAnterior, setCaminhoAnterior] = useState(caminho);
  if (caminho !== caminhoAnterior) {
    setCaminhoAnterior(caminho);
    setMenuAberto(false);
    setPainelAberto(false);
  }

  // Trava o scroll do corpo enquanto o menu do celular está aberto.
  useEffect(() => {
    if (!menuAberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [menuAberto]);

  useEffect(() => {
    if (!menuAberto && !painelAberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuAberto(false);
        setPainelAberto(false);
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [menuAberto, painelAberto]);

  const abrirPainel = () => {
    clearTimeout(fecharPainel.current);
    setPainelAberto(true);
  };
  const agendarFechamento = () => {
    clearTimeout(fecharPainel.current);
    fecharPainel.current = setTimeout(() => setPainelAberto(false), 180);
  };

  const ativo = (href: string) =>
    href === "/" ? caminho === "/" : caminho.startsWith(href);

  return (
    <>
      <header
        style={{ viewTransitionName: "cabecalho" }}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,box-shadow] duration-500 ease-suave",
          oculto ? "-translate-y-full" : "translate-y-0",
          sobreposto
            ? "bg-transparent text-papel"
            : menuAberto
              ? "bg-verde-900 text-papel"
              : natal
                ? "bg-noite text-papel"
                : "bg-papel/90 text-verde-900 shadow-[0_1px_0_rgba(0,62,57,0.08)] backdrop-blur-md",
        )}
      >
        {/* véu para o texto claro ler bem sobre qualquer foto */}
        <span
          aria-hidden
          className={clsx(
            "pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent transition-opacity duration-500",
            sobreposto ? "opacity-100" : "opacity-0",
          )}
        />

        <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">
          <LinkTransicao
            href="/"
            aria-label="Le Brunch — página inicial"
            className="flex min-h-11 items-center gap-2.5"
          >
            <Simbolo className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
            <Wordmark className="h-3.5 w-[6.5rem] sm:h-4 sm:w-[7.5rem]" />
          </LinkTransicao>

          {/* ——— navegação do desktop ——— */}
          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              <li
                onMouseEnter={abrirPainel}
                onMouseLeave={agendarFechamento}
              >
                <button
                  type="button"
                  aria-expanded={painelAberto}
                  aria-controls="painel-cestas"
                  onClick={() => setPainelAberto((v) => !v)}
                  className={clsx(
                    "olho group relative inline-flex min-h-11 cursor-pointer items-center gap-2",
                    "after:absolute after:bottom-2.5 after:left-0 after:h-px after:bg-current after:transition-[width] after:duration-400 after:ease-suave",
                    caminho.startsWith("/cestas") || painelAberto
                      ? "after:w-full"
                      : "after:w-0 hover:after:w-full",
                  )}
                >
                  Modelos
                  <span
                    aria-hidden
                    className={clsx(
                      "block size-1.5 border-r border-b border-current transition-transform duration-300",
                      painelAberto ? "translate-y-0.5 -rotate-135" : "rotate-45",
                    )}
                  />
                </button>
              </li>
              <li>
                <LinkTransicao
                  href="/natal"
                  aria-current={ativo("/natal") ? "page" : undefined}
                  className={clsx(
                    "olho inline-flex min-h-11 items-center gap-2 rounded-full px-4 transition-colors duration-300",
                    claro
                      ? "bg-ouro/15 text-ouro-claro ring-1 ring-ouro/40 hover:bg-ouro/25"
                      : "bg-natal/8 text-natal ring-1 ring-natal/25 hover:bg-natal/12",
                  )}
                >
                  <IconeBrilho className="cintilar size-3.5" />
                  Natal 2026
                </LinkTransicao>
              </li>
              <li>
                <LinkTransicao
                  href="/conheca"
                  aria-current={ativo("/conheca") ? "page" : undefined}
                  className={clsx(
                    "olho relative inline-flex min-h-11 items-center",
                    "after:absolute after:bottom-2.5 after:left-0 after:h-px after:bg-current after:transition-[width] after:duration-400 after:ease-suave",
                    ativo("/conheca") ? "after:w-full" : "after:w-0 hover:after:w-full",
                  )}
                >
                  Nossa história
                </LinkTransicao>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={linkWhatsApp(mensagens.geral)}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                "hidden min-h-11 items-center gap-2 rounded-full px-5 text-[0.75rem] tracking-[0.14em] uppercase transition-colors duration-300 sm:inline-flex",
                claro
                  ? "bg-papel text-verde-900 hover:bg-creme"
                  : "bg-verde-900 text-papel hover:bg-verde-600",
              )}
            >
              <IconeWhatsApp className="size-4" />
              Fazer meu pedido
            </a>

            <button
              type="button"
              onClick={() => setMenuAberto((v) => !v)}
              aria-expanded={menuAberto}
              aria-controls="menu-celular"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              className="-mr-2 inline-flex size-11 cursor-pointer items-center justify-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={clsx(
                    "absolute left-0 h-px w-full bg-current transition-transform duration-400 ease-suave",
                    menuAberto ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={clsx(
                    "absolute left-0 h-px bg-current transition-[transform,width] duration-400 ease-suave",
                    menuAberto ? "top-1.5 w-full -rotate-45" : "top-3 w-4",
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {/* ——— painel "Modelos" do desktop ——— */}
        <div
          id="painel-cestas"
          onMouseEnter={abrirPainel}
          onMouseLeave={agendarFechamento}
          className={clsx(
            "absolute inset-x-0 top-full hidden origin-top transition-[opacity,transform,visibility] duration-400 ease-suave lg:block",
            painelAberto
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0",
          )}
        >
          <div className="border-t border-verde-900/10 bg-papel text-verde-900 shadow-[0_30px_60px_-30px_rgba(0,30,27,0.45)]">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-[repeat(5,1fr)_0.9fr] gap-4 px-8 py-8">
              {categorias.map((c) => {
                const n = cestasDaCategoria(c.slug).length;
                return (
                  <LinkTransicao
                    key={c.slug}
                    href={hrefCategoria(c)}
                    tabIndex={painelAberto ? undefined : -1}
                    className="group flex flex-col gap-3"
                  >
                    <span className="relative block aspect-4/5 overflow-hidden rounded-xl bg-creme">
                      <Image
                        src={c.foto}
                        alt=""
                        fill
                        sizes="16vw"
                        style={{ objectPosition: c.foco ?? "50% 50%" }}
                        className="object-cover transition-transform duration-[1200ms] ease-suave group-hover:scale-[1.06]"
                      />
                      {c.tema === "natal" ? (
                        <span className="olho absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-noite/80 px-2.5 py-1 text-ouro-claro backdrop-blur-sm">
                          <IconeBrilho className="size-3" />
                          Novo
                        </span>
                      ) : null}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="titulo text-[1.375rem] leading-tight transition-colors duration-300 group-hover:text-verde-600">
                        {c.nome}
                      </span>
                      <span className="olho shrink-0 text-tinta-suave">
                        {n} {n === 1 ? "modelo" : "modelos"}
                      </span>
                    </span>
                  </LinkTransicao>
                );
              })}

              <div className="flex flex-col justify-between rounded-xl bg-verde-900 p-6 text-papel">
                <div className="flex flex-col gap-3">
                  <Simbolo className="h-6 w-6 text-terra-400" />
                  <p className="titulo text-[1.75rem] leading-tight">
                    O catálogo inteiro, numa página só
                  </p>
                </div>
                <LinkTransicao
                  href="/cestas"
                  tabIndex={painelAberto ? undefined : -1}
                  className="olho inline-flex min-h-11 items-center gap-2 border-b border-papel/30 self-start transition-colors hover:border-papel"
                >
                  Todos os modelos
                  <IconeSeta className="size-4" />
                </LinkTransicao>
              </div>
            </div>
          </div>
        </div>

        {/* filete de leitura */}
        <span
          aria-hidden
          className={clsx(
            "barra-progresso absolute inset-x-0 bottom-0 h-px",
            sobreposto ? "bg-transparent" : natal ? "bg-ouro/70" : "bg-terra-500",
          )}
        />
      </header>

      {/* ——— menu do celular, em tela cheia ——— */}
      <div
        id="menu-celular"
        hidden={!menuAberto}
        className="menu-celular fixed inset-0 z-40 overflow-y-auto bg-verde-900 pt-16 text-papel sm:pt-20 lg:hidden"
      >
        <nav aria-label="Navegação principal" className="flex min-h-full flex-col px-5 pt-6 pb-10 sm:px-8">
          <ul className="flex flex-col">
            {[
              { href: "/", rotulo: "Início" },
              { href: "/cestas", rotulo: "Todos os modelos" },
              { href: "/natal", rotulo: "Natal 2026", natal: true },
              { href: "/conheca", rotulo: "Nossa história" },
            ].map((item, i) => (
              <li
                key={item.href}
                style={{ "--i": i } as CSSProperties}
                className="menu-item border-b border-papel/12"
              >
                <LinkTransicao
                  href={item.href}
                  aria-current={ativo(item.href) ? "page" : undefined}
                  className="flex min-h-16 items-center justify-between py-3"
                >
                  <span
                    className={clsx(
                      "titulo flex items-center gap-3 text-[2.25rem] leading-none",
                      item.natal && "text-ouro-claro",
                    )}
                  >
                    {item.rotulo}
                    {item.natal ? <IconeBrilho className="cintilar size-5" /> : null}
                  </span>
                  <span className="olho text-papel/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </LinkTransicao>
              </li>
            ))}
          </ul>

          <p className="olho mt-10 text-papel/55">As linhas</p>
          <ul className="rolagem-lateral -mx-5 mt-4 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 sm:-mx-8 sm:scroll-px-8 sm:px-8">
            {categorias.map((c) => (
              <li key={c.slug} className="w-[38%] shrink-0 snap-start sm:w-[24%]">
                <LinkTransicao href={hrefCategoria(c)} className="flex flex-col gap-2">
                  <span className="relative block aspect-4/5 overflow-hidden rounded-xl bg-verde-800">
                    {menuAberto ? (
                      <Image
                        src={c.foto}
                        alt=""
                        fill
                        sizes="40vw"
                        style={{ objectPosition: c.foco ?? "50% 50%" }}
                        className="object-cover"
                      />
                    ) : null}
                  </span>
                  <span className="text-[0.9375rem]">{c.nomeCurto}</span>
                </LinkTransicao>
              </li>
            ))}
          </ul>

          <a
            href={linkWhatsApp(mensagens.geral)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-papel px-6 text-[0.8125rem] tracking-[0.14em] text-verde-900 uppercase"
          >
            <IconeWhatsApp className="size-4" />
            Fazer meu pedido
          </a>
        </nav>
      </div>

      {/* nas páginas sem imagem sangrada, o conteúdo começa abaixo do cabeçalho */}
      {SOBREPOSTAS.includes(caminho) ? null : (
        <div aria-hidden className="h-16 sm:h-20" />
      )}
    </>
  );
}
