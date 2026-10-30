export type Position = "inicio" | "meio" | "fim";

export interface Word {
  word: string;
  position: Position;
  emoji: string;
}

export interface Phoneme {
  id: string;
  letter: string;
  name: string;
  color: string;
  /** Como a fonoaudiologia nomeia o som: ponto, modo e vozeamento. */
  classification: string;
  mouthInstruction: string;
  mouthTip: string;
  words: Word[];
}

export const phonemes: Phoneme[] = [
  {
    id: "b",
    letter: "B",
    name: "Fonema B",
    color: "oklch(0.75 0.15 20)",
    classification: "Oclusiva bilabial sonora",
    mouthInstruction:
      "Feche os lábios, acumule o ar atrás deles e solte de uma vez, com a voz ligada. É o mesmo movimento do P, acrescido da vibração das pregas vocais.",
    mouthTip:
      "Com a mão apoiada na garganta, o B vibra e o P não. Alternar os dois ajuda a perceber a diferença.",
    words: [
      { word: "BOLA", position: "inicio", emoji: "⚽" },
      { word: "BOLO", position: "inicio", emoji: "🎂" },
      { word: "BALÃO", position: "inicio", emoji: "🎈" },
      { word: "BANANA", position: "inicio", emoji: "🍌" },
      { word: "BORRACHA", position: "inicio", emoji: "🧽" },
      { word: "BEBÊ", position: "inicio", emoji: "👶" },
      { word: "BICO", position: "inicio", emoji: "😗" },
      { word: "BOTA", position: "inicio", emoji: "👢" },
      { word: "BARCO", position: "inicio", emoji: "⛵" },
      { word: "BOMBEIRO", position: "inicio", emoji: "🧑‍🚒" },
      { word: "SABÃO", position: "meio", emoji: "🧼" },
      { word: "CEBOLA", position: "meio", emoji: "🧅" },
      { word: "TUBARÃO", position: "meio", emoji: "🦈" },
      { word: "ABELHA", position: "meio", emoji: "🐝" },
      { word: "COBERTOR", position: "meio", emoji: "🛏️" },
      { word: "ROBÔ", position: "meio", emoji: "🤖" },
      { word: "ABACAXI", position: "meio", emoji: "🍍" },
      { word: "BIBLIOTECA", position: "meio", emoji: "📚" },
      { word: "BORBOLETA", position: "meio", emoji: "🦋" },
      { word: "CABIDE", position: "meio", emoji: "🧥" },
      { word: "LABIRINTO", position: "meio", emoji: "🌀" },
      { word: "BEBIDA", position: "meio", emoji: "🥤" },
      { word: "CABELO", position: "meio", emoji: "🦱" },
      { word: "CLUBE", position: "fim", emoji: "🏟️" },
      { word: "WEB", position: "fim", emoji: "🌐" },
      { word: "SUB", position: "fim", emoji: "⬇️" },
      { word: "QUIBE", position: "fim", emoji: "🥙" },
      { word: "COUBE", position: "fim", emoji: "📦" },
    ],
  },
  {
    id: "p",
    letter: "P",
    name: "Fonema P",
    color: "oklch(0.78 0.14 30)",
    classification: "Oclusiva bilabial surda",
    mouthInstruction:
      "Feche os lábios, acumule o ar atrás deles e libere de uma vez, sem usar a voz. O som é breve e sai todo no momento da soltura.",
    mouthTip:
      "Com a mão espalmada à frente da boca, sente-se o jato de ar no instante em que os lábios se abrem.",
    words: [
      { word: "PATO", position: "inicio", emoji: "🦆" },
      { word: "PIPA", position: "inicio", emoji: "🪁" },
      { word: "PERA", position: "inicio", emoji: "🍐" },
      { word: "PANELA", position: "inicio", emoji: "🍲" },
      { word: "PEIXE", position: "inicio", emoji: "🐟" },
      { word: "PENTE", position: "inicio", emoji: "🪮" },
      { word: "PORTA", position: "inicio", emoji: "🚪" },
      { word: "PIRULITO", position: "inicio", emoji: "🍭" },
      { word: "PIPOCA", position: "inicio", emoji: "🍿" },
      { word: "SAPATO", position: "meio", emoji: "👞" },
      { word: "TAPETE", position: "meio", emoji: "🟫" },
      { word: "APITO", position: "meio", emoji: "📯" },
      { word: "PIPOCA", position: "meio", emoji: "🍿" },
      { word: "CAPIVARA", position: "meio", emoji: "🦫" },
      { word: "COMPUTADOR", position: "meio", emoji: "💻" },
      { word: "PAPELÃO", position: "meio", emoji: "📦" },
      { word: "HIPOPÓTAMO", position: "meio", emoji: "🦛" },
      { word: "CAMPEÃO", position: "meio", emoji: "🏆" },
      { word: "CHAPÉU", position: "meio", emoji: "👒" },
      { word: "RAPADURA", position: "meio", emoji: "🍬" },
      { word: "COPO", position: "meio", emoji: "🥛" },
      { word: "PAPEL", position: "fim", emoji: "📄" },
      { word: "JEEP", position: "fim", emoji: "🚙" },
      { word: "CLIP", position: "fim", emoji: "📎" },
      { word: "RAP", position: "fim", emoji: "🎤" },
      { word: "LAPTOP", position: "fim", emoji: "💻" },
    ],
  },
  {
    id: "d",
    letter: "D",
    name: "Fonema D",
    color: "oklch(0.7 0.14 320)",
    classification: "Oclusiva alveolar sonora",
    mouthInstruction:
      "Apoie a ponta da língua logo atrás dos dentes superiores, bloqueie a passagem do ar e solte, mantendo a voz ligada.",
    mouthTip: "A posição da língua é a mesma do T. O que muda é a vibração da garganta.",
    words: [
      { word: "DEDO", position: "inicio", emoji: "👆" },
      { word: "DADO", position: "inicio", emoji: "🎲" },
      { word: "DINOSSAURO", position: "inicio", emoji: "🦕" },
      { word: "DENTE", position: "inicio", emoji: "🦷" },
      { word: "DOCE", position: "inicio", emoji: "🍬" },
      { word: "DOMINGO", position: "inicio", emoji: "📅" },
      { word: "DINHEIRO", position: "inicio", emoji: "💰" },
      { word: "CADERNO", position: "meio", emoji: "📓" },
      { word: "GELADEIRA", position: "meio", emoji: "🧊" },
      { word: "SOLDADO", position: "meio", emoji: "💂" },
      { word: "PEDREIRO", position: "meio", emoji: "👷" },
      { word: "MEDICINA", position: "meio", emoji: "💊" },
      { word: "ARMADILHA", position: "meio", emoji: "🪤" },
      { word: "CUIDADO", position: "meio", emoji: "⚠️" },
      { word: "SAUDADE", position: "meio", emoji: "💭" },
      { word: "CIDADE", position: "meio", emoji: "🏙️" },
      { word: "VERDADE", position: "meio", emoji: "✅" },
      { word: "MEDALHA", position: "meio", emoji: "🏅" },
      { word: "RODOVIA", position: "meio", emoji: "🛣️" },
      { word: "METADE", position: "fim", emoji: "➗" },
      { word: "PAREDE", position: "fim", emoji: "🧱" },
      { word: "REDE", position: "fim", emoji: "🕸️" },
      { word: "MOEDA", position: "fim", emoji: "🪙" },
      { word: "VERDE", position: "fim", emoji: "🟢" },
    ],
  },
  {
    id: "t",
    letter: "T",
    name: "Fonema T",
    color: "oklch(0.75 0.13 290)",
    classification: "Oclusiva alveolar surda",
    mouthInstruction:
      "Apoie a ponta da língua logo atrás dos dentes superiores, segure o ar e libere rapidamente, sem voz.",
    mouthTip:
      "A soltura é curta e seca. Se o som se alongar, a língua saiu do lugar antes da hora.",
    words: [
      { word: "TATU", position: "inicio", emoji: "🦔" },
      { word: "TIGRE", position: "inicio", emoji: "🐯" },
      { word: "TOMATE", position: "inicio", emoji: "🍅" },
      { word: "TELEFONE", position: "inicio", emoji: "📞" },
      { word: "TESOURA", position: "inicio", emoji: "✂️" },
      { word: "TAPETE", position: "inicio", emoji: "🟫" },
      { word: "TARTARUGA", position: "inicio", emoji: "🐢" },
      { word: "BATATA", position: "meio", emoji: "🥔" },
      { word: "PETECA", position: "meio", emoji: "🏸" },
      { word: "CHUTEIRA", position: "meio", emoji: "👟" },
      { word: "CATAVENTO", position: "meio", emoji: "🎐" },
      { word: "PATINETE", position: "meio", emoji: "🛴" },
      { word: "VITAMINA", position: "meio", emoji: "💊" },
      { word: "MATEMÁTICA", position: "meio", emoji: "➗" },
      { word: "NOTÍCIA", position: "meio", emoji: "📰" },
      { word: "ESTEIRA", position: "meio", emoji: "🏃" },
      { word: "ANTENA", position: "meio", emoji: "📡" },
      { word: "PACOTE", position: "fim", emoji: "📦" },
      { word: "BILHETE", position: "fim", emoji: "🎫" },
      { word: "CHICOTE", position: "fim", emoji: "🪢" },
      { word: "CAPACETE", position: "fim", emoji: "⛑️" },
      { word: "POTE", position: "fim", emoji: "🫙" },
    ],
  },
  {
    id: "z",
    letter: "Z",
    name: "Fonema Z",
    color: "oklch(0.75 0.15 95)",
    classification: "Fricativa alveolar sonora",
    mouthInstruction:
      "Aproxime os dentes, mantenha a língua atrás dos dentes inferiores e deixe o ar passar por um canal estreito, com a voz ligada. O som é contínuo.",
    mouthTip: "Dá para sustentar o Z enquanto houver fôlego — é o zumbido da abelha.",
    words: [
      { word: "ZEBRA", position: "inicio", emoji: "🦓" },
      { word: "ZOOLÓGICO", position: "inicio", emoji: "🦁" },
      { word: "ZÍPER", position: "inicio", emoji: "🤐" },
      { word: "ZERO", position: "inicio", emoji: "0️⃣" },
      { word: "ZANGADO", position: "inicio", emoji: "😠" },
      { word: "COZINHA", position: "meio", emoji: "🍳" },
      { word: "FAZENDA", position: "meio", emoji: "🚜" },
      { word: "AZEITONA", position: "meio", emoji: "🫒" },
      { word: "GAZELA", position: "meio", emoji: "🦌" },
      { word: "VIZINHO", position: "meio", emoji: "🏘️" },
      { word: "AZULEJO", position: "meio", emoji: "🧱" },
      { word: "AZEITE", position: "meio", emoji: "🛢️" },
      { word: "AZEDO", position: "meio", emoji: "🍋" },
      { word: "NARIZ", position: "fim", emoji: "👃" },
      { word: "ARROZ", position: "fim", emoji: "🍚" },
      { word: "JUIZ", position: "fim", emoji: "👨‍⚖️" },
      { word: "RAPAZ", position: "fim", emoji: "🧑" },
      { word: "LUZ", position: "fim", emoji: "💡" },
      { word: "RAÍZ", position: "fim", emoji: "🌱" },
      { word: "FELIZ", position: "fim", emoji: "😄" },
      { word: "CAPUZ", position: "fim", emoji: "🧥" },
    ],
  },
  {
    id: "s",
    letter: "S",
    name: "Fonema S",
    color: "oklch(0.72 0.1 190)",
    classification: "Fricativa alveolar surda",
    mouthInstruction:
      "Mesma posição do Z — dentes próximos e língua atrás dos dentes inferiores —, mas com o ar passando sem voz.",
    mouthTip:
      "Alterne S e Z com a mão na garganta: a boca não muda de posição, só a vibração entra e sai.",
    words: [
      { word: "SAPO", position: "inicio", emoji: "🐸" },
      { word: "SALA", position: "inicio", emoji: "🛋️" },
      { word: "SOFÁ", position: "inicio", emoji: "🛋️" },
      { word: "SUCO", position: "inicio", emoji: "🧃" },
      { word: "SALADA", position: "inicio", emoji: "🥗" },
      { word: "SERRA", position: "inicio", emoji: "⛰️" },
      { word: "SEMANA", position: "inicio", emoji: "📆" },
      { word: "PISCINA", position: "meio", emoji: "🏊" },
      { word: "PASSARINHO", position: "meio", emoji: "🐦" },
      { word: "CASTELO", position: "meio", emoji: "🏰" },
      { word: "ESCOVA", position: "meio", emoji: "🪥" },
      { word: "ESCOLA", position: "meio", emoji: "🏫" },
      { word: "SALSICHA", position: "meio", emoji: "🌭" },
      { word: "URSINHO", position: "meio", emoji: "🧸" },
      { word: "CANSADO", position: "meio", emoji: "😴" },
      { word: "CONSULTA", position: "meio", emoji: "🩺" },
      { word: "ENSINO", position: "meio", emoji: "📚" },
      { word: "CONSERTO", position: "meio", emoji: "🔧" },
      { word: "LÁPIS", position: "fim", emoji: "✏️" },
      { word: "PIRES", position: "fim", emoji: "☕" },
      { word: "ÔNIBUS", position: "fim", emoji: "🚌" },
      { word: "FÉRIAS", position: "fim", emoji: "🏖️" },
      { word: "ATLAS", position: "fim", emoji: "🗺️" },
      { word: "PAÍS", position: "fim", emoji: "🌍" },
      { word: "GIS", position: "fim", emoji: "🖍️" },
    ],
  },
  {
    id: "j",
    letter: "J",
    name: "Fonema J",
    color: "oklch(0.75 0.14 65)",
    classification: "Fricativa pós-alveolar sonora",
    mouthInstruction:
      "Projete levemente os lábios, recue a parte da frente da língua em direção ao céu da boca e deixe o ar escapar de forma contínua, com a voz ligada.",
    mouthTip: "É o CH com voz. Sustente o som e ligue a garganta para sentir a troca.",
    words: [
      { word: "JANELA", position: "inicio", emoji: "🪟" },
      { word: "JARDIM", position: "inicio", emoji: "🌷" },
      { word: "JORNAL", position: "inicio", emoji: "📰" },
      { word: "JARRA", position: "inicio", emoji: "🏺" },
      { word: "JOELHO", position: "inicio", emoji: "🦵" },
      { word: "JEITO", position: "inicio", emoji: "🤷" },
      { word: "JILÓ", position: "inicio", emoji: "🍆" },
      { word: "PROJETO", position: "meio", emoji: "📋" },
      { word: "OBJETO", position: "meio", emoji: "📦" },
      { word: "AJUDA", position: "meio", emoji: "🤝" },
      { word: "VIAJANTE", position: "meio", emoji: "🧳" },
      { word: "INJEÇÃO", position: "meio", emoji: "💉" },
      { word: "AJEITAR", position: "meio", emoji: "🔧" },
      { word: "VIAJAR", position: "meio", emoji: "✈️" },
      { word: "SUJEIRA", position: "meio", emoji: "🧹" },
      { word: "TIJOLO", position: "meio", emoji: "🧱" },
      { word: "CAJUEIRO", position: "meio", emoji: "🌳" },
      { word: "SUJEITO", position: "meio", emoji: "🧑" },
      { word: "BEIJOU", position: "fim", emoji: "💋" },
      { word: "VIAJOU", position: "fim", emoji: "✈️" },
      { word: "SUJOU", position: "fim", emoji: "🫧" },
      { word: "AJUDOU", position: "fim", emoji: "🤝" },
      { word: "PLANEJOU", position: "fim", emoji: "📝" },
    ],
  },
  {
    id: "ch",
    letter: "CH",
    name: "Fonema CH",
    color: "oklch(0.72 0.15 335)",
    classification: "Fricativa pós-alveolar surda",
    mouthInstruction:
      "Projete os lábios, aproxime a parte da frente da língua do céu da boca e deixe o ar sair por uma fenda estreita, sem voz.",
    mouthTip: "É o gesto de pedir silêncio. O ar sai contínuo, nunca em estouro.",
    words: [
      { word: "CHUVA", position: "inicio", emoji: "🌧️" },
      { word: "CHAVE", position: "inicio", emoji: "🔑" },
      { word: "CHOCOLATE", position: "inicio", emoji: "🍫" },
      { word: "CHAPÉU", position: "inicio", emoji: "👒" },
      { word: "CHINELO", position: "inicio", emoji: "🩴" },
      { word: "CHURRASCO", position: "inicio", emoji: "🍖" },
      { word: "CHAMINÉ", position: "inicio", emoji: "🏭" },
      { word: "MOCHILA", position: "meio", emoji: "🎒" },
      { word: "CACHORRO", position: "meio", emoji: "🐶" },
      { word: "COLCHÃO", position: "meio", emoji: "🛏️" },
      { word: "BOCHECHA", position: "meio", emoji: "😊" },
      { word: "FACHADA", position: "meio", emoji: "🏢" },
      { word: "FECHADURA", position: "meio", emoji: "🔒" },
      { word: "CACHOEIRA", position: "meio", emoji: "🏞️" },
      { word: "COCHILO", position: "meio", emoji: "😴" },
      { word: "ACHOU", position: "fim", emoji: "🔍" },
      { word: "FECHOU", position: "fim", emoji: "🔒" },
      { word: "MACHUCOU", position: "fim", emoji: "🤕" },
      { word: "BUCHA", position: "fim", emoji: "🧽" },
      { word: "COLCHÃO", position: "fim", emoji: "🛏️" },
      { word: "GAÚCHO", position: "fim", emoji: "🤠" },
    ],
  },
  {
    id: "r",
    letter: "R",
    name: "Fonema R",
    color: "oklch(0.7 0.18 25)",
    classification: "Tepe alveolar (e vibrante no início da palavra)",
    mouthInstruction:
      "Entre vogais, a ponta da língua toca uma única vez a região atrás dos dentes superiores — um toque rápido e leve. No início da palavra, o som é produzido mais atrás, na garganta.",
    mouthTip:
      "Palavras com o R entre vogais são o melhor ponto de partida: o toque único é mais fácil que a vibração.",
    words: [
      { word: "RATO", position: "inicio", emoji: "🐭" },
      { word: "ROSA", position: "inicio", emoji: "🌹" },
      { word: "RUA", position: "inicio", emoji: "🛣️" },
      { word: "RELÓGIO", position: "inicio", emoji: "⏰" },
      { word: "RAPOSA", position: "inicio", emoji: "🦊" },
      { word: "RÁDIO", position: "inicio", emoji: "📻" },
      { word: "ROUPA", position: "inicio", emoji: "👕" },
      { word: "BARATA", position: "meio", emoji: "🪳" },
      { word: "MORANGO", position: "meio", emoji: "🍓" },
      { word: "GARRAFA", position: "meio", emoji: "🍾" },
      { word: "CEREJA", position: "meio", emoji: "🍒" },
      { word: "CORUJA", position: "meio", emoji: "🦉" },
      { word: "PIRATA", position: "meio", emoji: "🏴‍☠️" },
      { word: "ARARA", position: "meio", emoji: "🦜" },
      { word: "MARACUJÁ", position: "meio", emoji: "🥭" },
      { word: "CARAMELO", position: "meio", emoji: "🍬" },
      { word: "BORRACHA", position: "meio", emoji: "🧽" },
      { word: "GIRAFA", position: "meio", emoji: "🦒" },
      { word: "ESCORREGA", position: "meio", emoji: "🛝" },
      { word: "CARECA", position: "meio", emoji: "👨‍🦲" },
      { word: "PERIGO", position: "meio", emoji: "⚠️" },
      { word: "COMER", position: "fim", emoji: "🍽️" },
      { word: "ANDAR", position: "fim", emoji: "🚶" },
      { word: "PINTAR", position: "fim", emoji: "🎨" },
      { word: "BRINCAR", position: "fim", emoji: "🧸" },
      { word: "ESTUDAR", position: "fim", emoji: "📖" },
      { word: "JOGAR", position: "fim", emoji: "🎮" },
      { word: "FALAR", position: "fim", emoji: "🗣️" },
      { word: "TRABALHAR", position: "fim", emoji: "💼" },
      { word: "NADAR", position: "fim", emoji: "🏊" },
      { word: "CANTAR", position: "fim", emoji: "🎤" },
      { word: "CAMINHAR", position: "fim", emoji: "🚶" },
      { word: "DESENHAR", position: "fim", emoji: "✏️" },
    ],
  },
  {
    id: "l",
    letter: "L",
    name: "Fonema L",
    color: "oklch(0.72 0.14 145)",
    classification: "Lateral alveolar sonora",
    mouthInstruction:
      "Encoste a ponta da língua atrás dos dentes superiores e mantenha-a apoiada enquanto a voz sai pelas laterais da língua.",
    mouthTip: "A língua fica apoiada durante todo o som — diferente do T e do D, em que ela solta.",
    words: [
      { word: "LUA", position: "inicio", emoji: "🌙" },
      { word: "LAGO", position: "inicio", emoji: "🏞️" },
      { word: "LIVRO", position: "inicio", emoji: "📚" },
      { word: "LEÃO", position: "inicio", emoji: "🦁" },
      { word: "LIMÃO", position: "inicio", emoji: "🍋" },
      { word: "LÁPIS", position: "inicio", emoji: "✏️" },
      { word: "LOBO", position: "inicio", emoji: "🐺" },
      { word: "COLHER", position: "meio", emoji: "🥄" },
      { word: "GELADEIRA", position: "meio", emoji: "🧊" },
      { word: "PALHAÇO", position: "meio", emoji: "🤡" },
      { word: "ELEFANTE", position: "meio", emoji: "🐘" },
      { word: "BOLACHA", position: "meio", emoji: "🍪" },
      { word: "SALADA", position: "meio", emoji: "🥗" },
      { word: "MELANCIA", position: "meio", emoji: "🍉" },
      { word: "BORBOLETA", position: "meio", emoji: "🦋" },
      { word: "TULIPA", position: "meio", emoji: "🌷" },
      { word: "BIBLIOTECA", position: "meio", emoji: "📚" },
      { word: "AMBULÂNCIA", position: "meio", emoji: "🚑" },
      { word: "CALCULADORA", position: "meio", emoji: "🧮" },
      { word: "TELEVISÃO", position: "meio", emoji: "📺" },
      { word: "SOL", position: "fim", emoji: "☀️" },
      { word: "MEL", position: "fim", emoji: "🍯" },
      { word: "ANEL", position: "fim", emoji: "💍" },
      { word: "PAPEL", position: "fim", emoji: "📄" },
      { word: "FUNIL", position: "fim", emoji: "🔻" },
      { word: "VARAL", position: "fim", emoji: "🧺" },
      { word: "FAROL", position: "fim", emoji: "🚨" },
      { word: "QUINTAL", position: "fim", emoji: "🏡" },
      { word: "CANAL", position: "fim", emoji: "🌊" },
      { word: "GIRASSOL", position: "fim", emoji: "🌻" },
      { word: "CORAL", position: "fim", emoji: "🪸" },
      { word: "AVENTAL", position: "fim", emoji: "🥼" },
    ],
  },
  {
    id: "lh",
    letter: "LH",
    name: "Fonema LH",
    color: "oklch(0.68 0.12 170)",
    classification: "Lateral palatal sonora",
    mouthInstruction:
      "Eleve o corpo da língua contra o céu da boca, numa área ampla, e deixe a voz sair pelos lados. A ponta da língua permanece abaixada.",
    mouthTip:
      "No L trabalha a ponta da língua; no LH, o meio. Alternar “la” e “lha” ajuda a perceber.",
    words: [
      { word: "BILHETE", position: "meio", emoji: "🎫" },
      { word: "PALHAÇO", position: "meio", emoji: "🤡" },
      { word: "TELHADO", position: "meio", emoji: "🏠" },
      { word: "FOLHETO", position: "meio", emoji: "📄" },
      { word: "COLHEITA", position: "meio", emoji: "🌾" },
      { word: "OLHEIRA", position: "meio", emoji: "😴" },
      { word: "ACOLHEDOR", position: "meio", emoji: "🤗" },
      { word: "PILHAGEM", position: "meio", emoji: "💰" },
      { word: "ALHO", position: "fim", emoji: "🧄" },
      { word: "MOLHO", position: "fim", emoji: "🍅" },
      { word: "FILHO", position: "fim", emoji: "👦" },
      { word: "FILHA", position: "fim", emoji: "👧" },
      { word: "MILHO", position: "fim", emoji: "🌽" },
      { word: "DETALHE", position: "fim", emoji: "🔍" },
      { word: "ESPELHO", position: "fim", emoji: "🪞" },
      { word: "COELHO", position: "fim", emoji: "🐰" },
      { word: "OVELHA", position: "fim", emoji: "🐑" },
      { word: "ABELHA", position: "fim", emoji: "🐝" },
    ],
  },
  {
    id: "f",
    letter: "F",
    name: "Fonema F",
    color: "oklch(0.75 0.13 220)",
    classification: "Fricativa labiodental surda",
    mouthInstruction:
      "Apoie os dentes superiores sobre o lábio inferior e deixe o ar passar continuamente, sem voz.",
    mouthTip: "O som se sustenta enquanto houver ar. Se terminar em estouro, virou P.",
    words: [
      { word: "FACA", position: "inicio", emoji: "🔪" },
      { word: "FOGO", position: "inicio", emoji: "🔥" },
      { word: "FOLHA", position: "inicio", emoji: "🍃" },
      { word: "FOCA", position: "inicio", emoji: "🦭" },
      { word: "CAFÉ", position: "meio", emoji: "☕" },
      { word: "GIRAFA", position: "meio", emoji: "🦒" },
      { word: "SOFÁ", position: "meio", emoji: "🛋️" },
      { word: "MICROFONE", position: "meio", emoji: "🎤" },
      { word: "CHEF", position: "fim", emoji: "👨‍🍳" },
    ],
  },
  {
    id: "v",
    letter: "V",
    name: "Fonema V",
    color: "oklch(0.7 0.14 260)",
    classification: "Fricativa labiodental sonora",
    mouthInstruction:
      "Mesma posição do F — dentes superiores sobre o lábio inferior —, agora com as pregas vocais vibrando.",
    mouthTip: "Sustente o F e ligue a voz sem mexer a boca: o som vira V.",
    words: [
      { word: "VACA", position: "inicio", emoji: "🐄" },
      { word: "VELA", position: "inicio", emoji: "🕯️" },
      { word: "VOVÓ", position: "inicio", emoji: "👵" },
      { word: "VIOLÃO", position: "inicio", emoji: "🎸" },
      { word: "UVA", position: "meio", emoji: "🍇" },
      { word: "OVO", position: "meio", emoji: "🥚" },
      { word: "CHUVA", position: "meio", emoji: "🌧️" },
    ],
  },
];

