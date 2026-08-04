import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Volume2, MessageCircleQuestion, Star, Mic } from "lucide-react";
import { phonemes, type Position } from "@/lib/data/phonemes";
import { falar, ouvir, palavraCorresponde, tocarSucesso, tocarErro } from "@/lib/voz";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/fonemas")({
  head: () => ({
    meta: [
      { title: "Banco de Fonemas — Comunicar+" },
      { name: "description", content: "Treine fonemas com palavras do cotidiano e pictogramas." },
    ],
  }),
  component: PhonemesPage,
});

const positions: { key: Position | "todas"; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "inicio", label: "Início" },
  { key: "meio", label: "Meio" },
  { key: "fim", label: "Fim" },
];

function PhonemesPage() {
  const { adicionarEstrelas, starsByArea } = useApp();
  const [selectedId, setSelectedId] = useState(phonemes[0].id);
  const [position, setPosition] = useState<Position | "todas">("todas");
  const [openMouth, setOpenMouth] = useState(false);
  const [acertadas, setAcertadas] = useState<Record<string, boolean>>({});
  const [listeningWord, setListeningWord] = useState<string | null>(null);
  const [semSuporte, setSemSuporte] = useState(false);

  const acertou = (word: string) => {
    if (acertadas[word]) return;
    setAcertadas((a) => ({ ...a, [word]: true }));
    adicionarEstrelas("fonemas", 1);
  };

  const ouvirEVerificar = (word: string) => {
    if (listeningWord) return;
    setListeningWord(word);
    const started = ouvir({
      onResult: (transcript) => {
        if (palavraCorresponde(transcript, word)) {
          acertou(word);
          tocarSucesso();
        } else {
          tocarErro();
          toast("Quase! Tente falar de novo.", { icon: "💪" });
        }
      },
      onEnd: () => setListeningWord(null),
    });
    if (!started) {
      setListeningWord(null);
      setSemSuporte(true);
    }
  };

  const selected = useMemo(() => phonemes.find((p) => p.id === selectedId)!, [selectedId]);
  const filtered = useMemo(
    () =>
      position === "todas" ? selected.words : selected.words.filter((w) => w.position === position),
    [selected, position],
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Banco de Fonemas</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Escolha um som, ouça e veja como mexer a boca.
          </p>
          {semSuporte && (
            <p className="mt-2 rounded-xl bg-warm/30 px-3 py-2 text-sm">
              Seu navegador não suporta reconhecimento de voz. Tente no Chrome do computador ou
              celular.
            </p>
          )}
        </div>
        <Badge
          variant="secondary"
          className="flex shrink-0 items-center gap-1 px-3 py-1.5 text-base"
        >
          <Star className="h-4 w-4 fill-current" /> {starsByArea.fonemas ?? 0}
        </Badge>
      </header>

      <section aria-label="Escolha do fonema" className="mb-6">
        <h2 className="sr-only">Fonemas</h2>
        <div className="flex flex-wrap gap-3">
          {phonemes.map((p) => {
            const active = p.id === selectedId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedId(p.id);
                  setPosition("todas");
                }}
                aria-pressed={active}
                className="big-tap relative grid h-16 w-16 place-items-center rounded-2xl border-2 text-2xl font-bold transition-transform hover:scale-105"
                style={{
                  background: active ? p.color : "var(--card)",
                  borderColor: p.color,
                  color: active ? "white" : "inherit",
                }}
              >
                {p.letter}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-base font-semibold">Posição do som:</span>
        {positions.map((p) => (
          <Button
            key={p.key}
            variant={position === p.key ? "default" : "outline"}
            onClick={() => setPosition(p.key)}
            className="h-12 rounded-2xl px-5 text-base"
          >
            {p.label}
          </Button>
        ))}
        <Button
          variant="secondary"
          onClick={() => setOpenMouth(true)}
          className="ml-auto h-12 rounded-2xl px-5 text-base"
        >
          <MessageCircleQuestion className="mr-2 h-5 w-5" />
          Como mexer a boca?
        </Button>
      </section>

      <motion.div
        key={selected.id + position}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.length === 0 && (
          <p className="col-span-full rounded-2xl bg-muted p-6 text-center text-muted-foreground">
            Nenhuma palavra com o som nessa posição. Tente outra!
          </p>
        )}
        {filtered.map((w) => (
          <Card key={w.word} className="overflow-hidden p-0">
            <div
              className="grid h-40 place-items-center text-7xl"
              style={{ background: selected.color + "22" }}
              aria-hidden="true"
            >
              {w.emoji}
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-3xl font-bold tracking-wide">{w.word}</p>
                <div className="flex items-center gap-2">
                  {acertadas[w.word] && (
                    <Star
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      aria-label="Acertou"
                    />
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {w.position === "inicio" ? "Início" : w.position === "meio" ? "Meio" : "Fim"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => falar(w.word)}
                  className="h-12 flex-1 rounded-2xl text-base"
                  style={{ background: selected.color, color: "white" }}
                >
                  <Volume2 className="mr-2 h-5 w-5" /> Ouvir
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOpenMouth(true)}
                  className="h-12 rounded-2xl"
                  aria-label={`Como mexer a boca para ${selected.letter}`}
                >
                  👄
                </Button>
              </div>
              <Button
                variant={acertadas[w.word] ? "secondary" : "default"}
                onClick={() => ouvirEVerificar(w.word)}
                disabled={listeningWord === w.word}
                className="h-12 w-full rounded-2xl text-base"
              >
                {listeningWord === w.word ? (
                  <>
                    <Mic className="mr-2 h-5 w-5 animate-pulse text-red-500" /> Ouvindo...
                  </>
                ) : acertadas[w.word] ? (
                  <>
                    <Star className="mr-2 h-5 w-5 fill-current" /> Acertou! Falar de novo
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" /> Falar e verificar
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </motion.div>

      <Dialog open={openMouth} onOpenChange={setOpenMouth}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Como mexer a boca — {selected.name}</DialogTitle>
            <DialogDescription className="text-base">{selected.mouthInstruction}</DialogDescription>
          </DialogHeader>
          <div
            className="my-4 grid h-48 place-items-center rounded-3xl text-8xl"
            style={{ background: selected.color + "22" }}
            aria-hidden="true"
          >
            👄
          </div>
          <p className="rounded-2xl bg-warm/30 p-4 text-base">
            <strong>Dica:</strong> {selected.mouthTip}
          </p>
          <Button
            onClick={() =>
              falar(selected.letter + "a, " + selected.letter + "e, " + selected.letter + "i", {
                rate: 0.7,
              })
            }
            className="h-12 rounded-2xl text-base"
          >
            <Volume2 className="mr-2 h-5 w-5" />
            Ouvir o som
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
