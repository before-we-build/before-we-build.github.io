# Before We Build

Статичний сайт із трьома окремими інструментами:

- [`index.html`](index.html) — публічний тест без вікового питання;
- [`research-tests.html`](research-tests.html) — локальний дослідницький
  маршрут лише для повнолітніх учасників;
- [`relations-calculator.html`](relations-calculator.html) — калькулятор
  типологічних відношень.

Поточні опитувальники мають статус пілотних і невалідованих. Їхні результати
не є діагнозом і не мають використовуватися для важливих рішень про людину.

## Публічний тест

Усі модулі використовують один формат відповіді: шкалу `1–5` та
«не можу оцінити» (`N/A`). Дитячого, ігрового, карткового чи іншого
альтернативного режиму немає.

Перед стартом користувач обирає один модуль або повний маршрут:

| Модуль | Змістові пункти | Перевірки уваги | Разом |
| --- | ---: | ---: | ---: |
| Психософія | 48 | 1 | 49 |
| Темпористика | 48 | 1 | 49 |
| Соціоніка | 16 | 1 | 17 |
| Повний маршрут | 112 | 3 | 115 |

Публічний результат до завершення психометричної валідації містить лише:

- чотири описові ролі кожного аспекту Психософії та Темпористики;
- вісім описових шкал Соціоніки без TIM-коду;
- покриття відповідей та окремі індикатори їхньої якості.

Повні тип-коди, списки типів-кандидатів і типові рекомендації не входять ані
до публічного інтерфейсу, ані до публічного JSON-контракту.

Усе обчислення відбувається у браузері. Сторінка не надсилає відповіді на
сервер. Лише незавершений прогрес записується до `localStorage` після явного
вибору локального збереження; готовий публічний результат не зберігається.
Збережений прогрес можна видалити окремо від поточних відповідей. Після першої
відповіді зміна мови потребує підтвердженого перезапуску маршруту.

## Research

Research-маршрут доступний лише після окремого підтвердження `18+` та
інформованої згоди. Він пропонує тільки дорослі вікові діапазони, не має
маршруту для неповнолітніх і не зберігає відповіді автоматично.

Інтерфейс повертає ті самі описові профілі, а експериментальне ранжування
залишає лише в закритих деталях результату та локальному JSON-експорті.
Таке ранжування має явний статус `precalibration` і не заявляється як
визначений тип. JSON завантажується тільки за дією учасника; сторінка його
нікуди не передає.

Правила дослідницької програми й умови майбутньої публікації тип-кодів
описані в
[`docs/psychometric-validation-plan.md`](docs/psychometric-validation-plan.md).
Поточний статус G0–G7 — `not_started`; наявність протоколу не означає, що
валідацію вже проведено.

## Архітектура без збірника

Production залишається набором статичних HTML, CSS та нативних ES-модулів.
[`assets/tests.js`](assets/tests.js) — мінімальна точка входу, яка імпортує
[`assets/test/main.js`](assets/test/main.js). Функціональність розділена так:

| Модуль | Відповідальність |
| --- | --- |
| [`bank.js`](assets/test/bank.js) | завантаження pinned release, SHA-256 і структурна перевірка банку |
| [`scoring.js`](assets/test/scoring.js) | відтворювана рандомізація, описовий скоринг, coverage і quality flags |
| [`state.js`](assets/test/state.js) | прогрес v2, локальне збереження та active-time segments |
| [`contract.js`](assets/test/contract.js) | публічний і Research payload `2.0.0` |
| [`i18n.js`](assets/test/i18n.js) | єдиний словник кожної мови RU/EN/UK |
| [`ui-common.js`](assets/test/ui-common.js) | спільна шкала, профілі й доступні UI-компоненти |
| [`public-ui.js`](assets/test/public-ui.js) | публічний маршрут |
| [`research-ui.js`](assets/test/research-ui.js) | adult-only Research і локальний експорт |

Залежностей часу виконання та кроку збірки немає. Для локального перегляду
потрібен HTTP-сервер, бо браузер завантажує ES-модулі та snapshot через
`fetch`:

```bash
python3 -m http.server 8080
```

Після цього відкрийте `http://localhost:8080/`.

## Відтворюваний банк питань

Єдиним авторським джерелом є блок `~~~question-bank` у
`before-we-build-research/instruments/pilot-question-bank.md` сусіднього
research-репозиторію. Production не звертається до GitHub Raw, гілки
`main` чи будь-якої іншої змінюваної мережевої адреси.

Реліз використовує лише same-origin артефакти:

