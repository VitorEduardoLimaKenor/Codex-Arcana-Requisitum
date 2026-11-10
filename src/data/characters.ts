import {
  attributes,
  classes,
  getClass,
  type Character,
  type AttributeId,
} from "./codex";
const stories = [
  [
    "Lia, a Investigadora",
    "Escuta relatos contraditórios e encontra a pergunta que ninguém fez.",
    "EMP",
  ],
  [
    "Caio, o Cartógrafo",
    "Transforma demandas confusas em mapas de requisitos que guiam a equipe.",
    "MOD",
  ],
  [
    "Íris, a Inventora",
    "Cria protótipos para descobrir soluções e enfrenta desafios com autonomia.",
    "AUT",
  ],
  [
    "Ravi, o Guardião do Código",
    "Reconstrói sistemas antigos com paciência e atenção às dependências.",
    "RES",
  ],
  [
    "Nara, a Diplomata",
    "Une aliados com interesses opostos e negocia acordos transparentes.",
    "NEG",
  ],
  [
    "Theo, o Estrategista",
    "Organiza recursos e conduz a equipe quando os planos mudam.",
    "LID",
  ],
  [
    "Maya, a Tecelã",
    "Observa as pessoas para desenhar experiências acolhedoras e acessíveis.",
    "EMP",
  ],
  [
    "Otto, o Visionário",
    "Questiona convenções e materializa ideias em modelos visuais.",
    "CRI",
  ],
  [
    "Helena, a Sentinela",
    "Defende a qualidade e não deixa que a pressa esconda problemas.",
    "ETI",
  ],
  [
    "Bento, o Rastreador",
    "Investiga falhas e documenta cada pista até encontrar sua origem.",
    "GER",
  ],
] as const;
export const templates = stories.map(([name, description, focus], index) => {
  const cls = classes[Math.floor(index / 2)];
  // Permutar valores preserva o orçamento de 36 pontos de cada classe.
  const base = { ...cls.base };
  const highest = attributes.reduce((a, b) =>
    base[a.id] >= base[b.id] ? a : b,
  ).id;
  [base[focus], base[highest]] = [base[highest], base[focus]];
  const secondary: AttributeId = attributes
    .filter((a) => a.id !== focus)
    .sort((a, b) => base[b.id] - base[a.id])[index % 2].id;
  [base[secondary], base[cls.secondary]] = [
    base[cls.secondary],
    base[secondary],
  ];
  return { id: `hero-${index}`, name, description, classId: cls.id, base };
});
export function characterClass(character: Character) {
  const template = templates.find((t) => t.id === character.templateId);
  return {
    ...getClass(character.classId),
    ...(template ? { base: template.base } : {}),
  };
}
