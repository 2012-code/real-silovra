'use client'
import { Link as LinkType, Profile } from '@/types'
import { THEME_PRESETS } from '@/lib/themes'
import LinkCard from '@/components/LinkCard'
import BackgroundEngine from '@/components/BackgroundEngine'
import {
    ExternalLink,
    Instagram,
    Twitter,
    Github,
    Linkedin,
    Youtube,
    Link as LinkIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LinkPreviewProps {
    profile: Profile | null
    links: LinkType[]
}

export default function LinkPreview({ profile, links }: LinkPreviewProps) {
    if (!profile) return <div className="text-center text-gray-500">Loading preview...</div>

    const PLATFORM_ICONS: Record<string, any> = {
        'Instagram': Instagram,
        'X / Twitter': Twitter,
        'GitHub': Github,
        'LinkedIn': Linkedin,
        'YouTube': Youtube,
        'Other': LinkIcon
    }

    const theme = THEME_PRESETS.find(t => t.id === profile.theme_id) || THEME_PRESETS[0]
    const bgStyle = profile.custom_theme?.background || theme.background
    const fontFamily = profile.custom_font || profile.custom_theme?.fontFamily || theme.fontFamily
    const bgType = profile.custom_theme?.background_type || 'static'
    const textColor = profile.custom_theme?.textColor || theme.textColor || '#ffffff'
    const buttonStyle = profile.custom_theme?.buttonStyle || 'glass'

    return (
        <div className="border-[1.5px] border-white/[0.03] p-1.5 rounded-[4.5rem] bg-[#09090b] shadow-[0_0_100px_rgba(0,0,0,0.4)] h-[780px] w-[370px] mx-auto relative group overflow-hidden">
            {/* Phone Identity Shell */}
            <div className="h-full w-full bg-[#09090b] rounded-[4rem] border border-white/5 overflow-hidden relative">
                {/* Notch Manifest */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-40 bg-black rounded-b-[2.5rem] z-20 border-x border-b border-white/[0.02]"></div>

                <div
                    className="h-full w-full overflow-y-auto hide-scrollbar transition-all duration-700 relative"
                    style={{ background: bgStyle, fontFamily }}
                >
                    {/* Atmosphere Layer */}
                    {bgType !== 'static' && (
                        <BackgroundEngine type={bgType as any} backgroundColor={bgStyle} />
                    )}

                    {/* Background Noise/Texture */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                    <div className="pt-24 pb-12 px-6 flex flex-col items-center min-h-full">
                        {/* Signature Avatar */}
                        <div className="relative group/avatar mb-8">
                            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-110 opacity-0 group-hover/avatar:opacity-100 transition-all duration-1000"></div>
                            <div className="relative w-24 h-24 rounded-full border border-white/20 p-1 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover rounded-full grayscale-[0.1]" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center text-zinc-600 text-[8px] font-black tracking-[0.2em]">IDENTITY</div>
                                )}
                            </div>
                        </div>

                        <h2 className="text-xl font-black drop-shadow-2xl text-center tracking-tighter mb-2" style={{ color: textColor }}>{profile.display_name || `@${profile.username}`}</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-center mb-6 leading-relaxed max-w-[240px] opacity-70" style={{ color: textColor }}>{profile.bio || 'IDENTIFICATION PENDING...'}</p>

                        {/* Social Signals */}
                        {profile.social_links && profile.social_links.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-4 mb-10">
                                {profile.social_links.map((link, idx) => {
                                    const Icon = PLATFORM_ICONS[link.platform] || LinkIcon
                                    return (
                                        <a
                                            key={idx}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all shadow-2xl"
                                        >
                                            <Icon size={16} />
                                        </a>
                                    )
                                })}
                            </div>
                        )}

                        <div className={cn(
                            "w-full",
                            profile.layout_mode === 'grid' ? "grid grid-cols-2 gap-4" :
                                profile.layout_mode === 'stack' ? "flex flex-col gap-6" :
                                    "space-y-4"
                        )}>
                            {links.filter(l => l.is_visible).map((link, index) => (
                                <div key={link.id} className="transform hover:scale-[1.02] transition-transform duration-500">
                                    <LinkCard
                                        {...link}
                                        index={index}
                                        isCompact={profile.layout_mode === 'grid'}
                                        buttonStyle={buttonStyle}
                                        textColor={textColor}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
