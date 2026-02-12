'use client'
import { motion } from 'framer-motion'

interface BackgroundEngineProps {
    type?: 'static' | 'liquid' | 'starfield'
    backgroundColor?: string
}

function isLightColor(color?: string): boolean {
    if (!color) return false
    // Handle hex colors
    const hex = color.replace('#', '')
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        return luminance > 0.55
    }
    // Handle rgb/rgba
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1])
        const g = parseInt(rgbMatch[2])
        const b = parseInt(rgbMatch[3])
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        return luminance > 0.55
    }
    // Handle common light color names and gradients with light colors
    if (/white|#fff|#FFF|ivory|snow|beige|linen|cornsilk|seashell|honeydew|mintcream|azure|aliceblue|ghostwhite|floralwhite|lightyellow|lightcyan|lavenderblush/i.test(color)) {
        return true
    }
    // Handle linear-gradient — check if the first color stop is light
    const gradientMatch = color.match(/linear-gradient\([^,]+,\s*([^,)]+)/)
    if (gradientMatch) {
        return isLightColor(gradientMatch[1].trim())
    }
    return false
}

export default function BackgroundEngine({ type = 'static', backgroundColor }: BackgroundEngineProps) {
    if (type === 'static') return null

    const light = isLightColor(backgroundColor)

    // Colors adapt based on background brightness
    const starColor = light ? 'rgba(0,0,0,0.7)' : 'white'
    const starGlow = light ? '0 0 6px 1px rgba(0,0,0,0.2)' : '0 0 6px 1px rgba(255,255,255,0.4)'
    const liquidBright = light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.18)'
    const liquidDark = light ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'
    const liquidMid = light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'
    const overlayGradient = light
        ? 'bg-gradient-to-b from-white/10 via-transparent to-white/20'
        : 'bg-gradient-to-b from-black/10 via-transparent to-black/20'

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {type === 'liquid' && (
                <div className="absolute inset-0">
                    {/* Large blob — top left */}
                    <motion.div
                        animate={{
                            scale: [1, 1.4, 0.9, 1],
                            x: ['-20%', '30%', '-10%', '-20%'],
                            y: ['-20%', '10%', '-30%', '-20%'],
                            rotate: [0, 120, 240, 360],
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full blur-[80px]"
                        style={{ background: liquidBright, top: '-15%', left: '-10%' }}
                    />
                    {/* Contrasting blob — bottom right */}
                    <motion.div
                        animate={{
                            scale: [1.2, 0.8, 1.3, 1.2],
                            x: ['10%', '-30%', '20%', '10%'],
                            y: ['10%', '-20%', '30%', '10%'],
                            rotate: [0, -100, -200, -360],
                        }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full blur-[80px]"
                        style={{ background: liquidDark, bottom: '-10%', right: '-10%' }}
                    />
                    {/* Mid accent blob — center drift */}
                    <motion.div
                        animate={{
                            scale: [0.8, 1.2, 0.8],
                            x: ['-10%', '20%', '-10%'],
                            y: ['20%', '-10%', '20%'],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full blur-[100px]"
                        style={{ background: liquidMid, top: '30%', left: '20%' }}
                    />
                </div>
            )}

            {type === 'starfield' && (
                <div className="absolute inset-0">
                    {[...Array(60)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                opacity: Math.random() * 0.4 + 0.1,
                                scale: Math.random() * 0.5 + 0.5
                            }}
                            animate={{
                                opacity: [0.1, 0.7, 0.1],
                                scale: [1, 1.3, 1],
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}
                            className="absolute rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: `${Math.random() * 2 + 1}px`,
                                height: `${Math.random() * 2 + 1}px`,
                                background: starColor,
                                boxShadow: starGlow,
                            }}
                        />
                    ))}
                    <div className={`absolute inset-0 ${overlayGradient}`} />
                </div>
            )}
        </div>
    )
}
