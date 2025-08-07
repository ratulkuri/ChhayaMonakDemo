"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartSheet } from "./CartSheet"

export function CartButton() {
  const [cartCount] = useState(5) // This would come from your cart state/context

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="relative size-10 cursor-pointer">
            <ShoppingCart className="size-6" />
            {cartCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {cartCount}
              </Badge>
            )}
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent side="right" className="w-96 sm:max-w-md">
        <CartSheet />
      </SheetContent>
    </Sheet>
  )
}
