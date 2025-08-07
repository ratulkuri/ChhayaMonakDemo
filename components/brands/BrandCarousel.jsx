import { Suspense } from "react"
import { BrandCarouselSkeleton } from "./BrandCarouselSkeleton"
import { BrandCarouselClient } from "./BrandCarouselClient"

// Server Component - Static brand data
const brands = [
  {
    id: 1,
    name: "Brema",
    description: "Ice Makers",
    logo: "/images/brands/brema-logo.png",
    website: "https://brema.com",
  },
  {
    id: 2,
    name: "Cofrimell",
    description: "Beverage Equipment",
    logo: "/images/brands/cofrimell-logo.png",
    website: "https://cofrimell.com",
  },
  {
    id: 3,
    name: "Zumex",
    description: "Juice Machines",
    logo: "/images/brands/zumex-logo.png",
    website: "https://zumex.com",
  },
  {
    id: 4,
    name: "Battistella",
    description: "Laundry Equipment",
    logo: "/images/brands/battistella-logo.png",
    website: "https://battistella.com",
  },
  {
    id: 5,
    name: "Menumaster",
    description: "Commercial Microwaves",
    logo: "/images/brands/menumaster-logo.png",
    website: "https://menumaster.com",
  },
  {
    id: 6,
    name: "Klimaitalia",
    description: "Refrigeration Systems",
    logo: "/images/brands/klimaitalia-logo.png",
    website: "https://klimaitalia.com",
  },
  {
    id: 7,
    name: "Gemm",
    description: "Kitchen Equipment",
    logo: "/images/brands/gemm-logo.png",
    website: "https://gemm.com",
  },
  {
    id: 8,
    name: "SPM",
    description: "Drink Systems",
    logo: "/images/brands/spm-logo.png",
    website: "https://spm.com",
  },
  {
    id: 9,
    name: "FRIOTEKNO",
    description: "Refrigeration Technology",
    logo: "/images/brands/friotekno-logo.png",
    website: "https://friotekno.com",
  },
  {
    id: 10,
    name: "American Gas",
    description: "Gas Equipment",
    logo: "/images/brands/american-gas-logo.png",
    website: "https://americangas.com",
  },
]

export default function BrandCarousel() {
  return (
    <section className="bg-white py-8 lg:py-9 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        {/* <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Trusted Brands</h2>
          <p className="text-gray-600">We partner with industry-leading brands to bring you the best equipment</p>
        </div> */}

        <div className="overflow-hidden">
          <Suspense fallback={<BrandCarouselSkeleton />}>
            <BrandCarouselClient brands={brands} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
