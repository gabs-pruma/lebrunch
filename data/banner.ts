/**
 * Roteiro do vídeo do banner da home.
 *
 * Cada item é uma tomada de `scripts/video-banner.py`, na mesma ordem
 * (TOMADAS). O vídeo troca de tomada a cada `passo` segundos (duração da
 * tomada menos a fusão); a legenda "em cena" do banner acompanha o tempo do
 * vídeo e aponta para a cesta que está na tela.
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
    { rotulo: "Coleção de Natal", href: "/natal" },
    { rotulo: "Café G", href: "/cestas/modelo/cafe-g" },
    { rotulo: "Cesta Flores do Campo", href: "/cestas/modelo/cesta-flores-do-campo" },
    { rotulo: "Caixa Tábua & Merlot", href: "/cestas/modelo/natal-tabua-de-frios" },
    { rotulo: "Rebeca Santana, fundadora", href: "/conheca" },
    { rotulo: "Caixa de Petiscos de Natal", href: "/cestas/modelo/natal-caixa-petiscos" },
    { rotulo: "Caixa Café Coado", href: "/cestas/modelo/caixa-cafe-coado" },
    { rotulo: "Caixa Verde Bentô", href: "/cestas/modelo/caixa-verde-bento" },
    { rotulo: "Kit Boas Festas", href: "/cestas/modelo/natal-boas-festas" },
    { rotulo: "Cesta Kids", href: "/cestas/modelo/cesta-kids" },
    { rotulo: "Coleção de Natal", href: "/natal" },
  ],
} as const;
