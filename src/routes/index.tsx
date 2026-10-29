import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  ArrowDown,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  Ear,
  Flame,
  Hand,
  HeartHandshake,
  Mic,
  MousePointerClick,
  Repeat,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Timer,
  Users,
  Volume2,
} from "lucide-react";
import { mascots } from "@/context/AppContext";
import { falar } from "@/lib/voz";
import { useScrollSuave } from "@/lib/scroll-suave";
import {
  Contador,
  Esteira,
  Manchas,
  Reveal,
  useParallaxSuave,
  usePonteiro,
} from "@/components/landing/animacoes";
import { Mascote } from "@/components/landing/mascotes";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Comunicar+ — treino de fala que a criança faz sozinha" },
      {
        name: "description",
        content:
          "Apoio fonoaudiológico interativo: 13 fonemas, 289 palavras, 920 áudios com voz humana, mascotes guias e estrelinhas que viram rotina. Tudo no navegador, sem anúncio.",
      },
    ],
  }),
  component: Landing,
});

/* ------------------------------------------------------------------ dados */

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

const FRASES_VITRINE = [
  "O rato roeu a roupa do rei de Roma",
  "Você está triste? Quer um abraço?",
  "Três pratos de trigo para três tigres tristes",
  "Com licença, posso passar por aqui?",
  "A faca corta a corda curta da cama",
  "Obrigado pela ajuda, foi muito legal",
];

const FONEMAS = ["B", "P", "D", "T", "Z", "S", "J", "CH", "R", "L", "LH", "F", "V"];

interface Atividade {
  id: string;
  nome: string;
  resumo: string;
  icone: typeof Mic;
  cor: string;
  numeros: { valor: string; rotulo: string }[];
  detalhes: string[];
}

const ATIVIDADES: Atividade[] = [
  {
    id: "palavras",
    nome: "Banco de Palavras",
    resumo: "Trocas e posição silábica: o mesmo som no começo, no meio e no fim da palavra.",
    icone: Mic,
    cor: "oklch(0.78 0.14 30)",
    numeros: [
      { valor: "13", rotulo: "fonemas" },
      { valor: "289", rotulo: "palavras" },
      { valor: "3", rotulo: "posições" },
    ],
    detalhes: [
      "Cada fonema abre com a instrução de boca: onde fica a língua, se o som vibra, se sai ventinho.",
      "As palavras são filtradas por posição — 81 no início, 127 no meio e 81 no fim.",
      "O microfone confere a palavra falada e a estrelinha cai na hora do acerto.",
    ],
  },
  {
    id: "vocabulario",
    nome: "Vocabulário",
    resumo: "Oito categorias do cotidiano e as partes de cada coisa, uma a uma.",
    icone: BookOpen,
    cor: "oklch(0.78 0.13 240)",
    numeros: [
      { valor: "8", rotulo: "categorias" },
      { valor: "44", rotulo: "objetos" },
      { valor: "199", rotulo: "partes" },
    ],
    detalhes: [
      "Transporte, alimentos, animais, casa, corpo, escola, natureza e roupas.",
      "Toca na maçã e ela se abre em casca, polpa, semente e cabinho — o vocabulário vai ficando específico.",
      "Cada palavra e cada parte têm pictograma e áudio próprio.",
    ],
  },
  {
    id: "memoria",
    nome: "Memória Auditiva",
    resumo: "Jogo estilo Genius que não mostra nada na tela: a sequência é só de ouvido.",
    icone: Brain,
    cor: "oklch(0.78 0.13 145)",
    numeros: [
      { valor: "6", rotulo: "botões" },
      { valor: "+1", rotulo: "palavra por rodada" },
      { valor: "∞", rotulo: "sequências" },
    ],
    detalhes: [
      "O app fala a sequência sem acender nenhum botão: a criança guarda pela escuta.",
      "A cada acerto entra mais uma palavra, e o sorteio nunca repete o mesmo botão em seguida.",
      "O recorde de sequência fica salvo para ser batido no dia seguinte.",
    ],
  },
  {
    id: "desafios",
    nome: "Trava-Línguas",
    resumo: "Doze clássicos com cronômetro, recorde pessoal e confete no acerto.",
    icone: Sparkles,
    cor: "oklch(0.78 0.13 290)",
    numeros: [
      { valor: "12", rotulo: "trava-línguas" },
      { valor: "1", rotulo: "cronômetro por desafio" },
      { valor: "0,9s", rotulo: "para confirmar a fala" },
    ],
    detalhes: [
      "O cronômetro começa sozinho ao tocar em falar e para no instante do acerto.",
      "A verificação aceita a frase inteira, perdoando uma palavrinha em frases longas.",
      "Quando não passa, o app mostra o que ouviu — ajuda a entender o que repetir.",
    ],
  },
  {
    id: "sociais",
    nome: "Habilidades Sociais",
    resumo: "Quinze frases do dia a dia: pedir, agradecer, convidar, consolar, recusar.",
    icone: Users,
    cor: "oklch(0.78 0.13 340)",
    numeros: [
      { valor: "15", rotulo: "frases" },
      { valor: "5", rotulo: "intenções" },
      { valor: "1", rotulo: "dica por frase" },
    ],
    detalhes: [
      "“Com licença, posso passar?”, “Você está triste? Quer um abraço?”, “Desculpa, não foi minha intenção.”",
      "Cada frase vem com a intenção explicada: cumprimento, pedido, empatia, recusa educada.",
      "Treina a fala e o uso social da fala no mesmo exercício.",
    ],
  },
];

