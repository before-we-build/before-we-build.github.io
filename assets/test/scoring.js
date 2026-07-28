import { POSITION_ROLES } from './bank.js';

const POSITION_EPSILON = 1e-9;
const RESEARCH_BOOKLET_TARGET = 48;
const RESEARCH_BOOKLET_VARIANTS = 12;
const RESEARCH_SAMPLING_VERSION = 'research-matrix-v1';
const RESEARCH_SAMPLING_STATUS = 'design_pending_g0';
const RESEARCH_BOOKLET_CONFIG = Object.freeze({
  designVersion: RESEARCH_SAMPLING_VERSION,
  designStatus: RESEARCH_SAMPLING_STATUS,
  targetContentItems: RESEARCH_BOOKLET_TARGET,
  variantCount: RESEARCH_BOOKLET_VARIANTS,
  modules: Object.freeze({
    psychosophy: Object.freeze({ anchorItemIds: Object.freeze([]) }),
    temporistics: Object.freeze({ anchorItemIds: Object.freeze([]) }),
    socionics: Object.freeze({ anchorItemIds: Object.freeze([]) })
  })
});
const SOCIONICS_TIM_MODELS = [
  ['ILE', ['Ne', 'Ti', 'Si', 'Fe']],
  ['SEI', ['Si', 'Fe', 'Ne', 'Ti']],
  ['ESE', ['Fe', 'Si', 'Ti', 'Ne']],
  ['LII', ['Ti', 'Ne', 'Fe', 'Si']],
  ['EIE', ['Fe', 'Ni', 'Ti', 'Se']],
  ['LSI', ['Ti', 'Se', 'Fe', 'Ni']],
  ['SLE', ['Se', 'Ti', 'Ni', 'Fe']],
  ['IEI', ['Ni', 'Fe', 'Se', 'Ti']],
  ['SEE', ['Se', 'Fi', 'Ni', 'Te']],
  ['ILI', ['Ni', 'Te', 'Se', 'Fi']],
  ['LIE', ['Te', 'Ni', 'Fi', 'Se']],
  ['ESI', ['Fi', 'Se', 'Te', 'Ni']],
  ['LSE', ['Te', 'Si', 'Fi', 'Ne']],
  ['EII', ['Fi', 'Ne', 'Te', 'Si']],
  ['IEE', ['Ne', 'Fi', 'Si', 'Te']],
  ['SLI', ['Si', 'Te', 'Ne', 'Fi']]
];
const SOCIONICS_FUNCTION_WEIGHTS = [1, 0.8, 0.45, 0.45];

