import { Text, View } from "react-native";
import type { CharacterClass } from "../data/codex";
import { styles } from "../styles";
export function ClassContents({
  characterClass,
}: {
  characterClass: CharacterClass;
}) {
  return (
    <View style={{ gap: 20 }}>
      <View style={styles.card}>
        <Text style={styles.section}>Habilidades</Text>
        {characterClass.skills.map((skill) => (
          <View key={skill.name} style={{ gap: 4 }}>
            <Text style={[styles.body, { fontWeight: "700" }]}>
              {skill.name}
            </Text>
            <Text style={styles.body}>{skill.description}</Text>
          </View>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.section}>Proficiências</Text>
        <Text style={styles.body}>
          {characterClass.proficiencies.join(" · ")}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.section}>Equipamento inicial</Text>
        <Text style={styles.body}>{characterClass.equipment.join(" · ")}</Text>
      </View>
    </View>
  );
}
