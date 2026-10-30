import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lightbulb, Volume2 } from "lucide-react";
import { phonemes, silabasDe, type Position } from "@/lib/data/phonemes";
import { falar } from "@/lib/voz";
import { Reveal } from "@/components/landing/animacoes";

/**
 * O mesmo banco de palavras do app, aberto na landing: escolhe o fonema, lê a
 * instrução de boca e ouve as palavras com o som no início, no meio ou no fim.
 * É a parte de estudar de verdade — sem conta, com os áudios gravados.
 */

const POSICOES: { chave: Position | "todas"; rotulo: string }[] = [
  { chave: "todas", rotulo: "Todas" },
  { chave: "inicio", rotulo: "No início" },
  { chave: "meio", rotulo: "No meio" },
  { chave: "fim", rotulo: "No fim" },
];

export function ExploradorDeFonemas() {
  const [fonemaId, setFonemaId] = useState(phonemes[0].id);
  const [posicao, setPosicao] = useState<Position | "todas">("todas");
  const [tocando, setTocando] = useState<string | null>(null);

  const fonema = useMemo(() => phonemes.find((f) => f.id === fonemaId)!, [fonemaId]);
  const palavras = useMemo(
    () =>
      (posicao === "todas"
        ? fonema.words
        : fonema.words.filter((w) => w.position === posicao)
      ).slice(0, 12),
    [fonema, posicao],
  );

  const contagem = (p: Position) => fonema.words.filter((w) => w.position === p).length;

  const ouvir = (palavra: string) => {
    setTocando(palavra);
    falar(palavra);
    setTimeout(() => setTocando((atual) => (atual === palavra ? null : atual)), 1800);
  };

  return (
    <section id="estudar" className="scroll-mt-20 border-y border-border bg-card/40 py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Experimente o método
          </span>
          <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight sm:text-5xl">
            Escolha um som e treine como na terapia
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Este é um exemplo do Banco de Palavras, como funciona no aplicativo: a instrução de
            boca, a dica e as palavras com o som em cada posição da sílaba. Toque numa palavra para
            ouvir — no app a experiência é bem melhor.
          </p>
        </Reveal>

        <Reveal atraso={0.1}>
          <div className="mt-10 rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-8">
            {/* os 13 fonemas */}
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
              {phonemes.map((f) => {
                const ativo = f.id === fonemaId;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFonemaId(f.id);
                      setPosicao("todas");
                    }}
                    aria-pressed={ativo}
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 font-display text-xl font-bold transition-transform hover:scale-105"
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

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] [&>*]:min-w-0">
              {/* instrução de boca */}
              <motion.div
                key={fonema.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="h-fit rounded-3xl p-6"
                style={{ background: fonema.color + "26" }}
              >
                <p className="font-display text-sm font-bold uppercase tracking-wider">
                  {fonema.name}
                </p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {fonema.classification}
                </p>
                <p className="mt-3 text-base leading-relaxed">{fonema.mouthInstruction}</p>
                <p className="mt-4 flex gap-2 rounded-2xl bg-card px-4 py-3 text-sm">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warm-foreground" />
                  {fonema.mouthTip}
                </p>
                <button
                  onClick={() => ouvir(silabasDe(fonema))}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-card text-base font-bold shadow-sm transition-transform hover:scale-[1.02]"
                >
                  <Volume2 className="h-5 w-5" /> Ouvir as sílabas
                </button>
              </motion.div>

              {/* palavras por posição */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {POSICOES.map((p) => {
                    const ativo = p.chave === posicao;
                    const total =
                      p.chave === "todas" ? fonema.words.length : contagem(p.chave as Position);
                    return (
                      <button
                        key={p.chave}
                        onClick={() => setPosicao(p.chave)}
                        aria-pressed={ativo}
                        className={
                          "rounded-xl px-4 py-2 text-sm font-semibold transition-colors " +
                          (ativo
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground")
                        }
                      >
                        {p.rotulo} · {total}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {palavras.map((w) => (
                      <motion.button
                        key={w.word + w.position}
                        layout
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => ouvir(w.word)}
                        className={
                          "flex h-20 flex-col items-center justify-center rounded-2xl border-2 transition-colors " +
                          (tocando === w.word
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50")
                        }
                      >
                        <span className="text-2xl" aria-hidden="true">
                          {w.emoji}
                        </span>
                        <span className="mt-1 text-xs font-bold">{w.word}</span>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Amostra de {palavras.length} das {fonema.words.length} palavras deste fonema — no
                  aplicativo estão todas, com o microfone conferindo cada uma e as estrelinhas
                  contando.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
