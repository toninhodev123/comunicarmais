import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Flame, Volume2 } from "lucide-react";
import { mascots, themeColors, useApp, type ThemeColor } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  aoCarregarVozes,
  bancoPreferido,
  bancosDisponiveis,
  definirBancoPreferido,
  definirVozPreferida,
  falar,
  nomeDoBanco,
  vozPreferida,
  vozesPortugues,
} from "@/lib/voz";

const difficultyStyles: Record<string, string> = {
  Fácil: "bg-success/15 text-success",
  Médio: "bg-warm/50 text-warm-foreground",
  Difícil: "bg-destructive/15 text-destructive",
};

export const Route = createFileRoute("/personalizar")({
  head: () => ({
    meta: [
      { title: "Personalizar — Comunicar+" },
      { name: "description", content: "Escolha mascote e cores da interface." },
    ],
  }),
  component: CustomizePage,
});

function CustomizePage() {
  const { mascot, definirMascote, themeColor, definirCor, reiniciarProgresso, dailyGoal, streak } =
    useApp();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Personalizar</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Escolha o mascote guia e a cor da interface.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold">Mascote guia</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Cada mascote tem uma dificuldade — ela define a meta diária de estrelinhas.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {mascots.map((m) => {
            const active = m.id === mascot.id;
            return (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => definirMascote(m.id)}
                aria-pressed={active}
                className={
                  "rounded-3xl border-2 p-6 text-center transition-all " +
                  (active
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-card hover:border-primary/50")
                }
              >
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-background text-6xl">
                  {m.emoji}
                </div>
                <p className="mt-3 font-display text-xl font-bold">{m.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.tagline}</p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <span
                    className={
                      "rounded-full px-2 py-0.5 text-xs font-bold " + difficultyStyles[m.difficulty]
                    }
                  >
                    {m.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground">{m.dailyGoal} ⭐/dia</span>
                </div>
                {active && (
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
                    <Check className="h-4 w-4" /> Selecionado
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold">Cor de destaque</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {(Object.keys(themeColors) as ThemeColor[]).map((k) => {
            const c = themeColors[k];
            const active = themeColor === k;
            return (
              <button
                key={k}
                onClick={() => definirCor(k)}
                aria-pressed={active}
                className={
                  "big-tap flex flex-col items-center gap-2 rounded-3xl border-2 p-4 transition-all " +
                  (active ? "border-foreground" : "border-border hover:border-foreground/50")
                }
              >
                <div
                  className="h-14 w-14 rounded-2xl"
                  style={{ background: c.primary }}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold">{c.label}</span>
                {active && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </section>

      <SecaoVoz />

      <Card className="p-6">
        <h2 className="text-xl font-bold">Progresso</h2>
        <p className="mt-1 text-muted-foreground">
          As estrelinhas ficam salvas neste navegador, mesmo se você fechar ou atualizar a página. A
          meta diária de hoje é {dailyGoal} estrelinhas em cada atividade (Banco de Palavras,
          Memória Auditiva, Trava-Línguas e Habilidades Sociais) — definida pelo mascote escolhido —
          e reseta todo dia.
        </p>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
          <Flame className="h-6 w-6 fill-warm text-warm" />
          <p className="text-base">
            <strong>
              {streak} {streak === 1 ? "dia" : "dias"}
            </strong>{" "}
            seguidos batendo a meta diária.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={reiniciarProgresso}
          className="mt-4 h-12 rounded-2xl px-5 text-base"
        >
          Zerar estrelinhas agora
        </Button>
      </Card>
    </div>
  );
}

const FRASE_TESTE = "Oi! Eu sou a voz que vai falar com você.";

function SecaoVoz() {
  const [vozes, setVozes] = useState<SpeechSynthesisVoice[]>([]);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const bancos = bancosDisponiveis();
  const [banco, setBanco] = useState<string | null>(null);

  useEffect(() => setBanco(bancoPreferido() ?? bancos[0] ?? null), [bancos.length]);

  const escolherBanco = (nome: string) => {
    setBanco(nome);
    definirBancoPreferido(nome);
    falar(FRASE_TESTE);
  };

  useEffect(() => {
    const atualizar = () => {
      const lista = vozesPortugues();
      setVozes(lista);
      setEscolhida(vozPreferida() ?? lista[0]?.name ?? null);
    };
    return aoCarregarVozes(atualizar);
  }, []);

  const escolher = (nome: string) => {
    setEscolhida(nome);
    definirVozPreferida(nome);
    falar(FRASE_TESTE);
  };

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-bold">Voz do aplicativo</h2>

      {bancos.length > 0 && (
        <div className="mb-5">
          <p className="mb-3 text-sm text-muted-foreground">
            Vozes gravadas: soam igual em qualquer celular ou computador. Toque para ouvir e
            escolher.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {bancos.map((b) => {
              const ativo = b === banco;
              return (
                <button
                  key={b}
                  onClick={() => escolherBanco(b)}
                  aria-pressed={ativo}
                  className={
                    "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all " +
                    (ativo
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border bg-card hover:border-primary/50")
                  }
                >
                  <Volume2 className="h-5 w-5 shrink-0" />
                  <span className="min-w-0 flex-1 font-semibold">{nomeDoBanco(b)}</span>
                  {ativo && <Check className="h-5 w-5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="mb-3 text-sm text-muted-foreground">
        {bancos.length > 0 ? "Voz de reserva" : "Voz do navegador"}, usada no que ainda não tem
        gravação — as marcadas como <strong>Natural</strong>, <strong>Neural</strong> ou{" "}
        <strong>Google</strong> são as menos robóticas. Toque em uma para ouvir e já deixar
        escolhida.
      </p>
      {vozes.length === 0 ? (
        <p className="rounded-xl bg-warm/30 px-3 py-2 text-sm">
          Nenhuma voz em português encontrada neste navegador. No Chrome ou no Edge costuma
          aparecer; no celular, instale uma voz em português nas configurações de fala.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {vozes.map((v) => {
            const ativa = v.name === escolhida;
            return (
              <button
                key={v.name}
                onClick={() => escolher(v.name)}
                aria-pressed={ativa}
                className={
                  "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all " +
                  (ativa
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-card hover:border-primary/50")
                }
              >
                <Volume2 className="h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{v.name}</span>
                  <span className="block text-xs text-muted-foreground">{v.lang}</span>
                </span>
                {ativa && <Check className="h-5 w-5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
