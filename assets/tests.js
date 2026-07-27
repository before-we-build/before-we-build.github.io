const STUDY={schemaVersion:'1.0.0',studyId:'before-we-build-tests-pilot',studyVersion:'2026-07-27',consentVersion:'2026-07-27',siteVersion:'static-2026-07-27'};
const I18N={
ru:{'nav.model':'Модель','nav.processes':'Процессы','layers.nav':'Слои','nav.tests':'Тесты','nav.graph':'Граф','nav.pages':'Страницы',footer:'Before We Build LLM Wiki · размещено на GitHub Pages · github.com/before-we-build/before-we-build.github.io','tests.eyebrow':'Пилотные исследовательские опросники','tests.title':'Before We Build Tests: pilot v0.3','tests.intro':'Экспериментальные self-report опросники для генерации типологических гипотез. Ответы обрабатываются локально в браузере; серверного сбора данных здесь нет.','tests.note':'Не диагностика и не финальное типирование. Результат — рабочая гипотеза для самонаблюдения, интервью и будущей калибровки.',scaleL:'совсем не похоже',scaleR:'очень похоже',submit:'Показать предварительный результат',reset:'Сбросить ответы',export:'Скачать JSON',clear:'Удалить локальные данные',copy:'Скопировать summary',missing:'Ответьте на все вопросы и подтвердите consent.',pilot:'Пилотный невалидированный опросник. Не использовать для важных решений о отношениях, работе, лечении, военной службе или образовании.',consent:'Я понимаю, что это пилотный исследовательский опросник, не диагностика; ответы остаются локально, пока я сам(а) не экспортирую JSON.',age:'Возрастная группа',exposure:'Знакомство с типологиями',selftype:'Ваш предполагаемый тип / источник, если знаете',token:'Секретная фраза для ретеста (не сохраняется, в JSON попадёт только hash)',none:'не указывать',low:'низкое',moderate:'среднее',high:'высокое',clarity:'Определённость профиля',topTIM:'Top-3 TIM: ориентировочное соответствие',topType:'Top-3 гипотезы типа',aspectTrace:'Аспектный след ответов',scaleTrace:'След шкал',caveatSoc:'Top-3 TIM — грубая гипотеза соответствия по текущим ответам, не точное типирование. MBTI-алиасы в скобках приблизительны и не являются эквивалентами Соционики.',caveatPosition:'Карта решений и действий и Темпористика используют position-sensitive scoring: оцениваются не только домены, но и их возможные позиции. Это всё ещё pilot-гипотеза, а не доказательство типа.',instruction:'Отвечайте по типичному поведению за последние 6–12 месяцев. Если зависит от контекста — выбирайте середину.',alternatives:'Близкие альтернативы',undefinedProfile:'профиль не определён (ничья)'},
en:{'nav.model':'Model','nav.processes':'Processes','layers.nav':'Layers','nav.tests':'Tests','nav.graph':'Graph','nav.pages':'Pages',footer:'Before We Build LLM Wiki · hosted on GitHub Pages · github.com/before-we-build/before-we-build.github.io','tests.eyebrow':'Pilot research questionnaires','tests.title':'Before We Build Tests: pilot v0.3','tests.intro':'Experimental self-report questionnaires for typological hypothesis generation. Responses are processed locally in your browser; this page has no server-side data collection.','tests.note':'Not diagnosis and not final typing. Results are working hypotheses for reflection, interview, and future calibration.',scaleL:'very unlike me',scaleR:'very like me',submit:'Show preliminary result',reset:'Reset answers',export:'Download JSON',clear:'Delete local data',copy:'Copy summary',missing:'Answer every item and confirm consent.',pilot:'Pilot non-validated questionnaire. Do not use for important decisions about relationships, work, treatment, military service, or education.',consent:'I understand this is a pilot research questionnaire, not diagnosis; responses stay local unless I export JSON myself.',age:'Age band',exposure:'Prior typology exposure',selftype:'Your assumed type / source, if known',token:'Secret retest phrase (not stored; only hash goes to JSON)',none:'prefer not to say',low:'low',moderate:'moderate',high:'high',clarity:'Profile clarity',topTIM:'Top 3 TIM: rough fit',topType:'Top 3 type hypotheses',aspectTrace:'Aspect trace of answers',scaleTrace:'Scale trace',caveatSoc:'Top-3 TIM is a rough fit hypothesis based on current responses, not definitive typing. MBTI aliases in brackets are approximate and not Socionics equivalents.',caveatPosition:'Action-and-decision map and Temporistics use position-sensitive scoring: domains and likely positions are both estimated. This remains a pilot hypothesis, not proof of type.',instruction:'Answer based on typical behavior over the last 6–12 months. If it depends on context, choose the middle.',alternatives:'Nearby alternatives',undefinedProfile:'profile undefined (tie)'},
uk:{'nav.model':'Модель','nav.processes':'Процеси','layers.nav':'Шари','nav.tests':'Тести','nav.graph':'Граф','nav.pages':'Сторінки',footer:'Before We Build LLM Wiki · розміщено на GitHub Pages · github.com/before-we-build/before-we-build.github.io','tests.eyebrow':'Пілотні дослідницькі опитувальники','tests.title':'Before We Build Tests: pilot v0.3','tests.intro':'Експериментальні self-report опитувальники для генерації типологічних гіпотез. Відповіді обробляються локально в браузері; серверного збору даних тут немає.','tests.note':'Не діагностика і не фінальне типування. Результат — робоча гіпотеза для самоспостереження, інтервʼю і майбутньої калібрації.',scaleL:'зовсім не схоже',scaleR:'дуже схоже',submit:'Показати попередній результат',reset:'Скинути відповіді',export:'Завантажити JSON',clear:'Видалити локальні дані',copy:'Скопіювати summary',missing:'Дайте відповідь на всі питання і підтвердьте consent.',pilot:'Пілотний невалідований опитувальник. Не використовувати для важливих рішень про стосунки, роботу, лікування, військову службу або освіту.',consent:'Я розумію, що це пілотний дослідницький опитувальник, не діагностика; відповіді залишаються локально, доки я сам(а) не експортую JSON.',age:'Вікова група',exposure:'Знайомство з типологіями',selftype:'Ваш припущений тип / джерело, якщо знаєте',token:'Секретна фраза для ретесту (не зберігається, у JSON потрапить лише hash)',none:'не вказувати',low:'низька',moderate:'середня',high:'висока',clarity:'Визначеність профілю',topTIM:'Top-3 TIM: орієнтовна відповідність',topType:'Top-3 гіпотези типу',aspectTrace:'Аспектний слід відповідей',scaleTrace:'Слід шкал',caveatSoc:'Top-3 TIM — груба гіпотеза відповідності за поточними відповідями, не точне типування. MBTI-аліаси в дужках приблизні й не є еквівалентами Соціоніки.',caveatPosition:'Карта рішень і дій і Темпористика використовують position-sensitive scoring: оцінюються і домени, і можливі позиції. Це все ще pilot-гіпотеза, а не доказ типу.',instruction:'Відповідайте за типовою поведінкою за останні 6–12 місяців. Якщо залежить від контексту — обирайте середину.',alternatives:'Близькі альтернативи',undefinedProfile:'профіль не визначено (нічия)'}
};
Object.assign(I18N.ru,{'brand.main':'Прежде чем строить','brand.research':'Прежде чем строить · Исследования','brand.wiki':'Прежде чем строить · База знаний'});
Object.assign(I18N.en,{'brand.main':'Before We Build','brand.research':'Before We Build · Research','brand.wiki':'Before We Build · Wiki'});
Object.assign(I18N.uk,{'brand.main':'Перш ніж будувати','brand.research':'Перш ніж будувати · Дослідження','brand.wiki':'Перш ніж будувати · База знань'});
Object.assign(I18N.ru,{readNext:'Что читать дальше',readGuide:'Как читать результат',readBoundaries:'Границы уровней',readSystem:'Подробнее в LLM wiki',readType:'Описание типа',fallbackEn:'пока EN',insideModel:'Что было внутри этого блока',insideCaveat:'Эта модель используется как грубая карта возможных паттернов, а не как окончательная правда о человеке.',levelNoteSoc:'Вы прошли блок “Информация и общение”. Внутри него используется Соционика как эвристика для гипотез об информационном моделировании.',levelNotePsy:'Вы прошли блок “Энергия и действие”. Внутри него используется Карта решений и действий как эвристика для гипотез о приоритетах, решениях и организации усилий.',levelNoteTmp:'Вы прошли блок “Время и направление”. Внутри него используется Темпористика как эвристика для гипотез о временно-смысловой ориентации.'});
Object.assign(I18N.en,{readNext:'Read next',readGuide:'How to read this result',readBoundaries:'Level boundaries',readSystem:'Read more in LLM wiki',readType:'Type description',fallbackEn:'EN fallback',insideModel:'What was inside this block',insideCaveat:'This model is used as a rough map of possible patterns, not as final truth about a person.',levelNoteSoc:'You completed the “Information and communication” block. Internally, it uses Socionics as a heuristic for hypotheses about information modeling.',levelNotePsy:'You completed the “Energy and action” block. Internally, it uses Action-and-decision map as a heuristic for hypotheses about priorities, decisions, and effort organization.',levelNoteTmp:'You completed the “Time and direction” block. Internally, it uses Temporistics as a heuristic for hypotheses about temporal/meaning orientation.'});
Object.assign(I18N.uk,{readNext:'Що читати далі',readGuide:'Як читати результат',readBoundaries:'Межі рівнів',readSystem:'Докладніше в LLM wiki',readType:'Опис типу',fallbackEn:'поки EN',insideModel:'Що було всередині цього блоку',insideCaveat:'Ця модель використовується як груба карта можливих патернів, а не як остаточна правда про людину.',levelNoteSoc:'Ви пройшли блок “Інформація і спілкування”. Усередині використовується Соціоніка як евристика для гіпотез про інформаційне моделювання.',levelNotePsy:'Ви пройшли блок “Енергія і дія”. Усередині використовується Карта рішень і дій як евристика для гіпотез про пріоритети, рішення й організацію зусиль.',levelNoteTmp:'Ви пройшли блок “Час і напрям”. Усередині використовується Темпористика як евристика для гіпотез про часово-смислову орієнтацію.'});
Object.assign(I18N.ru,{'nav.what':'Что это','nav.result':'Результат','nav.compat':'Совместимость','tests.eyebrow':'Пилотный тест','tests.title':'Получить предварительный профиль','tests.intro':'Ответьте на вопросы и получите рабочую гипотезу о трех слоях: как вы видите время и смысл, организуете действие и обрабатываете информацию.','tests.note':'Это не диагностика и не финальное типирование. Используйте результат как начало самонаблюдения, разговора или подготовки к более глубокому интервью.'});
Object.assign(I18N.en,{'nav.what':'What it is','nav.result':'Result','nav.compat':'Compatibility','tests.eyebrow':'Pilot test','tests.title':'Get a preliminary profile','tests.intro':'Answer the questions and get a working hypothesis across three layers: how you see time and meaning, organize action, and process information.','tests.note':'This is not diagnosis and not final typing. Use the result as a starting point for self-observation, conversation, or a deeper interview.'});
Object.assign(I18N.uk,{'nav.what':'Що це','nav.result':'Результат','nav.compat':'Сумісність','tests.eyebrow':'Пілотний тест','tests.title':'Отримати попередній профіль','tests.intro':'Дайте відповіді на питання й отримайте робочу гіпотезу по трьох шарах: як ви бачите час і сенс, організовуєте дію та обробляєте інформацію.','tests.note':'Це не діагностика і не фінальне типування. Використовуйте результат як початок самоспостереження, розмови або підготовки до глибшого інтервʼю.'});
Object.assign(I18N.ru,{readNext:'Что можно почитать дальше',readGuide:'Как понимать результат',readBoundaries:'Где границы результата',readSystem:'Подробнее в базе знаний',readType:'Описание варианта',fallbackEn:'описание пока на английском',insideModel:'Что проверял этот блок',insideCaveat:'Это приблизительная карта возможных привычек, а не окончательная правда о человеке.',levelNoteSoc:'Этот блок опирается на Соционику: она помогает описывать стиль восприятия информации и общения.',levelNotePsy:'Этот блок опирается на карту решений и действий: она помогает описывать стиль действий, выбора и расстановки приоритетов.',levelNoteTmp:'Этот блок опирается на Темпористику: она помогает описывать отношение ко времени, переменам и жизненному направлению.','nav.research':'Для исследователей','footer.resultGuide':'как читать результат','footer.limitations':'ограничения','footer.research':'для исследователей','tests.eyebrow':'Тест для самопонимания','tests.title':'Тест Before We Build','tests.intro':'Тест опирается на три типологии: Темпористику, карту решений и действий и Соционику. Они помогают посмотреть, как вы относитесь ко времени, действуете и общаетесь.','tests.note':'Результат — не ярлык и не диагноз, а осторожная гипотеза, которую стоит сверять с реальным опытом.',pilot:'Сначала коротко о методе: тест использует три модели описания личности — про время и смысл, действия и приоритеты, информацию и общение. Это не точная наука и не диагноз.',instruction:'Отвечайте по тому, как вы обычно ведёте себя в последние месяцы. Если всё зависит от ситуации, выбирайте средний вариант.',consent:'Я понимаю, что результат — это гипотеза, а не точный факт.',missing:'Ответьте на все вопросы, чтобы увидеть результат.',submit:'Показать предварительный результат',export:'Скачать файл с ответами',copy:'Скопировать краткий итог',age:'Возраст',exposure:'Знакомы ли вы с типологиями',selftype:'Если знаете свой предполагаемый тип, можно указать',token:'Фраза для повторного прохождения позже',low:'низкая',moderate:'средняя',high:'высокая',clarity:'Насколько результат выражен',topTIM:'Три наиболее близких варианта',topType:'Три наиболее близких варианта',aspectTrace:'Как распределились ответы',scaleTrace:'Как распределились ответы',caveatSoc:'Это предварительная версия по вашим ответам, а не точное типирование. Обозначения MBTI в скобках даны только как примерное сравнение.',caveatPosition:'Это предварительная версия по вашим ответам. Она показывает возможный порядок приоритетов, но не доказывает ваш тип.'});
Object.assign(I18N.en,{'nav.research':'For researchers','footer.resultGuide':'how to read the result','footer.limitations':'limitations','footer.research':'for researchers','tests.eyebrow':'Self-understanding test','tests.title':'Before We Build Test','tests.intro':'This test uses three typologies: Temporistics, Action-and-decision map, and Socionics. They help look at time, action, priorities, information, and communication.','tests.note':'The result is not a label or diagnosis, but a cautious hypothesis to compare with real experience.',pilot:'First, a short note: the test uses three personality maps — time and meaning, action and priorities, information and communication. It is not exact science or diagnosis.',consent:'I understand that the result is a hypothesis, not a confirmed fact.',missing:'Please answer all questions to see your result.',copy:'Copy short summary',topTIM:'Three closest options',topType:'Three closest options',aspectTrace:'How your answers were distributed',scaleTrace:'How your answers were distributed'});
Object.assign(I18N.uk,{'nav.research':'Для дослідників','footer.resultGuide':'як читати результат','footer.limitations':'обмеження','footer.research':'для дослідників','tests.eyebrow':'Тест для саморозуміння','tests.title':'Тест Before We Build','tests.intro':'Тест спирається на три типології: Темпористику, карту рішень і дій та Соціоніку. Вони допомагають подивитися, як ви ставитеся до часу, дієте й спілкуєтеся.','tests.note':'Результат — не ярлик і не діагноз, а обережна гіпотеза, яку варто звіряти з реальним досвідом.',pilot:'Спершу коротко про метод: тест використовує три моделі опису особистості — про час і сенс, дії та пріоритети, інформацію і спілкування. Це не точна наука і не діагноз.',consent:'Я розумію, що результат — це гіпотеза, а не точний факт.',missing:'Дайте відповідь на всі питання, щоб побачити результат.',copy:'Скопіювати короткий підсумок',topTIM:'Три найближчі варіанти',topType:'Три найближчі варіанти',aspectTrace:'Як розподілилися відповіді',scaleTrace:'Як розподілилися відповіді'});
Object.assign(I18N.ru,{'tests.start':'Начать простой тест','tests.researchJump':'Для исследователей','tests.people.badge':'Для обычного пользователя','tests.people.title':'Понятный результат без теории','tests.people.text':'Пройдите один блок или все три и получите описание привычных способов думать, действовать и общаться.','tests.research.badge':'Для исследователей','tests.research.title':'Методология отдельно','tests.research.text':'Статус пилота, ограничения, шкалы, качество ответов и экспорт данных вынесены ниже, чтобы не мешать прохождению.','tests.area.time':'Время, смысл и направление','tests.area.time.text':'Как вы переживаете прошлое, настоящее, будущее и большое “зачем”. Темпористика.','tests.area.action':'Решения и действия','tests.area.action.text':'Как вы выбираете, объясняете, чувствуете и организуете практические вопросы. Карта решений и действий.','tests.area.info':'Информация и общение','tests.area.info.text':'Как вы замечаете, сортируете и передаёте информацию в разговоре. Соционика.','tests.research.summary':'Технический раздел для исследователей','tests.research.details':'Эти тесты пока пилотные: они не являются диагностикой, не дают гарантированного типа и не должны использоваться для важных решений. Экспорт ответов нужен только тем, кто хочет сохранить данные для повторного прохождения или анализа.',pilot:'Перед началом: это тест для самопонимания, а не диагноз. Можно пройти один блок или все три.',instruction:'Отвечайте по тому, как вы обычно ведёте себя в последние месяцы. Если всё зависит от ситуации, выбирайте средний вариант.',consent:'Я понимаю, что результат — это гипотеза для самопонимания, а не точный факт.',export:'Скачать ответы'});
Object.assign(I18N.en,{'tests.start':'Start simple test','tests.researchJump':'For researchers','tests.people.badge':'For regular users','tests.people.title':'Plain result, no theory first','tests.people.text':'Take one block or all three and get a description of your usual ways of thinking, acting, and communicating.','tests.research.badge':'For researchers','tests.research.title':'Methodology is separate','tests.research.text':'Pilot status, limitations, scales, response quality, and data export are kept below so they do not interrupt the test.','tests.area.time':'Time, meaning, and direction','tests.area.time.text':'How you experience past, present, future, and the larger “why”. Temporistics.','tests.area.action':'Decisions and action','tests.area.action.text':'How you choose, explain, feel, and organize practical matters. Action-and-decision map.','tests.area.info':'Information and communication','tests.area.info.text':'How you notice, sort, and share information in conversation. Socionics.','tests.research.summary':'Technical section for researchers','tests.research.details':'These tests are still pilot tools: they are not diagnosis, do not guarantee a type, and should not be used for important decisions. Export is mainly for saving answers for retesting or analysis.',pilot:'Before you start: this is a self-understanding test, not diagnosis. You can take one block or all three.',instruction:'Answer based on how you usually behave in recent months. If it depends on context, choose the middle.',consent:'I understand that the result is a self-understanding hypothesis, not a confirmed fact.',export:'Download answers'});
Object.assign(I18N.uk,{'tests.start':'Почати простий тест','tests.researchJump':'Для дослідників','tests.people.badge':'Для звичайного користувача','tests.people.title':'Зрозумілий результат без теорії','tests.people.text':'Пройдіть один блок або всі три й отримайте опис звичних способів думати, діяти та спілкуватися.','tests.research.badge':'Для дослідників','tests.research.title':'Методологія окремо','tests.research.text':'Статус пілота, обмеження, шкали, якість відповідей і експорт даних винесені нижче, щоб не заважати проходженню.','tests.area.time':'Час, сенс і напрям','tests.area.time.text':'Як ви переживаєте минуле, теперішнє, майбутнє і велике “навіщо”. Темпористика.','tests.area.action':'Рішення і дії','tests.area.action.text':'Як ви обираєте, пояснюєте, відчуваєте й організовуєте практичні питання. Карта рішень і дій.','tests.area.info':'Інформація і спілкування','tests.area.info.text':'Як ви помічаєте, сортуєте й передаєте інформацію в розмові. Соціоніка.','tests.research.summary':'Технічний розділ для дослідників','tests.research.details':'Ці тести поки пілотні: це не діагностика, вони не гарантують тип і не мають використовуватися для важливих рішень. Експорт відповідей потрібен тим, хто хоче зберегти дані для повторного проходження або аналізу.',pilot:'Перед початком: це тест для саморозуміння, а не діагноз. Можна пройти один блок або всі три.',instruction:'Відповідайте за тим, як ви зазвичай поводитеся останніми місяцями. Якщо все залежить від ситуації, обирайте середній варіант.',consent:'Я розумію, що результат — це гіпотеза для саморозуміння, а не точний факт.',export:'Завантажити відповіді'});
Object.assign(I18N.uk,{'tests.start':'Почати простий тест','tests.researchJump':'Для дослідників','tests.people.badge':'Для звичайного користувача','tests.people.title':'Зрозумілий результат без теорії','tests.people.text':'Пройдіть один блок або всі три й отримайте опис звичних способів думати, діяти та спілкуватися.','tests.research.badge':'Для дослідників','tests.research.title':'Методологія окремо','tests.research.text':'Статус пілота, обмеження, шкали, якість відповідей і експорт даних винесені нижче, щоб не заважати проходженню.','tests.area.time':'Час, сенс і напрям','tests.area.time.text':'Як ви переживаєте минуле, теперішнє, майбутнє і велике “навіщо”. Темпористика.','tests.area.action':'Рішення і дії','tests.area.action.text':'Як ви обираєте, пояснюєте, відчуваєте й організовуєте практичні питання. Карта рішень і дій.','tests.area.info':'Інформація і спілкування','tests.area.info.text':'Як ви помічаєте, сортуєте й передаєте інформацію в розмові. Соціоніка.','tests.research.summary':'Технічний розділ для дослідників','tests.research.details':'Ці тести поки пілотні: це не діагностика, вони не гарантують тип і не мають використовуватися для важливих рішень. Експорт відповідей потрібен тим, хто хоче зберегти дані для повторного проходження або аналізу.',pilot:'Перед початком: це тест для саморозуміння, а не діагноз. Можна пройти один блок або все три.',instruction:'Відповідайте за тим, як ви зазвичай поводитеся останніми місяцями. Якщо все залежить від ситуації, обирайте середній варіант.',consent:'Я розумію, що результат — це гіпотеза для саморозуміння, а не точний факт.',export:'Завантажити відповіді'});
Object.assign(I18N.ru,{'nav.self':'Главная','nav.tests':'Маршрут','nav.method':'Методология','nav.limits':'Ограничения','tests.eyebrow':'Интерактивный маршрут','tests.title':'Потапать, выбрать, узнать себя','tests.intro':'Короткие карточки превращают вопросы в мини-сцены: что вы берёте с собой, что обезвреживаете первым и какой мост строите в сложной ситуации.','tests.note':'Результат — осторожная гипотеза, которую стоит сверять с реальным опытом.','tests.start':'Начать карточки','tests.researchJump':'Версия для исследователей',pilot:'Перед началом: это маршрут для самопонимания, а не диагноз.',instruction:'Выбирайте живо: что вы бы оставили, взяли, обезвредили или поставили первым. Если всё зависит от ситуации — выбирайте средний вариант.',consent:'Я понимаю, что результат — это гипотеза для самопонимания, а не точный факт.','researchTests.eyebrow':'Исследовательская версия','researchTests.title':'Пилотные тесты Before We Build','researchTests.intro':'Эта страница оставляет технический контекст видимым: статус пилота, ограничения, качество ответов, локальное хранение и экспорт JSON.','researchTests.note':'Инструмент не валидирован и не предназначен для диагностики, отбора, лечения, военных, образовательных или семейных решений.','researchTests.start':'Открыть исследовательский тест','researchTests.peopleLink':'Простая версия','researchTests.status.badge':'Статус','researchTests.status.title':'Пилот, не диагностика','researchTests.status.text':'Результаты являются гипотезами по самоотчёту и требуют интервью, ретеста, альтернативных моделей и outcome-проверки.','researchTests.data.badge':'Данные','researchTests.data.title':'Локальная обработка','researchTests.data.text':'Ответы считаются в браузере. JSON создаётся только если пользователь сам нажимает экспорт.'});
Object.assign(I18N.ru,{'nav.self':'Главная','nav.personal':'Личный путь','nav.relations':'Отношения','nav.christian':'Христианский взгляд','nav.teams':'Команды','nav.researchShort':'Исследования','nav.compat':'Совместимость','nav.foundation':'Фундамент','nav.christ':'Кто такой Христос','nav.test':'Маршрут'});
Object.assign(I18N.en,{'nav.self':'For people','nav.tests':'Test','nav.method':'Methodology','nav.limits':'Limitations','tests.eyebrow':'Simple test','tests.title':'Understand yourself without theory','tests.intro':'Answer short questions and get a preliminary hypothesis: how you see direction, make decisions, and communicate.','tests.note':'This is not diagnosis or a label. Use the result for self-observation and honest conversation.','tests.start':'Start test','tests.researchJump':'Researcher version',pilot:'Before you start: this is a self-understanding test, not diagnosis.',instruction:'Answer based on how you usually behave in recent months. If it depends on context, choose the middle.',consent:'I understand that the result is a self-understanding hypothesis, not a confirmed fact.','researchTests.eyebrow':'Researcher version','researchTests.title':'Before We Build pilot tests','researchTests.intro':'This page keeps technical context visible: pilot status, limitations, response quality, local storage, and JSON export.','researchTests.note':'The instrument is not validated and is not intended for diagnosis, selection, treatment, military, educational, or family decisions.','researchTests.start':'Open research test','researchTests.peopleLink':'Simple version','researchTests.status.badge':'Status','researchTests.status.title':'Pilot, not diagnosis','researchTests.status.text':'Results are self-report hypotheses and require interview, retest, alternative models, and outcome validation.','researchTests.data.badge':'Data','researchTests.data.title':'Local processing','researchTests.data.text':'Responses are scored in the browser. JSON is created only if the user explicitly exports it.'});
Object.assign(I18N.en,{'nav.self':'Home','nav.personal':'Personal path','nav.relations':'Relationships','nav.christian':'Christian view','nav.teams':'Teams','nav.researchShort':'Research','nav.compat':'Compatibility','nav.foundation':'Foundation','nav.christ':'Who is Christ','nav.test':'Route'});
Object.assign(I18N.uk,{'nav.self':'Головна','nav.tests':'Тест','nav.method':'Методологія','nav.limits':'Обмеження','tests.eyebrow':'Простий тест','tests.title':'Як я сприймаю світ?','tests.intro':'Дайте відповіді на короткі питання й отримайте попередню гіпотезу: як ви бачите напрям, ухвалюєте рішення та спілкуєтесь.','tests.note':'Це не діагноз і не ярлик. Результат потрібен як привід для самоспостереження й обговорення власних відповідей.','tests.start':'Почати тест','tests.researchJump':'Версія для дослідників',pilot:'Перед початком: це тест для саморозуміння, а не діагноз.',instruction:'Відповідайте за тим, як ви зазвичай поводитеся останніми місяцями. Якщо все залежить від ситуації, обирайте середній варіант.',consent:'Я розумію, що результат — це гіпотеза для саморозуміння, а не точний факт.','researchTests.eyebrow':'Дослідницька версія','researchTests.title':'Пілотні тести Before We Build','researchTests.intro':'Ця сторінка залишає технічний контекст видимим: статус пілота, обмеження, якість відповідей, локальне зберігання й експорт JSON.','researchTests.note':'Інструмент не валідований і не призначений для діагностики, відбору, лікування, військових, освітніх або сімейних рішень.','researchTests.start':'Відкрити дослідницький тест','researchTests.peopleLink':'Проста версія','researchTests.status.badge':'Статус','researchTests.status.title':'Пілот, не діагностика','researchTests.status.text':'Результати є гіпотезами за самоописом і потребують інтервʼю, ретесту, альтернативних моделей та outcome-перевірки.','researchTests.data.badge':'Дані','researchTests.data.title':'Локальна обробка','researchTests.data.text':'Відповіді рахуються в браузері. JSON створюється лише якщо користувач сам натискає експорт.'});
Object.assign(I18N.uk,{'nav.self':'Головна','nav.personal':'Особистий шлях','nav.relations':'Стосунки','nav.christian':'Християнський погляд','nav.teams':'Команди','nav.researchShort':'Дослідження','nav.compat':'Сумісність','nav.foundation':'Фундамент','nav.christ':'Хто такий Христос','nav.test':'Маршрут'});
Object.assign(I18N.ru,{publicStartEyebrow:'Перед стартом',publicStartTitle:'Выберите, как пройти маршрут',publicStartText:'Это гипотеза для самопонимания, не диагноз. Ответы считаются в браузере и по умолчанию никуда не отправляются.',publicModeLabel:'Режим прохождения',publicModeVisual:'Визуальный маршрут',publicModeVisualText:'Карточки, сцены и быстрый ритм.',publicModeClassic:'Классический доступный',publicModeClassicText:'Прямые вопросы, меньше визуального шума.',publicPrefsTitle:'Настройки доступности',publicPrefLargeText:'Крупнее текст',publicPrefHighContrast:'Выше контраст',publicPrefReduceMotion:'Меньше анимации',publicPrefNoAutoscroll:'Не прокручивать автоматически',publicPrivacyTitle:'Приватность',publicPrivacyText:'Можно пройти без сохранения. Если выбрать сохранение, результат останется только в localStorage этого браузера.',publicStartNoSave:'Пройти без сохранения',publicStartSave:'Пройти и сохранить локально',publicProgress:'Маршрут',publicSummary:'Before We Build: предварительная гипотеза по смешанному маршруту.',publicResultTitle:'Маршрут собран',publicResultSaved:'Результат сохранён локально в этом браузере. Его можно удалить кнопкой ниже.',publicResultNotSaved:'Результат показан без записи в localStorage.',publicTechMap:'Показать техническую карту',publicQualityNote:'Часть ответов выглядит слишком однообразной или слишком быстрой, поэтому результат стоит читать особенно осторожно.',publicCleared:'Локальные данные теста удалены.',selected:'Выбрано',publicWhyQuestion:'Что означает карточка?',publicHypothesis:'Лучшая гипотеза сейчас',publicAlternatives:'Ближайшие альтернативы',publicConfidence:'Определённость',publicConfidenceHigh:'выше средней',publicConfidenceModerate:'средняя',publicConfidenceLow:'низкая',publicWhatNext:'Что проверить дальше',publicNextChecks:'Сравните гипотезу с реальными ситуациями: как вы принимаете решения, реагируете на напряжение, строите планы и общаетесь. Если альтернативы близко, не спешите закреплять ярлык.',publicCaveat:'Это не диагноз и не финальное типирование. Результат показывает, на какие модели сейчас больше всего похожи ваши ответы.',publicQualityTitle:'Качество ответов',publicQualityNeutral:'Много средних ответов: результат может быть менее различающим.',publicQualityChanged:'Некоторые ответы менялись: это нормально, но указывает на неоднозначность.',publicQualityFastItems:'Часть карточек отвечена очень быстро: проверьте, не проходили ли вы слишком на автомате.'});
Object.assign(I18N.en,{publicStartEyebrow:'Before you start',publicStartTitle:'Choose how to take the route',publicStartText:'This is a self-understanding hypothesis, not diagnosis. Responses are scored in your browser and are not sent anywhere by default.',publicModeLabel:'Test mode',publicModeVisual:'Visual journey',publicModeVisualText:'Cards, scenes, and a faster rhythm.',publicModeClassic:'Classic accessible',publicModeClassicText:'Direct questions with less visual noise.',publicPrefsTitle:'Accessibility settings',publicPrefLargeText:'Larger text',publicPrefHighContrast:'Higher contrast',publicPrefReduceMotion:'Less motion',publicPrefNoAutoscroll:'Do not auto-scroll',publicPrivacyTitle:'Privacy',publicPrivacyText:'You can take the test without saving. If you choose saving, the result stays only in this browser localStorage.',publicStartNoSave:'Take without saving',publicStartSave:'Take and save locally',publicProgress:'Route',publicSummary:'Before We Build: preliminary hypothesis from the mixed route.',publicResultTitle:'Route completed',publicResultSaved:'The result was saved locally in this browser. You can delete it below.',publicResultNotSaved:'The result was shown without writing to localStorage.',publicTechMap:'Show technical map',publicQualityNote:'Some answers look too uniform or too fast, so read the result with extra caution.',publicCleared:'Local test data deleted.',selected:'Selected',publicWhyQuestion:'What does this card mean?',publicHypothesis:'Best current hypothesis',publicAlternatives:'Closest alternatives',publicConfidence:'Confidence',publicConfidenceHigh:'above average',publicConfidenceModerate:'moderate',publicConfidenceLow:'low',publicWhatNext:'What to check next',publicNextChecks:'Compare the hypothesis with real situations: how you decide, respond to pressure, build plans, and communicate. If alternatives are close, do not rush to lock in a label.',publicCaveat:'This is not diagnosis or final typing. The result shows which models your current answers resemble most.',publicQualityTitle:'Response quality',publicQualityNeutral:'Many middle answers: the result may distinguish patterns less clearly.',publicQualityChanged:'Some answers were changed: that is normal, but points to ambiguity.',publicQualityFastItems:'Some cards were answered very quickly: check that you were not rushing on autopilot.'});
Object.assign(I18N.uk,{publicStartEyebrow:'Перед стартом',publicStartTitle:'Оберіть, як пройти маршрут',publicStartText:'Це гіпотеза для саморозуміння, не діагноз. Відповіді рахуються у браузері й за замовчуванням нікуди не надсилаються.',publicModeLabel:'Режим проходження',publicModeVisual:'Візуальний маршрут',publicModeVisualText:'Картки, сцени й швидший ритм.',publicModeClassic:'Класичний доступний',publicModeClassicText:'Прямі питання, менше візуального шуму.',publicPrefsTitle:'Налаштування доступності',publicPrefLargeText:'Більший текст',publicPrefHighContrast:'Вищий контраст',publicPrefReduceMotion:'Менше анімації',publicPrefNoAutoscroll:'Не прокручувати автоматично',publicPrivacyTitle:'Приватність',publicPrivacyText:'Можна пройти без збереження. Якщо обрати збереження, результат залишиться тільки в localStorage цього браузера.',publicStartNoSave:'Пройти без збереження',publicStartSave:'Пройти й зберегти локально',publicProgress:'Маршрут',publicSummary:'Before We Build: попередня гіпотеза за змішаним маршрутом.',publicResultTitle:'Маршрут зібрано',publicResultSaved:'Результат збережено локально в цьому браузері. Його можна видалити кнопкою нижче.',publicResultNotSaved:'Результат показано без запису в localStorage.',publicTechMap:'Показати технічну карту',publicQualityNote:'Частина відповідей виглядає надто одноманітною або надто швидкою, тому результат варто читати особливо обережно.',publicCleared:'Локальні дані тесту видалено.',selected:'Обрано',publicWhyQuestion:'Що означає картка?',publicHypothesis:'Найкраща поточна гіпотеза',publicAlternatives:'Найближчі альтернативи',publicConfidence:'Визначеність',publicConfidenceHigh:'вище середньої',publicConfidenceModerate:'середня',publicConfidenceLow:'низька',publicWhatNext:'Що перевірити далі',publicNextChecks:'Порівняйте гіпотезу з реальними ситуаціями: як ви ухвалюєте рішення, реагуєте на напругу, будуєте плани й спілкуєтесь. Якщо альтернативи близько, не поспішайте закріплювати ярлик.',publicCaveat:'Це не діагноз і не фінальне типування. Результат показує, на які моделі зараз найбільше схожі ваші відповіді.',publicQualityTitle:'Якість відповідей',publicQualityNeutral:'Багато середніх відповідей: результат може гірше розрізняти патерни.',publicQualityChanged:'Деякі відповіді змінювалися: це нормально, але вказує на неоднозначність.',publicQualityFastItems:'Частину карток пройдено дуже швидко: перевірте, чи не відповідали ви на автоматі.'});
Object.assign(I18N.ru,{publicPrev:'Назад',publicNext:'Дальше',publicPause:'Пауза',publicResume:'Продолжить',publicPausedTitle:'Маршрут на паузе',publicPausedText:'Ответы остаются только в этой вкладке. Если закрыть страницу, несохранённое прохождение пропадёт.'});Object.assign(I18N.en,{publicPrev:'Back',publicNext:'Next',publicPause:'Pause',publicResume:'Resume',publicPausedTitle:'Route paused',publicPausedText:'Answers stay only in this tab. If you close the page, unsaved progress will be lost.'});Object.assign(I18N.uk,{publicPrev:'Назад',publicNext:'Далі',publicPause:'Пауза',publicResume:'Продовжити',publicPausedTitle:'Маршрут на паузі',publicPausedText:'Відповіді залишаються тільки в цій вкладці. Якщо закрити сторінку, незбережене проходження зникне.'});
Object.assign(I18N.ru,{publicAgeLabel:'Возраст',publicAgePlaceholder:'Выберите возраст',publicAgeRequired:'Сначала выберите возраст.',publicAgeUnder18:'до 18',publicAgeAutoMode:'Формат теста подберётся автоматически по возрасту.'});Object.assign(I18N.en,{publicAgeLabel:'Age',publicAgePlaceholder:'Choose your age',publicAgeRequired:'Choose your age first.',publicAgeUnder18:'under 18',publicAgeAutoMode:'The test format will be selected automatically by age.'});Object.assign(I18N.uk,{publicAgeLabel:'Вік',publicAgePlaceholder:'Оберіть вік',publicAgeRequired:'Спочатку оберіть вік.',publicAgeUnder18:'до 18',publicAgeAutoMode:'Формат тесту буде підібрано автоматично за віком.'});
Object.assign(I18N.ru,{publicStartButton:'Начать тест',publicStartPrivacyLabel:'О приватности',publicStartPrivacyNote:'Ответы остаются только в вашем браузере.'});Object.assign(I18N.en,{publicStartButton:'Start test',publicStartPrivacyLabel:'About privacy',publicStartPrivacyNote:'Responses stay only in your browser.'});Object.assign(I18N.uk,{publicStartButton:'Почати тест',publicStartPrivacyLabel:'Про приватність',publicStartPrivacyNote:'Відповіді залишаються лише у вашому браузері.'});
Object.assign(I18N.ru,{'tests.note':'Это не медицинский тест и не ярлык. Результат просто помогает увидеть, что вам больше похоже.',publicStartTitle:'Сначала выберите возраст',publicStartText:'Ответьте на короткие карточки и получите понятный результат о том, как вы выбираете, действуете и общаетесь.',publicModeClassicText:'Прямые вопросы без игровых карточек.',publicPrivacyText:'Можно пройти без сохранения. Если выбрать сохранение, результат останется только в этом браузере.',publicSummary:'Before We Build: ваш примерный результат.',publicResultTitle:'Ваш результат',publicTechMap:'Показать детали',publicQualityNote:'Некоторые ответы были слишком похожими или слишком быстрыми. Результат может быть менее точным.',publicWhyQuestion:'Простыми словами',publicHypothesis:'Больше всего похоже на',publicAlternatives:'Ещё близко',publicConfidence:'Выраженность паттерна',publicConfidenceHigh:'высокая выраженность',publicConfidenceModerate:'средне',publicConfidenceLow:'слабая выраженность',publicWhatNext:'Что это значит',publicNextChecks:'Посмотрите на результат как на подсказку. Подумайте, похоже ли это на ваши реальные решения, планы и общение.',publicCaveat:'Результат может ошибаться. Не принимайте по нему важные решения.',publicQualityTitle:'Почему результат может быть неточным',publicQualityNeutral:'Вы часто выбирали середину.',publicQualityChanged:'Вы меняли некоторые ответы.',publicQualityFastItems:'На часть карточек вы ответили очень быстро.'});
Object.assign(I18N.en,{'tests.note':'This is not a medical test or a label. The result simply shows what your answers resemble most.',publicStartTitle:'Choose your age first',publicStartText:'Answer short cards and get a clear result about how you choose, act, and communicate.',publicModeClassicText:'Direct questions without game cards.',publicPrivacyText:'You can take it without saving. If you choose saving, the result stays only in this browser.',publicSummary:'Before We Build: your rough result.',publicResultTitle:'Your result',publicTechMap:'Show details',publicQualityNote:'Some answers were very similar or very fast. The result may be less accurate.',publicWhyQuestion:'In simple words',publicHypothesis:'Most like',publicAlternatives:'Also close',publicConfidence:'Pattern contrast',publicConfidenceHigh:'high pattern contrast',publicConfidenceModerate:'medium',publicConfidenceLow:'low pattern contrast',publicWhatNext:'What it means',publicNextChecks:'Treat the result as a hint. Check whether it matches your real choices, plans, and communication.',publicCaveat:'The result can be wrong. Do not use it for important decisions.',publicQualityTitle:'Why the result may be less accurate',publicQualityNeutral:'You often chose the middle.',publicQualityChanged:'You changed some answers.',publicQualityFastItems:'You answered some cards very quickly.',undefinedProfile:'profile undefined (tie)'});
Object.assign(I18N.uk,{'tests.note':'Це не медичний тест і не ярлик. Результат просто допомагає побачити, що вам більше схоже.',publicStartTitle:'Спочатку оберіть вік',publicStartText:'Дайте відповіді на короткі картки й отримайте зрозумілий результат: як ви обираєте, дієте та спілкуєтесь.',publicModeClassicText:'Прямі питання без ігрових карток.',publicPrivacyText:'Можна пройти без збереження. Якщо обрати збереження, результат залишиться тільки в цьому браузері.',publicSummary:'Before We Build: ваш приблизний результат.',publicResultTitle:'Ваш результат',publicTechMap:'Показати деталі',publicQualityNote:'Деякі відповіді були надто схожими або надто швидкими. Результат може бути менш точним.',publicWhyQuestion:'Простими словами',publicHypothesis:'Найбільше схоже на',publicAlternatives:'Також близько',publicConfidence:'Вираженість патерну',publicConfidenceHigh:'висока вираженість',publicConfidenceModerate:'середньо',publicConfidenceLow:'слабка вираженість',publicWhatNext:'Що це означає',publicNextChecks:'Сприймайте результат як підказку. Подумайте, чи схоже це на ваші реальні рішення, плани й спілкування.',publicCaveat:'Результат може помилятися. Не приймайте за ним важливі рішення.',publicQualityTitle:'Чому результат може бути менш точним',publicQualityNeutral:'Ви часто обирали середину.',publicQualityChanged:'Ви змінювали деякі відповіді.',publicQualityFastItems:'На частину карток ви відповіли дуже швидко.'});
Object.assign(I18N.ru,{'tests.intro':'Расширенный пилотный опросник показывает только предварительную гипотезу о способах выбирать, действовать и общаться.',publicStartText:'Это расширенный пилотный опросник, а не диагноз или окончательное типирование.',publicItemCount:'В маршруте {count} утверждений. Можно сделать паузу; отвечайте по типичному поведению последних месяцев.',undefinedProfile:'профиль пока не определён'});
Object.assign(I18N.en,{'tests.intro':'This extended pilot questionnaire returns only a preliminary hypothesis about ways of choosing, acting, and communicating.',publicStartText:'This is an extended pilot questionnaire, not diagnosis or definitive typing.',publicItemCount:'The route contains {count} statements. You can pause; answer from your typical behavior in recent months.',undefinedProfile:'profile not yet defined'});
Object.assign(I18N.uk,{'tests.intro':'Розширений пілотний опитувальник показує лише попередню гіпотезу про способи обирати, діяти й спілкуватися.',publicStartText:'Це розширений пілотний опитувальник, а не діагноз чи остаточне типування.',publicItemCount:'У маршруті {count} тверджень. Можна зробити паузу; відповідайте за типовою поведінкою останніх місяців.',undefinedProfile:'профіль поки не визначено'});
Object.assign(I18N.ru,{instruction:'Отвечайте по типичному поведению последних месяцев. Середину выбирайте только при действительно смешанном ответе; если похожей ситуации не было, используйте «не могу оценить».',publicStartTitle:'Выберите один раздел или полный маршрут',publicRouteTitle:'Разделы теста',publicRoutePsy:'Решения и действия',publicRoutePsyText:'48 утверждений о функциональной роли Воли, Логики, Эмоции и Физики.',publicRouteTmp:'Время и направление',publicRouteTmpText:'48 утверждений о роли прошлого, настоящего, будущего и смысла.',publicRouteSoc:'Информация и общение',publicRouteSocText:'16 исследовательских утверждений; код типа до калибровки не выводится.',publicRouteAll:'Полный маршрут',publicRouteAllText:'Все три раздела в последовательных блоках.',publicAgeOptional:'Возраст — необязательно',publicSaveProgress:'Сохранить незавершённые ответы только в этом браузере',publicResumeProgress:'Продолжить сохранённое прохождение',publicDiscardProgress:'Удалить сохранённый прогресс',publicSection:'Раздел',publicNotApplicable:'Не могу оценить',publicNotApplicableHint:'Выберите это, если у вас не было сопоставимой ситуации.',publicSocExploratory:'исследовательский профиль элементов; код типа не выводится',publicResponseQuality:'Качество прохождения',publicResponseQualityAdequate:'без явных предупреждений',publicResponseQualityReview:'есть ответы, требующие осторожности',publicResponseQualityLow:'результат удержан из-за качества ответов',publicEvidence:'Выраженность модельного паттерна',publicAttentionWithheld:'Проверка внимания не пройдена; типологический вывод не показан.',publicQualityNotApplicable:'Некоторые ситуации оказалось невозможно оценить.',undefinedProfile:'данных недостаточно для типологического вывода'});
Object.assign(I18N.en,{instruction:'Answer from your typical behavior in recent months. Use the midpoint only for a genuinely mixed answer; if you have not faced a comparable situation, choose “cannot judge”.',publicStartTitle:'Choose one section or the full route',publicRouteTitle:'Test sections',publicRoutePsy:'Decisions and action',publicRoutePsyText:'48 statements about the functional role of Will, Logic, Emotion, and Physics.',publicRouteTmp:'Time and direction',publicRouteTmpText:'48 statements about the role of past, present, future, and meaning.',publicRouteSoc:'Information and communication',publicRouteSocText:'16 exploratory statements; no type code is reported before calibration.',publicRouteAll:'Full route',publicRouteAllText:'All three sections in consecutive blocks.',publicAgeOptional:'Age — optional',publicSaveProgress:'Save unfinished answers in this browser only',publicResumeProgress:'Resume saved route',publicDiscardProgress:'Delete saved progress',publicSection:'Section',publicNotApplicable:'Cannot judge',publicNotApplicableHint:'Choose this if you have not faced a comparable situation.',publicSocExploratory:'exploratory element profile; no type code is reported',publicResponseQuality:'Response quality',publicResponseQualityAdequate:'no obvious warnings',publicResponseQualityReview:'some responses need cautious interpretation',publicResponseQualityLow:'result withheld because of response quality',publicEvidence:'Model-pattern evidence',publicAttentionWithheld:'The attention check was missed; no typological inference is shown.',publicQualityNotApplicable:'Some situations could not be judged.',undefinedProfile:'insufficient evidence for a typological inference'});
Object.assign(I18N.uk,{instruction:'Відповідайте за типовою поведінкою останніх місяців. Середину обирайте лише за справді змішаної відповіді; якщо подібної ситуації не було, використайте «не можу оцінити».',publicStartTitle:'Оберіть один розділ або повний маршрут',publicRouteTitle:'Розділи тесту',publicRoutePsy:'Рішення й дії',publicRoutePsyText:'48 тверджень про функціональну роль Волі, Логіки, Емоції та Фізики.',publicRouteTmp:'Час і напрям',publicRouteTmpText:'48 тверджень про роль минулого, теперішнього, майбутнього й сенсу.',publicRouteSoc:'Інформація і спілкування',publicRouteSocText:'16 дослідницьких тверджень; код типу до калібрації не виводиться.',publicRouteAll:'Повний маршрут',publicRouteAllText:'Усі три розділи послідовними блоками.',publicAgeOptional:'Вік — необов’язково',publicSaveProgress:'Зберегти незавершені відповіді лише в цьому браузері',publicResumeProgress:'Продовжити збережене проходження',publicDiscardProgress:'Видалити збережений прогрес',publicSection:'Розділ',publicNotApplicable:'Не можу оцінити',publicNotApplicableHint:'Оберіть це, якщо у вас не було зіставної ситуації.',publicSocExploratory:'дослідницький профіль елементів; код типу не виводиться',publicResponseQuality:'Якість проходження',publicResponseQualityAdequate:'без явних попереджень',publicResponseQualityReview:'деякі відповіді потребують обережної інтерпретації',publicResponseQualityLow:'результат утримано через якість відповідей',publicEvidence:'Вираженість модельного патерну',publicAttentionWithheld:'Перевірку уваги не пройдено; типологічний висновок не показано.',publicQualityNotApplicable:'Деякі ситуації неможливо було оцінити.',undefinedProfile:'недостатньо даних для типологічного висновку'});
const POSITION_MODEL='multi-indicator-position-contrast-v2',POSITION_MIN_CELL_ITEMS=3,POSITION_MIN_ASPECT_GAP=.25,POSITION_EPSILON=1e-9;
const BUNDLED_BANK_VERSION='bundled-2026-07-27.4';
const PUBLIC_PROGRESS_KEY='before-we-build-progress-v1';
const item=(id,scale,ru,en,uk,rev=false,version='1.2',meta={})=>({id,scale,version,reverse:rev,status:'pilot',text:{ru,en,uk},...meta});
const SOC_LABELS={ru:{Ti:'БЛ',Te:'ЧЛ',Fi:'БЭ',Fe:'ЧЭ',Si:'БС',Se:'ЧС',Ni:'БИ',Ne:'ЧИ'},en:{Ti:'Ti',Te:'Te',Fi:'Fi',Fe:'Fe',Si:'Si',Se:'Se',Ni:'Ni',Ne:'Ne'},uk:{Ti:'БЛ',Te:'ЧЛ',Fi:'БЕ',Fe:'ЧЕ',Si:'БС',Se:'ЧС',Ni:'БІ',Ne:'ЧІ'}};
const PSY={aspects:['Воля','Логика','Эмоция','Физика'],code:{'Воля':'В','Логика':'Л','Эмоция':'Э','Физика':'Ф'}};
const TMP={aspects:['Past','Present','Future','Eternity'],code:{en:{Past:'P',Present:'N',Future:'F',Eternity:'E'},ru:{Past:'П',Present:'Н',Future:'Б',Eternity:'В'},uk:{Past:'Ми',Present:'Тп',Future:'Мб',Eternity:'Вч'}}};
const TIMS=[['ILE','ENTP',{ru:'Дон Кихот',en:'Don Quixote',uk:'Дон Кіхот'},['Ne','Ti','Si','Fe']],['SEI','ISFP',{ru:'Дюма',en:'Dumas',uk:'Дюма'},['Si','Fe','Ne','Ti']],['ESE','ESFJ',{ru:'Гюго',en:'Hugo',uk:'Гюго'},['Fe','Si','Ti','Ne']],['LII','INTJ',{ru:'Робеспьер',en:'Robespierre',uk:'Робеспʼєр'},['Ti','Ne','Fe','Si']],['EIE','ENFJ',{ru:'Гамлет',en:'Hamlet',uk:'Гамлет'},['Fe','Ni','Ti','Se']],['LSI','ISTJ',{ru:'Максим Горький',en:'Maxim Gorky',uk:'Максим Горький'},['Ti','Se','Fe','Ni']],['SLE','ESTP',{ru:'Жуков',en:'Zhukov',uk:'Жуков'},['Se','Ti','Ni','Fe']],['IEI','INFP',{ru:'Есенин',en:'Yesenin',uk:'Єсенін'},['Ni','Fe','Se','Ti']],['SEE','ESFP',{ru:'Наполеон',en:'Napoleon',uk:'Наполеон'},['Se','Fi','Ni','Te']],['ILI','INTP',{ru:'Бальзак',en:'Balzac',uk:'Бальзак'},['Ni','Te','Se','Fi']],['LIE','ENTJ',{ru:'Джек Лондон',en:'Jack London',uk:'Джек Лондон'},['Te','Ni','Fi','Se']],['ESI','ISFJ',{ru:'Драйзер',en:'Dreiser',uk:'Драйзер'},['Fi','Se','Te','Ni']],['LSE','ESTJ',{ru:'Штирлиц',en:'Stierlitz',uk:'Штірліц'},['Te','Si','Fi','Ne']],['EII','INFJ',{ru:'Достоевский',en:'Dostoevsky',uk:'Достоєвський'},['Fi','Ne','Te','Si']],['IEE','ENFP',{ru:'Гексли',en:'Huxley',uk:'Гекслі'},['Ne','Fi','Si','Te']],['SLI','ISTP',{ru:'Габен',en:'Gabin',uk:'Габен'},['Si','Te','Ne','Fi']]];
const socItems=[
['Ti','Мне легче понять тему, когда я вижу порядок и связи между частями.','I understand a topic more easily when I see the order and links between its parts.','Мені легше зрозуміти тему, коли я бачу порядок і зв’язки між частинами.',false],
['Ti','Мне тяжело выстраивать строгие логические схемы и формальные определения.','I find it hard to construct strict logical schemas and formal definitions.','Мені важко вибудовувати суворі логічні схеми та формальні визначення.',true],
['Te','Я быстро спрашиваю, что реально сработало на практике.','I quickly ask what actually worked in practice.','Я швидко питаю, що реально спрацювало на практиці.',false],
['Te','Практическая полезность и эффективные действия интересуют меня в последнюю очередь.','Practical utility and efficient actions matter to me least of all.','Практична користь та ефективні дії цікавлять мене в останню чергу.',true],
['Fi','Я замечаю, когда между людьми меняется доверие или близость.','I notice when trust or closeness between people changes.','Я помічаю, коли між людьми змінюється довіра або близькість.',false],
['Fi','Мне сложно улавливать тонкие оттенки личных отношений и симпатий.','I find it difficult to catch subtle shades of personal relationships and affinities.','Мені складно вловлювати тонкі відтінки особистих стосунків і симпатій.',true],
['Fe','Я быстро замечаю общее настроение в разговоре.','I quickly notice the shared mood in a conversation.','Я швидко помічаю загальний настрій у розмові.',false],
['Fe','Мне трудно управлять эмоциональной атмосферой в компании.','I find it hard to manage the emotional atmosphere in a group.','Мені важко керувати емоційною атмосферою в компанії.',true],
['Si','Когда что-то не так, я первым делом замечаю комфорт, усталость и телесные ощущения.','When something is off, I first notice comfort, tiredness, and body sensations.','Коли щось не так, я насамперед помічаю комфорт, втому й тілесні відчуття.',false],
['Si','Я часто игнорирую физический комфорт и сигналы своего тела.','I often ignore physical comfort and bodily signals.','Я часто ігнорую фізичний комфорт і сигнали свого тіла.',true],
['Se','В напряжённой ситуации я быстро замечаю, где есть сила и ресурсы.','In a tense situation, I quickly notice where there is force and resources.','У напруженій ситуації я швидко помічаю, де є сила й ресурси.',false],
['Se','Мне тяжело проявлять прямое волевое давление и отстаивать позиции.','I find it hard to exert direct forceful pressure and defend positions.','Мені важко проявляти прямий вольовий тиск і відстоювати позиції.',true],
['Ni','Я часто чувствую, к чему постепенно идёт ситуация.','I often sense where a situation is gradually heading.','Я часто відчуваю, до чого поступово йде ситуація.',false],
['Ni','Мне сложно улавливать скрытые тенденции и развитие событий во времени.','I struggle to catch hidden trends and the development of events over time.','Мені складно вловлювати приховані тенденції та розвиток подій у часі.',true],
['Ne','Меня оживляет, когда появляются неожиданные идеи и варианты.','I feel energized when unexpected ideas and options appear.','Мене оживляє, коли з’являються несподівані ідеї та варіанти.',false],
['Ne','Множество неясных вариантов скорее сбивает меня с толку, чем вдохновляет.','A multitude of unclear options confuses me rather than inspires me.','Безліч неясних варіантів швидше збиває мене з пантелику, ніж надихає.',true]
].map((x,i)=>item(`soc_${i+1}`,x[0],x[1],x[2],x[3],x[4]));
const PSY_POSITION_ROLES=Object.freeze({1:'target',2:'creative',3:'criterion',4:'resource'});
function posItem(prefix,aspect,pos,ru,en,uk,rev=false,metadata=null){
  if(!metadata)return item(`${prefix}_${aspect}_${pos}`,`${aspect}|${pos}`,ru,en,uk,rev);
  const aspectId={'Воля':'will','Логика':'logic','Эмоция':'emotion','Физика':'physics'}[aspect]||String(aspect).toLowerCase();
  return {...item(`${prefix}_${aspectId}_${pos}_${metadata.indicator}`,`${aspect}|${pos}`,ru,en,uk,rev),version:'3.0',positionRole:PSY_POSITION_ROLES[pos],responseMode:'single-statement',...metadata,aspect,position:pos};
}
const psychItems=[
posItem('psy','Воля',1,'Когда в общем деле нужно определить исходные приоритеты, я определяю их, исходя из выбранного мной направления.','When the initial priorities for a shared undertaking need to be set, I derive them from the direction I have chosen.','Коли у спільній справі потрібно визначити вихідні пріоритети, я визначаю їх, виходячи з обраного мною напряму.',false,{indicator:1,facet:'frame',context:'shared-priorities'}),
posItem('psy','Воля',1,'Когда план уже выполняется и возникает промежуточный выбор, я сохраняю исходный приоритет и подбираю способ действия под него.','When a plan is already underway and an interim choice arises, I keep the original priority and choose a way of acting to fit it.','Коли план уже виконується й виникає проміжний вибір, я зберігаю вихідний пріоритет і добираю під нього спосіб дії.',false,{indicator:2,facet:'process-result',context:'plan-in-progress'}),
posItem('psy','Воля',1,'В общем проекте есть два одинаково выполнимых варианта цели. Я определяю направление, которому будет подчинён следующий этап.','A shared project has two equally feasible versions of its goal. I define the direction that will organize the next stage.','У спільному проєкті є два однаково здійсненні варіанти мети. Я визначаю напрям, якому буде підпорядковано наступний етап.',false,{indicator:3,facet:'divergence',context:'shared-goal-change'}),
posItem('psy','Воля',2,'Когда в общем деле нужно определить исходные приоритеты, я предлагаю рабочий порядок и уточняю его по мере появления новых связей между целями.','When the initial priorities for a shared undertaking need to be set, I propose a working order and refine it as new links among the goals emerge.','Коли у спільній справі потрібно визначити вихідні пріоритети, я пропоную робочий порядок і уточнюю його в міру появи нових зв’язків між цілями.',false,{indicator:1,facet:'frame',context:'shared-priorities'}),
posItem('psy','Воля',2,'Когда план уже выполняется и возникает промежуточный выбор, я оставляю решение открытым и уточняю его по ходу действия.','When a plan is already underway and an interim choice arises, I leave the decision open and refine it as the work proceeds.','Коли план уже виконується й виникає проміжний вибір, я залишаю рішення відкритим і уточнюю його в процесі дії.',false,{indicator:2,facet:'process-result',context:'plan-in-progress'}),
posItem('psy','Воля',2,'В общем проекте есть два одинаково выполнимых варианта цели. Я развиваю принятое направление через последовательность небольших решений.','A shared project has two equally feasible versions of its goal. I develop the adopted direction through a sequence of small decisions.','У спільному проєкті є два однаково здійсненні варіанти мети. Я розвиваю прийнятий напрям через послідовність невеликих рішень.',false,{indicator:3,facet:'divergence',context:'shared-goal-change'}),
posItem('psy','Воля',3,'Когда в общем деле нужно определить исходные приоритеты, я сначала формулирую критерии и проверяю по ним возможные варианты.','When the initial priorities for a shared undertaking need to be set, I first formulate criteria and check the possible options against them.','Коли у спільній справі потрібно визначити вихідні пріоритети, я спершу формулюю критерії й перевіряю за ними можливі варіанти.',false,{indicator:1,facet:'frame',context:'shared-priorities'}),
posItem('psy','Воля',3,'Когда план уже выполняется и возникает промежуточный выбор, я не считаю выбор окончательным, пока не проверены его последствия и условия пересмотра.','When a plan is already underway and an interim choice arises, I do not treat the choice as final until its consequences and conditions for revision have been checked.','Коли план уже виконується й виникає проміжний вибір, я не вважаю вибір остаточним, доки не перевірено його наслідки й умови перегляду.',false,{indicator:2,facet:'process-result',context:'plan-in-progress'}),
posItem('psy','Воля',3,'В общем проекте есть два одинаково выполнимых варианта цели. Я формулирую условие, при котором можно принять обязательство следовать цели.','A shared project has two equally feasible versions of its goal. I formulate the condition under which a commitment to the goal can be made.','У спільному проєкті є два однаково здійсненні варіанти мети. Я формулюю умову, за якої можна взяти зобов’язання дотримуватися мети.',false,{indicator:3,facet:'divergence',context:'shared-goal-change'}),
posItem('psy','Воля',4,'Когда в общем деле нужно определить исходные приоритеты, я выбираю порядок, достаточный для текущей задачи, и использую его в работе.','When the initial priorities for a shared undertaking need to be set, I choose an order sufficient for the current task and use it in the work.','Коли у спільній справі потрібно визначити вихідні пріоритети, я обираю порядок, достатній для поточного завдання, і використовую його в роботі.',false,{indicator:1,facet:'frame',context:'shared-priorities'}),
posItem('psy','Воля',4,'Когда план уже выполняется и возникает промежуточный выбор, я выбираю вариант, достаточный для следующего шага, и продолжаю работу.','When a plan is already underway and an interim choice arises, I choose an option sufficient for the next step and continue the work.','Коли план уже виконується й виникає проміжний вибір, я обираю варіант, достатній для наступного кроку, і продовжую роботу.',false,{indicator:2,facet:'process-result',context:'plan-in-progress'}),
posItem('psy','Воля',4,'В общем проекте есть два одинаково выполнимых варианта цели. Я перевожу принятое направление в последовательность действий.','A shared project has two equally feasible versions of its goal. I translate the adopted direction into a sequence of actions.','У спільному проєкті є два однаково здійсненні варіанти мети. Я перетворюю прийнятий напрям на послідовність дій.',false,{indicator:3,facet:'divergence',context:'shared-goal-change'}),
posItem('psy','Логика',1,'Когда нужно разобраться в новой теме, я сначала строю собственную схему связей между понятиями.','When I need to understand a new topic, I first build my own model of how the concepts connect.','Коли потрібно розібратися в новій темі, я спочатку будую власну схему зв’язків між поняттями.',false,{indicator:1,facet:'frame',context:'new-topic'}),
posItem('psy','Логика',1,'Когда объяснение уже даёт предварительный ответ, я считаю его завершённым, если вывод по исходному вопросу непротиворечив.','When an explanation already provides a preliminary answer, I regard it as complete if the conclusion to the original question is internally consistent.','Коли пояснення вже дає попередню відповідь, я вважаю його завершеним, якщо висновок щодо початкового питання несуперечливий.',false,{indicator:2,facet:'process-result',context:'preliminary-explanation'}),
posItem('psy','Логика',1,'Два объяснения одинаково согласуются с доступными фактами. Я выбираю версию с более цельной системой понятий.','Two explanations fit the available facts equally well. I choose the version with the more coherent system of concepts.','Два пояснення однаково узгоджуються з доступними фактами. Я обираю версію з ціліснішою системою понять.',false,{indicator:3,facet:'divergence',context:'competing-explanations'}),
posItem('psy','Логика',2,'Когда нужно разобраться в новой теме, я начинаю с рабочих определений и пересматриваю их по мере появления примеров.','When I need to understand a new topic, I start with working definitions and revise them as examples emerge.','Коли потрібно розібратися в новій темі, я починаю з робочих визначень і переглядаю їх у міру появи прикладів.',false,{indicator:1,facet:'frame',context:'new-topic'}),
posItem('psy','Логика',2,'Когда объяснение уже даёт предварительный ответ, я продолжаю уточнять его через последовательность вопросов и примеров.','When an explanation already provides a preliminary answer, I continue refining it through a sequence of questions and examples.','Коли пояснення вже дає попередню відповідь, я продовжую уточнювати його через послідовність запитань і прикладів.',false,{indicator:2,facet:'process-result',context:'preliminary-explanation'}),
posItem('psy','Логика',2,'Два объяснения одинаково согласуются с доступными фактами. Я строю новую модель из связей, представленных в обеих версиях.','Two explanations fit the available facts equally well. I build a new model from the connections represented in both versions.','Два пояснення однаково узгоджуються з доступними фактами. Я будую нову модель зі зв’язків, представлених в обох версіях.',false,{indicator:3,facet:'divergence',context:'competing-explanations'}),
posItem('psy','Логика',3,'Когда нужно разобраться в новой теме, я сначала сверяю посылки объяснения с независимыми источниками или примерами.','When I need to understand a new topic, I first check the premises of an explanation against independent sources or examples.','Коли потрібно розібратися в новій темі, я спершу звіряю засновки пояснення з незалежними джерелами або прикладами.',false,{indicator:1,facet:'frame',context:'new-topic'}),
posItem('psy','Логика',3,'Когда объяснение уже даёт предварительный ответ, я продолжаю искать исключения и альтернативные объяснения.','When an explanation already provides a preliminary answer, I continue looking for exceptions and alternative explanations.','Коли пояснення вже дає попередню відповідь, я продовжую шукати винятки й альтернативні пояснення.',false,{indicator:2,facet:'process-result',context:'preliminary-explanation'}),
posItem('psy','Логика',3,'Два объяснения одинаково согласуются с доступными фактами. Я выделяю допущение, от которого зависит различие между версиями.','Two explanations fit the available facts equally well. I isolate the assumption on which the difference between the versions depends.','Два пояснення однаково узгоджуються з доступними фактами. Я виокремлюю припущення, від якого залежить відмінність між версіями.',false,{indicator:3,facet:'divergence',context:'competing-explanations'}),
posItem('psy','Логика',4,'Когда нужно разобраться в новой теме, я использую принятые в этой области определения, если они позволяют решить задачу.','When I need to understand a new topic, I use the definitions accepted in that field if they allow the task to be solved.','Коли потрібно розібратися в новій темі, я використовую прийняті в цій галузі визначення, якщо вони дають змогу розв’язати завдання.',false,{indicator:1,facet:'frame',context:'new-topic'}),
posItem('psy','Логика',4,'Когда объяснение уже даёт предварительный ответ, я применяю его, если оно даёт нужный для задачи результат.','When an explanation already provides a preliminary answer, I apply it if it delivers the result needed for the task.','Коли пояснення вже дає попередню відповідь, я застосовую його, якщо воно дає потрібний для завдання результат.',false,{indicator:2,facet:'process-result',context:'preliminary-explanation'}),
posItem('psy','Логика',4,'Два объяснения одинаково согласуются с доступными фактами. Я использую версию, которая лучше поддерживает уже заданный следующий шаг.','Two explanations fit the available facts equally well. I use the version that better supports the already defined next step.','Два пояснення однаково узгоджуються з доступними фактами. Я використовую версію, яка краще підтримує вже заданий наступний крок.',false,{indicator:3,facet:'divergence',context:'competing-explanations'}),
posItem('psy','Эмоция',1,'Когда в новой компании нужно выразить реакцию на общее событие, я выбираю слова и интонацию в соответствии со своим переживанием, а не с общим тоном группы.','When a reaction to a shared event needs to be expressed in a new group, I choose words and tone according to what I am feeling rather than the group’s shared tone.','Коли в новій компанії потрібно виразити реакцію на спільну подію, я обираю слова й інтонацію відповідно до власного переживання, а не до загального тону групи.',false,{indicator:1,facet:'frame',context:'new-group-reaction'}),
posItem('psy','Эмоция',1,'В ходе эмоционально значимого разговора я считаю свой отклик выраженным, когда придаю ему ясную форму — словами, голосом или действием.','During an emotionally significant conversation, I regard my response as expressed once I give it a clear form—in words, voice, or action.','Під час емоційно значущої розмови я вважаю свій відгук вираженим, коли надаю йому ясної форми — словами, голосом або дією.',false,{indicator:2,facet:'process-result',context:'emotional-conversation'}),
posItem('psy','Эмоция',1,'В важном разговоре реакцию поняли иначе, чем задумывалось. Я сохраняю исходную эмоциональную тональность в новой формулировке смысла.','In an important conversation, a reaction was understood differently from how it was intended. I retain the original emotional tone in the new formulation of the meaning.','У важливій розмові реакцію зрозуміли інакше, ніж було задумано. Я зберігаю початкову емоційну тональність у новому формулюванні сенсу.',false,{indicator:3,facet:'divergence',context:'misread-reaction'}),
posItem('psy','Эмоция',2,'Когда в новой компании нужно выразить реакцию на общее событие, я задаю исходный тон и пересматриваю его по откликам собеседников.','When a reaction to a shared event needs to be expressed in a new group, I set an initial tone and revise it in response to the other participants’ reactions.','Коли в новій компанії потрібно виразити реакцію на спільну подію, я задаю початковий тон і коригую його відповідно до реакцій співрозмовників.',false,{indicator:1,facet:'frame',context:'new-group-reaction'}),
posItem('psy','Эмоция',2,'В ходе эмоционально значимого разговора оттенок моего переживания уточняется через обмен реакциями и интонациями.','During an emotionally significant conversation, the nuance of my experience becomes clearer through an exchange of reactions and tones.','Під час емоційно значущої розмови відтінок мого переживання уточнюється через обмін реакціями та інтонаціями.',false,{indicator:2,facet:'process-result',context:'emotional-conversation'}),
posItem('psy','Эмоция',2,'В важном разговоре реакцию поняли иначе, чем задумывалось. Я продолжаю разговор через обмен эмоциональными реакциями.','In an important conversation, a reaction was understood differently from how it was intended. I continue the conversation through an exchange of emotional reactions.','У важливій розмові реакцію зрозуміли інакше, ніж було задумано. Я продовжую розмову через обмін емоційними реакціями.',false,{indicator:3,facet:'divergence',context:'misread-reaction'}),
posItem('psy','Эмоция',3,'Когда в новой компании нужно выразить реакцию на общее событие, я сопоставляю выбранный тон с контекстом и учитываю, как его могут истолковать.','When a reaction to a shared event needs to be expressed in a new group, I compare the tone I chose with the context and consider how that tone might be interpreted.','Коли в новій компанії потрібно виразити реакцію на спільну подію, я зіставляю обраний тон із контекстом і враховую, як його можуть витлумачити.',false,{indicator:1,facet:'frame',context:'new-group-reaction'}),
posItem('psy','Эмоция',3,'В ходе эмоционально значимого разговора я сверяю слова и тон с реакцией собеседника, прежде чем считать смысл прояснённым.','During an emotionally significant conversation, I compare my words and tone with the other person’s reaction before considering the meaning clear.','Під час емоційно значущої розмови я звіряю слова й тон із реакцією співрозмовника, перш ніж вважати сенс проясненим.',false,{indicator:2,facet:'process-result',context:'emotional-conversation'}),
posItem('psy','Эмоция',3,'В важном разговоре реакцию поняли иначе, чем задумывалось. Я обозначаю различие в эмоциональном смысле реакции.','In an important conversation, a reaction was understood differently from how it was intended. I make explicit the difference in the emotional meaning of the reaction.','У важливій розмові реакцію зрозуміли інакше, ніж було задумано. Я позначаю розбіжність в емоційному сенсі реакції.',false,{indicator:3,facet:'divergence',context:'misread-reaction'}),
posItem('psy','Эмоция',4,'Когда в новой компании нужно выразить реакцию на общее событие, я учитываю принятый тон при выборе формы сообщения, нужной для текущей задачи.','When a reaction to a shared event needs to be expressed in a new group, I take the established tone into account when choosing the form of the message needed for the current task.','Коли в новій компанії потрібно виразити реакцію на спільну подію, я враховую прийнятий тон, обираючи форму повідомлення, потрібну для поточного завдання.',false,{indicator:1,facet:'frame',context:'new-group-reaction'}),
posItem('psy','Эмоция',4,'В ходе эмоционально значимого разговора я выражаю реакцию в форме, необходимой для понимания, и затем перехожу к содержанию.','During an emotionally significant conversation, I express my reaction in the form needed for understanding and then move to the substance.','Під час емоційно значущої розмови я виражаю реакцію у формі, потрібній для розуміння, а потім переходжу до змісту.',false,{indicator:2,facet:'process-result',context:'emotional-conversation'}),
posItem('psy','Эмоция',4,'В важном разговоре реакцию поняли иначе, чем задумывалось. Я выбираю эмоциональную форму, соответствующую уже заданной цели разговора.','In an important conversation, a reaction was understood differently from how it was intended. I choose an emotional form that fits the conversation’s already established purpose.','У важливій розмові реакцію зрозуміли інакше, ніж було задумано. Я обираю емоційну форму, що відповідає вже заданій меті розмови.',false,{indicator:3,facet:'divergence',context:'misread-reaction'}),
posItem('psy','Физика',1,'Когда нужно обустроить общее рабочее место, я задаю собственные обязательные параметры пространства.','When a shared workspace needs to be arranged, I set my own required parameters for the space.','Коли потрібно облаштувати спільне робоче місце, я задаю власні обов’язкові параметри простору.',false,{indicator:1,facet:'frame',context:'shared-workspace'}),
posItem('psy','Физика',1,'Для регулярной работы есть несколько одинаково пригодных и доступных вариантов. Я выбираю по ощущению, которое хочу сохранять во время работы.','Several equally suitable and accessible options are available for regular work. I choose by the physical feel I want to maintain while working.','Для регулярної роботи є кілька однаково придатних і доступних варіантів. Я обираю за відчуттям, яке хочу зберігати під час роботи.',false,{indicator:2,facet:'process-result',context:'regular-use-choice'}),
posItem('psy','Физика',1,'Если в общем пространстве расходятся требования к комфорту, я сохраняю свой порядок в той части пространства, которой пользуюсь лично.','If comfort requirements differ in a shared space, I keep my own arrangement in the part of the space I use personally.','Якщо в спільному просторі різняться вимоги до комфорту, я зберігаю свій порядок у тій частині простору, якою користуюся особисто.',false,{indicator:3,facet:'divergence',context:'comfort-disagreement'}),
posItem('psy','Физика',2,'Когда нужно обустроить общее рабочее место, я предлагаю рабочий вариант и меняю его по результатам использования.','When a shared workspace needs to be arranged, I propose a working arrangement and change it based on how it is used.','Коли потрібно облаштувати спільне робоче місце, я пропоную робочий варіант і змінюю його за результатами використання.',false,{indicator:1,facet:'frame',context:'shared-workspace'}),
posItem('psy','Физика',2,'Для регулярной работы есть несколько одинаково пригодных и доступных вариантов. Я чередую их в одном и том же рабочем процессе.','Several equally suitable and accessible options are available for regular work. I alternate among them within the same work process.','Для регулярної роботи є кілька однаково придатних і доступних варіантів. Я чергую їх у межах одного й того самого робочого процесу.',false,{indicator:2,facet:'process-result',context:'regular-use-choice'}),
posItem('psy','Физика',2,'Если в общем пространстве расходятся требования к комфорту, я выбираю конфигурацию, которую можно менять по ходу использования.','If comfort requirements differ in a shared space, I choose a setup that can be adjusted as it is used.','Якщо в спільному просторі різняться вимоги до комфорту, я обираю конфігурацію, яку можна змінювати в процесі використання.',false,{indicator:3,facet:'divergence',context:'comfort-disagreement'}),
posItem('psy','Физика',3,'Когда нужно обустроить общее рабочее место, я сначала задаю проверяемые параметры и сравниваю по ним варианты обустройства.','When a shared workspace needs to be arranged, I first define verifiable parameters and compare the arrangement options against them.','Коли потрібно облаштувати спільне робоче місце, я спершу задаю перевірювані параметри й порівнюю за ними варіанти облаштування.',false,{indicator:1,facet:'frame',context:'shared-workspace'}),
posItem('psy','Физика',3,'Для регулярной работы есть несколько одинаково пригодных и доступных вариантов. Я определяю физическое условие, невыполнение которого исключает вариант.','Several equally suitable and accessible options are available for regular work. I specify the physical condition whose absence rules an option out.','Для регулярної роботи є кілька однаково придатних і доступних варіантів. Я визначаю фізичну умову, невиконання якої відсіює варіант.',false,{indicator:2,facet:'process-result',context:'regular-use-choice'}),
posItem('psy','Физика',3,'Если в общем пространстве расходятся требования к комфорту, я возвращаюсь к конкретным параметрам и пересматриваю договорённость на их основе.','If comfort requirements differ in a shared space, I return to specific parameters and revisit the agreement on that basis.','Якщо в спільному просторі різняться вимоги до комфорту, я повертаюся до конкретних параметрів і переглядаю домовленість на їх основі.',false,{indicator:3,facet:'divergence',context:'comfort-disagreement'}),
posItem('psy','Физика',4,'Когда нужно обустроить общее рабочее место, я выбираю из доступных вариантов тот, который подходит для основной задачи, и использую его без дальнейшей настройки.','When a shared workspace needs to be arranged, I choose the available option that suits the main task and use it without further adjustment.','Коли потрібно облаштувати спільне робоче місце, я обираю з доступних варіантів той, що підходить для основного завдання, і використовую його без подальшого налаштування.',false,{indicator:1,facet:'frame',context:'shared-workspace'}),
posItem('psy','Физика',4,'Для регулярной работы есть несколько одинаково пригодных и доступных вариантов. Я выбираю тот, который легче встроить в уже заданный рабочий процесс.','Several equally suitable and accessible options are available for regular work. I choose the one that is easier to integrate into the already defined work process.','Для регулярної роботи є кілька однаково придатних і доступних варіантів. Я обираю той, який легше вбудувати у вже заданий робочий процес.',false,{indicator:2,facet:'process-result',context:'regular-use-choice'}),
posItem('psy','Физика',4,'Если в общем пространстве расходятся требования к комфорту, я принимаю рабочую конфигурацию для текущей задачи и подстраиваю под неё свои действия.','If comfort requirements differ in a shared space, I adopt a workable setup for the current task and adjust my actions to it.','Якщо в спільному просторі різняться вимоги до комфорту, я приймаю робочу конфігурацію для поточного завдання й підлаштовую під неї свої дії.',false,{indicator:3,facet:'divergence',context:'comfort-disagreement'})];
const PSY_MATCHED_VIGNETTES=[
{
  aspect:'Воля',context:'shared-priorities',contextDomain:'team',
  stem:{
    ru:'Команда распределяет ограниченные усилия между тремя выполнимыми направлениями; общая задача, ограничения и обязательства по каждому направлению известны.',
    en:'A team is allocating limited effort among three feasible directions; the shared task, constraints, and commitments attached to each direction are known.',
    uk:'Команда розподіляє обмежені зусилля між трьома здійсненними напрямами; спільне завдання, обмеження й зобов’язання за кожним напрямом відомі.'
  },
  roles:{
    1:{ru:'Я задаю порядок целей, вокруг которого распределяются усилия.',en:'I set the order of goals around which effort is allocated.',uk:'Я задаю порядок цілей, навколо якого розподіляються зусилля.'},
    2:{ru:'Я связываю направления в последовательность совместных действий.',en:'I connect the directions into a sequence of joint actions.',uk:'Я пов’язую напрями в послідовність спільних дій.'},
    3:{ru:'Я различаю варианты распределения по обязательствам направлений.',en:'I distinguish the allocation options by the commitments attached to the directions.',uk:'Я розрізняю варіанти розподілу за зобов’язаннями напрямів.'},
    4:{ru:'Я распределяю работу по итоговому порядку целей.',en:'I allocate the work according to the resulting order of goals.',uk:'Я розподіляю роботу за підсумковим порядком цілей.'}
  }
},
{
  aspect:'Воля',context:'plan-in-progress',contextDomain:'personal',
  stem:{
    ru:'План уже выполняется; два способа следующего действия одинаково выполнимы, а цель, приоритет, обязательства и ближайшая задача известны.',
    en:'A plan is already under way; two ways of taking the next action are equally feasible, and the goal, priority, commitments, and immediate task are known.',
    uk:'План уже виконується; два способи наступної дії однаково здійсненні, а мета, пріоритет, зобов’язання й найближче завдання відомі.'
  },
  roles:{
    1:{ru:'Я ориентирую промежуточное решение на выбранный приоритет.',en:'I orient the intermediate decision toward the chosen priority.',uk:'Я орієнтую проміжне рішення на обраний пріоритет.'},
    2:{ru:'Я соединяю предыдущее решение с одним из текущих способов действия.',en:'I connect the previous decision with one of the current courses of action.',uk:'Я поєдную попереднє рішення з одним із поточних способів дії.'},
    3:{ru:'Я исключаю промежуточное решение, нарушающее принятое обязательство.',en:'I rule out an intermediate decision that violates the accepted commitment.',uk:'Я відкидаю проміжне рішення, що порушує прийняте зобов’язання.'},
    4:{ru:'Я выполняю ближайшую задачу в рамках текущего приоритета.',en:'I carry out the immediate task within the current priority.',uk:'Я виконую найближче завдання в межах поточного пріоритету.'}
  }
},
{
  aspect:'Воля',context:'shared-goal-change',contextDomain:'change',
  stem:{
    ru:'В общем проекте есть два одинаково выполнимых варианта цели; обязательства каждого варианта и задачи следующего этапа известны, и нужно выбрать один вариант.',
    en:'A shared project has two equally feasible goal options; the commitments of each option and the next-stage tasks are known, and one option must be chosen.',
    uk:'У спільному проєкті є два однаково здійсненні варіанти мети; зобов’язання кожного варіанта й завдання наступного етапу відомі, і потрібно обрати один варіант.'
  },
  roles:{
    1:{ru:'Я ориентирую следующий этап на выбранную цель.',en:'I orient the next stage around the chosen goal.',uk:'Я орієнтую наступний етап на обрану мету.'},
    2:{ru:'Я развиваю выбранную цель через последовательность совместных решений.',en:'I develop the chosen goal through a sequence of joint decisions.',uk:'Я розвиваю обрану мету через послідовність спільних рішень.'},
    3:{ru:'Я различаю варианты цели по связанным с ними обязательствам.',en:'I distinguish the goal options by the commitments attached to them.',uk:'Я розрізняю варіанти мети за пов’язаними з ними зобов’язаннями.'},
    4:{ru:'Я организую задачи следующего этапа по выбранному направлению.',en:'I organize the next-stage tasks according to the chosen direction.',uk:'Я організовую завдання наступного етапу за обраним напрямом.'}
  }
},
{
  aspect:'Логика',context:'new-topic',contextDomain:'learning',
  stem:{
    ru:'Нужно разобраться в новой теме; доступны согласующиеся определения, примеры и надёжные источники, а практическая задача известна.',
    en:'A new topic must be understood; compatible definitions, examples, and reliable sources are available, and the practical task is known.',
    uk:'Потрібно розібратися в новій темі; доступні узгоджені визначення, приклади й надійні джерела, а практичне завдання відоме.'
  },
  roles:{
    1:{ru:'Я организую разбор вокруг целостной системы понятий.',en:'I organize the analysis around a coherent system of concepts.',uk:'Я організовую аналіз навколо цілісної системи понять.'},
    2:{ru:'Я собираю модель темы из связей между определениями и примерами.',en:'I assemble a model of the topic from the links between definitions and examples.',uk:'Я складаю модель теми зі зв’язків між визначеннями й прикладами.'},
    3:{ru:'Я выделяю связь понятий, от которой зависит применение темы.',en:'I single out the conceptual link on which applying the topic depends.',uk:'Я виокремлюю зв’язок понять, від якого залежить застосування теми.'},
    4:{ru:'Я применяю определения и примеры к известной практической задаче.',en:'I apply the definitions and examples to the known practical task.',uk:'Я застосовую визначення й приклади до відомого практичного завдання.'}
  }
},
{
  aspect:'Логика',context:'preliminary-explanation',contextDomain:'analysis',
  stem:{
    ru:'Предварительное объяснение уже отвечает на вопрос; его посылки, примеры и практические последствия известны.',
    en:'A preliminary explanation already answers the question; its premises, examples, and practical consequences are known.',
    uk:'Попереднє пояснення вже відповідає на питання; його засновки, приклади й практичні наслідки відомі.'
  },
  roles:{
    1:{ru:'Я оформляю объяснение как завершённую систему.',en:'I frame the explanation as a complete system.',uk:'Я оформлюю пояснення як завершену систему.'},
    2:{ru:'Я развиваю объяснение через связи между посылками и примерами.',en:'I develop the explanation through the links between its premises and examples.',uk:'Я розвиваю пояснення через зв’язки між засновками й прикладами.'},
    3:{ru:'Я выделяю посылку, от которой зависит вывод объяснения.',en:'I single out the premise on which the explanation’s conclusion depends.',uk:'Я виокремлюю засновок, від якого залежить висновок пояснення.'},
    4:{ru:'Я использую практические последствия объяснения при ответе на исходный вопрос.',en:'I use the explanation’s practical consequences when answering the original question.',uk:'Я використовую практичні наслідки пояснення, відповідаючи на початкове питання.'}
  }
},
{
  aspect:'Логика',context:'competing-explanations',contextDomain:'change',
  stem:{
    ru:'Два объяснения одинаково согласуются с доступными фактами; для следующего шага нужно выбрать рабочую версию.',
    en:'Two explanations fit the available facts equally well; a working version must be chosen for the next step.',
    uk:'Два пояснення однаково узгоджуються з доступними фактами; для наступного кроку потрібно обрати робочу версію.'
  },
  roles:{
    1:{ru:'Я отдаю приоритет версии с более цельной системой понятий.',en:'I give priority to the version with the more coherent system of concepts.',uk:'Я віддаю перевагу версії з ціліснішою системою понять.'},
    2:{ru:'Я объединяю связи из обеих версий в новую рабочую модель.',en:'I combine the connections from both versions into a new working model.',uk:'Я поєдную зв’язки з обох версій у нову робочу модель.'},
    3:{ru:'Я различаю версии по их ключевому допущению.',en:'I distinguish the versions by their key assumption.',uk:'Я розрізняю версії за їхнім ключовим припущенням.'},
    4:{ru:'Я выбираю версию по её применимости к следующему шагу.',en:'I choose the version by its applicability to the next step.',uk:'Я обираю версію за її застосовністю до наступного кроку.'}
  }
},
{
  aspect:'Эмоция',context:'new-group-reaction',contextDomain:'social',
  stem:{
    ru:'В новой группе участники по-разному отреагировали на общее событие; цель разговора и общий тон понятны, и нужно дать свой ответ.',
    en:'In a new group, participants reacted differently to a shared event; the conversation’s purpose and shared tone are clear, and a response is needed.',
    uk:'У новій групі учасники по-різному відреагували на спільну подію; мета розмови й загальний тон зрозумілі, і потрібно дати власну відповідь.'
  },
  roles:{
    1:{ru:'Я ориентирую ответ на выбранную эмоциональную тональность.',en:'I orient the response around the chosen emotional tone.',uk:'Я орієнтую відповідь на обрану емоційну тональність.'},
    2:{ru:'Я соединяю оттенки прозвучавших реакций в новую форму ответа.',en:'I combine shades of the expressed reactions into a new response form.',uk:'Я поєдную відтінки висловлених реакцій у нову форму відповіді.'},
    3:{ru:'Я различаю формы ответа по сохраняемому эмоциональному смыслу.',en:'I distinguish response forms by the emotional meaning they preserve.',uk:'Я розрізняю форми відповіді за емоційним сенсом, який вони зберігають.'},
    4:{ru:'Я передаю цель разговора через общий эмоциональный тон.',en:'I convey the conversation’s purpose through the shared emotional tone.',uk:'Я передаю мету розмови через загальний емоційний тон.'}
  }
},
{
  aspect:'Эмоция',context:'emotional-conversation',contextDomain:'social',
  stem:{
    ru:'В важном разговоре собеседники одинаково понимают факты, но эмоционально реагируют по-разному; разговор продолжается.',
    en:'In an important conversation, the participants understand the facts alike but react emotionally in different ways; the conversation continues.',
    uk:'У важливій розмові співрозмовники однаково розуміють факти, але емоційно реагують по-різному; розмова триває.'
  },
  roles:{
    1:{ru:'Я выражаю переживание как эмоциональный итог своей реплики.',en:'I express an experience as the emotional outcome of my contribution.',uk:'Я виражаю переживання як емоційний підсумок своєї репліки.'},
    2:{ru:'Я преобразую различающиеся реакции в новую тональность разговора.',en:'I transform the differing reactions into a new tone for the conversation.',uk:'Я перетворюю відмінні реакції на нову тональність розмови.'},
    3:{ru:'Я отбираю продолжения по эмоциональному смыслу реакций.',en:'I select possible continuations by the emotional meaning of the reactions.',uk:'Я відбираю продовження за емоційним сенсом реакцій.'},
    4:{ru:'Я передаю содержание разговора через эмоциональную форму реплики.',en:'I convey the conversation’s content through the emotional form of my contribution.',uk:'Я передаю зміст розмови через емоційну форму своєї репліки.'}
  }
},
{
  aspect:'Эмоция',context:'misread-reaction',contextDomain:'change',
  stem:{
    ru:'В важном разговоре реакцию поняли иначе, чем было задумано; цель разговора не изменилась, и его можно продолжить.',
    en:'In an important conversation, a reaction was understood differently from what was intended; the conversation’s purpose is unchanged, and it can continue.',
    uk:'У важливій розмові реакцію зрозуміли інакше, ніж було задумано; мета розмови не змінилася, і її можна продовжити.'
  },
  roles:{
    1:{ru:'Я сохраняю исходную тональность как ориентир нового выражения.',en:'I retain the original tone as the reference point for a new expression.',uk:'Я зберігаю початкову тональність як орієнтир нового вираження.'},
    2:{ru:'Я создаю новую форму выражения из различия между задуманным и понятым смыслом.',en:'I create a new form of expression from the difference between the intended and understood meanings.',uk:'Я створюю нову форму вираження з розбіжності між задуманим і зрозумілим сенсом.'},
    3:{ru:'Я отделяю задуманный эмоциональный смысл от полученной интерпретации.',en:'I separate the intended emotional meaning from the received interpretation.',uk:'Я відокремлюю задуманий емоційний сенс від отриманого тлумачення.'},
    4:{ru:'Я подбираю эмоциональную форму к неизменной цели разговора.',en:'I match the emotional form to the conversation’s unchanged purpose.',uk:'Я добираю емоційну форму до незмінної мети розмови.'}
  }
},
{
  aspect:'Физика',context:'shared-workspace',contextDomain:'practical',
  stem:{
    ru:'Команда проектирует рабочее место из элементов двух конфигураций; цена и пригодность для задачи одинаковы, а потребности пользователей и ограничения известны.',
    en:'A team is designing a workspace from elements of two configurations; cost and task suitability are equal, and user needs and constraints are known.',
    uk:'Команда проєктує робоче місце з елементів двох конфігурацій; ціна й придатність до завдання однакові, а потреби користувачів і обмеження відомі.'
  },
  roles:{
    1:{ru:'Я организую пространство вокруг желаемого физического состояния.',en:'I organize the space around the desired physical state.',uk:'Я організовую простір навколо бажаного фізичного стану.'},
    2:{ru:'Я сочетаю элементы конфигураций в новое устройство пространства.',en:'I combine elements of the configurations into a new spatial arrangement.',uk:'Я поєдную елементи конфігурацій у нове облаштування простору.'},
    3:{ru:'Я исключаю сочетания, нарушающие известные физические ограничения.',en:'I rule out combinations that violate the known physical constraints.',uk:'Я відкидаю поєднання, що порушують відомі фізичні обмеження.'},
    4:{ru:'Я настраиваю параметры пространства под известную задачу.',en:'I configure the space parameters for the known task.',uk:'Я налаштовую параметри простору під відоме завдання.'}
  }
},
{
  aspect:'Физика',context:'regular-use-choice',contextDomain:'personal',
  stem:{
    ru:'Для регулярной работы есть несколько одинаково пригодных и доступных вариантов; различаются только их физические свойства.',
    en:'Several equally suitable and accessible options are available for regular work; they differ only in their physical properties.',
    uk:'Для регулярної роботи є кілька однаково придатних і доступних варіантів; вони відрізняються лише фізичними властивостями.'
  },
  roles:{
    1:{ru:'Я выбираю вариант по ощущению, которое хочу поддерживать во время работы.',en:'I choose an option by the physical feel I want to maintain while working.',uk:'Я обираю варіант за відчуттям, яке хочу підтримувати під час роботи.'},
    2:{ru:'Я формирую способ регулярного использования через сочетание физических свойств.',en:'I shape regular use through the combination of physical properties.',uk:'Я формую спосіб регулярного використання через поєднання фізичних властивостей.'},
    3:{ru:'Я отбираю варианты по физическому условию работы.',en:'I select the options by a physical condition of the work.',uk:'Я відбираю варіанти за фізичною умовою роботи.'},
    4:{ru:'Я подбираю вариант к рабочему процессу по его физическим свойствам.',en:'I match an option to the work process by its physical properties.',uk:'Я добираю варіант до робочого процесу за його фізичними властивостями.'}
  }
},
{
  aspect:'Физика',context:'comfort-disagreement',contextDomain:'change',
  stem:{
    ru:'В общем пространстве две конфигурации одинаково подходят задаче и по-разному отвечают известным потребностям в комфорте; их элементы можно сочетать.',
    en:'In a shared space, two configurations suit the task equally and meet known comfort needs in different ways; their elements can be combined.',
    uk:'У спільному просторі дві конфігурації однаково відповідають завданню й по-різному задовольняють відомі потреби в комфорті; їхні елементи можна поєднувати.'
  },
  roles:{
    1:{ru:'Я ориентирую договорённость на желаемое состояние пространства.',en:'I orient the agreement toward the desired state of the space.',uk:'Я орієнтую домовленість на бажаний стан простору.'},
    2:{ru:'Я соединяю элементы обеих конфигураций в новый вариант пространства.',en:'I combine elements of both configurations into a new spatial option.',uk:'Я поєдную елементи обох конфігурацій у новий варіант простору.'},
    3:{ru:'Я сопоставляю сочетания с известными потребностями в комфорте.',en:'I compare the combinations with the known comfort needs.',uk:'Я зіставляю поєднання з відомими потребами в комфорті.'},
    4:{ru:'Я учитываю требования к комфорту при организации задачи.',en:'I incorporate the comfort requirements when organizing the task.',uk:'Я враховую вимоги до комфорту під час організації завдання.'}
  }
}];
PSY_MATCHED_VIGNETTES.forEach(vignette=>Object.entries(vignette.roles).forEach(([position,role])=>{
  const target=psychItems.find(candidate=>candidate.aspect===vignette.aspect&&candidate.context===vignette.context&&candidate.position===Number(position));
  if(!target)return;
  target.text=Object.fromEntries(['ru','en','uk'].map(lang=>[lang,`${vignette.stem[lang]} ${role[lang]}`]));
  target.responseMode='matched-vignette';
  target.tetradId=`${vignette.aspect.toLowerCase()}-${vignette.context}-v1`;
  target.contextDomain=vignette.contextDomain;
}));
const TEMP_POSITION_ROLES=Object.freeze({1:'target',2:'creative',3:'criterion',4:'resource'});
function tempItem(id,aspect,position,indicator,context,text){
  return{...item(`tmp_${id}`,`${aspect}|${position}`,text.ru,text.en,text.uk,false),version:'2.0',positionRole:TEMP_POSITION_ROLES[position],indicator,context,aspect,position};
}
const tempItems=[
tempItem('past_p1_personal_choice','Past',1,'behavior','personal-choice',{
  ru:'При важном личном выборе я сначала определяю, какую линию из прежнего опыта хочу продолжить, и от неё строю следующий шаг.',
  en:'When making an important personal choice, I first identify which thread from my previous experience I want to continue and build the next step from it.',
  uk:'Під час важливого особистого вибору я спершу визначаю, яку лінію з попереднього досвіду хочу продовжити, і від неї будую наступний крок.'
}),
tempItem('past_p1_shared_project','Past',1,'preference','shared-project-history',{
  ru:'В общем проекте я предпочитаю выводить направление следующего этапа из исходного замысла и ключевых уже принятых решений.',
  en:'In a shared project, I prefer to derive the direction of the next stage from the original intent and the key decisions already made.',
  uk:'У спільному проєкті я волію виводити напрям наступного етапу з початкового задуму та ключових уже ухвалених рішень.'
}),
tempItem('past_p1_new_evidence','Past',1,'scenario','new-historical-evidence',{
  ru:'Если новые сведения меняют моё представление о прежних событиях, я заново определяю, к чему они привели, и использую этот вывод как ориентир для дальнейших действий.',
  en:'If new evidence changes my view of earlier events, I reassess where they led and use that conclusion to guide what I do next.',
  uk:'Якщо нові відомості змінюють моє уявлення про попередні події, я заново визначаю, до чого вони привели, і використовую цей висновок як орієнтир для подальших дій.'
}),
tempItem('past_p2_personal_choice','Past',2,'behavior','personal-choice',{
  ru:'Обдумывая личный выбор, я обычно рассматриваю несколько способов связать его с прежним опытом, и каждый из них может открыть другой следующий шаг.',
  en:'When considering a personal choice, I usually explore several ways to connect it with previous experience, each of which may open a different next step.',
  uk:'Обмірковуючи особистий вибір, я зазвичай розглядаю кілька способів повʼязати його з попереднім досвідом, і кожен із них може відкрити інший наступний крок.'
}),
tempItem('past_p2_shared_project','Past',2,'preference','shared-project-history',{
  ru:'Когда участники по-разному помнят историю проекта, я предпочитаю собирать из их версий новую рабочую картину, а не сохранять одну версию неизменной.',
  en:'When participants remember a project’s history differently, I prefer to build a new working account from their versions rather than preserve one version unchanged.',
  uk:'Коли учасники по-різному памʼятають історію проєкту, я волію складати з їхніх версій нову робочу картину, а не зберігати одну версію незмінною.'
}),
tempItem('past_p2_new_evidence','Past',2,'scenario','new-historical-evidence',{
  ru:'Если появляются новые сведения о прежнем решении, я пробую несколько новых трактовок его роли в общей истории.',
  en:'If new information appears about an earlier decision, I try several new interpretations of its role in the wider history.',
  uk:'Якщо зʼявляються нові відомості про попереднє рішення, я випробовую кілька нових тлумачень його ролі в загальній історії.'
}),
tempItem('past_p3_personal_choice','Past',3,'behavior','personal-choice',{
  ru:'Перед выбором в знакомой ситуации я проверяю, учтены ли последствия похожих решений, принятых раньше.',
  en:'Before choosing in a familiar situation, I check whether the consequences of similar earlier decisions have been taken into account.',
  uk:'Перед вибором у знайомій ситуації я перевіряю, чи враховано наслідки схожих рішень, ухвалених раніше.'
}),
tempItem('past_p3_shared_project','Past',3,'preference','shared-project-history',{
  ru:'Разбирая историю общего проекта, я предпочитаю отделить подтверждённые события от позднейших интерпретаций, прежде чем опираться на них в решении.',
  en:'When examining the history of a shared project, I prefer to separate confirmed events from later interpretations before relying on them in a decision.',
  uk:'Розбираючи історію спільного проєкту, я волію відокремити підтверджені події від пізніших тлумачень, перш ніж спиратися на них у рішенні.'
}),
tempItem('past_p3_new_evidence','Past',3,'scenario','new-historical-evidence',{
  ru:'Если предлагают пересмотреть прежнюю договорённость, я проверяю, что именно изменилось с момента её заключения, прежде чем оценивать новый вариант.',
  en:'If an earlier agreement is proposed for revision, I check what has changed since it was made before evaluating the new option.',
  uk:'Якщо пропонують переглянути попередню домовленість, я перевіряю, що саме змінилося з моменту її укладення, перш ніж оцінювати новий варіант.'
}),
tempItem('past_p4_personal_choice','Past',4,'behavior','personal-choice',{
  ru:'Для нового решения я обычно использую подходящий пример из прошлого как исходный шаблон, а направление определяю по нынешней цели.',
  en:'For a new decision, I usually use a relevant past example as a starting template, while letting the current goal determine the direction.',
  uk:'Для нового рішення я зазвичай використовую доречний приклад із минулого як вихідний шаблон, а напрям визначаю за нинішньою метою.'
}),
tempItem('past_p4_shared_project','Past',4,'preference','shared-project-history',{
  ru:'При подготовке решения по проекту я предпочитаю извлечь из архивов только сведения, необходимые для ближайшего шага.',
  en:'When preparing a project decision, I prefer to retrieve from the records only the information needed for the next step.',
  uk:'Готуючи рішення щодо проєкту, я волію дістати з архівів лише відомості, потрібні для найближчого кроку.'
}),
tempItem('past_p4_new_evidence','Past',4,'scenario','new-historical-evidence',{
  ru:'Если для решения нужна деталь давнего события, мне достаточно восстановить её по доступной записи или рассказу и продолжить работу.',
  en:'If a decision requires a detail from a long-ago event, it is enough for me to reconstruct it from an available record or account and continue working.',
  uk:'Якщо для рішення потрібна деталь давньої події, мені достатньо відновити її за доступним записом або розповіддю й продовжити роботу.'
}),
tempItem('present_p1_current_conditions','Present',1,'behavior','plan-vs-current-conditions',{
  ru:'Когда план расходится с реальной обстановкой, я обычно перестраиваю приоритеты вокруг того, что требует решения здесь и сейчас.',
  en:'When a plan diverges from the actual situation, I usually reorganize priorities around what requires a decision here and now.',
  uk:'Коли план розходиться з реальною ситуацією, я зазвичай перебудовую пріоритети навколо того, що потребує рішення тут і зараз.'
}),
tempItem('present_p1_team_session','Present',1,'preference','live-team-session',{
  ru:'Если у встречи несколько возможных тем, я предпочитаю выстраивать её вокруг конкретного результата, который нужен к концу этой встречи.',
  en:'If a meeting has several possible topics, I prefer to organize it around the concrete result needed by the end of that meeting.',
  uk:'Якщо зустріч має кілька можливих тем, я волію вибудовувати її навколо конкретного результату, потрібного до завершення цієї зустрічі.'
}),
tempItem('present_p1_unfamiliar_setting','Present',1,'scenario','unfamiliar-setting',{
  ru:'Оказавшись в новом месте, я сначала определяю свою текущую роль и то, как здесь организована работа, а затем выстраиваю дальнейшие действия.',
  en:'In a new setting, I first determine my current role and how work is organized there, then plan my next actions accordingly.',
  uk:'Опинившись у новому місці, я спершу визначаю свою поточну роль і те, як тут організована робота, а потім вибудовую подальші дії.'
}),
tempItem('present_p2_current_conditions','Present',2,'behavior','plan-vs-current-conditions',{
  ru:'Учитывая, кто сейчас доступен, сколько есть времени и какие материалы есть под рукой, я обычно пробую несколько способов организовать работу.',
  en:'Taking into account who is available now, how much time we have, and what materials are on hand, I usually try several ways to organize the work.',
  uk:'Зважаючи на те, хто зараз доступний, скільки є часу та які матеріали є під рукою, я зазвичай випробовую кілька способів організувати роботу.'
}),
tempItem('present_p2_team_session','Present',2,'preference','live-team-session',{
  ru:'По ходу встречи я предпочитаю менять формат работы в ответ на то, что происходит между участниками в данный момент.',
  en:'As a meeting unfolds, I prefer to change the working format in response to what is happening among the participants at that moment.',
  uk:'Упродовж зустрічі я волію змінювати формат роботи відповідно до того, що відбувається між учасниками в цей момент.'
}),
tempItem('present_p2_unfamiliar_setting','Present',2,'scenario','unfamiliar-setting',{
  ru:'Если в новом месте первоначальный способ участия не подходит, я пробую другую роль или форму включения и смотрю, как меняется ситуация.',
  en:'If my initial way of participating does not fit a new setting, I try another role or form of involvement and observe how the situation changes.',
  uk:'Якщо в новому місці початковий спосіб участі не підходить, я випробовую іншу роль або форму залучення й дивлюся, як змінюється ситуація.'
}),
tempItem('present_p3_current_conditions','Present',3,'behavior','plan-vs-current-conditions',{
  ru:'Перед тем как взять на себя обязательство, я сверяю план с тем, сколько сейчас реально есть времени и сил и к каким ресурсам есть доступ.',
  en:'Before making a commitment, I compare the plan with the time and capacity actually available now and the resources I can access.',
  uk:'Перш ніж узяти на себе зобов’язання, я звіряю план із тим, скільки зараз реально є часу й сил та до яких ресурсів є доступ.'
}),
tempItem('present_p3_team_session','Present',3,'preference','live-team-session',{
  ru:'Оценивая предложение группы, я предпочитаю сначала проверить, соответствует ли оно текущему распределению ролей и имеющимся условиям.',
  en:'When evaluating a group proposal, I prefer first to check whether it fits the current distribution of roles and the conditions at hand.',
  uk:'Оцінюючи пропозицію групи, я волію спершу перевірити, чи відповідає вона поточному розподілу ролей і наявним умовам.'
}),
tempItem('present_p3_unfamiliar_setting','Present',3,'scenario','unfamiliar-setting',{
  ru:'Если описание нового места расходится с тем, что наблюдается на месте, для решения я опираюсь на проверяемые признаки текущей ситуации.',
  en:'If a description of a new setting differs from what can be observed there, I base the decision on verifiable features of the current situation.',
  uk:'Якщо опис нового місця розходиться з тим, що спостерігається на місці, у рішенні я спираюся на перевірювані ознаки поточної ситуації.'
}),
tempItem('present_p4_current_conditions','Present',4,'behavior','plan-vs-current-conditions',{
  ru:'Если условия меняются, я обычно учитываю новое ограничение при планировании, но не позволяю ему определять общую цель.',
  en:'If conditions change, I usually take the new constraint into account without letting it define the overall goal.',
  uk:'Якщо умови змінюються, я зазвичай враховую нове обмеження під час планування, але не дозволяю йому визначати загальну мету.'
}),
tempItem('present_p4_team_session','Present',4,'preference','live-team-session',{
  ru:'Перед решением на встрече я предпочитаю получить краткую сводку текущего положения, достаточную для следующего шага.',
  en:'Before making a decision in a meeting, I prefer to get a brief snapshot of the current situation that is sufficient for the next step.',
  uk:'Перед рішенням на зустрічі я волію отримати коротке зведення поточного стану, достатнє для наступного кроку.'
}),
tempItem('present_p4_unfamiliar_setting','Present',4,'scenario','unfamiliar-setting',{
  ru:'В незнакомом месте я использую принятые там правила и доступные ориентиры как рабочую основу, пока занимаюсь задачей, ради которой я здесь.',
  en:'In an unfamiliar setting, I use the established local rules and available guidance as a working basis while focusing on the task that brought me there.',
  uk:'У незнайомому місці я використовую прийняті там правила й доступні орієнтири як робочу основу, поки займаюся завданням, заради якого я тут.'
}),
tempItem('future_p1_personal_choice','Future',1,'behavior','personal-long-range-choice',{
  ru:'При важном выборе я сначала формулирую желаемое будущее состояние, а текущие варианты рассматриваю как разные пути к нему.',
  en:'When making an important choice, I first define the desired future state and view the current options as different paths toward it.',
  uk:'Під час важливого вибору я спершу формулюю бажаний майбутній стан, а поточні варіанти розглядаю як різні шляхи до нього.'
}),
tempItem('future_p1_team_roadmap','Future',1,'preference','team-roadmap',{
  ru:'В общем проекте я предпочитаю сначала определить конечный результат, а уже затем выстраивать от него этапы и распределять усилия.',
  en:'In a shared project, I prefer to define the final result first, then work backward to map out the stages and allocate effort.',
  uk:'У спільному проєкті я волію спершу визначити кінцевий результат, а вже потім вибудовувати від нього етапи й розподіляти зусилля.'
}),
tempItem('future_p1_disrupted_forecast','Future',1,'scenario','disrupted-forecast',{
  ru:'Если прежний план становится невозможным, я сначала задаю новую конечную точку, а затем перестраиваю маршрут к ней.',
  en:'If the previous plan becomes impossible, I first set a new endpoint and then rebuild the route toward it.',
  uk:'Якщо попередній план стає неможливим, я спершу задаю нову кінцеву точку, а потім перебудовую маршрут до неї.'
}),
tempItem('future_p2_personal_choice','Future',2,'behavior','personal-long-range-choice',{
  ru:'Планируя следующий период жизни, я обычно разрабатываю несколько разных траекторий и оставляю возможность переключаться между ними.',
  en:'When planning the next period of my life, I usually develop several different trajectories and leave room to switch between them.',
  uk:'Плануючи наступний період життя, я зазвичай розробляю кілька різних траєкторій і залишаю можливість перемикатися між ними.'
}),
tempItem('future_p2_team_roadmap','Future',2,'preference','team-roadmap',{
  ru:'Обсуждая идею проекта, я предпочитаю рассмотреть несколько вариантов её развития, прежде чем выбрать один маршрут.',
  en:'When discussing a project idea, I prefer to explore several ways it could develop before choosing one path.',
  uk:'Обговорюючи ідею проєкту, я волію розглянути кілька варіантів її розвитку, перш ніж обрати один шлях.'
}),
tempItem('future_p2_disrupted_forecast','Future',2,'scenario','disrupted-forecast',{
  ru:'Если появляется новый риск или новая возможность, я перестраиваю набор сценариев будущего, а не только исправляю один план.',
  en:'If a new risk or opportunity appears, I rebuild the set of future scenarios rather than merely correcting one plan.',
  uk:'Якщо зʼявляється новий ризик або нова можливість, я перебудовую набір сценаріїв майбутнього, а не лише виправляю один план.'
}),
tempItem('future_p3_personal_choice','Future',3,'behavior','personal-long-range-choice',{
  ru:'Перед личным решением я проверяю, какие последствия оно будет иметь не только сразу, но и позже.',
  en:'Before making a personal decision, I check what consequences it will create beyond the immediate result.',
  uk:'Перед особистим рішенням я перевіряю, які наслідки воно матиме не лише одразу, а й згодом.'
}),
tempItem('future_p3_team_roadmap','Future',3,'preference','team-roadmap',{
  ru:'Сравнивая планы проекта, я предпочитаю заранее определить, какие будущие последствия сделают вариант неприемлемым.',
  en:'When comparing project plans, I prefer to define in advance which future consequences would make an option unacceptable.',
  uk:'Порівнюючи плани проєкту, я волію заздалегідь визначити, які майбутні наслідки зроблять варіант неприйнятним.'
}),
tempItem('future_p3_disrupted_forecast','Future',3,'scenario','disrupted-forecast',{
  ru:'Если новый прогноз меняет ожидаемый итог, я сопоставляю его с заранее выбранными критериями и заново оцениваю решение.',
  en:'If a new forecast changes the expected outcome, I compare it with previously chosen criteria and reassess the decision.',
  uk:'Якщо новий прогноз змінює очікуваний підсумок, я зіставляю його із заздалегідь обраними критеріями й заново оцінюю рішення.'
}),
tempItem('future_p4_personal_choice','Future',4,'behavior','personal-long-range-choice',{
  ru:'Для личного решения мне обычно достаточно прогноза до ближайшей значимой точки; затем я обновляю его по мере необходимости.',
  en:'For a personal decision, a forecast through the next significant point is usually enough for me; after that, I update it as needed.',
  uk:'Для особистого рішення мені зазвичай достатньо прогнозу до найближчої значущої точки; потім я оновлюю його за потреби.'
}),
tempItem('future_p4_team_roadmap','Future',4,'preference','team-roadmap',{
  ru:'В типовом проекте я предпочитаю использовать готовый график или дорожную карту как рабочую основу и сосредоточиться на выполнении.',
  en:'In a routine project, I prefer to use an existing schedule or roadmap as a working framework and focus on execution.',
  uk:'У типовому проєкті я волію використовувати готовий графік або дорожню карту як робочу основу й зосередитися на виконанні.'
}),
tempItem('future_p4_disrupted_forecast','Future',4,'scenario','disrupted-forecast',{
  ru:'Если выбор зависит от отдалённых последствий, я получаю необходимый прогноз и учитываю его как один из факторов при принятии решения.',
  en:'If a choice depends on distant consequences, I obtain the forecast I need and treat it as one factor in the decision.',
  uk:'Якщо вибір залежить від віддалених наслідків, я отримую потрібний прогноз і враховую його як один із чинників під час ухвалення рішення.'
}),
tempItem('eternity_p1_major_goal','Eternity',1,'behavior','major-goal',{
  ru:'Выбирая долгосрочную цель, я сначала определяю, какому более широкому замыслу она должна служить, и на этой основе задаю направление.',
  en:'When choosing a long-term goal, I first determine which broader purpose it should serve and use that purpose to set the direction.',
  uk:'Обираючи довгострокову мету, я спершу визначаю, якому ширшому задуму вона має служити, і на цій основі задаю напрям.'
}),
tempItem('eternity_p1_shared_mission','Eternity',1,'preference','shared-mission',{
  ru:'В общем проекте я предпочитаю выводить стратегию и конкретные задачи из его долгосрочного предназначения.',
  en:'In a shared project, I prefer to derive the strategy and concrete tasks from its long-term purpose.',
  uk:'У спільному проєкті я волію виводити стратегію й конкретні завдання з його довгострокового призначення.'
}),
tempItem('eternity_p1_meaning_conflict','Eternity',1,'scenario','meaning-conflict',{
  ru:'Если краткосрочный показатель проекта уводит его от исходного предназначения, я перестраиваю план вокруг этого предназначения.',
  en:'If a project’s short-term metric pulls it away from its original purpose, I rebuild the plan around that purpose.',
  uk:'Якщо короткостроковий показник проєкту відводить його від початкового призначення, я перебудовую план навколо цього призначення.'
}),
tempItem('eternity_p2_major_goal','Eternity',2,'behavior','major-goal',{
  ru:'Обдумывая большую цель, я обычно рассматриваю её через несколько систем ценностей и нахожу в них разные возможные смыслы.',
  en:'When considering a major goal, I usually view it through several value systems and find different possible meanings in them.',
  uk:'Обмірковуючи велику мету, я зазвичай розглядаю її крізь кілька систем цінностей і знаходжу в них різні можливі сенси.'
}),
tempItem('eternity_p2_shared_mission','Eternity',2,'preference','shared-mission',{
  ru:'Когда участники по-разному понимают общее «зачем», я предпочитаю перестраивать его формулировку, сочетая несколько смысловых рамок.',
  en:'When participants understand a shared purpose differently, I prefer to reshape its wording by combining several frameworks of meaning.',
  uk:'Коли учасники по-різному розуміють спільне «навіщо», я волію перебудовувати його формулювання, поєднуючи кілька смислових рамок.'
}),
tempItem('eternity_p2_meaning_conflict','Eternity',2,'scenario','meaning-conflict',{
  ru:'Если проект теряет прежний смысл, я исследую несколько новых способов объяснить, зачем он может быть нужен, прежде чем решать его судьбу.',
  en:'If a project loses its former meaning, I explore several new ways to explain why it might matter before deciding its future.',
  uk:'Якщо проєкт втрачає колишній сенс, я досліджую кілька нових способів пояснити, навіщо він може бути потрібний, перш ніж вирішувати його долю.'
}),
tempItem('eternity_p3_major_goal','Eternity',3,'behavior','major-goal',{
  ru:'Перед тем как принять важную цель, я проверяю, согласуется ли она с принципами, которые считаю применимыми в разных ситуациях.',
  en:'Before adopting an important goal, I check whether it is consistent with principles I consider applicable across different situations.',
  uk:'Перш ніж прийняти важливу мету, я перевіряю, чи узгоджується вона з принципами, які вважаю застосовними в різних ситуаціях.'
}),
tempItem('eternity_p3_shared_mission','Eternity',3,'preference','shared-mission',{
  ru:'Оценивая практичный план проекта, я предпочитаю отдельно проверить, соответствует ли его результат заявленному общему «зачем».',
  en:'When evaluating a practical project plan, I prefer to check separately whether its outcome is consistent with the stated shared purpose.',
  uk:'Оцінюючи практичний план проєкту, я волію окремо перевірити, чи відповідає його результат заявленому спільному «навіщо».'
}),
tempItem('eternity_p3_meaning_conflict','Eternity',3,'scenario','meaning-conflict',{
  ru:'Когда два объяснения смысла противоречат друг другу, я проверяю их на внутренние противоречия и случаи, где их принципы дают разные выводы.',
  en:'When two explanations of meaning conflict, I test them for internal contradictions and for cases where their principles lead to different conclusions.',
  uk:'Коли два пояснення сенсу суперечать одне одному, я перевіряю їх на внутрішні суперечності та випадки, де їхні принципи дають різні висновки.'
}),
tempItem('eternity_p4_major_goal','Eternity',4,'behavior','major-goal',{
  ru:'При выборе большой цели я обычно беру подходящую концепцию или принцип как ориентир для конкретного решения, не выстраивая на этой основе целостную систему.',
  en:'When choosing a major goal, I usually take a suitable concept or principle as guidance for the concrete decision without building it into a complete system.',
  uk:'Обираючи велику мету, я зазвичай беру доречну концепцію або принцип як орієнтир для конкретного рішення, не вибудовуючи на цій основі цілісної системи.'
}),
tempItem('eternity_p4_shared_mission','Eternity',4,'preference','shared-mission',{
  ru:'В общем проекте я предпочитаю использовать достаточно ясную рабочую формулировку общего «зачем» и уточнять её, когда меняются задачи.',
  en:'In a shared project, I prefer to use a sufficiently clear working statement of the shared purpose and refine it when the tasks change.',
  uk:'У спільному проєкті я волію використовувати достатньо зрозуміле робоче формулювання спільного «навіщо» й уточнювати його, коли змінюються завдання.'
}),
tempItem('eternity_p4_meaning_conflict','Eternity',4,'scenario','meaning-conflict',{
  ru:'Если трактовки смысла расходятся, я учитываю только различие, важное для текущего выбора, а полное согласование откладываю до тех пор, пока оно не понадобится.',
  en:'If interpretations of meaning differ, I focus only on the distinction relevant to the current choice and defer full reconciliation until it is needed.',
  uk:'Якщо тлумачення сенсу розходяться, я враховую лише відмінність, важливу для поточного вибору, а повне узгодження відкладаю доти, доки воно не знадобиться.'
})];
const TEMP_MATCHED_VIGNETTES=[
{
  aspect:'Past',context:'personal-choice',contextDomain:'personal',indicator:1,
  stem:{
    ru:'Я выбираю один из двух осуществимых способов продолжить важное дело; известны текущие условия и итоги похожих прошлых решений.',
    en:'I am choosing between two feasible ways to continue an important undertaking; the current conditions and outcomes of similar past decisions are known.',
    uk:'Я обираю один із двох здійсненних способів продовжити важливу справу; відомі поточні умови й результати схожих минулих рішень.'
  },
  roles:{
    1:{ru:'Я задаю желаемый результат как продолжение выбранной линии прошлого.',en:'I define the desired outcome as a continuation of a chosen line from the past.',uk:'Я задаю бажаний результат як продовження обраної лінії минулого.'},
    2:{ru:'Последовательность прежних решений и последствий я превращаю в схему следующего шага.',en:'I turn the sequence of earlier decisions and consequences into a plan for the next step.',uk:'Послідовність попередніх рішень і наслідків я перетворюю на схему наступного кроку.'},
    3:{ru:'Последствия прежних решений определяют, какой вариант я считаю приемлемым.',en:'The consequences of earlier decisions determine which option I consider acceptable.',uk:'Наслідки попередніх рішень визначають, який варіант я вважаю прийнятним.'},
    4:{ru:'Я использую сведения о прежних решениях как справочный материал при выборе.',en:'I use information about earlier decisions as reference material for the choice.',uk:'Я використовую відомості про попередні рішення як довідковий матеріал під час вибору.'}
  }
},
{
  aspect:'Past',context:'shared-project-history',contextDomain:'team',indicator:2,
  stem:{
    ru:'Команда выбирает следующий этап проекта; всем известны текущие ограничения, исходный замысел, прежние решения и их результаты.',
    en:'A team is choosing the next project stage; the current constraints, original intent, earlier decisions, and their outcomes are known to everyone.',
    uk:'Команда обирає наступний етап проєкту; усім відомі поточні обмеження, початковий задум, попередні рішення та їхні результати.'
  },
  roles:{
    1:{ru:'Сложившаяся линия проекта задаёт для меня результат следующего этапа.',en:'For me, the established project line defines the outcome of the next stage.',uk:'Сформована лінія проєкту задає для мене результат наступного етапу.'},
    2:{ru:'Историю прежних решений и результатов я преобразую в структуру следующего этапа.',en:'I transform the history of earlier decisions and outcomes into the structure of the next stage.',uk:'Історію попередніх рішень і результатів я перетворюю на структуру наступного етапу.'},
    3:{ru:'Для меня приемлемо продолжение, соответствующее результатам прежних этапов.',en:'For me, an acceptable continuation is one that is consistent with the outcomes of earlier stages.',uk:'Для мене прийнятним є продовження, що відповідає результатам попередніх етапів.'},
    4:{ru:'Я использую историю проекта как справочный материал для следующего этапа.',en:'I use the project history as reference material for the next stage.',uk:'Я використовую історію проєкту як довідковий матеріал для наступного етапу.'}
  }
},
{
  aspect:'Past',context:'new-historical-evidence',contextDomain:'change',indicator:3,
  stem:{
    ru:'Перед решением появляется надёжный документ, меняющий моё представление о последовательности прошлых событий; текущая цель, условия и варианты остаются прежними.',
    en:'Before a decision, a reliable document changes my understanding of the sequence of past events; the current objective, conditions, and options remain unchanged.',
    uk:'Перед рішенням з’являється надійний документ, що змінює моє уявлення про послідовність минулих подій; поточна мета, умови й варіанти залишаються незмінними.'
  },
  roles:{
    1:{ru:'Обновлённая линия событий задаёт результат, к которому должно вести решение.',en:'The revised line of events defines the outcome toward which the decision should lead.',uk:'Оновлена лінія подій задає результат, до якого має вести рішення.'},
    2:{ru:'Обновлённое описание прошлых событий я превращаю в схему текущего решения.',en:'I turn the revised account of past events into a structure for the current decision.',uk:'Оновлений опис минулих подій я перетворюю на схему поточного рішення.'},
    3:{ru:'Я считаю приемлемым вариант, согласующийся с обновлённой последовательностью событий.',en:'I consider an option acceptable when it is consistent with the revised sequence of events.',uk:'Я вважаю прийнятним варіант, що узгоджується з оновленою послідовністю подій.'},
    4:{ru:'Я включаю новые сведения о прошлом в материалы текущего решения.',en:'I include the new information about the past among the materials for the current decision.',uk:'Я включаю нові відомості про минуле до матеріалів поточного рішення.'}
  }
},
{
  aspect:'Present',context:'plan-vs-current-conditions',contextDomain:'personal',indicator:1,
  stem:{
    ru:'Для текущей задачи нужно выбрать ближайший результат и способ действия; известны более широкая цель, роли, доступное время и ресурсы.',
    en:'A near-term outcome and course of action must be chosen for a current task; the broader objective, roles, available time, and resources are known.',
    uk:'Для поточного завдання потрібно обрати найближчий результат і спосіб дії; відомі ширша мета, ролі, доступний час і ресурси.'
  },
  roles:{
    1:{ru:'Я задаю ближайший результат как состояние, которого нужно достичь сейчас.',en:'I define the near-term outcome as the state that needs to be reached now.',uk:'Я задаю найближчий результат як стан, якого потрібно досягти зараз.'},
    2:{ru:'Из текущих ролей, времени и ресурсов я составляю способ действия.',en:'I compose a course of action from the current roles, time, and resources.',uk:'Із поточних ролей, часу й ресурсів я складаю спосіб дії.'},
    3:{ru:'Я считаю действие приемлемым, если оно соответствует текущим ролям, времени и ресурсам.',en:'I consider an action acceptable when it fits the current roles, time, and resources.',uk:'Я вважаю дію прийнятною, якщо вона відповідає поточним ролям, часу й ресурсам.'},
    4:{ru:'Я использую сведения о текущих условиях как исходные данные для задачи.',en:'I use information about the current conditions as input for the task.',uk:'Я використовую відомості про поточні умови як вихідні дані для завдання.'}
  }
},
{
  aspect:'Present',context:'live-team-session',contextDomain:'team',indicator:2,
  stem:{
    ru:'На встрече группа выбирает следующее действие; известны цель проекта, состав участников, повестка и оставшееся время.',
    en:'At a meeting, a group is choosing its next action; the project objective, participants, agenda, and remaining time are known.',
    uk:'На зустрічі група обирає наступну дію; відомі мета проєкту, склад учасників, порядок денний і час, що залишився.'
  },
  roles:{
    1:{ru:'Результат, который нужно получить на этой встрече, задаёт направление выбора.',en:'The outcome to be reached in this meeting defines the direction of the choice.',uk:'Результат, якого потрібно досягти на цій зустрічі, задає напрям вибору.'},
    2:{ru:'Из текущих вкладов участников и оставшегося времени я формирую следующее действие.',en:'I form the next action from the participants’ current contributions and the remaining time.',uk:'Із поточних внесків учасників і часу, що залишився, я формую наступну дію.'},
    3:{ru:'Состояние обсуждения, состав участников и оставшееся время определяют, какое действие приемлемо.',en:'The state of the discussion, the participants, and the remaining time determine which action is acceptable.',uk:'Стан обговорення, склад учасників і час, що залишився, визначають, яка дія є прийнятною.'},
    4:{ru:'Я использую ход текущего обсуждения как контекст для следующего действия.',en:'I use the current discussion as context for the next action.',uk:'Я використовую перебіг поточного обговорення як контекст для наступної дії.'}
  }
},
{
  aspect:'Present',context:'unfamiliar-setting',contextDomain:'change',indicator:3,
  stem:{
    ru:'Я прихожу в незнакомую организацию выполнить конкретную задачу; её цель известна, а роли, правила и ресурсы видны на месте.',
    en:'I enter an unfamiliar organization to complete a specific task; its objective is known, while the roles, rules, and resources can be observed on site.',
    uk:'Я приходжу до незнайомої організації виконати конкретне завдання; його мета відома, а ролі, правила й ресурси видно на місці.'
  },
  roles:{
    1:{ru:'Состояние, которое нужно получить здесь за время моего участия, задаёт результат.',en:'The state to be reached here during my involvement defines the outcome.',uk:'Стан, якого потрібно досягти тут за час моєї участі, задає результат.'},
    2:{ru:'Наблюдаемые роли, правила и ресурсы я соединяю в способ своего участия.',en:'I combine the observed roles, rules, and resources into a way of participating.',uk:'Спостережувані ролі, правила й ресурси я поєдную у спосіб своєї участі.'},
    3:{ru:'Наблюдаемые условия определяют, какие действия приемлемы в этой обстановке.',en:'The observed conditions determine which actions are acceptable in this setting.',uk:'Спостережувані умови визначають, які дії є прийнятними в цій обстановці.'},
    4:{ru:'Я использую наблюдаемые условия как исходные данные при выполнении задачи.',en:'I use the observed conditions as input while carrying out the task.',uk:'Я використовую спостережувані умови як вихідні дані під час виконання завдання.'}
  }
},
{
  aspect:'Future',context:'personal-long-range-choice',contextDomain:'personal',indicator:1,
  stem:{
    ru:'Я выбираю один из двух осуществимых личных вариантов; мои текущие потребности известны, а прогноз ближайших и отдалённых последствий каждого доступен.',
    en:'I am choosing between two feasible personal options; my current needs are known, and a forecast of each option’s near-term and long-term consequences is available.',
    uk:'Я обираю один із двох здійсненних особистих варіантів; мої поточні потреби відомі, а прогноз найближчих і віддалених наслідків кожного доступний.'
  },
  roles:{
    1:{ru:'Желаемое будущее состояние задаёт для меня результат выбора.',en:'The desired future state defines the outcome of the choice for me.',uk:'Бажаний майбутній стан задає для мене результат вибору.'},
    2:{ru:'Прогнозируемую последовательность последствий я превращаю в ход дальнейших действий.',en:'I turn the projected sequence of consequences into a course of further action.',uk:'Прогнозовану послідовність наслідків я перетворюю на хід подальших дій.'},
    3:{ru:'Я считаю вариант приемлемым по его прогнозируемым последствиям.',en:'I consider an option acceptable based on its projected consequences.',uk:'Я вважаю варіант прийнятним за його прогнозованими наслідками.'},
    4:{ru:'Я использую прогнозируемые последствия как исходные данные для выбора.',en:'I use the projected consequences as input for the choice.',uk:'Я використовую прогнозовані наслідки як вихідні дані для вибору.'}
  }
},
{
  aspect:'Future',context:'team-roadmap',contextDomain:'team',indicator:2,
  stem:{
    ru:'Команда выбирает один из двух осуществимых планов; известны требования и текущие ограничения, а для обоих доступны прогнозы этапов и последствий.',
    en:'A team is choosing between two feasible plans; the requirements and current constraints are known, and forecasts of the stages and consequences are available for both.',
    uk:'Команда обирає один із двох здійсненних планів; відомі вимоги й поточні обмеження, а для обох доступні прогнози етапів і наслідків.'
  },
  roles:{
    1:{ru:'Представленное в прогнозе конечное состояние задаёт результат плана.',en:'The end state represented in the forecast defines the outcome of the plan.',uk:'Представлений у прогнозі кінцевий стан задає результат плану.'},
    2:{ru:'Из прогнозируемых этапов я формирую маршрут выполнения плана.',en:'I form the plan’s implementation route from the projected stages.',uk:'Із прогнозованих етапів я формую маршрут виконання плану.'},
    3:{ru:'Прогнозируемые последствия определяют приемлемость плана.',en:'The projected consequences determine whether a plan is acceptable.',uk:'Прогнозовані наслідки визначають прийнятність плану.'},
    4:{ru:'Я использую прогнозируемые этапы и последствия как исходные данные для плана.',en:'I use the projected stages and consequences as input for the plan.',uk:'Я використовую прогнозовані етапи й наслідки як вихідні дані для плану.'}
  }
},
{
  aspect:'Future',context:'disrupted-forecast',contextDomain:'change',indicator:3,
  stem:{
    ru:'Новый надёжный прогноз делает прежний план невыполнимым; известны текущие требования и прогнозируемые последствия осуществимых вариантов замены.',
    en:'A new reliable forecast makes the previous plan unworkable; the current requirements and projected consequences of feasible replacements are known.',
    uk:'Новий надійний прогноз робить попередній план нездійсненним; відомі поточні вимоги й прогнозовані наслідки здійсненних варіантів заміни.'
  },
  roles:{
    1:{ru:'Осуществимое будущее состояние задаёт конечный результат решения.',en:'A feasible future state defines the final outcome of the decision.',uk:'Здійсненний майбутній стан задає кінцевий результат рішення.'},
    2:{ru:'Обновлённую последовательность будущих событий я превращаю в структуру нового плана.',en:'I turn the revised sequence of future events into the structure of a new plan.',uk:'Оновлену послідовність майбутніх подій я перетворюю на структуру нового плану.'},
    3:{ru:'Приемлемость замены для меня зависит от её прогнозируемых последствий.',en:'For me, a replacement’s acceptability depends on its projected consequences.',uk:'Прийнятність заміни для мене залежить від її прогнозованих наслідків.'},
    4:{ru:'Я включаю новый прогноз в исходные данные для выбора замены.',en:'I include the new forecast among the inputs for choosing a replacement.',uk:'Я включаю новий прогноз до вихідних даних для вибору заміни.'}
  }
},
{
  aspect:'Eternity',context:'major-goal',contextDomain:'personal',indicator:1,
  stem:{
    ru:'Я выбираю одну из двух осуществимых долгосрочных целей; известны ресурсы, последствия и связанные с каждой более широкие замыслы и принципы.',
    en:'I am choosing between two feasible long-term goals; the resources, consequences, and broader purposes and principles linked to each are known.',
    uk:'Я обираю одну з двох здійсненних довгострокових цілей; відомі ресурси, наслідки та пов’язані з кожною ширші задуми й принципи.'
  },
  roles:{
    1:{ru:'Более широкий замысел задаёт результат, которому должен служить выбор.',en:'The broader purpose defines the outcome that the choice should serve.',uk:'Ширший задум задає результат, якому має служити вибір.'},
    2:{ru:'Цель, более широкий замысел и принципы я связываю в основание для действия.',en:'I connect the goal, broader purpose, and principles into a basis for action.',uk:'Ціль, ширший задум і принципи я поєдную в основу для дії.'},
    3:{ru:'Я считаю цель приемлемой, если она согласуется с принципом, применимым в разных ситуациях.',en:'I consider a goal acceptable when it is consistent with a principle that applies across situations.',uk:'Я вважаю ціль прийнятною, якщо вона узгоджується з принципом, застосовним у різних ситуаціях.'},
    4:{ru:'Я использую более широкие замыслы и принципы как смысловой контекст выбора.',en:'I use the broader purposes and principles as interpretive context for the choice.',uk:'Я використовую ширші задуми й принципи як смисловий контекст вибору.'}
  }
},
{
  aspect:'Eternity',context:'shared-mission',contextDomain:'team',indicator:2,
  stem:{
    ru:'Команда выбирает одну из двух осуществимых стратегий; известны ближайшая задача, ограничения, последствия и согласованное предназначение проекта.',
    en:'A team is choosing between two feasible strategies; the immediate task, constraints, consequences, and agreed project purpose are known.',
    uk:'Команда обирає одну з двох здійсненних стратегій; відомі найближче завдання, обмеження, наслідки й узгоджене призначення проєкту.'
  },
  roles:{
    1:{ru:'Общее предназначение задаёт результат, которому должна служить стратегия.',en:'The shared purpose defines the outcome that the strategy should serve.',uk:'Спільне призначення задає результат, якому має служити стратегія.'},
    2:{ru:'Предназначение, ближайшую задачу и последствия я соединяю в структуру стратегии.',en:'I combine the purpose, immediate task, and consequences into the structure of the strategy.',uk:'Призначення, найближче завдання й наслідки я поєдную в структуру стратегії.'},
    3:{ru:'Для меня стратегия приемлема, когда её результат соответствует общему предназначению.',en:'For me, a strategy is acceptable when its outcome is consistent with the shared purpose.',uk:'Для мене стратегія прийнятна, коли її результат відповідає спільному призначенню.'},
    4:{ru:'Я использую предназначение проекта как общий контекст разработки стратегии.',en:'I use the project purpose as shared context for developing the strategy.',uk:'Я використовую призначення проєкту як спільний контекст розроблення стратегії.'}
  }
},
{
  aspect:'Eternity',context:'meaning-conflict',contextDomain:'change',indicator:3,
  stem:{
    ru:'Два осуществимых решения соответствуют разным трактовкам предназначения проекта; известны текущие ограничения и практические последствия обоих.',
    en:'Two feasible decisions correspond to different interpretations of the project purpose; the current constraints and practical consequences of both are known.',
    uk:'Два здійсненні рішення відповідають різним трактуванням призначення проєкту; відомі поточні обмеження й практичні наслідки обох.'
  },
  roles:{
    1:{ru:'Трактовка того, чему должен служить проект, задаёт желаемый результат.',en:'The interpretation of what the project should serve defines the desired outcome.',uk:'Трактування того, чому має служити проєкт, задає бажаний результат.'},
    2:{ru:'Соотношение двух трактовок я преобразую в формулировку решения.',en:'I transform the relationship between the two interpretations into a formulation for the decision.',uk:'Співвідношення двох трактувань я перетворюю на формулювання рішення.'},
    3:{ru:'Принятая трактовка предназначения определяет, какое решение я считаю приемлемым.',en:'The adopted interpretation of the purpose determines which decision I consider acceptable.',uk:'Прийняте трактування призначення визначає, яке рішення я вважаю прийнятним.'},
    4:{ru:'Я использую обе трактовки предназначения как контекст текущего решения.',en:'I use both interpretations of the purpose as context for the current decision.',uk:'Я використовую обидва трактування призначення як контекст поточного рішення.'}
  }
}];
TEMP_MATCHED_VIGNETTES.forEach(vignette=>Object.entries(vignette.roles).forEach(([position,role])=>{
  const target=tempItems.find(candidate=>candidate.aspect===vignette.aspect&&candidate.context===vignette.context&&candidate.position===Number(position));
  if(!target)return;
  target.text=Object.fromEntries(['ru','en','uk'].map(lang=>[lang,`${vignette.stem[lang]} ${role[lang]}`]));
  target.version='3.0';
  target.responseMode='matched-vignette';
  target.tetradId=`${vignette.aspect.toLowerCase()}-${vignette.context}-v1`;
  target.contextDomain=vignette.contextDomain;
  target.indicator=vignette.indicator;
}));
let TESTS={
socionics:{version:'socionics-exploratory-v0.5',mode:'socionics',calibrationStatus:'exploratory',labels:{ru:['Информация и общение','Исследовательский профиль восьми способов воспринимать и передавать информацию; код типа до калибровки не выводится'],en:['Information and communication','An exploratory profile of eight ways of perceiving and sharing information; no type code is reported before calibration'],uk:['Інформація і спілкування','Дослідницький профіль восьми способів сприймати й передавати інформацію; код типу до калібрації не виводиться']},dims:['Ti','Te','Fi','Fe','Si','Se','Ni','Ne'],items:[...socItems,{id:'soc_ac_1',scale:'attention',attention:2,version:'1.2',text:{ru:'Проверка внимательности: выберите вариант 2.',en:'Attention check: choose option 2.',uk:'Перевірка уважності: оберіть варіант 2.'}}]},
psychosophy:{version:'psychosophy-pilot-v0.6',mode:'position',calibrationStatus:'precalibration',measurementModel:POSITION_MODEL,minCellItems:POSITION_MIN_CELL_ITEMS,labels:{ru:['Энергия и действие','Как Воля, Логика, Эмоция и Физика участвуют в выборе как цель, материал решения, критерий или ресурс'],en:['Energy and action','How Will, Logic, Emotion, and Physics enter a choice as target, material, criterion, or resource'],uk:['Енергія і дія','Як Воля, Логіка, Емоція та Фізика беруть участь у виборі як ціль, матеріал рішення, критерій або ресурс']},aspects:PSY.aspects,code:PSY.code,items:[...psychItems,{id:'psy_ac_1',scale:'attention',attention:2,version:'2.0',text:{ru:'Проверка внимательности: выберите вариант 2.',en:'Attention check: choose option 2.',uk:'Перевірка уважності: оберіть варіант 2.'}}]},
temporistics:{version:'temporistics-pilot-v0.6',mode:'position',calibrationStatus:'precalibration',measurementModel:POSITION_MODEL,minCellItems:POSITION_MIN_CELL_ITEMS,labels:{ru:['Время и направление','Как прошлое, настоящее, будущее и большой смысл участвуют в выборе как цель, материал решения, критерий или ресурс'],en:['Time and direction','How past, present, future, and larger meaning enter a choice as target, material, criterion, or resource'],uk:['Час і напрям','Як минуле, теперішнє, майбутнє й великий сенс беруть участь у виборі як ціль, матеріал рішення, критерій або ресурс']},aspects:TMP.aspects,code:TMP.code,items:[...tempItems,{id:'tmp_ac_1',scale:'attention',attention:2,version:'2.0',text:{ru:'Проверка внимательности: выберите вариант 2.',en:'Attention check: choose option 2.',uk:'Перевірка уважності: оберіть варіант 2.'}}]}
};
const testAudience=(typeof document!=='undefined'&&document.body?.dataset?.testAudience)?document.body.dataset.testAudience:'people';
let currentLang=localStorage.getItem('before-we-build-lang')||'uk',activeTest='temporistics',sessionId=crypto.randomUUID(),deviceId=testAudience==='research'?(localStorage.getItem('before-we-build-device-id')||sessionId):sessionId,startedAt=Date.now(),shownAt={},answered={},changed={},answerTiming={},selectedAnswers={},questionBankVersion=BUNDLED_BANK_VERSION,publicStarted=false,publicSaveLocal=false,publicMode='classic',publicAgeBand='',publicStep=0,publicTestKeys=['psychosophy'],publicOrderSeed=sessionId,lastPublicPayload=null,lastResearchPayload=null,publicPrefs={largeText:false,highContrast:false,reduceMotion:false,noAutoscroll:false};
function ensureResearchDeviceId(){if(testAudience!=='research')return;const stored=localStorage.getItem('before-we-build-device-id');deviceId=stored||crypto.randomUUID();if(!stored)localStorage.setItem('before-we-build-device-id',deviceId)}
function seedNumber(seed=''){let h=2166136261;for(const char of String(seed)){h^=char.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function shuffle(arr,seed){const out=[...arr];let state=seedNumber(seed)||0x9e3779b9;for(let i=out.length-1;i>0;i--){state+=0x6d2b79f5;let x=state;x=Math.imul(x^x>>>15,x|1);x^=x+Math.imul(x^x>>>7,x|61);const random=((x^x>>>14)>>>0)/4294967296,j=Math.floor(random*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
const val=id=>document.querySelector(id)?.value||'';
async function hash(s){if(!s)return'';const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s.trim().toLowerCase()));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function applyLanguage(lang){currentLang=I18N[lang]?lang:'uk';if(document.documentElement)document.documentElement.lang=currentLang;localStorage.setItem('before-we-build-lang',currentLang);document.querySelectorAll('[data-i18n]').forEach(el=>{const v=I18N[currentLang][el.dataset.i18n];if(v)el.textContent=v});document.querySelectorAll('[data-lang]').forEach(b=>{const active=b.dataset.lang===currentLang;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});renderTests()}
function resetAnswerState(){shownAt={};answered={};changed={};answerTiming={};selectedAnswers={}}
function recordAnswer(input){const id=input.name,now=Date.now();selectedAnswers[id]=String(input.value);if(answered[id])changed[id]=true;else{answered[id]=true;answerTiming[id]={firstAt:now,lastAt:now,responseTimeMs:Math.max(0,now-(shownAt[id]||startedAt))}}if(answerTiming[id])answerTiming[id].lastAt=now}
function responseTiming(id){const shown=shownAt[id]||startedAt,now=Date.now(),timing=answerTiming[id],first=timing?.firstAt||now,last=timing?.lastAt||first;return{shownAt:new Date(shown).toISOString(),firstAnsweredAt:new Date(first).toISOString(),answeredAt:new Date(last).toISOString(),responseTimeMs:timing?.responseTimeMs??Math.max(0,first-shown),lastResponseTimeMs:Math.max(0,last-shown)}}
function wordCount(text=''){return(String(text).trim().match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)||[]).length}
function minimumCompletionTimeMs(contentItemCount=0){return Math.max(30000,Math.max(0,Number(contentItemCount)||0)*1800)}
function isCompletionTooFast(durationMs,contentItemCount){return Number(durationMs)<minimumCompletionTimeMs(contentItemCount)}
function itemFastThresholdMs(promptWordCount=0){return Math.min(3200,Math.max(1200,900+Math.max(0,Number(promptWordCount)||0)*70))}
function collect(){
  const test=TESTS[activeTest],byId=Object.fromEntries(test.items.map(it=>[it.id,it])),scores={},counts={},responses=[];let missing=false,failedAttention=false,attentionPresented=false;
  document.querySelectorAll('[data-test-item]').forEach(el=>{
    el.classList.remove('missing-answer');const it=byId[el.dataset.testItem],checked=document.querySelector(`input[name="${it.id}"]:checked`);
    if(!it)return;
    if(!checked){missing=true;el.classList.add('missing-answer');return}
    const notApplicable=checked.value==='na',raw=notApplicable?null:Number(checked.value),value=notApplicable?null:(it.reverse?6-raw:raw);
    if(it.attention){attentionPresented=true;if(raw!==it.attention)failedAttention=true}else if(!notApplicable){scores[it.scale]=(scores[it.scale]||0)+value;counts[it.scale]=(counts[it.scale]||0)+1}
    responses.push({itemId:it.id,itemVersion:it.version,scale:it.scale,attentionExpected:it.attention||null,responseValue:raw,scoredValue:value,notApplicable,testKey:activeTest,promptWordCount:wordCount(it.text[currentLang]||it.text.ru||it.text.en),displayIndex:Number(el.dataset.displayIndex||0),...responseTiming(it.id),changedAnswer:!!changed[it.id]});
  });
  return{scores,counts,responses,missing,failedAttention,attentionPresented}
}
function rowsFor(test,calc){const dims=test.dims||[...new Set(test.items.filter(i=>!i.attention).map(i=>i.scale))];return dims.map(k=>[k,calc.counts[k]?calc.scores[k]/calc.counts[k]:0]).sort((a,b)=>b[1]-a[1])}
function profileGap(vals=[]){return(vals[0]?.raw??vals[0]?.[1]??0)-(vals[1]?.raw??vals[1]?.[1]??0)}
function profileDefined(vals=[]){if(typeof vals[0]?.defined==='boolean')return vals[0].defined;return profileGap(vals)>=.0001}
function profileSignal(vals=[]){if(typeof vals[0]?.signal==='number')return vals[0].signal;return Math.min(1,Math.max(0,profileGap(vals)/.8))}
function typeLabel(candidate,testKey=activeTest){if(candidate?.code)return candidate.code;if(testKey==='psychosophy'&&currentLang==='en')return candidate?.en||candidate?.display||'?';return candidate?.display||candidate?.en||'?'}
function positionEvidenceText(top=[]){const evidence=top[0]?.evidence;if(!evidence)return'';return Object.entries(evidence).map(([aspect,item])=>`${aspect}: ${(item.candidatePositions||[]).join('/')||'—'}`).join(' · ')}
function modelResult(test,top=[]){
  const first=top[0]||{},defined=profileDefined(top),evidence=first.evidence?Object.fromEntries(Object.entries(first.evidence).map(([aspect,item])=>[aspect,{status:item.status,coverage:item.coverage,bestPosition:item.bestPosition,candidatePositions:item.candidatePositions,spread:item.spread,topGap:item.topGap,cells:item.cells.map(cell=>({position:cell.position,count:cell.count,expected:cell.expected,mean:cell.mean,contrastToAspectMean:cell.contrastToAspectMean}))}])):undefined;
  return{model:test.measurementModel||(test.mode==='socionics'?'socionics-element-profile-v1':'legacy-position-v1'),calibrationStatus:test.calibrationStatus||first.calibrationStatus||'unspecified',defined,signal:profileSignal(top),typeGap:defined?profileGap(top):null,candidates:defined?top.map(candidate=>({code:candidate.code,display:candidate.display,en:candidate.en,contrastScore:candidate.raw})):[],...(first.dimensionProfile?{dimensions:first.dimensionProfile}:{}),...(first.withheldReason?{withheldReason:first.withheldReason}:{}),...(evidence?{evidence}:{})}
}
function clarity(vals,responses){const content=responses.filter(r=>!r.attentionExpected&&!r.notApplicable),neutral=content.filter(r=>r.responseValue===3).length/(content.length||1),straight=content.length>=8&&new Set(content.map(r=>r.responseValue)).size===1;if(straight||neutral>.45||!profileDefined(vals))return'low';if(neutral>.25||profileSignal(vals)<.7)return'moderate';return'high'}
function withholdTop(top=[],reason='response-quality'){return top.map(({evidence,...candidate})=>({...candidate,defined:false,signal:0,withheldReason:reason}))}
function responseQualityLevel(flags={}){if(flags.failedAttentionCheck||flags.straightlining||flags.tooFast)return'low';if(flags.neutralOveruse||flags.fastItems||flags.notApplicableOveruse)return'review';return'adequate'}
function socionics(calc){const vals=Object.fromEntries(TESTS.socionics.dims.map(d=>[d,calc.counts[d]?calc.scores[d]/calc.counts[d]:0])),w=[1,.8,.45,.45];return TIMS.map(([code,mbti,names,aspects])=>{const p=Object.fromEntries(TESTS.socionics.dims.map(d=>[d,.12]));aspects.forEach((a,i)=>p[a]=w[i]);return{code,mbti,name:names[currentLang],raw:TESTS.socionics.dims.reduce((s,a)=>s+vals[a]*p[a],0),defined:false,signal:0,calibrationStatus:'exploratory',dimensionProfile:vals,withheldReason:'uncalibrated-type-model'}}).sort((a,b)=>b.raw-a.raw).slice(0,3)}
function permutations(a){if(a.length===1)return[a];return a.flatMap((x,i)=>permutations(a.filter((_,j)=>j!==i)).map(p=>[x,...p]))}
function positionTypes(test,calc){
  const code=x=>test.code[x]||test.code[currentLang]?.[x]||test.code.en?.[x]||x,psyEn={Воля:'V',Логика:'L',Эмоция:'E',Физика:'F'},minItems=test.minCellItems||POSITION_MIN_CELL_ITEMS;
  const evidence=Object.fromEntries(test.aspects.map(aspect=>{
    const baseCells=[1,2,3,4].map(position=>{const key=`${aspect}|${position}`,count=calc.counts[key]||0,expected=test.items.filter(item=>!item.attention&&item.scale===key).length,mean=count?(calc.scores[key]||0)/count:3;return{position,key,count,expected,mean}}),aspectMean=baseCells.reduce((sum,cell)=>sum+cell.mean,0)/baseCells.length,cells=baseCells.map(cell=>({...cell,contrastToAspectMean:(cell.mean-aspectMean)/4})),rankedCells=[...cells].sort((a,b)=>b.mean-a.mean),spread=(rankedCells[0].mean-rankedCells[3].mean)/4,topGap=(rankedCells[0].mean-rankedCells[1].mean)/4,coverage=cells.every(cell=>cell.expected>=minItems&&cell.count===cell.expected),status=!coverage?'incomplete':topGap+POSITION_EPSILON<POSITION_MIN_ASPECT_GAP?(spread<=POSITION_EPSILON?'flat':'close'):'clear';
    return[aspect,{cells,spread,topGap,coverage,status,bestPosition:rankedCells[0].position,candidatePositions:rankedCells.filter(cell=>(rankedCells[0].mean-cell.mean)/4+POSITION_EPSILON<POSITION_MIN_ASPECT_GAP).map(cell=>cell.position)}];
  }));
  const ranked=permutations(test.aspects).map(order=>{const selected=order.map((aspect,index)=>evidence[aspect].cells[index]),assignedByAspect=Object.fromEntries(order.map((aspect,index)=>[aspect,index+1])),raw=selected.reduce((sum,cell)=>sum+cell.contrastToAspectMean,0)/selected.length,display=order.map(code).join(test.aspects.includes('Past')&&currentLang==='uk'?'-':''),en=test.aspects.includes('Past')?order.map(aspect=>test.code.en[aspect]).join(''):(test.aspects.includes('Воля')?order.map(aspect=>psyEn[aspect]).join(''):display);return{display,en,positions:order.map((aspect,index)=>`${index+1}${test.aspects.includes('Past')?test.code.en[aspect]:(test.code[aspect]||aspect)}`),raw,model:'position-contrast-v3',assignedByAspect}}).sort((a,b)=>b.raw-a.raw);
  const typeGap=(ranked[0]?.raw||0)-(ranked[1]?.raw||0),ambiguousAspects=test.aspects.filter(aspect=>evidence[aspect].status!=='clear'),coverageComplete=test.aspects.every(aspect=>evidence[aspect].coverage),bestPositions=test.aspects.map(aspect=>evidence[aspect].bestPosition),uniqueBestPositions=new Set(bestPositions).size===test.aspects.length,topMatchesLocalWinners=test.aspects.every(aspect=>ranked[0]?.assignedByAspect[aspect]===evidence[aspect].bestPosition),minLocalGap=Math.min(...test.aspects.map(aspect=>evidence[aspect].topGap)),defined=coverageComplete&&!ambiguousAspects.length&&uniqueBestPositions&&topMatchesLocalWinners,signal=defined?Math.min(1,minLocalGap/.4):0;
  return ranked.slice(0,3).map(candidate=>({...candidate,defined,signal,typeGap,minLocalGap,ambiguousAspects,coverageComplete,evidence,calibrationStatus:test.calibrationStatus||'precalibration'}));
}
const WIKI_BASE='https://github.com/before-we-build/before-we-build-research/blob/main/wiki/';
const QUESTION_BANK_URL='https://raw.githubusercontent.com/before-we-build/before-we-build-research/main/instruments/pilot-question-bank.md';
async function fetchWithTimeout(url,options={},timeoutMs=5000){if(typeof AbortController==='undefined')return fetch(url,options);const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);try{return await fetch(url,{...options,signal:controller.signal})}finally{clearTimeout(timer)}}
function validLabels(labels){return['ru','en','uk'].every(lang=>Array.isArray(labels?.[lang])&&labels[lang].length>=2&&labels[lang].every(value=>typeof value==='string'&&value.trim()))}
function validItem(item,{position=false}={}){
  const expectedRole={1:'target',2:'creative',3:'criterion',4:'resource'}[item?.position];
  return!!item&&/^[A-Za-z0-9_-]+$/.test(item.id||'')&&typeof item.scale==='string'&&!!item.version&&['ru','en','uk'].every(lang=>typeof item.text?.[lang]==='string'&&item.text[lang].trim())&&(item.attention?Number.isInteger(item.attention):typeof item.reverse==='boolean')&&(!position||item.attention||item.indicator!==undefined&&item.indicator!==null&&typeof item.context==='string'&&item.context&&typeof item.aspect==='string'&&Number.isInteger(item.position)&&item.position>=1&&item.position<=4&&item.positionRole===expectedRole&&item.responseMode==='matched-vignette'&&typeof item.tetradId==='string'&&item.tetradId&&typeof item.contextDomain==='string'&&item.contextDomain)
}
function hasAspectCode(test,aspect){return typeof test.code?.[aspect]==='string'||Object.values(test.code||{}).some(value=>value&&typeof value==='object'&&typeof value[aspect]==='string')}
function firstStimulus(text=''){const value=String(text).trim(),stop=value.indexOf('.');return stop<0?value:value.slice(0,stop+1)}
function validPositionTest(test){
  if(test?.mode!=='position'||test.measurementModel!==POSITION_MODEL||!validLabels(test.labels)||!Array.isArray(test.aspects)||test.aspects.length!==4||new Set(test.aspects).size!==4||!test.aspects.every(aspect=>typeof aspect==='string'&&hasAspectCode(test,aspect))||!Array.isArray(test.items))return false;
  const items=test.items.filter(item=>!item.attention),minItems=Math.max(POSITION_MIN_CELL_ITEMS,Number(test.minCellItems)||0);
  if(items.length<test.aspects.length*4*minItems||new Set(test.items.map(item=>item.id)).size!==test.items.length||!test.items.every(item=>validItem(item,{position:true})))return false;
  return test.aspects.every(aspect=>{
    const aspectItems=items.filter(item=>item.aspect===aspect),indicators=[...new Set(aspectItems.map(item=>item.indicator))];
    if(indicators.length<minItems||![1,2,3,4].every(position=>{const cell=aspectItems.filter(item=>item.position===position&&item.scale===`${aspect}|${position}`);return cell.length===indicators.length&&new Set(cell.map(item=>item.indicator)).size===indicators.length}))return false;
    return indicators.every(indicator=>{const quartet=aspectItems.filter(item=>item.indicator===indicator);return quartet.length===4&&new Set(quartet.map(item=>item.position)).size===4&&new Set(quartet.map(item=>item.context)).size===1&&new Set(quartet.map(item=>item.facet)).size===1&&new Set(quartet.map(item=>item.tetradId)).size===1&&['ru','en','uk'].every(lang=>new Set(quartet.map(item=>firstStimulus(item.text[lang]))).size===1)});
  });
}
function validSocionicsTest(test){return test?.mode==='socionics'&&validLabels(test.labels)&&Array.isArray(test.dims)&&test.dims.length>0&&new Set(test.dims).size===test.dims.length&&Array.isArray(test.items)&&test.items.length>0&&new Set(test.items.map(item=>item.id)).size===test.items.length&&test.items.every(item=>validItem(item)&&(!item.attention?test.dims.includes(item.scale):true))}
function isQuestionBank(bank){
  if(bank?.schemaVersion!=='1.0.0'||!bank.tests||!validSocionicsTest(bank.tests.socionics)||!validPositionTest(bank.tests.psychosophy)||!validPositionTest(bank.tests.temporistics))return false;
  const allIds=Object.values(bank.tests).flatMap(test=>test.items.map(item=>item.id));
  return new Set(allIds).size===allIds.length;
}
function parseQuestionBank(markdown){const match=markdown.match(/~~~question-bank\s*([\s\S]*?)\s*~~~/);if(!match)throw new Error('Question bank block is missing');return JSON.parse(match[1])}
async function loadQuestionBank(){try{const response=await fetchWithTimeout(QUESTION_BANK_URL,{cache:'no-store'});if(!response.ok)throw new Error(`Question bank request failed: ${response.status}`);const bank=parseQuestionBank(await response.text());if(!isQuestionBank(bank))throw new Error('Question bank does not provide the required multi-indicator position model');if(publicStarted||Object.keys(answered).length){console.warn('A remote question bank became available after answering started; keeping the locked bundled bank for this session.');return}TESTS=bank.tests;questionBankVersion=bank.bankVersion||'remote-unversioned'}catch(error){console.warn('Using the bundled test fallback because the research question bank could not be loaded.',error)}if(typeof window!=='undefined')window.beforeWeBuildQuestionBankVersion=questionBankVersion}
const langSuffix=()=>currentLang==='en'?'':`-${currentLang}`;
const wikiConcept=slug=>`${WIKI_BASE}concepts/${slug}${langSuffix()}.md`;
const wikiEntity=slug=>`${WIKI_BASE}entities/${slug}.md`;
const wikiEntityLang=slug=>`${WIKI_BASE}entities/${slug}${langSuffix()}.md`;
const MUSIC_GUIDE_URL=()=>`https://raw.githubusercontent.com/before-we-build/before-we-build-research/main/wiki/concepts/music-styles-and-psychosophy-emotion${langSuffix()}.md`;
const MUSIC_COPY={ru:{title:'Музыка для пробы',note:'Это не предсказание вашего вкуса и не доказательство позиции Эмоции: важнее, какую роль музыка играет именно для вас.',more:'Как читать эту музыкальную гипотезу'},en:{title:'Music to explore',note:'This is not a prediction of your taste or proof of an Emotion position. What matters more is the role music plays for you.',more:'How to read this music hypothesis'},uk:{title:'Музика для спроби',note:'Це не передбачення вашого смаку й не доказ позиції Емоції: важливіше, яку роль музика відіграє саме для вас.',more:'Як читати цю музичну гіпотезу'}};
const musicGuideCache={};
async function musicGenresFor(position){
  const key=`${currentLang}:${position}`;
  if(key in musicGuideCache)return musicGuideCache[key];
  try{const response=await fetchWithTimeout(MUSIC_GUIDE_URL(),{cache:'no-store'},3000);if(!response.ok)throw new Error(`Music guide request failed: ${response.status}`);const markdown=await response.text(),section=markdown.match(new RegExp(`^### ${position}[EЭЕ][^\\n]*\\n([\\s\\S]*?)(?=^### |^## |$)`,'m'))?.[1],genres=[...(section||'').matchAll(/^- (.+)$/gm)].map(([,item])=>item.trim()).filter(Boolean).slice(0,8);if(!genres.length)throw new Error('Music guide section is missing');return musicGuideCache[key]=genres}catch(error){console.warn('Music recommendations are unavailable because the research guide could not be loaded.',error);return musicGuideCache[key]=[]}
}
async function musicRecommendation(top=[],testKey=activeTest){
  if(testKey!=='psychosophy')return'';
  if(!profileDefined(top))return'';
  const emotionPosition=(top[0]?.en||'').indexOf('E')+1,genres=await musicGenresFor(emotionPosition),copy=MUSIC_COPY[currentLang];
  if(!genres.length||!copy)return'';
  return`<div class="result-reading music-recommendation"><h4>${copy.title}</h4><p><b>${genres.join(', ')}</b></p><p class="test-caveat">${copy.note}</p><div class="result-links"><a href="${wikiConcept('music-styles-and-psychosophy-emotion')}" target="_blank" rel="noopener">${copy.more}</a></div></div>`;
}
const SOC_PAGES={ILE:'ile-intuitive-logical-extrovert',SEI:'sei-sensory-ethical-introvert',ESE:'ese-ethical-sensory-extrovert',LII:'lii-logical-intuitive-introvert',EIE:'eie-ethical-intuitive-extrovert',LSI:'lsi-logical-sensory-introvert',SLE:'sle-sensory-logical-extrovert',IEI:'iei-intuitive-ethical-introvert',SEE:'see-sensory-ethical-extrovert',ILI:'ili-intuitive-logical-introvert',LIE:'lie-logical-intuitive-extrovert',ESI:'esi-ethical-sensory-introvert',LSE:'lse-logical-sensory-extrovert',EII:'eii-ethical-intuitive-introvert',IEE:'iee-intuitive-ethical-extrovert',SLI:'sli-sensory-logical-introvert'};
function resultLinks(top=[]){const d=I18N[currentLang],system={socionics:'socionics-overview',psychosophy:'psychosophy-overview',temporistics:'temporistics-overview'}[activeTest],note={socionics:d.levelNoteSoc,psychosophy:d.levelNotePsy,temporistics:d.levelNoteTmp}[activeTest],typeLinks=!profileDefined(top)?'':top.map(t=>{const code=t.code||t.en||t.display,slug=activeTest==='socionics'?SOC_PAGES[t.code]:`${activeTest}-type-${(t.en||t.display).toLowerCase()}`;return`<a href="${wikiEntityLang(slug)}" target="_blank" rel="noopener">${d.readType}: ${code}</a>`}).join('');return`<div class="result-reading"><h4>${d.insideModel}</h4><p class="test-caveat">${note} ${d.insideCaveat}</p><h4>${d.readNext}</h4><div class="result-links"><a href="${wikiConcept('test-result-reading-guide')}" target="_blank" rel="noopener">${d.readGuide}</a><a href="${wikiConcept('compatibility-level-boundaries')}" target="_blank" rel="noopener">${d.readBoundaries}</a><a href="${wikiEntityLang(system)}" target="_blank" rel="noopener">${d.readSystem}</a>${typeLinks}</div></div>`}
function qualityFlagsForResponses(responses=[],durationMs=0,{attentionPresented=false,failedAttention=false}={}){
  const content=responses.filter(response=>!response.attentionExpected),scorable=content.filter(response=>!response.notApplicable&&Number.isFinite(response.responseValue)),timed=scorable.filter(response=>Number.isFinite(response.responseTimeMs)),activeResponseTimeMs=timed.reduce((sum,response)=>sum+Math.max(0,response.responseTimeMs),0),activeTooFast=timed.length===scorable.length&&scorable.length>0&&isCompletionTooFast(activeResponseTimeMs,scorable.length),durationTooFast=isCompletionTooFast(durationMs,content.length),groups=Object.groupBy?Object.groupBy(scorable,response=>response.testKey||activeTest):scorable.reduce((out,response)=>{const key=response.testKey||activeTest;(out[key]||=[]).push(response);return out},{}),straightlinedBlocks=Object.entries(groups).filter(([,items])=>items.length>=8&&new Set(items.map(item=>item.responseValue)).size===1).map(([key])=>key),soft=publicSoftQuality(content);
  const flags={attentionCheckPresented:attentionPresented,failedAttentionCheck:failedAttention,straightlining:straightlinedBlocks.length>0,straightlinedBlocks,tooFast:durationTooFast||activeTooFast,durationTooFast,activeTooFast,activeResponseTimeMs,...soft};
  return{...flags,responseQuality:responseQualityLevel(flags)}
}
async function buildPayload(calc,rows,summary,top=[],completedAt=Date.now()){
  const durationMs=completedAt-startedAt,qualityFlags=qualityFlagsForResponses(calc.responses,durationMs,{attentionPresented:calc.attentionPresented,failedAttention:calc.failedAttention});
  return{...STUDY,instrumentVersion:TESTS[activeTest].version,questionBankVersion,measurementModel:TESTS[activeTest].measurementModel||'legacy-aspect-v1',responseId:crypto.randomUUID(),sessionId,deviceRespondentId:deviceId,retestTokenHash:await hash(val('#retestToken')),randomization:{seed:`${deviceId}:${sessionId}`,itemOrder:calc.responses.map(r=>r.itemId)},timing:{startedAt:new Date(startedAt).toISOString(),completedAt:new Date(completedAt).toISOString(),totalDurationMs:durationMs,minimumCompletionTimeMs:minimumCompletionTimeMs(calc.responses.filter(response=>!response.attentionExpected).length)},metadata:{language:currentLang,ageBand:val('#ageBand'),priorTypologyExposure:val('#exposure'),selfReportedType:val('#selfType'),viewport:{w:innerWidth,h:innerHeight},timezone:Intl.DateTimeFormat().resolvedOptions().timeZone},responses:calc.responses,scaleScores:Object.fromEntries(rows),modelResults:modelResult(TESTS[activeTest],top),resultSummary:summary,qualityFlags}
}
async function scoreActiveTest(){
  const d=I18N[currentLang],out=document.querySelector('#testResult'),test=TESTS[activeTest],consent=document.querySelector('#consent')?.checked,calc=collect();
  if(calc.missing||!consent){out.innerHTML=`<div class="test-result"><p class="test-caveat">${d.missing}</p></div>`;return}
  const completedAt=Date.now(),qualityFlags=qualityFlagsForResponses(calc.responses,completedAt-startedAt,{attentionPresented:calc.attentionPresented,failedAttention:calc.failedAttention}),rows=rowsFor(test,calc);let main='',summary='',cl='low',top=[],labels=SOC_LABELS[currentLang]||SOC_LABELS.ru;
  if(test.mode==='socionics'){
    top=socionics(calc);cl='low';
    summary=`${test.labels[currentLang][0]}: ${d.publicSocExploratory}.`;
    main=`<h4>${d.topTIM}</h4><div class="tim-list"><div class="tim-card"><b>${d.publicSocExploratory}</b></div></div>${resultLinks(top)}<h4>${d.aspectTrace}</h4>`;
  }else{
    top=positionTypes(test,calc);if(qualityFlags.responseQuality==='low')top=withholdTop(top,calc.failedAttention?'failed-attention-check':'response-quality');const max=Math.max(top[0].raw,.0001),isUndefined=!profileDefined(top),evidenceText=positionEvidenceText(top);cl=clarity(top,calc.responses);
    summary=`${d.topType}: ${isUndefined?d.undefinedProfile:top.map(t=>typeLabel(t)+(activeTest==='temporistics'&&currentLang!=='en'?` (${t.en})`:'')).join(', ')}. ${d.clarity}: ${d[cl]}.`;
    const music=await musicRecommendation(top),withheldLabel=qualityFlags.responseQuality==='low'?(calc.failedAttention?d.publicAttentionWithheld:d.publicQualityNote):d.undefinedProfile,typeCardsHtml=isUndefined?`<div class="tim-card"><b>${withheldLabel}</b>${evidenceText?`<small>${evidenceText}</small>`:''}</div>`:top.map((t,i)=>`<div class="tim-card"><b>${i+1}. ${typeLabel(t)}${activeTest==='temporistics'&&currentLang!=='en'?` · ${t.en}`:''}</b><small>${t.positions.join(' · ')}</small><span class="bar-track"><span class="bar-fill" style="width:${Math.round(Math.max(0,t.raw)/max*100)}%"></span></span></div>`).join('');
    main=`<h4>${d.topType}</h4><div class="tim-list">${typeCardsHtml}</div>${resultLinks(top)}${music}<h4>${d.scaleTrace}</h4>`;
  }
  const payload=await buildPayload(calc,rows,summary,top,completedAt);lastResearchPayload=payload;
  out.innerHTML=`<div class="test-result">${main}<p><b>${d.clarity}:</b> ${d[cl]}</p><div class="result-bars">${rows.map(([k,v])=>`<div class="result-row"><b>${labels[k]||k.replace('|','')}</b><span class="bar-track"><span class="bar-fill" style="width:${Math.round(v/5*100)}%"></span></span><em>${v.toFixed(1)}</em></div>`).join('')}</div><p class="test-caveat">${test.mode==='socionics'?d.caveatSoc:d.caveatPosition}</p><div class="test-actions"><button data-export>${d.export}</button><button data-copy>${d.copy}</button></div></div>`;
  out.querySelector('[data-export]').onclick=()=>download(payload);out.querySelector('[data-copy]').onclick=()=>navigator.clipboard?.writeText(summary);
}
function download(payload){const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`before-we-build-${activeTest}-${payload.responseId}.json`;a.click();URL.revokeObjectURL(a.href)}


const cardObserver = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.dataset.testItem;
      if (id && !shownAt[id]) shownAt[id] = Date.now();
    }
  });
}, { threshold: 0.2 }) : null;
function observeTestCards() {
  if (!cardObserver) return;
  cardObserver.disconnect();
  document.querySelectorAll('.test-item, .story-test-card, .public-classic-item').forEach(el => cardObserver.observe(el));
}

