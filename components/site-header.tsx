"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { clsx } from "@/lib/utils";
import { Wordmark, Simbolo } from "@/components/marca";
import { LinkTransicao } from "@/components/transicao";
import { IconeBrilho, IconeWhatsApp } from "@/components/icones";
import { PainelFiltro, PainelFiltroDoEndereco } from "@/components/painel-filtro";
import { linkWhatsApp, mensagens, site } from "@/data/site";
import { comBase, semBarraFinal } from "@/lib/base";

/**
 * Cabeçalho — faixa verde fina, sempre no alto (não se esconde ao rolar).
 * O site é pensado primeiro para o celular, de onde vem quase todo mundo.
 *
 * - No celular: a marca e o botão de menu. O menu abre suspenso, logo abaixo
 *   da faixa: uma lista simples, e "Modelos" abre uma gaveta com os filtros
 *   (`painel-filtro.tsx`).
 * - No desktop os atalhos ficam à mostra, e "Modelos" abre o mesmo painel
 *   de filtros, suspenso.
 * - Na Coleção de Natal a faixa fica no veludo (`bg-noite`).
 * - O filete no pé mostra quanto da página já foi lido (`.barra-progresso`).
 */

const ATALHOS = [
  { href: "/cestas", rotulo: "Modelos" },
  { href: "/natal", rotulo: "Natal 2026", natal: true },
  { href: "/#como-funciona", rotulo: "Como funciona", ancora: true },
  { href: "/conheca", rotulo: "Nossa história" },
];

