import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  buildRouteItems,
  createResearchBooklet,
  itemFastThresholdMs,
  minimumCompletionTimeMs,
  qualityFlagsForResponses,
  RESEARCH_BOOKLET_CONFIG,
  routeCoverage,
  scoreModule,
  seedNumber
} from '../assets/test/scoring.js';

const bankPath = new URL('../assets/instruments/before-we-build-bank-2026-07-28.1.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const matrixDesign = JSON.parse(fs.readFileSync(
  new URL('../docs/research-support/matrix-sampling-design.json', import.meta.url),
  'utf8'
));
const moduleKeys = ['socionics', 'psychosophy', 'temporistics'];

function contentResponses(count = 16, overrides = {}) {
  return Array.from({ length: count }, (_, index) => ({
    itemId: `content_${index + 1}`,
    testKey: overrides.testKey || 'socionics',
    attentionExpected: null,
    responseValue: index % 5 + 1,
    responseTimeMs: 5000,
    promptWordCount: 20,
    changedAnswer: false,
    notApplicable: false,
    ...overrides,
    itemId: `content_${index + 1}`
  }));
}

function attentionResponse(responseValue = 2, testKey = 'socionics') {
  return {
    itemId: `${testKey}_attention`,
    testKey,
    attentionExpected: 2,
    responseValue,
    responseTimeMs: 1000,
    promptWordCount: 5,
    changedAnswer: false,
    notApplicable: false
  };
}

test('every deployed module contains exactly one operational attention check', () => {
  for (const key of moduleKeys) {
    const module = bank.tests[key];
    const attention = module.items.filter(item => item.attention !== undefined);
    assert.equal(attention.length, 1, `${key} must contain one attention item`);
    assert.equal(attention[0].attention, 2);

    const ordinaryResponses = module.items
      .filter(item => item.attention === undefined)
      .map(item => ({ itemId: item.id, responseValue: 3, notApplicable: false }));

    const correct = scoreModule(module, [
      ...ordinaryResponses,
      { itemId: attention[0].id, responseValue: attention[0].attention, notApplicable: false }
    ]);
    assert.equal(correct.attentionCheckPresented, true);
    assert.equal(correct.failedAttentionCheck, false);

    const incorrect = scoreModule(module, [
      ...ordinaryResponses,
      { itemId: attention[0].id, responseValue: 5, notApplicable: false }
    ]);
    assert.equal(incorrect.attentionCheckPresented, true);
    assert.equal(incorrect.failedAttentionCheck, true);

    const omitted = scoreModule(module, ordinaryResponses);
    assert.equal(omitted.attentionCheckPresented, false);
    assert.equal(omitted.failedAttentionCheck, false);
  }
});

test('quality flags distinguish omitted, passed, and failed attention checks', () => {
  const content = contentResponses();
  const safeActiveTime = minimumCompletionTimeMs(content.length);

  const omitted = qualityFlagsForResponses(content, safeActiveTime);
  assert.equal(omitted.attentionCheckPresented, false);
  assert.equal(omitted.failedAttentionCheck, false);
  assert.equal(omitted.responseQuality, 'adequate');

  const passed = qualityFlagsForResponses(
    [...content, attentionResponse(2)],
    safeActiveTime
  );
  assert.equal(passed.attentionCheckPresented, true);
  assert.equal(passed.failedAttentionCheck, false);
  assert.equal(passed.responseQuality, 'adequate');

  const failed = qualityFlagsForResponses(
    [...content, attentionResponse(4)],
    safeActiveTime
  );
  assert.equal(failed.attentionCheckPresented, true);
  assert.equal(failed.failedAttentionCheck, true);
  assert.equal(failed.responseQuality, 'low');
});

test('completion-time screening scales with content count and excludes attention items', () => {
  const thresholds = [16, 48, 112].map(minimumCompletionTimeMs);
  assert.deepEqual(thresholds, [30000, 86400, 201600]);
  assert.ok(thresholds[0] < thresholds[1]);
  assert.ok(thresholds[1] < thresholds[2]);

  const content = contentResponses(16);
  const withAttention = [...content, attentionResponse()];
  const atThreshold = qualityFlagsForResponses(
    withAttention,
    minimumCompletionTimeMs(content.length)
  );
  const belowThreshold = qualityFlagsForResponses(
    withAttention,
    minimumCompletionTimeMs(content.length) - 1
  );

  assert.equal(atThreshold.minimumActiveDurationMs, 30000);
  assert.equal(atThreshold.tooFast, false);
  assert.equal(belowThreshold.tooFast, true);
  assert.equal(belowThreshold.responseQuality, 'low');
});

