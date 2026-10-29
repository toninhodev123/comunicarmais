import { motion, useReducedMotion } from "motion/react";
import type { MascotId } from "@/context/AppContext";
import type { ReactNode } from "react";

/**
 * Nina, Tito e Léo desenhados em SVG — no lugar dos emojis, que davam cara de
 * rascunho. Cada um tem partes com vida própria (piscada, orelha, asa, juba) e
 * fica parado quando o sistema pede menos movimento.
 */

/** Olhos que fecham de vez em quando, com ritmo próprio por mascote. */
function Piscada({
  children,
  intervalo = 4.4,
  atraso = 0,
}: {
  children: ReactNode;
  intervalo?: number;
  atraso?: number;
}) {
  const menosMovimento = useReducedMotion();
  if (menosMovimento) return <g>{children}</g>;
  return (
    <motion.g
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      animate={{ scaleY: [1, 1, 0.08, 1] }}
      transition={{
        duration: intervalo,
        times: [0, 0.93, 0.965, 1],
        repeat: Infinity,
        ease: "easeInOut",
        delay: atraso,
      }}
    >
      {children}
    </motion.g>
  );
}

/** Sombra macia no chão, igual para os três. */
function Chao() {
  return <ellipse cx="100" cy="196" rx="52" ry="9" fill="#2A2A3C" opacity="0.08" />;
}

