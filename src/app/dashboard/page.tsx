'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import LinkEditor from '@/components/dashboard/link-editor'
import ProfileEditor from '@/components/dashboard/profile-editor'
import { Link as LinkType, Profile } from '@/types'
import { LogOut, ExternalLink } from 'lucide-react'

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [links, setLinks] = useState<LinkType[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const getData = async () => {
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError || !user) {
                router.push('/auth/login')
                return
            }
            setUser(user)

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            setProfile(profileData)

            // Fetch Links (Replacing useLinks hook for manual control if needed, or use it)
            const { data: linksData } = await supabase
                .from('links')
                .select('*')
                .eq('user_id', user.id)
                .order('position', { ascending: true })

            setLinks(linksData || [])
            setLoading(false)
        }

        getData()
    }, [router, supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
            {/* Header */}
            <header className="bg-white dark:bg-zinc-800 shadow-sm border-b dark:border-zinc-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                            UltraLinks Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {profile?.username && (
                            <a
                                href={`/${profile.username}`}
                                target="_blank"
                                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                                View Page <ExternalLink size={14} />
                            </a>
                        )}
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Profile Section */}
                <section>
                    <ProfileEditor initialProfile={profile} userId={user.id} />
                </section>

                {/* Links Section */}
                <section>
                    <LinkEditor initialLinks={links} userId={user.id} />
                </section>
            </main>
        </div>
    )
}
