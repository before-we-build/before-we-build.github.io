# Before We Build — тест і калькулятор

- `index.html` — інтерактивний типологічний тест. Відповіді обробляються локально у браузері.
- `relations-calculator.html` — калькулятор типових відношень у соціоніці, психософії та темпористиці.

## Банк питань

Сайт завантажує актуальний банк із `before-we-build-research/instruments/pilot-question-bank.md` через GitHub Raw. Банк — це один Markdown-файл зі строгим блоком `~~~question-bank`, що містить валідний JSON. Вбудований у `assets/tests.js` набір використовується лише як резервний варіант, якщо research-репозиторій тимчасово недоступний.

## Перевірка

```bash
node --test tests/*.test.mjs
```

## Локальний перегляд

```bash
python3 -m http.server 8080
```
