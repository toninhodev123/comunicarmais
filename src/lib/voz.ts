// Funções de apoio para a fala do app: primeiro tentamos o áudio gravado
// com voz neural (public/audio, gerado por `bun run audio`); se a frase não
// tiver gravação, caímos na voz do próprio navegador (Web Speech API). O
// reconhecimento de fala do microfone também mora aqui.

import { bancosDeAudio } from "@/lib/data/audios";

const BANCO_STORAGE_KEY = "comunicar-plus:banco-voz";

/** Nomes amigáveis dos bancos gravados; outros nomes aparecem como vieram. */
const NOMES_DE_BANCO: Record<string, string> = {
  feminina: "Voz feminina",
  masculina: "Voz masculina",
};

export function nomeDoBanco(banco: string) {
  return NOMES_DE_BANCO[banco] ?? banco;
}

/** Bancos de áudio gravados (um por voz), na ordem em que aparecem na tela. */
export function bancosDisponiveis(): string[] {
  return Object.keys(bancosDeAudio).filter((b) => bancosDeAudio[b].length > 0);
}

export function bancoPreferido(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const salvo = window.localStorage.getItem(BANCO_STORAGE_KEY);
    return salvo && bancosDisponiveis().includes(salvo) ? salvo : null;
  } catch {
    return null;
  }
}

export function definirBancoPreferido(banco: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (banco) window.localStorage.setItem(BANCO_STORAGE_KEY, banco);
    else window.localStorage.removeItem(BANCO_STORAGE_KEY);
  } catch {
    // ignora erros de storage (ex.: navegação privada)
  }
}

/** Nome do arquivo de áudio correspondente a um texto. */
export function slugDeTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Em qual banco está a gravação deste texto, se é que existe alguma. */
export function bancoComAudio(texto: string): string | null {
  const slug = slugDeTexto(texto);
  const preferido = bancoPreferido();
  if (preferido && bancosDeAudio[preferido]?.includes(slug)) return preferido;
  // Sem preferência (ou banco incompleto): qualquer gravação é melhor que a
  // voz sintética do navegador.
  return bancosDisponiveis().find((b) => bancosDeAudio[b].includes(slug)) ?? null;
}

let audioAtual: HTMLAudioElement | null = null;

function pararAudio() {
  if (!audioAtual) return;
  audioAtual.pause();
  audioAtual = null;
}

const VOZ_STORAGE_KEY = "comunicar-plus:voz";

/** Pedaços de nome que marcam as vozes mais naturais de cada sistema. */
const VOZES_NATURAIS = [
  "natural",
  "neural",
  "online",
  "premium",
  "enhanced",
  "google",
  "francisca",
  "thalita",
  "luciana",
  "camila",
  "vitoria",
  "vitória",
];
const VOZES_ROBOTICAS = ["espeak", "compact", "pico", "festival"];

/** Avisa quando o navegador terminar de carregar a lista de vozes. */
export function aoCarregarVozes(callback: () => void): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};
  const sintese = window.speechSynthesis;
  sintese.onvoiceschanged = callback;
  // Alguns navegadores já têm a lista pronta e nunca disparam o evento.
  if (sintese.getVoices().length > 0) callback();
  return () => {
    if (sintese.onvoiceschanged === callback) sintese.onvoiceschanged = null;
  };
}

export function vozesPortugues(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  try {
    return window.speechSynthesis
      .getVoices()
      .filter((v) => v.lang.toLowerCase().startsWith("pt"))
      .sort((a, b) => pontuarVoz(b) - pontuarVoz(a));
  } catch {
    return [];
  }
}

