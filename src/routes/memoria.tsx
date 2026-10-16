import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Volume2, Star, Play, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { memoryWords, type MemoryWord } from "@/lib/data/memoryWords";
import { falar, tocarTom, tocarSucesso, tocarErro } from "@/lib/voz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/memoria")({
  head: () => ({
    meta: [
      { title: "Memória Auditiva — Comunicar+" },
      {
        name: "description",
        content: "Jogo estilo Genius: ouça a sequência de palavras e repita tocando nas imagens.",
      },
    ],
  }),
  component: MemoryPage,
});

/** Quantos botões ficam na mesa — cada um é uma palavra com a imagem dela. */
const QTD_PADS = 6;
const RECORDE_KEY = "comunicar-plus:recorde-memoria";

const CORES_PADS = [
  "oklch(0.78 0.14 30)",
  "oklch(0.78 0.13 145)",
  "oklch(0.78 0.13 240)",
  "oklch(0.78 0.13 300)",
  "oklch(0.78 0.13 80)",
  "oklch(0.78 0.13 200)",
];
const TONS_PADS = [330, 392, 440, 494, 587, 659];

type Fase = "parado" | "mostrando" | "jogador";

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sortearPads(): MemoryWord[] {
  return embaralhar(memoryWords).slice(0, QTD_PADS);
}

