import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { validateManifest, validateQuestionBank } from '../assets/test/bank.js';
import {
  buildResearchPayload,
  buildPublicPayload,
  CONSENT_VERSION,
  hashRetestToken,
  publicPayloadIsDescriptiveOnly,
  RESPONSE_FORMAT,
  validateResultPayload
} from '../assets/test/contract.js';
import { copyFor } from '../assets/test/i18n.js';
import {
  buildRouteItems,
  createConfiguredResearchBooklet,
  qualityFlagsForResponses,
  routeCoverage,
  scoreModule
} from '../assets/test/scoring.js';
import {
  markItemShown,
  newRouteState,
  PAYLOAD_SCHEMA_VERSION,
  PUBLIC_ROUTE_VERSION,
  RESEARCH_ROUTE_VERSION,
  recordAnswer
} from '../assets/test/state.js';
import {
  renderPositionProfile,
  renderQuestion,
  renderSocionicsProfile,
  responseRecordsForRoute
} from '../assets/test/ui-common.js';

const instrumentsDirectory = new URL('../assets/instruments/', import.meta.url);
const manifest = validateManifest(JSON.parse(
  await readFile(new URL('instrument-manifest.json', instrumentsDirectory), 'utf8')
));
const bank = validateQuestionBank(JSON.parse(
  await readFile(new URL(manifest.file, instrumentsDirectory), 'utf8')
), manifest);

const PUBLIC_MODULE_ORDER = ['psychosophy', 'temporistics', 'socionics'];
const EXPECTED_ROUTE_SIZES = {
  psychosophy: 49,
  temporistics: 49,
  socionics: 17
};

function validationContext(audience) {
  return { audience, bank, manifest };
}

function responseFor(item, responseValue) {
  const notApplicable = responseValue === null || responseValue === undefined;
  return {
    itemId: item.id,
    itemVersion: item.version,
    testKey: item.testKey,
    scale: item.scale,
    displayIndex: 1,
    responseValue: notApplicable ? null : Number(responseValue),
    scoredValue: notApplicable ? null : Number(responseValue),
    notApplicable: false,
    attentionExpected: item.attention ?? null,
    promptWordCount: 10,
    responseTimeMs: 4000,
    lastResponseTimeMs: 4000,
    changedAnswer: false,
    routeLanguage: 'en'
  };
}

function recursiveKeys(value, output = new Set()) {
  if (!value || typeof value !== 'object') return output;
  if (Array.isArray(value)) {
    value.forEach(item => recursiveKeys(item, output));
    return output;
  }
  for (const [key, nested] of Object.entries(value)) {
    output.add(key);
    recursiveKeys(nested, output);
  }
  return output;
}

function completedPublicFixture(testKeys = PUBLIC_MODULE_ORDER) {
  const orderSeed = 'contract-seed:public-full-route';
  const route = buildRouteItems(bank, testKeys, orderSeed);
  const startedAt = 1_000_000;
  const state = newRouteState({
    questionBank: { version: manifest.bankVersion, sha256: manifest.sha256 },
    testKeys,
    orderSeed,
    language: 'en',
    sessionId: 'contract-public-session',
    saveLocal: false,
    now: startedAt
  });

  let now = startedAt;
  route.items.forEach((item, index) => {
    markItemShown(state, item.id, now);
    now += 4000;
    const value = item.attention === undefined
      ? String([1, 2, 4, 5][index % 4])
      : String(item.attention);
    recordAnswer(state, item.id, value, now);
  });

  const responses = responseRecordsForRoute(route.items, state);
  const scoring = Object.fromEntries(testKeys.map(key => [
    key,
    scoreModule(bank.tests[key], responses.filter(response => response.testKey === key))
  ]));
  const descriptiveScores = Object.fromEntries(testKeys.map(key => [
    key,
    scoring[key].descriptiveScores
  ]));
  const qualityFlags = qualityFlagsForResponses(responses, now - startedAt);
  const coverage = routeCoverage(responses);
  const payload = buildPublicPayload({
    bank,
    manifest,
    state,
    selectedKeys: testKeys,
    blockOrder: route.blockOrder,
    itemOrder: route.items.map(item => item.id),
    responses,
    descriptiveScores,
    coverage,
    qualityFlags,
    sessionId: state.sessionId,
    completedAt: now
  });

  return { route, state, responses, scoring, qualityFlags, coverage, payload };
}

