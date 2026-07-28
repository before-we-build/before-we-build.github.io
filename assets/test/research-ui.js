import {
  createConfiguredResearchBooklet,
  qualityFlagsForResponses,
  routeCoverage,
  scoreModule
} from './scoring.js';
import {
  clearLegacyLocalData,
  hasLegacyLocalData,
  markItemShown,
  newRouteState,
  pauseRoute,
  recordAnswer,
  RESEARCH_ROUTE_VERSION,
  resumeRoute
} from './state.js';
import {
  buildResearchPayload,
  CONSENT_VERSION,
  hashRetestToken
} from './contract.js';
import { copyFor } from './i18n.js';
import {
  downloadJson,
  escapeHtml,
  focusHeading,
  renderPositionProfile,
  renderQuality,
  renderQuestion,
  renderSocionicsProfile,
  responseRecordsForRoute,
  setLiveStatus
} from './ui-common.js';
import { titleForModule } from './public-ui.js';

const RESEARCH_MODULE_ORDER = ['psychosophy', 'temporistics', 'socionics'];

function selectOptions(values, emptyLabel, labels = {}) {
  return `<option value="">${escapeHtml(emptyLabel)}</option>${values.map(value =>
    `<option value="${escapeHtml(value)}">${escapeHtml(labels[value] || value)}</option>`
  ).join('')}`;
}

