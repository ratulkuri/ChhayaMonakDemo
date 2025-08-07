"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MobileMenu } from "./MobileMenu"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function MobileMenuTrigger() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
          <VisuallyHidden>
            <SheetTitle>Shopping Cart</SheetTitle>
          </VisuallyHidden>
        <MobileMenu />
      </SheetContent>
    </Sheet>
  )
}
