import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { buildRouteItems, getItemById } from '../assets/test/scoring.js';
import {
  activeTimeMs,
  claimProgress,
  clearAllStoredTestData,
  clearProgress,
  hasLegacyLocalData,
  LEGACY_DEVICE_ID_KEY,
  LEGACY_PROGRESS_KEY,
  LEGACY_RESULT_KEY,
  markItemShown,
  newRouteState,
  pauseRoute,
  PROGRESS_KEY,
  readProgress,
  recordAnswer,
  responseRecord,
  restoreProgress,
  resumeRoute,
  saveProgress,
  snapshotForStorage,
  validateProgress
} from '../assets/test/state.js';

const instrumentsDirectory = new URL('../assets/instruments/', import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL('instrument-manifest.json', instrumentsDirectory), 'utf8')
);
const bank = JSON.parse(
  await readFile(new URL(manifest.file, instrumentsDirectory), 'utf8')
);
const itemById = getItemById(bank);
const allowedTestKeys = ['psychosophy', 'temporistics', 'socionics'];
const validationContext = {
  bankVersion: manifest.bankVersion,
  bankSha256: manifest.sha256,
  allowedTestKeys,
  itemById,
  bank
};

class MemoryStorage {
  #values = new Map();

  getItem(key) {
    return this.#values.has(key) ? this.#values.get(key) : null;
  }

  setItem(key, value) {
    this.#values.set(key, String(value));
  }

  removeItem(key) {
    this.#values.delete(key);
  }
}

function fixtureState({
  testKeys = ['psychosophy'],
  now = 10_000,
  saveLocal = true
} = {}) {
  return newRouteState({
    questionBank: { version: manifest.bankVersion, sha256: manifest.sha256 },
    testKeys,
    orderSeed: 'progress-contract-seed',
    language: 'en',
    sessionId: 'progress-contract-session',
    saveLocal,
    now
  });
}

function validSnapshot() {
  const state = fixtureState();
  const item = buildRouteItems(
    bank,
    state.testKeys,
    state.orderSeed
  ).items[0];
  markItemShown(state, item.id, 10_100);
  recordAnswer(state, item.id, '4', 10_700);
  return snapshotForStorage(state, 11_000);
}

function clone(value) {
  return structuredClone(value);
}

test('strict progress validation accepts only the pinned v2 route shape', () => {
  const valid = validSnapshot();
  assert.deepEqual(validateProgress(valid, validationContext), { valid: true });

  const cases = [
    ['null shape', null, 'shape'],
    ['array shape', [], 'shape'],
    ['legacy schema', { ...clone(valid), schemaVersion: '1.0.0' }, 'schema'],
    ['research route', { ...clone(valid), routeVersion: 'research-adult-route-v0.6' }, 'route-version'],
    ['empty test keys', { ...clone(valid), testKeys: [] }, 'test-keys'],
    ['unknown test key', { ...clone(valid), testKeys: ['unknown'] }, 'test-keys'],
    ['duplicate test key', { ...clone(valid), testKeys: ['psychosophy', 'psychosophy'] }, 'test-keys'],
    ['unsupported two-module route', { ...clone(valid), testKeys: ['psychosophy', 'socionics'] }, 'test-keys'],
    ['reordered full route', { ...clone(valid), testKeys: ['socionics', 'temporistics', 'psychosophy'] }, 'test-keys'],
    ['empty seed', { ...clone(valid), orderSeed: '' }, 'order-seed'],
    ['blank seed', { ...clone(valid), orderSeed: '   ' }, 'order-seed'],
    ['empty session', { ...clone(valid), sessionId: '' }, 'session-id'],
    ['blank session', { ...clone(valid), sessionId: '   ' }, 'session-id'],
    ['empty writer', { ...clone(valid), writerId: '' }, 'writer-id'],
    ['unsupported language', { ...clone(valid), language: 'de' }, 'language'],
    ['negative step', { ...clone(valid), step: -1 }, 'step'],
    ['out-of-range step', { ...clone(valid), step: 49 }, 'step'],
    ['non-boolean storage flag', { ...clone(valid), saveLocal: 'yes' }, 'flags'],
    ['non-boolean initial storage flag', { ...clone(valid), progressStorageEnabledAtStart: 'yes' }, 'flags'],
    ['answers array', { ...clone(valid), answers: [] }, 'answers'],
    ['shown-at array', { ...clone(valid), shownAtActiveMs: [] }, 'shown-at'],
    ['missing timing', { ...clone(valid), timing: null }, 'timing']
  ];

  for (const [label, progress, reason] of cases) {
    assert.deepEqual(
      validateProgress(progress, validationContext),
      { valid: false, reason },
      label
    );
  }
});

