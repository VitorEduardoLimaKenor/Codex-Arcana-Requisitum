import type { ImageSourcePropType } from "react-native";
export const characterImages: Record<string, ImageSourcePropType> = {
  "hero-0": require("../../assets/images/characters/lia-modern.png"),
  "hero-1": require("../../assets/images/characters/caio-modern.png"),
  "hero-2": require("../../assets/images/characters/iris-modern.png"),
  "hero-3": require("../../assets/images/characters/ravi-modern.png"),
  "hero-4": require("../../assets/images/characters/nara-modern.png"),
  "hero-5": require("../../assets/images/characters/theo-modern.png"),
  "hero-6": require("../../assets/images/characters/maya-modern.png"),
  "hero-7": require("../../assets/images/characters/otto-modern.png"),
  "hero-8": require("../../assets/images/characters/helena-modern.png"),
  "hero-9": require("../../assets/images/characters/bento-modern.png"),
};

/** Retrato do personagem: foto tirada pelo jogador ou ilustração original. */
export function portraitOf(character: {
  portrait?: string;
  templateId?: string;
}): ImageSourcePropType | undefined {
  if (character.portrait) return { uri: character.portrait };
  return characterImages[character.templateId ?? ""];
}

// Os modelos são criados em pares por classe (hero-0/1, hero-2/3, …).
const classOrder = [
  "requirements",
  "developer",
  "business",
  "designer",
  "quality",
] as const;
export const classPortraits = Object.fromEntries(
  classOrder.map((id, index) => [
    id,
    [characterImages[`hero-${index * 2}`], characterImages[`hero-${index * 2 + 1}`]],
  ]),
) as Record<(typeof classOrder)[number], ImageSourcePropType[]>;
