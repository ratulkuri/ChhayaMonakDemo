import { Inter } from 'next/font/google'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/providers/AuthProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: "--font-inter"
})

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
        <NextTopLoader
          color="#30bd82"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #30bd82,0 0 5px #30bd82"
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
          <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        {/* <AuthProvider> */}
          {children}
        {/* </AuthProvider> */}
        <Toaster
          toastOptions={{
            classNames: {
              toast: 'toast',
              title: 'title',
              description: 'description',
              actionButton: 'action-button',
              cancelButton: 'cancel-button',
              closeButton: 'close-button',
            },
          }}
          position="top-center"
          closeButton
          richColors
        />
      </body>
    </html>
  )
}
