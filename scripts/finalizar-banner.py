"""
Finaliza o vídeo do banner da home: compressão para a web e pôster.

Uso:  python3 scripts/finalizar-banner.py

O vídeo em si é feito no Remotion, no estúdio da Le Brunch
(`../estudio`, composições `BannerSite-retrato` e `BannerSite-paisagem`, ver
o README de lá). Ele sai de lá "cru" (sem marca d'água, quase sem perda) em
`../estudio/out/banner-site-<formato>-cru.mp4` (quase sem perda). Aqui ele é
recomprimido leve para o celular — com o `faststart`, para começar a tocar
antes de baixar inteiro. Sem marca d'água (a Rebeca pediu para tirar,
nov/2026). O pôster é o
quadro 0 (o vídeo começa com a 1ª foto inteira): é a imagem que aparece
antes do vídeo e para quem não carrega vídeo (economia de bateria/dados).
"""
import os, subprocess, json
from PIL import Image

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ESTUDIO = os.path.join(RAIZ, "..", "estudio", "out")
DESTINO = os.path.join(RAIZ, "public", "video")

# formato → crf. O retrato é o do celular, de onde vem quase todo mundo:
# tem de ficar leve (~1,5 MB) para começar logo no 4G. O `desktop` é o mesmo
# retrato renderizado em 1,5× (`--scale=1.5`, ver o README do estúdio), para
# o quadro em pé ao lado da frase na tela grande.
FORMATOS = {"retrato": 31, "paisagem": 29, "desktop": 29}


def medidas(caminho):
    saida = subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height,r_frame_rate", "-of", "json", caminho])
    s = json.loads(saida)["streams"][0]
    num, den = map(int, s["r_frame_rate"].split("/"))
    return s["width"], s["height"], num / den


def finalizar(formato, crf):
    cru = os.path.join(ESTUDIO, f"banner-site-{formato}-cru.mp4")
    largura, altura, fps = medidas(cru)
    leitor = subprocess.Popen(
        ["ffmpeg", "-loglevel", "error", "-i", cru, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        stdout=subprocess.PIPE)
    saida = os.path.join(DESTINO, f"banner-{formato}.mp4")
    gravador = subprocess.Popen([
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{largura}x{altura}", "-r", str(fps), "-i", "-",
        "-vf", "scale=out_color_matrix=bt709:out_range=tv",
        "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-pix_fmt", "yuv420p",
        "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
        "-profile:v", "high", "-movflags", "+faststart", "-an", saida,
    ], stdin=subprocess.PIPE)
    tamanho = largura * altura * 3
    n = 0
    while True:
        bruto = leitor.stdout.read(tamanho)
        if len(bruto) < tamanho:
            break
        quadro = Image.frombytes("RGB", (largura, altura), bruto)
        if n == 0:
            quadro.save(os.path.join(DESTINO, f"banner-{formato}-poster.webp"), "WEBP", quality=80)
        gravador.stdin.write(quadro.tobytes())
        n += 1
    gravador.stdin.close()
    gravador.wait()
    leitor.wait()
    print(f"banner-{formato}: {largura}x{altura}, {n / fps:.1f} s, {os.path.getsize(saida) // 1024} KB")


if __name__ == "__main__":
    os.makedirs(DESTINO, exist_ok=True)
    for formato, crf in FORMATOS.items():
        finalizar(formato, crf)