// Sorteia o próximo passo evitando repetir o botão anterior: sequências como
// "peixe, peixe, peixe" soam iguais e não exercitam a memória.
function proximoPasso(seq: number[]): number {
  const anterior = seq.length > 0 ? seq[seq.length - 1] : -1;
  const opcoes = [];
  for (let i = 0; i < QTD_PADS; i++) if (i !== anterior) opcoes.push(i);
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function carregarRecorde(): number {
  if (typeof window === "undefined") return 0;
  try {
    const salvo = window.localStorage.getItem(RECORDE_KEY);
    const n = salvo ? Number(salvo) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function MemoryPage() {
  const { adicionarEstrelas } = useApp();
  const [pads, setPads] = useState<MemoryWord[]>(sortearPads);
  const [sequencia, setSequencia] = useState<number[]>([]);
  const [passo, setPasso] = useState(0);
  const [fase, setFase] = useState<Fase>("parado");
  const [aceso, setAceso] = useState<number | null>(null);
  const [rodadasVencidas, setRodadasVencidas] = useState(0);
  const [recorde, setRecorde] = useState(carregarRecorde);

  // Cada apresentação da sequência ganha um id; se outra começar (ou a tela
  // for fechada) a anterior para sozinha no meio do caminho.
  const execucaoRef = useRef(0);
  useEffect(() => () => void execucaoRef.current++, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(RECORDE_KEY, String(recorde));
    } catch {
      // ignora erros de storage (ex.: navegação privada)
    }
  }, [recorde]);

  const mostrarSequencia = useCallback(async (seq: number[], padsAtuais: MemoryWord[]) => {
    const id = ++execucaoRef.current;
    setFase("mostrando");
    setPasso(0);
    setAceso(null);
    await esperar(600);
    for (const indice of seq) {
      if (execucaoRef.current !== id) return;
      // Nada acende aqui de propósito: a sequência é só de ouvido.
      tocarTom(TONS_PADS[indice], 260, "triangle");
      falar(padsAtuais[indice].word, { rate: 0.85 });
      await esperar(1100);
      if (execucaoRef.current !== id) return;
      await esperar(260);
    }
    if (execucaoRef.current !== id) return;
    setFase("jogador");
  }, []);

  const comecar = () => {
    const novosPads = sortearPads();
    const seq = [proximoPasso([])];
    setPads(novosPads);
    setSequencia(seq);
    setRodadasVencidas(0);
    void mostrarSequencia(seq, novosPads);
  };

  const repetirSequencia = () => {
    if (fase !== "jogador" || sequencia.length === 0) return;
    void mostrarSequencia(sequencia, pads);
  };

  const acertouRodada = (seq: number[]) => {
    tocarSucesso();
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.7 },
      colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#c77dff"],
    });
    adicionarEstrelas("memoria", 1);
    const vencidas = rodadasVencidas + 1;
    setRodadasVencidas(vencidas);
    if (vencidas > recorde) {
      setRecorde(vencidas);
      toast("Novo recorde de sequência!", { icon: "🏆" });
    }
    setFase("mostrando");
    const proxima = [...seq, proximoPasso(seq)];
    setTimeout(() => {
      setSequencia(proxima);
      void mostrarSequencia(proxima, pads);
    }, 1200);
  };

  const errou = () => {
    tocarErro();
    setFase("parado");
    setAceso(null);
    execucaoRef.current++;
    toast("Ops! A sequência era outra. Vamos tentar de novo.", { icon: "💪" });
  };

  const tocarPad = (indice: number) => {
    if (fase !== "jogador") return;
    setAceso(indice);
    tocarTom(TONS_PADS[indice], 240, "triangle");
    falar(pads[indice].word, { rate: 0.9 });
    setTimeout(() => setAceso((a) => (a === indice ? null : a)), 320);

    if (sequencia[passo] !== indice) {
      errou();
      return;
    }
    const avanco = passo + 1;
    if (avanco === sequencia.length) {
      setPasso(0);
      acertouRodada(sequencia);
    } else {
      setPasso(avanco);
    }
  };

  const rodada = sequencia.length;
  const mensagem =
    fase === "mostrando"
      ? "Fecha os olhos e escuta a sequência..."
      : fase === "jogador"
        ? `Sua vez! Repita a sequência (${passo}/${rodada})`
        : rodada > 0
          ? "Toque em Começar para jogar outra vez."
          : "Toque em Começar: eu falo as palavras e você repete na mesma ordem.";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Memória Auditiva</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Jogo estilo Genius só de ouvido: a sequência é falada, sem nenhuma pista na tela. Repita
            tocando nas imagens na mesma ordem — a cada acerto entra mais uma palavra!
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-sm">
            <Star className="h-6 w-6 fill-warm text-warm" />
            <span className="text-xl font-bold">{rodadasVencidas}</span>
            <span className="text-sm text-muted-foreground">rodadas</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-sm">
            <Trophy className="h-6 w-6 text-success" />
            <span className="text-xl font-bold">{recorde}</span>
            <span className="text-sm text-muted-foreground">recorde</span>
          </div>
        </div>
      </header>

      <Card className="p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {rodada > 0
            ? `Sequência de ${rodada} ${rodada === 1 ? "palavra" : "palavras"}`
            : "Pronto?"}
        </p>
        <p className="mt-2 font-display text-2xl font-bold">{mensagem}</p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button
            onClick={comecar}
            disabled={fase === "mostrando"}
            className="h-12 rounded-2xl px-5 text-base"
          >
            <Play className="mr-2 h-5 w-5" /> {rodada > 0 ? "Começar de novo" : "Começar"}
          </Button>
          <Button
            variant="outline"
            onClick={repetirSequencia}
            disabled={fase !== "jogador"}
            className="h-12 rounded-2xl px-5 text-base"
          >
            <Volume2 className="mr-2 h-5 w-5" /> Ouvir a sequência
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {pads.map((p, i) => {
            const ligado = aceso === i;
            return (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.94 }}
                animate={{ scale: ligado ? 1.06 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                onClick={() => tocarPad(i)}
                disabled={fase !== "jogador"}
                className={
                  "big-tap flex h-36 flex-col items-center justify-center gap-1 rounded-3xl border-4 transition-colors disabled:opacity-70 " +
                  (ligado ? "shadow-xl" : "bg-background")
                }
                style={{
                  borderColor: CORES_PADS[i],
                  background: ligado ? CORES_PADS[i] : undefined,
                }}
                aria-label={p.word}
              >
                <span className="text-5xl" aria-hidden="true">
                  {p.emoji}
                </span>
                <span className="font-display text-lg font-bold capitalize">{p.word}</span>
              </motion.button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
