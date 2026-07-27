import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const testsJsPath = path.resolve('assets/tests.js');
const testsJsCode = fs.readFileSync(testsJsPath, 'utf8');

class MockObserver {
  observe() {}
  disconnect() {}
}

const storage = {};
const sandbox = {
  console: { log() {}, warn() {}, error: console.error },
  window: {},
  crypto: { randomUUID: () => 'psychometric-safety-seed' },
  Intl,
  innerWidth: 1280,
  innerHeight: 800,
  localStorage: {
    getItem: key => storage[key] || null,
    setItem: (key, value) => { storage[key] = String(value); },
    removeItem: key => { delete storage[key]; }
  },
  document: {
    documentElement: { lang: 'uk' },
    body: { dataset: {} },
    querySelector: () => null,
    querySelectorAll: () => []
  },
  MutationObserver: MockObserver,
  fetch: async () => ({ ok: false, status: 404 })
};

vm.createContext(sandbox);
vm.runInContext(
  `${testsJsCode}
    ;globalThis.TESTS_REF = TESTS;
    globalThis.socionicsRef = socionics;
    globalThis.positionTypesRef = positionTypes;
    globalThis.profileDefinedRef = profileDefined;
    globalThis.modelResultRef = modelResult;
    globalThis.withholdTopRef = withholdTop;
    globalThis.qualityFlagsForResponsesRef = qualityFlagsForResponses;
    globalThis.publicMainHypothesisRef = publicMainHypothesis;
    globalThis.publicItemsRef = publicItems;
    globalThis.buildPayloadRef = buildPayload;
    globalThis.scorePublicRouteV2Ref = scorePublicRouteV2;
    globalThis.setScoringClockRef = (start, testKey) => {
      startedAt = start;
      activeTest = testKey;
    };
    globalThis.setPublicOrderSeedRef = seed => {
      publicOrderSeed = seed;
    };
    globalThis.minimumCompletionTimeMsRef =
      typeof minimumCompletionTimeMs === 'function' ? minimumCompletionTimeMs : null;
    globalThis.isCompletionTooFastRef =
      typeof isCompletionTooFast === 'function' ? isCompletionTooFast : null;
  `,
  sandbox,
  { filename: testsJsPath }
);

const {
  TESTS_REF: TESTS,
  socionicsRef: socionics,
  positionTypesRef: positionTypes,
  profileDefinedRef: profileDefined,
  modelResultRef: modelResult,
  withholdTopRef: withholdTop,
  qualityFlagsForResponsesRef: qualityFlagsForResponses,
  publicMainHypothesisRef: publicMainHypothesis,
  publicItemsRef: publicItems,
  buildPayloadRef: buildPayload,
  scorePublicRouteV2Ref: scorePublicRouteV2,
  setScoringClockRef: setScoringClock,
  setPublicOrderSeedRef: setPublicOrderSeed,
  minimumCompletionTimeMsRef: minimumCompletionTimeMs,
  isCompletionTooFastRef: isCompletionTooFast
} = sandbox;

function calcFromCellTotals(testDefinition, totalsByAspect, count = 3) {
  const scores = {};
  const counts = {};
  for (const aspect of testDefinition.aspects) {
    const totals = totalsByAspect[aspect];
    assert.equal(totals?.length, 4, `${aspect} fixture must contain four cell totals`);
    for (let position = 1; position <= 4; position += 1) {
      const key = `${aspect}|${position}`;
      scores[key] = totals[position - 1];
      counts[key] = count;
    }
  }
  return { scores, counts, responses: [] };
}

function neutralPositionCalc(testDefinition) {
  return calcFromCellTotals(
    testDefinition,
    Object.fromEntries(testDefinition.aspects.map(aspect => [aspect, [9, 9, 9, 9]]))
  );
}

