import { useState } from "react";
import { Text } from "react-native";
import { Button } from "./Button";
import { Help, Sheet } from "./ui";
import { useCharacters } from "../state/characters";
import { styles } from "../styles";

export function DeleteCharacter({
  id,
  name,
  onDeleted,
}: {
  id: string;
  name: string;
  onDeleted?: () => void;
}) {
  const { remove } = useCharacters();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function confirm() {
    setBusy(true);
    try {
      await remove(id);
      setOpen(false);
      onDeleted?.();
    } catch {
      setError("Não foi possível apagar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        variant="danger"
        title="Apagar personagem"
        onPress={() => {
          setError("");
          setOpen(true);
        }}
      />
      <Sheet
        visible={open}
        title={`Apagar ${name}?`}
        onClose={() => {
          if (!busy) setOpen(false);
        }}
        footer={
          <>
            <Button
              variant="destructive"
              title={busy ? "Apagando…" : "Sim, apagar"}
              disabled={busy}
              onPress={() => void confirm()}
            />
            <Button
              variant="ghost"
              title="Cancelar"
              disabled={busy}
              onPress={() => setOpen(false)}
            />
          </>
        }
      >
        <Help>
          A ficha, as anotações, a evolução e a foto deste personagem serão
          removidas da sua conta neste aparelho.
        </Help>
        {!!error && (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        )}
      </Sheet>
    </>
  );
}
