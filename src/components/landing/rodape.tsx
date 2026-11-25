import { ShieldCheck, Sparkles } from "lucide-react";

/**
 * Rodapé da landing: além dos links, é onde fica a informação que ninguém lê
 * no meio da página e todo mundo procura no fim — os avisos de uso.
 */

const COLUNAS = [
  {
    titulo: "O app",
    itens: [
      { rotulo: "Mascotes guias", href: "#mascotes" },
      { rotulo: "Brincar com eles", href: "#brincar" },
      { rotulo: "Estrelinhas e metas", href: "#estrelinhas" },
      { rotulo: "As 9 atividades", href: "#atividades" },
      { rotulo: "Vozes gravadas", href: "#vozes" },
    ],
  },
  {
    titulo: "Treinar",
    itens: [
      { rotulo: "Explorar os fonemas", href: "#estudar" },
      { rotulo: "Testar o microfone", href: "#testar" },
      { rotulo: "Montar o plano da semana", href: "#plano" },
      { rotulo: "Rotina de quatro semanas", href: "#rotina" },
      { rotulo: "Perguntas frequentes", href: "#perguntas" },
    ],
  },
];

export function Rodape() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(2,0.8fr)] [&>*]:min-w-0">
          {/* marca */}
          <div>
            <p className="font-display text-2xl font-bold">
              Comunicar<span className="text-primary">+</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Treino de fala para crianças, feito para a criança conseguir sozinha: 13 fonemas, 289
              palavras e 920 áudios com voz humana, com mascotes que comemoram cada acerto.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-success" /> Sem anúncio
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Sem instalar nada
              </span>
            </div>
          </div>

          {/* links internos */}
          {COLUNAS.map((coluna) => (
            <nav key={coluna.titulo} aria-label={coluna.titulo}>
              <p className="font-display text-sm font-bold uppercase tracking-wider">
                {coluna.titulo}
              </p>
              <ul className="mt-4 space-y-2.5">
                {coluna.itens.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* aviso clínico, em destaque — é o que mais importa dizer */}
        <div className="mt-12 rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground sm:p-6">
          <span className="font-bold text-foreground">Aviso importante.</span> O Comunicar+ é uma
          ferramenta de apoio e prática entre sessões. Ele não faz avaliação, não dá diagnóstico e
          não substitui o acompanhamento de uma fonoaudióloga ou de um fonoaudiólogo. Se você tem
          dúvida sobre a fala da criança, procure um profissional — quem define o som alvo, o ritmo
          do treino e quando avançar é sempre quem acompanha o caso.
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {ano} Comunicar+ · Todos os direitos reservados.</p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="#topo" className="transition-colors hover:text-foreground">
              Voltar ao topo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
