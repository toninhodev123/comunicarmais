import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { CalendarDays, Clock, Printer, Star } from "lucide-react";
import { phonemes } from "@/lib/data/phonemes";
import { Reveal } from "@/components/landing/animacoes";

/**
 * Montador de plano: quem acompanha em casa escolhe o som, os dias e o tempo,
 * e sai daqui com a semana escrita — qual atividade em cada dia e quanto tempo
 * em cada uma. É o passo que costuma faltar: a família sabe o que fazer, mas
 * não em que ordem.
 */

const DIAS = [
  { chave: "seg", curto: "Seg", nome: "segunda" },
  { chave: "ter", curto: "Ter", nome: "terça" },
  { chave: "qua", curto: "Qua", nome: "quarta" },
  { chave: "qui", curto: "Qui", nome: "quinta" },
  { chave: "sex", curto: "Sex", nome: "sexta" },
  { chave: "sab", curto: "Sáb", nome: "sábado" },
  { chave: "dom", curto: "Dom", nome: "domingo" },
];

const TEMPOS = [5, 10, 15, 20];

/**
 * O ciclo que se repete ao longo da semana. A ordem importa: som isolado antes
 * de palavra, palavra antes de frase, e memória no meio para descansar a boca.
 */
const CICLO = [
  {
    titulo: "Banco de Palavras",
    foco: "som no início",
    porque: "Começa pelo lugar mais fácil da sílaba, onde a boca ainda está descansada.",
    peso: 0.7,
  },
  {
    titulo: "Memória Auditiva",
    foco: "sequência de 3 palavras",
    porque: "Troca a boca pelo ouvido: a criança descansa a articulação sem parar de treinar.",
    peso: 0.65,
  },
  {
    titulo: "Banco de Palavras",
    foco: "som no meio e no fim",
    porque: "As posições onde a troca costuma voltar. Só depois que o início estiver firme.",
    peso: 0.7,
  },
  {
    titulo: "Vocabulário",
    foco: "categoria com o som do dia",
    porque: "Dá contexto: a palavra deixa de ser exercício e vira o nome de uma coisa.",
    peso: 0.6,
  },
  {
    titulo: "Trava-Línguas",
    foco: "um curto, com cronômetro",
    porque: "Velocidade sob controle — o som precisa aguentar a pressa sem se desfazer.",
    peso: 0.7,
  },
  {
    titulo: "Habilidades Sociais",
    foco: "três frases do dia a dia",
    porque: "Fecha a semana levando o som treinado para a conversa de verdade.",
    peso: 0.75,
  },
];

/** Minutos da atividade do dia: nunca menos de 3, nunca sem sobrar 2 de revisão. */
function principalDe(minutos: number, peso: number) {
  return Math.min(minutos - 2, Math.max(3, Math.round(minutos * peso)));
}

