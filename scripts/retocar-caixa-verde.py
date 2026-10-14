"""
Retoque da Caixa Verde Bentô: a parede interna da caixa, branca no ensaio,
passa a ter o verde da parte externa (pedido da Rebeca, out/2026).

Uso:  python3 scripts/retocar-caixa-verde.py [pasta-do-ensaio]
      (precisa de numpy e opencv-python-headless, só para gerar o retoque)

Gera uma camada RGBA por foto em scripts/retoques/<número>.png, na geometria
da foto exportada (1600px de largura, antes do acerto de cor). Os scripts
exportar-ensaio.py e video-banner.py sobrepõem essa camada sozinhos, então
o retoque vale para o site e para o vídeo do banner.

Como funciona: um polígono desenhado à mão limita a área da parede, e dentro
dele entra só o que tem a cor da parede. Na borda desfocada entre a parede e
a comida, o pixel é uma mistura das duas; ali a mistura é estimada e só a
parte "parede" troca de cor, para não sobrar contorno claro. A textura e a
luz da parede original são mantidas: a tinta é o verde da caixa multiplicado
pela luz que batia em cada ponto.
"""
import io, os, sys
import numpy as np
import cv2
from PIL import Image, ImageOps

ORIGEM = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser(
    "~/LeBrunch/lebrunch-dev/ensaio-102026/Highlights")
DESTINO = os.path.join(os.path.dirname(__file__), "retoques")
LARGURA = 1600

# por foto: amostras da parede (x, y), amostra do verde de fora e o polígono
# que limita a parede — tudo em pixels da foto exportada (1600 de largura)
FOTOS = {
    229: {  # caixa-verde-1
        "parede": [(1200, 645), (1350, 660), (950, 610), (1500, 720), (880, 640), (875, 680), (215, 950)],
        "verde": (640, 1920),
        "poligonos": [
            [(855, 555), (1000, 560), (1200, 572), (1400, 602), (1600, 655), (1600, 845),
             (1530, 832), (1450, 772), (1300, 727), (1150, 707), (1010, 690), (960, 686),
             (900, 690), (855, 706)],
            [(195, 905), (232, 885), (238, 960), (228, 1002), (195, 1005)],
        ],
    },
    232: {  # caixa-verde-2
        "parede": [(1100, 560), (1300, 600), (900, 540), (1550, 760), (39, 881)],
        "verde": (800, 2016),
        "poligonos": [
            [(812, 455), (1082, 475), (1301, 518), (1414, 555), (1500, 607), (1600, 675),
             (1600, 800), (1500, 820), (1490, 760), (1420, 700), (1300, 670), (1200, 640),
             (1030, 628), (900, 600), (836, 598), (812, 600)],
            [(5, 930), (20, 870), (50, 830), (72, 812), (76, 873), (82, 900), (50, 925), (14, 942)],
        ],
    },
    225: {  # caixa-verde-4
        "parede": [(400, 1665), (360, 1680), (450, 1650)],
        "verde": (640, 1984),
        "poligonos": [
            [(318, 1622), (480, 1620), (600, 1612), (740, 1608), (740, 1634),
             (650, 1640), (600, 1652), (540, 1664), (480, 1668), (420, 1695), (400, 1716), (325, 1716)],
        ],
        "forcar": [[(562, 1635), (614, 1634), (604, 1651), (572, 1653)]],
    },
}

def achar(numero):
    for nome in os.listdir(ORIGEM):
        if nome.split("-")[0] == str(numero):
            return os.path.join(ORIGEM, nome)
    raise FileNotFoundError(numero)

def carregar(numero):
    """A foto como o exportar-ensaio.py a deixa antes do acerto de cor."""
    im = ImageOps.exif_transpose(Image.open(achar(numero))).convert("RGB")
    k = LARGURA / im.width
    return np.asarray(im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)).astype(float)

def media_local(valores, peso, sigma):
    num = cv2.GaussianBlur(valores * peso[..., None], (0, 0), sigma)
    den = cv2.GaussianBlur(peso, (0, 0), sigma)[..., None]
    return num / np.maximum(den, 1e-4)

