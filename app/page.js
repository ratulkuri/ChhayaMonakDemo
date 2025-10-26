export const dynamic = "force-dynamic";

import HeroSection from './components/HeroSection'
import PackageSelection from './components/PackageSelection'
import ServiceDetails from './components/ServiceDetails'
import FAQSection from './components/FAQSection'
import Footer from './components/Footer'
import { serverFetch } from '@/utils/serverApi'

export default async function HomePage() {
  let packagePrice = null;

  try {
    // Use the reusable utility function
    const packagePricesRes = await serverFetch('/get-products', {
      method: 'GET'
      // All headers (x-signature, Authorization) are now handled internally
    });

    if (packagePricesRes.ok) {
      const packagePrices = await packagePricesRes.json();
      
      // Apply your post-processing logic immediately after success
      packagePrice = (
        packagePrices?.family_pricing?.[0]?.price && 
        (packagePrices?.family_coverages?.length > 0)
      ) ? packagePrices : null;

    } else if (packagePricesRes.status === 401) {
      console.warn('Authentication failed for package fetch. Token expired or missing.');
    } else {
      console.error(`Package fetch failed with status: ${packagePricesRes.status}`);
    }

  } catch (error) {
    console.error("Critical error during API fetch in HomePage:", error.message);
  }


  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      {
        !packagePrice?.id ? (
          <section id="packages" className="py-8 md:py-16 px-4 bg-gray-50">
            <div className="max-w-3xl mx-auto text-center bg-red-100 p-10 rounded-2xl">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Package Not Available
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-6">
                We couldn’t find the package you’re looking for. <br /> Please try again later or contact support.
              </p>
            </div>
          </section>
        ) : (
          <PackageSelection packagePrice={packagePrice} />
        )
      }

      <ServiceDetails />
      <FAQSection />
      <Footer />
    </div>
  )
}
