(function(root){
  'use strict';

  const STORAGE_KEY = 'before-we-build-lang';
  const DEFAULT_LOCALE = 'uk';
  const SUPPORTED = new Set(['uk', 'ru', 'en']);
  const originalText = new WeakMap();
  const originalTitle = root.document ? root.document.title : '';
  const originalDescription = root.document ? (root.document.querySelector('meta[name="description"]')?.getAttribute('content') || '') : '';

  const TEXT = {
    ru: {
      'Перш ніж будувати': 'Прежде чем строить',
      'Перш ніж будувати ·': 'Прежде чем строить ·',
      'Перш ніж будувати · Писання спочатку': 'Прежде чем строить · Сначала Писание',
      'Перш ніж будувати · Писання спочатку ·': 'Прежде чем строить · Сначала Писание ·',
      'Оснування': 'Основание',
      'Почати перед Писанням': 'Начать перед Писанием',
      'Хто такий Христос': 'Кто такой Христос',
      'Межі': 'Границы',
      'Писання спочатку': 'Сначала Писание',
      'Писання спочатку · перед серйозними рішеннями': 'Сначала Писание · перед серьёзными решениями',
      'Перш ніж будувати — перевірте оснування перед Богом.': 'Прежде чем строить — проверьте основание перед Богом.',
      'Це не сайт для пошуку збігів, не оцінювання людини і не прихований висновок про майбутнє. Це простий шлях: прочитати місце Писання, відповісти на чесні питання і винести важливе в молитву, Писання та мудру пораду.': 'Это не сайт для поиска совпадений, не оценивание человека и не скрытый вывод о будущем. Это простой путь: прочитать место Писания, ответить на честные вопросы и вынести важное в молитву, Писание и мудрый совет.',
      'Почати з місця Писання': 'Начать с места Писания',
      'Що означає оснування?': 'Что означает основание?',
      'Відповіді у приватному шляху зберігаються тільки у вашому браузері. Нічого не надсилається автоматично.': 'Ответы в приватном пути сохраняются только в вашем браузере. Ничего не отправляется автоматически.',
      'Порядок шляху': 'Порядок пути',
      'Не починаємо з себе. Починаємо з Божого Слова.': 'Начинаем не с себя. Начинаем с Божьего Слова.',
      'Спершу текст Писання': 'Сначала текст Писания',
      'Виберіть один уривок: про дім на камені, ціну будівництва, мудрість, пораду або Господа, Який будує.': 'Выберите один отрывок: о доме на камне, цене строительства, мудрости, совете или Господе, Который строит.',
      'Потім чесні питання': 'Затем честные вопросы',
      'Питання не роблять висновку про вас. Вони допомагають назвати, що потрібно принести перед Богом без поспіху.': 'Вопросы не делают вывода о вас. Они помогают назвать, что нужно принести перед Богом без спешки.',
      'Далі молитва і порада': 'Дальше молитва и совет',
      'Підсумок не замінює церкву, Писання, сумління, молитву або зрілу пораду. Він лише готує до чеснішого кроку.': 'Итог не заменяет церковь, Писание, совесть, молитву или зрелый совет. Он лишь готовит к более честному шагу.',
      '1 Коринтян 12:13–22': '1 Коринфянам 12:13–22',
      'Бог не робить усіх однаковими.': 'Бог не делает всех одинаковыми.',
      'Писання говорить про одне тіло і багато членів: око не може сказати руці «ти мені не потрібна», і голова не може сказати ногам «ви мені не потрібні». Різниця між людьми не є приводом для гордості, страху або поспішного висновку. Вона може бути місцем взаємної потреби, служіння і смиренної поради.': 'Писание говорит об одном теле и многих членах: глаз не может сказать руке «ты мне не нужна», и голова не может сказать ногам «вы мне не нужны». Различие между людьми не является поводом для гордости, страха или поспешного вывода. Оно может стать местом взаимной нужды, служения и смиренного совета.',
      'Різні члени': 'Разные члены',
      'Не всі бачать, служать, допомагають, підтримують і приймають рішення однаково. Це не робить людину менш потрібною.': 'Не все видят, служат, помогают, поддерживают и принимают решения одинаково. Это не делает человека менее нужным.',
      'Різні служіння': 'Разные служения',
      'Перед серйозним рішенням важливо питати не «хто кращий», а як нам служити Богові вірно — кожен на своєму місці.': 'Перед серьёзным решением важно спрашивать не «кто лучше», а как нам верно служить Богу — каждому на своём месте.',
      'Взаємна потреба': 'Взаимная нужда',
      'Якщо ми будуємо разом, треба навчитися називати різницю без знецінення і приносити її до молитви, Писання та мудрої поради.': 'Если мы строим вместе, нужно учиться называть различия без обесценивания и приносить их в молитву, Писание и мудрый совет.',
      'Що залишаємо, а від чого відмовляємось': 'Что оставляем и от чего отказываемся',
      'Публічний шлях більше не будується навколо старих схем.': 'Публичный путь больше не строится вокруг старых схем.',
      'Так': 'Да',
      'Ні': 'Нет',
      'Писання, молитва, мудра порада': 'Писание, молитва, мудрый совет',
      'Це головна публічна рамка сайту для звичайного відвідувача.': 'Это главная публичная рамка сайта для обычного посетителя.',
      'Почати': 'Начать',
      'Оснування перед рішенням': 'Основание перед решением',
      'Перед стосунками, сімʼєю, служінням або спільною справою важливо запитати: на чому ми будуємо?': 'Перед отношениями, семьёй, служением или общим делом важно спросить: на чём мы строим?',
      'Про оснування': 'Об основании',
      'Без прихованого висновку': 'Без скрытого вывода',
      'Сайт не визначає Божу волю, не оцінює людину і не вирішує долю стосунків.': 'Сайт не определяет Божью волю, не оценивает человека и не решает судьбу отношений.',
      'Матвія 7:24–27 · Луки 14:28–30 · Приповісті 24:3–4': 'Матфея 7:24–27 · Луки 14:28–30 · Притчи 24:3–4',
      'Оснування важливіше за поспішне будівництво.': 'Основание важнее поспешного строительства.',
      'Христос говорить про дім на камені. Луки 14 говорить про те, щоб сісти і порахувати ціну. Приповісті говорять про мудрість, розуміння, знання і пораду. Тому цей сайт починається не з оцінки людей, а з питання: чи не будуємо ми без оснування?': 'Христос говорит о доме на камне. Луки 14 говорит о том, чтобы сесть и посчитать цену. Притчи говорят о мудрости, разумении, знании и совете. Поэтому этот сайт начинается не с оценки людей, а с вопроса: не строим ли мы без основания?',
      'Що перевіряти': 'Что проверять',
      'Не людину як обʼєкт, а шлях перед Богом.': 'Не человека как объект, а путь перед Богом.',
      'Слова Христа': 'Слова Христа',
      'Чи є конкретний послух Христу, який має випереджати моє рішення?': 'Есть ли конкретное послушание Христу, которое должно опередить моё решение?',
      'Ціну рішення': 'Цену решения',
      'Чи названі відповідальність, наслідки, обмеження і те, до чого я ще не готовий?': 'Названы ли ответственность, последствия, ограничения и то, к чему я ещё не готов?',
      'Мудру пораду': 'Мудрый совет',
      'Кого я маю попросити про зрілу пораду до серйозного кроку?': 'Кого мне нужно попросить о зрелом совете до серьёзного шага?',
      'Різниця між людьми не випадкова і не має ставати приводом для знецінення.': 'Различие между людьми не случайно и не должно становиться поводом для обесценивания.',
      'Апостол Павло говорить про одне тіло і багато членів. Бог розташував члени в тілі так, як захотів; слабші на вигляд члени потрібні. Тому перед тим, як будувати разом, ми не питаємо: «як зробити всіх однаковими?» Ми питаємо: як різні люди можуть вірно служити Богові, потребувати одне одного і не руйнувати єдність гордістю або страхом?': 'Апостол Павел говорит об одном теле и многих членах. Бог расположил члены в теле так, как захотел; слабейшие на вид члены нужны. Поэтому перед тем, как строить вместе, мы не спрашиваем: «как сделать всех одинаковыми?» Мы спрашиваем: как разные люди могут верно служить Богу, нуждаться друг в друге и не разрушать единство гордостью или страхом?',
      'Не однаковість': 'Не одинаковость',
      'Єдність у Христі не означає однакові дари, однаковий темп або однакове служіння.': 'Единство во Христе не означает одинаковые дары, одинаковый темп или одинаковое служение.',
      'Не самодостатність': 'Не самодостаточность',
      'Око потребує руки, голова потребує ніг. Різниця має вести до взаємної потреби, а не до висновку «ти мені не потрібен».': 'Глаз нуждается в руке, голова нуждается в ногах. Различие должно вести к взаимной нужде, а не к выводу «ты мне не нужен».',
      'Не поспішний висновок': 'Не поспешный вывод',
      'Перед серйозним рішенням варто побачити, де різниця може стати даром для служіння, а де потрібні покаяння, терпіння і порада.': 'Перед серьёзным решением стоит увидеть, где различие может стать даром для служения, а где нужны покаяние, терпение и совет.',
      'Червона межа': 'Красная граница',
      'Публічний сайт не є інструментом вироку.': 'Публичный сайт не является инструментом приговора.',
      'Він не дає духовного дозволу, не замінює пастирську допомогу, не обіцяє результат і не перетворює людину на набір показників. Його завдання — допомогти почати чесніший роздум перед Богом.': 'Он не даёт духовного разрешения, не заменяет пастырскую помощь, не обещает результат и не превращает человека в набор показателей. Его задача — помочь начать более честное размышление перед Богом.',
      'Євангеліє': 'Евангелие',
      'Христос — не додаток до поради. Він є Господь і Спаситель.': 'Христос — не дополнение к совету. Он Господь и Спаситель.',
      'Християнський шлях починається не з кращої техніки для стосунків, а з Бога, нашого гріха і Ісуса Христа, Який помер і воскрес, щоб примирити грішників з Богом.': 'Христианский путь начинается не с лучшей техники для отношений, а с Бога, нашего греха и Иисуса Христа, Который умер и воскрес, чтобы примирить грешников с Богом.',
      'Повернутися до оснування': 'Вернуться к основанию',
      'Коротко': 'Кратко',
      'Що говорить Євангеліє': 'Что говорит Евангелие',
      'Бог створив людину': 'Бог создал человека',
      'Ми створені для життя перед Богом: у правді, любові, відповідальності й поклонінні Йому.': 'Мы созданы для жизни перед Богом: в истине, любви, ответственности и поклонении Ему.',
      'Гріх відділяє від Бога': 'Грех отделяет от Бога',
      'Проблема людини глибша за непорозуміння між людьми: ми потребуємо прощення і нового серця.': 'Проблема человека глубже непонимания между людьми: нам нужны прощение и новое сердце.',
      'Христос помер і воскрес': 'Христос умер и воскрес',
      'Ісус Христос, Син Божий, помер за гріхи і воскрес. У Ньому Бог дає прощення, примирення і нове життя.': 'Иисус Христос, Сын Божий, умер за грехи и воскрес. В Нём Бог даёт прощение, примирение и новую жизнь.',
      'Відповідь': 'Ответ',
      'Покаяння і віра': 'Покаяние и вера',
      'Прийти до Христа — означає відвернутися від гріха, довіритися Йому як Спасителю і Господу та вчитися жити в послуху Богові. Якщо це питання стало для вас живим, читайте Євангеліє від Івана, моліться Богові чесними словами і шукайте вірну церкву, де проповідують Христа і Писання.': 'Прийти ко Христу — значит отвернуться от греха, довериться Ему как Спасителю и Господу и учиться жить в послушании Богу. Если этот вопрос стал для вас живым, читайте Евангелие от Иоанна, молитесь Богу честными словами и ищите верную церковь, где проповедуют Христа и Писание.',
      'Межі використання': 'Границы использования',
      'Цей сайт допомагає ставити питання, але не має влади вирішувати за вас.': 'Этот сайт помогает ставить вопросы, но не имеет власти решать за вас.',
      'Публічний шлях Before We Build — це приватний роздум перед Писанням. Він не замінює Бога, Писання, молитву, сумління, церкву, зрілу пораду або безпечну живу допомогу.': 'Публичный путь Before We Build — это приватное размышление перед Писанием. Он не заменяет Бога, Писание, молитву, совесть, церковь, зрелый совет или безопасную живую помощь.',
      'Що сайт не робить': 'Чего сайт не делает',
      'Жодного прихованого висновку.': 'Никакого скрытого вывода.',
      'Не визначає Божу волю': 'Не определяет Божью волю',
      'Результат не є пророцтвом, знаком або духовним дозволом.': 'Результат не является пророчеством, знаком или духовным разрешением.',
      'Не оцінює людину': 'Не оценивает человека',
      'Сайт не зводить людину до категорії і не дає ярлика.': 'Сайт не сводит человека к категории и не даёт ярлык.',
      'Не замінює допомогу': 'Не заменяет помощь',
      'Якщо є небезпека, примус, насильство або самозашкодження, потрібна безпечна жива допомога.': 'Если есть опасность, принуждение, насилие или самоповреждение, нужна безопасная живая помощь.',
      'Приватність': 'Приватность',
      'Відповіді залишаються у браузері.': 'Ответы остаются в браузере.',
      'У Start Alone відповіді зберігаються локально. Файл створюється тільки після вашого натискання, і тільки ви вирішуєте, чи показувати його комусь.': 'В Start Alone ответы сохраняются локально. Файл создаётся только после вашего нажатия, и только вы решаете, показывать ли его кому-то.',
      'Почати приватний шлях': 'Начать приватный путь'
    },
    en: {
      'Перш ніж будувати': 'Before We Build',
      'Перш ніж будувати ·': 'Before We Build ·',
      'Перш ніж будувати · Писання спочатку': 'Before We Build · Scripture first',
      'Перш ніж будувати · Писання спочатку ·': 'Before We Build · Scripture first ·',
      'Оснування': 'Foundation',
      'Почати перед Писанням': 'Begin before Scripture',
      'Хто такий Христос': 'Who is Christ?',
      'Межі': 'Boundaries',
      'Писання спочатку': 'Scripture first',
      'Писання спочатку · перед серйозними рішеннями': 'Scripture first · before serious decisions',
      'Перш ніж будувати — перевірте оснування перед Богом.': 'Before you build — test the foundation before God.',
      'Це не сайт для пошуку збігів, не оцінювання людини і не прихований висновок про майбутнє. Це простий шлях: прочитати місце Писання, відповісти на чесні питання і винести важливе в молитву, Писання та мудру пораду.': 'This is not a site for finding matches, judging a person, or hiding a conclusion about the future. It is a simple path: read a Scripture passage, answer honest questions, and bring what matters to prayer, Scripture, and wise counsel.',
      'Почати з місця Писання': 'Begin with Scripture',
      'Що означає оснування?': 'What does foundation mean?',
      'Відповіді у приватному шляху зберігаються тільки у вашому браузері. Нічого не надсилається автоматично.': 'Answers in the private path are stored only in your browser. Nothing is sent automatically.',
      'Порядок шляху': 'Path order',
      'Не починаємо з себе. Починаємо з Божого Слова.': 'We do not begin with ourselves. We begin with God’s Word.',
      'Спершу текст Писання': 'First, the Scripture text',
      'Виберіть один уривок: про дім на камені, ціну будівництва, мудрість, пораду або Господа, Який будує.': 'Choose one passage: the house on the rock, the cost of building, wisdom, counsel, or the Lord who builds.',
      'Потім чесні питання': 'Then honest questions',
      'Питання не роблять висновку про вас. Вони допомагають назвати, що потрібно принести перед Богом без поспіху.': 'The questions do not draw a conclusion about you. They help name what should be brought before God without haste.',
      'Далі молитва і порада': 'Then prayer and counsel',
      'Підсумок не замінює церкву, Писання, сумління, молитву або зрілу пораду. Він лише готує до чеснішого кроку.': 'The summary does not replace the church, Scripture, conscience, prayer, or mature counsel. It only prepares for a more honest step.',
      '1 Коринтян 12:13–22': '1 Corinthians 12:13–22',
      'Бог не робить усіх однаковими.': 'God does not make everyone identical.',
      'Різні члени': 'Different members',
      'Різні служіння': 'Different services',
      'Взаємна потреба': 'Mutual need',
      'Що залишаємо, а від чого відмовляємось': 'What we keep and what we refuse',
      'Публічний шлях більше не будується навколо старих схем.': 'The public path is no longer built around old schemes.',
      'Так': 'Yes',
      'Ні': 'No',
      'Писання, молитва, мудра порада': 'Scripture, prayer, wise counsel',
      'Почати': 'Begin',
      'Оснування перед рішенням': 'Foundation before a decision',
      'Про оснування': 'About the foundation',
      'Без прихованого висновку': 'No hidden conclusion',
      'Матвія 7:24–27 · Луки 14:28–30 · Приповісті 24:3–4': 'Matthew 7:24–27 · Luke 14:28–30 · Proverbs 24:3–4',
      'Оснування важливіше за поспішне будівництво.': 'The foundation matters more than rushed building.',
      'Що перевіряти': 'What to test',
      'Не людину як обʼєкт, а шлях перед Богом.': 'Not a person as an object, but the path before God.',
      'Слова Христа': 'Christ’s words',
      'Ціну рішення': 'The cost of the decision',
      'Мудру пораду': 'Wise counsel',
      'Різниця між людьми не випадкова і не має ставати приводом для знецінення.': 'Difference between people is not accidental and must not become a reason for contempt.',
      'Не однаковість': 'Not sameness',
      'Не самодостатність': 'Not self-sufficiency',
      'Не поспішний висновок': 'Not a rushed conclusion',
      'Червона межа': 'Red boundary',
      'Публічний сайт не є інструментом вироку.': 'The public site is not a tool of verdict.',
      'Євангеліє': 'The Gospel',
      'Христос — не додаток до поради. Він є Господь і Спаситель.': 'Christ is not an add-on to advice. He is Lord and Savior.',
      'Повернутися до оснування': 'Return to the foundation',
      'Коротко': 'In brief',
      'Що говорить Євангеліє': 'What the Gospel says',
      'Бог створив людину': 'God created humanity',
      'Гріх відділяє від Бога': 'Sin separates from God',
      'Христос помер і воскрес': 'Christ died and rose',
      'Відповідь': 'Response',
      'Покаяння і віра': 'Repentance and faith',
      'Межі використання': 'Usage boundaries',
      'Цей сайт допомагає ставити питання, але не має влади вирішувати за вас.': 'This site helps ask questions, but has no authority to decide for you.',
      'Що сайт не робить': 'What the site does not do',
      'Жодного прихованого висновку.': 'No hidden conclusion.',
      'Не визначає Божу волю': 'Does not determine God’s will',
      'Не оцінює людину': 'Does not judge a person',
      'Не замінює допомогу': 'Does not replace help',
      'Приватність': 'Privacy',
      'Відповіді залишаються у браузері.': 'Answers remain in the browser.',
      'Почати приватний шлях': 'Begin the private path',
      'Писання говорить про одне тіло і багато членів: око не може сказати руці «ти мені не потрібна», і голова не може сказати ногам «ви мені не потрібні». Різниця між людьми не є приводом для гордості, страху або поспішного висновку. Вона може бути місцем взаємної потреби, служіння і смиренної поради.': 'Scripture speaks of one body and many members: the eye cannot say to the hand, “I have no need of you,” and the head cannot say to the feet, “I have no need of you.” Difference between people is not a reason for pride, fear, or a rushed conclusion. It can become a place of mutual need, service, and humble counsel.',
      'Не всі бачать, служать, допомагають, підтримують і приймають рішення однаково. Це не робить людину менш потрібною.': 'Not everyone sees, serves, helps, supports, or makes decisions in the same way. That does not make a person less needed.',
      'Перед серйозним рішенням важливо питати не «хто кращий», а як нам служити Богові вірно — кожен на своєму місці.': 'Before a serious decision, the question is not “who is better,” but how we can serve God faithfully — each in their place.',
      'Якщо ми будуємо разом, треба навчитися називати різницю без знецінення і приносити її до молитви, Писання та мудрої поради.': 'If we build together, we must learn to name difference without contempt and bring it to prayer, Scripture, and wise counsel.',
      'Це головна публічна рамка сайту для звичайного відвідувача.': 'This is the main public frame of the site for an ordinary visitor.',
      'Перед стосунками, сімʼєю, служінням або спільною справою важливо запитати: на чому ми будуємо?': 'Before relationships, family, ministry, or shared work, it matters to ask: what are we building on?',
      'Сайт не визначає Божу волю, не оцінює людину і не вирішує долю стосунків.': 'The site does not determine God’s will, judge a person, or decide the future of relationships.',
      'Христос говорить про дім на камені. Луки 14 говорить про те, щоб сісти і порахувати ціну. Приповісті говорять про мудрість, розуміння, знання і пораду. Тому цей сайт починається не з оцінки людей, а з питання: чи не будуємо ми без оснування?': 'Christ speaks about the house on the rock. Luke 14 speaks about sitting down and counting the cost. Proverbs speaks about wisdom, understanding, knowledge, and counsel. So this site begins not by judging people, but by asking: are we building without a foundation?',
      'Чи є конкретний послух Христу, який має випереджати моє рішення?': 'Is there a concrete obedience to Christ that should come before my decision?',
      'Чи названі відповідальність, наслідки, обмеження і те, до чого я ще не готовий?': 'Have I named the responsibility, consequences, limits, and what I am not yet ready for?',
      'Кого я маю попросити про зрілу пораду до серйозного кроку?': 'Whom should I ask for mature counsel before a serious step?',
      'Апостол Павло говорить про одне тіло і багато членів. Бог розташував члени в тілі так, як захотів; слабші на вигляд члени потрібні. Тому перед тим, як будувати разом, ми не питаємо: «як зробити всіх однаковими?» Ми питаємо: як різні люди можуть вірно служити Богові, потребувати одне одного і не руйнувати єдність гордістю або страхом?': 'The apostle Paul speaks about one body and many members. God arranged the members in the body as He chose; the members that seem weaker are necessary. So before building together, we do not ask, “how do we make everyone the same?” We ask: how can different people serve God faithfully, need one another, and not destroy unity through pride or fear?',
      'Єдність у Христі не означає однакові дари, однаковий темп або однакове служіння.': 'Unity in Christ does not mean identical gifts, identical pace, or identical service.',
      'Око потребує руки, голова потребує ніг. Різниця має вести до взаємної потреби, а не до висновку «ти мені не потрібен».': 'The eye needs the hand; the head needs the feet. Difference should lead to mutual need, not to the conclusion “I have no need of you.”',
      'Перед серйозним рішенням варто побачити, де різниця може стати даром для служіння, а де потрібні покаяння, терпіння і порада.': 'Before a serious decision, it is worth seeing where difference may become a gift for service, and where repentance, patience, and counsel are needed.',
      'Він не дає духовного дозволу, не замінює пастирську допомогу, не обіцяє результат і не перетворює людину на набір показників. Його завдання — допомогти почати чесніший роздум перед Богом.': 'It gives no spiritual permission, does not replace pastoral help, promises no result, and does not turn a person into a set of indicators. Its task is to help begin a more honest reflection before God.',
      'Християнський шлях починається не з кращої техніки для стосунків, а з Бога, нашого гріха і Ісуса Христа, Який помер і воскрес, щоб примирити грішників з Богом.': 'The Christian path begins not with a better technique for relationships, but with God, our sin, and Jesus Christ, who died and rose to reconcile sinners to God.',
      'Ми створені для життя перед Богом: у правді, любові, відповідальності й поклонінні Йому.': 'We were created to live before God: in truth, love, responsibility, and worship of Him.',
      'Проблема людини глибша за непорозуміння між людьми: ми потребуємо прощення і нового серця.': 'The human problem is deeper than misunderstanding between people: we need forgiveness and a new heart.',
      'Ісус Христос, Син Божий, помер за гріхи і воскрес. У Ньому Бог дає прощення, примирення і нове життя.': 'Jesus Christ, the Son of God, died for sins and rose again. In Him, God gives forgiveness, reconciliation, and new life.',
      'Прийти до Христа — означає відвернутися від гріха, довіритися Йому як Спасителю і Господу та вчитися жити в послуху Богові. Якщо це питання стало для вас живим, читайте Євангеліє від Івана, моліться Богові чесними словами і шукайте вірну церкву, де проповідують Христа і Писання.': 'To come to Christ means to turn away from sin, trust Him as Savior and Lord, and learn to live in obedience to God. If this question has become alive for you, read the Gospel of John, pray to God with honest words, and look for a faithful church where Christ and Scripture are preached.',
      'Публічний шлях Before We Build — це приватний роздум перед Писанням. Він не замінює Бога, Писання, молитву, сумління, церкву, зрілу пораду або безпечну живу допомогу.': 'The public path of Before We Build is a private reflection before Scripture. It does not replace God, Scripture, prayer, conscience, church, mature counsel, or safe human help.',
      'Результат не є пророцтвом, знаком або духовним дозволом.': 'The result is not a prophecy, sign, or spiritual permission.',
      'Сайт не зводить людину до категорії і не дає ярлика.': 'The site does not reduce a person to a category or give a label.',
      'Якщо є небезпека, примус, насильство або самозашкодження, потрібна безпечна жива допомога.': 'If there is danger, coercion, violence, or self-harm, safe human help is needed.',
      'У Start Alone відповіді зберігаються локально. Файл створюється тільки після вашого натискання, і тільки ви вирішуєте, чи показувати його комусь.': 'In Start Alone, answers are stored locally. A file is created only after you click, and only you decide whether to show it to anyone.'
    }
  };

  const META = {
    '/index.html': {
      ru: ['Прежде чем строить — сначала Писание', 'Прежде чем строить помогает христианам начать не с оценки людей, а с Писания, молитвы, честных вопросов и мудрого совета.'],
      en: ['Before We Build — Scripture first', 'Before We Build helps Christians begin not with judging people, but with Scripture, prayer, honest questions, and wise counsel.']
    },
    '/foundation.html': {
      ru: ['Основание — Прежде чем строить', 'Почему перед серьёзным решением нужно проверить основание перед Богом, Писанием и мудрым советом.'],
      en: ['Foundation — Before We Build', 'Why a serious decision should begin by testing the foundation before God, Scripture, and wise counsel.']
    },
    '/start-alone.html': {
      ru: ['Сначала Писание — Прежде чем строить', 'Выберите место Писания и пройдите короткий приватный путь вопросов перед Богом, Писанием и мудрым советом. Данные сохраняются только в браузере.'],
      en: ['Scripture first — Before We Build', 'Choose a Scripture passage and walk through a short private path of questions before God, Scripture, and wise counsel. Data stays only in the browser.']
    },
    '/christ.html': {
      ru: ['Кто такой Христос — Прежде чем строить', 'Краткое объяснение Евангелия: Бог, грех, Христос, крест, воскресение, покаяние и вера.'],
      en: ['Who is Christ? — Before We Build', 'A short explanation of the Gospel: God, sin, Christ, the cross, resurrection, repentance, and faith.']
    },
    '/limitations.html': {
      ru: ['Границы — Прежде чем строить', 'Чего этот сайт не делает: не даёт приговоров, не заменяет Писание, молитву, церковь, безопасность и живую помощь.'],
      en: ['Boundaries — Before We Build', 'What this site does not do: no verdicts, and no replacement for Scripture, prayer, church, safety, and human help.']
    }
  };

  const HERO_ROTATOR = {
    uk: {
      prefix: 'Перш ніж будувати',
      suffix: '— перевірте оснування перед Богом.',
      words: ['сімʼю', 'бізнес', 'дім', 'організацію', 'партію', 'країну']
    },
    ru: {
      prefix: 'Прежде чем строить',
      suffix: '— проверьте основание перед Богом.',
      words: ['семью', 'бизнес', 'дом', 'организацию', 'партию', 'страну']
    },
    en: {
      prefix: 'Before building',
      suffix: '— test the foundation before God.',
      words: ['a family', 'a business', 'a home', 'an organization', 'a party', 'a country']
    }
  };

  const rotatorState = { index: 0, timer: null, locale: DEFAULT_LOCALE };

  function prefersReducedMotion() {
    return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function pageKey() {
    const path = root.location.pathname;
    if (path === '/' || path.endsWith('/')) return '/index.html';
    return '/' + path.split('/').pop();
  }

  function currentLocale() {
    const stored = root.localStorage && root.localStorage.getItem(STORAGE_KEY);
    const lang = stored || root.document.documentElement.lang || DEFAULT_LOCALE;
    return SUPPORTED.has(lang) ? lang : DEFAULT_LOCALE;
  }

  function translateNode(node, locale) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    const key = source.trim();
    if (!key) return;
    const leading = source.match(/^\s*/)[0];
    const trailing = source.match(/\s*$/)[0];
    node.nodeValue = locale === 'uk' ? source : leading + ((TEXT[locale] && TEXT[locale][key]) || key) + trailing;
  }

  function translateDocument(locale) {
    const walker = root.document.createTreeWalker(root.document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('[data-no-auto-translate]')) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => translateNode(node, locale));

    const meta = META[pageKey()] && META[pageKey()][locale];
    const desc = root.document.querySelector('meta[name="description"]');
    if (locale === 'uk') {
      root.document.title = originalTitle;
      if (desc) desc.setAttribute('content', originalDescription);
      return;
    }
    if (meta) {
      root.document.title = meta[0];
      if (desc) desc.setAttribute('content', meta[1]);
    }
  }

  function updateHeroRotatorWord(wordEl, nextText, animate) {
    if (!wordEl || wordEl.textContent === nextText) return;
    if (!animate || prefersReducedMotion()) {
      wordEl.textContent = nextText;
      return;
    }
    wordEl.classList.remove('is-entering');
    wordEl.classList.add('is-leaving');
    root.setTimeout(() => {
      wordEl.textContent = nextText;
      wordEl.classList.remove('is-leaving');
      wordEl.classList.add('is-entering');
      root.setTimeout(() => wordEl.classList.remove('is-entering'), 460);
    }, 260);
  }

  function applyHeroRotator(locale, animate = false) {
    const heading = root.document.querySelector('[data-build-heading]');
    if (!heading) return;
    const copy = HERO_ROTATOR[locale] || HERO_ROTATOR[DEFAULT_LOCALE];
    const prefix = heading.querySelector('[data-build-heading-prefix]');
    const suffix = heading.querySelector('[data-build-heading-suffix]');
    const wordEl = heading.querySelector('[data-build-word]');
    if (prefix) prefix.textContent = copy.prefix;
    if (suffix) suffix.textContent = copy.suffix;
    rotatorState.locale = locale;
    rotatorState.index = rotatorState.index % copy.words.length;
    updateHeroRotatorWord(wordEl, copy.words[rotatorState.index], animate);
  }

  function tickHeroRotator() {
    const heading = root.document.querySelector('[data-build-heading]');
    const wordEl = heading && heading.querySelector('[data-build-word]');
    const copy = HERO_ROTATOR[rotatorState.locale] || HERO_ROTATOR[DEFAULT_LOCALE];
    if (!heading || !wordEl || !copy.words.length) return;
    rotatorState.index = (rotatorState.index + 1) % copy.words.length;
    updateHeroRotatorWord(wordEl, copy.words[rotatorState.index], true);
  }

  function initHeroRotator() {
    if (!root.document.querySelector('[data-build-heading]')) return;
    if (rotatorState.timer) root.clearInterval(rotatorState.timer);
    applyHeroRotator(currentLocale(), false);
    if (!prefersReducedMotion()) {
      rotatorState.timer = root.setInterval(tickHeroRotator, 2300);
    }
  }

  function applyLocale(locale) {
    const next = SUPPORTED.has(locale) ? locale : DEFAULT_LOCALE;
    root.document.documentElement.lang = next;
    if (root.localStorage) root.localStorage.setItem(STORAGE_KEY, next);
    root.document.querySelectorAll('[data-site-lang] [data-lang]').forEach(button => {
      const active = button.dataset.lang === next;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    translateDocument(next);
    applyHeroRotator(next, true);
  }

  function initSiteLanguage() {
    applyLocale(currentLocale());
    initHeroRotator();
    root.document.querySelectorAll('[data-site-lang] [data-lang]').forEach(button => {
      button.addEventListener('click', () => applyLocale(button.dataset.lang));
    });
  }

  root.BeforeWeBuildSiteLanguage = { applyLocale, currentLocale, initSiteLanguage, applyHeroRotator };
  if (root.document) root.document.addEventListener('DOMContentLoaded', initSiteLanguage);
})(typeof window !== 'undefined' ? window : globalThis);
