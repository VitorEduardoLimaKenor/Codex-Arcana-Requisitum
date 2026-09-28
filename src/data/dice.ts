export const diceSides = [20, 8, 10] as const;
export type DieSides = (typeof diceSides)[number];

export function rollDie(sides: DieSides, modifier = 0, proficiency = 0, random = Math.random) {
  const face = Math.floor(random() * sides) + 1;
  return { face, modifier, proficiency, total: face + modifier + proficiency };
}