test('progress rejects invalid response keys, values, and timing segments', () => {
  const base = validSnapshot();
  const answeredId = Object.keys(base.answers)[0];
  const attention = [...itemById.values()].find(item =>
    item.testKey === 'psychosophy' && item.attention !== undefined
  );

  const unknownItem = clone(base);
  unknownItem.answers.unknown_item = unknownItem.answers[answeredId];
  delete unknownItem.answers[answeredId];
  assert.deepEqual(validateProgress(unknownItem, validationContext), { valid: false, reason: 'answers' });

  const unsupportedValue = clone(base);
  unsupportedValue.answers[answeredId].value = '6';
  assert.deepEqual(validateProgress(unsupportedValue, validationContext), { valid: false, reason: 'answers' });

  const numericValue = clone(base);
  numericValue.answers[answeredId].value = 4;
  assert.deepEqual(validateProgress(numericValue, validationContext), { valid: false, reason: 'answers' });

  const extraAnswerField = clone(base);
  extraAnswerField.answers[answeredId].legacyMode = 'classic';
  assert.deepEqual(validateProgress(extraAnswerField, validationContext), { valid: false, reason: 'answers' });

  const answerOutsideRoute = clone(base);
  const socionicsItem = [...itemById.values()].find(item =>
    item.testKey === 'socionics' && item.attention === undefined
  );
  answerOutsideRoute.answers = {
    [socionicsItem.id]: { value: '3', firstAnsweredActiveMs: 100, lastAnsweredActiveMs: 200, changed: false }
  };
  answerOutsideRoute.shownAtActiveMs = { [socionicsItem.id]: 50 };
  assert.deepEqual(validateProgress(answerOutsideRoute, validationContext), { valid: false, reason: 'shown-at' });

  const attentionNa = clone(base);
  const attentionState = fixtureState();
  const attentionRoute = buildRouteItems(
    bank,
    attentionState.testKeys,
    attentionState.orderSeed
  ).items;
  const attentionIndex = attentionRoute.findIndex(item => item.id === attention.id);
  let attentionNow = 10_010;
  attentionRoute.slice(0, attentionIndex + 1).forEach((item, index) => {
    markItemShown(attentionState, item.id, attentionNow);
    attentionNow += 10;
    recordAnswer(
      attentionState,
      item.id,
      index === attentionIndex ? 'na' : '4',
      attentionNow
    );
    attentionNow += 10;
  });
  attentionState.step = attentionIndex;
  const attentionSnapshot = snapshotForStorage(attentionState, attentionNow + 10);
  assert.deepEqual(validateProgress(attentionSnapshot, validationContext), { valid: true });

  const seedDrift = clone(base);
  seedDrift.orderSeed = 'different-replay-seed';
  assert.deepEqual(validateProgress(seedDrift, validationContext), { valid: false, reason: 'route-replay' });

  const unknownShownItem = clone(base);
  unknownShownItem.shownAtActiveMs.unknown_item = 100;
  assert.deepEqual(validateProgress(unknownShownItem, validationContext), { valid: false, reason: 'shown-at' });

  const shownAfterSave = clone(base);
  shownAfterSave.shownAtActiveMs[answeredId] = shownAfterSave.timing.activeTimeMs + 1;
  assert.deepEqual(validateProgress(shownAfterSave, validationContext), { valid: false, reason: 'shown-at' });

  const openStoredSegment = clone(base);
  openStoredSegment.timing.segmentStartedAt = 10_900;
  assert.deepEqual(validateProgress(openStoredSegment, validationContext), { valid: false, reason: 'timing' });

  const reversedSegment = clone(base);
  reversedSegment.timing.segments = [{ startedAt: 10_000, endedAt: 9_000, durationMs: 0 }];
  assert.deepEqual(validateProgress(reversedSegment, validationContext), { valid: false, reason: 'segments' });

  const inconsistentDuration = clone(base);
  inconsistentDuration.timing.segments[0].durationMs -= 1;
  assert.deepEqual(validateProgress(inconsistentDuration, validationContext), { valid: false, reason: 'segments' });

  const negativeActiveTime = clone(base);
  negativeActiveTime.timing.activeTimeMs = -1;
  assert.deepEqual(validateProgress(negativeActiveTime, validationContext), { valid: false, reason: 'timing' });

  const fractionalActiveTime = clone(base);
  fractionalActiveTime.timing.activeTimeMs += 0.5;
  assert.deepEqual(validateProgress(fractionalActiveTime, validationContext), { valid: false, reason: 'timing' });

  const fractionalSavedAt = clone(base);
  fractionalSavedAt.savedAt += 0.5;
  assert.deepEqual(validateProgress(fractionalSavedAt, validationContext), { valid: false, reason: 'timing' });
});

