import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Mic, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import { falar, fraseCorresponde, limiteDaFrase, ouvir, proximidadeDaFrase } from "@/lib/voz";
import { fraseDeIncentivo } from "@/lib/incentivo";
import { Reveal } from "@/components/landing/animacoes";

/**
 * O microfone do app funcionando aqui na landing: a pessoa ouve a palavra,
 * fala, e vê na hora se o app entendeu — o mesmo reconhecimento das atividades,
 * com a mesma tolerância. É a melhor forma de mostrar o produto antes da conta.
 */

const PALAVRAS = [
  { palavra: "BORBOLETA", emoji: "🦋", fonema: "R no meio" },
  { palavra: "GIRASSOL", emoji: "🌻", fonema: "S no meio" },
  { palavra: "CHOCOLATE", emoji: "🍫", fonema: "CH no início" },
  { palavra: "ELEFANTE", emoji: "🐘", fonema: "F no meio" },
  { palavra: "BICICLETA", emoji: "🚲", fonema: "B no início" },
  { palavra: "MORANGO", emoji: "🍓", fonema: "R no meio" },
];

type Estado = "parado" | "ouvindo" | "acertou" | "errou";

export function TesteDeMicrofone() {
  const [indice, setIndice] = useState(0);
  const [estado, setEstado] = useState<Estado>("parado");
  const [incentivo, setIncentivo] = useState("");
  const [temMicrofone, setTemMicrofone] = useState(true);
  const escutando = useRef(false);

  const atual = PALAVRAS[indice];

  // Trocar de palavra no meio da escuta deixaria o resultado anterior na tela.
  useEffect(() => {
    setEstado("parado");
  }, [indice]);

  const conferir = (transcricao: string) => {
    escutando.current = false;
    if (fraseCorresponde(transcricao, atual.palavra)) {
      setEstado("acertou");
      return;
    }
    // Errou: nunca devolvemos o que o microfone entendeu — vem um empurrão.
    setIncentivo(fraseDeIncentivo(proximidadeDaFrase(transcricao, atual.palavra)));
    setEstado("errou");
  };

  const comecar = () => {
    if (escutando.current) return;
    setEstado("ouvindo");
    escutando.current = true;
    const limite = limiteDaFrase(atual.palavra);
    const comecou = ouvir({
      onResult: conferir,
      // Aceita assim que a palavra aparece, sem esperar o silêncio.
      aceitar: (parcial) => fraseCorresponde(parcial, atual.palavra, limite),
      onError: () => {
        escutando.current = false;
        setEstado("parado");
        setTemMicrofone(false);
      },
    });
    if (!comecou) {
      escutando.current = false;
      setEstado("parado");
      setTemMicrofone(false);
    }
  };

  return (
    <section id="testar" className="scroll-mt-20 border-y border-border bg-card/40 py-14 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-4">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Funciona assim
          </span>
          <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight sm:text-5xl">
            Fale uma palavra e veja o app conferir
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            É o mesmo microfone das atividades, com a mesma tolerância: ele aceita a palavra assim
            que ouve, sem esperar o silêncio, e perdoa um pedacinho. Nada é gravado — a fala vira
            texto no próprio navegador e some em seguida.
          </p>
        </Reveal>

        <Reveal atraso={0.1} y={40}>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.85fr] [&>*]:min-w-0">
            {/* o treino */}
            <div className="rounded-[2rem] border border-border bg-card p-6 text-center shadow-sm sm:p-10">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {atual.fonema}
              </p>
              <p className="mt-4 text-6xl sm:text-7xl" aria-hidden="true">
                {atual.emoji}
              </p>
              <p className="mt-3 font-display text-3xl font-bold tracking-wide sm:text-4xl">
                {atual.palavra}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => falar(atual.palavra)}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-border px-6 text-base font-bold transition-colors hover:border-primary/60"
                >
                  <Volume2 className="h-5 w-5" /> Ouvir primeiro
                </button>
                <button
                  onClick={comecar}
                  disabled={estado === "ouvindo"}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-base font-bold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02] disabled:opacity-70"
                >
                  <Mic className="h-5 w-5" />
                  {estado === "ouvindo" ? "Ouvindo…" : "Falar e conferir"}
                </button>
              </div>

              {/* resultado */}
              <div className="mt-6 min-h-[88px]">
                <AnimatePresence mode="wait">
                  {estado === "ouvindo" && (
                    <motion.div
                      key="ouvindo"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="flex items-end gap-1" aria-hidden="true">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 rounded-full bg-primary"
                            animate={{ height: [8, 26, 8] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.1,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Pode falar, estou ouvindo.</p>
                    </motion.div>
                  )}

                  {(estado === "acertou" || estado === "errou") && (
                    <motion.div
                      key={estado}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <span
                        className={
                          "flex items-center gap-2 rounded-2xl px-5 py-3 font-display text-lg font-bold " +
                          (estado === "acertou"
                            ? "bg-success/15 text-success"
                            : "bg-warm/25 text-warm-foreground")
                        }
                      >
                        {estado === "acertou" ? (
                          <>
                            <Check className="h-5 w-5" /> Falou certo!
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" /> {incentivo}
                          </>
                        )}
                      </span>
                      <button
                        onClick={comecar}
                        className="mt-1 flex items-center gap-1.5 text-sm font-bold text-primary"
                      >
                        <RotateCcw className="h-4 w-4" /> falar de novo
                      </button>
                    </motion.div>
                  )}

                  {estado === "parado" && !temMicrofone && (
                    <motion.p
                      key="sem"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mx-auto max-w-sm text-sm text-muted-foreground"
                    >
                      Este navegador não liberou o microfone. No app a criança ainda treina ouvindo
                      e repetindo — a conferência automática é um extra, não a atividade inteira.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* escolher outra palavra */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
              <p className="font-display text-lg font-bold">Experimente outra</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Cada palavra treina um som numa posição diferente da sílaba.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {PALAVRAS.map((p, i) => (
                  <button
                    key={p.palavra}
                    onClick={() => setIndice(i)}
                    aria-pressed={i === indice}
                    className={
                      "flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 transition-colors " +
                      (i === indice
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50")
                    }
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {p.emoji}
                    </span>
                    <span className="text-[11px] font-bold">{p.palavra}</span>
                  </button>
                ))}
              </div>
              <p className="mt-5 rounded-2xl bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                No app são 289 palavras assim, divididas em 13 fonemas, e a criança ganha estrelinha
                a cada acerto. Aqui é só uma amostra, sem conta e sem cadastro.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
