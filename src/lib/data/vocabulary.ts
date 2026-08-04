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
        ],
      },
      {
        name: "Banana",
        emoji: "🍌",
        parts: [
          { name: "Casca", emoji: "🟡" },
          { name: "Polpa", emoji: "⚪" },
          { name: "Cacho", emoji: "🍌" },
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
          { name: "Rabo", emoji: "〰️" },
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
        ],
      },
      {
        name: "Pássaro",
        emoji: "🐦",
        parts: [
          { name: "Asa", emoji: "🪽" },
          { name: "Bico", emoji: "🔻" },
          { name: "Pena", emoji: "🪶" },
          { name: "Pé", emoji: "🦶" },
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
          { name: "Chaminé", emoji: "🏭" },
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
        ],
      },
      {
        name: "Mão",
        emoji: "✋",
        parts: [
          { name: "Dedo", emoji: "👆" },
          { name: "Palma", emoji: "🖐️" },
          { name: "Unha", emoji: "💅" },
          { name: "Punho", emoji: "✊" },
        ],
      },
    ],
  },
];