test('the real public bank composes one attention check into every route', () => {
  for (const testKey of PUBLIC_MODULE_ORDER) {
    const route = buildRouteItems(bank, [testKey], `route-composition:${testKey}`);
    assert.deepEqual(route.blockOrder, [testKey]);
    assert.equal(route.items.length, EXPECTED_ROUTE_SIZES[testKey]);
    assert.equal(
      route.items.filter(item => item.attention !== undefined).length,
      1,
      `${testKey} must present exactly one attention check`
    );
    assert.ok(route.items.every(item => item.testKey === testKey));
    assert.equal(new Set(route.items.map(item => item.id)).size, route.items.length);
  }

  const fullRoute = buildRouteItems(bank, PUBLIC_MODULE_ORDER, 'route-composition:full');
  assert.equal(fullRoute.items.length, 115);
  assert.equal(fullRoute.blockOrder.length, 3);
  assert.deepEqual(new Set(fullRoute.blockOrder), new Set(PUBLIC_MODULE_ORDER));
  for (const testKey of PUBLIC_MODULE_ORDER) {
    const moduleItems = fullRoute.items.filter(item => item.testKey === testKey);
    assert.equal(moduleItems.length, EXPECTED_ROUTE_SIZES[testKey]);
    assert.equal(moduleItems.filter(item => item.attention !== undefined).length, 1);
  }
});

test('attention semantics distinguish correct, wrong, and missing answers', () => {
  const testKey = 'psychosophy';
  const moduleDefinition = bank.tests[testKey];
  const attention = {
    ...moduleDefinition.items.find(item => item.attention !== undefined),
    testKey
  };

  const correct = responseFor(attention, attention.attention);
  const correctScore = scoreModule(moduleDefinition, [correct]);
  const correctQuality = qualityFlagsForResponses([correct], 30_000);
  assert.equal(correctScore.attentionCheckPresented, true);
  assert.equal(correctScore.failedAttentionCheck, false);
  assert.equal(correctScore.missing, false);
  assert.equal(correctQuality.attentionCheckPresented, true);
  assert.equal(correctQuality.failedAttentionCheck, false);

  const wrongValue = attention.attention === 5 ? 4 : attention.attention + 1;
  const wrong = responseFor(attention, wrongValue);
  const wrongScore = scoreModule(moduleDefinition, [wrong]);
  const wrongQuality = qualityFlagsForResponses([wrong], 30_000);
  assert.equal(wrongScore.attentionCheckPresented, true);
  assert.equal(wrongScore.failedAttentionCheck, true);
  assert.equal(wrongQuality.attentionCheckPresented, true);
  assert.equal(wrongQuality.failedAttentionCheck, true);
  assert.equal(wrongQuality.responseQuality, 'low');

  const missing = responseFor(attention, null);
  const missingScore = scoreModule(moduleDefinition, [missing]);
  const missingQuality = qualityFlagsForResponses([missing], 30_000);
  assert.equal(missingScore.missing, true);
  assert.equal(missingScore.attentionCheckPresented, true);
  assert.equal(missingScore.failedAttentionCheck, true);
  assert.equal(missingQuality.attentionCheckPresented, true);
  assert.equal(missingQuality.failedAttentionCheck, true);
  assert.equal(missingQuality.responseQuality, 'low');
});

