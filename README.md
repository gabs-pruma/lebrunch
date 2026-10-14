# Site Le Brunch Cestas

Site institucional e catálogo da **Le Brunch Cestas** — cestas de café da manhã
premium em São Paulo e no Grande ABC.

Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TypeScript.
Build 100% estático: todas as rotas são pré-renderizadas.

## Rodar

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção (estático)
npm start
```

## Rotas

| Rota | Conteúdo |
|---|---|
| `/` | Home |
| `/cestas` | As três linhas + todos os modelos agrupados + adicionais |
| `/cestas/pronta-entrega` · `/essencial` · `/premium` · `/presentes` | Uma página por linha (no painel "Cestas" do menu) |
| `/natal` | Coleção de Natal, com identidade própria (veludo, dourado, pisca-pisca). `/cestas/natal` redireciona para cá |
| `/cestas/modelo/[slug]` | Página de cada cesta |
| `/conheca` | História da marca e da Rebeca |
| `/corporativo` | **Fora do ar** — existe, mas saiu do menu e está com `noindex` (ver `PENDENCIAS.md`) |

Mais `sitemap.xml`, `robots.txt` e página 404.

## Modal de pedido

Clicar em qualquer cesta abre o modal (`components/modal-pedido.tsx`): o
cliente escolhe **data** e **período** e sai para o WhatsApp com a mensagem
já montada — cesta, preço, data e período na primeira mensagem.

- Usa o `<dialog>` nativo, então prender o foco, fechar no `Esc` e o backdrop
  inerte vêm de graça, sem dependência extra
- **Adicionais**: os itens de `adicionais` (croissant, geleia, bentô…) entram
  com contador de quantidade e somam ao vivo. O rodapé do modal mostra
  Cesta / Adicionais / Total, e a mensagem do WhatsApp sai itemizada
- **Observações**: campo livre (até 400 caracteres) para recado do cartão,
  restrição alimentar, ponto de referência da entrega. Entra na mensagem do
  WhatsApp como um item da lista; quebras de linha ficam indentadas sob ele.
  Texto em branco não gera linha nenhuma
- Quatro gavetas (`<details>`): **Data e hora**, aberta por padrão,
  **Adicionais**, **Observações** e **O que vem nessa cesta**, recolhidas — o modal cabe numa
  tela de celular. O cabeçalho de cada gaveta mostra um resumo do que está
  preenchido
- Prazo mínimo: **hoje** na Pronta Entrega (`prontaEntrega: true` na
  linha — vale também quando o card aparece fora da página da linha) e
  **amanhã** nas outras, por causa das 24h de antecedência
- Três faixas de entrega, que começam antes do atendimento abrir:
  **07:00–09:00**, **09:00–12:00** e **12:00–18:00**. Sábado e domingo a
  faixa da tarde não é oferecida, porque o atendimento encerra às 13:00
- Datas são montadas à meia-noite local, nunca via `new Date("AAAA-MM-DD")`,
  que no Brasil voltaria um dia

## Onde mexer no conteúdo

Todo o conteúdo editável está em `data/` — não é preciso tocar em componente
para incluir uma cesta ou mudar um preço.

| Arquivo | O que guarda |
|---|---|
| `data/site.ts` | Contato, WhatsApp, Instagram, links do Google, região de atendimento |
| `data/cestas.ts` | Linhas, modelos de cesta, itens, preços, fotos e adicionais |
| `data/natal.ts` | Organização da página `/natal`: destaque, grupos e fotos de ambiente |
| `data/banner.ts` | Vídeo do banner da home e a legenda "em cena" de cada tomada |
| `data/corporativo.ts` | Pacotes, pilares, diferenciais, condições e etapas |
| `data/historia.ts` | Texto da página "Conheça a Le Brunch" |
| `data/depoimentos.ts` | Depoimentos de clientes |

### Incluir uma cesta nova

Adicione um objeto `Cesta` ao array `cestas` em `data/cestas.ts`:

```ts
{
  slug: "cafe-gg",              // vira a URL /cestas/modelo/cafe-gg
  nome: "Café GG",
  categoria: "premium",         // "pronta-entrega" | "essencial" | "premium" | "presentes" | "natal"
  chamada: "Uma frase curta de vitrine.",
  preco: 420,                   // null = "sob consulta"
  serve: "3 a 4 pessoas",
  imagem: "/ensaio/cafe-gg-1.webp",  // retrato 2:3 do ensaio
  foco: "50% 60%",              // ponto da foto que fica no recorte 4:5
  fotos: ["/ensaio/cafe-gg-2.webp"],
  secoes: [{ titulo: "Salgados", itens: ["Croissants"] }],
}
```

A rota estática, o sitemap, a página da linha e os "relacionados" passam a
incluir a cesta automaticamente. Linha com um modelo só aparece como
destaque grande (`components/cesta-destaque.tsx`), não como card solitário. Uma linha sem nenhum modelo mostra um estado
"em breve" com CTA de WhatsApp.

## Identidade visual

Extraída dos arquivos oficiais em `../Catálogo Le Brunch.pdf.pdf` e
`../Branding - Le Brunch_apresentacao.pptx`. Os tokens estão no `@theme` de
`app/globals.css`.

### Prêmio

A Le Brunch é **vencedora do Prêmio Melhores no ABC 2026** na categoria "Loja
de Cestas de Café". Os dados estão em `site.premio` e o selo é
`components/selo-premio.tsx`, em duas variantes (`Chip` e `Medalha`).

O selo original do prêmio é preto com dourado, o que brigaria com a paleta da
marca — então o prêmio é dito na linguagem da Le Brunch, com o trigo do
catálogo fazendo o papel do louro, e um link para o perfil do prêmio.

Aparece na faixa de autoridade da home, na página `/conheca` (credenciais e
bloco de valores) e no rodapé. Também entra no `metadata` e no JSON-LD
(`award` + `aggregateRating`).

### Fotografia

Tudo vem do **ensaio de outubro/2026** (`../ensaio-102026/Highlights`, 265
fotos 4000×6000, fora do repositório).

- `public/ensaio/` — as 79 fotos usadas no site, em WebP de 1600px.
  Saem de `python3 scripts/exportar-ensaio.py`; o dicionário `FOTOS` do
  script diz qual arquivo do ensaio virou qual nome
- `public/video/` — o vídeo do banner (paisagem e retrato) e os pôsteres.
  Saem de `python3 scripts/video-banner.py`; as tomadas estão em `TOMADAS`
  e a legenda de cada uma em `data/banner.ts`
- `public/marca/`, `public/ilustracoes/`, `public/textura/` — assets extraídos
  do catálogo e do manual de marca

Quase todas as fotos são retrato 2:3. Os cards usam recorte 4:5 e cada cesta
tem um `foco` (`object-position`): nas fotos de Natal o produto está na
metade de baixo, sob a guirlanda, e o foco desce.

| Cor | Hex | Uso |
|---|---|---|
| Verde profundo | `#003E39` | Marca, títulos, fundos de destaque |
| Verde jade | `#247763` | Ações secundárias, botão de WhatsApp |
| Terracota | `#D79156` | Ornamentos (decorativo) |
| Terracota escura | `#945723` | Sobrelinhas e manuscritas em fundo claro |
| Papel | `#F5F4F2` | Fundo, com a textura do catálogo |
| Noite | `#0E231F` | Fundo da Coleção de Natal (a cortina de veludo do ensaio) |
| Ouro | `#C9A45C` / `#E9D39C` | Natal: estrela, laço, botões |
| Vermelho Natal | `#9E2A2B` | Natal: o laço de cetim, em detalhe |
| Creme | `#F8EEE5` | Fundo alternado |

