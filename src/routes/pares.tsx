import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "motion/react";
import { Check, Ear, Lightbulb, Mic, RotateCcw, Volume2 } from "lucide-react";
import { minimalPairs, type ParMinimo, type PalavraDoPar } from "@/lib/data/minimalPairs";
import {
  falar,
  fraseCorresponde,
  ouvir,
  proximidadeDaFrase,
  tocarErro,
  tocarSucesso,
} from "@/lib/voz";
import { fraseDeIncentivo } from "@/lib/incentivo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/pares")({
  head: () => ({
    meta: [
      { title: "Pares Mínimos — Comunicar+" },
      {
        name: "description",
        content:
          "Duas palavras que mudam de sentido por um som só: escute qual foi dita e depois fale você.",
      },
    ],
  }),
  component: ParesPage,
});

/** Cada par tem duas etapas: primeiro escutar e apontar, depois falar. */
type Etapa = "escutar" | "falar";

function ParesPage() {
  const { adicionarEstrelas } = useApp();
  const [indice, setIndice] = useState(0);
  const [etapa, setEtapa] = useState<Etapa>("escutar");
  const [dita, setDita] = useState<PalavraDoPar | null>(null);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [acertou, setAcertou] = useState<boolean | null>(null);
  const [ouvindo, setOuvindo] = useState(false);
  const [semSuporte, setSemSuporte] = useState(false);
  const [feitos, setFeitos] = useState<Record<string, boolean>>({});
  const escutando = useRef(false);

  const par = minimalPairs[indice];
  const concluidos = Object.keys(feitos).length;

  const comemorar = () => {
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#c77dff"],
    });
    tocarSucesso();
  };

  const reiniciarRodada = () => {
    setDita(null);
    setEscolhida(null);
    setAcertou(null);
  };

  /** Sorteia uma das duas e fala — a criança só ouve, não vê qual foi. */
  const dizerUma = () => {
    const sorteada = Math.random() < 0.5 ? par.a : par.b;
    setDita(sorteada);
    setEscolhida(null);
    setAcertou(null);
    falar(sorteada.word, { rate: 0.85 });
  };

  const escolher = (palavra: PalavraDoPar) => {
    if (!dita || escolhida) return;
    setEscolhida(palavra.word);
    const certo = palavra.word === dita.word;
    setAcertou(certo);
    if (certo) {
      comemorar();
      adicionarEstrelas("pares", 1);
    } else {
      tocarErro();
      toast(fraseDeIncentivo(0.6), { icon: "👂" });
    }
  };

  /** Segunda etapa: a criança fala a palavra que está marcada na tela. */
  const falarPalavra = (alvo: PalavraDoPar) => {
    if (escutando.current) return;
    setEscolhida(alvo.word);
    setAcertou(null);
    setOuvindo(true);
    escutando.current = true;
    const comecou = ouvir({
      aceitar: (parcial) => fraseCorresponde(parcial, alvo.word),
      onResult: (transcricao) => {
        escutando.current = false;
        if (fraseCorresponde(transcricao, alvo.word)) {
          setAcertou(true);
          comemorar();
          adicionarEstrelas("pares", 1);
          setFeitos((f) => ({ ...f, [par.id]: true }));
        } else {
          setAcertou(false);
          tocarErro();
          toast(fraseDeIncentivo(proximidadeDaFrase(transcricao, alvo.word)), { icon: "💪" });
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

  const irPara = (i: number) => {
    setIndice((i + minimalPairs.length) % minimalPairs.length);
    setEtapa("escutar");
    reiniciarRodada();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Pares Mínimos</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Duas palavras que mudam de sentido por causa de um som só. Primeiro escute qual foi dita,
          depois fale você.
        </p>
        {semSuporte && (
          <p className="mt-2 rounded-xl bg-warm/30 px-3 py-2 text-sm">
            Seu navegador não suporta reconhecimento de voz. A parte de escutar funciona normalmente
            — para falar, tente no Chrome do computador ou do celular.
          </p>
        )}
      </header>

      <div className="mb-6 flex items-center gap-4">
        <Progress value={(concluidos / minimalPairs.length) * 100} className="h-3 flex-1" />
        <span className="shrink-0 text-sm font-semibold text-muted-foreground">
          {concluidos}/{minimalPairs.length} pares
        </span>
      </div>

      <Card className="p-6 sm:p-8">
        {/* qual contraste está sendo treinado */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
              {par.contraste}
            </p>
            <p className="text-sm text-muted-foreground">
              {par.posicao === "inicio" ? "no começo da palavra" : "no meio da palavra"}
            </p>
          </div>
          {feitos[par.id] && (
            <span className="flex items-center gap-1.5 rounded-xl bg-success/15 px-3 py-1.5 text-sm font-bold text-success">
              <Check className="h-4 w-4" /> concluído
            </span>
          )}
        </div>

        <p className="mt-4 flex gap-2 rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warm-foreground" />
          {par.foco}
        </p>

        {/* alternador das duas etapas */}
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
          {(["escutar", "falar"] as const).map((e) => (
            <button
              key={e}
              onClick={() => {
                setEtapa(e);
                reiniciarRodada();
              }}
              aria-pressed={etapa === e}
              className={
                "flex h-11 min-w-0 items-center justify-center gap-2 rounded-xl px-2 text-sm font-bold transition-colors " +
                (etapa === e ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground")
              }
            >
              {e === "escutar" ? (
                <Ear className="h-4 w-4 shrink-0" />
              ) : (
                <Mic className="h-4 w-4 shrink-0" />
              )}
              {/* No celular não cabe a pergunta inteira. */}
              <span className="truncate sm:hidden">
                {e === "escutar" ? "1. Escutar" : "2. Falar"}
              </span>
              <span className="hidden truncate sm:inline">
                {e === "escutar" ? "1. Qual eu falei?" : "2. Agora fale você"}
              </span>
            </button>
          ))}
        </div>

        {/* as duas palavras */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[par.a, par.b].map((p) => {
            const marcada = escolhida === p.word;
            const certa = marcada && acertou === true;
            const errada = marcada && acertou === false;
            const revelada = etapa === "escutar" && acertou !== null && dita?.word === p.word;
            return (
              <motion.button
                key={p.word}
                whileTap={{ scale: 0.97 }}
                onClick={() => (etapa === "escutar" ? escolher(p) : falarPalavra(p))}
                disabled={etapa === "escutar" ? !dita || !!escolhida : ouvindo}
                className={
                  "flex flex-col items-center gap-2 rounded-3xl border-4 p-6 transition-colors disabled:opacity-60 " +
                  (certa
                    ? "border-success bg-success/10"
                    : errada
                      ? "border-warm bg-warm/20"
                      : revelada
                        ? "border-success/60 bg-success/5"
                        : "border-border bg-card hover:border-primary/50")
                }
              >
                <span className="text-6xl" aria-hidden="true">
                  {p.emoji}
                </span>
                <span className="font-display text-2xl font-bold">{p.word}</span>
                {etapa === "falar" && (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                    <Mic className="h-4 w-4" />
                    {ouvindo && marcada ? "ouvindo…" : "falar esta"}
                  </span>
                )}
                {revelada && !marcada && (
                  <span className="text-sm font-bold text-success">era esta</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* controles da etapa */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {etapa === "escutar" ? (
            <Button
              onClick={dizerUma}
              className="h-14 flex-1 rounded-2xl text-base"
              variant={dita && !escolhida ? "outline" : "default"}
            >
              <Volume2 className="mr-2 h-5 w-5" />
              {!dita ? "Falar uma das duas" : escolhida ? "Falar outra vez" : "Repetir"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                falar(par.a.word, { rate: 0.85 });
                setTimeout(() => falar(par.b.word, { rate: 0.85 }), 1200);
              }}
              className="h-14 flex-1 rounded-2xl text-base"
            >
              <Volume2 className="mr-2 h-5 w-5" /> Ouvir as duas
            </Button>
          )}
          {acertou !== null && (
            <Button
              variant="ghost"
              onClick={reiniciarRodada}
              className="h-14 rounded-2xl text-base"
            >
              <RotateCcw className="mr-2 h-5 w-5" /> De novo
            </Button>
          )}
        </div>

        <AnimatePresence>
          {etapa === "escutar" && acertou === true && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center font-display text-lg font-bold text-success"
            >
              Isso! Agora experimente falar você, na aba ao lado.
            </motion.p>
          )}
        </AnimatePresence>
      </Card>

      {/* navegar entre os pares */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <Button variant="outline" onClick={() => irPara(indice - 1)} className="h-12 rounded-2xl">
          Par anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          {indice + 1} de {minimalPairs.length}
        </span>
        <Button onClick={() => irPara(indice + 1)} className="h-12 rounded-2xl">
          Próximo par
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {minimalPairs.map((p: ParMinimo, i) => (
          <button
            key={p.id}
            onClick={() => irPara(i)}
            aria-pressed={i === indice}
            className={
              "rounded-xl px-3 py-1.5 text-xs font-bold transition-colors " +
              (i === indice
                ? "bg-primary text-primary-foreground"
                : feitos[p.id]
                  ? "bg-success/15 text-success"
                  : "bg-muted text-muted-foreground hover:text-foreground")
            }
          >
            {p.contraste}
          </button>
        ))}
      </div>
    </div>
  );
}
