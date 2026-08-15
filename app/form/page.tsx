'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, FormEvent, useEffect } from 'react'
import Image from 'next/image'
import { trackLead } from '@/lib/meta-pixel'
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

function FormContent() {
  const searchParams = useSearchParams()
  const initialZip = searchParams.get('zip') || ''
  
  const [currentStep, setCurrentStep] = useState(initialZip ? 2 : 1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: initialZip,
    address: '',
    homeOwnership: '',
    electricBill: '',
    pageSlug: searchParams.get('pageSlug') || '',
    offerName: searchParams.get('offerName') || '',
    utmSource: searchParams.get('utm_source') || '',
    utmCampaign: searchParams.get('utm_campaign') || '',
    utmAdset: searchParams.get('utm_adset') || '',
    utmAd: searchParams.get('utm_ad') || '',
    fbclid: searchParams.get('fbclid') || ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [consentToContact, setConsentToContact] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const totalSteps = 7
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return /^\d{5}$/.test(formData.zipCode)
      case 2:
        return formData.address.trim() !== ''
      case 3:
        return formData.homeOwnership !== ''
      case 4:
        return formData.electricBill !== ''
      case 5:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      case 6:
        return formData.firstName.trim() !== '' && formData.lastName.trim() !== ''
      case 7:
        return formData.phone.length >= 10 && consentToContact
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

  const nextStep = () => {
    if (validateStep() && currentStep < totalSteps) {
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
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
          <div className="text-green-500 text-6xl mb-6">✓</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Thank you for your submission!</h3>
          <p className="text-gray-700 text-lg">Our team is putting together a personalized quote for your home. We&apos;ll be reaching out in 1-2 business days.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      {/* Logo */}
      <div className="fixed top-8 left-8 z-50">
        <Image 
          src="/aveyo-logo.svg" 
          alt="AVEYO" 
          width={112} 
          height={24}
          priority
        />
      </div>

      {/* Form Container */}
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-8 md:p-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Step {currentStep} of {totalSteps}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: ZIP Code */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <label className="block text-gray-900 font-semibold text-2xl mb-4">
                  What&apos;s your ZIP code?
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData('zipCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="Enter your ZIP code"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                  maxLength={5}
                />
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep()}
                  className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                >
                  Next
                </button>
              </div>
            )}

            {/* Step 2: Street Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <label className="block text-gray-900 font-semibold text-2xl mb-4">
                  What&apos;s your street address?
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="123 Main Street"
                  autoComplete="street-address"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                />
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition-colors text-lg font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep()}
                    className="flex-1 bg-black text-white py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Home Ownership */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <label className="block text-gray-900 font-semibold text-2xl mb-4">
                  Do you own your home?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-6 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors">
                    <input
                      type="radio"
                      name="homeOwnership"
                      value="yes"
                      checked={formData.homeOwnership === 'yes'}
                      onChange={(e) => updateFormData('homeOwnership', e.target.value)}
                      className="mr-4 w-5 h-5"
                    />
                    <span className="text-gray-900 text-lg">Yes</span>
                  </label>
                  <label className="flex items-center p-6 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors">
                    <input
                      type="radio"
                      name="homeOwnership"
                      value="no"
                      checked={formData.homeOwnership === 'no'}
                      onChange={(e) => updateFormData('homeOwnership', e.target.value)}
                      className="mr-4 w-5 h-5"
                    />
                    <span className="text-gray-900 text-lg">No</span>
                  </label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition-colors text-lg font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep()}
                    className="flex-1 bg-black text-white py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Electric Bill */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <label className="block text-gray-900 font-semibold text-2xl mb-4">
                  What&apos;s your average monthly electric bill?
                </label>
                <div className="space-y-3">
                  {['$0 - $100', '$100 - $150', '$150 - $200', '$200 - $300', '$300+'].map((range) => (
                    <label key={range} className="flex items-center p-6 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors">
                      <input
                        type="radio"
                        name="electricBill"
                        value={range}
                        checked={formData.electricBill === range}
                        onChange={(e) => updateFormData('electricBill', e.target.value)}
                        className="mr-4 w-5 h-5"
                      />
                      <span className="text-gray-900 text-lg">{range}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition-colors text-lg font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep()}
                    className="flex-1 bg-black text-white py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Email */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <label className="block text-gray-900 font-semibold text-2xl mb-4">
                  What&apos;s your email address?
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                />
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition-colors text-lg font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep()}
                    className="flex-1 bg-black text-white py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Name */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <label className="block text-gray-900 font-semibold text-2xl mb-4">
                  What&apos;s your name?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="First name"
                    className="px-6 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Last name"
                    className="px-6 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition-colors text-lg font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep()}
                    className="flex-1 bg-black text-white py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 7: Phone */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <label className="block text-gray-900 font-semibold text-2xl mb-4">
                  What&apos;s your phone number?
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="(555) 555-5555"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                />
                <ConsentCheckbox checked={consentToContact} onChange={setConsentToContact} />
                {submitError && (
                  <p role="alert" className="text-sm text-red-600">
                    {submitError}
                  </p>
                )}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition-colors text-lg font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!validateStep() || isSubmitting}
                    className="flex-1 bg-black text-white py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                  >
                    {isSubmitting ? 'Submitting…' : 'Get My Quote'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default function FormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    }>
      <FormContent />
    </Suspense>
  )
}
