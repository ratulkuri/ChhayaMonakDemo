"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronDown, Grid3X3, Phone, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const departmentCategories = {
  "Restaurant Equipment": {
    "Cooking Equipment": ["Commercial Ovens", "Grills & Griddles", "Fryers", "Ranges & Cooktops"],
    "Food Preparation": ["Food Processors", "Mixers", "Slicers", "Prep Tables"],
    Refrigeration: ["Walk-in Coolers", "Reach-in Refrigerators", "Freezers", "Display Cases"],
  },
  "Bakery Equipment": {
    "Ovens & Baking": ["Deck Ovens", "Convection Ovens", "Proofers", "Baking Sheets"],
    "Mixers & Prep": ["Spiral Mixers", "Planetary Mixers", "Dough Sheeters", "Dividers"],
  },
  "Coffee Equipment": {
    "Espresso Machines": ["Commercial Espresso", "Super Automatic", "Semi Automatic", "Manual Machines"],
    "Brewing Equipment": ["Drip Coffee Makers", "French Press", "Pour Over", "Cold Brew"],
  },
}

const navigationItems = [
  { name: "Restaurant", href: "/restaurant" },
  { name: "Bakery Shop", href: "/bakery" },
  { name: "Coffee Shop", href: "/coffee" },
  { name: "Manufacturing", href: "/manufacturing" },
  { name: "Butchery Shop", href: "/butchery" },
  { name: "Spare Parts", href: "/spare-parts" },
]

export function MobileMenu() {
  const [expandedDepartment, setExpandedDepartment] = useState(null)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const handleSearch = () => {
    console.log("Mobile search:", searchQuery, selectedCategory)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Search */}
      <div className="p-4 border-b space-y-3">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="bakery">Bakery</SelectItem>
            <SelectItem value="coffee">Coffee Shop</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="butchery">Butchery</SelectItem>
            <SelectItem value="spare-parts">Spare Parts</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input
            placeholder="Search products..."
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button size="icon" variant="outline" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Shop by Departments */}
        <div className="p-4">
          <button
            onClick={() => setExpandedDepartment(expandedDepartment ? null : "main")}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900"
          >
            <div className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              <span>Shop by Departments</span>
            </div>
            <motion.div animate={{ rotate: expandedDepartment ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedDepartment && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {Object.entries(departmentCategories).map(([department, categories]) => (
                    <div key={department}>
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === department ? null : department)}
                        className="flex items-center justify-between w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md"
                      >
                        <span className="text-sm font-medium">{department}</span>
                        <motion.div
                          animate={{ rotate: expandedCategory === department ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {expandedCategory === department && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden ml-4"
                          >
                            {Object.entries(categories).map(([category, items]) => (
                              <div key={category} className="py-2">
                                <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                                  {category}
                                </h4>
                                <div className="space-y-1">
                                  {items.map((item) => (
                                    <Link
                                      key={item}
                                      href={`/products/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                      className="block text-sm text-gray-600 hover:text-[#1a469d] py-1 px-2 hover:bg-gray-50 rounded"
                                    >
                                      {item}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Other Navigation Items */}
        <div className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-3 px-3 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="p-4 border-t bg-green-50">
        <div className="flex items-center gap-2 text-green-700">
          <Phone className="h-4 w-4" />
          <div>
            <p className="text-sm font-medium">Contact Us</p>
            <p className="text-xs">92160951, 96651585</p>
          </div>
        </div>
      </div>
    </div>
  )
}