test('a bank mismatch and legacy storage are stale rather than resumable', () => {
  const current = validSnapshot();
  const staleVersion = clone(current);
  staleVersion.questionBank.version = `${manifest.bankVersion}-stale`;
  assert.deepEqual(
    validateProgress(staleVersion, validationContext),
    { valid: false, reason: 'bank-version', stale: true }
  );

  const staleHash = clone(current);
  staleHash.questionBank.sha256 = '0'.repeat(64);
  assert.deepEqual(
    validateProgress(staleHash, validationContext),
    { valid: false, reason: 'bank-version', stale: true }
  );

  const storage = new MemoryStorage();
  storage.setItem(PROGRESS_KEY, JSON.stringify(staleVersion));
  assert.deepEqual(readProgress(storage, validationContext), {
    status: 'stale',
    reason: 'bank-version'
  });

  storage.removeItem(PROGRESS_KEY);
  storage.setItem(LEGACY_PROGRESS_KEY, JSON.stringify({ schemaVersion: '1.0.0' }));
  assert.deepEqual(readProgress(storage, validationContext), {
    status: 'stale',
    reason: 'legacy-schema'
  });
});

test('saved progress round-trips without mutating the live route', () => {
  const state = fixtureState();
  const item = buildRouteItems(
    bank,
    state.testKeys,
    state.orderSeed
  ).items[0];
  markItemShown(state, item.id, 10_100);
  recordAnswer(state, item.id, '4', 10_700);

  const storage = new MemoryStorage();
  assert.deepEqual(saveProgress(storage, state, 11_000), { status: 'saved' });
  assert.equal(state.timing.activeTimeMs, 0, 'saving must not close or mutate the live segment');
  assert.equal(state.timing.segmentStartedAt, 10_000);

  const read = readProgress(storage, validationContext);
  assert.equal(read.status, 'valid');
  assert.equal(read.progress.schemaVersion, '2.0.0');
  assert.equal(read.progress.timing.activeTimeMs, 1000);
  assert.equal(read.progress.timing.segmentStartedAt, null);
  assert.deepEqual(read.progress.answers, state.answers);

  const restored = restoreProgress(read.progress, 50_000);
  assert.notEqual(restored.writerId, state.writerId);
  assert.equal(restored.timing.activeTimeMs, 1000);
  assert.equal(restored.timing.segmentStartedAt, 50_000);
  assert.equal(restored.paused, false);
  assert.equal(restored.dirty, true);
  assert.equal(activeTimeMs(restored, 50_000), 1000);
});

