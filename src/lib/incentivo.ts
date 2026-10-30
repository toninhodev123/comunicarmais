/**
 * O que o app diz quando a criança não acerta.
 *
 * Nunca repetimos de volta o que o microfone entendeu. Ouvir "ouvi: bicicreta"
 * depois de ter se esforçado é a forma mais rápida de alguém parar de tentar —
 * e, pior, o reconhecimento erra sozinho às vezes, então a criança levaria a
 * culpa por um erro que não foi dela. No lugar disso vem um empurrão: o que
 * fazer agora e a certeza de que faltou pouco.
 */

/** Quase lá — o reconhecimento chegou perto do alvo. */
const QUASE = [
  "Quase lá! Tenta mais uma vez.",
  "Tá chegando! Só mais uma.",
  "Faltou pouquinho. Bora de novo!",
  "Opa, quase! Mais uma vez.",
  "Tá no caminho certo. Tenta de novo!",
];

/** Longe do alvo, ou o microfone não entendeu nada do que veio. */
const VAMOS_LA = [
  "Vamos lá, você consegue!",
  "De novo, com calma e bem devagar.",
  "Respira fundo e tenta mais uma vez.",
  "Ouça a palavra outra vez e repita junto.",
  "Sem pressa. Fala pertinho do microfone!",
  "Mais uma tentativa — você está indo bem!",
];

/** O microfone não captou nada. */
const SEM_SOM = [
  "Não escutei dessa vez. Fala um pouquinho mais alto!",
  "Acho que o som não chegou. Tenta de novo, pertinho do microfone.",
  "Silêncio total por aqui! Bora tentar mais uma vez?",
];

const ULTIMA = new Map<string, string>();

/** Sorteia sem repetir a frase anterior da mesma lista. */
function sortear(chave: string, lista: string[]) {
  const anterior = ULTIMA.get(chave);
  const opcoes = lista.length > 1 ? lista.filter((f) => f !== anterior) : lista;
  const escolhida = opcoes[Math.floor(Math.random() * opcoes.length)];
  ULTIMA.set(chave, escolhida);
  return escolhida;
}

/**
 * A frase de incentivo da vez. `proximidade` é o quanto do alvo foi reconhecido
 * (0 a 1): perto de 1, elogiamos o "quase"; sem nada reconhecido, pedimos mais
 * voz. Quem não souber medir pode simplesmente omitir.
 */
export function fraseDeIncentivo(proximidade?: number) {
  if (proximidade === 0) return sortear("sem-som", SEM_SOM);
  if (proximidade !== undefined && proximidade >= 0.5) return sortear("quase", QUASE);
  return sortear("vamos-la", VAMOS_LA);
}
