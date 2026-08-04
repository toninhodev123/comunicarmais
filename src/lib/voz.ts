// Funções de apoio sobre a Web Speech API do navegador (texto-em-fala e
// reconhecimento de fala), usadas pelo microfone em todas as atividades.

export function falar(texto: string, opcoes: { rate?: number; pitch?: number } = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "pt-BR";
    u.rate = opcoes.rate ?? 0.9;
    u.pitch = opcoes.pitch ?? 1;
    const vozes = window.speechSynthesis.getVoices();
    const vozPt = vozes.find((v) => v.lang.startsWith("pt"));
    if (vozPt) u.voice = vozPt;
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
  interimResults: boolean;
  maxAlternatives: number;
  onresult:
    | ((event: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

// Liga o microfone para ouvir uma fala e verificar depois se bate com a
// palavra/frase esperada. Retorna false se o navegador não suportar.
export function ouvir(opcoes: {
  onResult: (transcricao: string) => void;
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
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcricao = event.results?.[0]?.[0]?.transcript ?? "";
      opcoes.onResult(transcricao);
    };
    recognition.onerror = () => opcoes.onError?.();
    recognition.onend = () => opcoes.onEnd?.();
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
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Confere uma frase inteira palavra por palavra: cada ocorrência de cada
// palavra alvo precisa aparecer no que foi ouvido (palavras repetidas contam
// cada vez), então errar até a última palavra faz a verificação falhar.
export function fraseCorresponde(transcricao: string, alvo: string, limite = 1) {
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
