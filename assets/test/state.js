import { buildRouteItems } from './scoring.js';

export const PROGRESS_SCHEMA_VERSION = '2.0.0';
export const PAYLOAD_SCHEMA_VERSION = '2.0.0';
export const PUBLIC_ROUTE_VERSION = 'public-unified-route-v0.6';
export const RESEARCH_ROUTE_VERSION = 'research-adult-route-v0.6';
export const PROGRESS_KEY = 'before-we-build-progress-v2';
export const LEGACY_PROGRESS_KEY = 'before-we-build-progress-v1';
export const RESULT_KEY = 'before-we-build-result-v2';
export const LEGACY_RESULT_KEY = 'before-we-build-results';
export const LEGACY_DEVICE_ID_KEY = 'before-we-build-device-id';
export const PUBLIC_MODULE_ORDER = Object.freeze([
  'psychosophy',
  'temporistics',
  'socionics'
]);

const RESPONSE_VALUES = new Set(['1', '2', '3', '4', '5', 'na']);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function finiteTimestamp(value) {
  return Number.isSafeInteger(value) && value > 0;
}

function finiteNonNegative(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function hasOnlyKeys(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

export function isAllowedPublicRoute(
  testKeys,
  moduleOrder = PUBLIC_MODULE_ORDER
) {
  if (!Array.isArray(testKeys) || !Array.isArray(moduleOrder)) return false;
  if (
    testKeys.length === 1
    && moduleOrder.includes(testKeys[0])
  ) return true;
  return testKeys.length === moduleOrder.length
    && testKeys.every((key, index) => key === moduleOrder[index]);
}

export function newRouteState({
  questionBank,
  testKeys,
  orderSeed,
  language,
  sessionId = globalThis.crypto.randomUUID(),
  writerId = globalThis.crypto.randomUUID(),
  saveLocal = false,
  routeVersion = PUBLIC_ROUTE_VERSION,
  now = Date.now()
}) {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    routeVersion,
    questionBank: { version: questionBank.version, sha256: questionBank.sha256 },
    testKeys: [...testKeys],
    orderSeed,
    sessionId,
    writerId,
    language,
    saveLocal,
    progressStorageEnabledAtStart: Boolean(saveLocal),
    step: 0,
    answers: {},
    shownAtActiveMs: {},
    timing: {
      startedAt: now,
      activeTimeMs: 0,
      segmentStartedAt: now,
      segments: []
    },
    dirty: false,
    paused: false
  };
}

export function activeTimeMs(state, now = Date.now()) {
  const running = finiteTimestamp(state.timing.segmentStartedAt)
    ? Math.max(0, now - Number(state.timing.segmentStartedAt))
    : 0;
  return Math.max(0, Number(state.timing.activeTimeMs) || 0) + running;
}

function closeActiveSegment(state, now) {
  if (!finiteTimestamp(state.timing.segmentStartedAt)) return;
  const startedAt = Number(state.timing.segmentStartedAt);
  state.timing.activeTimeMs = activeTimeMs(state, now);
  state.timing.segments.push({ startedAt, endedAt: now, durationMs: Math.max(0, now - startedAt) });
  state.timing.segmentStartedAt = null;
}

export function pauseRoute(state, now = Date.now()) {
  closeActiveSegment(state, now);
  state.paused = true;
  return state;
}

export function resumeRoute(state, now = Date.now()) {
  if (!finiteTimestamp(state.timing.segmentStartedAt)) state.timing.segmentStartedAt = now;
  state.paused = false;
  return state;
}

export function markItemShown(state, itemId, now = Date.now()) {
  if (!Object.hasOwn(state.shownAtActiveMs, itemId)) {
    state.shownAtActiveMs[itemId] = activeTimeMs(state, now);
  }
}

export function recordAnswer(state, itemId, value, now = Date.now()) {
  const normalized = String(value);
  if (!RESPONSE_VALUES.has(normalized)) throw new Error(`Unsupported response value for ${itemId}`);
  const currentActiveMs = activeTimeMs(state, now);
  const existing = state.answers[itemId];
  state.answers[itemId] = {
    value: normalized,
    firstAnsweredActiveMs: existing?.firstAnsweredActiveMs ?? currentActiveMs,
    lastAnsweredActiveMs: currentActiveMs,
    changed: existing ? existing.value !== normalized || existing.changed : false
  };
  state.dirty = true;
  return state.answers[itemId];
}

export function responseRecord(state, item, displayIndex, promptWordCount) {
  const answer = state.answers[item.id];
  if (!answer) return null;
  const notApplicable = answer.value === 'na';
  const shownAt = Number(state.shownAtActiveMs[item.id]) || 0;
  return {
    itemId: item.id,
    itemVersion: item.version,
    testKey: item.testKey,
    scale: item.scale,
    displayIndex,
    responseValue: notApplicable ? null : Number(answer.value),
    scoredValue: notApplicable ? null : item.reverse ? 6 - Number(answer.value) : Number(answer.value),
    notApplicable,
    attentionExpected: item.attention ?? null,
    promptWordCount,
    responseTimeMs: Math.max(0, answer.firstAnsweredActiveMs - shownAt),
    lastResponseTimeMs: Math.max(0, answer.lastAnsweredActiveMs - shownAt),
    changedAnswer: Boolean(answer.changed),
    routeLanguage: state.language
  };
}

export function hasAnyAnswer(state) {
  return Object.keys(state?.answers || {}).length > 0;
}

export function snapshotForStorage(state, now = Date.now()) {
  const snapshot = clone(state);
  if (finiteTimestamp(snapshot.timing.segmentStartedAt)) {
    const startedAt = Number(snapshot.timing.segmentStartedAt);
    snapshot.timing.activeTimeMs += Math.max(0, now - startedAt);
    snapshot.timing.segments.push({ startedAt, endedAt: now, durationMs: Math.max(0, now - startedAt) });
    snapshot.timing.segmentStartedAt = null;
  }
  snapshot.savedAt = now;
  return snapshot;
}

function validateAnswers(answers, itemById, selectedTestKeys, shownAtActiveMs, activeTime) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return false;
  return Object.entries(answers).every(([itemId, answer]) => {
    const item = itemById.get(itemId);
    if (!item || !selectedTestKeys.has(item.testKey)) return false;
    if (!hasOnlyKeys(answer, ['value', 'firstAnsweredActiveMs', 'lastAnsweredActiveMs', 'changed'])) return false;
    if (!RESPONSE_VALUES.has(answer.value)) return false;
    if (!Object.hasOwn(shownAtActiveMs, itemId)) return false;
    return finiteNonNegative(answer.firstAnsweredActiveMs)
      && finiteNonNegative(answer.lastAnsweredActiveMs)
      && answer.firstAnsweredActiveMs >= shownAtActiveMs[itemId]
      && answer.lastAnsweredActiveMs >= answer.firstAnsweredActiveMs
      && answer.lastAnsweredActiveMs <= activeTime
      && typeof answer.changed === 'boolean';
  });
}

