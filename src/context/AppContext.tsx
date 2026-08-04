import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type MascotId = "leo" | "nina" | "tito";
export type ThemeColor = "teal" | "coral" | "violet" | "sunshine" | "forest";

export interface Mascot {
  id: MascotId;
  name: string;
  emoji: string;
  greeting: string;
  /** Stars needed per day when this mascot is the guide — also its difficulty. */
  dailyGoal: number;
  difficulty: "Fácil" | "Médio" | "Difícil";
  /** Punchy one-liner explaining the mascot's personality and why it's this hard. */
  tagline: string;
}

export const mascots: Mascot[] = [
  {
    id: "nina",
    name: "Nina, a Coelha",
    emoji: "🐰",
    greeting: "Oi! Pronta para pular nos sons?",
    dailyGoal: 2,
    difficulty: "Fácil",
    tagline: "Nina é gentil e calma — no ritmo dela, sem pressa nenhuma.",
  },
  {
    id: "tito",
    name: "Tito, o Tucano",
    emoji: "🦜",
    greeting: "Olá! Bora soltar a voz?",
    dailyGoal: 4,
    difficulty: "Médio",
    tagline: "Tito é esperto e cheio de energia — pronto pra voar mais alto.",
  },
  {
    id: "leo",
    name: "Léo, o Leão",
    emoji: "🦁",
    greeting: "Roar! Vamos brincar de falar?",
    dailyGoal: 6,
    difficulty: "Difícil",
    tagline: "Léo é bravo e corajoso — só encara quem não tem medo do desafio!",
  },
];

export const themeColors: Record<
  ThemeColor,
  { label: string; primary: string; soft: string; ring: string }
> = {
  teal: {
    label: "Turquesa",
    primary: "oklch(0.62 0.13 200)",
    soft: "oklch(0.93 0.05 200)",
    ring: "oklch(0.62 0.13 200)",
  },
  coral: {
    label: "Coral",
    primary: "oklch(0.68 0.17 25)",
    soft: "oklch(0.94 0.05 25)",
    ring: "oklch(0.68 0.17 25)",
  },
  violet: {
    label: "Violeta",
    primary: "oklch(0.6 0.17 290)",
    soft: "oklch(0.94 0.04 290)",
    ring: "oklch(0.6 0.17 290)",
  },
  sunshine: {
    label: "Sol",
    primary: "oklch(0.75 0.16 75)",
    soft: "oklch(0.95 0.06 75)",
    ring: "oklch(0.7 0.16 75)",
  },
  forest: {
    label: "Floresta",
    primary: "oklch(0.6 0.13 150)",
    soft: "oklch(0.93 0.05 150)",
    ring: "oklch(0.6 0.13 150)",
  },
};

/** Áreas que contam para a meta diária — os ids batem com o `area` usado em adicionarEstrelas(). */
export const PRACTICE_AREAS = [
  { id: "fonemas", label: "Banco de Fonemas" },
  { id: "memoria", label: "Memória Auditiva" },
  { id: "desafios", label: "Trava-Línguas" },
  { id: "habilidades", label: "Habilidades Sociais" },
] as const;

interface AppContextValue {
  mascot: Mascot;
  definirMascote: (id: MascotId) => void;
  themeColor: ThemeColor;
  definirCor: (c: ThemeColor) => void;
  // progresso em memória
  starsByArea: Record<string, number>;
  adicionarEstrelas: (area: string, n: number) => void;
  reiniciarProgresso: () => void;
  // meta diária + streak: cada área de prática precisa de `dailyGoal`
  // estrelas, e `dailyGoal` vem da dificuldade do mascote escolhido.
  dailyGoal: number;
  dailyStarsByArea: Record<string, number>;
  streak: number;
  // configuração inicial de mascote/meta
  needsSetup: boolean;
  concluirConfiguracao: (id: MascotId) => void;
  // login (Supabase Auth) — progresso só sincroniza com a nuvem quando logado
  session: Session | null;
  authCarregando: boolean;
  entrar: (email: string, senha: string) => Promise<string | null>;
  cadastrar: (email: string, senha: string) => Promise<string | null>;
  sair: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const STARS_STORAGE_KEY = "comunicar-plus:stars";
const DAILY_STORAGE_KEY = "comunicar-plus:daily";
const MASCOT_STORAGE_KEY = "comunicar-plus:mascot";

interface DailyProgress {
  date: string;
  stars: Record<string, number>;
  goalMetAreas: Record<string, boolean>;
  streak: number;
  lastGoalDate: string | null;
}

function dataDeHoje() {
  return new Date().toISOString().slice(0, 10);
}

function diaAnterior(data: string) {
  const d = new Date(data + "T00:00:00");
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function diarioNovo(hoje: string, streak = 0, lastGoalDate: string | null = null): DailyProgress {
  return { date: hoje, stars: {}, goalMetAreas: {}, streak, lastGoalDate };
}

function carregarDiario(): DailyProgress {
  const hoje = dataDeHoje();
  if (typeof window === "undefined") return diarioNovo(hoje);
  try {
    const salvo = window.localStorage.getItem(DAILY_STORAGE_KEY);
    const analisado: DailyProgress | null = salvo ? JSON.parse(salvo) : null;
    if (!analisado) return diarioNovo(hoje);
    if (analisado.date === hoje) return analisado;
    // Novo dia: o streak só continua se a meta de ontem foi batida.
    const streakContinua = analisado.lastGoalDate === diaAnterior(hoje);
    return diarioNovo(hoje, streakContinua ? analisado.streak : 0, analisado.lastGoalDate);
  } catch {
    return diarioNovo(hoje);
  }
}

function carregarMascoteId(): MascotId | null {
  if (typeof window === "undefined") return null;
  try {
    const salvo = window.localStorage.getItem(MASCOT_STORAGE_KEY) as MascotId | null;
    return salvo && mascots.some((m) => m.id === salvo) ? salvo : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authCarregando, setAuthCarregando] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(() => carregarMascoteId() === null);
  const [mascotId, setMascotId] = useState<MascotId>(() => carregarMascoteId() ?? "leo");
  const [themeColor, setThemeColor] = useState<ThemeColor>("teal");
  const [starsByArea, setStarsByArea] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = window.localStorage.getItem(STARS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STARS_STORAGE_KEY, JSON.stringify(starsByArea));
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }, [starsByArea]);

