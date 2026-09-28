import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Routes } from "../navigation";
import { type Character, getClass } from "../data/codex";
import { Button } from "../components/Button";
import { ClassBadge } from "../components/ClassCard";
import { colors, styles } from "../styles";
export function HomeScreen({
  navigation,
  characters,
}: NativeStackScreenProps<Routes, "Home"> & { characters: Character[] }) {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.page}>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={{ gap: 20 }}>
            <View style={local.hero}>
              <Image
                source={require("../../assets/images/codex-banner.png")}
                resizeMode="cover"
                accessibilityLabel="Livro luminoso do Codex Arcana"
                style={local.heroArt}
              />
              <View style={local.heroCopy}>
                <Text style={local.heroTag}>SUA JORNADA COMEÇA AQUI</Text>
                <Text style={local.heroTitle}>
                  Toda equipe precisa{"\n"}do seu talento.
                </Text>
                <Text style={local.heroSubtitle}>
                  Escolha uma classe. Crie seu personagem.
                </Text>
              </View>
            </View>
            <Button
              title="+ Criar personagem"
              onPress={() => navigation.navigate("CreateCharacter")}
            />
            <View style={local.shortcuts}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Conhecer as classes"
                onPress={() => navigation.navigate("Classes")}
                style={({ pressed }) => [
                  local.shortcut,
                  pressed && styles.pressed,
                ]}
              >
                <Text aria-hidden style={local.shortcutIcon}>
                  ✦
                </Text>
                <Text style={styles.body}>As 5 classes</Text>
                <Text style={styles.label}>Encontre seu papel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Guia do sistema"
                onPress={() => navigation.navigate("Guide")}
                style={({ pressed }) => [
                  local.shortcut,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  aria-hidden
                  style={[local.shortcutIcon, { color: "#BCA5FF" }]}
                >
                  ?
                </Text>
                <Text style={styles.body}>Como jogar</Text>
                <Text style={styles.label}>Aprenda aos poucos</Text>
              </Pressable>
            </View>
            <View style={styles.row}>
              <Text style={[styles.section, styles.grow]}>
                Seus personagens
              </Text>
              <Text style={local.count}>{characters.length}</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Abrir ficha de ${item.name}`}
            onPress={() =>
              navigation.navigate("Character", { characterId: item.id })
            }
            style={({ pressed }) => [
              styles.card,
              local.character,
              pressed && styles.pressed,
            ]}
          >
            <ClassBadge classId={item.classId} />
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={styles.eyebrow}>
                {item.example ? "EXEMPLO" : "SEU PERSONAGEM"} · NV. 1
              </Text>
              <Text style={styles.section}>{item.name}</Text>
              <Text style={styles.label}>{getClass(item.classId).name}</Text>
            </View>
            <Text aria-hidden style={{ color: colors.primary, fontSize: 24 }}>
              ›
            </Text>
          </Pressable>
        )}
        ListFooterComponent={
          <Text style={styles.notice}>
            Só nesta sessão: recarregar o app apaga as alterações.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
const local = StyleSheet.create({
  hero: { borderRadius: 24, overflow: "hidden", backgroundColor: "#261B61" },
  heroArt: { width: "100%", height: 125 },
  heroCopy: { padding: 20, gap: 9 },
  heroTag: {
    color: "#ADA2ED",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    lineHeight: 33,
    fontWeight: "800",
  },
  heroSubtitle: { color: "#DBD5FA", fontSize: 13, lineHeight: 20 },
  shortcuts: { flexDirection: "row", gap: 12 },
  shortcut: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    gap: 7,
  },
  shortcutIcon: { fontSize: 25, color: colors.accent, fontWeight: "800" },
  count: {
    color: colors.primary,
    backgroundColor: colors.selected,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    fontWeight: "700",
  },
  character: { flexDirection: "row", alignItems: "center", gap: 12 },
});
