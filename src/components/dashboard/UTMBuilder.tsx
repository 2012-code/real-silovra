'use client'
import { useState } from 'react'
import { Share2, Copy, Check, Link as LinkIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UTMBuilderProps {
    profileUrl: string
}

export default function UTMBuilder({ profileUrl }: UTMBuilderProps) {
    const [source, setSource] = useState('')
    const [medium, setMedium] = useState('')
    const [campaign, setCampaign] = useState('')
    const [term, setTerm] = useState('')
    const [content, setContent] = useState('')
    const [copied, setCopied] = useState(false)

    const buildUrl = () => {
        const params = new URLSearchParams()
        if (source) params.set('utm_source', source)
        if (medium) params.set('utm_medium', medium)
        if (campaign) params.set('utm_campaign', campaign)
        if (term) params.set('utm_term', term)
        if (content) params.set('utm_content', content)
        const qs = params.toString()
        return qs ? `${profileUrl}?${qs}` : profileUrl
    }

    const generatedUrl = buildUrl()

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(generatedUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const PRESETS = [
        { label: 'Instagram', source: 'instagram', medium: 'social' },
        { label: 'Twitter/X', source: 'twitter', medium: 'social' },
        { label: 'TikTok', source: 'tiktok', medium: 'social' },
        { label: 'Email', source: 'email', medium: 'email' },
        { label: 'YouTube', source: 'youtube', medium: 'video' },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo">
                    <Share2 size={16} />
                </div>
                <div>
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">UTM Campaign Builder</h3>
                    <p className="text-sm font-black text-white">Create Trackable Share Links</p>
                </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
                {PRESETS.map(preset => (
                    <button
                        key={preset.label}
                        onClick={() => { setSource(preset.source); setMedium(preset.medium) }}
                        className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-black text-white/40 uppercase tracking-widest hover:bg-white/[0.06] hover:text-white/60 transition-all"
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[8px] font-black text-white/30 uppercase tracking-widest">Source *</label>
                    <input
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="e.g. instagram, twitter"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3 text-white text-xs font-bold focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[8px] font-black text-white/30 uppercase tracking-widest">Medium *</label>
                    <input
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        placeholder="e.g. social, email, cpc"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3 text-white text-xs font-bold focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[8px] font-black text-white/30 uppercase tracking-widest">Campaign</label>
                    <input
                        value={campaign}
                        onChange={(e) => setCampaign(e.target.value)}
                        placeholder="e.g. spring_launch"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3 text-white text-xs font-bold focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[8px] font-black text-white/30 uppercase tracking-widest">Content</label>
                    <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="e.g. bio_link, header_cta"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3 text-white text-xs font-bold focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/10"
                    />
                </div>
            </div>

            {/* Generated URL */}
            <div className="bg-black/40 backdrop-blur-[60px] rounded-2xl border border-white/[0.08] p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <LinkIcon size={12} className="text-zenith-indigo" />
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Generated URL</span>
                </div>
                <div className="flex items-center gap-3">
                    <p className="flex-1 text-[10px] font-mono text-zenith-indigo/80 break-all bg-white/[0.02] rounded-xl px-4 py-3 border border-white/5">
                        {generatedUrl}
                    </p>
                    <button
                        onClick={copyToClipboard}
                        className="p-3 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.06] transition-all"
                    >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white/40" />}
                    </button>
                </div>
            </div>
        </div>
    )
}
