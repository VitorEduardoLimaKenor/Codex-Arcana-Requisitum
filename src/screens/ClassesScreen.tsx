import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Routes } from "../navigation";
import { classes, getClass } from "../data/codex";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { ClassContents } from "../components/ClassContents";
import { styles } from "../styles";
export function ClassesScreen({
  navigation,
}: NativeStackScreenProps<Routes, "Classes">) {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.page}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={{ gap: 10 }}>
            <Text style={styles.eyebrow}>CINCO PAPÉIS, UMA EQUIPE</Text>
            <Text style={styles.title}>Escolha seu caminho</Text>
            <Text style={styles.subtitle}>
              Cada classe representa uma profissão. Conheça o papel que você
              quer interpretar.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.section}>{item.name}</Text>
            <Text style={styles.body}>{item.role}</Text>
            <Text style={styles.eyebrow}>
              {item.primary} +2 · {item.secondary} +1
            </Text>
            <Button
              title={`Conhecer ${item.name}`}
              onPress={() =>
                navigation.navigate("ClassDetail", { classId: item.id })
              }
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
export function ClassDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<Routes, "ClassDetail">) {
  const characterClass = getClass(route.params.classId);
  return (
    <Screen>
      <Text style={styles.eyebrow}>CLASSE PROFISSIONAL</Text>
      <Text style={styles.title}>{characterClass.name}</Text>
      <Text style={styles.body}>{characterClass.description}</Text>
      <View style={styles.card}>
        <Text style={styles.section}>Atributos favorecidos</Text>
        <Text style={styles.body}>
          {characterClass.primary} +2 · {characterClass.secondary} +1
        </Text>
        <Text style={styles.subtitle}>
          Bônus aplicados após a distribuição, sem gastar pontos extras.
        </Text>
      </View>
      <Button
        title="Usar esta classe"
        onPress={() =>
          navigation.navigate("CreateCharacter", { classId: characterClass.id })
        }
      />
      <ClassContents characterClass={characterClass} />
    </Screen>
  );
}
