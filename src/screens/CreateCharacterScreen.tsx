import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Routes } from "../navigation";
import {
  type ClassId,
  attributes,
  classes,
  getClass,
  getModel,
  signed,
} from "../data/codex";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { ClassBadge, ClassCard, classLook } from "../components/ClassCard";
import { Disclosure } from "../components/Disclosure";
import { colors, styles } from "../styles";
type Props = NativeStackScreenProps<Routes, "CreateCharacter"> & {
  onCreate: (name: string, classId: ClassId) => string;
};
export function CreateCharacterScreen({ route, navigation, onCreate }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [classId, setClassId] = useState<ClassId | undefined>(
    route.params?.classId,
  );
  const [error, setError] = useState("");
  const chosen = classId ? getClass(classId) : undefined;
  const headings = [
    "Qual é o seu papel?",
    "Como vamos te chamar?",
    "Tudo pronto para começar!",
  ];
  function next() {
    if (!classId) return;
    if (step === 1 && !name.trim()) {
      setError("Seu personagem precisa de um nome.");
      return;
    }
    setError("");
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    const characterId = onCreate(name.trim(), classId);
    navigation.replace("Character", { characterId });
  }
  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View
        style={local.progress}
        accessibilityLabel={`Etapa ${step + 1} de 3`}
      >
        {["Classe", "Identidade", "Pronto"].map((label, index) => (
          <View key={label} style={local.progressItem}>
            <View
              style={[
                local.progressLine,
                index <= step && { backgroundColor: colors.primary },
              ]}
            />
            <Text
              style={[
                styles.label,
                index === step && { color: colors.primary },
              ]}
            >
              {index + 1}. {label}
            </Text>
          </View>
        ))}
      </View>
      {step === 0 ? (
        <FlatList
          data={classes}
          extraData={classId}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.content, { gap: 12 }]}
          ListHeaderComponent={
            <View style={{ gap: 8, marginBottom: 8 }}>
              <Text style={styles.title}>{headings[step]}</Text>
              <Text style={styles.subtitle}>
                Escolha o que você gosta de fazer.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ClassCard
              item={item}
              selected={classId === item.id}
              selection
              onPress={() => setClassId(item.id)}
            />
          )}
        />
      ) : (
        <Screen key={step}>
          <Text style={styles.title}>{headings[step]}</Text>
          {chosen && (
            <View
              style={[
                styles.card,
                {
                  alignItems: "center",
                  gap: 12,
                  borderColor: classLook[chosen.id].color,
                },
              ]}
            >
              <ClassBadge classId={chosen.id} large />
              <Text style={[styles.eyebrow, styles.centeredText]}>
                NÍVEL 1 · {classLook[chosen.id].title.toUpperCase()}
              </Text>
              <Text style={[styles.section, styles.centeredText]}>
                {step === 2 ? name.trim() : chosen.name}
              </Text>
              <Text style={[styles.subtitle, styles.centeredText]}>
                {step === 2 ? chosen.name : classLook[chosen.id].action}
              </Text>
            </View>
          )}
          {step === 1 ? (
            <View style={{ gap: 12 }}>
              <Text style={styles.label}>Nome do personagem *</Text>
              <TextInput
                accessibilityLabel="Nome do personagem"
                style={styles.input}
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  setError("");
                }}
                maxLength={60}
                placeholder="Pode ser um nome ou apelido"
                placeholderTextColor={colors.muted}
                returnKeyType="next"
              />
              {!!error && (
                <Text accessibilityRole="alert" style={styles.error}>
                  {error}
                </Text>
              )}
            </View>
          ) : (
            chosen && (
              <>
                <Text style={styles.section}>Seus pontos fortes</Text>
                <View style={{ gap: 10 }}>
                  {[chosen.primary, chosen.secondary].map((id, index) => (
                    <View
                      key={id}
                      style={[
                        styles.card,
                        { flexDirection: "row", alignItems: "center" },
                      ]}
                    >
                      <Text style={[styles.body, { flex: 1 }]}>
                        {attributes.find((item) => item.id === id)?.name}
                      </Text>
                      <Text
                        style={[
                          styles.section,
                          { color: classLook[chosen.id].color },
                        ]}
                      >
                        +{index === 0 ? 2 : 1}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.subtitle}>
                  Seus 36 pontos já estão distribuídos. É só jogar!
                </Text>
                <Disclosure title="Conferir atributos do modelo">
                  {getModel(chosen).map((item) => (
                    <Text key={item.id} style={styles.body}>
                      {item.id}: {item.base} + {item.bonus} = {item.total} ·
                      mod. {signed(item.modifier)}
                    </Text>
                  ))}
                </Disclosure>
                <Text style={styles.notice}>
                  Esta ficha fica nesta sessão. Recarregar o app apaga suas
                  alterações.
                </Text>
              </>
            )
          )}
        </Screen>
      )}
      <SafeAreaView edges={["bottom", "left", "right"]} style={local.footer}>
        <View style={local.footerContent}>
          <Button
            title={
              step === 2
                ? "Salvar ficha"
                : step === 0
                  ? "Escolher esta classe"
                  : "Conferir personagem"
            }
            disabled={!chosen}
            onPress={next}
          />
          <Button
            secondary
            title={step === 0 ? "Cancelar" : "Voltar uma etapa"}
            onPress={() => {
              setError("");
              if (step === 0) navigation.goBack();
              else setStep(step - 1);
            }}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
const local = StyleSheet.create({
  progress: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  progressItem: { flex: 1, gap: 8 },
  progressLine: { height: 4, borderRadius: 4, backgroundColor: colors.border },
  footer: {
    backgroundColor: colors.header,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerContent: {
    padding: 12,
    gap: 8,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
});
