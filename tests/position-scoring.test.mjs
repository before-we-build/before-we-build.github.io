import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const testsJsPath = path.resolve('assets/tests.js');
const testsJsCode = fs.readFileSync(testsJsPath, 'utf8');

class MockObserver {
  observe() {}
  disconnect() {}
}

const sandbox = {
  console,
  window: {},
  crypto: { randomUUID: () => 'position-test-uuid' },
  Intl,
  localStorage: { getItem: () => null, setItem: () => {} },
  document: {
    documentElement: { lang: 'ru' },
    querySelectorAll: () => [],
    querySelector: () => null,
    body: { dataset: {} }
  },
  MutationObserver: MockObserver,
  fetch: async () => ({ ok: false, status: 404 })
};

vm.createContext(sandbox);
vm.runInContext(
  testsJsCode + `
    ;globalThis.TESTS_REF = TESTS;
    globalThis.positionTypesRef = positionTypes;
    globalThis.profileDefinedRef = profileDefined;
    globalThis.shuffleRef = shuffle;
    globalThis.validPositionTestRef = validPositionTest;
    globalThis.isQuestionBankRef = isQuestionBank;
    globalThis.publicMainHypothesisRef = publicMainHypothesis;
    globalThis.publicAlternativesRef = publicAlternatives;
    globalThis.musicRecommendationRef = musicRecommendation;
    globalThis.resultLinksRef = resultLinks;
  `,
  sandbox,
  { filename: testsJsPath }
);

const TESTS = sandbox.TESTS_REF;
const positionTypes = sandbox.positionTypesRef;
const profileDefined = sandbox.profileDefinedRef;
const shuffle = sandbox.shuffleRef;
const validPositionTest = sandbox.validPositionTestRef;
const isQuestionBank = sandbox.isQuestionBankRef;
const publicMainHypothesis = sandbox.publicMainHypothesisRef;
const publicAlternatives = sandbox.publicAlternativesRef;
const musicRecommendation = sandbox.musicRecommendationRef;
const resultLinks = sandbox.resultLinksRef;

function syntheticPositionTest(base, itemsPerCell = 3) {
  const prefix = base.aspects.includes('Past') ? 'tmp' : 'psy';
  const items = base.aspects.flatMap((aspect, aspectIndex) =>
    [1, 2, 3, 4].flatMap(position =>
      Array.from({ length: itemsPerCell }, (_, index) => ({
        id: `synthetic_${prefix}_${aspectIndex + 1}_${position}_${index + 1}`,
        scale: `${aspect}|${position}`,
        version: 'test',
        reverse: false,
        status: 'pilot',
        indicator: index + 1,
        facet: `facet-${index + 1}`,
        context: `context-${aspectIndex + 1}-${index + 1}`,
        contextDomain: 'synthetic',
        responseMode: 'matched-vignette',
        tetradId: `${prefix}-${aspectIndex + 1}-${index + 1}`,
        aspect,
        position,
        positionRole: {
          1: 'target',
          2: 'creative',
          3: 'criterion',
          4: 'resource'
        }[position],
        text: { ru: 'test', en: 'test', uk: 'test' }
      }))
    )
  );
  return {
    ...base,
    measurementModel: 'multi-indicator-position-contrast-v2',
    minCellItems: 3,
    items
  };
}

function calcFromTotals(test, totalsByAspect, count = 3) {
  const scores = {};
  const counts = {};
  for (const aspect of test.aspects) {
    const totals = totalsByAspect[aspect];
    assert.equal(totals?.length, 4, `Fixture for ${aspect} must provide four cell totals`);
    for (let position = 1; position <= 4; position += 1) {
      const key = `${aspect}|${position}`;
      scores[key] = totals[position - 1];
      counts[key] = count;
    }
  }
  return { scores, counts, responses: [] };
}

function uniformTotals(test, total) {
  return Object.fromEntries(test.aspects.map(aspect => [aspect, [total, total, total, total]]));
}

