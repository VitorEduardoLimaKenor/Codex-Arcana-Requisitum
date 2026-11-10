import { useState } from "react";
import { Platform, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import type { Character } from "../data/codex";
import { Button } from "./Button";
import { styles } from "../styles";
export function Portrait({
  character,
  onChange,
}: {
  character: Character;
  onChange: (uri: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function capture() {
    setBusy(true);
    setError("");
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setError(
          "Permita o acesso à câmera nas configurações do dispositivo para tirar o retrato.",
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });
      if (result.canceled) return;
      const context = ImageManipulator.manipulate(result.assets[0].uri);
      context.resize({ width: 480 });
      const rendered = await context.renderAsync();
      const saved = await rendered.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.65,
        base64: true,
      });
      if (!saved.base64) throw Error();
      // Uma imagem pequena em base64 sobrevive à limpeza do diretório temporário.
      await onChange(`data:image/jpeg;base64,${saved.base64}`);
    } catch {
      setError(
        "Não foi possível capturar ou salvar o retrato. Tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.label}>
        Fotografe uma miniatura ou desenho do seu personagem. A imagem é
        reduzida e salva junto à ficha.
      </Text>
      <Button
        secondary
        icon="◉"
        disabled={busy || Platform.OS === "web"}
        title={busy ? "Preparando retrato…" : "Abrir câmera"}
        onPress={() => void capture()}
      />
      {Platform.OS === "web" && (
        <Text style={styles.notice}>
          Use o app Android ou iOS para tirar fotos.
        </Text>
      )}
      {!!character.portrait && (
        <Button
          variant="ghost"
          disabled={busy}
          title="Restaurar ilustração original"
          onPress={async () => {
            setBusy(true);
            try {
              await onChange("");
            } catch {
              setError("Não foi possível remover o retrato.");
            } finally {
              setBusy(false);
            }
          }}
        />
      )}
      {!!error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