function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function gameKind(it,i){if(it.attention)return'attention';return['backpack','mine','bridge','compass','phrase'][i%5]}
function gameCopy(kind,lang){const ru={backpack:{title:'Брось это в рюкзак?',hint:'Представь, что это твой обычный способ действовать. Куда положишь?',labels:['Оставить','Сомневаюсь','В запас','Беру','Главный карман']},mine:{title:'Это мина или мелочь?',hint:'Если это появляется в жизни, насколько быстро ты это замечаешь?',labels:['Не мина','Едва','Средне','Опасно','Сразу обезвредить']},bridge:{title:'Доска для моста',hint:'Помогает ли этот ход перебраться через сложную ситуацию?',labels:['Не ставлю','Редко','Иногда','Ставлю','Первая доска']},compass:{title:'Куда повернуть компас?',hint:'Насколько эта фраза похожа на твоё внутреннее направление?',labels:['Мимо','Чуть-чуть','Зависит','Близко','Точно туда']},phrase:{title:'Оставить как свою фразу?',hint:'Если бы это было написано на карточке про тебя — что сделал(а) бы?',labels:['Стереть','На край','Оставить','Подчеркнуть','Повесить наверх']},attention:{title:'Проверка внимания',hint:'Здесь нужно выбрать второй вариант.',labels:['1','2','3','4','5']}};const en={backpack:{title:'Put it in your backpack?',hint:'If this were your usual move, where would you place it?',labels:['Leave it','Unsure','Backup','Take it','Main pocket']},mine:{title:'Mine or nothing?',hint:'If this appears in life, how quickly do you notice it?',labels:['No mine','Barely','Medium','Risky','Defuse first']},bridge:{title:'A bridge plank',hint:'Does this move help you cross a difficult situation?',labels:['No','Rarely','Sometimes','Yes','First plank']},compass:{title:'Turn the compass',hint:'How close is this phrase to your inner direction?',labels:['Off','A little','Depends','Close','Exactly']},phrase:{title:'Keep as your phrase?',hint:'If this were a card about you, what would you do?',labels:['Erase','Edge','Keep','Underline','Pin on top']},attention:{title:'Attention check',hint:'Choose the second option here.',labels:['1','2','3','4','5']}};const uk={backpack:{title:'Кинути це в рюкзак?',hint:'Уявіть, що це ваш звичний хід. Куди покладете?',labels:['Залишити','Сумніваюсь','У запас','Беру','Головна кишеня']},mine:{title:'Міна чи дрібниця?',hint:'Якщо це зʼявляється в житті, наскільки швидко ви це помічаєте?',labels:['Не міна','Ледь','Середньо','Небезпечно','Знешкодити першим']},bridge:{title:'Дошка для мосту',hint:'Чи допомагає цей хід перейти складну ситуацію?',labels:['Не ставлю','Рідко','Іноді','Ставлю','Перша дошка']},compass:{title:'Куди повернути компас?',hint:'Наскільки ця фраза схожа на ваш внутрішній напрям?',labels:['Повз','Трохи','Залежить','Близько','Саме туди']},phrase:{title:'Залишити як свою фразу?',hint:'Якби це була картка про вас — що зробили б?',labels:['Стерти','На край','Залишити','Підкреслити','Нагору']},attention:{title:'Перевірка уваги',hint:'Тут потрібно вибрати другий варіант.',labels:['1','2','3','4','5']}};return({ru,en,uk}[lang]||ru)[kind]}
function scenePrompt(it){
  const raw=it.text[currentLang]||it.text.ru||it.text.en;
  if(it.attention)return{scene:raw,hint:gameCopy('attention',currentLang).hint};
  return{scene:raw,hint:`${I18N[currentLang].publicWhyQuestion} ${raw}`};
}
function gameIcon(kind,v){const icons={backpack:['×','?','🎒','✅','⭐'],mine:['○','·','⚠','💥','🧯'],bridge:['—','▱','▰','▰▰','🌉'],compass:['↙','↘','●','↗','↑'],phrase:['⌫','↙','□','＿','📌'],attention:['1','2','3','4','5']};return(icons[kind]||icons.backpack)[v-1]}
function gameControlClass(kind){return{backpack:'pocket-board',mine:'mine-field',bridge:'bridge-builder',compass:'compass-wheel',phrase:'phrase-board',attention:'attention-board'}[kind]||'pocket-board'}
function renderGameItem(it,i,total){const kind=gameKind(it,i),copy=gameCopy(kind,currentLang),scene=scenePrompt(it),labels=copy.labels,raw=it.text[currentLang]||it.text.ru||it.text.en;return`<article class="test-item story-test-card ${kind} ${i===publicStep?'active-step':''}" data-game="${kind}" data-test-item="${it.id}" data-test-key="${it.testKey||activeTest}" data-display-index="${i+1}"><div class="story-card-top"><span>${i+1}/${total}</span><span>${escapeHtml(copy.title)}</span></div><p class="story-scene">${escapeHtml(scene.scene)}</p><p class="story-hint">${escapeHtml(scene.hint)}</p><details class="story-meaning"><summary>${I18N[currentLang].publicWhyQuestion}</summary><p>${escapeHtml(raw)}</p></details><div class="game-visual" aria-hidden="true"><span></span><span></span><span></span></div><div class="scale game-scale ${gameControlClass(kind)}" role="radiogroup" aria-label="${escapeHtml(raw)}">${[1,2,3,4,5].map(v=>`<label class="game-choice game-choice-${v}"><input type="radio" name="${it.id}" value="${v}" ${selectedAnswers[it.id]===String(v)?'checked':''}><span><i>${gameIcon(kind,v)}</i><em>${escapeHtml(labels[v-1])}</em></span></label>`).join('')}</div><p class="story-feedback" aria-live="polite"></p></article>`}
function updateStoryProgress(){const cards=[...document.querySelectorAll('.story-test-card,.public-classic-item')],done=cards.filter(c=>c.querySelector('input[type="radio"]:checked')).length,total=cards.length,bar=document.querySelector('[data-story-progress-bar]'),count=document.querySelector('[data-story-progress-count]');if(bar)bar.style.width=total?`${Math.round(done/total*100)}%`:'0%';if(count)count.textContent=`${done}/${total}`;document.querySelector('[data-submit]')?.classList.toggle('is-ready',done===total&&total>0)}
function spreadMatchedContexts(items,seed){
  if(!items.length||!items.every(item=>item.tetradId||item.context))return shuffle(items,seed);
  const groups=new Map();
  items.forEach(item=>{const key=item.tetradId||item.context;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item)});
  if(groups.size<2)return shuffle(items,seed);
  for(const[key,group]of groups)groups.set(key,shuffle(group,`${seed}:${key}`));
  const order=shuffle([...groups.keys()],`${seed}:contexts`),out=[];
  while(order.some(key=>groups.get(key).length))order.forEach(key=>{const item=groups.get(key).shift();if(item)out.push(item)});
  return out
}
function constrainedShuffle(items,seed){
  const groupKey=item=>item.aspect||item.scale||item.id,buckets=new Map();
  items.forEach(item=>{const key=groupKey(item);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(item)});
  for(const[key,bucket]of buckets)buckets.set(key,spreadMatchedContexts(bucket,`${seed}:${key}`));
  const out=[],order=shuffle([...buckets.keys()],`${seed}:constructs`);
  while(order.some(key=>buckets.get(key).length))order.forEach(key=>{const item=buckets.get(key).shift();if(item)out.push(item)});
  return out
}
function normalizedPublicTestKeys(keys=publicTestKeys){const valid=[...new Set((Array.isArray(keys)?keys:[]).filter(key=>TESTS[key]))];return valid.length?valid:['psychosophy']}
function publicItems(keys=publicTestKeys){
  const selected=normalizedPublicTestKeys(keys),blockOrder=shuffle(selected,`${publicOrderSeed}:blocks`),blocks=blockOrder.map(testKey=>constrainedShuffle(TESTS[testKey].items.filter(item=>!item.attention).map(item=>({...item,testKey})),`${publicOrderSeed}:${testKey}`));
  blockOrder.forEach((testKey,index)=>{const attention=TESTS[testKey]?.items.find(item=>item.attention);if(attention&&blocks[index])blocks[index].splice(Math.max(1,Math.floor(blocks[index].length/2)),0,{...attention,testKey})});
  return blocks.flat()
}
function publicContentItemCount(keys=publicTestKeys){return normalizedPublicTestKeys(keys).reduce((total,key)=>total+TESTS[key].items.filter(item=>!item.attention).length,0)}
function publicModeForAge(){return'classic'}
function renderPublicAgeSelect(d){const ages=[['under-18',d.publicAgeUnder18],['18-24','18–24'],['25-34','25–34'],['35-44','35–44'],['45-54','45–54'],['55+','55+']];return`<label class="public-age-field"><span>${d.publicAgeOptional}</span><select data-public-age><option value="">${d.none}</option>${ages.map(([value,label])=>`<option value="${value}" ${publicAgeBand===value?'selected':''}>${label}</option>`).join('')}</select></label>`}
function readPublicProgress(){try{const progress=JSON.parse(localStorage.getItem(PUBLIC_PROGRESS_KEY)||'null');if(!progress||progress.questionBankVersion!==questionBankVersion||!normalizedPublicTestKeys(progress.testKeys).length)return null;return progress}catch{return null}}
function savePublicProgress(){if(!publicSaveLocal||!publicStarted)return;localStorage.setItem(PUBLIC_PROGRESS_KEY,JSON.stringify({schemaVersion:1,questionBankVersion,testKeys:publicTestKeys,orderSeed:publicOrderSeed,ageBand:publicAgeBand,step:publicStep,startedAt,selectedAnswers,shownAt,answered,changed,answerTiming}))}
function clearPublicProgress(){localStorage.removeItem(PUBLIC_PROGRESS_KEY)}
function restorePublicProgress(progress){publicTestKeys=normalizedPublicTestKeys(progress.testKeys);publicOrderSeed=progress.orderSeed||sessionId;publicAgeBand=progress.ageBand||'';publicStep=Math.max(0,Number(progress.step)||0);startedAt=Number(progress.startedAt)||Date.now();selectedAnswers=progress.selectedAnswers||{};shownAt=progress.shownAt||{};answered=progress.answered||{};changed=progress.changed||{};answerTiming=progress.answerTiming||{};publicSaveLocal=true;publicMode='classic';publicStarted=true;renderTests()}
function routeStartButton(key,title,text,count){return`<button class="public-route-card" data-public-route="${key}"><b>${escapeHtml(title)} · ${count}</b><small>${escapeHtml(text)}</small></button>`}
function renderPublicStart(d){
  const progress=readPublicProgress(),allCount=publicContentItemCount(Object.keys(TESTS));
  return`<div class="public-start"><div class="public-start-card"><p class="eyebrow">${d.publicStartEyebrow}</p><h2>${d.publicStartTitle}</h2><p>${d.publicStartText}</p>${renderPublicAgeSelect(d)}<label class="consent public-save-progress"><input type="checkbox" data-public-save> ${d.publicSaveProgress}</label><h3>${d.publicRouteTitle}</h3><div class="public-route-grid">${routeStartButton('psychosophy',d.publicRoutePsy,d.publicRoutePsyText,publicContentItemCount(['psychosophy']))}${routeStartButton('temporistics',d.publicRouteTmp,d.publicRouteTmpText,publicContentItemCount(['temporistics']))}${routeStartButton('socionics',d.publicRouteSoc,d.publicRouteSocText,publicContentItemCount(['socionics']))}${routeStartButton('all',d.publicRouteAll,d.publicRouteAllText,allCount)}</div>${progress?`<div class="test-actions"><button class="primary" data-public-resume-progress>${d.publicResumeProgress}</button><button data-public-discard-progress>${d.publicDiscardProgress}</button></div>`:''}</div></div>`
}
function renderClassicPublicItem(it,i,total){const text=it.text[currentLang]||it.text.ru||it.text.en,na=it.attention?'':`<label class="public-na-choice"><input type="radio" name="${it.id}" value="na" ${selectedAnswers[it.id]==='na'?'checked':''}><span>${I18N[currentLang].publicNotApplicable}</span></label><small class="public-na-hint">${I18N[currentLang].publicNotApplicableHint}</small>`;return`<article class="test-item public-classic-item ${i===publicStep?'active-step':''}" data-test-item="${it.id}" data-test-key="${it.testKey}" data-display-index="${i+1}"><p><b>${i+1}/${total}.</b> ${escapeHtml(text)}</p><div class="scale" role="radiogroup" aria-label="${escapeHtml(text)}">${[1,2,3,4,5].map(v=>`<label><input type="radio" name="${it.id}" value="${v}" ${selectedAnswers[it.id]===String(v)?'checked':''}>${v}</label>`).join('')}</div><div class="scale-help"><span>${I18N[currentLang].scaleL}</span><span>${I18N[currentLang].scaleR}</span></div>${na}</article>`}
function shouldReduceMotion(){return true}
function shouldAutoscroll(){return false}
function applyPublicPrefs(){document.body.classList.toggle('public-large-text',!!publicPrefs.largeText);document.body.classList.toggle('public-high-contrast',!!publicPrefs.highContrast);document.body.classList.toggle('public-reduce-motion',!!publicPrefs.reduceMotion)}
function announceSelection(card,label){const fb=card?.querySelector('.story-feedback');if(fb)fb.textContent=label?`${I18N[currentLang].selected}: ${label}`:''}
function collectByTest(testKey){
  const test=TESTS[testKey],scores={},counts={},responses=[];let missing=false,failedAttention=false,attentionPresented=false;
  test.items.forEach(it=>{
    const control=document.querySelector(`input[name="${it.id}"]`),checked=document.querySelector(`input[name="${it.id}"]:checked`),el=document.querySelector(`[data-test-item="${it.id}"]`);
    if(!control)return;
    if(it.attention)attentionPresented=true;
    if(!checked){missing=true;el?.classList.add('missing-answer');return}
    const notApplicable=checked.value==='na',raw=notApplicable?null:Number(checked.value),value=notApplicable?null:(it.reverse?6-raw:raw);
    if(it.attention){if(raw!==it.attention)failedAttention=true}else if(!notApplicable){scores[it.scale]=(scores[it.scale]||0)+value;counts[it.scale]=(counts[it.scale]||0)+1}
    responses.push({itemId:it.id,itemVersion:it.version,scale:it.scale,attentionExpected:it.attention||null,responseValue:raw,scoredValue:value,notApplicable,testKey,promptWordCount:wordCount(it.text[currentLang]||it.text.ru||it.text.en),displayIndex:Number(el?.dataset?.displayIndex||0),...responseTiming(it.id),changedAnswer:!!changed[it.id]});
  });
  return{scores,counts,responses,missing,failedAttention,attentionPresented}
}