// Quanto maior a nota, mais natural tende a ser a voz: pt-BR na frente,
// vozes "natural/neural/online" valem muito e as sintéticas antigas perdem.
function pontuarVoz(v: SpeechSynthesisVoice) {
  const nome = v.name.toLowerCase();
  let nota = 0;
  if (v.lang.toLowerCase().replace("_", "-") === "pt-br") nota += 10;
  if (VOZES_NATURAIS.some((p) => nome.includes(p))) nota += 20;
  if (VOZES_ROBOTICAS.some((p) => nome.includes(p))) nota -= 20;
  if (!v.localService) nota += 5; // vozes de servidor costumam ser as melhores
  return nota;
}

export function vozPreferida(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(VOZ_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function definirVozPreferida(nome: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (nome) window.localStorage.setItem(VOZ_STORAGE_KEY, nome);
    else window.localStorage.removeItem(VOZ_STORAGE_KEY);
  } catch {
    // ignora erros de storage (ex.: navegação privada)
  }
}

function escolherVoz(): SpeechSynthesisVoice | undefined {
  const vozes = vozesPortugues();
  if (vozes.length === 0) return undefined;
  const salva = vozPreferida();
  return vozes.find((v) => v.name === salva) ?? vozes[0];
}

export function falar(texto: string, opcoes: { rate?: number; pitch?: number } = {}) {
  if (typeof window === "undefined") return;
  pararAudio();
  // Áudio gravado: voz neural igual em qualquer aparelho.
  const banco = bancoComAudio(texto);
  if (banco) {
    try {
      const audio = new Audio(`/audio/${banco}/${slugDeTexto(texto)}.mp3`);
      // Mantém o tom ao desacelerar, em vez de virar voz de desenho animado.
      audio.preservesPitch = true;
      audio.playbackRate = Math.min(2, Math.max(0.5, opcoes.rate ?? 1));
      audio.onerror = () => falarComNavegador(texto, opcoes);
      audioAtual = audio;
      void audio.play().catch(() => falarComNavegador(texto, opcoes));
      return;
    } catch {
      /* cai para a voz do navegador */
    }
  }
  falarComNavegador(texto, opcoes);
}

function falarComNavegador(texto: string, opcoes: { rate?: number; pitch?: number } = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "pt-BR";
    u.rate = opcoes.rate ?? 0.95;
    u.pitch = opcoes.pitch ?? 1.05;
    const voz = escolherVoz();
    if (voz) {
      u.voice = voz;
      u.lang = voz.lang;
    }
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export function tocarTom(frequencia: number, duracao = 220, tipo: OscillatorType = "sine") {
  if (typeof window === "undefined") return;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tipo;
    osc.frequency.value = frequencia;
    gain.gain.value = 0.15;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duracao / 1000);
    osc.stop(ctx.currentTime + duracao / 1000);
    setTimeout(() => ctx.close(), duracao + 100);
  } catch {
    /* ignore */
  }
}

export function tocarSucesso() {
  tocarTom(660, 140, "triangle");
  setTimeout(() => tocarTom(880, 220, "triangle"), 140);
}

