"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ComponentProps, type MouseEvent } from "react";
import { semBarraFinal } from "@/lib/base";

/**
 * Transição entre páginas com a View Transitions API do navegador.
 *
 * O Next navega no cliente, então a transição entre documentos do CSS
 * (`@view-transition`) não dispara. Aqui a navegação é embrulhada em
 * `document.startViewTransition`: o navegador fotografa a página atual,
 * o `router.push` troca o conteúdo e a promessa só resolve quando a rota
 * nova já foi pintada — é o `ObservadorDeRota` que avisa.
 *
 * As animações ficam em `app/globals.css` (`::view-transition-*`). Onde a
 * API não existe, ou para quem pediu menos movimento, a navegação é a
 * normal, sem nenhum efeito.
 */

let concluir: (() => void) | null = null;

/** Montado uma vez no layout: libera a transição quando a rota troca. */
export function ObservadorDeRota() {
  const caminho = usePathname();
  useEffect(() => {
    concluir?.();
    concluir = null;
  }, [caminho]);
  return null;
}

function semMovimento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useNavegar() {
  const router = useRouter();
  const caminho = usePathname();

  return (href: string) => {
    const destino = new URL(href, window.location.href);
    // os hrefs internos vêm sem o prefixo do site (o Next acrescenta)
    const mesmaPagina =
      semBarraFinal(destino.pathname) === semBarraFinal(caminho);

    if (
      mesmaPagina ||
      typeof document.startViewTransition !== "function" ||
      semMovimento()
    ) {
      router.push(href as Route);
      return;
    }

    document.documentElement.dataset.navegando = "";
    const transicao = document.startViewTransition(
      () =>
        new Promise<void>((resolver) => {
          concluir = resolver;
          router.push(href as Route);
          // rede ruim: não segura a tela congelada por mais de 1,5s
          setTimeout(resolver, 1500);
        }),
    );
    transicao.finished.finally(() => {
      delete document.documentElement.dataset.navegando;
    });
  };
}

/** `<Link>` que navega com transição. Aceita as mesmas props. */
export function LinkTransicao({
  href,
  onClick,
  ...resto
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const navegar = useNavegar();

  const aoClicar = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      resto.target === "_blank" ||
      href.startsWith("#")
    ) {
      return;
    }
    e.preventDefault();
    navegar(href);
  };

  return <Link href={href as Route} onClick={aoClicar} {...resto} />;
}
