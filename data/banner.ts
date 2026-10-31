/**
 * Vídeo do banner da home.
 *
 * Feito no Remotion, no estúdio (`../estudio`, composições
 * `BannerSite-retrato` 720×1120 e `BannerSite-paisagem` 1920×1080), e
 * finalizado aqui por `scripts/finalizar-banner.py` (compressão e pôster). Só modelos do dia a dia: o Natal tem a faixa própria.
 */
export const banner = {
  paisagem: {
    video: "/video/banner-paisagem.mp4",
    poster: "/video/banner-paisagem-poster.webp",
  },
  retrato: {
    video: "/video/banner-retrato.mp4",
    poster: "/video/banner-retrato-poster.webp",
  },
} as const;
