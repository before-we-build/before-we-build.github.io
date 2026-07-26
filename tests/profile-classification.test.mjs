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
    'Логика|1': 5, 'Логика|2': 2, 'Логика|3': 1, 'Логика|4': 1,
    'Воля|1': 2, 'Воля|2': 5, 'Воля|3': 1, 'Воля|4': 1,
    'Эмоция|1': 1, 'Эмоция|2': 2, 'Эмоция|3': 5, 'Эмоция|4': 1,
    'Физика|1': 1, 'Физика|2': 1, 'Физика|3': 2, 'Физика|4': 5
  },
  counts: {
    'Логика|1': 1, 'Логика|2': 1, 'Логика|3': 1, 'Логика|4': 1,
    'Воля|1': 1, 'Воля|2': 1, 'Воля|3': 1, 'Воля|4': 1,
    'Эмоция|1': 1, 'Эмоция|2': 1, 'Эмоция|3': 1, 'Эмоция|4': 1,
    'Физика|1': 1, 'Физика|2': 1, 'Физика|3': 1, 'Физика|4': 1
  }
};
sandbox.activeTest = 'psychosophy';
sandbox.currentLang = 'ru';
const lvefTop = positionTypes(TESTS.psychosophy, lvefCalc);
assert.equal(lvefTop[0].display, 'ЛВЭФ', `Expected top Psychosophy type to be ЛВЭФ, got ${lvefTop[0].display}`);

// 4. Test Temporistics PNF-E profile (1Past 2Present 3Future 4Eternity)
const pnfeCalc = {
  scores: {
    'Past|1': 5, 'Past|2': 2, 'Past|3': 1, 'Past|4': 1,
    'Present|1': 2, 'Present|2': 5, 'Present|3': 1, 'Present|4': 1,
    'Future|1': 1, 'Future|2': 2, 'Future|3': 5, 'Future|4': 1,
    'Eternity|1': 1, 'Eternity|2': 1, 'Eternity|3': 2, 'Eternity|4': 5
  },
  counts: {
    'Past|1': 1, 'Past|2': 1, 'Past|3': 1, 'Past|4': 1,
    'Present|1': 1, 'Present|2': 1, 'Present|3': 1, 'Present|4': 1,
    'Future|1': 1, 'Future|2': 1, 'Future|3': 1, 'Future|4': 1,
    'Eternity|1': 1, 'Eternity|2': 1, 'Eternity|3': 1, 'Eternity|4': 1
  }
};
sandbox.activeTest = 'temporistics';
sandbox.currentLang = 'uk';
const pnfeTop = positionTypes(TESTS.temporistics, pnfeCalc);
assert.equal(pnfeTop[0].display, 'Ми-Тп-Мб-Вч', `Expected top Temporistics type to be Ми-Тп-Мб-Вч, got ${pnfeTop[0].display}`);

console.log('All synthetic profile classification tests passed clean!');
