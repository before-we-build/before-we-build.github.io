# Before We Build — сайт GitHub Pages

Статичний сайт GitHub Pages для публічного входу Before We Build.

Адреса сайту: <https://before-we-build.github.io/>

Джерельна база знань: <https://github.com/before-we-build/before-we-build-research>

## Локальний перегляд

```bash
python3 -m http.server 8080
```

Відкрийте <http://localhost:8080>.

## Примітки

- Статичний HTML/CSS/JS без зовнішніх залежностей.
- Візуалізації формуються в `assets/site.js`.
- Можливе майбутнє покращення: автоматично формувати дані графа з wikilinks у `before-we-build-research/wiki/**/*.md`.
