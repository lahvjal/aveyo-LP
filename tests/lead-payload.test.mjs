import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildGoHighLevelLeadPayload,
  isLeadPayload,
} from '../lib/lead-payload.mjs'

const validLead = {
  firstName: 'Test',
  lastName: 'Lead',
  email: 'test@example.com',
  phone: '+12025550110',
  zipCode: '62704',
  address: '123 Test Avenue',
  utilityCompany: 'Ameren',
  homeOwnership: 'yes',
  electricBill: '$150 - $200',
  pageSlug: '1',
  offerName: 'Test offer',
  utmSource: 'test',
  utmCampaign: 'address-regression',
  utmAdset: '',
  utmAd: '',
  fbclid: '',
  consentToContact: 'yes',
  submittedAt: '2026-08-14T00:00:00.000Z',
}

test('accepts a complete lead without city or state', () => {
  assert.equal(isLeadPayload(validLead), true)
})

test('rejects a blank street address', () => {
  assert.equal(isLeadPayload({ ...validLead, address: '   ' }), false)
})

for (const utilityCompany of ['Ameren', 'ComEd']) {
  test(`accepts a homeowner with ${utilityCompany}`, () => {
    assert.equal(isLeadPayload({ ...validLead, utilityCompany }), true)
  })
}

for (const utilityCompany of ['Other', '', 'Unknown']) {
  test(`rejects an unsupported or missing utility: ${JSON.stringify(utilityCompany)}`, () => {
    assert.equal(isLeadPayload({ ...validLead, utilityCompany }), false)
  })
}

for (const homeOwnership of ['no', '', 'unknown']) {
  for (const utilityCompany of ['Ameren', 'ComEd', 'Other']) {
    test(`rejects home ownership ${JSON.stringify(homeOwnership)} with ${utilityCompany}`, () => {
      assert.equal(isLeadPayload({ ...validLead, homeOwnership, utilityCompany }), false)
    })
  }
}

test('normalizes GHL address and postal-code aliases', () => {
  const payload = buildGoHighLevelLeadPayload(
    { ...validLead, address: '  123 Test Avenue  ', zipCode: '62704' },
    '2026-08-14T12:00:00.000Z',
  )

  assert.equal(payload.address, '123 Test Avenue')
  assert.equal(payload.address1, '123 Test Avenue')
  assert.equal(payload.zipCode, '62704')
  assert.equal(payload.postalCode, '62704')
  assert.equal(payload.utilityCompany, 'Ameren')
  assert.equal(payload.submittedAt, '2026-08-14T12:00:00.000Z')
  assert.equal('city' in payload, false)
  assert.equal('state' in payload, false)
})
