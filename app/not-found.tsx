import { Secao, BotaoLink, Ornamento, Olho } from "@/components/ui";

export default function NaoEncontrado() {
  return (
    <Secao className="text-center">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-7 py-10">
        <Ornamento />
        <Olho>Erro 404</Olho>
        <h1 className="titulo text-[clamp(2rem,8vw,3.5rem)] text-balance">
          Essa página saiu para{" "}
          <span className="script text-[1.1em] leading-none text-terra-700">
            entrega
          </span>
        </h1>
        <p className="text-[0.9375rem] leading-relaxed text-tinta-suave">
          O endereço que você tentou abrir não existe mais — ou nunca existiu.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <BotaoLink href="/" variante="solido">
            Voltar ao início
          </BotaoLink>
          <BotaoLink href="/cestas" variante="contorno">
            Ver os modelos
          </BotaoLink>
        </div>
      </div>
    </Secao>
  );
}
