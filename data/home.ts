/**
 * Organização da home (os modelos em si estão em `data/cestas.ts`).
 *
 * `atalhos` são as bolinhas com foto logo abaixo do cabeçalho — o filtro
 * que não parece formulário, como nas lojas que funcionam bem no celular.
 * As miniaturas saem de `scripts/gerar-atalhos.py` (`public/atalhos/`),
 * recortadas das fotos do ensaio no ponto `foco`.
 */
export const atalhos = [
  { chave: "classica", rotulo: "Clássica", href: "/cestas/classica", foto: "presenca-1", foco: "50% 55%" },
  { chave: "premium", rotulo: "Premium", href: "/cestas/premium", foto: "comemore-1", foco: "50% 62%" },
  { chave: "natal", rotulo: "Natal", href: "/natal", foto: "natal-doces-3", foco: "50% 62%", natal: true },
  { chave: "uma-pessoa", rotulo: "Para 1 pessoa", href: "/cestas/?pessoas=1", foto: "fazenda-1", foco: "50% 50%" },
  { chave: "duas-pessoas", rotulo: "Para 2", href: "/cestas/?pessoas=2", foto: "primavera-1", foco: "50% 58%" },
  { chave: "tres-pessoas", rotulo: "Para 3 ou mais", href: "/cestas/?pessoas=3", foto: "presenca-2", foco: "50% 50%" },
] as const;
