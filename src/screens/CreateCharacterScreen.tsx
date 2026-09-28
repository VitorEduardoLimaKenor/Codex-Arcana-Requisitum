import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Routes } from "../navigation";
import {
  type ClassId,
  classes,
  getClass,
  getModel,
  signed,
} from "../data/codex";
import { Button } from "../components/Button";
import { colors, styles } from "../styles";
type Props = NativeStackScreenProps<Routes, "CreateCharacter"> & {
  onCreate: (name: string, classId: ClassId, project: string) => string;
};
export function CreateCharacterScreen({ route, navigation, onCreate }: Props) {
  const [name, setName] = useState("");
  const [project, setProject] = useState("");
  const [classId, setClassId] = useState<ClassId | undefined>(
    route.params?.classId,
  );
  const [error, setError] = useState("");
  const selectedClass = classId ? getClass(classId) : undefined;
  function save() {
    if (!name.trim() || !classId) {
      setError("Informe o nome e escolha uma classe.");
      return;
    }
    const characterId = onCreate(name.trim(), classId, project.trim());
    navigation.replace("Character", { characterId });
  }
  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.page}>
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View style={{ gap: 14 }}>
              <Text style={styles.eyebrow}>UM NOVO INTEGRANTE DA EQUIPE</Text>
              <Text style={styles.title}>Crie sua ficha</Text>
              <Text style={styles.subtitle}>
                Nível 1 · Modelo pronto da classe. Os 36 pontos já estão
                distribuídos para você.
              </Text>
              <Text style={styles.label}>Nome do personagem *</Text>
              <TextInput
                accessibilityLabel="Nome do personagem"
                style={styles.input}
                value={name}
                onChangeText={setName}
                maxLength={60}
                placeholder="Como seu personagem se chama?"
                placeholderTextColor={colors.muted}
              />
              <Text style={styles.label}>Organização / projeto (opcional)</Text>
              <TextInput
                accessibilityLabel="Organização ou projeto"
                style={styles.input}
                value={project}
                onChangeText={setProject}
                maxLength={80}
                placeholder="Ex.: Portal da biblioteca"
                placeholderTextColor={colors.muted}
              />
              <Text style={styles.section}>Escolha uma classe *</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="radio"
              aria-checked={classId === item.id}
              accessibilityLabel={item.name}
              accessibilityState={{ checked: classId === item.id }}
              onPress={() => setClassId(item.id)}
              style={({ pressed }) => [
                styles.card,
                classId === item.id && {
                  borderColor: colors.primary,
                  backgroundColor: colors.selected,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.section}>
                {classId === item.id ? "◆ " : "◇ "}
                {item.name}
              </Text>
              <Text style={styles.subtitle}>
                {item.primary} +2 · {item.secondary} +1
              </Text>
            </Pressable>
          )}
          ListFooterComponent={
            <View style={{ gap: 16 }}>
              {selectedClass && (
                <View style={styles.card}>
                  <Text style={styles.section}>Prévia do modelo</Text>
                  <Text style={styles.body}>
                    {selectedClass.name} · 36/36 pontos
                  </Text>
                  <Text style={styles.subtitle}>
                    Base + bônus = total · modificador
                  </Text>
                  {getModel(selectedClass).map((item) => (
                    <Text key={item.id} style={styles.body}>
                      {item.id}: {item.base} + {item.bonus} = {item.total} ·{" "}
                      {signed(item.modifier)}
                    </Text>
                  ))}
                </View>
              )}
              {!!error && (
                <Text accessibilityRole="alert" style={styles.error}>
                  {error}
                </Text>
              )}
              <Button title="Salvar ficha" onPress={save} />
              <Button
                title="Cancelar"
                secondary
                onPress={() => navigation.goBack()}
              />
              <Text style={styles.notice}>
                A ficha será mantida apenas enquanto o app não for recarregado.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
