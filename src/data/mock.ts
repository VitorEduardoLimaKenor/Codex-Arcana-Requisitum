export const character = {
  name: "Lyra Ventobravo",
  race: "Meio-elfa",
  role: "Patrulheira",
  level: 3,
  maxHealth: 28,
  armor: 14,
  speed: "9 m",
  story:
    "Criada nas fronteiras da Floresta Cinzenta, Lyra procura seu irmão desaparecido. Uma bússola antiga é sua única pista.",
  equipment:
    "Arco longo, duas adagas, armadura de couro, mochila de exploradora e uma bússola antiga.",
  attributes: [
    { name: "FOR", value: 12, modifier: "+1" },
    { name: "DES", value: 16, modifier: "+3" },
    { name: "CON", value: 14, modifier: "+2" },
    { name: "INT", value: 10, modifier: "+0" },
    { name: "SAB", value: 15, modifier: "+2" },
    { name: "CAR", value: 11, modifier: "+0" },
  ],
};

export type Note = {
  id: string;
  title: string;
  text: string;
  session: string;
  favorite: boolean;
};
export const initialNotes: Note[] = [
  {
    id: "1",
    title: "O segredo da taverna",
    session: "Sessão 03",
    favorite: true,
    text: "O taverneiro de Valeverde reconheceu o símbolo da bússola. Precisamos procurar uma cartógrafa chamada Mira antes de partir.",
  },
  {
    id: "2",
    title: "Uma aliança improvável",
    session: "Sessão 02",
    favorite: false,
    text: "Ajudamos um goblin chamado Nix na estrada. Em troca, ele prometeu nos guiar até a entrada das ruínas ao norte.",
  },
  {
    id: "3",
    title: "O começo da jornada",
    session: "Sessão 01",
    favorite: false,
    text: "Nosso grupo se encontrou em Valeverde. Aceitamos investigar as luzes misteriosas que aparecem na Floresta Cinzenta.",
  },
];
