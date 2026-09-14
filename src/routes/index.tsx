import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Mic, BookOpen, Brain, Sparkles, Users, Star, Flame } from "lucide-react";
import { useApp, mascots, PRACTICE_AREAS, type MascotId } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Comunicar+ — Início" },
      {
        name: "description",
        content: "Escolha uma atividade de fala, vocabulário, memória ou desafios.",
      },
    ],
  }),
  component: Dashboard,
});

const shortcuts = [
  {
    title: "Banco de Fonemas",
    desc: "Treine sons como P, F, R, L.",
    url: "/fonemas",
    icon: Mic,
    color: "oklch(0.78 0.14 30)",
  },
  {
    title: "Vocabulário",
    desc: "Descubra palavras e suas partes.",
    url: "/vocabulario",
    icon: BookOpen,
    color: "oklch(0.78 0.13 240)",
  },
  {
    title: "Memória Auditiva",
    desc: "Jogo de sons em sequência.",
    url: "/memoria",
    icon: Brain,
    color: "oklch(0.78 0.13 145)",
  },
  {
    title: "Trava-Línguas",
    desc: "Pronúncia divertida com confetes.",
    url: "/desafios",
    icon: Sparkles,
    color: "oklch(0.78 0.13 290)",
  },
  {
    title: "Habilidades Sociais",
    desc: "Frases do dia a dia com as pessoas.",
    url: "/habilidades-sociais",
    icon: Users,
    color: "oklch(0.78 0.13 340)",
  },
] as const;

const difficultyStyles: Record<string, string> = {
  Fácil: "bg-success/15 text-success",
  Médio: "bg-warm/50 text-warm-foreground",
  Difícil: "bg-destructive/15 text-destructive",
};

function MascotSetupDialog() {
  const { needsSetup, concluirConfiguracao } = useApp();
  const [selected, setSelected] = useState<MascotId>("nina");
  const chosen = mascots.find((m) => m.id === selected)!;

  return (
    <Dialog open={needsSetup} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Vamos começar! 👋</DialogTitle>
          <DialogDescription className="text-base">
            Escolha o mascote guia — cada um tem sua própria personalidade e dificuldade.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {mascots.map((m) => {
            const active = m.id === selected;
            return (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                aria-pressed={active}
                className={
                  "flex w-full items-center gap-4 rounded-3xl border-2 p-4 text-left transition-all " +
                  (active
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-card hover:border-primary/50")
                }
              >
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-background text-4xl">
                  {m.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-base font-bold">{m.name.split(",")[0]}</p>
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs font-bold " +
                        difficultyStyles[m.difficulty]
                      }
                    >
                      {m.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{m.tagline}</p>
                  <p className="mt-1 text-xs font-semibold">Meta: {m.dailyGoal} ⭐ por dia</p>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-center text-sm font-semibold text-muted-foreground">{chosen.tagline}</p>
        <Button
          onClick={() => concluirConfiguracao(selected)}
          className="h-12 w-full rounded-2xl text-base"
        >
          Começar com {chosen.name.split(",")[0]}!
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function Dashboard() {
  const { mascot, starsByArea, dailyGoal, dailyStarsByArea, streak } = useApp();
  const totalStars = Object.values(starsByArea).reduce((a, b) => a + b, 0);
  const areasCompleted = PRACTICE_AREAS.filter(
    (a) => (dailyStarsByArea[a.id] ?? 0) >= dailyGoal,
  ).length;
  const allDone = areasCompleted === PRACTICE_AREAS.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <MascotSetupDialog />
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-3xl border border-border p-6 sm:p-10"
        style={{ background: "var(--primary-soft)" }}
      >
        <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr_auto]">
          <motion.div
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 12 }}
            className="grid h-28 w-28 place-items-center rounded-3xl bg-background text-7xl shadow-sm"
            aria-hidden="true"
          >
            {mascot.emoji}
          </motion.div>
          <div className="min-w-0">
            <p className="font-display text-sm uppercase tracking-wider text-muted-foreground">
              Olá, eu sou
            </p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{mascot.name}</h1>
            <p className="mt-2 text-lg text-foreground/80">{mascot.greeting}</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-background px-5 py-4 shadow-sm">
            <Star className="h-7 w-7 fill-warm text-warm" />
            <div>
              <p className="text-2xl font-bold leading-none">{totalStars}</p>
              <p className="text-xs text-muted-foreground">estrelinhas</p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="mt-6 space-y-4">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold">Meta diária</h3>
            <span className="text-sm font-semibold text-muted-foreground">
              {areasCompleted}/{PRACTICE_AREAS.length} atividades
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {PRACTICE_AREAS.map((a) => {
              const stars = dailyStarsByArea[a.id] ?? 0;
              const done = stars >= dailyGoal;
              const pct = Math.min(100, Math.round((stars / dailyGoal) * 100));
              return (
                <div key={a.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className={done ? "font-semibold text-success" : "text-muted-foreground"}>
                      {done ? "✅ " : ""}
                      {a.label}
                    </span>
                    <span className="font-semibold">
                      {Math.min(stars, dailyGoal)} / {dailyGoal} ⭐
                    </span>
                  </div>
                  <Progress value={pct} className="mt-1" />
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {allDone
              ? "Meta de hoje concluída em tudo! 🎉"
              : "Complete a meta em todas as atividades para manter o streak!"}
          </p>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
            style={{ background: "var(--primary-soft)" }}
            aria-hidden="true"
          >
            <Flame className="h-7 w-7 fill-warm text-warm" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none">
              {streak} {streak === 1 ? "dia" : "dias"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">seguidos batendo a meta em tudo</p>
          </div>
        </Card>
      </div>

      <h2 className="mt-10 mb-4 text-2xl font-bold">O que vamos praticar hoje?</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {shortcuts.map((s, i) => (
          <motion.div
            key={s.url}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.35 }}
            whileHover={{ y: -4 }}
          >
            <Link to={s.url} className="block focus-visible:outline-none">
              <Card className="group relative h-full overflow-hidden border-2 p-6 transition-shadow hover:shadow-xl">
                <div
                  className="grid h-20 w-20 place-items-center rounded-3xl"
                  style={{ background: s.color + "33" }}
                  aria-hidden="true"
                >
                  <s.icon className="h-10 w-10" style={{ color: s.color }} />
                </div>
                <h3 className="mt-5 text-2xl font-bold">{s.title}</h3>
                <p className="mt-2 text-base text-muted-foreground">{s.desc}</p>
                <div className="mt-4 inline-flex items-center text-base font-semibold text-primary">
                  Começar →
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-border bg-card p-6">
        <h3 className="text-xl font-bold">Quer mudar o mascote ou as cores?</h3>
        <p className="mt-1 text-muted-foreground">
          Personalize a experiência para deixar tudo do seu jeito.
        </p>
        <Button asChild className="mt-4 h-12 rounded-2xl px-6 text-base">
          <Link to="/personalizar">Personalizar</Link>
        </Button>
      </div>
    </div>
  );
}
