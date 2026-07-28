import { getItemById, buildRouteItems, qualityFlagsForResponses, routeCoverage, scoreModule } from './scoring.js';
import {
  clearAllStoredTestData,
  clearLegacyLocalData,
  clearProgress,
  claimProgress,
  hasAnyAnswer,
  hasLegacyResultData,
  PUBLIC_MODULE_ORDER,
  markItemShown,
  newRouteState,
  pauseRoute,
  PROGRESS_KEY,
  readProgress,
  recordAnswer,
  restoreProgress,
  resumeRoute,
  saveProgress
} from './state.js';
import { buildPublicPayload, publicPayloadIsDescriptiveOnly } from './contract.js';
import { copyFor } from './i18n.js';
import {
  escapeHtml,
  focusHeading,
  renderPositionProfile,
  renderQuality,
  renderQuestion,
  renderSocionicsProfile,
  responseRecordsForRoute,
  setLiveStatus
} from './ui-common.js';

function titleForModule(key, copy) {
  return {
    psychosophy: copy.routePsychosophy,
    temporistics: copy.routeTemporistics,
    socionics: copy.routeSocionics
  }[key];
}

function routeCard(key, title, text) {
  return `<button type="button" class="public-route-card" data-route="${key}">
    <strong>${escapeHtml(title)}</strong>
    <span>${escapeHtml(text)}</span>
  </button>`;
}

export class PublicTestApp {
  constructor({
    document,
    window,
    storage,
    bank,
    manifest,
    language,
    onLanguageChanged = null
  }) {
    this.document = document;
    this.window = window;
    this.storage = storage;
    this.bank = bank;
    this.manifest = manifest;
    this.language = language;
    this.onLanguageChanged = onLanguageChanged;
    this.panel = document.querySelector('#testPanel');
    this.itemById = getItemById(bank);
    this.state = null;
    this.route = null;
    this.lastPayload = null;
    this.storageWarning = false;
    this.autoPaused = false;
    this.boundStorage = event => {
      if (
        event.key !== PROGRESS_KEY
        || !this.state?.saveLocal
      ) return;
      try {
        const next = JSON.parse(event.newValue);
        if (
          next.sessionId === this.state.sessionId
          && next.writerId === this.state.writerId
        ) return;
      } catch {
        // Treat malformed external writes as a conflict.
      }
      this.state.saveLocal = false;
      this.storageWarning = 'conflict';
      setLiveStatus(this.panel, this.copy.storageConflict);
    };
    this.boundBeforeUnload = event => {
      if (!this.hasUnsavedAnswers()) return;
      event.preventDefault();
      event.returnValue = '';
    };
    this.boundAutoPause = () => {
      if (!this.state || this.lastPayload || this.state.paused) return;
      pauseRoute(this.state);
      this.autoPaused = true;
      this.persistProgress();
    };
    this.boundAutoResume = () => {
      if (!this.state || this.lastPayload || !this.autoPaused) return;
      resumeRoute(this.state);
      this.autoPaused = false;
      markItemShown(this.state, this.route.items[this.state.step].id);
      this.persistProgress();
    };
    this.boundVisibilityChange = () => {
      if (this.document.hidden) this.boundAutoPause();
      else this.boundAutoResume();
    };
    window.addEventListener('beforeunload', this.boundBeforeUnload);
    window.addEventListener('storage', this.boundStorage);
    window.addEventListener('pagehide', this.boundAutoPause);
    window.addEventListener('pageshow', this.boundAutoResume);
    document.addEventListener('visibilitychange', this.boundVisibilityChange);
  }

  get copy() {
    return copyFor(this.language);
  }

  hasUnsavedAnswers() {
    return Boolean(this.state && hasAnyAnswer(this.state) && !this.state.saveLocal && this.state.dirty);
  }

  canChangeLanguage(nextLanguage) {
    if (!this.state || !hasAnyAnswer(this.state)) return true;
    return this.window.confirm(this.copy.confirmLanguage);
  }

  changeLanguage(nextLanguage) {
    if (nextLanguage === this.language) return true;
    if (!this.canChangeLanguage(nextLanguage)) return false;
    if (this.state && hasAnyAnswer(this.state)) {
      clearProgress(this.storage, this.state.sessionId, this.state.writerId);
      this.state = null;
      this.route = null;
      this.autoPaused = false;
      this.lastPayload = null;
      globalThis.lastPublicPayload = null;
    } else if (this.state) {
      this.state.language = nextLanguage;
    }
    this.language = nextLanguage;
    this.persistProgress();
    this.render();
    return true;
  }

