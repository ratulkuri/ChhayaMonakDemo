import { Shield, Heart, Phone, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  const scrollToPackages = () => {
    document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })
  }

  const valueProps = [
    {
      icon: Shield,
      title: 'Life Insurance',
      description: 'Comprehensive life coverage for peace of mind'
    },
    {
      icon: Heart,
      title: 'Family Health Insurance',
      description: 'Complete healthcare protection for your loved ones'
    },
    {
      icon: Phone,
      title: 'Doctor Consultation',
      description: 'Unlimited video calls with qualified doctors'
    },
    {
      icon: Percent,
      title: 'Health Discounts',
      description: 'Exclusive discounts on healthcare and lifestyle'
    }
  ]

  return (
    <section className="bg-gradient-to-br from-[#30bd82] to-[#28a574] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Yearly Insurance Protection for You & Your Family in Bangladesh
        </h1>
        <p className="text-lg md:text-xl mb-12 opacity-90 max-w-3xl mx-auto">
          Comprehensive insurance coverage designed specifically for non-resident Bangladeshi expats and their families
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {valueProps.map((prop, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <prop.icon className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="font-semibold text-lg mb-2">{prop.title}</h3>
              <p className="text-sm opacity-90">{prop.description}</p>
            </div>
          ))}
        </div>

        <Button 
          onClick={scrollToPackages}
          className="bg-[#f57a20] hover:bg-[#e56a10] text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Get Protected for the Year
        </Button>
      </div>
    </section>
  )
}
