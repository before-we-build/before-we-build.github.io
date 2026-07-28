import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import {
  HISTORY_FILE,
  validateReleaseHistory,
  validateReleaseHistoryExtension
} from './lib/instrument-release.mjs';

const root = path.resolve(import.meta.dirname, '..');
const baseCommit = process.argv[2] || '';

if (!baseCommit || /^0+$/u.test(baseCommit)) {
  console.log('No base commit is available; append-only comparison skipped.');
  process.exit(0);
}

const baseCheck = spawnSync(
  'git',
  ['cat-file', '-e', `${baseCommit}^{commit}`],
  { cwd: root, encoding: 'utf8' }
);
if (baseCheck.status !== 0) {
  throw new Error(
    `Base commit is unavailable: ${baseCommit}: `
      + `${baseCheck.stderr.trim() || 'git cat-file failed'}`
  );
}

function gitShow(relativePath, { allowMissing = false } = {}) {
  const result = spawnSync(
    'git',
    ['show', `${baseCommit}:${relativePath}`],
    { cwd: root, encoding: 'utf8' }
  );
  if (result.status === 0) return result.stdout;
  if (allowMissing) {
    const pathCheck = spawnSync(
      'git',
      ['cat-file', '-e', `${baseCommit}:${relativePath}`],
      { cwd: root, encoding: 'utf8' }
    );
    if (pathCheck.status !== 0) return null;
  }
  throw new Error(
    `Cannot read ${relativePath} from base ${baseCommit}: `
      + `${result.stderr.trim() || 'git show failed'}`
  );
}

const historyRelativePath = `assets/instruments/${HISTORY_FILE}`;
const previousHistoryText = gitShow(historyRelativePath, { allowMissing: true });
if (previousHistoryText === null) {
  console.log(`Base ${baseCommit} has no release history; initial append-only comparison skipped.`);
  process.exit(0);
}

const currentHistory = validateReleaseHistory(JSON.parse(
  fs.readFileSync(path.join(root, historyRelativePath), 'utf8')
));
const previousHistory = JSON.parse(previousHistoryText);
validateReleaseHistoryExtension(previousHistory, currentHistory);

for (const release of previousHistory.releases) {
  const relativePath = `assets/instruments/${release.file}`;
  const previousBytes = gitShow(relativePath);
  const currentBytes = fs.readFileSync(path.join(root, relativePath), 'utf8');
  if (currentBytes !== previousBytes) {
    throw new Error(`Immutable release snapshot changed: ${release.file}`);
  }
}

console.log(
  `Verified append-only history against ${baseCommit}: `
    + `${previousHistory.releases.length} prior release(s) preserved.`
);
