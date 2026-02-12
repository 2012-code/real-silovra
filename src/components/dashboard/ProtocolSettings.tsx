'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Search, Save, AlertCircle, Twitter, Facebook, Image as ImageIcon, Eye } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Profile } from '@/types'

interface ProtocolSettingsProps {
    profile: Profile
    onUpdate: (updatedProfile: Profile) => void
}

export default function ProtocolSettings({ profile, onUpdate }: ProtocolSettingsProps) {
    const [isSaving, setIsSaving] = useState(false)
    const [settings, setSettings] = useState(profile.seo_settings || {
        title: '',
        description: '',
        keywords: '',
        og_image_url: ''
    })

    const handleSave = async () => {
        setIsSaving(true)
        const supabase = createClient()

        const { error } = await supabase
            .from('profiles')
            .update({ seo_settings: settings })
            .eq('id', profile.id)

        if (!error) {
            onUpdate({ ...profile, seo_settings: settings })
        }
        setIsSaving(false)
    }

    const ogTitle = settings.title || `${profile.display_name || profile.username} | Digital Identity`
    const ogDescription = settings.description || 'No description standard available. Initialize signal transmission.'
    const ogImage = settings.og_image_url

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Protocol Ops</h2>
                    <p className="text-white/40 text-sm font-medium">Manage visibility and discovery protocols.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-zenith-white transition-colors disabled:opacity-50"
                >
                    {isSaving ? (
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                        <Save size={16} />
                    )}
                    {isSaving ? 'Indexing...' : 'Save Protocol'}
                </motion.button>
            </div>

            {/* SEO Matrix */}
            <div className="bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] p-12 space-y-12">
                <div className="flex items-center gap-6">
                    <div className="p-3 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo">
                        <Globe size={20} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Global Indexing</h3>
                        <p className="text-xl font-black text-white tracking-tight uppercase tracking-widest">Search Engine Optimization</p>
                    </div>
                    <div className="flex-1 h-px bg-white/5 mx-6" />
                </div>

                <div className="grid gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">
                            Signal Title
                        </label>
                        <input
                            type="text"
                            value={settings.title}
                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                            placeholder={`${profile.display_name || profile.username} | Digital Identity`}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] px-6 py-4 text-white font-medium focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/10"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">
                            Broadcast Description
                        </label>
                        <textarea
                            value={settings.description}
                            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                            placeholder="A brief signal transmission about your digital presence..."
                            className="w-full h-32 bg-white/[0.02] border border-white/5 rounded-[2rem] px-6 py-4 text-white font-medium focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/10 resize-none"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">
                            Discovery Keywords
                        </label>
                        <input
                            type="text"
                            value={settings.keywords}
                            onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
                            placeholder="link in bio, portfolio, creator, music..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] px-6 py-4 text-white font-medium focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/10"
                        />
                        <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest ml-4">Separate with commas</p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">
                            OG Image URL
                        </label>
                        <input
                            type="text"
                            value={settings.og_image_url || ''}
                            onChange={(e) => setSettings({ ...settings, og_image_url: e.target.value })}
                            placeholder="https://example.com/og-image.png"
                            className="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] px-6 py-4 text-white font-medium focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/10"
                        />
                        <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest ml-4">Image shown when sharing on social media</p>
                    </div>
                </div>

                {/* Google Search Preview */}
                <div className="bg-zenith-indigo/[0.03] border border-zenith-indigo/10 rounded-[2rem] p-8 flex items-start gap-6">
                    <div className="p-3 bg-zenith-indigo/10 rounded-xl text-zenith-indigo shrink-0">
                        <Search size={18} />
                    </div>
                    <div className="space-y-2 flex-1">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Google Preview</h4>
                        <div className="space-y-1">
                            <p className="text-[#8ab4f8] text-lg font-medium hover:underline cursor-pointer truncate">
                                {ogTitle}
                            </p>
                            <p className="text-[#006621] text-sm">
                                silovra.com/{profile.username}
                            </p>
                            <p className="text-white/60 text-sm line-clamp-2">
                                {ogDescription}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Social Media Preview Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Twitter/X Card Preview */}
                    <div className="rounded-[2rem] border border-white/[0.08] overflow-hidden bg-[#15202b]">
                        <div className="px-6 py-4 border-b border-white/[0.05] flex items-center gap-3">
                            <Twitter size={14} className="text-white/40" />
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Twitter / X Card</span>
                        </div>
                        {ogImage && (
                            <div className="w-full aspect-[2/1] bg-white/[0.02]">
                                <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-5 space-y-1">
                            <p className="text-sm font-bold text-white/80 truncate">{ogTitle}</p>
                            <p className="text-xs text-white/40 line-clamp-2">{ogDescription}</p>
                            <p className="text-[10px] text-white/20 mt-2">silovra.com</p>
                        </div>
                    </div>

                    {/* Facebook Card Preview */}
                    <div className="rounded-[2rem] border border-white/[0.08] overflow-hidden bg-[#242526]">
                        <div className="px-6 py-4 border-b border-white/[0.05] flex items-center gap-3">
                            <Facebook size={14} className="text-white/40" />
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Facebook Card</span>
                        </div>
                        {ogImage && (
                            <div className="w-full aspect-[1.91/1] bg-white/[0.02]">
                                <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-5 space-y-1 bg-[#3a3b3c]/50">
                            <p className="text-[9px] text-white/20 uppercase">silovra.com</p>
                            <p className="text-sm font-bold text-white/80 truncate">{ogTitle}</p>
                            <p className="text-xs text-white/40 line-clamp-1">{ogDescription}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
