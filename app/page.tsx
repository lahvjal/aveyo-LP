import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Image 
            src="/aveyo-logo.svg" 
            alt="AVEYO" 
            width={112} 
            height={24}
            priority
          />
        </div>

        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Landing Pages Directory
          </h1>
          <p className="text-gray-700 text-lg">
            Select a landing page to preview
          </p>
        </div>

        {/* Landing Pages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* LP1 Page */}
          <Link href="/lp1" className="group">
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-black transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black">
                LP1
              </h3>
              <p className="text-gray-600 mb-4">
                Multi-step form with gradient background and hero image
              </p>
              <div className="text-sm text-gray-500">
                6-step form • White background • Family image
              </div>
            </div>
          </Link>

          {/* LP2 Page */}
          <Link href="/lp2" className="group">
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-black transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black">
                LP2
              </h3>
              <p className="text-gray-600 mb-4">
                Full-screen hero with transparent nav and ZIP entry
              </p>
              <div className="text-sm text-gray-500">
                Hero page • Black & white • Full-screen form flow
              </div>
            </div>
          </Link>

          {/* LP3 Page */}
          <Link href="/lp3" className="group">
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-black transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black">
                LP3
              </h3>
              <p className="text-gray-600 mb-4">
                Single-page form with all questions visible at once
              </p>
              <div className="text-sm text-gray-500">
                One-page form • Gradient background • Clean layout
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            This is a temporary navigation page for development. Each card above links to a different landing page variant.
          </p>
        </div>
      </div>
    </main>
  )
}
