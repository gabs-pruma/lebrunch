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

- **Os modelos seguem os catálogos aprovados** de 31/10/2026
  (`~/LeBrunch/lebrunch-dev/catalogo-portfolio/`): nomes, itens, preços,
  "serve", frase e foto de capa. Mudou o catálogo, muda `data/cestas.ts`.
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
  exportadores. Foto fora do `gostei` não entra — a exceção são as seis que
  a Rebeca aprovou nos catálogos finais de 31/10/2026 (`CATALOGO` no
  exportador, lidas da pasta `Highlights`), mais seis da gaveta de frios
  escolhidas pelo Gabriel em 01/11, e o retrato que a Rebeca mandou
  (`AVULSAS`, de `../fotos-avulsas/`, sem acerto de cor). As fotos antigas
  saíram e não voltam. Foto nova entra pelo `FOTOS` de
  `scripts/exportar-ensaio.py`, nunca copiada à mão — o script mantém o
  perfil Display P3 do ensaio (sem ele a foto sai lavada) e aplica o acerto
  de cor de `scripts/cor.py`, o mesmo do vídeo do banner. Retoque pontual
  vira uma camada em `scripts/retoques/<número>.png`, gerada por script e
  aplicada pelos dois exportadores — nunca edite o WebP final à mão. (O
  interior verde da Caixa Verde Bentô foi desfeito: a Rebeca prefere o fundo
  original das fotos.) Toda foto de cesta tem
  `foco` (`object-position`) — o recorte é 4:5 sobre retrato 2:3. **Sem
  marca d'água** e com cor contida (`scripts/cor.py`: saturação um pouco
  abaixo do ensaio, tons médios menos quentes) — a Rebeca achou a marca
  feia e as cores estouradas/artificiais (nov/2026). A cor dos alimentos
  que vale é a da Presença: Cafezinho, Despertar, Encanto e Comemore
  passam por `igualar_presenca` (`COMO_A_PRESENCA` no exportador). Cesta
  nova com a mesma luz e cor diferente entra nessa lista. Mudou o acerto? Apague
  `public/ensaio/*.webp` e reexporte; depois `gerar-atalhos.py`,
  `gerar-og.py` e o vídeo do banner (README do estúdio).
- **Links internos com `LinkTransicao`** (ou `BotaoLink`), não `next/link`
  direto — é ele que faz a transição entre páginas.
- **Cabeçalho** (`components/site-header.tsx`): faixa verde fina, fixa,
  sempre visível. No celular, marca e menu; o menu abre suspenso com uma
  lista simples, e "Modelos" abre a gaveta dos filtros
  (`components/painel-filtro.tsx`: linha, pessoas e faixa de preço, em
  chips). No desktop os atalhos ficam à mostra e "Modelos" abre o mesmo
  painel. O filtro leva ao `/cestas/?linha=&pessoas=&preco=`, e
  `components/catalogo-filtrado.tsx` mostra o resultado numa grade só.
  Nada de barra de filtro visível na página (a Rebeca achou ruim).
- **Home**, nesta ordem, pensada no celular: atalhos redondos com foto
  (`components/atalhos-redondos.tsx`, dados em `data/home.ts`, miniaturas
  por `scripts/gerar-atalhos.py`); o vídeo do banner, limpo (sem véu nem
  texto por cima), com a frase e o botão logo abaixo (no desktop o hero abre
  diferente: frase, botão e bolinhas à esquerda, vídeo em pé num quadro à
  direita — o celular não muda); os mais pedidos
  (`destaque`); na época das festas, a Coleção de Natal (a foto da mesa
  com a coleção inteira num cartão, o texto embaixo da foto e não por
  cima, e quatro destaques ao lado); por faixa de preço (três blocos que
  levam ao `/cestas/` filtrado); as linhas em blocos de foto com etiqueta
  clara por cima; como funciona (`#como-funciona`): os passos
  com as palavras do catálogo (`comoFunciona`), sem texto antes, ao lado
  de um celular animado que passa pelas etapas
  (`components/como-funciona-animado.tsx`, sem foto: a Rebeca já aparece no
  bloco seguinte); o "Conheça a Le Brunch",
  com o retrato de camisa branca que a Rebeca prefere (pedido dela) e o
  nome dela uma vez só, no título.
- **Pedido de Natal vai direto para o WhatsApp**: nos modelos de Natal o
  site não reserva dia e período (`pedeDisponibilidade`/`prazoDe` em
  `data/cestas.ts`). O botão leva ao WhatsApp com `mensagens.pedidoNatal`,
  e no lugar das 24h aparece "Consulte a disponibilidade".
- **Modelos de Natal sem "serve"**: no Natal o número de pessoas não
  importa — os modelos não mostram "Serve…" e ficam fora do filtro de
  pessoas (ao escolher a linha de Natal, o filtro de pessoas some). A
  primeira foto de todo modelo de Natal é o presente aberto; a fechada e a
  da mão segurando vão para o fim da galeria (Celebrar e Alegria abrem com
  o kit dentro da bag de acrílico, a pedido da Rebeca). Na `/natal`, o destaque
  (`colecaoNatal.estrela`, hoje a Doce Natal, a caixa de doces) vem em poucas linhas —
  foto, nome, frase e preço — e os outros modelos logo depois. Textos de
  Natal falam de sentimento (magia, gratidão, carinho), não descrevem
  embalagem (nada de "latas estampadas", "laço estrelado").
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
  topo vai de ponta a ponta (e só até o tablet). Foto ou trilha que sangra só de um lado deixa a
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
- **Prova social só do Google** (`site.google`): nota e avaliações. Não
  cite o prêmio Melhores no ABC nem cargo da Rebeca (a Le Brunch é MEI —
  ela aparece só pelo nome).
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

- **Google Analytics 4** (`G-S6RBGP6ZP1`, conta "Le Brunch"): carrega só
  no domínio oficial (`components/analytics.tsx`), então prévia e
  `localhost` não contam. Eventos: `generate_lead` (clique para o WhatsApp,
  com o `modelo` tirado da mensagem pronta), `view_item` (modelo aberto) e
  `filtro`. Evento novo passa por `registrar()` de `lib/analytics.ts`.
- **Link do WhatsApp da bio do Instagram é `/whatsapp/`** (com
  `utm_source=instagram&utm_medium=bio&utm_content=whatsapp`), nunca um
  `wa.me` com texto: o app do Instagram entrega o texto codificado duas
  vezes. A página monta `mensagens.instagram`, conta `whatsapp_instagram`
  no GA4 (separado do `generate_lead`) e segue para o WhatsApp.
- **Entrega sem hora marcada** (nov/2026, até a Le Brunch ter carro): o
  modal oferece só Manhã e Tarde, sem hora e sem aviso extra, todos os
  dias. Hora no site vira compromisso com o cliente.

## Direção visual — o que evitar

O site foi tirado de uma cara genérica de template. Estes vícios foram
removidos de propósito; não os traga de volta:

- **Não centralize tudo.** A grade é editorial e assimétrica: colunas de
  larguras diferentes, lado que alterna, numeral de índice — sempre dentro
  da coluna do site.
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
