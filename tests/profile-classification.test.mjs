import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  PUBLIC_CATEGORICAL_OUTPUT_ENABLED,
  publicPayloadIsDescriptiveOnly
} from '../assets/test/contract.js';
import {
  positionProfile,
  rankPositionCandidates,
  rankSocionicsCandidates,
  socionicsProfile
} from '../assets/test/scoring.js';

const bankPath = new URL('../assets/instruments/before-we-build-bank-2026-07-28.1.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const validationGates = JSON.parse(fs.readFileSync(
  new URL('../docs/research-support/validation-gates.json', import.meta.url),
  'utf8'
));
const { socionics, psychosophy, temporistics } = bank.tests;

function aggregatePositionMeans(testDefinition, meansByAspect, count = 3) {
  const scores = {};
  const counts = {};
  for (const aspect of testDefinition.aspects) {
    for (let position = 1; position <= 4; position += 1) {
      const scale = `${aspect}|${position}`;
      scores[scale] = meansByAspect[aspect][position - 1] * count;
      counts[scale] = count;
    }
  }
  return { scores, counts };
}

function forbiddenPublicKeys(value, found = []) {
  if (!value || typeof value !== 'object') return found;
  for (const [key, nested] of Object.entries(value)) {
    if (['code', 'displayCode', 'defined', 'typeCode', 'candidates', 'experimentalRanking'].includes(key)) {
      found.push(key);
    }
    forbiddenPublicKeys(nested, found);
  }
  return found;
}

test('Socionics produces eight descriptive dimensions instead of a TIM classification', () => {
  const scores = {
    Ti: 10,
    Te: 6,
    Fi: 5,
    Fe: 3,
    Si: 6,
    Se: 2,
    Ni: 6,
    Ne: 8
  };
  const counts = Object.fromEntries(socionics.dims.map(dimension => [dimension, 2]));
  const profile = socionicsProfile(socionics, scores, counts);

  assert.equal(profile.model, 'socionics-element-profile-v1');
  assert.equal(profile.calibrationStatus, 'exploratory');
  assert.deepEqual(Object.keys(profile.dimensions), socionics.dims);
  assert.equal(profile.dimensions.Ti.mean, 5);
  assert.equal(profile.dimensions.Ne.mean, 4);
  assert.equal(profile.dimensions.Se.mean, 1);
  assert.equal(profile.dimensions.Ti.answered, 2);
  assert.equal(profile.dimensions.Ti.expected, 2);
  assert.deepEqual(forbiddenPublicKeys(profile), []);
});

test('machine-readable G0-G6 gates keep public categorical output locked', () => {
  const required = validationGates.publicationPolicy
    .publicCategoricalTypeCodesAllowedWhen;
  const gatesById = new Map(validationGates.gates.map(gate => [gate.id, gate]));
  assert.deepEqual(required, ['G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6']);
  assert.ok(required.every(id => gatesById.has(id)));
  const allRequiredPassed = required.every(id =>
    gatesById.get(id).status === 'passed'
  );
  if (PUBLIC_CATEGORICAL_OUTPUT_ENABLED) {
    assert.equal(
      allRequiredPassed,
      true,
      'public categorical output cannot be enabled before every G0-G6 gate passes'
    );
  }
  assert.equal(PUBLIC_CATEGORICAL_OUTPUT_ENABLED, false);
});

test('Psychosophy public evidence describes four roles for every aspect', () => {
  const means = {
    'Воля': [2, 5, 1, 1],
    'Логика': [5, 2, 1, 1],
    'Эмоция': [1, 2, 5, 1],
    'Физика': [1, 1, 2, 5]
  };
  const { scores, counts } = aggregatePositionMeans(psychosophy, means);
  const profile = positionProfile(psychosophy, scores, counts);

  assert.equal(profile.aspects['Логика'].roles.target.mean, 5);
  assert.equal(profile.aspects['Воля'].roles.creative.mean, 5);
  assert.equal(profile.aspects['Эмоция'].roles.criterion.mean, 5);
  assert.equal(profile.aspects['Физика'].roles.resource.mean, 5);
  assert.deepEqual(forbiddenPublicKeys(profile), []);
});

