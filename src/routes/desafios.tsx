import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { Volume2, PartyPopper, Mic, Timer, Play, Pause, RotateCcw, Trophy } from "lucide-react";
import { tongueTwisters } from "@/lib/data/tongueTwisters";
import { falar, ouvir, fraseCorresponde, tocarErro } from "@/lib/voz";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/desafios")({
  head: () => ({
    meta: [
      { title: "Trava-Línguas — Comunicar+" },
      { name: "description", content: "Trava-línguas com cronômetro, celebração e voz." },
    ],
  }),
  component: ChallengesPage,
});

const BEST_TIMES_KEY = "comunicar-plus:tempos-trava-linguas";

interface Crono {
  /** Momento (ms) em que a contagem atual começou — null quando está parado. */
  inicio: number | null;
  /** Tempo já contado antes da pausa atual, em ms. */
  acumulado: number;
}

const CRONO_ZERADO: Crono = { inicio: null, acumulado: 0 };

function decorrido(c: Crono, agora: number) {
  return c.acumulado + (c.inicio === null ? 0 : agora - c.inicio);
}

function formatarTempo(ms: number) {
  const total = Math.max(0, ms);
  const segundos = Math.floor(total / 1000);
  const decimos = Math.floor((total % 1000) / 100);
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")},${decimos}`;
}

function carregarMelhores(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const salvo = window.localStorage.getItem(BEST_TIMES_KEY);
    return salvo ? JSON.parse(salvo) : {};
  } catch {
    return {};
  }
}

