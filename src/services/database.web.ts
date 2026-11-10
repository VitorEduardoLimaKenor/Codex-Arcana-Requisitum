import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Character } from "../data/codex";
const legacyKey = "@codex/web-characters";
const key = (ownerId: string) => `@codex/web-characters/${ownerId}`;
export async function readCharacters(ownerId: string): Promise<Character[]> {
  return JSON.parse((await AsyncStorage.getItem(key(ownerId))) ?? "[]");
}
export async function saveCharacter(character: Character, ownerId: string) {
  const rows = await readCharacters(ownerId);
  await AsyncStorage.setItem(
    key(ownerId),
    JSON.stringify([character, ...rows.filter((r) => r.id !== character.id)]),
  );
}
export async function deleteCharacter(id: string, ownerId: string) {
  await AsyncStorage.setItem(
    key(ownerId),
    JSON.stringify((await readCharacters(ownerId)).filter((r) => r.id !== id)),
  );
}
export async function legacyCount() {
  return (
    JSON.parse((await AsyncStorage.getItem(legacyKey)) ?? "[]") as Character[]
  ).length;
}
export async function importLegacy(ownerId: string) {
  const legacy: Character[] = JSON.parse(
    (await AsyncStorage.getItem(legacyKey)) ?? "[]",
  );
  const rows = await readCharacters(ownerId);
  await AsyncStorage.setItem(
    key(ownerId),
    JSON.stringify([
      ...rows,
      ...legacy.filter((c) => !rows.some((r) => r.id === c.id)),
    ]),
  );
  await AsyncStorage.removeItem(legacyKey);
}
