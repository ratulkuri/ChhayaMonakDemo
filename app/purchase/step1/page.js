'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function Step1() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState(null)
  // get dates of birth between 18 and 65 years
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const packageData = localStorage.getItem('selectedPackage')
    if (packageData) {
      setSelectedPackage(JSON.parse(packageData))
    } else {
      router.push('/')
    }
  }, [router])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    } else {
      // const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()
      // if (age < 18 || age > 65) {
      //   newErrors.dateOfBirth = 'Age must be between 18 and 65 years'
      // }
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();

      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      // Adjust age if birthday hasn't occurred yet this year
      const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;

      if (actualAge < 18 || actualAge > 65) {
        newErrors.dateOfBirth = 'Age must be between 18 and 65 years';
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateDateOfBirth = (e) => {
    const newErrors = {};
    const value = e.target.value;
    console.log({dob: value});

    if (!value) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(value);
      const today = new Date();

      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      // Adjust age if birthday hasn't occurred yet this year
      const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
      console.log({age});

      if (actualAge < 18 || actualAge > 65) {
        newErrors.dateOfBirth = 'Age must be between 18 and 65 years';
      } else {
        newErrors.dateOfBirth = null;
      }
    }
    
    console.log("invalid dob", newErrors);

    setErrors(prevErrs => {
      let eee = { ...prevErrs, ...newErrors };
      console.log(eee);
      return eee;
    });
  }


  // console.log(errors);


  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      localStorage.setItem('userInfo', JSON.stringify(formData))
      router.push('/purchase/step2')
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear existing error
    setErrors(prev => ({ ...prev, [field]: '' }));

    // Extra validation for dateOfBirth
    if (field === 'dateOfBirth') {
      const newErrors = {};

      if (!value) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else {
        const dob = new Date(value);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        const d = today.getDate() - dob.getDate();

        if (m < 0 || (m === 0 && d < 0)) age--;

        if (age < 18 || age > 65) {
          newErrors.dateOfBirth = 'Age must be between 18 and 65 years';
        }
      }

      if (newErrors.dateOfBirth) {
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
    }
  };

  if (!selectedPackage) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')}
              className="flex items-center text-gray-600 ps-0 cursor-pointer hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>
            <div className="text-sm text-gray-500">Step 1 of 3</div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h1>
          <p className="text-gray-600">Please provide your details to continue with your purchase</p>
        </div>

        {/* Selected Package Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Package</h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-[#30bd82]">{selectedPackage.name}</h3>
              <p className="text-sm text-gray-600">Annual Coverage</p>
            </div>
            <div className="text-2xl font-bold text-gray-900">{selectedPackage.price}</div>
          </div>
          
          {/* Show selected options if it's a custom package */}
          {selectedPackage.selections && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Selected Options:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {selectedPackage.selections.spouse && (
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#30bd82] rounded-full mr-2"></div>
                    Spouse Coverage
                  </li>
                )}
                {selectedPackage.selections.children && (
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#30bd82] rounded-full mr-2"></div>
                    {selectedPackage.selections.children} Child{selectedPackage.selections.children > 1 ? 'ren' : ''} Coverage
                  </li>
                )}
                {selectedPackage.selections.parents && (
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#30bd82] rounded-full mr-2"></div>
                    {selectedPackage.selections.parents === '1' ? '1 Parent' : 'Both Parents'} Coverage
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white border border-[#30bd82] rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`mt-1 h-12 bg-white ${errors.fullName ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full mt-1 h-12 bg-white ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of Birth *
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={`w-full block mt-1 h-12 bg-white ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                min={minDate}
                max={maxDate}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
              )}
            </div>

            <Button 
              type="submit"
              className="w-full bg-[#30bd82] hover:bg-[#28a574] text-white py-3 font-semibold rounded-lg flex items-center justify-center cursor-pointer h-auto"
            >
              Continue to Payment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
