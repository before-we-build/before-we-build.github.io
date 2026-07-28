import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test, { afterEach } from 'node:test';
import { validateManifest } from '../assets/test/bank.js';
import {
  AUTHORING_SOURCE,
  DISTRIBUTION,
  HISTORY_FILE,
  MANIFEST_FILE,
  createReleaseManifest,
  releaseRecord,
  serializeBank,
  syncInstrumentRelease,
  validateChangedItemVersions,
  validateReleaseHistory,
  validateReleaseHistoryExtension,
  verifyReleaseDirectory
} from '../scripts/lib/instrument-release.mjs';

const repositoryInstrumentDirectory = path.resolve('assets/instruments');
const repositoryManifest = JSON.parse(fs.readFileSync(
  path.join(repositoryInstrumentDirectory, MANIFEST_FILE),
  'utf8'
));
const repositoryBankText = fs.readFileSync(
  path.join(repositoryInstrumentDirectory, repositoryManifest.file),
  'utf8'
);
const repositoryBank = JSON.parse(repositoryBankText);
const temporaryRoots = [];

afterEach(() => {
  while (temporaryRoots.length > 0) {
    fs.rmSync(temporaryRoots.pop(), { recursive: true, force: true });
  }
});

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bwb-bank-release-'));
  temporaryRoots.push(root);
  const instrumentDirectory = path.join(root, 'instruments');
  fs.mkdirSync(instrumentDirectory);
  fs.copyFileSync(
    path.join(repositoryInstrumentDirectory, repositoryManifest.file),
    path.join(instrumentDirectory, repositoryManifest.file)
  );
  writeJson(
    path.join(instrumentDirectory, MANIFEST_FILE),
    repositoryManifest
  );
  writeJson(
    path.join(instrumentDirectory, HISTORY_FILE),
    {
      schemaVersion: '1.0.0',
      source: AUTHORING_SOURCE,
      distribution: DISTRIBUTION,
      releases: [releaseRecord(repositoryManifest)]
    }
  );
  return { root, instrumentDirectory };
}

function canonicalMarkdown(bank, { exact = true } = {}) {
  const snapshot = exact
    ? serializeBank(bank).trimEnd()
    : JSON.stringify(bank);
  return [
    '---',
    `bankVersion: ${bank.bankVersion}`,
    '---',
    '',
    '~~~question-bank',
    snapshot,
    '~~~',
    ''
  ].join('\n');
}

function writeCanonical(root, bank, options) {
  const canonicalPath = path.join(root, 'pilot-question-bank.md');
  fs.writeFileSync(canonicalPath, canonicalMarkdown(bank, options));
  return canonicalPath;
}

function nextBank(version = '2026-07-28.2') {
  const bank = structuredClone(repositoryBank);
  bank.bankVersion = version;
  bank.tests.socionics.version = 'socionics-exploratory-v0.6';
  bank.tests.socionics.items[0].version = '1.3';
  bank.tests.socionics.items[0].text.en += ' Updated.';
  return bank;
}

test('checked-in release history verifies every snapshot and preserves the bank hash', () => {
  const result = verifyReleaseDirectory({
    instrumentDirectory: repositoryInstrumentDirectory
  });

  assert.equal(result.releases.length, 1);
  assert.deepEqual(result.releases[0], {
    bankVersion: '2026-07-28.1',
    sha256: 'c5233f9ec39d9cca190a14e52adb5d5c01d3773bc926027a280aba1ab5da1db7',
    file: 'before-we-build-bank-2026-07-28.1.json'
  });
  assert.equal(result.manifest.source, AUTHORING_SOURCE);
  assert.equal(result.manifest.distribution, DISTRIBUTION);
});

test('runtime manifest requires canonical provenance and same-origin distribution', () => {
  const oldProvenance = structuredClone(repositoryManifest);
  oldProvenance.source = 'release-snapshot';
  assert.throws(
    () => validateManifest(oldProvenance),
    /Manifest authoring source is invalid/
  );

  const missingDistribution = structuredClone(repositoryManifest);
  delete missingDistribution.distribution;
  assert.throws(
    () => validateManifest(missingDistribution),
    /Only same-origin release snapshots/
  );
});