/**
 * A série do botão "ouvir as sílabas".
 *
 * O treino é letra, vogal e só então a sílaba: "pê, á, pá". Dizer a sílaba
 * solta, e ainda repetida, saía tudo emendado — "pa, pa" virava uma palavra só.
 * Separando, a criança ouve de que partes o som é feito antes de juntá-las.
 *
 * Os nomes das letras vão escritos como se fala, e não como se escreve: deixar
 * um "P" sozinho no texto faz a voz sintética ler qualquer coisa; "pê" ela lê
 * certo em qualquer aparelho.
 *
 * E vão com acento onde o nome tem E aberto — "ésse", "érre", "éle", "éfe".
 * Sem ele a voz fecha a vogal e sai "êsse", que soa como o pronome "esse"; o
 * nome da letra se perde justamente no som que a criança precisa ouvir.
 *
 * As sílabas também levam acento (pá, pé, pó), para a vogal sair aberta e
 * marcada, como na sala de terapia.
 */
const NOME_DA_LETRA: Record<string, string> = {
  B: "bê",
  P: "pê",
  D: "dê",
  T: "tê",
  Z: "zê",
  S: "ésse",
  J: "jota",
  CH: "cê agá",
  R: "érre",
  L: "éle",
  LH: "éle agá",
  F: "éfe",
  V: "vê",
};

/** Nome e forma acentuada de cada vogal. */
const VOGAIS_FALADAS = [
  { nome: "á", silaba: "á" },
  { nome: "é", silaba: "é" },
  { nome: "i", silaba: "i" },
  { nome: "ó", silaba: "ó" },
  { nome: "u", silaba: "u" },
] as const;

export const VOGAIS = VOGAIS_FALADAS.map((v) => v.nome);

export function silabasDe(fonema: Pick<Phoneme, "letter">) {
  const letra = fonema.letter.toUpperCase();
  const nome = NOME_DA_LETRA[letra] ?? letra.toLowerCase();
  const base = letra.toLowerCase();
  const serie = VOGAIS_FALADAS.map((v) => `${nome}, ${v.nome}, ${base}${v.silaba}`).join(". ");
  // O convite no fim não é enfeite: a voz relaxa na última frase que diz, e sem
  // ele quem levava o relaxamento era o "zó, zu" do Z — o som perdia metade da
  // vibração e escorregava para "só, su". Com o convite ali, a queda cai nele.
  return `${serie}. Agora é a sua vez.`;
}
