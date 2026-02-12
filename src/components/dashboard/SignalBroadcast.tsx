'use client'
import { Profile } from '@/types'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Share2, Globe, Sparkles, Box, Scan, Palette } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface SignalBroadcastProps {
    profile: Profile
}

export default function SignalBroadcast({ profile }: SignalBroadcastProps) {
    const qrRef = useRef<HTMLDivElement>(null)
    const [isHoloMode, setIsHoloMode] = useState(false)
    const [qrFgColor, setQrFgColor] = useState('#000000')
    const [qrBgColor, setQrBgColor] = useState('#ffffff')
    const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${profile.username}`

    const downloadQR = () => {
        const svg = qrRef.current?.querySelector('svg')
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            canvas.width = 1000
            canvas.height = 1000
            ctx?.drawImage(img, 0, 0, 1000, 1000)
            const pngFile = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.download = `silovra-signal-${profile.username}.png`
            downloadLink.href = pngFile
            downloadLink.click()
        }

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Control Matrix */}
            <div className="lg:col-span-7 space-y-10">
                <div className="bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] p-12 space-y-8">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-zenith-indigo uppercase tracking-[0.5em]">Broadcast Protocol</h3>
                            <button
                                onClick={() => setIsHoloMode(!isHoloMode)}
                                className={cn(
                                    "px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                                    isHoloMode
                                        ? "bg-zenith-indigo text-white border-zenith-indigo shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                                        : "bg-white/[0.05] text-white/40 border-white/10 hover:border-white/20"
                                )}
                            >
                                <Box size={12} />
                                {isHoloMode ? 'AR Portal Active' : 'Enable Holo-View'}
                            </button>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter">Signal Matrix Generator</h2>
                        <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                            Deploy your digital identity across physical and digital dimensions with branded QR telemetry.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/20 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="p-3 bg-white/[0.05] rounded-2xl text-white/20 group-hover:text-zenith-indigo transition-colors">
                                    <Globe size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Target Destination</p>
                                    <p className="text-[12px] font-bold text-white tracking-tight">{publicUrl}</p>
                                </div>
                            </div>
                        </div>

                        {/* QR Color Customization */}
                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <Palette size={14} className="text-white/30" />
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">QR Color Matrix</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Foreground</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={qrFgColor}
                                            onChange={(e) => setQrFgColor(e.target.value)}
                                            className="w-10 h-10 rounded-xl cursor-pointer border border-white/10 bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                                        />
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{qrFgColor}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Background</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={qrBgColor}
                                            onChange={(e) => setQrBgColor(e.target.value)}
                                            className="w-10 h-10 rounded-xl cursor-pointer border border-white/10 bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                                        />
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{qrBgColor}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Quick presets */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {[
                                    { fg: '#000000', bg: '#ffffff', label: 'Classic' },
                                    { fg: '#ffffff', bg: '#000000', label: 'Inverted' },
                                    { fg: '#6366f1', bg: '#ffffff', label: 'Indigo' },
                                    { fg: '#ffffff', bg: '#6366f1', label: 'Silovra' },
                                    { fg: '#22c55e', bg: '#000000', label: 'Matrix' },
                                    { fg: '#f59e0b', bg: '#1a1a2e', label: 'Amber' },
                                ].map((preset) => (
                                    <button
                                        key={preset.label}
                                        onClick={() => { setQrFgColor(preset.fg); setQrBgColor(preset.bg) }}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest transition-all",
                                            qrFgColor === preset.fg && qrBgColor === preset.bg
                                                ? "border-zenith-indigo/40 bg-zenith-indigo/10 text-white"
                                                : "border-white/10 text-white/30 hover:text-white/60 hover:border-white/20"
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full border border-white/10" style={{ background: preset.fg }} />
                                            {preset.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <button
                                onClick={downloadQR}
                                className="flex items-center justify-center gap-4 bg-white text-black py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zenith-indigo hover:text-white transition-all active:scale-95 shadow-2xl"
                            >
                                <Download size={14} />
                                Download Signal
                            </button>
                            <button
                                onClick={() => navigator.share?.({ url: publicUrl })}
                                className="flex items-center justify-center gap-4 bg-white/[0.05] border border-white/10 text-white py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/[0.1] transition-all active:scale-95 shadow-2xl"
                            >
                                <Share2 size={14} />
                                Broadcast URL
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-zenith-indigo/5 border border-zenith-indigo/10 rounded-[3rem] p-10 flex items-start gap-6">
                    <div className="p-4 bg-zenith-indigo/20 rounded-2xl text-zenith-indigo">
                        <Sparkles size={24} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Silovra Enhancement Active</h4>
                        <p className="text-[10px] text-white/40 font-bold leading-relaxed uppercase tracking-wider">
                            Your signal includes embedded identity telemetry (Profile Avatar) and is optimized for ultra-high-resolution transmission. Customize colors to match your brand.
                        </p>
                    </div>
                </div>
            </div>

            {/* Signal Preview Pane */}
            <div className="lg:col-span-5 sticky top-10 perspective-[2000px]">
                <div className={cn(
                    "bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] p-12 flex flex-col items-center gap-12 shadow-2xl relative overflow-hidden group transition-all duration-700",
                    isHoloMode && "rotate-y-12 rotate-x-6 scale-95 border-zenith-indigo/30 shadow-[0_0_100px_rgba(99,102,241,0.2)]"
                )} style={{ transformStyle: 'preserve-3d' }}>

                    <div className="absolute inset-0 bg-zenith-indigo/[0.02] blur-[80px] pointer-events-none" />

                    {isHoloMode && (
                        <>
                            {/* AR Scan Overlay */}
                            <div className="absolute inset-0 z-20 pointer-events-none border-[20px] border-zenith-indigo/10 rounded-[3.5rem]" />
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                className="absolute left-0 right-0 h-[2px] bg-zenith-indigo/50 blur-[2px] z-30"
                            />
                        </>
                    )}

                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] relative z-10 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-zenith-indigo animate-ping" />
                        {isHoloMode ? 'Dimensional Uplink' : 'Live Signal Matrix'}
                    </h3>

                    <div
                        ref={qrRef}
                        className={cn(
                            "p-8 rounded-[3rem] shadow-[0_0_100px_rgba(255,255,255,0.1)] transition-all duration-700 relative z-10",
                            isHoloMode ? "scale-110 rotate-z-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "group-hover:scale-105"
                        )}
                        style={{
                            transform: isHoloMode ? 'translateZ(50px)' : 'none',
                            background: qrBgColor
                        }}
                    >
                        <QRCodeSVG
                            value={publicUrl}
                            size={280}
                            level="H"
                            includeMargin={false}
                            fgColor={qrFgColor}
                            bgColor={qrBgColor}
                            imageSettings={profile.avatar_url ? {
                                src: profile.avatar_url,
                                height: 60,
                                width: 60,
                                excavate: true,
                            } : undefined}
                        />
                    </div>

                    <div className="text-center space-y-2 relative z-10" style={{ transform: isHoloMode ? 'translateZ(30px)' : 'none' }}>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.6em]">
                            {isHoloMode ? 'Augmented Layer Active' : 'Scan to Access Profile'}
                        </p>

                    </div>
                </div>
            </div>
        </div>
    )
}
