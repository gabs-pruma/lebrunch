"""
Exporta as fotos escolhidas do ensaio de outubro/2026 para public/ensaio/.

Uso:  python3 scripts/exportar-ensaio.py [pasta-do-ensaio]

O ensaio original (4000x6000, ~1,1 GB) fica fora do repositório. Aqui só
entram as fotos usadas no site, em WebP de 1600px de largura. O número à
esquerda é o prefixo do arquivo original ("151-1D7A1497.jpg").
"""
import os, sys
from concurrent.futures import ProcessPoolExecutor
from PIL import Image, ImageOps

ORIGEM = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser(
    "~/LeBrunch/lebrunch-dev/ensaio-102026/Highlights")
DESTINO = os.path.join(os.path.dirname(__file__), "..", "public", "ensaio")
LARGURA = 1600
# fotos que vão de ponta a ponta em tela grande saem maiores
MAIORES = {"natal-mesa": 2600}

FOTOS = {
    # ——— linha do ano todo ———
    "cafe-p-1": 222, "cafe-p-2": 224, "cafe-p-3": 223,
    "cafe-m-1": 189, "cafe-m-2": 194, "cafe-m-3": 196, "cafe-m-4": 187,
    "cafe-g-1": 151, "cafe-g-2": 155, "cafe-g-3": 161, "cafe-g-4": 148, "cafe-g-5": 147,
    "caixa-verde-1": 229, "caixa-verde-2": 232, "caixa-verde-3": 233, "caixa-verde-4": 225,
    "cesta-flores-1": 241, "cesta-flores-2": 242, "cesta-flores-3": 254, "cesta-flores-4": 264,
    "cesta-bouquet-1": 172, "cesta-bouquet-2": 165, "cesta-bouquet-3": 169, "cesta-bouquet-4": 183,
    "cafe-coado-1": 179, "cafe-coado-2": 177, "cafe-coado-3": 182, "cafe-coado-4": 174,
    "box-caneca-1": 199, "box-caneca-2": 206, "box-caneca-3": 209,
    "cesta-kids-1": 214, "cesta-kids-2": 217, "cesta-kids-3": 219, "cesta-kids-4": 216,
    # ——— Natal ———
    "natal-lata-cookies-1": 3, "natal-lata-cookies-2": 5, "natal-lata-cookies-3": 10, "natal-lata-cookies-4": 8,
    "natal-lata-panetone-1": 12, "natal-lata-panetone-2": 14, "natal-lata-panetone-3": 13,
    "natal-petiscos-1": 21, "natal-petiscos-2": 30, "natal-petiscos-3": 27, "natal-petiscos-4": 33, "natal-petiscos-5": 16,
    "natal-caneca-1": 45, "natal-caneca-2": 39, "natal-caneca-3": 43, "natal-caneca-4": 41,
    "natal-boas-festas-1": 52, "natal-boas-festas-2": 49, "natal-boas-festas-3": 55,
    "natal-espumante-panetone-1": 61, "natal-espumante-panetone-2": 58, "natal-espumante-panetone-3": 62, "natal-espumante-panetone-4": 65,
    "natal-espumante-lata-1": 69, "natal-espumante-lata-2": 70, "natal-espumante-lata-3": 68,
    "natal-saquinho-1": 73, "natal-saquinho-2": 74,
    "natal-vinho-frios-1": 89, "natal-vinho-frios-2": 103, "natal-vinho-frios-3": 98, "natal-vinho-frios-4": 108, "natal-vinho-frios-5": 99,
    # ——— composições e Rebeca ———
    "natal-mesa": 126, "natal-mesa-2": 128, "natal-mesa-3": 129, "natal-mesa-4": 124,
    "natal-rebeca": 118,
    "rebeca-retrato": 138, "rebeca-retrato-2": 141,
    "rebeca-bandeja": 262,
    "mesa-itens": 265, "cafe-g-detalhe": 160, "flores-detalhe": 243,
}

def achar(numero):
    for nome in os.listdir(ORIGEM):
        if nome.split("-")[0] == str(numero):
            return os.path.join(ORIGEM, nome)
    raise FileNotFoundError(numero)

def exportar(item):
    destino, numero = item
    saida = os.path.join(DESTINO, f"{destino}.webp")
    if os.path.exists(saida):
        return
    im = ImageOps.exif_transpose(Image.open(achar(numero))).convert("RGB")
    proporcao = MAIORES.get(destino, LARGURA) / im.width
    im = im.resize((round(im.width * proporcao), round(im.height * proporcao)), Image.LANCZOS)
    im.save(saida, "WEBP", quality=80, method=6)

if __name__ == "__main__":
    os.makedirs(DESTINO, exist_ok=True)
    with ProcessPoolExecutor() as ex:
        list(ex.map(exportar, FOTOS.items()))
    print(len(FOTOS), "fotos em", os.path.abspath(DESTINO))