const NUMEROS_CONTEUDO = [
  { valor: 13, rotulo: "fonemas treinados", detalhe: "B, P, D, T, Z, S, J, CH, R, L, LH, F, V" },
  { valor: 289, rotulo: "palavras de treino", detalhe: "no início, no meio e no fim da sílaba" },
  { valor: 199, rotulo: "partes de objetos", detalhe: "o volante do carro, a gema do ovo" },
  { valor: 920, rotulo: "áudios gravados", detalhe: "460 em cada voz, sem IA ao vivo" },
  { valor: 27, rotulo: "frases completas", detalhe: "12 trava-línguas e 15 frases sociais" },
  { valor: 5, rotulo: "atividades diárias", detalhe: "com meta própria em cada uma" },
];

const CUIDADOS = [
  {
    titulo: "Alvo grande para dedo pequeno",
    desc: "Todo botão tem no mínimo 56 pixels de altura e largura. Nada de alvo minúsculo que exige pontaria.",
    icone: Hand,
  },
  {
    titulo: "Uma coisa por vez na tela",
    desc: "Sem feed, sem badge piscando, sem menu escondido. A criança vê o exercício e os controles dele.",
    icone: MousePointerClick,
  },
  {
    titulo: "Quem pede menos movimento, recebe",
    desc: "O app respeita a preferência de reduzir animações do sistema: tudo para quieto, nada se perde.",
    icone: ShieldCheck,
  },
  {
    titulo: "Escuta paciente",
    desc: "O microfone acumula a frase inteira e só confere depois da pausa — gagueira e respiração não reprovam.",
    icone: Ear,
  },
];

