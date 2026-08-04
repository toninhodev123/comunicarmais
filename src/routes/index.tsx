import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Mic, BookOpen, Brain, Sparkles, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

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

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Bem-vindo ao Comunicar+</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Escolha uma das atividades abaixo para começar a praticar.
        </p>
      </header>

      <h2 className="mb-4 text-2xl font-bold">O que vamos praticar hoje?</h2>
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
    </div>
  );
}