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
  "categoria/cesta-de-cafe-da-manha": "/cestas/classica/",
  "categoria/cesta-de-queijos": "/cestas/modelo/brinde/",
  "categoria/cesta-kids": "/cestas/modelo/aquarela/",
  "categoria/datas-comemorativas": "/cestas/premium/",
  "produto/167879/cesta-de-cafe-da-manha-tamanho-p": "/cestas/modelo/despertar/",
  "produto/167880/cafe-da-manha-m": "/cestas/modelo/encanto/",
  "produto/167881/cafe-da-manha-g": "/cestas/modelo/presenca/",
  "produto/167882/cafe-bento-cake": "/cestas/modelo/comemore/",
  "produto/167883/bandeja-de-queijos-e-frios": "/cestas/modelo/brinde/",
  "landing-page/catalogo-corporativo": "/corporativo/",
  "landing-page/le-brunch-dia-dos-pais-2026": "/cestas/",

  // Linhas e modelos da prévia do site (out/2026), antes dos catálogos de
  // 31/10/2026 — os links já circularam pelo WhatsApp.
  "cestas/pronta-entrega": "/cestas/modelo/fazenda/",
  "cestas/essencial": "/cestas/classica/",
  "cestas/presentes": "/cestas/premium/",
  "cestas/modelo/caixa-cafe-coado": "/cestas/modelo/fazenda/",
  "cestas/modelo/cafe-pp": "/cestas/modelo/cafezinho/",
  "cestas/modelo/cafe-p": "/cestas/modelo/despertar/",
  "cestas/modelo/cafe-m": "/cestas/modelo/encanto/",
  "cestas/modelo/cafe-g": "/cestas/modelo/presenca/",
  "cestas/modelo/caixa-verde-bento": "/cestas/modelo/comemore/",
  "cestas/modelo/cesta-flores-do-campo": "/cestas/modelo/extraordinario/",
  "cestas/modelo/cesta-bouquet": "/cestas/modelo/primavera/",
  "cestas/modelo/box-caneca-inicial": "/cestas/modelo/pausa/",
  "cestas/modelo/cesta-kids": "/cestas/modelo/aquarela/",
  "cestas/modelo/natal-tabua-de-frios": "/cestas/modelo/natal-brinde/",
  "cestas/modelo/natal-caixa-petiscos": "/cestas/modelo/natal-caixa-de-doces/",
  "cestas/modelo/natal-espumante-e-panetone": "/cestas/modelo/natal-acrilico-espumante-panetone/",
  "cestas/modelo/natal-boas-festas": "/cestas/modelo/natal-acrilico-espumante-lata/",
  "cestas/modelo/natal-lata-de-brownies": "/cestas/modelo/natal-lata-brownie/",
  "cestas/modelo/natal-lata-de-panetone": "/cestas/modelo/natal-lata-alta-panetone/",
  "cestas/modelo/natal-kit-caneca": "/cestas/modelo/natal-caixa-carrinho/",
};
