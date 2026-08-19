'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
import { trackLead, trackStepCompleted } from '@/lib/meta-pixel'
import { submitLead } from '@/lib/lead-submission'
import ConsentCheckbox from '@/components/ConsentCheckbox'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  zipCode: string
  address: string
  homeOwnership: string
  electricBill: string
  pageSlug: string
  offerName: string
  utmSource: string
  utmCampaign: string
  utmAdset: string
  utmAd: string
  fbclid: string
}

interface MultiStepFormProps {
  pageSlug: string
  offerName?: string
}

export default function MultiStepForm({ pageSlug, offerName = '' }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    address: '',
    homeOwnership: '',
    electricBill: '',
    pageSlug: pageSlug,
    offerName: offerName,
    utmSource: '',
    utmCampaign: '',
    utmAdset: '',
    utmAd: '',
    fbclid: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [consentToContact, setConsentToContact] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Extract URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setFormData(prev => ({
        ...prev,
        pageSlug: pageSlug,
        offerName: offerName,
        utmSource: params.get('utm_source') || '',
        utmCampaign: params.get('utm_campaign') || '',
        utmAdset: params.get('utm_adset') || '',
        utmAd: params.get('utm_ad') || '',
        fbclid: params.get('fbclid') || ''
      }))
    }
  }, [pageSlug, offerName])

  const totalSteps = 7
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Step order puts the easy qualifying questions first and the
  // highest-friction ask (street address) last, when commitment is highest.
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.homeOwnership !== ''
      case 2:
        return formData.electricBill !== ''
      case 3:
        return /^\d{5}$/.test(formData.zipCode)
      case 4:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      case 5:
        return formData.firstName.trim() !== '' && formData.lastName.trim() !== ''
      case 6:
        return formData.phone.length >= 10
      case 7:
        return formData.address.trim() !== '' && consentToContact
      default:
        return true
    }
  }

  const validateStep = (): boolean => isStepValid(currentStep)

  const validateAllSteps = (): boolean => {
    for (let step = 1; step <= totalSteps; step++) {
      if (!isStepValid(step)) {
        setCurrentStep(step)
        return false
      }
    }
    return true
  }

  // Fire each step's custom pixel event only once per session, so navigating
  // back and re-advancing doesn't inflate funnel counts in Events Manager.
  const trackedStepsRef = useRef<Set<number>>(new Set())

  const markStepCompleted = (step: number) => {
    if (!trackedStepsRef.current.has(step)) {
      trackedStepsRef.current.add(step)
      trackStepCompleted(step, pageSlug, offerName)
    }
  }

  const nextStep = () => {
    if (validateStep() && currentStep < totalSteps) {
      markStepCompleted(currentStep)
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    // Enter key on intermediate steps triggers implicit form submission;
    // advance to the next step instead of submitting early.
    if (currentStep < totalSteps) {
      nextStep()
      return
    }

    if (validateAllSteps()) {
      setIsSubmitting(true)
      setSubmitError('')

      try {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone ? `+1${formData.phone}` : '',
          zipCode: formData.zipCode,
          address: formData.address,
          homeOwnership: formData.homeOwnership,
          electricBill: formData.electricBill,
          pageSlug: formData.pageSlug,
          offerName: formData.offerName,
          utmSource: formData.utmSource,
          utmCampaign: formData.utmCampaign,
          utmAdset: formData.utmAdset,
          utmAd: formData.utmAd,
          fbclid: formData.fbclid,
          consentToContact: 'yes' as const,
          submittedAt: new Date().toISOString()
        }

        const result = await submitLead(payload)
        markStepCompleted(totalSteps)
        trackLead(formData.pageSlug, formData.offerName, result.eventId)
        setSubmitted(true)
      } catch (error) {
        setSubmitError(error instanceof Error
          ? error.message
          : 'We could not submit your information. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your submission!</h3>
        <p className="text-gray-700">Our team is putting together a personalized quote for your home. We&apos;ll be reaching out in 1-2 business days.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Step {currentStep} of {totalSteps}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Home Ownership */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <label className="block text-gray-900 font-medium mb-4">
              Do you own your home?
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="homeOwnership"
                  value="yes"
                  checked={formData.homeOwnership === 'yes'}
                  onChange={(e) => updateFormData('homeOwnership', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-900">Yes</span>
              </label>
              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="homeOwnership"
                  value="no"
                  checked={formData.homeOwnership === 'no'}
                  onChange={(e) => updateFormData('homeOwnership', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-900">No</span>
              </label>
            </div>
            <button
              type="button"
              onClick={nextStep}
              disabled={!validateStep()}
              className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Electric Bill */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <label className="block text-gray-900 font-medium mb-4">
              What&apos;s your average monthly electric bill?
            </label>
            <div className="space-y-3">
              {['$0 - $100', '$100 - $150', '$150 - $200', '$200 - $300', '$300+'].map((range) => (
                <label key={range} className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="electricBill"
                    value={range}
                    checked={formData.electricBill === range}
                    onChange={(e) => updateFormData('electricBill', e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-900">{range}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateStep()}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: ZIP Code */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <label className="block text-gray-900 font-medium mb-2">
              What&apos;s your ZIP code?
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => updateFormData('zipCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="Enter your ZIP code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={5}
            />
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateStep()}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Email */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <label className="block text-gray-900 font-medium mb-2">
              What&apos;s your email address?
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateStep()}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Name */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <label className="block text-gray-900 font-medium mb-2">
              What&apos;s your name?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                placeholder="First name"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                placeholder="Last name"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateStep()}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Phone */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <label className="block text-gray-900 font-medium mb-2">
              What&apos;s your phone number?
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="(555) 555-5555"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateStep()}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Street Address */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <label className="block text-gray-900 font-medium mb-2">
              What&apos;s your street address?
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              placeholder="123 Main Street"
              autoComplete="street-address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ConsentCheckbox checked={consentToContact} onChange={setConsentToContact} />
            {submitError && (
              <p role="alert" className="text-sm text-red-600">
                {submitError}
              </p>
            )}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!validateStep() || isSubmitting}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting…' : 'Get My Quote'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
