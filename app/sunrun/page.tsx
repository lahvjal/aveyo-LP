'use client'

import MultiStepForm from '@/components/MultiStepForm'
import Image from 'next/image'
import Link from 'next/link'

export default function SunrunPage() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="bg-white p-8 md:p-16 flex flex-col min-h-screen w-full lg:w-[65vw]">
        <div className="mb-8 lg:mb-12 flex items-center justify-between">
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
        
        <div className="flex-1 flex flex-col justify-center mx-auto w-full max-w-md lg:w-[90%] lg:max-w-none">
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

      {/* Right Section - Hero Image */}
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
