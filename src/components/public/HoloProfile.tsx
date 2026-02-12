'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import LinkCard from '@/components/LinkCard'
import ProductCard from '@/components/ProductCard'
import EmbedBlock from '@/components/EmbedBlock'
import { Instagram, Twitter, Github, Linkedin, Youtube, Link as LinkIcon, Globe, Facebook, Twitch, Box } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HoloProfileProps {
    profile: any
    links: any[]
    groups: any[]
    activeLinks: any[]
}

export default function HoloProfile({ profile, links, groups, activeLinks }: HoloProfileProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Parallax logic
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return
        const { left, top, width, height } = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - left) / width - 0.5
        const y = (e.clientY - top) / height - 0.5
        setMousePosition({ x, y })
    }

    // Platform Icons Map
    const PLATFORM_ICONS: Record<string, any> = {
        'Instagram': Instagram,
        'X / Twitter': Twitter,
        'GitHub': Github,
        'LinkedIn': Linkedin,
        'YouTube': Youtube,
        'Facebook': Facebook,
        'Twitch': Twitch,
        'Website': Globe,
        'Other': LinkIcon
    }

    const renderSingleLink = (link: any, index: number) => {
        if (link.link_type === 'product') {
            return <ProductCard key={link.id} {...link} trackClicks={true} />
        }
        if (link.link_type === 'embed') {
            return <EmbedBlock key={link.id} url={link.url} />
        }
        return (
            <LinkCard
                {...link}
                index={index}
                isCompact={false}
                buttonStyle="glass"
                textColor="#ffffff"
                trackClicks={true}
            />
        )
    }

    return (
        <div
            className="min-h-screen bg-black text-white overflow-hidden perspective-[1000px] relative font-mono"
            onMouseMove={handleMouseMove}
            ref={containerRef}
            style={{
                backgroundImage: 'radial-gradient(circle at center, #1e1b4b 0%, #000000 100%)'
            }}
        >
            {/* Grid Floor */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(0px) scale(2)',
                    transformOrigin: 'top center'
                }}
            />

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-zenith-indigo rounded-full animate-ping" />
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white/50 rounded-full animate-pulse" />
            </div>

            <motion.div
                className="max-w-[500px] mx-auto pt-20 pb-20 px-6 relative z-10 preserve-3d"
                animate={{
                    rotateY: mousePosition.x * 10,
                    rotateX: -mousePosition.y * 10,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
                {/* HUD Header */}
                <div className="text-center mb-12 space-y-6 relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-zenith-indigo to-transparent opacity-50" />

                    <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-zenith-indigo/30 animate-spin-slow">
                            <div className="absolute inset-0 border-t-2 border-zenith-indigo rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                        <div className="absolute inset-2 rounded-full overflow-hidden border border-white/20 bg-black/50 backdrop-blur-md z-10 flex items-center justify-center">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-1 opacity-50">
                                    <Box size={24} className="text-zenith-indigo" />
                                    <span className="text-[8px] font-bold text-white tracking-widest">NO IMG</span>
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-zenith-indigo text-black text-[9px] font-black uppercase tracking-widest rounded-full whitespace-nowrap z-20">
                            Live Uplink
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">
                            {profile.display_name || profile.username}
                        </h1>
                        <p className="text-[10px] font-bold text-zenith-indigo uppercase tracking-[0.3em] animate-pulse">
                            Augmented Reality Interface
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        {profile.social_links?.map((link: any, idx: number) => {
                            const Icon = PLATFORM_ICONS[link.platform] || LinkIcon
                            return (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-zenith-indigo hover:text-white transition-colors"
                                >
                                    <Icon size={16} />
                                </a>
                            )
                        })}
                    </div>
                </div>

                {/* Floating Links Stack */}
                <div className="space-y-6" style={{ transformStyle: 'preserve-3d' }}>
                    {activeLinks.map((link, index) => (
                        <motion.div
                            key={link.id}
                            initial={{ opacity: 0, y: 50, rotateX: 20 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{
                                scale: 1.05,
                                translateZ: 30,
                                rotateX: 5,
                                boxShadow: "0 20px 40px rgba(99,102,241,0.3)"
                            }}
                            className="transform-gpu"
                        >
                            {renderSingleLink(link, index)}
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.5em]">System Status: Online</p>
                </div>
            </motion.div>

            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-zenith-indigo/5 to-transparent bg-[length:100%_3px]" />
        </div>
    )
}
