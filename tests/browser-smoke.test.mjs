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
  testsJsCode + '\n;globalThis.TESTS_REF = TESTS; globalThis.currentLang = currentLang; globalThis.activeTest = activeTest; globalThis.scorePublicRouteV2Fn = scorePublicRouteV2; globalThis.publicAlternatives = typeof publicAlternatives !== "undefined" ? publicAlternatives : null; globalThis.FEATURE_FLAGS_REF = FEATURE_FLAGS; globalThis.recordAnswerFn = recordAnswer; globalThis.resetAnswerStateFn = resetAnswerState; globalThis.renderClassicPublicItemFn = renderClassicPublicItem; globalThis.publicModeForAgeFn = publicModeForAge; globalThis.setPublicTestKeysFn = keys => { publicTestKeys = keys; };',
  sandbox
);

console.log('Running browser smoke test...');

// 1. Verify initialization variables exist
assert.ok(sandbox.currentLang, 'currentLang should be initialized');
assert.equal(sandbox.currentLang, 'uk', 'currentLang default should be uk');
assert.ok(sandbox.activeTest, 'activeTest should be initialized');
assert.ok(sandbox.TESTS_REF, 'TESTS object should be initialized');

// 2. Verify the under-18 visual route is disabled by default and can be enabled explicitly
assert.equal(sandbox.FEATURE_FLAGS_REF.under18VisualMode, false, 'Under-18 visual mode feature flag should default to off');
assert.equal(sandbox.publicModeForAgeFn('under-18'), 'classic', 'Under-18 respondents should use classic mode while the flag is off');
assert.equal(sandbox.publicModeForAgeFn('25-34'), 'classic', 'Adult respondents should continue to use classic mode');
sandbox.FEATURE_FLAGS_REF.under18VisualMode = true;
assert.equal(sandbox.publicModeForAgeFn('under-18'), 'visual', 'Under-18 visual mode should be available when explicitly enabled');
assert.equal(sandbox.publicModeForAgeFn('25-34'), 'classic', 'Enabling the flag should not change adult mode');
sandbox.FEATURE_FLAGS_REF.under18VisualMode = false;

// 3. Verify scorePublicRouteV2 function exists and runs cleanly
assert.equal(typeof sandbox.scorePublicRouteV2Fn, 'function', 'scorePublicRouteV2 must be a function');
assert.equal(sandbox.publicModeForAgeFn('under-18'), 'classic', 'Age must not silently select a different questionnaire format');
assert.equal(sandbox.publicModeForAgeFn('55+'), 'classic', 'All age groups should receive the same measurement format');
sandbox.setPublicTestKeysFn(Object.keys(sandbox.TESTS_REF));

// A language-triggered re-render should be able to restore previously selected answers.
sandbox.recordAnswerFn({ name: 'persisted_item', value: '4' });
const restoredItemHtml = sandbox.renderClassicPublicItemFn(
  { id: 'persisted_item', testKey: 'temporistics', text: { uk: 'Перевірка', ru: 'Проверка', en: 'Check' } },
  0,
  1
);
assert.match(restoredItemHtml, /value="4" checked/, 'Rendered item should restore the selected response');
sandbox.resetAnswerStateFn();
const resetItemHtml = sandbox.renderClassicPublicItemFn(
  { id: 'persisted_item', testKey: 'temporistics', text: { uk: 'Перевірка', ru: 'Проверка', en: 'Check' } },
  0,
  1
);
assert.doesNotMatch(resetItemHtml, /value="4" checked/, 'Explicit reset should clear the restored response');

// Run scorePublicRouteV2 in sandbox
await sandbox.scorePublicRouteV2Fn();

const lastPayload = sandbox.lastPublicPayload;
assert.ok(lastPayload, 'scorePublicRouteV2 should generate a payload');
assert.equal(lastPayload.qualityFlags.changedOften, false, 'First selections should NOT trigger changedOften flag');
assert.equal(lastPayload.qualityFlags.attentionCheckPresented, false, 'Public route should report that its omitted attention checks were not presented');
assert.equal(lastPayload.qualityFlags.failedAttentionCheck, false, 'An omitted attention check must not be treated as failed');
assert.equal(lastPayload.instrumentVersion, 'public-modular-route-v0.4', 'Public payload should expose the modular route version');
assert.ok(lastPayload.questionBankVersion, 'Public payload should expose the question-bank version');
assert.equal(lastPayload.qualityFlags.tooFast, true, 'Instant synthetic completion should trigger hard quality withholding');
assert.equal(lastPayload.modelResults?.psychosophy?.evidence, undefined, 'Hard quality withholding must not leak position winners through evidence');
assert.equal(lastPayload.randomization.itemOrder.length, lastPayload.responses.length, 'Public payload should export the displayed item order');

// Test all-neutral (all 3s) tie handling
let renderedResultHtml = '';
const testResultEl = new MockElement('div', 'testResult');
Object.defineProperty(testResultEl, 'innerHTML', {
  set(v) { renderedResultHtml = v; },
  get() { return renderedResultHtml; }
});

mockDoc.querySelector = (sel) => {
  if (sel === '#testResult') return testResultEl;
  if (sel === '#testTabs') return new MockElement('div', 'testTabs');
  if (sel === '#testPanel') return new MockElement('div', 'testPanel');
  if (sel === '#consent') return { checked: true };
  if (sel.includes('input[')) {
    if (sel.includes('_ac_1')) return null;
    return { value: '3', checked: true };
  }
  return new MockElement('div');
};

await sandbox.scorePublicRouteV2Fn();
const neutralPayload = sandbox.lastPublicPayload;
assert.ok(/недостатньо|недостаточно|insufficient/i.test(neutralPayload.resultSummary), 'All-neutral profile should state that evidence is insufficient');
assert.equal(neutralPayload.modelResults.psychosophy.defined, false, 'All-neutral Psychosophy profile must abstain');
assert.equal(neutralPayload.modelResults.temporistics.defined, false, 'All-neutral Temporistics profile must abstain');
assert.equal(neutralPayload.qualityFlags.attentionCheckPresented, false, 'Neutral public route should still report no attention check');
assert.equal(neutralPayload.qualityFlags.failedAttentionCheck, false, 'Neutral public route should not invent an attention-check failure');

// Verify tech map in rendered HTML displays undefined profile and not arbitrary ILE · SEI · ESE
assert.ok(renderedResultHtml.includes('details'), 'Rendered result HTML should contain tech map details section');
assert.ok(/недостатньо|недостаточно|insufficient/i.test(renderedResultHtml), 'Rendered result tech map must display insufficient evidence on tie');
assert.ok(!renderedResultHtml.includes('ILE · SEI · ESE'), 'Rendered result tech map must NOT output arbitrary type lists on tie');
assert.ok(!renderedResultHtml.includes('ЛВЭФ'), 'Rendered result must NOT output an arbitrary Psychosophy type on tie');
assert.ok(!renderedResultHtml.includes('Ми-Тп-Мб-Вч'), 'Rendered result must NOT output an arbitrary Temporistics type on tie');

console.log('Browser smoke test passed successfully! Interface, tie handling & scoring functions are fully restored.');
