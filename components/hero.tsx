"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { BotaoLink } from "@/components/ui";
import { banner } from "@/data/banner";
import { comBase } from "@/lib/base";

/**
 * Banner da home: vídeo de ponta a ponta com as cestas do ensaio de
 * outubro/2026, feito no Remotion (`../estudio`, `BannerSite-*`) e finalizado
 * por `scripts/finalizar-banner.py`.
 *
 * - O pôster é a imagem de LCP e sai do servidor; o vídeo só começa a
 *   baixar depois de montar, e entra com fusão quando já está tocando.
 * - Paisagem no desktop, retrato no celular — cada um com seu recorte.
 * - O vídeo vai limpo, sem véu nem texto por cima (a Rebeca não gostou do
 *   degradê escondendo o vídeo); a frase e o botão vêm logo abaixo.
 * - Quem pediu menos movimento fica só com o pôster. O vídeo roda sem
 *   controles nem legenda por cima (pedido do Gabriel, nov/2026).
 */

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

    const consulta = window.matchMedia(PAISAGEM);
    const carregar = () => {
      const fonte = comBase(
        consulta.matches ? banner.paisagem.video : banner.retrato.video,
      );
      if (no.getAttribute("src") === fonte) return;
      delete no.dataset.tocando;
      no.src = fonte;
      no.play().catch(() => {
        /* autoplay bloqueado (modo economia): fica o pôster */
      });
    };
    carregar();
    consulta.addEventListener("change", carregar);
    return () => consulta.removeEventListener("change", carregar);
  }, [semVideo]);

  // pôster com direção de arte: paisagem no desktop, retrato no celular
  const comum = { alt: "", sizes: "100vw" } as const;
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
    <section aria-label="Apresentação">
      {/* ——— o vídeo, limpo: sem véu e sem texto por cima ——— */}
      <div className="hero-imagem relative h-[min(72svh,40rem)] min-h-[24rem] overflow-hidden bg-verde-900 lg:h-[min(76svh,46rem)]">
        <picture>
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

      {/* ——— a frase e o botão, logo abaixo, no papel ——— */}
      <div className="mx-auto flex w-full max-w-site flex-col items-start gap-4 px-5 pt-7 pb-2 sm:px-8 sm:pt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="flex max-w-2xl flex-col gap-3">
          <h1 className="titulo text-[clamp(1.875rem,5.5vw,3.25rem)] leading-[1.02] text-balance">
            Onde os momentos simples se tornam{" "}
            <em className="script text-[1.1em] leading-[0.8] font-normal text-terra-700 not-italic">
              extraordinários
            </em>
          </h1>
          <p className="max-w-lg text-[0.9375rem] leading-relaxed text-tinta-suave">
            Cestas de café da manhã montadas à mão em Santo André e entregues
            no dia e na hora que você escolher.
          </p>
        </div>
        <BotaoLink href="/cestas" variante="solido" className="w-full shrink-0 sm:w-auto">
          Ver os modelos
        </BotaoLink>
      </div>
    </section>
  );
}
