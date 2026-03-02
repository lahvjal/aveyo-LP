'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function SunpowerStylePage() {
  const [zipCode, setZipCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('ZIP Code submitted:', zipCode)
    // Handle form submission
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/family-movienight.png)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-20 text-white">
          {/* Logo */}
          <div className="absolute top-8 left-8">
            <Image 
              src="/aveyo-logo.svg" 
              alt="AVEYO" 
              width={112} 
              height={24}
              priority
              className="brightness-0 invert"
            />
          </div>

          {/* Top Badge */}
          <div className="flex justify-end mb-8">
            <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold">
              Top-Rated Solar<br />in the U.S.
              <div className="text-yellow-600">★★★★★</div>
            </div>
          </div>

          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get the world&apos;s most efficient solar<sup className="text-2xl">*</sup> with $0 down and save more
            </h1>
            
            <p className="text-lg mb-8">
              Cut your electricity bills with year-round leading solar panels  and get instant savings with $0 money down. Start now with a free savings estimate.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="Enter Your Zip"
                maxLength={5}
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors whitespace-nowrap"
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

      {/* Blue Banner */}
      <section className="bg-blue-900 text-white py-6 text-center">
        <h3 className="text-xl md:text-2xl font-semibold">
          Start Saving in Your First Month
        </h3>
      </section>

      {/* Tax Credit Section */}
      <section className="bg-gradient-to-r from-yellow-300 to-yellow-400 py-16 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Solar leases keep the tax credit alive. We take on the cost, you enjoy the savings.
            </h2>
            <p className="text-gray-800">
              If you lease a solar system in 2026, we apply the credit  on your behalf and reduce your lease cost  so you save just like with any lower rebate!
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-700 mb-4">
              See if you qualify for a real lease: Enter your zip code or email to get started
            </p>
            <form className="flex gap-3">
              <input
                type="text"
                placeholder="Your Zip Code"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Next
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-700">
            Saving with SunPower is easy and fast. Win a SunPower cash swag, you can kick it! Making savings that can turbocharge! Full wealth-all-in: 30 years
          </p>
        </div>
      </section>

      {/* Why Go Solar Section */}
      <section className="bg-gradient-to-b from-gray-900 to-black text-white py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why go solar?
          </h2>
          <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto">
            From saving money on your electricity bills to helping save the planet, there&apos;s more than a battle time to go solar with SunPower
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side - Stats */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-start gap-4">
                <div className="bg-white rounded-full p-3 flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">$1000s/year</h3>
                  <p className="text-gray-300">Annual Savings</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-start gap-4">
                <div className="bg-white rounded-full p-3 flex-shrink-0">
                  <span className="text-2xl">🏠</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Offset bills</h3>
                  <p className="text-gray-300">100% with $0 Down</p>
                </div>
              </div>
            </div>

            {/* Right Side - Benefits */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-white rounded-full p-3">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">$220/mo $22/mo</h3>
                    <p className="text-sm text-gray-300">Going solar saves<br />Starting without a Power</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-white rounded-full p-3">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">30% 30%</h3>
                    <p className="text-sm text-gray-300">Solar Power vs<br />Federal federal<br />energy+ tax credit</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white rounded-full p-3">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">
                      An out-carbon emissions reduced to one-net-zero by 2040. All your payment residential solar system
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
