import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Mic, MicOff, Pause, Play, RotateCcw } from "lucide-react";
import { tocarSucesso } from "@/lib/voz";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/sopro")({
  head: () => ({
    meta: [
      { title: "Sopro e Respiração — Comunicar+" },
      {
        name: "description",
        content:
          "Exercícios de sopro e respiração que preparam a boca para falar, com o microfone mostrando a força do sopro.",
      },
    ],
  }),
  component: SoproPage,
});

/**
 * Sopro e respiração.
 *
 * Falar depende de ar: quem não sustenta o sopro perde o fim da frase e troca
 * sons que precisam de pressão (P, T, S). Estes exercícios são os mesmos que
 * se faz com vela, bolinha de sabão e canudo, só que guiados na tela.
 *
 * O microfone é opcional e não grava nada: ele lê o nível do som em tempo real
 * para a criança *ver* o próprio sopro mexendo no desenho. Isso dá o retorno
 * imediato que a vela dá na vida real.
 */

interface Exercicio {
  id: string;
  nome: string;
  emoji: string;
  instrucao: string;
  porque: string;
  /** Segundos de cada fase. Inspirar, segurar e soprar. */
  inspirar: number;
  segurar: number;
  soprar: number;
  repeticoes: number;
}

const EXERCICIOS: Exercicio[] = [
  {
    id: "flor",
    nome: "Cheirar a flor",
    emoji: "🌻",
    instrucao: "Puxe o ar pelo nariz devagar, como quem cheira uma flor. Depois solte pela boca.",
    porque: "Ensina a buscar ar pelo nariz, que é como a gente respira enquanto conversa.",
    inspirar: 4,
    segurar: 1,
    soprar: 4,
    repeticoes: 4,
  },
  {
    id: "vela",
    nome: "Apagar a vela",
    emoji: "🕯️",
    instrucao: "Puxe o ar e sopre de uma vez só, forte e curto, como quem apaga uma velinha.",
    porque: "Sopro curto e forte é o mesmo gesto do P e do T, que estouram na saída.",
    inspirar: 3,
    segurar: 1,
    soprar: 2,
    repeticoes: 5,
  },
  {
    id: "bolha",
    nome: "Bolha de sabão",
    emoji: "🫧",
    instrucao: "Sopre bem devagarinho e sem parar, para a bolha crescer e não estourar.",
    porque: "Sopro longo e constante é o que sustenta uma frase inteira sem perder o fim.",
    inspirar: 4,
    segurar: 1,
    soprar: 8,
    repeticoes: 3,
  },
  {
    id: "canudo",
    nome: "Soprar no canudo",
    emoji: "🥤",
    instrucao: "Junte os lábios como se tivesse um canudo e sopre um fio fino de ar.",
    porque: "Junta os lábios com força — a base do P, do B e do M.",
    inspirar: 3,
    segurar: 2,
    soprar: 6,
    repeticoes: 4,
  },
];

type Fase = "parado" | "inspirar" | "segurar" | "soprar" | "pausa";

const ROTULO: Record<Fase, string> = {
  parado: "Toque em começar",
  inspirar: "Puxe o ar…",
  segurar: "Segure",
  soprar: "Sopre!",
  pausa: "Descanse",
};