test('Socionics stays explicitly exploratory until a calibration release', () => {
  const strongProfile = {
    scores: { Ti: 10, Ne: 8, Fi: 5, Se: 2, Te: 6, Fe: 3, Si: 6, Ni: 6 },
    counts: { Ti: 2, Ne: 2, Fi: 2, Se: 2, Te: 2, Fe: 2, Si: 2, Ni: 2 }
  };

  const top = socionics(strongProfile);
  assert.equal(top.length, 3);
  assert.ok(
    top.every(candidate => candidate.defined === false),
    'An uncalibrated 16-item Socionics screener must never mark a candidate as defined'
  );
  assert.ok(
    top.every(candidate => candidate.calibrationStatus === 'exploratory'),
    'Every diagnostic candidate must carry an explicit exploratory calibration status'
  );
  assert.equal(profileDefined(top), false);

  const exported = modelResult(TESTS.socionics, top);
  assert.equal(exported.defined, false);
  assert.equal(exported.calibrationStatus, 'exploratory');

  const publicText = publicMainHypothesis([
    { key: 'socionics', label: 'Information', top }
  ]);
  for (const candidate of top) {
    assert.doesNotMatch(
      publicText,
      new RegExp(`\\b${candidate.code}\\b`),
      'Public copy must not turn exploratory ranking into a type claim'
    );
  }
});

test('undefined position results do not export ordinary type candidates', () => {
  const testDefinition = TESTS.psychosophy;
  const top = positionTypes(testDefinition, neutralPositionCalc(testDefinition));
  assert.equal(top[0].defined, false);

  const exported = modelResult(testDefinition, top);
  assert.equal(exported.defined, false);
  assert.deepEqual(
    Array.from(exported.candidates || []),
    [],
    'Downstream consumers must not receive arbitrary top types after abstention'
  );
  assert.ok(exported.evidence, 'Cell-level diagnostic evidence should remain available');
  for (const aspectEvidence of Object.values(exported.evidence)) {
    assert.ok(
      Object.hasOwn(aspectEvidence, 'bestPosition'),
      'Ordinary ambiguity should retain its diagnostic local winner'
    );
    assert.ok(
      Object.hasOwn(aspectEvidence, 'candidatePositions'),
      'Ordinary ambiguity should retain candidate positions for interpretation'
    );
  }
});

test('defined position results may export candidates', () => {
  const testDefinition = TESTS.psychosophy;
  const totals = {
    'Воля': [3, 15, 3, 3],
    'Логика': [15, 3, 3, 3],
    'Эмоция': [3, 3, 15, 3],
    'Физика': [3, 9, 3, 12]
  };
  const top = positionTypes(testDefinition, calcFromCellTotals(testDefinition, totals));
  assert.equal(top[0].defined, true);

  const exported = modelResult(testDefinition, top);
  assert.equal(exported.defined, true);
  assert.equal(exported.candidates.length, 3);
});

test('hard quality withholding does not leak an otherwise defined position type', () => {
  const testDefinition = TESTS.psychosophy;
  const totals = {
    'Воля': [3, 15, 3, 3],
    'Логика': [15, 3, 3, 3],
    'Эмоция': [3, 3, 15, 3],
    'Физика': [3, 9, 3, 12]
  };
  const definedTop = positionTypes(
    testDefinition,
    calcFromCellTotals(testDefinition, totals)
  );
  assert.equal(definedTop[0].defined, true);

  const variedResponses = Array.from({ length: 48 }, (_, index) => ({
    itemId: `quality_${index + 1}`,
    testKey: 'psychosophy',
    attentionExpected: null,
    responseValue: index % 5 + 1,
    responseTimeMs: 5000,
    promptWordCount: 20,
    changedAnswer: false,
    notApplicable: false
  }));
  const safeDuration = minimumCompletionTimeMs(variedResponses.length);
  const cases = [
    {
      label: 'failed-attention',
      responses: variedResponses,
      duration: safeDuration,
      options: { attentionPresented: true, failedAttention: true },
      reason: 'failed-attention-check'
    },
    {
      label: 'tooFast',
      responses: variedResponses,
      duration: safeDuration - 1,
      options: {},
      reason: 'response-quality'
    },
    {
      label: 'pause-masked-tooFast',
      responses: variedResponses.map(response => ({ ...response, responseTimeMs: 100 })),
      duration: safeDuration * 10,
      options: {},
      reason: 'response-quality'
    },
    {
      label: 'straightline',
      responses: variedResponses.map(response => ({ ...response, responseValue: 4 })),
      duration: safeDuration,
      options: {},
      reason: 'response-quality'
    }
  ];

  for (const qualityCase of cases) {
    const flags = qualityFlagsForResponses(
      qualityCase.responses,
      qualityCase.duration,
      qualityCase.options
    );
    assert.equal(
      flags.responseQuality,
      'low',
      `${qualityCase.label} must trigger hard withholding`
    );

    const withheldTop = withholdTop(definedTop, qualityCase.reason);
    const exported = modelResult(testDefinition, withheldTop);

    assert.equal(exported.defined, false, `${qualityCase.label} must force abstention`);
    assert.equal(exported.withheldReason, qualityCase.reason);
    assert.deepEqual(
      Array.from(exported.candidates || []),
      [],
      `${qualityCase.label} must not export ordinary type candidates`
    );

    for (const [aspect, aspectEvidence] of Object.entries(exported.evidence || {})) {
      assert.equal(
        Object.hasOwn(aspectEvidence, 'bestPosition'),
        false,
        `${qualityCase.label} leaked ${aspect}.bestPosition`
      );
      assert.equal(
        Object.hasOwn(aspectEvidence, 'candidatePositions'),
        false,
        `${qualityCase.label} leaked ${aspect}.candidatePositions`
      );
    }
  }
});

