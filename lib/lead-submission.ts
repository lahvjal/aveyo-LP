export interface LeadPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  zipCode: string
  address: string
  city: string
  homeOwnership: string
  electricBill: string
  pageSlug: string
  offerName: string
  utmSource: string
  utmCampaign: string
  utmAdset: string
  utmAd: string
  fbclid: string
  consentToContact: 'yes' | 'no'
  submittedAt: string
}

export interface LeadSubmissionResult {
  eventId: string
}

export async function submitLead(payload: LeadPayload): Promise<LeadSubmissionResult> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => null) as {
    error?: string
    eventId?: string
  } | null

  if (!response.ok) {
    throw new Error(result?.error || 'We could not submit your information. Please try again.')
  }

  if (!result?.eventId) {
    throw new Error('The submission was accepted without a tracking ID. Please try again.')
  }

  return {
    eventId: result.eventId,
  }
}