export function validateProgress(progress, {
  bankVersion,
  bankSha256,
  allowedTestKeys,
  itemById,
  bank
}) {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return { valid: false, reason: 'shape' };
  if (!hasOnlyKeys(progress, [
    'schemaVersion',
    'routeVersion',
    'questionBank',
    'testKeys',
    'orderSeed',
    'sessionId',
    'writerId',
    'language',
    'saveLocal',
    'progressStorageEnabledAtStart',
    'step',
    'answers',
    'shownAtActiveMs',
    'timing',
    'dirty',
    'paused',
    'savedAt'
  ])) return { valid: false, reason: 'shape' };
  if (progress.schemaVersion !== PROGRESS_SCHEMA_VERSION) return { valid: false, reason: 'schema' };
  if (progress.routeVersion !== PUBLIC_ROUTE_VERSION) return { valid: false, reason: 'route-version' };
  if (!hasOnlyKeys(progress.questionBank, ['version', 'sha256'])) {
    return { valid: false, reason: 'bank-version' };
  }
  if (
    typeof progress.questionBank.version !== 'string'
    || !progress.questionBank.version.trim()
    || !/^[a-f0-9]{64}$/u.test(progress.questionBank.sha256)
  ) {
    return { valid: false, reason: 'bank-version' };
  }
  if (progress.questionBank?.version !== bankVersion || progress.questionBank?.sha256 !== bankSha256) {
    return { valid: false, reason: 'bank-version', stale: true };
  }
  if (
    !Array.isArray(progress.testKeys)
    || !progress.testKeys.length
    || new Set(progress.testKeys).size !== progress.testKeys.length
    || progress.testKeys.some(key => !allowedTestKeys.includes(key))
    || !isAllowedPublicRoute(progress.testKeys, allowedTestKeys)
  ) {
    return { valid: false, reason: 'test-keys' };
  }
  if (typeof progress.orderSeed !== 'string' || !progress.orderSeed.trim()) {
    return { valid: false, reason: 'order-seed' };
  }
  if (!bank?.tests || typeof bank.tests !== 'object') {
    return { valid: false, reason: 'bank' };
  }
  let replay;
  try {
    replay = buildRouteItems(bank, progress.testKeys, progress.orderSeed);
  } catch {
    return { valid: false, reason: 'route-replay' };
  }
  const replayIds = replay.items.map(item => item.id);
  const replayIndexById = new Map(replayIds.map((itemId, index) => [itemId, index]));
  if (typeof progress.sessionId !== 'string' || !progress.sessionId.trim()) {
    return { valid: false, reason: 'session-id' };
  }
  if (typeof progress.writerId !== 'string' || !progress.writerId.trim()) {
    return { valid: false, reason: 'writer-id' };
  }
  if (!['ru', 'en', 'uk'].includes(progress.language)) return { valid: false, reason: 'language' };
  if (
    typeof progress.saveLocal !== 'boolean'
    || typeof progress.progressStorageEnabledAtStart !== 'boolean'
    || typeof progress.dirty !== 'boolean'
    || typeof progress.paused !== 'boolean'
  ) {
    return { valid: false, reason: 'flags' };
  }
  if (!Number.isInteger(progress.step) || progress.step < 0 || progress.step >= replayIds.length) {
    return { valid: false, reason: 'step' };
  }
  const selectedTestKeys = new Set(progress.testKeys);
  if (!progress.shownAtActiveMs || typeof progress.shownAtActiveMs !== 'object' || Array.isArray(progress.shownAtActiveMs)) {
    return { valid: false, reason: 'shown-at' };
  }
  const timing = progress.timing;
  if (
    !hasOnlyKeys(timing, ['startedAt', 'activeTimeMs', 'segmentStartedAt', 'segments'])
    || !finiteTimestamp(timing.startedAt)
    || !finiteNonNegative(timing.activeTimeMs)
    || timing.segmentStartedAt !== null
    || !finiteTimestamp(progress.savedAt)
    || progress.savedAt < timing.startedAt
  ) {
    return { valid: false, reason: 'timing' };
  }
  if (!Array.isArray(timing.segments)) return { valid: false, reason: 'segments' };
  let previousEndedAt = timing.startedAt;
  let segmentDurationTotal = 0;
  for (const segment of timing.segments) {
    if (
      !hasOnlyKeys(segment, ['startedAt', 'endedAt', 'durationMs'])
      || !finiteTimestamp(segment.startedAt)
      || !finiteTimestamp(segment.endedAt)
      || !finiteNonNegative(segment.durationMs)
      || segment.startedAt < previousEndedAt
      || segment.endedAt < segment.startedAt
      || segment.endedAt > progress.savedAt
      || segment.durationMs !== segment.endedAt - segment.startedAt
    ) {
      return { valid: false, reason: 'segments' };
    }
    previousEndedAt = segment.endedAt;
    segmentDurationTotal += segment.durationMs;
  }
  if (segmentDurationTotal !== timing.activeTimeMs) {
    return { valid: false, reason: 'segments' };
  }
  if (Object.entries(progress.shownAtActiveMs).some(([itemId, shownAt]) => {
    const item = itemById.get(itemId);
    return !item
      || !selectedTestKeys.has(item.testKey)
      || !replayIndexById.has(itemId)
      || !finiteNonNegative(shownAt)
      || shownAt > timing.activeTimeMs;
  })) return { valid: false, reason: 'shown-at' };
  const shownIndexes = Object.keys(progress.shownAtActiveMs)
    .map(itemId => replayIndexById.get(itemId))
    .sort((left, right) => left - right);
  if (!shownIndexes.length) return { valid: false, reason: 'route-replay' };
  const maxShownIndex = shownIndexes.at(-1);
  if (
    shownIndexes.length !== maxShownIndex + 1
    || shownIndexes.some((value, index) => value !== index)
    || !Object.hasOwn(progress.shownAtActiveMs, replayIds[progress.step])
  ) {
    return { valid: false, reason: 'route-replay' };
  }
  let previousShownAt = -1;
  for (let index = 0; index <= maxShownIndex; index += 1) {
    const itemId = replayIds[index];
    const shownAt = progress.shownAtActiveMs[itemId];
    if (shownAt < previousShownAt) return { valid: false, reason: 'route-replay' };
    if (index < maxShownIndex && !Object.hasOwn(progress.answers, itemId)) {
      return { valid: false, reason: 'route-replay' };
    }
    previousShownAt = shownAt;
  }
  if (!validateAnswers(
    progress.answers,
    itemById,
    selectedTestKeys,
    progress.shownAtActiveMs,
    timing.activeTimeMs
  )) return { valid: false, reason: 'answers' };
  return { valid: true };
}

