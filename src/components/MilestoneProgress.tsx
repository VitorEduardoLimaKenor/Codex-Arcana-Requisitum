import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Button } from "./Button";
import { Disclosure } from "./Disclosure";
import { colors, styles } from "../styles";

type Props = {
  level: 1 | 2;
  milestone: string;
  onAdvance: (milestone: string) => void;
};

export function MilestoneProgress({ level, milestone, onAdvance }: Props) {
  const [draft, setDraft] = useState("");
  const [approved, setApproved] = useState(false);
  return (
    <Disclosure title={`Nível ${level} · Evolução por marcos`}>
      {level === 2 ? (
        <>
          <Text style={styles.body}>Marco concluído: {milestone}</Text>
          <Text style={styles.subtitle}>
            Nível 2 alcançado! Esta versão vai até aqui. Arquétipos e melhorias ficam para a próxima versão.
          </Text>
          <Text style={styles.label}>
            Combine o refinamento de uma habilidade inicial com o Mestre e registre no caderno.
          </Text>
        </>
      ) : (
        <View style={{ gap: 12 }}>
          <Text style={styles.subtitle}>
            A equipe avança quando o Mestre reconhece uma conquista importante, como concluir um cenário ou aprovar uma entrega.
          </Text>
          <Text style={styles.label}>Qual marco foi concluído?</Text>
          <TextInput accessibilityLabel="Marco concluído" value={draft}
            onChangeText={setDraft} maxLength={120} style={styles.input}
            placeholder="Ex.: Requisitos aprovados pelo cliente"
            placeholderTextColor={colors.muted} />
          <Pressable accessibilityRole="checkbox" aria-checked={approved}
            accessibilityState={{ checked: approved }}
            accessibilityLabel="O Mestre autorizou o avanço da equipe"
            onPress={() => setApproved(!approved)}
            style={{ minHeight: 48, justifyContent: "center" }}>
            <Text style={styles.body}>
              {approved ? "☑" : "☐"} O Mestre autorizou o avanço da equipe
            </Text>
          </Pressable>
          <Text style={styles.label}>
            O Estresse máximo será recalculado. A proficiência permanece +2.
          </Text>
          <Button title="Avançar para o nível 2" disabled={!draft.trim() || !approved}
            onPress={() => {
              if (!draft.trim() || !approved) return;
              onAdvance(draft.trim());
              setDraft("");
              setApproved(false);
            }} />
        </View>
      )}
    </Disclosure>
  );
}