export class ResearchTestApp {
  constructor({ document, window, storage, bank, manifest, language }) {
    this.document = document;
    this.window = window;
    this.storage = storage;
    this.bank = bank;
    this.manifest = manifest;
    this.language = language;
    this.panel = document.querySelector('#testPanel');
    this.state = null;
    this.route = null;
    this.autoPaused = false;
    this.booklet = null;
    this.metadata = null;
    this.lastPayload = null;
    this.starting = false;
    this.startGeneration = 0;
    this.boundBeforeUnload = event => {
      if (!this.state || !Object.keys(this.state.answers).length || !this.state.dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    this.boundAutoPause = () => {
      if (!this.state || this.lastPayload || this.state.paused) return;
      pauseRoute(this.state);
      this.autoPaused = true;
    };
    this.boundAutoResume = () => {
      if (!this.state || this.lastPayload || !this.autoPaused) return;
      resumeRoute(this.state);
      this.autoPaused = false;
      markItemShown(this.state, this.route.items[this.state.step].id);
    };
    this.boundVisibilityChange = () => {
      if (this.document.hidden) this.boundAutoPause();
      else this.boundAutoResume();
    };
    window.addEventListener('beforeunload', this.boundBeforeUnload);
    window.addEventListener('pagehide', this.boundAutoPause);
    window.addEventListener('pageshow', this.boundAutoResume);
    document.addEventListener('visibilitychange', this.boundVisibilityChange);
  }

  get copy() {
    return copyFor(this.language);
  }

  changeLanguage(nextLanguage) {
    if (nextLanguage === this.language) return true;
    if (this.state && Object.keys(this.state.answers).length && !this.window.confirm(this.copy.confirmLanguage)) return false;
    this.state = null;
    this.route = null;
    this.autoPaused = false;
    this.startGeneration += 1;
    this.starting = false;
    this.booklet = null;
    this.metadata = null;
    this.lastPayload = null;
    globalThis.lastResearchPayload = null;
    this.language = nextLanguage;
    this.renderStart();
    return true;
  }

  render() {
    if (this.state) this.renderRoute();
    else this.renderStart();
  }

  renderStart() {
    const copy = this.copy;
    const legacyNotice = hasLegacyLocalData(this.storage)
      ? `<div class="status-message warning" data-legacy-data><p>${escapeHtml(copy.legacyDataFound)}</p><button type="button" class="button-danger" data-delete-legacy>${escapeHtml(copy.deleteLegacyData)}</button></div>`
      : '';
    this.panel.innerHTML = `<section class="research-start-card">
      <div class="eligibility-card">
        <p class="eyebrow">${escapeHtml(copy.startEyebrow)}</p>
        <h2>${escapeHtml(copy['researchTests.adultOnly.title'])}</h2>
        <p>${escapeHtml(copy['researchTests.adultOnly.text'])}</p>
        <label class="research-consent-option"><input type="checkbox" data-adult-confirm> <span>${escapeHtml(copy.adultConfirm)}</span></label>
        <label class="research-consent-option"><input type="checkbox" data-research-consent> <span>${escapeHtml(copy.researchConsent)}</span></label>
        <p class="test-hint">${escapeHtml(copy.consentVersion)}: <code>${escapeHtml(CONSENT_VERSION)}</code></p>
      </div>
      <div class="metadata-grid">
        <label>${escapeHtml(copy.ageBand)}
          <select data-age-band>${selectOptions(['18-24', '25-34', '35-44', '45-54', '55+'], copy.ageNone)}</select>
        </label>
        <label>${escapeHtml(copy.exposure)}
          <select data-exposure>${selectOptions(['none', 'beginner', 'intermediate', 'advanced'], copy.exposureNone, copy.exposureLevels)}</select>
        </label>
        <label>${escapeHtml(copy.selfType)}<input data-self-type type="text" autocomplete="off"></label>
        <label>${escapeHtml(copy.retestToken)}
          <input data-retest-token type="password" autocomplete="off" aria-describedby="retest-token-hint">
          <span class="test-hint" id="retest-token-hint">${escapeHtml(copy.retestHint)}</span>
        </label>
      </div>
      <div class="instruction-panel"><p>${escapeHtml(copy.instruction)}</p><p>${escapeHtml(copy.researchPrivacy)}</p></div>
      ${legacyNotice}
      <h3>${escapeHtml(copy.routeTitle)}</h3>
      <div class="public-route-grid">
        ${RESEARCH_MODULE_ORDER.map(key => `<button type="button" class="public-route-card" data-research-module="${key}">
          <strong>${escapeHtml(titleForModule(key, copy))}</strong>
          <span>${escapeHtml({
            psychosophy: copy.routePsychosophyText,
            temporistics: copy.routeTemporisticsText,
            socionics: copy.routeSocionicsText
          }[key])}</span>
        </button>`).join('')}
      </div>
      <p class="status-message" data-live-status aria-live="polite"></p>
    </section>`;

    this.panel.querySelectorAll('[data-research-module]').forEach(button => {
      button.addEventListener('click', async () => {
        try {
          await this.startModule(button.dataset.researchModule);
        } catch {
          this.starting = false;
          this.panel.querySelectorAll('[data-research-module]').forEach(routeButton => {
            routeButton.disabled = false;
          });
          setLiveStatus(this.panel, this.copy.retestHashFailed);
        }
      });
    });
    this.panel.querySelectorAll('[data-adult-confirm], [data-research-consent]').forEach(input => {
      input.addEventListener('change', () => {
        const bothChecked = this.panel.querySelector('[data-adult-confirm]')?.checked
          && this.panel.querySelector('[data-research-consent]')?.checked;
        if (bothChecked) setLiveStatus(this.panel, '');
      });
    });
    this.panel.querySelector('[data-delete-legacy]')?.addEventListener('click', () => {
      clearLegacyLocalData(this.storage);
      this.renderStart();
      focusHeading(this.panel, '.research-start-card h2');
    });
  }

  async startModule(testKey) {
    if (this.starting) return;
    const adultConfirmed = Boolean(this.panel.querySelector('[data-adult-confirm]')?.checked);
    const consentAccepted = Boolean(this.panel.querySelector('[data-research-consent]')?.checked);
    if (!adultConfirmed || !consentAccepted) {
      setLiveStatus(this.panel, this.copy.eligibilityRequired);
      this.panel.querySelector(adultConfirmed ? '[data-research-consent]' : '[data-adult-confirm]')?.focus();
      return;
    }
    this.starting = true;
    const generation = ++this.startGeneration;
    this.panel.querySelectorAll('[data-research-module]').forEach(button => {
      button.disabled = true;
    });
    const capturedMetadata = {
      ageBand: this.panel.querySelector('[data-age-band]')?.value || '',
      priorTypologyExposure: this.panel.querySelector('[data-exposure]')?.value || '',
      selfReportedType: this.panel.querySelector('[data-self-type]')?.value || ''
    };
    const capturedLanguage = this.language;
    this.autoPaused = false;
    const retestInput = this.panel.querySelector('[data-retest-token]');
    const retestTokenHash = await hashRetestToken(retestInput?.value || '');
    if (generation !== this.startGeneration || capturedLanguage !== this.language) return;
    if (retestInput) retestInput.value = '';
    this.metadata = {
      ...capturedMetadata,
      retestTokenHash
    };
    const sessionId = globalThis.crypto.randomUUID();
    const orderSeed = `${sessionId}:${testKey}:adult-research`;
    this.state = newRouteState({
      questionBank: { version: this.manifest.bankVersion, sha256: this.manifest.sha256 },
      testKeys: [testKey],
      orderSeed,
      language: this.language,
      saveLocal: false,
      routeVersion: RESEARCH_ROUTE_VERSION,
      sessionId
    });
    this.booklet = createConfiguredResearchBooklet(
      testKey,
      this.bank.tests[testKey],
      orderSeed
    );
    this.route = {
      blockOrder: [testKey],
      items: this.booklet.items.map(item => ({ ...item, testKey }))
    };
    markItemShown(this.state, this.route.items[0].id);
    this.starting = false;
    this.renderRoute(true);
  }

  renderRoute(moveFocus = false) {
    const copy = this.copy;
    const items = this.route.items;
    this.panel.innerHTML = `<section data-test-flow>
      <h2 class="visually-hidden route-heading">${escapeHtml(copy.routeInProgress)}</h2>
      <div class="test-progress" role="status" aria-live="polite">
        <div><strong>${escapeHtml(titleForModule(this.state.testKeys[0], copy))}</strong><span data-progress-count></span></div>
        <span class="progress-track" data-progress-meter role="progressbar" aria-label="${escapeHtml(copy.progress)}" aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="0"><i data-progress-bar></i></span>
      </div>
      <div class="test-step-list">${items.map((item, index) =>
        renderQuestion(item, index, items.length, this.language, copy, this.state.answers[item.id]?.value)
      ).join('')}</div>
      <p class="status-message" data-live-status aria-live="polite"></p>
      <div class="test-step-nav">
        <button type="button" class="button-secondary" data-previous>${escapeHtml(copy.previous)}</button>
        <button type="button" class="primary" data-next>${escapeHtml(copy.next)}</button>
        <button type="button" class="primary" data-finish hidden>${escapeHtml(copy.finish)}</button>
      </div>
      <div class="test-actions secondary-actions">
        <button type="button" data-pause>${escapeHtml(copy.pause)}</button>
        <button type="button" class="button-danger" data-reset>${escapeHtml(copy.reset)}</button>
      </div>
      <div data-result aria-live="off"></div>
    </section>
    <section class="public-pause-card" data-pause-card hidden>
      <h2>${escapeHtml(copy.pausedTitle)}</h2>
      <p>${escapeHtml(copy.pausedText)}</p>
      <button type="button" class="primary" data-resume>${escapeHtml(copy.resume)}</button>
    </section>`;

    this.panel.querySelectorAll('.response-group input[type="radio"]').forEach(input => {
      input.addEventListener('change', () => {
        recordAnswer(this.state, input.name, input.value);
        const question = input.closest('.test-question');
        question?.classList.remove('missing-answer');
        const status = question?.querySelector('.question-status');
        if (status) status.textContent = '';
        this.updateControls();
      });
    });
    this.panel.querySelector('[data-previous]')?.addEventListener('click', () => this.showStep(this.state.step - 1, true));
    this.panel.querySelector('[data-next]')?.addEventListener('click', () => this.advance());
    this.panel.querySelector('[data-finish]')?.addEventListener('click', () => this.finish());
    this.panel.querySelector('[data-pause]')?.addEventListener('click', () => {
      pauseRoute(this.state);
      this.panel.querySelector('[data-test-flow]').hidden = true;
      this.panel.querySelector('[data-pause-card]').hidden = false;
      focusHeading(this.panel, '[data-pause-card] h2');
    });
    this.panel.querySelector('[data-resume]')?.addEventListener('click', () => {
      resumeRoute(this.state);
      markItemShown(this.state, this.route.items[this.state.step].id);
      this.panel.querySelector('[data-test-flow]').hidden = false;
      this.panel.querySelector('[data-pause-card]').hidden = true;
      this.showStep(this.state.step, true);
    });
    this.panel.querySelector('[data-reset]')?.addEventListener('click', () => {
      if (!this.window.confirm(copy.confirmReset)) return;
      this.state = null;
      this.route = null;
      this.autoPaused = false;
      this.booklet = null;
      this.metadata = null;
      this.lastPayload = null;
      globalThis.lastResearchPayload = null;
      this.renderStart();
      focusHeading(this.panel, '.research-start-card h2');
    });
    this.showStep(this.state.step, moveFocus);
  }

  currentAnswered() {
    return Boolean(this.state.answers[this.route.items[this.state.step].id]);
  }

  advance() {
    if (!this.currentAnswered()) {
      const question = this.panel.querySelector('.test-question.active-step');
      question?.classList.add('missing-answer');
      const status = question?.querySelector('.question-status');
      if (status) status.textContent = this.copy.missingAnswer;
      question?.querySelector('input')?.focus();
      return;
    }
    this.showStep(this.state.step + 1, true);
  }

  showStep(step, moveFocus) {
    const questions = [...this.panel.querySelectorAll('.test-question')];
    this.state.step = Math.max(0, Math.min(step, questions.length - 1));
    questions.forEach((question, index) => {
      const active = index === this.state.step;
      question.hidden = !active;
      question.classList.toggle('active-step', active);
    });
    markItemShown(this.state, this.route.items[this.state.step].id);
    this.updateControls();
    if (moveFocus) {
      const active = questions[this.state.step];
      active.setAttribute('tabindex', '-1');
      active.focus({ preventScroll: false });
    }
  }

  updateControls() {
    const answered = Object.keys(this.state.answers).length;
    const total = this.route.items.length;
    const count = this.panel.querySelector('[data-progress-count]');
    if (count) count.textContent = `${answered}/${total}`;
    const bar = this.panel.querySelector('[data-progress-bar]');
    if (bar) bar.style.inlineSize = `${Math.round(answered / total * 100)}%`;
    const progressMeter = this.panel.querySelector('[data-progress-meter]');
    if (progressMeter) progressMeter.setAttribute('aria-valuenow', String(answered));
    const previous = this.panel.querySelector('[data-previous]');
    if (previous) previous.disabled = this.state.step === 0;
    const onLast = this.state.step === total - 1;
    const next = this.panel.querySelector('[data-next]');
    const finish = this.panel.querySelector('[data-finish]');
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
    const missing = this.route.items.findIndex(item => !this.state.answers[item.id]);
    if (missing >= 0) {
      this.showStep(missing, true);
      this.advance();
      return;
    }
    const completedAt = Date.now();
    const responses = responseRecordsForRoute(this.route.items, this.state);
    const testKey = this.state.testKeys[0];
    const scoring = scoreModule(this.bank.tests[testKey], responses, { includeExperimentalRanking: true });
    const activeDurationMs = this.state.timing.activeTimeMs
      + (this.state.timing.segmentStartedAt ? completedAt - this.state.timing.segmentStartedAt : 0);
    const qualityFlags = qualityFlagsForResponses(responses, activeDurationMs);
    const coverage = routeCoverage(responses);
    const payload = await buildResearchPayload({
      bank: this.bank,
      manifest: this.manifest,
      state: this.state,
      selectedKeys: [testKey],
      blockOrder: [testKey],
      itemOrder: this.route.items.map(item => item.id),
      responses,
      descriptiveScores: { [testKey]: scoring.descriptiveScores },
      coverage,
      qualityFlags,
      sessionId: this.state.sessionId,
      completedAt,
      booklet: {
        bookletId: this.booklet.bookletId,
        designVersion: this.booklet.designVersion,
        designStatus: this.booklet.designStatus,
        variantIndex: this.booklet.variantIndex,
        variantCount: this.booklet.variantCount,
        anchorItemIds: this.booklet.anchorItemIds,
        plannedMissingItemIds: this.booklet.plannedMissingItemIds,
        plannedMissing: this.booklet.plannedMissing,
        contentItemCount: this.booklet.contentItemCount,
        presentedItemCount: this.booklet.presentedItemCount
      },
      experimentalRanking: { [testKey]: scoring.experimentalRanking },
      metadata: this.metadata,
      consent: {
        adultEligibilityConfirmed: true,
        researchConsentAccepted: true
      }
    });
    this.lastPayload = payload;
    globalThis.lastResearchPayload = payload;
    this.renderResult(testKey, scoring, qualityFlags, coverage, payload);
  }

  renderResult(testKey, scoring, qualityFlags, coverage, payload) {
    const copy = this.copy;
    const result = this.panel.querySelector('[data-result]');
    this.panel.querySelectorAll('.route-heading, .test-progress, .test-step-list, .test-step-nav, .secondary-actions, [data-test-flow] > [data-live-status]')
      .forEach(element => { element.hidden = true; });
    const profile = testKey === 'socionics'
      ? renderSocionicsProfile(scoring.descriptiveScores, copy)
      : renderPositionProfile(scoring.descriptiveScores, copy);
    const diagnostics = scoring.experimentalRanking.length
      ? `<details class="experimental-details"><summary>${escapeHtml(copy.experimentalDetails)}</summary>
          <p>${escapeHtml(copy.experimentalWarning)}</p>
          <ol>${scoring.experimentalRanking.map(candidate => {
            const metric = Number(candidate.contrastScore ?? candidate.fitScore);
            return `<li><code>${escapeHtml(candidate.code)}</code> · ${Number.isFinite(metric) ? metric.toFixed(3) : '—'} · ${escapeHtml(candidate.calibrationStatus)}</li>`;
          }).join('')}</ol>
        </details>`
      : '';
    result.innerHTML = `<section class="test-result">
      <p class="status-message visually-hidden" data-live-status aria-live="polite">${escapeHtml(copy.resultReady)}</p>
      <h2 data-result-heading>${escapeHtml(copy.resultTitle)}</h2>
      <p><strong>${escapeHtml(copy.resultCoverage)}:</strong> ${coverage.answeredItemCount}/${coverage.contentItemCount}</p>
      ${renderQuality(qualityFlags, copy)}
      <section class="result-module">
        <h3>${escapeHtml(titleForModule(testKey, copy))}</h3>
        <p>${escapeHtml(testKey === 'socionics' ? copy.socionicsExplanation : copy.positionExplanation)}</p>
        ${profile}
      </section>
      <details class="research-metadata">
        <summary>${escapeHtml(copy.researchMetadata)}</summary>
        <dl>
          <dt>${escapeHtml(copy.bankVersionLabel)}</dt><dd><code>${escapeHtml(this.manifest.bankVersion)}</code></dd>
          <dt>${escapeHtml(copy.bankHashLabel)}</dt><dd><code>${escapeHtml(this.manifest.sha256)}</code></dd>
          <dt>${escapeHtml(copy.bookletLabel)}</dt><dd><code>${escapeHtml(this.booklet.bookletId)}</code></dd>
          <dt>${escapeHtml(copy.measurementModelLabel)}</dt><dd><code>${escapeHtml(this.manifest.modules[testKey].measurementModel)}</code></dd>
          <dt>${escapeHtml(copy.calibrationStatusLabel)}</dt><dd><code>${escapeHtml(this.manifest.modules[testKey].calibrationStatus)}</code></dd>
          <dt>${escapeHtml(copy.consentVersion)}</dt><dd><code>${escapeHtml(CONSENT_VERSION)}</code></dd>
        </dl>
      </details>
      ${diagnostics}
      <p class="privacy-note">${escapeHtml(copy.localOnly)}</p>
      <div class="test-actions">
        <button type="button" class="primary" data-export>${escapeHtml(copy.exportJson)}</button>
        <button type="button" class="button-secondary" data-start-another>${escapeHtml(copy.startAnother)}</button>
      </div>
      <p class="status-message" data-export-status aria-live="polite"></p>
    </section>`;
    result.querySelector('[data-export]')?.addEventListener('click', () => {
      payload.processing.exportInitiatedByParticipant = true;
      downloadJson(payload, `before-we-build-${testKey}`);
      this.state.dirty = false;
      result.querySelector('[data-export-status]').textContent = copy.responseSaved;
    });
    result.querySelector('[data-start-another]')?.addEventListener('click', () => {
      if (this.state.dirty && !this.window.confirm(copy.confirmDiscardResearchResult)) return;
      this.state = null;
      this.route = null;
      this.autoPaused = false;
      this.booklet = null;
      this.metadata = null;
      this.lastPayload = null;
      globalThis.lastResearchPayload = null;
      this.renderStart();
      focusHeading(this.panel, '.research-start-card h2');
    });
    focusHeading(result, '[data-result-heading]');
  }

  destroy() {
    this.window.removeEventListener('beforeunload', this.boundBeforeUnload);
    this.window.removeEventListener('pagehide', this.boundAutoPause);
    this.window.removeEventListener('pageshow', this.boundAutoResume);
    this.document.removeEventListener('visibilitychange', this.boundVisibilityChange);
  }
}

export { RESEARCH_MODULE_ORDER };