  render() {
    if (!this.panel) return;
    if (!this.state) this.renderStart();
    else this.renderRoute();
  }

  progressContext() {
    return {
      bankVersion: this.manifest.bankVersion,
      bankSha256: this.manifest.sha256,
      allowedTestKeys: PUBLIC_MODULE_ORDER,
      itemById: this.itemById,
      bank: this.bank
    };
  }

  renderStart() {
    const copy = this.copy;
    const progress = readProgress(this.storage, this.progressContext());
    const progressNotice = progress.status === 'stale' || progress.status === 'invalid'
      ? `<div class="status-message warning" data-stale-progress><p>${escapeHtml(progress.status === 'stale' ? copy.staleProgress : copy.invalidProgress)}</p><button type="button" data-discard-progress>${escapeHtml(copy.discardProgress)}</button></div>`
      : '';
    const resume = progress.status === 'valid'
      ? `<div class="test-actions"><button type="button" class="primary" data-resume-progress>${escapeHtml(copy.resumeProgress)}</button><button type="button" class="button-secondary" data-discard-progress>${escapeHtml(copy.discardProgress)}</button></div>`
      : '';
    const storageNotice = progress.status === 'unavailable'
      ? `<div class="status-message warning"><p>${escapeHtml(copy.storageUnavailable)}</p></div>`
      : '';
    const legacyNotice = hasLegacyResultData(this.storage)
      ? `<div class="status-message warning" data-legacy-data><p>${escapeHtml(copy.legacyDataFound)}</p><button type="button" class="button-danger" data-delete-legacy>${escapeHtml(copy.deleteLegacyData)}</button></div>`
      : '';
    this.panel.innerHTML = `<section class="public-start-card">
      <p class="eyebrow">${escapeHtml(copy.startEyebrow)}</p>
      <h2>${escapeHtml(copy.startTitle)}</h2>
      <p>${escapeHtml(copy.startText)}</p>
      <div class="instruction-panel"><p>${escapeHtml(copy.instruction)}</p><p>${escapeHtml(copy.privacy)}</p></div>
      <label class="save-progress-option"><input type="checkbox" data-save-progress ${progress.status === 'unavailable' ? 'disabled' : ''}> <span>${escapeHtml(copy.saveProgress)}</span></label>
      <h3>${escapeHtml(copy.routeTitle)}</h3>
      <div class="public-route-grid">
        ${routeCard('psychosophy', copy.routePsychosophy, copy.routePsychosophyText)}
        ${routeCard('temporistics', copy.routeTemporistics, copy.routeTemporisticsText)}
        ${routeCard('socionics', copy.routeSocionics, copy.routeSocionicsText)}
        ${routeCard('all', copy.routeAll, copy.routeAllText)}
      </div>
      ${progressNotice}${resume}${storageNotice}${legacyNotice}
      <p class="privacy-note">${escapeHtml(copy.localOnly)}</p>
    </section>`;

    const saveControl = this.panel.querySelector('[data-save-progress]');
    this.panel.querySelectorAll('[data-route]').forEach(button => {
      button.addEventListener('click', () => {
        const latest = readProgress(this.storage, this.progressContext());
        if (['valid', 'stale', 'invalid'].includes(latest.status)) {
          if (!this.window.confirm(copy.confirmReplaceSaved)) return;
          clearProgress(this.storage);
        }
        const testKeys = button.dataset.route === 'all' ? [...PUBLIC_MODULE_ORDER] : [button.dataset.route];
        this.startRoute(testKeys, Boolean(saveControl?.checked));
      });
    });
    this.panel.querySelector('[data-resume-progress]')?.addEventListener('click', () => {
      const latest = readProgress(this.storage, this.progressContext());
      if (latest.status !== 'valid') {
        this.renderStart();
        focusHeading(this.panel, '.public-start-card h2');
        return;
      }
      this.state = restoreProgress(latest.progress);
      const claim = claimProgress(this.storage, this.state);
      if (claim.status !== 'saved') {
        this.state.saveLocal = false;
        this.storageWarning = claim.status;
      }
      this.language = this.state.language;
      this.onLanguageChanged?.(this.language);
      this.route = buildRouteItems(this.bank, this.state.testKeys, this.state.orderSeed);
      this.state.step = Math.min(this.state.step, this.route.items.length - 1);
      this.renderRoute(true);
    });
    this.panel.querySelectorAll('[data-discard-progress]').forEach(button => {
      button.addEventListener('click', () => {
        clearProgress(this.storage);
        this.renderStart();
        focusHeading(this.panel, '.public-start-card h2');
      });
    });
    this.panel.querySelector('[data-delete-legacy]')?.addEventListener('click', () => {
      clearLegacyLocalData(this.storage);
      this.renderStart();
      focusHeading(this.panel, '.public-start-card h2');
    });
  }

