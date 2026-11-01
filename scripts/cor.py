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


# ——— cor dos alimentos igual à da Presença ———
#
# Em nov/2026 a Rebeca escolheu a cor dos alimentos das fotos da Presença
# (pão dourado-claro, sem puxar para o laranja). As cestas da mesma mesa de
# luz que saíram diferentes (Cafezinho, Despertar, Encanto e Comemore)
# passam por `igualar_presenca`:
# - nos tons quentes (pães, frutas secas, castanhas), média e espalhamento
#   de L, a e b vão para os da Presença (o pão para de puxar o laranja);
# - o verde claro (uva, hortelã) e o vermelho (morango) só perdem
#   saturação, até a da Presença — eram a maior diferença: o verde das
#   outras cestas estava ~25% mais forte.
# O peso vem do matiz, da saturação e da luz de cada pixel: o branco, o
# preto e o verde-escuro da caixa não mudam. Pede numpy.
#
# Medido nas fotos da Presença já com `dar_vida` (`medir_quentes`), nos
# valores do arquivo (P3), como média, desvio de L, a e b.
PRESENCA = {
    "media": (61.8, 12.8, 32.0),
    "desvio": (13.9, 8.9, 9.2),
    "croma_verde": 38.5,     # verde claro (L > 40)
    "croma_vermelho": 49.0,
}


def _lab(rgb):
    import numpy as np
    np.seterr(all="ignore")  # o matmul do numpy no macOS avisa à toa
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ m.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def _rgb(lab):
    import numpy as np
    fy = (lab[..., 0] + 16) / 116
    f = np.stack([fy + lab[..., 1] / 500, fy, fy - lab[..., 2] / 200], -1)
    xyz = np.where(f > 0.2069, f ** 3, (f - 16 / 116) / 7.787) * np.array([0.95047, 1.0, 1.08883])
    m = np.array([[3.2406, -1.5372, -0.4986], [-0.9689, 1.8758, 0.0415], [0.0557, -0.2040, 1.0570]])
    c = np.clip(xyz @ m.T, 0, 1)
    c = np.where(c > 0.0031308, 1.055 * c ** (1 / 2.4) - 0.055, 12.92 * c)
    return np.clip(np.round(c * 255), 0, 255).astype("uint8")


def _rampa(x, de, ate):
    import numpy as np
    return np.clip((x - de) / (ate - de), 0, 1)


def _peso_quente(lab):
    """0 a 1: quanto o pixel é tom quente de comida (laranja a amarelo)."""
    import numpy as np
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    croma = np.hypot(a, b)
    matiz = np.degrees(np.arctan2(b, a))
    return (_rampa(croma, 10, 22) * _rampa(matiz, 30, 45) * (1 - _rampa(matiz, 90, 105))
            * _rampa(L, 25, 38) * (1 - _rampa(L, 92, 98)))


def _peso_verde(lab):
    import numpy as np
    L, croma = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2])
    matiz = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    return _rampa(croma, 8, 14) * _rampa(matiz, 90, 100) * (1 - _rampa(matiz, 155, 165)) * _rampa(L, 35, 45)


def _peso_vermelho(lab):
    import numpy as np
    L, croma = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2])
    matiz = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    return _rampa(croma, 20, 30) * _rampa(matiz, -10, 0) * (1 - _rampa(matiz, 35, 45)) * _rampa(L, 12, 20)


def _croma_media(lab, peso):
    import numpy as np
    w = peso(lab)
    if w.sum() < 50:
        return None
    return (np.hypot(lab[..., 1], lab[..., 2]) * w).sum() / w.sum()


def medir_quentes(im):
    import numpy as np
    lab = _lab(np.asarray(im.convert("RGB"), dtype=float))
    w = _peso_quente(lab)[..., None]
    media = (lab * w).sum((0, 1)) / w.sum()
    desvio = np.sqrt((((lab - media) ** 2) * w).sum((0, 1)) / w.sum())
    return media, desvio


def igualar_presenca(im):
    """Leva os tons quentes da foto aos da Presença (ver acima)."""
    import numpy as np
    lab = _lab(np.asarray(im, dtype=float))
    media, desvio = medir_quentes(im)
    alvo_m, alvo_d = np.array(PRESENCA["media"]), np.array(PRESENCA["desvio"])
    escala = np.clip(alvo_d / desvio, 0.8, 1.2)
    novo = (lab - media) * escala + alvo_m
    w = _peso_quente(lab)[..., None]
    lab = lab + w * (novo - lab)
    # verde e vermelho: só tira saturação, nunca põe
    for peso, alvo in ((_peso_verde, PRESENCA["croma_verde"]), (_peso_vermelho, PRESENCA["croma_vermelho"])):
        croma = _croma_media(lab, peso)
        if croma is None:
            continue
        fator = np.clip(alvo / croma, 0.7, 1.0)
        w = peso(lab)[..., None]
        lab[..., 1:] *= 1 + w * (fator - 1)
    return Image.fromarray(_rgb(lab))