test('position signal is based on local evidence, not the redundant global type gap', () => {
  const testDefinition = TESTS.psychosophy;
  const totals = {
    'Воля': [3, 15, 3, 3],
    'Логика': [15, 3, 3, 3],
    'Эмоция': [3, 3, 15, 3],
    'Физика': [3, 9, 3, 12]
  };
  const top = positionTypes(testDefinition, calcFromCellTotals(testDefinition, totals));
  const minLocalGap = Math.min(
    ...Object.values(top[0].evidence).map(aspectEvidence => aspectEvidence.topGap)
  );
  const expectedSignal = Math.min(1, minLocalGap / 0.4);

  assert.equal(top[0].defined, true);
  assert.ok(Math.abs(top[0].signal - expectedSignal) < 1e-12);

  const compactSource = positionTypes.toString().replace(/\s+/g, ' ');
  const signalExpression = compactSource.match(/\bsignal\s*=\s*([^;]+)/);
  assert.ok(signalExpression, 'positionTypes must expose an auditable signal expression');
  assert.doesNotMatch(
    signalExpression[1],
    /\btypeGap\b/,
    'Global assignment gap is implied by the local gates and must not be counted twice'
  );
});

test('completion-time screening scales with the number of content items', async () => {
  assert.equal(
    typeof minimumCompletionTimeMs,
    'function',
    'Provide minimumCompletionTimeMs(contentItemCount) as an auditable threshold contract'
  );
  assert.equal(
    typeof isCompletionTooFast,
    'function',
    'Provide isCompletionTooFast(durationMs, contentItemCount) for all routes'
  );

  const itemCounts = [16, 48, 112];
  const thresholds = itemCounts.map(count => minimumCompletionTimeMs(count));
  thresholds.forEach((threshold, index) => {
    assert.ok(Number.isFinite(threshold) && threshold > 0);
    assert.equal(isCompletionTooFast(thresholds[index] - 1, itemCounts[index]), true);
    assert.equal(isCompletionTooFast(thresholds[index], itemCounts[index]), false);
  });
  assert.ok(thresholds[0] < thresholds[1]);
  assert.ok(thresholds[1] < thresholds[2]);

  const durationBetweenShortAndLongThresholds = Math.floor(
    (thresholds[0] + thresholds[2]) / 2
  );
  assert.equal(isCompletionTooFast(durationBetweenShortAndLongThresholds, 16), false);
  assert.equal(isCompletionTooFast(durationBetweenShortAndLongThresholds, 112), true);

  assert.doesNotMatch(buildPayload.toString(), /<\s*45000\b/);
  assert.doesNotMatch(scorePublicRouteV2.toString(), /<\s*45000\b/);
  assert.match(
    buildPayload.toString(),
    /isCompletionTooFast|qualityFlagsForResponses/,
    'Research scoring must use the count-aware timing contract, directly or through qualityFlagsForResponses'
  );
  assert.match(
    scorePublicRouteV2.toString(),
    /isCompletionTooFast|qualityFlagsForResponses/,
    'Public scoring must use the count-aware timing contract, directly or through qualityFlagsForResponses'
  );

  const start = 1_700_000_000_000;
  const scoredResponses = Array.from({ length: 16 }, (_, index) => ({
    itemId: `content_${index + 1}`,
    responseValue: 3,
    attentionExpected: null
  }));
  const attentionResponse = {
    itemId: 'attention',
    responseValue: 2,
    attentionExpected: 2
  };
  const calc = {
    scores: {},
    counts: {},
    responses: [...scoredResponses, attentionResponse],
    attentionPresented: true,
    failedAttention: false
  };

  setScoringClock(start, 'socionics');
  const atContentThreshold = await buildPayload(
    calc,
    [],
    '',
    [],
    start + minimumCompletionTimeMs(16)
  );
  assert.equal(
    atContentThreshold.qualityFlags.tooFast,
    false,
    'The attention check must not inflate the number of timed content items'
  );

  setScoringClock(start, 'socionics');
  const belowContentThreshold = await buildPayload(
    calc,
    [],
    '',
    [],
    start + minimumCompletionTimeMs(16) - 1
  );
  assert.equal(belowContentThreshold.qualityFlags.tooFast, true);
});

