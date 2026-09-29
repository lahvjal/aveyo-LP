import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getDisqualificationReason,
  isQualifiedLead,
  isSupportedUtilityCompany,
} from '../lib/lead-qualification.mjs'

for (const utilityCompany of ['Ameren', 'ComEd']) {
  test(`${utilityCompany} homeowners can continue without a rejection`, () => {
    const answers = { homeOwnership: 'yes', utilityCompany }
    assert.equal(isSupportedUtilityCompany(utilityCompany), true)
    assert.equal(isQualifiedLead(answers), true)
    assert.equal(getDisqualificationReason(answers), null)
  })
}

test('Other utilities are rejected as soon as selected', () => {
  for (const homeOwnership of ['', 'yes']) {
    const answers = { homeOwnership, utilityCompany: 'Other' }
    assert.equal(isSupportedUtilityCompany(answers.utilityCompany), false)
    assert.equal(isQualifiedLead(answers), false)
    assert.equal(getDisqualificationReason(answers), 'utilityCompany')
  }
})

test('renters are rejected even before choosing a utility', () => {
  for (const utilityCompany of ['', 'Ameren', 'ComEd', 'Other']) {
    const answers = { homeOwnership: 'no', utilityCompany }
    assert.equal(isQualifiedLead(answers), false)
    assert.equal(getDisqualificationReason(answers), 'homeOwnership')
  }
})

test('unanswered qualifying questions cannot qualify a lead or show a rejection', () => {
  for (const answers of [
    { homeOwnership: '', utilityCompany: '' },
    { homeOwnership: 'yes', utilityCompany: '' },
    { homeOwnership: '', utilityCompany: 'Ameren' },
    { homeOwnership: '', utilityCompany: 'ComEd' },
  ]) {
    assert.equal(isQualifiedLead(answers), false)
    assert.equal(getDisqualificationReason(answers), null)
  }
})
