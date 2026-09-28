import { SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { attributes } from "../data/codex";
import { styles } from "../styles";
const sections = [
  {
    title: "Primeiros passos",
    data: [
      {
        name: "O que é o Codex Arcana?",
        description:
          "Um RPG de mesa para aprender Engenharia de Requisitos. Você interpreta um profissional; o professor conduz situações de projeto. Decisões e colaboração ajudam a explorar os conceitos da disciplina.",
      },
      {
        name: "Classe é seu papel na equipe",
        description:
          "Escolha entre Requisitos, Desenvolvimento, Negócios, UX/UI e Qualidade. Consulte a descrição da classe antes de criar sua ficha.",
      },
      {
        name: "Como criar no aplicativo",
        description:
          "Informe um nome, escolha uma classe e, se quiser, um projeto. Você recebe um modelo de nível 1 com os 36 pontos já distribuídos. Revise a prévia e toque em Salvar ficha.",
      },
    ],
  },
  ...["Intrapessoal", "Interpessoal", "Técnico"].map((title) => ({
    title: `Pilar ${title}`,
    data: attributes
      .filter((item) => item.pillar === title)
      .map((item) => ({
        name: `${item.id} · ${item.name}`,
        description: item.description,
      })),
  })),
  {
    title: "Lendo sua ficha",
    data: [
      {
        name: "Base, bônus e total",
        description:
          "Os atributos começam em 8. O modelo usa 36 pontos para aumentar valores até 15. Sua classe acrescenta +2 em um atributo e +1 em outro, sem custo extra. Os máximos desses atributos passam a 17 e 16.",
      },
      {
        name: "Custo dos atributos",
        description:
          "Valores 8, 9, 10, 11, 12, 13, 14 e 15 custam, respectivamente, 0, 1, 2, 3, 4, 5, 7 e 9 pontos. O custo considera o valor base, antes do bônus. Aqui a distribuição é pronta.",
      },
      {
        name: "O modificador",
        description:
          "É o valor usado nos testes: 8–9 = −1; 10–11 = 0; 12–13 = +1; 14–15 = +2; 16–17 = +3. Exemplo: COM 14 + bônus 2 = 16, com modificador +3.",
      },
      {
        name: "Estatísticas derivadas",
        description:
          "No nível 1: Estresse = base da classe + mod. RES; Iniciativa = mod. COM + mod. LID; Confiança = mod. EMP + mod. ETI; Qualidade = mod. MOD + mod. ANA. O app exibe esses valores para consulta.",
      },
      {
        name: "Proficiência e habilidades",
        description:
          "Proficiência representa treinamento: neste nível o bônus é +2 nos testes em que você é proficiente. Habilidades descrevem recursos da classe; sua aplicação na mesa é orientada pelo professor.",
      },
      {
        name: "Onde ficam minhas fichas?",
        description:
          "Nesta versão acadêmica, todas as fichas e anotações ficam em memória. Ao recarregar ou reiniciar o aplicativo, resta apenas a ficha demonstrativa. Nenhum dado é enviado a serviços externos.",
      },
    ],
  },
];
export function GuideScreen() {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.page}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.name}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={{ gap: 10 }}>
            <Text style={styles.eyebrow}>
              UM GUIA PARA SUA PRIMEIRA JORNADA
            </Text>
            <Text style={styles.title}>Entenda sua ficha</Text>
            <Text style={styles.subtitle}>
              Não precisa ter jogado RPG antes. Comece pelo seu papel e conheça
              as competências da equipe.
            </Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.section}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.section}>{item.name}</Text>
            <Text style={styles.body}>{item.description}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
