"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const HeroButton = ({ className = "", label = "Get Protection for Your Family"}) => {
    
  const scrollToPackages = () => {
    document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Button 
        onClick={scrollToPackages}
        className={cn("bg-[#f57a20] hover:bg-[#e56a10] text-white h-auto px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200", className)}
    >
        {label}
    </Button>
  )
}

export default HeroButton