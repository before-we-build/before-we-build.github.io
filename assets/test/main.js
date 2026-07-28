import { loadPinnedQuestionBank } from './bank.js';
import { copyFor, normalizeLanguage, translateStaticDocument } from './i18n.js';
import { PublicTestApp } from './public-ui.js';
import { ResearchTestApp } from './research-ui.js';

function unavailableStorage() {
  return {
    getItem() {
      throw new Error('Local storage is unavailable');
    },
    setItem() {
      throw new Error('Local storage is unavailable');
    },
    removeItem() {
      throw new Error('Local storage is unavailable');
    }
  };
}

function storageFor(window) {
  try {
    return window.localStorage;
  } catch {
    return unavailableStorage();
  }
}

function safeStorageGet(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    // The questionnaire remains usable without persistence.
  }
}

function updateLanguageControls(document, language) {
  const copy = copyFor(language);
  document.querySelectorAll('[data-lang]').forEach(button => {
    const active = button.dataset.lang === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
    const languageName = copy.languageNames[button.dataset.lang];
    if (languageName) {
      button.setAttribute('aria-label', languageName);
      button.setAttribute('title', languageName);
    }
  });
}

export async function bootstrap({ document = globalThis.document, window = globalThis.window } = {}) {
  const panel = document.querySelector('#testPanel');
  if (!panel) return null;
  const storage = storageFor(window);
  let language = normalizeLanguage(safeStorageGet(storage, 'before-we-build-lang') || 'uk');
  let app = null;
  let loadFailed = false;
  const syncLanguage = nextLanguage => {
    language = normalizeLanguage(nextLanguage);
    safeStorageSet(storage, 'before-we-build-lang', language);
    translateStaticDocument(document, language);
    updateLanguageControls(document, language);
  };
  const renderLoadState = () => {
    const copy = copyFor(language);
    panel.innerHTML = loadFailed
      ? `<p class="status-message error" role="alert">${copy.loadError}</p>`
      : `<p class="status-message">${copy.loading}</p>`;
  };
  syncLanguage(language);
  renderLoadState();

  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
      const nextLanguage = normalizeLanguage(button.dataset.lang);
      if (app && !app.changeLanguage(nextLanguage)) return;
      syncLanguage(nextLanguage);
      if (!app) renderLoadState();
    });
  });

  let release;
  try {
    release = await loadPinnedQuestionBank();
  } catch (error) {
    console.error('Pinned question-bank verification failed.', error);
    loadFailed = true;
    renderLoadState();
    return null;
  }

  globalThis.beforeWeBuildQuestionBankVersion = release.manifest.bankVersion;
  const audience = document.body?.dataset?.testAudience === 'research' ? 'research' : 'public';
  app = audience === 'research'
    ? new ResearchTestApp({
      document,
      window,
      storage,
      bank: release.bank,
      manifest: release.manifest,
      language
    })
    : new PublicTestApp({
      document,
      window,
      storage,
      bank: release.bank,
      manifest: release.manifest,
      language,
      onLanguageChanged: syncLanguage
    });
  app.render();

  globalThis.beforeWeBuildTestApp = app;
  return app;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bootstrap());
  else bootstrap();
}
