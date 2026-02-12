import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SupabaseProvider from '@/components/providers/supabase-provider'
import BackgroundProvider from '@/components/providers/BackgroundProvider'
import LayoutTransition from '@/components/LayoutTransition'
import SonicAmbience from '@/components/SonicAmbience'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Silovra',
  description: 'Your Digital Identity, Simplified.',
}

const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Space+Grotesk:wght@400;700&family=DM+Sans:wght@400;700;900&family=Quicksand:wght@400;700&family=Poppins:wght@400;700;900&family=Montserrat:wght@400;700;900&family=Raleway:wght@400;700;900&family=Playfair+Display:wght@400;700;900&family=Lora:wght@400;700&family=JetBrains+Mono:wght@400;700&family=Fira+Code:wght@400;700&family=IBM+Plex+Sans:wght@400;700&family=Nunito:wght@400;700;900&family=Work+Sans:wght@400;700;900&family=Rubik:wght@400;700;900&family=Sora:wght@400;700;800&family=Archivo:wght@400;700;900&display=swap'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className={inter.className}>
        <SupabaseProvider>
          <BackgroundProvider>
            <LayoutTransition>
              {children}
            </LayoutTransition>
            <SonicAmbience />
          </BackgroundProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
