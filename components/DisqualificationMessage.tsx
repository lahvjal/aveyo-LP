interface DisqualificationMessageProps {
  spacious?: boolean
}

export default function DisqualificationMessage({ spacious = false }: DisqualificationMessageProps) {
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
        We don&apos;t currently offer service through your utility company. Thank you for your interest in Aveyo.
      </p>
    </div>
  )
}