  useEffect(() => {
    if (needsSetup) return;
    try {
      window.localStorage.setItem(MASCOT_STORAGE_KEY, mascotId);
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }, [mascotId, needsSetup]);

  const [daily, setDaily] = useState<DailyProgress>(carregarDiario);

  useEffect(() => {
    try {
      window.localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(daily));
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }, [daily]);

  // Apply theme color to CSS variables
  useEffect(() => {
    const c = themeColors[themeColor];
    const root = document.documentElement;
    root.style.setProperty("--primary", c.primary);
    root.style.setProperty("--primary-soft", c.soft);
    root.style.setProperty("--ring", c.ring);
  }, [themeColor]);

  // Observa o login: pega a sessão atual e escuta login/logout.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthCarregando(false);
    });
    const { data: assinatura } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSession(novaSessao);
    });
    return () => assinatura.subscription.unsubscribe();
  }, []);

  // Ao logar, busca o progresso salvo na nuvem (ou cria a linha na primeira vez).
  useEffect(() => {
    if (!session) return;
    let cancelado = false;
    supabase
      .from("progresso")
      .select("mascote_id, estrelas_por_area, sequencia")
      .eq("usuario_id", session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelado || error) return;
        if (data) {
          if (mascots.some((m) => m.id === data.mascote_id)) {
            setMascotId(data.mascote_id as MascotId);
          }
          setStarsByArea((data.estrelas_por_area as Record<string, number>) ?? {});
          setNeedsSetup(false);
        } else {
          supabase.from("progresso").upsert({ usuario_id: session.user.id }).then();
        }
      });
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Enquanto logado, todo progresso novo é salvo também na nuvem (best-effort).
  useEffect(() => {
    if (!session) return;
    supabase
      .from("progresso")
      .upsert({
        usuario_id: session.user.id,
        mascote_id: mascotId,
        estrelas_por_area: starsByArea,
        sequencia: daily.streak,
        atualizado_em: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.error("Falha ao sincronizar progresso:", error.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, mascotId, starsByArea, daily.streak]);

  const mascot = mascots.find((m) => m.id === mascotId)!;

  const value = useMemo<AppContextValue>(
    () => ({
      mascot,
      definirMascote: setMascotId,
      themeColor,
      definirCor: setThemeColor,
      starsByArea,
      adicionarEstrelas: (area, n) => {
        setStarsByArea((p) => ({ ...p, [area]: (p[area] ?? 0) + n }));
        setDaily((d) => {
          const hoje = dataDeHoje();
          // Protege contra o app ficar aberto passando da meia-noite.
          const base = d.date === hoje ? d : carregarDiario();
          const estrelasArea = (base.stars[area] ?? 0) + n;
          const stars = { ...base.stars, [area]: estrelasArea };
          const goalMetAreas = { ...base.goalMetAreas };
          if (estrelasArea >= mascot.dailyGoal) goalMetAreas[area] = true;

          const diaJaEstavaCompleto = PRACTICE_AREAS.every((a) => base.goalMetAreas[a.id]);
          const diaEstaCompletoAgora = PRACTICE_AREAS.every((a) => goalMetAreas[a.id]);
          const acabouDeCompletarODia = !diaJaEstavaCompleto && diaEstaCompletoAgora;

          return {
            date: hoje,
            stars,
            goalMetAreas,
            streak: acabouDeCompletarODia ? base.streak + 1 : base.streak,
            lastGoalDate: acabouDeCompletarODia ? hoje : base.lastGoalDate,
          };
        });
      },
      reiniciarProgresso: () => {
        setStarsByArea({});
        setDaily(diarioNovo(dataDeHoje()));
      },
      dailyGoal: mascot.dailyGoal,
      dailyStarsByArea: daily.stars,
      streak: daily.streak,
      needsSetup,
      concluirConfiguracao: (id) => {
        setMascotId(id);
        setNeedsSetup(false);
        setDaily(diarioNovo(dataDeHoje()));
      },
      session,
      authCarregando,
      entrar: async (email, senha) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        return error?.message ?? null;
      },
      cadastrar: async (email, senha) => {
        const { error } = await supabase.auth.signUp({ email, password: senha });
        return error?.message ?? null;
      },
      sair: async () => {
        await supabase.auth.signOut();
      },
    }),
    [mascot, themeColor, starsByArea, daily, needsSetup, session, authCarregando],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
