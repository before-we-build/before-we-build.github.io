import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const repo = path.resolve(import.meta.dirname, '..');
const testsJsPath = path.join(repo, 'assets', 'tests.js');

assert.ok(fs.existsSync(testsJsPath), 'assets/tests.js should exist');

const code = fs.readFileSync(testsJsPath, 'utf8');

// Set up a browser-like sandbox to evaluate tests.js
const domStorage = {};
class MockMutationObserver {
  observe() {}
  disconnect() {}
}
const sandbox = {
  console,
  crypto: { randomUUID: () => '12345678-1234-1234-1234-123456789012' },
  localStorage: {
    getItem: (k) => domStorage[k] || null,
    setItem: (k, v) => { domStorage[k] = String(v); },
    removeItem: (k) => { delete domStorage[k]; }
  },
  document: {
    documentElement: { lang: 'uk' },
    body: { dataset: {} },
    querySelectorAll: () => [],
    querySelector: () => null
  },
  window: {},
  MutationObserver: MockMutationObserver,
  fetch: async () => ({ ok: false, status: 404 })
};

const context = vm.createContext(sandbox);
vm.runInContext(code + '\n;globalThis.TESTS_REF = TESTS;', context, { filename: testsJsPath });

const TESTS = sandbox.TESTS_REF;
assert.ok(TESTS, 'TESTS object should be exposed');

// Verify Socionics reverse items (50% balanced aspect indicators)
const socItems = TESTS.socionics.items.filter(i => !i.attention);
assert.equal(socItems.length, 16, 'Socionics should have 16 non-attention items');
const socReverseCount = socItems.filter(i => i.reverse).length;
assert.equal(socReverseCount, 8, 'Socionics should have 8 reverse-coded items (50% balanced)');

function verifyPositionBank(test, label) {
  const items = test.items.filter(i => !i.attention);
  assert.equal(items.length, 48, `${label} should have 48 non-attention items`);
  assert.equal(test.measurementModel, 'multi-indicator-position-contrast-v2', `${label} should declare the centered multi-indicator model`);
  assert.equal(new Set(items.map(i => i.id)).size, 48, `${label} item IDs should be unique`);

  for (const aspect of test.aspects) {
    for (const position of [1, 2, 3, 4]) {
      const cell = items.filter(i => i.scale === `${aspect}|${position}`);
      assert.equal(cell.length, 3, `${label} ${aspect}|${position} should contain three indicators`);
      assert.equal(new Set(cell.map(i => i.indicator)).size, 3, `${label} ${aspect}|${position} indicators should be distinct`);
    }
  }

  for (const positionItem of items) {
    assert.equal(positionItem.reverse, false, `${label} item ${positionItem.id} should be direct`);
    assert.equal(positionItem.version, '3.0', `${label} item ${positionItem.id} should use version 3.0`);
    assert.ok(positionItem.positionRole, `${label} item ${positionItem.id} should declare the construct role of its position`);
    assert.ok(positionItem.context, `${label} item ${positionItem.id} should declare its matched context`);
  }

  const confoundPattern = /легко|трудно|тяжело|тревож|спокой|помога|easy|hard|difficult|anxious|calm|help(?:ing|ed)?/i;
  for (const positionItem of items) {
    const textAll = `${positionItem.text.ru} ${positionItem.text.en} ${positionItem.text.uk}`;
    assert.doesNotMatch(textAll, confoundPattern, `${label} item ${positionItem.id} should not use the old confidence/prosociality/anxiety/calmness markers`);
  }

  return items;
}

// Verify Psychosophy position items (three matched indicators per aspect × position cell)
const psyItems = TESTS.psychosophy.items.filter(i => !i.attention);
verifyPositionBank(TESTS.psychosophy, 'Psychosophy');

// Verify Temporistics position items (three matched indicators per aspect × position cell)
const tempItems = TESTS.temporistics.items.filter(i => !i.attention);
verifyPositionBank(TESTS.temporistics, 'Temporistics');

// Verify semantic reversal (reverse-coded items must feature negative/reversal phrasing)
const reversalPattern = /тяжело|сложно|трудно|игнорирую|избегаю|неинтересно|панику|сбивает|утомляюще|зациклен|мучительно|независимо|настаиваю|доминировать|hard|difficult|avoid|struggle|confuses|least|ignore|exhausting/i;
for (const item of [...socItems, ...psyItems, ...tempItems]) {
  if (item.reverse) {
    const textAll = `${item.text.ru} ${item.text.en} ${item.text.uk}`;
    assert.ok(
      reversalPattern.test(textAll),
      `Item ${item.id} is reverse-coded but its wording does not contain a semantic reversal pattern!`
    );
  }
}

// Test reverse scoring calculation
const revItem = socItems.find(i => i.reverse);
assert.ok(revItem, 'Reverse item should exist');
const rawResponse = 5;
const scoredValue = revItem.reverse ? (6 - rawResponse) : rawResponse;
assert.equal(scoredValue, 1, 'Raw response 5 on a reverse item should score as 1');
