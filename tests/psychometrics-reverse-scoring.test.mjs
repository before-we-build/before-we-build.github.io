import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { scoreModule } from '../assets/test/scoring.js';

const bankPath = new URL('../assets/instruments/before-we-build-bank-2026-07-28.1.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const { socionics, psychosophy, temporistics } = bank.tests;

function contentItems(testDefinition) {
  return testDefinition.items.filter(item => item.attention === undefined);
}

test('Socionics uses a balanced direct/reverse item pair for every dimension', () => {
  const items = contentItems(socionics);
  assert.equal(items.length, 16);
  assert.equal(items.filter(item => item.reverse).length, 8);

  for (const dimension of socionics.dims) {
    const pair = items.filter(item => item.scale === dimension);
    assert.equal(pair.length, 2, `${dimension} must contain two indicators`);
    assert.equal(pair.filter(item => item.reverse).length, 1, `${dimension} must contain one reverse indicator`);
    assert.equal(pair.filter(item => !item.reverse).length, 1, `${dimension} must contain one direct indicator`);
  }
});

test('every reverse-coded item contains a semantic reversal in all deployed text', () => {
  const reversalPatterns = {
    ru: /тяжело|сложно|трудно|игнорирую|неинтересно|в последнюю очередь|сбивает/u,
    en: /hard|difficult|ignore|least of all|struggle|confuses/u,
    uk: /важко|складно|ігнорую|в останню чергу|збиває/u
  };

  for (const item of contentItems(socionics).filter(candidate => candidate.reverse)) {
    for (const language of ['ru', 'en', 'uk']) {
      assert.match(
        item.text[language].toLowerCase(),
        reversalPatterns[language],
        `${item.id} is marked reverse but ${language} does not express reversal`
      );
    }
  }
});

test('scoreModule applies 6 - raw only to reverse-coded items', () => {
  const tiItems = contentItems(socionics).filter(item => item.scale === 'Ti');
  const direct = tiItems.find(item => !item.reverse);
  const reverse = tiItems.find(item => item.reverse);
  assert.ok(direct);
  assert.ok(reverse);

  const bothRawFive = scoreModule(socionics, [
    { itemId: direct.id, responseValue: 5, notApplicable: false },
    { itemId: reverse.id, responseValue: 5, notApplicable: false }
  ]);
  assert.equal(bothRawFive.scores.Ti, 6, 'Direct 5 plus reversed 5 must score 5 + 1');
  assert.equal(bothRawFive.counts.Ti, 2);
  assert.equal(bothRawFive.descriptiveScores.dimensions.Ti.mean, 3);

  const reverseRawOne = scoreModule(socionics, [
    { itemId: direct.id, responseValue: 5, notApplicable: false },
    { itemId: reverse.id, responseValue: 1, notApplicable: false }
  ]);
  assert.equal(reverseRawOne.scores.Ti, 10, 'Direct 5 plus reversed 1 must score 5 + 5');
  assert.equal(reverseRawOne.descriptiveScores.dimensions.Ti.mean, 5);
});

test('N/A and missing values never enter scale totals', () => {
  const [direct, reverse] = contentItems(socionics).filter(item => item.scale === 'Te');
  const result = scoreModule(socionics, [
    {
      itemId: direct.id,
      responseValue: null,
      notApplicable: true
    },
    {
      itemId: reverse.id,
      responseValue: null,
      notApplicable: false
    }
  ]);

  assert.equal(result.scores.Te, undefined);
  assert.equal(result.counts.Te, undefined);
  assert.equal(result.descriptiveScores.dimensions.Te.mean, null);
  assert.equal(result.descriptiveScores.dimensions.Te.answered, 0);
  assert.equal(result.missing, true);
});

test('content N/A is a completed response rather than a missing response', () => {
  const direct = contentItems(socionics).find(item => item.scale === 'Te');
  const result = scoreModule(socionics, [{
    itemId: direct.id,
    responseValue: null,
    notApplicable: true
  }]);

  assert.equal(result.missing, false);
  assert.equal(result.scores.Te, undefined);
  assert.equal(result.descriptiveScores.dimensions.Te.answered, 0);
});

test('position instruments use direct matched-vignette indicators only', () => {
  for (const [label, testDefinition] of [
    ['Psychosophy', psychosophy],
    ['Temporistics', temporistics]
  ]) {
    const items = contentItems(testDefinition);
    assert.equal(items.length, 48, `${label} must contain 48 content items`);
    assert.equal(new Set(items.map(item => item.id)).size, 48);
    assert.ok(items.every(item => item.reverse === false));
    assert.ok(items.every(item => item.version === '3.0'));
    assert.ok(items.every(item => item.responseMode === 'matched-vignette'));

    for (const aspect of testDefinition.aspects) {
      for (const position of [1, 2, 3, 4]) {
        const cell = items.filter(item => item.scale === `${aspect}|${position}`);
        assert.equal(cell.length, 3, `${label} ${aspect}|${position} must contain three indicators`);
        assert.equal(new Set(cell.map(item => item.indicator)).size, 3);
      }
    }
  }
});

test('direct position responses retain their raw Likert value', () => {
  const scale = `${psychosophy.aspects[0]}|1`;
  const cell = contentItems(psychosophy).filter(item => item.scale === scale);
  const responses = cell.map(item => ({
    itemId: item.id,
    responseValue: 5,
    notApplicable: false
  }));
  const result = scoreModule(psychosophy, responses);

  assert.equal(result.scores[scale], 15);
  assert.equal(result.counts[scale], 3);
  assert.equal(result.descriptiveScores.aspects[psychosophy.aspects[0]].roles.target.mean, 5);
});

test('attention responses are evaluated but never added to psychometric scores', () => {
  const attention = socionics.items.find(item => item.attention !== undefined);
  const passed = scoreModule(socionics, [
    { itemId: attention.id, responseValue: attention.attention, notApplicable: false }
  ]);

  assert.equal(passed.attentionCheckPresented, true);
  assert.equal(passed.failedAttentionCheck, false);
  assert.deepEqual(passed.scores, {});
  assert.deepEqual(passed.counts, {});

  const failed = scoreModule(socionics, [
    { itemId: attention.id, responseValue: 5, notApplicable: false }
  ]);
  assert.equal(failed.attentionCheckPresented, true);
  assert.equal(failed.failedAttentionCheck, true);
  assert.deepEqual(failed.scores, {});
});
