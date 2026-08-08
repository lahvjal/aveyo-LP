declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
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
