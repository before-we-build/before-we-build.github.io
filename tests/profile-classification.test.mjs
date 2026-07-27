import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const testsJsPath = path.resolve('assets/tests.js');
const testsJsCode = fs.readFileSync(testsJsPath, 'utf8');

class MockObserver { observe() {} disconnect() {} }

const sandbox = {
  console,
  currentLang: 'ru',
  window: {},
  crypto: { randomUUID: () => 'test-uuid' },
  Intl,
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { querySelectorAll: () => [], querySelector: () => null, body: { dataset: {} } },
  MutationObserver: MockObserver,
  fetch: async () => ({ ok: false })
};

vm.createContext(sandbox);
vm.runInContext(testsJsCode + '\n;globalThis.TESTS_REF = TESTS;', sandbox);

const TESTS = sandbox.TESTS_REF;
const { socionics, positionTypes } = sandbox;

console.log('Testing profile classification accuracy...');

// 1. Test Socionics LII profile (Ti > Ne > Fi > Se)
const liiResponses = {
  scores: { Ti: 10, Ne: 8, Fi: 5, Se: 2, Te: 6, Fe: 3, Si: 6, Ni: 6 },
  counts: { Ti: 2, Ne: 2, Fi: 2, Se: 2, Te: 2, Fe: 2, Si: 2, Ni: 2 }
};
const liiTop = socionics(liiResponses);
assert.equal(liiTop[0].code, 'LII', `Expected top TIM for LII profile to be LII, got ${liiTop[0].code}`);

// 2. Test Socionics LSI profile (Ti > Se > Fe > Ni)
const lsiResponses = {
  scores: { Ti: 10, Se: 10, Fe: 5, Ni: 2, Te: 6, Fi: 6, Si: 6, Ne: 3 },
  counts: { Ti: 2, Se: 2, Fe: 2, Ni: 2, Te: 2, Fi: 2, Si: 2, Ne: 2 }
};
const lsiTop = socionics(lsiResponses);
assert.equal(lsiTop[0].code, 'LSI', `Expected top TIM for LSI profile to be LSI, got ${lsiTop[0].code}`);

// 3. Test Psychosophy LVEF profile (1L 2V 3E 4F)
const lvefCalc = {
  scores: {
    'Логика|1': 15, 'Логика|2': 6, 'Логика|3': 3, 'Логика|4': 3,
    'Воля|1': 6, 'Воля|2': 15, 'Воля|3': 3, 'Воля|4': 3,
    'Эмоция|1': 3, 'Эмоция|2': 6, 'Эмоция|3': 15, 'Эмоция|4': 3,
    'Физика|1': 3, 'Физика|2': 3, 'Физика|3': 6, 'Физика|4': 15
  },
  counts: {
    'Логика|1': 3, 'Логика|2': 3, 'Логика|3': 3, 'Логика|4': 3,
    'Воля|1': 3, 'Воля|2': 3, 'Воля|3': 3, 'Воля|4': 3,
    'Эмоция|1': 3, 'Эмоция|2': 3, 'Эмоция|3': 3, 'Эмоция|4': 3,
    'Физика|1': 3, 'Физика|2': 3, 'Физика|3': 3, 'Физика|4': 3
  }
};
sandbox.activeTest = 'psychosophy';
sandbox.currentLang = 'ru';
const lvefTop = positionTypes(TESTS.psychosophy, lvefCalc);
assert.equal(lvefTop[0].display, 'ЛВЭФ', `Expected top Psychosophy type to be ЛВЭФ, got ${lvefTop[0].display}`);
assert.equal(lvefTop[0].defined, true, 'Strong three-indicator LVEF profile should be defined');
assert.ok(lvefTop[0].raw >= 0 && lvefTop[0].raw <= 1, 'Psychosophy profile score should be normalized to [0, 1]');

// 4. Test Temporistics PNF-E profile (1Past 2Present 3Future 4Eternity)
const pnfeCalc = {
  scores: {
    'Past|1': 15, 'Past|2': 6, 'Past|3': 3, 'Past|4': 3,
    'Present|1': 6, 'Present|2': 15, 'Present|3': 3, 'Present|4': 3,
    'Future|1': 3, 'Future|2': 6, 'Future|3': 15, 'Future|4': 3,
    'Eternity|1': 3, 'Eternity|2': 3, 'Eternity|3': 6, 'Eternity|4': 15
  },
  counts: {
    'Past|1': 3, 'Past|2': 3, 'Past|3': 3, 'Past|4': 3,
    'Present|1': 3, 'Present|2': 3, 'Present|3': 3, 'Present|4': 3,
    'Future|1': 3, 'Future|2': 3, 'Future|3': 3, 'Future|4': 3,
    'Eternity|1': 3, 'Eternity|2': 3, 'Eternity|3': 3, 'Eternity|4': 3
  }
};
sandbox.activeTest = 'temporistics';
sandbox.currentLang = 'uk';
const pnfeTop = positionTypes(TESTS.temporistics, pnfeCalc);
assert.equal(pnfeTop[0].display, 'Ми-Тп-Мб-Вч', `Expected top Temporistics type to be Ми-Тп-Мб-Вч, got ${pnfeTop[0].display}`);
assert.equal(pnfeTop[0].defined, true, 'Strong three-indicator PNF-E profile should be defined');
assert.ok(pnfeTop[0].raw >= 0 && pnfeTop[0].raw <= 1, 'Temporistics profile score should be normalized to [0, 1]');

console.log('All synthetic profile classification tests passed clean!');