const PERGUNTAS = [
  {
    q: "Precisa instalar alguma coisa?",
    a: "Não. O Comunicar+ abre no navegador do celular, do tablet ou do computador. Nenhum download, nenhuma loja de aplicativos.",
  },
  {
    q: "A criança precisa saber ler?",
    a: "Não. Toda instrução é falada e ilustrada. A palavra escrita aparece junto, mas quem guia é o áudio e o pictograma.",
  },
  {
    q: "A voz é de robô?",
    a: "Não. São 920 arquivos gravados antes, com voz neural em português do Brasil — 460 na voz feminina e 460 na masculina. O app só toca o arquivo, então a voz é a mesma em qualquer aparelho.",
  },
  {
    q: "Como funciona a correção da fala?",
    a: "O microfone usa o reconhecimento de fala do próprio navegador (funciona melhor no Chrome e no Edge). A comparação é tolerante: em frases longas, perder uma palavrinha não reprova.",
  },
  {
    q: "Isso substitui a fonoaudióloga?",
    a: "De jeito nenhum. É apoio para o treino diário entre as sessões — a repetição que faz a terapia render, com a constância que uma consulta semanal sozinha não dá.",
  },
  {
    q: "Tem anúncio ou compra dentro do app?",
    a: "Não existe anúncio, pop-up de compra nem cobrança escondida. A tela é só do exercício.",
  },
];

const ESTILO_DIFICULDADE: Record<string, string> = {
  Fácil: "bg-success/15 text-success",
  Médio: "bg-warm/50 text-warm-foreground",
  Difícil: "bg-destructive/15 text-destructive",
};

/* ------------------------------------------------------------------ página */

function Landing() {
  useScrollSuave();

  return (
    <div id="topo" className="min-h-dvh overflow-x-hidden bg-background">
      <Topo />
      <Heroi />
      <Vitrine />
      <PorQueExiste />
      <ComoFunciona />
      <Mascotes />
      <Pontuacao />
      <Atividades />
      <NumerosDoConteudo />
      <Vozes />
      <Cuidado />
      <ParaAdultos />
      <Perguntas />
      <Fechamento />
      <Rodape />
    </div>
  );
}

function Topo() {
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 20);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const links = [
    { href: "#mascotes", texto: "Mascotes" },
    { href: "#estrelinhas", texto: "Estrelinhas" },
    { href: "#atividades", texto: "Atividades" },
    { href: "#vozes", texto: "Vozes" },
    { href: "#perguntas", texto: "Perguntas" },
  ];

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 " +
        (rolou ? "border-b border-border/60 bg-background/80 backdrop-blur-md" : "bg-transparent")
      }
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <a href="#topo" className="font-display text-xl font-bold">
          Comunicar<span className="text-primary">+</span>
        </a>
        <div className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.texto}
            </a>
          ))}
        </div>
        <Button asChild variant="outline" className="h-11 rounded-2xl px-5 text-base">
          <a href="#atividades">Ver por dentro</a>
        </Button>
      </nav>
    </header>
  );
}

