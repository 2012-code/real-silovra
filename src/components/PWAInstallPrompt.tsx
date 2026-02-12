'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [showPrompt, setShowPrompt] = useState(false)

    useEffect(() => {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => { })
        }

        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setShowPrompt(true)
        }
        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setShowPrompt(false)
        }
        setDeferredPrompt(null)
    }

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 px-6 py-4 bg-black/60 backdrop-blur-[60px] border border-white/10 rounded-full shadow-2xl"
                >
                    <Download size={16} className="text-zenith-indigo" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Install Silovra</span>
                    <button
                        onClick={handleInstall}
                        className="px-5 py-2 bg-zenith-indigo text-white text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-zenith-indigo/80 transition-all"
                    >
                        Install
                    </button>
                    <button
                        onClick={() => setShowPrompt(false)}
                        className="p-1.5 text-white/30 hover:text-white/60 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
