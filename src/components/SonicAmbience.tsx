'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SonicAmbience() {
    const [isMuted, setIsMuted] = useState(true)
    const audioContextRef = useRef<AudioContext | null>(null)
    const oscRef = useRef<OscillatorNode | null>(null)
    const gainRef = useRef<GainNode | null>(null)

    const toggleAudio = () => {
        if (isMuted) {
            startAudio()
        } else {
            stopAudio()
        }
        setIsMuted(!isMuted)
    }

    const startAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }

        const ctx = audioContextRef.current

        // Master Gain
        const masterGain = ctx.createGain()
        masterGain.gain.setValueAtTime(0, ctx.currentTime)
        masterGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2) // Fade in
        masterGain.connect(ctx.destination)
        gainRef.current = masterGain

        // Oscillator 1 (Deep Drone)
        const osc1 = ctx.createOscillator()
        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(55, ctx.currentTime) // A1
        osc1.connect(masterGain)
        osc1.start()
        oscRef.current = osc1

        // Oscillator 2 (Harmonic)
        const osc2 = ctx.createOscillator()
        osc2.type = 'triangle'
        osc2.frequency.setValueAtTime(110, ctx.currentTime) // A2
        const osc2Gain = ctx.createGain()
        osc2Gain.gain.value = 0.3
        osc2.connect(osc2Gain)
        osc2Gain.connect(masterGain)
        osc2.start()
    }

    const stopAudio = () => {
        if (gainRef.current && audioContextRef.current) {
            gainRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 1) // Fade out
            setTimeout(() => {
                oscRef.current?.stop()
                audioContextRef.current?.suspend()
            }, 1000)
        }
    }

    // Cleanup
    useEffect(() => {
        return () => {
            stopAudio()
            audioContextRef.current?.close()
        }
    }, [])

    return (
        <div className="fixed bottom-8 left-8 z-50">
            <motion.button
                onClick={toggleAudio}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-zenith-indigo hover:border-zenith-indigo/50 transition-all shadow-2xl relative group overflow-hidden"
            >
                <div className="relative z-10">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </div>

                {/* Visualizer Ring (Pseudo) */}
                {!isMuted && (
                    <span className="absolute inset-0 rounded-full border-2 border-zenith-indigo/30 animate-ping" />
                )}
            </motion.button>
        </div>
    )
}
