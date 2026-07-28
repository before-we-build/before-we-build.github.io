import path from 'node:path';
import { verifyReleaseDirectory } from './lib/instrument-release.mjs';

const root = path.resolve(import.meta.dirname, '..');
const instrumentDirectory = path.join(root, 'assets/instruments');
const args = process.argv.slice(2);
let canonicalPath = null;

if (args.length === 1 && args[0] === '--help') {
  console.log(
    'Usage: node scripts/verify-instrument-release.mjs [--canonical [path]]'
  );
  process.exit(0);
}

if (args.length > 0) {
  const inlineCanonical = args[0].startsWith('--canonical=')
    ? args[0]
    : null;
  if (inlineCanonical && args.length === 1) {
    const supplied = inlineCanonical.slice('--canonical='.length);
    if (!supplied) throw new Error('--canonical= requires a path');
    canonicalPath = path.resolve(supplied);
  } else if (
    args[0] === '--canonical'
    && args.length <= 2
    && (args[1] === undefined || !args[1].startsWith('--'))
  ) {
    const supplied = args[1];
    canonicalPath = supplied && !supplied.startsWith('--')
      ? path.resolve(supplied)
      : path.resolve(
        root,
        '../before-we-build-research/instruments/pilot-question-bank.md'
      );
  } else {
    throw new Error(`Invalid arguments: ${args.join(' ')}`);
  }
}

const result = verifyReleaseDirectory({ instrumentDirectory, canonicalPath });
console.log(
  `Verified ${result.releases.length} release(s); latest `
    + `${result.manifest.bankVersion} (${result.manifest.sha256})`
    + (result.canonicalChecked ? '; canonical bytes match' : '')
);
