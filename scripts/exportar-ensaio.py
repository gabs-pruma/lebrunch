"""
Exporta as fotos escolhidas do ensaio de outubro/2026 para public/ensaio/.

Uso:  python3 scripts/exportar-ensaio.py [pasta-do-ensaio]

O ensaio original (4000x6000, ~1,1 GB) fica fora do repositório. Aqui só
entram as fotos usadas no site, em WebP de 1600px de largura. O número à
esquerda é o prefixo do arquivo original ("151-1D7A1497.jpg").

As fotos saem sem marca d'água (a Rebeca pediu para tirar, nov/2026).

Arquivo que já existe é pulado: para reexportar, apague o .webp antes.
"""
import os, sys
from concurrent.futures import ProcessPoolExecutor
from PIL import Image, ImageOps
from cor import aplicar_retoque, dar_vida

ORIGEM = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser(
    "~/LeBrunch/lebrunch-dev/ensaio-102026/gostei")
DESTINO = os.path.join(os.path.dirname(__file__), "..", "public", "ensaio")
LARGURA = 1600
# fotos que vão de ponta a ponta em tela grande saem maiores
MAIORES = {"natal-mesa": 2600}

# Só fotos aprovadas pela Rebeca: a pasta "gostei" do ensaio e as que ela
# aprovou nos catálogos finais de 31/10/2026 (ver CATALOGO, abaixo). Os nomes
# seguem os modelos do catálogo; a capa de cada modelo é a do catálogo.
# Foto nova ganha o próximo número livre do modelo, para nenhum texto
# alternativo já escrito passar a descrever outra foto.
FOTOS = {
    # ——— Linha Clássica ———
    "cafezinho-1": 224, "cafezinho-2": 223,
    "despertar-1": 222,
    "encanto-1": 189, "encanto-2": 192, "encanto-3": 193,
    "presenca-1": 151, "presenca-2": 155, "presenca-3": 161,
    "fazenda-1": 182, "fazenda-2": 177, "fazenda-3": 176, "fazenda-4": 180, "fazenda-5": 181,
    "aquarela-1": 214, "aquarela-2": 220, "aquarela-3": 217, "aquarela-4": 218,
    # ——— Linha Premium ———
    "pausa-1": 201, "pausa-2": 209, "pausa-3": 199, "pausa-4": 204,
    "comemore-1": 231, "comemore-2": 233, "comemore-3": 227, "comemore-4": 229,
    "comemore-5": 232, "comemore-6": 235,
    # a Brinde do ano todo usa as fotos sem a guirlanda; as com guirlanda são da de Natal
    "brinde-1": 79, "brinde-2": 97, "brinde-3": 98,
    "brinde-4": 92, "brinde-5": 89, "brinde-6": 81, "brinde-7": 84,
    "primavera-1": 166, "primavera-2": 184, "primavera-3": 172, "primavera-4": 168, "primavera-5": 169,
    "extraordinario-1": 238, "extraordinario-2": 264, "extraordinario-3": 241,
    "extraordinario-4": 242, "extraordinario-5": 256, "extraordinario-6": 244, "extraordinario-7": 246,
    # ——— Natal ———
    "natal-lata-brownie-1": 8, "natal-lata-brownie-2": 3, "natal-lata-brownie-3": 7, "natal-lata-brownie-4": 1,
    "natal-carrinho-1": 40, "natal-carrinho-2": 45, "natal-carrinho-3": 46,
    "natal-carrinho-4": 43, "natal-carrinho-5": 38,
    "natal-lata-alta-1": 13, "natal-lata-alta-2": 12,
    "natal-acrilico-lata-1": 70, "natal-acrilico-lata-2": 50, "natal-acrilico-lata-3": 49,
    "natal-acrilico-lata-4": 48, "natal-acrilico-lata-5": 51, "natal-acrilico-lata-6": 68,
    "natal-acrilico-panetone-1": 63, "natal-acrilico-panetone-2": 58, "natal-acrilico-panetone-3": 61,
    "natal-acrilico-panetone-4": 64, "natal-acrilico-panetone-5": 65,
    "natal-doces-1": 30, "natal-doces-2": 27, "natal-doces-3": 21, "natal-doces-4": 20, "natal-doces-5": 32,
    "natal-brinde-1": 110, "natal-brinde-2": 77, "natal-brinde-3": 103, "natal-brinde-4": 87,
    "natal-brinde-5": 104, "natal-brinde-6": 106,
    # ——— composições e Rebeca ———
    "natal-mesa": 129, "natal-mesa-3": 129,
    "natal-rebeca": 123,
    "rebeca-cesta-1": 257, "rebeca-cesta-2": 259,
    "mesa-itens": 265,  # também é a versão café da Extraordinário
}

# Fotos que não estão no "gostei", mas que a Rebeca aprovou ao fechar os
# catálogos de 31/10/2026 (capas de cesta fechada e uma da Comemore). Vêm da
# pasta Highlights, ao lado do "gostei".
CATALOGO = {231, 45, 13, 70, 50, 63}
# Mais fotos da gaveta de frios (Brinde e Brinde de Natal), escolhidas pelo
# Gabriel em 01/11/2026: no "gostei" só havia as que já estavam no site.
CATALOGO |= {92, 89, 81, 84, 104, 106}
HIGHLIGHTS = os.path.join(os.path.dirname(ORIGEM.rstrip("/")), "Highlights")

# A foto larga da coleção de Natal sai recortada em paisagem do retrato
# (no "gostei" não há foto deitada): (proporção, centro vertical do recorte).
RECORTES = {"natal-mesa": (3 / 2, 0.6)}

# Fotos de fora do ensaio, mandadas pela Rebeca. Saem como vieram (sem o
# acerto de cor, que é calibrado para o ensaio) e sem aumentar.
AVULSAS = {
    # o retrato que ela prefere para as imagens dela (01/11/2026)
    "rebeca-retrato": "~/LeBrunch/lebrunch-dev/fotos-avulsas/rebeca-retrato-2026-11.jpeg",
}

def exportar_avulsa(item):
    destino, caminho = item
    saida = os.path.join(DESTINO, f"{destino}.webp")
    if os.path.exists(saida):
        return
    original = Image.open(os.path.expanduser(caminho))
    perfil = original.info.get("icc_profile")
    im = ImageOps.exif_transpose(original).convert("RGB")
    if im.width > LARGURA:
        im = im.resize((LARGURA, round(im.height * LARGURA / im.width)), Image.LANCZOS)
    im.save(saida, "WEBP", quality=85, method=6, icc_profile=perfil)

def achar(numero):
    pasta = HIGHLIGHTS if numero in CATALOGO else ORIGEM
    for nome in os.listdir(pasta):
        if nome.split("-")[0] == str(numero):
            return os.path.join(pasta, nome)
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
    im = dar_vida(im)
    im.save(saida, "WEBP", quality=80, method=6, icc_profile=perfil)

if __name__ == "__main__":
    os.makedirs(DESTINO, exist_ok=True)
    with ProcessPoolExecutor() as ex:
        list(ex.map(exportar, FOTOS.items()))
    for item in AVULSAS.items():
        exportar_avulsa(item)
    print(len(FOTOS) + len(AVULSAS), "fotos em", os.path.abspath(DESTINO))
