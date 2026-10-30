import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "motion/react";
import { Check, Equal, Play, RotateCcw, Split } from "lucide-react";
import { minimalPairs } from "@/lib/data/minimalPairs";
import { falar, tocarErro, tocarSucesso } from "@/lib/voz";
import { fraseDeIncentivo } from "@/lib/incentivo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/discriminacao")({
  head: () => ({
    meta: [
      { title: "Igual ou Diferente — Comunicar+" },
      {
        name: "description",
        content: "Duas palavras seguidas: a criança diz se são a mesma ou se mudou um som.",
      },
    ],
  }),
  component: DiscriminacaoPage,
});

const RODADAS = 10;
const PAUSA_ENTRE_PALAVRAS = 1300;

interface Rodada {
  primeira: string;
  segunda: string;
  iguais: boolean;
  contraste: string;
}

function sortearRodada(): Rodada {
  const par = minimalPairs[Math.floor(Math.random() * minimalPairs.length)];
  const [x, y] = Math.random() < 0.5 ? [par.a, par.b] : [par.b, par.a];
  // Metade das vezes a mesma palavra duas vezes: sem isso a criança aprende a
  // responder "diferentes" sempre e acerta tudo sem ouvir nada.
  const iguais = Math.random() < 0.5;
  return {
    primeira: x.word,
    segunda: iguais ? x.word : y.word,
    iguais,
    contraste: par.contraste,
  };
}