test('quality timing uses active duration rather than wall-clock pauses', () => {
  const content = contentResponses(48);
  const threshold = minimumCompletionTimeMs(content.length);

  const enoughActiveWork = qualityFlagsForResponses(content, threshold);
  const pauseMaskedFastWork = qualityFlagsForResponses(content, threshold - 1);

  assert.equal(enoughActiveWork.activeDurationMs, threshold);
  assert.equal(enoughActiveWork.tooFast, false);
  assert.equal(pauseMaskedFastWork.tooFast, true);
  assert.equal(pauseMaskedFastWork.responseQuality, 'low');
});

test('straightlining is a hard flag while fast-item and N/A overuse require review', () => {
  const safeActiveTime = minimumCompletionTimeMs(16);

  const straightlined = qualityFlagsForResponses(
    contentResponses(16, { responseValue: 4 }),
    safeActiveTime
  );
  assert.equal(straightlined.straightlining, true);
  assert.deepEqual(straightlined.straightlinedBlocks, ['socionics']);
  assert.equal(straightlined.responseQuality, 'low');

  const fastItems = qualityFlagsForResponses(
    contentResponses(16, { responseTimeMs: 100 }),
    safeActiveTime
  );
  assert.equal(fastItems.fastItems, true);
  assert.equal(fastItems.responseQuality, 'review');

  const manyNotApplicable = contentResponses().map((response, index) => (
    index < 4
      ? { ...response, responseValue: null, notApplicable: true }
      : response
  ));
  const notApplicable = qualityFlagsForResponses(manyNotApplicable, safeActiveTime);
  assert.equal(notApplicable.notApplicableRate, 0.25);
  assert.equal(notApplicable.notApplicableOveruse, true);
  assert.equal(notApplicable.responseQuality, 'review');
});

test('coverage treats N/A as answered but not scorable', () => {
  const responses = [
    {
      itemId: 'answered',
      attentionExpected: null,
      responseValue: 4,
      notApplicable: false
    },
    {
      itemId: 'not-applicable',
      attentionExpected: null,
      responseValue: null,
      notApplicable: true
    },
    {
      itemId: 'missing',
      attentionExpected: null,
      responseValue: null,
      notApplicable: false
    },
    attentionResponse()
  ];

  assert.deepEqual(routeCoverage(responses), {
    contentItemCount: 3,
    answeredItemCount: 2,
    scorableItemCount: 1,
    notApplicableItemCount: 1,
    proportionAnswered: 0.667
  });
});

test('the full public route is deterministic and presents one attention check per block', () => {
  const seeds = Array.from({ length: 12 }, (_, index) => `route-safety-${index + 1}`);

  for (const seed of seeds) {
    const first = buildRouteItems(bank, moduleKeys, seed);
    const repeat = buildRouteItems(bank, moduleKeys, seed);
    assert.deepEqual(first.blockOrder, repeat.blockOrder);
    assert.deepEqual(
      first.items.map(item => item.id),
      repeat.items.map(item => item.id)
    );
    assert.deepEqual(new Set(first.blockOrder), new Set(moduleKeys));
    assert.equal(first.items.length, 115);
    assert.equal(first.items.filter(item => item.attention !== undefined).length, 3);
    assert.equal(new Set(first.items.map(item => item.id)).size, 115);

    const observedBlocks = first.items
      .map(item => item.testKey)
      .filter((key, index, keys) => index === 0 || key !== keys[index - 1]);
    assert.deepEqual(observedBlocks, first.blockOrder);

    for (const key of moduleKeys) {
      const block = first.items.filter(item => item.testKey === key);
      assert.equal(block.filter(item => item.attention !== undefined).length, 1);
      assert.equal(
        block.filter(item => item.attention === undefined).length,
        bank.tests[key].items.length - 1
      );
    }
  }
});

test('constrained route order separates repeated constructs and matched contexts', () => {
  const { items } = buildRouteItems(bank, moduleKeys, 'construct-spacing');

  for (let index = 1; index < items.length; index += 1) {
    const previous = items[index - 1];
    const current = items[index];
    if (
      previous.testKey !== current.testKey
      || previous.attention !== undefined
      || current.attention !== undefined
    ) {
      continue;
    }
    const previousConstruct = previous.aspect || previous.scale;
    const currentConstruct = current.aspect || current.scale;
    assert.notEqual(
      previousConstruct,
      currentConstruct,
      `${previous.id} and ${current.id} repeat a construct`
    );
  }

  const positionsByTetrad = new Map();
  items.forEach((item, index) => {
    if (!item.tetradId) return;
    const positions = positionsByTetrad.get(item.tetradId) || [];
    positions.push(index);
    positionsByTetrad.set(item.tetradId, positions);
  });
  for (const [tetradId, positions] of positionsByTetrad) {
    for (let index = 1; index < positions.length; index += 1) {
      assert.ok(
        positions[index] - positions[index - 1] >= 10,
        `${tetradId} members are only ${positions[index] - positions[index - 1]} steps apart`
      );
    }
  }
});

