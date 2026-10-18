/**
 * Roteiro do vídeo do banner da home.
 *
 * Cada item é uma tomada de `scripts/video-banner.py`, na mesma ordem
 * (TOMADAS). O vídeo troca de tomada a cada `passo` segundos (duração da
 * tomada menos a fusão); a legenda "em cena" do banner acompanha o tempo do
 * vídeo e aponta para a cesta que está na tela.
 *
 * Só modelos do dia a dia: o Natal tem a faixa própria no alto do site.
 *
 * Se o roteiro do script mudar, mude aqui também.
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
  /** DURACAO − FUSAO do script, em segundos. */
  passo: 2.5,
  cenas: [
    { rotulo: "Caixa Verde Bentô", href: "/cestas/modelo/caixa-verde-bento" },
    { rotulo: "Café G", href: "/cestas/modelo/cafe-g" },
    { rotulo: "Cesta Flores do Campo", href: "/cestas/modelo/cesta-flores-do-campo" },
    { rotulo: "Café M", href: "/cestas/modelo/cafe-m" },
    { rotulo: "Caixa Café Coado", href: "/cestas/modelo/caixa-cafe-coado" },
    { rotulo: "Cesta Bouquet", href: "/cestas/modelo/cesta-bouquet" },
    { rotulo: "Café P", href: "/cestas/modelo/cafe-p" },
    { rotulo: "Cesta Kids", href: "/cestas/modelo/cesta-kids" },
    { rotulo: "Box Caneca com Inicial", href: "/cestas/modelo/box-caneca-inicial" },
    { rotulo: "Café G", href: "/cestas/modelo/cafe-g" },
  ],
} as const;
