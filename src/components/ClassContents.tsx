import { Text, View } from "react-native";
import type { CharacterClass } from "../data/codex";
import { Disclosure } from "./Disclosure";
import { colors, fonts, styles } from "../styles";

export function ClassContents({
  characterClass,
}: {
  characterClass: CharacterClass;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Disclosure
        title="Habilidades da classe"
        subtitle={`${characterClass.skills.length} habilidades`}
      >
        {characterClass.skills.map((skill, index) => (
          <View key={skill.name} style={{ flexDirection: "row", gap: 12 }}>
            <Text style={{ color: colors.faint, fontFamily: fonts.mono, fontSize: 12, marginTop: 3 }}>
              {String(index + 1).padStart(2, "0")}
            </Text>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.body, { fontWeight: "600" }]}>{skill.name}</Text>
              <Text style={styles.label}>{skill.description}</Text>
            </View>
          </View>
        ))}
      </Disclosure>
      <Disclosure title="Proficiências e equipamento">
        <Text style={styles.eyebrow}>Proficiências</Text>
        <Text style={styles.body}>{characterClass.proficiencies.join(" · ")}</Text>
        <Text style={[styles.eyebrow, { marginTop: 6 }]}>Equipamento inicial</Text>
        <Text style={styles.body}>{characterClass.equipment.join(" · ")}</Text>
      </Disclosure>
    </View>
  );
}
