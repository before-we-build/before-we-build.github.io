(function(root){
  'use strict';

  const STORAGE_KEY = 'before-we-build-start-alone-v0';
  const CONSENT_VERSION = 'start-alone-local-v0-2026-05-13';
  const QUESTION_SET = {
    id: 'qset_start_alone_v0',
    version: '0.1.0',
    path_id: 'path_start_alone',
    questions: [
      {
        id: 'q_start_alone_01',
        theme: 'foundation_before_god',
        prompt: {
          uk: 'Що ви просите Бога прояснити, перш ніж рухатися до серйозних стосунків?',
          ru: 'Что вы просите Бога прояснить, прежде чем двигаться к серьёзным отношениям?',
          en: 'What are you asking God to make clear before you move toward a serious relationship?'
        }
      },
      {
        id: 'q_start_alone_02',
        theme: 'loneliness_and_wisdom',
        prompt: {
          uk: 'Де самотність може підштовхувати вас швидше, ніж мудрість?',
          ru: 'Где одиночество может подталкивать вас быстрее, чем мудрость?',
          en: 'Where might loneliness be pushing you faster than wisdom?'
        }
      },
      {
        id: 'q_start_alone_03',
        theme: 'scripture_convictions',
        prompt: {
          uk: 'Якими переконаннями з Писання ви не хотіли б поступитися?',
          ru: 'Какими убеждениями из Писания вы не хотели бы поступиться?',
          en: 'What convictions from Scripture would you not want to compromise?'
        }
      },
      {
        id: 'q_start_alone_04',
        theme: 'responsibility',
        prompt: {
          uk: 'Які відповідальності вже є вашими сьогодні, і наскільки вірно ви їх несете?',
          ru: 'Какие ответственности уже ваши сегодня, и насколько верно вы их несёте?',
          en: 'What responsibilities are already yours today, and how faithfully are you carrying them?'
        }
      },
      {
        id: 'q_start_alone_05',
        theme: 'counsel',
        prompt: {
          uk: 'Хто може дати вам мудру пораду до того, як будуть зроблені серйозні обіцянки?',
          ru: 'Кто может дать вам мудрый совет до того, как будут даны серьёзные обещания?',
          en: 'Who can give you wise counsel before serious promises are made?'
        }
      },
      {
        id: 'q_start_alone_06',
        theme: 'hard_conversation',
        prompt: {
          uk: 'Яку тему було б важко, але необхідно обговорити до шлюбу?',
          ru: 'Какую тему было бы трудно, но необходимо обсудить до брака?',
          en: 'What topic would be hard, but necessary, to discuss before marriage?'
        }
      },
      {
        id: 'q_start_alone_07',
        theme: 'hope_fear_expectation',
        prompt: {
          uk: 'Яку надію, страх або очікування варто чесно назвати перед Богом?',
          ru: 'Какую надежду, страх или ожидание стоит честно назвать перед Богом?',
          en: 'What hope, fear, or expectation should be named honestly before God?'
        }
      },
      {
        id: 'q_start_alone_08',
        theme: 'next_wise_step',
        prompt: {
          uk: 'Який один мудрий крок ви можете зробити без поспіху?',
          ru: 'Какой один мудрый шаг вы можете сделать без спешки?',
          en: 'What is one wise next step you can take without haste?'
        }
      }
    ]
  };

  const UI = {
    uk: {
      brand: 'Перш ніж будувати',
      eyebrow: 'Почати самому',
      title: 'Карта підготовки до мудрої розмови',
      intro: 'Короткий шлях для християнина або християнки, які хочуть спокійно назвати важливі питання перед Богом, Писанням і мудрою порадою.',
      privacy: 'Відповіді зберігаються тільки у цьому браузері. Нічого не надсилається і не відкривається іншій людині автоматично.',
      resumeFound: 'Знайдено збережений шлях у цьому браузері.',
      resume: 'Продовжити',
      startNew: 'Почати заново',
      start: 'Почати',
      back: 'Назад',
      next: 'Далі',
      save: 'Зберегти тут',
      clear: 'Видалити локальні дані',
      showMap: 'Показати карту',
      exportFile: 'Завантажити файл',
      copy: 'Скопіювати короткий підсумок',
      answerPlaceholder: 'Ваша відповідь. Можна коротко, чесно і без поспіху.',
      progress: 'Питання',
      missing: 'Дайте відповідь хоча б на одне питання, щоб побачити карту.',
      saved: 'Збережено у цьому браузері.',
      cleared: 'Локальні дані видалено.',
      mapTitle: 'Ваша карта підготовки',
      answers: 'Збережені сирі відповіді',
      openQuestions: 'Що ще варто принести в молитву, Писання і пораду',
      caveats: 'Межі цієї карти',
      nextStep: 'Наступний мудрий крок',
      copied: 'Скопійовано.',
      exportNotice: 'Файл створюється тільки після вашого натискання. Після завантаження ви самі вирішуєте, чи показувати його комусь.',
      caveatList: [
        'Ця карта не є вироком, пророцтвом або заміною Писання, молитви, церкви й мудрої поради.',
        'Вона не обіцяє шлюб, не оцінює готовність і не порівнює вас з іншими людьми.',
        'Якщо відповідь торкається небезпеки, примусу, насильства або самозашкодження, зверніться до безпечної живої допомоги.'
      ]
    },
    ru: {
      brand: 'Прежде чем строить',
      eyebrow: 'Начать самому',
      title: 'Карта подготовки к мудрому разговору',
      intro: 'Короткий путь для христианина или христианки, которые хотят спокойно назвать важные вопросы перед Богом, Писанием и мудрым советом.',
      privacy: 'Ответы сохраняются только в этом браузере. Ничего не отправляется и не открывается другому человеку автоматически.',
      resumeFound: 'Найден сохранённый путь в этом браузере.',
      resume: 'Продолжить',
      startNew: 'Начать заново',
      start: 'Начать',
      back: 'Назад',
      next: 'Дальше',
      save: 'Сохранить здесь',
      clear: 'Удалить локальные данные',
      showMap: 'Показать карту',
      exportFile: 'Скачать файл',
      copy: 'Скопировать краткий итог',
      answerPlaceholder: 'Ваш ответ. Можно коротко, честно и без спешки.',
      progress: 'Вопрос',
      missing: 'Ответьте хотя бы на один вопрос, чтобы увидеть карту.',
      saved: 'Сохранено в этом браузере.',
      cleared: 'Локальные данные удалены.',
      mapTitle: 'Ваша карта подготовки',
      answers: 'Сохранённые сырые ответы',
      openQuestions: 'Что ещё стоит принести в молитву, Писание и совет',
      caveats: 'Границы этой карты',
      nextStep: 'Следующий мудрый шаг',
      copied: 'Скопировано.',
      exportNotice: 'Файл создаётся только после вашего нажатия. После скачивания вы сами решаете, показывать ли его кому-то.',
      caveatList: [
        'Эта карта не является вердиктом, пророчеством или заменой Писания, молитвы, церкви и мудрого совета.',
        'Она не обещает брак, не оценивает готовность и не сравнивает вас с другими людьми.',
        'Если ответ касается опасности, принуждения, насилия или самоповреждения, обратитесь к безопасной живой помощи.'
      ]
    },
    en: {
      brand: 'Before We Build',
      eyebrow: 'Start alone',
      title: 'Preparation map for a wise conversation',
      intro: 'A short path for a Christian brother or sister who wants to name important questions before God, Scripture, and wise counsel.',
      privacy: 'Answers are stored only in this browser. Nothing is sent or opened to another person automatically.',
      resumeFound: 'A saved path was found in this browser.',
      resume: 'Resume',
      startNew: 'Start again',
      start: 'Start',
      back: 'Back',
      next: 'Next',
      save: 'Save here',
      clear: 'Delete local data',
      showMap: 'Show map',
      exportFile: 'Download file',
      copy: 'Copy short summary',
      answerPlaceholder: 'Your answer. Short, honest, and without haste is enough.',
      progress: 'Question',
      missing: 'Answer at least one question to see the map.',
      saved: 'Saved in this browser.',
      cleared: 'Local data deleted.',
      mapTitle: 'Your preparation map',
      answers: 'Stored raw answers',
      openQuestions: 'What to bring to prayer, Scripture, and counsel',
      caveats: 'Boundaries of this map',
      nextStep: 'Next wise step',
      copied: 'Copied.',
      exportNotice: 'The file is created only after you press the button. After download, you decide whether to show it to anyone.',
      caveatList: [
        'This map is not a verdict, prophecy, or replacement for Scripture, prayer, church, and wise counsel.',
        'It does not promise marriage, judge preparedness, or compare you with other people.',
        'If an answer touches danger, coercion, abuse, or self-harm, seek safe human help.'
      ]
    }
  };

  const nowIso = () => new Date().toISOString();
  const safeUuid = () => (root.crypto && root.crypto.randomUUID ? root.crypto.randomUUID() : `local_${Date.now()}_${Math.random().toString(16).slice(2)}`);
  const textFor = (obj, locale) => obj[locale] || obj.uk || obj.ru || obj.en || '';
  const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function createSession({ locale = 'uk' } = {}) {
    const t = nowIso();
    return {
      id: `session_${safeUuid()}`,
      created_at: t,
      updated_at: t,
      locale,
      selected_path_id: 'path_start_alone',
      question_set_id: QUESTION_SET.id,
      status: 'started',
      consent_version: CONSENT_VERSION,
      share_state: 'private',
      stale_after_edit: false,
      responses: [],
      normalized_answers: [],
      conversation_map: null
    };
  }

  function updateResponse(session, questionId, rawText) {
    const trimmed = String(rawText || '').trim();
    const existing = session.responses.find(r => r.question_id === questionId);
    const next = { ...session, responses: session.responses.map(r => ({ ...r })) };
    if (existing) {
      next.responses = next.responses.map(r => r.question_id === questionId ? { ...r, raw_text: trimmed, updated_at: nowIso() } : r);
    } else {
      next.responses.push({
        id: `response_${safeUuid()}`,
        question_id: questionId,
        question_set_id: QUESTION_SET.id,
        raw_text: trimmed,
        answer_kind: 'free_text',
        created_at: nowIso(),
        updated_at: nowIso()
      });
    }
    next.responses = next.responses.filter(r => r.raw_text.length > 0);
    next.updated_at = nowIso();
    next.status = next.responses.length ? 'in_progress' : 'started';
    next.stale_after_edit = true;
    next.normalized_answers = [];
    next.conversation_map = null;
    return next;
  }

  function normalizeResponse(response, question, locale = 'uk') {
    return {
      id: `norm_${response.question_id}`,
      question_id: response.question_id,
      source_response_id: response.id || null,
      theme: question ? question.theme : 'unknown',
      user_words: response.raw_text,
      summary: response.raw_text.slice(0, 420),
      uncertainty_label: 'user_self_description',
      derived_at: nowIso(),
      note: locale === 'ru' ? 'Краткое сохранение слов пользователя без вывода о человеке.' : locale === 'en' ? 'Brief preservation of the user’s words without a conclusion about the person.' : 'Коротке збереження слів користувача без висновку про людину.'
    };
  }

  function buildPreparationMap(session, locale = 'uk') {
    const d = UI[locale] || UI.uk;
    const byQuestion = Object.fromEntries(QUESTION_SET.questions.map(q => [q.id, q]));
    const responses = (session.responses || []).filter(r => String(r.raw_text || '').trim());
    const normalized = responses.map(r => normalizeResponse(r, byQuestion[r.question_id], locale));
    const missingQuestions = QUESTION_SET.questions.filter(q => !responses.some(r => r.question_id === q.id));
    const firstMissing = missingQuestions[0];
    const nextStepResponse = responses.find(r => r.question_id === 'q_start_alone_08');
    const openQuestionText = firstMissing
      ? textFor(firstMissing.prompt, locale)
      : (locale === 'ru' ? 'Какой ответ стоит обсудить с мудрым верующим человеком без спешки?' : locale === 'en' ? 'Which answer should you discuss with a wise believer without haste?' : 'Яку відповідь варто обговорити з мудрою віруючою людиною без поспіху?');
    return {
      id: `map_${safeUuid()}`,
      type: 'ConversationMap',
      locale,
      question_set_id: QUESTION_SET.id,
      generated_at: nowIso(),
      raw_answer_count: responses.length,
      normalized_answers: normalized,
      open_questions: [{
        id: 'openq_next_reflection',
        text: openQuestionText,
        uncertainty_label: 'suggested_question',
        source: firstMissing ? 'unanswered_question' : 'completed_short_set'
      }],
      wise_next_step: {
        id: 'step_user_named_or_counsel',
        text: nextStepResponse ? nextStepResponse.raw_text : (locale === 'ru' ? 'Выберите один небольшой шаг: молитва, чтение Писания, разговор с наставником или пауза без спешки.' : locale === 'en' ? 'Choose one small step: prayer, Scripture, a conversation with a mentor, or a pause without haste.' : 'Оберіть один невеликий крок: молитва, читання Писання, розмова з наставником або пауза без поспіху.'),
        uncertainty_label: 'wise_next_step'
      },
      caveats: d.caveatList,
      share_state: 'private'
    };
  }

  function buildExportPayload(map, locale = 'uk') {
    const d = UI[locale] || UI.uk;
    return {
      exported_at: nowIso(),
      exported_by_user: true,
      share_state: 'exported_by_user',
      export_notice: d.exportNotice,
      caveats: map.caveats || d.caveatList,
      map
    };
  }

  function saveSession(session) {
    if (!root.localStorage) return false;
    root.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return true;
  }

  function loadSession() {
    if (!root.localStorage) return null;
    try {
      const parsed = JSON.parse(root.localStorage.getItem(STORAGE_KEY) || 'null');
      return parsed && parsed.question_set_id === QUESTION_SET.id ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function clearSession() {
    if (root.localStorage) root.localStorage.removeItem(STORAGE_KEY);
  }

  function downloadJson(filename, payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function initStartAloneApp(mount) {
    if (!mount) return;
    let locale = root.localStorage?.getItem('before-we-build-lang') || document.documentElement.lang || 'uk';
    if (!UI[locale]) locale = 'uk';
    let session = loadSession() || createSession({ locale });
    let step = 0;
    let message = '';

    function setLang(lang) {
      locale = UI[lang] ? lang : 'uk';
      document.documentElement.lang = locale;
      root.localStorage?.setItem('before-we-build-lang', locale);
      session.locale = locale;
      saveSession(session);
      render();
    }

    function responseFor(questionId) {
      return session.responses.find(r => r.question_id === questionId)?.raw_text || '';
    }

    function persistCurrent() {
      const q = QUESTION_SET.questions[step];
      const input = mount.querySelector('[data-answer]');
      if (q && input) session = updateResponse(session, q.id, input.value);
      saveSession(session);
    }

    function renderMap() {
      const d = UI[locale];
      const map = session.conversation_map || buildPreparationMap(session, locale);
      session = { ...session, status: 'map_generated', stale_after_edit: false, normalized_answers: map.normalized_answers, conversation_map: map, updated_at: nowIso() };
      saveSession(session);
      return `<section class="start-alone-map test-result">
        <h2>${esc(d.mapTitle)}</h2>
        <p class="test-caveat">${esc(d.caveatList[0])}</p>
        <h3>${esc(d.answers)}</h3>
        <div class="start-alone-answer-list">${map.normalized_answers.map(n => `<article class="tim-card"><b>${esc(textFor(QUESTION_SET.questions.find(q => q.id === n.question_id).prompt, locale))}</b><p>${esc(n.user_words)}</p><small>${esc(n.uncertainty_label)}</small></article>`).join('')}</div>
        <div class="result-reading"><h3>${esc(d.openQuestions)}</h3><ul>${map.open_questions.map(q => `<li>${esc(q.text)}</li>`).join('')}</ul></div>
        <div class="result-reading"><h3>${esc(d.nextStep)}</h3><p>${esc(map.wise_next_step.text)}</p></div>
        <div class="research-card"><h3>${esc(d.caveats)}</h3><ul>${map.caveats.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>
        <p class="muted">${esc(d.exportNotice)}</p>
        <div class="test-actions"><button type="button" data-copy>${esc(d.copy)}</button><button type="button" class="primary" data-export>${esc(d.exportFile)}</button><button type="button" data-clear>${esc(d.clear)}</button></div>
      </section>`;
    }

    function renderQuestion() {
      const d = UI[locale];
      const q = QUESTION_SET.questions[step];
      const answered = session.responses.length;
      return `<section class="start-alone-flow">
        <div class="story-progress" role="status" aria-live="polite"><div><b>${esc(d.progress)} ${step + 1}/${QUESTION_SET.questions.length}</b><span>${answered}/${QUESTION_SET.questions.length}</span></div><span><i style="width:${Math.round(((step + 1) / QUESTION_SET.questions.length) * 100)}%"></i></span></div>
        <article class="journey-card start-alone-question">
          <p class="eyebrow">${esc(d.eyebrow)}</p>
          <h2>${esc(textFor(q.prompt, locale))}</h2>
          <textarea data-answer rows="9" placeholder="${esc(d.answerPlaceholder)}">${esc(responseFor(q.id))}</textarea>
          ${message ? `<p class="muted" role="status">${esc(message)}</p>` : ''}
        </article>
        <div class="test-actions start-alone-actions">
          <button type="button" data-prev ${step === 0 ? 'disabled' : ''}>${esc(d.back)}</button>
          <button type="button" data-save>${esc(d.save)}</button>
          <button type="button" data-next>${esc(step === QUESTION_SET.questions.length - 1 ? d.showMap : d.next)}</button>
        </div>
      </section>`;
    }

    function renderStart() {
      const d = UI[locale];
      const saved = loadSession();
      return `<section class="public-start"><div class="public-start-card">
        <div class="start-alone-lang lang-switch" role="group" aria-label="Language"><button type="button" data-lang="uk">UK</button><button type="button" data-lang="ru">RU</button><button type="button" data-lang="en">EN</button></div>
        <p class="eyebrow">${esc(d.eyebrow)}</p>
        <h1>${esc(d.title)}</h1>
        <p>${esc(d.intro)}</p>
        <div class="research-card"><b>${esc(d.privacy)}</b></div>
        ${saved && saved.responses && saved.responses.length ? `<p class="muted">${esc(d.resumeFound)}</p>` : ''}
        <div class="test-actions public-start-actions"><button type="button" class="primary" data-start>${esc(saved && saved.responses && saved.responses.length ? d.resume : d.start)}</button><button type="button" data-new>${esc(d.startNew)}</button></div>
      </div></section>`;
    }

    function bind() {
      mount.querySelectorAll('[data-lang]').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === locale);
        b.setAttribute('aria-pressed', String(b.dataset.lang === locale));
        b.addEventListener('click', () => setLang(b.dataset.lang));
      });
      mount.querySelector('[data-start]')?.addEventListener('click', () => { step = Math.min(session.responses.length, QUESTION_SET.questions.length - 1); message = ''; render('question'); });
      mount.querySelector('[data-new]')?.addEventListener('click', () => { session = createSession({ locale }); saveSession(session); step = 0; message = ''; render('question'); });
      mount.querySelector('[data-prev]')?.addEventListener('click', () => { persistCurrent(); step = Math.max(0, step - 1); message = ''; render('question'); });
      mount.querySelector('[data-save]')?.addEventListener('click', () => { persistCurrent(); message = UI[locale].saved; render('question'); });
      mount.querySelector('[data-next]')?.addEventListener('click', () => {
        persistCurrent();
        if (step < QUESTION_SET.questions.length - 1) { step += 1; message = ''; render('question'); return; }
        if (!session.responses.length) { message = UI[locale].missing; render('question'); return; }
        message = '';
        render('map');
      });
      mount.querySelector('[data-clear]')?.addEventListener('click', () => { clearSession(); session = createSession({ locale }); message = UI[locale].cleared; step = 0; render(); });
      mount.querySelector('[data-copy]')?.addEventListener('click', () => {
        const map = session.conversation_map || buildPreparationMap(session, locale);
        const text = `${UI[locale].mapTitle}: ${map.raw_answer_count}/${QUESTION_SET.questions.length}. ${map.wise_next_step.text}`;
        root.navigator?.clipboard?.writeText(text);
        message = UI[locale].copied;
      });
      mount.querySelector('[data-export]')?.addEventListener('click', () => {
        const map = session.conversation_map || buildPreparationMap(session, locale);
        downloadJson(`before-we-build-start-alone-${new Date().toISOString().slice(0,10)}.json`, buildExportPayload(map, locale));
      });
    }

    function render(mode = 'start') {
      mount.innerHTML = mode === 'question' ? renderQuestion() : mode === 'map' ? renderMap() : renderStart();
      bind();
    }

    render();
  }

  const api = { STORAGE_KEY, QUESTION_SET, UI, createSession, updateResponse, buildPreparationMap, buildExportPayload, saveSession, loadSession, clearSession, initStartAloneApp };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BeforeWeBuildStartAlone = api;
  if (root.document) {
    root.document.addEventListener('DOMContentLoaded', () => initStartAloneApp(root.document.querySelector('[data-start-alone-app]')));
  }
})(typeof window !== 'undefined' ? window : globalThis);
