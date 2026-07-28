const MANIFEST_URL = new URL('../instruments/instrument-manifest.json', import.meta.url);
const POSITION_MODEL = 'multi-indicator-position-contrast-v2';
const POSITION_ROLES = { 1: 'target', 2: 'creative', 3: 'criterion', 4: 'resource' };
const LANGUAGES = ['ru', 'en', 'uk'];
const MODULE_KEYS = ['socionics', 'psychosophy', 'temporistics'];
const AUTHORING_SOURCE = 'before-we-build-research/instruments/pilot-question-bank.md';
const SNAPSHOT_DISTRIBUTION = 'same-origin-release-snapshot';

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function assertLabels(labels, label) {
  for (const language of LANGUAGES) {
    invariant(Array.isArray(labels?.[language]), `${label}: labels.${language} is missing`);
    invariant(labels[language].length >= 2, `${label}: labels.${language} is incomplete`);
    invariant(labels[language].every(value => typeof value === 'string' && value.trim()), `${label}: labels.${language} is invalid`);
  }
}

function assertItem(item, testKey) {
  invariant(item && /^[A-Za-z0-9_-]+$/.test(item.id || ''), `${testKey}: invalid item id`);
  invariant(typeof item.version === 'string' && item.version.trim(), `${testKey}/${item.id}: item version is required`);
  invariant(typeof item.scale === 'string' && item.scale.trim(), `${testKey}/${item.id}: scale is required`);
  for (const language of LANGUAGES) {
    invariant(typeof item.text?.[language] === 'string' && item.text[language].trim(), `${testKey}/${item.id}: text.${language} is required`);
  }
  if (item.attention !== undefined) {
    invariant(Number.isInteger(item.attention) && item.attention >= 1 && item.attention <= 5, `${testKey}/${item.id}: invalid attention answer`);
  } else {
    invariant(typeof item.reverse === 'boolean', `${testKey}/${item.id}: reverse flag is required`);
  }
}

function assertPositionModule(test, key) {
  invariant(test.mode === 'position', `${key}: mode must be position`);
  invariant(test.measurementModel === POSITION_MODEL, `${key}: unsupported measurement model`);
  invariant(test.calibrationStatus === 'precalibration', `${key}: calibration status must be precalibration`);
  invariant(Array.isArray(test.aspects) && test.aspects.length === 4 && new Set(test.aspects).size === 4, `${key}: four unique aspects are required`);
  const content = test.items.filter(item => item.attention === undefined);
  invariant(content.length >= 48, `${key}: at least 48 content items are required`);

  for (const item of content) {
    invariant(test.aspects.includes(item.aspect), `${key}/${item.id}: invalid aspect`);
    invariant(Number.isInteger(item.position) && POSITION_ROLES[item.position], `${key}/${item.id}: invalid position`);
    invariant(item.positionRole === POSITION_ROLES[item.position], `${key}/${item.id}: position role mismatch`);
    invariant(item.scale === `${item.aspect}|${item.position}`, `${key}/${item.id}: scale/position mismatch`);
    invariant(item.responseMode === 'matched-vignette', `${key}/${item.id}: matched-vignette response mode is required`);
    invariant(typeof item.tetradId === 'string' && item.tetradId, `${key}/${item.id}: tetradId is required`);
    invariant(typeof item.contextDomain === 'string' && item.contextDomain, `${key}/${item.id}: contextDomain is required`);
    invariant(item.indicator !== undefined && item.indicator !== null, `${key}/${item.id}: indicator is required`);
  }

  for (const aspect of test.aspects) {
    const aspectItems = content.filter(item => item.aspect === aspect);
    const indicators = new Set(aspectItems.map(item => String(item.indicator)));
    invariant(indicators.size >= 3, `${key}/${aspect}: at least three indicators are required`);
    for (const indicator of indicators) {
      const quartet = aspectItems.filter(item => String(item.indicator) === indicator);
      invariant(quartet.length === 4, `${key}/${aspect}/${indicator}: quartet must have four items`);
      invariant(new Set(quartet.map(item => item.position)).size === 4, `${key}/${aspect}/${indicator}: quartet must cover four roles`);
      invariant(new Set(quartet.map(item => item.tetradId)).size === 1, `${key}/${aspect}/${indicator}: quartet id must be shared`);
      for (const language of LANGUAGES) {
        const firstStimuli = quartet.map(item => item.text[language].split(/(?<=\.)\s+/u)[0]);
        invariant(new Set(firstStimuli).size === 1, `${key}/${aspect}/${indicator}: ${language} stimulus is not matched`);
      }
    }
  }
}