  startRoute(testKeys, saveLocal) {
    this.autoPaused = false;
    this.storageWarning = false;
    const sessionId = globalThis.crypto.randomUUID();
    const orderSeed = `${sessionId}:${testKeys.join('-')}`;
    this.state = newRouteState({
      questionBank: { version: this.manifest.bankVersion, sha256: this.manifest.sha256 },
      testKeys,
      orderSeed,
      language: this.language,
      saveLocal,
      sessionId
    });
    this.route = buildRouteItems(this.bank, testKeys, orderSeed);
    markItemShown(this.state, this.route.items[0].id);
    this.persistProgress();
    this.renderRoute(true);
  }

  persistProgress() {
    if (!this.state?.saveLocal) return;
    const result = saveProgress(this.storage, this.state);
    if (result.status === 'saved') {
      this.storageWarning = false;
    } else {
      this.state.saveLocal = false;
      this.storageWarning = result.status;
      setLiveStatus(
        this.panel,
        result.status === 'conflict'
          ? this.copy.storageConflict
          : this.copy.saveProgressFailed
      );
    }
  }

  renderRoute(moveFocus = false) {
    const copy = this.copy;
    const items = this.route.items;
    const questions = items.map((item, index) =>
      renderQuestion(item, index, items.length, this.language, copy, this.state.answers[item.id]?.value)
    ).join('');
    this.panel.innerHTML = `<section data-test-flow>
      <h2 class="visually-hidden route-heading">${escapeHtml(copy.routeInProgress)}</h2>
      <div class="test-progress" role="status" aria-live="polite">
        <div><strong data-section-title></strong><span data-progress-count></span></div>
        <span class="progress-track" data-progress-meter role="progressbar" aria-label="${escapeHtml(copy.progress)}" aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="0"><i data-progress-bar></i></span>
      </div>
      <div class="test-step-list">${questions}</div>
      <p class="status-message" data-live-status aria-live="polite"></p>
      <div class="test-step-nav">
        <button type="button" class="button-secondary" data-previous>${escapeHtml(copy.previous)}</button>
        <button type="button" class="primary" data-next>${escapeHtml(copy.next)}</button>
        <button type="button" class="primary" data-finish hidden>${escapeHtml(copy.finish)}</button>
      </div>
      <div class="test-actions secondary-actions">
        <button type="button" data-pause>${escapeHtml(copy.pause)}</button>
        <button type="button" class="button-danger" data-reset>${escapeHtml(copy.reset)}</button>
        <button type="button" class="button-secondary" data-delete-saved>${escapeHtml(copy.deleteSaved)}</button>
      </div>
      <div data-result aria-live="off"></div>
    </section>
    <section class="public-pause-card" data-pause-card hidden>
      <h2>${escapeHtml(copy.pausedTitle)}</h2>
      <p>${escapeHtml(copy.pausedText)}</p>
      <button type="button" class="primary" data-resume>${escapeHtml(copy.resume)}</button>
    </section>`;

    this.bindRouteEvents();
    this.showStep(this.state.step, moveFocus);
    if (this.storageWarning) {
      setLiveStatus(
        this.panel,
        this.storageWarning === 'conflict'
          ? copy.storageConflict
          : copy.saveProgressFailed
      );
    }
  }