test('public payload v2 is descriptive-only and preserves the exact randomization contract', () => {
  const { route, state, payload, qualityFlags, coverage } = completedPublicFixture();
  const expectedItemOrder = route.items.map(item => item.id);

  assert.equal(payload.schemaVersion, PAYLOAD_SCHEMA_VERSION);
  assert.equal(payload.schemaVersion, '2.0.0');
  assert.equal(payload.routeVersion, PUBLIC_ROUTE_VERSION);
  assert.equal(payload.responseFormat, RESPONSE_FORMAT);
  assert.deepEqual(payload.questionBank, {
    version: manifest.bankVersion,
    sha256: manifest.sha256,
    source: manifest.source
  });
  assert.deepEqual(Object.keys(payload.randomization).sort(), ['blockOrder', 'itemOrder', 'seed']);
  assert.equal(payload.randomization.seed, state.orderSeed);
  assert.deepEqual(payload.randomization.blockOrder, route.blockOrder);
  assert.deepEqual(payload.randomization.itemOrder, expectedItemOrder);
  assert.deepEqual(payload.responses.map(response => response.itemId), expectedItemOrder);
  assert.equal(payload.responses.length, 115);
  assert.equal(coverage.contentItemCount, 112);
  assert.equal(coverage.answeredItemCount, 112);
  assert.equal(qualityFlags.attentionCheckPresented, true);
  assert.equal(qualityFlags.failedAttentionCheck, false);

  assert.equal(publicPayloadIsDescriptiveOnly(payload), true);
  assert.equal(payload.experimentalRanking, undefined);
  assert.equal(payload.metadata.ageBand, undefined);
  const keys = recursiveKeys(payload);
  for (const forbidden of [
    'candidates',
    'code',
    'defined',
    'displayCode',
    'experimentalRanking',
    'musicRecommendation',
    'typeCode',
    'typeHypothesis'
  ]) {
    assert.equal(keys.has(forbidden), false, `public payload must not contain ${forbidden}`);
  }
  assert.deepEqual(Object.keys(payload.descriptiveScores).sort(), [...PUBLIC_MODULE_ORDER].sort());
  assert.equal(payload.processing.location, 'browser');
  assert.equal(payload.processing.transmitted, false);
});

test('the public result contract accepts one module or the canonical full route only', () => {
  assert.doesNotThrow(() => completedPublicFixture(['socionics']));
  assert.throws(
    () => completedPublicFixture(['psychosophy', 'socionics']),
    /not an allowed route/
  );
  assert.throws(
    () => completedPublicFixture(['socionics', 'temporistics', 'psychosophy']),
    /not an allowed route/
  );
});

