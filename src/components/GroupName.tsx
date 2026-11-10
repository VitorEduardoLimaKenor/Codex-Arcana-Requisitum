import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Button } from "./Button";
import { colors, styles } from "../styles";

export function GroupName({
  name,
  editable,
  busy,
  onSave,
}: {
  name: string;
  editable: boolean;
  busy: boolean;
  onSave: (name: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState("");
  if (!editing)
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={[styles.section, { flexShrink: 1 }]} numberOfLines={1}>
          {name}
        </Text>
        {editable && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Renomear ${name}`}
            disabled={busy}
            hitSlop={10}
            onPress={() => {
              setDraft(name);
              setError("");
              setEditing(true);
            }}
          >
            <Text style={{ color: colors.faint, fontSize: 15 }}>✎</Text>
          </Pressable>
        )}
      </View>
    );
  return (
    <View style={{ gap: 8 }}>
      <TextInput
        accessibilityLabel={`Nome de ${name}`}
        style={styles.input}
        value={draft}
        onChangeText={setDraft}
        maxLength={40}
        editable={!busy}
        autoFocus
      />
      {!!error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Button
            small
            title={busy ? "Salvando…" : "Salvar"}
            disabled={busy}
            onPress={async () => {
              if (draft.trim().length < 2) {
                setError("Informe pelo menos dois caracteres.");
                return;
              }
              try {
                await onSave(draft.trim());
                setEditing(false);
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "Não foi possível alterar o nome.",
                );
              }
            }}
          />
        </View>
        <Button
          small
          variant="ghost"
          title="Cancelar"
          disabled={busy}
          onPress={() => setEditing(false)}
        />
      </View>
    </View>
  );
}
