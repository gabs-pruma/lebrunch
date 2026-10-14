import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Secao } from "@/components/ui";
import { enderecosAntigos } from "@/data/enderecos-antigos";
import { comBase } from "@/lib/base";

/**
 * Redireciona os endereços do site anterior (ver `data/enderecos-antigos.ts`).
 *
 * Export estático não tem redirecionamento de servidor: a página sai com
 * `<meta http-equiv="refresh" content="0">`, que o Google lê como mudança
 * permanente, e o canônico já aponta para o destino. O link no corpo fica
 * para quem navega sem redirecionamento automático.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(enderecosAntigos).map((caminho) => ({
    antigo: caminho.split("/"),
  }));
}

function destinoDe(antigo: string[]): string | undefined {
  return enderecosAntigos[antigo.join("/")];
}

export async function generateMetadata(
  props: PageProps<"/[...antigo]">,
): Promise<Metadata> {
  const destino = destinoDe((await props.params).antigo);
  return destino
    ? { title: "Página mudou de endereço", alternates: { canonical: destino } }
    : {};
}

export default async function EnderecoAntigo(props: PageProps<"/[...antigo]">) {
  const destino = destinoDe((await props.params).antigo);
  if (!destino) notFound();

  return (
    <Secao>
      <meta httpEquiv="refresh" content={`0; url=${comBase(destino)}`} />
      <h1 className="titulo text-4xl">Esta página mudou de endereço</h1>
      <p className="mt-4 text-tinta-suave">
        <a href={comBase(destino)} className="underline underline-offset-4">
          Continuar para a página nova
        </a>
      </p>
    </Secao>
  );
}
