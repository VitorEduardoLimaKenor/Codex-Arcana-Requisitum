import { useAuth } from "../state/auth";
import { Image, StyleSheet, Text, View } from "react-native";
import type { ScreenProps } from "../navigation";
import { attributes, classes, getClass } from "../data/codex";
import { classPortraits } from "../data/characterImages";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { ClassContents } from "../components/ClassContents";
import { ClassCard, classLook } from "../components/ClassCard";
import { Chip, PageHeader } from "../components/ui";
import { alpha, colors, fadeToBackground, fonts, styles } from "../styles";

export function ClassesScreen({ navigation }: ScreenProps<"Classes">) {
  return (
    <Screen>
      <PageHeader
        eyebrow="5 papéis"
        title="Quem você quer ser na equipe?"
        subtitle="Cada classe reforça dois atributos. Toque para conhecer."
      />
      <View style={{ gap: 10 }}>
        {classes.map((item) => (
          <ClassCard
            key={item.id}
            item={item}
            onPress={() => navigation.navigate("ClassDetail", { classId: item.id })}
          />
        ))}
      </View>
    </Screen>
  );
}

export function ClassDetailScreen({
  route,
  navigation,
}: ScreenProps<"ClassDetail">) {
  const { user } = useAuth();
  const chosen = getClass(route.params.classId);
  const look = classLook[chosen.id];
  const isPlayer = user?.role === "player";
  return (
    <Screen
      footer={
        isPlayer ? (
          <Button
            title="Ver personagens desta classe"
            arrow
            onPress={() => navigation.navigate("CreateCharacter", { classId: chosen.id })}
          />
        ) : undefined
      }
    >
      <View style={local.hero}>
        {classPortraits[chosen.id].map((source, index) => (
          <Image key={index} source={source} style={local.heroImage} aria-hidden />
        ))}
        <View style={[StyleSheet.absoluteFill, { backgroundImage: fadeToBackground }]} />
      </View>
      <View style={{ gap: 8, marginTop: -56 }}>
        <Chip label={`${look.icon}  ${look.title.toUpperCase()}`} color={look.color} />
        <Text style={styles.title}>{chosen.name}</Text>
        <Text style={styles.subtitle}>{look.action}</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        {[chosen.primary, chosen.secondary].map((id, index) => (
          <View
            key={id}
            style={[styles.card, local.strength, { borderColor: alpha(look.color, 0.35) }]}
          >
            <Text style={[local.bonus, { color: look.color }]}>+{index === 0 ? 2 : 1}</Text>
            <Text style={local.id}>{id}</Text>
            <Text style={styles.label} numberOfLines={1}>
              {attributes.find((item) => item.id === id)?.name}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.body}>{chosen.description}</Text>
      <ClassContents characterClass={chosen} />
    </Screen>
  );
}

const local = StyleSheet.create({
  hero: {
    marginHorizontal: -20,
    marginTop: -12,
    height: 240,
    flexDirection: "row",
    overflow: "hidden",
  },
  heroImage: { flex: 1, height: "100%" },
  strength: { flex: 1, gap: 2, padding: 14 },
  bonus: { fontSize: 26, fontWeight: "800" },
  id: { color: colors.text, fontFamily: fonts.mono, fontWeight: "700", letterSpacing: 1 },
});
