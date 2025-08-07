'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download, Mail, Phone } from 'lucide-react'

export default function Confirmation() {
  const router = useRouter()
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    const packageData = localStorage.getItem('selectedPackage')
    const userData = localStorage.getItem('userInfo')
    const paymentData = localStorage.getItem('paymentInfo')
    
    if (packageData && userData && paymentData) {
      setOrderData({
        package: JSON.parse(packageData),
        user: JSON.parse(userData),
        payment: JSON.parse(paymentData),
        orderNumber: 'INS-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: new Date().toLocaleDateString()
      })
    } else {
      router.push('/')
    }
  }, [router])

  const handleNewPurchase = () => {
    // Clear localStorage and redirect to home
    localStorage.removeItem('selectedPackage')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('paymentInfo')
    router.push('/')
  }

  if (!orderData) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
          <CheckCircle className="w-16 h-16 text-[#30bd82] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for choosing our insurance coverage
          </p>
          <div className="bg-[#30bd82]/10 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Order Number: <span className="font-semibold text-[#30bd82]">{orderData.orderNumber}</span>
            </p>
            <p className="text-sm text-gray-700">
              Date: {orderData.date}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{orderData.package.name}</h3>
                <p className="text-sm text-gray-600">Annual Insurance Coverage</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#30bd82]">{orderData.package.price}</div>
                <div className="text-sm text-gray-600">per year</div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Coverage Includes:</h4>
              <ul className="space-y-1">
                {orderData.package.coverage.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#30bd82] mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-[#30bd82] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Confirmation</h3>
                <p className="text-sm text-gray-600">
                  You'll receive a detailed policy document at {orderData.user.email} within 24 hours
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#30bd82] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Coverage Activation</h3>
                <p className="text-sm text-gray-600">
                  Your insurance coverage will be active within 24 hours of payment confirmation
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#30bd82] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Access Your Benefits</h3>
                <p className="text-sm text-gray-600">
                  Download our mobile app to access doctor consultations and manage your policy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-[#30bd82] mr-3" />
              <div>
                <p className="font-semibold text-gray-900">24/7 Support</p>
                <p className="text-sm text-gray-600">+974 1234 5678</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-[#30bd82] mr-3" />
              <div>
                <p className="font-semibold text-gray-900">Email Support</p>
                <p className="text-sm text-gray-600">support@insurance.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleNewPurchase}
            className="flex-1 h-auto bg-[#30bd82] hover:bg-[#28a574] text-white py-3 font-semibold rounded-lg"
          >
            Purchase Another Plan
          </Button>
          <Button 
            variant="outline"
            className="flex-1 h-auto border-[#30bd82] text-[#30bd82] hover:bg-[#30bd82] hover:text-white py-3 font-semibold rounded-lg flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  )
}
