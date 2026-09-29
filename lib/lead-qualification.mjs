export function isSupportedUtilityCompany(utilityCompany) {
  return utilityCompany === 'Ameren' || utilityCompany === 'ComEd'
}

export function isQualifiedLead({ homeOwnership, utilityCompany }) {
  return homeOwnership === 'yes' && isSupportedUtilityCompany(utilityCompany)
}

export function getDisqualificationReason({ homeOwnership, utilityCompany }) {
  if (homeOwnership === 'no') {
    return 'homeOwnership'
  }

  if (utilityCompany && !isSupportedUtilityCompany(utilityCompany)) {
    return 'utilityCompany'
  }

  return null
}
