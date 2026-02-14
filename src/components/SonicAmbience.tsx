'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Waves } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SonicAmbience() {
    const [isMuted, setIsMuted] = useState(true)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.play().catch(e => console.error("Audio playback failed:", e))
                setIsMuted(false)
            } else {
                audioRef.current.pause()
                setIsMuted(true)
            }
        }
    }

    // Set initial volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4
        }
    }, [])

    return (
        <div className="fixed bottom-8 left-8 z-50">
            <audio
                ref={audioRef}
                src="/background-music.mp3"
                loop
                crossOrigin="anonymous"
            />

            <motion.button
                onClick={toggleAudio}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-2xl relative group overflow-hidden border",
                    !isMuted
                        ? "bg-zenith-indigo/20 border-zenith-indigo text-zenith-indigo shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                        : "bg-black/40 backdrop-blur-xl border-white/10 text-white/50 hover:text-white"
                )}
            >
                <div className="relative z-10">
                    {isMuted ? <VolumeX size={18} /> : <Waves size={18} className="animate-pulse" />}
                </div>

                {/* Visualizer Ring */}
                <AnimatePresence>
                    {!isMuted && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full border border-zenith-indigo/50"
                        />
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}
