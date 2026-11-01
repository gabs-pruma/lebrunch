"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { BotaoLink, Olho } from "@/components/ui";
import { AtalhosRedondos } from "@/components/atalhos-redondos";
import { banner } from "@/data/banner";
import { comBase } from "@/lib/base";

/**
 * Banner da home: vídeo de ponta a ponta com as cestas do ensaio de
 * outubro/2026, feito no Remotion (`../estudio`, `BannerSite-*`) e finalizado
 * por `scripts/finalizar-banner.py`.
 *
 * - O pôster é a imagem de LCP e sai do servidor; o vídeo só começa a
 *   baixar depois de montar, e entra com fusão quando já está tocando.
 * - No celular (e no tablet): vídeo de ponta a ponta, retrato ou paisagem
 *   conforme a tela, com a frase e o botão logo abaixo.
 * - No desktop abre diferente: a frase, o botão e as bolinhas de atalho à
 *   esquerda, e o vídeo em pé num quadro à direita (`desktop`, o retrato
 *   renderizado em 1,5×, para não perder nitidez na tela grande).
 * - O vídeo vai limpo, sem véu nem texto por cima (a Rebeca não gostou do
 *   degradê escondendo o vídeo).
 * - Quem pediu menos movimento fica só com o pôster. O vídeo roda sem
 *   controles nem legenda por cima (pedido do Gabriel, nov/2026).
 */

const DESKTOP = "(min-width: 64rem)";
const PAISAGEM = "(min-aspect-ratio: 1/1)";
const MENOS_MOVIMENTO = "(prefers-reduced-motion: reduce)";

function assinarMovimento(avisar: () => void) {
  const consulta = window.matchMedia(MENOS_MOVIMENTO);
  consulta.addEventListener("change", avisar);
  return () => consulta.removeEventListener("change", avisar);
}
const pediuMenosMovimento = () => window.matchMedia(MENOS_MOVIMENTO).matches;
const noServidor = () => false;

export function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const semVideo = useSyncExternalStore(
    assinarMovimento,
    pediuMenosMovimento,
    noServidor,
  );

  useEffect(() => {
    const no = video.current;
    if (!no || semVideo) return;

    const desktop = window.matchMedia(DESKTOP);
    const paisagem = window.matchMedia(PAISAGEM);
    const carregar = () => {
      const fonte = comBase(
        desktop.matches
          ? banner.desktop.video
          : paisagem.matches
            ? banner.paisagem.video
            : banner.retrato.video,
      );
      if (no.getAttribute("src") === fonte) return;
      delete no.dataset.tocando;
      no.src = fonte;
      no.play().catch(() => {
        /* autoplay bloqueado (modo economia): fica o pôster */
      });
    };
    carregar();
    desktop.addEventListener("change", carregar);
    paisagem.addEventListener("change", carregar);
    return () => {
      desktop.removeEventListener("change", carregar);
      paisagem.removeEventListener("change", carregar);
    };
  }, [semVideo]);

  // pôster com direção de arte: o quadro em pé no desktop, paisagem no
  // tablet deitado, retrato no celular
  const comum = { alt: "", sizes: "100vw" } as const;
  const {
    props: { srcSet: posterDesktop },
  } = getImageProps({ ...comum, src: banner.desktop.poster, width: 1080, height: 1680, sizes: "30rem" });
  const {
    props: { srcSet: posterPaisagem },
  } = getImageProps({ ...comum, src: banner.paisagem.poster, width: 1920, height: 1080 });
  const { props: posterRetrato } = getImageProps({
    ...comum,
    src: banner.retrato.poster,
    width: 720,
    height: 1120,
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <section
      aria-label="Apresentação"
      className="lg:mx-auto lg:grid lg:w-full lg:max-w-site lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-center lg:gap-16 lg:px-8 lg:py-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:gap-24"
    >
      {/* ——— o vídeo, limpo: sem véu e sem texto por cima ——— */}
      <div className="hero-imagem relative h-[min(72svh,40rem)] min-h-[24rem] overflow-hidden bg-verde-900 lg:order-2 lg:h-[min(calc(100svh-10rem),44rem)] lg:min-h-[32rem] lg:rounded-[1.75rem]">
        <picture>
          <source media={DESKTOP} srcSet={posterDesktop} sizes="30rem" />
          <source media={PAISAGEM} srcSet={posterPaisagem} sizes="100vw" />
          <img {...posterRetrato} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        {semVideo ? null : (
          <video
            ref={video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            onPlaying={(e) => {
              e.currentTarget.dataset.tocando = "";
            }}
            className="banner-video absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      {/* ——— a frase e o botão: abaixo no celular, ao lado no desktop ——— */}
      <div className="mx-auto flex w-full max-w-site flex-col items-start gap-4 px-5 pt-7 pb-2 sm:px-8 sm:pt-10 lg:order-1 lg:mx-0 lg:max-w-none lg:gap-9 lg:p-0">
        <div className="flex max-w-2xl flex-col gap-3 lg:gap-6">
          <Olho className="hidden lg:block">Cestas de café da manhã · São Paulo e Grande ABC</Olho>
          <h1 className="titulo text-[clamp(1.875rem,5.5vw,3.25rem)] leading-[1.02] text-balance lg:text-[clamp(3rem,4.6vw,4.5rem)]">
            Onde os momentos simples se tornam{" "}
            <em className="script text-[1.1em] leading-[0.8] font-normal text-terra-700 not-italic">
              extraordinários
            </em>
          </h1>
          <p className="max-w-lg text-[0.9375rem] leading-relaxed text-tinta-suave lg:text-[1.0625rem]">
            Cestas de café da manhã montadas à mão em Santo André e entregues
            no dia e na hora que você escolher.
          </p>
        </div>
        <BotaoLink href="/cestas" variante="solido" className="w-full shrink-0 sm:w-auto">
          Ver os modelos
        </BotaoLink>
        <AtalhosRedondos variante="hero" />
      </div>
    </section>
  );
}