test('release history rejects missing, duplicate, and downgraded versions', () => {
  const baseHistory = {
    schemaVersion: '1.0.0',
    source: AUTHORING_SOURCE,
    distribution: DISTRIBUTION,
    releases: [releaseRecord(repositoryManifest)]
  };

  const missing = structuredClone(baseHistory);
  delete missing.releases[0].bankVersion;
  assert.throws(
    () => validateReleaseHistory(missing),
    /bankVersion is required/
  );

  const duplicate = structuredClone(baseHistory);
  duplicate.releases.push(structuredClone(duplicate.releases[0]));
  assert.throws(
    () => validateReleaseHistory(duplicate),
    /Duplicate bankVersion/
  );

  const downgraded = structuredClone(baseHistory);
  downgraded.releases.push({
    bankVersion: '2026-07-27.9',
    sha256: 'b'.repeat(64),
    file: 'before-we-build-bank-2026-07-27.9.json'
  });
  assert.throws(
    () => validateReleaseHistory(downgraded),
    /downgraded or out of order/
  );
});

test('release history is an exact append-only extension of the base branch', () => {
  const previous = {
    schemaVersion: '1.0.0',
    source: AUTHORING_SOURCE,
    distribution: DISTRIBUTION,
    releases: [releaseRecord(repositoryManifest)]
  };
  const next = structuredClone(previous);
  next.releases.push({
    bankVersion: '2026-07-28.2',
    sha256: 'b'.repeat(64),
    file: 'before-we-build-bank-2026-07-28.2.json'
  });
  assert.deepEqual(validateReleaseHistoryExtension(previous, next), next);

  const removed = structuredClone(next);
  removed.releases.shift();
  assert.throws(
    () => validateReleaseHistoryExtension(previous, removed),
    /must not remove|rewrote prior release/
  );

  const rewritten = structuredClone(next);
  rewritten.releases[0].sha256 = 'c'.repeat(64);
  assert.throws(
    () => validateReleaseHistoryExtension(previous, rewritten),
    /rewrote prior release/
  );
});

test('append-only verification fails closed when the base commit is unavailable', () => {
  const script = path.resolve('scripts/verify-release-history-against-git.mjs');
  const invalid = spawnSync(
    process.execPath,
    [script, 'definitely-not-a-commit'],
    { cwd: path.resolve('.'), encoding: 'utf8' }
  );
  assert.notEqual(invalid.status, 0);
  assert.match(
    `${invalid.stdout}\n${invalid.stderr}`,
    /Base commit is unavailable/
  );

  const initialRelease = spawnSync(
    process.execPath,
    [script, 'HEAD'],
    { cwd: path.resolve('.'), encoding: 'utf8' }
  );
  assert.equal(initialRelease.status, 0);
  assert.match(
    initialRelease.stdout,
    /initial append-only comparison skipped|Verified append-only history/
  );
});

test('verification rejects missing, changed, and unrecorded snapshots', () => {
  const missingFixture = makeFixture();
  fs.unlinkSync(path.join(
    missingFixture.instrumentDirectory,
    repositoryManifest.file
  ));
  assert.throws(
    () => verifyReleaseDirectory(missingFixture),
    /Recorded snapshot is missing/
  );

  const changedFixture = makeFixture();
  fs.appendFileSync(
    path.join(changedFixture.instrumentDirectory, repositoryManifest.file),
    '\n'
  );
  assert.throws(
    () => verifyReleaseDirectory(changedFixture),
    /Snapshot hash mismatch/
  );

  const unrecordedFixture = makeFixture();
  fs.writeFileSync(
    path.join(
      unrecordedFixture.instrumentDirectory,
      'before-we-build-bank-2026-07-28.2.json'
    ),
    '{}\n'
  );
  assert.throws(
    () => verifyReleaseDirectory(unrecordedFixture),
    /Snapshot is not recorded in release history/
  );
});

test('same bankVersion with different bytes is rejected without modifying release files', () => {
  const fixture = makeFixture();
  const changed = structuredClone(repositoryBank);
  changed.tests.socionics.items[0].text.ru += ' Изменено.';
  const canonicalPath = writeCanonical(fixture.root, changed);
  const snapshotPath = path.join(
    fixture.instrumentDirectory,
    repositoryManifest.file
  );
  const before = fs.readFileSync(snapshotPath, 'utf8');

  assert.throws(
    () => syncInstrumentRelease({
      instrumentDirectory: fixture.instrumentDirectory,
      canonicalPath
    }),
    /Immutable bankVersion .* has different bytes/
  );
  assert.equal(fs.readFileSync(snapshotPath, 'utf8'), before);
});

test('sync rejects a canonical bankVersion older than the latest release', () => {
  const fixture = makeFixture();
  const downgraded = nextBank('2026-07-27.9');
  const canonicalPath = writeCanonical(fixture.root, downgraded);

  assert.throws(
    () => syncInstrumentRelease({
      instrumentDirectory: fixture.instrumentDirectory,
      canonicalPath
    }),
    /Cannot sync downgraded bankVersion/
  );
});

