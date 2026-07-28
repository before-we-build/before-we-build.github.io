import {
  moduleManifest,
  POSITION_ROLES,
  validateManifest,
  validateQuestionBank
} from './bank.js';
import {
  buildRouteItems,
  createConfiguredResearchBooklet,
  qualityFlagsForResponses,
  routeCoverage,
  scoreModule,
  wordCount
} from './scoring.js';
import {
  PAYLOAD_SCHEMA_VERSION,
  PUBLIC_MODULE_ORDER,
  PUBLIC_ROUTE_VERSION,
  RESEARCH_ROUTE_VERSION,
  isAllowedPublicRoute,
  routeTiming
} from './state.js';

export const STUDY_VERSION = '2026-07-28';
export const CONSENT_VERSION = 'adult-research-2026-07-28';
export const RESPONSE_FORMAT = 'likert-5-na';
export const PUBLIC_CATEGORICAL_OUTPUT_ENABLED = false;
function invariant(condition, message) {
  if (!condition) throw new Error(`Invalid result payload: ${message}`);
}

function hasOnlyKeys(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

function sameMembers(left, right) {
  return left.length === right.length
    && new Set(left).size === left.length
    && left.every(value => right.includes(value));
}

function sameData(left, right) {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left)
      && Array.isArray(right)
      && left.length === right.length
      && left.every((value, index) => sameData(value, right[index]));
  }
  if (
    !left
    || !right
    || typeof left !== 'object'
    || typeof right !== 'object'
  ) return false;
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key, index) =>
      key === rightKeys[index] && sameData(left[key], right[key])
    );
}

function validIsoTimestamp(value) {
  if (typeof value !== 'string') return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value;
}

function validateTiming(timing) {
  invariant(
    hasOnlyKeys(timing, [
      'startedAt',
      'completedAt',
      'wallDurationMs',
      'activeDurationMs',
      'segments'
    ]),
    'timing shape is invalid'
  );
  invariant(validIsoTimestamp(timing.startedAt), 'timing.startedAt is invalid');
  invariant(validIsoTimestamp(timing.completedAt), 'timing.completedAt is invalid');
  invariant(Number.isSafeInteger(timing.wallDurationMs) && timing.wallDurationMs >= 0, 'wall duration is invalid');
  invariant(Number.isSafeInteger(timing.activeDurationMs) && timing.activeDurationMs >= 0, 'active duration is invalid');
  invariant(timing.activeDurationMs <= timing.wallDurationMs, 'active duration exceeds wall duration');
  invariant(Array.isArray(timing.segments), 'timing segments are required');
  let previousEndedAt = Date.parse(timing.startedAt);
  const completedAt = Date.parse(timing.completedAt);
  let activeTotal = 0;
  for (const segment of timing.segments) {
    invariant(
      hasOnlyKeys(segment, ['startedAt', 'endedAt', 'durationMs']),
      'segment shape is invalid'
    );
    const startedAt = Date.parse(segment?.startedAt);
    const endedAt = Date.parse(segment?.endedAt);
    invariant(validIsoTimestamp(segment?.startedAt) && validIsoTimestamp(segment?.endedAt), 'segment timestamp is invalid');
    invariant(Number.isSafeInteger(segment.durationMs) && segment.durationMs >= 0, 'segment duration is invalid');
    invariant(startedAt >= previousEndedAt && endedAt >= startedAt, 'segments overlap or run backwards');
    invariant(endedAt <= completedAt, 'segment ends after completion');
    invariant(segment.durationMs === endedAt - startedAt, 'segment duration does not match timestamps');
    previousEndedAt = endedAt;
    activeTotal += segment.durationMs;
  }
  invariant(activeTotal === timing.activeDurationMs, 'active duration does not match segments');
  invariant(
    timing.wallDurationMs === Date.parse(timing.completedAt) - Date.parse(timing.startedAt),
    'wall duration does not match timestamps'
  );
}

