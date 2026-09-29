import type { DisqualificationReason } from '@/lib/lead-qualification.mjs'

interface DisqualificationMessageProps {
  reason: DisqualificationReason
  spacious?: boolean
}

export default function DisqualificationMessage({ reason, spacious = false }: DisqualificationMessageProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 text-center ${spacious ? 'p-12' : 'p-8'}`}>
      <div
        aria-hidden="true"
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold text-gray-700"
      >
        i
      </div>
      <h2 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
        Sorry, we&apos;re not a good fit
      </h2>
      <p className="mx-auto max-w-xl text-gray-700 md:text-lg">
        {reason === 'homeOwnership'
          ? 'Our solar program is currently available only to homeowners. Thank you for your interest in Aveyo.'
          : 'We currently offer service only to Ameren and ComEd customers. Thank you for your interest in Aveyo.'}
      </p>
    </div>
  )
}
