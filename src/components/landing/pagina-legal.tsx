import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Rodape } from "@/components/landing/rodape";

/**
 * Casca das páginas de texto legal: topo simples com volta para a landing,
 * um índice lateral que acompanha a leitura e o mesmo rodapé do site.
 */

export interface SecaoLegal {
  id: string;
  titulo: string;
  corpo: ReactNode;
}

export function PaginaLegal({
  titulo,
  resumo,
  atualizadoEm,
  secoes,
}: {
  titulo: string;
  resumo: string;
  atualizadoEm: string;
  secoes: SecaoLegal[];
}) {
  return (
    <div className="min-h-dvh overflow-x-clip bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="font-display text-xl font-bold">
            Comunicar<span className="text-primary">+</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-card"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-20">
        <p className="text-sm font-bold uppercase tracking-wider text-primary">Documento oficial</p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">{titulo}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {resumo}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Última atualização: <span className="font-semibold">{atualizadoEm}</span>
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.32fr_1fr] [&>*]:min-w-0">
          <nav aria-label="Índice" className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-display text-sm font-bold uppercase tracking-wider">Nesta página</p>
            <ol className="mt-4 space-y-2.5">
              {secoes.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="shrink-0 tabular-nums opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-10">
            {secoes.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-display text-xl font-bold sm:text-2xl">
                  <span className="mr-2 tabular-nums text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.titulo}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground [&_li]:leading-relaxed [&_strong]:text-foreground">
                  {s.corpo}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Rodape />
    </div>
  );
}

/** Lista com marcador, no mesmo ritmo do resto do texto. */
export function Lista({ itens }: { itens: ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {itens.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
