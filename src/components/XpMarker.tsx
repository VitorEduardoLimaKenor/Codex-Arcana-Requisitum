import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Button } from "./Button";
import { Disclosure } from "./Disclosure";
import { colors, styles } from "../styles";

export function XpMarker({ xp, onChange }: { xp: number; onChange: (xp: number) => void }) {
  const [draft, setDraft] = useState(String(xp));
  const [message, setMessage] = useState("");
  function save() {
    if (!/^\d{1,7}$/.test(draft.trim())) {
      setMessage("Informe um número inteiro de 0 a 9999999.");
      return;
    }
    onChange(Number(draft));
    setMessage("XP atualizado.");
  }
  return (
    <Disclosure title={`${xp} XP · Experiência`}>
      <Text style={styles.subtitle}>Registro opcional da mesa. No sistema, o Mestre avança o nível por marcos, não por XP.</Text>
      <View style={{ gap: 10 }}>
        <TextInput accessibilityLabel="Total de XP" value={draft}
          onChangeText={(value) => { setDraft(value); setMessage(""); }}
          keyboardType="number-pad" maxLength={7} style={styles.input}
          placeholderTextColor={colors.muted} />
        <Button title="Atualizar XP" onPress={save} />
        {!!message && <Text accessibilityRole="alert" style={styles.body}>{message}</Text>}
      </View>
    </Disclosure>
  );
}
