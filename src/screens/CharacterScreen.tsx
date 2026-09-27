import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { character } from "../data/mock";
import { colors, serif, styles } from "../styles";

export function CharacterScreen({
  health,
  onHealthChange,
}: {
  health: number;
  onHealthChange: (health: number) => void;
}) {
  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Text style={styles.eyebrow}>
          ECOS DA FLORESTA · NÍVEL {character.level}
        </Text>
        <Text style={styles.title}>{character.name}</Text>
        <Text style={styles.subtitle}>
          {character.race} · {character.role}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>PONTOS DE VIDA</Text>
        <Text style={local.health}>
          {health}
          <Text style={styles.subtitle}> / {character.maxHealth} PV</Text>
        </Text>
        <View accessible={false} style={local.healthTrack}>
          <View
            style={[
              local.healthFill,
              { width: `${(health / character.maxHealth) * 100}%` },
            ]}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.grow}>
            <Button
              secondary
              title="− 1 PV"
              disabled={health === 0}
              onPress={() => onHealthChange(Math.max(0, health - 1))}
            />
          </View>
          <View style={styles.grow}>
            <Button
              title="+ 1 PV"
              disabled={health === character.maxHealth}
              onPress={() =>
                onHealthChange(Math.min(character.maxHealth, health + 1))
              }
            />
          </View>
        </View>
        <Text style={styles.subtitle}>
          Classe de armadura: {character.armor} · Deslocamento:{" "}
          {character.speed}
        </Text>
      </View>
      <Text style={styles.section}>Atributos</Text>
      <View style={local.attributes}>
        {character.attributes.map((item) => (
          <View key={item.name} style={local.attribute}>
            <Text style={styles.label}>{item.name}</Text>
            <Text style={local.value}>{item.value}</Text>
            <Text style={local.modifier}>{item.modifier}</Text>
          </View>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.section}>Equipamento</Text>
        <Text style={styles.body}>{character.equipment}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.section}>Minha história</Text>
        <Text style={styles.body}>{character.story}</Text>
      </View>
    </Screen>
  );
}
const local = StyleSheet.create({
  healthTrack: {
    height: 12,
    backgroundColor: "#CDB78E",
    borderWidth: 1,
    borderColor: "#976E45",
    padding: 2,
  },
  healthFill: { height: "100%", backgroundColor: colors.red },
  health: {
    color: colors.red,
    fontFamily: serif,
    fontSize: 46,
    fontWeight: "700",
  },
  attributes: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  attribute: {
    flexGrow: 1,
    flexBasis: "30%",
    backgroundColor: "#EAD4A7",
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: colors.border,
    borderRadius: 3,
    alignItems: "center",
    padding: 14,
    gap: 5,
  },
  value: {
    color: colors.text,
    fontFamily: serif,
    fontSize: 29,
    fontWeight: "700",
  },
  modifier: { color: colors.primary, fontSize: 14, fontWeight: "600" },
});
