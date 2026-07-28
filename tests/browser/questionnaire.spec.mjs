import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PUBLIC_PROGRESS_KEY = 'before-we-build-progress-v2';

const languageExpectations = {
  uk: {
    publicTitle: 'Тест Before We Build',
    publicHeading: 'Тест Before We Build',
    researchTitle: 'Before We Build · Дослідницькі опитувальники'
  },
  en: {
    publicTitle: 'Before We Build test',
    publicHeading: 'Before We Build test',
    researchTitle: 'Before We Build · Research questionnaires'
  },
  ru: {
    publicTitle: 'Тест Before We Build',
    publicHeading: 'Тест Before We Build',
    researchTitle: 'Before We Build · Исследовательские опросники'
  }
};

function installDialogAcceptance(page) {
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
}

async function openQuestionnaire(page, path, startSelector) {
  await page.goto(path);
  await expect(page.locator(startSelector)).toBeVisible();
  await expect.poll(() =>
    page.evaluate(() => globalThis.beforeWeBuildQuestionBankVersion || null)
  ).not.toBeNull();
}

async function axeViolations(page) {
  const result = await new AxeBuilder({ page }).analyze();
  return result.violations;
}

async function assertNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function completeVisibleRoute(page, {
  attentionValue = '2',
  contentValue = null,
  assertUnansweredAttentionIsBlocked = false,
  advanceClockMs = 0
} = {}) {
  let sawAttention = false;
  for (let index = 0; index < 130; index += 1) {
    const result = page.locator('[data-result] .test-result');
    if (await result.isVisible().catch(() => false)) break;

    const activeQuestion = page.locator('.test-question.active-step');
    await expect(activeQuestion).toBeVisible();
    const isAttention = await activeQuestion.locator('.test-hint').count() > 0;
    if (isAttention) {
      sawAttention = true;
      if (assertUnansweredAttentionIsBlocked) {
        const advanceControl = await page.locator('[data-finish]').isVisible()
          ? page.locator('[data-finish]')
          : page.locator('[data-next]');
        await expect(advanceControl).toBeDisabled();
        await expect(result).toHaveCount(0);
      }
    }

    const value = isAttention
      ? attentionValue
      : contentValue ?? String([1, 2, 4, 5][index % 4]);
    if (advanceClockMs) await page.clock.fastForward(advanceClockMs);
    await activeQuestion.locator(`input[type="radio"][value="${value}"]`).check();

    if (await page.locator('[data-finish]').isVisible()) {
      await page.locator('[data-finish]').click();
      await expect(result).toBeVisible();
      break;
    }
    await page.locator('[data-next]').click();
  }
  expect(sawAttention).toBe(true);
}

function recursiveObjectKeys(value, output = new Set()) {
  if (!value || typeof value !== 'object') return output;
  if (Array.isArray(value)) {
    value.forEach(item => recursiveObjectKeys(item, output));
    return output;
  }
  for (const [key, nested] of Object.entries(value)) {
    output.add(key);
    recursiveObjectKeys(nested, output);
  }
  return output;
}

