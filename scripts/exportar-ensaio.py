"""
Exporta as fotos escolhidas do ensaio de outubro/2026 para public/ensaio/.

Uso:  python3 scripts/exportar-ensaio.py [pasta-do-ensaio]

O ensaio original (4000x6000, ~1,1 GB) fica fora do repositório. Aqui só
entram as fotos usadas no site, em WebP de 1600px de largura. O número à
esquerda é o prefixo do arquivo original ("151-1D7A1497.jpg").

Toda foto sai com a marca d'água da Le Brunch (scripts/marca_dagua.py),
aplicada por último, já na largura final — depois do retoque e do acerto de
cor. Nunca aplique a marca em cima de um WebP já exportado: reexporte.

Arquivo que já existe é pulado: para reexportar, apague o .webp antes.
"""
import os, sys
from concurrent.futures import ProcessPoolExecutor
from PIL import Image, ImageOps
from cor import aplicar_retoque, dar_vida
from marca_dagua import aplicar_marca

ORIGEM = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser(
    "~/LeBrunch/lebrunch-dev/ensaio-102026/gostei")
DESTINO = os.path.join(os.path.dirname(__file__), "..", "public", "ensaio")
LARGURA = 1600
# fotos que vão de ponta a ponta em tela grande saem maiores
MAIORES = {"natal-mesa": 2600}

# Só fotos da pasta "gostei" do ensaio — as que a Rebeca aprovou para o
# site (out/2026). As chaves de fotos que saíram não foram reaproveitadas:
# foto nova ganha o próximo número livre do modelo, para nenhum texto
# alternativo já escrito passar a descrever outra foto.
FOTOS = {
    # ——— linha do ano todo ———
    "cafe-pp-1": 224, "cafe-pp-2": 223,
    "cafe-p-1": 222,
    "cafe-m-1": 189, "cafe-m-5": 192, "cafe-m-6": 193,
    "cafe-g-1": 151, "cafe-g-2": 155, "cafe-g-3": 161,
    "caixa-verde-1": 229, "caixa-verde-2": 232, "caixa-verde-3": 233,
    "caixa-verde-5": 227, "caixa-verde-6": 235,
    "cesta-flores-1": 241, "cesta-flores-2": 242, "cesta-flores-4": 264,
    "cesta-flores-5": 238, "cesta-flores-6": 244, "cesta-flores-7": 246, "cesta-flores-8": 256,
    "cesta-bouquet-1": 172, "cesta-bouquet-3": 169,
    "cesta-bouquet-5": 166, "cesta-bouquet-6": 168, "cesta-bouquet-7": 184,
    "cafe-coado-2": 177, "cafe-coado-3": 182,
    "cafe-coado-5": 176, "cafe-coado-6": 180, "cafe-coado-7": 181,
    "box-caneca-1": 199, "box-caneca-3": 209, "box-caneca-4": 201, "box-caneca-5": 204,
    "cesta-kids-1": 214, "cesta-kids-2": 217, "cesta-kids-5": 218, "cesta-kids-6": 220,
    # ——— Natal ———
    "natal-lata-cookies-1": 3, "natal-lata-cookies-4": 8,
    "natal-lata-cookies-5": 1, "natal-lata-cookies-6": 7,
    "natal-lata-panetone-1": 12,
    "natal-petiscos-1": 21, "natal-petiscos-2": 30, "natal-petiscos-3": 27,
    "natal-petiscos-6": 20, "natal-petiscos-7": 32,
    "natal-caneca-3": 43, "natal-caneca-5": 46, "natal-caneca-6": 38, "natal-caneca-7": 40,
    "natal-boas-festas-2": 49, "natal-boas-festas-4": 48, "natal-boas-festas-5": 51,
    "natal-espumante-panetone-1": 61, "natal-espumante-panetone-2": 58,
    "natal-espumante-panetone-4": 65, "natal-espumante-panetone-5": 64,
    "natal-espumante-lata-3": 68,
    "natal-saquinho-1": 73,
    "natal-vinho-frios-2": 103, "natal-vinho-frios-3": 98,
    "natal-vinho-frios-6": 77, "natal-vinho-frios-7": 79, "natal-vinho-frios-8": 87,
    "natal-vinho-frios-9": 97, "natal-vinho-frios-10": 110,
    # ——— composições e Rebeca ———
    "natal-mesa": 129, "natal-mesa-3": 129,
    "natal-rebeca": 123,
    "rebeca-retrato": 138,
    "rebeca-cesta-1": 257, "rebeca-cesta-2": 259,
    "mesa-itens": 265,
}

# A foto larga da coleção de Natal sai recortada em paisagem do retrato
# (no "gostei" não há foto deitada): (proporção, centro vertical do recorte).
RECORTES = {"natal-mesa": (3 / 2, 0.6)}

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
    original = Image.open(achar(numero))
    # o ensaio vem em Display P3: sem o perfil embutido o navegador lê as
    # cores como sRGB e a foto sai lavada, sem contraste
    perfil = original.info.get("icc_profile")
    im = ImageOps.exif_transpose(original).convert("RGB")
    proporcao = MAIORES.get(destino, LARGURA) / im.width
    im = im.resize((round(im.width * proporcao), round(im.height * proporcao)), Image.LANCZOS)
    im = aplicar_retoque(numero, im)
    if destino in RECORTES:
        # recorta depois do retoque, que é desenhado na foto inteira
        razao, centro = RECORTES[destino]
        altura = round(im.width / razao)
        topo = min(max(round(im.height * centro - altura / 2), 0), im.height - altura)
        im = im.crop((0, topo, im.width, topo + altura))
    im = aplicar_marca(dar_vida(im))
    im.save(saida, "WEBP", quality=80, method=6, icc_profile=perfil)

if __name__ == "__main__":
    os.makedirs(DESTINO, exist_ok=True)
    with ProcessPoolExecutor() as ex:
        list(ex.map(exportar, FOTOS.items()))
    print(len(FOTOS), "fotos em", os.path.abspath(DESTINO))
