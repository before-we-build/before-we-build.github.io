(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RelationsCalculator = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const LOCALES = ['uk', 'ru', 'en'];

  const SOCIONICS_TYPES = [
    ['ILE', 'Дон Кихот', 'ІЛЕ'], ['SEI', 'Дюма', 'СЕІ'], ['ESE', 'Гюго', 'ЕСЕ'], ['LII', 'Робеспьер', 'ЛІІ'],
    ['EIE', 'Гамлет', 'ЕІЕ'], ['LSI', 'Максим', 'ЛСІ'], ['SLE', 'Жуков', 'СЛЕ'], ['IEI', 'Есенин', 'ІЕІ'],
    ['SEE', 'Наполеон', 'СЕЕ'], ['ILI', 'Бальзак', 'ІЛІ'], ['LIE', 'Джек Лондон', 'ЛІЕ'], ['ESI', 'Драйзер', 'ЕСІ'],
    ['LSE', 'Штирлиц', 'ЛСЕ'], ['EII', 'Достоевский', 'ЕІІ'], ['IEE', 'Гексли', 'ІЕЕ'], ['SLI', 'Габен', 'СЛІ'],
  ].map(([code, ru, uk]) => ({ code, label: `${code} · ${ru}`, ru, uk }));

  const PSYCHOSOPHY_TYPES = permutations('LEVF').map(code => ({ code, label: code }));
  const TEMPORISTICS_TYPES = ['NEFP','NFEP','PEFN','PFEN','EFNP','ENFP','PNFE','PFNE','EPFN','EFPN','NFPE','NPFE','EPNF','ENPF','FNPE','FPNE','NPEF','NEPF','FPEN','FEPN','FNEP','FENP','PENF','PNEF']
    .map(code => ({ code, label: code }));

  const SOCIONICS_RELATIONS = {
    identity: {
      name: { uk: 'Тотожність', ru: 'Тождественные', en: 'Identity' },
      meaning: { uk: 'Однакова інформаційна будова: легко впізнавати звички мислення, але сліпі місця також схожі.', ru: 'Одинаковая информационная структура: легко узнавать привычки мышления, но слепые зоны тоже похожи.', en: 'Same information structure: easy recognition, with shared blind spots.' }
    },
    duality: {
      name: { uk: 'Дуальність', ru: 'Дуальные', en: 'Duality' },
      meaning: { uk: 'Взаємне доповнення сильних і слабких ціннісних зон на тактичному рівні інформаційного обміну.', ru: 'Взаимное дополнение сильных и слабых ценностных зон на тактическом уровне информационного обмена.', en: 'Reciprocal valued-weak complement at the tactical information-exchange layer.' }
    },
    activation: { name: { uk: 'Активація', ru: 'Активация', en: 'Activation' }, meaning: { uk: 'Може давати енергію та рух, але стимуляція не дорівнює стійкості.', ru: 'Может давать энергию и движение, но стимуляция не равна устойчивости.', en: 'Can be energizing, but stimulation is not the same as stability.' } },
    mirror: { name: { uk: 'Дзеркальні', ru: 'Зеркальные', en: 'Mirror' }, meaning: { uk: 'Схожі цінності з іншим кутом уваги: взаємне уточнення без повної тотожності.', ru: 'Схожие ценности с другим углом внимания: взаимное уточнение без полной одинаковости.', en: 'Similar valued themes with a different emphasis.' } },
    kindred: { name: { uk: 'Родинні', ru: 'Родственные', en: 'Kindred' }, meaning: { uk: 'Спільна провідна орієнтація з різною системою підтримки.', ru: 'Общая ведущая ориентация при разной системе поддержки.', en: 'Shared leading orientation with different supports.' } },
    business: { name: { uk: 'Ділові', ru: 'Деловые', en: 'Business' }, meaning: { uk: 'Координація навколо сильних сторін без глибокого закриття слабких потреб.', ru: 'Координация вокруг сильных сторон без глубокого закрытия слабых потребностей.', en: 'Strong-function coordination without full weak-zone relief.' } },
    mirage: { name: { uk: 'Міражні', ru: 'Миражные', en: 'Mirage' }, meaning: { uk: 'Часткова легкість із нестійким узгодженням під тиском.', ru: 'Частичная легкость с неустойчивым согласованием под давлением.', en: 'Partial comfort with unstable closure under pressure.' } },
    superego: { name: { uk: 'Супер-его', ru: 'Супер-эго', en: 'Super-Ego' }, meaning: { uk: 'Формальна або напружена взаємодія навколо слабких регуляторних зон.', ru: 'Формальное или напряженное взаимодействие вокруг слабых регуляторных зон.', en: 'Potential strain around conscious weak regulation zones.' } },
    quasi: { name: { uk: 'Квазітотожність', ru: 'Квазитождество', en: 'Quasi-identity' }, meaning: { uk: 'Схожі теми, але інші пріоритети та цінності.', ru: 'Похожие темы, но другие приоритеты и ценности.', en: 'Similar themes with different priorities.' } },
    extinguishment: { name: { uk: 'Погашення', ru: 'Погашение', en: 'Extinguishment' }, meaning: { uk: 'Один ракурс може гасити або перебивати ініціативу іншого.', ru: 'Один ракурс может гасить или перебивать инициативу другого.', en: 'One framing may dampen the other’s initiative.' } },
    conflict: { name: { uk: 'Конфліктні', ru: 'Конфликтные', en: 'Conflict' }, meaning: { uk: 'Сильна подача однієї сторони часто потрапляє в слабкі неціннісні зони іншої.', ru: 'Сильная подача одной стороны часто попадает в слабые неценностные зоны другой.', en: 'Confident information often lands in the other’s weak/unvalued zones.' } },
    semidual: { name: { uk: 'Напівдуальність', ru: 'Полудуальные', en: 'Semi-duality' }, meaning: { uk: 'Частина доповнення є, але повний обмін не замикається.', ru: 'Часть дополнения есть, но полный обмен не замыкается.', en: 'Some complementary coverage without full closure.' } },
    benefit: { name: { uk: 'Соціальне замовлення', ru: 'Социальный заказ', en: 'Benefit / Request' }, meaning: { uk: 'Асиметрична мобілізація: напрям потрібно називати окремо.', ru: 'Асимметричная мобилизация: направление нужно называть отдельно.', en: 'Asymmetric mobilization; direction must be named.' } },
    supervision: { name: { uk: 'Ревізія', ru: 'Ревизия', en: 'Supervision' }, meaning: { uk: 'Асиметричний тиск на вразливу інформаційну зону.', ru: 'Асимметричное давление на уязвимую информационную зону.', en: 'Asymmetric pressure on the vulnerable information zone.' } },
  };

  const SOCIONICS_PAIR_RELATIONS = buildSocionicsPairs();

  const PSYCHOSOPHY_RELATION_LEGEND = {
    '1234': rel('PH', 'Філія', 'Филия', 'Philia', 'та сама позиційна структура; впізнавання і схожі труднощі'),
    '1243': rel('PPH', 'Псевдофілія', 'Псевдофилия', 'Pseudophilia', 'верхня схожість із нижнім розходженням'),
    '1324': rel('MR', 'Міраж', 'Мираж', 'Mirage', 'приваблива, але нестійка невідповідність'),
    '1342': rel('TMR', 'Часткова підтримка з помилковим читанням', 'Частичная поддержка с ошибочным чтением', 'Partial support with misreading', 'допомога змішана з поганим перекладом'),
    '1423': rel('TAT', 'Асиметрична підтримка-притягання', 'Асимметричная поддержка-притяжение', 'Asymmetric support-attraction', 'підтримка і притягання без рівності ролей'),
    '1432': rel('NT', 'Нейтральність', 'Нейтральность', 'Neutrality', 'низька активація, ввічлива дистанція'),
    '2134': rel('AG', 'Агапе', 'Агапэ', 'Agape', 'гнучка підтримка і операційне доповнення'),
    '2143': rel('ORD', 'Порядок', 'Порядок', 'Order', 'одна сторона веде, інша підхоплює'),
    '2314': rel('AG2', 'Ланцюг підтримки', 'Цепь поддержки', 'Guidance chain', 'підтримка з домішкою тиску'),
    '2341': rel('ROT', 'Пряма ротація', 'Прямая ротация', 'Forward rotation', 'функції проходять через позиції'),
    '2413': rel('TG', 'Спрямування з ризиком тиску', 'Направление с риском давления', 'Guidance with pressure risk', 'порада може зачіпати вразливість'),
    '2431': rel('SUP', 'Підтримувальна інверсія', 'Поддерживающая инверсия', 'Supportive inversion', 'часткова інверсія з потенціалом підтримки'),
    '3124': rel('OR', 'Контакт сили з раною', 'Контакт силы с раной', 'Target-wound contact', 'сильна функція торкається вразливої'),
    '3142': rel('RV', 'Надтиск із компенсацією', 'Сверхдавление с компенсацией', 'Overpressure with compensation', 'корекція частково врівноважується нижніми позиціями'),
    '3214': rel('RV2', 'Інверсія рани', 'Инверсия раны', 'Target-wound inversion', 'посилений контакт сили і вразливості'),
    '3241': rel('CP', 'Тиск конфлікту', 'Давление конфликта', 'Conflict pressure', 'тиск навколо вразливих зон'),
    '3412': rel('ER', 'Ерос', 'Эрос', 'Eros', 'сильне притягання і активація ран'),
    '3421': rel('EX', 'Взаємне приглушення', 'Взаимное приглушение', 'Mutual damping', 'дистанція, приглушення, формальна повага'),
    '4123': rel('AN', 'Опорний ланцюг', 'Опорная цепь', 'Anchor-development chain', 'сильне підтримує слабке через розвиток'),
    '4132': rel('ANW', 'Опора з раною', 'Опора с раной', 'Anchor with wound', 'опора плюс активована вразливість'),
    '4213': rel('MX', 'Обмін опори і тиску', 'Обмен опоры и давления', 'Anchor-pressure exchange', 'підтримка і тиск співіснують'),
    '4231': rel('SW', 'Спільна рана з опорою', 'Общая рана с опорой', 'Shared wound with anchoring', 'спільна чутливість плюс взаємна опора'),
    '4312': rel('FC', 'Майже повне доповнення з ризиком тиску', 'Почти полное дополнение с риском давления', 'Near-full complement', 'широке доповнення, але потрібні межі'),
    '4321': rel('CS', 'Повна операційна інверсія', 'Полная операционная инверсия', 'Full operational inversion', 'широке доповнення з ризиком залежності'),
  };

  const TEMPORISTICS_RELATION_LEGEND = {
    '1234': rel('1234', 'Та сама позиційна узгодженість', 'То же позиционное согласование', 'Same-position alignment', 'усі часові аспекти займають ті самі позиції'),
    '1243': rel('1243', 'Обмін болючого і сліпого', 'Обмен болезненного и слепого', 'Painful-blind swap', 'резонанс із ризиком слабких зон'),
    '1324': rel('1324', 'Обмін творчого і болючого', 'Обмен творческого и болезненного', 'Creative-painful swap', 'можлива підтримка або тиск'),
    '1342': rel('1342', 'Нижній цикл зі спільною ціллю', 'Нижний цикл с общей целью', 'Target-aligned lower cycle', 'ціль збігається, нижні позиції обертаються'),
    '1423': rel('1423', 'Зворотний нижній цикл зі спільною ціллю', 'Обратный нижний цикл с общей целью', 'Target-aligned reverse lower cycle', 'змішана підтримка'),
    '1432': rel('1432', 'Спільна ціль і спільна рана', 'Общая цель и общая рана', 'Target-painful alignment', 'схожість із спільною вразливістю'),
    '2134': rel('2134', 'Обмін цілі і творчості', 'Обмен цели и творчества', 'Target-creative swap', 'паралельний резонанс'),
    '2143': rel('2143', 'Подвійна вісь обміну', 'Двойная ось обмена', 'Double axis swap', 'резонанс плюс ризик рани/сліпоти'),
    '2314': rel('2314', 'Цикл верхньої тріади', 'Цикл верхней триады', 'Upper-triad cycle', 'асиметричне спрямування'),
    '2341': rel('2341', 'Повна пряма ротація', 'Полная прямая ротация', 'Full forward rotation', 'стратегічна циркуляція'),
    '2413': rel('2413', 'Повний цикл з ризиком надтиску', 'Полный цикл с риском сверхдавления', 'Mixed pressure cycle', 'ціль переходить у творчу з домішкою тиску'),
    '2431': rel('2431', 'Цикл зі спільною болючою позицією', 'Цикл с общей болезненной позицией', 'Shared painful cycle', 'змішана підтримка плюс спільна рана'),
    '3124': rel('3124', 'Цикл цілі і болю', 'Цикл цели и боли', 'Target-painful-creative cycle', 'гіпотеза ризику тиску'),
    '3142': rel('3142', 'Цикл цілі в болю', 'Цикл цели в боли', 'Target-painful-blind-creative cycle', 'надтиск і ризик захисту'),
    '3214': rel('3214', 'Обмін цілі і болю', 'Обмен цели и боли', 'Target-painful swap', 'надтиск плюс спільна сліпота'),
    '3241': rel('3241', 'Фрагментаційний цикл', 'Фрагментационный цикл', 'Fragmentation cycle', 'тиск, нехтування і творча схожість'),
    '3412': rel('3412', 'Подвійний обмін тиску й опори', 'Двойной обмен давления и опоры', 'Double pressure-anchor swap', 'сильне доповнення з високим тиском'),
    '3421': rel('3421', 'Ризикований розвивальний цикл', 'Рискованный развивающий цикл', 'Risky development cycle', 'можливе зростання або розрив'),
    '4123': rel('4123', 'Повна зворотна ротація', 'Полная обратная ротация', 'Full reverse rotation', 'опорне доповнення'),
    '4132': rel('4132', 'Опора зі спільною раною', 'Опора с общей раной', 'Anchor with shared wound', 'опора і спільна вразливість'),
    '4213': rel('4213', 'Цикл сліпоти і болю', 'Цикл слепоты и боли', 'Blind-painful cycle', 'змішане доповнення з тиском'),
    '4231': rel('4231', 'Обмін цілі і сліпоти', 'Обмен цели и слепоты', 'Target-blind swap', 'опора плюс спільна рана'),
    '4312': rel('4312', 'Доповнення з ризиком', 'Дополнение с риском', 'Complement with risk', 'ціль потрапляє в сліпу позицію'),
    '4321': rel('4321', 'Повна структурна інверсія', 'Полная структурная инверсия', 'Full structural inversion', 'повна гіпотеза стратегічного доповнення'),
  };

  const TEXT = {
    uk: {
      title: 'Калькулятор типових відношень',
      intro: 'Виберіть типи у трьох системах. Результат показує три різні шари: тактичний інформаційний обмін, операційну організацію дії і стратегічний часовий каркас.',
      a: 'Людина А', b: 'Людина Б', calculate: 'Показати відношення', reset: 'Очистити',
      caveat: 'Це не вирок, не відсоток сумісності і не заміна Писання, молитви, сумління та мудрої поради.',
      socionics: 'Соціоніка', psychosophy: 'Психософія', temporistics: 'Темпористика', signature: 'Сигнатура', direction: 'Напрям',
      choose: 'Оберіть тип', summary: 'Підсумок'
    },
    ru: {
      title: 'Калькулятор типовых отношений',
      intro: 'Выберите типы в трёх системах. Результат показывает три разные слоя: тактический информационный обмен, операционную организацию действия и стратегический временной каркас.',
      a: 'Человек А', b: 'Человек Б', calculate: 'Показать отношения', reset: 'Очистить',
      caveat: 'Это не является приговором, процентом совместимости или заменой Писания, молитвы, совести и мудрого совета.',
      socionics: 'Соционика', psychosophy: 'Психософия', temporistics: 'Темпористика', signature: 'Сигнатура', direction: 'Направление',
      choose: 'Выберите тип', summary: 'Итог'
    },
    en: {
      title: 'Typical relations calculator',
      intro: 'Choose types in three systems. The result separates tactical information exchange, operational action organization, and strategic temporal framing.',
      a: 'Person A', b: 'Person B', calculate: 'Show relations', reset: 'Clear',
      caveat: 'This is not a verdict, a compatibility percentage, or a replacement for Scripture, prayer, conscience, and wise counsel.',
      socionics: 'Socionics', psychosophy: 'Psychosophy', temporistics: 'Temporistics', signature: 'Signature', direction: 'Direction',
      choose: 'Choose type', summary: 'Summary'
    }
  };

  function permutations(chars) {
    const arr = chars.split('');
    const out = [];
    function walk(prefix, rest) {
      if (!rest.length) out.push(prefix.join(''));
      else rest.forEach((ch, i) => walk([...prefix, ch], rest.filter((_, j) => j !== i)));
    }
    walk([], arr);
    return out;
  }

  function rel(code, uk, ru, en, short) {
    return { code, name: { uk, ru, en }, meaning: { uk: short, ru: short, en: short } };
  }

  function pairKey(a, b) { return `${a}:${b}`; }

  function addSym(map, a, b, code) { map[pairKey(a, b)] = code; map[pairKey(b, a)] = code; }
  function addDir(map, a, b, code, roleAB, roleBA) { map[pairKey(a, b)] = { code, role: roleAB }; map[pairKey(b, a)] = { code, role: roleBA }; }

  function buildSocionicsPairs() {
    const m = {};
    const types = SOCIONICS_TYPES.map(t => t.code);
    types.forEach(t => addSym(m, t, t, 'identity'));
    [['ILE','SEI'],['ESE','LII'],['EIE','LSI'],['SLE','IEI'],['SEE','ILI'],['LIE','ESI'],['LSE','EII'],['IEE','SLI']].forEach(p => addSym(m, ...p, 'duality'));
    [['ILE','ESE'],['SEI','LII'],['EIE','SLE'],['LSI','IEI'],['SEE','LIE'],['ILI','ESI'],['LSE','IEE'],['EII','SLI']].forEach(p => addSym(m, ...p, 'activation'));
    [['ILE','LII'],['SEI','ESE'],['EIE','IEI'],['LSI','SLE'],['SEE','ESI'],['ILI','LIE'],['LSE','SLI'],['EII','IEE']].forEach(p => addSym(m, ...p, 'mirror'));
    [['ILE','EIE'],['SEI','LSI'],['ESE','SLE'],['LII','IEI'],['SEE','LSE'],['ILI','EII'],['LIE','IEE'],['ESI','SLI']].forEach(p => addSym(m, ...p, 'kindred'));
    [['ILE','SLE'],['SEI','IEI'],['ESE','EIE'],['LII','LSI'],['SEE','IEE'],['ILI','SLI'],['LIE','LSE'],['ESI','EII']].forEach(p => addSym(m, ...p, 'business'));
    [['ILE','IEI'],['SEI','SLE'],['ESE','LSI'],['LII','EIE'],['SEE','SLI'],['ILI','IEE'],['LIE','EII'],['ESI','LSE']].forEach(p => addSym(m, ...p, 'mirage'));
    [['ILE','SEE'],['SEI','ILI'],['ESE','LIE'],['LII','ESI'],['EIE','LSE'],['LSI','EII'],['SLE','IEE'],['IEI','SLI']].forEach(p => addSym(m, ...p, 'superego'));
    [['ILE','ILI'],['SEI','SEE'],['ESE','ESI'],['LII','LIE'],['EIE','EII'],['LSI','LSE'],['SLE','SLI'],['IEI','IEE']].forEach(p => addSym(m, ...p, 'quasi'));
    [['ILE','LIE'],['SEI','ESI'],['ESE','SEE'],['LII','ILI'],['EIE','IEE'],['LSI','SLI'],['SLE','LSE'],['IEI','EII']].forEach(p => addSym(m, ...p, 'extinguishment'));
    [['ILE','ESI'],['SEI','LIE'],['ESE','ILI'],['LII','SEE'],['EIE','SLI'],['LSI','IEE'],['SLE','EII'],['IEI','LSE']].forEach(p => addSym(m, ...p, 'conflict'));
    [['ILE','IEE'],['SEI','SLI'],['ESE','EII'],['LII','LSE'],['EIE','SEE'],['LSI','ILI'],['SLE','LIE'],['IEI','ESI']].forEach(p => addSym(m, ...p, 'semidual'));
    [['ILE','LSE'],['SEI','EII'],['ESE','IEE'],['LII','SLI'],['EIE','SEE'],['LSI','ILI'],['SLE','LIE'],['IEI','ESI']].forEach(([a,b]) => addDir(m, a, b, 'benefit', 'benefactor', 'beneficiary'));
    [['ILE','LSI'],['SEI','EIE'],['ESE','IEI'],['LII','SLE']].forEach(([a,b]) => addDir(m, a, b, 'supervision', 'supervisor', 'supervisee'));
    return m;
  }

  function analyzeSocionicsPair(a, b) {
    const value = SOCIONICS_PAIR_RELATIONS[pairKey(a, b)] || 'quasi';
    const code = typeof value === 'string' ? value : value.code;
    const role = typeof value === 'object' ? value.role : null;
    return {
      system: 'socionics',
      level: { uk: 'тактичний шар інформаційного обміну', ru: 'тактический слой информационного обмена', en: 'tactical information-exchange layer' },
      a, b,
      relation: { code, ...SOCIONICS_RELATIONS[code] },
      direction: directionText(code, role),
    };
  }

  function directionText(code, role) {
    if (!role) return { uk: 'симетрично або без окремої ролі напряму', ru: 'симметрично или без отдельной роли направления', en: 'symmetric or no separate directional role' };
    if (code === 'benefit') return role === 'benefactor'
      ? { uk: 'А виступає як замовник/бенефактор для Б', ru: 'А выступает как заказчик/бенефактор для Б', en: 'A is the benefactor/request sender toward B' }
      : { uk: 'А приймає замовлення/є бенефіціаром щодо Б', ru: 'А принимает заказ/является бенефициаром относительно Б', en: 'A is the beneficiary/request receiver toward B' };
    return role === 'supervisor'
      ? { uk: 'А виступає ревізором щодо Б', ru: 'А выступает ревизором относительно Б', en: 'A is the supervisor toward B' }
      : { uk: 'А перебуває у позиції підревізного щодо Б', ru: 'А находится в позиции подревизного относительно Б', en: 'A is the supervisee toward B' };
  }

  function signatureFromTypes(a, b) {
    const posB = Object.fromEntries([...b].map((ch, i) => [ch, String(i + 1)]));
    return [...a].map(ch => posB[ch]).join('');
  }

  function analyzePermutationPair(a, b, legend, system) {
    const signature = signatureFromTypes(a, b);
    const relation = legend[signature];
    const labels = {
      psychosophy: { uk: 'операційний шар дії, волі, логіки, емоції та фізики', ru: 'операционный слой действия, воли, логики, эмоции и физики', en: 'operational layer of action, will, logic, emotion, and physics' },
      temporistics: { uk: 'стратегічний шар часу, памʼяті, місця, майбутнього і сенсу', ru: 'стратегический слой времени, памяти, места, будущего и смысла', en: 'strategic layer of time, memory, place, future, and meaning' },
    };
    return { system, level: labels[system], a, b, signature, relation };
  }

  function buildCompositeReport(input, locale = 'uk') {
    const lang = LOCALES.includes(locale) ? locale : 'uk';
    const layers = [
      analyzeSocionicsPair(input.socionicsA, input.socionicsB),
      analyzePermutationPair(input.psychosophyA, input.psychosophyB, PSYCHOSOPHY_RELATION_LEGEND, 'psychosophy'),
      analyzePermutationPair(input.temporisticsA, input.temporisticsB, TEMPORISTICS_RELATION_LEGEND, 'temporistics'),
    ];
    const summary = {
      uk: 'Порівнюються три шари: інформаційний, операційний і стратегічний. Сильний або важкий висновок в одному шарі не скасовує інших шарів і не є рішенням про людину.',
      ru: 'Сравниваются три слоя: информационный, операционный и стратегический. Сильный или трудный вывод в одном слое не отменяет другие слои и не является решением о человеке.',
      en: 'The report compares three layers: informational, operational, and strategic. A strong or difficult result in one layer does not cancel the other layers and is not a verdict about a person.',
    }[lang];
    const caveats = [{ uk: 'Це не є вироком і не визначає Божу волю.', ru: 'Это не является приговором и не определяет Божью волю.', en: 'This is not a verdict and does not determine God’s will.' }[lang]];
    return { locale: lang, layers, summary, caveats };
  }

  function optionHtml(types, lang) {
    return `<option value="">${TEXT[lang].choose}</option>` + types.map(t => `<option value="${t.code}">${t.label}</option>`).join('');
  }

  function renderApp(mount, lang = document.documentElement.lang || 'uk') {
    const locale = lang.startsWith('ru') ? 'ru' : lang.startsWith('en') ? 'en' : 'uk';
    const t = TEXT[locale];
    mount.innerHTML = `
      <div class="calculator-shell">
        <p class="eyebrow">${t.summary}</p><h1>${t.title}</h1><p class="lead">${t.intro}</p>
        <form class="calculator-form" data-calculator-form>
          ${selectBlock('socionics', t.socionics, SOCIONICS_TYPES, locale, t)}
          ${selectBlock('psychosophy', t.psychosophy, PSYCHOSOPHY_TYPES, locale, t)}
          ${selectBlock('temporistics', t.temporistics, TEMPORISTICS_TYPES, locale, t)}
          <div class="actions"><button class="primary" type="submit">${t.calculate}</button><button type="reset">${t.reset}</button></div>
        </form>
        <p class="note">${t.caveat}</p>
        <section class="relation-results" data-relation-results aria-live="polite"></section>
      </div>`;
    const form = mount.querySelector('[data-calculator-form]');
    const results = mount.querySelector('[data-relation-results]');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const fd = new FormData(form);
      const required = ['socionicsA','socionicsB','psychosophyA','psychosophyB','temporisticsA','temporisticsB'];
      if (required.some(key => !fd.get(key))) { results.innerHTML = `<article class="card"><p>${t.choose}</p></article>`; return; }
      const report = buildCompositeReport(Object.fromEntries(fd.entries()), locale);
      results.innerHTML = renderReport(report, locale);
    });
    form.addEventListener('reset', () => { results.innerHTML = ''; });
    document.querySelectorAll('[data-site-lang] [data-lang]').forEach(button => {
      button.addEventListener('click', () => renderApp(mount, button.dataset.lang));
    });
  }

  function selectBlock(prefix, title, types, locale, t) {
    return `<fieldset class="calculator-fieldset"><legend>${title}</legend><label>${t.a}<select name="${prefix}A">${optionHtml(types, locale)}</select></label><label>${t.b}<select name="${prefix}B">${optionHtml(types, locale)}</select></label></fieldset>`;
  }

  function renderReport(report, lang) {
    const t = TEXT[lang];
    return `<article class="card relation-summary"><h2>${t.summary}</h2><p>${report.summary}</p></article>` + report.layers.map(layer => {
      const systemName = t[layer.system] || layer.system;
      const sig = layer.signature ? `<p><b>${t.signature}:</b> ${layer.signature}</p>` : '';
      const dir = layer.direction ? `<p><b>${t.direction}:</b> ${layer.direction[lang]}</p>` : '';
      return `<article class="card relation-card"><span class="chip">${systemName}</span><h3>${layer.relation.name[lang]}</h3><p class="muted">${layer.level[lang]}</p><p>${layer.relation.meaning[lang]}</p>${sig}${dir}</article>`;
    }).join('') + `<article class="card"><p>${report.caveats.join(' ')}</p></article>`;
  }

  function boot() {
    const mount = document.querySelector('[data-relations-calculator-app]');
    if (mount) renderApp(mount);
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }

  return { SOCIONICS_TYPES, PSYCHOSOPHY_TYPES, TEMPORISTICS_TYPES, SOCIONICS_RELATIONS, PSYCHOSOPHY_RELATION_LEGEND, TEMPORISTICS_RELATION_LEGEND, analyzeSocionicsPair, analyzePermutationPair, buildCompositeReport, signatureFromTypes, renderApp };
});
