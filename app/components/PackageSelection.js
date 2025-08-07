import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

export default function PackageSelection({ onPackageSelect }) {
  const packages = [
    {
      id: 'couple',
      name: 'Couple',
      price: '$299',
      popular: false,
      coverage: [
        'Life Insurance for primary holder',
        'Health Insurance for both',
        'Unlimited doctor consultations',
        'Health & lifestyle discounts'
      ]
    },
    {
      id: 'couple-child',
      name: 'Couple + 1 Child',
      price: '$399',
      popular: false,
      coverage: [
        'Life Insurance for primary holder',
        'Health Insurance for family',
        'Maternity coverage',
        'Unlimited doctor consultations',
        'Health & lifestyle discounts'
      ]
    },
    {
      id: 'you-parents',
      name: 'You + Parents',
      price: '$449',
      popular: true,
      coverage: [
        'Life Insurance for primary holder',
        'Health Insurance for parents',
        'Senior care coverage',
        'Unlimited doctor consultations',
        'Health & lifestyle discounts'
      ]
    },
    {
      id: 'couple-parents',
      name: 'Couple + Parents',
      price: '$599',
      popular: false,
      coverage: [
        'Life Insurance for primary holder',
        'Health Insurance for all',
        'Comprehensive family coverage',
        'Unlimited doctor consultations',
        'Health & lifestyle discounts'
      ]
    }
  ]

  return (
    <section id="packages" className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Protection Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect insurance package for your family's needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`bg-white rounded-lg shadow-lg p-6 relative flex flex-col ${
                pkg.popular ? 'ring-2 ring-[#30bd82] transform scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#f57a20] text-white">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-[#30bd82] mb-4">{pkg.price}</div>
                <p className="text-sm text-gray-600">per year</p>
              </div>

              <ul className="space-y-3 mb-8 grow">
                {pkg.coverage.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-[#30bd82] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => onPackageSelect(pkg)}
                className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 ${
                  pkg.popular 
                    ? 'bg-[#30bd82] hover:bg-[#28a574] text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Select This Plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
