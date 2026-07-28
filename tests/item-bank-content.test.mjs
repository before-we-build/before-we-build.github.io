import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { validateQuestionBank } from '../assets/test/bank.js';

const instrumentDirectory = path.resolve('assets/instruments');
const manifest = JSON.parse(
  fs.readFileSync(path.join(instrumentDirectory, 'instrument-manifest.json'), 'utf8')
);
const pinnedBank = JSON.parse(
  fs.readFileSync(path.join(instrumentDirectory, manifest.file), 'utf8')
);
const TESTS = validateQuestionBank(pinnedBank, manifest).tests;

const firstSentence = text => text.split(/(?<=\.)\s+/u)[0];
const words = text => text.trim().split(/\s+/u).filter(Boolean).length;

function assertMatchedQuartets(items, label) {
  const groups = Map.groupBy
    ? Map.groupBy(items, item => item.tetradId)
    : items.reduce((map, item) => {
      const group = map.get(item.tetradId) || [];
      group.push(item);
      map.set(item.tetradId, group);
      return map;
    }, new Map());

  for (const [tetradId, quartet] of groups) {
    assert.ok(tetradId, `${label} matched item must declare tetradId`);
    assert.equal(quartet.length, 4, `${label} ${tetradId} must contain four positions`);
    assert.deepEqual(
      new Set(quartet.map(item => item.position)),
      new Set([1, 2, 3, 4]),
      `${label} ${tetradId} must cover all four roles`
    );
    for (const language of ['ru', 'en', 'uk']) {
      assert.equal(
        new Set(quartet.map(item => firstSentence(item.text[language]))).size,
        1,
        `${label} ${tetradId} must keep the ${language} stimulus identical`
      );
    }
  }
}

test('Temporistics is implemented as twelve true matched vignette quartets', () => {
  const items = TESTS.temporistics.items.filter(item => !item.attention);
  assert.equal(items.length, 48);
  assert.ok(items.every(item => item.responseMode === 'matched-vignette'));
  assert.ok(items.every(item => item.contextDomain));
  assert.equal(new Set(items.map(item => item.tetradId)).size, 12);
  assertMatchedQuartets(items, 'Temporistics');
});

test('Psychosophy is implemented as twelve true matched vignette quartets', () => {
  const items = TESTS.psychosophy.items.filter(
    item => !item.attention && item.responseMode === 'matched-vignette'
  );
  assert.equal(items.length, 48);
  assert.ok(items.every(item => item.contextDomain));
  assert.equal(new Set(items.map(item => item.tetradId)).size, 12);
  assertMatchedQuartets(items, 'Psychosophy');
});

test('position roles use one shared functional vocabulary across both banks', () => {
  const expected = new Map([
    [1, 'target'],
    [2, 'creative'],
    [3, 'criterion'],
    [4, 'resource']
  ]);
  for (const testDefinition of [TESTS.psychosophy, TESTS.temporistics]) {
    for (const item of testDefinition.items.filter(candidate => !candidate.attention)) {
      assert.equal(item.positionRole, expected.get(item.position));
      assert.equal(item.version, '3.0');
    }
  }
});

test('matched vignettes remain within the pilot reading-load ceiling', () => {
  const matched = [TESTS.psychosophy, TESTS.temporistics]
    .flatMap(testDefinition => testDefinition.items)
    .filter(item => !item.attention && item.responseMode === 'matched-vignette');
  for (const item of matched) {
    for (const language of ['ru', 'en', 'uk']) {
      assert.ok(
        words(item.text[language]) <= 40,
        `${item.id} ${language} exceeds the 40-word pilot ceiling`
      );
    }
  }
});

test('reading load is balanced across roles within and across quartets', () => {
  for (const [label, testDefinition] of [
    ['Psychosophy', TESTS.psychosophy],
    ['Temporistics', TESTS.temporistics]
  ]) {
    const items = testDefinition.items.filter(item => !item.attention);
    for (const language of ['ru', 'en', 'uk']) {
      const positionMeans = [1, 2, 3, 4].map(position => {
        const counts = items
          .filter(item => item.position === position)
          .map(item => words(item.text[language]));
        return counts.reduce((sum, count) => sum + count, 0) / counts.length;
      });
      assert.ok(
        Math.max(...positionMeans) - Math.min(...positionMeans) <= 3,
        `${label} ${language} has a systematic role-length cue`
      );

      for (const tetradId of new Set(items.map(item => item.tetradId))) {
        const counts = items
          .filter(item => item.tetradId === tetradId)
          .map(item => words(item.text[language]));
        assert.ok(
          Math.max(...counts) - Math.min(...counts) <= 6,
          `${label} ${tetradId} ${language} has an imbalanced reading load`
        );
      }
    }
  }
});

test('role clauses avoid the original trait-shortcut vocabulary', () => {
  const forbidden = {
    1: {
      ru: /увер|без сомнен/u,
      en: /confiden|without doubt/u,
      uk: /впевнен|без сумнів/u
    },
    2: {
      ru: /помога|подстраива|уступа/u,
      en: /help(?:ing)? others|adapt to others|give in/u,
      uk: /допомага|підлаштов|поступа/u
    },
    3: {
      ru: /тревог|беспоко|сомнева|перепровер|проверя|боюсь/u,
      en: /anxi|worr|doubt|double-check|check repeatedly|afraid/u,
      uk: /тривог|непоко|сумніва|перевіря|боюся/u
    },
    4: {
      ru: /достаточ|перв(?:ый|ого) попав|не вмеш|откладыва|избега|без усили|готовый шаблон/u,
      en: /enough|first available|stay out|postpone|avoid|without effort|ready-made/u,
      uk: /достатн|перш(?:ий|ого) ліпш|не втруча|відклада|уника|без зусил|готовий шаблон/u
    }
  };

  for (const testDefinition of [TESTS.psychosophy, TESTS.temporistics]) {
    for (const item of testDefinition.items.filter(candidate => !candidate.attention)) {
      for (const language of ['ru', 'en', 'uk']) {
        const text = item.text[language];
        const roleClause = text.slice(firstSentence(text).length).toLowerCase();
        assert.doesNotMatch(
          roleClause,
          forbidden[item.position][language],
          `${item.id} ${language} reintroduces a trait shortcut`
        );
      }
    }
  }
});

test('pinned banks cannot bypass the matched-vignette contract', () => {
  const invalidBank = structuredClone(pinnedBank);
  delete invalidBank.tests.psychosophy.items.find(item => !item.attention).tetradId;
  assert.throws(
    () => validateQuestionBank(invalidBank, manifest),
    /tetradId is required/
  );
});
