const { test } = require("node:test");
const assert = require("node:assert/strict");
const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const db = new DatabaseSync(":memory:");
db.exec(
  "CREATE TABLE characters(id TEXT PRIMARY KEY NOT NULL,data TEXT NOT NULL)",
);
db.prepare("INSERT INTO characters VALUES (?,?)").run(
  "legacy",
  JSON.stringify({ id: "legacy", name: "Antigo" }),
);
const adapter = {
  execAsync: async (sql) => db.exec(sql),
  getAllAsync: async (sql, ...params) => db.prepare(sql).all(...params),
  getFirstAsync: async (sql, ...params) => db.prepare(sql).get(...params),
  runAsync: async (sql, ...params) => db.prepare(sql).run(...params),
};
const filename = path.resolve(__dirname, "../src/services/database.ts");
const service = new Module(filename, module);
service.filename = filename;
service.paths = module.paths;
service.require = (id) =>
  id === "expo-sqlite"
    ? { openDatabaseAsync: async () => adapter }
    : require(id);
service._compile(
  ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  filename,
);
const api = service.exports;
test("SQLite migra fichas antigas e mantém leitura, edição e exclusão por proprietário", async () => {
  assert.deepEqual(await api.readCharacters("ana"), []);
  assert.equal(await api.legacyCount(), 1);
  await api.importLegacy("ana");
  assert.equal((await api.readCharacters("ana"))[0].id, "legacy");
  assert.equal(await api.legacyCount(), 0);
  await api.saveCharacter({ id: "bia-1", name: "Bia" }, "bia");
  assert.equal((await api.readCharacters("ana")).length, 1);
  await api.deleteCharacter("bia-1", "ana");
  assert.equal((await api.readCharacters("bia")).length, 1);
  await api.saveCharacter({ id: "bia-1", name: "Intruso" }, "ana");
  assert.equal((await api.readCharacters("bia"))[0].name, "Bia");
  await api.saveCharacter({ id: "bia-1", name: "Atualizado" }, "bia");
  assert.equal((await api.readCharacters("bia"))[0].name, "Atualizado");
  await api.deleteCharacter("bia-1", "bia");
  assert.deepEqual(await api.readCharacters("bia"), []);
  assert.equal((await api.readCharacters("ana")).length, 1);
});
