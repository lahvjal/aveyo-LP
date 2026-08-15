import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { buildGoHighLevelLeadPayload, isLeadPayload } from '@/lib/lead-payload.mjs'
import { sendMetaLead } from '@/lib/meta-conversions-api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getClientIpAddress(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || undefined
}

function getEventSourceUrl(request: NextRequest, pageSlug: string) {
  const referer = request.headers.get('referer')

  if (referer) {
    try {
      const url = new URL(referer)

      if (url.protocol === 'https:' || url.protocol === 'http:') {
        return url.toString()
      }
    } catch {
      // Fall back to the known public landing-page domain below.
    }
  }

  return `https://illinois.aveyo.com/${encodeURIComponent(pageSlug)}`
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
    console.error('Lead submission configuration error: GHL_WEBHOOK_URL is not configured')
    return NextResponse.json(
      { error: 'Lead submission is temporarily unavailable.' },
      { status: 503 },
    )
  }

  const payload = buildGoHighLevelLeadPayload(requestBody)

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
  const fbp = request.cookies.get('_fbp')?.value
  const fbc = request.cookies.get('_fbc')?.value
    || (payload.fbclid ? `fb.1.${Date.now()}.${payload.fbclid}` : undefined)

  try {
    const metaResult = await sendMetaLead(payload, {
      eventId,
      sourceUrl: getEventSourceUrl(request, payload.pageSlug),
      clientIpAddress: getClientIpAddress(request),
      clientUserAgent: request.headers.get('user-agent') || undefined,
      fbp,
      fbc,
    })

    if (metaResult) {
      console.info('Meta CAPI Lead event accepted', {
        eventId,
        eventsReceived: metaResult.events_received,
        traceId: metaResult.fbtrace_id,
      })
    }
  } catch (error) {
    // Do not lose a lead that GHL already accepted. The browser Pixel still
    // receives this same event ID, while the server failure is visible in logs.
    console.error('Meta CAPI Lead event failed', {
      eventId,
      message: error instanceof Error ? error.message : 'Unknown Meta CAPI error',
    })
  }

  return NextResponse.json({ success: true, eventId })
}
