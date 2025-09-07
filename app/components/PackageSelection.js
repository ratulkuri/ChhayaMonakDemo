'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Users, Baby, Heart, CircleCheckBig } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function PackageSelection({ packagePrice = null }) {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState(null)
  
  const [selections, setSelections] = useState({
    spouse: false,
    children: null, // null, '1', '2', or '3'
    parents: null   // null, '1', or '2'
  })

  const [totalPrice, setTotalPrice] = useState(0)
  const [isValidSelection, setIsValidSelection] = useState(false)

  // const BASE_PRICE = 20000
  // const SPOUSE_PRICE = 5000
  // const CHILD_PRICE = 3000
  // const PARENT_PRICE = 10000

  
  
  const handlePackageSelect = (packageData) => {
    setSelectedPackage(packageData)
    // Store in localStorage for purchase flow
    localStorage.setItem('selectedPackage', JSON.stringify(packageData))
    router.push('/purchase/step1')
    }

  // Calculate total price whenever selections change
  useEffect(() => {
    let price = 100; // baseprice

    if (packagePrice) {
      // Use values from packagePrice object
      price += packagePrice.id ? 0 : 0; // base not included in object, keep 0

      if (selections.spouse) {
        price += packagePrice.spouse_1 ?? 0;
        if (selections.spouse === '2') {
          price += packagePrice.spouse_2 ?? 0;
        }
      }

      if (selections.children) {
        const count = parseInt(selections.children);
        for (let i = 1; i <= count; i++) {
          price += packagePrice[`child_${i}`] ?? 0;
        }
      }

      if (selections.parents) {
        const count = parseInt(selections.parents);
        for (let i = 1; i <= count; i++) {
          price += packagePrice[`parent_${i}`] ?? 0;
        }
      }
    // } else {
    //   // Fallback: old static constants
    //   price += BASE_PRICE;

    //   if (selections.spouse) {
    //     price += SPOUSE_PRICE;
    //   }

    //   if (selections.children) {
    //     price += parseInt(selections.children) * CHILD_PRICE;
    //   }

    //   if (selections.parents) {
    //     price += parseInt(selections.parents) * PARENT_PRICE;
    //   }
    }

    setTotalPrice(price);

    // Check if at least one option is selected
    const hasSelection = selections.spouse || selections.children || selections.parents;
    setIsValidSelection(hasSelection);
  }, [selections, packagePrice]);


  const handleSpouseChange = () => {
    setSelections(prev => ({ ...prev, spouse: !prev?.spouse }))
  }

  const handleChildrenChange = (value) => {
    setSelections(prev => ({
      ...prev,
      children: prev.children === value ? null : value
    }))
  }

  const handleParentsChange = (value) => {
    setSelections(prev => ({
      ...prev,
      parents: prev.parents === value ? null : value
    }))
  }

  const handleProceed = () => {
    if (!isValidSelection) return

    const packageData = {
      id: 'custom',
      name: 'Custom Family Plan',
      price: `$${totalPrice.toLocaleString()}`,
      selections: selections,
      coverage: generateCoverageList()
    }
    
    handlePackageSelect(packageData)
  }

  const generateCoverageList = () => {
    const coverage = [
      'Life Insurance for primary holder',
      'Unlimited doctor consultations',
      'Health Insurance for family members',
      // 'Health discounts'
      'Exclusive discounts in healthcare partners'
    ];
    
    return coverage
  }

  const childrenOptions = [
    // { value: '1', label: '1 Child' },
    // { value: '2', label: '2 Children' },
    // { value: '3', label: '3 Children' }
    { value: '1', label: 'One' },
    { value: '2', label: 'Two' },
    { value: '3', label: 'Three' }
  ]

  const parentsOptions = [
    // { value: '1', label: '1 Parent' },
    { value: '2', label: 'Include Parents' }
  ]

  return (
    <section id="packages" className="py-8 md:py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            Customize Your Family Protection Plan
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Select the coverage options that best fit your family's needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-start bg-white rounded-2xl shadow-lg p-4 md:p-8 lg:gap-8">
          {/* Customization Options */}
          <div className="space-y-4 md:space-y-6">
            
            {/* Spouse Section */}
            <div className="pb-4 md:pb-6 border-b border-gray-200">
              <div className="flex items-center mb-3 md:mb-4">
                <Heart className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-[#30bd82] mr-2 md:mr-3" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Spouse</h3>
                <p className='text-xs text-muted-foreground text-center ml-2 pl-2 border-s-2 hidden lg:inline'>Tap to include or exclude your spouse from the plan.</p>
              </div>
              
              <div className={cn("flex border-2 items-center cursor-pointer p-3 md:p-4 rounded-lg transition-colors border-gray-200 hover:border-gray-300",
                 {
                  'border-[#30bd82] hover:border-[#30bd82] bg-[#30bd82]/5' : selections.spouse
                }
              )}
              onClick={handleSpouseChange}
              >
                <Checkbox
                  checked={selections.spouse}
                  readOnly
                  className="data-[state=checked]:border-[#30bd82] mr-3 hidden"
                />
                <span className="flex gap-4 justify-center items-center text-base md:text-lg font-medium text-gray-900">
                  {
                    selections.spouse 
                    && <CircleCheckBig className='text-[#30bd82] shrink-0 size-5 lg:size-6' />
                  }
                  Include Spouse
                </span>
              </div>
              <p className='text-xs text-muted-foreground text-center mt-2 lg:hidden'>Tap to include or exclude your spouse from the plan.</p>
            </div>

            {/* Children Section */}
            <div className="pb-4 md:pb-6 border-b border-gray-200">
              <div className="flex items-center mb-3 md:mb-4">
                <Baby className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-[#30bd82] mr-2 md:mr-3" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Children(s)</h3>
                <p className='text-xs text-muted-foreground text-center ml-2 pl-2 border-s-2 hidden lg:inline'>Choose one child option (tap again to deselect)</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {childrenOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-2 md:p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      selections.children === option.value
                        ? 'border-[#30bd82] bg-[#30bd82]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleChildrenChange(option.value)}
                  >
                    <Checkbox
                      checked={selections.children === option.value}
                      readOnly
                      className="data-[state=checked]:bg-[#30bd82] data-[state=checked]:border-[#30bd82] mx-auto mb-2 hidden"
                    />
                    <h4 className="flex gap-2 justify-center items-center text-sm md:text-base font-medium text-gray-900">
                      {
                        selections.children === option.value 
                        && <CircleCheckBig className='text-[#30bd82] shrink-0 size-5 lg:size-6' />
                      }
                      {option.label}
                    </h4>
                  </div>
                ))}
              </div>
              <p className='text-xs text-muted-foreground text-center mt-2 lg:hidden'>Choose one child option (tap again to deselect)</p>
            </div>

            {/* Parents Section */}
            <div className="pb-4 md:pb-6">
              <div className="flex items-center mb-3 md:mb-4">
                <Users className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-[#30bd82] mr-2 md:mr-3" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Parents</h3>
                <p className='text-xs text-muted-foreground text-center ml-2 pl-2 border-s-2 hidden lg:inline'>Select one parent option (tap again to deselect)</p>
              </div>
              
              <div className={cn("grid grid-cols-2 gap-2 md:gap-4", {
                "grid-cols-1": parentsOptions?.length === 1
              })}>
                {parentsOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(`p-2 md:p-3 rounded-lg border-2 cursor-pointer transition-all text-center`, {
                      'border-[#30bd82] bg-[#30bd82]/5' : selections.parents === option.value,
                      'border-gray-200 hover:border-gray-300' : selections.parents !== option.value,
                      'p-3 md:p-4 text-left': parentsOptions?.length === 1
                    })}
                    onClick={() => handleParentsChange(option.value)}
                  >
                    <Checkbox
                      checked={selections.parents === option.value}
                      readOnly
                      className="data-[state=checked]:bg-[#30bd82] data-[state=checked]:border-[#30bd82] mx-auto mb-2 hidden"
                    />
                    <h4 className={cn("flex gap-4 items-center text-base md:text-lg font-medium text-gray-900", {
                      "justify-center text-sm md:text-base" : parentsOptions?.length > 1
                    })}>
                      {
                        selections.parents === option.value 
                        && <CircleCheckBig className='text-[#30bd82] shrink-0 size-5 lg:size-6' />
                      }
                      {option.label}
                    </h4>
                  </div>
                ))}
              </div>
              <p className='text-xs text-muted-foreground text-center mt-2 lg:hidden'>Select one parent option (tap again to deselect)</p>
            </div>
          </div>

          {/* Price Summary & Proceed Button */}
          <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 py-4 lg:pt-0 lg:pl-8 mt-4 lg:mt-0 h-full">
            <div className="grow flex flex-col justify-center">
              <div className="text-center mb-4 md:mb-6">
                {isValidSelection && (
                  <>
                    <p className="text-sm text-gray-600 mb-2">Total Annual Premium</p>
                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#30bd82] mb-4">${totalPrice.toLocaleString()}</p>
                  </>
                )}
                {!isValidSelection && (
                  <p className="text-sm text-red-600 mb-4">Select Family Members for Pricing</p>
                )}
              </div>
              
              <Button
                onClick={handleProceed}
                disabled={!isValidSelection}
                className={`cursor-pointer w-full h-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-lg transition-all duration-200 mb-4 ${
                  isValidSelection
                    ? 'bg-[#30bd82] hover:bg-[#28a574] text-white transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceed to Purchase
              </Button>
            </div>
            
            {/* Coverage Preview */}
            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Your Coverage Includes:</h4>
              <ul className="space-y-1 text-xs md:text-sm text-gray-600">
                {generateCoverageList().map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-[#30bd82] rounded-full mr-2 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
