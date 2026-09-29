import assert from 'node:assert/strict'
import test from 'node:test'
import { getFormStepIds, ZIP_STEP_ID } from '../lib/form-steps.mjs'

for (const zip of ['62704', '01234']) {
  test(`a ZIP already captured on the landing page is not asked again: ${zip}`, () => {
    const steps = getFormStepIds(zip)
    assert.deepEqual(steps, [1, 2, 3, 5, 6, 7, 8])
    assert.equal(steps.includes(ZIP_STEP_ID), false)
    // Forward and Back both connect the bill and email questions directly.
    assert.equal(steps[steps.indexOf(3) + 1], 5)
    assert.equal(steps[steps.indexOf(5) - 1], 3)
    // Seven displayed questions must still end at the address/consent step.
    assert.equal(steps[steps.length - 1], 8)
  })
}

for (const zip of ['', '6270', '627040', 'abcde', '62704-1234']) {
  test(`a missing or invalid initial ZIP keeps exactly one ZIP question: ${JSON.stringify(zip)}`, () => {
    const steps = getFormStepIds(zip)
    assert.deepEqual(steps, [1, 2, 3, 4, 5, 6, 7, 8])
    assert.equal(steps.filter((step) => step === ZIP_STEP_ID).length, 1)
  })
}
