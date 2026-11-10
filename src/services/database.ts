import { openDatabaseAsync } from "expo-sqlite";
import type { Character } from "../data/codex";
let connection: ReturnType<typeof openDatabaseAsync> | undefined;
function database() {
  return (connection ??= openDatabaseAsync("codex.db")
    .then(async (db) => {
      await db.execAsync(
        "PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS characters (id TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL, owner_id TEXT);",
      );
      const columns = await db.getAllAsync<{ name: string }>(
        "PRAGMA table_info(characters)",
      );
      if (!columns.some((c) => c.name === "owner_id"))
        await db.execAsync("ALTER TABLE characters ADD COLUMN owner_id TEXT;");
      await db.execAsync(
        "CREATE INDEX IF NOT EXISTS characters_owner ON characters(owner_id);",
      );
      return db;
    })
    .catch((e) => {
      connection = undefined;
      throw e;
    }));
}
export async function readCharacters(ownerId: string): Promise<Character[]> {
  const rows = await (
    await database()
  ).getAllAsync<{ data: string }>(
    "SELECT data FROM characters WHERE owner_id = ? ORDER BY rowid DESC",
    ownerId,
  );
  return rows.map((r) => JSON.parse(r.data));
}
export async function saveCharacter(character: Character, ownerId: string) {
  await (
    await database()
  ).runAsync(
    "INSERT INTO characters (id,data,owner_id) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data WHERE characters.owner_id=excluded.owner_id",
    character.id,
    JSON.stringify(character),
    ownerId,
  );
}
export async function deleteCharacter(id: string, ownerId: string) {
  await (
    await database()
  ).runAsync(
    "DELETE FROM characters WHERE id = ? AND owner_id = ?",
    id,
    ownerId,
  );
}
export async function legacyCount() {
  return (
    (
      await (
        await database()
      ).getFirstAsync<{ count: number }>(
        "SELECT count(*) AS count FROM characters WHERE owner_id IS NULL",
      )
    )?.count ?? 0
  );
}
export async function importLegacy(ownerId: string) {
  await (
    await database()
  ).runAsync(
    "UPDATE characters SET owner_id = ? WHERE owner_id IS NULL",
    ownerId,
  );
}