function publicConfidence(tech){const classifiable=tech.filter(t=>t.test?.calibrationStatus!=='exploratory');if(!classifiable.length||classifiable.some(t=>!profileDefined(t.top)))return'low';const minSignal=Math.min(...classifiable.map(t=>profileSignal(t.top)));return minSignal>=.7?'high':'moderate'}
function publicMainHypothesis(tech){const d=I18N[currentLang];return tech.map(t=>t.key==='socionics'?`${t.label}: ${d.publicSocExploratory}`:!profileDefined(t.top)?`${t.label}: ${d.undefinedProfile}`:`${t.label}: ${typeLabel(t.top[0],t.key)}`).join(' · ')}
function publicAlternatives(tech){const d=I18N[currentLang];return tech.map(t=>{if(t.key==='socionics'){const dimensions=t.rows.slice(0,4).map(([key,value])=>`${(SOC_LABELS[currentLang]||SOC_LABELS.en)[key]||key}: ${value.toFixed(1)}`).join(' · ');return`<div class="tim-card"><b>${t.label}</b><small>${d.publicSocExploratory}${dimensions?` · ${dimensions}`:''}</small></div>`}if(!profileDefined(t.top)){const evidence=positionEvidenceText(t.top);return`<div class="tim-card"><b>${t.label}</b><small>${d.undefinedProfile}${evidence?` · ${evidence}`:''}</small></div>`}return`<div class="tim-card"><b>${t.label}</b><small>${t.top.slice(1).map(candidate=>typeLabel(candidate,t.key)).join(' · ')}</small></div>`}).join('')}
function publicSoftQuality(responses){
  const content=responses.filter(response=>!response.attentionExpected),scorable=content.filter(response=>!response.notApplicable&&Number.isFinite(response.responseValue)),total=scorable.length||1,neutralRate=scorable.filter(response=>response.responseValue===3).length/total,changedRate=scorable.filter(response=>response.changedAnswer).length/total,fastRate=scorable.filter(response=>response.responseTimeMs<itemFastThresholdMs(response.promptWordCount)).length/total,notApplicableRate=content.filter(response=>response.notApplicable).length/(content.length||1);
  return{neutralOveruse:neutralRate>.35,changedOften:changedRate>.18,fastItems:fastRate>.25,notApplicableOveruse:notApplicableRate>.15,neutralRate:Number(neutralRate.toFixed(2)),changedRate:Number(changedRate.toFixed(2)),fastRate:Number(fastRate.toFixed(2)),notApplicableRate:Number(notApplicableRate.toFixed(2))}
}
function publicQualityList(flags,d){return[['neutralOveruse',d.publicQualityNeutral],['changedOften',d.publicQualityChanged],['fastItems',d.publicQualityFastItems],['notApplicableOveruse',d.publicQualityNotApplicable]].filter(([key])=>flags[key]).map(([,text])=>`<li>${text}</li>`).join('')}
async function scorePublicRouteV2(){
  const d=I18N[currentLang],out=document.querySelector('#testResult'),keys=normalizedPublicTestKeys(publicTestKeys),calcs=Object.fromEntries(keys.map(key=>[key,collectByTest(key)]));
  if(Object.values(calcs).some(c=>c.missing)){out.innerHTML=`<div class="test-result"><p class="test-caveat">${d.missing}</p></div>`;return}
  const old=activeTest;let tech=keys.map(key=>{activeTest=key;const test=TESTS[key],calc=calcs[key],top=test.mode==='socionics'?socionics(calc):positionTypes(test,calc),rows=rowsFor(test,calc);return{key,label:test.labels[currentLang][0],test,top,rows}});activeTest=old;
  const allResponses=keys.flatMap(key=>calcs[key].responses),completedAt=Date.now(),durationMs=completedAt-startedAt,attentionCheckPresented=Object.values(calcs).some(calc=>calc.attentionPresented),failedAttention=Object.values(calcs).some(calc=>calc.failedAttention),qualityFlags=qualityFlagsForResponses(allResponses,durationMs,{attentionPresented:attentionCheckPresented,failedAttention});
  if(qualityFlags.responseQuality==='low')tech=tech.map(layer=>({...layer,top:withholdTop(layer.top,failedAttention?'failed-attention-check':'response-quality')}));
  const confidence=publicConfidence(tech),hypothesis=publicMainHypothesis(tech),qualityLabel=d[`publicResponseQuality${qualityFlags.responseQuality[0].toUpperCase()+qualityFlags.responseQuality.slice(1)}`],confidenceLabel=d[`publicConfidence${confidence[0].toUpperCase()+confidence.slice(1)}`];
  const payload={...STUDY,instrumentVersion:'public-modular-route-v0.4',questionBankVersion,responseId:crypto.randomUUID(),sessionId,deviceRespondentId:publicSaveLocal?deviceId:null,randomization:{seed:publicOrderSeed,blockOrder:[...new Set(publicItems(keys).map(item=>item.testKey))],itemOrder:[...allResponses].sort((a,b)=>a.displayIndex-b.displayIndex).map(response=>response.itemId)},timing:{startedAt:new Date(startedAt).toISOString(),completedAt:new Date(completedAt).toISOString(),totalDurationMs:durationMs,minimumCompletionTimeMs:minimumCompletionTimeMs(allResponses.filter(response=>!response.attentionExpected).length)},metadata:{language:currentLang,ageBand:publicAgeBand||null,mode:publicMode,selectedTests:keys,saveLocal:publicSaveLocal,a11yProfile:Object.entries(publicPrefs).filter(([,value])=>value).map(([key])=>key),viewport:{w:innerWidth,h:innerHeight},timezone:Intl.DateTimeFormat().resolvedOptions().timeZone},responses:allResponses,scaleScores:Object.fromEntries(tech.flatMap(layer=>layer.rows.map(([key,value])=>[`${layer.key}:${key}`,value]))),modelResults:Object.fromEntries(tech.map(layer=>[layer.key,modelResult(TESTS[layer.key],layer.top)])),resultSummary:`${d.publicSummary} ${hypothesis}. ${d.publicEvidence}: ${confidenceLabel}. ${d.publicResponseQuality}: ${qualityLabel}.`,qualityFlags:{...qualityFlags,modelEvidence:confidence}};
  lastPublicPayload=payload;if(typeof globalThis!=='undefined')globalThis.lastPublicPayload=payload;if(publicSaveLocal)localStorage.setItem('before-we-build-results',JSON.stringify(payload));clearPublicProgress();
  const qualityItems=publicQualityList(qualityFlags,d),qualityNote=qualityFlags.responseQuality==='low'?`<p class="test-caveat">${failedAttention?d.publicAttentionWithheld:d.publicQualityNote}</p>`:'',qualityBlock=qualityItems?`<div class="result-reading public-quality"><h4>${d.publicQualityTitle}</h4><ul>${qualityItems}</ul></div>`:'',music=await musicRecommendation(tech.find(layer=>layer.key==='psychosophy')?.top,'psychosophy');
  out.innerHTML=`<div class="test-result public-result"><h3>${d.publicResultTitle}</h3><div class="result-reading public-hypothesis"><h4>${d.publicHypothesis}</h4><p><b>${hypothesis}</b></p><p><b>${d.publicEvidence}:</b> ${confidenceLabel}</p><p><b>${d.publicResponseQuality}:</b> ${qualityLabel}</p><p class="test-caveat">${d.publicCaveat}</p></div><h4>${d.publicAlternatives}</h4><div class="tim-list">${publicAlternatives(tech)}</div>${music}${qualityBlock}<div class="result-reading"><h4>${d.publicWhatNext}</h4><p>${d.publicNextChecks}</p></div><p>${publicSaveLocal?d.publicResultSaved:d.publicResultNotSaved}</p>${qualityNote}<details><summary>${d.publicTechMap}</summary><div class="tim-list">${tech.map(layer=>{const text=layer.key==='socionics'?layer.rows.map(([key,value])=>`${key}: ${value.toFixed(1)}`).join(' · '):profileDefined(layer.top)?layer.top.map(candidate=>typeLabel(candidate,layer.key)).join(' · '):`${d.undefinedProfile}${positionEvidenceText(layer.top)?` · ${positionEvidenceText(layer.top)}`:''}`;return`<div class="tim-card"><b>${layer.label}</b><small>${text}</small></div>`}).join('')}</div></details><div class="test-actions"><button data-copy>${d.copy}</button><button data-clear>${d.clear}</button></div></div>`;
  out.querySelector('[data-copy]')?.addEventListener('click',()=>navigator.clipboard?.writeText(payload.resultSummary));
  out.querySelector('[data-clear]')?.addEventListener('click',()=>{localStorage.removeItem('before-we-build-results');clearPublicProgress();lastPublicPayload=null;out.innerHTML=`<div class="test-result"><p>${d.publicCleared}</p></div>`});
}
function bindPublicAnswers(panel){
  panel.querySelectorAll('input[type="radio"]').forEach(i=>i.addEventListener('change',()=>{recordAnswer(i);const card=i.closest('.story-test-card,.public-classic-item');card?.classList.add('answered');const label=i.closest('label')?.querySelector('em,span')?.textContent||i.value;announceSelection(card,label);updateStoryProgress();savePublicProgress();if(shouldAutoscroll())setTimeout(()=>setPublicStep(publicStep+1),160)}));
}
function setPublicStep(step,moveFocus=false){const cards=[...document.querySelectorAll('.story-test-card,.public-classic-item')];if(!cards.length)return;publicStep=Math.max(0,Math.min(step,cards.length-1));cards.forEach((card,i)=>{const active=i===publicStep;card.classList.toggle('active-step',active);card.toggleAttribute('hidden',!active)});const active=cards[publicStep],testKey=active?.dataset?.testKey,blockLabel=document.querySelector('[data-public-block-label]');if(blockLabel&&TESTS[testKey])blockLabel.textContent=`${I18N[currentLang].publicSection}: ${TESTS[testKey].labels[currentLang][0]}`;if(active?.dataset?.testItem&&!shownAt[active.dataset.testItem])shownAt[active.dataset.testItem]=Date.now();document.querySelector('[data-public-prev]')?.toggleAttribute('disabled',publicStep===0);document.querySelector('[data-public-next]')?.toggleAttribute('disabled',publicStep===cards.length-1);savePublicProgress();if(moveFocus&&active){active.setAttribute('tabindex','-1');active.focus({preventScroll:false})}}
function revealFirstMissingPublicCard(){const missing=document.querySelector('.story-test-card.missing-answer,.public-classic-item.missing-answer');if(!missing)return;const cards=[...document.querySelectorAll('.story-test-card,.public-classic-item')],idx=cards.indexOf(missing);if(idx>=0)setPublicStep(idx,true)}
function setPublicPaused(paused){document.querySelector('[data-public-flow]')?.toggleAttribute('hidden',paused);document.querySelector('[data-public-pause-card]')?.toggleAttribute('hidden',!paused);savePublicProgress()}
function renderTests(){
  const d=I18N[currentLang],tabs=document.querySelector('#testTabs'),panel=document.querySelector('#testPanel'),test=TESTS[activeTest];
  if(!panel)return;
  const isResearch=document.body.dataset.testAudience==='research';
  if(!isResearch){
    if(!publicStarted){
      panel.innerHTML=renderPublicStart(d);const ageSelect=panel.querySelector('[data-public-age]'),saveControl=panel.querySelector('[data-public-save]');
      panel.querySelectorAll('[data-public-route]').forEach(button=>button.addEventListener('click',()=>{publicAgeBand=ageSelect?.value||'';publicTestKeys=button.dataset.publicRoute==='all'?Object.keys(TESTS):[button.dataset.publicRoute];publicMode=publicModeForAge(publicAgeBand);publicSaveLocal=!!saveControl?.checked;publicOrderSeed=`${sessionId}:${publicTestKeys.join('-')}`;resetAnswerState();publicStarted=true;publicStep=0;startedAt=Date.now();savePublicProgress();renderTests()}));
      panel.querySelector('[data-public-resume-progress]')?.addEventListener('click',()=>{const progress=readPublicProgress();if(progress)restorePublicProgress(progress)});
      panel.querySelector('[data-public-discard-progress]')?.addEventListener('click',()=>{clearPublicProgress();renderTests()});
      return
    }
    const items=publicItems();
    const itemHtml=publicMode==='classic'?items.map((it,i)=>renderClassicPublicItem(it,i,items.length)).join(''):items.map((it,i)=>renderGameItem(it,i,items.length)).join('');
    const itemsClass=publicMode==='classic'?'public-classic-list':'story-feed';
    panel.innerHTML=`<div data-public-flow><div class="story-progress" role="status" aria-live="polite"><div><b data-public-block-label>${d.publicProgress}</b><span data-story-progress-count>0/${items.length}</span></div><span><i data-story-progress-bar></i></span></div><div class="test-items public-step-list ${itemsClass}">${itemHtml}</div><div class="public-step-nav"><button data-public-prev>${d.publicPrev}</button><button data-public-next>${d.publicNext}</button></div><div class="test-actions"><button class="primary" data-submit>${d.submit}</button><button data-public-pause>${d.publicPause}</button><button data-reset>${d.reset}</button><button data-clear>${d.clear}</button></div><div id="testResult" aria-live="polite"></div></div><div class="public-pause-card" data-public-pause-card hidden><h3>${d.publicPausedTitle}</h3><p>${d.publicPausedText}</p><button class="primary" data-public-resume>${d.publicResume}</button></div>`;
    updateStoryProgress();
    bindPublicAnswers(panel);
    setPublicStep(publicStep);observeTestCards();
    panel.querySelector('[data-public-prev]')?.addEventListener('click',()=>setPublicStep(publicStep-1,true));
    panel.querySelector('[data-public-next]')?.addEventListener('click',()=>setPublicStep(publicStep+1,true));
    panel.querySelector('[data-public-pause]')?.addEventListener('click',()=>setPublicPaused(true));
    panel.querySelector('[data-public-resume]')?.addEventListener('click',()=>setPublicPaused(false));
    panel.querySelector('[data-submit]')?.addEventListener('click',async()=>{await scorePublicRouteV2();revealFirstMissingPublicCard()});
    panel.querySelector('[data-reset]')?.addEventListener('click',()=>{resetAnswerState();clearPublicProgress();publicStarted=false;publicStep=0;renderTests()});
    panel.querySelector('[data-clear]')?.addEventListener('click',()=>{localStorage.removeItem('before-we-build-results');clearPublicProgress();lastPublicPayload=null;document.querySelector('#testResult').innerHTML=`<div class="test-result"><p>${d.publicCleared}</p></div>`});
    return;
  }
  const consentAccepted=window.beforeWeBuildConsentAccepted===true;
  const consentCard=`<div class="research-card"><b>${d.pilot}</b><p>${d.instruction}</p><label class="consent"><input id="consent" type="checkbox" ${consentAccepted?'checked':''}> ${d.consent}</label></div>`;
  if(!consentAccepted){
    tabs.innerHTML='';
    panel.innerHTML=`${consentCard}<div class="test-result"><p class="test-caveat">${d.consent}</p></div>`;
  }else{
    const items=constrainedShuffle(test.items.filter(item=>!item.attention),`${deviceId}:${sessionId}:${activeTest}`),attention=test.items.find(item=>item.attention);
    if(attention)items.splice(Math.max(1,Math.floor(items.length/2)),0,attention);
    tabs.innerHTML=Object.keys(TESTS).map(k=>`<button class="${k===activeTest?'active':''}" data-test-key="${k}">${TESTS[k].labels[currentLang][0]}</button>`).join('');
    const metadata=isResearch?`<div class="metadata-grid"><label>${d.age}<select id="ageBand"><option value="">${d.none}</option><option>under-18</option><option>18-24</option><option>25-34</option><option>35-44</option><option>45-54</option><option>55+</option></select></label><label>${d.exposure}<select id="exposure"><option value="">${d.none}</option><option>none</option><option>beginner</option><option>intermediate</option><option>advanced</option></select></label><label>${d.selftype}<input id="selfType" placeholder="SLI / ЭЛВФ / ..."></label><label>${d.token}<input id="retestToken" type="password" autocomplete="off"></label></div>`:'';
    const caveat=isResearch?`<p>${test.mode==='socionics'?d.caveatSoc:d.caveatPosition}</p>`:'';
    const clearButton=isResearch?`<button data-clear>${d.clear}</button>`:'';
    const itemHtml=isResearch?items.map((it,i)=>{const na=it.attention?'':`<label class="public-na-choice"><input type="radio" name="${it.id}" value="na" ${selectedAnswers[it.id]==='na'?'checked':''}><span>${d.publicNotApplicable}</span></label><small class="public-na-hint">${d.publicNotApplicableHint}</small>`;return`<article class="test-item" data-test-item="${it.id}" data-display-index="${i+1}"><p><b>${i+1}.</b> ${it.text[currentLang]||it.text.ru}</p><div class="scale">${[1,2,3,4,5].map(v=>`<label><input type="radio" name="${it.id}" value="${v}" ${selectedAnswers[it.id]===String(v)?'checked':''}>${v}</label>`).join('')}</div><div class="scale-help"><span>${d.scaleL}</span><span>${d.scaleR}</span></div>${na}</article>`}).join(''):items.map((it,i)=>renderGameItem(it,i,items.length)).join('');
    const storyProgress=isResearch?'':`<div class="story-progress"><div><b>Маршрут</b><span data-story-progress-count>0/${items.length}</span></div><span><i data-story-progress-bar></i></span></div>`;
    // render research or story feed
panel.innerHTML=`${consentCard}${metadata}<div class="test-meta ${isResearch?'':'story-test-meta'}"><h3>${test.labels[currentLang][0]}</h3><p>${test.labels[currentLang][1]}</p>${caveat}</div>${storyProgress}<div class="test-items ${isResearch?'':'story-feed'}">${itemHtml}</div><div class="test-actions"><button class="primary" data-submit>${d.submit}</button><button data-reset>${d.reset}</button>${clearButton}</div><div id="testResult" aria-live="polite"></div>`;observeTestCards();
  }
  tabs.querySelectorAll('[data-test-key]').forEach(b=>b.addEventListener('click',()=>{activeTest=b.dataset.testKey;resetAnswerState();startedAt=Date.now();renderTests()}));
  panel.querySelector('#consent')?.addEventListener('change',e=>{window.beforeWeBuildConsentAccepted=e.target.checked;if(e.target.checked)ensureResearchDeviceId();resetAnswerState();startedAt=Date.now();renderTests()});
  updateStoryProgress();
  panel.querySelectorAll('input[type="radio"]').forEach(i=>i.addEventListener('change',()=>{recordAnswer(i);const card=i.closest('.story-test-card,.test-item');card?.classList.add('answered');const label=i.closest('label')?.querySelector('em')?.textContent||'';const fb=card?.querySelector('.story-feedback');if(fb)fb.textContent=label?`Выбрано: ${label}`:'';updateStoryProgress();const next=card?.nextElementSibling;if(next?.classList.contains('story-test-card'))setTimeout(()=>next.scrollIntoView({block:'center',behavior:'smooth'}),160)}));
  panel.querySelector('[data-submit]')?.addEventListener('click',scoreActiveTest);
  panel.querySelector('[data-reset]')?.addEventListener('click',()=>{resetAnswerState();startedAt=Date.now();renderTests()});
  panel.querySelector('[data-clear]')?.addEventListener('click',()=>{localStorage.removeItem('before-we-build-results');localStorage.removeItem('before-we-build-device-id');deviceId=sessionId;lastResearchPayload=null;resetAnswerState();startedAt=Date.now();renderTests()});
}
function enhanceControlsA11y(){document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===currentLang)));document.querySelectorAll('[data-test-key]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.testKey===activeTest)));document.querySelectorAll('button:not([type])').forEach(b=>b.setAttribute('type','button'))}const a11yObserver=new MutationObserver(enhanceControlsA11y);a11yObserver.observe(document.body,{childList:true,subtree:true});document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>applyLanguage(b.dataset.lang));applyLanguage(currentLang);enhanceControlsA11y();loadQuestionBank().then(()=>{if(!publicStarted&&!Object.keys(answered).length)applyLanguage(currentLang);enhanceControlsA11y()});
