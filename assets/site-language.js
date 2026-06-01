(function(root){
  'use strict';

  const STORAGE_KEY = 'before-we-build-lang';
  const DEFAULT_LOCALE = 'uk';
  const SUPPORTED = new Set(['uk', 'ru', 'en']);

  function currentLocale() {
    const stored = root.localStorage && root.localStorage.getItem(STORAGE_KEY);
    const lang = stored || root.document.documentElement.lang || DEFAULT_LOCALE;
    return SUPPORTED.has(lang) ? lang : DEFAULT_LOCALE;
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
  }

  function initSiteLanguage() {
    applyLocale(currentLocale());
    root.document.querySelectorAll('[data-site-lang] [data-lang]').forEach(button => {
      button.addEventListener('click', () => applyLocale(button.dataset.lang));
    });
  }

  root.BeforeWeBuildSiteLanguage = { applyLocale, currentLocale, initSiteLanguage };
  if (root.document) root.document.addEventListener('DOMContentLoaded', initSiteLanguage);
})(typeof window !== 'undefined' ? window : globalThis);
