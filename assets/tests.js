const I18N = {
  ru: {
    'nav.model': 'Модель', 'nav.processes': 'Процессы', 'layers.nav': 'Слои', 'nav.tests': 'Тесты', 'nav.graph': 'Граф', 'nav.pages': 'Страницы',
    footer: 'PsyCalc LLM Wiki · размещено на GitHub Pages · github.com/psycalc/psycalc.github.io',
    'tests.eyebrow': 'Исследовательские тесты', 'tests.title': 'Черновые PsyCalc-тесты',
    'tests.intro': 'Это не валидированная диагностика, а быстрые опросники-гипотезы по трём системам. Для Соционики результат теперь показывает предварительно близкие TIM, а не только аспекты.',
    'tests.note': 'Тесты лучше использовать как начало разговора или подготовки к интервью, а не как финальный ярлык типа.',
    'tests.scale.left': 'не похоже', 'tests.scale.right': 'очень похоже', 'tests.submit': 'Показать гипотезу', 'tests.reset': 'Сбросить',
    'tests.result': 'Предварительный профиль', 'tests.timResult': 'Топ-3 наиболее близких TIM', 'tests.aspectTrace': 'Аспектный след ответов',
    'tests.missing': 'Ответьте на все вопросы этого блока.',
    'tests.caveat': 'Результат — рабочая гипотеза по самоотчёту, не окончательное типирование и не основание для важных решений.',
    'tests.socionicsCaveat': 'Это грубое соответствие профиля ответов 16 соционическим TIM. MBTI-алиасы в скобках приблизительны и не являются полными эквивалентами Соционики.'
  },
  en: {
    'nav.model': 'Model', 'nav.processes': 'Processes', 'layers.nav': 'Layers', 'nav.tests': 'Tests', 'nav.graph': 'Graph', 'nav.pages': 'Pages',
    footer: 'PsyCalc LLM Wiki · hosted on GitHub Pages · github.com/psycalc/psycalc.github.io',
    'tests.eyebrow': 'Research tests', 'tests.title': 'Draft PsyCalc tests',
    'tests.intro': 'These are not validated diagnostics, but quick hypothesis questionnaires for the three systems. Socionics now returns preliminary closest TIM profiles, not only aspects.',
    'tests.note': 'Use these tests as a starting point for reflection or interview preparation, not as a final type label.',
    'tests.scale.left': 'unlike me', 'tests.scale.right': 'very like me', 'tests.submit': 'Show hypothesis', 'tests.reset': 'Reset',
    'tests.result': 'Preliminary profile', 'tests.timResult': 'Top-3 closest TIM profiles', 'tests.aspectTrace': 'Aspect trace of answers',
    'tests.missing': 'Please answer every question in this block.',
    'tests.caveat': 'The result is a self-report working hypothesis, not final typing and not a basis for important decisions.',
    'tests.socionicsCaveat': 'This is a rough fit between your answer profile and the 16 Socionics TIMs. MBTI aliases in brackets are approximate and not full equivalents of Socionics.'
  },
  uk: {
    'nav.model': 'Модель', 'nav.processes': 'Процеси', 'layers.nav': 'Шари', 'nav.tests': 'Тести', 'nav.graph': 'Граф', 'nav.pages': 'Сторінки',
    footer: 'PsyCalc LLM Wiki · розміщено на GitHub Pages · github.com/psycalc/psycalc.github.io',
    'tests.eyebrow': 'Дослідницькі тести', 'tests.title': 'Чернеткові PsyCalc-тести',
    'tests.intro': 'Це не валідована діагностика, а швидкі опитувальники-гіпотези для трьох систем. Для Соціоніки результат тепер показує попередньо близькі TIM, а не лише аспекти.',
    'tests.note': 'Тести краще використовувати як початок розмови або підготовку до інтервʼю, а не як фінальний ярлик типу.',
    'tests.scale.left': 'не схоже', 'tests.scale.right': 'дуже схоже', 'tests.submit': 'Показати гіпотезу', 'tests.reset': 'Скинути',
    'tests.result': 'Попередній профіль', 'tests.timResult': 'Топ-3 найближчих TIM', 'tests.aspectTrace': 'Аспектний слід відповідей',
    'tests.missing': 'Дайте відповідь на всі питання цього блоку.',
    'tests.caveat': 'Результат — робоча гіпотеза за самоописом, не остаточне типування і не основа для важливих рішень.',
    'tests.socionicsCaveat': 'Це грубе зіставлення профілю відповідей із 16 соціонічними TIM. MBTI-аліаси в дужках приблизні й не є повними еквівалентами Соціоніки.'
  }
};

