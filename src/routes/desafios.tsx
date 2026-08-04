import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { Volume2, PartyPopper, Mic } from "lucide-react";
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
      { name: "description", content: "Trava-línguas com celebração e verificação por voz." },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const { adicionarEstrelas } = useApp();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [listeningId, setListeningId] = useState<string | null>(null);
  const [semSuporte, setSemSuporte] = useState(false);

  const comemorar = (id: string) => {
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
  };

  const ouvirEVerificar = (t: (typeof tongueTwisters)[number]) => {
    if (listeningId) return;
    setListeningId(t.id);
    const started = ouvir({
      onResult: (transcript) => {
        if (fraseCorresponde(transcript, t.text)) {
          comemorar(t.id);
        } else {
          tocarErro();
          toast("Quase! Vamos repetir até acertar.", { icon: "💪" });
        }
      },
      onEnd: () => setListeningId(null),
    });
    if (!started) {
      setListeningId(null);
      setSemSuporte(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Trava-Línguas</h1>
        <p className="mt-2 text-lg text-muted-foreground">Ouça, repita e celebre cada conquista!</p>
        {semSuporte && (
          <p className="mt-2 rounded-xl bg-warm/30 px-3 py-2 text-sm">
            Seu navegador não suporta reconhecimento de voz. Tente no Chrome do computador ou
            celular.
          </p>
        )}
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {tongueTwisters.map((t, i) => (
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
                <p className="min-w-0 font-display text-xl font-semibold leading-snug">{t.text}</p>
                {done[t.id] && (
                  <span className="text-2xl" aria-label="Concluído">
                    ⭐
                  </span>
                )}
              </div>
              <p className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                💡 {t.hint}
              </p>
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
        ))}
      </div>
    </div>
  );
}