def retocar(numero, cfg):
    rgb = carregar(numero)
    h, w = rgb.shape[:2]
    lab = cv2.cvtColor(cv2.GaussianBlur(rgb.astype(np.uint8), (0, 0), 1.5), cv2.COLOR_RGB2LAB).astype(float)

    def amostra(arr, x, y, r=10):
        return arr[y - r:y + r, x - r:x + r].reshape(-1, arr.shape[-1]).mean(0)

    # parecença com a parede: menor distância a qualquer amostra (Lab, com
    # pouco peso na luminosidade, que varia com a sombra)
    dist = np.min([np.sqrt(((lab[..., 1:] - r[1:]) ** 2).sum(-1) + (0.25 * (lab[..., 0] - r[0])) ** 2)
                   for r in (amostra(lab, x, y) for x, y in cfg["parede"])], axis=0)
    poli = np.zeros((h, w), np.uint8)
    for p in cfg["poligonos"] + cfg.get("forcar", []):
        cv2.fillPoly(poli, [np.array(p, np.int32)], 1)
    # a borda escura da caixa entra junto: repintada pela luz, continua quase
    # igual, e a emenda entre ela e a parede some
    # (só o escuro neutro ou esverdeado: a sombra da comida é marrom)
    escuro = ((lab[..., 0] < cfg.get("escuro", 70)) & (lab[..., 1] < 131) & (lab[..., 2] < 138))
    parecida = (dist < cfg.get("tolerancia", 10)) & (poli > 0)
    borda = escuro & (poli > 0)
    # a emenda desfocada entre a borda e a parede é mistura das duas — e as
    # duas são repintadas pela luz, então ela entra inteira
    perto = lambda m: cv2.dilate(m.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))) > 0
    # (só o que é mais escuro que a parede: a casca clara da laranja, colada
    # na borda, não é emenda)
    emenda = perto(parecida) & perto(borda) & (poli > 0) & (lab[..., 0] < np.median(lab[..., 0][parecida]))
    # retalhos de parede pequenos demais para a regra de cor, marcados à mão
    forcar = np.zeros((h, w), np.uint8)
    for p in cfg.get("forcar", []):
        cv2.fillPoly(forcar, [np.array(p, np.int32)], 1)
    nucleo = (parecida | borda | emenda | (forcar > 0)).astype(np.uint8)
    nucleo = cv2.morphologyEx(nucleo, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    # faixa de transição em volta do núcleo, ainda dentro do polígono
    faixa = cv2.dilate(nucleo, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))) & (poli > 0)

    # repintura pela luz: o mais escuro (a borda) fica como está; o mais
    # claro da parede vira o verde de fora; no meio, proporcional
    verde = amostra(rgb, *cfg["verde"], r=20)
    direcao = verde / verde.mean()
    luz = rgb.mean(-1)
    piso = np.percentile(luz[(nucleo > 0) & escuro], 50) if ((nucleo > 0) & escuro).any() else 0
    topo = np.percentile(luz[(nucleo > 0) & ~escuro], 95)
    inclinacao = (verde.mean() - piso) / (topo - piso)

    def repintar(c):
        l = c.mean(-1)
        nova = np.where(l > piso, piso + (l - piso) * inclinacao, l)
        return nova[..., None] * direcao

    # dentro do núcleo, pixel a pixel (mantém a textura do papel); na faixa,
    # só a fração "parede" da mistura muda de cor
    parede = media_local(rgb, nucleo.astype(float), 5)
    fora = media_local(rgb, 1.0 - cv2.dilate(nucleo, np.ones((5, 5), np.uint8)).astype(float), 5)
    eixo = parede - fora
    # (um pouco a favor da parede: o resto de rosa no contorno aparece mais
    # que um fio de verde sobre a comida)
    alfa = np.clip(1.2 * ((rgb - fora) * eixo).sum(-1) / np.maximum((eixo ** 2).sum(-1), 1e-3), 0, 1)
    # e só onde a cor ainda lembra a parede (a casca branca da laranja, por
    # exemplo, fica de fora)
    alfa *= np.clip(1 - (dist - 10) / 10, 0, 1)
    final = np.where(nucleo[..., None] > 0, repintar(rgb),
                     rgb + alfa[..., None] * (repintar(parede) - parede))
    final = np.clip(final, 0, 255)

    opaco = cv2.GaussianBlur(faixa.astype(float), (0, 0), 1)
    # fora do retoque a camada é vazia (e o PNG fica pequeno)
    camada = np.dstack([final * (opaco[..., None] > 0), opaco * 255]).astype(np.uint8)
    os.makedirs(DESTINO, exist_ok=True)
    Image.fromarray(camada).save(os.path.join(DESTINO, f"{numero}.png"), optimize=True)
    composto = rgb * (1 - opaco[..., None]) + final * opaco[..., None]
    return rgb, composto

if __name__ == "__main__":
    for numero, cfg in FOTOS.items():
        retocar(numero, cfg)
        print(numero, "ok")
