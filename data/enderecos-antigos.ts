/**
 * Endereços do site anterior (a loja virtual em lebrunchcestas.com.br),
 * tirados do sitemap dela em 13/10/2026, e para onde cada um vai agora.
 *
 * O Google ainda tem esses links indexados. O GitHub Pages não faz
 * redirecionamento no servidor, então cada endereço vira uma página que
 * redireciona na hora (`app/[...antigo]/page.tsx`) — o Google trata como
 * mudança permanente e passa a mostrar a página nova.
 *
 * Sem equivalente no site novo (carrinho, login, termos...) vai para a home.
 */
export const enderecosAntigos: Record<string, string> = {
  produtos: "/cestas/",
  promocoes: "/cestas/",
  contato: "/",
  carrinho: "/",
  cadastro: "/",
  login: "/",
  faq: "/",
  "politica-de-privacidade": "/",
  "termos-de-uso": "/",
  "trocas-e-devolucoes": "/",
  "categoria/cesta-de-cafe-da-manha": "/cestas/essencial/",
  "categoria/cesta-de-queijos": "/cestas/",
  "categoria/cesta-kids": "/cestas/modelo/cesta-kids/",
  "categoria/datas-comemorativas": "/cestas/presentes/",
  "produto/167879/cesta-de-cafe-da-manha-tamanho-p": "/cestas/modelo/cafe-p/",
  "produto/167880/cafe-da-manha-m": "/cestas/modelo/cafe-m/",
  "produto/167881/cafe-da-manha-g": "/cestas/modelo/cafe-g/",
  // o Café com Bentô Cake saiu da vitrine (ver `foraDaVitrine`)
  "produto/167882/cafe-bento-cake": "/cestas/essencial/",
  "produto/167883/bandeja-de-queijos-e-frios": "/cestas/",
  "landing-page/catalogo-corporativo": "/corporativo/",
  "landing-page/le-brunch-dia-dos-pais-2026": "/cestas/",
};
