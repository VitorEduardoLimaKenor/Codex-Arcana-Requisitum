import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Routes } from "../navigation";
import { attributes, classes, getClass } from "../data/codex";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { ClassContents } from "../components/ClassContents";
import { ClassBadge, ClassCard, classLook } from "../components/ClassCard";
import { styles } from "../styles";
export function ClassesScreen({
  navigation,
}: NativeStackScreenProps<Routes, "Classes">) {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.page}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { gap: 12 }]}
        ListHeaderComponent={
          <View style={{ gap: 8, marginBottom: 10 }}>
            <Text style={styles.eyebrow}>CADA TALENTO CONTA</Text>
            <Text style={styles.title}>Quem você quer ser?</Text>
            <Text style={styles.subtitle}>
              Toque em uma classe para conhecê-la.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ClassCard
            item={item}
            onPress={() =>
              navigation.navigate("ClassDetail", { classId: item.id })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}
export function ClassDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<Routes, "ClassDetail">) {
  const chosen = getClass(route.params.classId);
  const look = classLook[chosen.id];
  return (
    <Screen>
      <View style={{ alignItems: "center", gap: 14, paddingVertical: 12 }}>
        <ClassBadge classId={chosen.id} large />
        <Text style={[styles.eyebrow, { color: look.color }]}>
          SEU PAPEL NA EQUIPE
        </Text>
        <Text style={[styles.title, { textAlign: "center" }]}>
          {chosen.name}
        </Text>
        <Text style={[styles.subtitle, { textAlign: "center" }]}>
          {look.action}
        </Text>
      </View>
      <Button
        title="Usar esta classe"
        onPress={() =>
          navigation.navigate("CreateCharacter", { classId: chosen.id })
        }
      />
      <Text style={styles.section}>Seus pontos fortes</Text>
      {[chosen.primary, chosen.secondary].map((id, index) => (
        <View
          key={id}
          style={[styles.card, { flexDirection: "row", alignItems: "center" }]}
        >
          <Text style={[styles.body, { flex: 1 }]}>
            {attributes.find((item) => item.id === id)?.name}
          </Text>
          <Text style={[styles.section, { color: look.color }]}>
            +{index === 0 ? 2 : 1}
          </Text>
        </View>
      ))}
      <Text style={styles.subtitle}>{chosen.description}</Text>
      <ClassContents characterClass={chosen} />
    </Screen>
  );
}