function SoproPage() {
  const { adicionarEstrelas } = useApp();
  const menosMovimento = useReducedMotion();
  const [exercicio, setExercicio] = useState(EXERCICIOS[0]);
  const [fase, setFase] = useState<Fase>("parado");
  const [restante, setRestante] = useState(0);
  const [volta, setVolta] = useState(0);
  const [nivel, setNivel] = useState(0);
  const [microfone, setMicrofone] = useState(false);
  const [erroMicrofone, setErroMicrofone] = useState(false);

  const relogio = useRef<number | null>(null);
  const faseRef = useRef<Fase>("parado");
  const voltaRef = useRef(0);
  const audio = useRef<{ ctx: AudioContext; fluxo: MediaStream; quadro: number } | null>(null);

  const pararRelogio = () => {
    if (relogio.current) window.clearInterval(relogio.current);
    relogio.current = null;
  };

  const desligarMicrofone = () => {
    if (!audio.current) return;
    cancelAnimationFrame(audio.current.quadro);
    audio.current.fluxo.getTracks().forEach((t) => t.stop());
    void audio.current.ctx.close();
    audio.current = null;
    setNivel(0);
    setMicrofone(false);
  };

  // Desliga tudo ao sair da tela: microfone aberto em segundo plano, nunca.
  useEffect(() => {
    return () => {
      pararRelogio();
      desligarMicrofone();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Lê o nível do som em tempo real. Nada é gravado nem sai do aparelho. */
  const ligarMicrofone = async () => {
    if (audio.current) return desligarMicrofone();
    try {
      const fluxo = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const fonte = ctx.createMediaStreamSource(fluxo);
      const analisador = ctx.createAnalyser();
      analisador.fftSize = 1024;
      fonte.connect(analisador);
      const dados = new Uint8Array(analisador.fftSize);

      const ler = () => {
        analisador.getByteTimeDomainData(dados);
        let soma = 0;
        for (const v of dados) soma += (v - 128) ** 2;
        const rms = Math.sqrt(soma / dados.length) / 128;
        // Suaviza para o desenho não tremer a cada quadro.
        setNivel((n) => n * 0.75 + Math.min(1, rms * 6) * 0.25);
        if (audio.current) audio.current.quadro = requestAnimationFrame(ler);
      };
      audio.current = { ctx, fluxo, quadro: requestAnimationFrame(ler) };
      setMicrofone(true);
      setErroMicrofone(false);
    } catch {
      setErroMicrofone(true);
    }
  };

  const avancarFase = () => {
    const ex = exercicio;
    const atual = faseRef.current;
    const proxima: Record<string, Fase> = {
      inspirar: "segurar",
      segurar: "soprar",
      soprar: "pausa",
      pausa: "inspirar",
    };
    const seguinte = proxima[atual] ?? "inspirar";

    if (atual === "soprar") {
      const feitas = voltaRef.current + 1;
      voltaRef.current = feitas;
      setVolta(feitas);
      if (feitas >= ex.repeticoes) {
        pararRelogio();
        faseRef.current = "parado";
        setFase("parado");
        adicionarEstrelas("sopro", 1);
        tocarSucesso();
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.7 } });
        return;
      }
    }

    const duracao =
      seguinte === "inspirar"
        ? ex.inspirar
        : seguinte === "segurar"
          ? ex.segurar
          : seguinte === "soprar"
            ? ex.soprar
            : 2;
    faseRef.current = seguinte;
    setFase(seguinte);
    setRestante(duracao);
  };

  const comecar = () => {
    pararRelogio();
    voltaRef.current = 0;
    setVolta(0);
    faseRef.current = "inspirar";
    setFase("inspirar");
    setRestante(exercicio.inspirar);
    relogio.current = window.setInterval(() => {
      setRestante((r) => {
        if (r > 1) return r - 1;
        avancarFase();
        return 0;
      });
    }, 1000);
  };

  const parar = () => {
    pararRelogio();
    faseRef.current = "parado";
    setFase("parado");
    setVolta(0);
    voltaRef.current = 0;
  };

  const trocar = (ex: Exercicio) => {
    parar();
    setExercicio(ex);
  };

  const rodando = fase !== "parado";
  // O círculo cresce ao inspirar e encolhe ao soprar; com o microfone ligado, o
  // sopro de verdade também mexe nele.
  const escala =
    fase === "inspirar" ? 1.35 : fase === "segurar" ? 1.35 : fase === "soprar" ? 0.75 : 1;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Sopro e Respiração</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Falar depende de ar. Quem não sustenta o sopro perde o fim da frase e troca os sons que
          precisam de força. Estes são os exercícios da vela e da bolha de sabão, guiados na tela.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {EXERCICIOS.map((ex) => (
          <button
            key={ex.id}
            onClick={() => trocar(ex)}
            aria-pressed={ex.id === exercicio.id}
            className={
              "flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 transition-colors " +
              (ex.id === exercicio.id
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50")
            }
          >
            <span className="text-3xl" aria-hidden="true">
              {ex.emoji}
            </span>
            <span className="text-center text-xs font-bold leading-tight">{ex.nome}</span>
          </button>
        ))}
      </div>

      <Card className="p-6 text-center sm:p-8">
        <p className="text-base leading-relaxed">{exercicio.instrucao}</p>

        {/* o círculo que respira junto */}
        <div className="relative mx-auto mt-8 grid h-56 w-56 place-items-center">
          <motion.div
            animate={menosMovimento ? undefined : { scale: escala }}
            transition={{
              duration:
                fase === "inspirar"
                  ? exercicio.inspirar
                  : fase === "soprar"
                    ? exercicio.soprar
                    : 0.6,
              ease: "easeInOut",
            }}
            className="absolute h-44 w-44 rounded-full"
            style={{ background: "var(--primary-soft)" }}
            aria-hidden="true"
          />
          {/* anel do sopro medido pelo microfone */}
          {microfone && (
            <div
              className="absolute rounded-full border-4 border-primary/70"
              style={{
                width: 176 + nivel * 90,
                height: 176 + nivel * 90,
                opacity: 0.35 + nivel * 0.65,
              }}
              aria-hidden="true"
            />
          )}
          <div className="relative text-center">
            <p className="text-5xl" aria-hidden="true">
              {exercicio.emoji}
            </p>
            <p className="mt-2 font-display text-xl font-bold">{ROTULO[fase]}</p>
            {rodando && <p className="font-display text-4xl font-bold tabular-nums">{restante}</p>}
          </div>
        </div>

        {rodando && (
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {volta} de {exercicio.repeticoes} respirações
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={rodando ? parar : comecar}
            className="h-14 flex-1 rounded-2xl text-base"
            variant={rodando ? "outline" : "default"}
          >
            {rodando ? (
              <>
                <Pause className="mr-2 h-5 w-5" /> Parar
              </>
            ) : volta > 0 ? (
              <>
                <RotateCcw className="mr-2 h-5 w-5" /> Fazer de novo
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" /> Começar
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={ligarMicrofone}
            className="h-14 rounded-2xl text-base sm:w-auto"
          >
            {microfone ? (
              <>
                <MicOff className="mr-2 h-5 w-5" /> Desligar o sopro
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" /> Ver meu sopro
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {erroMicrofone && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 rounded-xl bg-warm/30 px-3 py-2 text-sm"
            >
              Não consegui acessar o microfone. O exercício funciona do mesmo jeito sem ele — o
              microfone só serve para a criança ver o sopro mexendo no desenho.
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-6 rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">Para que serve:</span> {exercicio.porque}
        </p>
      </Card>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
        Pare se a criança ficar tonta — é sinal de que respirou fundo demais. Dois ou três minutos
        por dia bastam. O microfone não grava nada: ele só mede o volume enquanto a tela está
        aberta.
      </p>
    </div>
  );
}