- [`assets/instruments/instrument-manifest.json`](assets/instruments/instrument-manifest.json);
- незмінюваний versioned snapshot, на який указує поле `file` маніфесту.

Маніфест фіксує `bankVersion`, SHA-256 точних байтів snapshot, джерело та для
кожного модуля — версію інструмента, measurement model, calibration status,
`contentItemCount` і `presentedItemCount`. Під час старту браузер перевіряє
hash і структуру; невідповідний банк не підмінюється мережевим fallback.

### Штатний випуск банку

1. Змінити й належно версіонувати canonical bank у research-репозиторії.
2. З кореня цього репозиторію згенерувати snapshot і маніфест:

   ```bash
   node scripts/sync-question-bank.mjs
   ```

   За замовчуванням скрипт читає сусідній
   `../before-we-build-research/instruments/pilot-question-bank.md`.
   Інший canonical-файл можна передати першим аргументом.

3. Перевірити точний hash, версії, кількість пунктів і контракт:

   ```bash
   node scripts/verify-instrument-release.mjs --canonical
   npm run test:unit
   ```

[`scripts/publish-canonical-bank.mjs`](scripts/publish-canonical-bank.mjs)
працює у зворотному напрямку: замінює question-bank block у canonical-файлі
поточним snapshot. Це не штатний крок авторського релізу; його слід запускати
лише для свідомого відновлення або початкової синхронізації, бо він
перезаписує canonical block.

Повна політика версій, hash і release gates зафіксована в
[`docs/research-support/question-bank-release-policy.json`](docs/research-support/question-bank-release-policy.json).

## Контракти даних v2

Готовий результат має `schemaVersion: "2.0.0"`,
`responseFormat: "likert-5-na"` та окремий `routeVersion`. Payload містить:

- посилання на версію і SHA-256 банку;
- маніфести вибраних модулів;
- точний seed, порядок блоків і порядок пунктів;
- wall-clock duration, active duration та pause/resume segments;
- відповіді з часом, описові scores, coverage і quality flags.

Лише Research додає adult consent, booklet metadata та
`experimentalRanking`. Публічний payload не містить `ageBand`, тип-кодів,
музики чи типових рекомендацій.

Прогрес також має схему `2.0.0` і зберігається під окремим v2-ключем.
Відновлення перевіряє версію банку, hash, маршрут, item ID, значення
відповідей і timing. Старий v1-прогрес вважається застарілим: інтерфейс
повідомляє про це й пропонує явно його видалити. Час між збереженням і
відновленням не додається до активного часу відповіді.

## Research-support артефакти

Машиночитні плани не стверджують, що відповідні роботи вже виконано:

- [`g0-content-work.json`](docs/research-support/g0-content-work.json) —
  cognitive interviews, blind Q-sort, TRAPD і content decisions;
- [`matrix-sampling-design.json`](docs/research-support/matrix-sampling-design.json) —
  anchors, booklet variants і контроль сусідства;
- [`feasibility-pilot.json`](docs/research-support/feasibility-pilot.json) —
  пілот 150–250 дорослих та його технічні outcomes;
- [`validation-gates.json`](docs/research-support/validation-gates.json) —
  залежності й evidence для G0–G7;
- [`question-bank-release-policy.json`](docs/research-support/question-bank-release-policy.json) —
  canonical/snapshot release policy.

Research runtime вже вміє відтворювати 12 стабільних, збалансованих між
варіантами booklet-схем, кодувати planned missingness і включати спільні
anchors. Поточний статус лишається `design_pending_g0`: anchor IDs навмисно
порожні, а чинні пули пред’являються повністю. Matrix sampling не можна
активувати для збору до G0, розширення пулів і замороженого preflight.

## Перевірка та CI

Повний локальний набір:

```bash
npm ci
npx playwright install chromium
npm test
```

Швидкий набір без браузера:

```bash
npm run test:unit
```

Тести перевіряють canonical bank, release history і hash, payload v2, seed
replay, прогрес та offline
pause timing, описовий скоринг, правильну/помилкову/пропущену перевірку
уваги, локалізації, калькулятор відношень і відсутність залишків
дитячого/ігрового режиму в production-файлах. Playwright проходить реальний
production UI у Chromium: RU/EN/UK, клавіатуру, 320 px, N/A,
save/resume/delete/reset, adult-only Research, локальний JSON-експорт,
правильну й помилкову перевірки уваги та axe accessibility.

GitHub Actions на кожному push і pull request окремо запускає Node.js
contract-тести з точним порівнянням canonical/snapshot і браузерний
Playwright/axe набір.
