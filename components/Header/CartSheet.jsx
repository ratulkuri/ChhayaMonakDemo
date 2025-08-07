"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2, MessageCircle, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

// Mock cart data - this would come from your cart context/state
const mockCartItems = [
  {
    id: 1,
    name: "Commercial Espresso Machine",
    brand: "Brema",
    price: "Negotiable",
    quantity: 1,
    image: "/images/brands/brema-logo.png",
    isNegotiable: true,
  },
  {
    id: 2,
    name: "Industrial Oven",
    brand: "Zumex",
    price: "$2,500",
    quantity: 2,
    image: "/images/brands/zumex-logo.png",
    isNegotiable: false,
  },
  {
    id: 3,
    name: "Refrigeration Unit",
    brand: "Klimaitalia",
    price: "Negotiable",
    quantity: 1,
    image: "/images/brands/klimaitalia-logo.png",
    isNegotiable: true,
  },
]

export function CartSheet() {
  const [cartItems, setCartItems] = useState(mockCartItems)

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id))
    } else {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const allItemsNegotiable = cartItems.every((item) => item.isNegotiable)
  const hasItems = cartItems.length > 0

  const generateWhatsAppMessage = () => {
    const itemsList = cartItems
      .map((item) => `• ${item.name} (${item.brand}) - Qty: ${item.quantity} - Price: ${item.price}`)
      .join("\n")

    const message = `Hello! I'm interested in the following products:\n\n${itemsList}\n\nCould you please provide a quote? Thank you!`
    return encodeURIComponent(message)
  }

  const handleWhatsAppRequest = () => {
    const message = generateWhatsAppMessage()
    const phoneNumber = "96651585" // Your WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader>
        <SheetTitle className="text-[#1a469d]">Shopping Cart</SheetTitle>
        <SheetDescription>
          {hasItems ? `${cartItems.length} item${cartItems.length > 1 ? "s" : ""} in your cart` : "Your cart is empty"}
        </SheetDescription>
      </SheetHeader>

      {hasItems ? (
        <>
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg?height=64&width=64&query=product"}
                    alt={item.name}
                    fill
                    className="object-contain rounded"
                    sizes="64px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500 mb-1">{item.brand}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {item.isNegotiable ? (
                        <Badge variant="secondary" className="text-xs">
                          Negotiable
                        </Badge>
                      ) : (
                        <span className="text-sm font-semibold text-[#1a469d]">{item.price}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Cart Actions */}
          <div className="py-4 space-y-3">
            {allItemsNegotiable ? (
              <Button onClick={handleWhatsAppRequest} className="w-full bg-green-500 hover:bg-green-600 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Request Quote via WhatsApp
              </Button>
            ) : (
              <div className="space-y-2 px-2">
                <Button onClick={handleWhatsAppRequest} className="w-full h-auto py-3 bg-green-500 hover:bg-green-600 text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Get Quote via WhatsApp
                </Button>
                <p className="text-xs text-gray-500 text-center">Some items have fixed prices, others are negotiable</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
          </div>
        </div>
      )}
    </div>
  )
}