function ChallengesPage() {
  const { adicionarEstrelas } = useApp();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [listeningId, setListeningId] = useState<string | null>(null);
  const [semSuporte, setSemSuporte] = useState(false);
  const [cronos, setCronos] = useState<Record<string, Crono>>({});
  const [melhores, setMelhores] = useState<Record<string, number>>(carregarMelhores);
  // Só serve para redesenhar o cronômetro enquanto alguma contagem roda.
  const [, setTick] = useState(0);
  const cronosRef = useRef(cronos);
  cronosRef.current = cronos;
  const melhoresRef = useRef(melhores);
  melhoresRef.current = melhores;

  const algumRodando = Object.values(cronos).some((c) => c.inicio !== null);

  useEffect(() => {
    if (!algumRodando) return;
    const id = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, [algumRodando]);

  useEffect(() => {
    try {
      window.localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(melhores));
    } catch {
      // ignora erros de storage (ex.: navegação privada)
    }
  }, [melhores]);

  // Só um cronômetro corre por vez: ao começar um, os outros pausam onde
  // estavam. `reiniciar` zera a contagem — é o que o botão de falar faz.
  const iniciarCrono = (id: string, reiniciar = false) => {
    setCronos((c) => {
      const agora = Date.now();
      const novos: Record<string, Crono> = {};
      for (const [outroId, outro] of Object.entries(c)) {
        novos[outroId] =
          outroId === id || outro.inicio === null
            ? outro
            : { inicio: null, acumulado: decorrido(outro, agora) };
      }
      const atual = c[id] ?? CRONO_ZERADO;
      if (reiniciar) novos[id] = { inicio: agora, acumulado: 0 };
      else if (atual.inicio === null) novos[id] = { ...atual, inicio: agora };
      else novos[id] = atual;
      return novos;
    });
  };

  const pausarCrono = (id: string) => {
    setCronos((c) => {
      const atual = c[id] ?? CRONO_ZERADO;
      if (atual.inicio === null) return c;
      return { ...c, [id]: { inicio: null, acumulado: decorrido(atual, Date.now()) } };
    });
  };

  const zerarCrono = (id: string) => setCronos((c) => ({ ...c, [id]: CRONO_ZERADO }));

  const comemorar = (id: string) => {
    // Para o cronômetro no instante do acerto e guarda o recorde pessoal.
    const atual = cronosRef.current[id] ?? CRONO_ZERADO;
    const tempo = decorrido(atual, Date.now());
    setCronos((c) => ({ ...c, [id]: { inicio: null, acumulado: tempo } }));
    const anterior = melhoresRef.current[id];
    const recorde = tempo > 0 && (anterior === undefined || tempo < anterior);
    if (recorde) setMelhores((m) => ({ ...m, [id]: tempo }));

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#c77dff"],
    });
    setTimeout(
      () =>
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.6 },
        }),
      250,
    );
    setDone((d) => ({ ...d, [id]: true }));
    adicionarEstrelas("desafios", 1);
    if (tempo > 0) {
      toast(recorde ? "Novo recorde!" : `Você levou ${formatarTempo(tempo)}`, {
        icon: recorde ? "🏆" : "⏱️",
      });
    }
  };

  const ouvirEVerificar = (t: (typeof tongueTwisters)[number]) => {
    if (listeningId) return;
    setListeningId(t.id);
    iniciarCrono(t.id, true);
    const started = ouvir({
      aceitar: (ouvido) => fraseCorresponde(ouvido, t.text),
      onResult: (transcript) => {
        if (fraseCorresponde(transcript, t.text)) {
          comemorar(t.id);
        } else {
          tocarErro();
          toast(
            transcript ? `Ouvi: "${transcript}". Vamos de novo!` : "Não ouvi nada. Tenta de novo!",
            {
              icon: "💪",
            },
          );
        }
      },
      onEnd: () => setListeningId(null),
    });
    if (!started) {
      setListeningId(null);
      setSemSuporte(true);
    }
  };

  const agora = Date.now();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Trava-Línguas</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Ouça, repita e celebre cada conquista! Use o cronômetro para se desafiar e bater seu
          próprio recorde.
        </p>
        {semSuporte && (
          <p className="mt-2 rounded-xl bg-warm/30 px-3 py-2 text-sm">
            Seu navegador não suporta reconhecimento de voz. Tente no Chrome do computador ou
            celular.
          </p>
        )}
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {tongueTwisters.map((t, i) => {
          const crono = cronos[t.id] ?? CRONO_ZERADO;
          const rodando = crono.inicio !== null;
          const tempo = decorrido(crono, agora);
          const melhor = melhores[t.id];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <Card className="flex h-full flex-col gap-4 p-6">
                <div className="grid grid-cols-[auto_1fr_auto] items-start gap-4">
                  <div
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-4xl"
                    style={{ background: "var(--primary-soft)" }}
                    aria-hidden="true"
                  >
                    {t.emoji}
                  </div>
                  <p className="min-w-0 font-display text-xl font-semibold leading-snug">
                    {t.text}
                  </p>
                  {done[t.id] && (
                    <span className="text-2xl" aria-label="Concluído">
                      ⭐
                    </span>
                  )}
                </div>
                <p className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                  💡 {t.hint}
                </p>

                <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-muted px-3 py-2">
                  <Timer
                    className={"h-5 w-5 shrink-0 " + (rodando ? "text-primary" : "")}
                    aria-hidden="true"
                  />
                  <span
                    className="font-display text-2xl font-bold tabular-nums"
                    aria-label={`Tempo: ${formatarTempo(tempo)}`}
                    aria-live="off"
                  >
                    {formatarTempo(tempo)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => (rodando ? pausarCrono(t.id) : iniciarCrono(t.id))}
                    className="h-9 rounded-xl"
                  >
                    {rodando ? (
                      <>
                        <Pause className="mr-1 h-4 w-4" /> Pausar
                      </>
                    ) : (
                      <>
                        <Play className="mr-1 h-4 w-4" /> Iniciar
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => zerarCrono(t.id)}
                    className="h-9 rounded-xl"
                    aria-label="Zerar cronômetro"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  {melhor !== undefined && (
                    <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-success">
                      <Trophy className="h-4 w-4" /> {formatarTempo(melhor)}
                    </span>
                  )}
                </div>

                <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => falar(t.text, { rate: 0.75 })}
                    className="h-12 flex-1 rounded-2xl text-base"
                  >
                    <Volume2 className="mr-2 h-5 w-5" /> Ouvir
                  </Button>
                  <Button
                    onClick={() => ouvirEVerificar(t)}
                    disabled={listeningId === t.id}
                    className="h-12 flex-1 rounded-2xl text-base"
                  >
                    {listeningId === t.id ? (
                      <>
                        <Mic className="mr-2 h-5 w-5 animate-pulse text-red-500" /> Ouvindo...
                      </>
                    ) : done[t.id] ? (
                      <>
                        <PartyPopper className="mr-2 h-5 w-5" /> Consegui! Falar de novo
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-5 w-5" /> Falar e verificar
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
