'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Profile } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Plus, CheckCircle2, AlertCircle, Palette, Loader2, Image as ImageIcon, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import ThemeSelector from './ThemeSelector'
import SocialLinksEditor from './SocialLinksEditor'
import { Share2 } from 'lucide-react'

interface ProfileEditorProps {
    profile: Profile | null
    onUpdate: (profile: Profile) => void
    userId: string
    hideIdentity?: boolean
    hideDesign?: boolean
}

export default function ProfileEditor({ profile, onUpdate, userId, hideIdentity = false, hideDesign = false }: ProfileEditorProps) {
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadingBanner, setUploadingBanner] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    if (!profile) return null

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setMessage(null)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${userId}-${Date.now()}.${fileExt}`
            const filePath = `avatars/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) {
                setMessage({ type: 'error', text: `Upload failed: ${uploadError.message}` })
                setUploading(false)
                return
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            onUpdate({ ...profile, avatar_url: publicUrl })
            setMessage({ type: 'success', text: 'AVATAR_SYNC: Image uploaded' })
            setTimeout(() => setMessage(null), 3000)
        } catch (err) {
            setMessage({ type: 'error', text: 'Upload failed unexpectedly' })
        }
        setUploading(false)
    }

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingBanner(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `banner-${userId}-${Date.now()}.${fileExt}`
            const filePath = `avatars/${fileName}`
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })
            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
                onUpdate({ ...profile, banner_url: publicUrl })
                setMessage({ type: 'success', text: 'BANNER_SYNC: Image uploaded' })
                setTimeout(() => setMessage(null), 3000)
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Banner upload failed' })
        }
        setUploadingBanner(false)
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)
        const { error } = await supabase
            .from('profiles')
            .update({
                username: profile.username,
                display_name: profile.display_name,
                bio: profile.bio,
                theme_id: profile.theme_id,
                custom_theme: profile.custom_theme,
                social_links: profile.social_links,
                layout_mode: profile.layout_mode,
                seo_settings: profile.seo_settings,
                custom_font: profile.custom_font,
                banner_url: profile.banner_url,
                enable_email_collection: profile.enable_email_collection,
            })
            .eq('id', userId)

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: 'SYNC_COMPLETE: Registry updated' })
            setTimeout(() => setMessage(null), 3000)
        }
        setSaving(false)
    }

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* Global Header (Save Button) */}
            <div className="flex items-center justify-between gap-4 bg-black/40 backdrop-blur-[60px] rounded-full border border-white/[0.08] p-6 px-10">
                <div className="space-y-1">
                    <h3 className="text-[10px] font-black text-zenith-indigo uppercase tracking-[0.5em]">Command Hub</h3>
                    <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">{hideIdentity ? 'Visual Registry' : 'Identity Core'}</p>
                </div>
                <div className="flex-1 h-px bg-white/5 mx-6 hidden sm:block" />
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={cn(
                        "px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-[0.95] shadow-2xl",
                        saving
                            ? "bg-white/5 text-white/20 border border-white/10"
                            : "bg-white text-black hover:bg-zenith-indigo hover:text-white"
                    )}
                >
                    {saving ? 'SYNCING...' : 'COMMIT CHANGES'}
                </button>
            </div>
            {/* Notification Toast */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        className={cn(
                            "fixed top-24 right-10 z-50 flex items-center gap-4 px-8 py-5 rounded-full backdrop-blur-[60px] border shadow-2xl transition-all",
                            message.type === 'success'
                                ? 'bg-zenith-indigo/10 border-zenith-indigo/20 text-white'
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                        )}
                    >
                        <div className={cn("w-2 h-2 rounded-full", message.type === 'success' ? 'bg-zenith-indigo pulse' : 'bg-red-500')} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. Cinematic Identity Brick */}
            {!hideIdentity && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                    <div className="lg:col-span-4 bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] p-12 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-zenith-indigo/[0.03] opacity-0 group-hover:opacity-100 transition-opacity blur-[60px]" />
                        <div className="relative z-10 space-y-8 flex flex-col items-center">
                            <div className="relative group/avatar">
                                <div className="absolute inset-[-20px] bg-zenith-indigo/20 blur-[50px] rounded-full scale-0 group-hover/avatar:scale-120 transition-transform duration-1000 opacity-30"></div>
                                <div className="relative w-56 h-56 rounded-full border-2 border-white/5 p-2 bg-black shadow-2xl ring-4 ring-white/5 transition-all duration-700 group-hover/avatar:ring-zenith-indigo/20">
                                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-zinc-800 overflow-hidden relative">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} className="w-full h-full object-cover grayscale-[0.3] group-hover/avatar:grayscale-0 transition-all duration-700" alt="Avatar" />
                                        ) : (
                                            <User size={80} strokeWidth={0.5} className="opacity-10" />
                                        )}
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="absolute bottom-4 right-4 w-14 h-14 flex items-center justify-center bg-white text-black rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group/plus"
                                    >
                                        {uploading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <Plus className="group-hover:rotate-180 transition-transform duration-500" />
                                        )}
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Identity Core</h3>
                                <p className="text-xl font-black text-white">{profile.username || 'ANONYMOUS'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] p-12 space-y-12 flex flex-col">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Handle Identifier</label>
                                <input
                                    type="text"
                                    value={profile.username || ''}
                                    onChange={(e) => onUpdate({ ...profile, username: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-3xl px-8 py-5 text-white text-sm font-black tracking-tight focus:border-zenith-indigo/40 outline-none transition-all"
                                    placeholder="IDENTIFIER"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Commercial Alias</label>
                                <input
                                    type="text"
                                    value={profile.display_name || ''}
                                    onChange={(e) => onUpdate({ ...profile, display_name: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-3xl px-8 py-5 text-white text-sm font-black tracking-tight focus:border-zenith-indigo/40 outline-none transition-all"
                                    placeholder="DISPLAY_NAME"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Narrative Metadata</label>
                                <textarea
                                    value={profile.bio || ''}
                                    onChange={(e) => onUpdate({ ...profile, bio: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] px-8 py-6 text-white/80 text-sm font-medium focus:border-zenith-indigo/40 outline-none transition-all h-32 resize-none"
                                    placeholder="Provide context for your digital identity..."
                                />
                            </div>
                        </div>

                        {/* Banner Upload */}
                        <div className="md:col-span-2 space-y-4 pt-6 border-t border-white/[0.03]">
                            <div className="flex items-center justify-between">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-2 flex items-center gap-2">
                                    <ImageIcon size={12} /> Banner Image
                                </label>
                                <button
                                    onClick={() => bannerInputRef.current?.click()}
                                    disabled={uploadingBanner}
                                    className="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-black text-white/40 uppercase tracking-widest hover:bg-white/[0.06] transition-all"
                                >
                                    {uploadingBanner ? <Loader2 size={12} className="animate-spin" /> : (profile.banner_url ? 'Change Banner' : 'Upload Banner')}
                                </button>
                                <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                            </div>
                            {profile.banner_url && (
                                <div className="relative rounded-2xl overflow-hidden">
                                    <img src={profile.banner_url} alt="Banner" className="w-full h-32 object-cover" />
                                    <button
                                        onClick={() => onUpdate({ ...profile, banner_url: undefined })}
                                        className="absolute top-2 right-2 text-[8px] font-black text-white bg-black/50 px-3 py-1 rounded-full"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Email Collection Toggle */}
                        <div className="md:col-span-2 flex items-center justify-between p-6 bg-white/[0.01] rounded-2xl border border-white/[0.03]">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-zenith-indigo/10 rounded-xl text-zenith-indigo">
                                    <Mail size={14} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white/70">Email Collection</p>
                                    <p className="text-[9px] text-white/30">Show subscribe form on your public profile</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onUpdate({ ...profile, enable_email_collection: !profile.enable_email_collection })}
                                className={cn(
                                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-all duration-500",
                                    profile.enable_email_collection ? "bg-zenith-indigo" : "bg-white/5 border border-white/10"
                                )}
                            >
                                <span className={cn(
                                    "pointer-events-none inline-block h-4 w-4 transform rounded-full transition duration-500 mt-1 ml-1",
                                    profile.enable_email_collection ? "translate-x-5 bg-white" : "translate-x-0 bg-white/20"
                                )} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 1.5 Social Signal Matrix */}
            {!hideIdentity && (
                <div className="bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] p-12 space-y-12">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo">
                            <Share2 size={20} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Connectivity Hub</h3>
                            <p className="text-xl font-black text-white tracking-tight uppercase tracking-widest">Social Signal Matrix</p>
                        </div>
                        <div className="flex-1 h-px bg-white/5 mx-6" />
                    </div>

                    <SocialLinksEditor
                        profile={profile}
                        onChange={(links) => onUpdate({ ...profile, social_links: links })}
                    />
                </div>
            )}

            {/* 2. Visual System Override Module */}
            {!hideDesign && (
                <div className="bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] p-12 space-y-12">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo">
                            <Palette size={20} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Atmospheric Registry</h3>
                            <p className="text-xl font-black text-white tracking-tight uppercase tracking-widest">Visual Signature Overrides</p>
                        </div>
                        <div className="flex-1 h-px bg-white/5 mx-6" />
                    </div>

                    <ThemeSelector
                        currentTheme={profile.theme_id || 'default'}
                        customTheme={profile.custom_theme || null}
                        customFont={profile.custom_font || undefined}
                        layoutMode={profile.layout_mode || 'list'}
                        onChange={(themeId: string, customTheme?: any) => {
                            onUpdate({ ...profile, theme_id: themeId, custom_theme: customTheme })
                        }}
                        onLayoutChange={(mode) => {
                            onUpdate({ ...profile, layout_mode: mode })
                        }}
                        onFontChange={(font) => {
                            onUpdate({ ...profile, custom_font: font })
                        }}
                    />
                </div>
            )}
        </div>
    )
}
