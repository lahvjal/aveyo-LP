declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

// Custom event names surfaced in Meta Events Manager; usable as ad set
// conversion events (directly or via Custom Conversions). Keep names stable —
// renaming resets event history in Ads Manager.
const STEP_EVENT_NAMES: Record<number, string> = {
  1: 'Step1_Ownership_Completed',
  2: 'Step2_Bill_Completed',
  3: 'Step3_Zip_Completed',
  4: 'Step4_Email_Completed',
  5: 'Step5_Name_Completed',
  6: 'Step6_Phone_Completed',
  7: 'Step7_Address_Completed',
}

export function trackStepCompleted(step: number, pageSlug: string, offerName: string) {
  const eventName = STEP_EVENT_NAMES[step]
  if (!eventName) return
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, {
      step,
      content_name: offerName || undefined,
      content_category: pageSlug || undefined,
    })
  }
}

export function trackLead(pageSlug: string, offerName: string, eventId: string) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: offerName || undefined,
      content_category: pageSlug || undefined,
    }, {
      eventID: eventId,
    })
  }
}