export function Nina({ className }: { className?: string }) {
  const menosMovimento = useReducedMotion();
  const orelha = menosMovimento ? undefined : { rotate: [0, -5, 0, 3, 0] };
  const transicaoOrelha = { duration: 5.5, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Nina, a coelha">
      <defs>
        <linearGradient id="nina-pelo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFBF7" />
          <stop offset="100%" stopColor="#F3E3D7" />
        </linearGradient>
      </defs>
      <Chao />

      {/* orelhas, cada uma com seu balanço */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        animate={orelha}
        transition={transicaoOrelha}
      >
        <ellipse
          cx="78"
          cy="52"
          rx="15"
          ry="42"
          fill="url(#nina-pelo)"
          stroke="#E3CDBE"
          strokeWidth="2.5"
          transform="rotate(-9 78 52)"
        />
        <ellipse cx="78" cy="56" rx="7" ry="30" fill="#F7C2CE" transform="rotate(-9 78 56)" />
      </motion.g>
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        animate={orelha}
        transition={{ ...transicaoOrelha, delay: 0.7 }}
      >
        <ellipse
          cx="122"
          cy="52"
          rx="15"
          ry="42"
          fill="url(#nina-pelo)"
          stroke="#E3CDBE"
          strokeWidth="2.5"
          transform="rotate(9 122 52)"
        />
        <ellipse cx="122" cy="56" rx="7" ry="30" fill="#F7C2CE" transform="rotate(9 122 56)" />
      </motion.g>

      {/* corpo e patas */}
      <ellipse
        cx="100"
        cy="168"
        rx="40"
        ry="28"
        fill="url(#nina-pelo)"
        stroke="#E3CDBE"
        strokeWidth="2.5"
      />
      <ellipse cx="78" cy="186" rx="13" ry="8" fill="#FFFBF7" stroke="#E3CDBE" strokeWidth="2.5" />
      <ellipse cx="122" cy="186" rx="13" ry="8" fill="#FFFBF7" stroke="#E3CDBE" strokeWidth="2.5" />

      {/* cabeça */}
      <ellipse
        cx="100"
        cy="118"
        rx="52"
        ry="46"
        fill="url(#nina-pelo)"
        stroke="#E3CDBE"
        strokeWidth="2.5"
      />
      <circle cx="70" cy="132" r="9" fill="#F7A8BC" opacity="0.5" />
      <circle cx="130" cy="132" r="9" fill="#F7A8BC" opacity="0.5" />

      <Piscada intervalo={4.6}>
        <ellipse cx="84" cy="112" rx="6.5" ry="8.5" fill="#2E2A3B" />
        <ellipse cx="116" cy="112" rx="6.5" ry="8.5" fill="#2E2A3B" />
      </Piscada>
      <circle cx="86.5" cy="108.5" r="2.4" fill="#fff" />
      <circle cx="118.5" cy="108.5" r="2.4" fill="#fff" />

      {/* focinho */}
      <ellipse cx="92" cy="134" rx="10" ry="8" fill="#FFFDFB" opacity="0.9" />
      <ellipse cx="108" cy="134" rx="10" ry="8" fill="#FFFDFB" opacity="0.9" />
      <path d="M100 124 l6 5 -6 5 -6 -5 z" fill="#EC7E96" />
      <path
        d="M100 134 q-6 7 -12 3 M100 134 q6 7 12 3"
        stroke="#C9A693"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* bigodes */}
      <path
        d="M74 130 l-20 -5 M74 136 l-20 3 M126 130 l20 -5 M126 136 l20 3"
        stroke="#D9C2B2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Tito({ className }: { className?: string }) {
  const menosMovimento = useReducedMotion();

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Tito, o tucano">
      <defs>
        <linearGradient id="tito-corpo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3FBFB0" />
          <stop offset="100%" stopColor="#1E8E86" />
        </linearGradient>
        <linearGradient id="tito-bico" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFC24A" />
          <stop offset="70%" stopColor="#FF8A3C" />
          <stop offset="100%" stopColor="#F2654E" />
        </linearGradient>
      </defs>
      <Chao />

      {/* cauda */}
      <path d="M140 142 q28 12 34 32 q-24 -2 -38 -16 z" fill="#17776F" opacity="0.9" />

      {/* corpo */}
      <ellipse cx="104" cy="120" rx="48" ry="52" fill="url(#tito-corpo)" />
      <ellipse cx="114" cy="134" rx="31" ry="36" fill="#FFF6E4" opacity="0.95" />

      {/* asa que bate devagar */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "20% 20%" }}
        animate={menosMovimento ? undefined : { rotate: [0, -14, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M128 104 q34 10 30 44 q-24 6 -38 -16 z" fill="#17776F" />
        <path
          d="M134 116 q20 8 20 26"
          stroke="#3FBFB0"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </motion.g>

      {/* bico grande */}
      <path
        d="M66 102 q-44 4 -52 20 q22 20 54 16 q10 -18 -2 -36 z"
        fill="url(#tito-bico)"
        stroke="#E0572F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M22 118 q16 10 34 10"
        stroke="#E0572F"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* olho */}
      <circle cx="86" cy="94" r="15" fill="#FFF6E4" />
      <Piscada intervalo={3.8} atraso={0.4}>
        <circle cx="86" cy="94" r="7.5" fill="#2E2A3B" />
      </Piscada>
      <circle cx="89" cy="90.5" r="2.6" fill="#fff" />

      {/* pés */}
      <path
        d="M92 172 l0 14 M92 186 l-9 6 M92 186 l9 6 M118 172 l0 14 M118 186 l-9 6 M118 186 l9 6"
        stroke="#FF9F3C"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Leo({ className }: { className?: string }) {
  const menosMovimento = useReducedMotion();
  // A juba é feita de círculos em volta da cara; respira junto, como um todo.
  const jubas = Array.from({ length: 13 }, (_, i) => {
    const angulo = (i / 13) * Math.PI * 2;
    return { x: 100 + Math.cos(angulo) * 48, y: 112 + Math.sin(angulo) * 46, r: 17 + (i % 2) * 2 };
  });

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Léo, o leão">
      <defs>
        <linearGradient id="leo-juba" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7B64B" />
          <stop offset="100%" stopColor="#DE8B26" />
        </linearGradient>
        <linearGradient id="leo-cara" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE7BE" />
          <stop offset="100%" stopColor="#FFD39A" />
        </linearGradient>
      </defs>
      <Chao />

      {/* corpo */}
      <ellipse
        cx="100"
        cy="172"
        rx="38"
        ry="24"
        fill="#FFCE8E"
        stroke="#E8A95F"
        strokeWidth="2.5"
      />

      {/* orelhas */}
      <circle cx="62" cy="80" r="13" fill="#FFCE8E" stroke="#E8A95F" strokeWidth="2.5" />
      <circle cx="138" cy="80" r="13" fill="#FFCE8E" stroke="#E8A95F" strokeWidth="2.5" />

      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={menosMovimento ? undefined : { scale: [1, 1.035, 1], rotate: [0, 2, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {jubas.map((j, i) => (
          <circle key={i} cx={j.x} cy={j.y} r={j.r} fill="url(#leo-juba)" />
        ))}
        <circle cx="100" cy="112" r="52" fill="url(#leo-juba)" />
      </motion.g>

      {/* cara */}
      <circle cx="100" cy="112" r="40" fill="url(#leo-cara)" />
      <circle cx="74" cy="126" r="8" fill="#F7A8BC" opacity="0.45" />
      <circle cx="126" cy="126" r="8" fill="#F7A8BC" opacity="0.45" />

      <Piscada intervalo={5.2} atraso={0.9}>
        <ellipse cx="86" cy="106" rx="6" ry="8" fill="#2E2A3B" />
        <ellipse cx="114" cy="106" rx="6" ry="8" fill="#2E2A3B" />
      </Piscada>
      <circle cx="88" cy="102.5" r="2.3" fill="#fff" />
      <circle cx="116" cy="102.5" r="2.3" fill="#fff" />

      {/* focinho */}
      <ellipse cx="92" cy="130" rx="12" ry="9.5" fill="#FFF6E8" />
      <ellipse cx="108" cy="130" rx="12" ry="9.5" fill="#FFF6E8" />
      <path d="M100 118 l7 6 -7 6 -7 -6 z" fill="#8A5A3B" />
      <path
        d="M100 130 q-7 8 -14 3 M100 130 q7 8 14 3"
        stroke="#B98A5E"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M78 126 l-16 -4 M78 132 l-16 2 M122 126 l16 -4 M122 132 l16 2"
        stroke="#E8C39A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const MASCOTES: Record<MascotId, (props: { className?: string }) => React.ReactElement> = {
  nina: Nina,
  tito: Tito,
  leo: Leo,
};

/** Desenha o mascote certo a partir do id usado no app. */
export function Mascote({ id, className }: { id: MascotId; className?: string }) {
  const Desenho = MASCOTES[id];
  return <Desenho className={className} />;
}
