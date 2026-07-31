'use client'

export const CONSENT_TEXT =
  'By checking this box, I agree to receive calls and text messages (including via automated technology and prerecorded messages) from Aveyo and its partners about my solar quote at the phone number provided. Consent is not a condition of purchase. Message and data rates may apply. Message frequency varies. Reply STOP to opt out.'

export default function ConsentCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer text-left">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-black"
      />
      <span className="text-xs leading-relaxed text-gray-600">
        {CONSENT_TEXT}{' '}
        <a
          href="https://www.aveyo.com/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Privacy Policy
        </a>
      </span>
    </label>
  )
}
