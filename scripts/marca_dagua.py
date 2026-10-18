"""
Marca d'água da Le Brunch, comum às fotos, ao vídeo do banner e às prévias.

É o último passo de toda foto do site (depois do retoque e de `dar_vida`),
já na resolução final, para dificultar que copiem as fotos dos modelos. O
nome "LeBRUNCH" do logotipo (`public/marca/lebrunch-branco.png`) se repete
em diagonal pela foto inteira, em fileiras desencontradas: o site recorta o
retrato 2:3 em 4:5, quadrado, 3:4 ou 3:2 pelo `foco` da cesta, e uma marca
num canto só sumiria no recorte (ou seria cortada fora com facilidade).

O nome sai em branco quase transparente, sobre um contorno escuro ainda mais
leve — o branco aparece no fundo escuro do Natal, o contorno na bandeja clara.
No escuro o branco salta muito mais que nos meios-tons do produto, então a
opacidade dele cai onde a foto é escura (até `NO_ESCURO` do valor cheio).
A escala acompanha o menor lado da foto, então o desenho é o mesmo em toda
foto: cabem ~3,5 repetições na largura de um card.

Nunca aplique à mão nem em cima de um WebP já exportado (marca duplicada e
compressão dupla): quem chama isto são os exportadores, a partir do original.
"""
import math
import os
from functools import lru_cache

from PIL import Image, ImageChops, ImageFilter

LOGO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "marca", "lebrunch-branco.png")

ANGULO = 30            # graus; o nome sobe para a direita
LARGURA_NOME = 0.17    # largura do nome, em fração do menor lado da foto
PASSO_X = 1.65         # distância entre dois nomes da mesma fileira, em larguras do nome
PASSO_Y = 0.15         # distância entre fileiras, em fração do menor lado da foto
OPACIDADE = 0.20       # do nome em branco
CONTORNO = 0.08        # do contorno escuro em volta do nome
NO_ESCURO = 0.6        # fração de OPACIDADE que o branco mantém em área preta


@lru_cache(maxsize=1)
def _nome():
    """Máscara do nome "LeBRUNCH" — o logotipo sem o símbolo de cima."""
    alfa = Image.open(LOGO).getchannel("A")
    nome = alfa.crop((0, round(alfa.height * 0.66), alfa.width, alfa.height))
    return nome.crop(nome.getbbox())


@lru_cache(maxsize=8)
def _camadas(largura, altura):
    """Contorno (RGBA pronto) e máscara do nome (L, 0–255) para largura x altura."""
    ref = min(largura, altura)
    nome = _nome()
    lw = round(ref * LARGURA_NOME)
    nome = nome.resize((lw, round(nome.height * lw / nome.width)), Image.LANCZOS)
    px, py = round(lw * PASSO_X), round(ref * PASSO_Y)

    # padrão num quadrado que cobre a foto em qualquer ângulo, depois girado
    # e recortado no centro
    lado = math.ceil(math.hypot(largura, altura)) + 2 * px
    padrao = Image.new("L", (lado, lado), 0)
    for j, y in enumerate(range(py // 2, lado, py)):
        recuo = (j % 2) * px // 2
        for x in range(recuo - px, lado, px):
            padrao.paste(nome, (x, y))
    padrao = padrao.rotate(ANGULO, resample=Image.BICUBIC)
    x0, y0 = (lado - largura) // 2, (lado - altura) // 2
    padrao = padrao.crop((x0, y0, x0 + largura, y0 + altura))

    raio = max(1, lw / 160)
    contorno = padrao.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(raio))
    escuro = Image.new("RGBA", (largura, altura), (0, 0, 0, 0))
    escuro.putalpha(contorno.point(lambda v: round(v * CONTORNO)))
    return escuro, padrao


# luminância (0–255) -> opacidade do branco (0–255): NO_ESCURO no preto,
# cheia a partir do meio-tom
_OPACIDADE_POR_LUZ = [
    round(255 * OPACIDADE * (NO_ESCURO + (1 - NO_ESCURO) * min(v / 128, 1)))
    for v in range(256)
]


def aplicar_marca(im):
    """Recebe RGB e devolve RGB com a marca d'água, no mesmo espaço de cor."""
    escuro, padrao = _camadas(*im.size)
    luz = im.convert("L").filter(ImageFilter.BoxBlur(max(2, min(im.size) // 200)))
    alfa = ImageChops.multiply(padrao, luz.point(_OPACIDADE_POR_LUZ))
    branco = Image.new("RGBA", im.size, (255, 255, 255, 0))
    branco.putalpha(alfa)
    base = im.convert("RGBA")
    base.alpha_composite(escuro)
    base.alpha_composite(branco)
    return base.convert("RGB")
