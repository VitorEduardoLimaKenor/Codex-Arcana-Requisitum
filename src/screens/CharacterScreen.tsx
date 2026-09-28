import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import { ClassBadge, classLook } from "../components/ClassCard";
import { DiceRoller } from "../components/DiceRoller";
import { MilestoneProgress } from "../components/MilestoneProgress";
import { Button } from "../components/Button";
import { colors, styles } from "../styles";
type Props = NativeStackScreenProps<Routes, "Character"> & {
  character: Character | undefined;
  onAdvance: (milestone: string) => void;
  onNoteChange: (note: string) => void;
};
export function CharacterScreen({
  character,
  onNoteChange,
  onAdvance,
  navigation,
}: Props) {
  const [roll, setRoll] = useState<{ name: string; modifier: number } | null | undefined>(undefined);
  const [showMath, setShowMath] = useState(false);
  if (!character)
    return (
      <View style={styles.content}>
        <Text style={styles.section}>Ficha não encontrada</Text>
        <Button title="Minhas fichas" onPress={() => navigation.popToTop()} />
      </View>
    );
  const chosen = getClass(character.classId);
  const look = classLook[chosen.id];
  const stats = getStats(chosen, character.level);
  const model = getModel(chosen);
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
          extraData={showMath}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.content, { gap: 8 }]}
          ListHeaderComponent={
            <View style={{ gap: 18, marginBottom: 8 }}>
              <View
                style={[
                  styles.card,
                  { alignItems: "center", borderColor: look.color },
                ]}
              >
                <ClassBadge classId={chosen.id} large />
                <Text style={[styles.eyebrow, { color: look.color }]}>
                  {character.example ? "EXEMPLO" : "PERSONAGEM PRONTO"} · NÍVEL {character.level}
                </Text>
                <Text style={[styles.title, styles.centeredText]}>
                  {character.name}
                </Text>
                <Text style={[styles.subtitle, styles.centeredText]}>
                  {chosen.name}
                </Text>
              </View>
              <MilestoneProgress level={character.level} milestone={character.milestone} onAdvance={onAdvance} />
              <Button title="Rolar dados avulsos" onPress={() => setRoll(null)} />
              <View
                style={[
                  styles.card,
                  { flexDirection: "row", alignItems: "center", gap: 18 },
                ]}
              >
                <Text style={local.number}>{stats.stress}</Text>
                <View style={{ flex: 1, gap: 5 }}>
                  <Text style={styles.body}>Estresse máximo</Text>
                  <Text style={styles.label}>
                    Sua resistência à pressão do projeto.
                  </Text>
                </View>
              </View>
              <View style={local.stats}>
                {[
                  ["Iniciativa", stats.initiative],
                  ["Confiança", stats.confidence],
                  ["Qualidade", stats.quality],
                  ["Proficiência", stats.proficiency],
                ].map(([label, value]) => (
                  <View key={label} style={local.stat}>
                    <Text style={[styles.section, { color: colors.accent }]}>
                      {signed(Number(value))}
                    </Text>
                    <Text style={styles.label}>{label}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.row}>
                <Text style={[styles.section, styles.grow]}>
                  Seus atributos
                </Text>
                <Text style={styles.eyebrow}>36/36 PONTOS</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                aria-pressed={showMath}
                onPress={() => setShowMath(!showMath)}
                style={{ minHeight: 44, justifyContent: "center" }}
              >
                <Text style={{ color: colors.accent, fontSize: 14 }}>
                  {showMath
                    ? "Ocultar cálculos"
                    : "Como os atributos foram calculados?"}
                </Text>
              </Pressable>
            </View>
          }
          renderSectionHeader={({ section }) => (
            <Text style={[styles.eyebrow, { marginTop: 12, marginBottom: 5 }]}>
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => (
            <Pressable accessibilityRole="button" accessibilityLabel={`Rolar ${item.name}`}
              onPress={() => setRoll({ name: item.name, modifier: item.modifier })}
              style={({ pressed }) => [local.attribute, pressed && styles.pressed]}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={styles.label}>{item.id}</Text>
                  <Text style={styles.body}>{item.name}</Text>
                </View>
                <Text style={styles.section}>{item.total}</Text>
                <Text style={local.modifier}>{signed(item.modifier)} · Rolar</Text>
              </View>
              {showMath && (
                <Text style={styles.subtitle}>
                  Base {item.base} + bônus {item.bonus} = {item.total} · custo{" "}
                  {item.cost}
                </Text>
              )}
            </Pressable>
          )}
          ListFooterComponent={
            <View style={{ gap: 16, marginTop: 16 }}>
              <Text style={styles.label}>
                Toque em um atributo para rolar d20 + modificador.
              </Text>
              <ClassContents characterClass={chosen} />
              <Button
                secondary
                title="Entender minha ficha"
                onPress={() => navigation.navigate("Guide")}
              />
              <Text style={styles.section}>Seu caderno</Text>
              <TextInput
                accessibilityLabel="Minha anotação"
                style={[styles.input, { minHeight: 110 }]}
                multiline
                textAlignVertical="top"
                maxLength={2000}
                value={character.note}
                onChangeText={onNoteChange}
                placeholder="Uma pista, uma ideia, uma dúvida…"
                placeholderTextColor={colors.muted}
              />
              <Text style={styles.notice}>
                Salvo nesta sessão. Recarregar apaga suas alterações.
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
      {roll !== undefined && <DiceRoller characterName={character.name} attribute={roll} proficiency={stats.proficiency} onClose={() => setRoll(undefined)} />}
    </KeyboardAvoidingView>
  );
}
const local = StyleSheet.create({
  number: {
    fontSize: 44,
    lineHeight: 58,
    color: colors.primary,
    fontWeight: "800",
    includeFontPadding: true,
  },
  stats: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  stat: {
    flexGrow: 1,
    flexBasis: "45%",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    gap: 5,
  },
  attribute: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 13,
    gap: 8,
  },
  modifier: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
    backgroundColor: colors.selected,
    padding: 8,
    borderRadius: 9,
  },
});
