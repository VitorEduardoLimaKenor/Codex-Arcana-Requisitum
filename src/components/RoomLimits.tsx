import { useState } from "react";
import { Text, View } from "react-native";
import type { RoomSettings } from "../services/rooms";
import { Button } from "./Button";
import { Stepper } from "./ui";
import { colors, fonts, styles } from "../styles";

export function RoomLimits({
  initial,
  busy,
  onSave,
  label = "Salvar limites",
}: {
  initial: RoomSettings;
  busy: boolean;
  onSave: (settings: RoomSettings) => Promise<void>;
  label?: string;
}) {
  const [capacity, setCapacity] = useState(initial.capacity);
  const [groupCount, setGroupCount] = useState(initial.groupCount);
  const [groupSize, setGroupSize] = useState(initial.groupSize);
  const [error, setError] = useState("");
  const seats = groupCount * groupSize;
  const fits = capacity <= seats;
  return (
    <View style={{ gap: 4 }}>
      <Stepper label="Jogadores" value={capacity} min={1} max={100} onChange={setCapacity} disabled={busy} />
      <Stepper label="Grupos" value={groupCount} min={1} max={20} onChange={setGroupCount} disabled={busy} />
      <Stepper label="Vagas por grupo" value={groupSize} min={1} max={20} onChange={setGroupSize} disabled={busy} />
      <Text
        style={{
          fontFamily: fonts.mono,
          fontSize: 12,
          color: fits ? colors.muted : colors.warning,
          marginVertical: 8,
        }}
      >
        {groupCount} × {groupSize} = {seats} vagas
        {fits ? " ✓" : ` · faltam ${capacity - seats} para ${capacity} jogadores`}
      </Text>
      {!!error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
      <Button
        title={busy ? "Salvando…" : label}
        disabled={busy}
        onPress={async () => {
          const settings = { capacity, groupCount, groupSize };
          if (
            ![capacity, groupCount, groupSize].every((n) => Number.isInteger(n) && n >= 1) ||
            capacity > 100 ||
            groupCount > 20 ||
            groupSize > 20 ||
            !fits
          ) {
            setError("Aumente os grupos ou as vagas para caber todos os jogadores.");
            return;
          }
          setError("");
          try {
            await onSave(settings);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Não foi possível salvar.");
          }
        }}
      />
    </View>
  );
}
