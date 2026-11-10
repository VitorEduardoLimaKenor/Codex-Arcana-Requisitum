import type { AttributeId } from "./codex";

export const adventureLevels = ["Iniciante", "Intermediário", "Avançado"] as const;
export type AdventureLevel = (typeof adventureLevels)[number];
/** Símbolos disponíveis para o ícone (texto, sem emoji, para aceitar cor). */
export const adventureIcons = [
  "✎", "▤", "✚", "◉", "⇄", "✦", "◆", "◎",
  "⚑", "☰", "⌂", "♜", "⌘", "✉", "★", "▲",
] as const;
export const adventureColors = [
  "#10D9EF", "#43F2B3", "#74E6BA", "#7EE5FC",
  "#BCA5FF", "#FFABD4", "#FFD387", "#FF8597",
] as const;

/** Toda aventura foi pensada para caber em uma aula. */
export const SESSION_LENGTH = "1 sessão · 50 min";

export type Npc = {
  name: string;
  role: string;
  /** O que o personagem precisa ou esconde; o mestre interpreta. */
  secret: string;
  /** Foto em data URI (reduzida), cadastrada pelo mestre. */
  image?: string;
};

export type Adventure = {
  id: string;
  title: string;
  /** Frase curta exibida nos cards. */
  tagline: string;
  /** Texto que a turma vê na sala. */
  summary: string;
  level: AdventureLevel;
  icon: string;
  color: string;
  /** Imagem própria do mestre (data URI); substitui o símbolo. */
  iconImage?: string;
  objectives: string[];
  scenes: { title: string; text: string }[];
  /** Personagens do mestre, cada um com uma necessidade não declarada. */
  npcs: Npc[];
  tests: { attribute: AttributeId; dc: number; when: string }[];
  masterNotes?: string;
  /** Cadastrada pelo mestre (as do sistema não podem ser apagadas). */
  custom?: boolean;
};

export const levelColors: Record<AdventureLevel, string> = {
  Iniciante: "#43F2B3",
  Intermediário: "#FFC970",
  Avançado: "#FF8597",
};

