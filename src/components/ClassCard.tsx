import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CharacterClass, ClassId } from "../data/codex";
import { colors, styles } from "../styles";

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
        { borderColor: look.color, backgroundColor: look.color + "18" },
        large && local.large,
      ]}
    >
      <Text
        style={{
          color: look.color,
          fontSize: large ? 36 : 24,
          fontWeight: "800",
        }}
      >
        {look.icon}
      </Text>
    </View>
  );
}
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
  return (
    <Pressable
      accessibilityRole={selection ? "radio" : "button"}
      aria-checked={selection ? !!selected : undefined}
      accessibilityState={selection ? { checked: !!selected } : undefined}
      accessibilityLabel={selection ? item.name : `Conhecer ${item.name}`}
      onPress={onPress}
      style={({ pressed }) => [
        local.card,
        selected && {
          borderColor: look.color,
          backgroundColor: look.color + "12",
        },
        pressed && styles.pressed,
      ]}
    >
      <ClassBadge classId={item.id} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={local.name}>{look.title}</Text>
        <Text style={local.description}>{look.action}</Text>
        <Text style={[local.bonus, { color: look.color }]}>
          {item.primary} +2 · {item.secondary} +1
        </Text>
      </View>
      <Text
        aria-hidden
        style={{ color: selected ? look.color : colors.muted, fontSize: 20 }}
      >
        {selected ? "●" : "›"}
      </Text>
    </Pressable>
  );
}
const local = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  badge: {
    width: 48,
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  large: { width: 88, height: 96, borderRadius: 26 },
  name: { color: colors.text, fontSize: 17, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  bonus: { fontSize: 11, fontWeight: "700", marginTop: 3 },
});
