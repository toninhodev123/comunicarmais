import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Flame,
  Mic,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Volume2,
  WifiOff,
} from "lucide-react";
import { mascots } from "@/context/AppContext";
import { falar } from "@/lib/voz";
import { useScrollSuave } from "@/lib/scroll-suave";
import { Contador, Esteira, Manchas, Reveal } from "@/components/landing/animacoes";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Comunicar+ — treino de fala que a criança faz sozinha" },
      {
        name: "description",
        content:
          "Aplicativo de apoio fonoaudiológico: mascotes guias, estrelinhas por atividade e voz gravada de verdade. Fale, ouça e acompanhe o progresso todo dia.",
      },
    ],
  }),
  component: Landing,
});

/** Palavras que existem no banco de áudio — dá para ouvir de verdade. */
const PALAVRAS_VITRINE = [
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
  "guarda-chuva",
  "morango",
  "pipoca",
  "girafa",
];

const ATIVIDADES = [
  {
    nome: "Banco de Palavras",
    desc: "Trocas e posição silábica: o som no começo, no meio e no fim da palavra.",
    icone: Mic,
    cor: "oklch(0.78 0.14 30)",
  },
  {
    nome: "Vocabulário",
    desc: "Oito categorias com as partes de cada coisa — do carro ao corpo humano.",
    icone: BookOpen,
    cor: "oklch(0.78 0.13 240)",
  },
  {
    nome: "Memória Auditiva",
    desc: "Jogo estilo Genius só de ouvido: a sequência cresce a cada acerto.",
    icone: Brain,
    cor: "oklch(0.78 0.13 145)",
  },
  {
    nome: "Trava-Línguas",
    desc: "Doze desafios com cronômetro e recorde pessoal para bater.",
    icone: Sparkles,
    cor: "oklch(0.78 0.13 290)",
  },
  {
    nome: "Habilidades Sociais",
    desc: "Quinze frases do dia a dia: pedir, agradecer, convidar, consolar.",
    icone: Users,
    cor: "oklch(0.78 0.13 340)",
  },
];

const FACILIDADES = [
  {
    titulo: "Voz humana, não robô",
    desc: "920 áudios gravados com voz neural, feminina e masculina. A criança escolhe quem fala com ela.",
    icone: Volume2,
  },
  {
    titulo: "Botão grande, toque fácil",
    desc: "Tudo foi desenhado para dedo pequeno: alvos largos, letras grandes e nenhum menu escondido.",
    icone: Smartphone,
  },
  {
    titulo: "Sem anúncio, sem distração",
    desc: "Nada pisca fora de hora. A tela mostra uma coisa por vez — e só o que importa agora.",
    icone: WifiOff,
  },
  {
    titulo: "O microfone corrige na hora",
    desc: "Falou certo, a estrelinha vem na mesma hora. Falou diferente, o app mostra o que ouviu.",
    icone: Mic,
  },
];

const ESTILO_DIFICULDADE: Record<string, string> = {
  Fácil: "bg-success/15 text-success",
  Médio: "bg-warm/50 text-warm-foreground",
  Difícil: "bg-destructive/15 text-destructive",
};

function Landing() {
  useScrollSuave();

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background">
      <Topo />
      <Heroi />
      <VitrineDePalavras />
      <ComoFunciona />
      <Mascotes />
      <Pontuacao />
      <Atividades />
      <Facilidade />
      <ChamadaFinal />
      <Rodape />
    </div>
  );
}

function Topo() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-display text-xl font-bold">
          Comunicar<span className="text-primary">+</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex">
          <a href="#mascotes" className="transition-colors hover:text-foreground">
            Mascotes
          </a>
          <a href="#estrelinhas" className="transition-colors hover:text-foreground">
            Estrelinhas
          </a>
          <a href="#atividades" className="transition-colors hover:text-foreground">
            Atividades
          </a>
        </div>
        <Button asChild className="h-11 rounded-2xl px-5 text-base">
          <Link to="/entrar">Entrar</Link>
        </Button>
      </nav>
    </header>
  );
}

