const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { randomUUID } = require("node:crypto");
const memory = new Map();
const storage = {
  getItem: async (k) => memory.get(k) ?? null,
  setItem: async (k, v) => memory.set(k, v),
};
const filename = path.resolve(__dirname, "../src/services/accounts.ts");
const service = new Module(filename, module);
service.filename = filename;
service.paths = module.paths;
service.require = (id) =>
  id === "./api"
    ? { onlineEnabled: false }
    : id === "@react-native-async-storage/async-storage"
      ? storage
      : id === "expo-crypto"
        ? { randomUUID }
        : require(id);
service._compile(
  ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  filename,
);
const { register, login } = service.exports;
test("cadastro, senha derivada, perfis distintos e rejeição de credenciais inválidas", async () => {
  await assert.rejects(register("A", "email", "short", "player"));
  const player = await register(
    "Ana",
    " Ana@Example.com ",
    "senhateste123",
    "player",
  );
  assert.equal(player.email, "ana@example.com");
  assert.equal(player.role, "player");
  assert.equal("hash" in player, false);
  assert.equal(
    [...memory.values()].some((v) => v.includes("senhateste123")),
    false,
  );
  assert.deepEqual(
    await login("ana@example.com", "senhateste123", "player"),
    player,
  );
  await assert.rejects(login("ana@example.com", "errada", "player"));
  await assert.rejects(login("ana@example.com", "senhateste123", "master"));
  await assert.rejects(
    register("Outra Ana", "ana@example.com", "senhateste123", "player"),
  );
  const master = await register(
    "Ana Mestre",
    "ana@example.com",
    "senhateste123",
    "master",
  );
  assert.notEqual(master.id, player.id);
  const other = await register(
    "Bia",
    "bia@example.com",
    "senhateste123",
    "player",
  );
  const stored = JSON.parse([...memory.values()][0]);
  assert.notEqual(
    stored.find((a) => a.id === player.id).hash,
    stored.find((a) => a.id === other.id).hash,
  );
});

test("cancelar durante a derivação da senha não grava cadastro", async () => {
  const controller = new AbortController();
  const pending = register(
    "Cancelado",
    "cancelado@example.test",
    "senhateste123",
    "master",
    controller.signal,
  );
  setTimeout(() => controller.abort(), 0);
  await assert.rejects(pending, { name: "AbortError" });
  const stored = JSON.parse([...memory.values()][0] ?? "[]");
  assert.equal(
    stored.some((a) => a.email === "cancelado@example.test"),
    false,
  );
});
