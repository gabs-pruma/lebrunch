"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clsx } from "@/lib/utils";

/**
 * Revela o conteúdo ao entrar na viewport.
 *
 * O HTML sai do servidor sem nenhum atributo — ou seja, visível. Se o JS
 * não rodar, nada fica escondido. Depois de montar, marcamos via
 * `data-revelar` (o CSS em globals.css cuida da transição) apenas o que
 * ainda está abaixo da dobra, então não existe piscada em quem já está
 * vendo o bloco. Quem pede `prefers-reduced-motion` nunca perde o
 * conteúdo de vista.
 *
 * A animação mexe direto no DOM em vez de usar estado do React: é um
 * efeito visual sobre um sistema externo, não informação da interface.
 */
export function Revelar({
  children,
  atraso = 0,
  className,
}: {
  children: ReactNode;
  /** Atraso em ms, para escalonar itens de uma grade. */
  atraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const no = ref.current;
    if (!no) return;

    const semMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (semMovimento || typeof IntersectionObserver === "undefined") return;

    // Já está à vista? Deixa como está, sem animar.
    if (no.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    no.dataset.revelar = "oculto";
    if (atraso) no.style.transitionDelay = `${atraso}ms`;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          no.dataset.revelar = "visivel";
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observador.observe(no);
    return () => observador.disconnect();
  }, [atraso]);

  return (
    <div ref={ref} className={clsx(className)}>
      {children}
    </div>
  );
}
