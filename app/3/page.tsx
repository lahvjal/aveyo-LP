'use client'

import { useState, FormEvent, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

export default function Page3() {
  const [formData, setFormData] = useState<FormData>({
    zipCode: '',
    homeOwnership: '',
    electricBill: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    // Tracking fields
    landing_page: '3',
    offer_name: 'Your Solar Journey Starts Here',
    utm_source: '',
    utm_campaign: '',
    utm_adset: '',
    utm_ad: '',
    fbclid: ''
  })
  const [submitted, setSubmitted] = useState(false)

  // Extract URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setFormData(prev => ({
        ...prev,
        landing_page: '3',
        offer_name: 'Your Solar Journey Starts Here',
        utm_source: params.get('utm_source') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_adset: params.get('utm_adset') || '',
        utm_ad: params.get('utm_ad') || '',
        fbclid: params.get('fbclid') || ''
      }))
    }
  }, [])

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="text-green-500 text-6xl mb-6">✓</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">We&apos;re on it!</h2>
          <p className="text-gray-700 text-lg">
            Your personalized solar quote is being prepared. Our team will reach out within 24 hours to discuss your savings potential.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Image 
            src="/aveyo-logo.svg" 
            alt="AVEYO" 
            width={90} 
            height={20}
            priority
            className="brightness-0 invert md:w-[112px] md:h-[24px]"
          />
          <Link href="/" className="text-white hover:text-gray-300 transition-colors flex items-center gap-2">
            <span className="text-xl">←</span>
            <span className="text-sm">Back</span>
          </Link>
        </div>
      </header>

      {/* Hero Image Section */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center mb-[-50px]">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src="/aveyo-home.png"
          alt="Solar panels on modern home"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center text-white max-w-3xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            Your solar journey starts here
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-100">
            Answer a few quick questions and get a personalized quote. Most homeowners save $1,500+ in their first year.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 pb-8 md:pb-12 lg:pb-16 relative z-30">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ZIP Code */}
            <div>
              <label className="block text-gray-900 font-semibold text-lg mb-3">
                What&apos;s your ZIP code?
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => updateFormData('zipCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="Enter ZIP code"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg"
                maxLength={5}
                required
              />
            </div>

            {/* Home Ownership */}
            <div>
              <label className="block text-gray-900 font-semibold text-base md:text-lg mb-3">
                Do you own your home?
              </label>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <label className="relative flex items-center justify-center p-4 md:p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-900 transition-colors min-h-[60px]">
                  <input
                    type="radio"
                    name="homeOwnership"
                    value="yes"
                    checked={formData.homeOwnership === 'yes'}
                    onChange={(e) => updateFormData('homeOwnership', e.target.value)}
                    className="sr-only"
                    required
                  />
                  <span className={`text-sm md:text-lg font-medium ${formData.homeOwnership === 'yes' ? 'text-gray-900' : 'text-gray-600'}`}>
                    Yes, I own
                  </span>
                  {formData.homeOwnership === 'yes' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </label>
                <label className="relative flex items-center justify-center p-4 md:p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-900 transition-colors min-h-[60px]">
                  <input
                    type="radio"
                    name="homeOwnership"
                    value="no"
                    checked={formData.homeOwnership === 'no'}
                    onChange={(e) => updateFormData('homeOwnership', e.target.value)}
                    className="sr-only"
                    required
                  />
                  <span className={`text-sm md:text-lg font-medium ${formData.homeOwnership === 'no' ? 'text-gray-900' : 'text-gray-600'}`}>
                    No, I rent
                  </span>
                  {formData.homeOwnership === 'no' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Electric Bill */}
            <div>
              <label className="block text-gray-900 font-semibold text-base md:text-lg mb-3">
                What&apos;s your average monthly electric bill?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {['$0 - $100', '$100 - $150', '$150 - $200', '$200 - $300', '$300+'].map((range) => (
                  <label key={range} className="relative flex items-center justify-center p-4 md:p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-900 transition-colors min-h-[60px]">
                    <input
                      type="radio"
                      name="electricBill"
                      value={range}
                      checked={formData.electricBill === range}
                      onChange={(e) => updateFormData('electricBill', e.target.value)}
                      className="sr-only"
                      required
                    />
                    <span className={`text-sm md:text-lg font-medium ${formData.electricBill === range ? 'text-gray-900' : 'text-gray-600'}`}>
                      {range}
                    </span>
                    {formData.electricBill === range && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t-2 border-gray-100 pt-8">
              <h3 className="text-gray-900 font-semibold text-xl mb-6">
                Where should we send your personalized quote?
              </h3>
              
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      placeholder="John"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      placeholder="Smith"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="john.smith@example.com"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value.replace(/\D/g, ''))}
                    placeholder="(555) 555-5555"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-5 rounded-xl hover:bg-gray-800 transition-colors text-lg font-semibold shadow-lg"
            >
              Get My Free Quote →
            </button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>✓</span> Free consultation
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span> No obligation
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span> Quick response
              </div>
            </div>
          </form>
        </div>

        {/* Social Proof */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-white rounded-full px-4 md:px-6 py-3 shadow-md">
            <div className="text-yellow-500 text-base md:text-lg">★★★★★</div>
            <span className="text-gray-700 font-medium text-sm md:text-base">300+ Reviews in Illinois</span>
          </div>
        </div>
      </main>
    </div>
  )
}
