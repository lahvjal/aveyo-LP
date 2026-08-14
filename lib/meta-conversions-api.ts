import { createHash } from 'crypto'
import type { LeadPayload } from '@/lib/lead-submission'

const DEFAULT_META_DATASET_ID = '831171509159406'
const DEFAULT_META_GRAPH_API_VERSION = 'v22.0'

interface MetaLeadContext {
  eventId: string
  sourceUrl: string
  clientIpAddress?: string
  clientUserAgent?: string
  fbp?: string
  fbc?: string
}

interface MetaConversionsApiResponse {
  events_received?: number
  fbtrace_id?: string
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

function hashIfPresent(value: string, normalize: (input: string) => string = normalizeText) {
  const normalized = normalize(value)
  return normalized ? [sha256(normalized)] : undefined
}

function removeEmptyValues<T extends Record<string, unknown>>(values: T) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined && value !== ''),
  )
}

export async function sendMetaLead(
  lead: LeadPayload,
  context: MetaLeadContext,
): Promise<MetaConversionsApiResponse | null> {
  const accessToken = process.env.META_ACCESS_TOKEN?.trim()

  // Lead capture must keep working if CAPI is not configured in a local or
  // preview environment. Production config supplies this server-only secret.
  if (!accessToken) {
    console.warn('Meta CAPI Lead event skipped: META_ACCESS_TOKEN is not configured')
    return null
  }

  const datasetId = process.env.META_DATASET_ID?.trim() || DEFAULT_META_DATASET_ID
  const apiVersion = process.env.META_GRAPH_API_VERSION?.trim() || DEFAULT_META_GRAPH_API_VERSION
  const endpoint = `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(datasetId)}/events`

  const userData = removeEmptyValues({
    em: hashIfPresent(lead.email, (value) => value.trim().toLowerCase()),
    ph: hashIfPresent(lead.phone, (value) => value.replace(/\D/g, '')),
    fn: hashIfPresent(lead.firstName),
    ln: hashIfPresent(lead.lastName),
    ct: hashIfPresent(lead.city),
    zp: hashIfPresent(lead.zipCode, (value) => value.trim().toLowerCase()),
    country: [sha256('us')],
    client_ip_address: context.clientIpAddress,
    client_user_agent: context.clientUserAgent,
    fbp: context.fbp,
    fbc: context.fbc,
  })

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      data: [
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: context.eventId,
          action_source: 'website',
          event_source_url: context.sourceUrl,
          user_data: userData,
          custom_data: removeEmptyValues({
            content_name: lead.offerName.trim() || undefined,
            content_category: lead.pageSlug.trim() || undefined,
          }),
        },
      ],
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
  })

  const result = await response.json().catch(() => null) as MetaConversionsApiResponse | null

  if (!response.ok || !result?.events_received) {
    throw new Error(`Meta CAPI rejected Lead event with status ${response.status}`)
  }

  return result
}
