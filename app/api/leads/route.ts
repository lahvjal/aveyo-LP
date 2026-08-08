import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import type { LeadPayload } from '@/lib/lead-submission'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ELECTRIC_BILL_RANGES = new Set([
  '$0 - $100',
  '$100 - $150',
  '$150 - $200',
  '$200 - $300',
  '$300+',
])

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isLeadPayload(value: unknown): value is LeadPayload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const payload = value as Record<string, unknown>
  const stringFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'zipCode',
    'address',
    'city',
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

  if (!stringFields.every((field) => isString(payload[field]))) {
    return false
  }

  const lead = payload as unknown as LeadPayload

  return (
    lead.firstName.trim().length > 0 &&
    lead.lastName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim()) &&
    /^\+1\d{10}$/.test(lead.phone) &&
    /^\d{5}$/.test(lead.zipCode) &&
    (lead.homeOwnership === 'yes' || lead.homeOwnership === 'no') &&
    ELECTRIC_BILL_RANGES.has(lead.electricBill) &&
    lead.consentToContact === 'yes'
  )
}

export async function POST(request: NextRequest) {
  let requestBody: unknown

  try {
    requestBody = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON submission.' }, { status: 400 })
  }

  if (!isLeadPayload(requestBody)) {
    return NextResponse.json({ error: 'Please review the required form fields and try again.' }, { status: 400 })
  }

  const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL?.trim()
  if (!ghlWebhookUrl) {
    console.error('GHL_WEBHOOK_URL is not configured')
    return NextResponse.json({ error: 'Lead submission is temporarily unavailable.' }, { status: 500 })
  }

  const payload: LeadPayload = {
    ...requestBody,
    submittedAt: new Date().toISOString(),
  }

  let ghlResponse: Response

  try {
    ghlResponse = await fetch(ghlWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })
  } catch (error) {
    console.error('GoHighLevel lead submission failed', error)
    return NextResponse.json(
      { error: 'We could not submit your information. Please try again.' },
      { status: 502 },
    )
  }

  if (!ghlResponse.ok) {
    console.error('GoHighLevel lead submission failed', ghlResponse.status)
    return NextResponse.json(
      { error: 'We could not submit your information. Please try again.' },
      { status: 502 },
    )
  }

  const eventId = randomUUID()

  return NextResponse.json({ success: true, eventId })
}