test('research booklet sampling is balanced, seeded, and attention-aware', () => {
  const positionBooklet = createResearchBooklet(
    bank.tests.psychosophy,
    'position-booklet',
    16
  );
  const repeated = createResearchBooklet(
    bank.tests.psychosophy,
    'position-booklet',
    16
  );

  assert.deepEqual(
    positionBooklet.items.map(item => item.id),
    repeated.items.map(item => item.id)
  );
  assert.equal(positionBooklet.plannedMissing, true);
  assert.equal(positionBooklet.designStatus, 'design_pending_g0');
  assert.equal(positionBooklet.contentItemCount, 16);
  assert.equal(positionBooklet.presentedItemCount, 17);
  assert.equal(positionBooklet.plannedMissingItemIds.length, 32);
  assert.equal(positionBooklet.items.filter(item => item.attention !== undefined).length, 1);
  for (const aspect of bank.tests.psychosophy.aspects) {
    assert.equal(positionBooklet.items.filter(item => item.aspect === aspect).length, 4);
    for (const position of [1, 2, 3, 4]) {
      assert.equal(
        positionBooklet.items.filter(item =>
          item.aspect === aspect && item.position === position
        ).length,
        1
      );
    }
  }

  const socionicsBooklet = createResearchBooklet(
    bank.tests.socionics,
    'socionics-booklet',
    8
  );
  assert.equal(socionicsBooklet.contentItemCount, 8);
  assert.equal(socionicsBooklet.presentedItemCount, 9);
  for (const dimension of bank.tests.socionics.dims) {
    assert.equal(socionicsBooklet.items.filter(item => item.scale === dimension).length, 1);
  }
});

test('runtime matrix sampling configuration matches the pending-G0 design record', () => {
  assert.deepEqual(matrixDesign.runtimeImplementation, {
    configSource: 'assets/test/scoring.js#RESEARCH_BOOKLET_CONFIG',
    designVersion: RESEARCH_BOOKLET_CONFIG.designVersion,
    designStatus: RESEARCH_BOOKLET_CONFIG.designStatus,
    variantCount: RESEARCH_BOOKLET_CONFIG.variantCount,
    targetContentItems: RESEARCH_BOOKLET_CONFIG.targetContentItems,
    assignmentMethod: 'seeded_stable_variant',
    exposureMethod: 'construct_balanced_rotating_windows',
    positionBalancingMethod: 'cross_variant_segment_history_with_constraint_preserving_swaps',
    positionBalanceAcceptance: 'Every eligible item appears in early, middle and late segments; rotating items differ by at most one exposure and fixed anchors stay within one administration of the ideal per-segment count across 12 variants',
    activationCondition: 'Freeze non-empty anchors and expanded eligible pools after G0 before field collection'
  });
  assert.equal(matrixDesign.anchorBlock.selectionStatus, 'pending_g0');
  assert.deepEqual(
    Object.values(RESEARCH_BOOKLET_CONFIG.modules)
      .flatMap(module => module.anchorItemIds),
    []
  );
});

test('Research anchors are fixed, validated, and excluded from planned missingness', () => {
  const testDefinition = bank.tests.psychosophy;
  const anchorItemIds = testDefinition.items
    .filter(item => item.attention === undefined)
    .slice(0, 2)
    .map(item => item.id);
  const booklet = createResearchBooklet(
    testDefinition,
    'anchored-booklet',
    16,
    { anchorItemIds }
  );

  assert.deepEqual(booklet.anchorItemIds, anchorItemIds);
  assert.ok(anchorItemIds.every(itemId =>
    booklet.items.some(item => item.id === itemId)
  ));
  assert.ok(anchorItemIds.every(itemId =>
    !booklet.plannedMissingItemIds.includes(itemId)
  ));
  assert.throws(
    () => createResearchBooklet(
      testDefinition,
      'duplicate-anchor',
      16,
      { anchorItemIds: [anchorItemIds[0], anchorItemIds[0]] }
    ),
    /must be unique/
  );
  assert.throws(
    () => createResearchBooklet(
      testDefinition,
      'unknown-anchor',
      16,
      { anchorItemIds: ['unknown-item'] }
    ),
    /Unknown Research anchor/
  );
});

