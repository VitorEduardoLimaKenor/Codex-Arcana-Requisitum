import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { diceSides, rollDie, type DieSides } from "../data/dice";
import { signed } from "../data/codex";
import { colors, styles } from "../styles";
import { Button } from "./Button";
import { Screen } from "./Screen";

type Props = {
  characterName: string;
  attribute: { name: string; modifier: number } | null;
  proficiency: number;
  onClose: () => void;
};
export function DiceRoller({ characterName, attribute, proficiency, onClose }: Props) {
  const [sides, setSides] = useState<DieSides>(20);
  const [trained, setTrained] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof rollDie> | null>(null);
  const [count, setCount] = useState(0);
  return (
    <Modal animationType="slide" visible onRequestClose={onClose}>
      <SafeAreaView style={[styles.page, { backgroundColor: colors.background }]}>
        <Screen>
          <Text style={styles.eyebrow}>{characterName}</Text>
          <Text style={styles.title}>{attribute ? attribute.name : "Dados avulsos"}</Text>
          <Text style={styles.subtitle}>{attribute ? `Teste com d20 ${signed(attribute.modifier)} de modificador.` : "Escolha o dado. A rolagem avulsa não soma bônus."}</Text>
          {!attribute && <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {diceSides.map((die) => <Pressable key={die} accessibilityRole="radio"
              accessibilityLabel={`d${die}`} aria-checked={sides === die}
              accessibilityState={{ checked: sides === die }}
              onPress={() => { setSides(die); setResult(null); }}
              style={[styles.card, { minWidth: 72, alignItems: "center" }, sides === die && { borderColor: colors.primary }]}>
              <Text style={styles.section}>d{die}</Text>
            </Pressable>)}
          </View>}
          {attribute && <Pressable accessibilityRole="checkbox" aria-checked={trained}
            accessibilityState={{ checked: trained }}
            onPress={() => { setTrained(!trained); setResult(null); }} style={styles.card}>
            <Text style={styles.body}>{trained ? "☑" : "☐"} Usar proficiência (+{proficiency})</Text>
            <Text style={styles.label}>Marque apenas quando o teste permitir.</Text>
          </Pressable>}
          <View style={[styles.card, { alignItems: "center", gap: 14, paddingVertical: 24 }]} accessibilityLiveRegion="polite">
            <Text style={styles.eyebrow}>{result ? `ROLAGEM ${count} · RESULTADO` : "PRONTO PARA ROLAR"}</Text>
            <Text style={{ color: colors.primary, fontSize: 64, lineHeight: 80, fontWeight: "800" }}>{result ? result.total : "?"}</Text>
            <Text style={[styles.body, { textAlign: "center" }]}>{result
              ? `d${sides}: ${result.face}${attribute ? ` ${signed(result.modifier)} atributo${trained ? ` +${result.proficiency} proficiência` : ""}` : ""} = ${result.total}`
              : `Um dado de ${sides} lados`}</Text>
          </View>
          <Button title={result ? "Rolar novamente" : `Rolar d${sides}`} onPress={() => {
            setResult(rollDie(sides, attribute?.modifier ?? 0, attribute && trained ? proficiency : 0));
            setCount((value) => value + 1);
          }} />
          <Button secondary title="Voltar à ficha" onPress={onClose} />
        </Screen>
      </SafeAreaView>
    </Modal>
  );
}
