"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BotaoLink } from "@/components/ui";
import { LinkTransicao } from "@/components/transicao";
import {
  IconeBrilho,
  IconeEstrela,
  IconePausa,
  IconePlay,
  IconeSeta,
} from "@/components/icones";
import { banner } from "@/data/banner";
import { comBase } from "@/lib/base";
import { site } from "@/data/site";

/**
 * Banner da home: vídeo de ponta a ponta com as cestas do ensaio de
 * outubro/2026 (gerado por `scripts/video-banner.py`).
 *
 * - O pôster é a imagem de LCP e sai do servidor; o vídeo só começa a
 *   baixar depois de montar, e entra com fusão quando já está tocando.
 * - Paisagem no desktop, retrato no celular — cada um com seu recorte.
 * - A legenda "em cena" acompanha o tempo do vídeo e leva até a cesta
 *   que está na tela.
 * - Quem pediu menos movimento fica só com o pôster. Para todos os outros
 *   há um botão de pausar (movimento automático com mais de 5s precisa de
 *   controle — WCAG 2.2.2).
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
  const [cena, setCena] = useState(0);
  const [pausado, setPausado] = useState(false);
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

  const alternar = () => {
    const no = video.current;
    if (!no) return;
    if (no.paused) {
      no.play().catch(() => {});
      setPausado(false);
    } else {
      no.pause();
      setPausado(true);
    }
  };

  const atual = banner.cenas[cena];

  // pôster com direção de arte: paisagem no desktop, retrato no celular
  const comum = { alt: "", sizes: "100vw" } as const;
  const {
    props: { srcSet: posterPaisagem },
  } = getImageProps({ ...comum, src: banner.paisagem.poster, width: 1920, height: 1080 });
  const { props: posterRetrato } = getImageProps({
    ...comum,
    src: banner.retrato.poster,
    width: 720,
    height: 1280,
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <section
      aria-label="Apresentação"
      className="relative isolate flex min-h-[max(36rem,100svh)] flex-col justify-end overflow-hidden bg-verde-900 text-papel"
    >
      {/* ——— imagem e vídeo ——— */}
      <div className="hero-imagem absolute inset-0 -z-10">
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
            onTimeUpdate={(e) => {
              const t = e.currentTarget.currentTime;
              // troca a legenda no meio da fusão entre duas tomadas
              const n = banner.cenas.length;
              const i = ((Math.floor((t - 0.45) / banner.passo) % n) + n) % n;
              if (i !== cena) setCena(i);
            }}
            className="banner-video absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* véus para o texto ler bem sobre qualquer quadro */}
        <div className="absolute inset-0 bg-gradient-to-t from-verde-900 via-verde-900/70 to-verde-900/10 sm:from-verde-900/90 sm:via-verde-900/25 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-verde-900/55 via-transparent to-transparent" />
      </div>

      {/* ——— texto ——— */}
      <div className="mx-auto w-full max-w-7xl px-5 pt-28 pb-10 sm:px-8 sm:pb-14 lg:pb-16">
        <div className="flex max-w-3xl flex-col items-start gap-6">
          <a
            href={site.google.perfil}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-papel/10 px-4 py-2 text-[0.8125rem] backdrop-blur-md ring-1 ring-papel/20 transition-colors hover:bg-papel/20"
          >
            <span className="flex gap-0.5 text-ouro-claro" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                <IconeEstrela key={i} className="size-3" />
              ))}
            </span>
            {site.google.nota.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}{" "}
            · {site.google.avaliacoes} avaliações no Google
          </a>

          <h1 className="titulo text-[clamp(2.9rem,9vw,6.5rem)] leading-[0.92] text-balance [text-shadow:0_2px_30px_rgba(0,0,0,0.25)]">
            onde os momentos simples se tornam{" "}
            <em className="script text-[1.05em] leading-[0.8] font-normal text-terra-400 not-italic">
              extraordinários
            </em>
          </h1>

          <p className="max-w-lg text-[1.0625rem] leading-relaxed text-papel/85">
            Cestas de café da manhã montadas à mão em Santo André e entregues
            no dia e na hora que você escolher — agora com a nova coleção de
            Natal.
          </p>

          <div className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row">
            <BotaoLink href="/cestas" variante="claro">
              Ver as cestas
            </BotaoLink>
            <BotaoLink href="/natal" variante="contornoClaro">
              <IconeBrilho className="cintilar size-4 text-ouro-claro" />
              Coleção de Natal
            </BotaoLink>
          </div>
        </div>

        {/* ——— rodapé do banner: em cena, controle e rolagem ——— */}
        <div className="mt-10 flex items-end justify-between gap-6 border-t border-papel/20 pt-5 sm:mt-14">
          <div className="min-w-0" aria-live="off">
            {semVideo ? (
              <p className="olho text-papel/70">Ensaio Le Brunch · outubro 2026</p>
            ) : (
              <LinkTransicao
                key={cena}
                href={atual.href}
                className="legenda-cena group inline-flex min-h-11 items-center gap-3"
              >
                <span className="olho text-papel/60">Em cena</span>
                <span className="h-px w-6 bg-papel/40" aria-hidden />
                <span className="truncate text-[0.9375rem]">{atual.rotulo}</span>
                <IconeSeta className="size-4 shrink-0 transition-transform duration-400 ease-suave group-hover:translate-x-1" />
              </LinkTransicao>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-5">
            {semVideo ? null : (
              <button
                type="button"
                onClick={alternar}
                aria-label={pausado ? "Tocar o vídeo do banner" : "Pausar o vídeo do banner"}
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full ring-1 ring-papel/35 transition-colors hover:bg-papel hover:text-verde-900"
              >
                {pausado ? <IconePlay className="size-4" /> : <IconePausa className="size-4" />}
              </button>
            )}
            <a
              href="#natal"
              className="hidden items-center gap-3 sm:inline-flex"
              aria-label="Rolar para o conteúdo"
            >
              <span className="olho text-papel/60">Role</span>
              <span className="indicador-rolagem relative block h-10 w-px overflow-hidden bg-papel/25" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
