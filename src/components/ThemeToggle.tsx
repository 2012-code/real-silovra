'use client'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggle = () => {
        setIsDark(!isDark)
        const root = document.documentElement

        if (isDark) {
            // Switch to light
            root.style.setProperty('--visitor-bg', '#f8f9fa')
            root.style.setProperty('--visitor-text', '#1a1a1a')
            root.style.setProperty('--visitor-card-bg', 'rgba(0,0,0,0.04)')
            root.style.setProperty('--visitor-card-border', 'rgba(0,0,0,0.08)')
            document.body.classList.add('visitor-light')
        } else {
            // Switch to dark (default)
            root.style.removeProperty('--visitor-bg')
            root.style.removeProperty('--visitor-text')
            root.style.removeProperty('--visitor-card-bg')
            root.style.removeProperty('--visitor-card-border')
            document.body.classList.remove('visitor-light')
        }
    }

    // Don't render on the server to avoid hydration mismatch
    if (!mounted) return null

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all shadow-lg"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>
    )
}
