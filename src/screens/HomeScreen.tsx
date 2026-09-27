import { Image, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Routes } from "../../App";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { character } from "../data/mock";
import { colors, serif, styles } from "../styles";

export function HomeScreen({
  navigation,
  noteCount,
}: NativeStackScreenProps<Routes, "Home"> & { noteCount: number }) {
  return (
    <Screen>
      <View style={{ gap: 10, alignItems: "center" }}>
        <Text style={styles.ornament} accessible={false}>
          ━━━━ ◆ ━━━━
        </Text>
        <Text style={[styles.eyebrow, { textAlign: "center" }]}>
          SEU COMPANHEIRO DE JORNADA
        </Text>
        <Text style={[styles.title, { textAlign: "center" }]}>
          Toda aventura{"\n"}merece ser lembrada.
        </Text>
        <Text style={[styles.subtitle, { textAlign: "center" }]}>
          Sua personagem e as memórias da campanha, sempre por perto.
        </Text>
      </View>
      <View style={local.hero}>
        <Image
          source={require("../../assets/images/medieval-forest.png")}
          style={local.art}
          resizeMode="cover"
          accessibilityLabel="Pixel art de ruínas medievais em uma floresta encantada"
        />
        <View style={local.heroText}>
          <Text style={local.tag}>CAMPANHA ATUAL</Text>
          <Text style={local.campaign}>Ecos da Floresta</Text>
          <Text style={local.caption}>Valeverde · Sessão 03</Text>
        </View>
      </View>
      <Text style={[styles.section, { textAlign: "center" }]}>
        — À mesa, aventureiro —
      </Text>
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
      <Text style={styles.ornament} accessible={false}>
        ━━━━ ◆ ━━━━
      </Text>
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
  hero: {
    backgroundColor: colors.wood,
    borderRadius: 3,
    borderWidth: 4,
    borderColor: "#6C482A",
    borderBottomWidth: 6,
    overflow: "hidden",
  },
  art: { width: "100%", height: 200 },
  heroText: {
    padding: 18,
    gap: 7,
    borderTopWidth: 2,
    borderTopColor: colors.accent,
  },
  tag: {
    color: colors.gold,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
  },
  campaign: {
    color: "#FFF0CF",
    fontFamily: serif,
    fontSize: 28,
    fontWeight: "700",
  },
  caption: { color: "#D6BC93", fontSize: 13 },
  count: {
    backgroundColor: "#DBC08D",
    color: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    fontWeight: "700",
  },
});
