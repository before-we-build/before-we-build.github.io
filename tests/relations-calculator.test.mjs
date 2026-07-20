import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const repo = path.resolve(import.meta.dirname, '..');
const htmlPath = path.join(repo, 'index.html');
const jsPath = path.join(repo, 'assets', 'relations-calculator.js');

assert.ok(fs.existsSync(htmlPath), 'index.html should exist');
assert.ok(fs.existsSync(jsPath), 'assets/relations-calculator.js should exist');

const html = fs.readFileSync(htmlPath, 'utf8');
assert.match(html, /data-relations-calculator-app/, 'page should mount the relations calculator app');
assert.match(html, /assets\/relations-calculator\.js/, 'page should load calculator script');
assert.doesNotMatch(html, /scripture|писан|біблі|bible|start-alone/i, 'site should contain only the calculator, without Bible-path content');
assert.doesNotMatch(html, /процент|відсот|score|matchmaking|гарант/i, 'page should not promise scores, matchmaking, or guarantees');

const code = fs.readFileSync(jsPath, 'utf8');
const sandbox = { module: { exports: {} }, exports: {}, console };
vm.runInNewContext(code, sandbox, { filename: jsPath });
const app = sandbox.module.exports;

assert.equal(app.SOCIONICS_TYPES.length, 16, 'socionics should expose 16 types');
assert.equal(app.PSYCHOSOPHY_TYPES.length, 24, 'psychosophy should expose 24 types');
assert.equal(app.TEMPORISTICS_TYPES.length, 24, 'temporistics should expose 24 types');
assert.equal(new Set(app.SOCIONICS_TYPES.map(t => t.code)).size, 16, 'socionics type codes should be unique');
assert.equal(new Set(app.PSYCHOSOPHY_TYPES.map(t => t.code)).size, 24, 'psychosophy type codes should be unique');
assert.equal(new Set(app.TEMPORISTICS_TYPES.map(t => t.code)).size, 24, 'temporistics type codes should be unique');

const dual = app.analyzeSocionicsPair('ILE', 'SEI');
assert.equal(dual.relation.code, 'duality');
assert.match(dual.relation.name.ru, /Дуаль/i);
assert.equal(app.analyzeSocionicsPair('ILE', 'ILE').relation.code, 'identity');
assert.equal(app.analyzeSocionicsPair('ILE', 'ESI').relation.code, 'conflict');

const benefit = app.analyzeSocionicsPair('ILE', 'LSE');
assert.equal(benefit.relation.code, 'benefit');
assert.ok(benefit.direction.ru.includes('заказчик') || benefit.direction.ru.includes('принимает'), 'asymmetric benefit should include direction wording');

const psy = app.analyzePermutationPair('LEVF', 'ELVF', app.PSYCHOSOPHY_RELATION_LEGEND, 'psychosophy');
assert.equal(psy.signature, '2134');
assert.equal(psy.relation.code, 'AG');
assert.match(psy.relation.name.ru, /Агапэ/i);

const temp = app.analyzePermutationPair('EPNF', 'FNPE', app.TEMPORISTICS_RELATION_LEGEND, 'temporistics');
assert.equal(temp.signature, '4321');
assert.match(temp.relation.name.ru, /полная структурная инверсия/i);
assert.match(temp.level.ru, /стратег/i);

const composite = app.buildCompositeReport({
  socionicsA: 'ILE', socionicsB: 'SEI', psychosophyA: 'LEVF', psychosophyB: 'ELVF', temporisticsA: 'EPNF', temporisticsB: 'FNPE'
}, 'ru');
assert.equal(composite.locale, 'ru');
assert.equal(composite.layers.length, 3);
assert.match(composite.summary, /три слоя/i);
assert.ok(composite.caveats.some(c => /не является приговором/i.test(c)), 'report should include non-verdict caveat');
assert.doesNotMatch(JSON.stringify(composite), /процент|score|soulmate|гарант/i, 'report should avoid scores and deterministic claims');