export function MontadorDePlano() {
  const [fonemaId, setFonemaId] = useState(phonemes[0].id);
  const [minutos, setMinutos] = useState(10);
  const [dias, setDias] = useState<string[]>(["seg", "ter", "qua", "qui", "sex"]);

  const fonema = phonemes.find((f) => f.id === fonemaId)!;
  const escolhidos = DIAS.filter((d) => dias.includes(d.chave));

  const alternar = (chave: string) =>
    setDias((atuais) =>
      atuais.includes(chave) ? atuais.filter((c) => c !== chave) : [...atuais, chave],
    );

  const plano = useMemo(
    () =>
      escolhidos.map((dia, i) => {
        const etapa = CICLO[i % CICLO.length];
        return {
          dia,
          ...etapa,
          // O tempo se divide entre a atividade do dia e uma revisão curta do
          // dia anterior — que é o que fixa. A atividade fica sempre com a
          // fatia maior, e a revisão com pelo menos dois minutos.
          principal: principalDe(minutos, etapa.peso),
          revisao: minutos - principalDe(minutos, etapa.peso),
        };
      }),
    [escolhidos, minutos],
  );

  const totalSemana = plano.length * minutos;
  const estrelinhas = plano.length * 6;

  return (
    <section id="plano" className="scroll-mt-20 px-4 py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Monte em dez segundos
          </span>
          <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight sm:text-5xl">
            Seu plano da semana, pronto para imprimir
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Escolha o som, os dias e quanto tempo cabe na rotina. A gente escreve a semana inteira:
            qual atividade em cada dia, quanto tempo em cada parte e por que nessa ordem.
          </p>
        </Reveal>

        <Reveal atraso={0.1} y={40}>
          <div className="mt-10 rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-8">
            {/* controles */}
            <div data-so-tela className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Star className="h-4 w-4" /> Som da semana
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {phonemes.map((f) => {
                    const ativo = f.id === fonemaId;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFonemaId(f.id)}
                        aria-pressed={ativo}
                        className="grid h-10 w-10 place-items-center rounded-xl border-2 font-display text-sm font-bold transition-transform hover:scale-105"
                        style={{
                          background: ativo ? f.color : "var(--card)",
                          borderColor: f.color,
                          color: ativo ? "white" : "inherit",
                        }}
                      >
                        {f.letter}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <CalendarDays className="h-4 w-4" /> Dias
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {DIAS.map((d) => {
                    const ativo = dias.includes(d.chave);
                    return (
                      <button
                        key={d.chave}
                        onClick={() => alternar(d.chave)}
                        aria-pressed={ativo}
                        className={
                          "h-10 rounded-xl px-3 text-sm font-bold transition-colors " +
                          (ativo
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground")
                        }
                      >
                        {d.curto}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-4 w-4" /> Minutos por dia
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {TEMPOS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setMinutos(t)}
                      aria-pressed={t === minutos}
                      className={
                        "h-10 rounded-xl px-4 text-sm font-bold transition-colors " +
                        (t === minutos
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground")
                      }
                    >
                      {t} min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* resumo */}
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl bg-muted px-5 py-4">
              <p className="text-sm">
                <span className="font-display text-2xl font-bold text-primary">
                  {fonema.letter}
                </span>{" "}
                <span className="text-muted-foreground">{fonema.name.toLowerCase()}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{plano.length}</span> dias ·{" "}
                <span className="font-bold text-foreground">{totalSemana} min</span> na semana · até{" "}
                <span className="font-bold text-foreground">{estrelinhas} estrelinhas</span>
              </p>
              <button
                data-so-tela
                onClick={() => window.print()}
                className="ml-auto flex h-10 items-center gap-2 rounded-xl border-2 border-border px-4 text-sm font-bold transition-colors hover:border-primary/60"
              >
                <Printer className="h-4 w-4" /> Imprimir
              </button>
            </div>

            {/* a semana */}
            {plano.length === 0 ? (
              <p className="mt-7 rounded-2xl border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
                Escolha pelo menos um dia para ver o plano.
              </p>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {plano.map((d, i) => (
                  <motion.div
                    key={d.dia.chave}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="rounded-2xl border border-border p-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-display text-base font-bold capitalize">{d.dia.nome}</p>
                      <span className="rounded-lg bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                        {minutos} min
                      </span>
                    </div>
                    <p
                      className="mt-3 font-display text-lg font-bold"
                      style={{ color: fonema.color }}
                    >
                      {d.titulo}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fonema.letter} · {d.foco}
                    </p>
                    <ul className="mt-4 space-y-1.5 text-sm">
                      <li className="flex justify-between gap-3">
                        <span>Atividade do dia</span>
                        <span className="shrink-0 font-bold tabular-nums">{d.principal} min</span>
                      </li>
                      <li className="flex justify-between gap-3 text-muted-foreground">
                        <span>Revisão do dia anterior</span>
                        <span className="shrink-0 font-bold tabular-nums">{d.revisao} min</span>
                      </li>
                    </ul>
                    <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                      {d.porque}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
              Sugestão de organização para quem acompanha em casa, montada a partir das atividades
              do app. Quem define o som alvo, o ritmo e quando trocar é a fonoaudióloga que
              acompanha a criança.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
