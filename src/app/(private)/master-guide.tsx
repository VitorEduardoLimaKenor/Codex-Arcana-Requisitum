import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";
import { Disclosure } from "../../components/Disclosure";
import { PageHeader, SectionHeader } from "../../components/ui";
import { ROOM_RADIUS } from "../../services/rooms";
import { colors, fonts, styles } from "../../styles";

/** Roteiro sugerido para uma aula de 50 minutos. */
const timeline = [
  { min: "0–5", title: "Abertura", text: "Abra a sala, apresente o problema e confira se todos entraram nos grupos." },
  { min: "5–40", title: "Cenas", text: "Conduza as cenas do roteiro. Interprete os personagens e peça testes quando houver risco." },
  { min: "40–50", title: "Fechamento", text: "Peça aos grupos os requisitos que descobriram e discuta o que faltou perguntar." },
];

const sections: { title: string; items: { name: string; text: string }[] }[] = [
  {
    title: "Antes da aula",
    items: [
      {
        name: "Escolha uma aventura",
        text: "Na sua área, abra uma aventura para ler o resumo, os objetivos, o roteiro e os personagens. Cada aventura foi pensada para uma aula de 50 minutos.",
      },
      {
        name: "Ou cadastre a sua",
        text: "Toque em “+ Cadastrar”. Só título e resumo são obrigatórios. Adicione personagens com foto, nome e o que cada um precisa ou esconde: é isso que você vai interpretar.",
      },
      {
        name: "Leia os segredos dos personagens",
        text: "Cada personagem tem uma necessidade não declarada. A turma só deve descobri-la fazendo boas perguntas — não entregue de graça.",
      },
    ],
  },
  {
    title: "Criar e abrir a sala",
    items: [
      {
        name: "Crie a sala dentro da sala de aula",
        text: `Toque em “Criar sala”, escolha a aventura e as vagas. Sua localização vira o centro da sala, com raio de ${ROOM_RADIUS} m: os alunos precisam estar por perto para entrar.`,
      },
      {
        name: "Compartilhe o código",
        text: "Mostre o código de 6 letras no projetor ou no quadro. Os alunos também podem achar a sala pela busca por GPS.",
      },
      {
        name: "A sala só fica aberta com você no lobby",
        text: "Quando você sai do lobby, a sala fecha e ninguém novo entra. Para continuar, abra “Ver minhas salas” e toque em “Reabrir sala”.",
      },
      {
        name: "Pausar ou excluir",
        text: "Em “Entradas e sala”, você pode pausar novas entradas sem fechar o lobby, ou excluir a sala quando a aula acabar.",
      },
    ],
  },
  {
    title: "Formar os grupos",
    items: [
      {
        name: "Mover alunos",
        text: "Toque em um aluno para colocá-lo em um grupo, devolvê-lo ao lobby ou removê-lo. Para trocar alunos entre grupos cheios, deixe um deles no lobby por um instante.",
      },
      {
        name: "Equilibre as classes",
        text: "Cada aluno aparece com o personagem que escolheu. Misture classes diferentes em cada grupo: Requisitos, Desenvolvimento, Negócios, UX/UI e Qualidade.",
      },
      {
        name: "Nomes e vagas",
        text: "Toque no lápis ao lado do grupo para renomeá-lo. Em “Vagas e grupos”, ajuste quantos grupos existem e quantas vagas cada um tem.",
      },
    ],
  },
  {
    title: "Conduzir a sessão",
    items: [
      {
        name: "Descreva a cena e pergunte",
        text: "Apresente a situação e pergunte: “o que vocês fazem?”. Os alunos dizem o que o personagem tenta — entrevistar, negociar, desenhar um protótipo, revisar um requisito.",
      },
      {
        name: "Quando pedir um teste",
        text: "Só quando houver risco ou incerteza. Diga o atributo e a Classe de Dificuldade (CD). As aventuras prontas sugerem testes com CD de 12 a 16; na dúvida, consulte o Livro do Mestre.",
      },
      {
        name: "Como ler o resultado",
        text: "O aluno toca no atributo e o app rola d20 + modificador. Igual ou acima da CD: sucesso. Até 4 abaixo: sucesso com custo. 5 a 9 abaixo: falha. 10 ou mais acima, ou 20 natural: triunfo. 10 ou mais abaixo, ou 1 natural: revés.",
      },
      {
        name: "Estresse",
        text: "Quando o projeto pressiona (prazo, cliente irritado, falha grave), o personagem perde pontos de Estresse. A zero, entra em colapso. Os alunos anotam perdas e recuperação no caderno da ficha.",
      },
      {
        name: "Recompense boas perguntas",
        text: "Uma pergunta que revela o segredo de um personagem vale mais que um dado alto. Dê vantagem ou dispense o teste quando o aluno investigar bem.",
      },
    ],
  },
  {
    title: "Depois da aventura",
    items: [
      {
        name: "Evolução por marcos",
        text: "Quando a equipe concluir uma etapa importante, autorize o nível 2. Cada aluno registra o marco na própria ficha.",
      },
      {
        name: "Feche com aprendizado",
        text: "Peça que cada grupo liste os requisitos encontrados e classifique-os (funcional, não funcional). Discuta quais perguntas teriam revelado mais.",
      },
    ],
  },
];

export default function MasterGuide() {
  return (
    <Screen
      footer={<Button title="Criar sala" arrow onPress={() => router.push("/create-room")} />}
    >
      <PageHeader
        eyebrow="Guia do mestre"
        title="Como conduzir uma sessão"
        subtitle="Tudo o que você precisa para preparar, abrir a sala e mestrar em 50 minutos."
      />

      <View style={{ gap: 10 }}>
        <SectionHeader title="Uma aula de 50 min" />
        <View style={[styles.card, { gap: 0 }]}>
          {timeline.map((step, index) => {
            const last = index === timeline.length - 1;
            return (
              <View key={step.title} style={{ flexDirection: "row", gap: 14 }}>
                <View style={{ alignItems: "center", width: 54 }}>
                  <Text style={local.min}>{step.min}</Text>
                  {!last && <View style={local.line} />}
                </View>
                <View style={{ flex: 1, gap: 2, paddingBottom: last ? 0 : 18 }}>
                  <Text style={[styles.body, { fontWeight: "700" }]}>{step.title}</Text>
                  <Text style={styles.label}>{step.text}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {sections.map((section, index) => (
        <View key={section.title} style={{ gap: 8 }}>
          <Text style={[styles.eyebrow, { color: colors.faint, marginBottom: 4 }]}>
            {String(index + 1).padStart(2, "0")} {"// "}
            {section.title}
          </Text>
          {section.items.map((item) => (
            <Disclosure key={item.name} title={item.name}>
              <Text style={[styles.body, { color: colors.muted }]}>{item.text}</Text>
            </Disclosure>
          ))}
        </View>
      ))}
    </Screen>
  );
}

const local = StyleSheet.create({
  min: { color: colors.primary, fontFamily: fonts.mono, fontSize: 12, fontWeight: "700" },
  line: { width: 1.5, flex: 1, backgroundColor: colors.border, marginVertical: 6 },
});
