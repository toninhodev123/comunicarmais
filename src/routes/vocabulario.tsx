import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Volume2 } from "lucide-react";
import { categories, type Category, type DeepItem } from "@/lib/data/vocabulary";
import { falar } from "@/lib/voz";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/vocabulario")({
  head: () => ({
    meta: [
      { title: "Vocabulário — Comunicar+" },
      { name: "description", content: "Explore palavras e suas partes com pictogramas e áudio." },
    ],
  }),
  component: VocabularyPage,
});

function VocabularyPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [item, setItem] = useState<DeepItem | null>(null);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center gap-3">
        {(category || item) && (
          <Button
            variant="ghost"
            className="big-tap rounded-2xl"
            onClick={() => (item ? setItem(null) : setCategory(null))}
            aria-label="Voltar"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            {!category ? "Vocabulário" : !item ? category.name : item.name}
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">
            {!category
              ? "Escolha uma categoria geral."
              : !item
                ? "Toque em uma palavra para conhecer suas partes."
                : "Toque em cada parte para ouvir."}
          </p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!category && (
          <motion.div
            key="cats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c)}
                className="text-left focus-visible:outline-none"
              >
                <Card className="h-full overflow-hidden p-0 transition-shadow hover:shadow-xl">
                  <div
                    className="grid h-44 place-items-center text-8xl"
                    style={{ background: c.color + "33" }}
                    aria-hidden="true"
                  >
                    {c.emoji}
                  </div>
                  <div className="p-5">
                    <h2 className="text-2xl font-bold">{c.name}</h2>
                    <p className="mt-1 text-muted-foreground">{c.items.length} palavras</p>
                  </div>
                </Card>
              </button>
            ))}
          </motion.div>
        )}

        {category && !item && (
          <motion.div
            key="items"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {category.items.map((it) => (
              <Card key={it.name} className="overflow-hidden p-0">
                <div
                  className="grid h-40 place-items-center text-7xl"
                  style={{ background: category.color + "22" }}
                  aria-hidden="true"
                >
                  {it.emoji}
                </div>
                <div className="space-y-3 p-5">
                  <p className="font-display text-2xl font-bold">{it.name}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => falar(it.name)}
                      variant="outline"
                      className="h-12 flex-1 rounded-2xl text-base"
                    >
                      <Volume2 className="mr-2 h-5 w-5" /> Ouvir
                    </Button>
                    <Button
                      onClick={() => setItem(it)}
                      className="h-12 flex-1 rounded-2xl text-base"
                      style={{ background: category.color, color: "white" }}
                    >
                      Ver partes
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {category && item && (
          <motion.div
            key="parts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card
              className="mb-6 flex items-center gap-5 p-6"
              style={{ background: category.color + "22" }}
            >
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-background text-6xl">
                {item.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  Palavra principal
                </p>
                <p className="font-display text-3xl font-bold">{item.name}</p>
                <Button
                  onClick={() => falar(item.name)}
                  className="mt-3 h-11 rounded-2xl"
                  style={{ background: category.color, color: "white" }}
                >
                  <Volume2 className="mr-2 h-5 w-5" /> Ouvir
                </Button>
              </div>
            </Card>

            <h2 className="mb-3 text-xl font-bold">Partes do {item.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {item.parts.map((p) => (
                <motion.button
                  key={p.name}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -2 }}
                  onClick={() => falar(p.name)}
                  className="flex items-center gap-4 rounded-3xl border-2 border-border bg-card p-5 text-left transition-colors hover:border-primary"
                >
                  <div
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-4xl"
                    style={{ background: category.color + "33" }}
                    aria-hidden="true"
                  >
                    {p.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl font-bold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">Toque para ouvir</p>
                  </div>
                  <Volume2 className="h-6 w-6 text-primary" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