function assertApproximately(actual, expected, message, epsilon = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${message}: expected ${expected}, got ${actual}`);
}

const psyTest = syntheticPositionTest(TESTS.psychosophy);
const tmpTest = syntheticPositionTest(TESTS.temporistics);

const strongPsyTotals = {
  'Воля': [6, 15, 3, 3],
  'Логика': [15, 6, 3, 3],
  'Эмоция': [3, 6, 15, 3],
  'Физика': [3, 3, 6, 15]
};

const strongTmpTotals = {
  Past: [15, 6, 3, 3],
  Present: [6, 15, 3, 3],
  Future: [3, 6, 15, 3],
  Eternity: [3, 3, 6, 15]
};

// Strong, uniquely assigned evidence produces a defined centered-contrast profile.
sandbox.currentLang = 'ru';
let top = positionTypes(psyTest, calcFromTotals(psyTest, strongPsyTotals));
assert.equal(top[0].display, 'ЛВЭФ');
assert.equal(top[0].defined, true);
assert.equal(profileDefined(top), true);
assertApproximately(top[0].raw, 0.6875, 'Strong profile centered contrast');
assert.equal(Object.keys(top[0].evidence).length, 4);
for (const aspect of psyTest.aspects) {
  const evidence = top[0].evidence[aspect];
  assert.equal(evidence.coverage, true, `${aspect} should have complete coverage`);
  assert.equal(evidence.status, 'clear', `${aspect} should have clear position evidence`);
  assert.equal(top[0].assignedByAspect[aspect], evidence.bestPosition);
}

sandbox.currentLang = 'uk';
top = positionTypes(tmpTest, calcFromTotals(tmpTest, strongTmpTotals));
assert.equal(top[0].display, 'Ми-Тп-Мб-Вч');
assert.equal(top[0].defined, true);
assertApproximately(top[0].raw, 0.6875, 'Strong Temporistics centered contrast');

// Neutral and uniformly high response styles remain undefined even at high absolute score.
top = positionTypes(psyTest, calcFromTotals(psyTest, uniformTotals(psyTest, 9)));
assertApproximately(top[0].raw, 0, 'All-neutral centered profile score');
assertApproximately(top[0].typeGap, 0, 'All-neutral type gap');
assert.equal(top[0].defined, false);
for (const evidence of Object.values(top[0].evidence)) {
  assert.equal(evidence.status, 'flat');
  assert.deepEqual(Array.from(evidence.candidatePositions), [1, 2, 3, 4]);
}

top = positionTypes(psyTest, calcFromTotals(psyTest, uniformTotals(psyTest, 15)));
assertApproximately(top[0].raw, 0, 'All-high response style should have zero centered contrast');
assert.equal(top[0].defined, false, 'Acquiescent all-high response pattern must not define a type');
assert.ok(Object.values(top[0].evidence).every(evidence => evidence.status === 'flat'));

// A flat fourth aspect cannot be inferred solely by eliminating the other positions.
const flatOneTotals = {
  'Воля': [3, 15, 3, 3],
  'Логика': [15, 3, 3, 3],
  'Эмоция': [3, 3, 15, 3],
  'Физика': [9, 9, 9, 9]
};
top = positionTypes(psyTest, calcFromTotals(psyTest, flatOneTotals));
assert.ok(top[0].typeGap >= 0.05, 'Other clear aspects should leave a sizeable global gap');
assert.equal(top[0].evidence['Физика'].status, 'flat');
assert.equal(top[0].defined, false);

// A large spread does not rescue two locally close leading positions.
const closeTotals = {
  'Воля': [3, 15, 3, 3],
  'Логика': [15, 3, 3, 3],
  'Эмоция': [3, 3, 15, 3],
  'Физика': [3, 11, 3, 12]
};
top = positionTypes(psyTest, calcFromTotals(psyTest, closeTotals));
const closeEvidence = top[0].evidence['Физика'];
assert.equal(closeEvidence.status, 'close');
assert.ok(closeEvidence.spread >= 0.25);
assert.ok(closeEvidence.topGap < 0.25);
assert.deepEqual(new Set(closeEvidence.candidatePositions), new Set([2, 4]));
assert.ok(top[0].typeGap >= 0.05, 'Global separation should not mask local ambiguity');
assert.equal(top[0].defined, false);

// Duplicate local winners force an assignment and therefore must remain undefined.
const conflictTotals = {
  'Воля': [15, 12, 3, 3],
  'Логика': [15, 3, 3, 3],
  'Эмоция': [3, 3, 15, 3],
  'Физика': [3, 3, 3, 15]
};
top = positionTypes(psyTest, calcFromTotals(psyTest, conflictTotals));
assert.ok(Object.values(top[0].evidence).every(evidence => evidence.status === 'clear'));
assert.equal(top[0].evidence['Воля'].bestPosition, 1);
assert.equal(top[0].evidence['Логика'].bestPosition, 1);
assert.notEqual(
  top[0].assignedByAspect['Воля'],
  top[0].evidence['Воля'].bestPosition,
  'The winning permutation should expose its forced non-local assignment'
);
assert.equal(top[0].defined, false);

// Missing cell evidence is neutrally imputed, finite, and never classified.
const incompleteCalc = calcFromTotals(psyTest, strongPsyTotals);
delete incompleteCalc.scores['Физика|4'];
delete incompleteCalc.counts['Физика|4'];
top = positionTypes(psyTest, incompleteCalc);
const incompleteCell = top[0].evidence['Физика'].cells.find(cell => cell.position === 4);
assert.equal(Number.isFinite(top[0].raw), true);
assert.equal(incompleteCell.mean, 3);
assertApproximately(incompleteCell.contrastToAspectMean, 0.3125, 'Missing-cell contrast after neutral imputation');
assert.equal(top[0].evidence['Физика'].status, 'incomplete');
assert.equal(top[0].defined, false);

// Normalized results are invariant to a valid bank containing twice as many equivalent indicators.
const psyTestSix = syntheticPositionTest(TESTS.psychosophy, 6);
const strongPsyTotalsSix = Object.fromEntries(
  Object.entries(strongPsyTotals).map(([aspect, totals]) => [aspect, totals.map(total => total * 2)])
);
const topThreeItems = positionTypes(psyTest, calcFromTotals(psyTest, strongPsyTotals));
const topSixItems = positionTypes(psyTestSix, calcFromTotals(psyTestSix, strongPsyTotalsSix, 6));
assert.equal(topSixItems[0].display, topThreeItems[0].display);
assertApproximately(topSixItems[0].raw, topThreeItems[0].raw, 'Indicator-count invariant score');
assert.equal(topSixItems[0].defined, true);

// Exactly one mean Likert point of local separation is clear, not close.
const boundaryTotals = {
  'Воля': [3, 15, 3, 3],
  'Логика': [15, 3, 3, 3],
  'Эмоция': [3, 3, 15, 3],
  'Физика': [3, 9, 3, 12]
};
top = positionTypes(psyTest, calcFromTotals(psyTest, boundaryTotals));
const boundaryEvidence = top[0].evidence['Физика'];
assertApproximately(boundaryEvidence.topGap, 0.25, 'Boundary local gap');
assert.equal(boundaryEvidence.status, 'clear');
assert.deepEqual(Array.from(boundaryEvidence.candidatePositions), [4]);
assert.equal(top[0].defined, true);

// Shuffle is deterministic, seed-sensitive beyond seed length, and non-mutating.
const sourceOrder = Array.from({ length: 24 }, (_, index) => index);
const sourceSnapshot = [...sourceOrder];
const shuffledA = Array.from(shuffle(sourceOrder, 'aaaaaaaa'));
const shuffledARepeat = Array.from(shuffle(sourceOrder, 'aaaaaaaa'));
const shuffledB = Array.from(shuffle(sourceOrder, 'bbbbbbbb'));
assert.deepEqual(shuffledA, shuffledARepeat);
assert.notDeepEqual(shuffledA, shuffledB, 'Same-length seeds should not collapse to the same order');
assert.deepEqual(sourceOrder, sourceSnapshot);

// Every output path honors abstention even when the numerical top candidate has a positive gap.
const falseTop = [
  { raw: 0.9, display: 'ЛВЭФ', en: 'LVEF', defined: false, signal: 0 },
  { raw: 0.7, display: 'ЛВФЭ', en: 'LVFE', defined: false, signal: 0 }
];
assert.equal(profileDefined(falseTop), false);
assert.doesNotMatch(publicMainHypothesis([{ label: 'Psy', top: falseTop }]), /ЛВЭФ|LVEF/);
assert.doesNotMatch(publicAlternatives([{ label: 'Psy', top: falseTop }]), /ЛВЭФ|LVEF/);
assert.doesNotMatch(resultLinks(falseTop), /temporistics-type-/);
assert.equal(await musicRecommendation(falseTop, 'psychosophy'), '');

// Bank validation accepts complete multi-indicator models and rejects underspecified variants.
assert.equal(validPositionTest(psyTest), true);
assert.equal(validPositionTest(tmpTest), true);
const underspecifiedPsy = syntheticPositionTest(TESTS.psychosophy, 2);
assert.equal(validPositionTest(underspecifiedPsy), false);
assert.equal(validPositionTest({ ...psyTest, measurementModel: 'legacy-position-v1' }), false);
const minOverrideBypass = { ...syntheticPositionTest(TESTS.psychosophy, 1), minCellItems: 1 };
assert.equal(validPositionTest(minOverrideBypass), false, 'Remote bank cannot lower the three-indicator floor');
assert.equal(validPositionTest({ ...psyTest, code: null }), false, 'Position bank must define aspect codes');
assert.equal(
  validPositionTest({ ...psyTest, aspects: ['Воля', 'Воля', 'Эмоция', 'Физика'] }),
  false,
  'Position aspects must be unique'
);
const duplicateIdPsy = {
  ...psyTest,
  items: psyTest.items.map((item, index) => (
    index === 1 ? { ...item, id: psyTest.items[0].id } : item
  ))
};
assert.equal(validPositionTest(duplicateIdPsy), false);
const duplicateIndicatorPsy = {
  ...psyTest,
  items: psyTest.items.map(item => (
    item.scale === `${psyTest.aspects[0]}|1` ? { ...item, indicator: 1 } : item
  ))
};
assert.equal(validPositionTest(duplicateIndicatorPsy), false);

const validBank = {
  schemaVersion: '1.0.0',
  tests: {
    socionics: TESTS.socionics,
    psychosophy: psyTest,
    temporistics: tmpTest
  }
};
assert.equal(isQuestionBank(validBank), true);
assert.equal(
  isQuestionBank({
    ...validBank,
    tests: { ...validBank.tests, psychosophy: underspecifiedPsy }
  }),
  false
);
assert.equal(
  isQuestionBank({
    ...validBank,
    tests: { ...validBank.tests, psychosophy: { ...psyTest, mode: 'socionics' } }
  }),
  false,
  'Each named model must use its expected scoring mode'
);
const crossDuplicateTemporistics = {
  ...tmpTest,
  items: tmpTest.items.map((item, index) => index === 0 ? { ...item, id: psyTest.items[0].id } : item)
};
assert.equal(
  isQuestionBank({
    ...validBank,
    tests: { ...validBank.tests, temporistics: crossDuplicateTemporistics }
  }),
  false,
  'Item IDs must be globally unique across tests'
);
assert.equal(isQuestionBank({ ...validBank, schemaVersion: '0.9.0' }), false);

// The bundled bank itself must satisfy the deployed three-indicator contract.
for (const key of ['psychosophy', 'temporistics']) {
  const test = TESTS[key];
  const items = test.items.filter(item => !item.attention);
  assert.equal(items.length, 48, `${key} should contain 48 scored items`);
  assert.equal(new Set(items.map(item => item.id)).size, 48, `${key} item IDs should be unique`);
  for (const aspect of test.aspects) {
    for (const position of [1, 2, 3, 4]) {
      assert.equal(
        items.filter(item => item.scale === `${aspect}|${position}`).length,
        3,
        `${key} ${aspect}|${position} should contain exactly three indicators`
      );
    }
  }
  assert.equal(validPositionTest(test), true, `${key} bundled model should pass validation`);
}

// Context must be held constant across positions so position is not replaced by scenario wording.
for (const aspect of TESTS.psychosophy.aspects) {
  for (const indicator of [1, 2, 3]) {
    const quartet = TESTS.psychosophy.items.filter(item => !item.attention && item.aspect === aspect && item.indicator === indicator);
    assert.equal(quartet.length, 4, `${aspect} indicator ${indicator} should form a four-position quartet`);
    assert.deepEqual(Array.from(quartet, item => item.position).sort(), [1, 2, 3, 4]);
    assert.equal(new Set(quartet.map(item => item.context)).size, 1, `${aspect} indicator ${indicator} should use one matched context`);
    assert.equal(new Set(quartet.map(item => item.facet)).size, 1, `${aspect} indicator ${indicator} should use one matched facet`);
  }
}
for (const aspect of TESTS.temporistics.aspects) {
  for (const indicator of [1, 2, 3]) {
    const quartet = TESTS.temporistics.items.filter(item => !item.attention && item.aspect === aspect && item.indicator === indicator);
    assert.equal(quartet.length, 4, `${aspect} indicator ${indicator} should form a four-position quartet`);
    assert.equal(new Set(quartet.map(item => item.context)).size, 1, `${aspect} indicator ${indicator} should use one matched context`);
  }
}

console.log('Position scoring regression tests passed cleanly!');
