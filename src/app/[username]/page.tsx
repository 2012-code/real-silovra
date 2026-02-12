import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import LinkCard from '@/components/LinkCard'
import ProductCard from '@/components/ProductCard'
import EmbedBlock from '@/components/EmbedBlock'
import SubscribeBlock from '@/components/SubscribeBlock'
import ThemeToggle from '@/components/ThemeToggle'
import BackgroundEngine from '@/components/BackgroundEngine'
import {
    Instagram,
    Twitter,
    Github,
    Linkedin,
    Youtube,
    Link as LinkIcon,
    Globe,
    Facebook,
    Twitch
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Metadata, ResolvingMetadata } from 'next'
import { THEME_PRESETS } from '@/lib/themes'

export const revalidate = 60

interface Props {
    params: Promise<{ username: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const supabase = await createClient()
    const { username } = await params

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (!profile) {
        return { title: 'Profile Not Found - Silovra' }
    }

    const previousImages = (await parent).openGraph?.images || []
    const keywords = profile.seo_settings?.keywords?.split(',').map((k: string) => k.trim()) || []

    return {
        title: profile.seo_settings?.title || `${profile.display_name || profile.username} | Silovra`,
        description: profile.seo_settings?.description || profile.bio || `Check out ${profile.username}'s links on Silovra.`,
        keywords,
        openGraph: {
            images: [profile.seo_settings?.og_image_url || profile.avatar_url || '', ...previousImages],
        },
    }
}

export default async function PublicProfile({ params }: Props) {
    const supabase = await createClient()
    const { username } = await params

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (!profile) {
        return notFound()
    }

    // Increment view count (fire and forget)
    supabase
        .from('profiles')
        .update({ total_views: (profile.total_views || 0) + 1 })
        .eq('id', profile.id)
        .then(() => { })

    const { data: allLinks } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', profile.id)
        .eq('is_visible', true)
        .order('position', { ascending: true })

    // Fetch link groups
    const { data: linkGroups } = await supabase
        .from('link_groups')
        .select('*')
        .eq('user_id', profile.id)
        .order('position', { ascending: true })

    // Filter by schedule + sort pinned first
    const now = new Date()
    const activeLinks = (allLinks || []).filter(link => {
        if (link.schedule_start && new Date(link.schedule_start) > now) return false
        if (link.schedule_end && new Date(link.schedule_end) < now) return false
        return true
    }).sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1
        if (!a.is_pinned && b.is_pinned) return 1
        return 0
    })

    // Group links by group_id or category
    const groups = linkGroups || []
    const groupedLinks: Record<string, typeof activeLinks> = {}
    const ungroupedLinks: typeof activeLinks = []

    activeLinks.forEach(link => {
        if (link.group_id) {
            if (!groupedLinks[link.group_id]) groupedLinks[link.group_id] = []
            groupedLinks[link.group_id].push(link)
        } else {
            ungroupedLinks.push(link)
        }
    })

    // Fallback: group by category if no link_groups
    const categorizedLinks: Record<string, typeof activeLinks> = {}
    const uncategorized: typeof activeLinks = []
    if (groups.length === 0) {
        activeLinks.forEach(link => {
            if (link.category) {
                if (!categorizedLinks[link.category]) categorizedLinks[link.category] = []
                categorizedLinks[link.category].push(link)
            } else {
                uncategorized.push(link)
            }
        })
    }
    const hasGroups = groups.length > 0
    const hasCategories = !hasGroups && Object.keys(categorizedLinks).length > 0

    // Theme resolution
    const theme = THEME_PRESETS.find(t => t.id === profile.theme_id) || THEME_PRESETS[0]
    const bgStyle = profile.custom_theme?.background || theme.background
    const fontFamily = profile.custom_font || profile.custom_theme?.fontFamily || theme.fontFamily
    const textColor = profile.custom_theme?.textColor || theme.textColor
    const bgType = profile.custom_theme?.background_type || 'static'
    const buttonStyle = profile.custom_theme?.buttonStyle || 'glass'
    const layoutMode = profile.layout_mode || 'list'

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
        // Product type
        if (link.link_type === 'product') {
            return (
                <ProductCard
                    key={link.id}
                    id={link.id}
                    title={link.title}
                    url={link.url}
                    thumbnail_url={link.thumbnail_url}
                    price={link.price}
                    cta_text={link.cta_text}
                    trackClicks={true}
                />
            )
        }
        // Embed type
        if (link.link_type === 'embed') {
            return (
                <EmbedBlock key={link.id} url={link.url} />
            )
        }
        // Regular link
        return (
            <LinkCard
                {...link}
                index={index}
                isCompact={layoutMode === 'grid'}
                buttonStyle={buttonStyle}
                textColor={textColor}
                trackClicks={true}
            />
        )
    }

    const renderLinks = (linksToRender: typeof activeLinks, startIndex: number = 0) => (
        <div className={cn(
            "w-full",
            layoutMode === 'grid' ? "grid grid-cols-2 gap-4" :
                layoutMode === 'stack' ? "flex flex-col gap-6" :
                    "space-y-4"
        )}>
            {linksToRender.map((link, index) => (
                <div key={link.id} className="w-full">
                    {renderSingleLink(link, startIndex + index)}
                </div>
            ))}
        </div>
    )

    return (
        <main
            className="min-h-screen flex flex-col items-center selection:bg-indigo-500/30 relative overflow-hidden"
            style={{ background: bgStyle, fontFamily }}
        >
            {/* Cinematic Atmosphere Layer */}
            {bgType !== 'static' && (
                <BackgroundEngine type={bgType as any} backgroundColor={bgStyle} />
            )}

            {/* Visitor Theme Toggle */}
            <ThemeToggle />

            <div className="relative z-10 w-full max-w-[500px] px-6 pt-16 pb-12 flex flex-col items-center min-h-screen">
                {/* Banner Image */}
                {profile.banner_url && (
                    <div className="w-full mb-8 rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src={profile.banner_url}
                            alt="Banner"
                            className="w-full h-40 object-cover"
                        />
                    </div>
                )}

                {/* Avatar */}
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full border border-white/20 p-1 bg-black/20 backdrop-blur-xl shadow-2xl overflow-hidden">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center text-zinc-600 text-[8px] font-black tracking-[0.2em]">SILOVRA</div>
                        )}
                    </div>
                </div>

                {/* Name */}
                <h1
                    className="text-xl font-black drop-shadow-2xl text-center tracking-tighter mb-2"
                    style={{ color: textColor }}
                >
                    {profile.display_name || `@${profile.username}`}
                </h1>

                {/* Bio */}
                {profile.bio && (
                    <p
                        className="text-[11px] font-bold uppercase tracking-[0.15em] text-center mb-8 leading-relaxed max-w-[280px] opacity-70"
                        style={{ color: textColor }}
                    >
                        {profile.bio}
                    </p>
                )}

                {/* Social Icons */}
                {profile.social_links && profile.social_links.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {profile.social_links.filter((l: any) => l.is_visible !== false).map((link: any, idx: number) => {
                            const Icon = PLATFORM_ICONS[link.platform] || LinkIcon
                            return (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all shadow-xl"
                                    style={{ color: textColor, opacity: 0.5 }}
                                >
                                    <Icon size={16} />
                                </a>
                            )
                        })}
                    </div>
                )}

                {/* Links — grouped by link_groups, category, or flat */}
                {hasGroups ? (
                    <div className="w-full space-y-8">
                        {/* Ungrouped first */}
                        {ungroupedLinks.length > 0 && renderLinks(ungroupedLinks)}

                        {/* Link Groups */}
                        {groups.map((group: any, gi: number) => {
                            const groupLinks = groupedLinks[group.id] || []
                            if (groupLinks.length === 0) return null
                            return (
                                <div key={group.id} className="space-y-4">
                                    <div className="flex items-center gap-4 px-2">
                                        <span
                                            className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40"
                                            style={{ color: textColor }}
                                        >
                                            {group.name}
                                        </span>
                                        <div className="flex-1 h-px bg-current opacity-10" style={{ color: textColor }} />
                                    </div>
                                    {renderLinks(groupLinks, gi * 100)}
                                </div>
                            )
                        })}
                    </div>
                ) : hasCategories ? (
                    <div className="w-full space-y-8">
                        {uncategorized.length > 0 && renderLinks(uncategorized)}
                        {Object.entries(categorizedLinks).map(([category, categoryLinks], ci) => (
                            <div key={category} className="space-y-4">
                                <div className="flex items-center gap-4 px-2">
                                    <span
                                        className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40"
                                        style={{ color: textColor }}
                                    >
                                        {category}
                                    </span>
                                    <div className="flex-1 h-px bg-current opacity-10" style={{ color: textColor }} />
                                </div>
                                {renderLinks(categoryLinks, ci * 100)}
                            </div>
                        ))}
                    </div>
                ) : (
                    renderLinks(activeLinks)
                )}

                {/* Email Collection Block */}
                {profile.enable_email_collection && (
                    <div className="w-full mt-12">
                        <SubscribeBlock userId={profile.id} />
                    </div>
                )}

                {/* Footer */}
                <div className="mt-auto pt-16 pb-4 flex flex-col items-center">
                    <span
                        className="text-[9px] font-black tracking-[0.3em] uppercase opacity-30"
                        style={{ color: textColor }}
                    >
                        Powered by Silovra
                    </span>
                </div>
            </div>
        </main>
    )
}
