<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Site Le Brunch Cestas

Site institucional e catálogo da Le Brunch Cestas (cestas de café da manhã
premium, São Paulo e Grande ABC). Público majoritariamente mobile — sempre
projete e verifique no celular primeiro.

## Regras do projeto

- **Conteúdo vive em `data/`**, não em componentes. Cesta nova, preço,
  pacote corporativo e depoimento se resolvem editando `data/*.ts`.
- **Português do Brasil** em nomes de arquivo, props, variáveis e comentários,
  seguindo o que já existe (`Secao`, `TituloSecao`, `Olho`, `Revelar`).
- **Nunca invente conteúdo da marca.** Preços, itens de cesta e textos vieram
  do catálogo oficial e da página corporativa. O que não estiver confirmado
  entra como `null` e a UI omite, ou fica marcado com `REVISAR`/`TODO`. Veja
  `PENDENCIAS.md`.
- **Depoimentos**: só entram no ar avaliações reais do Google, com
  `verificado: true`. Não escreva depoimento fictício.
- **Cores**: use os tokens do `@theme` em `app/globals.css`. Terracota clara
  (`terra-500`/`terra-400`) só em elemento decorativo ou sobre o verde
  profundo; para texto em fundo claro, `terra-700`. Contraste mínimo 4.5:1
  para texto e 3:1 para gráfico.
- **Sem dark mode**: a identidade é papel claro (`color-scheme: light`).
- **Marca**: aplique via os SVGs de `public/marca` com `mask-image`
  (componentes em `components/marca.tsx`), para herdar `currentColor`.
- **Ícones em SVG** (`components/icones.tsx`) — nunca emoji.
- **Imagens**: WebP, e só a imagem de LCP da página recebe
  `loading="eager"` + `fetchPriority="high"`. Não use `priority` (deprecado no
  Next 16). Não reaproveite o mesmo arquivo com `eager` e `lazy` na mesma
  página.
- **Fotos só do ensaio de outubro/2026** (`public/ensaio/`), e só as que a
  Rebeca aprovou: a pasta `gostei` do ensaio
  (`~/LeBrunch/lebrunch-dev/ensaio-102026/gostei`), que é a origem dos
  exportadores. Foto fora do `gostei` não entra. As fotos antigas
  saíram e não voltam. Foto nova entra pelo `FOTOS` de
  `scripts/exportar-ensaio.py`, nunca copiada à mão — o script mantém o
  perfil Display P3 do ensaio (sem ele a foto sai lavada) e aplica o acerto
  de cor de `scripts/cor.py`, o mesmo do vídeo do banner. Retoque pontual
  vira uma camada em `scripts/retoques/<número>.png`, gerada por script e
  aplicada pelos dois exportadores — nunca edite o WebP final à mão. (O
  interior verde da Caixa Verde Bentô foi desfeito: a Rebeca prefere o fundo
  original das fotos.) Toda foto de cesta tem
  `foco` (`object-position`) — o recorte é 4:5 sobre retrato 2:3. Toda foto
  (e o vídeo do banner) sai com a marca d'água da Le Brunch, aplicada pelo
  exportador por último (`scripts/marca_dagua.py`) — não marque à mão nem
  em cima de WebP já exportado; reexporte do original.
- **Links internos com `LinkTransicao`** (ou `BotaoLink`), não `next/link`
  direto — é ele que faz a transição entre páginas.
- **Destaque da home são os modelos do dia a dia**, não o Natal nem a
  Rebeca: banner curto (não ocupa a tela toda), vídeo só com modelos do ano
  todo e a vitrine "Os modelos do dia a dia" logo abaixo. O Natal é chamado
  pela faixa do alto do cabeçalho e por uma faixa compacta mais abaixo.
- **Coleção de Natal**: identidade própria só dentro de `.tema-natal`
  (tokens `noite`, `ouro`, `ouro-claro`, `natal`). Fora dela, a paleta de
  sempre. Link para a linha sempre por `hrefCategoria()` — a de Natal vai
  para `/natal`.
- **Animação**: `components/revelar.tsx` mexe no DOM via `data-revelar`, de
  propósito — o HTML do servidor sai visível, então nada fica escondido sem JS.
  Respeite `prefers-reduced-motion`.
- **Pedido passa pelo modal**: clicar numa cesta abre
  `components/modal-pedido.tsx`, não navega. Pelo card ele abre **nas fotos**
  (`comFotos`: galeria + ficha + "Quero esse modelo") e só depois vai ao
  pedido — a pessoa clica para ver as fotos, então o card não tem setas.
  Onde a galeria já está na página (página do modelo), o `BotaoPedido` abre
  direto no pedido. Toda ação de compra sai dali com
  a mensagem de WhatsApp montada por `mensagens.pedido()`. Use o `<dialog>`
  nativo; não instale biblioteca de modal.
- **Datas**: monte sempre à meia-noite local (`new Date(a, m - 1, d)`).
  `new Date("2026-09-12")` é UTC e volta um dia no fuso do Brasil.
- **Nada de setState dentro de effect** (o ESLint barra). Para estado externo
  como scroll, use `useSyncExternalStore` — veja `site-header.tsx` e
  `whatsapp-fab.tsx`.
- **Modelos em rascunho**: cesta que não veio do catálogo oficial leva
  `rascunho: true`, o que mostra um selo só em desenvolvimento. Não remova o
  selo sem a Rebeca confirmar o modelo.