export function seedNumber(seed = '') {
  let hash = 2166136261;
  for (const character of String(seed)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function shuffle(values, seed) {
  const output = [...values];
  let state = seedNumber(seed) || 0x9e3779b9;
  for (let index = output.length - 1; index > 0; index -= 1) {
    state += 0x6d2b79f5;
    let randomState = state;
    randomState = Math.imul(randomState ^ (randomState >>> 15), randomState | 1);
    randomState ^= randomState + Math.imul(randomState ^ (randomState >>> 7), randomState | 61);
    const random = ((randomState ^ (randomState >>> 14)) >>> 0) / 4294967296;
    const swapIndex = Math.floor(random * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

function spreadMatchedContexts(items, seed) {
  if (!items.length || !items.every(item => item.tetradId || item.context)) return shuffle(items, seed);
  const groups = new Map();
  for (const item of items) {
    const key = item.tetradId || item.context;
    const group = groups.get(key) || [];
    group.push(item);
    groups.set(key, group);
  }
  if (groups.size < 2) return shuffle(items, seed);
  for (const [key, group] of groups) groups.set(key, shuffle(group, `${seed}:${key}`));
  const order = shuffle([...groups.keys()], `${seed}:contexts`)
    .sort((left, right) => groups.get(right).length - groups.get(left).length);
  const output = [];
  while (order.some(key => groups.get(key).length)) {
    for (const key of order) {
      const item = groups.get(key).shift();
      if (item) output.push(item);
    }
  }
  return output;
}

function matchedContextKey(item) {
  return item.tetradId || item.context || null;
}

function constructKey(item) {
  return item.aspect || item.scale || item.id;
}

function separatedOrderAttempt(
  items,
  seed,
  minimumDistance,
  segmentHistory = null
) {
  const seededOrder = shuffle(items, seed);
  const seedRank = new Map(seededOrder.map((item, index) => [item.id, index]));
  const remaining = [...seededOrder];
  const output = [];
  const lastMatchedPosition = new Map();

  while (remaining.length) {
    const outputIndex = output.length;
    const matchedCounts = new Map();
    const constructCounts = new Map();
    for (const item of remaining) {
      const matched = matchedContextKey(item);
      if (matched) matchedCounts.set(matched, (matchedCounts.get(matched) || 0) + 1);
      const construct = constructKey(item);
      constructCounts.set(construct, (constructCounts.get(construct) || 0) + 1);
    }
    let candidates = remaining.filter(item => {
      const matched = matchedContextKey(item);
      return !matched
        || !lastMatchedPosition.has(matched)
        || outputIndex - lastMatchedPosition.get(matched) >= minimumDistance;
    });
    if (!candidates.length) return null;

    const previousConstruct = output.length
      ? constructKey(output.at(-1))
      : null;
    const differentConstruct = candidates.filter(item =>
      constructKey(item) !== previousConstruct
    );
    if (differentConstruct.length) candidates = differentConstruct;

    const currentSegment = Math.min(
      2,
      Math.floor(outputIndex * 3 / items.length)
    );
    candidates.sort((left, right) => {
      const leftMatched = matchedContextKey(left);
      const rightMatched = matchedContextKey(right);
      const leftCount = leftMatched ? matchedCounts.get(leftMatched) : 1;
      const rightCount = rightMatched ? matchedCounts.get(rightMatched) : 1;
      const leftDeadline = items.length - 1 - (leftCount - 1) * minimumDistance;
      const rightDeadline = items.length - 1 - (rightCount - 1) * minimumDistance;
      const leftSegmentExposure = segmentHistory?.get(left.id)?.[currentSegment] || 0;
      const rightSegmentExposure = segmentHistory?.get(right.id)?.[currentSegment] || 0;
      return leftDeadline - rightDeadline
        || rightCount - leftCount
        || leftSegmentExposure - rightSegmentExposure
        || constructCounts.get(constructKey(right)) - constructCounts.get(constructKey(left))
        || seedRank.get(left.id) - seedRank.get(right.id);
    });

    const selected = candidates[0];
    output.push(selected);
    const selectedIndex = remaining.indexOf(selected);
    remaining.splice(selectedIndex, 1);
    const matched = matchedContextKey(selected);
    if (matched) lastMatchedPosition.set(matched, outputIndex);
  }

  return output;
}

function segmentBalancePenalty(item, index, length, segmentHistory) {
  const segment = Math.min(2, Math.floor(index * 3 / length));
  const previous = segmentHistory.get(item.id)?.[segment] || 0;
  return previous === 0 ? 0 : 100 ** previous;
}

function respectsOrderingConstraints(items, minimumDistance) {
  const lastMatchedPosition = new Map();
  for (let index = 0; index < items.length; index += 1) {
    if (
      index > 0
      && constructKey(items[index]) === constructKey(items[index - 1])
    ) return false;
    const matched = matchedContextKey(items[index]);
    if (
      matched
      && lastMatchedPosition.has(matched)
      && index - lastMatchedPosition.get(matched) < minimumDistance
    ) return false;
    if (matched) lastMatchedPosition.set(matched, index);
  }
  return true;
}

function improveSegmentBalance(
  ordered,
  segmentHistory,
  minimumDistance
) {
  const output = [...ordered];
  while (true) {
    let bestSwap = null;
    let bestDelta = 0;
    for (let left = 0; left < output.length - 1; left += 1) {
      const leftSegment = Math.min(2, Math.floor(left * 3 / output.length));
      for (let right = left + 1; right < output.length; right += 1) {
        const rightSegment = Math.min(2, Math.floor(right * 3 / output.length));
        if (leftSegment === rightSegment) continue;
        const before = segmentBalancePenalty(
          output[left],
          left,
          output.length,
          segmentHistory
        ) + segmentBalancePenalty(
          output[right],
          right,
          output.length,
          segmentHistory
        );
        const after = segmentBalancePenalty(
          output[left],
          right,
          output.length,
          segmentHistory
        ) + segmentBalancePenalty(
          output[right],
          left,
          output.length,
          segmentHistory
        );
        const delta = after - before;
        if (delta >= bestDelta) continue;
        [output[left], output[right]] = [output[right], output[left]];
        const valid = respectsOrderingConstraints(output, minimumDistance);
        [output[left], output[right]] = [output[right], output[left]];
        if (valid) {
          bestDelta = delta;
          bestSwap = [left, right];
        }
      }
    }
    if (!bestSwap) return output;
    const [left, right] = bestSwap;
    [output[left], output[right]] = [output[right], output[left]];
  }
}

function enforceMatchedSeparation(
  items,
  seed,
  minimumDistance = 10,
  segmentHistory = null
) {
  if (
    !items.some(item => matchedContextKey(item))
    && !segmentHistory
  ) return items;
  let bestOrder = null;
  let bestBalanceCost = Number.POSITIVE_INFINITY;
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const ordered = separatedOrderAttempt(
      items,
      `${seed}:separation:${attempt}`,
      minimumDistance,
      segmentHistory
    );
    if (!ordered) continue;
    if (!segmentHistory) return ordered;
    const balanceCost = ordered.reduce((total, item, index) => {
      const segment = Math.min(2, Math.floor(index * 3 / ordered.length));
      const previous = segmentHistory.get(item.id)?.[segment] || 0;
      return total + (previous === 0 ? 0 : 100 ** previous);
    }, 0);
    if (balanceCost < bestBalanceCost) {
      bestOrder = ordered;
      bestBalanceCost = balanceCost;
    }
  }
  if (bestOrder) {
    return improveSegmentBalance(
      bestOrder,
      segmentHistory,
      minimumDistance
    );
  }
  throw new Error(
    `Research booklet cannot satisfy matched-item separation ${minimumDistance}`
  );
}

export function constrainedShuffle(
  items,
  seed,
  { segmentHistory = null } = {}
) {
  const buckets = new Map();
  for (const item of items) {
    const key = item.aspect || item.scale || item.id;
    const bucket = buckets.get(key) || [];
    bucket.push(item);
    buckets.set(key, bucket);
  }
  for (const [key, bucket] of buckets) buckets.set(key, spreadMatchedContexts(bucket, `${seed}:${key}`));
  const output = [];
  const order = shuffle([...buckets.keys()], `${seed}:constructs`);
  while (order.some(key => buckets.get(key).length)) {
    for (const key of order) {
      const item = buckets.get(key).shift();
      if (item) output.push(item);
    }
  }
  return enforceMatchedSeparation(output, seed, 10, segmentHistory);
}

export function buildRouteItems(bank, selectedKeys, seed) {
  const blockOrder = shuffle(selectedKeys, `${seed}:blocks`);
  const blocks = blockOrder.map(testKey => {
    const test = bank.tests[testKey];
    const content = constrainedShuffle(
      test.items.filter(item => item.attention === undefined).map(item => ({ ...item, testKey })),
      `${seed}:${testKey}`
    );
    const attention = test.items.find(item => item.attention !== undefined);
    if (attention) content.splice(Math.max(1, Math.floor(content.length / 2)), 0, { ...attention, testKey });
    return content;
  });
  return { blockOrder, items: blocks.flat() };
}

function quotasForVariant(groups, keys, targetCount, variantIndex) {
  const quotas = new Map(keys.map(key => [key, 0]));
  let cursor = (variantIndex * targetCount) % keys.length;
  let selected = 0;
  while (selected < targetCount) {
    let allocated = false;
    for (let attempts = 0; attempts < keys.length; attempts += 1) {
      const key = keys[cursor % keys.length];
      cursor += 1;
      if (quotas.get(key) >= groups.get(key).length) continue;
      quotas.set(key, quotas.get(key) + 1);
      selected += 1;
      allocated = true;
      break;
    }
    if (!allocated) throw new Error('Research booklet target exceeds the available content pool');
  }
  return quotas;
}

function stableGroupOrder(groups, keys, seed) {
  return new Map(keys.map(key => {
    const values = [...groups.get(key)];
    const positionItem = values.find(item => item.aspect);
    if (!positionItem) return [key, shuffle(values, `${seed}:${key}`)];
    values.sort((left, right) =>
      String(left.indicator).localeCompare(String(right.indicator))
        || left.id.localeCompare(right.id)
    );
    return [
      key,
      shuffle(values, `${seed}:aspect:${positionItem.aspect}`)
    ];
  }));
}

function rotatingBalancedSample(groups, targetCount, variantIndex, variantCount, seed) {
  const keys = shuffle([...groups.keys()].sort(), `${seed}:groups`);
  const orderedGroups = stableGroupOrder(groups, keys, seed);
  const quotaHistory = Array.from(
    { length: variantIndex + 1 },
    (_, index) => quotasForVariant(groups, keys, targetCount, index)
  );
  const currentQuotas = quotaHistory[variantIndex];
  const output = [];

  for (const key of keys) {
    const values = orderedGroups.get(key);
    const quota = currentQuotas.get(key);
    const position = groups.get(key).find(item => item.aspect)?.position;
    const positionPhase = Number.isInteger(position)
      ? (position - 1) * Math.ceil(values.length / 4)
      : 0;
    let previousSelections = 0;
    for (let priorVariant = 0; priorVariant < variantIndex; priorVariant += 1) {
      const priorQuota = quotaHistory[priorVariant].get(key);
      previousSelections += priorQuota;
    }
    const start = (previousSelections + positionPhase) % values.length;
    for (let index = 0; index < quota; index += 1) {
      output.push(values[(start + index) % values.length]);
    }
  }

  if (variantCount < 1) throw new Error('Research booklet variantCount must be a positive integer');
  return { items: output };
}

export function createResearchBooklet(
  test,
  seed,
  targetContentItems = RESEARCH_BOOKLET_TARGET,
  {
    anchorItemIds = [],
    variantCount = RESEARCH_BOOKLET_VARIANTS,
    designVersion = RESEARCH_SAMPLING_VERSION,
    designStatus = RESEARCH_SAMPLING_STATUS
  } = {}
) {
  const content = test.items.filter(item => item.attention === undefined);
  if (
    !Number.isInteger(targetContentItems)
    || targetContentItems < 1
  ) throw new Error('Research booklet target is outside the available content pool');
  const effectiveTarget = Math.min(targetContentItems, content.length);
  if (!Number.isInteger(variantCount) || variantCount < 1) {
    throw new Error('Research booklet variantCount must be a positive integer');
  }
  if (typeof designVersion !== 'string' || !designVersion.trim()) {
    throw new Error('Research booklet designVersion is required');
  }
  if (typeof designStatus !== 'string' || !designStatus.trim()) {
    throw new Error('Research booklet designStatus is required');
  }
  if (!Array.isArray(anchorItemIds)) {
    throw new Error('Research anchor item ids must be an array');
  }
  if (new Set(anchorItemIds).size !== anchorItemIds.length) {
    throw new Error('Research anchor item ids must be unique');
  }
  const contentById = new Map(content.map(item => [item.id, item]));
  const anchors = anchorItemIds.map(itemId => {
    const item = contentById.get(itemId);
    if (!item) throw new Error(`Unknown Research anchor item: ${itemId}`);
    return item;
  });
  if (anchors.length > effectiveTarget) {
    throw new Error('Research anchor block exceeds the booklet target');
  }
  const anchorSet = new Set(anchorItemIds);
  const candidates = content.filter(item => !anchorSet.has(item.id));
  const groupKey = item => item.aspect
    ? `${item.aspect}|${item.position}`
    : item.scale;
  const groups = candidates.reduce((map, item) => {
    const key = groupKey(item);
    const values = map.get(key) || [];
    values.push(item);
    map.set(key, values);
    return map;
  }, new Map());
  const variantIndex = seedNumber(seed) % variantCount;
  const designSeed = `${test.version}:${designVersion}`;
  const remainingTarget = effectiveTarget - anchors.length;
  const segmentHistory = new Map(
    content.map(item => [item.id, [0, 0, 0]])
  );
  let selectedContent = [];
  for (let designVariant = 0; designVariant <= variantIndex; designVariant += 1) {
    const sampled = candidates.length <= remainingTarget
      ? candidates
      : rotatingBalancedSample(
        groups,
        remainingTarget,
        designVariant,
        variantCount,
        `${designSeed}:booklet`
      ).items;
    const ordered = constrainedShuffle(
      [...anchors, ...sampled],
      `${designSeed}:variant-${designVariant + 1}:selected`,
      { segmentHistory }
    );
    ordered.forEach((item, index) => {
      const segment = Math.min(2, Math.floor(index * 3 / ordered.length));
      segmentHistory.get(item.id)[segment] += 1;
    });
    if (designVariant === variantIndex) selectedContent = ordered;
  }
  const selected = [...selectedContent];
  const attention = test.items.find(item => item.attention !== undefined);
  if (attention) selected.splice(Math.max(1, Math.floor(selected.length / 2)), 0, attention);
  const selectedIds = new Set(selectedContent.map(item => item.id));
  return {
    bookletId: `${test.version}:${designVersion}:v${variantIndex + 1}-of-${variantCount}`,
    designVersion,
    designStatus,
    variantIndex,
    variantCount,
    anchorItemIds: [...anchorItemIds],
    plannedMissingItemIds: content
      .filter(item => !selectedIds.has(item.id))
      .map(item => item.id),
    plannedMissing: content.length > effectiveTarget,
    contentItemCount: selectedContent.length,
    presentedItemCount: selected.length,
    items: selected
  };
}

export function createConfiguredResearchBooklet(testKey, test, seed) {
  const moduleConfig = RESEARCH_BOOKLET_CONFIG.modules[testKey];
  if (!moduleConfig) throw new Error(`Unsupported Research module: ${testKey}`);
  return createResearchBooklet(
    test,
    seed,
    RESEARCH_BOOKLET_CONFIG.targetContentItems,
    {
      anchorItemIds: moduleConfig.anchorItemIds,
      variantCount: RESEARCH_BOOKLET_CONFIG.variantCount,
      designVersion: RESEARCH_BOOKLET_CONFIG.designVersion,
      designStatus: RESEARCH_BOOKLET_CONFIG.designStatus
    }
  );
}

function responseMap(responses) {
  return new Map(responses.map(response => [response.itemId, response]));
}

export function scoreModule(test, responses, { includeExperimentalRanking = false } = {}) {
  const byItem = responseMap(responses);
  const scores = {};
  const counts = {};
  let failedAttentionCheck = false;
  let attentionCheckPresented = false;
  let missing = false;

  for (const item of test.items) {
    const response = byItem.get(item.id);
    if (!response) continue;
    if (item.attention !== undefined) {
      attentionCheckPresented = true;
      if (response.responseValue === null || response.responseValue === undefined) {
        missing = true;
        failedAttentionCheck = true;
      } else if (Number(response.responseValue) !== item.attention) {
        failedAttentionCheck = true;
      }
      continue;
    }
    if (response.notApplicable) continue;
    if (response.responseValue === null || response.responseValue === undefined) {
      missing = true;
      continue;
    }
    const raw = Number(response.responseValue);
    const scored = item.reverse ? 6 - raw : raw;
    scores[item.scale] = (scores[item.scale] || 0) + scored;
    counts[item.scale] = (counts[item.scale] || 0) + 1;
  }

  const descriptiveScores = test.mode === 'socionics'
    ? socionicsProfile(test, scores, counts)
    : positionProfile(test, scores, counts);
  const experimentalRanking = includeExperimentalRanking
    ? test.mode === 'position'
      ? rankPositionCandidates(test, descriptiveScores)
      : rankSocionicsCandidates(descriptiveScores)
    : undefined;

  return {
    missing,
    attentionCheckPresented,
    failedAttentionCheck,
    scores,
    counts,
    descriptiveScores,
    ...(includeExperimentalRanking ? { experimentalRanking } : {})
  };
}

export function socionicsProfile(test, scores, counts) {
  return {
    model: test.measurementModel,
    calibrationStatus: test.calibrationStatus,
    dimensions: Object.fromEntries(
      test.dims.map(dimension => [
        dimension,
        {
          mean: counts[dimension] ? scores[dimension] / counts[dimension] : null,
          answered: counts[dimension] || 0,
          expected: test.items.filter(item => item.attention === undefined && item.scale === dimension).length
        }
      ])
    )
  };
}

export function positionProfile(test, scores, counts) {
  const aspects = {};
  for (const aspect of test.aspects) {
    const cells = [1, 2, 3, 4].map(position => {
      const key = `${aspect}|${position}`;
      const expected = test.items.filter(item => item.attention === undefined && item.scale === key).length;
      const answered = counts[key] || 0;
      return {
        position,
        role: POSITION_ROLES[position],
        answered,
        expected,
        mean: answered ? scores[key] / answered : null
      };
    });
    const observedMeans = cells.filter(cell => Number.isFinite(cell.mean)).map(cell => cell.mean);
    const aspectMean = observedMeans.length
      ? observedMeans.reduce((total, mean) => total + mean, 0) / observedMeans.length
      : null;
    const roles = Object.fromEntries(cells.map(cell => [
      cell.role,
      {
        ...cell,
        contrast: Number.isFinite(cell.mean) && Number.isFinite(aspectMean)
          ? (cell.mean - aspectMean) / 4
          : null
      }
    ]));
    aspects[aspect] = {
      answered: cells.reduce((total, cell) => total + cell.answered, 0),
      expected: cells.reduce((total, cell) => total + cell.expected, 0),
      coverageComplete: cells.every(cell => cell.answered === cell.expected),
      roles
    };
  }
  return {
    model: test.measurementModel,
    calibrationStatus: test.calibrationStatus,
    aspects
  };
}

function permutations(values) {
  if (values.length === 1) return [values];
  return values.flatMap((value, index) =>
    permutations(values.filter((_, candidateIndex) => candidateIndex !== index)).map(rest => [value, ...rest])
  );
}

function aspectCode(test, aspect, language = 'en') {
  if (typeof test.code?.[aspect] === 'string') return test.code[aspect];
  return test.code?.[language]?.[aspect] || test.code?.en?.[aspect] || aspect;
}

export function rankPositionCandidates(test, descriptiveProfile) {
  const answered = Object.values(descriptiveProfile.aspects)
    .reduce((total, aspect) => total + aspect.answered, 0);
  if (answered === 0) return [];
  const candidates = permutations(test.aspects).map(order => {
    const selected = order.map((aspect, index) => {
      const role = POSITION_ROLES[index + 1];
      return descriptiveProfile.aspects[aspect].roles[role];
    });
    const available = selected.filter(cell => Number.isFinite(cell.contrast));
    const contrastScore = available.length
      ? available.reduce((total, cell) => total + cell.contrast, 0) / available.length
      : 0;
    return {
      code: order.map(aspect => aspectCode(test, aspect, 'en')).join(''),
      displayCode: order.map(aspect => aspectCode(test, aspect, 'uk')).join(test.aspects.includes('Past') ? '-' : ''),
      contrastScore,
      assignment: Object.fromEntries(order.map((aspect, index) => [aspect, index + 1]))
    };
  }).sort((left, right) => right.contrastScore - left.contrastScore);

  const topGap = (candidates[0]?.contrastScore || 0) - (candidates[1]?.contrastScore || 0);
  return candidates.slice(0, 3).map((candidate, index) => ({
    rank: index + 1,
    ...candidate,
    heuristicSeparation: topGap,
    calibrationStatus: 'precalibration',
    interpretation: 'experimental-ranking-only'
  }));
}

export function rankSocionicsCandidates(descriptiveProfile) {
  const answered = Object.values(descriptiveProfile.dimensions)
    .reduce((total, dimension) => total + dimension.answered, 0);
  if (answered === 0) return [];
  const candidates = SOCIONICS_TIM_MODELS.map(([code, dimensionOrder]) => {
    const observed = dimensionOrder.map((dimension, index) => ({
      dimension,
      weight: SOCIONICS_FUNCTION_WEIGHTS[index],
      mean: descriptiveProfile.dimensions[dimension]?.mean
    })).filter(entry => Number.isFinite(entry.mean));
    const observedWeight = observed.reduce((total, entry) => total + entry.weight, 0);
    const fitScore = observedWeight
      ? observed.reduce((total, entry) => total + entry.mean * entry.weight, 0) / observedWeight
      : 0;
    return {
      code,
      dimensionOrder,
      fitScore,
      coverageComplete: observed.length === dimensionOrder.length
    };
  }).sort((left, right) => right.fitScore - left.fitScore || left.code.localeCompare(right.code));

  const heuristicSeparation = (candidates[0]?.fitScore || 0) - (candidates[1]?.fitScore || 0);
  return candidates.slice(0, 3).map((candidate, index) => ({
    rank: index + 1,
    ...candidate,
    heuristicSeparation,
    model: 'socionics-tim-weighted-fit-v0',
    calibrationStatus: 'precalibration',
    interpretation: 'experimental-ranking-only'
  }));
}

export function minimumCompletionTimeMs(contentItemCount = 0) {
  return Math.max(30000, Math.max(0, Number(contentItemCount) || 0) * 1800);
}

export function itemFastThresholdMs(promptWordCount = 0) {
  return Math.min(3200, Math.max(1200, 900 + Math.max(0, Number(promptWordCount) || 0) * 70));
}

export function qualityFlagsForResponses(responses, activeDurationMs) {
  const content = responses.filter(response => response.attentionExpected === null);
  const scorable = content.filter(response => !response.notApplicable && Number.isFinite(Number(response.responseValue)));
  const failedAttentionCheck = responses.some(response =>
    response.attentionExpected !== null && Number(response.responseValue) !== response.attentionExpected
  );
  const attentionCheckPresented = responses.some(response => response.attentionExpected !== null);
  const groups = scorable.reduce((output, response) => {
    const items = output[response.testKey] || [];
    items.push(response);
    output[response.testKey] = items;
    return output;
  }, {});
  const straightlinedBlocks = Object.entries(groups)
    .filter(([, items]) => items.length >= 8 && new Set(items.map(item => Number(item.responseValue))).size === 1)
    .map(([key]) => key);
  const denominator = scorable.length || 1;
  const neutralRate = scorable.filter(response => Number(response.responseValue) === 3).length / denominator;
  const changedRate = scorable.filter(response => response.changedAnswer).length / denominator;
  const fastRate = scorable.filter(response => response.responseTimeMs < itemFastThresholdMs(response.promptWordCount)).length / denominator;
  const notApplicableRate = content.filter(response => response.notApplicable).length / (content.length || 1);
  const tooFast = activeDurationMs < minimumCompletionTimeMs(content.length);
  const flags = {
    attentionCheckPresented,
    failedAttentionCheck,
    straightlining: straightlinedBlocks.length > 0,
    straightlinedBlocks,
    tooFast,
    activeDurationMs,
    minimumActiveDurationMs: minimumCompletionTimeMs(content.length),
    neutralOveruse: neutralRate > 0.35,
    changedOften: changedRate > 0.18,
    fastItems: fastRate > 0.25,
    notApplicableOveruse: notApplicableRate > 0.15,
    neutralRate: Number(neutralRate.toFixed(2)),
    changedRate: Number(changedRate.toFixed(2)),
    fastRate: Number(fastRate.toFixed(2)),
    notApplicableRate: Number(notApplicableRate.toFixed(2))
  };
  flags.responseQuality = flags.failedAttentionCheck || flags.straightlining || flags.tooFast
    ? 'low'
    : flags.neutralOveruse || flags.fastItems || flags.notApplicableOveruse
      ? 'review'
      : 'adequate';
  return flags;
}

export function routeCoverage(responses) {
  const content = responses.filter(response => response.attentionExpected === null);
  const answered = content.filter(response =>
    response.notApplicable || response.responseValue !== null && response.responseValue !== undefined
  );
  const scorable = answered.filter(response =>
    !response.notApplicable && Number.isFinite(Number(response.responseValue))
  );
  return {
    contentItemCount: content.length,
    answeredItemCount: answered.length,
    scorableItemCount: scorable.length,
    notApplicableItemCount: answered.length - scorable.length,
    proportionAnswered: content.length ? Number((answered.length / content.length).toFixed(3)) : 0
  };
}

export function wordCount(text = '') {
  return (String(text).trim().match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || []).length;
}

export function getItemById(bank) {
  return new Map(Object.entries(bank.tests).flatMap(([testKey, test]) =>
    test.items.map(item => [item.id, { ...item, testKey }])
  ));
}

export {
  POSITION_EPSILON,
  RESEARCH_BOOKLET_CONFIG,
  RESEARCH_BOOKLET_TARGET,
  RESEARCH_BOOKLET_VARIANTS,
  RESEARCH_SAMPLING_STATUS,
  RESEARCH_SAMPLING_VERSION,
  SOCIONICS_FUNCTION_WEIGHTS,
  SOCIONICS_TIM_MODELS
};
