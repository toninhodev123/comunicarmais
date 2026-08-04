export interface SocialPhrase {
  id: string;
  text: string;
  emoji: string;
  hint: string;
}

export const socialPhrases: SocialPhrase[] = [
  {
    id: "f1",
    text: "Bom dia! Como você está hoje?",
    emoji: "👋",
    hint: "Cumprimento social do dia a dia.",
  },
  {
    id: "f2",
    text: "Por favor, eu quero um copo de água.",
    emoji: "💧",
    hint: "Pedido educado.",
  },
  {
    id: "f3",
    text: "Obrigado pela ajuda, foi muito legal.",
    emoji: "🙏",
    hint: "Agradecimento sincero.",
  },
  {
    id: "f4",
    text: "Eu gosto muito de brincar com você.",
    emoji: "🎈",
    hint: "Expressar sentimento.",
  },
  {
    id: "f5",
    text: "Vamos comer uma pizza no sábado?",
    emoji: "🍕",
    hint: "Fazer um convite.",
  },
];