test('RU, EN, and UK localize public and Research entry points and pass axe', async ({ page }) => {
  installDialogAcceptance(page);
  await openQuestionnaire(page, '/index.html', '.public-start-card');

  for (const [language, expected] of Object.entries(languageExpectations)) {
    await page.locator(`[data-lang="${language}"]`).click();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page).toHaveTitle(expected.publicTitle);
    await expect(page.locator('h1')).toHaveText(expected.publicHeading);
    await expect(page.locator(`[data-lang="${language}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`[data-lang="${language}"]`)).toHaveAttribute('aria-label', /.+/u);
  }

  await expect(page.locator('[data-route="psychosophy"]')).toContainText(/48.+\+.+1/u);
  await expect(page.locator('[data-route="temporistics"]')).toContainText(/48.+\+.+1/u);
  await expect(page.locator('[data-route="socionics"]')).toContainText(/16.+\+.+1/u);
  await expect(page.locator('[data-route="all"]')).toContainText(/112.+\+.+3/u);
  await expect(page.locator('input[name*="age"], [data-age-band]')).toHaveCount(0);
  expect(await axeViolations(page)).toEqual([]);

  await openQuestionnaire(page, '/research-tests.html', '.research-start-card');
  for (const [language, expected] of Object.entries(languageExpectations)) {
    await page.locator(`[data-lang="${language}"]`).click();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page).toHaveTitle(expected.researchTitle);
  }
  await expect(page.locator('.eligibility-card')).toContainText('18');
  expect(await axeViolations(page)).toEqual([]);
});

test('@mobile public route supports touch, keyboard, N/A, save/resume/delete, reset, and language restart', async ({ page }) => {
  const dialogMessages = [];
  let dialogDecision = 'accept';
  page.on('dialog', async dialog => {
    dialogMessages.push({ type: dialog.type(), message: dialog.message() });
    if (dialogDecision === 'dismiss') await dialog.dismiss();
    else await dialog.accept();
  });
  await openQuestionnaire(page, '/index.html', '.public-start-card');
  expect(await page.evaluate(() => navigator.maxTouchPoints)).toBeGreaterThan(0);
  await assertNoHorizontalOverflow(page);

  await page.locator('[data-save-progress]').check();
  await page.locator('[data-route="socionics"]').click();
  await expect(page.locator('.test-question')).toHaveCount(17);
  await expect(page.locator('.test-question:visible')).toHaveCount(1);
  const firstQuestion = page.locator('.test-question.active-step');
  await expect(firstQuestion.locator('fieldset')).toBeVisible();
  await expect(firstQuestion.locator('legend')).not.toBeEmpty();
  await expect(firstQuestion.getByRole('radio')).toHaveCount(6);
  const touchHeights = await firstQuestion.locator('.response-option').evaluateAll(elements =>
    elements.map(element => element.getBoundingClientRect().height)
  );
  expect(Math.min(...touchHeights)).toBeGreaterThanOrEqual(44);
  await assertNoHorizontalOverflow(page);
  expect(await axeViolations(page)).toEqual([]);

  await firstQuestion.locator('input[value="na"]').check();
  await expect(page.locator('[data-next]')).toBeEnabled();
  await page.locator('[data-next]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.test-question.active-step')).toHaveAttribute('data-display-index', '2');
  await expect(page.locator('.test-question.active-step')).toBeFocused();

  await page.reload();
  await expect(page.locator('[data-resume-progress]')).toBeVisible();
  await page.locator('[data-resume-progress]').click();
  await expect(page.locator('.test-question.active-step')).toHaveAttribute('data-display-index', '2');
  await expect(page.locator('.test-question input:checked')).toHaveCount(1);

  const currentRadios = page.locator('.test-question.active-step').getByRole('radio');
  await currentRadios.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(currentRadios.nth(1)).toBeChecked();

  await page.locator('[data-delete-saved]').click();
  await expect(page.locator('[data-live-status]')).not.toBeEmpty();
  expect(await page.evaluate(key => localStorage.getItem(key), PUBLIC_PROGRESS_KEY)).toBeNull();
  await expect(page.locator('.test-question input:checked')).toHaveCount(2);

  dialogDecision = 'dismiss';
  await page.locator('[data-reset]').click();
  await expect(page.locator('.test-question.active-step')).toBeVisible();
  expect(dialogMessages.at(-1).type).toBe('confirm');
  dialogDecision = 'accept';
  await page.locator('[data-reset]').click();
  await expect(page.locator('.public-start-card')).toBeVisible();

  await page.locator('[data-route="socionics"]').click();
  await page.locator('.test-question.active-step input[value="4"]').check();
  await page.locator('[data-lang="en"]').click();
  expect(dialogMessages.at(-1).type).toBe('confirm');
  await expect(page.locator('.public-start-card')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.evaluate(key => localStorage.getItem(key), PUBLIC_PROGRESS_KEY)).toBeNull();
  await assertNoHorizontalOverflow(page);
});

test('all three languages complete a successful public route and show eight scales', async ({ page }) => {
  installDialogAcceptance(page);
  const writeRequests = [];
  page.on('request', request => {
    if (!['GET', 'HEAD'].includes(request.method())) writeRequests.push(request.url());
  });
  await openQuestionnaire(page, '/index.html', '.public-start-card');
  await page.clock.install();

  for (const language of Object.keys(languageExpectations)) {
    await page.locator(`[data-lang="${language}"]`).click();
    await page.locator('[data-route="socionics"]').click();
    await completeVisibleRoute(page, { advanceClockMs: 2200 });
    const payload = await page.evaluate(() => globalThis.lastPublicPayload);
    expect(payload.metadata.language).toBe(language);
    expect(payload.qualityFlags.failedAttentionCheck).toBe(false);
    expect(payload.qualityFlags.responseQuality).not.toBe('low');
    await expect(page.locator('.profile-card')).toHaveCount(8);
    await expect(page.locator('.experimental-details')).toHaveCount(0);
    expect(await axeViolations(page)).toEqual([]);
    await page.locator('[data-start-another]').click();
  }
  expect(writeRequests).toEqual([]);
});

test('Psychosophy and Temporistics each present one correct attention check and four-role profiles', async ({ page }) => {
  installDialogAcceptance(page);
  await openQuestionnaire(page, '/index.html', '.public-start-card');
  await page.clock.install();

  for (const testKey of ['psychosophy', 'temporistics']) {
    await page.locator(`[data-route="${testKey}"]`).click();
    await completeVisibleRoute(page, {
      assertUnansweredAttentionIsBlocked: true,
      advanceClockMs: 2200
    });
    const payload = await page.evaluate(() => globalThis.lastPublicPayload);
    const attentionResponses = payload.responses.filter(response =>
      response.attentionExpected !== null
    );
    expect(attentionResponses).toHaveLength(1);
    expect(attentionResponses[0].responseValue).toBe(attentionResponses[0].attentionExpected);
    await expect(page.locator('.profile-card')).toHaveCount(4);
    await expect(page.locator('.profile-card').first().locator('.profile-row')).toHaveCount(4);
    await page.locator('[data-start-another]').click();
  }
});

test('production attention check blocks omission, flags a wrong answer, and public result stays descriptive-only', async ({ page }) => {
  installDialogAcceptance(page);
  await openQuestionnaire(page, '/index.html', '.public-start-card');
  await page.locator('[data-lang="ru"]').click();
  await page.locator('[data-route="socionics"]').click();

  await completeVisibleRoute(page, {
    attentionValue: '5',
    assertUnansweredAttentionIsBlocked: true
  });

  const payload = await page.evaluate(() => globalThis.lastPublicPayload);
  expect(payload.schemaVersion).toBe('2.0.0');
  expect(payload.responseFormat).toBe('likert-5-na');
  expect(payload.routeVersion).toMatch(/^public-/u);
  expect(payload.questionBank.sha256).toMatch(/^[a-f0-9]{64}$/u);
  expect(payload.randomization.itemOrder).toHaveLength(17);
  expect(payload.responses.map(response => response.itemId))
    .toEqual(payload.randomization.itemOrder);
  expect(payload.qualityFlags.attentionCheckPresented).toBe(true);
  expect(payload.qualityFlags.failedAttentionCheck).toBe(true);
  expect(payload.processing).toEqual({
    location: 'browser',
    transmitted: false,
    persisted: false
  });
  const attentionResponse = payload.responses.find(response =>
    response.attentionExpected !== null
  );
  expect(attentionResponse.attentionExpected).toBe(2);
  expect(attentionResponse.responseValue).toBe(5);

  const keys = recursiveObjectKeys(payload);
  for (const forbidden of [
    'ageBand',
    'candidates',
    'code',
    'defined',
    'experimentalRanking',
    'music',
    'recommendations',
    'typeCode',
    'typeHypothesis'
  ]) {
    expect(keys.has(forbidden), `public payload leaked ${forbidden}`).toBe(false);
  }

  await expect(page.locator('[data-result] .test-result')).toBeVisible();
  await expect(page.locator('.test-step-nav')).toBeHidden();
  await expect(page.locator('.secondary-actions')).toBeHidden();
  await expect(page.locator('.experimental-details')).toHaveCount(0);
  await expect(page.locator('[data-result-heading]')).toBeFocused();
  expect(await axeViolations(page)).toEqual([]);
  await page.locator('[data-copy-summary]').click();
  await expect(page.locator('[data-copy-status]')).not.toBeEmpty();
});

test('Research is adult-only, excludes pause time, exports locally, and contains precalibration ranking only in details/JSON', async ({ page }) => {
  installDialogAcceptance(page);
  const writeRequests = [];
  page.on('request', request => {
    if (!['GET', 'HEAD'].includes(request.method())) writeRequests.push(request.url());
  });
  await page.setViewportSize({ width: 320, height: 800 });
  await openQuestionnaire(page, '/research-tests.html', '.research-start-card');
  await page.clock.install();

  const ageValues = await page.locator('[data-age-band] option').evaluateAll(options =>
    options.map(option => option.value)
  );
  expect(ageValues).toEqual(['', '18-24', '25-34', '35-44', '45-54', '55+']);

  await page.locator('[data-research-module="socionics"]').click();
  await expect(page.locator('[data-live-status]')).not.toBeEmpty();
  await expect(page.locator('[data-adult-confirm]')).toBeFocused();
  await expect(page.locator('.research-start-card')).toBeVisible();

  await page.locator('[data-adult-confirm]').check();
  await page.locator('[data-research-consent]').check();
  await page.locator('[data-age-band]').selectOption('25-34');
  await page.locator('[data-exposure]').selectOption('none');
  await page.locator('[data-retest-token]').fill('private retest phrase');
  await page.locator('[data-research-module="socionics"]').click();
  await expect(page.locator('.test-question')).toHaveCount(17);
  await assertNoHorizontalOverflow(page);

  await page.clock.fastForward(2000);
  await page.locator('[data-pause]').click();
  await expect(page.locator('[data-test-flow]')).toBeHidden();
  await expect(page.locator('[data-pause-card] h2')).toBeFocused();
  await page.clock.fastForward(10_000);
  await page.locator('[data-resume]').click();
  await expect(page.locator('[data-test-flow]')).toBeVisible();
  await expect(page.locator('.test-question.active-step')).toBeFocused();

  await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide')));
  await page.clock.fastForward(5000);
  await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pageshow')));
  await completeVisibleRoute(page, { advanceClockMs: 2200 });
  const payload = await page.evaluate(() => globalThis.lastResearchPayload);
  expect(payload.schemaVersion).toBe('2.0.0');
  expect(payload.routeVersion).toMatch(/^research-adult-/u);
  expect(payload.consent.adultEligibilityConfirmed).toBe(true);
  expect(payload.consent.researchConsentAccepted).toBe(true);
  expect(payload.consent.consentVersion).toMatch(/^adult-research-/u);
  expect(payload.metadata.ageBand).toBe('25-34');
  expect(payload.retestTokenHash).toMatch(/^[a-f0-9]{64}$/u);
  expect(payload.retestTokenHash).not.toContain('private');
  expect(await page.evaluate(() =>
    Object.hasOwn(globalThis.beforeWeBuildTestApp.metadata, 'retestToken')
  )).toBe(false);
  expect(payload.timing.activeDurationMs).toBeLessThanOrEqual(payload.timing.wallDurationMs);
  expect(payload.timing.wallDurationMs - payload.timing.activeDurationMs)
    .toBeGreaterThanOrEqual(15_000);
  expect(payload.timing.segments.reduce((sum, segment) => sum + segment.durationMs, 0))
    .toBe(payload.timing.activeDurationMs);
  expect(payload.processing).toEqual({
    location: 'browser',
    transmitted: false,
    persisted: false,
    exportInitiatedByParticipant: false
  });
  expect(payload.experimentalRanking.socionics.length).toBeGreaterThan(0);
  expect(payload.experimentalRanking.socionics.every(candidate =>
    candidate.calibrationStatus === 'precalibration'
      && !Object.hasOwn(candidate, 'defined')
  )).toBe(true);
  const correctAttention = payload.responses.find(response =>
    response.attentionExpected !== null
  );
  expect(correctAttention.responseValue).toBe(correctAttention.attentionExpected);

  await expect(page.locator('.research-metadata')).not.toHaveAttribute('open', '');
  await expect(page.locator('.experimental-details')).not.toHaveAttribute('open', '');
  await expect(page.locator('.test-step-nav')).toBeHidden();
  await expect(page.locator('.secondary-actions')).toBeHidden();
  await expect(page.locator('[data-result-heading]')).toBeFocused();
  await assertNoHorizontalOverflow(page);
  expect(await axeViolations(page)).toEqual([]);

  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-export]').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^before-we-build-socionics-.+\.json$/u);
  await expect(page.locator('[data-export-status]')).not.toBeEmpty();
  expect(await page.evaluate(() =>
    globalThis.lastResearchPayload.processing.exportInitiatedByParticipant
  )).toBe(true);
  expect(writeRequests).toEqual([]);
});

test('Research accepts an all-N/A route and explicitly abstains from ranking', async ({ page }) => {
  await openQuestionnaire(page, '/research-tests.html', '.research-start-card');
  await page.locator('[data-adult-confirm]').check();
  await page.locator('[data-research-consent]').check();
  await page.locator('[data-research-module="socionics"]').click();
  await completeVisibleRoute(page, { contentValue: 'na' });

  const payload = await page.evaluate(() => globalThis.lastResearchPayload);
  expect(payload.coverage.contentItemCount).toBe(16);
  expect(payload.coverage.answeredItemCount).toBe(16);
  expect(payload.coverage.scorableItemCount).toBe(0);
  expect(payload.coverage.notApplicableItemCount).toBe(16);
  expect(payload.experimentalRanking.socionics).toEqual([]);
  expect(payload.booklet.designStatus).toBe('design_pending_g0');
  await expect(page.locator('.experimental-details')).toHaveCount(0);
  await expect(page.locator('[data-result-heading]')).toBeFocused();
});

test('legacy type-rich local data is visible and deleted only by explicit action', async ({ page }) => {
  await openQuestionnaire(page, '/index.html', '.public-start-card');
  await page.evaluate(() => {
    localStorage.setItem('before-we-build-results', JSON.stringify({ typeCode: 'LII' }));
    localStorage.setItem('before-we-build-device-id', 'legacy-device');
  });
  await page.reload();
  await expect(page.locator('[data-legacy-data]')).toBeVisible();
  await page.locator('[data-delete-legacy]').click();
  const legacyValues = await page.evaluate(() => ({
    result: localStorage.getItem('before-we-build-results'),
    device: localStorage.getItem('before-we-build-device-id')
  }));
  expect(legacyValues).toEqual({ result: null, device: null });
});

test('unsaved public answers activate beforeunload protection', async ({ page }) => {
  await openQuestionnaire(page, '/index.html', '.public-start-card');
  await page.locator('[data-route="socionics"]').click();
  await page.locator('.test-question.active-step input[value="4"]').check();
  const dialogPromise = page.waitForEvent('dialog');
  const reloadPromise = page.reload();
  const dialog = await dialogPromise;
  expect(dialog.type()).toBe('beforeunload');
  await dialog.accept();
  await reloadPromise;
  await expect(page.locator('.public-start-card')).toBeVisible();
});

test('public entry and question do not overflow at 200% zoom', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await openQuestionnaire(page, '/index.html', '.public-start-card');
  await page.evaluate(() => {
    document.documentElement.style.zoom = '2';
  });
  await assertNoHorizontalOverflow(page);
  await page.locator('[data-route="socionics"]').click();
  await expect(page.locator('.test-question.active-step')).toBeVisible();
  await assertNoHorizontalOverflow(page);
});
