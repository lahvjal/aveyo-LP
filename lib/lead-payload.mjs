const ELECTRIC_BILL_RANGES = new Set([
  '$0 - $100',
  '$100 - $150',
  '$150 - $200',
  '$200 - $300',
  '$300+',
])

function isString(value) {
  return typeof value === 'string'
}

export function isLeadPayload(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const stringFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'zipCode',
    'address',
    'homeOwnership',
    'electricBill',
    'pageSlug',
    'offerName',
    'utmSource',
    'utmCampaign',
    'utmAdset',
    'utmAd',
    'fbclid',
    'consentToContact',
    'submittedAt',
  ]

  if (!stringFields.every((field) => isString(value[field]))) {
    return false
  }

  return (
    value.firstName.trim().length > 0 &&
    value.lastName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()) &&
    /^\+1\d{10}$/.test(value.phone) &&
    /^\d{5}$/.test(value.zipCode) &&
    value.address.trim().length > 0 &&
    (value.homeOwnership === 'yes' || value.homeOwnership === 'no') &&
    ELECTRIC_BILL_RANGES.has(value.electricBill) &&
    value.consentToContact === 'yes'
  )
}

export function buildGoHighLevelLeadPayload(
  lead,
  submittedAt = new Date().toISOString(),
) {
  const address = lead.address.trim()
  const zipCode = lead.zipCode.trim()

  return {
    ...lead,
    address,
    zipCode,
    address1: address,
    postalCode: zipCode,
    submittedAt,
  }
}
