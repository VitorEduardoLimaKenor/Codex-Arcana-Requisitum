import { SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Disclosure } from "../components/Disclosure";
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
          "Escolha sua classe, dê um nome ao personagem e confira o resumo. Os 36 pontos já estão distribuídos. Toque em Salvar ficha para começar.",
      },
      {
        name: "O que esta versão simplifica?",
        description:
          "Aqui você escolhe entre cinco classes e recebe um modelo pronto de nível 1, com bônus +2 e +1. Você pode avançar até o nível 2 por um marco autorizado pelo Mestre. Distribuição livre, arquétipos e melhorias ficam para outra versão. Habilidades e equipamentos são resumos adaptados; confirme seus efeitos com o Mestre.",
      },
    ],
  },
  {
    title: "Sua primeira sessão",
    data: [
      {
        name: "O que eu faço na mesa?",
        description:
          "O Mestre descreve um problema de projeto. Você diz o que seu personagem tenta fazer: entrevistar, negociar, desenhar um diagrama ou revisar um requisito. A equipe coopera e registra as descobertas. O Mestre pede um teste quando há risco e incerteza.",
      },
      {
        name: "Como rolar um teste?",
        description:
          "O Mestre indica o atributo e a Classe de Dificuldade (CD). Na ficha, toque no atributo: o app rola d20 e soma o modificador, não o valor total do atributo. Se a técnica estiver nas suas proficiências, marque o bônus +2. Exemplo: dado 11 + COM 3 + proficiência 2 = 16; contra CD 15, sucesso.",
      },
      {
        name: "Como ler o resultado?",
        description:
          "Total igual ou maior que a CD é sucesso. Até 4 abaixo pode ser sucesso parcial com custo; de 5 a 9 abaixo, falha. Dez ou mais acima é triunfo; dez ou mais abaixo, revés. Um 20 natural é triunfo e um 1 natural é revés. Natural significa o valor do dado, antes dos bônus. O Mestre interpreta a consequência; o app mostra apenas a conta.",
      },
      {
        name: "Vantagem e desvantagem",
        description:
          "Quando o Mestre indicar, role dois d20 avulsos e anote os resultados. Com vantagem, use o maior; com desvantagem, o menor. Depois some o modificador e a proficiência aplicável uma única vez. Se houver ambas, elas se cancelam: role apenas um d20. O app não escolhe entre os dois automaticamente.",
      },
      {
        name: "Estresse é resistência à pressão",
        description:
          "Os PE são uma reserva do personagem: ele perde pontos quando o projeto o desgasta e pode recuperá-los conforme o Mestre orientar. A zero, entra em colapso. A ficha mostra o máximo para seu nível, não um contador atual; registre perdas e recuperação no caderno. É um recurso do personagem, não uma medida do aluno.",
      },
      {
        name: "Evolução por marcos",
        description:
          "A equipe sobe de nível ao concluir etapas importantes, por decisão do Mestre. Na ficha, abra Evolução por marcos, descreva a conquista e confirme a autorização. O app avança do nível 1 para o 2, recalcula o Estresse máximo e mantém proficiência +2. Combine com o Mestre o refinamento de uma habilidade inicial e anote no caderno.",
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
          "Estresse máximo = base da classe + (mod. RES × nível); Iniciativa = mod. COM + mod. LID; Confiança = mod. EMP + mod. ETI; Qualidade = mod. MOD + mod. ANA. O app exibe esses valores para consulta.",
      },
      {
        name: "Proficiência e habilidades",
        description:
          "Proficiência representa treinamento: nos níveis 1 e 2 o bônus é +2 nos testes em que você é proficiente. Habilidades descrevem recursos da classe; sua aplicação na mesa é orientada pelo professor.",
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
            <Text style={styles.eyebrow}>APRENDA NO SEU RITMO</Text>
            <Text style={styles.title}>Entenda sua ficha</Text>
            <Text style={styles.subtitle}>
              Toque em um assunto para descobrir como funciona.
            </Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.section}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <Disclosure title={item.name}>
            <Text style={styles.body}>{item.description}</Text>
          </Disclosure>
        )}
      />
    </SafeAreaView>
  );
}
