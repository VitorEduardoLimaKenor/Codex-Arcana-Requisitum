import {
  KeyboardAvoidingView,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Routes } from "../navigation";
import {
  type Character,
  getClass,
  getModel,
  getStats,
  signed,
} from "../data/codex";
import { ClassContents } from "../components/ClassContents";
import { Button } from "../components/Button";
import { colors, styles } from "../styles";
type Props = NativeStackScreenProps<Routes, "Character"> & {
  character: Character | undefined;
  onNoteChange: (note: string) => void;
};
export function CharacterScreen({
  character,
  onNoteChange,
  navigation,
}: Props) {
  if (!character)
    return (
      <View style={styles.content}>
        <Text style={styles.section}>Ficha não encontrada</Text>
        <Button title="Minhas fichas" onPress={() => navigation.popToTop()} />
      </View>
    );
  const characterClass = getClass(character.classId);
  const model = getModel(characterClass);
  const stats = getStats(characterClass);
  const sections = ["Intrapessoal", "Interpessoal", "Técnico"].map((title) => ({
    title,
    data: model.filter((item) => item.pillar === title),
  }));
  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.page}>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View style={{ gap: 20 }}>
              <Text style={styles.eyebrow}>
                {character.example ? "FICHA DEMONSTRATIVA" : "SEU PERSONAGEM"} ·
                NÍVEL 1
              </Text>
              <Text style={styles.title}>{character.name}</Text>
              <Text style={styles.section}>{characterClass.name}</Text>
              <Text style={styles.subtitle}>
                {character.project || "Sem organização/projeto informado"}
              </Text>
              <View style={styles.card}>
                <Text style={styles.label}>PONTOS DE ESTRESSE</Text>
                <Text style={local.number}>{stats.stress}</Text>
                <Text style={styles.subtitle}>
                  Base {characterClass.stressBase} + modificador de RES. Recurso
                  de pressão do projeto; valor de referência no nível 1.
                </Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.body}>
                  Iniciativa: {signed(stats.initiative)}
                </Text>
                <Text style={styles.body}>
                  Confiança: {signed(stats.confidence)}
                </Text>
                <Text style={styles.body}>
                  Qualidade: {signed(stats.quality)}
                </Text>
                <Text style={styles.body}>
                  Proficiência: {signed(stats.proficiency)}
                </Text>
              </View>
              <Text style={styles.section}>Atributos · 36/36 pontos</Text>
              <Text style={styles.subtitle}>
                Modelo pronto. Base + bônus = total; o modificador usa o total
                final.
              </Text>
            </View>
          }
          renderSectionHeader={({ section }) => (
            <Text style={styles.eyebrow}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.body}>
                {item.id} · {item.name}
              </Text>
              <View style={styles.row}>
                <Text style={styles.section}>
                  {item.base} + {item.bonus} = {item.total}
                </Text>
                <Text style={styles.body}>Mod. {signed(item.modifier)}</Text>
              </View>
              <Text style={styles.subtitle}>Custo: {item.cost} pontos</Text>
            </View>
          )}
          ListFooterComponent={
            <View style={{ gap: 20 }}>
              <ClassContents characterClass={characterClass} />
              <Text style={styles.section}>Minha anotação</Text>
              <TextInput
                accessibilityLabel="Minha anotação"
                style={[styles.input, { minHeight: 140 }]}
                multiline
                textAlignVertical="top"
                maxLength={2000}
                value={character.note}
                onChangeText={onNoteChange}
                placeholder="Registre uma descoberta ou dúvida…"
                placeholderTextColor={colors.muted}
              />
              <Text style={styles.notice}>
                Anotação atualizada nesta ficha enquanto você digita. Ela será
                perdida ao recarregar o app.
              </Text>
              <Button
                secondary
                title="Voltar às minhas fichas"
                onPress={() => navigation.popToTop()}
              />
            </View>
          }
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
const local = StyleSheet.create({
  number: {
    fontSize: 46,
    lineHeight: 60,
    color: colors.primary,
    fontWeight: "700",
    includeFontPadding: true,
  },
});
