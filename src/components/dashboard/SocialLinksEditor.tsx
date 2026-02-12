'use client'
import { Profile, SocialLink } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Instagram,
    Twitter,
    Link as LinkIcon,
    Github,
    Linkedin,
    Youtube,
    Trash2,
    Plus,
    Share2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface SocialLinksEditorProps {
    profile: Profile
    onChange: (socialLinks: SocialLink[]) => void
}

const PLATFORMS = [
    { name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { name: 'X / Twitter', icon: Twitter, color: '#1DA1F2' },
    { name: 'GitHub', icon: Github, color: '#333' },
    { name: 'LinkedIn', icon: Linkedin, color: '#0072b1' },
    { name: 'YouTube', icon: Youtube, color: '#FF0000' },
    { name: 'Other', icon: LinkIcon, color: '#818cf8' },
]

export default function SocialLinksEditor({ profile, onChange }: SocialLinksEditorProps) {
    const [isAdding, setIsAdding] = useState(false)
    const socialLinks = profile.social_links || []

    const addLink = (platform: string) => {
        const newLinks = [...socialLinks, { platform, url: '', is_visible: true }]
        onChange(newLinks)
        setIsAdding(false)
    }

    const updateLink = (index: number, updates: Partial<SocialLink>) => {
        const newLinks = [...socialLinks]
        newLinks[index] = { ...newLinks[index], ...updates }
        onChange(newLinks)
    }

    const removeLink = (index: number) => {
        const newLinks = socialLinks.filter((_, i) => i !== index)
        onChange(newLinks)
    }

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {socialLinks.map((link, idx) => {
                        const PlatformIcon = PLATFORMS.find(p => p.name === link.platform)?.icon || LinkIcon
                        return (
                            <motion.div
                                key={`${link.platform}-${idx}`}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col gap-4 group transition-all hover:border-white/20"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-white/[0.05] text-white/40 group-hover:text-zenith-indigo transition-colors">
                                            <PlatformIcon size={18} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{link.platform}</span>
                                    </div>
                                    <button
                                        onClick={() => removeLink(idx)}
                                        className="p-2 text-white/10 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => updateLink(idx, { url: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-transparent border-b border-white/5 py-2 text-[12px] font-medium text-white/80 outline-none focus:border-zenith-indigo/40 transition-all placeholder:text-white/5"
                                />
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {!isAdding ? (
                    <motion.button
                        layout
                        onClick={() => setIsAdding(true)}
                        className="border border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-white/20 hover:text-white/40 hover:border-white/20 transition-all group"
                    >
                        <div className="p-4 rounded-full bg-white/[0.02] group-hover:scale-110 transition-transform">
                            <Plus size={24} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Connect Signal</span>
                    </motion.button>
                ) : (
                    <motion.div
                        layout
                        className="bg-black/40 border border-white/10 rounded-3xl p-6 grid grid-cols-3 gap-4 animate-in fade-in zoom-in-95"
                    >
                        {PLATFORMS.map((p) => (
                            <button
                                key={p.name}
                                onClick={() => addLink(p.name)}
                                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group"
                            >
                                <p.icon size={20} className="text-white/20 group-hover:text-white transition-colors" />
                                <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">{p.name === 'X / Twitter' ? 'X' : p.name}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
