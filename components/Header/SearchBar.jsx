"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchBar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <motion.div
      className="relative flex items-center flex-1"
      animate={{
        scale: isSearchFocused ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Select defaultValue="all">
        <SelectTrigger className="w-40 rounded-r-none border-r-0 bg-white !h-12">
          <SelectValue placeholder="Category" className=" " />
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

      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Type something here..."
          className="rounded-none border focus-visible:ring-0 focus-visible:ring-offset-0 bg-white h-12"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </div>

      <Button size="icon" className="!size-12 rounded-l-none border cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600">
        <Search className="!h-5 !w-5" />
      </Button>
    </motion.div>
  )
}
