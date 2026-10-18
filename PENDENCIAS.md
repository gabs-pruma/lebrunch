# Pendências antes de publicar

Atualizado em 13/10/2026 — **v2 do site, com o ensaio de outubro/2026**.

## Ajustes de 18/10/2026 (pedido da Rebeca)

- **Banner menor**: o vídeo da home deixou de ocupar a tela inteira
  (~62% da altura no celular, ~70% no desktop), e só mostra modelos do dia
  a dia — o Natal e o retrato da Rebeca saíram do vídeo
- **Destaque nos modelos do dia a dia**: logo abaixo do banner vem a
  vitrine "Os modelos do dia a dia" (as mais pedidas primeiro). O Natal
  virou uma faixa compacta mais abaixo e a seção da Rebeca desceu e encolheu
- **Chamada de Natal no topo**: faixa fixa no alto de todas as páginas
  (menos dentro da coleção) com "Coleção de Natal 2026 · Ver o catálogo"
- **Faixa corrida** de palavras: removida
- **Clique no modelo abre as fotos**: o card mostra só a capa com "N
  fotos"; ao clicar, abre a galeria (setas, arrastar, miniaturas), a ficha
  e o botão **Quero esse modelo**, que leva ao pedido de sempre
- **Marca d'água** em todas as fotos do site, aplicada pelos exportadores
- **Só fotos do `gostei`**: o site passou a usar apenas as 76 fotos que a
  Rebeca separou. 41 fotos que estavam no ar saíram e 35 novas entraram nas
  galerias dos modelos. A Caixa Verde Bentô voltou ao fundo original (o
  retoque que pintava o interior de verde foi desfeito), com as fotos 227
  e 235 incluídas. O vídeo do banner abre nela — a caixa montada à mão,
  com o bentô decorado — e é ela o pôster. A foto larga da Coleção de Natal agora é um
  recorte deitado da 129 (não há foto deitada no `gostei`)

## O que mudou na v2

- **Fotos**: todas as fotos antigas (Instagram e packshots do catálogo em PDF)
  saíram. O site usa só o ensaio de outubro/2026: 79 fotos escolhidas em
  `public/ensaio/`, exportadas por `scripts/exportar-ensaio.py` a partir de
  `../ensaio-102026/Highlights` (o ensaio original, 1,1 GB, fica fora do repo)
- **Vídeo do banner**: `public/video/`, gerado por `scripts/video-banner.py`
  com 11 fotos do ensaio (paisagem para desktop, retrato para celular, laço
  de 27 s). A legenda "em cena" do banner segue `data/banner.ts`
- **Coleção de Natal**: linha nova (`categoria: "natal"`) com 9 presentes e
  página própria em `/natal`, no veludo verde do ensaio, com pisca-pisca,
  dourado e vermelho. Aparece também na home, no `/cestas`, no menu e no
  rodapé
- **Catálogo reorganizado**: Pronta Entrega (Caixa Café Coado), Linha
  Essencial (Café PP, P, M e G — as bandejas de madeira), Linha Premium
  (caixa verde e cestas com flores), Presentes & Mimos (novo) e Coleção de
  Natal
- **Navegação**: transição animada entre páginas, cabeçalho que some ao
  rolar e volta ao subir, painel "Cestas" com fotos, menu de celular em tela
  cheia e "Continue navegando" no fim das linhas

## 1. Catálogo novo — precisa da revisão da Rebeca

`data/cestas.ts` e `data/natal.ts`

**Confirmados** (itens e preços do catálogo oficial): Café P (R$ 243),
Café M (R$ 303) e Café G (R$ 343). Confirme se os **preços seguem os mesmos**.

**Todos os outros 15 modelos estão em rascunho** (`rascunho: true`, selo
laranja só em `npm run dev`). Saíram do ensaio, mas não têm ficha oficial:

- O **nome** é proposta minha
- Os **itens** são o que se vê na foto
- O **preço** está `null`, então o site mostra "sob consulta"

| Linha | Modelos em rascunho |
|---|---|
| Essencial | Café PP |
| Premium | Caixa Verde Bentô · Cesta Flores do Campo · Cesta Bouquet |
| Pronta Entrega | Caixa Café Coado |
| Presentes & Mimos | Box Caneca com Inicial · Cesta Kids |
| Natal | Caixa Tábua & Merlot · Caixa de Petiscos · Kit Brinde & Panetone · Kit Boas Festas · Lata de Brownies · Lata de Panetone · Kit Caneca de Natal |

Dúvidas específicas:

- **Qual bandeja é qual tamanho**: associei pela escala da bandeja na mesa —
  fotos 221–222 = Café P, 186–197 = Café M, 147–164 = Café G. Confirmar
- **Café PP**: as fotos 223–224 (a bandeja menor, com suco em lata) são o
  Café PP, um modelo à parte do Café P. Ele não está no catálogo oficial:
  falta o **preço** (o site mostra "sob consulta") e confirmar os **itens**,
  que tirei da foto (croissant, suco de tangerina 269ml, geleia, Biscoff,
  biscoitos finos, castanhas caramelizadas, uvas, mirtilos e morango)
- **Caixa Verde Bentô**: o disco branco com desenho verde no centro parece um
  bolinho bentô decorado. É a nova embalagem do **Café com Bentô Cake**
  (R$ 330)? Se for, dá para unir os dois
- **Café com Bentô Cake** não foi fotografado, então saiu da vitrine (está
  em `foraDaVitrine`, em `data/cestas.ts`). O Bentô segue como adicional
