import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(
  path.join(root, 'assets/instruments/instrument-manifest.json'),
  'utf8'
));
const bankText = fs.readFileSync(
  path.join(root, 'assets/instruments', manifest.file),
  'utf8'
).trim();
const defaultCanonical = path.resolve(root, '../before-we-build-research/instruments/pilot-question-bank.md');
const canonicalPath = path.resolve(process.argv[2] || defaultCanonical);
const current = fs.readFileSync(canonicalPath, 'utf8');

let next = current
  .replace(/^bankVersion:\s*.+$/mu, `bankVersion: ${manifest.bankVersion}`)
  .replace(/~~~question-bank\s*[\s\S]*?\s*~~~/u, `~~~question-bank\n${bankText}\n~~~`);

if (next === current) throw new Error('Canonical question-bank document was not updated');
fs.writeFileSync(canonicalPath, next);
console.log(`Published ${manifest.bankVersion} to ${canonicalPath}`);
