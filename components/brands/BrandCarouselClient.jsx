"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"

export function BrandCarouselClient({ brands }) {
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const animationRef = useRef(null)
  const progressRef = useRef(0)
  const speedRef = useRef(0.01)

  // Drag state
  const dragStartX = useRef(0)
  const dragStartProgress = useRef(0)
  const currentDragProgress = useRef(0)

  // Duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands]

  // Update transform helper
  const updateTransform = useCallback((progress) => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(${progress}%)`
    }
  }, [])

  useEffect(() => {
    // Animation function
    const animate = () => {
      if (!isPaused && !isDragging && containerRef.current) {
        // Update progress
        progressRef.current -= speedRef.current

        // Reset when we've moved 50% (half the duplicated content)
        if (progressRef.current <= -50) {
          progressRef.current = 0
        }

        // Apply transform
        updateTransform(progressRef.current)
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (!isPaused && !isDragging) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isPaused, isDragging, updateTransform])

  const handleMouseEnter = () => {
    if (!isDragging) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsPaused(false)
    }
  }

  // Start drag
  const startDrag = useCallback((clientX) => {
    setIsDragging(true)
    setIsPaused(true)
    dragStartX.current = clientX
    dragStartProgress.current = progressRef.current
    currentDragProgress.current = progressRef.current

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])

  // Handle drag movement
  const handleDrag = useCallback(
    (clientX) => {
      if (!isDragging || !containerRef.current) return

      const deltaX = clientX - dragStartX.current
      const containerWidth = containerRef.current.offsetWidth
      const dragPercent = (deltaX / containerWidth) * 100

      // Calculate new progress and store it
      currentDragProgress.current = dragStartProgress.current + dragPercent

      // Apply transform immediately
      updateTransform(currentDragProgress.current)
    },
    [isDragging, updateTransform],
  )

  // End drag
  const endDrag = useCallback(() => {
    if (!isDragging) return

    // Update the main progress reference to the current drag position
    progressRef.current = currentDragProgress.current

    // Normalize for infinite loop
    while (progressRef.current > 0) {
      progressRef.current -= 50
    }
    while (progressRef.current <= -50) {
      progressRef.current += 50
    }

    // Apply the normalized position
    updateTransform(progressRef.current)

    setIsDragging(false)
    setIsPaused(false)
  }, [isDragging, updateTransform])

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault()
    startDrag(e.clientX)
  }

  const handleMouseMove = useCallback(
    (e) => {
      handleDrag(e.clientX)
    },
    [handleDrag],
  )

  const handleMouseUp = useCallback(() => {
    endDrag()
  }, [endDrag])

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    startDrag(touch.clientX)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleDrag(touch.clientX)
  }

  const handleTouchEnd = () => {
    endDrag()
  }

  // Global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div className="relative w-full overflow-hidden">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Scrolling container with drag support */}
      <div
        ref={containerRef}
        className={`flex gap-8 lg:gap-12 py-2 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          width: "fit-content",
          minWidth: "200%",
          willChange: "transform",
          userSelect: "none",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {duplicatedBrands.map((brand, index) => (
          <div key={`${brand.id}-${index}`} className="flex-shrink-0 w-40 lg:w-48 group">
            <div
              className={`bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#1a469d]/20 transition-all duration-300 ${
                !isDragging ? "group-hover:scale-105 cursor-pointer" : "cursor-grabbing"
              }`}
            >
              {/* Logo container */}
              <div className="relative h-16 lg:h-20 mb-3 flex items-center justify-center">
                <Image
                  src={brand.logo || "/placeholder.svg?height=80&width=160&query=brand logo"}
                  alt={`${brand.name} logo`}
                  fill
                  className={`object-contain transition-all duration-300 ${
                    !isDragging ? "filter grayscale group-hover:grayscale-0" : "filter grayscale-0"
                  }`}
                  sizes="(max-width: 768px) 160px, 192px"
                  draggable={false}
                />
              </div>

              {/* Brand info */}
              <div className="text-center">
                <h3
                  className={`line-clamp-1 font-semibold text-gray-900 text-sm lg:text-base mb-1 transition-colors ${
                    !isDragging ? "group-hover:text-[#1a469d]" : ""
                  }`}
                >
                  {brand.name}
                </h3>
                <p className="line-clamp-1 text-xs lg:text-sm text-gray-500">{brand.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drag instruction hint */}
      {/* <div className="text-center mt-4">
        <p className="text-xs text-gray-400">Drag to navigate • Auto-scrolls when not interacting</p>
      </div> */}
    </div>
  )
}
