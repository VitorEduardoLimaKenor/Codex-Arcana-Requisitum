import { Text, View } from "react-native";
import type { CharacterClass } from "../data/codex";
import { Disclosure } from "./Disclosure";
import { styles } from "../styles";
export function ClassContents({
  characterClass,
}: {
  characterClass: CharacterClass;
}) {
  return (
    <View style={{ gap: 10 }}>
      <Disclosure title="Habilidades da classe">
        {characterClass.skills.map((skill) => (
          <View key={skill.name} style={{ gap: 4 }}>
            <Text style={[styles.body, { fontWeight: "700" }]}>
              {skill.name}
            </Text>
            <Text style={styles.subtitle}>{skill.description}</Text>
          </View>
        ))}
      </Disclosure>
      <Disclosure title="Proficiências">
        <Text style={styles.body}>
          {characterClass.proficiencies.join(" · ")}
        </Text>
      </Disclosure>
      <Disclosure title="Equipamento inicial">
        <Text style={styles.body}>{characterClass.equipment.join(" · ")}</Text>
      </Disclosure>
    </View>
  );
}
