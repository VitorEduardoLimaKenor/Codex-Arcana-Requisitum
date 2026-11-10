import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export const cameraAvailable = Platform.OS !== "web";

/**
 * Abre a câmera ou a galeria e devolve a foto reduzida como data URI
 * (ou null se a pessoa cancelar). Imagens pequenas cabem no armazenamento
 * local junto com a aventura.
 */
export async function pickPhoto(
  source: "camera" | "library",
  size = 256,
): Promise<string | null> {
  if (source === "camera") {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted)
      throw Error("Permita o acesso à câmera nas configurações do aparelho.");
  }
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    quality: 0.8,
    allowsEditing: true,
    aspect: [1, 1],
  };
  const result =
    source === "camera"
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled || !result.assets?.length) return null;
  const context = ImageManipulator.manipulate(result.assets[0].uri);
  context.resize({ width: size });
  const rendered = await context.renderAsync();
  const saved = await rendered.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.6,
    base64: true,
  });
  if (!saved.base64) throw Error("Não foi possível processar a foto.");
  return `data:image/jpeg;base64,${saved.base64}`;
}
