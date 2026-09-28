export const attributes = [
  {
    id: "AUT",
    name: "Autonomia",
    pillar: "Intrapessoal",
    description: "Tomar iniciativa e trabalhar de forma independente.",
  },
  {
    id: "RES",
    name: "Resiliência",
    pillar: "Intrapessoal",
    description:
      "Lidar com mudanças e pressão de prazo. Participa do cálculo de Estresse.",
  },
  {
    id: "CRI",
    name: "Pensamento Crítico",
    pillar: "Intrapessoal",
    description: "Questionar premissas e identificar inconsistências.",
  },
  {
    id: "ETI",
    name: "Ética Profissional",
    pillar: "Intrapessoal",
    description: "Agir com transparência, imparcialidade e confidencialidade.",
  },
  {
    id: "COM",
    name: "Comunicação",
    pillar: "Interpessoal",
    description: "Transmitir e compreender informações com clareza.",
  },
  {
    id: "NEG",
    name: "Negociação",
    pillar: "Interpessoal",
    description: "Mediar conflitos e alinhar expectativas dos stakeholders.",
  },
  {
    id: "EMP",
    name: "Empatia",
    pillar: "Interpessoal",
    description: "Compreender perspectivas e necessidades não declaradas.",
  },
  {
    id: "LID",
    name: "Liderança",
    pillar: "Interpessoal",
    description: "Orientar pessoas e coordenar o trabalho em equipe.",
  },
  {
    id: "MOD",
    name: "Modelagem",
    pillar: "Técnico",
    description: "Representar requisitos em diagramas, histórias e protótipos.",
  },
  {
    id: "ANA",
    name: "Análise de Sistemas",
    pillar: "Técnico",
    description: "Decompor problemas e compreender dependências do sistema.",
  },
  {
    id: "VAL",
    name: "Validação e Verificação",
    pillar: "Técnico",
    description:
      "Encontrar defeitos e verificar se a solução atende às necessidades.",
  },
  {
    id: "GER",
    name: "Gerenciamento",
    pillar: "Técnico",
    description: "Organizar mudanças, versões e rastreabilidade.",
  },
] as const;
export type AttributeId = (typeof attributes)[number]["id"];
export type ClassId =
  "requirements" | "developer" | "business" | "designer" | "quality";
