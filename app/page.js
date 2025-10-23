import HeroSection from './components/HeroSection'
import PackageSelection from './components/PackageSelection'
import ServiceDetails from './components/ServiceDetails'
import FAQSection from './components/FAQSection'
import Footer from './components/Footer'

export default async function HomePage() {
  const API_BASE = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const packagePricesFetcher = fetch(`${API_BASE}/get-products`, {
    method: "GET",
    headers: {
      'x-signature': process.env.X_SIGNATURE ?? ""
    }
  });
  let packagePrices = {};
  const packagePricesRes = await packagePricesFetcher;

  if(packagePricesRes?.ok) {
    packagePrices = await packagePricesRes.json();
  }

  const packagePrice = (packagePrices?.family_pricing?.[0]?.price && (packagePrices?.family_coverages?.length > 0)) ? packagePrices : null;

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
