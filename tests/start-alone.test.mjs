import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const repo = path.resolve(import.meta.dirname, '..');
const jsPath = path.join(repo, 'assets', 'start-alone.js');
const htmlPath = path.join(repo, 'start-alone.html');

assert.ok(fs.existsSync(htmlPath), 'start-alone.html should exist');
assert.ok(fs.existsSync(jsPath), 'assets/start-alone.js should exist');

const html = fs.readFileSync(htmlPath, 'utf8');
assert.match(html, /data-start-alone-app/, 'page should mount the Start Alone app');
assert.match(html, /assets\/start-alone\.js/, 'page should load the Start Alone script');
assert.doesNotMatch(html, /compatibility score|matchmaking|digital twin/i, 'public page should avoid score/matchmaking/digital twin language');

const code = fs.readFileSync(jsPath, 'utf8');
const sandbox = { module: { exports: {} }, exports: {}, console };
vm.runInNewContext(code, sandbox, { filename: jsPath });
const app = sandbox.module.exports;

assert.equal(app.STORAGE_KEY, 'before-we-build-start-alone-v0');
assert.equal(app.QUESTION_SET.id, 'qset_start_alone_v0');
assert.equal(app.QUESTION_SET.questions.length, 8, 'v0 should implement the optional short first set');
assert.equal(new Set(app.QUESTION_SET.questions.map(q => q.id)).size, app.QUESTION_SET.questions.length, 'question IDs should be unique');
assert.ok(app.QUESTION_SET.questions.every(q => q.prompt.uk && q.prompt.ru && q.prompt.en), 'each question should have uk/ru/en prompts');
assert.ok(app.QUESTION_SET.questions.every(q => !/typology|score|match|diagnosis|profile/i.test(Object.values(q.prompt).join(' '))), 'questions should not require typology/score/diagnosis knowledge');

const saved = app.createSession({ locale: 'uk' });
assert.equal(saved.share_state, 'private');
assert.equal(saved.selected_path_id, 'path_start_alone');
assert.equal(saved.question_set_id, 'qset_start_alone_v0');

const updated = app.updateResponse(saved, 'q_start_alone_01', '  Молитися і поговорити з пастором  ');
assert.equal(updated.responses.length, 1, 'raw response should be stored separately');
assert.equal(updated.responses[0].raw_text, 'Молитися і поговорити з пастором');
assert.equal(updated.responses[0].question_id, 'q_start_alone_01');
assert.equal(updated.stale_after_edit, true, 'editing answers should mark derived material stale');

const map = app.buildPreparationMap({
  ...updated,
  responses: app.QUESTION_SET.questions.map((q, i) => ({ question_id: q.id, raw_text: i === 7 ? 'Поговорити з наставником без поспіху' : `Відповідь ${i + 1}` }))
}, 'uk');
assert.equal(map.type, 'ConversationMap');
assert.equal(map.raw_answer_count, 8);
assert.equal(map.normalized_answers.length, 8);
assert.ok(map.normalized_answers.every(n => n.uncertainty_label === 'user_self_description'));
assert.ok(map.open_questions.length >= 1);
assert.ok(map.caveats.some(c => /не є рішенням/i.test(c) || /не є вироком/i.test(c)), 'map should include non-verdict caveat');
assert.doesNotMatch(JSON.stringify(map), /score|match|compatibility|God told|readiness/i, 'map should avoid scores, matches, or oracular claims');

const exported = app.buildExportPayload(map, 'uk');
assert.equal(exported.share_state, 'exported_by_user');
assert.equal(exported.exported_by_user, true);
assert.ok(exported.caveats.length > 0, 'export should include caveats');
