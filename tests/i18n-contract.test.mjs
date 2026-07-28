import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { copyFor, SUPPORTED_LANGUAGES } from '../assets/test/i18n.js';

const nestedDictionaries = ['languageNames', 'exposureLevels', 'roles', 'aspects', 'socLabels'];

test('RU, EN, and UK use one complete, structurally identical dictionary each', () => {
  const reference = copyFor('uk');
  const referenceKeys = Object.keys(reference).sort();

  for (const language of SUPPORTED_LANGUAGES) {
    const copy = copyFor(language);
    assert.deepEqual(Object.keys(copy).sort(), referenceKeys, `${language} top-level keys`);
    for (const key of nestedDictionaries) {
      assert.deepEqual(
        Object.keys(copy[key]).sort(),
        Object.keys(reference[key]).sort(),
        `${language} ${key} keys`
      );
    }
    for (const [key, value] of Object.entries(copy)) {
      if (nestedDictionaries.includes(key)) continue;
      assert.equal(typeof value, 'string', `${language}.${key} must be a string`);
      assert.ok(value.trim(), `${language}.${key} must not be empty`);
    }
  }
});

test('every static localization and accessibility key resolves in all languages', () => {
  for (const file of ['index.html', 'research-tests.html']) {
    const html = fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    const keys = [...html.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/gu)]
      .map(match => match[1]);
    assert.ok(keys.length > 0, `${file} must expose static localization keys`);
    for (const language of SUPPORTED_LANGUAGES) {
      const copy = copyFor(language);
      for (const key of keys) {
        assert.equal(typeof copy[key], 'string', `${file}: ${language}.${key}`);
      }
    }
  }
});

test('route sizes and the unified six-choice response vocabulary stay explicit', () => {
  for (const language of SUPPORTED_LANGUAGES) {
    const copy = copyFor(language);
    assert.match(copy.routePsychosophyText, /48/u);
    assert.match(copy.routeTemporisticsText, /48/u);
    assert.match(copy.routeSocionicsText, /16/u);
    assert.match(copy.routeAllText, /112/u);
    for (const key of ['scale1', 'scale2', 'scale3', 'scale4', 'scale5', 'notApplicable']) {
      assert.ok(copy[key].trim(), `${language}.${key}`);
    }
  }
});