test('Temporistics public evidence describes four roles for every aspect', () => {
  const means = {
    Past: [5, 2, 1, 1],
    Present: [1, 5, 2, 1],
    Future: [1, 1, 5, 2],
    Eternity: [2, 1, 1, 5]
  };
  const { scores, counts } = aggregatePositionMeans(temporistics, means);
  const profile = positionProfile(temporistics, scores, counts);

  assert.equal(profile.aspects.Past.roles.target.mean, 5);
  assert.equal(profile.aspects.Present.roles.creative.mean, 5);
  assert.equal(profile.aspects.Future.roles.criterion.mean, 5);
  assert.equal(profile.aspects.Eternity.roles.resource.mean, 5);
  assert.deepEqual(forbiddenPublicKeys(profile), []);
});

test('public payload policy accepts evidence and rejects type-like output', () => {
  const means = {
    'Воля': [2, 5, 1, 1],
    'Логика': [5, 2, 1, 1],
    'Эмоция': [1, 2, 5, 1],
    'Физика': [1, 1, 2, 5]
  };
  const { scores, counts } = aggregatePositionMeans(psychosophy, means);
  const descriptiveScores = {
    psychosophy: positionProfile(psychosophy, scores, counts),
    socionics: socionicsProfile(
      socionics,
      Object.fromEntries(socionics.dims.map(dimension => [dimension, 6])),
      Object.fromEntries(socionics.dims.map(dimension => [dimension, 2]))
    )
  };
  const publicPayload = { schemaVersion: '2.0.0', descriptiveScores };

  assert.equal(publicPayloadIsDescriptiveOnly(publicPayload), true);
  assert.equal(publicPayloadIsDescriptiveOnly({ ...publicPayload, experimentalRanking: [] }), false);
  assert.equal(
    publicPayloadIsDescriptiveOnly({
      ...publicPayload,
      descriptiveScores: { ...descriptiveScores, psychosophy: { defined: false } }
    }),
    false
  );
  assert.equal(
    publicPayloadIsDescriptiveOnly({
      ...publicPayload,
      descriptiveScores: { ...descriptiveScores, socionics: { typeCode: 'LII' } }
    }),
    false
  );
});

test('the same strong profile may be ranked only as precalibration research output', () => {
  const means = {
    'Воля': [2, 5, 1, 1],
    'Логика': [5, 2, 1, 1],
    'Эмоция': [1, 2, 5, 1],
    'Физика': [1, 1, 2, 5]
  };
  const { scores, counts } = aggregatePositionMeans(psychosophy, means);
  const ranking = rankPositionCandidates(
    psychosophy,
    positionProfile(psychosophy, scores, counts)
  );

  assert.equal(ranking[0].code, 'ЛВЭФ');
  assert.equal(ranking[0].calibrationStatus, 'precalibration');
  assert.equal(ranking[0].interpretation, 'experimental-ranking-only');
  assert.equal(Object.hasOwn(ranking[0], 'defined'), false);
  assert.equal(publicPayloadIsDescriptiveOnly({ experimentalRanking: ranking }), false);
});

test('Socionics TIM ranking exists only as explicit precalibration research output', () => {
  const scores = {
    Ti: 10,
    Te: 6,
    Fi: 5,
    Fe: 3,
    Si: 6,
    Se: 2,
    Ni: 6,
    Ne: 8
  };
  const counts = Object.fromEntries(socionics.dims.map(dimension => [dimension, 2]));
  const profile = socionicsProfile(socionics, scores, counts);
  const ranking = rankSocionicsCandidates(profile);

  assert.equal(ranking.length, 3);
  assert.equal(ranking[0].code, 'LII');
  assert.ok(ranking[0].fitScore > ranking[1].fitScore);
  assert.equal(ranking[0].model, 'socionics-tim-weighted-fit-v0');
  assert.equal(ranking[0].calibrationStatus, 'precalibration');
  assert.equal(ranking[0].interpretation, 'experimental-ranking-only');
  assert.ok(ranking.every(candidate => !Object.hasOwn(candidate, 'defined')));
  assert.equal(publicPayloadIsDescriptiveOnly({ experimentalRanking: ranking }), false);
});

test('experimental ranking abstains when no response is scorable', () => {
  const emptyPositionProfile = positionProfile(psychosophy, {}, {});
  const emptySocionicsProfile = socionicsProfile(socionics, {}, {});

  assert.deepEqual(
    rankPositionCandidates(psychosophy, emptyPositionProfile),
    []
  );
  assert.deepEqual(
    rankSocionicsCandidates(emptySocionicsProfile),
    []
  );
});
