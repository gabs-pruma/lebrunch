/**
 * Ícones em SVG (sem emoji, conforme as regras da skill de UI/UX).
 * Traço de 1.5 e cantos arredondados para combinar com a leveza da marca.
 */
import type { SVGProps } from "react";

const traco: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function IconeWhatsApp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.19-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.22 8.24c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.16c-.25-.12-1.52-.75-1.75-.84-.24-.09-.41-.13-.58.13-.17.25-.67.84-.82 1.01-.15.17-.3.19-.55.06-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.51.11-.11.25-.3.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.39-.77-1.9-.2-.5-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.6c.12.17 1.75 2.67 4.24 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.52-.62 1.73-1.22.21-.6.21-1.12.15-1.22-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

export function IconeInstagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...traco} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconeEstrela({
  preenchida = true,
  ...props
}: SVGProps<SVGSVGElement> & { preenchida?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={preenchida ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
      {...props}
    >
      <path d="m12 3.3 2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.7l6-.9Z" />
    </svg>
  );
}

export function IconeGoogle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.44a5.5 5.5 0 0 1-2.39 3.6v3h3.86c2.26-2.08 3.59-5.15 3.59-8.79Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.86-3c-1.08.72-2.45 1.15-4.09 1.15-3.13 0-5.78-2.11-6.72-4.96H1.3v3.1A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.3a11.99 11.99 0 0 0 0 10.76l3.98-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.3 6.62l3.98 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export function IconeCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...traco} {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="m8.2 12.4 2.5 2.5 5.1-5.6" />
    </svg>
  );
}

export function IconeSeta(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...traco} {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/** Divisa de carrossel, apontando para a direita (gire para a esquerda). */
export function IconeDivisa(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...traco} {...props}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function IconeRelogio(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...traco} {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 7.3V12l3.4 2.1" />
    </svg>
  );
}

export function IconePino(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...traco} {...props}>
      <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10.3" r="2.6" />
    </svg>
  );
}

export function IconePessoas(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...traco} {...props}>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.8 20.2a6.2 6.2 0 0 1 12.4 0" />
      <path d="M16.4 5.2a3.4 3.4 0 0 1 0 6.6" />
      <path d="M17.6 14.6a6.2 6.2 0 0 1 3.6 5.6" />
    </svg>
  );
}

/** Brilho de quatro pontas — a estrela da Coleção de Natal. */
export function IconeBrilho(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2c.4 4.6 2.6 7.4 7.6 8.2l2.4.4-2.4.4c-5 .8-7.2 3.6-7.6 8.2L11.6 22c-.4-4.6-2.6-7.4-7.6-8.2L2 13.4V10.6l2-.4c5-.8 7.2-3.6 7.6-8.2L12 2Z" />
    </svg>
  );
}

export function IconePlay(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M8 5.5v13a.75.75 0 0 0 1.14.64l10.4-6.5a.75.75 0 0 0 0-1.28L9.14 4.86A.75.75 0 0 0 8 5.5Z" />
    </svg>
  );
}

export function IconePausa(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <rect x="6.5" y="5" width="3.5" height="14" rx="1" />
      <rect x="14" y="5" width="3.5" height="14" rx="1" />
    </svg>
  );
}

export function IconePresente(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...traco} {...props}>
      <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
      <path d="M5 12.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7.5M12 8.5V21" />
      <path d="M12 8.5S10.9 4 8.4 4a2.2 2.2 0 0 0 0 4.5H12Zm0 0S13.1 4 15.6 4a2.2 2.2 0 0 1 0 4.5H12Z" />
    </svg>
  );
}

/** Duas molduras sobrepostas: o modelo tem mais de uma foto. */
export function IconeFotos(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...traco} {...props}>
      <rect x="7" y="3" width="14" height="14" rx="2.5" />
      <path d="M17 21H5.5A2.5 2.5 0 0 1 3 18.5V7" />
      <path d="m7 13 3.5-3.5L14 13l2-2 5 5" />
    </svg>
  );
}
