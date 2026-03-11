'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, FormEvent, useEffect } from 'react'
import Image from 'next/image'

interface FormData {
  zipCode: string
  homeOwnership: string
  electricBill: string
  email: string
  firstName: string
  lastName: string
  phone: string
  // Tracking fields
  landing_page: string
  offer_name: string
  utm_source: string
  utm_campaign: string
  utm_adset: string
  utm_ad: string
  fbclid: string
}

function FormContent() {
  const searchParams = useSearchParams()
  const initialZip = searchParams.get('zip') || ''
  
  const [currentStep, setCurrentStep] = useState(initialZip ? 2 : 1)
  const [formData, setFormData] = useState<FormData>({
    zipCode: initialZip,
    homeOwnership: '',
    electricBill: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    // Tracking fields
    landing_page: searchParams.get('landing_page') || '',
    offer_name: searchParams.get('offer_name') || '',
    utm_source: searchParams.get('utm_source') || '',
    utm_campaign: searchParams.get('utm_campaign') || '',
    utm_adset: searchParams.get('utm_adset') || '',
    utm_ad: searchParams.get('utm_ad') || '',
    fbclid: searchParams.get('fbclid') || ''
  })
  const [submitted, setSubmitted] = useState(false)

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return /^\d{5}$/.test(formData.zipCode)
      case 2:
        return formData.homeOwnership !== ''
      case 3:
        return formData.electricBill !== ''
      case 4:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      case 5:
        return formData.firstName !== '' && formData.lastName !== ''
      case 6:
        return formData.phone.length >= 10
      default:
        return true
    }
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
    if (validateStep()) {
      console.log('Form submitted:', formData)
      setSubmitted(true)
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

            {/* Step 2: Home Ownership */}
            {currentStep === 2 && (
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

            {/* Step 3: Electric Bill */}
            {currentStep === 3 && (
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

            {/* Step 4: Email */}
            {currentStep === 4 && (
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

            {/* Step 5: Name */}
            {currentStep === 5 && (
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

            {/* Step 6: Phone */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <label className="block text-gray-900 font-semibold text-2xl mb-4">
                  What&apos;s your phone number?
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value.replace(/\D/g, ''))}
                  placeholder="(555) 555-5555"
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
                    type="submit"
                    disabled={!validateStep()}
                    className="flex-1 bg-black text-white py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                  >
                    Get My Quote
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
