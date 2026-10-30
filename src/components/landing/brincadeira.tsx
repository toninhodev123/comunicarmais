import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Hand, Star, Volume2 } from "lucide-react";
import { mascots, type MascotId } from "@/context/AppContext";
import { Mascote, type Olhar } from "@/components/landing/mascotes";
import { Reveal } from "@/components/landing/animacoes";

/**
 * A parte de brincar da landing: os três mascotes ficam soltos numa cena,
 * olham para o ponteiro, pulam e falam uma palavra quando recebem uma
 * cutucada, e podem ser arrastados. Tudo com os áudios que o app já tem —
 * nada de voz sintetizada na hora.
 */

/** Palavras com gravação nos dois bancos de voz. */
const PALAVRAS = [
  "borboleta",
  "abacaxi",
  "girassol",
  "chocolate",
  "elefante",
  "bicicleta",
  "tartaruga",
  "melancia",
  "dinossauro",
  "capivara",
  "morango",
  "pipoca",
  "girafa",
  "foca",
  "sapato",
  "janela",
];

/** Cada bichinho fala com a voz que combina com ele. */
const VOZ_DO_MASCOTE: Record<MascotId, "feminina" | "masculina"> = {
  nina: "feminina",
  tito: "masculina",
  leo: "masculina",
};

interface Faisca {
  id: number;
  x: number;
  desvio: number;
}

