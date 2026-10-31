"""
Gera as miniaturas redondas dos atalhos da home (public/atalhos/).

Uso:  python3 scripts/gerar-atalhos.py

Lê `atalhos` de data/home.ts e recorta um quadrado de cada foto do ensaio
(public/ensaio/, que já sai com o acerto de cor) no ponto
`foco`, em 240px — a bolinha tem 64px, e 240 cobre telas 3x com folga.
Mudou a foto ou o foco? Rode de novo.
"""
import json, os, subprocess
from PIL import Image

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
DESTINO = os.path.join(RAIZ, "public", "atalhos")
LADO = 240
LER = 'const h = await import("./data/home.ts"); console.log(JSON.stringify(h.atalhos));'

def main():
    atalhos = json.loads(subprocess.check_output(
        ["node", "--no-warnings", "--input-type=module", "-e", LER], cwd=RAIZ))
    os.makedirs(DESTINO, exist_ok=True)
    for a in atalhos:
        im = Image.open(os.path.join(RAIZ, "public", "ensaio", f"{a['foto']}.webp"))
        perfil = im.info.get("icc_profile")
        im = im.convert("RGB")
        fx, fy = (float(v.rstrip("%")) / 100 for v in a["foco"].split())
        lado = min(im.size)
        x = round((im.width - lado) * fx)
        y = round((im.height - lado) * fy)
        im = im.crop((x, y, x + lado, y + lado)).resize((LADO, LADO), Image.LANCZOS)
        im.save(os.path.join(DESTINO, f"{a['chave']}.webp"), "WEBP", quality=80, icc_profile=perfil)
    print(len(atalhos), "miniaturas em", os.path.abspath(DESTINO))

if __name__ == "__main__":
    main()