- **Ilustrações do catálogo**: a camada global
  (`components/fundo-decorativo.tsx`) já cobre as seções claras. Só adicione
  `<Traco>`/`<Aquarela>` dentro de seções **opacas** (verde), onde a camada
  fixa não aparece. Nada de decoração repetida em seção clara.
- **Uma margem só**: todo conteúdo começa na mesma coluna. Bloco com o
  respiro lateral por fora (`px-5 sm:px-8` no pai) usa `max-w-6xl`, como a
  `Secao`; bloco com o `px` por dentro usa `max-w-site` (token do `@theme`,
  72rem + 2rem de cada lado). Não use `max-w-7xl` nem `max-w-6xl` com `px`
  por dentro — cada um cria uma margem diferente, e o desalinhamento aparece
  ao rolar. Fotos e galerias também ficam dentro da coluna — só o banner do
  topo vai de ponta a ponta. Foto ou trilha que sangra só de um lado deixa a
  seção torta (foi pedido para tirar das linhas e da galeria da home).
- **Ritmo vertical**: toda seção usa o mesmo respiro,
  `py-12 sm:py-14 lg:py-16` (é o da `Secao`): ~96px entre conteúdos no
  celular e ~128px no desktop. Seção nova copia esse trio — não invente
  `py-24`/`py-28`, e não empilhe padding extra (margem de bloco interno
  somada ao respiro da seção é o que abria os vãos soltos).
- **Movimento de rolagem**: use as classes de `app/globals.css`
  (`.hero-imagem`, `.fundo-deriva`, `.quadro-parallax`) ou o
  `FotoParallax`. Não instale GSAP nem Framer Motion, e não anime texto ou
  controle — só camada decorativa e foto. Tudo dentro de
  `@supports (animation-timeline: ...)` e
  `@media (prefers-reduced-motion: no-preference)`.
- **Prêmio**: sempre por `site.premio` e `components/selo-premio.tsx`. Não
  suba o selo preto e dourado do prêmio para o site.
- **SEO**: toda página declara os metadados por `metadadosPagina()`
  (`lib/metadados.ts`), com `caminho` de barra final e a chave da imagem de
  compartilhamento. Cesta ou linha nova pede `python3 scripts/gerar-og.py`
  (gera `public/og/`). O `llms.txt` e o sitemap saem de `data/` sozinhos.
  Endereço que deixar de existir entra em `data/enderecos-antigos.ts`.
- **Na navegação, o catálogo se chama "Modelos"**, não "Cestas" (menu,
  rodapé, breadcrumb, "Ver os modelos"). "Cesta de café da manhã" continua
  valendo para descrever o produto, e o endereço segue `/cestas`.
- **Grade de cesta usa `GradeCestas`**, nunca `<ul className="grid">` na mão:
  é ela que faz o carrossel no celular e a grade no desktop, com o rótulo
  acessível da região rolável.
- **Nunca anuncie "sem juros".** O parcelamento é por link de pagamento e a
  taxa da operadora entra no valor. Todo texto de pagamento sai de
  `site.pagamento`, e o número de parcelas só aparece quando
  `parcelado.maximo` estiver preenchido.
- **Grades com número ímpar de itens**: evite deixar fileira órfã. Os
  depoimentos usam `columns-*` em vez de `grid` por isso.

## Direção visual — o que evitar

O site foi tirado de uma cara genérica de template. Estes vícios foram
removidos de propósito; não os traga de volta:

- **Não centralize tudo.** A grade é editorial e assimétrica: colunas de
  larguras diferentes, lado que alterna, numeral de índice — sempre dentro
  da coluna do site. Veja `components/linha-editorial.tsx`.
- **Não repita "olho + título + palavra manuscrita".** A manuscrita é
  assinatura, não fórmula: só no hero, no "começar o dia assim?", no
  "experiência começa" (verbatim do catálogo) e nas assinaturas de fecho.
- **Não transforme tudo em cartão.** Fileira editorial, lista com filete e
  numeral, mosaico assimétrico — nessa ordem de preferência. Cartão com
  borda só na grade de produto e nos depoimentos.
- **Não empilhe três blocos iguais** só porque são três itens. Alterne lado,
  varie escala, use numeral grande de índice.
- **A fotografia carrega o design**, não a ilustração. As fotos reais do
  ensaio (`public/ensaio/`) são o substrato; as aquarelas e traços do
  catálogo ficaram como papel de parede discreto (3 marcas, não 8).
- **Dispositivos editoriais disponíveis**: capitular (`.capitular`), citação
  em corpo grande, legenda em caixa alta, numeral de índice, mosaico com
  `span` vindo dos dados (ver `data/historia.ts`).
- **Um formato só na grade de produto.** Card retrato 4:5, canto de 16px,
  foto do ensaio de enquadramento cheio, ajustada pelo `foco` da cesta.
- **Uma imagem grande por composição.** Nada de foto satélite pequena
  flutuando ao lado de uma grande: ou a segunda imagem tem escala e
  ancoragem próprias, ou não entra.
- **Cada página tem `<h1>` próprio.** Não repita a manchete do hero em outra
  página.

## Antes de entregar

```bash
npx tsc --noEmit && npx eslint . && npm run build
```

O build tem de continuar 100% estático (todas as rotas `○` ou `●`) e o console
do navegador tem de ficar sem avisos.