const SOCIONICS_ASPECT_LABELS = {
  ru: { Ti: 'БЛ', Te: 'ЧЛ', Fi: 'БЭ', Fe: 'ЧЭ', Si: 'БС', Se: 'ЧС', Ni: 'БИ', Ne: 'ЧИ' },
  en: { Ti: 'Ti / structural logic', Te: 'Te / pragmatic logic', Fi: 'Fi / relations', Fe: 'Fe / emotions', Si: 'Si / comfort', Se: 'Se / force', Ni: 'Ni / time', Ne: 'Ne / possibilities' },
  uk: { Ti: 'БЛ', Te: 'ЧЛ', Fi: 'БЕ', Fe: 'ЧЕ', Si: 'БС', Se: 'ЧС', Ni: 'БІ', Ne: 'ЧІ' }
};

const TIMS = [
  ['ILE', 'ENTP', { ru: 'Дон Кихот', en: 'Don Quixote', uk: 'Дон Кіхот' }, ['Ne', 'Ti', 'Si', 'Fe']],
  ['SEI', 'ISFP', { ru: 'Дюма', en: 'Dumas', uk: 'Дюма' }, ['Si', 'Fe', 'Ne', 'Ti']],
  ['ESE', 'ESFJ', { ru: 'Гюго', en: 'Hugo', uk: 'Гюго' }, ['Fe', 'Si', 'Ti', 'Ne']],
  ['LII', 'INTJ', { ru: 'Робеспьер', en: 'Robespierre', uk: 'Робеспʼєр' }, ['Ti', 'Ne', 'Fe', 'Si']],
  ['EIE', 'ENFJ', { ru: 'Гамлет', en: 'Hamlet', uk: 'Гамлет' }, ['Fe', 'Ni', 'Ti', 'Se']],
  ['LSI', 'ISTJ', { ru: 'Максим Горький', en: 'Maxim Gorky', uk: 'Максим Горький' }, ['Ti', 'Se', 'Fe', 'Ni']],
  ['SLE', 'ESTP', { ru: 'Жуков', en: 'Zhukov', uk: 'Жуков' }, ['Se', 'Ti', 'Ni', 'Fe']],
  ['IEI', 'INFP', { ru: 'Есенин', en: 'Yesenin', uk: 'Єсенін' }, ['Ni', 'Fe', 'Se', 'Ti']],
  ['SEE', 'ESFP', { ru: 'Наполеон', en: 'Napoleon', uk: 'Наполеон' }, ['Se', 'Fi', 'Ni', 'Te']],
  ['ILI', 'INTP', { ru: 'Бальзак', en: 'Balzac', uk: 'Бальзак' }, ['Ni', 'Te', 'Se', 'Fi']],
  ['LIE', 'ENTJ', { ru: 'Джек Лондон', en: 'Jack London', uk: 'Джек Лондон' }, ['Te', 'Ni', 'Fi', 'Se']],
  ['ESI', 'ISFJ', { ru: 'Драйзер', en: 'Dreiser', uk: 'Драйзер' }, ['Fi', 'Se', 'Te', 'Ni']],
  ['LSE', 'ESTJ', { ru: 'Штирлиц', en: 'Stierlitz', uk: 'Штірліц' }, ['Te', 'Si', 'Fi', 'Ne']],
  ['EII', 'INFJ', { ru: 'Достоевский', en: 'Dostoevsky', uk: 'Достоєвський' }, ['Fi', 'Ne', 'Te', 'Si']],
  ['IEE', 'ENFP', { ru: 'Гексли', en: 'Huxley', uk: 'Гекслі' }, ['Ne', 'Fi', 'Si', 'Te']],
  ['SLI', 'ISTP', { ru: 'Габен', en: 'Gabin', uk: 'Габен' }, ['Si', 'Te', 'Ne', 'Fi']]
];

