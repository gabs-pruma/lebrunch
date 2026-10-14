/**
 * Prefixo de caminho do site publicado.
 *
 * No GitHub Pages o site mora em `usuario.github.io/<repositório>/`, então
 * todo arquivo de `public/` precisa desse prefixo. Links do `next/link` e as
 * imagens do `next/image` já recebem o prefixo sozinhos (ver
 * `next.config.ts` e `lib/carregador-imagem.ts`); o que vai cru — vídeo,
 * máscara CSS, fundo — passa por `comBase()`.
 *
 * Com domínio próprio, `NEXT_PUBLIC_BASE_PATH` fica vazio e nada muda.
 */
export const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Publicado num subcaminho = prévia (o link do GitHub Pages antes de o DNS
 * apontar). A prévia sai com `noindex`, para o Google não indexar uma cópia
 * do site fora do domínio oficial.
 */
export const previa = base !== "";

export function comBase(caminho: string): string {
  return caminho.startsWith("/") ? `${base}${caminho}` : caminho;
}

/** "/natal/" → "/natal" (o export usa barra final; a comparação, não). */
export function semBarraFinal(caminho: string): string {
  return caminho.length > 1 ? caminho.replace(/\/+$/, "") : caminho;
}
