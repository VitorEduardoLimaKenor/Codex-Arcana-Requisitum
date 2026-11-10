const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createAuthAttempts } = require("../src/services/authAttempts.ts");
function deferred() {
  let resolve;
  const promise = new Promise((r) => (resolve = r));
  return { promise, resolve };
}
test("sair da tela durante cadastro impede login tardio", async () => {
  const committed = [];
  const gate = createAuthAttempts((v) => committed.push(v));
  const operation = deferred();
  const controller = new AbortController();
  const pending = gate.run(() => operation.promise, controller.signal);
  controller.abort();
  operation.resolve({ id: "master-antigo" });
  await pending;
  assert.deepEqual(committed, []);
});
test("conclusão antiga não substitui nova tentativa nem reabre sessão após sair", async () => {
  const committed = [];
  const gate = createAuthAttempts((v) => committed.push(v));
  const old = deferred();
  const newer = deferred();
  const a = gate.run(() => old.promise, new AbortController().signal);
  const b = gate.run(() => newer.promise, new AbortController().signal);
  newer.resolve("player-atual");
  await b;
  old.resolve("master-antigo");
  await a;
  assert.deepEqual(committed, ["player-atual"]);
  const after = deferred();
  const c = gate.run(() => after.promise, new AbortController().signal);
  gate.invalidate();
  after.resolve("nao-entrar");
  await c;
  assert.deepEqual(committed, ["player-atual"]);
});