function Heroi() {
  const ref = useRef<HTMLDivElement>(null);
  const menosMovimento = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Parallax passando por mola: é o que tira o "pulo" a cada evento de scroll.
  const camadaFundo = useParallaxSuave(scrollYProgress, -60);
  const camadaMeio = useParallaxSuave(scrollYProgress, -130);
  const camadaFrente = useParallaxSuave(scrollYProgress, -200);
  const camadas = [camadaFundo, camadaFrente, camadaMeio];

  const ponteiro = usePonteiro();
  const girarX = useTransform(ponteiro.y, [-1, 1], [8, -8]);
  const girarY = useTransform(ponteiro.x, [-1, 1], [-10, 10]);

  const [ouvindo, setOuvindo] = useState<string | null>(null);
  const ouvirPalavra = () => {
    const palavra = PALAVRAS_VITRINE[Math.floor(Math.random() * PALAVRAS_VITRINE.length)];
    setOuvindo(palavra);
    falar(palavra);
    setTimeout(() => setOuvindo(null), 2200);
  };

  const posicoes = ["left-[2%] top-[6%]", "right-[4%] top-[26%]", "left-[20%] bottom-[2%]"];

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-24 pt-28 sm:pb-32 sm:pt-36">
      <Manchas />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" /> Apoio fonoaudiológico que vira
              brincadeira
            </span>
          </Reveal>

          <Reveal atraso={0.08}>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.06] sm:text-6xl">
              Falar fica fácil
              <br />
              quando tem{" "}
              <span className="bg-gradient-to-r from-primary to-warm-foreground bg-clip-text text-transparent">
                um bichinho
              </span>
              <br />
              torcendo junto.
            </h1>
          </Reveal>

          <Reveal atraso={0.16}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Treino diário de fala com 13 fonemas, 289 palavras e 920 áudios gravados com voz
              humana. A criança escolhe o mascote guia, fala no microfone e junta estrelinhas — e
              consegue fazer tudo sozinha.
            </p>
          </Reveal>

          <Reveal atraso={0.24}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-14 rounded-2xl px-7 text-lg">
                <a href="#atividades">
                  Conhecer as atividades <ArrowDown className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={ouvirPalavra}
                className="h-14 rounded-2xl px-7 text-lg"
              >
                <Volume2 className="mr-2 h-5 w-5" />
                {ouvindo ? `Falando “${ouvindo}”...` : "Ouvir uma palavra"}
              </Button>
            </div>
          </Reveal>

          <Reveal atraso={0.32}>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                { valor: 920, rotulo: "áudios com voz humana" },
                { valor: 5, rotulo: "atividades diárias" },
                { valor: 3, rotulo: "mascotes guias" },
              ].map((e) => (
                <div key={e.rotulo}>
                  <dt className="font-display text-3xl font-bold text-primary sm:text-4xl">
                    <Contador valor={e.valor} />
                  </dt>
                  <dd className="mt-1 text-sm leading-snug text-muted-foreground">{e.rotulo}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Os três mascotes em camadas: cada um sobe num ritmo e o conjunto
            inclina de leve seguindo o ponteiro. */}
        <div
          className="relative h-[380px] [perspective:1200px] sm:h-[480px]"
          onMouseMove={ponteiro.aoMover}
          onMouseLeave={ponteiro.aoSair}
        >
          <motion.div
            className="absolute inset-0"
            style={
              menosMovimento
                ? undefined
                : { rotateX: girarX, rotateY: girarY, transformStyle: "preserve-3d" }
            }
          >
            {mascots.map((m, i) => (
              <motion.div
                key={m.id}
                style={{ y: camadas[i], willChange: "transform" }}
                className={"absolute " + posicoes[i]}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.72, rotate: i === 1 ? 6 : -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 15,
                    delay: 0.15 + i * 0.1,
                  }}
                >
                  <motion.div
                    animate={
                      menosMovimento ? undefined : { y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] }
                    }
                    transition={{
                      duration: 5 + i * 0.9,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.6,
                    }}
                    className="grid place-items-center rounded-[2rem] bg-card p-5 shadow-xl ring-1 ring-border sm:p-7"
                    style={{ willChange: "transform" }}
                  >
                    <Mascote id={m.id} className="h-24 w-24 sm:h-28 sm:w-28" />
                    <p className="mt-2 font-display text-base font-bold sm:text-lg">
                      {m.name.split(",")[0]}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-warm-foreground">
                      <Star className="h-4 w-4 fill-warm text-warm" /> {m.dailyGoal} por atividade
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Vitrine() {
  return (
    <section className="space-y-2 border-y border-border bg-card/40 py-8">
      <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Tudo isso o app fala com voz de verdade
      </p>
      <Esteira itens={PALAVRAS_VITRINE} />
      <Esteira itens={FRASES_VITRINE} duracao={52} inverso />
    </section>
  );
}

function PorQueExiste() {
  const colunas = [
    {
      titulo: "A terapia acontece entre as sessões",
      desc: "Uma consulta por semana não constrói hábito. O que consolida é o treino curto repetido em casa — e é aí que quase todo mundo trava.",
      icone: Repeat,
    },
    {
      titulo: "Repetir precisa ser divertido",
      desc: "Criança não repete trinta vezes a mesma palavra por disciplina. Repete por jogo, por estrelinha, por um bichinho comemorando junto.",
      icone: Sparkles,
    },
    {
      titulo: "O adulto nem sempre pode estar junto",
      desc: "Por isso cada exercício se explica sozinho, em áudio e imagem. A criança abre, entende e pratica sem precisar de ninguém lendo para ela.",
      icone: HeartHandshake,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-primary">
          Por que o Comunicar+ existe
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          O treino de fala que trava não é o da clínica — é o de terça à noite
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {colunas.map((c, i) => (
          <Reveal key={c.titulo} atraso={i * 0.1}>
            <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-sm">
              <span
                className="grid h-14 w-14 place-items-center rounded-2xl"
                style={{ background: "var(--primary-soft)" }}
                aria-hidden="true"
              >
                <c.icone className="h-7 w-7 text-primary" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">{c.titulo}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ComoFunciona() {
  const passos = [
    {
      numero: "1",
      titulo: "Escolhe o bichinho",
      desc: "Nina, Tito ou Léo. A escolha define a meta de estrelinhas do dia — do mais tranquilo ao mais corajoso.",
      mascote: "nina" as const,
      emoji: "🐰",
    },
    {
      numero: "2",
      titulo: "Ouve e fala",
      desc: "O app fala a palavra, a criança repete no microfone. Acertou, comemora; quase, mostra o que ouviu.",
      emoji: "🎤",
      mascote: null,
    },
    {
      numero: "3",
      titulo: "Ganha estrelinha",
      desc: "Cada acerto vale uma estrela. Bateu a meta nas atividades, o dia fecha e o streak cresce.",
      emoji: "⭐",
      mascote: null,
    },
  ];

  return (
    <section className="border-y border-border bg-card/40 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">
            Três passos, nada de manual
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Da primeira abertura até a rotina diária, sem configurar nada complicado.
          </p>
        </Reveal>

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
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
                  className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl text-3xl"
                  style={{ background: "var(--primary-soft)" }}
                  aria-hidden="true"
                >
                  {p.mascote ? <Mascote id={p.mascote} className="h-12 w-12" /> : p.emoji}
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
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Os guias da jornada
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            Cada bichinho carrega uma dificuldade
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            O mascote não é enfeite: ele define quantas estrelinhas a criança precisa juntar por dia
            em cada atividade. Começar com a Nina e migrar para o Léo é, na prática, subir de nível
            — e dá para trocar quando quiser.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {mascots.map((m, i) => (
            <Reveal key={m.id} atraso={i * 0.1}>
              <motion.article
                whileHover={menosMovimento ? undefined : { y: -10 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="flex h-full flex-col items-center rounded-[2rem] border-2 border-border bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-2xl"
              >
                <motion.div
                  animate={menosMovimento ? undefined : { y: [0, -10, 0] }}
                  transition={{
                    duration: 4 + i * 0.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  }}
                >
                  <Mascote id={m.id} className="h-36 w-36" />
                </motion.div>
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
                  <p className="mt-2 text-xs text-muted-foreground">
                    {m.dailyGoal * 5} estrelinhas para fechar o dia inteiro
                  </p>
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
              Toda palavra falada certo vale uma estrelinha, e ela fica guardada mesmo fechando o
              app. A meta do dia é por atividade, não um número solto: completar todas acende o
              streak, que só continua se o dia anterior fechou.
            </p>
          </Reveal>

          <div className="mt-8 space-y-4">
            {[
              "Estrelinhas somam por atividade e no total — dá para ver em que a criança vai melhor.",
              "A meta diária vem do mascote: 6, 12 ou 20 estrelinhas em cada atividade.",
              "O streak quebra se um dia passar em branco, e isso vira motivo para praticar hoje.",
              "Com conta, o progresso sobe para a nuvem e continua em qualquer aparelho.",
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

        <Reveal y={40}>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-warm/30">
                  <Mascote id="tito" className="h-11 w-11" />
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
  const [ativa, setAtiva] = useState(ATIVIDADES[0].id);
  const atividade = ATIVIDADES.find((a) => a.id === ativa)!;

  return (
    <section id="atividades" className="border-y border-border bg-card/40 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            O que tem dentro
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            Cinco jeitos de treinar a mesma fala
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Toque numa atividade para ver o que ela tem por dentro. Todas falam, escutam e dão
            estrelinha.
          </p>
        </Reveal>

        <Reveal atraso={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {ATIVIDADES.map((a) => {
              const selecionada = a.id === ativa;
              return (
                <button
                  key={a.id}
                  onClick={() => setAtiva(a.id)}
                  aria-pressed={selecionada}
                  className={
                    "relative rounded-2xl px-5 py-3 text-base font-semibold transition-colors " +
                    (selecionada
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {selecionada && (
                    <motion.span
                      layoutId="aba-ativa"
                      className="absolute inset-0 rounded-2xl bg-primary"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <a.icone className="h-5 w-5" />
                    {a.nome}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal atraso={0.16}>
          <motion.div
            key={atividade.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid gap-8 rounded-[2rem] border border-border bg-card p-8 shadow-sm lg:grid-cols-[1.1fr_0.9fr] sm:p-10"
          >
            <div>
              <div
                className="grid h-16 w-16 place-items-center rounded-2xl"
                style={{ background: atividade.cor + "33" }}
                aria-hidden="true"
              >
                <atividade.icone className="h-8 w-8" style={{ color: atividade.cor }} />
              </div>
              <h3 className="mt-5 font-display text-3xl font-bold">{atividade.nome}</h3>
              <p className="mt-3 text-lg text-muted-foreground">{atividade.resumo}</p>

              <ul className="mt-6 space-y-3">
                {atividade.detalhes.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success/15">
                      <Check className="h-4 w-4 text-success" />
                    </span>
                    <span className="text-base text-muted-foreground">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid content-start gap-4">
              <div className="grid grid-cols-3 gap-3">
                {atividade.numeros.map((n) => (
                  <div key={n.rotulo} className="rounded-2xl bg-muted px-3 py-4 text-center">
                    <p className="font-display text-2xl font-bold" style={{ color: atividade.cor }}>
                      {n.valor}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">{n.rotulo}</p>
                  </div>
                ))}
              </div>

              {atividade.id === "palavras" && (
                <div className="rounded-2xl border border-border p-5">
                  <p className="text-sm font-semibold text-muted-foreground">Fonemas treinados</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {FONEMAS.map((f) => (
                      <span
                        key={f}
                        className="grid h-10 w-10 place-items-center rounded-xl border-2 font-display font-bold"
                        style={{ borderColor: atividade.cor, color: atividade.cor }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {atividade.id === "desafios" && (
                <div className="rounded-2xl border border-border p-5">
                  <p className="flex items-center gap-2 font-display text-3xl font-bold tabular-nums">
                    <Timer className="h-6 w-6 text-primary" /> 00:06,5
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    O cronômetro do card guarda o melhor tempo de cada trava-língua.
                  </p>
                </div>
              )}

              {atividade.id === "memoria" && (
                <div className="rounded-2xl border border-border p-5">
                  <p className="text-sm font-semibold text-muted-foreground">
                    A sequência toca sem acender nada
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {["🐟", "❤️", "✏️", "🥤", "🏠", "🍌"].map((e, i) => (
                      <motion.span
                        key={i}
                        className="grid h-12 place-items-center rounded-xl border-2 border-border text-2xl"
                        animate={{ opacity: [1, 0.55, 1] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                      >
                        {e}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {atividade.id === "vocabulario" && (
                <div className="rounded-2xl border border-border p-5">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Uma maçã, quatro palavras novas
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Casca", "Polpa", "Semente", "Cabinho"].map((p) => (
                      <span
                        key={p}
                        className="rounded-full bg-muted px-3 py-1.5 text-sm font-semibold"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {atividade.id === "sociais" && (
                <div className="space-y-2 rounded-2xl border border-border p-5">
                  {["Bom dia! Como você está hoje?", "Desculpa, não foi minha intenção."].map(
                    (f) => (
                      <p key={f} className="rounded-xl bg-muted px-3 py-2 text-sm font-semibold">
                        “{f}”
                      </p>
                    ),
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function NumerosDoConteudo() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
      <Reveal className="text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-primary">
          Conteúdo, não promessa
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          O que já está pronto dentro do app
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {NUMEROS_CONTEUDO.map((n, i) => (
          <Reveal key={n.rotulo} atraso={i * 0.07}>
            <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-sm">
              <p className="font-display text-5xl font-bold text-primary">
                <Contador valor={n.valor} />
              </p>
              <p className="mt-2 font-display text-lg font-bold">{n.rotulo}</p>
              <p className="mt-1 text-sm text-muted-foreground">{n.detalhe}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Vozes() {
  const [tocando, setTocando] = useState<string | null>(null);
  const palavras = ["borboleta", "girassol", "chocolate", "elefante"];

  const tocar = (banco: "feminina" | "masculina", palavra: string) => {
    const audio = new Audio(`/audio/${banco}/${palavra}.mp3`);
    setTocando(`${banco}-${palavra}`);
    void audio.play().catch(() => setTocando(null));
    audio.onended = () => setTocando(null);
  };

  return (
    <section id="vozes" className="border-y border-border bg-card/40 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              Voz gravada, não sintetizada na hora
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
              920 áudios, duas vozes, sempre iguais
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Cada palavra e cada frase foi gravada antes com voz neural em português do Brasil —
              460 arquivos na voz feminina e 460 na masculina. O app só toca o arquivo, então a
              criança ouve exatamente a mesma voz no celular da escola e no computador de casa.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "A pessoa escolhe a voz feminina ou a masculina em Personalizar.",
                "A fala sai um tiquinho mais devagar, para acompanhar sem esforço.",
                "Sem gravação pronta, o app ainda fala — aí usando a voz do próprio aparelho.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success/15">
                    <Check className="h-4 w-4 text-success" />
                  </span>
                  <span className="text-base text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal atraso={0.1} y={40}>
            <div className="rounded-[2rem] border border-border bg-card p-7 shadow-xl sm:p-8">
              <p className="font-display text-xl font-bold">Ouça agora, é o áudio real do app</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Toque numa palavra para ouvir nas duas vozes.
              </p>

              <div className="mt-6 space-y-4">
                {palavras.map((p) => (
                  <div key={p} className="flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-bold capitalize">{p}</span>
                    <div className="flex gap-2">
                      {(["feminina", "masculina"] as const).map((banco) => {
                        const ativo = tocando === `${banco}-${p}`;
                        return (
                          <Button
                            key={banco}
                            variant={ativo ? "default" : "outline"}
                            onClick={() => tocar(banco, p)}
                            className="h-11 rounded-xl px-4 text-sm"
                          >
                            <Volume2 className="mr-1.5 h-4 w-4" />
                            {banco === "feminina" ? "Feminina" : "Masculina"}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Cuidado() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-primary">
          Feito para a criança usar sozinha
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          Cada decisão de tela tem um porquê
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {CUIDADOS.map((c, i) => (
          <Reveal key={c.titulo} atraso={i * 0.08}>
            <div className="flex h-full gap-5 rounded-3xl border border-border bg-card p-7 shadow-sm">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
                style={{ background: "var(--primary-soft)" }}
                aria-hidden="true"
              >
                <c.icone className="h-7 w-7 text-primary" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold">{c.titulo}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ParaAdultos() {
  const publicos = [
    {
      titulo: "Para a família",
      desc: "Dá para deixar a criança praticar sozinha e, depois, olhar as estrelinhas de cada atividade para saber onde ela está indo bem e onde travou.",
      itens: [
        "Estrelinhas separadas por atividade",
        "Streak mostra a constância da semana",
        "Sem anúncio e sem link para fora",
      ],
      icone: HeartHandshake,
    },
    {
      titulo: "Para a fonoaudióloga",
      desc: "O conteúdo segue a lógica de consultório: fonema alvo, posição na palavra, repetição com reforço imediato e material do cotidiano.",
      itens: [
        "13 fonemas com instrução de ponto articulatório",
        "Palavras por posição silábica (início, meio, fim)",
        "Dificuldade ajustável pelo mascote escolhido",
      ],
      icone: Brain,
    },
    {
      titulo: "Para a escola",
      desc: "Abre no navegador de qualquer aparelho, sem instalar nada e sem cadastro para experimentar as atividades.",
      itens: [
        "Funciona em celular, tablet e computador",
        "Interface grande, pensada para toque",
        "Vocabulário ligado à rotina escolar",
      ],
      icone: Smartphone,
    },
  ];

  return (
    <section className="border-y border-border bg-card/40 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">
            Quem está do outro lado também importa
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {publicos.map((p, i) => (
            <Reveal key={p.titulo} atraso={i * 0.1}>
              <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-sm">
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl"
                  style={{ background: "var(--primary-soft)" }}
                  aria-hidden="true"
                >
                  <p.icone className="h-7 w-7 text-primary" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold">{p.titulo}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{p.desc}</p>
                <ul className="mt-5 space-y-2">
                  {p.itens.map((t) => (
                    <li key={t} className="flex gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Perguntas() {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section id="perguntas" className="mx-auto w-full max-w-3xl px-4 py-20 sm:py-28">
      <Reveal className="text-center">
        <h2 className="font-display text-3xl font-bold sm:text-5xl">Perguntas que sempre chegam</h2>
      </Reveal>

      <div className="mt-12 space-y-3">
        {PERGUNTAS.map((p, i) => {
          const ativa = aberta === i;
          return (
            <Reveal key={p.q} atraso={i * 0.05}>
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <button
                  onClick={() => setAberta(ativa ? null : i)}
                  aria-expanded={ativa}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-lg font-bold">{p.q}</span>
                  <motion.span
                    animate={{ rotate: ativa ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: ativa ? "auto" : 0, opacity: ativa ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-base leading-relaxed text-muted-foreground">{p.a}</p>
                </motion.div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function Fechamento() {
  return (
    <section className="px-4 pb-20 sm:pb-28">
      <Reveal>
        <div
          className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12 sm:py-24"
          style={{ background: "var(--primary-soft)" }}
        >
          <Manchas className="opacity-70" />
          <div className="relative">
            <div className="flex items-end justify-center gap-2 sm:gap-6">
              {mascots.map((m, i) => (
                <motion.div
                  key={m.id}
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 3.4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                >
                  <Mascote id={m.id} className="h-24 w-24 sm:h-32 sm:w-32" />
                </motion.div>
              ))}
            </div>
            <h2 className="mt-8 font-display text-3xl font-bold sm:text-5xl">
              Treino de fala que a criança pede para fazer
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/80">
              Cinco atividades, três mascotes e 920 áudios esperando — tudo no navegador, sem
              instalar nada.
            </p>
            <Button asChild className="mt-8 h-14 rounded-2xl px-8 text-lg">
              <a href="#atividades">
                Ver as atividades de novo <ArrowDown className="ml-2 h-5 w-5" />
              </a>
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
        <div className="text-center sm:text-left">
          <p className="font-display text-lg font-bold">
            Comunicar<span className="text-primary">+</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Apoio fonoaudiológico interativo — não substitui acompanhamento profissional.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-muted-foreground">
          <a href="#mascotes" className="transition-colors hover:text-foreground">
            Mascotes
          </a>
          <a href="#atividades" className="transition-colors hover:text-foreground">
            Atividades
          </a>
          <a href="#vozes" className="transition-colors hover:text-foreground">
            Vozes
          </a>
          <a href="#perguntas" className="transition-colors hover:text-foreground">
            Perguntas
          </a>
        </div>
      </div>
    </footer>
  );
}
