"""
Acerto de cor das fotos do ensaio, comum às fotos e ao vídeo do banner.

A edição do ensaio é clara e "matte" (pretos em ~8, brancos em ~240). Aqui
os níveis são esticados de leve, entra uma curva em S bem suave e a cor fica
um pouco abaixo da original — o mesmo acerto em todas as fotos, para o site
não ficar com cada foto num tom.

Em nov/2026 a Rebeca achou que as cores estouravam e deixavam tudo
artificial (morango, flores e balões saturados, brancos queimados): o
acerto anterior (níveis 6–242, curva 0,25, cor 1,10) virou o de baixo. A
edição do ensaio também é quente (o croissant puxava para o laranja): os
tons médios esfriam um pouco — menos vermelho, mais azul —, sem tocar no
branco e no preto.
"""
import os
from PIL import Image, ImageEnhance

RETOQUES = os.path.join(os.path.dirname(__file__), "retoques")

PRETO, BRANCO = 4, 250  # níveis de entrada que viram 0 e 255
CURVA = 0.12            # 0 = linear; 1 = curva em S cheia
COR = 0.94              # saturação (1 = a do ensaio)
ESFRIAR = 0.035         # nos tons médios: tira do vermelho, põe no azul

def _tabela():
    t = []
    for canal in (-1, 0, 1):  # R, G, B
        for v in range(256):
            x = min(max((v - PRETO) / (BRANCO - PRETO), 0), 1)
            s = x * x * (3 - 2 * x)
            y = (1 - CURVA) * x + CURVA * s
            # o peso 4y(1-y) é zero no branco e no preto e cheio no meio
            y += canal * ESFRIAR * 4 * y * (1 - y)
            t.append(min(255, max(0, round(255 * y))))
    return t

TABELA = _tabela()

def dar_vida(im):
    """Recebe RGB e devolve RGB, no mesmo espaço de cor."""
    return ImageEnhance.Color(im.point(TABELA)).enhance(COR)

def aplicar_retoque(numero, im):
    """Sobrepõe o retoque da foto, se houver (scripts/retoques/<número>.png).

    A camada é desenhada na foto antes do acerto de cor, por isso entra
    antes de `dar_vida`. Hoje nenhuma foto tem retoque: o interior verde da
    Caixa Verde Bentô foi desfeito a pedido da Rebeca (out/2026), que
    preferiu o fundo original.
    """
    caminho = os.path.join(RETOQUES, f"{numero}.png")
    if not os.path.exists(caminho):
        return im
    camada = Image.open(caminho).convert("RGBA")
    if camada.size != im.size:
        camada = camada.resize(im.size, Image.LANCZOS)
    base = im.convert("RGBA")
    base.alpha_composite(camada)
    return base.convert("RGB")
