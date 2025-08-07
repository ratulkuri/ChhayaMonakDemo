import { Suspense } from "react"
import { HeroSliderClient } from "./HeroSliderClient"
import { HeroSliderSkeleton } from "./HeroSliderSkeleton"

// Server Component - Static slide data
const slides = [
  {
    id: 1,
    title: "Complete Solution in Hotel Kitchen Equipment.",
    description:
      "Backed by voluminous experience, we are capable of developing our range of products as per the industry standards and customers' needs.",
    buttonText: "See Our Products",
    buttonLink: "/products",
    image: "/images/home-slider/commercial-espresso-machine.png",
    imageAlt: "Professional commercial kitchen with stainless steel equipment",
  },
  {
    id: 2,
    title: "Professional Bakery Equipment Solutions.",
    description:
      "From mixing to baking, we provide comprehensive bakery equipment solutions that meet the highest industry standards for commercial operations.",
    buttonText: "Explore Bakery",
    buttonLink: "/bakery",
    image: "/images/home-slider/bakery-equipment.png",
    imageAlt: "Professional bakery equipment and ovens",
  },
  {
    id: 3,
    title: "Premium Coffee Shop Equipment.",
    description:
      "Elevate your coffee business with our premium espresso machines, grinders, and brewing equipment designed for commercial excellence.",
    buttonText: "Coffee Equipment",
    buttonLink: "/coffee",
    image: "/images/home-slider/commercial-espresso-machine.png",
    imageAlt: "Commercial coffee equipment and espresso machines",
  },
  {
    id: 4,
    title: "Manufacturing & Industrial Solutions.",
    description:
      "Robust manufacturing equipment and industrial solutions built to withstand demanding production environments and deliver consistent results.",
    buttonText: "Industrial Equipment",
    buttonLink: "/manufacturing",
    image: "/images/home-slider/industrial-manufacturing-equipment.png",
    imageAlt: "Industrial manufacturing equipment and machinery",
  },
  {
    id: 5,
    title: "Complete Butchery Equipment Range.",
    description:
      "Professional butchery equipment including meat processing machines, refrigeration systems, and cutting tools for commercial meat operations.",
    buttonText: "Butchery Solutions",
    buttonLink: "/butchery",
    image: "/images/home-slider/commercial-butchery-equipment.png",
    imageAlt: "Commercial butchery and meat processing equipment",
  },
]

export default function HeroSlider() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <Suspense fallback={<HeroSliderSkeleton />}>
          <HeroSliderClient slides={slides} />
        </Suspense>
      </div>
    </section>
  )
}
