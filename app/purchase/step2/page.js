'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, Shield, Lock } from 'lucide-react'

export default function Step2() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const packageData = localStorage.getItem('selectedPackage')
    const userData = localStorage.getItem('userInfo')
    
    if (packageData && userData) {
      setSelectedPackage(JSON.parse(packageData))
      setUserInfo(JSON.parse(userData))
    } else {
      router.push('/')
    }
  }, [router])

  const validateForm = () => {
    const newErrors = {}

    if (!paymentData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required'
    } else if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits'
    }

    if (!paymentData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required'
    }

    if (!paymentData.cvv) {
      newErrors.cvv = 'CVV is required'
    } else if (paymentData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits'
    }

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsProcessing(true)
      
      // Simulate payment processing
      setTimeout(() => {
        localStorage.setItem('paymentInfo', JSON.stringify(paymentData))
        router.push('/purchase/confirmation')
      }, 2000)
    }
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value

    if (field === 'cardNumber') {
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19)
    } else if (field === 'expiryDate') {
      // Format expiry date MM/YY
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5)
    } else if (field === 'cvv') {
      // Only allow 3 digits
      formattedValue = value.replace(/\D/g, '').slice(0, 3)
    }

    setPaymentData(prev => ({ ...prev, [field]: formattedValue }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!selectedPackage || !userInfo) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/purchase/step1')}
              className="flex items-center text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-sm text-gray-500">Step 2 of 3</div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h1>
          <p className="text-gray-600">Secure payment processing for your insurance coverage</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Package:</span>
              <span className="font-semibold">{selectedPackage.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-semibold">{userInfo.fullName}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-[#30bd82]">{selectedPackage.price}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <Shield className="w-5 h-5 text-[#30bd82] mr-2" />
            <span className="text-sm text-gray-600">Your payment information is secure and encrypted</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
                Card Number *
              </Label>
              <Input
                id="cardNumber"
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className={`mt-1 ${errors.cardNumber ? 'border-red-500' : ''}`}
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">
                  Expiry Date *
                </Label>
                <Input
                  id="expiryDate"
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className={`mt-1 ${errors.expiryDate ? 'border-red-500' : ''}`}
                  placeholder="MM/YY"
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                  CVV *
                </Label>
                <Input
                  id="cvv"
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className={`mt-1 ${errors.cvv ? 'border-red-500' : ''}`}
                  placeholder="123"
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="cardholderName" className="text-sm font-medium text-gray-700">
                Cardholder Name *
              </Label>
              <Input
                id="cardholderName"
                type="text"
                value={paymentData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                className={`mt-1 ${errors.cardholderName ? 'border-red-500' : ''}`}
                placeholder="Name as it appears on card"
              />
              {errors.cardholderName && (
                <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
              )}
            </div>

            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <Lock className="w-4 h-4 mr-2" />
              <span>SSL encrypted payment processing. Your data is safe and secure.</span>
            </div>

            <Button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#30bd82] hover:bg-[#28a574] text-white py-3 font-semibold rounded-lg flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  Pay Now {selectedPackage.price}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
