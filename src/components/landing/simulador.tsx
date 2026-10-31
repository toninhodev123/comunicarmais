import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { CalendarDays, Flame, Star, Target } from "lucide-react";
import { mascots, PRACTICE_AREAS, type MascotId } from "@/context/AppContext";
import { Mascote } from "@/components/landing/mascotes";
import { Contador, Reveal } from "@/components/landing/animacoes";

/**
 * Simulador de metas.
 *
 * A pergunta que toda família faz antes de começar é "quanto tempo isso dá por
 * dia?". Em vez de responder com uma frase, a gente deixa ela mexer: escolhe o
 * mascote (que define a meta) e quantos dias por semana, e vê a conta — por
 * dia, por semana, por mês. Os números saem das mesmas constantes do app, então
 * não tem como a landing prometer uma coisa e o produto entregar outra.
 */

/** Tempo médio por estrelinha, medido nas atividades: um acerto leva ~20 s. */
const SEGUNDOS_POR_ESTRELA = 20;

const DIAS = [3, 4, 5, 6, 7];

export function SimuladorDeMetas() {
  const [mascoteId, setMascoteId] = useState<MascotId>(mascots[0].id);
  const [dias, setDias] = useState(5);

  const mascote = mascots.find((m) => m.id === mascoteId)!;

  const conta = useMemo(() => {
    const porDia = mascote.dailyGoal * PRACTICE_AREAS.length;
    const minutosPorDia = Math.round((porDia * SEGUNDOS_POR_ESTRELA) / 60);
    return {
      porDia,
      minutosPorDia,
      porSemana: porDia * dias,
      porMes: porDia * dias * 4,
      minutosPorSemana: minutosPorDia * dias,
    };
  }, [mascote, dias]);

  return (
    <section id="metas" className="scroll-mt-20 border-y border-border bg-card/40 py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Quanto tempo dá por dia
          </span>
          <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight sm:text-5xl">
            Faça a conta antes de começar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            O mascote que a criança escolhe define a meta do dia. Escolha um aqui e veja quanto isso
            significa de verdade — os números saem das mesmas regras que rodam no app.
          </p>
        </Reveal>

        <Reveal atraso={0.1} y={40}>
          <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] [&>*]:min-w-0">
            {/* escolhas */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <Target className="h-4 w-4" /> O mascote guia
              </p>
              <div className="mt-4 grid gap-3">
                {mascots.map((m) => {
                  const ativo = m.id === mascoteId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMascoteId(m.id)}
                      aria-pressed={ativo}
                      className={
                        "flex items-center gap-4 rounded-2xl border-2 p-3 text-left transition-colors " +
                        (ativo
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50")
                      }
                    >
                      <Mascote id={m.id} className="h-14 w-14 shrink-0" />
                      <span className="min-w-0">
                        <span className="block font-display text-base font-bold">
                          {m.name.split(",")[0]}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {m.dailyGoal} estrelinhas por atividade
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <CalendarDays className="h-4 w-4" /> Dias por semana
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {DIAS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDias(d)}
                    aria-pressed={d === dias}
                    className={
                      "h-11 rounded-xl px-4 text-sm font-bold transition-colors " +
                      (d === dias
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground")
                    }
                  >
                    {d} dias
                  </button>
                ))}
              </div>
            </div>

            {/* a conta */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
              <motion.div
                key={mascoteId + dias}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  {
                    valor: conta.minutosPorDia,
                    sufixo: " min",
                    rotulo: "por dia",
                    detalhe: `${conta.porDia} estrelinhas em ${PRACTICE_AREAS.length} atividades`,
                  },
                  {
                    valor: conta.porSemana,
                    sufixo: "",
                    rotulo: "estrelinhas por semana",
                    detalhe: `cerca de ${conta.minutosPorSemana} minutos`,
                  },
                  {
                    valor: dias,
                    sufixo: " dias",
                    rotulo: "de sequência por semana",
                    detalhe: "o streak conta os dias seguidos",
                  },
                  {
                    valor: conta.porMes,
                    sufixo: "",
                    rotulo: "estrelinhas no mês",
                    detalhe: "quatro semanas, um fonema inteiro",
                  },
                ].map((c) => (
                  <div key={c.rotulo} className="rounded-2xl bg-muted p-5">
                    <p className="font-display text-3xl font-bold text-primary sm:text-4xl">
                      <Contador valor={c.valor} />
                      {c.sufixo}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-tight">{c.rotulo}</p>
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">{c.detalhe}</p>
                  </div>
                ))}
              </motion.div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-warm/25 px-4 py-3">
                <Flame className="mt-0.5 h-5 w-5 shrink-0 fill-warm text-warm" />
                <p className="text-sm leading-relaxed">
                  A sequência só continua se a meta for batida em{" "}
                  <strong>todas as {PRACTICE_AREAS.length} atividades da meta diária</strong>. É de
                  propósito: a criança não escolhe só a que já domina.
                </p>
              </div>

              <div className="mt-3 flex items-start gap-3 rounded-2xl bg-muted px-4 py-3">
                <Star className="mt-0.5 h-5 w-5 shrink-0 fill-warm text-warm" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  As outras quatro atividades dão estrelinha sem entrar na meta — ficam como extra
                  para o dia em que a criança quiser mais, sem tornar o streak impossível.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal atraso={0.16}>
          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            Estimativa de tempo a partir de cerca de {SEGUNDOS_POR_ESTRELA} segundos por acerto,
            incluindo ouvir e repetir. Criança cansada rende menos, e tudo bem parar antes — a meta
            existe para dar ritmo, não para cobrar.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
