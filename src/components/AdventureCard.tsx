import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { levelColors, SESSION_LENGTH, type Adventure, type Npc } from "../data/adventures";
import { Initials } from "./ui";
import { alpha, colors, fonts, styles } from "../styles";

export function AdventureIcon({
  adventure,
  size = 52,
}: {
  adventure: Pick<Adventure, "icon" | "color" | "iconImage">;
  size?: number;
}) {
  if (adventure.iconImage)
    return (
      <Image
        source={{ uri: adventure.iconImage }}
        aria-hidden
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.3,
          borderWidth: 1.5,
          borderColor: alpha(adventure.color, 0.6),
        }}
      />
    );
  return (
    <View
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: alpha(adventure.color, 0.45),
        backgroundColor: alpha(adventure.color, 0.12),
        backgroundImage: `linear-gradient(135deg, ${alpha(adventure.color, 0.28)} 0%, ${alpha(adventure.color, 0.04)} 100%)`,
      }}
    >
      <Text style={{ color: adventure.color, fontSize: size * 0.42, fontWeight: "800" }}>
        {adventure.icon}
      </Text>
    </View>
  );
}

/** Foto do personagem do mestre, ou as iniciais quando não há foto. */
export function NpcAvatar({ npc, size = 48, color }: { npc: Npc; size?: number; color: string }) {
  if (npc.image)
    return (
      <Image
        source={{ uri: npc.image }}
        accessibilityLabel={`Foto de ${npc.name}`}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: alpha(color, 0.6),
        }}
      />
    );
  return <Initials name={npc.name || "?"} color={color} size={size} />;
}

/** Linha de metadados: nível · (duração) · personagens · origem. */
export function AdventureMeta({
  adventure,
  showLength = false,
}: {
  adventure: Adventure;
  /** A duração é igual para todas (50 min); só vale mostrar no detalhe. */
  showLength?: boolean;
}) {
  return (
    <Text style={local.meta}>
      <Text style={{ color: levelColors[adventure.level] }}>● {adventure.level}</Text>
      {showLength ? `  ·  ${SESSION_LENGTH}` : ""}
      {adventure.npcs.length ? `  ·  ${adventure.npcs.length} personagens` : ""}
      {adventure.custom ? "  ·  sua" : ""}
    </Text>
  );
}

export function AdventureCard({
  adventure,
  onPress,
  selected,
  selection = false,
}: {
  adventure: Adventure;
  onPress: () => void;
  selected?: boolean;
  selection?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={selection ? "radio" : "button"}
      aria-checked={selection ? !!selected : undefined}
      accessibilityState={selection ? { checked: !!selected } : undefined}
      accessibilityLabel={selection ? adventure.title : `Ler aventura ${adventure.title}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        local.card,
        selected && { borderColor: adventure.color, backgroundColor: alpha(adventure.color, 0.06) },
        pressed && styles.pressed,
      ]}
    >
      <AdventureIcon adventure={adventure} />
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={[styles.body, { fontWeight: "700" }]} numberOfLines={1}>
          {adventure.title}
        </Text>
        <Text style={styles.label} numberOfLines={2}>
          {adventure.tagline}
        </Text>
        <AdventureMeta adventure={adventure} />
      </View>
      {selection ? (
        <View style={[local.radio, selected && { borderColor: adventure.color }]}>
          {selected && <View style={[local.radioDot, { backgroundColor: adventure.color }]} />}
        </View>
      ) : (
        <Text aria-hidden style={{ color: colors.faint, fontSize: 22 }}>
          ›
        </Text>
      )}
    </Pressable>
  );
}

const local = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  meta: { color: colors.faint, fontFamily: fonts.mono, fontSize: 11, marginTop: 3 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
});
