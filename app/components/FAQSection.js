'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

export default function FAQSection() {
  const [openItems, setOpenItems] = useState({})

  const faqs = [
    {
        id: "faq-1",
        question: "Who is eligible for this insurance package?",
        answer: "Non-resident Bangladeshis living in Qatar are eligible as primary policyholders. The life insurance (Taka 2,00,000) covers only the primary expat policyholder, while health insurance benefits (hospitalization, ICU, maternity, accidental, ambulance coverage) are exclusively for the parents, spouse, and children of the primary policyholder."
    },
    {
        id: "faq-2",
        question: "What information do I need to provide during registration?",
        answer: "After payment confirmation, you'll receive a login link to add your family members' information, such as their full name, age, and relationship, to activate their health insurance coverage."
    },
    {
        id: "faq-3",
        question: "What documents do I need to provide during a claim?",
        answer: "For claims, you'll need to provide relationship documents (birth certificates for children, marriage certificate for spouse), along with proper medical documents like doctor's prescription, hospital discharge letter, medical bills, and receipts."
    },
    {
        id: "faq-4",
        question: "What specific health coverage is included for my family?",
        answer: "Your family receives comprehensive health coverage, including: Hospitalization (Taka 4,000 per night), ICU Coverage (Taka 8,000 per night), Maternity Coverage for spouse only (Taka 20,000 for C-section/normal delivery), Accidental Coverage (Taka 25,000), and Ambulance Transfer Coverage (Taka 2,000). These benefits apply to spouse, parents, and children only."
    },
    {
        id: "faq-5",
        question: "How do I consult with doctors?",
        answer: "Access unlimited video consultations with licensed doctors 24/7 through our platform. This service is available to all covered family members and includes prescription services when needed."
    },
    {
        id: "faq-6",
        question: "What health discounts do I get?",
        answer: "Enjoy up to 40% savings on bills at partner hospitals and up to 10% savings at partner pharmacies."
    },
    {
        id: "faq-7",
        question: "How quickly does my coverage become active?",
        answer: "Life insurance coverage for the primary policyholder begins immediately after payment confirmation. Health insurance for family members activates once you log in and add their information to your account through the email link provided after purchase."
    },
    {
        id: "faq-8",
        question: "What are the age limits for coverage?",
        answer: "Primary policyholder (expat): 18-60 years for life insurance. For health coverage: spouse 18-60 years, children newborn-18 years, parents up to age 60 at policy inception if included in the selected package."
    },
    {
        id: "faq-9",
        question: "How do I file a claim?",
        answer: "Claims can be filed through our website or by calling our 24/7 Bangladesh helpline. Submit required medical documents and receipts. Most claims are processed and paid within 7-14 working days directly to your designated Bangladeshi bank or bKash account."
    },
    {
        id: "faq-10",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards and debit cards. All payments are processed through our PCI-compliant, encrypted platform for maximum security. Payment is charged annually for your selected package."
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
            <Collapsible className="group" key={faq.id}>
              <CollapsibleTrigger 
                onClick={() => toggleItem(faq.id)}
                className={cn("cursor-pointer w-full bg-white rounded-lg p-6 flex items-center justify-between group-hover:shadow-md [data-sate=true]:rounded-b-none transition-shadow duration-200 text-left", {
                  "rounded-b-none": openItems[faq.id]
                })}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                {openItems[faq.id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="group-hover:shadow-md px-6 pb-6 bg-white rounded-b-lg">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  )
}
