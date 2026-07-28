import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const ROOT = path.resolve('.');
const ASSETS = path.join(ROOT, 'assets');
const PRODUCTION_EXTENSIONS = new Set(['.html', '.css', '.js', '.mjs']);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

const productionFiles = [
  ...fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.html'))
    .map(entry => path.join(ROOT, entry.name)),
  ...walk(ASSETS).filter(file => PRODUCTION_EXTENSIONS.has(path.extname(file)))
];

/*
 * These are the only age-related phrases this regression guard intentionally
 * ignores. The research route may state adult eligibility and collect adult
 * age bands; neither is a child-specific presentation mode.
 */
const ADULT_ONLY_ELIGIBILITY_ALLOWLIST = [
  /(?<!\d)18\+(?!\d)/gu,
  /(?<!\d)18\s+(?:years?\s+(?:old\s+)?or\s+older|and\s+over)(?!\p{L})/giu,
  /\badults?\s+only\b/giu,
  /\badult\s+(?:eligibility|participants?|respondents?)\b/giu,
  /\bminors?\s+(?:cannot|may not|are not eligible to)\s+participate\b/giu,
  /\bnot\s+available\s+to\s+minors?\b/giu,
  /(?<![\p{L}\p{N}])(?:18-24|25-34|35-44|45-54|55\+)(?![\p{L}\p{N}])/gu,
  /(?<!\p{L})(?:только|лише)\s+(?:для\s+)?(?:взрослых|дорослих|совершеннолетних|повнолітніх)(?!\p{L})/giu,
  /(?<!\p{L})(?:совершеннолетн\p{L}*|повнолітн\p{L}*)(?!\p{L})/giu,
  /(?<!\p{L})(?:подтверждаю|підтверджую)[^\n.]{0,100}(?<!\d)18(?!\d)/giu,
  /(?<!\p{L})(?:несовершеннолетние|неповнолітні)\s+не\s+(?:могут|можуть)\s+(?:участвовать|брати\s+участь)(?!\p{L})/giu
];

function removeAllowedAdultEligibility(source) {
  return ADULT_ONLY_ELIGIBILITY_ALLOWLIST.reduce(
    (cleaned, pattern) => cleaned.replace(pattern, '<allowed-adult-eligibility>'),
    source
  );
}

const forbiddenRemnants = [
  {
    label: 'legacy public age-mode identifier',
    pattern: /\b(?:publicAge\w*|selectedAge|data-public-age)\b/giu
  },
  {
    label: 'legacy public presentation-mode identifier',
    pattern: /\b(?:publicMode\w*|publicPrefs|applyPublicPrefs)\b/gu
  },
  {
    label: 'legacy classic or visual mode payload',
    pattern: /\bmode\s*:\s*['"](?:classic|visual)['"]/giu
  },
  {
    label: 'child or minor route',
    pattern: /\b(?:child(?:ren)?|kids?|minors?|underage|under[- ]?18)\b|(?:детск|реб[её]н|несовершеннолет|дитяч|дитин|неповноліт)\w*|(?:до|младше)\s+18/giu
  },
  {
    label: 'legacy game renderer',
    pattern: /\b(?:gameKind|gameCopy|gameIcon|gameControlClass|renderGameItem|scenePrompt)\b/gu
  },
  {
    label: 'legacy game/story selector',
    pattern: /(?:story-(?:test|card|scene|hint|meaning|feedback|progress|feed)|game-(?:visual|scale|choice)|data-game|pocket-board|mine-field|bridge-builder|compass-wheel|phrase-board|attention-board)/giu
  },
  {
    label: 'legacy game metaphor or copy',
    pattern: /\b(?:visual journey|game cards?|short cards?|put it in your backpack|mine or nothing|bridge plank|turn the compass|what you take with you)\b|(?:визуальн\p{L}*\s+маршрут|игров\p{L}*\s+карточ|коротк\p{L}*\s+карточ|рюкзак|мина\s+или|доска\s+для\s+моста|повернуть\s+компас|что\s+вы\s+бер[её]те|обезвреж|візуальн\p{L}*\s+маршрут|ігров\p{L}*\s+картк|коротк\p{L}*\s+картк|рюкзак|міна\s+чи|дошка\s+для\s+мосту|повернути\s+компас|що\s+ви\s+берете|знешкодж)/giu
  },
  {
    label: 'legacy age-driven public copy',
    pattern: /(?:choose\s+your\s+age\s+first|the\s+test\s+format\s+will\s+be\s+selected\s+automatically\s+by\s+age|age\s*[—-]\s*optional|сначала\s+выберите\s+возраст|формат\s+теста\s+подбер[её]тся\s+автоматически\s+по\s+возрасту|возраст\s*[—-]\s*необязательно|спочатку\s+оберіть\s+вік|формат\s+тесту\s+буде\s+підібрано\s+автоматично\s+за\s+віком|вік\s*[—-]\s*необов’язково)/giu
  }
];

test('production has no child, game, or public age-mode remnants', () => {
  assert.ok(productionFiles.length > 0, 'No production HTML/CSS/JS files were found');

  const failures = [];
  for (const file of productionFiles) {
    const relative = path.relative(ROOT, file);
    const source = removeAllowedAdultEligibility(fs.readFileSync(file, 'utf8'));

    for (const { label, pattern } of forbiddenRemnants) {
      pattern.lastIndex = 0;
      for (const match of source.matchAll(pattern)) {
        const line = source.slice(0, match.index).split('\n').length;
        failures.push(`${relative}:${line}: ${label}: ${JSON.stringify(match[0])}`);
      }
    }
  }

  assert.equal(
    failures.length,
    0,
    `Removed presentation modes must not return:\n${failures.join('\n')}`
  );
});