export const builtInAdventures: Adventure[] = [
  {
    id: "biblioteca",
    title: "O Sistema da Biblioteca",
    tagline: "Descubra por que ninguém consegue renovar um livro.",
    summary:
      "A biblioteca da universidade vai trocar o sistema de empréstimos. Alunos reclamam das renovações, a bibliotecária tem pressa e a direção quer relatórios. Sua equipe precisa entender o que cada um realmente precisa antes que alguém comece a programar.",
    level: "Iniciante",
    icon: "▤",
    color: "#7EE5FC",
    objectives: [
      "Conduzir entrevistas de elicitação com stakeholders diferentes.",
      "Distinguir requisitos funcionais de não funcionais.",
      "Registrar requisitos claros e verificáveis.",
    ],
    scenes: [
      {
        title: "O balcão lotado",
        text: "A equipe chega em horário de pico. A bibliotecária só tem cinco minutos. Quem conseguir as informações certas ganha tempo para a próxima cena.",
      },
      {
        title: "A fila de reclamações",
        text: "Três alunos relatam problemas diferentes com renovações. Um deles fala de algo que ninguém mais percebeu: o sistema cai em época de provas.",
      },
      {
        title: "A reunião com a direção",
        text: "A diretora quer relatórios mensais e acha que o resto é detalhe. A equipe precisa apresentar os requisitos e defender o que é prioridade.",
      },
    ],
    npcs: [
      {
        name: "Dona Célia",
        role: "Bibliotecária há 20 anos",
        secret: "Teme que o novo sistema torne seu trabalho dispensável.",
      },
      {
        name: "Rafael",
        role: "Aluno de Engenharia",
        secret: "Usa leitor de tela; o sistema atual é inacessível para ele.",
      },
      {
        name: "Dra. Marta",
        role: "Diretora da biblioteca",
        secret: "Precisa dos relatórios para justificar o orçamento do ano que vem.",
      },
    ],
    tests: [
      { attribute: "COM", dc: 12, when: "Fazer a bibliotecária explicar o processo atual." },
      { attribute: "EMP", dc: 14, when: "Perceber a necessidade de acessibilidade do Rafael." },
      { attribute: "NEG", dc: 13, when: "Convencer a direção a priorizar as renovações." },
    ],
  },
  {
    id: "clinica",
    title: "Clínica sem Fila",
    tagline: "Agendamento online para quem nunca usou um app.",
    summary:
      "Uma clínica de bairro quer acabar com as filas de madrugada para marcar consultas. A recepção, os médicos e os pacientes idosos têm visões bem diferentes do que seria um bom sistema. Priorize o que entra na primeira versão.",
    level: "Intermediário",
    icon: "✚",
    color: "#74E6BA",
    objectives: [
      "Lidar com requisitos conflitantes entre stakeholders.",
      "Priorizar requisitos com a técnica MoSCoW.",
      "Considerar acessibilidade e usabilidade como requisitos.",
    ],
    scenes: [
      {
        title: "A fila das 5h",
        text: "A equipe observa a fila real de pacientes. Quem observa com atenção descobre que muitos não têm celular próprio.",
      },
      {
        title: "Recepção contra médicos",
        text: "A recepção quer encaixes livres; os médicos querem agenda fechada. A equipe precisa mediar sem perder nenhum dos dois.",
      },
      {
        title: "O protótipo de papel",
        text: "Dona Lourdes testa o protótipo. Cada dificuldade dela vira um requisito — ou um problema na entrega.",
      },
    ],
    npcs: [
      {
        name: "Jéssica",
        role: "Recepcionista",
        secret: "Já resolve encaixes por WhatsApp e não quer perder esse controle.",
      },
      {
        name: "Dr. Paulo",
        role: "Clínico geral",
        secret: "Atrasa porque as consultas de retorno são marcadas com tempo curto demais.",
      },
      {
        name: "Dona Lourdes",
        role: "Paciente, 74 anos",
        secret: "Marca as consultas pelo neto, que nem sempre está por perto.",
      },
    ],
    tests: [
      { attribute: "EMP", dc: 13, when: "Notar que muitos pacientes dependem de outra pessoa." },
      { attribute: "NEG", dc: 15, when: "Fechar um acordo entre recepção e médicos." },
      { attribute: "MOD", dc: 12, when: "Montar um protótipo que Dona Lourdes consiga usar." },
    ],
  },
  {
    id: "restaurante",
    title: "Bandejão Digital",
    tagline: "Um pedido simples, cheio de ambiguidades.",
    summary:
      "O restaurante universitário quer um app para cardápio e pagamento. O pedido chegou em uma única frase: “quero algo rápido e fácil”. Cabe à equipe transformar isso em requisitos que possam ser testados.",
    level: "Iniciante",
    icon: "◉",
    color: "#FFD387",
    objectives: [
      "Identificar e eliminar ambiguidades em requisitos.",
      "Escrever critérios de aceitação verificáveis.",
      "Usar histórias de usuário para organizar as necessidades.",
    ],
    scenes: [
      {
        title: "“Rápido e fácil”",
        text: "O gerente repete que quer algo rápido e fácil. Rápido quanto? Fácil para quem? A equipe precisa transformar adjetivos em números.",
      },
      {
        title: "O horário de pico",
        text: "Ao meio-dia, 800 alunos chegam em 30 minutos. A equipe observa onde a fila trava de verdade.",
      },
      {
        title: "Critérios de aceitação",
        text: "Cada história de usuário precisa de um critério que o time de qualidade consiga testar. Requisitos vagos serão devolvidos.",
      },
    ],
    npcs: [
      {
        name: "Seu Antônio",
        role: "Gerente do restaurante",
        secret: "O que ele chama de “rápido” é a fila do caixa, não o app.",
      },
      {
        name: "Bia",
        role: "Aluna vegetariana",
        secret: "Quer saber o cardápio antes de sair de casa, não na fila.",
      },
    ],
    tests: [
      { attribute: "CRI", dc: 12, when: "Apontar a ambiguidade em “rápido e fácil”." },
      { attribute: "VAL", dc: 13, when: "Escrever critérios de aceitação mensuráveis." },
      { attribute: "ANA", dc: 14, when: "Descobrir que o gargalo é o pagamento." },
    ],
  },
  {
    id: "startup",
    title: "O Escopo que Não Para",
    tagline: "A startup muda de ideia toda segunda-feira.",
    summary:
      "Uma startup contratou a equipe para entregar um MVP em seis semanas. Toda reunião o fundador traz uma ideia nova. Controle as mudanças, mantenha a rastreabilidade e entregue algo que funcione.",
    level: "Avançado",
    icon: "⇄",
    color: "#BCA5FF",
    objectives: [
      "Aplicar gerência de mudanças de requisitos.",
      "Manter rastreabilidade entre requisitos e entregas.",
      "Negociar escopo sem perder a confiança do cliente.",
    ],
    scenes: [
      {
        title: "A ideia da segunda-feira",
        text: "O fundador quer uma rede social dentro do app. O prazo continua o mesmo. A equipe avalia o impacto antes de responder.",
      },
      {
        title: "O investidor",
        text: "Um investidor visita o projeto e pede uma demo. O que já foi construído atende ao que foi combinado?",
      },
      {
        title: "A matriz de rastreabilidade",
        text: "Um requisito antigo foi removido sem registro. A equipe precisa encontrar o que mais foi afetado antes da entrega.",
      },
    ],
    npcs: [
      {
        name: "Léo",
        role: "Fundador da startup",
        secret: "Muda o escopo porque tem medo de lançar algo que ninguém use.",
      },
      {
        name: "Carla",
        role: "Investidora",
        secret: "Só precisa ver uma métrica de uso real, não muitas funções.",
      },
    ],
    tests: [
      { attribute: "GER", dc: 14, when: "Registrar e avaliar o impacto de uma mudança." },
      { attribute: "NEG", dc: 16, when: "Convencer o fundador a adiar a nova ideia." },
      { attribute: "ANA", dc: 15, when: "Rastrear as dependências do requisito removido." },
    ],
  },
];

