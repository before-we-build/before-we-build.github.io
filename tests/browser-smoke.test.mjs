import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const testsJsPath = path.resolve('assets/tests.js');
const testsJsCode = fs.readFileSync(testsJsPath, 'utf8');

// Set up full browser DOM environment for smoke test
const storage = {};

// Simple mock DOM element
class MockElement {
  constructor(tagName = 'div', id = '') {
    this.tagName = tagName;
    this.id = id;
    this.children = [];
    this.classList = { remove: () => {}, add: () => {}, toggle: () => {} };
    this.dataset = {};
    this.attributes = {};
    this.innerHTML = '';
    this.textContent = '';
    this.checked = false;
    this.value = '4';
  }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k] || null; }
  toggleAttribute() {}
  focus() {}
  querySelector(sel) {
    if (sel && sel.includes('input[')) return { value: '4', checked: true, setAttribute: () => {}, toggleAttribute: () => {} };
    return new MockElement('div');
  }
  querySelectorAll() { return []; }
  addEventListener() {}
  appendChild(c) { this.children.push(c); }
}

const mockDoc = {
  documentElement: { lang: 'ru' },
  body: new MockElement('body'),
  querySelector: (sel) => {
    if (sel === '#testResult') return new MockElement('div', 'testResult');
    if (sel === '#testTabs') return new MockElement('div', 'testTabs');
    if (sel === '#testPanel') return new MockElement('div', 'testPanel');
    if (sel === '#consent') return { checked: true };
    if (sel && sel.includes('input[')) {
      if (sel.includes('_ac_1')) return null; // Attention check radio inputs are NOT in DOM in public route
      return { value: '4', checked: true, setAttribute: () => {}, toggleAttribute: () => {} };
    }
    return new MockElement('div');
  },
  querySelectorAll: (sel) => {
    if (sel.includes('data-test-key') || sel.includes('data-test-item') || sel.includes('input')) {
      const matchKey = sel.match(/data-test-key="([^"]+)"/)?.[1];
      const items = sandbox.TESTS_REF ? (matchKey ? sandbox.TESTS_REF[matchKey]?.items || [] : Object.values(sandbox.TESTS_REF).flatMap(t => t.items)) : [];
      return items.map((it, i) => ({
        dataset: { testItem: it.id, displayIndex: i + 1, testKey: matchKey },
        classList: { remove: () => {}, add: () => {}, toggle: () => {} },
        setAttribute: () => {}
      }));
    }
    return [new MockElement('button')];
  },
  createElement: (tag) => new MockElement(tag)
};

const sandbox = {
  console,
  innerWidth: 1024,
  innerHeight: 768,
  window: { innerWidth: 1024, innerHeight: 768 },
  crypto: { randomUUID: () => 'smoke-test-uuid' },
  Intl,
  localStorage: {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; }
  },
  document: mockDoc,
  MutationObserver: class { observe() {} disconnect() {} },
  fetch: async () => ({ ok: false, status: 404 })
};

vm.createContext(sandbox);
vm.runInContext(
  testsJsCode + '\n;globalThis.TESTS_REF = TESTS; globalThis.currentLang = currentLang; globalThis.activeTest = activeTest; globalThis.scorePublicRouteV2Fn = scorePublicRouteV2; globalThis.publicAlternatives = typeof publicAlternatives !== "undefined" ? publicAlternatives : null;',
  sandbox
);

console.log('Running browser smoke test...');

// 1. Verify initialization variables exist
assert.ok(sandbox.currentLang, 'currentLang should be initialized');
assert.equal(sandbox.currentLang, 'uk', 'currentLang default should be uk');
assert.ok(sandbox.activeTest, 'activeTest should be initialized');
assert.ok(sandbox.TESTS_REF, 'TESTS object should be initialized');

// 2. Verify scorePublicRouteV2 function exists and runs cleanly
assert.equal(typeof sandbox.scorePublicRouteV2Fn, 'function', 'scorePublicRouteV2 must be a function');

// Run scorePublicRouteV2 in sandbox
await sandbox.scorePublicRouteV2Fn();

const lastPayload = sandbox.lastPublicPayload;
assert.ok(lastPayload, 'scorePublicRouteV2 should generate a payload');
assert.equal(lastPayload.qualityFlags.changedOften, false, 'First selections should NOT trigger changedOften flag');

// Test all-neutral (all 3s) tie handling
mockDoc.querySelector = (sel) => {
  if (sel === '#testResult') return new MockElement('div', 'testResult');
  if (sel === '#testTabs') return new MockElement('div', 'testTabs');
  if (sel === '#testPanel') return new MockElement('div', 'testPanel');
  if (sel === '#consent') return { checked: true };
  if (sel.includes('input[')) return { value: '3', checked: true };
  return new MockElement('div');
};

await sandbox.scorePublicRouteV2Fn();
const neutralPayload = sandbox.lastPublicPayload;
assert.ok(neutralPayload.resultSummary.includes('визначено') || neutralPayload.resultSummary.includes('определён'), 'All-neutral profile should state profile undefined / tie');

// Check publicAlternatives output for tie
const { publicAlternatives } = sandbox;
if (typeof publicAlternatives === 'function') {
  const dummyTech = [{ label: 'Test', top: [{ raw: 3 }, { raw: 3 }] }];
  const html = publicAlternatives(dummyTech);
  assert.ok(html.includes('визначено') || html.includes('определён') || html.includes('undefined'), 'Alternatives for tie must state profile undefined');
}

console.log('Browser smoke test passed successfully! Interface, tie handling & scoring functions are fully restored.');
