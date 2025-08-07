"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Grid3X3 } from "lucide-react"

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

export function DepartmentDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 transition-colors">
        <Grid3X3 className="h-4 w-4" />
        <span className="font-medium">Shop by Departments</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-screen max-w-4xl max-h-[calc(100vh-170px)] overflow-y-auto bg-white shadow-lg border rounded-lg mt-1 z-50"
          >
            <div className="grid grid-cols-3 gap-6 p-6">
              {Object.entries(departmentCategories).map(([department, categories]) => (
                <div key={department} className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">{department}</h3>
                  {Object.entries(categories).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-gray-700 text-sm ps-2 border-s-4 border-secondary">{category}</h4>
                      <ul className="space-y-1">
                        {items.map((item) => (
                          <li key={item}>
                            <Link
                              href={`/products/${item.toLowerCase().replace(/\s+/g, "-")}`}
                              className="text-sm text-gray-600 hover:text-secondary hover:bg-blue-50 transition-colors block py-1 ps-3 pe-2 rounded-sm"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
