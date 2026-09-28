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
