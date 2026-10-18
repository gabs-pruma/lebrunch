"""
Imagens de compartilhamento (Open Graph) — a prévia que aparece quando um
link do site é colado no WhatsApp, Instagram, Facebook ou LinkedIn.

Formato 1200×630: a foto do ensaio à esquerda, recortada pelo `foco` da
cesta (quase quadrada, para o produto caber inteiro — o retrato 2:3 não cabe
num recorte horizontal), e o painel da marca à direita. Os modelos de Natal
usam o verde-noite da coleção.

Lê as cestas e as linhas direto de `data/cestas.ts` (pelo Node), então
cesta nova ganha imagem rodando o script de novo:

    python3 scripts/gerar-og.py

Sai em `public/og/<chave>.jpg`, em sRGB: as fotos do ensaio são Display P3,
e as redes sociais costumam descartar o perfil de cor — sem converter, a
prévia sairia lavada. As chaves são as de `lib/metadados.ts`.

A foto vem de `public/ensaio/`, que já sai com a marca d'água
(scripts/marca_dagua.py): aqui não se aplica outra, senão fica duplicada.
Mudou a marca? Reexporte o ensaio antes de rodar este script.
"""

import io
import json
import os
import shutil
import subprocess

from PIL import Image, ImageCms

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
DESTINO = os.path.join(RAIZ, "public", "og")
LOGO = os.path.join(RAIZ, "public", "marca", "lebrunch-branco.png")

LARGURA, ALTURA = 1200, 630
LARGURA_FOTO = 680
VERDE = (0, 62, 57)  # --color-verde-900
NOITE = (14, 35, 31)  # --color-noite, da Coleção de Natal

# Páginas sem cesta própria: (foto do ensaio, foco, tema de Natal)
FIXAS = {
    "inicio": ("rebeca-cesta-1", "50% 45%", False),
    "modelos": ("cafe-g-1", "50% 50%", False),
    "natal": ("natal-mesa-3", "45% 62%", True),
    "conheca": ("rebeca-cesta-2", "50% 35%", False),
    "corporativo": ("mesa-itens", "50% 50%", False),
}

LER_DADOS = """
const c = await import("./data/cestas.ts");
console.log(JSON.stringify({
  cestas: c.cestas.map((x) => ({ slug: x.slug, imagem: x.imagem, foco: x.foco, categoria: x.categoria })),
  linhas: c.linhasDoAno.map((x) => ({ slug: x.slug, foto: x.foto, foco: x.foco })),
}));
"""

SRGB = ImageCms.createProfile("sRGB")


def foto(caminho, foco, largura, altura):
    im = Image.open(os.path.join(RAIZ, "public", caminho.lstrip("/")))
    perfil = im.info.get("icc_profile")
    im = im.convert("RGB")
    if perfil:
        im = ImageCms.profileToProfile(
            im, ImageCms.ImageCmsProfile(io.BytesIO(perfil)), SRGB, outputMode="RGB"
        )
    escala = max(largura / im.width, altura / im.height)
    im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    fx, fy = (float(v.rstrip("%")) / 100 for v in (foco or "50% 50%").split())
    x = round((im.width - largura) * fx)
    y = round((im.height - altura) * fy)
    return im.crop((x, y, x + largura, y + altura))


def compor(caminho, foco, natal, logo):
    tela = Image.new("RGB", (LARGURA, ALTURA), NOITE if natal else VERDE)
    tela.paste(foto(caminho, foco, LARGURA_FOTO, ALTURA), (0, 0))
    painel = LARGURA - LARGURA_FOTO
    tela.paste(logo, (LARGURA_FOTO + (painel - logo.width) // 2, (ALTURA - logo.height) // 2), logo)
    return tela


def main():
    dados = json.loads(
        subprocess.check_output(
            ["node", "--no-warnings", "--input-type=module", "-e", LER_DADOS], cwd=RAIZ
        )
    )
    logo = Image.open(LOGO)
    largura_logo = 330
    logo = logo.resize(
        (largura_logo, round(logo.height * largura_logo / logo.width)), Image.LANCZOS
    )

    imagens = {
        chave: (f"/ensaio/{nome}.webp", foco, natal)
        for chave, (nome, foco, natal) in FIXAS.items()
    }
    for linha in dados["linhas"]:
        imagens[f"linha-{linha['slug']}"] = (linha["foto"], linha.get("foco"), False)
    for cesta in dados["cestas"]:
        if cesta.get("imagem"):
            imagens[f"modelo-{cesta['slug']}"] = (
                cesta["imagem"], cesta.get("foco"), cesta["categoria"] == "natal"
            )

    # recomeça do zero: cesta que saiu do site não deixa imagem órfã
    shutil.rmtree(DESTINO, ignore_errors=True)
    os.makedirs(DESTINO)
    for chave, (caminho, foco, natal) in imagens.items():
        compor(caminho, foco, natal, logo).save(
            os.path.join(DESTINO, f"{chave}.jpg"),
            "JPEG", quality=82, optimize=True, progressive=True,
        )
    print(len(imagens), "imagens em", os.path.abspath(DESTINO))


if __name__ == "__main__":
    main()