**Tipografia** — equivalentes livres às fontes do manual:
The Seasons → Cormorant Garamond · Codec Pro → Jost ·
Brittany Signature → Parisienne.

**Marca** — `public/marca/` traz o logo vetorizado a partir do catálogo
(`lebrunch.svg`, `wordmark.svg`, `simbolo.svg`). São aplicados com
`mask-image`, então herdam a cor do texto: o mesmo arquivo serve para o verde
no papel e para o claro sobre o verde.

## Direção visual

Grade **editorial e assimétrica**, no espírito das referências de landing de
cafeteria e do refinamento da LP corporativa, com a identidade do catálogo
impresso.

- **Banner** (`components/hero.tsx`): vídeo de ponta a ponta com as cestas
  do ensaio, atrás do cabeçalho transparente. O pôster é a imagem de LCP; o
  vídeo só baixa depois de montar e entra com fusão. Legenda "em cena" que
  leva à cesta que está na tela, botão de pausar (WCAG 2.2.2) e, para quem
  pede menos movimento, só o pôster
- **Coleção de Natal** (`/natal`, `.tema-natal` no CSS): o papel claro vira
  o veludo verde do ensaio, com pisca-pisca em CSS (`components/luzes.tsx`),
  título com brilho dourado e grupos "Para brindar", "Para adoçar" e
  "Lembrancinhas". Na home e no `/cestas` ela aparece como bloco escuro
- **Linhas de cesta** (`components/linha-editorial.tsx`): fileiras full-bleed
  que alternam de lado, com numeral de índice — não três cartões iguais
- **Catálogo** (`/cestas`): abertura em foto, índice com filete e numeral,
  depois as seções por linha
- **História** (`/conheca`): capitular na abertura, citação real do Google em
  corpo grande e galeria em mosaico assimétrico (spans em `data/historia.ts`)
- **Produto**: **um só formato** para todos os cards — retrato 4:5, canto de
  16px, foto do ensaio enquadrada pelo `foco`. No desktop o hover revela um
  segundo ângulo da cesta. As cestas de Natal saem na variante escura

A manuscrita (Parisienne) é **assinatura, não fórmula**: aparece só no hero,
no "começar o dia assim?", no "experiência começa" e nos fechos.

