import { Pressable, StyleSheet, Text, View } from "react-native";
import { getModel, signed } from "../data/codex";
import { alpha, colors, fonts, styles } from "../styles";

type Attribute = ReturnType<typeof getModel>[number];

export const pillarColors: Record<string, string> = {
  Intrapessoal: "#BCA5FF",
  Interpessoal: "#FFD387",
  Técnico: "#7EE5FC",
};

/** Os atributos com maior modificador: o que o personagem faz de melhor. */
export function topStrengths(model: Attribute[], count = 3) {
  return [...model].sort((a, b) => b.total - a.total).slice(0, count);
}

/** Tile compacto: sigla, modificador e nome. Detalhes só quando pedidos. */
export function AttributeCard({
  item,
  showMath = false,
  onPress,
}: {
  item: Attribute;
  showMath?: boolean;
  onPress?: () => void;
}) {
  const color = pillarColors[item.pillar];
  const content = (
    <>
      <View style={local.top}>
        <Text style={[local.id, { color }]}>{item.id}</Text>
        {item.bonus > 0 && (
          <Text style={[local.bonus, { color: colors.primary }]}>
            +{item.bonus}
          </Text>
        )}
      </View>
      <Text style={local.mod}>{signed(item.modifier)}</Text>
      <Text numberOfLines={1} style={local.name}>
        {item.name}
      </Text>
      {showMath && (
        <Text style={local.math}>
          {item.bonus
            ? `${item.base} + ${item.bonus} = ${item.total}`
            : `valor ${item.total}`}
          {"\n"}
          custo {item.cost} pts
        </Text>
      )}
    </>
  );
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}: ${item.total}, modificador ${signed(item.modifier)}. Rolar dado.`}
      onPress={onPress}
      style={({ pressed }) => [
        local.card,
        { borderColor: alpha(color, 0.22) },
        pressed && [styles.pressed, { borderColor: color }],
      ]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={[local.card, { borderColor: alpha(color, 0.22) }]}>
      {content}
    </View>
  );
}

/** Legenda dos três pilares. */
export function PillarLegend() {
  return (
    <View style={{ flexDirection: "row", gap: 14, flexWrap: "wrap" }}>
      {Object.entries(pillarColors).map(([pillar, color]) => (
        <View key={pillar} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: color }} />
          <Text style={[styles.notice, { color: colors.muted }]}>{pillar}</Text>
        </View>
      ))}
    </View>
  );
}

/** Grade 3 × 4 com os doze atributos, ordenados por pilar. */
export function AttributeGrid({
  model,
  showMath = false,
  onPress,
}: {
  model: Attribute[];
  showMath?: boolean;
  onPress?: (item: Attribute) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <PillarLegend />
      <View style={local.grid}>
        {model.map((item) => (
          <AttributeCard
            key={item.id}
            item={item}
            showMath={showMath}
            onPress={onPress ? () => onPress(item) : undefined}
          />
        ))}
      </View>
    </View>
  );
}

const local = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  card: {
    flexGrow: 1,
    flexBasis: "30%",
    minWidth: 92,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 2,
    backgroundColor: colors.card,
    borderWidth: 1,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  id: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  bonus: { fontFamily: fonts.mono, fontSize: 11, fontWeight: "700" },
  mod: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    color: colors.text,
    fontVariant: ["tabular-nums"],
    marginTop: 4,
  },
  name: { fontSize: 12, color: colors.muted },
  math: {
    color: colors.faint,
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
  },
});
