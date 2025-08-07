import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bangladesh Expat Insurance - Yearly Protection for You & Your Family',
  description: 'Comprehensive insurance coverage designed specifically for non-resident Bangladeshi expats and their families living in Qatar',
  keywords: 'Bangladesh insurance, expat insurance, Qatar insurance, family health insurance, life insurance',
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
