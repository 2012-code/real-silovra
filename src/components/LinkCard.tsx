'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ExternalLink, Pin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRef } from 'react'

interface LinkCardProps {
    id: string
    title: string
    url: string
    icon?: string
    thumbnail_url?: string
    is_pinned?: boolean
    category?: string
    buttonStyle?: string
    textColor?: string
    index: number
    isCompact?: boolean
    trackClicks?: boolean
}

const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            type: 'spring' as const,
            stiffness: 300,
            damping: 24,
        },
    }),
}

const BUTTON_STYLES: Record<string, string> = {
    glass: 'bg-black/20 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl hover:border-white/20',
    solid: 'bg-white/10 rounded-2xl border border-white/5 shadow-lg hover:bg-white/15',
    outline: 'bg-transparent rounded-2xl border-2 border-white/20 hover:border-white/40 hover:bg-white/5',
    brutal: 'bg-white text-black rounded-none border-4 border-black shadow-[4px_4px_0_#000] hover:shadow-[8px_8px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]',
    pill: 'bg-white/10 backdrop-blur-xl rounded-full border border-white/10 shadow-xl hover:bg-white/15',
}

export default function LinkCard({ id, title, url, icon, thumbnail_url, is_pinned, category, buttonStyle = 'glass', textColor, index, isCompact = false, trackClicks = false }: LinkCardProps) {
    const ref = useRef<HTMLAnchorElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
    }

    const handleMouseLeave = () => { x.set(0); y.set(0) }

    const href = trackClicks ? `/api/click/${id}` : url
    const isBrutal = buttonStyle === 'brutal'
    const styleClasses = BUTTON_STYLES[buttonStyle] || BUTTON_STYLES.glass

    return (
        <motion.div
            style={{ perspective: 1000 }}
            initial="hidden"
            animate="visible"
            custom={index}
            variants={variants}
            className={cn("w-full mb-4", isCompact && "mb-0 h-full")}
        >
            <motion.a
                ref={ref}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX: isCompact ? 0 : rotateX,
                    rotateY: isCompact ? 0 : rotateY,
                    transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: isBrutal ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'w-full max-w-md p-5 flex items-center justify-between relative overflow-hidden transition-all duration-300 group cursor-pointer',
                    styleClasses,
                    isCompact && 'p-3 flex-col items-start gap-4 h-full'
                )}
            >
                {/* Holographic Sheen (non-brutal) */}
                {!isBrutal && (
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.05) 40%, transparent 60%)" }}
                    />
                )}

                {/* Pin badge */}
                {is_pinned && (
                    <div className="absolute top-2 right-2 z-20">
                        <Pin size={10} className="text-yellow-400 fill-yellow-400" />
                    </div>
                )}

                <div className={cn("flex items-center gap-5 relative z-10 transform-gpu", isCompact && "flex-col items-start gap-3")} style={{ transform: "translateZ(20px)" }}>
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-500",
                        isBrutal ? "bg-black/10 border-2 border-black" : "bg-white/[0.03] border border-white/10",
                        isCompact && "w-8 h-8 rounded-xl",
                        thumbnail_url && "p-0"
                    )}>
                        {thumbnail_url ? (
                            <img src={thumbnail_url} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : icon ? (
                            <img src={icon} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <ExternalLink size={isCompact ? 14 : 18} className={isBrutal ? "text-black/40" : "text-white/40"} />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className={cn(
                            "font-black text-[13px] uppercase tracking-widest transition-colors duration-300",
                            isBrutal ? "text-black" : "text-white group-hover:text-zenith-white",
                            isCompact && "text-[10px] tracking-tight"
                        )} style={textColor && !isBrutal ? { color: textColor } : undefined}>
                            {title}
                        </span>
                        {!isCompact && category && (
                            <span className={cn(
                                "text-[8px] font-bold uppercase tracking-[0.3em] mt-1",
                                isBrutal ? "text-black/40" : "text-white/30"
                            )}>
                                {category}
                            </span>
                        )}
                    </div>
                </div>

                {!isCompact && (
                    <div
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0",
                            isBrutal ? "bg-black/10" : "bg-white/5"
                        )}
                        style={{ transform: "translateZ(10px)" }}
                    >
                        <ExternalLink size={14} className={isBrutal ? "text-black/40" : "text-white/40"} />
                    </div>
                )}
            </motion.a>
        </motion.div>
    )
}
