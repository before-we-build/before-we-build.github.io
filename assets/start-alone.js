(function(root){
  'use strict';

  const STORAGE_KEY = 'before-we-build-start-alone-scripture-v1';
  const CONSENT_VERSION = 'scripture-first-local-v1-2026-06-01';
  const DEFAULT_LOCALE = 'uk';

  const SCRIPTURE_PATHS = [
    {
      id: 'path_house_on_rock',
      order: 1,
      reference: { uk: 'Матвія 7:24–27', ru: 'Матфея 7:24–27', en: 'Matthew 7:24–27' },
      title: { uk: 'Дім на камені', ru: 'Дом на камне', en: 'House on the rock' },
      passage: {
        uk: '«Кожного, хто слухає ці слова Мої та виконує їх, порівняю з чоловіком розсудливим, що збудував свій дім на камені…»',
        ru: '«Всякого, кто слушает слова Мои сии и исполняет их, уподоблю мужу благоразумному, который построил дом свой на камне…»',
        en: '“Everyone then who hears these words of mine and does them will be like a wise man who built his house on the rock…”'
      },
      afterText: {
        uk: 'Спершу текст говорить про слухання і виконання слів Христа. Тому питання починаються не з почуттів або поспішного висновку, а з основи послуху.',
        ru: 'Сначала текст говорит о слушании и исполнении слов Христа. Поэтому вопросы начинаются не с чувств или поспешного вывода, а с основания послушания.',
        en: 'The text first speaks about hearing and doing Christ’s words. So the questions begin not with feelings or a rushed conclusion, but with the foundation of obedience.'
      },
      questions: [
        q('rock_01','hearing_christ','Які слова Христа мені потрібно зараз не тільки почути, а й виконати?','Какие слова Христа мне сейчас нужно не только услышать, но и исполнить?','Which words of Christ do I need not only to hear now, but to do?'),
        q('rock_02','sand_or_rock','На чому я можу будувати «на піску»: на бажанні, страху, самотності, тиску чи поспіху?','На чём я могу строить «на песке»: на желании, страхе, одиночестве, давлении или спешке?','Where might I be building “on sand”: desire, fear, loneliness, pressure, or haste?'),
        q('rock_03','obedience_cost','Який конкретний послух Христу може змінити моє рішення або темп?','Какое конкретное послушание Христу может изменить моё решение или темп?','What concrete obedience to Christ might change my decision or pace?'),
        q('rock_04','storm_test','Як це рішення витримає випробування: конфлікт, втому, втрату вигоди або розчарування?','Как это решение выдержит испытание: конфликт, усталость, потерю выгоды или разочарование?','How would this decision endure testing: conflict, fatigue, loss of benefit, or disappointment?'),
        q('rock_05','next_obedient_step','Який один крок послуху я можу зробити до наступної обіцянки?','Какой один шаг послушания я могу сделать до следующего обещания?','What one step of obedience can I take before the next promise?')
      ]
    },
    {
      id: 'path_count_cost',
      order: 2,
      reference: { uk: 'Луки 14:28–30', ru: 'Луки 14:28–30', en: 'Luke 14:28–30' },
      title: { uk: 'Сісти й порахувати', ru: 'Сесть и рассчитать', en: 'Sit down and count' },
      passage: {
        uk: '«Хто бо з вас, коли хоче збудувати башту, не сяде перше й не вирахує видатків, чи має потрібне на виконання…»',
        ru: '«Ибо кто из вас, желая построить башню, не сядет прежде и не вычислит издержек, имеет ли он, что нужно для совершения её…»',
        en: '“For which of you, desiring to build a tower, does not first sit down and count the cost…”'
      },
      afterText: {
        uk: 'Текст ставить перед початком зупинку: сісти й рахувати ціну. Тому цей шлях допомагає назвати відповідальність до дії.',
        ru: 'Текст ставит перед началом остановку: сесть и посчитать цену. Поэтому этот путь помогает назвать ответственность до действия.',
        en: 'The text places a pause before beginning: sit down and count the cost. This path helps name responsibility before action.'
      },
      questions: [
        q('cost_01','what_building','Що саме я збираюся будувати — і чи можу назвати це без красивих загальних слів?','Что именно я собираюсь строить — и могу ли назвать это без красивых общих слов?','What exactly am I trying to build — and can I name it without vague beautiful words?'),
        q('cost_02','cost_named','Яку ціну це вимагатиме: часу, вірності, грошей, служіння, терпіння, відмови від себе?','Какую цену это потребует: времени, верности, денег, служения, терпения, отказа от себя?','What cost will this require: time, faithfulness, money, service, patience, self-denial?'),
        q('cost_03','unready','До чого я поки не готовий або не готова, якщо чесно сісти й порахувати?','К чему я пока не готов или не готова, если честно сесть и посчитать?','What am I not yet ready for if I honestly sit down and count?'),
        q('cost_04','hidden_assumptions','Яке припущення може зламатися після початку?','Какое предположение может сломаться после начала?','Which assumption might break after the beginning?'),
        q('cost_05','pause_or_proceed','Що було б мудріше зараз: іти далі, зупинитися, поставити питання чи попросити поради?','Что было бы мудрее сейчас: идти дальше, остановиться, задать вопрос или попросить совета?','What would be wiser now: proceed, pause, ask a question, or seek counsel?')
      ]
    },
    {
      id: 'path_wisdom_house',
      order: 3,
      reference: { uk: 'Приповісті 24:3–4', ru: 'Притчи 24:3–4', en: 'Proverbs 24:3–4' },
      title: { uk: 'Мудрість, розуміння і знання', ru: 'Мудрость, разумение и знание', en: 'Wisdom, understanding, and knowledge' },
      passage: {
        uk: '«Мудрістю будується дім, а розумом утверджується, і знанням кімнати наповнюються всяким дорогоцінним та приємним майном».',
        ru: '«Мудростью устрояется дом и разумом утверждается, и с умением внутренности его наполняются всяким драгоценным и прекрасным имуществом».',
        en: '“By wisdom a house is built, and by understanding it is established; by knowledge the rooms are filled…”'
      },
      afterText: {
        uk: 'Текст називає не власну схему, а три біблійні слова: мудрість, розуміння, знання. Питання допомагають побачити, чого бракує.',
        ru: 'Текст называет не нашу схему, а три библейских слова: мудрость, разумение, знание. Вопросы помогают увидеть, чего не хватает.',
        en: 'The text names not our framework, but three biblical words: wisdom, understanding, and knowledge. The questions help reveal what is lacking.'
      },
      questions: [
        q('wisdom_01','wisdom_needed','У чому мені зараз потрібна мудрість, а не тільки сильне бажання?','В чём мне сейчас нужна мудрость, а не только сильное желание?','Where do I need wisdom now, not merely strong desire?'),
        q('wisdom_02','understanding_needed','Що я ще не розумію про себе, іншу людину або саме рішення?','Что я ещё не понимаю о себе, другом человеке или самом решении?','What do I not yet understand about myself, the other person, or the decision itself?'),
        q('wisdom_03','knowledge_missing','Яких фактів або чесних відповідей мені бракує?','Каких фактов или честных ответов мне не хватает?','What facts or honest answers are still missing?'),
        q('wisdom_04','romanticizing','Що я можу прикрашати або уявляти краще, ніж воно є?','Что я могу приукрашивать или представлять лучше, чем оно есть?','What might I be romanticizing or imagining better than it is?'),
        q('wisdom_05','room_filled','Чим буде наповнюватися цей «дім» у звичайні дні, а не тільки у мрії?','Чем будет наполняться этот «дом» в обычные дни, а не только в мечте?','What will fill this “house” on ordinary days, not only in the dream?')
      ]
    },
    {
      id: 'path_many_counselors',
      order: 4,
      reference: { uk: 'Приповісті 15:22; 20:18', ru: 'Притчи 15:22; 20:18', en: 'Proverbs 15:22; 20:18' },
      title: { uk: 'Плани і порада', ru: 'Планы и совет', en: 'Plans and counsel' },
      passage: {
        uk: '«Ламаються задуми без поради, а при численності радників здійсняться». «Плани зміцнюються радою…»',
        ru: '«Без совета предприятия расстроятся, а при множестве советников они состоятся». «Предприятия получают твердость чрез совещание…»',
        en: '“Without counsel plans fail, but with many advisers they succeed.” “Plans are established by counsel…”'
      },
      afterText: {
        uk: 'Текст не веде до самовпевненого висновку. Він веде до поради. Тому цей шлях готує не вердикт, а розмову з мудрими людьми.',
        ru: 'Текст не ведёт к самоуверенному выводу. Он ведёт к совету. Поэтому этот путь готовит не вердикт, а разговор с мудрыми людьми.',
        en: 'The text does not lead to a self-assured verdict. It leads to counsel. So this path prepares not a verdict, but a conversation with wise people.'
      },
      questions: [
        q('counsel_01','plan_named','Какой план мне нужно вынести на совет, а не держать только внутри себя?','Какой план мне нужно вынести на совет, а не держать только внутри себя?','Which plan do I need to bring to counsel rather than keep inside myself?', 'Який план мені потрібно винести на пораду, а не тримати тільки в собі?'),
        q('counsel_02','who_counsel','Кого я могу попросить о зрелом совете до серьёзного шага?','Кого я могу попросить о зрелом совете до серьёзного шага?','Whom can I ask for mature counsel before a serious step?', 'Кого я можу попросити про зрілу пораду до серйозного кроку?'),
        q('counsel_03','what_to_disclose','Что мне нужно честно рассказать советнику, чтобы он не слышал только удобную часть?','Что мне нужно честно рассказать советнику, чтобы он не слышал только удобную часть?','What must I honestly tell a counselor so they do not hear only the convenient part?', 'Що мені потрібно чесно розповісти пораднику, щоб він не чув тільки зручну частину?'),
        q('counsel_04','resist_counsel','Какой совет мне было бы трудно принять, если он прозвучит?','Какой совет мне было бы трудно принять, если он прозвучит?','Which counsel would be hard for me to receive if it is spoken?', 'Яку пораду мені було б важко прийняти, якщо вона прозвучить?'),
        q('counsel_05','after_counsel','Что я сделаю после совета: проверю, подожду, уточню, покаюсь, остановлюсь или пойду дальше?','Что я сделаю после совета: проверю, подожду, уточню, покаюсь, остановлюсь или пойду дальше?','What will I do after counsel: test, wait, clarify, repent, stop, or proceed?', 'Що я зроблю після поради: перевірю, почекаю, уточню, покаюся, зупинюся чи піду далі?')
      ]
    },
    {
      id: 'path_lord_builds',
      order: 5,
      reference: { uk: 'Псалом 126:1 / Psalm 127:1', ru: 'Псалом 126:1 / Psalm 127:1', en: 'Psalm 127:1 / Psalm 126:1' },
      title: { uk: 'Якщо Господь не будує', ru: 'Если Господь не созиждет', en: 'Unless the Lord builds' },
      passage: {
        uk: '«Коли дому Господь не будує, даремно працюють його будівничі…»',
        ru: '«Если Господь не созиждет дома, напрасно трудятся строящие его…»',
        en: '“Unless the LORD builds the house, those who build it labor in vain…”'
      },
      afterText: {
        uk: 'Текст ставить найпершим не успішність плану, а Господа. Тому питання починаються з того, чи не будуємо ми своє всупереч Йому.',
        ru: 'Текст ставит первым не успешность плана, а Господа. Поэтому вопросы начинаются с того, не строим ли мы своё вопреки Ему.',
        en: 'The text places first not the success of the plan, but the Lord. So the questions begin with whether we are building our own thing against Him.'
      },
      questions: [
        q('lord_01','lord_or_self','Где я могу называть Божьим строительством то, что на самом деле является моим желанием?','Где я могу называть Божьим строительством то, что на самом деле является моим желанием?','Where might I be calling something the Lord’s building when it is actually my desire?', 'Де я можу називати Божим будівництвом те, що насправді є моїм бажанням?'),
        q('lord_02','prayer','О чём мне нужно молиться не как о формальности, а как о реальной зависимости от Господа?','О чём мне нужно молиться не как о формальности, а как о реальной зависимости от Господа?','What do I need to pray about not as a formality, but as real dependence on the Lord?', 'Про що мені потрібно молитися не як про формальність, а як про справжню залежність від Господа?'),
        q('lord_03','vain_labor','Какой труд может оказаться напрасным, если Господь не благословляет этот путь?','Какой труд может оказаться напрасным, если Господь не благословляет этот путь?','What labor might be in vain if the Lord does not bless this path?', 'Яка праця може виявитися марною, якщо Господь не благословляє цей шлях?'),
        q('lord_04','submission','Где мне нужно быть готовым остановиться, если Писание, совесть и мудрый совет укажут на опасность?','Где мне нужно быть готовым остановиться, если Писание, совесть и мудрый совет укажут на опасность?','Where must I be willing to stop if Scripture, conscience, and wise counsel point to danger?', 'Де мені потрібно бути готовим зупинитися, якщо Писання, сумління і мудра порада вкажуть на небезпеку?'),
        q('lord_05','entrust','Что я должен или должна доверить Господу, а не пытаться удержать силой?','Что я должен или должна доверить Господу, а не пытаться удержать силой?','What must I entrust to the Lord instead of trying to hold by force?', 'Що я маю довірити Господу, а не намагатися втримати силою?')
      ]
    }
  ];

  const QUESTION_SET = {
    id: 'qset_scripture_first_v1',
    version: '1.0.0',
    path_id: 'scripture_first_selectable',
    paths: SCRIPTURE_PATHS,
    questions: SCRIPTURE_PATHS.flatMap(path => path.questions.map(question => ({ ...question, path_id: path.id })))
  };

  const UI = {
    uk: {
      brand: 'Перш ніж будувати',
      eyebrow: 'Писання спочатку',
      title: 'Оберіть місце Писання, з якого почати',
      intro: 'Спершу — текст Писання. Потім — короткі питання, які прямо випливають з обраного уривка. Без висновку про вас і без прихованого вироку.',
      chooseText: 'Який уривок зараз ближчий до вашого питання?',
      privacy: 'Відповіді зберігаються тільки у цьому браузері. Нічого не надсилається і не відкривається іншій людині автоматично.',
      resumeFound: 'Знайдено збережений шлях у цьому браузері.',
      resume: 'Продовжити збережений шлях',
      startNew: 'Почати заново',
      start: 'Почати з цього уривка',
      back: 'Назад',
      next: 'Далі',
      save: 'Зберегти тут',
      clear: 'Видалити локальні дані',
      showMap: 'Показати підсумок',
      exportFile: 'Завантажити файл',
      copy: 'Скопіювати короткий підсумок',
      answerPlaceholder: 'Ваша відповідь. Можна коротко, чесно і без поспіху.',
      progress: 'Питання',
      missing: 'Дайте відповідь хоча б на одне питання, щоб побачити підсумок.',
      saved: 'Збережено у цьому браузері.',
      cleared: 'Локальні дані видалено.',
      mapTitle: 'Ваш підсумок перед Богом і Писанням',
      selectedScripture: 'Обраний уривок',
      answers: 'Збережені сирі відповіді',
      openQuestions: 'Що ще варто принести в молитву, Писання і пораду',
      caveats: 'Межі цього підсумку',
      nextStep: 'Наступний вірний крок',
      copied: 'Скопійовано.',
      exportNotice: 'Файл створюється тільки після вашого натискання. Після завантаження ви самі вирішуєте, чи показувати його комусь.',
      caveatList: [
        'Цей підсумок не є вироком, пророцтвом або заміною Писання, молитви, церкви й мудрої поради.',
        'Він не обіцяє шлюб, не оцінює готовність і не порівнює вас з іншими людьми.',
        'Якщо відповідь торкається небезпеки, примусу, насильства або самозашкодження, зверніться до безпечної живої допомоги.'
      ]
    },
    ru: {
      brand: 'Прежде чем строить',
      eyebrow: 'Сначала Писание',
      title: 'Выберите место Писания, с которого начать',
      intro: 'Сначала — текст Писания. Потом — короткие вопросы, которые прямо вытекают из выбранного отрывка. Без вывода о вас и без скрытого вердикта.',
      chooseText: 'Какой отрывок сейчас ближе к вашему вопросу?',
      privacy: 'Ответы сохраняются только в этом браузере. Ничего не отправляется и не открывается другому человеку автоматически.',
      resumeFound: 'Найден сохранённый путь в этом браузере.',
      resume: 'Продолжить сохранённый путь',
      startNew: 'Начать заново',
      start: 'Начать с этого отрывка',
      back: 'Назад',
      next: 'Дальше',
      save: 'Сохранить здесь',
      clear: 'Удалить локальные данные',
      showMap: 'Показать итог',
      exportFile: 'Скачать файл',
      copy: 'Скопировать краткий итог',
      answerPlaceholder: 'Ваш ответ. Можно коротко, честно и без спешки.',
      progress: 'Вопрос',
      missing: 'Ответьте хотя бы на один вопрос, чтобы увидеть итог.',
      saved: 'Сохранено в этом браузере.',
      cleared: 'Локальные данные удалены.',
      mapTitle: 'Ваш итог перед Богом и Писанием',
      selectedScripture: 'Выбранный отрывок',
      answers: 'Сохранённые сырые ответы',
      openQuestions: 'Что ещё стоит принести в молитву, Писание и совет',
      caveats: 'Границы этого итога',
      nextStep: 'Следующий верный шаг',
      copied: 'Скопировано.',
      exportNotice: 'Файл создаётся только после вашего нажатия. После скачивания вы сами решаете, показывать ли его кому-то.',
      caveatList: [
        'Этот итог не является вердиктом, пророчеством или заменой Писания, молитвы, церкви и мудрого совета.',
        'Он не обещает брак, не оценивает готовность и не сравнивает вас с другими людьми.',
        'Если ответ касается опасности, принуждения, насилия или самоповреждения, обратитесь к безопасной живой помощи.'
      ]
    },
    en: {
      brand: 'Before We Build',
      eyebrow: 'Scripture first',
      title: 'Choose the Scripture passage to begin with',
      intro: 'First, the text of Scripture. Then short questions that flow directly from the chosen passage. No conclusion about you and no hidden verdict.',
      chooseText: 'Which passage is closest to your question right now?',
      privacy: 'Answers are stored only in this browser. Nothing is sent or opened to another person automatically.',
      resumeFound: 'A saved path was found in this browser.',
      resume: 'Resume saved path',
      startNew: 'Start again',
      start: 'Begin with this passage',
      back: 'Back',
      next: 'Next',
      save: 'Save here',
      clear: 'Delete local data',
      showMap: 'Show summary',
      exportFile: 'Download file',
      copy: 'Copy short summary',
      answerPlaceholder: 'Your answer. Short, honest, and without haste is enough.',
      progress: 'Question',
      missing: 'Answer at least one question to see the summary.',
      saved: 'Saved in this browser.',
      cleared: 'Local data deleted.',
      mapTitle: 'Your summary before God and Scripture',
      selectedScripture: 'Selected passage',
      answers: 'Stored raw answers',
      openQuestions: 'What to bring to prayer, Scripture, and counsel',
      caveats: 'Boundaries of this summary',
      nextStep: 'Next faithful step',
      copied: 'Copied.',
      exportNotice: 'The file is created only after you press the button. After download, you decide whether to show it to anyone.',
      caveatList: [
        'This summary is not a verdict, prophecy, or replacement for Scripture, prayer, church, and wise counsel.',
        'It does not promise marriage, judge preparedness, or compare you with other people.',
        'If an answer touches danger, coercion, abuse, or self-harm, seek safe human help.'
      ]
    }
  };

  function q(id, theme, uk, ru, en, ukOverride) {
    return { id: `q_${id}`, theme, prompt: { uk: ukOverride || uk, ru, en } };
  }

  const nowIso = () => new Date().toISOString();
  const safeUuid = () => (root.crypto && root.crypto.randomUUID ? root.crypto.randomUUID() : `local_${Date.now()}_${Math.random().toString(16).slice(2)}`);
  const textFor = (obj, locale) => obj[locale] || obj.uk || obj.ru || obj.en || '';
  const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function pathFor(sessionOrPathId) {
    const pathId = typeof sessionOrPathId === 'string' ? sessionOrPathId : sessionOrPathId?.selected_path_id;
    return SCRIPTURE_PATHS.find(p => p.id === pathId) || SCRIPTURE_PATHS[0];
  }

  function questionsFor(sessionOrPathId) {
    return pathFor(sessionOrPathId).questions;
  }

  function createSession({ locale = DEFAULT_LOCALE, selectedPathId = SCRIPTURE_PATHS[0].id } = {}) {
    const t = nowIso();
    return {
      id: `session_${safeUuid()}`,
      created_at: t,
      updated_at: t,
      locale,
      selected_path_id: pathFor(selectedPathId).id,
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
      next.responses.push({ id: `response_${safeUuid()}`, question_id: questionId, question_set_id: QUESTION_SET.id, selected_path_id: next.selected_path_id, raw_text: trimmed, answer_kind: 'free_text', created_at: nowIso(), updated_at: nowIso() });
    }
    next.responses = next.responses.filter(r => r.raw_text.length > 0);
    next.updated_at = nowIso();
    next.status = next.responses.length ? 'in_progress' : 'started';
    next.stale_after_edit = true;
    next.normalized_answers = [];
    next.conversation_map = null;
    return next;
  }

  function normalizeResponse(response, question, locale = DEFAULT_LOCALE) {
    return { id: `norm_${response.question_id}`, question_id: response.question_id, source_response_id: response.id || null, theme: question ? question.theme : 'unknown', user_words: response.raw_text, summary: response.raw_text.slice(0, 420), uncertainty_label: 'user_self_description', derived_at: nowIso(), note: locale === 'ru' ? 'Краткое сохранение слов пользователя без вывода о человеке.' : locale === 'en' ? 'Brief preservation of the user’s words without a conclusion about the person.' : 'Коротке збереження слів користувача без висновку про людину.' };
  }

  function buildPreparationMap(session, locale = DEFAULT_LOCALE) {
    const d = UI[locale] || UI.uk;
    const selectedPath = pathFor(session);
    const questions = questionsFor(session);
    const byQuestion = Object.fromEntries(questions.map(q => [q.id, q]));
    const responses = (session.responses || []).filter(r => String(r.raw_text || '').trim() && byQuestion[r.question_id]);
    const normalized = responses.map(r => normalizeResponse(r, byQuestion[r.question_id], locale));
    const missingQuestions = questions.filter(q => !responses.some(r => r.question_id === q.id));
    const firstMissing = missingQuestions[0];
    const nextStepResponse = responses[responses.length - 1];
    const openQuestionText = firstMissing ? textFor(firstMissing.prompt, locale) : (locale === 'ru' ? 'Какой ответ стоит обсудить с мудрым верующим человеком без спешки?' : locale === 'en' ? 'Which answer should you discuss with a wise believer without haste?' : 'Яку відповідь варто обговорити з мудрою віруючою людиною без поспіху?');
    return {
      id: `summary_${safeUuid()}`,
      type: 'ScriptureFirstPreparation',
      locale,
      question_set_id: QUESTION_SET.id,
      selected_path_id: selectedPath.id,
      selected_scripture: { reference: textFor(selectedPath.reference, locale), title: textFor(selectedPath.title, locale), passage: textFor(selectedPath.passage, locale) },
      generated_at: nowIso(),
      raw_answer_count: responses.length,
      normalized_answers: normalized,
      open_questions: [{ id: 'openq_next_reflection', text: openQuestionText, uncertainty_label: 'suggested_question', source: firstMissing ? 'unanswered_question' : 'completed_short_set' }],
      wise_next_step: { id: 'step_bring_to_scripture_prayer_counsel', text: nextStepResponse ? nextStepResponse.raw_text : (locale === 'ru' ? 'Вернитесь к выбранному отрывку, помолитесь, запишите один честный ответ и при необходимости принесите его на мудрый совет.' : locale === 'en' ? 'Return to the selected passage, pray, write one honest answer, and if needed bring it to wise counsel.' : 'Поверніться до обраного уривка, помоліться, запишіть одну чесну відповідь і за потреби принесіть її на мудру пораду.'), uncertainty_label: 'faithful_next_step' },
      caveats: d.caveatList,
      share_state: 'private'
    };
  }

  function buildExportPayload(map, locale = DEFAULT_LOCALE) {
    const d = UI[locale] || UI.uk;
    return { exported_at: nowIso(), exported_by_user: true, share_state: 'exported_by_user', export_notice: d.exportNotice, caveats: map.caveats || d.caveatList, map };
  }

  function saveSession(session) { if (!root.localStorage) return false; root.localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); return true; }
  function loadSession() { if (!root.localStorage) return null; try { const parsed = JSON.parse(root.localStorage.getItem(STORAGE_KEY) || 'null'); return parsed && parsed.question_set_id === QUESTION_SET.id ? parsed : null; } catch (_) { return null; } }
  function clearSession() { if (root.localStorage) root.localStorage.removeItem(STORAGE_KEY); }

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
    let locale = root.localStorage?.getItem('before-we-build-lang') || document.documentElement.lang || DEFAULT_LOCALE;
    if (!UI[locale]) locale = DEFAULT_LOCALE;
    let savedSession = loadSession();
    let selectedPathId = savedSession?.selected_path_id || SCRIPTURE_PATHS[0].id;
    let session = savedSession || createSession({ locale, selectedPathId });
    let step = 0;
    let message = '';

    function setLang(lang) { locale = UI[lang] ? lang : DEFAULT_LOCALE; document.documentElement.lang = locale; root.localStorage?.setItem('before-we-build-lang', locale); session.locale = locale; saveSession(session); render(); }
    function activeQuestions() { return questionsFor(session); }
    function responseFor(questionId) { return session.responses.find(r => r.question_id === questionId)?.raw_text || ''; }
    function persistCurrent() { const q = activeQuestions()[step]; const input = mount.querySelector('[data-answer]'); if (q && input) session = updateResponse(session, q.id, input.value); saveSession(session); }
    function startFresh() { session = createSession({ locale, selectedPathId }); saveSession(session); step = 0; message = ''; render('question'); }

    function renderScriptureBlock(path, compact = false) {
      return `<figure class="scripture-callout scripture-path-callout ${compact ? 'compact' : ''}"><blockquote>${esc(textFor(path.passage, locale))}</blockquote><figcaption>${esc(textFor(path.reference, locale))} · ${esc(textFor(path.title, locale))}</figcaption></figure>`;
    }

    function renderMap() {
      const d = UI[locale];
      const selectedPath = pathFor(session);
      const questions = activeQuestions();
      const map = session.conversation_map || buildPreparationMap(session, locale);
      session = { ...session, status: 'map_generated', stale_after_edit: false, normalized_answers: map.normalized_answers, conversation_map: map, updated_at: nowIso() };
      saveSession(session);
      return `<section class="start-alone-map test-result">
        <h2>${esc(d.mapTitle)}</h2>
        <div class="result-reading"><h3>${esc(d.selectedScripture)}</h3>${renderScriptureBlock(selectedPath, true)}<p>${esc(textFor(selectedPath.afterText, locale))}</p></div>
        <p class="test-caveat">${esc(d.caveatList[0])}</p>
        <h3>${esc(d.answers)}</h3>
        <div class="start-alone-answer-list">${map.normalized_answers.map(n => `<article class="tim-card"><b>${esc(textFor((questions.find(q => q.id === n.question_id) || {}).prompt || {}, locale))}</b><p>${esc(n.user_words)}</p><small>${esc(n.uncertainty_label)}</small></article>`).join('')}</div>
        <div class="result-reading"><h3>${esc(d.openQuestions)}</h3><ul>${map.open_questions.map(q => `<li>${esc(q.text)}</li>`).join('')}</ul></div>
        <div class="result-reading"><h3>${esc(d.nextStep)}</h3><p>${esc(map.wise_next_step.text)}</p></div>
        <div class="research-card"><h3>${esc(d.caveats)}</h3><ul>${map.caveats.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>
        <p class="muted">${esc(d.exportNotice)}</p>
        <div class="test-actions"><button type="button" data-copy>${esc(d.copy)}</button><button type="button" class="primary" data-export>${esc(d.exportFile)}</button><button type="button" data-clear>${esc(d.clear)}</button></div>
      </section>`;
    }

    function renderQuestion() {
      const d = UI[locale];
      const selectedPath = pathFor(session);
      const questions = activeQuestions();
      const currentQuestion = questions[step];
      const answered = session.responses.filter(r => questions.some(q => q.id === r.question_id)).length;
      return `<section class="start-alone-flow">
        ${renderScriptureBlock(selectedPath)}
        <p class="muted scripture-after-text">${esc(textFor(selectedPath.afterText, locale))}</p>
        <div class="story-progress" role="status" aria-live="polite"><div><b>${esc(d.progress)} ${step + 1}/${questions.length}</b><span>${answered}/${questions.length}</span></div><span><i style="width:${Math.round(((step + 1) / questions.length) * 100)}%"></i></span></div>
        <article class="journey-card start-alone-question">
          <p class="eyebrow">${esc(d.eyebrow)}</p>
          <h2>${esc(textFor(currentQuestion.prompt, locale))}</h2>
          <textarea data-answer rows="9" placeholder="${esc(d.answerPlaceholder)}">${esc(responseFor(currentQuestion.id))}</textarea>
          ${message ? `<p class="muted" role="status">${esc(message)}</p>` : ''}
        </article>
        <div class="test-actions start-alone-actions">
          <button type="button" data-prev ${step === 0 ? 'disabled' : ''}>${esc(d.back)}</button>
          <button type="button" data-save>${esc(d.save)}</button>
          <button type="button" data-next>${esc(step === questions.length - 1 ? d.showMap : d.next)}</button>
        </div>
      </section>`;
    }

    function renderStart() {
      const d = UI[locale];
      const saved = loadSession();
      return `<section class="public-start"><div class="public-start-card scripture-start-card">
        <div class="start-alone-lang lang-switch" role="group" aria-label="Language"><button type="button" data-lang="uk">UK</button><button type="button" data-lang="ru">RU</button><button type="button" data-lang="en">EN</button></div>
        <p class="eyebrow">${esc(d.eyebrow)}</p>
        <h1>${esc(d.title)}</h1>
        <p>${esc(d.intro)}</p>
        <div class="research-card"><b>${esc(d.privacy)}</b></div>
        <h2 class="scripture-select-title">${esc(d.chooseText)}</h2>
        <div class="scripture-path-grid">${SCRIPTURE_PATHS.map(path => `<button type="button" class="scripture-path-card ${path.id === selectedPathId ? 'active' : ''}" data-select-path="${esc(path.id)}" aria-pressed="${path.id === selectedPathId ? 'true' : 'false'}"><span class="chip">${String(path.order).padStart(2,'0')}</span><b>${esc(textFor(path.reference, locale))}</b><strong>${esc(textFor(path.title, locale))}</strong><small>${esc(textFor(path.passage, locale))}</small></button>`).join('')}</div>
        ${saved && saved.responses && saved.responses.length ? `<p class="muted">${esc(d.resumeFound)} ${esc(textFor(pathFor(saved).reference, locale))}</p>` : ''}
        <div class="test-actions public-start-actions"><button type="button" class="primary" data-start>${esc(saved && saved.responses && saved.responses.length ? d.resume : d.start)}</button><button type="button" data-new>${esc(d.startNew)}</button></div>
      </div></section>`;
    }

    function bind() {
      mount.querySelectorAll('[data-lang]').forEach(b => { b.classList.toggle('active', b.dataset.lang === locale); b.setAttribute('aria-pressed', String(b.dataset.lang === locale)); b.addEventListener('click', () => setLang(b.dataset.lang)); });
      mount.querySelectorAll('[data-select-path]').forEach(b => { b.addEventListener('click', () => { selectedPathId = b.dataset.selectPath; if (!session.responses.length) session.selected_path_id = selectedPathId; message = ''; render(); }); });
      mount.querySelector('[data-start]')?.addEventListener('click', () => { if (!session.responses.length || session.selected_path_id !== selectedPathId) session = createSession({ locale, selectedPathId }); saveSession(session); step = Math.min(session.responses.length, activeQuestions().length - 1); message = ''; render('question'); });
      mount.querySelector('[data-new]')?.addEventListener('click', startFresh);
      mount.querySelector('[data-prev]')?.addEventListener('click', () => { persistCurrent(); step = Math.max(0, step - 1); message = ''; render('question'); });
      mount.querySelector('[data-save]')?.addEventListener('click', () => { persistCurrent(); message = UI[locale].saved; render('question'); });
      mount.querySelector('[data-next]')?.addEventListener('click', () => { persistCurrent(); const questions = activeQuestions(); if (step < questions.length - 1) { step += 1; message = ''; render('question'); return; } if (!session.responses.length) { message = UI[locale].missing; render('question'); return; } message = ''; render('map'); });
      mount.querySelector('[data-clear]')?.addEventListener('click', () => { clearSession(); session = createSession({ locale, selectedPathId }); message = UI[locale].cleared; step = 0; render(); });
      mount.querySelector('[data-copy]')?.addEventListener('click', () => { const map = session.conversation_map || buildPreparationMap(session, locale); const text = `${UI[locale].mapTitle}: ${map.selected_scripture.reference}. ${map.wise_next_step.text}`; root.navigator?.clipboard?.writeText(text); message = UI[locale].copied; });
      mount.querySelector('[data-export]')?.addEventListener('click', () => { const map = session.conversation_map || buildPreparationMap(session, locale); downloadJson(`before-we-build-scripture-first-${new Date().toISOString().slice(0,10)}.json`, buildExportPayload(map, locale)); });
    }

    function render(mode = 'start') { mount.innerHTML = mode === 'question' ? renderQuestion() : mode === 'map' ? renderMap() : renderStart(); bind(); }
    render();
  }

  const api = { STORAGE_KEY, CONSENT_VERSION, SCRIPTURE_PATHS, QUESTION_SET, UI, pathFor, questionsFor, createSession, updateResponse, buildPreparationMap, buildExportPayload, saveSession, loadSession, clearSession, initStartAloneApp };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BeforeWeBuildStartAlone = api;
  if (root.document) root.document.addEventListener('DOMContentLoaded', () => initStartAloneApp(root.document.querySelector('[data-start-alone-app]')));
})(typeof window !== 'undefined' ? window : globalThis);