  bindRouteEvents() {
    this.panel.querySelectorAll('.response-group input[type="radio"]').forEach(input => {
      input.addEventListener('change', () => {
        recordAnswer(this.state, input.name, input.value);
        const question = input.closest('.test-question');
        question?.classList.remove('missing-answer');
        const status = question?.querySelector('.question-status');
        if (status) status.textContent = '';
        this.persistProgress();
        this.updateControls();
      });
    });
    this.panel.querySelector('[data-previous]')?.addEventListener('click', () => this.showStep(this.state.step - 1, true));
    this.panel.querySelector('[data-next]')?.addEventListener('click', () => this.advance());
    this.panel.querySelector('[data-finish]')?.addEventListener('click', () => this.finish());
    this.panel.querySelector('[data-pause]')?.addEventListener('click', () => {
      pauseRoute(this.state);
      this.persistProgress();
      this.panel.querySelector('[data-test-flow]').hidden = true;
      this.panel.querySelector('[data-pause-card]').hidden = false;
      focusHeading(this.panel, '[data-pause-card] h2');
    });
    this.panel.querySelector('[data-resume]')?.addEventListener('click', () => {
      resumeRoute(this.state);
      const activeItem = this.route.items[this.state.step];
      markItemShown(this.state, activeItem.id);
      this.panel.querySelector('[data-test-flow]').hidden = false;
      this.panel.querySelector('[data-pause-card]').hidden = true;
      this.showStep(this.state.step, true);
    });
    this.panel.querySelector('[data-reset]')?.addEventListener('click', () => {
      if (!this.window.confirm(this.copy.confirmReset)) return;
      clearProgress(this.storage, this.state.sessionId, this.state.writerId);
      this.state = null;
      this.route = null;
      this.autoPaused = false;
      this.lastPayload = null;
      globalThis.lastPublicPayload = null;
      this.renderStart();
      focusHeading(this.panel, '.public-start-card h2');
    });
    this.panel.querySelector('[data-delete-saved]')?.addEventListener('click', () => {
      const cleared = clearAllStoredTestData(this.storage);
      this.state.saveLocal = false;
      setLiveStatus(
        this.panel,
        cleared ? this.copy.noSavedData : this.copy.storageDeleteFailed
      );
    });
  }

  currentAnswered() {
    return Boolean(this.state.answers[this.route.items[this.state.step].id]);
  }

  advance() {
    if (!this.currentAnswered()) {
      const active = this.panel.querySelector('.test-question.active-step');
      active?.classList.add('missing-answer');
      const status = active?.querySelector('.question-status');
      if (status) status.textContent = this.copy.missingAnswer;
      active?.querySelector('input')?.focus();
      return;
    }
    this.showStep(this.state.step + 1, true);
  }

  showStep(step, moveFocus) {
    const questions = [...this.panel.querySelectorAll('.test-question')];
    if (!questions.length) return;
    this.state.step = Math.max(0, Math.min(step, questions.length - 1));
    questions.forEach((question, index) => {
      const active = index === this.state.step;
      question.hidden = !active;
      question.classList.toggle('active-step', active);
    });
    const item = this.route.items[this.state.step];
    markItemShown(this.state, item.id);
    this.persistProgress();
    this.updateControls();
    if (moveFocus) {
      const active = questions[this.state.step];
      active.setAttribute('tabindex', '-1');
      active.focus({ preventScroll: false });
    }
  }

  updateControls() {
    const answeredCount = Object.keys(this.state.answers).length;
    const total = this.route.items.length;
    const currentItem = this.route.items[this.state.step];
    const sectionTitle = this.panel.querySelector('[data-section-title]');
    if (sectionTitle) sectionTitle.textContent = `${this.copy.section}: ${titleForModule(currentItem.testKey, this.copy)}`;
    const progressCount = this.panel.querySelector('[data-progress-count]');
    if (progressCount) progressCount.textContent = `${answeredCount}/${total}`;
    const progressBar = this.panel.querySelector('[data-progress-bar]');
    if (progressBar) progressBar.style.inlineSize = `${Math.round(answeredCount / total * 100)}%`;
    const progressMeter = this.panel.querySelector('[data-progress-meter]');
    if (progressMeter) progressMeter.setAttribute('aria-valuenow', String(answeredCount));
    const previous = this.panel.querySelector('[data-previous]');
    if (previous) previous.disabled = this.state.step === 0;
    const next = this.panel.querySelector('[data-next]');
    const finish = this.panel.querySelector('[data-finish]');
    const onLast = this.state.step === total - 1;
    if (next) {
      next.hidden = onLast;
      next.disabled = !this.currentAnswered();
    }
    if (finish) {
      finish.hidden = !onLast;
      finish.disabled = !this.currentAnswered();
    }
  }

