import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SupabaseProvider from '@/components/providers/supabase-provider'
import LayoutTransition from '@/components/LayoutTransition'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UltraLinks',
  description: 'The Best Link in Bio on Earth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          {/* LayoutTransition handles the animation state */}
          <LayoutTransition>
            {children}
          </LayoutTransition>
        </SupabaseProvider>
      </body>
    </html>
  )
}
