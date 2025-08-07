'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export default function FAQSection() {
  const [openItems, setOpenItems] = useState({})

  const faqs = [
    {
      id: 'eligibility',
      question: 'Who is eligible for this insurance?',
      answer: 'Non-resident Bangladeshi expats living in Qatar and their immediate family members (spouse, children, parents) are eligible for coverage.'
    },
    {
      id: 'documents',
      question: 'What documents are required?',
      answer: 'You need a valid passport, Qatar residence permit, proof of employment, and family relationship documents for dependents.'
    },
    {
      id: 'claims',
      question: 'How do I file a claim?',
      answer: 'Claims can be filed through our mobile app, website, or by calling our 24/7 helpline. Most claims are processed within 48-72 hours.'
    },
    {
      id: 'consultation',
      question: 'How does doctor consultation work?',
      answer: 'Access unlimited video consultations through our app. Connect with licensed doctors 24/7 for medical advice and prescriptions.'
    },
    {
      id: 'cancellation',
      question: 'Can I cancel my policy?',
      answer: 'Yes, you can cancel within 30 days for a full refund. After 30 days, cancellation terms apply based on your policy conditions.'
    },
    {
      id: 'age-limits',
      question: 'Are there age limits?',
      answer: 'Primary holder: 18-65 years, Spouse: 18-65 years, Children: 0-25 years, Parents: up to 75 years at policy inception.'
    },
    {
      id: 'activation',
      question: 'When does coverage start?',
      answer: 'Coverage begins 24 hours after payment confirmation. Emergency services are available immediately upon activation.'
    },
    {
      id: 'payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, debit cards, and bank transfers. Payment is processed securely through our encrypted platform.'
    }
  ]

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Get answers to common questions about our insurance coverage
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <Collapsible key={faq.id}>
              <CollapsibleTrigger 
                onClick={() => toggleItem(faq.id)}
                className="w-full bg-white rounded-lg p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-200 text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                {openItems[faq.id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 bg-white rounded-b-lg">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  )
}
