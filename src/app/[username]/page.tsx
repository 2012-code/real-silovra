import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import LinkCard from '@/components/LinkCard' // This will work once resolved
import { ExternalLink } from 'lucide-react'

// Allow dynamic generation of routes
export const revalidate = 60

interface Props {
    params: { username: string }
}

export default async function PublicProfile({ params }: Props) {
    const supabase = createClient()
    const { username } = params

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (!profile) {
        return notFound()
    }

    // Fetch Links
    const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', profile.id)
        .eq('is_visible', true)
        .order('position', { ascending: true })

    // Theme Application Logic (Basic for now)
    const bgStyle = profile.custom_theme?.background || 'linear-gradient(to bottom right, #4f46e5, #ec4899)'

    return (
        <main
            className="min-h-screen flex flex-col items-center py-12 px-4"
            style={{ background: bgStyle }}
        >
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm p-1 mb-4 overflow-hidden">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <div className="w-full h-full bg-gray-300 rounded-full" />
                    )}
                </div>
                <h1 className="text-2xl font-bold text-white drop-shadow-md">{profile.display_name || `@${profile.username}`}</h1>
                <p className="text-white/80 text-sm mt-2 max-w-sm text-center">{profile.bio}</p>
            </div>

            {/* Links */}
            <div className="w-full max-w-md space-y-4">
                {links?.map((link, index) => (
                    // @ts-ignore - Component props might slightly mistmatch until finalized
                    <LinkCard
                        key={link.id}
                        {...link}
                        index={index}
                    />
                ))}
            </div>

            <div className="mt-12 text-white/50 text-xs font-mono">
                POWERED BY ULTRA-LINKS
            </div>
        </main>
    )
}