export function Brincadeira() {
  const cena = useRef<HTMLDivElement>(null);
  const menosMovimento = useReducedMotion();
  const [olhar, setOlhar] = useState<Olhar>({ x: 0, y: 0 });
  const [falando, setFalando] = useState<MascotId | null>(null);
  const [palavra, setPalavra] = useState<string | null>(null);
  const [faiscas, setFaiscas] = useState<Faisca[]>([]);
  const [conta, setConta] = useState(0);
  const proximaFaisca = useRef(0);

  // Os olhos seguem o ponteiro dentro da cena; sem ponteiro, voltam ao centro.
  const aoMover = (evento: React.PointerEvent<HTMLDivElement>) => {
    const area = cena.current?.getBoundingClientRect();
    if (!area) return;
    const x = ((evento.clientX - area.left) / area.width) * 2 - 1;
    const y = ((evento.clientY - area.top) / area.height) * 2 - 1;
    setOlhar({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  const cutucar = (id: MascotId, evento: React.PointerEvent<HTMLDivElement>) => {
    const escolhida = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
    setPalavra(escolhida);
    setFalando(id);
    setConta((n) => n + 1);

    const audio = new Audio(`/audio/${VOZ_DO_MASCOTE[id]}/${escolhida}.mp3`);
    void audio.play().catch(() => {});
    audio.onended = () => setFalando((atual) => (atual === id ? null : atual));

    // Estrelinhas saindo do ponto tocado.
    const area = cena.current?.getBoundingClientRect();
    const x = area ? evento.clientX - area.left : 0;
    const novas = Array.from({ length: 5 }, () => ({
      id: proximaFaisca.current++,
      x,
      desvio: (Math.random() - 0.5) * 90,
    }));
    setFaiscas((f) => [...f, ...novas]);
    setTimeout(() => {
      setFaiscas((f) => f.filter((item) => !novas.some((n) => n.id === item.id)));
    }, 1000);
  };

  // Some o balão da fala sozinho, caso o áudio não avise.
  useEffect(() => {
    if (!palavra) return;
    const t = setTimeout(() => {
      setPalavra(null);
      setFalando(null);
    }, 2600);
    return () => clearTimeout(t);
  }, [palavra]);

  // No celular o Léo sobe um pouco: lá embaixo ele ficava atrás do contador.
  const posicoes = [
    "left-[6%] bottom-[12%]",
    "left-[36%] bottom-[34%] sm:bottom-[30%]",
    "right-[5%] bottom-[24%] sm:bottom-[10%]",
  ];
  const tamanhos = [
    "h-28 w-28 sm:h-40 sm:w-40",
    "h-24 w-24 sm:h-32 sm:w-32",
    "h-28 w-28 sm:h-40 sm:w-40",
  ];

  return (
    <section id="brincar" className="scroll-mt-20 px-4 py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Pode mexer, é de brincar
          </span>
          <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight sm:text-5xl">
            Cutuque um bichinho e ouça ele falar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Eles acompanham o seu dedo com o olhar, pulam quando tocados e falam uma palavra com a
            mesma voz gravada que a criança ouve no app. Dá para arrastar os três pela cena.
          </p>
        </Reveal>

        <Reveal atraso={0.1} y={40}>
          <div
            ref={cena}
            onPointerMove={aoMover}
            onPointerLeave={() => setOlhar({ x: 0, y: 0 })}
            className="relative mt-10 h-[340px] touch-pan-y overflow-hidden rounded-[2.5rem] border border-border shadow-inner sm:h-[440px]"
            style={{ background: "var(--primary-soft)" }}
          >
            {/* chão e nuvens, só para a cena não ser um retângulo vazio */}
            <div
              className="absolute inset-x-0 bottom-0 h-24 rounded-b-[2.5rem] opacity-70"
              style={{ background: "oklch(0.88 0.08 150)" }}
              aria-hidden="true"
            />
            {[
              { cima: "12%", esq: "12%", tamanho: 90 },
              { cima: "22%", esq: "62%", tamanho: 120 },
              { cima: "8%", esq: "82%", tamanho: 70 },
            ].map((n, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-card/70 blur-[2px]"
                style={{ top: n.cima, left: n.esq, width: n.tamanho, height: n.tamanho * 0.45 }}
                animate={menosMovimento ? undefined : { x: [0, 18, 0] }}
                transition={{ duration: 10 + i * 3, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
            ))}

            <p className="absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-2 rounded-full bg-card/90 px-4 py-2 text-sm font-semibold shadow-sm">
              <Hand className="h-4 w-4 text-primary" /> Toque ou arraste os bichinhos
            </p>

            {mascots.map((m, i) => (
              <motion.div
                key={m.id}
                drag={!menosMovimento}
                dragConstraints={cena}
                dragElastic={0.18}
                dragMomentum={false}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.04 }}
                onPointerDown={(evento) => cutucar(m.id, evento)}
                animate={
                  falando === m.id && !menosMovimento ? { y: [0, -26, 0, -12, 0] } : { y: 0 }
                }
                transition={{ duration: 0.75, ease: "easeOut" }}
                className={"absolute cursor-grab active:cursor-grabbing " + posicoes[i]}
              >
                <div className="relative">
                  <AnimatePresence>
                    {falando === m.id && palavra && (
                      <motion.span
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.95 }}
                        className="absolute -top-10 left-1/2 w-max -translate-x-1/2 rounded-2xl bg-card px-3 py-1.5 font-display text-sm font-bold capitalize shadow-lg"
                      >
                        {palavra}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <Mascote
                    id={m.id}
                    olhar={olhar}
                    className={tamanhos[i] + " drop-shadow-lg [pointer-events:none]"}
                  />
                </div>
              </motion.div>
            ))}

            {/* estrelinhas da cutucada */}
            <AnimatePresence>
              {faiscas.map((f) => (
                <motion.span
                  key={f.id}
                  initial={{ opacity: 1, y: 0, x: f.x, scale: 0.6 }}
                  animate={{ opacity: 0, y: -90, x: f.x + f.desvio, scale: 1.1, rotate: 60 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="pointer-events-none absolute bottom-24 left-0"
                  aria-hidden="true"
                >
                  <Star className="h-6 w-6 fill-warm text-warm" />
                </motion.span>
              ))}
            </AnimatePresence>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl bg-card/90 px-3 py-2 shadow-sm sm:left-auto sm:right-4">
              <Volume2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">
                {conta === 0
                  ? "nenhuma palavra ainda"
                  : `${conta} ${conta === 1 ? "palavra" : "palavras"}`}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal atraso={0.16}>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            As palavras saem do mesmo banco de 920 áudios do app — Nina fala com a voz feminina,
            Tito e Léo com a masculina.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
