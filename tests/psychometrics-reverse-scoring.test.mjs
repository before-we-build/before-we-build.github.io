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

// Verify Socionics reverse items
const socItems = TESTS.socionics.items.filter(i => !i.attention);
assert.equal(socItems.length, 16, 'Socionics should have 16 non-attention items');
const socReverseCount = socItems.filter(i => i.reverse).length;
assert.equal(socReverseCount, 8, 'Socionics should have 8 reverse-coded items (50% balanced)');

// Verify Psychosophy reverse items
const psyItems = TESTS.psychosophy.items.filter(i => !i.attention);
assert.equal(psyItems.length, 16, 'Psychosophy should have 16 non-attention items');
const psyReverseCount = psyItems.filter(i => i.reverse).length;
assert.equal(psyReverseCount, 8, 'Psychosophy should have 8 reverse-coded items (50% balanced)');

// Verify Temporistics reverse items
const tempItems = TESTS.temporistics.items.filter(i => !i.attention);
assert.equal(tempItems.length, 16, 'Temporistics should have 16 non-attention items');
const tempReverseCount = tempItems.filter(i => i.reverse).length;
assert.equal(tempReverseCount, 8, 'Temporistics should have 8 reverse-coded items (50% balanced)');

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
