/** Junta classes ignorando valores vazios. */
export function clsx(
  ...valores: Array<string | false | null | undefined>
): string {
  return valores.filter(Boolean).join(" ");
}