test('one tab claims a resumed route and prevents another writer from overwriting or clearing it', () => {
  const state = fixtureState();
  const firstItem = buildRouteItems(bank, state.testKeys, state.orderSeed).items[0];
  markItemShown(state, firstItem.id, 10_100);
  recordAnswer(state, firstItem.id, '4', 10_700);
  const storage = new MemoryStorage();
  assert.deepEqual(saveProgress(storage, state, 11_000), { status: 'saved' });

  const stored = readProgress(storage, validationContext);
  const resumed = restoreProgress(stored.progress, 20_000, 'new-tab-writer');
  assert.deepEqual(claimProgress(storage, resumed, 20_000), { status: 'saved' });
  assert.deepEqual(saveProgress(storage, state, 20_100), { status: 'conflict' });
  assert.equal(
    clearProgress(storage, state.sessionId, state.writerId),
    false,
    'the old tab must not clear the new tab’s claimed snapshot'
  );
  assert.equal(
    clearProgress(storage, resumed.sessionId, resumed.writerId),
    true
  );
});

test('legacy type-rich data is detected and removed only by the explicit all-data action', () => {
  const storage = new MemoryStorage();
  storage.setItem(LEGACY_PROGRESS_KEY, JSON.stringify({ schemaVersion: '1.0.0' }));
  storage.setItem(LEGACY_RESULT_KEY, JSON.stringify({ typeCode: 'LII' }));
  storage.setItem(LEGACY_DEVICE_ID_KEY, 'legacy-device-id');
  assert.equal(hasLegacyLocalData(storage), true);
  assert.equal(clearAllStoredTestData(storage), true);
  assert.equal(storage.getItem(LEGACY_PROGRESS_KEY), null);
  assert.equal(storage.getItem(LEGACY_RESULT_KEY), null);
  assert.equal(storage.getItem(LEGACY_DEVICE_ID_KEY), null);
  assert.equal(hasLegacyLocalData(storage), false);
});

test('the result records the initial progress choice after storage is later disabled', () => {
  const state = fixtureState({ saveLocal: true });
  assert.equal(state.progressStorageEnabledAtStart, true);
  state.saveLocal = false;
  assert.equal(state.progressStorageEnabledAtStart, true);
});

test('blocked storage degrades to an unavailable status without throwing', () => {
  const blockedStorage = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
    removeItem() {
      throw new Error('blocked');
    }
  };
  const state = fixtureState();
  assert.deepEqual(readProgress(blockedStorage, validationContext), {
    status: 'unavailable',
    reason: 'storage'
  });
  assert.deepEqual(saveProgress(blockedStorage, state), { status: 'unavailable' });
  assert.equal(clearAllStoredTestData(blockedStorage), false);
});

test('offline and paused time do not inflate active or per-item response time', () => {
  const state = fixtureState({ now: 1000, saveLocal: false });
  const item = [...itemById.values()].find(candidate =>
    candidate.testKey === 'psychosophy' && candidate.attention === undefined
  );

  markItemShown(state, item.id, 1100);
  pauseRoute(state, 1500);
  assert.equal(activeTimeMs(state, 90_000), 500, 'an explicit pause must stop active time');

  const pausedSnapshot = snapshotForStorage(state, 90_000);
  const restored = restoreProgress(pausedSnapshot, 100_000);
  assert.equal(activeTimeMs(restored, 100_000), 500, 'offline time must not be restored as active time');

  resumeRoute(restored, 100_000);
  markItemShown(restored, item.id, 100_000);
  recordAnswer(restored, item.id, '4', 100_600);
  const response = responseRecord(restored, item, 1, 12);
  assert.equal(activeTimeMs(restored, 100_600), 1100);
  assert.equal(response.responseTimeMs, 1000);
  assert.ok(
    response.responseTimeMs < 2000,
    'the 98.5-second offline gap must not leak into item response time'
  );
});