test('matrix variants rotate item exposure without losing construct balance', () => {
  const aspects = ['A', 'B', 'C', 'D'];
  const items = [];
  for (const aspect of aspects) {
    for (let indicator = 1; indicator <= 8; indicator += 1) {
      for (let position = 1; position <= 4; position += 1) {
        items.push({
          id: `${aspect}_${indicator}_${position}`,
          aspect,
          position,
          scale: `${aspect}|${position}`,
          indicator,
          tetradId: `${aspect}_${indicator}`
        });
      }
    }
  }
  items.push({ id: 'attention', scale: 'attention', attention: 2 });
  const expanded = {
    version: 'synthetic-position-v1',
    mode: 'position',
    aspects,
    items
  };
  const variantCount = 12;
  const variantSeeds = [];
  const exposure = new Map(items
    .filter(item => item.attention === undefined)
    .map(item => [item.id, 0]));
  const segmentExposure = new Map(items
    .filter(item => item.attention === undefined)
    .map(item => [item.id, [0, 0, 0]]));

  for (let variantIndex = 0; variantIndex < variantCount; variantIndex += 1) {
    let suffix = 0;
    let seed;
    do {
      seed = `matrix-variant-${variantIndex}-${suffix}`;
      suffix += 1;
    } while (seedNumber(seed) % variantCount !== variantIndex);
    variantSeeds.push(seed);

    const booklet = createResearchBooklet(
      expanded,
      seed,
      48,
      { variantCount }
    );
    assert.equal(booklet.variantIndex, variantIndex);
    assert.equal(booklet.contentItemCount, 48);
    assert.equal(booklet.plannedMissingItemIds.length, 80);
    for (const aspect of aspects) {
      for (const position of [1, 2, 3, 4]) {
        assert.equal(
          booklet.items.filter(item =>
            item.aspect === aspect && item.position === position
          ).length,
          3
        );
      }
    }

    const lastPositionByTetrad = new Map();
    let contentPosition = 0;
    booklet.items.forEach((item, index) => {
      if (item.attention !== undefined) return;
      exposure.set(item.id, exposure.get(item.id) + 1);
      const segment = Math.min(2, Math.floor(contentPosition * 3 / 48));
      segmentExposure.get(item.id)[segment] += 1;
      contentPosition += 1;
      if (lastPositionByTetrad.has(item.tetradId)) {
        assert.ok(
          index - lastPositionByTetrad.get(item.tetradId) >= 10,
          `${booklet.bookletId} places ${item.tetradId} too close`
        );
      }
      lastPositionByTetrad.set(item.tetradId, index);
    });
  }

  const frequencies = [...exposure.values()];
  assert.ok(frequencies.every(value => value > 0));
  assert.ok(Math.max(...frequencies) - Math.min(...frequencies) <= 1);
  for (const [itemId, segments] of segmentExposure) {
    assert.ok(
      segments.every(value => value > 0),
      `${itemId} never reaches every early/middle/late segment: ${segments}`
    );
    assert.ok(
      Math.max(...segments) - Math.min(...segments) <= 1,
      `${itemId} segment exposure is imbalanced: ${segments}`
    );
  }

  const anchorItemIds = items
    .filter(item => item.attention === undefined && item.indicator === 1)
    .map(item => item.id);
  const anchorSegmentExposure = new Map(
    anchorItemIds.map(itemId => [itemId, [0, 0, 0]])
  );
  for (const seed of variantSeeds) {
    const booklet = createResearchBooklet(
      expanded,
      seed,
      48,
      { variantCount, anchorItemIds }
    );
    assert.ok(anchorItemIds.every(itemId =>
      booklet.items.some(item => item.id === itemId)
    ));
    const lastPositionByTetrad = new Map();
    let contentPosition = 0;
    booklet.items.forEach((item, index) => {
      if (item.attention !== undefined) return;
      if (anchorSegmentExposure.has(item.id)) {
        const segment = Math.min(2, Math.floor(contentPosition * 3 / 48));
        anchorSegmentExposure.get(item.id)[segment] += 1;
      }
      contentPosition += 1;
      if (lastPositionByTetrad.has(item.tetradId)) {
        assert.ok(
          index - lastPositionByTetrad.get(item.tetradId) >= 10,
          `${booklet.bookletId} places anchored ${item.tetradId} too close`
        );
      }
      lastPositionByTetrad.set(item.tetradId, index);
    });
  }
  for (const [itemId, segments] of anchorSegmentExposure) {
    assert.ok(
      segments.every(value => value > 0)
        && segments.every(value => Math.abs(value - variantCount / 3) <= 1),
      `${itemId} anchor segment exposure is imbalanced: ${segments}`
    );
  }
});

test('item-level fast thresholds are bounded and increase with reading load', () => {
  assert.equal(itemFastThresholdMs(0), 1200);
  assert.ok(itemFastThresholdMs(20) > itemFastThresholdMs(5));
  assert.equal(itemFastThresholdMs(1000), 3200);
});