const TESTS = {
  socionics: {
    labels: { ru: ['Соционика', 'Тактический уровень · моделирование информации'], en: ['Socionics', 'Tactical level · information modeling'], uk: ['Соціоніка', 'Тактичний рівень · моделювання інформації'] },
    dims: ['Ti', 'Te', 'Fi', 'Fe', 'Si', 'Se', 'Ni', 'Ne'],
    items: {
      ru: [['Когда я сталкиваюсь с новой системой, я сначала хочу понять, как её части логически связаны.', 'Ti'], ['Мне спокойнее опираться на метод, который уже показал практический результат.', 'Te'], ['Я быстро замечаю, когда между людьми изменилась дистанция или доверие.', 'Fi'], ['Если эмоции в группе подвисли, мне хочется сделать общий тон более явным.', 'Fe'], ['Если что-то идёт не так, я часто первым делом меняю темп, комфорт или физическую организацию среды.', 'Si'], ['В напряжённой ситуации я быстро считываю, кто реально влияет на происходящее.', 'Se'], ['При планировании я отслеживаю, к чему всё идёт по внутренней линии развития.', 'Ni'], ['Меня оживляют новые возможности, даже если ещё непонятно, какая из них лучшая.', 'Ne']],
      en: [['When I meet a new system, I first want to understand how its parts logically connect.', 'Ti'], ['I feel calmer using a method that has already produced practical results.', 'Te'], ['I quickly notice when distance or trust between people has changed.', 'Fi'], ['If a group’s emotions feel suspended, I want to make the shared tone clearer.', 'Fe'], ['When something goes wrong, I often first adjust tempo, comfort, or the physical setup.', 'Si'], ['In a tense situation, I quickly read who really influences what is happening.', 'Se'], ['When planning, I track where events seem to be heading internally.', 'Ni'], ['New possibilities energize me even before it is clear which one is best.', 'Ne']],
      uk: [['Коли я стикаюся з новою системою, спершу хочу зрозуміти, як її частини логічно пов’язані.', 'Ti'], ['Мені спокійніше спиратися на метод, який уже дав практичний результат.', 'Te'], ['Я швидко помічаю, коли між людьми змінилася дистанція або довіра.', 'Fi'], ['Якщо емоції в групі зависли, мені хочеться зробити спільний тон яснішим.', 'Fe'], ['Коли щось іде не так, я часто спершу змінюю темп, комфорт або фізичну організацію середовища.', 'Si'], ['У напруженій ситуації я швидко зчитую, хто реально впливає на події.', 'Se'], ['Плануючи, я відстежую, куди все рухається за внутрішньою лінією розвитку.', 'Ni'], ['Нові можливості мене оживляють, навіть якщо ще неясно, яка з них найкраща.', 'Ne']]
    }
  },
  psychosophy: { labels: { ru: ['Психософия', 'Оперативный уровень · анализ и синтез в действии'], en: ['Psychosophy', 'Operational level · analysis and synthesis in action'], uk: ['Психософія', 'Оперативний рівень · аналіз і синтез у дії'] }, dims: ['Воля', 'Логика', 'Эмоция', 'Физика'], items: { ru: [['Когда группа не может выбрать направление, я обычно готов(а) предложить решение и двигаться дальше.', 'Воля'], ['Мне важно обсуждать критерии решения, пока логика не станет ясной.', 'Логика'], ['В напряжённой беседе я сильно слежу за тем, как звучат мои чувства.', 'Эмоция'], ['В вопросах быта, тела, денег или ресурсов у меня есть заметные собственные стандарты.', 'Физика'], ['Мне бывает трудно понять, где моё право настаивать, а где я перегибаю.', 'Воля'], ['Если объяснение противоречиво, я возвращаюсь к нему даже когда другие хотят закрыть тему.', 'Логика'], ['Я часто регулирую эмоциональный тон комнаты, даже если не называю это задачей.', 'Эмоция'], ['Я могу долго жить “как есть”, если практический уклад в целом работает.', 'Физика']], en: [['When a group cannot choose a direction, I am usually ready to propose a decision and move on.', 'Воля'], ['I need to discuss decision criteria until the logic becomes clear.', 'Логика'], ['In a tense conversation, I closely monitor how my feelings sound.', 'Эмоция'], ['In matters of body, money, comfort, or resources, I have noticeable personal standards.', 'Физика'], ['I sometimes struggle to know where I have the right to insist and where I am overdoing it.', 'Воля'], ['If an explanation is inconsistent, I return to it even when others want to close the topic.', 'Логика'], ['I often regulate the emotional tone of a room without naming it as a task.', 'Эмоция'], ['I can live “as it is” for a long time if the practical setup basically works.', 'Физика']], uk: [['Коли група не може вибрати напрям, я зазвичай готовий/готова запропонувати рішення й рухатися далі.', 'Воля'], ['Мені важливо обговорювати критерії рішення, доки логіка не стане ясною.', 'Логика'], ['У напруженій розмові я сильно стежу за тим, як звучать мої почуття.', 'Эмоция'], ['У питаннях тіла, грошей, комфорту або ресурсів у мене є помітні власні стандарти.', 'Физика'], ['Мені буває складно зрозуміти, де я маю право наполягати, а де перегинаю.', 'Воля'], ['Якщо пояснення суперечливе, я повертаюся до нього навіть коли інші хочуть закрити тему.', 'Логика'], ['Я часто регулюю емоційний тон кімнати, навіть якщо не називаю це задачею.', 'Эмоция'], ['Я можу довго жити “як є”, якщо практичний уклад загалом працює.', 'Физика']] } },
  temporistics: { labels: { ru: ['Темпористика', 'Стратегический уровень · время и смысл'], en: ['Temporistics', 'Strategic level · time and meaning'], uk: ['Темпористика', 'Стратегічний рівень · час і сенс'] }, dims: ['Past', 'Present', 'Future', 'Eternity'], items: { ru: [['После важного события я прежде всего пытаюсь понять, что оно добавило к истории того, кем я являюсь.', 'Past'], ['Когда я вхожу в новую среду, мне важно понять, какое место я реально могу в ней занять.', 'Present'], ['Мне трудно расслабиться, когда неясно, куда в целом ведёт мой путь.', 'Future'], ['Если я не вижу, ради чего всё это в более широком смысле, мотивация быстро рассыпается.', 'Eternity'], ['У меня обычно есть внутренняя версия того, кто я, и прошлые события я читаю через неё.', 'Past'], ['Я чувствую дезориентацию, когда не понимаю свою текущую роль среди людей вокруг.', 'Present'], ['Я часто оцениваю текущие выборы через то, какую долгую линию они создают.', 'Future'], ['Мне нужно, чтобы работа и отношения соединялись с большим смыслом, а не только с пользой сейчас.', 'Eternity']], en: [['After an important event, I first try to understand what it added to the story of who I am.', 'Past'], ['When I enter a new environment, I need to understand what place I can realistically occupy there.', 'Present'], ['I find it hard to relax when I do not know where my overall path is leading.', 'Future'], ['If I cannot see a wider reason for what I am doing, my motivation weakens quickly.', 'Eternity'], ['I usually have an inner version of who I am, and I read past events through it.', 'Past'], ['I feel disoriented when I do not understand my current role among people around me.', 'Present'], ['I often evaluate current choices by the long-term line they create.', 'Future'], ['I need work and relationships to connect to a larger meaning, not only immediate usefulness.', 'Eternity']], uk: [['Після важливої події я спершу намагаюся зрозуміти, що вона додала до історії того, ким я є.', 'Past'], ['Коли я входжу в нове середовище, мені важливо зрозуміти, яке місце я реально можу там зайняти.', 'Present'], ['Мені важко розслабитися, коли неясно, куди загалом веде мій шлях.', 'Future'], ['Якщо я не бачу, заради чого все це в ширшому сенсі, мотивація швидко слабшає.', 'Eternity'], ['У мене зазвичай є внутрішня версія того, хто я, і минулі події я читаю через неї.', 'Past'], ['Я відчуваю дезорієнтацію, коли не розумію свою поточну роль серед людей навколо.', 'Present'], ['Я часто оцінюю поточні вибори через те, яку довгу лінію вони створюють.', 'Future'], ['Мені потрібно, щоб робота й стосунки поєднувалися з більшим сенсом, а не лише з користю зараз.', 'Eternity']] } }
};

