'use client'

import MultiStepForm from '@/components/MultiStepForm'
import Image from 'next/image'
import Link from 'next/link'

export default function SunrunPage() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="bg-white p-8 md:p-16 flex flex-col min-h-screen" style={{ width: '65vw' }}>
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
        
        <div className="flex-1 flex flex-col justify-center mx-auto" style={{ width: '90%' }}>
          <h2
            className="mb-4 text-gray-900"
            style={{
              fontSize: '80px',
              fontWeight: 900,
              letterSpacing: '-4px',
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
      </div>
    </main>
  )
}
