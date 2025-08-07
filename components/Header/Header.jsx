import { Suspense } from "react"
import Link from "next/link"
import { MdOutlineWhatsapp } from "react-icons/md"
import { SearchBar } from "./SearchBar"
import { CartButton } from "./CartButton"
import { MobileMenuTrigger } from "./MobileMenuTrigger"
import { NavigationMenu } from "./NavigationMenu"
import { SearchSkeleton, CartSkeleton } from "./HeaderSkeletons"
import { SearchModal } from "./SearchModal"
import Image from "next/image"

// Server Component - No "use client"
export default function Header() {
  return (
    <>
      {/* Main Header - Not sticky */}
      <header className="bg-white shadow-sm border-b">
        <div className="bg-gray-50 px-4 py-1 lg:py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-2 lg:px-8">
            {/* Logo - Server Rendered */}
            <Link href="/" className="flex-shrink-0">
              <div className="hover:scale-105 transition-transform duration-200">
                {/* <h1 className="text-2xl md:text-3xl font-bold text-red-600 tracking-tight">PHILCOM</h1> */}
                <Image
                  className="size-18 lg:size-24"
                  src="/logo.svg"
                  height={120}
                  width={120}
                  alt="Fhilcom"
                />
              </div>
            </Link>

            {/* Search Bar - Hidden on small screens, shown on large */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-4">
              <Suspense fallback={<SearchSkeleton />}>
                <SearchBar />
              </Suspense>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Search Modal Trigger - Only on small screens */}
              <div className="lg:hidden">
                <SearchModal />
              </div>

              <Suspense fallback={<CartSkeleton />}>
                <CartButton />
              </Suspense>

              {/* Mobile Menu Trigger - Client Component */}
              <div className="lg:hidden">
                <MobileMenuTrigger />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu - Sticky only on large screens */}
      <nav className="hidden lg:block bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <NavigationMenu />

            {/* WhatsApp Contact - Server Rendered */}
            <div className="bg-[#54ae57] text-white px-4 py-4 flex items-center gap-2 hover:bg-green-600 transition-colors">
              {/* <Phone className="h-4 w-4" /> */}
              <MdOutlineWhatsapp className="h-4 w-4" />
              <span className="text-sm font-medium">92160951, 96651585</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
