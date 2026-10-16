export interface DeepItem {
  name: string;
  emoji: string;
  parts: { name: string; emoji: string }[];
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  items: DeepItem[];
}

export const categories: Category[] = [
  {
    id: "transporte",
    name: "Meios de Transporte",
    emoji: "🚗",
    color: "oklch(0.78 0.13 240)",
    items: [
      {
        name: "Carro",
        emoji: "🚗",
        parts: [
          { name: "Volante", emoji: "🛞" },
          { name: "Pneu", emoji: "⚫" },
          { name: "Porta", emoji: "🚪" },
          { name: "Banco", emoji: "💺" },
          { name: "Farol", emoji: "💡" },
          { name: "Janela", emoji: "🪟" },
        ],
      },
      {
        name: "Bicicleta",
        emoji: "🚲",
        parts: [
          { name: "Roda", emoji: "☸️" },
          { name: "Guidão", emoji: "🛞" },
          { name: "Pedal", emoji: "🦶" },
          { name: "Selim", emoji: "💺" },
          { name: "Corrente", emoji: "⛓️" },
        ],
      },
      {
        name: "Avião",
        emoji: "✈️",
        parts: [
          { name: "Asa", emoji: "🪽" },
          { name: "Hélice", emoji: "🌀" },
          { name: "Janela", emoji: "🪟" },
          { name: "Cauda", emoji: "🛩️" },
          { name: "Cabine", emoji: "🧑‍✈️" },
        ],
      },
      {
        name: "Ônibus",
        emoji: "🚌",
        parts: [
          { name: "Porta", emoji: "🚪" },
          { name: "Pneu", emoji: "⚫" },
          { name: "Banco", emoji: "💺" },
          { name: "Janela", emoji: "🪟" },
          { name: "Catraca", emoji: "🔄" },
          { name: "Retrovisor", emoji: "🪞" },
        ],
      },
      {
        name: "Trem",
        emoji: "🚆",
        parts: [
          { name: "Vagão", emoji: "🚃" },
          { name: "Trilho", emoji: "🛤️" },
          { name: "Roda", emoji: "☸️" },
          { name: "Janela", emoji: "🪟" },
          { name: "Cabine", emoji: "🧑‍✈️" },
        ],
      },
      {
        name: "Moto",
        emoji: "🏍️",
        parts: [
          { name: "Guidão", emoji: "🛞" },
          { name: "Roda", emoji: "☸️" },
          { name: "Banco", emoji: "💺" },
          { name: "Motor", emoji: "⚙️" },
          { name: "Farol", emoji: "💡" },
          { name: "Escapamento", emoji: "💨" },
        ],
      },
    ],
  },
  {
    id: "alimentos",
    name: "Alimentos",
    emoji: "🍎",
    color: "oklch(0.78 0.14 30)",
    items: [
      {
        name: "Maçã",
        emoji: "🍎",
        parts: [
          { name: "Casca", emoji: "🟥" },
          { name: "Polpa", emoji: "⚪" },
          { name: "Semente", emoji: "🌰" },
          { name: "Cabinho", emoji: "🌱" },
        ],
      },
      {
        name: "Pão",
        emoji: "🍞",
        parts: [
          { name: "Casca", emoji: "🟫" },
          { name: "Miolo", emoji: "⚪" },
          { name: "Farinha", emoji: "🌾" },
        ],
      },
      {
        name: "Pizza",
        emoji: "🍕",
        parts: [
          { name: "Massa", emoji: "🟡" },
          { name: "Molho", emoji: "🔴" },
          { name: "Queijo", emoji: "🧀" },
          { name: "Recheio", emoji: "🍅" },
          { name: "Borda", emoji: "🥖" },
        ],
      },
      {
        name: "Banana",
        emoji: "🍌",
        parts: [
          { name: "Casca", emoji: "🟡" },
          { name: "Polpa", emoji: "⚪" },
          { name: "Pontinha", emoji: "🔸" },
        ],
      },
      {
        name: "Laranja",
        emoji: "🍊",
        parts: [
          { name: "Casca", emoji: "🟠" },
          { name: "Gomo", emoji: "🍊" },
          { name: "Semente", emoji: "🌰" },
          { name: "Suco", emoji: "🥤" },
        ],
      },
      {
        name: "Melancia",
        emoji: "🍉",
        parts: [
          { name: "Casca verde", emoji: "🟩" },
          { name: "Polpa vermelha", emoji: "🟥" },
          { name: "Semente", emoji: "⚫" },
        ],
      },
      {
        name: "Ovo",
        emoji: "🥚",
        parts: [
          { name: "Casca", emoji: "🥚" },
          { name: "Clara", emoji: "⚪" },
          { name: "Gema", emoji: "🟡" },
        ],
      },
      {
        name: "Leite",
        emoji: "🥛",
        parts: [
          { name: "Caixa", emoji: "📦" },
          { name: "Garrafa", emoji: "🍼" },
          { name: "Líquido branco", emoji: "⚪" },
        ],
      },
    ],
  },
  {
    id: "animais",
    name: "Animais",
    emoji: "🐶",
    color: "oklch(0.78 0.14 80)",
    items: [
      {
        name: "Cachorro",
        emoji: "🐶",
        parts: [
          { name: "Pata", emoji: "🐾" },
          { name: "Orelha", emoji: "👂" },
          { name: "Focinho", emoji: "👃" },
          { name: "Pelo", emoji: "🟫" },
        ],
      },
      {
        name: "Peixe",
        emoji: "🐟",
        parts: [
          { name: "Nadadeira", emoji: "🪽" },
          { name: "Cauda", emoji: "🐠" },
          { name: "Escama", emoji: "🐡" },
          { name: "Olho", emoji: "👁️" },
          { name: "Boca", emoji: "👄" },
        ],
      },
      {
        name: "Pássaro",
        emoji: "🐦",
        parts: [
          { name: "Asa", emoji: "🪽" },
          { name: "Bico", emoji: "🔻" },
          { name: "Pena", emoji: "🪶" },
          { name: "Garra", emoji: "🦅" },
        ],
      },
      {
        name: "Gato",
        emoji: "🐱",
        parts: [
          { name: "Pata", emoji: "🐾" },
          { name: "Orelha", emoji: "👂" },
          { name: "Pelo", emoji: "🟫" },
          { name: "Bigode", emoji: "〰️" },
          { name: "Rabo", emoji: "🪢" },
        ],
      },
      {
        name: "Leão",
        emoji: "🦁",
        parts: [
          { name: "Juba", emoji: "🦁" },
          { name: "Pata", emoji: "🐾" },
          { name: "Garra", emoji: "🪝" },
          { name: "Dente", emoji: "🦷" },
          { name: "Rabo", emoji: "🪢" },
        ],
      },
      {
        name: "Macaco",
        emoji: "🐒",
        parts: [
          { name: "Pata", emoji: "🐾" },
          { name: "Rabo", emoji: "🪢" },
          { name: "Orelha", emoji: "👂" },
          { name: "Pelo", emoji: "🟫" },
          { name: "Nariz", emoji: "👃" },
        ],
      },
      {
        name: "Galinha",
        emoji: "🐔",
        parts: [
          { name: "Bico", emoji: "🔻" },
          { name: "Pena", emoji: "🪶" },
          { name: "Asa", emoji: "🪽" },
          { name: "Pata", emoji: "🐾" },
          { name: "Crista", emoji: "🔺" },
        ],
      },
      {
        name: "Tartaruga",
        emoji: "🐢",
        parts: [
          { name: "Casco", emoji: "🛡️" },
          { name: "Pata", emoji: "🐾" },
          { name: "Cabeça", emoji: "🟢" },
          { name: "Rabo", emoji: "🪢" },
        ],
      },
    ],
  },
  {
    id: "casa",
    name: "Casa",
    emoji: "🏠",
    color: "oklch(0.78 0.13 145)",
    items: [
      {
        name: "Casa",
        emoji: "🏠",
        parts: [
          { name: "Telhado", emoji: "🔺" },
          { name: "Porta", emoji: "🚪" },
          { name: "Janela", emoji: "🪟" },
          { name: "Parede", emoji: "🧱" },
          { name: "Quintal", emoji: "🌳" },
        ],
      },
      {
        name: "Cozinha",
        emoji: "🍳",
        parts: [
          { name: "Fogão", emoji: "🔥" },
          { name: "Geladeira", emoji: "🧊" },
          { name: "Pia", emoji: "🚰" },
          { name: "Panela", emoji: "🥘" },
          { name: "Armário", emoji: "🗄️" },
          { name: "Mesa", emoji: "🪑" },
        ],
      },
      {
        name: "Quarto",
        emoji: "🛏️",
        parts: [
          { name: "Cama", emoji: "🛏️" },
          { name: "Travesseiro", emoji: "💤" },
          { name: "Cobertor", emoji: "🧣" },
          { name: "Guarda-roupa", emoji: "🚪" },
        ],
      },
      {
        name: "Banheiro",
        emoji: "🚿",
        parts: [
          { name: "Chuveiro", emoji: "🚿" },
          { name: "Vaso sanitário", emoji: "🚽" },
          { name: "Pia", emoji: "🚰" },
          { name: "Espelho", emoji: "🪞" },
          { name: "Toalha", emoji: "🧻" },
        ],
      },
      {
        name: "Sala",
        emoji: "🛋️",
        parts: [
          { name: "Sofá", emoji: "🛋️" },
          { name: "Televisão", emoji: "📺" },
          { name: "Tapete", emoji: "🟫" },
          { name: "Almofada", emoji: "🟪" },
        ],
      },
    ],
  },
  {
    id: "corpo",
    name: "Corpo Humano",
    emoji: "🧒",
    color: "oklch(0.78 0.13 350)",
    items: [
      {
        name: "Rosto",
        emoji: "😊",
        parts: [
          { name: "Olho", emoji: "👁️" },
          { name: "Boca", emoji: "👄" },
          { name: "Nariz", emoji: "👃" },
          { name: "Orelha", emoji: "👂" },
          { name: "Sobrancelha", emoji: "〰️" },
          { name: "Cabelo", emoji: "🦱" },
        ],
      },
      {
        name: "Mão",
        emoji: "✋",
        parts: [
          { name: "Palma", emoji: "🖐️" },
          { name: "Unha", emoji: "💅" },
          { name: "Dedo", emoji: "👆" },
        ],
      },
      {
        name: "Pé",
        emoji: "🦶",
        parts: [
          { name: "Dedo", emoji: "👆" },
          { name: "Unha", emoji: "💅" },
          { name: "Calcanhar", emoji: "🦶" },
          { name: "Sola", emoji: "👣" },
        ],
      },
      {
        name: "Braço",
        emoji: "💪",
        parts: [
          { name: "Ombro", emoji: "🫱" },
          { name: "Cotovelo", emoji: "💪" },
          { name: "Pulso", emoji: "⌚" },
          { name: "Mão", emoji: "✋" },
        ],
      },
      {
        name: "Perna",
        emoji: "🦵",
        parts: [
          { name: "Coxa", emoji: "🦵" },
          { name: "Joelho", emoji: "🦿" },
          { name: "Tornozelo", emoji: "🦶" },
          { name: "Pé", emoji: "🦶" },
        ],
      },
    ],
  },
  {
    id: "escola",
    name: "Escola e Material Escolar",
    emoji: "🎒",
    color: "oklch(0.78 0.13 265)",
    items: [
      {
        name: "Mochila",
        emoji: "🎒",
        parts: [
          { name: "Alça", emoji: "➰" },
          { name: "Zíper", emoji: "🤐" },
          { name: "Bolso", emoji: "👝" },
          { name: "Caderno", emoji: "📓" },
          { name: "Estojo", emoji: "✏️" },
        ],
      },
      {
        name: "Estojo",
        emoji: "✏️",
        parts: [
          { name: "Lápis de cor", emoji: "🖍️" },
          { name: "Borracha", emoji: "🧽" },
          { name: "Apontador", emoji: "🔺" },
          { name: "Régua", emoji: "📏" },
          { name: "Caneta", emoji: "🖊️" },
        ],
      },
      {
        name: "Sala de Aula",
        emoji: "🏫",
        parts: [
          { name: "Quadro negro", emoji: "📋" },
          { name: "Giz", emoji: "⚪" },
          { name: "Carteira", emoji: "🪑" },
          { name: "Cadeira", emoji: "💺" },
          { name: "Relógio", emoji: "🕐" },
        ],
      },
      {
        name: "Pátio",
        emoji: "🏀",
        parts: [
          { name: "Banco", emoji: "🪑" },
          { name: "Lixeira", emoji: "🗑️" },
          { name: "Cantina", emoji: "🍔" },
          { name: "Bebedouro", emoji: "🚰" },
        ],
      },
    ],
  },
  {
    id: "natureza",
    name: "Natureza e Clima",
    emoji: "🌳",
    color: "oklch(0.78 0.13 160)",
    items: [
      {
        name: "Árvore",
        emoji: "🌳",
        parts: [
          { name: "Tronco", emoji: "🪵" },
          { name: "Galho", emoji: "🌿" },
          { name: "Folha", emoji: "🍃" },
          { name: "Flor", emoji: "🌸" },
          { name: "Fruto", emoji: "🍎" },
          { name: "Raiz", emoji: "🌱" },
        ],
      },
      {
        name: "Praia",
        emoji: "🏖️",
        parts: [
          { name: "Areia", emoji: "🟨" },
          { name: "Mar", emoji: "🌊" },
          { name: "Onda", emoji: "🌊" },
          { name: "Conchinha", emoji: "🐚" },
          { name: "Guarda-sol", emoji: "⛱️" },
        ],
      },
      {
        name: "Céu",
        emoji: "🌤️",
        parts: [
          { name: "Nuvem", emoji: "☁️" },
          { name: "Sol", emoji: "☀️" },
          { name: "Lua", emoji: "🌙" },
          { name: "Estrela", emoji: "⭐" },
          { name: "Arco-íris", emoji: "🌈" },
        ],
      },
      {
        name: "Chuva",
        emoji: "🌧️",
        parts: [
          { name: "Gota de água", emoji: "💧" },
          { name: "Nuvem escura", emoji: "🌩️" },
          { name: "Guarda-chuva", emoji: "☂️" },
          { name: "Poça de lama", emoji: "🟤" },
        ],
      },
    ],
  },
  {
    id: "roupas",
    name: "Roupas e Vestuário",
    emoji: "👕",
    color: "oklch(0.78 0.13 315)",
    items: [
      {
        name: "Camiseta",
        emoji: "👕",
        parts: [
          { name: "Gola", emoji: "🔵" },
          { name: "Manga", emoji: "🧵" },
          { name: "Estampa", emoji: "🎨" },
          { name: "Costura", emoji: "🪡" },
        ],
      },
      {
        name: "Calça",
        emoji: "👖",
        parts: [
          { name: "Cós", emoji: "➖" },
          { name: "Bolso", emoji: "👝" },
          { name: "Zíper", emoji: "🤐" },
          { name: "Botão", emoji: "🔘" },
          { name: "Barra", emoji: "📏" },
        ],
      },
      {
        name: "Tênis",
        emoji: "👟",
        parts: [
          { name: "Cadarço", emoji: "🪢" },
          { name: "Língua", emoji: "👅" },
          { name: "Sola", emoji: "👣" },
          { name: "Palmilha", emoji: "🦶" },
        ],
      },
      {
        name: "Casaco",
        emoji: "🧥",
        parts: [
          { name: "Capuz", emoji: "🎭" },
          { name: "Zíper", emoji: "🤐" },
          { name: "Bolso", emoji: "👝" },
          { name: "Manga longa", emoji: "🧵" },
        ],
      },
    ],
  },
];
