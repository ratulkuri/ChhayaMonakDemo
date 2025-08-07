import Link from "next/link"
import { DepartmentDropdown } from "./DepartmentDropdown"

// Static navigation items - Server rendered
const navigationItems = [
  { name: "Restaurant", href: "/restaurant" },
  { name: "Bakery Shop", href: "/bakery" },
  { name: "Coffee Shop", href: "/coffee" },
  { name: "Manufacturing", href: "/manufacturing" },
  { name: "Butchery Shop", href: "/butchery" },
  { name: "Spare Parts", href: "/spare-parts" },
]

// Server Component
export function NavigationMenu() {
  return (
    <nav className="flex items-center">
      {/* Shop by Departments - Client Component for Interactions */}
      <DepartmentDropdown />

      {/* Other Navigation Items - Server Rendered */}
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="px-4 py-3 text-gray-700 hover:text-gray-900 transition-colors font-medium"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}
