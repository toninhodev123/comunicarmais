/**
 * Pares mínimos: duas palavras que mudam de sentido por causa de um som só.
 *
 * É o exercício mais direto que existe para mostrar à criança *por que* vale a
 * pena acertar o som — trocar o F pelo V não deixa a fala "feia", deixa a faca
 * virar vaca. Primeiro ela escuta e aponta qual foi dita (discriminação), e
 * depois fala ela mesma (produção), que é quando o microfone precisa separar
 * um do outro.
 *
 * Todas as palavras daqui têm gravação nos dois bancos de voz — sem isso o
 * exercício perderia o sentido, porque a diferença entre as duas tem de ser
 * ouvida com clareza.
 */

export interface PalavraDoPar {
  word: string;
  emoji: string;
}

export interface ParMinimo {
  id: string;
  a: PalavraDoPar;
  b: PalavraDoPar;
  /** As duas letras em contraste, para o título da rodada. */
  contraste: string;
  /** O que exatamente muda na boca entre uma e outra. */
  foco: string;
  /** Onde no meio da palavra está a diferença. */
  posicao: "inicio" | "meio";
}

export const minimalPairs: ParMinimo[] = [
  {
    id: "f-v",
    a: { word: "FACA", emoji: "🔪" },
    b: { word: "VACA", emoji: "🐄" },
    contraste: "F e V",
    foco: "A boca é a mesma: dentes de cima no lábio de baixo. No V a garganta vibra; no F, não.",
    posicao: "inicio",
  },
  {
    id: "p-d",
    a: { word: "PENTE", emoji: "🪮" },
    b: { word: "DENTE", emoji: "🦷" },
    contraste: "P e D",
    foco: "O P fecha os lábios; o D encosta a língua atrás dos dentes de cima e usa a voz.",
    posicao: "inicio",
  },
  {
    id: "p-g",
    a: { word: "PATO", emoji: "🦆" },
    b: { word: "GATO", emoji: "🐱" },
    contraste: "P e G",
    foco: "O P sai na frente, nos lábios. O G sai lá no fundo, perto da garganta.",
    posicao: "inicio",
  },
  {
    id: "r-g",
    a: { word: "RATO", emoji: "🐭" },
    b: { word: "GATO", emoji: "🐱" },
    contraste: "R e G",
    foco: "Os dois saem do fundo da boca, mas o R arranha e o G é um toque seco.",
    posicao: "inicio",
  },
  {
    id: "p-m",
    a: { word: "PÃO", emoji: "🍞" },
    b: { word: "MÃO", emoji: "✋" },
    contraste: "P e M",
    foco: "Os dois juntam os lábios. No M o ar sai pelo nariz e dá para segurar o som; no P, não.",
    posicao: "inicio",
  },
  {
    id: "f-m",
    a: { word: "FILHO", emoji: "👦" },
    b: { word: "MILHO", emoji: "🌽" },
    contraste: "F e M",
    foco: "O F sopra entre dente e lábio. O M fecha a boca e manda o som pelo nariz.",
    posicao: "inicio",
  },
  {
    id: "p-j",
    a: { word: "PANELA", emoji: "🍲" },
    b: { word: "JANELA", emoji: "🪟" },
    contraste: "P e J",
    foco: "O P estoura e acaba. O J é longo, com os lábios à frente e a garganta vibrando.",
    posicao: "inicio",
  },
  {
    id: "j-c",
    a: { word: "JOELHO", emoji: "🦵" },
    b: { word: "COELHO", emoji: "🐰" },
    contraste: "J e C",
    foco: "O J se sustenta e vibra. O C é um toque curto no fundo da boca.",
    posicao: "inicio",
  },
  {
    id: "r-l-rua",
    a: { word: "RUA", emoji: "🛣️" },
    b: { word: "LUA", emoji: "🌙" },
    contraste: "R e L",
    foco: "No L a ponta da língua cola atrás dos dentes e fica lá. No R ela toca e solta.",
    posicao: "inicio",
  },
  {
    id: "r-l-robo",
    a: { word: "ROBÔ", emoji: "🤖" },
    b: { word: "LOBO", emoji: "🐺" },
    contraste: "R e L",
    foco: "O mesmo contraste do rua e lua, agora numa palavra mais comprida.",
    posicao: "inicio",
  },
  {
    id: "t-r-meio",
    a: { word: "BATATA", emoji: "🥔" },
    b: { word: "BARATA", emoji: "🪳" },
    contraste: "T e R no meio",
    foco: "No meio da palavra é onde a troca mais escapa. O T para o ar; o R só encosta.",
    posicao: "meio",
  },
  {
    id: "v-l-meio",
    a: { word: "ESCOVA", emoji: "🪥" },
    b: { word: "ESCOLA", emoji: "🏫" },
    contraste: "V e L no meio",
    foco: "Duas palavras que a criança usa todo dia e que mudam por uma letra no meio.",
    posicao: "meio",
  },
  {
    id: "l-t-meio",
    a: { word: "BOLA", emoji: "⚽" },
    b: { word: "BOTA", emoji: "👢" },
    contraste: "L e T no meio",
    foco: "A língua vai ao mesmo lugar. No L o som escapa pelos lados; no T, estoura.",
    posicao: "meio",
  },
  {
    id: "vogal-bola",
    a: { word: "BOLA", emoji: "⚽" },
    b: { word: "BOLO", emoji: "🎂" },
    contraste: "A e O no fim",
    foco: "Só a última vogal muda. Exige terminar a palavra, em vez de deixá-la no ar.",
    posicao: "meio",
  },
  {
    id: "vogal-dedo",
    a: { word: "DEDO", emoji: "👆" },
    b: { word: "DADO", emoji: "🎲" },
    contraste: "E e A",
    foco: "A boca abre mais no A que no E. Dá para ver no espelho.",
    posicao: "meio",
  },
  {
    id: "vogal-faca",
    a: { word: "FACA", emoji: "🔪" },
    b: { word: "FOCA", emoji: "🦭" },
    contraste: "A e O",
    foco: "No O os lábios fazem um círculo; no A eles ficam soltos.",
    posicao: "meio",
  },
  {
    id: "vogal-filha",
    a: { word: "FILHA", emoji: "👧" },
    b: { word: "FOLHA", emoji: "🍃" },
    contraste: "I e O",
    foco: "O I é estreito e sorridente; o O é redondo. Opostos, dá para exagerar.",
    posicao: "meio",
  },
  {
    id: "vogal-milho",
    a: { word: "MILHO", emoji: "🌽" },
    b: { word: "MOLHO", emoji: "🍅" },
    contraste: "I e O",
    foco: "O mesmo contraste, agora com o LH no meio das duas.",
    posicao: "meio",
  },
  {
    id: "vogal-filho",
    a: { word: "FILHO", emoji: "👦" },
    b: { word: "FILHA", emoji: "👧" },
    contraste: "O e A no fim",
    foco: "Mudar a última vogal muda quem é. Bom para fechar bem o fim da palavra.",
    posicao: "meio",
  },
];