export function SiteHeader() {
  const caminho = semBarraFinal(usePathname());
  const [aberto, setAberto] = useState(false);
  /** Gaveta dos filtros, dentro de "Modelos" (no celular). */
  const [gaveta, setGaveta] = useState(false);
  /** Painel de filtros do "Modelos" no desktop. */
  const [painel, setPainel] = useState(false);
  const natal = caminho === "/natal" || caminho.startsWith("/cestas/modelo/natal-");
  const fechar = () => {
    setAberto(false);
    setPainel(false);
  };

  // Fecha o menu ao trocar de página.
  const [caminhoAnterior, setCaminhoAnterior] = useState(caminho);
  if (caminho !== caminhoAnterior) {
    setCaminhoAnterior(caminho);
    setAberto(false);
    setPainel(false);
  }

  // Com o menu aberto: trava o scroll do corpo e fecha no Esc.
  const suspenso = aberto || painel;
  useEffect(() => {
    if (!suspenso) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        setPainel(false);
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [suspenso]);

  const ativo = (href: string) => caminho === href || caminho.startsWith(`${href}/`);

  return (
    <>
      <header
        style={{ viewTransitionName: "cabecalho" }}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 text-papel transition-colors duration-500",
          natal ? "bg-noite" : "bg-verde-900",
        )}
      >
        <div className="mx-auto flex h-14 w-full max-w-site items-center gap-6 px-5 sm:px-8 lg:h-16">
          <LinkTransicao
            href="/"
            aria-label="Le Brunch — página inicial"
            className="flex min-h-11 shrink-0 items-center gap-2"
          >
            <Simbolo className="h-6 w-6 shrink-0 lg:h-7 lg:w-7" />
            <Wordmark className="h-3 w-[5.75rem] lg:h-3.5 lg:w-[6.5rem]" />
          </LinkTransicao>

          {/* atalhos à mostra, só no desktop */}
          <nav aria-label="Navegação principal" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-6">
              {ATALHOS.map((item) => (
                <li key={item.href}>
                  {item.href === "/cestas" ? (
                    <button
                      type="button"
                      onClick={() => setPainel((v) => !v)}
                      aria-expanded={painel}
                      aria-controls="painel-modelos"
                      className="olho link-cabecalho link-cabecalho-texto cursor-pointer gap-2"
                      aria-current={ativo("/cestas") ? "page" : undefined}
                    >
                      {item.rotulo}
                      <Seta aberta={painel} />
                    </button>
                  ) : item.natal ? (
                    <LinkTransicao
                      href={item.href}
                      aria-current={ativo(item.href) ? "page" : undefined}
                      className="olho link-cabecalho-texto inline-flex min-h-10 items-center gap-2 rounded-full bg-ouro/15 px-3.5 whitespace-nowrap text-ouro-claro ring-1 ring-ouro/40 transition-colors duration-300 hover:bg-ouro/25"
                    >
                      <IconeBrilho className="cintilar size-3.5" />
                      {item.rotulo}
                    </LinkTransicao>
                  ) : item.ancora ? (
                    <a href={comBase(item.href)} className="olho link-cabecalho link-cabecalho-texto">
                      {item.rotulo}
                    </a>
                  ) : (
                    <LinkTransicao
                      href={item.href}
                      aria-current={ativo(item.href) ? "page" : undefined}
                      className="olho link-cabecalho link-cabecalho-texto"
                    >
                      {item.rotulo}
                    </LinkTransicao>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-suspenso"
            className="-mr-2 ml-auto inline-flex size-11 cursor-pointer items-center justify-center lg:hidden"
          >
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={clsx(
                  "absolute left-0 h-px w-full bg-current transition-transform duration-400 ease-suave",
                  aberto ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={clsx(
                  "absolute right-0 h-px bg-current transition-[transform,width] duration-400 ease-suave",
                  aberto ? "top-1.5 w-full -rotate-45" : "top-3 w-4",
                )}
              />
            </span>
          </button>
        </div>

        {/* filete de leitura */}
        <span
          aria-hidden
          className={clsx(
            "barra-progresso absolute inset-x-0 bottom-0 h-px",
            natal ? "bg-ouro/70" : "bg-terra-500",
          )}
        />
      </header>

      {/* ——— menu suspenso, logo abaixo da faixa ——— */}
      {suspenso ? (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={fechar}
          className="fixed inset-0 z-[45] cursor-default bg-black/35"
        />
      ) : null}

      {/* celular: lista simples; "Modelos" abre a gaveta dos filtros */}
      {aberto ? (
        <div
          id="menu-suspenso"
          className="menu-suspenso fixed inset-x-0 top-14 z-[45] max-h-[calc(100svh-3.5rem)] overflow-y-auto bg-papel text-verde-900 shadow-[0_30px_60px_-30px_rgba(0,30,27,0.45)] lg:hidden"
        >
          <nav aria-label="Navegação principal" className="px-5 pt-2 pb-8 sm:px-8">
            <ul className="flex flex-col">
              <li className="border-b borda-fina">
                <LinkTransicao href="/" aria-current={caminho === "/" ? "page" : undefined} className="item-menu">
                  Início
                </LinkTransicao>
              </li>
              <li className="border-b borda-fina">
                <button
                  type="button"
                  onClick={() => setGaveta((v) => !v)}
                  aria-expanded={gaveta}
                  aria-controls="gaveta-modelos"
                  className="item-menu w-full cursor-pointer justify-between"
                >
                  Modelos
                  <Seta aberta={gaveta} />
                </button>
                {gaveta ? (
                  <div id="gaveta-modelos" className="flex flex-col gap-4 pb-5">
                    <Suspense fallback={<PainelFiltro aoIr={fechar} />}>
                      <PainelFiltroDoEndereco aoIr={fechar} />
                    </Suspense>
                  </div>
                ) : null}
              </li>
              {ATALHOS.filter((a) => a.href !== "/cestas").map((item) => (
                <li key={item.href} className="border-b borda-fina">
                  {item.ancora ? (
                    <a href={comBase(item.href)} onClick={fechar} className="item-menu">
                      {item.rotulo}
                    </a>
                  ) : (
                    <LinkTransicao
                      href={item.href}
                      aria-current={ativo(item.href) ? "page" : undefined}
                      className={clsx("item-menu gap-2", item.natal && "text-natal")}
                    >
                      {item.rotulo}
                      {item.natal ? <IconeBrilho className="size-3.5" /> : null}
                    </LinkTransicao>
                  )}
                </li>
              ))}
              <li className="border-b borda-fina">
                <a href={site.google.avaliar} target="_blank" rel="noopener noreferrer" className="item-menu">
                  Avalie no Google
                </a>
              </li>
            </ul>

            <a
              href={linkWhatsApp(mensagens.geral)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[0.6875rem] tracking-[0.14em] uppercase ring-1 ring-verde-900/20"
            >
              <IconeWhatsApp className="size-4" />
              Fazer meu pedido
            </a>
          </nav>
        </div>
      ) : null}

      {/* desktop: o painel de filtros do "Modelos" */}
      {painel ? (
        <div
          id="painel-modelos"
          className="menu-suspenso fixed top-16 z-[45] hidden w-[26rem] rounded-b-2xl bg-papel p-6 text-verde-900 shadow-[0_30px_60px_-30px_rgba(0,30,27,0.45)] lg:block"
          style={{ right: "max(2rem, calc((100vw - var(--container-site)) / 2 + 2rem))" }}
        >
          <Suspense fallback={<PainelFiltro aoIr={fechar} />}>
            <PainelFiltroDoEndereco aoIr={fechar} />
          </Suspense>
        </div>
      ) : null}

      {/* o conteúdo começa abaixo da faixa */}
      <div aria-hidden className="h-14 lg:h-16" />
    </>
  );
}

/** Seta pequena que gira quando a gaveta abre. */
function Seta({ aberta }: { aberta: boolean }) {
  return (
    <span
      aria-hidden
      className={clsx(
        "block size-1.5 border-r border-b border-current transition-transform duration-300",
        aberta ? "translate-y-0.5 -rotate-135" : "-translate-y-0.5 rotate-45",
      )}
    />
  );
}