export function restoreProgress(
  progress,
  now = Date.now(),
  writerId = globalThis.crypto.randomUUID()
) {
  const restored = clone(progress);
  restored.writerId = writerId;
  restored.timing.segmentStartedAt = now;
  restored.paused = false;
  restored.dirty = hasAnyAnswer(restored);
  return restored;
}

export function readProgress(storage, validationContext) {
  let raw;
  let legacy;
  try {
    raw = storage.getItem(PROGRESS_KEY);
    legacy = storage.getItem(LEGACY_PROGRESS_KEY);
  } catch {
    return { status: 'unavailable', reason: 'storage' };
  }
  if (!raw) {
    return legacy ? { status: 'stale', reason: 'legacy-schema' } : { status: 'none' };
  }
  try {
    const progress = JSON.parse(raw);
    const validation = validateProgress(progress, validationContext);
    if (validation.valid) return { status: 'valid', progress };
    return { status: validation.stale ? 'stale' : 'invalid', reason: validation.reason };
  } catch {
    return { status: 'invalid', reason: 'json' };
  }
}

export function saveProgress(storage, state, now = Date.now()) {
  try {
    const existingRaw = storage.getItem(PROGRESS_KEY);
    if (existingRaw) {
      let existing;
      try {
        existing = JSON.parse(existingRaw);
      } catch {
        return { status: 'conflict' };
      }
      if (existing?.sessionId !== state.sessionId) {
        return { status: 'conflict' };
      }
      if (existing?.writerId !== state.writerId) {
        return { status: 'conflict' };
      }
    }
    storage.setItem(PROGRESS_KEY, JSON.stringify(snapshotForStorage(state, now)));
    return { status: 'saved' };
  } catch {
    return { status: 'unavailable' };
  }
}

