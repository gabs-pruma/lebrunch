/**
 * Vídeo do banner da home.
 *
 * Feito no Remotion, no estúdio (`../estudio`, composições
 * `BannerSite-retrato` 720×1120 e `BannerSite-paisagem` 1920×1080; o
 * `desktop` é o mesmo retrato renderizado em 1,5×, 1080×1680, para o quadro
 * em pé ao lado da frase), e
 * finalizado aqui por `scripts/finalizar-banner.py` (compressão e pôster). Só modelos do dia a dia: o Natal tem a faixa própria.
 */
export const banner = {
  paisagem: {
    video: "/video/banner-paisagem.mp4",
    poster: "/video/banner-paisagem-poster.webp",
  },
  desktop: {
    video: "/video/banner-desktop.mp4",
    poster: "/video/banner-desktop-poster.webp",
  },
  retrato: {
    video: "/video/banner-retrato.mp4",
    poster: "/video/banner-retrato-poster.webp",
  },
} as const;