export function tocarErro() {
  tocarTom(300, 200, "sine");
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechResultEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechResultEventLike {
  resultIndex: number;
  results: {
    length: number;
    [i: number]: { isFinal: boolean; length: number; [j: number]: { transcript: string } };
  };
}

/** Tempo máximo de escuta, para o microfone nunca ficar ligado à toa. */
const LIMITE_ESCUTA_MS = 20000;
/** Silêncio depois de falar que encerra a escuta e manda conferir. */
const PAUSA_FINAL_MS = 900;

// Liga o microfone para ouvir uma fala e verificar depois se bate com a
// palavra/frase esperada. Retorna false se o navegador não suportar.
export function ouvir(opcoes: {
  onResult: (transcricao: string) => void;
  /**
   * Confere o que já foi ouvido enquanto a pessoa ainda fala. Assim que
   * devolve true a escuta encerra na hora — é o que faz o "Consegui!"
   * aparecer no mesmo instante em que a frase termina.
   */
  aceitar?: (parcial: string) => boolean;
  onError?: () => void;
  onEnd?: () => void;
}): boolean {
  if (typeof window === "undefined") return false;
  const SpeechRecognitionCtor =
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike })
      .SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike })
      .webkitSpeechRecognition;
  if (!SpeechRecognitionCtor) return false;

  try {
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "pt-BR";
    // Frases longas saem em pedaços: juntamos tudo e só conferimos no fim,
    // senão a primeira pausa no meio do trava-língua já reprovava a tentativa.
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalizado = "";
    let parcial = "";
    let silencio: ReturnType<typeof setTimeout> | null = null;
    let encerrando = false;
    const encerrar = () => {
      if (encerrando) return;
      encerrando = true;
      if (silencio) clearTimeout(silencio);
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    };

    const pararPorSilencio = () => {
      if (silencio) clearTimeout(silencio);
      silencio = setTimeout(encerrar, PAUSA_FINAL_MS);
    };

    recognition.onresult = (event) => {
      parcial = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const resultado = event.results[i];
        const texto = resultado?.[0]?.transcript ?? "";
        if (resultado?.isFinal) finalizado += " " + texto;
        else parcial += " " + texto;
      }
      const ouvido = (finalizado + " " + parcial).trim();
      if (opcoes.aceitar?.(ouvido)) encerrar();
      else pararPorSilencio();
    };
    recognition.onerror = () => opcoes.onError?.();

    const limite = setTimeout(encerrar, LIMITE_ESCUTA_MS);

    recognition.onend = () => {
      clearTimeout(limite);
      if (silencio) clearTimeout(silencio);
      opcoes.onResult((finalizado + " " + parcial).trim());
      opcoes.onEnd?.();
    };
    recognition.start();
    return true;
  } catch {
    return false;
  }
}

function normalizarPalavra(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export function palavraCorresponde(transcricao: string, alvo: string) {
  const ouvida = normalizarPalavra(transcricao);
  const esperada = normalizarPalavra(alvo);
  if (!ouvida) return false;
  return ouvida === esperada || ouvida.includes(esperada) || esperada.includes(ouvida);
}

function normalizarTexto(texto: string) {
  return (
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      // "batata-doce" vira duas palavras, que é como o microfone devolve.
      .replace(/-/g, " ")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

// Em frases longas o reconhecimento quase sempre perde uma palavrinha ("o",
// "a", "pro"), então exigir 100% trava o exercício. A tolerância cresce com o
// tamanho da frase: até 3 palavras precisa de tudo; acima disso liberamos
// cerca de uma palavra a cada seis, sempre pedindo no mínimo 75% de acerto.
export function limiteDaFrase(alvo: string) {
  const total = normalizarTexto(alvo).split(" ").filter(Boolean).length;
  if (total <= 3) return 1;
  const perdoadas = Math.max(1, Math.round(total / 6));
  return Math.max(0.75, (total - perdoadas) / total);
}

// Confere uma frase palavra por palavra: cada ocorrência de cada palavra alvo
// precisa aparecer no que foi ouvido (palavras repetidas contam cada vez) e o
// acerto precisa alcançar `limite` do total.
export function fraseCorresponde(transcricao: string, alvo: string, limite = limiteDaFrase(alvo)) {
  const palavrasAlvo = normalizarTexto(alvo).split(" ").filter(Boolean);
  if (palavrasAlvo.length === 0) return false;
  const palavrasOuvidas = normalizarTexto(transcricao).split(" ").filter(Boolean);
  if (palavrasOuvidas.length === 0) return false;

  const restantes = new Map<string, number>();
  for (const p of palavrasOuvidas) restantes.set(p, (restantes.get(p) ?? 0) + 1);

  let acertadas = 0;
  for (const p of palavrasAlvo) {
    const quantidade = restantes.get(p) ?? 0;
    if (quantidade > 0) {
      acertadas++;
      restantes.set(p, quantidade - 1);
    }
  }
  return acertadas / palavrasAlvo.length >= limite;
}