function validateResponses(payload) {
  invariant(Array.isArray(payload.responses), 'responses are required');
  invariant(
    payload.responses.length === payload.randomization.itemOrder.length,
    'response count does not match item order'
  );
  invariant(payload.responses.every((response, index) => {
    if (!hasOnlyKeys(response, [
      'itemId',
      'itemVersion',
      'testKey',
      'scale',
      'displayIndex',
      'responseValue',
      'scoredValue',
      'notApplicable',
      'attentionExpected',
      'promptWordCount',
      'responseTimeMs',
      'lastResponseTimeMs',
      'changedAnswer',
      'routeLanguage'
    ])) return false;
    if (!response || response.itemId !== payload.randomization.itemOrder[index]) return false;
    if (!payload.randomization.blockOrder.includes(response.testKey)) return false;
    if (typeof response.itemId !== 'string' || !response.itemId) return false;
    if (typeof response.itemVersion !== 'string' || !response.itemVersion) return false;
    if (typeof response.scale !== 'string' || !response.scale) return false;
    if (response.displayIndex !== index + 1) return false;
    if (response.routeLanguage !== payload.metadata?.language) return false;
    if (!Number.isSafeInteger(response.promptWordCount) || response.promptWordCount < 1) return false;
    if (!Number.isSafeInteger(response.responseTimeMs) || response.responseTimeMs < 0) return false;
    if (
      !Number.isSafeInteger(response.lastResponseTimeMs)
      || response.lastResponseTimeMs < response.responseTimeMs
    ) return false;
    if (typeof response.changedAnswer !== 'boolean') return false;
    if (
      response.attentionExpected !== null
      && (
        !Number.isInteger(response.attentionExpected)
        || response.attentionExpected < 1
        || response.attentionExpected > 5
      )
    ) return false;
    if (typeof response.notApplicable !== 'boolean') return false;
    if (response.notApplicable) return response.responseValue === null && response.scoredValue === null;
    return Number.isInteger(response.responseValue)
      && response.responseValue >= 1
      && response.responseValue <= 5
      && Number.isInteger(response.scoredValue)
      && response.scoredValue >= 1
      && response.scoredValue <= 5;
  }), 'response values or order are invalid');

  const observedBlockOrder = [];
  for (const response of payload.responses) {
    if (observedBlockOrder.at(-1) !== response.testKey) observedBlockOrder.push(response.testKey);
  }
  invariant(
    JSON.stringify(observedBlockOrder) === JSON.stringify(payload.randomization.blockOrder),
    'response blocks do not match block order'
  );

  for (const [testKey, module] of Object.entries(payload.modules)) {
    const moduleResponses = payload.responses.filter(response => response.testKey === testKey);
    const contentResponses = moduleResponses.filter(response => response.attentionExpected === null);
    const attentionResponses = moduleResponses.filter(response => response.attentionExpected !== null);
    invariant(moduleResponses.length === module.presentedItemCount, `${testKey} presented count does not match responses`);
    invariant(
      contentResponses.length === module.presentedItemCount - 1,
      `${testKey} presented content count does not match responses`
    );
    invariant(
      contentResponses.length <= module.contentItemCount,
      `${testKey} presented content exceeds the released pool`
    );
    invariant(attentionResponses.length === 1, `${testKey} must contain exactly one attention response`);
  }
}

function validateModules(payload) {
  const moduleKeys = Object.keys(payload.modules || {});
  invariant(moduleKeys.length > 0, 'module manifests are required');
  invariant(sameMembers(moduleKeys, payload.randomization.blockOrder), 'module and block order keys differ');
  for (const module of Object.values(payload.modules)) {
    invariant(
      hasOnlyKeys(module, [
        'instrumentVersion',
        'measurementModel',
        'calibrationStatus',
        'contentItemCount',
        'presentedItemCount'
      ]),
      'module manifest shape is invalid'
    );
    invariant(typeof module.instrumentVersion === 'string' && module.instrumentVersion, 'instrument version is required');
    invariant(typeof module.measurementModel === 'string' && module.measurementModel, 'measurement model is required');
    invariant(typeof module.calibrationStatus === 'string' && module.calibrationStatus, 'calibration status is required');
    invariant(Number.isInteger(module.contentItemCount) && module.contentItemCount > 0, 'content count is invalid');
    invariant(
      Number.isInteger(module.presentedItemCount)
        && module.presentedItemCount > 1
        && module.presentedItemCount <= module.contentItemCount + 1,
      'presented count is invalid'
    );
  }
}

