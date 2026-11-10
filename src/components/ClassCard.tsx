import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { CharacterClass, ClassId } from "../data/codex";
import { classPortraits } from "../data/characterImages";
import { alpha, colors, fonts, styles } from "../styles";

export const classLook: Record<
  ClassId,
  { icon: string; color: string; title: string; action: string }
> = {
  requirements: {
    icon: "✦",
    color: "#7EE5FC",
    title: "Requisitos",
    action: "Descubra o que as pessoas precisam.",
  },
  developer: {
    icon: "</>",
    color: "#BCA5FF",
    title: "Desenvolvimento",
    action: "Transforme ideias em software.",
  },
  business: {
    icon: "◎",
    color: "#FFD387",
    title: "Negócios",
    action: "Conecte pessoas e oportunidades.",
  },
  designer: {
    icon: "✎",
    color: "#FFABD4",
    title: "UX/UI",
    action: "Crie experiências fáceis de usar.",
  },
  quality: {
    icon: "✓",
    color: "#74E6BA",
    title: "Qualidade",
    action: "Encontre falhas antes da entrega.",
  },
};

export function ClassBadge({
  classId,
  large = false,
}: {
  classId: ClassId;
  large?: boolean;
}) {
  const look = classLook[classId];
  return (
    <View
      aria-hidden
      style={[
        local.badge,
        { borderColor: alpha(look.color, 0.5), backgroundColor: alpha(look.color, 0.1) },
        large && local.large,
      ]}
    >
      <Text
        style={{
          color: look.color,
          fontSize: large ? 34 : 18,
          fontWeight: "800",
          fontFamily: fonts.mono,
        }}
      >
        {look.icon}
      </Text>
    </View>
  );
}

/** Card de classe com os dois personagens que a representam. */
export function ClassCard({
  item,
  selected,
  onPress,
  selection = false,
}: {
  item: CharacterClass;
  selected?: boolean;
  onPress: () => void;
  selection?: boolean;
}) {
  const look = classLook[item.id];
  const [first, second] = classPortraits[item.id];
  return (
    <Pressable
      accessibilityRole={selection ? "radio" : "button"}
      aria-checked={selection ? !!selected : undefined}
      accessibilityState={selection ? { checked: !!selected } : undefined}
      accessibilityLabel={selection ? item.name : `Conhecer ${item.name}`}
      onPress={onPress}
      style={({ pressed }) => [
        local.card,
        selected && { borderColor: look.color },
        pressed && styles.pressed,
      ]}
    >
      <View style={local.portraits} aria-hidden>
        <Image source={first} style={[local.portrait, { borderColor: colors.card }]} />
        <Image
          source={second}
          style={[local.portrait, local.second, { borderColor: colors.card }]}
        />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[local.icon, { color: look.color }]}>
          {look.icon} {item.primary} +2 · {item.secondary} +1
        </Text>
        <Text style={local.name}>{look.title}</Text>
        <Text style={local.description}>{look.action}</Text>
      </View>
      <Text aria-hidden style={{ color: selected ? look.color : colors.faint, fontSize: 22 }}>
        {selected ? "●" : "›"}
      </Text>
    </Pressable>
  );
}

const local = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  large: { width: 88, height: 88, borderRadius: 26 },
  portraits: { width: 84, height: 64 },
  portrait: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 2,
    top: 0,
    left: 0,
  },
  second: { top: 8, left: 28 },
  icon: { fontFamily: fonts.mono, fontSize: 11, fontWeight: "700", letterSpacing: 0.4 },
  name: { color: colors.text, fontSize: 17, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 13, lineHeight: 19 },
});