  async finish() {
    const missingIndex = this.route.items.findIndex(item => !this.state.answers[item.id]);
    if (missingIndex >= 0) {
      this.showStep(missingIndex, true);
      this.advance();
      return;
    }
    const completedAt = Date.now();
    const responses = responseRecordsForRoute(this.route.items, this.state);
    const moduleScores = Object.fromEntries(this.state.testKeys.map(key => [
      key,
      scoreModule(this.bank.tests[key], responses.filter(response => response.testKey === key))
    ]));
    const timingActiveMs = this.state.timing.activeTimeMs
      + (this.state.timing.segmentStartedAt ? completedAt - this.state.timing.segmentStartedAt : 0);
    const qualityFlags = qualityFlagsForResponses(responses, timingActiveMs);
    const descriptiveScores = Object.fromEntries(
      Object.entries(moduleScores).map(([key, result]) => [key, result.descriptiveScores])
    );
    const coverage = routeCoverage(responses);
    const payload = buildPublicPayload({
      bank: this.bank,
      manifest: this.manifest,
      state: this.state,
      selectedKeys: this.state.testKeys,
      blockOrder: this.route.blockOrder,
      itemOrder: this.route.items.map(item => item.id),
      responses,
      descriptiveScores,
      coverage,
      qualityFlags,
      sessionId: this.state.sessionId,
      completedAt
    });
    if (!publicPayloadIsDescriptiveOnly(payload)) throw new Error('Public payload leaked experimental classification data');
    this.lastPayload = payload;
    globalThis.lastPublicPayload = payload;
    if (this.state.saveLocal) {
      clearProgress(this.storage, this.state.sessionId, this.state.writerId);
    }
    this.state.dirty = false;
    this.renderResult(moduleScores, qualityFlags, coverage, payload);
  }

  renderResult(moduleScores, qualityFlags, coverage, payload) {
    const copy = this.copy;
    const result = this.panel.querySelector('[data-result]');
    this.panel.querySelectorAll('.route-heading, .test-progress, .test-step-list, .test-step-nav, .secondary-actions, [data-test-flow] > [data-live-status]')
      .forEach(element => { element.hidden = true; });
    const profiles = qualityFlags.responseQuality === 'low'
      ? ''
      : this.state.testKeys.map(key => {
        const score = moduleScores[key].descriptiveScores;
        const explanation = key === 'socionics' ? copy.socionicsExplanation : copy.positionExplanation;
        const profile = key === 'socionics'
          ? renderSocionicsProfile(score, copy)
          : renderPositionProfile(score, copy);
        return `<section class="result-module">
          <h3>${escapeHtml(titleForModule(key, copy))}</h3>
          <p>${escapeHtml(explanation)}</p>
          ${profile}
        </section>`;
      }).join('');
    const summary = `${copy.resultTitle}. ${copy.resultCoverage}: ${coverage.answeredItemCount}/${coverage.contentItemCount}. ${copy.resultQuality}: ${copy[`quality${qualityFlags.responseQuality[0].toUpperCase()}${qualityFlags.responseQuality.slice(1)}`]}.`;
    result.innerHTML = `<section class="test-result">
      <p class="status-message visually-hidden" data-live-status aria-live="polite">${escapeHtml(copy.resultReady)}</p>
      <h2 data-result-heading>${escapeHtml(copy.resultTitle)}</h2>
      <p>${escapeHtml(copy.resultCaveat)}</p>
      <p><strong>${escapeHtml(copy.resultCoverage)}:</strong> ${coverage.answeredItemCount}/${coverage.contentItemCount}</p>
      ${renderQuality(qualityFlags, copy)}
      ${profiles}
      <p class="privacy-note">${escapeHtml(copy.localOnly)}</p>
      <div class="test-actions">
        <button type="button" data-copy-summary>${escapeHtml(copy.copySummary)}</button>
        <button type="button" class="button-secondary" data-start-another>${escapeHtml(copy.startAnother)}</button>
      </div>
      <p class="status-message" data-copy-status aria-live="polite"></p>
    </section>`;
    result.querySelector('[data-copy-summary]')?.addEventListener('click', async () => {
      const status = result.querySelector('[data-copy-status]');
      try {
        await this.window.navigator.clipboard.writeText(summary);
        status.textContent = copy.copied;
      } catch {
        status.textContent = copy.copyFailed;
      }
    });
    result.querySelector('[data-start-another]')?.addEventListener('click', () => {
      this.state = null;
      this.route = null;
      this.autoPaused = false;
      this.lastPayload = null;
      globalThis.lastPublicPayload = null;
      this.renderStart();
      focusHeading(this.panel, '.public-start-card h2');
    });
    focusHeading(result, '[data-result-heading]');
  }

  destroy() {
    this.window.removeEventListener('beforeunload', this.boundBeforeUnload);
    this.window.removeEventListener('storage', this.boundStorage);
    this.window.removeEventListener('pagehide', this.boundAutoPause);
    this.window.removeEventListener('pageshow', this.boundAutoResume);
    this.document.removeEventListener('visibilitychange', this.boundVisibilityChange);
  }
}

export { PUBLIC_MODULE_ORDER, titleForModule };
