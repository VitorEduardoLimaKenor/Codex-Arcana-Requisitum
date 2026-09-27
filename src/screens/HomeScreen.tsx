import { Image, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Routes } from "../../App";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { character } from "../data/mock";
import { colors, styles } from "../styles";

export function HomeScreen({
  navigation,
  noteCount,
}: NativeStackScreenProps<Routes, "Home"> & { noteCount: number }) {
  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Text style={styles.eyebrow}>SUA PRÓXIMA HISTÓRIA COMEÇA AQUI</Text>
        <Text style={styles.title}>
          Toda aventura{"\n"}merece ser lembrada.
        </Text>
        <Text style={styles.subtitle}>
          Sua personagem e as memórias da campanha, sempre por perto.
        </Text>
      </View>
      <View style={local.hero}>
        <Image
          source={require("../../assets/images/camp.png")}
          style={local.art}
          accessibilityLabel="Ilustração de montanhas e uma tenda na floresta"
        />
        <View style={local.heroText}>
          <Text style={local.tag}>CAMPANHA ATUAL</Text>
          <Text style={local.campaign}>Ecos da Floresta</Text>
          <Text style={local.caption}>Valeverde · Sessão 03</Text>
        </View>
      </View>
      <Text style={styles.section}>À mesa, aventureiro</Text>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>MINHA PERSONAGEM</Text>
        <Text style={styles.section}>{character.name}</Text>
        <Text style={styles.subtitle}>
          {character.race} · {character.role} · Nível {character.level}
        </Text>
        <Button
          title="Abrir minha ficha"
          onPress={() => navigation.navigate("Character")}
        />
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={[styles.section, styles.grow]}>Diário da campanha</Text>
          <Text style={local.count}>{noteCount}</Text>
        </View>
        <Text style={styles.subtitle}>
          Pistas, encontros e histórias que você não quer esquecer.
        </Text>
        <Button
          secondary
          title="Ver anotações"
          onPress={() => navigation.navigate("Notes")}
        />
      </View>
    </Screen>
  );
}
const local = StyleSheet.create({
  hero: { backgroundColor: "#203F35", borderRadius: 20, overflow: "hidden" },
  art: { width: "100%", height: 160, resizeMode: "cover" },
  heroText: { padding: 20, gap: 7 },
  tag: { color: "#C9D8AF", fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  campaign: { color: "#FFF9E9", fontSize: 25, fontWeight: "700" },
  caption: { color: "#D3DFD5", fontSize: 13 },
  count: {
    backgroundColor: "#E6ECE4",
    color: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    fontWeight: "700",
  },
});