test('research payload requires adult consent and keeps export participant-initiated', async () => {
  const testKey = 'socionics';
  const orderSeed = 'contract-seed:research-socionics';
  const booklet = createConfiguredResearchBooklet(
    testKey,
    bank.tests[testKey],
    orderSeed
  );
  const routeItems = booklet.items.map(item => ({ ...item, testKey }));
  const startedAt = 2_000_000;
  const researchState = newRouteState({
    questionBank: { version: manifest.bankVersion, sha256: manifest.sha256 },
    testKeys: [testKey],
    orderSeed,
    language: 'en',
    sessionId: 'contract-research-session',
    saveLocal: false,
    routeVersion: RESEARCH_ROUTE_VERSION,
    now: startedAt
  });
  let completedAt = startedAt;
  routeItems.forEach((item, index) => {
    markItemShown(researchState, item.id, completedAt);
    completedAt += 4000;
    recordAnswer(
      researchState,
      item.id,
      item.attention === undefined
        ? String([1, 2, 4, 5][index % 4])
        : String(item.attention),
      completedAt
    );
  });
  const responses = responseRecordsForRoute(routeItems, researchState);
  const scoring = scoreModule(
    bank.tests[testKey],
    responses,
    { includeExperimentalRanking: true }
  );
  const qualityFlags = qualityFlagsForResponses(responses, completedAt - startedAt);
  const coverage = routeCoverage(responses);
  const options = {
    bank,
    manifest,
    state: researchState,
    selectedKeys: [testKey],
    blockOrder: [testKey],
    itemOrder: routeItems.map(item => item.id),
    responses,
    descriptiveScores: { [testKey]: scoring.descriptiveScores },
    coverage,
    qualityFlags,
    sessionId: researchState.sessionId,
    completedAt,
    booklet: {
      bookletId: booklet.bookletId,
      designVersion: booklet.designVersion,
      designStatus: booklet.designStatus,
      variantIndex: booklet.variantIndex,
      variantCount: booklet.variantCount,
      anchorItemIds: booklet.anchorItemIds,
      plannedMissingItemIds: booklet.plannedMissingItemIds,
      plannedMissing: booklet.plannedMissing,
      contentItemCount: booklet.contentItemCount,
      presentedItemCount: booklet.presentedItemCount
    },
    experimentalRanking: { [testKey]: scoring.experimentalRanking },
    metadata: {
      ageBand: '25-34',
      priorTypologyExposure: 'none',
      selfReportedType: '',
      retestTokenHash: await hashRetestToken('fixture-token')
    }
  };

  await assert.rejects(
    () => buildResearchPayload(options),
    /Adult eligibility and research consent/
  );

  const payload = await buildResearchPayload({
    ...options,
    consent: {
      adultEligibilityConfirmed: true,
      researchConsentAccepted: true
    }
  });
  assert.equal(payload.routeVersion, RESEARCH_ROUTE_VERSION);
  assert.deepEqual(payload.consent, {
    adultEligibilityConfirmed: true,
    researchConsentAccepted: true,
    consentVersion: CONSENT_VERSION
  });
  assert.equal(payload.processing.transmitted, false);
  assert.equal(payload.processing.persisted, false);
  assert.equal(payload.processing.exportInitiatedByParticipant, false);
  assert.match(payload.retestTokenHash, /^[a-f0-9]{64}$/u);

  const minorBand = structuredClone(payload);
  minorBand.metadata.ageBand = 'under-18';
  assert.throws(
    () => validateResultPayload(minorBand, validationContext('research')),
    /age band/
  );

  const consentDrift = structuredClone(payload);
  consentDrift.consent.consentVersion = 'obsolete-consent';
  assert.throws(
    () => validateResultPayload(consentDrift, validationContext('research')),
    /consent version/
  );
});

