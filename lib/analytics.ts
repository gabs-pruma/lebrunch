/**
 * Google Analytics 4 do site (conta "Le Brunch", criada em 02/11/2026).
 *
 * O script só carrega no domínio oficial (`components/analytics.tsx`): a
 * prévia, o `localhost` e as capturas de teste não entram nos números.
 * As visualizações de página, inclusive na navegação sem recarregar, vêm da
 * "métrica otimizada" do GA4; aqui ficam só os eventos da Le Brunch.
 */
export const GA_ID = "G-S6RBGP6ZP1";
export const DOMINIO_OFICIAL = "www.lebrunchcestas.com.br";

type Gtag = (...args: unknown[]) => void;

/** Manda um evento ao GA4, se ele estiver carregado (nada acontece fora do ar). */
export function registrar(evento: string, parametros: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", evento, parametros);
}

/** O modelo citado na mensagem pronta do WhatsApp, quando houver. */
export function modeloDaMensagem(href: string): string | undefined {
  let texto = "";
  try {
    texto = new URL(href).searchParams.get("text") ?? "";
  } catch {
    return undefined;
  }
  const achado =
    texto.match(/• Cesta: (.+?)(?: \(|\n|$)/) ??
    texto.match(/quero o presente (.+?), da Coleção de Natal/) ??
    texto.match(/pela cesta (.+?)\./);
  return achado?.[1];
}
