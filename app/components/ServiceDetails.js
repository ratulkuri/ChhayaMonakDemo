'use client'

import { useState } from 'react'
import { Shield, Heart, Phone, Percent, Car, Baby, ChevronDown, ChevronUp } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export default function ServiceDetails() {
  const [openItems, setOpenItems] = useState({})

  const services = [
    {
      id: 'life',
      icon: Shield,
      title: 'Life Insurance',
      description: 'Comprehensive life coverage for primary policy holder with competitive benefits',
      details: 'Coverage up to $50,000 with accidental death benefits and terminal illness coverage'
    },
    {
      id: 'health',
      icon: Heart,
      title: 'Health Insurance',
      description: 'Complete healthcare coverage including hospitalization, ICU, and maternity',
      details: 'Covers hospitalization up to $25,000, ICU coverage, maternity benefits for spouse, and emergency medical expenses'
    },
    {
      id: 'consultation',
      icon: Phone,
      title: 'Doctor Consultation',
      description: 'Unlimited video consultations with qualified doctors 24/7',
      details: 'Access to licensed doctors, specialists, and healthcare professionals anytime, anywhere'
    },
    {
      id: 'ambulance',
      icon: Car,
      title: 'Emergency Services',
      description: 'Ambulance and emergency medical transportation coverage',
      details: 'Emergency ambulance services, medical evacuation, and transportation to nearest medical facility'
    },
    {
      id: 'maternity',
      icon: Baby,
      title: 'Maternity Coverage',
      description: 'Comprehensive maternity and newborn care coverage',
      details: 'Pre and post-natal care, delivery expenses, newborn coverage for first 30 days'
    },
    {
      id: 'discounts',
      icon: Percent,
      title: 'Health & Lifestyle Discounts',
      description: 'Exclusive discounts on healthcare, pharmacy, and lifestyle services',
      details: 'Up to 30% discounts on hospitals, pharmacies, baby products, entertainment, and shopping'
    }
  ]

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Coverage Details
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about your insurance coverage
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <service.icon className="w-12 h-12 text-[#30bd82] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-sm text-gray-500">{service.details}</p>
            </div>
          ))}
        </div>

        {/* Mobile Accordion Layout */}
        <div className="md:hidden space-y-4">
          {services.map((service) => (
            <Collapsible key={service.id}>
              <CollapsibleTrigger 
                onClick={() => toggleItem(service.id)}
                className="w-full bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <service.icon className="w-8 h-8 text-[#30bd82] mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                </div>
                {openItems[service.id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <p className="text-gray-600 mb-2">{service.description}</p>
                <p className="text-sm text-gray-500">{service.details}</p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  )
}
