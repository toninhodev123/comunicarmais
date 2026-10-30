import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "motion/react";
import { Eye, Mic, SkipForward, Volume2 } from "lucide-react";
import { phonemes, type Phoneme } from "@/lib/data/phonemes";
import { bancosDeAudio } from "@/lib/data/audios";
import {
  falar,
  fraseCorresponde,
  ouvir,
  proximidadeDaFrase,
  slugDeTexto,
  tocarErro,
  tocarSucesso,
} from "@/lib/voz";
import { fraseDeIncentivo } from "@/lib/incentivo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/nomear")({
  head: () => ({
    meta: [
      { title: "Que figura é essa? — Comunicar+" },
      {
        name: "description",
        content:
          "Só a figura na tela: a criança nomeia sozinha, sem a palavra escrita para copiar.",
      },
    ],
  }),
  component: NomearPage,
});

const RODADAS = 8;

/**
 * Só entram palavras com gravação — a criança precisa poder ouvir o modelo
 * quando trava, e sem isso o "ouvir a palavra" cairia na voz do navegador.
 */
function palavrasDoFonema(fonema: Phoneme) {
  return fonema.words.filter((w) =>
    Object.values(bancosDeAudio).some((lista) => lista.includes(slugDeTexto(w.word))),
  );
}

function NomearPage() {
  const { adicionarEstrelas } = useApp();
  const [fonemaId, setFonemaId] = useState(phonemes[0].id);
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [ouvindo, setOuvindo] = useState(false);
  const [mostrouPalavra, setMostrouPalavra] = useState(false);
  const [resultado, setResultado] = useState<"certo" | "quase" | null>(null);
  const [semSuporte, setSemSuporte] = useState(false);
  const escutando = useRef(false);

  const fonema = useMemo(() => phonemes.find((f) => f.id === fonemaId)!, [fonemaId]);
  const palavras = useMemo(() => palavrasDoFonema(fonema), [fonema]);
  const total = Math.min(RODADAS, palavras.length);
  const atual = palavras[indice % Math.max(1, palavras.length)];

  const trocarFonema = (id: string) => {
    setFonemaId(id);
    setIndice(0);
    setAcertos(0);
    setResultado(null);
    setMostrouPalavra(false);
  };

  const proxima = () => {
    setIndice((i) => i + 1);
    setResultado(null);
    setMostrouPalavra(false);
  };

  const falarPalavra = () => {
    if (escutando.current || !atual) return;
    setResultado(null);
    setOuvindo(true);
    escutando.current = true;
    const comecou = ouvir({
      aceitar: (parcial) => fraseCorresponde(parcial, atual.word),
      onResult: (transcricao) => {
        escutando.current = false;
        if (fraseCorresponde(transcricao, atual.word)) {
          setResultado("certo");
          setAcertos((a) => a + 1);
          adicionarEstrelas("nomear", 1);
          tocarSucesso();
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.7 } });
        } else {
          setResultado("quase");
          tocarErro();
          toast(fraseDeIncentivo(proximidadeDaFrase(transcricao, atual.word)), { icon: "💪" });
        }
      },
      onEnd: () => setOuvindo(false),
    });
    if (!comecou) {
      escutando.current = false;
      setOuvindo(false);
      setSemSuporte(true);
    }
  };

  if (!atual) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <Card className="p-8 text-center text-muted-foreground">
          Este fonema ainda não tem palavras gravadas.
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Que figura é essa?</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Só a figura aparece na tela. A criança precisa buscar a palavra sozinha — é o que mais se
          parece com falar de verdade, fora do app.
        </p>
        {semSuporte && (
          <p className="mt-2 rounded-xl bg-warm/30 px-3 py-2 text-sm">
            Seu navegador não suporta reconhecimento de voz. Tente no Chrome do computador ou do
            celular.
          </p>
        )}
      </header>

      {/* qual som treinar */}
      <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-2">
        {phonemes.map((f) => {
          const ativo = f.id === fonemaId;
          return (
            <button
              key={f.id}
              onClick={() => trocarFonema(f.id)}
              aria-pressed={ativo}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 font-display text-lg font-bold transition-transform hover:scale-105"
              style={{
                background: ativo ? f.color : "var(--card)",
                borderColor: f.color,
                color: ativo ? "white" : "inherit",
              }}
            >
              {f.letter}
            </button>
          );
        })}
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Progress value={((indice % total) / total) * 100} className="h-3 flex-1" />
        <span className="shrink-0 text-sm font-semibold text-muted-foreground">
          {acertos} ⭐ no {fonema.name}
        </span>
      </div>

      <Card className="p-6 text-center sm:p-10">
        <motion.p
          key={atual.word}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
          className="text-[7rem] leading-none sm:text-[9rem]"
          aria-label="Figura para nomear"
        >
          {atual.emoji}
        </motion.p>

        <div className="mt-4 min-h-[2.5rem]">
          <AnimatePresence mode="wait">
            {mostrouPalavra || resultado === "certo" ? (
              <motion.p
                key="palavra"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-3xl font-bold tracking-wide"
              >
                {atual.word}
              </motion.p>
            ) : (
              <motion.p key="?" className="font-display text-3xl font-bold text-muted-foreground">
                ? ? ?
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Button
          onClick={falarPalavra}
          disabled={ouvindo}
          className="mt-6 h-16 w-full rounded-2xl text-lg"
        >
          <Mic className="mr-2 h-6 w-6" />
          {ouvindo ? "Ouvindo…" : "Falar o nome"}
        </Button>

        {/* ajudas, na ordem em que um terapeuta ofereceria */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => setMostrouPalavra(true)}
            className="h-12 rounded-2xl"
          >
            <Eye className="mr-2 h-5 w-5" /> Ver a palavra
          </Button>
          <Button
            variant="outline"
            onClick={() => falar(atual.word, { rate: 0.8 })}
            className="h-12 rounded-2xl"
          >
            <Volume2 className="mr-2 h-5 w-5" /> Ouvir
          </Button>
        </div>

        <AnimatePresence>
          {resultado && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5"
            >
              {resultado === "certo" && (
                <p className="font-display text-xl font-bold text-success">É isso aí! ⭐</p>
              )}
              <Button onClick={proxima} className="mt-3 h-14 w-full rounded-2xl text-base">
                <SkipForward className="mr-2 h-5 w-5" /> Próxima figura
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {!resultado && (
          <button
            onClick={proxima}
            className="mt-4 text-sm font-semibold text-muted-foreground underline"
          >
            pular esta
          </button>
        )}
      </Card>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
        Dica para quem acompanha: deixe a criança tentar antes de oferecer a palavra. Se travar, a
        ordem que menos entrega a resposta é ouvir primeiro e só depois ver escrito.
      </p>
    </div>
  );
}
