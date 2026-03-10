'use client'

import { useState, FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SunpowerStylePage() {
  const [zipCode, setZipCode] = useState('')
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (zipCode.length === 5) {
      router.push(`/form?zip=${zipCode}`)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Image 
            src="/aveyo-logo.svg" 
            alt="AVEYO" 
            width={112} 
            height={24}
            priority
            className="brightness-0 invert"
          />
          <Link href="/" className="text-white hover:text-gray-300 transition-colors flex items-center gap-2">
            <span className="text-xl">←</span>
            <span className="text-sm">Back</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/photo2.jpg)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 mx-auto px-8 py-20 text-white" style={{ maxWidth: '85vw', width: '100%' }}>
          {/* Top Badge */}
          <div className="flex justify-end mb-8 z-100">
            <div className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300">
              <span style={{ color: '#3498db' }}>300+</span> reviews<br />in Illinois
              <div className="text-gray-700">★★★★★</div>
            </div>
          </div>

          <div className="max-w-xl w-full">
            <h1 className="font-black mb-6 uppercase" style={{ fontSize: '100px', lineHeight: '1.1' }}>
              Go solar with $0 down
            </h1>
            
            <p className="text-lg mb-8">
              Cut your electricity bills with year-round leading solar panels and get instant savings with $0 money down. Start now with a free savings estimate.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="Enter Your Zip"
                maxLength={5}
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                type="submit"
                className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors whitespace-nowrap"
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
