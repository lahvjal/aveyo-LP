export interface LeadQualification {
  homeOwnership: string
  utilityCompany: string
}

export type DisqualificationReason = 'homeOwnership' | 'utilityCompany'

export function isSupportedUtilityCompany(utilityCompany: string): boolean

export function isQualifiedLead(qualification: LeadQualification): boolean

export function getDisqualificationReason(
  qualification: LeadQualification,
): DisqualificationReason | null
