const { test } = require('node:test');
const assert = require('node:assert/strict');
const { classes, getModel, getStats } = require('../src/data/codex.ts');

test('catálogo tem exatamente as cinco classes e bônus confirmados', () => {
  assert.deepEqual(classes.map(item => [item.id, item.primary, item.secondary]), [
    ['requirements', 'COM', 'MOD'], ['developer', 'ANA', 'AUT'],
    ['business', 'NEG', 'ANA'], ['designer', 'EMP', 'MOD'], ['quality', 'VAL', 'CRI'],
  ]);
});

for (const characterClass of classes) {
  test(`${characterClass.name}: modelo válido, sem cobrar bônus`, () => {
    const model = getModel(characterClass);
    assert.equal(new Set(model.map(item => item.id)).size, 12);
    assert.equal(model.reduce((sum, item) => sum + item.cost, 0), 36);
    assert.deepEqual(model.filter(item => item.bonus).map(item => item.bonus).sort(), [1, 2]);
    for (const item of model) {
      assert.ok(item.base >= 8 && item.base <= 15);
      assert.ok(item.total <= 17);
      assert.equal(item.total, item.base + item.bonus);
    }
  });
}

test('modificadores negativos e derivados do Analista de Requisitos', () => {
  const model = getModel(classes[0]);
  assert.equal(model.find(item => item.id === 'LID').modifier, -1);
  assert.equal(model.find(item => item.id === 'COM').modifier, 3);
  assert.equal(model.find(item => item.id === 'MOD').modifier, 2);
  assert.deepEqual(getStats(classes[0]), { stress:9, initiative:2, confidence:2, quality:3, proficiency:2 });
});

test('ler modelos repetidamente não acumula bônus nem altera os dados', () => {
  const before = JSON.stringify(classes);
  for (const item of classes) { getModel(item); getStats(item); getModel(item); }
  assert.equal(JSON.stringify(classes), before);
});

const { rollDie, diceSides } = require('../src/data/dice.ts');
test('dados respeitam extremos e somam modificador e proficiência', () => {
  for (const sides of diceSides) {
    assert.equal(rollDie(sides, 0, 0, () => 0).face, 1);
    assert.equal(rollDie(sides, 0, 0, () => 0.999999).face, sides);
  }
  assert.deepEqual(rollDie(20, -1, 2, () => 0), { face: 1, modifier: -1, proficiency: 2, total: 2 });
  assert.equal(rollDie(20, 3, 0, () => 0.5).total, 14);
});

const { advanceAtMilestone, initialCharacters } = require('../src/data/codex.ts');
test('marco válido avança uma vez e mantém os atributos de criação', () => {
  const original = initialCharacters[0];
  assert.equal(advanceAtMilestone(original, '   '), original);
  const advanced = advanceAtMilestone(original, '  Baseline aprovada  ');
  assert.equal(advanced.level, 2);
  assert.equal(advanced.milestone, 'Baseline aprovada');
  assert.equal(original.level, 1);
  assert.equal(advanceAtMilestone(advanced, 'Outro marco'), advanced);
  for (const characterClass of classes) {
    const first = getStats(characterClass, 1);
    const second = getStats(characterClass, 2);
    const resilience = getModel(characterClass).find(item => item.id === 'RES').modifier;
    assert.deepEqual(second, { ...first, stress: first.stress + resilience });
    assert.equal(second.proficiency, 2);
  }
});