test('public order uses three seeded blocks and separates repeated constructs', () => {
  const fullRoute = ['socionics', 'psychosophy', 'temporistics'];
  const seeds = [
    'psychometric-safety-seed',
    ...Array.from({ length: 24 }, (_, index) => `psychometric-order-${index + 1}`)
  ];

  for (const seed of seeds) {
    setPublicOrderSeed(seed);
    const first = publicItems(fullRoute);
    const repeat = publicItems(fullRoute);
    assert.deepEqual(
      Array.from(first, item => item.id),
      Array.from(repeat, item => item.id),
      `Seeded public order must be reproducible for ${seed}`
    );
    assert.equal(first.filter(item => !item.attention).length, 112);
    assert.equal(
      first.filter(item => item.attention).length,
      3,
      'The full public route should contain one explicitly recorded attention check per block'
    );
    assert.equal(new Set(first.map(item => item.id)).size, first.length);

    const blockKeys = first
      .map(item => item.testKey)
      .filter((key, index, keys) => index === 0 || key !== keys[index - 1]);
    assert.equal(
      blockKeys.length,
      3,
      `The public route must contain exactly three intact blocks for ${seed}`
    );
    assert.deepEqual(
      new Set(blockKeys),
      new Set(['socionics', 'psychosophy', 'temporistics'])
    );

    for (let index = 1; index < first.length; index += 1) {
      const previous = first[index - 1];
      const current = first[index];
      if (previous.testKey !== current.testKey) continue;

      if (current.testKey === 'socionics') {
        assert.notEqual(
          previous.scale,
          current.scale,
          `Adjacent Socionics pair for ${seed} at ${index}: ${previous.id}/${current.id}`
        );
        continue;
      }

      assert.notEqual(
        previous.aspect,
        current.aspect,
        `Repeated aspect for ${seed} at ${index}: ${previous.id}/${current.id}`
      );
      assert.notEqual(
        previous.context,
        current.context,
        `Repeated context for ${seed} at ${index}: ${previous.id}/${current.id}`
      );
    }

    const matchedPositions = new Map();
    first.forEach((item, index) => {
      if (!item.tetradId) return;
      const positions = matchedPositions.get(item.tetradId) || [];
      positions.push(index);
      matchedPositions.set(item.tetradId, positions);
    });
    for (const [tetradId, positions] of matchedPositions) {
      for (let index = 1; index < positions.length; index += 1) {
        assert.ok(
          positions[index] - positions[index - 1] >= 10,
          `${tetradId} members are too close for ${seed}: ${positions[index - 1]}/${positions[index]}`
        );
      }
    }
  }
});