export type CharacterClass = {
  id: ClassId;
  name: string;
  role: string;
  description: string;
  primary: AttributeId;
  secondary: AttributeId;
  base: Record<AttributeId, number>;
  stressBase: number;
  skills: { name: string; description: string }[];
  proficiencies: string[];
  equipment: string[];
};
// Cada modelo: 7 + 5 + (6 × 4) = 36 pontos. Adaptações descritas no README.
export const classes: CharacterClass[] = [
  {
    id: "requirements",
    name: "Analista de Requisitos",
    role: "Levantamento, análise e especificação",
    description:
      "Transforma necessidades em requisitos claros. Produz diagramas e documentação para alinhar stakeholders e equipe.",
    primary: "COM",
    secondary: "MOD",
    stressBase: 8,
    base: {
      AUT: 12,
      RES: 12,
      CRI: 12,
      ETI: 12,
      COM: 14,
      NEG: 8,
      EMP: 12,
      LID: 8,
      MOD: 13,
      ANA: 12,
      VAL: 8,
      GER: 8,
    },
    skills: [
      {
        name: "Entrevista profunda",
        description:
          "Formula perguntas precisas para descobrir as necessidades dos stakeholders.",
      },
      {
        name: "Taxonomia dos requisitos",
        description:
          "Distingue requisitos funcionais, não funcionais e de domínio.",
      },
      {
        name: "Rastreabilidade",
        description:
          "Relaciona necessidades, requisitos e artefatos de documentação.",
      },
      {
        name: "Escuta ativa",
        description:
          "Identifica necessidades implícitas ao ouvir sem interromper.",
      },
    ],
    proficiencies: [
      "Entrevistas",
      "Casos de uso",
      "Histórias de usuário",
      "Especificação de requisitos",
    ],
    equipment: [
      "Kit de entrevista",
      "Modelo de especificação",
      "Mapa de stakeholders",
    ],
  },
  {
    id: "developer",
    name: "Desenvolvedor de Software",
    role: "Programação e implementação",
    description:
      "Implementa o sistema a partir dos requisitos. Analisa soluções, corrige falhas e colabora com a equipe para entregar software funcional.",
    primary: "ANA",
    secondary: "AUT",
    stressBase: 8,
    base: {
      AUT: 13,
      RES: 12,
      CRI: 12,
      ETI: 12,
      COM: 12,
      NEG: 8,
      EMP: 8,
      LID: 8,
      MOD: 12,
      ANA: 14,
      VAL: 12,
      GER: 8,
    },
    skills: [
      {
        name: "Implementação",
        description:
          "Converte requisitos definidos em funcionalidades do sistema.",
      },
      {
        name: "Correção de falhas",
        description: "Investiga problemas no código e aplica correções.",
      },
      {
        name: "Otimização de soluções",
        description:
          "Melhora a solução técnica preservando o comportamento esperado.",
      },
    ],
    proficiencies: [
      "Programação",
      "Depuração",
      "Leitura de requisitos",
      "Controle de versão",
    ],
    equipment: [
      "Editor de código",
      "Repositório de exemplo",
      "Lista de tarefas",
    ],
  },
  {
    id: "business",
    name: "Analista de Negócios",
    role: "Negócio e necessidades dos stakeholders",
    description:
      "Conecta negócio e tecnologia. Compreende processos, identifica oportunidades e negocia necessidades para resolver o problema certo.",
    primary: "NEG",
    secondary: "ANA",
    stressBase: 8,
    base: {
      AUT: 12,
      RES: 12,
      CRI: 12,
      ETI: 12,
      COM: 12,
      NEG: 14,
      EMP: 12,
      LID: 8,
      MOD: 8,
      ANA: 13,
      VAL: 8,
      GER: 8,
    },
    skills: [
      {
        name: "Análise de lacunas",
        description:
          "Compara a situação atual com a desejada e identifica mudanças necessárias.",
      },
      {
        name: "Modelagem de processos",
        description:
          "Representa fluxos de negócio e identifica oportunidades de melhoria.",
      },
      {
        name: "Linguagem bidirecional",
        description:
          "Traduz necessidades de negócio para a equipe técnica e explica soluções aos stakeholders.",
      },
      {
        name: "Mapa de stakeholders",
        description: "Identifica envolvidos e seus interesses no projeto.",
      },
    ],
    proficiencies: [
      "BPMN",
      "Análise de lacunas",
      "Matriz RACI",
      "Análise de causa-raiz",
    ],
    equipment: [
      "Diagrama de processos",
      "Matriz de impacto",
      "Canvas de valor",
    ],
  },
  {
    id: "designer",
    name: "UX/UI Designer",
    role: "Experiência, interfaces e protótipos",
    description:
      "Investiga necessidades dos usuários e transforma descobertas em interfaces e protótipos que podem ser avaliados antes da implementação.",
    primary: "EMP",
    secondary: "MOD",
    stressBase: 8,
    base: {
      AUT: 12,
      RES: 12,
      CRI: 12,
      ETI: 12,
      COM: 12,
      NEG: 8,
      EMP: 14,
      LID: 8,
      MOD: 13,
      ANA: 8,
      VAL: 12,
      GER: 8,
    },
    skills: [
      {
        name: "Observação de usuários",
        description:
          "Descobre necessidades a partir do comportamento e do contexto de uso.",
      },
      {
        name: "Persona e jornada",
        description:
          "Representa objetivos, dificuldades e caminhos percorridos pelos usuários.",
      },
      {
        name: "Prototipagem de interfaces",
        description:
          "Cria telas e fluxos para tornar uma solução visível e discutível.",
      },
      {
        name: "Avaliação de usabilidade",
        description:
          "Observa o uso de protótipos para encontrar dificuldades de interação.",
      },
    ],
    proficiencies: [
      "Pesquisa com usuários",
      "Personas",
      "Prototipagem",
      "Teste de usabilidade",
    ],
    equipment: ["Guia de pesquisa", "Canvas de persona", "Kit de prototipagem"],
  },
  {
    id: "quality",
    name: "Analista de Qualidade",
    role: "Verificação, validação e testes",
    description:
      "Verifica requisitos e soluções, encontra ambiguidades e planeja testes para reduzir defeitos e retrabalho.",
    primary: "VAL",
    secondary: "CRI",
    stressBase: 8,
    base: {
      AUT: 12,
      RES: 12,
      CRI: 13,
      ETI: 12,
      COM: 12,
      NEG: 8,
      EMP: 8,
      LID: 8,
      MOD: 8,
      ANA: 12,
      VAL: 14,
      GER: 12,
    },
    skills: [
      {
        name: "Inspeção de requisitos",
        description:
          "Revisa documentos para identificar defeitos e informações incompletas.",
      },
      {
        name: "Critérios de aceitação",
        description:
          "Define condições verificáveis para aceitar uma funcionalidade.",
      },
      {
        name: "Detector de ambiguidade",
        description:
          "Reconhece descrições que permitem interpretações diferentes.",
      },
      {
        name: "Regressão preventiva",
        description:
          "Identifica o que precisa ser testado novamente após uma mudança.",
      },
    ],
    proficiencies: [
      "Casos de teste",
      "Critérios de aceitação",
      "Revisão por pares",
      "Rastreabilidade de defeitos",
    ],
    equipment: [
      "Checklist de revisão",
      "Planilha de testes",
      "Registro de defeitos",
    ],
  },
];
export const pointCosts: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};
export const signed = (value: number) =>
  value >= 0 ? `+${value}` : String(value);
export function getClass(id: ClassId) {
  return classes.find((item) => item.id === id)!;
}
export function getModel(characterClass: CharacterClass) {
  return attributes.map((attribute) => {
    const base = characterClass.base[attribute.id];
    const bonus =
      attribute.id === characterClass.primary
        ? 2
        : attribute.id === characterClass.secondary
          ? 1
          : 0;
    const total = base + bonus;
    return {
      ...attribute,
      base,
      bonus,
      total,
      cost: pointCosts[base],
      modifier: Math.floor((total - 10) / 2),
    };
  });
}
export function getStats(characterClass: CharacterClass) {
  const model = getModel(characterClass);
  const mod = (id: AttributeId) =>
    model.find((item) => item.id === id)!.modifier;
  return {
    stress: characterClass.stressBase + mod("RES"),
    initiative: mod("COM") + mod("LID"),
    confidence: mod("EMP") + mod("ETI"),
    quality: mod("MOD") + mod("ANA"),
    proficiency: 2,
  };
}
export type Character = {
  id: string;
  name: string;
  classId: ClassId;
  xp: number;
  note: string;
  example?: boolean;
};
export const initialCharacters: Character[] = [
  {
    id: "example",
    name: "Ari — ficha de exemplo",
    classId: "requirements",
    xp: 0,
    note: "Confirmar com a bibliotecária como funciona a renovação dos empréstimos.",
    example: true,
  },
];
