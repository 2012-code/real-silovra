'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'
import LinkEditor from '@/components/dashboard/link-editor'
import ProfileEditor from '@/components/dashboard/profile-editor'
import LinkPreview from '@/components/dashboard/LinkPreview'
import SignalBroadcast from '@/components/dashboard/SignalBroadcast'
import ProtocolSettings from '@/components/dashboard/ProtocolSettings'
import Insights from '@/components/dashboard/Insights'
import NotificationBell from '@/components/dashboard/NotificationBell'
import SubscribersList from '@/components/dashboard/SubscribersList'
import UTMBuilder from '@/components/dashboard/UTMBuilder'
import UpgradePrompt from '@/components/dashboard/UpgradePrompt'
import { Link as LinkType, Profile } from '@/types'
import { checkMilestones } from '@/lib/notifications'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, ExternalLink, LayoutGrid, Link as LinkIcon, BarChart3, Settings, User, ShoppingBag, Palette, Share2, Eye, Crown } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [links, setLinks] = useState<LinkType[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'links' | 'profile' | 'appearance' | 'analytics' | 'broadcast' | 'settings'>('links')
    const { supabase } = useSupabase()
    const router = useRouter()

    useEffect(() => {
        const getData = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser()

                if (authError || !user) {
                    router.push('/auth/login')
                    return
                }
                setUser(user)

                // Fetch Profile
                let { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                // Self-healing: If profile doesn't exist
                if (profileError && profileError.code === 'PGRST116') {
                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: user.id,
                            username: `user_${user.id.slice(0, 8)}`,
                            display_name: `User ${user.id.slice(0, 8)}`
                        })
                        .select()
                        .single()

                    if (!insertError) profileData = newProfile
                }

                setProfile(profileData)

                // Fetch Links
                const { data: linksData } = await supabase
                    .from('links')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('position', { ascending: true })

                setLinks(linksData || [])

                // Check milestones
                if (profileData) {
                    const totalClicks = (linksData || []).reduce((acc: number, l: any) => acc + (l.click_count || 0), 0)
                    checkMilestones(user.id, profileData.total_views || 0, totalClicks)
                }
            } catch (err) {
                console.error('Dashboard data fetch error:', err)
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [router, supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    const navItems = [
        { id: 'links', label: 'Links', icon: LinkIcon },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'appearance', label: 'Design', icon: Palette },
        { id: 'broadcast', label: 'Broadcast', icon: Share2 },
        { id: 'analytics', label: 'Insights', icon: BarChart3 },
        { id: 'settings', label: 'Protocol Ops', icon: Settings },
    ]

    return (
        <div className="flex h-screen bg-zenith-space text-white overflow-hidden selection:bg-zenith-indigo/30 relative">
            {/* Cinematic Background Nebula */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-zenith-indigo/15 blur-[160px] rounded-full pointer-events-none animate-pulse duration-[8000ms]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-zenith-violet/15 blur-[160px] rounded-full pointer-events-none animate-pulse duration-[10000ms]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-zenith-plum/5 blur-[200px] rounded-full pointer-events-none" />

            {/* Ambient Light Leaks */}
            <div className="fixed top-0 left-1/4 w-px h-screen bg-gradient-to-b from-transparent via-zenith-indigo/10 to-transparent pointer-events-none" />
            <div className="fixed top-0 right-1/4 w-px h-screen bg-gradient-to-b from-transparent via-zenith-violet/10 to-transparent pointer-events-none" />

            {/* 1. Floating Hub (Nav) */}
            <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 px-3 bg-black/40 backdrop-blur-[60px] border border-white/[0.08] rounded-full z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.02]">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-2">
                    <Image src="/silovra-logo.png" alt="S" width={20} height={20} className="brightness-125" />
                </div>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeTab === item.id
                                ? "text-white"
                                : "text-white/40 hover:text-white"
                        )}
                    >
                        {activeTab === item.id && (
                            <motion.div
                                layoutId="zenith-active-pill"
                                className="absolute inset-0 bg-white/[0.05] border border-white/10 rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative flex items-center gap-2">
                            <item.icon size={14} className={activeTab === item.id ? "text-zenith-indigo" : ""} />
                            <span className="hidden sm:inline">{item.label}</span>
                        </span>
                    </button>
                ))}
                <div className="w-px h-4 bg-white/10 mx-2" />
                {user && <NotificationBell userId={user.id} />}
                <button
                    onClick={handleSignOut}
                    className="p-2.5 text-white/40 hover:text-red-400 transition-colors"
                >
                    <LogOut size={16} />
                </button>
            </nav>

            {/* 2. Execution Matrix (Main Grid) */}
            <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
                <div className="w-full max-w-[1400px] px-10 pt-10 pb-32">
                    {/* Cinematic Header */}
                    <header className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-8">
                        <div className="space-y-2 text-center sm:text-left">
                            <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-4">
                                Silovra
                                <span className={cn(
                                    "text-[9px] px-3 py-1 rounded-full font-black tracking-[0.3em] border flex items-center gap-1.5",
                                    profile?.plan === 'pro'
                                        ? 'bg-zenith-indigo/10 border-zenith-indigo/20 text-zenith-indigo'
                                        : 'bg-white/[0.03] border-white/10 text-white/30'
                                )}>
                                    <Crown size={10} />
                                    {profile?.plan === 'pro' ? 'PRO' : 'FREE'}
                                </span>
                            </h1>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.5em]">Central Command & Visual Identity</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {profile?.username && (
                                <div className="hidden md:flex flex-col items-end gap-1">
                                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Global Link Matrix</span>
                                    <div className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer group">
                                        <span className="text-xs font-black tracking-tighter">silovra.link/{profile.username}</span>
                                        <ExternalLink size={12} className="text-zinc-800 group-hover:text-zenith-indigo transition-colors" />
                                    </div>
                                </div>
                            )}
                            <button className="flex items-center gap-3 px-8 py-3.5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-full h-fit shadow-2xl shadow-zenith-indigo/10 active:scale-95 transition-all">
                                <Share2 size={16} />
                                Broadcast
                            </button>
                        </div>
                    </header>

                    {/* Bento Content Grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                            className="w-full"
                        >
                            {/* Layout Wrapper for Tabs that need Preview */}
                            {['links', 'profile', 'appearance'].includes(activeTab) ? (
                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                                    <div className="xl:col-span-8 space-y-10">
                                        {activeTab === 'links' && (
                                            <LinkEditor links={links} onUpdate={setLinks} userId={user.id} plan={profile?.plan} />
                                        )}
                                        {activeTab === 'profile' && (
                                            <ProfileEditor profile={profile} onUpdate={setProfile} userId={user.id} hideDesign />
                                        )}
                                        {activeTab === 'appearance' && (
                                            <ProfileEditor profile={profile} onUpdate={setProfile} userId={user.id} hideIdentity />
                                        )}
                                    </div>
                                    <div className="xl:col-span-4 sticky top-10 hidden xl:block">
                                        <div className="bg-black/20 backdrop-blur-[60px] border border-white/[0.05] rounded-[3.5rem] p-10 overflow-hidden relative group shadow-2xl">
                                            <div className="absolute top-0 right-0 p-8 text-white/[0.02] group-hover:text-zenith-indigo/10 transition-colors pointer-events-none">
                                                <Eye size={160} strokeWidth={0.5} />
                                            </div>
                                            <div className="relative z-10">
                                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-zenith-indigo animate-pulse" />
                                                    Live Preview
                                                </h3>
                                                <LinkPreview profile={profile} links={links} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'analytics' && (
                                        <Insights links={links} profile={profile} />
                                    )}
                                    {activeTab === 'broadcast' && profile && (
                                        <div className="space-y-16">
                                            <SignalBroadcast profile={profile} />
                                            <UTMBuilder profileUrl={`https://silovra.link/${profile.username}`} />
                                        </div>
                                    )}
                                    {activeTab === 'settings' && profile && (
                                        <div className="space-y-16">
                                            <ProtocolSettings
                                                profile={profile}
                                                onUpdate={(updated) => setProfile(updated)}
                                            />
                                            {user && <SubscribersList userId={user.id} />}
                                            <UpgradePrompt plan={profile?.plan} />
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}