test('sync rejects a new bankVersion when only the version field changed', () => {
  const fixture = makeFixture();
  const unchanged = structuredClone(repositoryBank);
  unchanged.bankVersion = '2026-07-28.2';
  const canonicalPath = writeCanonical(fixture.root, unchanged);

  assert.throws(
    () => syncInstrumentRelease({
      instrumentDirectory: fixture.instrumentDirectory,
      canonicalPath
    }),
    /bank content is unchanged/
  );
});

test('changed item content requires a changed itemVersion', () => {
  const changed = structuredClone(repositoryBank);
  changed.bankVersion = '2026-07-28.2';
  changed.tests.socionics.items[0].text.en += ' Updated.';

  assert.throws(
    () => validateChangedItemVersions(repositoryBank, changed),
    /changed item content must increment itemVersion/
  );

  changed.tests.socionics.items[0].version = '1.3';
  assert.throws(
    () => validateChangedItemVersions(repositoryBank, changed),
    /changed module content must increment instrumentVersion/
  );

  changed.tests.socionics.version = 'socionics-exploratory-v0.6';
  assert.doesNotThrow(
    () => validateChangedItemVersions(repositoryBank, changed)
  );
});

test('item and instrument versions cannot be downgraded or bumped without content', () => {
  const downgradedItem = nextBank();
  downgradedItem.tests.socionics.items[0].version = '1.1';
  assert.throws(
    () => validateChangedItemVersions(repositoryBank, downgradedItem),
    /changed item content must increment itemVersion/
  );

  const downgradedInstrument = nextBank();
  downgradedInstrument.tests.socionics.version = 'socionics-exploratory-v0.4';
  assert.throws(
    () => validateChangedItemVersions(repositoryBank, downgradedInstrument),
    /changed module content must increment instrumentVersion/
  );

  const versionOnly = structuredClone(repositoryBank);
  versionOnly.tests.socionics.items[0].version = '1.3';
  versionOnly.tests.socionics.version = 'socionics-exploratory-v0.6';
  assert.throws(
    () => validateChangedItemVersions(repositoryBank, versionOnly),
    /unchanged item content must keep itemVersion/
  );
});

test('a new version appends one immutable record and leaves prior snapshots intact', () => {
  const fixture = makeFixture();
  const bank = nextBank();
  const canonicalPath = writeCanonical(fixture.root, bank);
  const oldSnapshot = fs.readFileSync(
    path.join(fixture.instrumentDirectory, repositoryManifest.file),
    'utf8'
  );

  const added = syncInstrumentRelease({
    instrumentDirectory: fixture.instrumentDirectory,
    canonicalPath
  });
  assert.equal(added.added, true);
  assert.equal(added.bankVersion, '2026-07-28.2');

  const verified = verifyReleaseDirectory({
    instrumentDirectory: fixture.instrumentDirectory,
    canonicalPath
  });
  assert.deepEqual(
    verified.releases.map(record => record.bankVersion),
    ['2026-07-28.1', '2026-07-28.2']
  );
  assert.equal(
    fs.readFileSync(
      path.join(fixture.instrumentDirectory, repositoryManifest.file),
      'utf8'
    ),
    oldSnapshot
  );
  assert.deepEqual(
    verified.releases[1],
    releaseRecord(createReleaseManifest(bank))
  );

  const idempotent = syncInstrumentRelease({
    instrumentDirectory: fixture.instrumentDirectory,
    canonicalPath
  });
  assert.equal(idempotent.added, false);
});

test('optional canonical check compares exact question-bank bytes and version header', () => {
  const exactFixture = makeFixture();
  const exactCanonical = writeCanonical(exactFixture.root, repositoryBank);
  assert.equal(
    verifyReleaseDirectory({
      instrumentDirectory: exactFixture.instrumentDirectory,
      canonicalPath: exactCanonical
    }).canonicalChecked,
    true
  );

  const reformattedFixture = makeFixture();
  const reformatted = writeCanonical(
    reformattedFixture.root,
    repositoryBank,
    { exact: false }
  );
  assert.throws(
    () => verifyReleaseDirectory({
      instrumentDirectory: reformattedFixture.instrumentDirectory,
      canonicalPath: reformatted
    }),
    /does not exactly match/
  );

  const headerFixture = makeFixture();
  const headerPath = writeCanonical(headerFixture.root, repositoryBank);
  const headerText = fs.readFileSync(headerPath, 'utf8')
    .replace(
      `bankVersion: ${repositoryBank.bankVersion}`,
      'bankVersion: 2026-07-28.2'
    );
  fs.writeFileSync(headerPath, headerText);
  assert.throws(
    () => verifyReleaseDirectory({
      instrumentDirectory: headerFixture.instrumentDirectory,
      canonicalPath: headerPath
    }),
    /Canonical bankVersion header/
  );
});
