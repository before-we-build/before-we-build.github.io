import { responseRecord } from './state.js';
import { wordCount } from './scoring.js';

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

export function itemText(item, language) {
  return item.text[language] || item.text.uk || item.text.en || item.text.ru;
}

export function renderQuestion(item, index, total, language, copy, selectedValue = null) {
  const text = itemText(item, language);
  const hintId = `hint-${item.id}`;
  const optionLabels = [copy.scale1, copy.scale2, copy.scale3, copy.scale4, copy.scale5];
  const options = optionLabels.map((label, optionIndex) => {
    const value = String(optionIndex + 1);
    return `<label class="response-option">
      <input type="radio" name="${escapeHtml(item.id)}" value="${value}" ${selectedValue === value ? 'checked' : ''}>
      <span>${escapeHtml(label)}</span>
    </label>`;
  }).join('');
  const notApplicable = `<label class="response-option response-option-na">
      <input type="radio" name="${escapeHtml(item.id)}" value="na" ${selectedValue === 'na' ? 'checked' : ''}>
      <span>${escapeHtml(copy.notApplicable)}</span>
    </label>`;
  const hint = item.attention !== undefined ? `<p class="test-hint" id="${hintId}">${escapeHtml(copy.attentionHint)}</p>` : '';
  return `<article class="test-question ${index === 0 ? 'active-step' : ''}" data-test-item="${escapeHtml(item.id)}" data-test-key="${escapeHtml(item.testKey)}" data-display-index="${index + 1}" ${index === 0 ? '' : 'hidden'}>
    <fieldset class="response-group"${hint ? ` aria-describedby="${hintId}"` : ''}>
      <legend><span class="question-index">${index + 1}/${total}</span> ${escapeHtml(text)}</legend>
      ${hint}
      <div class="response-options">${options}${notApplicable}</div>
    </fieldset>
    <p class="status-message question-status" aria-live="polite"></p>
  </article>`;
}

export function responseRecordsForRoute(items, state) {
  return items.map((item, index) =>
    responseRecord(state, item, index + 1, wordCount(itemText(item, state.language)))
  ).filter(Boolean);
}

export function renderPositionProfile(profile, copy) {
  return `<div class="profile-grid">${Object.entries(profile.aspects).map(([aspect, evidence]) => {
    const rows = Object.values(evidence.roles).map(role => {
      const mean = Number.isFinite(role.mean) ? role.mean : 0;
      const contrast = Number.isFinite(role.contrast) ? `${role.contrast >= 0 ? '+' : ''}${role.contrast.toFixed(2)}` : '—';
      return `<div class="profile-row">
        <span>${escapeHtml(copy.roles[role.role] || role.role)}</span>
        <span class="profile-bar" aria-hidden="true"><i style="width:${Math.max(0, Math.min(100, mean / 5 * 100))}%"></i></span>
        <strong>${Number.isFinite(role.mean) ? role.mean.toFixed(2) : '—'}</strong>
        <small>${contrast}</small>
      </div>`;
    }).join('');
    return `<section class="profile-card">
      <h4>${escapeHtml(copy.aspects[aspect] || aspect)}</h4>
      <p class="test-hint">${escapeHtml(copy.resultCoverage)}: ${evidence.answered}/${evidence.expected}</p>
      <div class="profile-bars">${rows}</div>
    </section>`;
  }).join('')}</div>`;
}

export function renderSocionicsProfile(profile, copy) {
  return `<div class="profile-grid">${Object.entries(profile.dimensions).map(([dimension, evidence]) => {
    const mean = Number.isFinite(evidence.mean) ? evidence.mean : 0;
    return `<section class="profile-card">
      <h4>${escapeHtml(copy.socLabels[dimension] || dimension)} <small>${dimension}</small></h4>
      <div class="profile-row">
        <span><span class="visually-hidden">${escapeHtml(copy.resultCoverage)}: </span>${evidence.answered}/${evidence.expected}</span>
        <span class="profile-bar" aria-hidden="true"><i style="width:${Math.max(0, Math.min(100, mean / 5 * 100))}%"></i></span>
        <strong>${Number.isFinite(evidence.mean) ? evidence.mean.toFixed(2) : '—'}</strong>
      </div>
    </section>`;
  }).join('')}</div>`;
}

export function qualityMessages(flags, copy) {
  const messages = [];
  if (flags.failedAttentionCheck) messages.push(copy.failedAttention);
  if (flags.tooFast) messages.push(copy.tooFast);
  if (flags.straightlining) messages.push(copy.straightlining);
  if (flags.neutralOveruse) messages.push(copy.neutralOveruse);
  if (flags.notApplicableOveruse) messages.push(copy.notApplicableOveruse);
  return messages;
}

export function renderQuality(flags, copy) {
  const label = copy[`quality${flags.responseQuality[0].toUpperCase()}${flags.responseQuality.slice(1)}`];
  const messages = qualityMessages(flags, copy);
  return `<section class="quality-panel">
    <h3>${escapeHtml(copy.resultQuality)}</h3>
    <p><strong>${escapeHtml(label)}</strong></p>
    ${messages.length ? `<ul>${messages.map(message => `<li>${escapeHtml(message)}</li>`).join('')}</ul>` : ''}
  </section>`;
}

export function downloadJson(payload, filenamePrefix = 'before-we-build') {
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `${filenamePrefix}-${payload.responseId}.json`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  globalThis.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function setLiveStatus(container, message) {
  const status = container.querySelector('[data-live-status]');
  if (status) status.textContent = message;
}

export function focusHeading(container, selector) {
  const heading = container.querySelector(selector);
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: false });
}