let currentLang = localStorage.getItem('psycalc-lang') || 'ru';
let activeTest = 'temporistics';

function applyLanguage(lang) {
  currentLang = I18N[lang] ? lang : 'ru';
  document.documentElement.lang = currentLang;
  localStorage.setItem('psycalc-lang', currentLang);
  const dict = I18N[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => { const value = dict[el.dataset.i18n]; if (value) el.textContent = value; });
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === currentLang));
  renderTests();
}

function renderTests() {
  const tabs = document.querySelector('#testTabs'), panel = document.querySelector('#testPanel');
  const dict = I18N[currentLang];
  tabs.innerHTML = Object.entries(TESTS).map(([key, test]) => `<button class="${key === activeTest ? 'active' : ''}" data-test-key="${key}">${test.labels[currentLang][0]}</button>`).join('');
  const test = TESTS[activeTest], label = test.labels[currentLang], items = test.items[currentLang];
  panel.innerHTML = `<div class="test-meta"><h3>${label[0]}</h3><p>${label[1]}</p><p>${activeTest === 'socionics' ? dict['tests.socionicsCaveat'] : dict['tests.caveat']}</p></div><div class="test-items">${items.map((item, i) => `<article class="test-item" data-test-item="${i}"><p><b>${i + 1}.</b> ${item[0]}</p><div class="scale">${[1, 2, 3, 4, 5, 6].map(v => `<label><input type="radio" name="${activeTest}-${i}" value="${v}">${v}</label>`).join('')}</div><div class="scale-help"><span>${dict['tests.scale.left']}</span><span>${dict['tests.scale.right']}</span></div></article>`).join('')}</div><div class="test-actions"><button class="primary" data-test-submit>${dict['tests.submit']}</button><button data-test-reset>${dict['tests.reset']}</button></div><div id="testResult" aria-live="polite"></div>`;
  tabs.querySelectorAll('[data-test-key]').forEach(b => b.addEventListener('click', () => { activeTest = b.dataset.testKey; renderTests(); }));
  panel.querySelector('[data-test-submit]').addEventListener('click', scoreActiveTest);
  panel.querySelector('[data-test-reset]').addEventListener('click', renderTests);
}

