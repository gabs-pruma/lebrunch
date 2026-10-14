"""
Acerto de cor das fotos do ensaio, comum às fotos e ao vídeo do banner.

A edição do ensaio é clara e "matte" (pretos em ~8, brancos em ~240): bonita
no papel, mas apagada na tela. Aqui os níveis são esticados, entra uma curva
em S suave e um pouco de cor — o mesmo acerto em todas as fotos, para o site
não ficar com cada foto num tom.
"""
from PIL import ImageEnhance

PRETO, BRANCO = 6, 242  # níveis de entrada que viram 0 e 255
CURVA = 0.25            # 0 = linear; 1 = curva em S cheia
COR = 1.10              # saturação

def _tabela():
    t = []
    for v in range(256):
        x = min(max((v - PRETO) / (BRANCO - PRETO), 0), 1)
        s = x * x * (3 - 2 * x)
        t.append(round(255 * ((1 - CURVA) * x + CURVA * s)))
    return t * 3

TABELA = _tabela()

def dar_vida(im):
    """Recebe RGB e devolve RGB, no mesmo espaço de cor."""
    return ImageEnhance.Color(im.point(TABELA)).enhance(COR)
