import path from 'node:path';
import { syncInstrumentRelease } from './lib/instrument-release.mjs';

const root = path.resolve(import.meta.dirname, '..');
const defaultCanonical = path.resolve(root, '../before-we-build-research/instruments/pilot-question-bank.md');
const canonicalPath = path.resolve(process.argv[2] || defaultCanonical);
const instrumentDirectory = path.join(root, 'assets/instruments');
const result = syncInstrumentRelease({ instrumentDirectory, canonicalPath });
const action = result.added ? 'Released' : 'Verified immutable release';
console.log(
  `${action} ${result.bankVersion} (${result.sha256}) from ${canonicalPath}`
);
