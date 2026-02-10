'use client'
import { Link as LinkType, Profile } from '@/types'
import LinkCard from '@/components/LinkCard' // Reuse the same card component
import { ExternalLink } from 'lucide-react'

interface LinkPreviewProps {
    profile: Profile | null
    links: LinkType[]
}

export default function LinkPreview({ profile, links }: LinkPreviewProps) {
    if (!profile) return <div className="text-center text-gray-500">Loading preview...</div>

    // Mock themes for now, utilizing the profile's custom_theme or theme_id
    const bgStyle = profile.custom_theme?.background || 'linear-gradient(to bottom right, #4f46e5, #ec4899)'
    const fontFamily = profile.custom_theme?.fontFamily || 'Inter'

    return (
        <div className="border-[8px] border-gray-900 rounded-[3rem] overflow-hidden bg-black shadow-2xl h-[700px] w-[350px] mx-auto relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-2xl z-20"></div>

            <div
                className="h-full w-full overflow-y-auto hide-scrollbar"
                style={{ background: bgStyle, fontFamily }}
            >
                <div className="pt-16 pb-8 px-4 flex flex-col items-center min-h-full">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm p-1 mb-4 overflow-hidden shrink-0">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xs">No Img</div>
                        )}
                    </div>

                    <h2 className="text-lg font-bold text-white drop-shadow-md text-center">{profile.display_name || `@${profile.username}`}</h2>
                    <p className="text-white/80 text-xs mt-1 max-w-[200px] text-center mb-6">{profile.bio}</p>

                    <div className="w-full space-y-3">
                        {links.filter(l => l.is_visible).map((link, index) => (
                            <div key={link.id} className="transform scale-90 origin-top">
                                <LinkCard {...link} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
