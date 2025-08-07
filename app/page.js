'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import HeroSection from './components/HeroSection'
import PackageSelection from './components/PackageSelection'
import ServiceDetails from './components/ServiceDetails'
import FAQSection from './components/FAQSection'
import Footer from './components/Footer'

export default function HomePage() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState(null)

  const handlePackageSelect = (packageData) => {
    setSelectedPackage(packageData)
    // Store in localStorage for purchase flow
    localStorage.setItem('selectedPackage', JSON.stringify(packageData))
    router.push('/purchase/step1')
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PackageSelection onPackageSelect={handlePackageSelect} />
      <ServiceDetails />
      <FAQSection />
      <Footer />
    </div>
  )
}