function assertSocionicsModule(test) {
  invariant(test.mode === 'socionics', 'socionics: invalid mode');
  invariant(test.measurementModel === 'socionics-element-profile-v1', 'socionics: invalid measurement model');
  invariant(test.calibrationStatus === 'exploratory', 'socionics: must remain exploratory');
  invariant(Array.isArray(test.dims) && test.dims.length === 8 && new Set(test.dims).size === 8, 'socionics: eight unique dimensions are required');
  for (const item of test.items.filter(item => item.attention === undefined)) {
    invariant(test.dims.includes(item.scale), `socionics/${item.id}: unknown dimension`);
  }
}

export function validateQuestionBank(bank, manifest) {
  invariant(bank?.schemaVersion === '1.0.0', 'Question-bank schemaVersion must be 1.0.0');
  invariant(typeof bank.bankVersion === 'string' && bank.bankVersion.trim(), 'Question-bank bankVersion is required');
  invariant(bank.bankVersion === manifest?.bankVersion, 'Question-bank version does not match manifest');
  invariant(bank.tests && typeof bank.tests === 'object', 'Question-bank tests are required');
  invariant(JSON.stringify(Object.keys(bank.tests).sort()) === JSON.stringify([...MODULE_KEYS].sort()), 'Question-bank must contain exactly three supported modules');

  const allIds = [];
  for (const key of MODULE_KEYS) {
    const test = bank.tests[key];
    invariant(test && typeof test === 'object', `${key}: module is missing`);
    invariant(typeof test.version === 'string' && test.version.trim(), `${key}: instrument version is required`);
    assertLabels(test.labels, key);
    invariant(Array.isArray(test.items) && test.items.length > 0, `${key}: items are required`);
    test.items.forEach(item => {
      assertItem(item, key);
      allIds.push(item.id);
    });
    invariant(test.items.filter(item => item.attention !== undefined).length === 1, `${key}: exactly one attention item is required`);
    if (key === 'socionics') assertSocionicsModule(test);
    else assertPositionModule(test, key);

    const moduleManifest = manifest?.modules?.[key];
    invariant(moduleManifest, `${key}: manifest entry is missing`);
    invariant(moduleManifest.instrumentVersion === test.version, `${key}: instrument version mismatch`);
    invariant(moduleManifest.measurementModel === test.measurementModel, `${key}: measurement model mismatch`);
    invariant(moduleManifest.calibrationStatus === test.calibrationStatus, `${key}: calibration status mismatch`);
    invariant(moduleManifest.contentItemCount === test.items.filter(item => item.attention === undefined).length, `${key}: content count mismatch`);
    invariant(moduleManifest.presentedItemCount === test.items.length, `${key}: presented count mismatch`);
  }
  invariant(new Set(allIds).size === allIds.length, 'Item ids must be globally unique');
  return bank;
}

export function validateManifest(manifest) {
  invariant(manifest?.schemaVersion === '1.0.0', 'Instrument manifest schemaVersion must be 1.0.0');
  invariant(typeof manifest.bankVersion === 'string' && manifest.bankVersion.trim(), 'Manifest bankVersion is required');
  invariant(/^[a-f0-9]{64}$/.test(manifest.sha256 || ''), 'Manifest sha256 is invalid');
  invariant(manifest.source === AUTHORING_SOURCE, 'Manifest authoring source is invalid');
  invariant(manifest.distribution === SNAPSHOT_DISTRIBUTION, 'Only same-origin release snapshots are supported at runtime');
  invariant(/^[A-Za-z0-9._-]+\.json$/.test(manifest.file || ''), 'Manifest bank file is invalid');
  invariant(manifest.modules && typeof manifest.modules === 'object', 'Manifest modules are required');
  return manifest;
}

export async function sha256Text(text) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
}

export async function loadPinnedQuestionBank({ fetchImpl = globalThis.fetch } = {}) {
  const manifestResponse = await fetchImpl(MANIFEST_URL, { cache: 'no-store' });
  invariant(manifestResponse.ok, `Instrument manifest request failed: ${manifestResponse.status}`);
  const manifest = validateManifest(await manifestResponse.json());
  const bankUrl = new URL(`../instruments/${manifest.file}`, import.meta.url);
  const bankResponse = await fetchImpl(bankUrl, { cache: 'no-store' });
  invariant(bankResponse.ok, `Question-bank request failed: ${bankResponse.status}`);
  const bankText = await bankResponse.text();
  const actualHash = await sha256Text(bankText);
  invariant(actualHash === manifest.sha256, 'Question-bank hash does not match the release manifest');
  const bank = validateQuestionBank(JSON.parse(bankText), manifest);
  return { bank, manifest, bankUrl: bankUrl.href };
}

export function moduleManifest(manifest, keys) {
  return Object.fromEntries(keys.map(key => [key, { ...manifest.modules[key] }]));
}

export { LANGUAGES, MODULE_KEYS, POSITION_MODEL, POSITION_ROLES };
