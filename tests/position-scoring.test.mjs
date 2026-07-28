import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  positionProfile,
  rankPositionCandidates,
  scoreModule,
  shuffle
} from '../assets/test/scoring.js';

const bankPath = new URL('../assets/instruments/before-we-build-bank-2026-07-28.1.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const psychosophy = bank.tests.psychosophy;
const temporistics = bank.tests.temporistics;

function aggregatePositionMeans(testDefinition, meansByAspect, count = 3) {
  const scores = {};
  const counts = {};
  for (const aspect of testDefinition.aspects) {
    const means = meansByAspect[aspect];
    assert.equal(means?.length, 4, `${aspect} fixture must contain four position means`);
    for (let position = 1; position <= 4; position += 1) {
      const scale = `${aspect}|${position}`;
      scores[scale] = means[position - 1] * count;
      counts[scale] = count;
    }
  }
  return { scores, counts };
}

function strongMeans(testDefinition, orderedAspects) {
  return Object.fromEntries(testDefinition.aspects.map(aspect => {
    const assignedPosition = orderedAspects.indexOf(aspect) + 1;
    return [aspect, [
      assignedPosition === 1 ? 5 : 1,
      assignedPosition === 2 ? 5 : 1,
      assignedPosition === 3 ? 5 : 1,
      assignedPosition === 4 ? 5 : 1
    ]];
  }));
}

function responseFixture(testDefinition, meansByAspect) {
  return testDefinition.items.map(item => ({
    itemId: item.id,
    responseValue: item.attention ?? meansByAspect[item.aspect][item.position - 1],
    notApplicable: false
  }));
}

test('position profiles report role means and centered contrasts without a type claim', () => {
  const means = strongMeans(psychosophy, ['Логика', 'Воля', 'Эмоция', 'Физика']);
  const { scores, counts } = aggregatePositionMeans(psychosophy, means);
  const profile = positionProfile(psychosophy, scores, counts);

  assert.equal(profile.model, 'multi-indicator-position-contrast-v2');
  assert.equal(profile.calibrationStatus, 'precalibration');
  assert.equal(Object.hasOwn(profile, 'code'), false);
  assert.equal(Object.hasOwn(profile, 'defined'), false);
  assert.equal(Object.hasOwn(profile, 'candidates'), false);

  for (const aspect of psychosophy.aspects) {
    const aspectProfile = profile.aspects[aspect];
    const assignedPosition = ['Логика', 'Воля', 'Эмоция', 'Физика'].indexOf(aspect) + 1;
    const assignedRole = ['target', 'creative', 'criterion', 'resource'][assignedPosition - 1];

    assert.equal(aspectProfile.answered, 12);
    assert.equal(aspectProfile.expected, 12);
    assert.equal(aspectProfile.coverageComplete, true);
    assert.equal(aspectProfile.roles[assignedRole].position, assignedPosition);
    assert.equal(aspectProfile.roles[assignedRole].mean, 5);
    assert.equal(aspectProfile.roles[assignedRole].contrast, 0.75);
  }
});

test('research position ranking is explicitly experimental and never exposes defined', () => {
  const fixtures = [
    {
      testDefinition: psychosophy,
      order: ['Логика', 'Воля', 'Эмоция', 'Физика'],
      code: 'ЛВЭФ',
      displayCode: 'ЛВЭФ'
    },
    {
      testDefinition: temporistics,
      order: ['Past', 'Present', 'Future', 'Eternity'],
      code: 'PNFE',
      displayCode: 'Ми-Тп-Мб-Вч'
    }
  ];

  for (const fixture of fixtures) {
    const means = strongMeans(fixture.testDefinition, fixture.order);
    const { scores, counts } = aggregatePositionMeans(fixture.testDefinition, means);
    const profile = positionProfile(fixture.testDefinition, scores, counts);
    const ranking = rankPositionCandidates(fixture.testDefinition, profile);

    assert.equal(ranking.length, 3);
    assert.equal(ranking[0].code, fixture.code);
    assert.equal(ranking[0].displayCode, fixture.displayCode);
    assert.ok(ranking[0].contrastScore > ranking[1].contrastScore);
    for (const candidate of ranking) {
      assert.equal(candidate.calibrationStatus, 'precalibration');
      assert.equal(candidate.interpretation, 'experimental-ranking-only');
      assert.equal(Object.hasOwn(candidate, 'defined'), false);
      assert.equal(Object.hasOwn(candidate, 'confidence'), false);
    }
  }
});

test('flat response styles remain flat in the descriptive profile', () => {
  for (const responseMean of [3, 5]) {
    const means = Object.fromEntries(
      psychosophy.aspects.map(aspect => [aspect, [responseMean, responseMean, responseMean, responseMean]])
    );
    const { scores, counts } = aggregatePositionMeans(psychosophy, means);
    const profile = positionProfile(psychosophy, scores, counts);

    for (const aspectProfile of Object.values(profile.aspects)) {
      assert.equal(aspectProfile.coverageComplete, true);
      for (const role of Object.values(aspectProfile.roles)) {
        assert.equal(role.mean, responseMean);
        assert.equal(role.contrast, 0);
      }
    }

    const ranking = rankPositionCandidates(psychosophy, profile);
    assert.ok(ranking.every(candidate => candidate.contrastScore === 0));
    assert.ok(ranking.every(candidate => candidate.heuristicSeparation === 0));
    assert.ok(ranking.every(candidate => !Object.hasOwn(candidate, 'defined')));
  }
});

test('missing cells stay missing and make coverage explicitly incomplete', () => {
  const means = strongMeans(psychosophy, ['Логика', 'Воля', 'Эмоция', 'Физика']);
  const { scores, counts } = aggregatePositionMeans(psychosophy, means);
  delete scores['Физика|4'];
  delete counts['Физика|4'];

  const profile = positionProfile(psychosophy, scores, counts);
  const physics = profile.aspects['Физика'];

  assert.equal(physics.answered, 9);
  assert.equal(physics.expected, 12);
  assert.equal(physics.coverageComplete, false);
  assert.equal(physics.roles.resource.answered, 0);
  assert.equal(physics.roles.resource.expected, 3);
  assert.equal(physics.roles.resource.mean, null);
  assert.equal(physics.roles.resource.contrast, null);
});

test('scoreModule keeps descriptive evidence separate from research ranking', () => {
  const means = strongMeans(psychosophy, ['Логика', 'Воля', 'Эмоция', 'Физика']);
  const responses = responseFixture(psychosophy, means);
  const publicResult = scoreModule(psychosophy, responses);
  assert.equal(Object.hasOwn(publicResult, 'experimentalRanking'), false);

  const result = scoreModule(
    psychosophy,
    responses,
    { includeExperimentalRanking: true }
  );

  assert.equal(result.attentionCheckPresented, true);
  assert.equal(result.failedAttentionCheck, false);
  assert.equal(result.descriptiveScores.aspects['Логика'].roles.target.mean, 5);
  assert.equal(Object.hasOwn(result.descriptiveScores, 'experimentalRanking'), false);
  assert.equal(Object.hasOwn(result.descriptiveScores, 'defined'), false);
  assert.equal(result.experimentalRanking[0].code, 'ЛВЭФ');
  assert.ok(result.experimentalRanking.every(candidate => !Object.hasOwn(candidate, 'defined')));
});

test('seeded shuffle is deterministic, seed-sensitive, and non-mutating', () => {
  const source = Array.from({ length: 24 }, (_, index) => index);
  const snapshot = [...source];

  assert.deepEqual(shuffle(source, 'aaaaaaaa'), shuffle(source, 'aaaaaaaa'));
  assert.notDeepEqual(
    shuffle(source, 'aaaaaaaa'),
    shuffle(source, 'bbbbbbbb'),
    'Seeds of the same length must still produce different orders'
  );
  assert.deepEqual(source, snapshot);
});
