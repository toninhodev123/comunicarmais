import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookMarked, Search, Volume2 } from "lucide-react";
import { falar } from "@/lib/voz";
import { Reveal } from "@/components/landing/animacoes";

/**
 * Glossário.
 *
 * Quem sai de uma consulta com "ela faz rotacismo e troca em posição medial"
 * não entendeu nada, e não vai perguntar de novo. Esta seção traduz os termos
 * que a família ouve, com um exemplo em áudio onde faz sentido — ouvir a troca
 * explica mais rápido que qualquer definição.
 */

interface Termo {
  termo: string;
  grupo: "sons" | "trocas" | "treino";
  oQueE: string;
  noDiaADia: string;
  /** Palavra do banco de áudio que ilustra o termo, quando existir uma. */
  exemplo?: string;
}

const TERMOS: Termo[] = [
  {
    termo: "Fonema",
    grupo: "sons",
    oQueE: "O som da fala, não a letra. O X tem som de /ch/ em “xícara” e de /z/ em “exame”.",
    noDiaADia: "A terapia trabalha som, não ortografia. Por isso o app separa por fonema.",
  },
  {
    termo: "Posição silábica",
    grupo: "sons",
    oQueE: "Onde o som aparece: no começo, no meio ou no fim da palavra.",
    noDiaADia:
      "A criança costuma acertar no começo antes do meio. Por isso o treino segue essa ordem.",
    exemplo: "BORBOLETA",
  },
  {
    termo: "Surda e sonora",
    grupo: "sons",
    oQueE:
      "Dois sons feitos na mesma posição de boca; num a garganta vibra, no outro não. F e V, P e B, S e Z.",
    noDiaADia: "Com a mão na garganta dá para sentir. É o teste mais simples que existe em casa.",
    exemplo: "VACA",
  },
  {
    termo: "Par mínimo",
    grupo: "sons",
    oQueE: "Duas palavras que se diferenciam por um som só: faca e vaca, rua e lua.",
    noDiaADia:
      "Mostra à criança por que o som importa — errar não deixa a fala feia, deixa a faca virar vaca.",
    exemplo: "FACA",
  },
  {
    termo: "Rotacismo",
    grupo: "trocas",
    oQueE: "Dificuldade com o R: ele vira L, some, ou sai arranhado.",
    noDiaADia: "“Cachorro” vira “cachollo”. É das trocas mais comuns e das que mais demoram.",
    exemplo: "CACHORRO",
  },
  {
    termo: "Substituição",
    grupo: "trocas",
    oQueE: "Trocar um som por outro que a criança já consegue fazer.",
    noDiaADia: "“Chave” vira “tave”. Não é preguiça: é o repertório que ela tem até aqui.",
    exemplo: "CHAVE",
  },
  {
    termo: "Omissão",
    grupo: "trocas",
    oQueE: "O som simplesmente não sai.",
    noDiaADia: "“Blusa” vira “busa”. Costuma acontecer com encontros de duas consoantes.",
  },
  {
    termo: "Distorção",
    grupo: "trocas",
    oQueE: "O som sai, mas diferente do esperado — nem é o certo, nem é outro som da língua.",
    noDiaADia: "O S que escapa pelo lado dos dentes, com um chiado. Aparece muito com S e Z.",
    exemplo: "SAPO",
  },
  {
    termo: "Discriminação auditiva",
    grupo: "treino",
    oQueE: "Perceber que dois sons são diferentes, sem precisar falar nada.",
    noDiaADia: "Vem antes de produzir: não dá para acertar um som que ainda não se ouve diferente.",
  },
  {
    termo: "Generalização",
    grupo: "treino",
    oQueE: "Quando o som sai certo fora do exercício — na conversa, na escola, com os avós.",
    noDiaADia: "É a meta de verdade. Acertar na atividade é o meio, não o fim.",
  },
  {
    termo: "Instrução de boca",
    grupo: "treino",
    oQueE: "A explicação de onde pôr a língua e os lábios para produzir o som.",
    noDiaADia: "“Encoste os dentes de cima no lábio de baixo e sopre.” Cada fonema tem a sua.",
  },
  {
    termo: "Estímulo e modelo",
    grupo: "treino",
    oQueE:
      "O estímulo é o que se pede (uma figura, uma palavra); o modelo é a fala correta ouvida antes.",
    noDiaADia: "Dar o modelo antes de a criança tentar é ajuda. Dar depois é correção.",
  },
];

const GRUPOS = [
  { chave: "todos", rotulo: "Todos" },
  { chave: "sons", rotulo: "Sobre os sons" },
  { chave: "trocas", rotulo: "Tipos de troca" },
  { chave: "treino", rotulo: "Sobre o treino" },
] as const;

export function Glossario() {
  const [grupo, setGrupo] = useState<(typeof GRUPOS)[number]["chave"]>("todos");
  const [busca, setBusca] = useState("");

  const visiveis = useMemo(() => {
    const texto = busca.trim().toLowerCase();
    return TERMOS.filter((t) => {
      if (grupo !== "todos" && t.grupo !== grupo) return false;
      if (!texto) return true;
      return (t.termo + " " + t.oQueE + " " + t.noDiaADia).toLowerCase().includes(texto);
    });
  }, [grupo, busca]);

  return (
    <section id="glossario" className="scroll-mt-20 px-4 py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Sem jargão
          </span>
          <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight sm:text-5xl">
            O que a fonoaudióloga quis dizer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Ninguém sai da consulta e pergunta de novo o que significa “troca em posição medial”.
            Aqui estão os termos que você vai ouvir, em português claro — e com exemplo em áudio
            onde dá para ouvir a diferença.
          </p>
        </Reveal>

        <Reveal atraso={0.1}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {GRUPOS.map((g) => (
                <button
                  key={g.chave}
                  onClick={() => setGrupo(g.chave)}
                  aria-pressed={grupo === g.chave}
                  className={
                    "rounded-xl px-4 py-2 text-sm font-semibold transition-colors " +
                    (grupo === g.chave
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground")
                  }
                >
                  {g.rotulo}
                </button>
              ))}
            </div>
            <label className="relative sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar um termo"
                className="h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0">
          <AnimatePresence mode="popLayout">
            {visiveis.map((t) => (
              <motion.article
                key={t.termo}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col rounded-3xl border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-bold">{t.termo}</h3>
                  <BookMarked className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm leading-relaxed">{t.oQueE}</p>
                <p className="mt-3 rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  {t.noDiaADia}
                </p>
                {t.exemplo && (
                  <button
                    onClick={() => falar(t.exemplo!, { rate: 0.85 })}
                    className="mt-4 flex h-11 items-center justify-center gap-2 rounded-2xl border-2 border-border text-sm font-bold transition-colors hover:border-primary/60"
                  >
                    <Volume2 className="h-4 w-4" /> ouvir “{t.exemplo.toLowerCase()}”
                  </button>
                )}
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {visiveis.length === 0 && (
          <p className="mt-8 rounded-3xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
            Nenhum termo com “{busca}”. Se você ouviu uma palavra que não está aqui, escreva para a
            gente que a gente acrescenta.
          </p>
        )}
      </div>
    </section>
  );
}
