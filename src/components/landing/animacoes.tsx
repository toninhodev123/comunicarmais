import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";

/**
 * Peças de animação da landing. Tudo aqui respeita "reduzir movimento" do
 * sistema: quem pede menos animação recebe o conteúdo parado, sem perder nada.
 */

/** Aparece subindo quando entra na tela. `atraso` escalona itens de uma lista. */
export function Reveal({
  children,
  atraso = 0,
  className,
  y = 24,
}: {
  children: ReactNode;
  atraso?: number;
  className?: string;
  y?: number;
}) {
  const menosMovimento = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={menosMovimento ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Variantes para animar filhos em cascata dentro de um container revelado. */
export const cascata: Variants = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.08 } },
};

export const itemCascata: Variants = {
  oculto: { opacity: 0, y: 20 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/** Conta de 0 até `valor` quando o número entra na tela. */
export function Contador({ valor, sufixo = "" }: { valor: number; sufixo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const naTela = useInView(ref, { once: true, margin: "-60px" });
  const menosMovimento = useReducedMotion();
  const [mostrado, setMostrado] = useState(0);

  useEffect(() => {
    if (!naTela) return;
    if (menosMovimento) {
      setMostrado(valor);
      return;
    }
    const duracao = 1100;
    const inicio = performance.now();
    let frame = 0;
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / duracao);
      // Desacelera no fim, como um contador de placar.
      setMostrado(Math.round(valor * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(passo);
    };
    frame = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(frame);
  }, [naTela, valor, menosMovimento]);

  return (
    <span ref={ref} className="tabular-nums">
      {mostrado}
      {sufixo}
    </span>
  );
}

/** Fundo com manchas coloridas que respiram devagar atrás do conteúdo. */
export function Manchas({ className = "" }: { className?: string }) {
  const menosMovimento = useReducedMotion();
  const manchas = [
    { cor: "oklch(0.78 0.13 200)", tamanho: 420, x: "-10%", y: "-15%", atraso: 0 },
    { cor: "oklch(0.82 0.12 60)", tamanho: 360, x: "70%", y: "0%", atraso: 1.5 },
    { cor: "oklch(0.78 0.12 330)", tamanho: 320, x: "25%", y: "55%", atraso: 3 },
  ];
  return (
    <div className={"pointer-events-none absolute inset-0 overflow-hidden " + className}>
      {manchas.map((m, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            background: m.cor,
            width: m.tamanho,
            height: m.tamanho,
            left: m.x,
            top: m.y,
            opacity: 0.28,
          }}
          animate={
            menosMovimento ? undefined : { scale: [1, 1.12, 1], x: [0, 24, 0], y: [0, -18, 0] }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: m.atraso }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/** Faixa de palavras que desliza sem fim, pausando ao passar o mouse. */
export function Esteira({ itens }: { itens: string[] }) {
  const menosMovimento = useReducedMotion();
  const fila = [...itens, ...itens];
  return (
    <div className="group relative overflow-hidden py-2" aria-hidden="true">
      <div
        className={
          "flex w-max gap-3 group-hover:[animation-play-state:paused] " +
          (menosMovimento ? "" : "animate-[esteira_38s_linear_infinite]")
        }
      >
        {fila.map((palavra, i) => (
          <span
            key={`${palavra}-${i}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-base font-semibold capitalize shadow-sm"
          >
            {palavra}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
