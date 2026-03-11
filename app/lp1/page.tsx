'use client'

import MultiStepForm from '@/components/MultiStepForm'
import Image from 'next/image'
import Link from 'next/link'

export default function LP1Page() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Hero Image - Shows only on mobile */}
      <div className="lg:hidden relative h-[200px] w-full">
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-aveyo-blue opacity-20 z-10"></div>
        <Image
          src="/photo1.jpg"
          alt="Family enjoying time together at home"
          fill
          className="object-cover"
          priority
        />
        {/* Mobile Navbar - Over the photo */}
        <div className="absolute top-0 left-0 right-0 z-30 p-6 flex items-center justify-between">
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
        {/* Badge - Bottom Right on Mobile */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-white text-black px-3 py-2 rounded-lg text-xs font-semibold border border-gray-300 shadow-lg">
            <span style={{ color: '#3498db' }}>300+</span> reviews<br />in Illinois
            <div className="text-gray-700">★★★★★</div>
          </div>
        </div>
      </div>

      {/* Left Section */}
      <div className="bg-white p-8 md:p-16 lg:p-12 xl:p-16 flex flex-col min-h-screen w-full lg:w-1/2">
        {/* Desktop Navbar - Only shows on desktop */}
        <div className="hidden lg:flex mb-8 lg:mb-12 items-center justify-between max-w-4xl mx-auto w-full">
          <Image 
            src="/aveyo-logo.svg" 
            alt="AVEYO" 
            width={112} 
            height={24}
            priority
          />
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
            <span className="text-xl">←</span>
            <span className="text-sm">Back</span>
          </Link>
        </div>
        
        <div className="flex-1 flex flex-col lg:justify-center mx-auto w-full max-w-md lg:max-w-xl xl:max-w-2xl">
          <h2
            className="mb-4 text-gray-900 text-5xl md:text-6xl lg:text-7xl"
            style={{
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: '90%',
            }}
          >
            Powering what matters most
          </h2>
          <p className="text-gray-700 mb-8">
            Changing your energy changes your life. Get predictable monthly bills and more to spend on what truly matters.
          </p>
          
          <MultiStepForm />
        </div>
      </div>

      {/* Right Section - Hero Image - Desktop Only */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-aveyo-blue opacity-20 z-10"></div>
        
        <Image
          src="/photo1.jpg"
          alt="Family enjoying time together at home"
          fill
          className="object-cover"
          priority
        />

        {/* Badge - Bottom Right */}
        <div className="absolute bottom-8 right-8 z-20">
          <div className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 shadow-lg">
            <span style={{ color: '#3498db' }}>300+</span> reviews<br />in Illinois
            <div className="text-gray-700">★★★★★</div>
          </div>
        </div>
      </div>
    </main>
  )
}