export function claimProgress(storage, state, now = Date.now()) {
  try {
    const existingRaw = storage.getItem(PROGRESS_KEY);
    if (!existingRaw) return { status: 'conflict' };
    let existing;
    try {
      existing = JSON.parse(existingRaw);
    } catch {
      return { status: 'conflict' };
    }
    if (existing?.sessionId !== state.sessionId) return { status: 'conflict' };
    storage.setItem(PROGRESS_KEY, JSON.stringify(snapshotForStorage(state, now)));
    return { status: 'saved' };
  } catch {
    return { status: 'unavailable' };
  }
}

export function clearProgress(
  storage,
  expectedSessionId = null,
  expectedWriterId = null
) {
  try {
    if (expectedSessionId) {
      const existingRaw = storage.getItem(PROGRESS_KEY);
      if (existingRaw) {
        let existing;
        try {
          existing = JSON.parse(existingRaw);
        } catch {
          return false;
        }
        if (existing?.sessionId !== expectedSessionId) return false;
        if (expectedWriterId && existing?.writerId !== expectedWriterId) return false;
      }
    }
    storage.removeItem(PROGRESS_KEY);
    if (!expectedSessionId) storage.removeItem(LEGACY_PROGRESS_KEY);
    return true;
  } catch {
    return false;
  }
}

export function hasLegacyLocalData(storage) {
  try {
    return [
      LEGACY_PROGRESS_KEY,
      LEGACY_RESULT_KEY,
      LEGACY_DEVICE_ID_KEY
    ].some(key => storage.getItem(key) !== null);
  } catch {
    return false;
  }
}

export function hasLegacyResultData(storage) {
  try {
    return [
      LEGACY_RESULT_KEY,
      LEGACY_DEVICE_ID_KEY
    ].some(key => storage.getItem(key) !== null);
  } catch {
    return false;
  }
}

export function clearLegacyLocalData(storage) {
  try {
    storage.removeItem(LEGACY_PROGRESS_KEY);
    storage.removeItem(LEGACY_RESULT_KEY);
    storage.removeItem(LEGACY_DEVICE_ID_KEY);
    return true;
  } catch {
    return false;
  }
}

export function clearAllStoredTestData(storage) {
  const progressCleared = clearProgress(storage);
  let currentResultCleared = true;
  try {
    storage.removeItem(RESULT_KEY);
  } catch {
    currentResultCleared = false;
  }
  return progressCleared
    && currentResultCleared
    && clearLegacyLocalData(storage);
}

export function routeTiming(state, completedAt = Date.now()) {
  const active = activeTimeMs(state, completedAt);
  const segments = [...state.timing.segments];
  if (finiteTimestamp(state.timing.segmentStartedAt)) {
    const startedAt = Number(state.timing.segmentStartedAt);
    segments.push({ startedAt, endedAt: completedAt, durationMs: Math.max(0, completedAt - startedAt) });
  }
  return {
    startedAt: new Date(state.timing.startedAt).toISOString(),
    completedAt: new Date(completedAt).toISOString(),
    wallDurationMs: Math.max(0, completedAt - state.timing.startedAt),
    activeDurationMs: active,
    segments: segments.map(segment => ({
      startedAt: new Date(segment.startedAt).toISOString(),
      endedAt: new Date(segment.endedAt).toISOString(),
      durationMs: segment.durationMs
    }))
  };
}

export { RESPONSE_VALUES };
