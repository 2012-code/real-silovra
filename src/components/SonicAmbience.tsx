'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Waves } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SonicAmbience() {
    const [isMuted, setIsMuted] = useState(true)
    const audioContextRef = useRef<AudioContext | null>(null)
    const masterGainRef = useRef<GainNode | null>(null)
    const oscillatorsRef = useRef<OscillatorNode[]>([])

    const startAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
        const ctx = audioContextRef.current

        // Master Gain (Volume Control)
        const masterGain = ctx.createGain()
        masterGain.gain.setValueAtTime(0, ctx.currentTime)
        masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1) // Faster fade in (1s)
        masterGain.connect(ctx.destination)
        masterGainRef.current = masterGain

        // Sound Design: "Ethereal Drift" (Boosted)
        // Slightly higher base freq for laptop speakers
        const baseFreq = 130.81 // C3 (One octave up from previous C2)
        const layers = [
            { type: 'sine', freq: baseFreq, gain: 0.5 },        // Root
            { type: 'sine', freq: baseFreq * 1.5, gain: 0.3 },  // Perfect 5th (G3)
            { type: 'sine', freq: baseFreq * 2, gain: 0.2 },    // Octave (C4)
            { type: 'triangle', freq: baseFreq * 0.5, gain: 0.1 }, // Sub-bass warmth
        ]

        const oscs: OscillatorNode[] = []

        layers.forEach((layer, i) => {
            const osc = ctx.createOscillator()
            const layerGain = ctx.createGain()

            osc.type = layer.type as OscillatorType
            osc.frequency.setValueAtTime(layer.freq, ctx.currentTime)

            // Slight detune for warmth without dissonance
            if (i > 0) osc.detune.value = Math.random() * 2 - 1

            layerGain.gain.value = layer.gain

            // Add gentle LFO (Breathing effect) for the higher partials
            if (i > 1) {
                const lfo = ctx.createOscillator()
                lfo.frequency.value = 0.1 + (i * 0.05) // Slow cycle (10s)
                const lfoGain = ctx.createGain()
                lfoGain.gain.value = layer.gain * 0.3 // Modulate depth
                lfo.connect(lfoGain)
                lfoGain.connect(layerGain.gain)
                lfo.start()
                oscs.push(lfo)
            }

            osc.connect(layerGain)
            layerGain.connect(masterGain)
            osc.start()
            oscs.push(osc)
        })

        oscillatorsRef.current = oscs
    }

    const stopAudio = () => {
        if (masterGainRef.current && audioContextRef.current) {
            const ctx = audioContextRef.current
            // Long fade out
            masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime)
            masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime)
            masterGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 4)

            setTimeout(() => {
                oscillatorsRef.current.forEach(osc => osc.stop())
                oscillatorsRef.current = []
                if (ctx.state === 'running') ctx.suspend()
            }, 4000)
        }
    }

    const toggleAudio = () => {
        if (isMuted) {
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume()
                // Re-trigger fade in if needed, but simple resume is often enough if we didn't stop oscillators
                // However, we stopped them in stopAudio. So we need to startAudio again.
                startAudio()
            } else {
                startAudio()
            }
            setIsMuted(false)
        } else {
            stopAudio()
            setIsMuted(true)
        }
    }

    // Auto-cleanup on unmount
    useEffect(() => {
        return () => {
            oscillatorsRef.current.forEach(osc => osc.stop())
            audioContextRef.current?.close()
        }
    }, [])

    return (
        <div className="fixed bottom-8 left-8 z-50">
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
