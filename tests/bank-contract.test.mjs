import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  loadPinnedQuestionBank,
  validateManifest,
  validateQuestionBank
} from '../assets/test/bank.js';

const instrumentDirectory = path.resolve('assets/instruments');
const manifestPath = path.join(instrumentDirectory, 'instrument-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const bankPath = path.join(instrumentDirectory, manifest.file);
const bankText = fs.readFileSync(bankPath, 'utf8');
const bank = JSON.parse(bankText);

const expectedModules = {
  socionics: {
    instrumentVersion: 'socionics-exploratory-v0.5',
    measurementModel: 'socionics-element-profile-v1',
    calibrationStatus: 'exploratory',
    contentItemCount: 16,
    presentedItemCount: 17
  },
  psychosophy: {
    instrumentVersion: 'psychosophy-pilot-v0.6',
    measurementModel: 'multi-indicator-position-contrast-v2',
    calibrationStatus: 'precalibration',
    contentItemCount: 48,
    presentedItemCount: 49
  },
  temporistics: {
    instrumentVersion: 'temporistics-pilot-v0.6',
    measurementModel: 'multi-indicator-position-contrast-v2',
    calibrationStatus: 'precalibration',
    contentItemCount: 48,
    presentedItemCount: 49
  }
};

function cloneRelease() {
  return {
    manifest: structuredClone(manifest),
    bank: structuredClone(bank)
  };
}

test('the release points to one versioned snapshot with a matching SHA-256', () => {
  assert.equal(manifest.bankVersion, '2026-07-28.1');
  assert.equal(bank.bankVersion, manifest.bankVersion);
  assert.equal(
    manifest.file,
    `before-we-build-bank-${manifest.bankVersion}.json`
  );
  assert.equal(
    createHash('sha256').update(bankText).digest('hex'),
    manifest.sha256
  );
  assert.equal(validateManifest(manifest), manifest);
  assert.equal(validateQuestionBank(bank, manifest), bank);
});

test('manifest counts, versions, models, and calibration statuses match every module', () => {
  assert.deepEqual(manifest.modules, expectedModules);

  for (const [key, expected] of Object.entries(expectedModules)) {
    const module = bank.tests[key];
    const contentCount = module.items.filter(item => item.attention === undefined).length;

    assert.equal(module.version, expected.instrumentVersion);
    assert.equal(module.measurementModel, expected.measurementModel);
    assert.equal(module.calibrationStatus, expected.calibrationStatus);
    assert.equal(contentCount, expected.contentItemCount);
    assert.equal(module.items.length, expected.presentedItemCount);
  }
});

test('manifest count mismatches are rejected', () => {
  const wrongContentCount = cloneRelease();
  wrongContentCount.manifest.modules.socionics.contentItemCount += 1;
  assert.throws(
    () => validateQuestionBank(wrongContentCount.bank, wrongContentCount.manifest),
    /socionics: content count mismatch/
  );

  const wrongPresentedCount = cloneRelease();
  wrongPresentedCount.manifest.modules.temporistics.presentedItemCount -= 1;
  assert.throws(
    () => validateQuestionBank(wrongPresentedCount.bank, wrongPresentedCount.manifest),
    /temporistics: presented count mismatch/
  );
});

test('a missing bankVersion is rejected in both manifest and bank', () => {
  const missingManifestVersion = structuredClone(manifest);
  delete missingManifestVersion.bankVersion;
  assert.throws(
    () => validateManifest(missingManifestVersion),
    /Manifest bankVersion is required/
  );

  const missingBankVersion = structuredClone(bank);
  delete missingBankVersion.bankVersion;
  assert.throws(
    () => validateQuestionBank(missingBankVersion, manifest),
    /Question-bank bankVersion is required/
  );
});

test('bank, manifest, and module version mismatches are rejected', () => {
  const bankMismatch = cloneRelease();
  bankMismatch.bank.bankVersion = '2026-07-28.2';
  assert.throws(
    () => validateQuestionBank(bankMismatch.bank, bankMismatch.manifest),
    /version does not match manifest/
  );

  const moduleMismatch = cloneRelease();
  moduleMismatch.manifest.modules.psychosophy.instrumentVersion = 'psychosophy-pilot-v0.7';
  assert.throws(
    () => validateQuestionBank(moduleMismatch.bank, moduleMismatch.manifest),
    /psychosophy: instrument version mismatch/
  );

  const modelMismatch = cloneRelease();
  modelMismatch.manifest.modules.psychosophy.measurementModel =
    'multi-indicator-position-contrast-v1';
  assert.throws(
    () => validateQuestionBank(modelMismatch.bank, modelMismatch.manifest),
    /psychosophy: measurement model mismatch/
  );

  const statusMismatch = cloneRelease();
  statusMismatch.manifest.modules.socionics.calibrationStatus = 'precalibration';
  assert.throws(
    () => validateQuestionBank(statusMismatch.bank, statusMismatch.manifest),
    /socionics: calibration status mismatch/
  );
});

test('unversioned modules and items are rejected', () => {
  const unversionedModule = cloneRelease();
  delete unversionedModule.bank.tests.temporistics.version;
  assert.throws(
    () => validateQuestionBank(unversionedModule.bank, unversionedModule.manifest),
    /temporistics: instrument version is required/
  );

  const unversionedItem = cloneRelease();
  delete unversionedItem.bank.tests.socionics.items[0].version;
  assert.throws(
    () => validateQuestionBank(unversionedItem.bank, unversionedItem.manifest),
    /socionics\/soc_1: item version is required/
  );
});

test('duplicate item ids are rejected across module boundaries', () => {
  const duplicate = cloneRelease();
  duplicate.bank.tests.temporistics.items[0].id =
    duplicate.bank.tests.psychosophy.items[0].id;

  assert.throws(
    () => validateQuestionBank(duplicate.bank, duplicate.manifest),
    /Item ids must be globally unique/
  );
});

test('the runtime loader rejects a snapshot whose bytes do not match the manifest hash', async () => {
  let request = 0;
  const fetchImpl = async () => {
    request += 1;
    if (request === 1) {
      return {
        ok: true,
        status: 200,
        json: async () => structuredClone(manifest)
      };
    }
    return {
      ok: true,
      status: 200,
      text: async () => `${bankText}\n`
    };
  };

  await assert.rejects(
    () => loadPinnedQuestionBank({ fetchImpl }),
    /Question-bank hash does not match the release manifest/
  );
});