/** Monta uma aventura cadastrada pelo mestre a partir do formulário. */
export function createAdventure(input: {
  /** Ao editar, mantém o id da aventura. */
  id?: string;
  title: string;
  summary: string;
  level: AdventureLevel;
  objectives: string;
  scenes: string;
  masterNotes: string;
  npcs?: Npc[];
  icon?: string;
  color?: string;
  iconImage?: string;
  now?: number;
}): Adventure {
  const lines = (text: string) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  return {
    id: input.id ?? `custom-${input.now ?? Date.now()}`,
    title: input.title.trim(),
    tagline: input.summary.trim().split(/(?<=[.!?])\s/)[0].slice(0, 90),
    summary: input.summary.trim(),
    level: input.level,
    icon: input.icon ?? adventureIcons[0],
    color: input.color ?? adventureColors[0],
    ...(input.iconImage ? { iconImage: input.iconImage } : {}),
    objectives: lines(input.objectives),
    scenes: lines(input.scenes).map((line) => {
      const [title, ...rest] = line.split(":");
      return rest.length
        ? { title: title.trim(), text: rest.join(":").trim() }
        : { title: line, text: "" };
    }),
    npcs: (input.npcs ?? [])
      .map((npc) => ({
        name: npc.name.trim(),
        role: npc.role.trim(),
        secret: npc.secret.trim(),
        ...(npc.image ? { image: npc.image } : {}),
      }))
      .filter((npc) => npc.name),
    tests: [],
    masterNotes: input.masterNotes.trim() || undefined,
    custom: true,
  };
}

/** Nome da sala no servidor: título da aventura e, se houver, a turma. */
export function roomNameFor(adventure: Adventure, group: string) {
  const suffix = group.trim() ? ` · ${group.trim()}` : "";
  return (adventure.title + suffix).slice(0, 100);
}