function environmentMetadata() {
  return {
    viewport: {
      width: globalThis.innerWidth ?? null,
      height: globalThis.innerHeight ?? null
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

function basePayload({
  manifest,
  state,
  selectedKeys,
  blockOrder,
  itemOrder,
  responses,
  descriptiveScores,
  coverage,
  qualityFlags,
  sessionId,
  completedAt,
  audience
}) {
  const expectedRouteVersion = audience === 'public' ? PUBLIC_ROUTE_VERSION : RESEARCH_ROUTE_VERSION;
  invariant(Array.isArray(selectedKeys) && selectedKeys.length > 0, 'selected modules are required');
  invariant(Array.isArray(blockOrder), 'block order is required');
  invariant(Array.isArray(itemOrder), 'item order is required');
  invariant(Array.isArray(responses), 'responses are required');
  invariant(state.routeVersion === expectedRouteVersion, 'state route version does not match audience');
  if (audience === 'public') {
    invariant(isAllowedPublicRoute(selectedKeys), 'public module set is not an allowed route');
  } else {
    invariant(selectedKeys.length === 1, 'Research route must select exactly one module');
  }
  invariant(
    state.questionBank?.version === manifest.bankVersion && state.questionBank?.sha256 === manifest.sha256,
    'state question bank does not match release manifest'
  );
  invariant(sameMembers(selectedKeys, state.testKeys), 'selected modules do not match route state');
  invariant(sameMembers(selectedKeys, blockOrder), 'block order does not match selected modules');
  invariant(sessionId === state.sessionId, 'session id does not match route state');
  const modules = moduleManifest(manifest, selectedKeys);
  for (const testKey of selectedKeys) {
    invariant(modules[testKey] && typeof modules[testKey] === 'object', `${testKey} module manifest is missing`);
    modules[testKey].presentedItemCount = responses.filter(response => response.testKey === testKey).length;
  }
  return {
    schemaVersion: PAYLOAD_SCHEMA_VERSION,
    studyId: 'before-we-build-tests-pilot',
    studyVersion: STUDY_VERSION,
    routeVersion: audience === 'public' ? PUBLIC_ROUTE_VERSION : RESEARCH_ROUTE_VERSION,
    responseFormat: RESPONSE_FORMAT,
    responseId: globalThis.crypto.randomUUID(),
    sessionId,
    questionBank: {
      version: manifest.bankVersion,
      sha256: manifest.sha256,
      source: manifest.source
    },
    modules,
    randomization: {
      seed: state.orderSeed,
      blockOrder: [...blockOrder],
      itemOrder: [...itemOrder]
    },
    timing: routeTiming(state, completedAt),
    responses,
    descriptiveScores,
    coverage,
    qualityFlags,
    metadata: {
      audience,
      language: state.language,
      ...environmentMetadata()
    }
  };
}

export function buildPublicPayload(options) {
  const payload = basePayload({ ...options, audience: 'public' });
  payload.metadata.progressStorageEnabledAtStart = Boolean(
    options.state.progressStorageEnabledAtStart
  );
  payload.processing = {
    location: 'browser',
    transmitted: false,
    persisted: false
  };
  return validateResultPayload(payload, {
    audience: 'public',
    bank: options.bank,
    manifest: options.manifest
  });
}

export async function hashRetestToken(token) {
  const normalized = String(token || '').trim().toLowerCase();
  if (!normalized) return '';
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
}

export async function buildResearchPayload(options) {
  if (
    options.consent?.adultEligibilityConfirmed !== true
    || options.consent?.researchConsentAccepted !== true
  ) {
    throw new Error('Adult eligibility and research consent must be confirmed');
  }
  const payload = basePayload({ ...options, audience: 'research' });
  payload.consent = {
    adultEligibilityConfirmed: options.consent.adultEligibilityConfirmed,
    researchConsentAccepted: options.consent.researchConsentAccepted,
    consentVersion: CONSENT_VERSION
  };
  payload.metadata = {
    ...payload.metadata,
    ageBand: options.metadata?.ageBand || null,
    priorTypologyExposure: options.metadata?.priorTypologyExposure || null,
    selfReportedType: options.metadata?.selfReportedType || null
  };
  payload.retestTokenHash = options.metadata?.retestTokenHash || '';
  payload.booklet = options.booklet;
  payload.experimentalRanking = options.experimentalRanking;
  payload.processing = {
    location: 'browser',
    transmitted: false,
    persisted: false,
    exportInitiatedByParticipant: false
  };
  return validateResultPayload(payload, {
    audience: 'research',
    bank: options.bank,
    manifest: options.manifest
  });
}

export function publicPayloadIsDescriptiveOnly(payload) {
  if (payload.experimentalRanking !== undefined) return false;
  const forbiddenKeys = new Set([
    'age',
    'ageBand',
    'ageCategory',
    'ageGroup',
    'candidates',
    'code',
    'defined',
    'displayCode',
    'mode',
    'music',
    'typeCode',
    'typeHypothesis',
    'musicRecommendation',
    'musicRecommendations',
    'playlist',
    'recommendation',
    'recommendations',
    'typeRecommendations'
  ]);
  const visit = value => {
    if (!value || typeof value !== 'object') return true;
    if (Array.isArray(value)) return value.every(visit);
    for (const [key, nested] of Object.entries(value)) {
      if (forbiddenKeys.has(key)) return false;
      if (!visit(nested)) return false;
    }
    return true;
  };
  return visit(payload);
}

function validateAgainstRelease(payload, { audience, bank, manifest }) {
  invariant(bank && manifest, 'pinned bank and manifest validation context is required');
  validateManifest(manifest);
  validateQuestionBank(bank, manifest);
  invariant(
    sameData(payload.questionBank, {
      version: manifest.bankVersion,
      sha256: manifest.sha256,
      source: manifest.source
    }),
    'question bank reference does not match the pinned release'
  );

  const selectedKeys = PUBLIC_MODULE_ORDER.filter(key =>
    Object.hasOwn(payload.modules, key)
  );
  invariant(
    selectedKeys.length === Object.keys(payload.modules).length,
    'payload contains an unsupported module'
  );
  if (audience === 'public') {
    invariant(isAllowedPublicRoute(selectedKeys), 'public module set is not an allowed route');
  }
  for (const testKey of selectedKeys) {
    const expectedModule = {
      ...manifest.modules[testKey],
      presentedItemCount: payload.responses.filter(response =>
        response.testKey === testKey
      ).length
    };
    invariant(
      sameData(payload.modules[testKey], expectedModule),
      `${testKey} module manifest does not match the pinned release`
    );
    const scores = payload.descriptiveScores[testKey];
    if (bank.tests[testKey].mode === 'socionics') {
      invariant(
        hasOnlyKeys(scores, ['model', 'calibrationStatus', 'dimensions']),
        `${testKey} descriptive score shape is invalid`
      );
      invariant(
        hasOnlyKeys(scores.dimensions, bank.tests[testKey].dims),
        `${testKey} dimension set is invalid`
      );
      for (const evidence of Object.values(scores.dimensions)) {
        invariant(
          hasOnlyKeys(evidence, ['mean', 'answered', 'expected']),
          `${testKey} dimension evidence shape is invalid`
        );
        invariant(
          evidence.mean === null || Number.isFinite(evidence.mean),
          `${testKey} dimension mean is invalid`
        );
        invariant(
          Number.isSafeInteger(evidence.answered)
            && evidence.answered >= 0
            && Number.isSafeInteger(evidence.expected)
            && evidence.expected > 0
            && evidence.answered <= evidence.expected,
          `${testKey} dimension coverage is invalid`
        );
      }
    } else {
      invariant(
        hasOnlyKeys(scores, ['model', 'calibrationStatus', 'aspects']),
        `${testKey} descriptive score shape is invalid`
      );
      invariant(
        hasOnlyKeys(scores.aspects, bank.tests[testKey].aspects),
        `${testKey} aspect set is invalid`
      );
      const roleNames = Object.values(POSITION_ROLES);
      for (const aspect of Object.values(scores.aspects)) {
        invariant(
          hasOnlyKeys(aspect, ['answered', 'expected', 'coverageComplete', 'roles']),
          `${testKey} aspect evidence shape is invalid`
        );
        invariant(
          hasOnlyKeys(aspect.roles, roleNames),
          `${testKey} role set is invalid`
        );
        invariant(typeof aspect.coverageComplete === 'boolean', `${testKey} aspect coverage flag is invalid`);
        for (const role of Object.values(aspect.roles)) {
          invariant(
            hasOnlyKeys(role, [
              'position',
              'role',
              'answered',
              'expected',
              'mean',
              'contrast'
            ]),
            `${testKey} role evidence shape is invalid`
          );
          invariant(
            POSITION_ROLES[role.position] === role.role,
            `${testKey} role identity is invalid`
          );
          invariant(
            role.mean === null || Number.isFinite(role.mean),
            `${testKey} role mean is invalid`
          );
          invariant(
            role.contrast === null || Number.isFinite(role.contrast),
            `${testKey} role contrast is invalid`
          );
          invariant(
            Number.isSafeInteger(role.answered)
              && role.answered >= 0
              && Number.isSafeInteger(role.expected)
              && role.expected > 0
              && role.answered <= role.expected,
            `${testKey} role coverage is invalid`
          );
        }
      }
    }
    invariant(scores.model === bank.tests[testKey].measurementModel, `${testKey} score model is invalid`);
    invariant(scores.calibrationStatus === bank.tests[testKey].calibrationStatus, `${testKey} score status is invalid`);
  }

  let expectedBlockOrder;
  let expectedItems;
  if (audience === 'public') {
    const replay = buildRouteItems(bank, selectedKeys, payload.randomization.seed);
    expectedBlockOrder = replay.blockOrder;
    expectedItems = replay.items;
  } else {
    invariant(selectedKeys.length === 1, 'Research route must select exactly one module');
    const booklet = createConfiguredResearchBooklet(
      selectedKeys[0],
      bank.tests[selectedKeys[0]],
      payload.randomization.seed
    );
    expectedBlockOrder = [selectedKeys[0]];
    expectedItems = booklet.items.map(item => ({ ...item, testKey: selectedKeys[0] }));
    invariant(
      sameData(payload.booklet, {
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
      }),
      'Research booklet does not replay from the recorded seed'
    );
  }
  invariant(
    sameData(payload.randomization.blockOrder, expectedBlockOrder),
    'block order does not replay from the recorded seed'
  );
  invariant(
    sameData(
      payload.randomization.itemOrder,
      expectedItems.map(item => item.id)
    ),
    'item order does not replay from the recorded seed'
  );

  const expectedById = new Map(expectedItems.map(item => [item.id, item]));
  for (const response of payload.responses) {
    const item = expectedById.get(response.itemId);
    invariant(item, `response item ${response.itemId} is not in the replayed route`);
    invariant(response.itemVersion === item.version, `${response.itemId} item version is invalid`);
    invariant(response.testKey === item.testKey, `${response.itemId} module is invalid`);
    invariant(response.scale === item.scale, `${response.itemId} scale is invalid`);
    invariant(
      response.attentionExpected === (item.attention ?? null),
      `${response.itemId} attention key is invalid`
    );
    const expectedPromptWordCount = wordCount(
      item.text[payload.metadata.language]
        || item.text.uk
        || item.text.en
        || item.text.ru
    );
    invariant(
      response.promptWordCount === expectedPromptWordCount,
      `${response.itemId} prompt word count is invalid`
    );
    const expectedScoredValue = response.notApplicable
      ? null
      : item.reverse
        ? 6 - response.responseValue
        : response.responseValue;
    invariant(
      response.scoredValue === expectedScoredValue,
      `${response.itemId} scored value is invalid`
    );
    invariant(
      response.lastResponseTimeMs <= payload.timing.activeDurationMs,
      `${response.itemId} response time exceeds active route time`
    );
  }

  const expectedScores = Object.fromEntries(selectedKeys.map(testKey => [
    testKey,
    scoreModule(
      bank.tests[testKey],
      payload.responses.filter(response => response.testKey === testKey)
    ).descriptiveScores
  ]));
  invariant(
    sameData(payload.descriptiveScores, expectedScores),
    'descriptive scores do not match the pinned bank and responses'
  );
  if (audience === 'research') {
    const expectedRanking = Object.fromEntries(selectedKeys.map(testKey => [
      testKey,
      scoreModule(
        bank.tests[testKey],
        payload.responses.filter(response => response.testKey === testKey),
        { includeExperimentalRanking: true }
      ).experimentalRanking
    ]));
    invariant(
      sameData(payload.experimentalRanking, expectedRanking),
      'experimental ranking does not match the pinned precalibration algorithm'
    );
  }
  invariant(
    sameData(payload.coverage, routeCoverage(payload.responses)),
    'coverage does not match the recorded responses'
  );
  invariant(
    sameData(
      payload.qualityFlags,
      qualityFlagsForResponses(payload.responses, payload.timing.activeDurationMs)
    ),
    'quality flags do not match the recorded responses and active time'
  );
}

export function validateResultPayload(payload, {
  audience,
  bank,
  manifest
} = {}) {
  invariant(payload && typeof payload === 'object' && !Array.isArray(payload), 'root object is required');
  const commonKeys = [
    'schemaVersion',
    'studyId',
    'studyVersion',
    'routeVersion',
    'responseFormat',
    'responseId',
    'sessionId',
    'questionBank',
    'modules',
    'randomization',
    'timing',
    'responses',
    'descriptiveScores',
    'coverage',
    'qualityFlags',
    'metadata',
    'processing'
  ];
  const audienceKeys = audience === 'research'
    ? ['consent', 'retestTokenHash', 'booklet', 'experimentalRanking']
    : [];
  invariant(hasOnlyKeys(payload, [...commonKeys, ...audienceKeys]), 'root shape is invalid');
  invariant(payload.schemaVersion === PAYLOAD_SCHEMA_VERSION, 'schema version is unsupported');
  invariant(payload.studyId === 'before-we-build-tests-pilot', 'study id is unsupported');
  invariant(payload.studyVersion === STUDY_VERSION, 'study version is unsupported');
  invariant(payload.responseFormat === RESPONSE_FORMAT, 'response format is unsupported');
  invariant(
    payload.routeVersion === (audience === 'research' ? RESEARCH_ROUTE_VERSION : PUBLIC_ROUTE_VERSION),
    'route version is unsupported'
  );
  invariant(typeof payload.responseId === 'string' && payload.responseId, 'response id is required');
  invariant(typeof payload.sessionId === 'string' && payload.sessionId, 'session id is required');
  invariant(
    hasOnlyKeys(payload.questionBank, ['version', 'sha256', 'source']),
    'question bank reference is invalid'
  );
  invariant(typeof payload.questionBank.version === 'string' && payload.questionBank.version, 'bank version is required');
  invariant(/^[a-f0-9]{64}$/u.test(payload.questionBank.sha256 || ''), 'bank hash is invalid');
  invariant(typeof payload.questionBank.source === 'string' && payload.questionBank.source, 'bank source is required');
  invariant(
    hasOnlyKeys(payload.randomization, ['seed', 'blockOrder', 'itemOrder']),
    'randomization shape is invalid'
  );
  invariant(typeof payload.randomization.seed === 'string' && payload.randomization.seed, 'randomization seed is required');
  invariant(Array.isArray(payload.randomization.blockOrder), 'block order is required');
  invariant(Array.isArray(payload.randomization.itemOrder), 'item order is required');
  invariant(
    new Set(payload.randomization.itemOrder).size === payload.randomization.itemOrder.length,
    'item order contains duplicates'
  );
  validateModules(payload);
  validateResponses(payload);
  validateTiming(payload.timing);
  invariant(payload.descriptiveScores && typeof payload.descriptiveScores === 'object', 'descriptive scores are required');
  invariant(
    sameMembers(Object.keys(payload.descriptiveScores), Object.keys(payload.modules)),
    'descriptive score modules differ'
  );
  invariant(
    publicPayloadIsDescriptiveOnly({ descriptiveScores: payload.descriptiveScores }),
    'descriptive scores contain classification output'
  );
  invariant(
    hasOnlyKeys(payload.coverage, [
      'contentItemCount',
      'answeredItemCount',
      'scorableItemCount',
      'notApplicableItemCount',
      'proportionAnswered'
    ]),
    'coverage shape is invalid'
  );
  const contentResponses = payload.responses.filter(response => response.attentionExpected === null);
  const answeredContent = contentResponses.filter(response =>
    response.notApplicable || response.responseValue !== null && response.responseValue !== undefined
  );
  const scorableContent = answeredContent.filter(response => !response.notApplicable);
  invariant(payload.coverage.contentItemCount === contentResponses.length, 'coverage content count is invalid');
  invariant(payload.coverage.answeredItemCount === answeredContent.length, 'coverage answered count is invalid');
  invariant(payload.coverage.scorableItemCount === scorableContent.length, 'coverage scorable count is invalid');
  invariant(
    payload.coverage.notApplicableItemCount === answeredContent.length - scorableContent.length,
    'coverage N/A count is invalid'
  );
  invariant(
    payload.coverage.proportionAnswered === (
      contentResponses.length
        ? Number((answeredContent.length / contentResponses.length).toFixed(3))
        : 0
    ),
    'coverage proportion is invalid'
  );
  invariant(payload.qualityFlags && typeof payload.qualityFlags === 'object', 'quality flags are required');
  invariant(
    payload.qualityFlags.activeDurationMs === payload.timing.activeDurationMs,
    'quality active duration does not match route timing'
  );
  invariant(payload.qualityFlags.attentionCheckPresented === true, 'attention check status is invalid');
  const failedAttentionCheck = payload.responses.some(response =>
    response.attentionExpected !== null
      && (
        response.responseValue === null
        || Number(response.responseValue) !== response.attentionExpected
      )
  );
  invariant(
    payload.qualityFlags.failedAttentionCheck === failedAttentionCheck,
    'attention check result is invalid'
  );
  const metadataKeys = audience === 'research'
    ? [
        'audience',
        'language',
        'viewport',
        'timezone',
        'ageBand',
        'priorTypologyExposure',
        'selfReportedType'
      ]
    : [
        'audience',
        'language',
        'viewport',
        'timezone',
        'progressStorageEnabledAtStart'
      ];
  invariant(hasOnlyKeys(payload.metadata, metadataKeys), 'metadata shape is invalid');
  invariant(payload.metadata.audience === audience, 'audience metadata does not match route');
  invariant(['ru', 'en', 'uk'].includes(payload.metadata?.language), 'route language is invalid');
  invariant(
    hasOnlyKeys(payload.metadata.viewport, ['width', 'height'])
      && [payload.metadata.viewport.width, payload.metadata.viewport.height].every(value =>
        value === null || Number.isSafeInteger(value) && value >= 0
      ),
    'viewport metadata is invalid'
  );
  invariant(typeof payload.metadata.timezone === 'string' && payload.metadata.timezone, 'timezone metadata is invalid');
  invariant(payload.processing?.location === 'browser', 'processing location must be browser');
  invariant(payload.processing.transmitted === false, 'payload must not be transmitted');

  if (audience === 'public') {
    invariant(
      hasOnlyKeys(payload.processing, ['location', 'transmitted', 'persisted']),
      'public processing shape is invalid'
    );
    invariant(publicPayloadIsDescriptiveOnly(payload), 'public result contains classification output');
    invariant(typeof payload.metadata.progressStorageEnabledAtStart === 'boolean', 'storage metadata is invalid');
    invariant(payload.processing.persisted === false, 'public result must not be persisted implicitly');
  } else {
    invariant(audience === 'research', 'audience must be public or research');
    invariant(
      hasOnlyKeys(payload.processing, [
        'location',
        'transmitted',
        'persisted',
        'exportInitiatedByParticipant'
      ]),
      'research processing shape is invalid'
    );
    invariant(
      hasOnlyKeys(payload.consent, [
        'adultEligibilityConfirmed',
        'researchConsentAccepted',
        'consentVersion'
      ]),
      'research consent shape is invalid'
    );
    invariant(payload.consent?.adultEligibilityConfirmed === true, 'adult eligibility is not confirmed');
    invariant(payload.consent?.researchConsentAccepted === true, 'research consent is not confirmed');
    invariant(payload.consent?.consentVersion === CONSENT_VERSION, 'consent version is invalid');
    invariant(payload.experimentalRanking && typeof payload.experimentalRanking === 'object', 'research ranking is required');
    invariant(
      sameMembers(Object.keys(payload.experimentalRanking), Object.keys(payload.modules)),
      'research ranking modules differ'
    );
    invariant(!JSON.stringify(payload.experimentalRanking).includes('"defined"'), 'research ranking contains a defined claim');
    invariant(Object.values(payload.experimentalRanking).every(ranking =>
      Array.isArray(ranking)
      && ranking.every(candidate =>
        candidate.calibrationStatus === 'precalibration'
        && candidate.interpretation === 'experimental-ranking-only'
      )
    ), 'research ranking status is invalid');
    invariant(
      payload.metadata.ageBand === null || ['18-24', '25-34', '35-44', '45-54', '55+'].includes(payload.metadata.ageBand),
      'research age band is invalid'
    );
    invariant(
      payload.metadata.priorTypologyExposure === null
        || typeof payload.metadata.priorTypologyExposure === 'string',
      'prior typology exposure is invalid'
    );
    invariant(
      payload.metadata.selfReportedType === null
        || typeof payload.metadata.selfReportedType === 'string',
      'self-reported type is invalid'
    );
    invariant(
      hasOnlyKeys(payload.booklet, [
        'bookletId',
        'designVersion',
        'designStatus',
        'variantIndex',
        'variantCount',
        'anchorItemIds',
        'plannedMissingItemIds',
        'plannedMissing',
        'contentItemCount',
        'presentedItemCount'
      ]),
      'research booklet shape is invalid'
    );
    invariant(typeof payload.booklet.bookletId === 'string' && payload.booklet.bookletId, 'booklet id is invalid');
    invariant(typeof payload.booklet.designVersion === 'string' && payload.booklet.designVersion, 'booklet design version is invalid');
    invariant(payload.booklet.designStatus === 'design_pending_g0', 'booklet design status is invalid');
    invariant(
      Number.isSafeInteger(payload.booklet.variantIndex)
        && payload.booklet.variantIndex >= 0
        && Number.isSafeInteger(payload.booklet.variantCount)
        && payload.booklet.variantCount > 0
        && payload.booklet.variantIndex < payload.booklet.variantCount,
      'booklet variant is invalid'
    );
    invariant(
      Array.isArray(payload.booklet.anchorItemIds)
        && new Set(payload.booklet.anchorItemIds).size === payload.booklet.anchorItemIds.length,
      'booklet anchor ids are invalid'
    );
    invariant(
      Array.isArray(payload.booklet.plannedMissingItemIds)
        && new Set(payload.booklet.plannedMissingItemIds).size === payload.booklet.plannedMissingItemIds.length,
      'booklet planned-missing ids are invalid'
    );
    invariant(typeof payload.booklet.plannedMissing === 'boolean', 'booklet planned-missing status is invalid');
    invariant(payload.booklet.contentItemCount === contentResponses.length, 'booklet content count is invalid');
    invariant(payload.booklet.presentedItemCount === payload.responses.length, 'booklet presented count is invalid');
    const responseItemIds = new Set(payload.responses.map(response => response.itemId));
    invariant(
      payload.booklet.anchorItemIds.every(itemId => responseItemIds.has(itemId)),
      'booklet anchor is not presented'
    );
    invariant(
      payload.booklet.plannedMissingItemIds.every(itemId => !responseItemIds.has(itemId)),
      'planned-missing item was presented'
    );
    invariant(
      payload.booklet.plannedMissing === (payload.booklet.plannedMissingItemIds.length > 0),
      'booklet planned-missing flag is inconsistent'
    );
    invariant(
      payload.booklet.contentItemCount + payload.booklet.plannedMissingItemIds.length
        === Object.values(payload.modules).reduce(
          (total, module) => total + module.contentItemCount,
          0
        ),
      'booklet does not partition the released content pool'
    );
    invariant(payload.processing.persisted === false, 'research result must not be persisted');
    invariant(typeof payload.processing.exportInitiatedByParticipant === 'boolean', 'export status is invalid');
    invariant(payload.retestTokenHash === '' || /^[a-f0-9]{64}$/u.test(payload.retestTokenHash), 'retest hash is invalid');
  }
  validateAgainstRelease(payload, { audience, bank, manifest });
  return payload;
}
