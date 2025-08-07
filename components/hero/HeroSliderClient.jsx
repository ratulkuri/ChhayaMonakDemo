"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function HeroSliderClient({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  // Auto-play functionality with progress tracking
  useEffect(() => {
    if (!isAutoPlaying) return

    const duration = 5000 // 5 seconds
    const interval = 50 // Update every 50ms for smooth animation
    let elapsed = 0

    const progressInterval = setInterval(() => {
      elapsed += interval
      const newProgress = (elapsed / duration) * 100

      if (newProgress >= 100) {
        setProgress(0)
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        elapsed = 0
      } else {
        setProgress(newProgress)
      }
    }, interval)

    return () => clearInterval(progressInterval)
  }, [currentSlide, isAutoPlaying, slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setProgress(0)
    setIsAutoPlaying(false) // Stop auto-play when user manually navigates

    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const currentSlideData = slides[currentSlide]

  // Calculate the circumference for the progress ring
  // const radius = 200 // Adjust based on your image size
  const strokeWidth = 4;
  const radius = 212 - (strokeWidth/2); // Adjust based on your image size
  const circumference = 2 * Math.PI * radius * 1.01;
  // const strokeDashoffset = circumference - (progress / 100) * circumference
  const strokeDashoffset = Math.max(0, circumference - Math.round((progress / 100) * circumference) );

  return (
    <div className="relative">
      {/* Main Slider Content */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[480px]">
        {/* Left Content */}
        <div className="space-y-6 lg:space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-6"
            >
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                {currentSlideData.title}
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">{currentSlideData.description}</p>

              <div className="pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#1a469d] hover:bg-[#1a469d]/90 text-white px-8 py-3 h-auto rounded-full font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Link href={currentSlideData.buttonLink}>{currentSlideData.buttonText}</Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Image with Progress Ring */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto aspect-square">
                {/* Progress Ring SVG */}
                <svg
                  className="absolute inset-0 w-full h-full -rotate-90 transform"
                  viewBox="0 0 424 424"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background ring */}
                  <circle cx="212" cy="212" r={radius} fill="none" stroke="#d19b2a" strokeWidth="4" opacity="0.2" />
                  {/* Progress ring */}
                  <circle
                    cx="212"
                    cy="212"
                    r={radius}
                    fill="none"
                    stroke="#d19b2a"
                    strokeWidth="4"
                    strokeLinecap="butt"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-75 ease-linear"
                  />
                </svg>

                {/* Image container */}
                <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src={currentSlideData?.image || "/placeholder.svg"}
                    alt={currentSlideData?.imageAlt}
                    fill
                    className="object-cover"
                    priority={currentSlide === 0}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>

                {/* Inner decorative ring */}
                <div className="absolute inset-2 rounded-full border border-[#1a469d]/10"></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-12 space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-[#1a469d] scale-125" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
