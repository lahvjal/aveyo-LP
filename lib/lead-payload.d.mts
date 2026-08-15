import type { LeadPayload } from './lead-submission'

export function isLeadPayload(value: unknown): value is LeadPayload

export type GoHighLevelLeadPayload = LeadPayload & {
  address1: string
  postalCode: string
}

export function buildGoHighLevelLeadPayload(
  lead: LeadPayload,
  submittedAt?: string,
): GoHighLevelLeadPayload
