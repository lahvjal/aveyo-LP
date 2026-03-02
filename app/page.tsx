'use client'

import MultiStepForm from '@/components/MultiStepForm'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen flex">
      {/* Left Section */}
      <div className="flex-1 bg-gradient-to-br from-aveyo-blue to-aveyo-purple p-8 md:p-16 flex flex-col">
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-gray-800">AVEYO</h1>
        </div>
        
        <div className="flex-1 flex flex-col justify-center max-w-md">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powering what matters most
          </h2>
          <p className="text-gray-700 mb-8">
            Changing your energy changes your life. Get predictable monthly bills and more to spend on what truly matters.
          </p>
          
          <MultiStepForm />
        </div>
      </div>

      {/* Right Section - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-aveyo-blue opacity-20"></div>
        <Image
          src="/family-movienight.png"
          alt="Family enjoying time together at home"
          fill
          className="object-cover"
          priority
        />
      </div>
    </main>
  )
}