- **Caixa Tábua & Merlot**: a garrafa é **suco de uva** Casa Madeira (Suco
  Varietal Merlot), não vinho — por isso o nome. Se a versão vendida vier com
  vinho, é trocar o item e o nome
- **Kit Boas Festas**: o antigo "Kit Brinde Dourado" era o mesmo kit (lata
  fechada com laço), então virou um modelo só, com as fotos dos dois.
  Confirmar se a lata é sempre a dourada de frutas secas e castanhas
- **Latas de Natal**: são dois modelos, a **Lata de Brownies** e a **Lata de
  Panetone** (o panetone vai dentro da lata). O **Saco de Noel** deixou de ser
  modelo e virou opção de embalagem das duas, escolhida no modal de pedido
  (a outra é a sacolinha de tecido com pinheiros). Confirmar se a lata vai
  dentro do Saco de Noel e se a embalagem muda o preço
- **Pronta Entrega**: voltou, com a **Caixa Café Coado** (caneca, café e
  foto impressa), como você indicou. No modal ela libera entrega para hoje e
  o card mostra o selo "Sai hoje". Falta o preço
- **Prazo de Natal**: o site diz só "pedidos com 24h de antecedência — quanto
  antes, melhor". Se houver data-limite de encomenda para o Natal, coloque em
  `data/natal.ts` que eu exponho na página

## 2. Fotos que mostram pessoas

- A **Caixa Café Coado** traz uma foto impressa de uma família (exemplo de
  personalização). Confirme que pode aparecer no site — senão, troque as fotos
  `cafe-coado-*` por ângulos sem o retrato (ex.: foto 182 do ensaio)
- A Rebeca aparece em retrato (fotos 118, 138, 141 e 262)

## 3. História da Rebeca

`data/historia.ts`

O texto é um **rascunho** montado só com o que a marca já afirma
publicamente. Não inventei nada da biografia dela. Falta:

- **O parágrafo de origem**: como a Le Brunch começou de verdade, nas
  palavras dela (o primeiro item de `paragrafos` está marcado com `REVISAR`)
- **`citacao`**: uma frase da Rebeca. Enquanto for `null`, o bloco de citação
  não é renderizado
- **`desde`**: ano de fundação. Enquanto for `null`, a linha "Desde ... em
  Santo André" não aparece

## 4. Pagamento e entrega — dois números a confirmar

`data/site.ts`

Depois de olhar o site do Um Caixote, o site ganhou bloco de pagamento e
separou atendimento de entrega. Dois campos precisam de você:

- **`pagamento.parcelado.maximo`** — está `null`. Em quantas parcelas a Le
  Brunch aceita? Enquanto for `null`, o site diz só "parcelado no cartão de
  crédito", sem número. Nada de "sem juros" em lugar nenhum, porque a taxa do
  link de pagamento entra no valor
- **`horarios.entregas`** — coloquei seg–sex 07:00–18:00 e sáb–dom
  07:00–13:00, espelhando as faixas do modal. Confirme o horário final da
  entrega no fim de semana: o atendimento fecha às 13h, mas a entrega pode ir
  além disso?

## 5. Prêmio — dois pontos a confirmar

`data/site.ts` → `site.premio`

Tirei os dados da imagem do story que você mandou: **2ª Temporada 2026**,
categoria **"Loja de Cestas de Café"**, organizado por **@melhoresnoabc**.
O destaque do Instagram exige login, então não consegui abrir para conferir.

- Confirme o nome exato da categoria (usei "Loja de Cestas de Café")
- Se o prêmio tiver um selo em versão clara ou vetorial, me passe: hoje eu
  desenho o selo na linguagem da marca porque o original é preto com dourado
  e brigaria com o papel e o verde. Se você preferir usar o selo oficial do
  jeito que é, também dá — é só dizer

## 6. Link direto de "Avaliar no Google"

`data/site.ts` → `site.google.avaliar`

Hoje os botões levam para a busca `google.com/search?q=le+brunch+cestas`, que
já mostra o botão de avaliar. O ideal é o link direto, que precisa do
`place_id` do perfil:

```
https://search.google.com/local/writereview?placeid=SEU_PLACE_ID
```

O `place_id` sai do painel do Google Business ou do
[Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id).

## 7. Corporativo — fora do ar, não apagado

`app/corporativo/page.tsx`

Saiu do menu, do rodapé, do sitemap e da home, como pedido. **A página não
foi apagada**: continua montada e funcionando em `/corporativo`, agora com
`noindex` para não aparecer em buscas antes do lançamento.

Para reativar: apagar o `robots` do `metadata`, devolver a rota ao
`app/sitemap.ts` e recolocar o item no menu (`components/site-header.tsx`) e
no rodapé.

Segue valendo a dúvida de valores: a página antiga mostrava um valor por
pessoa (≈ R$128/145/162) que não fecha com o total dividido por 15 pessoas
(R$170/193/217). O site mostra só o total com "base 15 pessoas".

## 8. E-mail de atendimento

`data/site.ts` → `email` está `null`, então não aparece em nenhum lugar. O
cartão de visita do manual traz `rebecasantana@lebrunch.com.br` com DDD 21,
o que parece ser dado de template (o domínio real é `lebrunchcestas.com.br`).
Se existir um e-mail de atendimento, é só preencher.

## 9. Domínio e imagem de compartilhamento

- **`site.url`** está `https://www.lebrunchcestas.com.br`. Ajustar se o
  domínio final for outro — ele alimenta o sitemap, o canonical e o Open Graph
- **Open Graph**: ainda não existe imagem de prévia, então compartilhar o link
  no WhatsApp não mostra foto. Vale criar `app/opengraph-image.png` (1200×630)
