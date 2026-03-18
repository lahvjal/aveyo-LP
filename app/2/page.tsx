'use client'

import { useState, FormEvent, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Page2() {
  const [zipCode, setZipCode] = useState('')
  const router = useRouter()
  const [urlParams, setUrlParams] = useState('')

  // Capture URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrlParams(window.location.search)
    }
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (zipCode.length === 5) {
      // Pass through all URL parameters plus the page info
      const params = new URLSearchParams(urlParams)
      params.set('zip', zipCode)
      params.set('pageSlug', '2')
      params.set('offerName', 'Go Solar With $0 Down')
      router.push(`/form?${params.toString()}`)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <Image 
            src="/aveyo-logo.svg" 
            alt="AVEYO" 
            width={112} 
            height={24}
            priority
            className="brightness-0 invert"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/photo2.jpg)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 mx-auto px-4 md:px-8 py-20 text-white w-full max-w-7xl">
          {/* Top Badge */}
          <div className="flex justify-end mb-8">
            <div className="bg-white text-black px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold border border-gray-300">
              <span style={{ color: '#3498db' }}>300+</span> reviews<br />in Illinois
              <div className="text-gray-700">★★★★★</div>
            </div>
          </div>

          <div className="max-w-xl w-full">
            <h1 className="font-black mb-6 uppercase text-5xl md:text-7xl lg:text-8xl" style={{ lineHeight: '1.1' }}>
              Go solar with $0 down
            </h1>
            
            <p className="text-base md:text-lg mb-8">
              Cut your electricity bills with year-round leading solar panels and get instant savings with $0 money down. Start now with a free savings estimate.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="Enter Your Zip"
                maxLength={5}
                className="flex-1 px-4 md:px-6 py-3 md:py-4 rounded-lg text-gray-900 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                type="submit"
                className="bg-white hover:bg-gray-100 text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-colors whitespace-nowrap"
              >
                Get Estimate ▸
              </button>
            </form>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span>✓</span> 100% in
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span> Easy
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span> Affordable
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