function DiscriminacaoPage() {
  const { adicionarEstrelas } = useApp();
  const [rodada, setRodada] = useState<Rodada>(sortearRodada);
  const [numero, setNumero] = useState(1);
  const [acertos, setAcertos] = useState(0);
  const [tocando, setTocando] = useState<0 | 1 | 2>(0);
  const [respondeu, setRespondeu] = useState<boolean | null>(null);
  const [jaOuviu, setJaOuviu] = useState(false);
  const [fim, setFim] = useState(false);
  const temporizadores = useRef<number[]>([]);

  const limparTempos = () => {
    temporizadores.current.forEach(clearTimeout);
    temporizadores.current = [];
  };

  /** Toca as duas palavras com uma pausa no meio, destacando qual está soando. */
  const tocarAsDuas = () => {
    if (tocando) return;
    limparTempos();
    setJaOuviu(true);
    setTocando(1);
    falar(rodada.primeira, { rate: 0.85 });
    temporizadores.current.push(
      window.setTimeout(() => {
        setTocando(2);
        falar(rodada.segunda, { rate: 0.85 });
      }, PAUSA_ENTRE_PALAVRAS),
      window.setTimeout(() => setTocando(0), PAUSA_ENTRE_PALAVRAS * 2),
    );
  };

  const responder = (disseIguais: boolean) => {
    if (respondeu !== null || !jaOuviu) return;
    const certo = disseIguais === rodada.iguais;
    setRespondeu(certo);
    if (certo) {
      setAcertos((a) => a + 1);
      adicionarEstrelas("discriminacao", 1);
      tocarSucesso();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    } else {
      tocarErro();
      toast(fraseDeIncentivo(0.6), { icon: "👂" });
    }
  };

  const proxima = () => {
    limparTempos();
    if (numero >= RODADAS) {
      setFim(true);
      return;
    }
    setNumero((n) => n + 1);
    setRodada(sortearRodada());
    setRespondeu(null);
    setJaOuviu(false);
    setTocando(0);
  };

  const recomecar = () => {
    limparTempos();
    setRodada(sortearRodada());
    setNumero(1);
    setAcertos(0);
    setRespondeu(null);
    setJaOuviu(false);
    setTocando(0);
    setFim(false);
  };

  if (fim) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-6xl" aria-hidden="true">
            {acertos >= 8 ? "🏆" : acertos >= 5 ? "👏" : "💪"}
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold">
            {acertos} de {RODADAS}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {acertos >= 8
              ? "Ouvido afiado! A diferença entre os sons está bem clara."
              : acertos >= 5
                ? "Bom trabalho. Mais algumas rodadas e fica fácil."
                : "Ouvir a diferença é a parte mais difícil. Cada rodada ajuda."}
          </p>
          <Button onClick={recomecar} className="mt-6 h-14 w-full rounded-2xl text-base">
            <RotateCcw className="mr-2 h-5 w-5" /> Jogar de novo
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Igual ou Diferente</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Duas palavras, uma depois da outra. São a mesma, ou mudou um som? Aqui é só ouvir — não
          precisa falar nada.
        </p>
      </header>

      <div className="mb-6 flex items-center gap-4">
        <Progress value={((numero - 1) / RODADAS) * 100} className="h-3 flex-1" />
        <span className="shrink-0 text-sm font-semibold text-muted-foreground">
          {numero}/{RODADAS} · {acertos} ⭐
        </span>
      </div>

      <Card className="p-6 text-center sm:p-8">
        <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
          Rodada {numero}
        </p>

        {/* as duas bolinhas mostram qual palavra está soando */}
        <div className="mt-6 flex items-center justify-center gap-5">
          {[1, 2].map((n) => (
            <motion.div
              key={n}
              animate={tocando === n ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.6, repeat: tocando === n ? Infinity : 0 }}
              className={
                "grid h-20 w-20 place-items-center rounded-full border-4 font-display text-2xl font-bold transition-colors " +
                (tocando === n
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-muted text-muted-foreground")
              }
            >
              {n}
            </motion.div>
          ))}
        </div>

        <Button
          onClick={tocarAsDuas}
          disabled={!!tocando}
          className="mt-6 h-14 w-full rounded-2xl text-base"
          variant={jaOuviu ? "outline" : "default"}
        >
          <Play className="mr-2 h-5 w-5" />
          {tocando ? "ouvindo…" : jaOuviu ? "Ouvir de novo" : "Ouvir as duas palavras"}
        </Button>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { texto: "Iguais", valor: true, Icone: Equal },
            { texto: "Diferentes", valor: false, Icone: Split },
          ].map(({ texto, valor, Icone }) => {
            const escolheu = respondeu !== null;
            const estaCerta = valor === rodada.iguais;
            return (
              <motion.button
                key={texto}
                whileTap={{ scale: 0.97 }}
                onClick={() => responder(valor)}
                disabled={!jaOuviu || escolheu}
                className={
                  "flex h-24 flex-col items-center justify-center gap-2 rounded-3xl border-4 font-display text-lg font-bold transition-colors disabled:opacity-70 " +
                  (escolheu && estaCerta
                    ? "border-success bg-success/10 text-success"
                    : "border-border bg-card hover:border-primary/50")
                }
              >
                <Icone className="h-7 w-7" />
                {texto}
              </motion.button>
            );
          })}
        </div>

        {!jaOuviu && (
          <p className="mt-4 text-sm text-muted-foreground">Ouça as duas antes de responder.</p>
        )}

        <AnimatePresence>
          {respondeu !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5"
            >
              <p
                className={
                  "font-display text-xl font-bold " +
                  (respondeu ? "text-success" : "text-warm-foreground")
                }
              >
                {respondeu ? (
                  <>
                    <Check className="mr-1 inline h-5 w-5" /> Isso mesmo!
                  </>
                ) : (
                  "Eram " + (rodada.iguais ? "iguais" : "diferentes")
                )}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {rodada.iguais
                  ? `A mesma palavra duas vezes: ${rodada.primeira.toLowerCase()}.`
                  : `${rodada.primeira.toLowerCase()} e ${rodada.segunda.toLowerCase()} — o contraste é ${rodada.contraste}.`}
              </p>
              <Button onClick={proxima} className="mt-4 h-14 w-full rounded-2xl text-base">
                {numero >= RODADAS ? "Ver o resultado" : "Próxima rodada"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