## Catálogo e pedido

- **Grade com carrossel** (`components/grade-cestas.tsx`): no celular as
  cestas viram carrossel com `scroll-snap` e o próximo card espiando na
  borda; a partir de `lg` volta a ser grade de três colunas. É rolagem
  nativa, sem biblioteca, e o contêiner é focável com rótulo porque região
  rolável precisa ser alcançável pelo teclado. Isso encurtou o `/cestas` no
  celular de 10.714px para 6.426px
- **Galeria da cesta** (`components/galeria-cesta.tsx`): foto grande com
  trilha de miniaturas; a trilha só aparece quando o modelo tem mais de uma
  foto (campo `fotos` em `data/cestas.ts`)
- **Continue navegando** (`components/atalhos-linhas.tsx`): as outras linhas
  em foto no fim de cada página de linha — nenhuma página termina em beco
- **Selo**: `categoria.selo` ("Edição limitada" no Natal) aparece no índice
  do `/cestas`, na fileira editorial e nos atalhos

## Navegação

- **Transição entre páginas** (`components/transicao.tsx`): View Transitions
  API do navegador em volta do `router.push`. A página que sai recua, a que
  entra sobe; o cabeçalho fica parado; a foto da linha viaja da home até a
  página da linha (`view-transition-name: linha-<slug>`). Use `LinkTransicao`
  (ou `BotaoLink`) para links internos. Sem suporte ou com menos movimento,
  é navegação comum
- **Cabeçalho** (`components/site-header.tsx`): transparente sobre o banner
  da home e do Natal; some ao rolar para baixo e volta ao subir; painel
  "Cestas" com as quatro linhas em foto; botão "Natal 2026" sempre à vista;
  menu de celular em tela cheia com as linhas em miniatura; filete de leitura

## Pagamento

`site.pagamento` alimenta três lugares: o rodapé, o bloco "Como pagar" em
`/cestas` e a linha embaixo do CTA no modal.

A Le Brunch parcela no cartão por **link de pagamento, e a taxa da operadora
entra no valor** — por isso o site **nunca** diz "sem juros". Enquanto
`parcelado.maximo` for `null`, o texto se adapta e não cita número de
parcelas.

## Efeitos de rolagem

Feitos com animações CSS ligadas ao scroll (`animation-timeline`), sem
biblioteca e sem listener de scroll em JS — rodam no compositor, então não
travam a rolagem no celular. Definidos no fim do `app/globals.css`:

| Efeito | Onde | Como |
|---|---|---|
| Recuo do hero | `.hero-imagem` | `scroll(root)` — a foto recua e esmaece ao sair de cena |
| Deriva do papel de parede | `.fundo-deriva` | `scroll(root)` — a camada decorativa desliza 5% na página inteira |
| Parallax de foto | `components/foto-parallax.tsx` | `view()` — a foto é 14% mais alta que a moldura e desliza dentro dela |
| Zoom lento | prop `zoom` do `FotoParallax` | `view()` — acompanha o parallax nas fotos largas |
| Revelação de bloco | `components/revelar.tsx` | IntersectionObserver (funciona em qualquer navegador) |

Regras que valem para todos: movimento só em **camada decorativa e foto**,
nunca em texto ou controle; no máximo 3 ou 4 fotos com parallax por página;
e `prefers-reduced-motion` desliga tudo, deixando o conteúdo no estado final.
Onde `animation-timeline` não é suportado (Firefox hoje), as fotos ficam
paradas e nada quebra.

**Pano de fundo** — `components/fundo-decorativo.tsx` é uma camada fixa atrás
de todo o conteúdo, com as ilustrações do catálogo distribuídas pela tela. É o
papel de parede do site, junto com a textura de papel do `body`. As seções em
creme usam `bg-creme/85` justamente para deixar essa camada aparecer.

**Ilustrações** (`components/ilustracao.tsx`) — as mesmas do catálogo impresso:

- `<Traco nome="pao" | "rosca" | "croissant" | "trigo" />` são os desenhos a
  traço, extraídos como máscara. Herdam `currentColor`, então funcionam sobre
  o papel e sobre o verde profundo
- `<Aquarela nome="ramo" | "flor-haste" | "flor-margarida" | "flor-petalas" />`
  são as aquarelas botânicas, com cor própria

Ambos são decorativos (`aria-hidden`) e entram como marca d'água de seção.

## Acessibilidade e performance

- Contraste conferido: texto ≥ 4.5:1 e elementos gráficos ≥ 3:1
- Um único `<h1>` por página, sem pular níveis de título
- Alvos de toque ≥ 44px, foco visível, menu mobile com `aria-expanded` e Escape
- `prefers-reduced-motion` respeitado; sem JS, nada fica escondido
- Imagens em WebP com recorte transparente; só a imagem de LCP é `eager`

## Pendências de conteúdo

Estão marcadas no código com `TODO`/`REVISAR` e listadas em `PENDENCIAS.md`.
