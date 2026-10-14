"""
Gera o vídeo do banner da home a partir das fotos do ensaio de outubro/2026.

Uso:  python3 scripts/video-banner.py [pasta-do-ensaio] [--previa]

Cada foto entra com um movimento lento de câmera (zoom + deslocamento) e
se funde na seguinte. A última se funde na primeira, então o vídeo roda em
laço sem corte. Saem duas versões: paisagem (desktop) e retrato (celular),
cada uma com um pôster em WebP — o pôster é o primeiro quadro, e é ele que
aparece antes do vídeo carregar.

Os quadros são calculados em Python com reamostragem sub-pixel (o zoompan do
ffmpeg arredonda para o pixel inteiro e o movimento treme).
"""
import os, sys, subprocess
from multiprocessing import Pool
from PIL import Image, ImageOps

ORIGEM = next((a for a in sys.argv[1:] if not a.startswith("--")),
              os.path.expanduser("~/LeBrunch/lebrunch-dev/ensaio-102026/Highlights"))
PREVIA = "--previa" in sys.argv
RAIZ = os.path.join(os.path.dirname(__file__), "..", "public", "video")

FPS = 30
DURACAO = 3.4   # tempo de cada foto em tela, contando a fusão
FUSAO = 0.9     # duração da fusão entre duas fotos

# (foto, centro vertical do recorte paisagem, centro vertical do recorte retrato, zoom de/para, deslocamento x)
TOMADAS = [
    (129, 0.62, 0.55, (1.00, 1.10), 0.00),
    (151, 0.52, 0.50, (1.10, 1.00), 0.00),
    (242, 0.42, 0.45, (1.00, 1.08), -0.02),
    (89,  0.48, 0.50, (1.08, 1.00), 0.02),
    (138, 0.33, 0.45, (1.00, 1.07), 0.00),
    (27,  0.55, 0.52, (1.00, 1.10), 0.00),
    (177, 0.50, 0.50, (1.08, 1.00), 0.00),
    (229, 0.55, 0.52, (1.00, 1.08), 0.00),
    (56,  0.64, 0.58, (1.08, 1.00), -0.02),
    (214, 0.60, 0.55, (1.00, 1.08), 0.00),
    (126, 0.50, 0.50, (1.04, 1.12), 0.00),
]

FORMATOS = {
    "banner-paisagem": (1920, 1080, 1),
    "banner-retrato": (720, 1280, 2),
}

def achar(numero):
    for nome in os.listdir(ORIGEM):
        if nome.split("-")[0] == str(numero):
            return os.path.join(ORIGEM, nome)
    raise FileNotFoundError(numero)

_cache = {}
def fonte(numero):
    if numero not in _cache:
        im = Image.open(achar(numero))
        im.draft("RGB", (3600, 3600))
        im = ImageOps.exif_transpose(im).convert("RGB")
        escala = 3600 / max(im.size)
        _cache[numero] = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    return _cache[numero]

def suave(x):
    return x * x * (3 - 2 * x)

def quadro_da_tomada(i, progresso, largura, altura, coluna):
    numero, cy_p, cy_r, (z0, z1), dx = TOMADAS[i]
    im = fonte(numero)
    cy = cy_p if coluna == 1 else cy_r
    alvo = largura / altura
    # maior recorte com a proporção da saída
    if im.width / im.height > alvo:
        rh = im.height; rw = rh * alvo
    else:
        rw = im.width; rh = rw / alvo
    zoom = z0 + (z1 - z0) * suave(progresso)
    rw /= zoom; rh /= zoom
    cx = im.width / 2 + dx * im.width * (progresso - 0.5)
    cyy = cy * im.height
    x = min(max(cx - rw / 2, 0), im.width - rw)
    y = min(max(cyy - rh / 2, 0), im.height - rh)
    a = rw / largura; e = rh / altura
    return im.transform((largura, altura), Image.AFFINE, (a, 0, x, 0, e, y), resample=Image.BICUBIC)

def quadro(args):
    n, largura, altura, coluna = args
    t = n / FPS
    passo = DURACAO - FUSAO
    total = passo * len(TOMADAS)
    ativos = []
    for i in range(len(TOMADAS)):
        inicio = i * passo
        local = (t - inicio) % total
        if local < DURACAO:
            ativos.append((i, local))
    ativos.sort(key=lambda a: -a[1])  # a mais antiga embaixo
    base = None
    for i, local in ativos:
        img = quadro_da_tomada(i, local / DURACAO, largura, altura, coluna)
        if base is None:
            base = img
        else:
            alfa = suave(min(local / FUSAO, 1))
            base = Image.blend(base, img, alfa)
    return base.tobytes()

def gerar(nome, largura, altura, coluna):
    passo = DURACAO - FUSAO
    total_quadros = round(passo * len(TOMADAS) * FPS)
    if PREVIA:
        total_quadros = FPS * 2
    saida = os.path.join(RAIZ, f"{nome}.mp4")
    ff = subprocess.Popen([
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{largura}x{altura}", "-r", str(FPS), "-i", "-",
        "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p",
        "-profile:v", "high", "-movflags", "+faststart", "-an", saida,
    ], stdin=subprocess.PIPE)
    with Pool() as pool:
        for i, bruto in enumerate(pool.imap(quadro, [(n, largura, altura, coluna) for n in range(total_quadros)], chunksize=4)):
            ff.stdin.write(bruto)
            if i == 0:
                Image.frombytes("RGB", (largura, altura), bruto).save(
                    os.path.join(RAIZ, f"{nome}-poster.webp"), "WEBP", quality=78)
    ff.stdin.close(); ff.wait()
    print(nome, total_quadros / FPS, "s", os.path.getsize(saida) // 1024, "KB")

if __name__ == "__main__":
    os.makedirs(RAIZ, exist_ok=True)
    for nome, (l, a, c) in FORMATOS.items():
        gerar(nome, l, a, c)