function Heroi() {
  const ref = useRef<HTMLDivElement>(null);
  const menosMovimento = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Cada mascote sobe num ritmo diferente: é o que dá a sensação de profundidade.
  const sobeDevagar = useTransform(scrollYProgress, [0, 1], [0, menosMovimento ? 0 : -70]);
  const sobeRapido = useTransform(scrollYProgress, [0, 1], [0, menosMovimento ? 0 : -140]);
  const [ouvindo, setOuvindo] = useState<string | null>(null);

  const ouvirPalavra = () => {
    const palavra = PALAVRAS_VITRINE[Math.floor(Math.random() * PALAVRAS_VITRINE.length)];
    setOuvindo(palavra);
    falar(palavra);
    setTimeout(() => setOuvindo(null), 2200);
  };

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-20 pt-28 sm:pb-28 sm:pt-36">
      <Manchas />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" /> Apoio fonoaudiológico que vira
              brincadeira
            </span>
          </Reveal>

          <Reveal atraso={0.08}>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] sm:text-6xl">
              Falar fica fácil
              <br />
              quando tem{" "}
              <span className="bg-gradient-to-r from-primary to-warm-foreground bg-clip-text text-transparent">
                um bichinho
              </span>{" "}
              torcendo junto.
            </h1>
          </Reveal>

          <Reveal atraso={0.16}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
              A criança escolhe o mascote guia, pratica os sons falando no microfone e junta
              estrelinhas em cada atividade. Simples assim — e ela consegue fazer sozinha.
            </p>
          </Reveal>

          <Reveal atraso={0.24}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-14 rounded-2xl px-7 text-lg">
                <Link to="/entrar">
                  Começar agora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={ouvirPalavra}
                className="h-14 rounded-2xl px-7 text-lg"
              >
                <Volume2 className="mr-2 h-5 w-5" />
                {ouvindo ? `Falando "${ouvindo}"...` : "Ouvir uma palavra"}
              </Button>
            </div>
          </Reveal>

          <Reveal atraso={0.32}>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                { valor: 920, sufixo: "", rotulo: "áudios gravados" },
                { valor: 5, sufixo: "", rotulo: "atividades" },
                { valor: 3, sufixo: "", rotulo: "mascotes guias" },
              ].map((e) => (
                <div key={e.rotulo}>
                  <dt className="font-display text-3xl font-bold text-primary sm:text-4xl">
                    <Contador valor={e.valor} sufixo={e.sufixo} />
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{e.rotulo}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="relative h-[360px] sm:h-[460px]">
          {mascots.map((m, i) => {
            const posicoes = [
              "left-[4%] top-[8%]",
              "right-[6%] top-[30%]",
              "left-[22%] bottom-[4%]",
            ];
            return (
              <motion.div
                key={m.id}
                style={{ y: i === 1 ? sobeRapido : sobeDevagar }}
                className={"absolute " + posicoes[i]}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 160,
                    damping: 14,
                    delay: 0.2 + i * 0.12,
                  }}
                >
                  <motion.div
                    animate={menosMovimento ? undefined : { y: [0, -14, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                    className="grid place-items-center rounded-[2rem] bg-card p-5 shadow-xl ring-1 ring-border sm:p-7"
                  >
                    <span className="text-6xl sm:text-7xl" aria-hidden="true">
                      {m.emoji}
                    </span>
                    <p className="mt-2 font-display text-base font-bold sm:text-lg">
                      {m.name.split(",")[0]}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-warm-foreground">
                      <Star className="h-4 w-4 fill-warm text-warm" /> {m.dailyGoal} por atividade
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VitrineDePalavras() {
  return (
    <section className="border-y border-border bg-card/40 py-8">
      <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Palavras que o app fala com voz de verdade
      </p>
      <Esteira itens={PALAVRAS_VITRINE} />
    </section>
  );
}

function ComoFunciona() {
  const passos = [
    {
      numero: "1",
      titulo: "Escolhe o bichinho",
      desc: "Nina, Tito ou Léo. A escolha define a meta de estrelinhas do dia — do mais tranquilo ao mais corajoso.",
      emoji: "🐰",
    },
    {
      numero: "2",
      titulo: "Ouve e fala",
      desc: "O app fala a palavra, a criança repete no microfone. Acertou, comemora; quase, mostra o que ouviu.",
      emoji: "🎤",
    },
    {
      numero: "3",
      titulo: "Ganha estrelinha",
      desc: "Cada acerto vale uma estrela. Bateu a meta nas cinco atividades, o dia fecha e o streak cresce.",
      emoji: "⭐",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
      <Reveal className="text-center">
        <h2 className="font-display text-3xl font-bold sm:text-5xl">Três passos, nada de manual</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Da primeira vez até a rotina diária, sem configurar nada complicado.
        </p>
      </Reveal>

      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        {/* Linha que costura os três passos, só no desktop. */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="absolute left-[16%] right-[16%] top-16 hidden h-0.5 bg-gradient-to-r from-primary/40 via-primary/60 to-primary/20 md:block"
          aria-hidden="true"
        />
        {passos.map((p, i) => (
          <Reveal key={p.numero} atraso={i * 0.12}>
            <div className="relative h-full rounded-3xl border border-border bg-card p-7 shadow-sm">
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl text-3xl"
                style={{ background: "var(--primary-soft)" }}
                aria-hidden="true"
              >
                {p.emoji}
              </div>
              <p className="mt-5 font-display text-sm font-bold uppercase tracking-wider text-primary">
                Passo {p.numero}
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold">{p.titulo}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Mascotes() {
  const menosMovimento = useReducedMotion();

  return (
    <section id="mascotes" className="relative overflow-hidden py-20 sm:py-28">
      <Manchas className="opacity-60" />
      <div className="relative mx-auto w-full max-w-6xl px-4">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Os guias da jornada
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            Cada bichinho, um ritmo
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            O mascote não é enfeite: ele define quantas estrelinhas a criança precisa juntar por dia
            em cada atividade. Dá para trocar quando quiser — e a dificuldade acompanha.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {mascots.map((m, i) => (
            <Reveal key={m.id} atraso={i * 0.1}>
              <motion.article
                whileHover={
                  menosMovimento ? undefined : { y: -8, rotate: i === 1 ? 0 : i ? 1 : -1 }
                }
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="flex h-full flex-col items-center rounded-[2rem] border-2 border-border bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-2xl"
              >
                <motion.span
                  className="text-7xl"
                  aria-hidden="true"
                  animate={menosMovimento ? undefined : { y: [0, -10, 0] }}
                  transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {m.emoji}
                </motion.span>
                <h3 className="mt-5 font-display text-2xl font-bold">{m.name}</h3>
                <span
                  className={
                    "mt-3 rounded-full px-3 py-1 text-xs font-bold " +
                    ESTILO_DIFICULDADE[m.difficulty]
                  }
                >
                  {m.difficulty}
                </span>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{m.tagline}</p>

                <div className="mt-6 w-full rounded-2xl bg-muted px-4 py-4">
                  <p className="font-display text-3xl font-bold">
                    <Contador valor={m.dailyGoal} /> ⭐
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">por atividade, todo dia</p>
                </div>

                <p className="mt-4 text-sm italic text-muted-foreground">“{m.greeting}”</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pontuacao() {
  const areas = [
    { nome: "Banco de Palavras", feitas: 12, meta: 12 },
    { nome: "Vocabulário", feitas: 12, meta: 12 },
    { nome: "Memória Auditiva", feitas: 9, meta: 12 },
    { nome: "Trava-Línguas", feitas: 5, meta: 12 },
  ];

  return (
    <section id="estrelinhas" className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              Pontuação que faz voltar amanhã
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
              Estrelinha por acerto,
              <br />
              fogo por dia seguido
            </h2>
          </Reveal>

          <Reveal atraso={0.1}>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Toda palavra falada certo vale uma estrelinha, e ela fica guardada — mesmo fechando o
              app. A meta do dia é por atividade, não um número solto: completar as cinco acende o
              streak e ele cresce a cada dia seguido.
            </p>
          </Reveal>

          <div className="mt-8 space-y-4">
            {[
              "Estrelinhas somam por atividade e por total, dá para ver no que a criança está indo melhor.",
              "A meta diária vem do mascote: 6, 12 ou 20 estrelinhas em cada atividade.",
              "O streak só continua se o dia anterior fechou — e isso vira motivo para praticar de novo.",
              "Com login, o progresso sobe para a nuvem e segue em qualquer aparelho.",
            ].map((texto, i) => (
              <Reveal key={texto} atraso={0.16 + i * 0.08}>
                <div className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success/15">
                    <Check className="h-4 w-4 text-success" />
                  </span>
                  <p className="text-base text-muted-foreground">{texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Painel de progresso igual ao do app, animado ao entrar na tela. */}
        <Reveal y={40}>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-warm/30 text-2xl">
                  🦜
                </span>
                <div>
                  <p className="font-display text-lg font-bold leading-none">Tito, o Tucano</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Meta de hoje: 12 ⭐ por atividade
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2">
                <Star className="h-5 w-5 fill-warm text-warm" />
                <span className="font-display text-xl font-bold">
                  <Contador valor={248} />
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {areas.map((a, i) => {
                const pct = Math.round((a.feitas / a.meta) * 100);
                const completo = a.feitas >= a.meta;
                return (
                  <div key={a.nome}>
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={
                          completo ? "font-semibold text-success" : "text-muted-foreground"
                        }
                      >
                        {completo ? "✅ " : ""}
                        {a.nome}
                      </span>
                      <span className="font-semibold">
                        {a.feitas} / {a.meta} ⭐
                      </span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: completo ? "var(--success)" : "var(--primary)" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: 0.2 + i * 0.12,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-warm/20 px-4 py-4">
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="grid h-12 w-12 place-items-center rounded-2xl bg-card"
              >
                <Flame className="h-6 w-6 fill-warm text-warm" />
              </motion.span>
              <div>
                <p className="font-display text-2xl font-bold leading-none">
                  <Contador valor={7} /> dias
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  seguidos batendo a meta em tudo
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Atividades() {
  const menosMovimento = useReducedMotion();

  return (
    <section id="atividades" className="border-y border-border bg-card/40 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            O que tem dentro
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            Cinco jeitos de treinar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Todas as atividades falam, escutam e dão estrelinha. Nenhuma precisa de leitura para
            funcionar.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ATIVIDADES.map((a, i) => (
            <Reveal key={a.nome} atraso={i * 0.08}>
              <motion.div
                whileHover={menosMovimento ? undefined : { y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="h-full rounded-3xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-xl"
              >
                <div
                  className="grid h-14 w-14 place-items-center rounded-2xl"
                  style={{ background: a.cor + "33" }}
                  aria-hidden="true"
                >
                  <a.icone className="h-7 w-7" style={{ color: a.cor }} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{a.nome}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{a.desc}</p>
              </motion.div>
            </Reveal>
          ))}

          <Reveal atraso={ATIVIDADES.length * 0.08}>
            <div className="flex h-full flex-col justify-center rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5 p-7 text-center">
              <p className="font-display text-xl font-bold">E o progresso guardado</p>
              <p className="mt-2 text-base text-muted-foreground">
                Estrelinhas, streak e mascote ficam salvos na conta.
              </p>
              <Button asChild variant="outline" className="mt-5 h-12 rounded-2xl text-base">
                <Link to="/entrar">Criar conta grátis</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Facilidade() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
      <Reveal className="text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-primary">
          Feito para a criança usar sozinha
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          Aprender aqui é ouvir, falar e ver a estrela chegar
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {FACILIDADES.map((f, i) => (
          <Reveal key={f.titulo} atraso={i * 0.08}>
            <div className="flex h-full gap-5 rounded-3xl border border-border bg-card p-7 shadow-sm">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
                style={{ background: "var(--primary-soft)" }}
                aria-hidden="true"
              >
                <f.icone className="h-7 w-7 text-primary" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold">{f.titulo}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ChamadaFinal() {
  return (
    <section className="px-4 pb-20 sm:pb-28">
      <Reveal>
        <div
          className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12 sm:py-24"
          style={{ background: "var(--primary-soft)" }}
        >
          <Manchas className="opacity-70" />
          <div className="relative">
            <div className="flex justify-center gap-3 text-5xl sm:text-6xl" aria-hidden="true">
              {mascots.map((m, i) => (
                <motion.span
                  key={m.id}
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {m.emoji}
                </motion.span>
              ))}
            </div>
            <h2 className="mt-8 font-display text-3xl font-bold sm:text-5xl">
              A primeira estrelinha sai hoje
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/80">
              Cria a conta, escolhe o bichinho e começa a praticar em menos de um minuto.
            </p>
            <Button asChild className="mt-8 h-14 rounded-2xl px-8 text-lg">
              <Link to="/entrar">
                Começar grátis <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Rodape() {
  return (
    <footer className="border-t border-border px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <p className="font-display text-lg font-bold">
            Comunicar<span className="text-primary">+</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Apoio fonoaudiológico interativo.</p>
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground">
          <a href="#mascotes" className="transition-colors hover:text-foreground">
            Mascotes
          </a>
          <a href="#estrelinhas" className="transition-colors hover:text-foreground">
            Estrelinhas
          </a>
          <Link to="/entrar" className="transition-colors hover:text-foreground">
            Entrar
          </Link>
        </div>
      </div>
    </footer>
  );
}