function getScores() {
  const test = TESTS[activeTest], items = test.items[currentLang];
  const scores = Object.fromEntries(test.dims.map(d => [d, 0])), counts = Object.fromEntries(test.dims.map(d => [d, 0]));
  let missing = false;
  document.querySelectorAll('[data-test-item]').forEach(el => el.classList.remove('missing-answer'));
  items.forEach((item, i) => {
    const checked = document.querySelector(`input[name="${activeTest}-${i}"]:checked`);
    if (!checked) { missing = true; document.querySelector(`[data-test-item="${i}"]`)?.classList.add('missing-answer'); return; }
    scores[item[1]] += Number(checked.value); counts[item[1]] += 1;
  });
  return { scores, counts, missing };
}

function scoreTIMs(scores, counts) {
  const aspectValues = Object.fromEntries(TESTS.socionics.dims.map(d => [d, counts[d] ? scores[d] / counts[d] : 0]));
  const weights = [1, 0.8, 0.45, 0.45];
  return TIMS.map(([code, mbti, names, valued]) => {
    const prototype = Object.fromEntries(TESTS.socionics.dims.map(d => [d, 0.12]));
    valued.forEach((aspect, i) => { prototype[aspect] = weights[i]; });
    const raw = TESTS.socionics.dims.reduce((sum, a) => sum + aspectValues[a] * prototype[a], 0);
    return { code, mbti, name: names[currentLang], raw };
  }).sort((a, b) => b.raw - a.raw).slice(0, 3);
}

function scoreActiveTest() {
  const dict = I18N[currentLang], test = TESTS[activeTest], out = document.querySelector('#testResult');
  const { scores, counts, missing } = getScores();
  if (missing) { out.innerHTML = `<div class="test-result"><p class="test-caveat">${dict['tests.missing']}</p></div>`; return; }
  const rows = test.dims.map(d => [d, counts[d] ? scores[d] / counts[d] : 0]).sort((a, b) => b[1] - a[1]);
  if (activeTest === 'socionics') {
    const tims = scoreTIMs(scores, counts);
    const max = tims[0]?.raw || 1;
    const aspectLabels = SOCIONICS_ASPECT_LABELS[currentLang] || SOCIONICS_ASPECT_LABELS.ru;
    out.innerHTML = `<div class="test-result"><h4>${dict['tests.timResult']}</h4><div class="tim-list">${tims.map((t, i) => `<div class="tim-card"><b>${i + 1}. ${t.code} — ${t.name} (≈ ${t.mbti})</b><span class="bar-track"><span class="bar-fill" style="width:${Math.round(t.raw / max * 100)}%"></span></span></div>`).join('')}</div><h4>${dict['tests.aspectTrace']}</h4><div class="result-bars">${rows.map(([d, v]) => `<div class="result-row"><b>${aspectLabels[d]}</b><span class="bar-track"><span class="bar-fill" style="width:${Math.round(v / 6 * 100)}%"></span></span><em>${v.toFixed(1)}</em></div>`).join('')}</div><p class="test-caveat">${dict['tests.socionicsCaveat']}</p></div>`;
    return;
  }
  const top = rows.slice(0, 3).map(r => r[0]).join(' · ');
  out.innerHTML = `<div class="test-result"><h4>${dict['tests.result']}: ${top}</h4><div class="result-bars">${rows.map(([d, v]) => `<div class="result-row"><b>${d}</b><span class="bar-track"><span class="bar-fill" style="width:${Math.round(v / 6 * 100)}%"></span></span><em>${v.toFixed(1)}</em></div>`).join('')}</div><p class="test-caveat">${dict['tests.caveat']}</p></div>`;
}

document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => applyLanguage(b.dataset.lang)));
applyLanguage(currentLang);
