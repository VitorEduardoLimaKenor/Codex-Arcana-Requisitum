const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  builtInAdventures,
  createAdventure,
  roomNameFor,
  adventureLevels,
} = require("../src/data/adventures.ts");
const { attributes } = require("../src/data/codex.ts");

test("aventuras do sistema cabem nos limites da sala e usam atributos válidos", () => {
  const ids = new Set(attributes.map((a) => a.id));
  assert.equal(new Set(builtInAdventures.map((a) => a.id)).size, builtInAdventures.length);
  for (const adventure of builtInAdventures) {
    assert.ok(adventure.title.length >= 3 && adventure.title.length <= 100);
    assert.ok(adventure.summary.length <= 1000);
    assert.ok(adventureLevels.includes(adventure.level));
    assert.ok(adventure.scenes.length > 0 && adventure.objectives.length > 0);
    assert.ok(!adventure.custom);
    for (const t of adventure.tests) assert.ok(ids.has(t.attribute), t.attribute);
  }
});

test("cadastro converte linhas em objetivos e cenas", () => {
  const adventure = createAdventure({
    title: "  App da cantina ",
    summary: "A cantina quer pedidos online. Ninguém sabe o horário de pico.",
    level: "Intermediário",
    npcs: [
      { name: " Seu Zé ", role: "Dono", secret: "Quer vender fiado", image: "data:image/jpeg;base64,AAA" },
      { name: "  ", role: "sem nome é descartado", secret: "" },
    ],
    objectives: "Entrevistar\n\n  Priorizar  ",
    scenes: "Reunião: o dono explica\nProtótipo",
    masterNotes: "   ",
    now: 42,
  });
  assert.equal(adventure.id, "custom-42");
  assert.equal(adventure.title, "App da cantina");
  assert.equal(adventure.tagline, "A cantina quer pedidos online.");
  assert.deepEqual(adventure.objectives, ["Entrevistar", "Priorizar"]);
  assert.deepEqual(adventure.scenes, [
    { title: "Reunião", text: "o dono explica" },
    { title: "Protótipo", text: "" },
  ]);
  assert.equal(adventure.masterNotes, undefined);
  assert.deepEqual(adventure.npcs, [
    { name: "Seu Zé", role: "Dono", secret: "Quer vender fiado", image: "data:image/jpeg;base64,AAA" },
  ]);
  assert.equal(adventure.custom, true);
});

test("editar mantém o id da aventura", () => {
  const edited = createAdventure({
    id: "custom-7",
    title: "Nova versão",
    summary: "Resumo atualizado da aventura.",
    level: "Iniciante",
    objectives: "",
    scenes: "",
    masterNotes: "",
    now: 99,
  });
  assert.equal(edited.id, "custom-7");
  assert.equal(edited.icon, "✎", "sem escolha, usa o ícone padrão");
  assert.equal(edited.iconImage, undefined);
});

test("cadastro guarda o ícone escolhido (símbolo, cor ou imagem)", () => {
  const base = { title: "Ícones", summary: "Resumo da aventura.", level: "Iniciante", objectives: "", scenes: "", masterNotes: "" };
  const glyph = createAdventure({ ...base, icon: "♜", color: "#FFD387" });
  assert.equal(glyph.icon, "♜");
  assert.equal(glyph.color, "#FFD387");
  const image = createAdventure({ ...base, iconImage: "data:image/jpeg;base64,BBB" });
  assert.equal(image.iconImage, "data:image/jpeg;base64,BBB");
});

test("nome da sala inclui a turma e respeita o limite do servidor", () => {
  const [first] = builtInAdventures;
  assert.equal(roomNameFor(first, ""), first.title);
  assert.equal(roomNameFor(first, " Turma A "), `${first.title} · Turma A`);
  assert.ok(roomNameFor({ ...first, title: "x".repeat(120) }, "B").length <= 100);
});
