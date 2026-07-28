import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import {
  validateManifest,
  validateQuestionBank
} from '../../assets/test/bank.js';

export const AUTHORING_SOURCE =
  'before-we-build-research/instruments/pilot-question-bank.md';
export const DISTRIBUTION = 'same-origin-release-snapshot';
export const HISTORY_FILE = 'release-history.json';
export const MANIFEST_FILE = 'instrument-manifest.json';

const RELEASE_VERSION = /^(\d{4})-(\d{2})-(\d{2})\.(\d+)$/u;
const SHA_256 = /^[a-f0-9]{64}$/u;
const SNAPSHOT_FILE = /^before-we-build-bank-(.+)\.json$/u;

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function assertExactKeys(value, expected, label) {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  invariant(
    isDeepStrictEqual(actual, wanted),
    `${label} must contain exactly: ${wanted.join(', ')}`
  );
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read JSON ${file}: ${error.message}`, { cause: error });
  }
}

function writeFileAtomic(file, text) {
  const temporary = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, text, { flag: 'wx' });
  fs.renameSync(temporary, file);
}

export function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

export function parseReleaseVersion(version) {
  invariant(
    typeof version === 'string' && version.length > 0,
    'bankVersion is required'
  );
  const match = version.match(RELEASE_VERSION);
  invariant(
    match,
    `bankVersion "${version}" must use YYYY-MM-DD.N format`
  );
  const [, yearText, monthText, dayText, sequenceText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const sequence = Number(sequenceText);
  const date = new Date(Date.UTC(year, month - 1, day));
  invariant(
    date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1
      && date.getUTCDate() === day,
    `bankVersion "${version}" contains an invalid date`
  );
  invariant(
    Number.isSafeInteger(sequence) && sequence >= 1,
    `bankVersion "${version}" must have a positive release sequence`
  );
  return [year, month, day, sequence];
}

export function compareReleaseVersions(left, right) {
  const leftParts = parseReleaseVersion(left);
  const rightParts = parseReleaseVersion(right);
  for (let index = 0; index < leftParts.length; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] < rightParts[index] ? -1 : 1;
    }
  }
  return 0;
}

export function snapshotFilename(bankVersion) {
  parseReleaseVersion(bankVersion);
  return `before-we-build-bank-${bankVersion}.json`;
}

export function extractCanonicalBlock(markdown, canonicalPath = 'canonical Markdown') {
  const match = markdown.match(
    /(?:^|\r?\n)~~~question-bank[ \t]*\r?\n([\s\S]*?)\r?\n~~~(?:\r?\n|$)/u
  );
  invariant(match, `Question-bank block is missing in ${canonicalPath}`);
  return match[1];
}

export function parseCanonicalBank(markdown, canonicalPath) {
  const block = extractCanonicalBlock(markdown, canonicalPath);
  try {
    return JSON.parse(block);
  } catch (error) {
    throw new Error(
      `Question-bank block is not valid JSON in ${canonicalPath}: ${error.message}`,
      { cause: error }
    );
  }
}

export function serializeBank(bank) {
  return `${JSON.stringify(bank, null, 2)}\n`;
}

function moduleManifest(bank) {
  return Object.fromEntries(
    Object.entries(bank.tests || {}).map(([key, instrument]) => [
      key,
      {
        instrumentVersion: instrument.version,
        measurementModel: instrument.measurementModel,
        calibrationStatus: instrument.calibrationStatus,
        contentItemCount: instrument.items.filter(
          item => item.attention === undefined
        ).length,
        presentedItemCount: instrument.items.length
      }
    ])
  );
}

export function createReleaseManifest(bank, snapshotText = serializeBank(bank)) {
  parseReleaseVersion(bank?.bankVersion);
  const manifest = {
    schemaVersion: '1.0.0',
    bankVersion: bank.bankVersion,
    sha256: sha256(snapshotText),
    source: AUTHORING_SOURCE,
    distribution: DISTRIBUTION,
    file: snapshotFilename(bank.bankVersion),
    modules: moduleManifest(bank)
  };
  validateManifest(manifest);
  validateQuestionBank(bank, manifest);
  return manifest;
}

export function releaseRecord(manifest) {
  return {
    bankVersion: manifest.bankVersion,
    sha256: manifest.sha256,
    file: manifest.file
  };
}

function dottedVersion(value, label, { instrument = false } = {}) {
  const pattern = instrument
    ? /^(.*-v)(\d+(?:\.\d+)*)$/u
    : /^(\d+(?:\.\d+)*)$/u;
  const match = String(value || '').match(pattern);
  invariant(match, `${label} must use a numeric dotted version`);
  return {
    prefix: instrument ? match[1] : '',
    parts: (instrument ? match[2] : match[1]).split('.').map(Number)
  };
}

function compareDottedVersions(previous, next, label, options) {
  const previousVersion = dottedVersion(previous, `${label} previous version`, options);
  const nextVersion = dottedVersion(next, `${label} next version`, options);
  invariant(
    previousVersion.prefix === nextVersion.prefix,
    `${label} version prefix must not change`
  );
  const length = Math.max(previousVersion.parts.length, nextVersion.parts.length);
  for (let index = 0; index < length; index += 1) {
    const left = previousVersion.parts[index] || 0;
    const right = nextVersion.parts[index] || 0;
    if (left !== right) return right > left ? 1 : -1;
  }
  return 0;
}

export function validateChangedItemVersions(previousBank, nextBank) {
  for (const [testKey, nextTest] of Object.entries(nextBank.tests || {})) {
    const previousTest = previousBank.tests?.[testKey];
    const previousItems = new Map(
      (previousTest?.items || []).map(item => [item.id, item])
    );
    for (const nextItem of nextTest.items || []) {
      const previousItem = previousItems.get(nextItem.id);
      if (!previousItem) continue;
      const previousContent = { ...previousItem };
      const nextContent = { ...nextItem };
      delete previousContent.version;
      delete nextContent.version;
      if (!isDeepStrictEqual(previousContent, nextContent)) {
        invariant(
          compareDottedVersions(
            previousItem.version,
            nextItem.version,
            `${testKey}/${nextItem.id}`
          ) > 0,
          `${testKey}/${nextItem.id}: changed item content must increment itemVersion`
        );
      } else {
        invariant(
          nextItem.version === previousItem.version,
          `${testKey}/${nextItem.id}: unchanged item content must keep itemVersion`
        );
      }
    }

    if (!previousTest) continue;
    const previousContent = { ...previousTest };
    const nextContent = { ...nextTest };
    delete previousContent.version;
    delete nextContent.version;
    if (!isDeepStrictEqual(previousContent, nextContent)) {
      invariant(
        compareDottedVersions(
          previousTest.version,
          nextTest.version,
          testKey,
          { instrument: true }
        ) > 0,
        `${testKey}: changed module content must increment instrumentVersion`
      );
    } else {
      invariant(
        nextTest.version === previousTest.version,
        `${testKey}: unchanged module content must keep instrumentVersion`
      );
    }
  }
}

export function validateReleaseHistory(history) {
  invariant(
    history && typeof history === 'object' && !Array.isArray(history),
    'Release history must be an object'
  );
  assertExactKeys(
    history,
    ['schemaVersion', 'source', 'distribution', 'releases'],
    'Release history'
  );
  invariant(
    history.schemaVersion === '1.0.0',
    'Release history schemaVersion must be 1.0.0'
  );
  invariant(
    history.source === AUTHORING_SOURCE,
    `Release history source must be ${AUTHORING_SOURCE}`
  );
  invariant(
    history.distribution === DISTRIBUTION,
    `Release history distribution must be ${DISTRIBUTION}`
  );
  invariant(
    Array.isArray(history.releases) && history.releases.length > 0,
    'Release history must contain at least one release'
  );

  const versions = new Set();
  const files = new Set();
  const hashes = new Set();
  let previousVersion = null;
  for (const [index, record] of history.releases.entries()) {
    invariant(
      record && typeof record === 'object' && !Array.isArray(record),
      `Release history entry ${index} must be an object`
    );
    invariant(
      typeof record.bankVersion === 'string' && record.bankVersion.length > 0,
      `Release history entry ${index} bankVersion is required`
    );
    assertExactKeys(
      record,
      ['bankVersion', 'sha256', 'file'],
      `Release history entry ${index}`
    );
    parseReleaseVersion(record.bankVersion);
    invariant(
      !versions.has(record.bankVersion),
      `Duplicate bankVersion in release history: ${record.bankVersion}`
    );
    invariant(
      record.file === snapshotFilename(record.bankVersion),
      `Release history file does not match bankVersion ${record.bankVersion}`
    );
    invariant(
      SHA_256.test(record.sha256 || ''),
      `Release history SHA-256 is invalid for ${record.bankVersion}`
    );
    invariant(
      !files.has(record.file),
      `Duplicate snapshot file in release history: ${record.file}`
    );
    invariant(
      !hashes.has(record.sha256),
      `Duplicate snapshot hash in release history: ${record.sha256}`
    );
    if (previousVersion !== null) {
      invariant(
        compareReleaseVersions(record.bankVersion, previousVersion) > 0,
        `Release history is downgraded or out of order at ${record.bankVersion}`
      );
    }
    versions.add(record.bankVersion);
    files.add(record.file);
    hashes.add(record.sha256);
    previousVersion = record.bankVersion;
  }
  return history;
}

export function validateReleaseHistoryExtension(previousHistory, nextHistory) {
  const previous = validateReleaseHistory(previousHistory);
  const next = validateReleaseHistory(nextHistory);
  invariant(
    next.releases.length >= previous.releases.length,
    'Release history must not remove prior releases'
  );
  for (const [index, previousRecord] of previous.releases.entries()) {
    invariant(
      isDeepStrictEqual(next.releases[index], previousRecord),
      `Release history rewrote prior release ${previousRecord.bankVersion}`
    );
  }
  return next;
}

function validateCanonicalVersionHeader(markdown, expectedVersion, canonicalPath) {
  const header = markdown.match(/^bankVersion:\s*(\S+)\s*$/mu);
  if (header) {
    invariant(
      header[1] === expectedVersion,
      `Canonical bankVersion header in ${canonicalPath} does not match ${expectedVersion}`
    );
  }
}

export function verifyReleaseDirectory({
  instrumentDirectory,
  canonicalPath = null
}) {
  const historyPath = path.join(instrumentDirectory, HISTORY_FILE);
  invariant(
    fs.existsSync(historyPath),
    `Release history is missing: ${historyPath}`
  );
  const history = validateReleaseHistory(readJson(historyPath));
  const recordedFiles = new Set(history.releases.map(record => record.file));
  const diskSnapshots = fs.readdirSync(instrumentDirectory)
    .filter(file => SNAPSHOT_FILE.test(file));
  for (const file of diskSnapshots) {
    invariant(
      recordedFiles.has(file),
      `Snapshot is not recorded in release history: ${file}`
    );
  }

  const releases = [];
  for (const record of history.releases) {
    const snapshotPath = path.join(instrumentDirectory, record.file);
    invariant(
      fs.existsSync(snapshotPath),
      `Recorded snapshot is missing: ${record.file}`
    );
    const text = fs.readFileSync(snapshotPath, 'utf8');
    const actualHash = sha256(text);
    invariant(
      actualHash === record.sha256,
      `Snapshot hash mismatch for ${record.bankVersion}: expected ${record.sha256}, got ${actualHash}`
    );
    let bank;
    try {
      bank = JSON.parse(text);
    } catch (error) {
      throw new Error(
        `Recorded snapshot is not valid JSON: ${record.file}: ${error.message}`,
        { cause: error }
      );
    }
    invariant(
      bank.bankVersion === record.bankVersion,
      `Snapshot bankVersion does not match release history: ${record.file}`
    );
    const generatedManifest = createReleaseManifest(bank, text);
    invariant(
      generatedManifest.sha256 === record.sha256
        && generatedManifest.file === record.file,
      `Snapshot release metadata does not match history: ${record.bankVersion}`
    );
    releases.push({ record, bank, text, generatedManifest });
  }

  const latest = releases.at(-1);
  const manifestPath = path.join(instrumentDirectory, MANIFEST_FILE);
  invariant(
    fs.existsSync(manifestPath),
    `Instrument manifest is missing: ${manifestPath}`
  );
  const manifest = validateManifest(readJson(manifestPath));
  invariant(
    isDeepStrictEqual(manifest, latest.generatedManifest),
    `Instrument manifest does not exactly describe latest release ${latest.record.bankVersion}`
  );

  if (canonicalPath !== null) {
    const canonicalMarkdown = fs.readFileSync(canonicalPath, 'utf8');
    validateCanonicalVersionHeader(
      canonicalMarkdown,
      latest.record.bankVersion,
      canonicalPath
    );
    const canonicalBlock = extractCanonicalBlock(
      canonicalMarkdown,
      canonicalPath
    );
    invariant(
      `${canonicalBlock}\n` === latest.text,
      `Canonical question-bank block does not exactly match ${latest.record.file}`
    );
  }

  return {
    history,
    manifest,
    releases: releases.map(({ record }) => ({ ...record })),
    canonicalChecked: canonicalPath !== null
  };
}

export function syncInstrumentRelease({
  instrumentDirectory,
  canonicalPath
}) {
  const current = verifyReleaseDirectory({ instrumentDirectory });
  const canonicalMarkdown = fs.readFileSync(canonicalPath, 'utf8');
  const bank = parseCanonicalBank(canonicalMarkdown, canonicalPath);
  const snapshotText = serializeBank(bank);
  const manifest = createReleaseManifest(bank, snapshotText);
  const history = current.history;
  const latest = history.releases.at(-1);
  const existing = history.releases.find(
    record => record.bankVersion === manifest.bankVersion
  );

  if (existing) {
    invariant(
      existing.bankVersion === latest.bankVersion,
      `Cannot sync downgraded bankVersion ${manifest.bankVersion}; latest is ${latest.bankVersion}`
    );
    invariant(
      existing.sha256 === manifest.sha256
        && existing.file === manifest.file,
      `Immutable bankVersion ${manifest.bankVersion} has different bytes`
    );
    const existingText = fs.readFileSync(
      path.join(instrumentDirectory, existing.file),
      'utf8'
    );
    invariant(
      existingText === snapshotText,
      `Immutable bankVersion ${manifest.bankVersion} has different bytes`
    );
    return {
      bankVersion: manifest.bankVersion,
      sha256: manifest.sha256,
      added: false
    };
  }

  invariant(
    compareReleaseVersions(manifest.bankVersion, latest.bankVersion) > 0,
    `Cannot sync downgraded bankVersion ${manifest.bankVersion}; latest is ${latest.bankVersion}`
  );
  const latestBank = JSON.parse(fs.readFileSync(
    path.join(instrumentDirectory, latest.file),
    'utf8'
  ));
  const comparableBank = structuredClone(bank);
  comparableBank.bankVersion = latestBank.bankVersion;
  invariant(
    !isDeepStrictEqual(comparableBank, latestBank),
    `Cannot release ${manifest.bankVersion}: bank content is unchanged from ${latest.bankVersion}`
  );
  validateChangedItemVersions(latestBank, bank);
  const snapshotPath = path.join(instrumentDirectory, manifest.file);
  invariant(
    !fs.existsSync(snapshotPath),
    `Snapshot file already exists without a release-history entry: ${manifest.file}`
  );

  const nextHistory = {
    ...history,
    releases: [...history.releases, releaseRecord(manifest)]
  };
  validateReleaseHistory(nextHistory);

  writeFileAtomic(snapshotPath, snapshotText);
  writeFileAtomic(
    path.join(instrumentDirectory, HISTORY_FILE),
    `${JSON.stringify(nextHistory, null, 2)}\n`
  );
  writeFileAtomic(
    path.join(instrumentDirectory, MANIFEST_FILE),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  verifyReleaseDirectory({ instrumentDirectory });
  return {
    bankVersion: manifest.bankVersion,
    sha256: manifest.sha256,
    added: true
  };
}
