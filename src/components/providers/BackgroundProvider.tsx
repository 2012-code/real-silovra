'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import BackgroundEngine from '../BackgroundEngine'

const BackgroundContext = createContext<{
    backgroundType: 'static' | 'liquid' | 'starfield'
    setBackgroundType: (type: 'static' | 'liquid' | 'starfield') => void
    backgroundColor: string
    setBackgroundColor: (color: string) => void
}>({
    backgroundType: 'static',
    setBackgroundType: () => { },
    backgroundColor: '',
    setBackgroundColor: () => { },
})

export const useBackground = () => useContext(BackgroundContext)

export default function BackgroundProvider({ children }: { children: React.ReactNode }) {
    const [backgroundType, setBackgroundType] = useState<'static' | 'liquid' | 'starfield'>('static')
    const [backgroundColor, setBackgroundColor] = useState('')
    const pathname = usePathname()
    const supabase = createClient()

    // Fetch background preference if on a profile page
    useEffect(() => {
        const fetchProfileTheme = async () => {
            // Check if we're on a profile page (not dashboard/login)
            const isProfilePage = !pathname.startsWith('/dashboard') && !pathname.startsWith('/login')
            if (!isProfilePage) return

            const username = pathname.split('/')[1]
            if (!username) return

            const { data: profile } = await supabase
                .from('profiles')
                .select('custom_theme')
                .eq('username', username)
                .single()

            if (profile?.custom_theme?.background_type) {
                setBackgroundType(profile.custom_theme.background_type)
            }
            if (profile?.custom_theme?.background) {
                setBackgroundColor(profile.custom_theme.background)
            }
        }

        fetchProfileTheme()
    }, [pathname])

    return (
        <BackgroundContext.Provider value={{ backgroundType, setBackgroundType, backgroundColor, setBackgroundColor }}>
            <BackgroundEngine type={backgroundType} backgroundColor={backgroundColor} />
            <div className="relative z-10">
                {children}
            </div>
        </BackgroundContext.Provider>
    )
}
