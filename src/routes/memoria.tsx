import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Volume2, Mic, Star, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { memoryWords, type MemoryWord } from "@/lib/data/memoryWords";
import { falar, ouvir, palavraCorresponde, tocarSucesso, tocarErro } from "@/lib/voz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/memoria")({
  head: () => ({
    meta: [
      { title: "Memória Auditiva — Comunicar+" },
      { name: "description", content: "Ouça a palavra, repita e toque no emoji certo." },
    ],
  }),
  component: MemoryPage,
});

function palavraAleatoria(excluirId?: string) {
  const pool = excluirId ? memoryWords.filter((w) => w.id !== excluirId) : memoryWords;
  return pool[Math.floor(Math.random() * pool.length)];
}

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gerarOpcoes(palavra: MemoryWord): MemoryWord[] {
  const distratoras = embaralhar(memoryWords.filter((w) => w.id !== palavra.id)).slice(0, 3);
  return embaralhar([palavra, ...distratoras]);
}

function MemoryPage() {
  const { adicionarEstrelas } = useApp();
  const [palavra, setPalavra] = useState<MemoryWord>(() => palavraAleatoria());
  const [opcoes, setOpcoes] = useState<MemoryWord[]>(() => gerarOpcoes(palavra));
  const [falou, setFalou] = useState(false);
  const [emojiCerto, setEmojiCerto] = useState(false);
  const [ouvindo, setOuvindo] = useState(false);
  const [score, setScore] = useState(0);
  const [semSuporte, setSemSuporte] = useState(false);

  useEffect(() => {
    falar(palavra.word, { rate: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palavra]);

  useEffect(() => {
    if (!falou || !emojiCerto) return;
    setScore((s) => s + 1);
    adicionarEstrelas("memoria", 1);
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.7 },
      colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#c77dff"],
    });
    const t = setTimeout(() => {
      const proxima = palavraAleatoria(palavra.id);
      setPalavra(proxima);
      setOpcoes(gerarOpcoes(proxima));
      setFalou(false);
      setEmojiCerto(false);
    }, 1100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [falou, emojiCerto]);

  const ouvirEFalar = () => {
    if (ouvindo) return;
    falar(palavra.word, { rate: 0.8 });
    setOuvindo(true);
    const started = ouvir({
      onResult: (transcript) => {
        if (palavraCorresponde(transcript, palavra.word)) {
          setFalou(true);
          tocarSucesso();
          toast("Boa! Falou certinho.", { icon: "🗣️" });
        } else {
          tocarErro();
          toast("Quase! Vamos repetir.", { icon: "💪" });
        }
      },
      onEnd: () => setOuvindo(false),
    });
    if (!started) {
      setOuvindo(false);
      setSemSuporte(true);
    }
  };

  const escolherEmoji = (opcao: MemoryWord) => {
    if (emojiCerto) return;
    if (opcao.id === palavra.id) {
      setEmojiCerto(true);
      tocarSucesso();
    } else {
      tocarErro();
      toast("Esse não é! Tenta outro.", { icon: "🤔" });
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Memória Auditiva</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Ouça a palavra, repita em voz alta e toque no emoji certo. Pode fazer nessa ordem ou na
            outra!
          </p>
          {semSuporte && (
            <p className="mt-2 rounded-xl bg-warm/30 px-3 py-2 text-sm">
              Seu navegador não suporta reconhecimento de voz. Tente no Chrome do computador ou
              celular.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-sm">
          <Star className="h-6 w-6 fill-warm text-warm" />
          <span className="text-xl font-bold">{score}</span>
          <span className="text-sm text-muted-foreground">acertos</span>
        </div>
      </header>

      <Card className="p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Palavra da vez
        </p>
        <p className="mt-2 font-display text-4xl font-bold tracking-wide">{palavra.word}</p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => falar(palavra.word, { rate: 0.8 })}
            className="h-12 rounded-2xl px-5 text-base"
          >
            <Volume2 className="mr-2 h-5 w-5" /> Ouvir de novo
          </Button>
          <Button
            onClick={ouvirEFalar}
            disabled={ouvindo}
            variant={falou ? "secondary" : "default"}
            className="h-12 rounded-2xl px-5 text-base"
          >
            {ouvindo ? (
              <>
                <Mic className="mr-2 h-5 w-5 animate-pulse text-red-500" /> Ouvindo...
              </>
            ) : falou ? (
              <>
                <Check className="mr-2 h-5 w-5" /> Falou certo!
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" /> Falar e verificar
              </>
            )}
          </Button>
        </div>

        <p className="mt-6 mb-3 text-base font-semibold">
          {emojiCerto ? "✅ Emoji certo!" : "Qual emoji combina com a palavra?"}
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {opcoes.map((op) => {
            const correta = emojiCerto && op.id === palavra.id;
            return (
              <motion.button
                key={op.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => escolherEmoji(op)}
                disabled={emojiCerto}
                className={
                  "big-tap flex h-24 items-center justify-center rounded-3xl border-2 text-5xl transition-all " +
                  (correta
                    ? "border-success bg-success/15"
                    : "border-border bg-background hover:border-primary disabled:opacity-60")
                }
                aria-label={op.word}
              >
                {op.emoji}
              </motion.button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
