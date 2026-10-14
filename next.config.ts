import type { NextConfig } from "next";

/*
  Export estático: o site inteiro sai como HTML em `out/`, pronto para o
  GitHub Pages (ou qualquer hospedagem de arquivos).

  `NEXT_PUBLIC_BASE_PATH` é o subcaminho do site publicado — "/<repositório>"
  no GitHub Pages, vazio quando o domínio próprio estiver apontado. O
  workflow `.github/workflows/pages.yml` preenche sozinho.
*/
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // /natal/ → natal/index.html: funciona em qualquer servidor de arquivos
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/carregador-imagem.ts",
  },
};

export default nextConfig;