test('payload v2 validator rejects classification leaks, replay drift, and timing drift', () => {
  const { payload } = completedPublicFixture();

  const classificationLeak = structuredClone(payload);
  classificationLeak.descriptiveScores.socionics.typeCode = 'LII';
  assert.throws(
    () => validateResultPayload(classificationLeak, validationContext('public')),
    /classification output|descriptive scores/
  );

  const replayDrift = structuredClone(payload);
  replayDrift.randomization.itemOrder.reverse();
  assert.throws(
    () => validateResultPayload(replayDrift, validationContext('public')),
    /response values or order/
  );

  const seedDrift = structuredClone(payload);
  seedDrift.randomization.seed = 'internally-consistent-looking-but-wrong';
  assert.throws(
    () => validateResultPayload(seedDrift, validationContext('public')),
    /replay from the recorded seed/
  );

  const bankReferenceDrift = structuredClone(payload);
  bankReferenceDrift.questionBank.sha256 = '0'.repeat(64);
  assert.throws(
    () => validateResultPayload(bankReferenceDrift, validationContext('public')),
    /pinned release/
  );

  const itemContractDrift = structuredClone(payload);
  itemContractDrift.responses[0].itemVersion = 'forged-item-version';
  assert.throws(
    () => validateResultPayload(itemContractDrift, validationContext('public')),
    /item version/
  );

  const scoreDrift = structuredClone(payload);
  scoreDrift.responses[0].scoredValue = scoreDrift.responses[0].scoredValue === 5 ? 4 : 5;
  assert.throws(
    () => validateResultPayload(scoreDrift, validationContext('public')),
    /scored value/
  );

  const unlistedClassificationLeak = structuredClone(payload);
  unlistedClassificationLeak.descriptiveScores.socionics.tim = 'LII';
  assert.throws(
    () => validateResultPayload(unlistedClassificationLeak, validationContext('public')),
    /descriptive score shape/
  );

  const qualityDrift = structuredClone(payload);
  qualityDrift.qualityFlags.classification = 'LII';
  assert.throws(
    () => validateResultPayload(qualityDrift, validationContext('public')),
    /quality flags/
  );

  const timingDrift = structuredClone(payload);
  timingDrift.timing.activeDurationMs += 1;
  assert.throws(
    () => validateResultPayload(timingDrift, validationContext('public')),
    /active duration/
  );

  const ageLeak = structuredClone(payload);
  ageLeak.descriptiveScores.socionics.ageBand = '25-34';
  assert.throws(
    () => validateResultPayload(ageLeak, validationContext('public')),
    /classification output|descriptive scores/
  );

  const blockDrift = structuredClone(payload);
  const firstKey = blockDrift.randomization.blockOrder[0];
  const secondKey = blockDrift.randomization.blockOrder[1];
  const firstResponse = blockDrift.responses.find(response => response.testKey === firstKey);
  const secondResponse = blockDrift.responses.find(response => response.testKey === secondKey);
  [firstResponse.testKey, secondResponse.testKey] = [secondResponse.testKey, firstResponse.testKey];
  assert.throws(
    () => validateResultPayload(blockDrift, validationContext('public')),
    /presented count|block order/
  );

  const malformedResponse = structuredClone(payload);
  malformedResponse.responses[0].displayIndex = 2;
  assert.throws(
    () => validateResultPayload(malformedResponse, validationContext('public')),
    /response values or order/
  );

  const postCompletionSegment = structuredClone(payload);
  const completedAt = Date.parse(postCompletionSegment.timing.completedAt);
  const durationMs = postCompletionSegment.timing.segments[0].durationMs;
  postCompletionSegment.timing.segments[0].startedAt = new Date(completedAt + 1000).toISOString();
  postCompletionSegment.timing.segments[0].endedAt = new Date(completedAt + 1000 + durationMs).toISOString();
  assert.throws(
    () => validateResultPayload(postCompletionSegment, validationContext('public')),
    /after completion/
  );
});

test('ui-common renders the unified labelled scale and descriptive profiles', () => {
  const { route, scoring } = completedPublicFixture();
  const copy = copyFor('en');
  const contentItem = route.items.find(item => item.attention === undefined);
  const attentionItem = route.items.find(item => item.attention !== undefined);

  const contentHtml = renderQuestion(contentItem, 0, route.items.length, 'en', copy, '4');
  assert.match(contentHtml, /<fieldset class="response-group"/);
  assert.match(contentHtml, /<legend>/);
  assert.equal((contentHtml.match(/type="radio"/g) || []).length, 6);
  for (const label of [copy.scale1, copy.scale2, copy.scale3, copy.scale4, copy.scale5, copy.notApplicable]) {
    assert.ok(contentHtml.includes(label), `rendered question must include “${label}”`);
  }
  assert.match(contentHtml, /value="4" checked/);
  assert.doesNotMatch(contentHtml, /data-(?:age|game)|child-mode|visual-mode|story-card/i);

  const attentionHtml = renderQuestion(attentionItem, 1, route.items.length, 'en', copy);
  assert.equal((attentionHtml.match(/type="radio"/g) || []).length, 6);
  assert.ok(attentionHtml.includes(copy.attentionHint));
  assert.ok(attentionHtml.includes(copy.notApplicable));

  const positionHtml = renderPositionProfile(scoring.psychosophy.descriptiveScores, copy);
  assert.match(positionHtml, /class="profile-grid"/);
  assert.ok(positionHtml.includes(copy.roles.target));
  assert.ok(positionHtml.includes(copy.roles.creative));
  assert.doesNotMatch(positionHtml, /type-code|experimental-ranking/i);

  const socionicsHtml = renderSocionicsProfile(scoring.socionics.descriptiveScores, copy);
  assert.equal((socionicsHtml.match(/class="profile-card"/g) || []).length, 8);
  assert.ok(socionicsHtml.includes(copy.socLabels.Ti));
});
