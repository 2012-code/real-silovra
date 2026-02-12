'use client'
import { useState, useEffect } from 'react'
import { Link as LinkType, Profile, LinkClickEvent } from '@/types'
import { BarChart3, MousePointer2, Eye, TrendingUp, Link as LinkIcon, Monitor, Smartphone, Globe, ArrowRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

interface InsightsProps {
    links: LinkType[]
    profile: Profile | null
}

type TimeRange = '7d' | '30d'

export default function Insights({ links, profile }: InsightsProps) {
    const [clickEvents, setClickEvents] = useState<LinkClickEvent[]>([])
    const [timeRange, setTimeRange] = useState<TimeRange>('7d')
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const totalClicks = links.reduce((acc, link) => acc + (link.click_count || 0), 0)
    const totalViews = profile?.total_views || 0
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0'
    const totalLinks = links.length
    const activeLinks = links.filter(l => l.is_visible).length

    useEffect(() => {
        const fetchClickEvents = async () => {
            if (!profile?.id) return
            setLoading(true)
            const daysAgo = timeRange === '7d' ? 7 : 30
            const since = new Date()
            since.setDate(since.getDate() - daysAgo)

            const { data } = await supabase
                .from('link_clicks')
                .select('*')
                .eq('user_id', profile.id)
                .gte('clicked_at', since.toISOString())
                .order('clicked_at', { ascending: true })

            setClickEvents(data || [])
            setLoading(false)
        }
        fetchClickEvents()
    }, [profile?.id, timeRange, supabase])

    const sortedLinks = [...links].sort((a, b) => (b.click_count || 0) - (a.click_count || 0)).slice(0, 5)

    // Time-series data
    const daysCount = timeRange === '7d' ? 7 : 30
    const dailyClicks: { label: string; count: number }[] = []
    for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        const label = d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
        const count = clickEvents.filter(e => e.clicked_at.startsWith(dateStr)).length
        dailyClicks.push({ label, count })
    }
    const maxDailyClicks = Math.max(...dailyClicks.map(d => d.count), 1)

    // Referrer breakdown
    const referrerMap: Record<string, number> = {}
    clickEvents.forEach(e => {
        let source = 'Direct'
        if (e.referrer) {
            try {
                const url = new URL(e.referrer)
                source = url.hostname.replace('www.', '')
            } catch { source = 'Other' }
        }
        referrerMap[source] = (referrerMap[source] || 0) + 1
    })
    const referrerData = Object.entries(referrerMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
    const maxReferrer = Math.max(...referrerData.map(([, v]) => v), 1)

    // Device breakdown
    const deviceMap: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 }
    clickEvents.forEach(e => {
        const dev = e.device_type || 'desktop'
        deviceMap[dev] = (deviceMap[dev] || 0) + 1
    })
    const totalDeviceClicks = Object.values(deviceMap).reduce((a, b) => a + b, 0) || 1

    // Browser breakdown
    const browserMap: Record<string, number> = {}
    clickEvents.forEach(e => {
        const b = e.browser || 'Unknown'
        browserMap[b] = (browserMap[b] || 0) + 1
    })
    const browserData = Object.entries(browserMap).sort(([, a], [, b]) => b - a).slice(0, 5)
    const maxBrowser = Math.max(...browserData.map(([, v]) => v), 1)

    const stats = [
        { title: "Total Profile Views", value: totalViews.toLocaleString(), icon: Eye, subtitle: `${activeLinks} active links` },
        { title: "Total Link Clicks", value: totalClicks.toLocaleString(), icon: MousePointer2, subtitle: `across ${totalLinks} links` },
        { title: "Click-Through Rate", value: `${ctr}%`, icon: TrendingUp, subtitle: "clicks / views" }
    ]

    const DEVICE_ICONS: Record<string, typeof Monitor> = { desktop: Monitor, mobile: Smartphone, tablet: Smartphone }
    const DEVICE_COLORS: Record<string, string> = { desktop: '#818cf8', mobile: '#a855f7', tablet: '#f59e0b' }

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* 1. Stat Bricks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                        className="bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] p-12 border border-white/[0.08] shadow-2xl group hover:border-zenith-indigo/30 transition-all duration-700 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 text-zenith-indigo/5 group-hover:text-zenith-indigo/10 transition-colors">
                            <stat.icon size={80} strokeWidth={0.5} />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo">
                                    <stat.icon size={16} strokeWidth={2} />
                                </div>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">{stat.title}</span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-5xl font-black text-white tracking-tighter">{stat.value}</span>
                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{stat.subtitle}</p>
                                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, Number(stat.value.replace(/[^0-9.]/g, '')) > 0 ? 70 : 5)}%` }}
                                        transition={{ delay: 0.5 + (idx * 0.2), duration: 2, ease: "circOut" }}
                                        className="h-full bg-zenith-indigo zenith-glow shadow-[0_0_10px_rgba(99,102,241,1)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 2. Time-Series Chart */}
            <div className="bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] shadow-2xl relative overflow-hidden">
                <div className="px-12 py-10 border-b border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo">
                            <Calendar size={16} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Click Timeline</h3>
                            <p className="text-lg font-black text-white tracking-tight">Clicks Over Time</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {(['7d', '30d'] as TimeRange[]).map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={cn(
                                    "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                    timeRange === range
                                        ? "bg-white text-black"
                                        : "bg-white/[0.03] text-white/40 hover:text-white border border-white/10"
                                )}
                            >
                                {range === '7d' ? '7 Days' : '30 Days'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-12">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-zenith-indigo" />
                        </div>
                    ) : (
                        <div className="flex items-end gap-1.5 h-48">
                            {dailyClicks.map((day, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group/bar">
                                    <span className="text-[9px] font-black text-white/0 group-hover/bar:text-white/60 transition-colors tabular-nums">
                                        {day.count}
                                    </span>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(day.count / maxDailyClicks) * 100}%` }}
                                        transition={{ delay: idx * 0.03, duration: 0.8, ease: "circOut" }}
                                        className="w-full min-h-[4px] bg-zenith-indigo/60 hover:bg-zenith-indigo rounded-t-lg transition-colors cursor-pointer"
                                        title={`${day.label}: ${day.count} clicks`}
                                    />
                                    {(daysCount <= 7 || idx % Math.ceil(daysCount / 7) === 0) && (
                                        <span className="text-[7px] font-bold text-white/20 whitespace-nowrap">
                                            {day.label}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Breakdown Grid: Referrers + Devices + Browsers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Referrer Sources */}
                <div className="bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] p-10 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo">
                            <Globe size={16} />
                        </div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Traffic Sources</span>
                    </div>
                    <div className="space-y-5">
                        {referrerData.length === 0 ? (
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] text-center py-8">No data yet</p>
                        ) : referrerData.map(([source, count]) => (
                            <div key={source} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white/70 truncate">{source}</span>
                                    <span className="text-xs font-black text-white/50 tabular-nums">{count}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(count / maxReferrer) * 100}%` }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                        className="h-full bg-zenith-indigo/70 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Device Types */}
                <div className="bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] p-10 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo">
                            <Monitor size={16} />
                        </div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Devices</span>
                    </div>
                    <div className="space-y-6">
                        {Object.entries(deviceMap).map(([device, count]) => {
                            const DeviceIcon = DEVICE_ICONS[device] || Monitor
                            const pct = ((count / totalDeviceClicks) * 100).toFixed(0)
                            return (
                                <div key={device} className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${DEVICE_COLORS[device]}15` }}>
                                        <DeviceIcon size={18} style={{ color: DEVICE_COLORS[device] }} />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-white/70 capitalize">{device}</span>
                                            <span className="text-xs font-black text-white/50">{pct}%</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 1, ease: "circOut" }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: DEVICE_COLORS[device] }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Browsers */}
                <div className="bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] p-10 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo">
                            <Globe size={16} />
                        </div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Browsers</span>
                    </div>
                    <div className="space-y-5">
                        {browserData.length === 0 ? (
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] text-center py-8">No data yet</p>
                        ) : browserData.map(([browser, count]) => (
                            <div key={browser} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white/70">{browser}</span>
                                    <span className="text-xs font-black text-white/50 tabular-nums">{count}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(count / maxBrowser) * 100}%` }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                        className="h-full bg-zenith-violet/70 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Top Performing Links */}
            <div className="bg-black/40 backdrop-blur-[60px] rounded-[3.5rem] border border-white/[0.08] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-zenith-indigo/[0.01] opacity-0 group-hover:opacity-100 transition-opacity blur-[60px]" />
                <div className="px-12 py-12 border-b border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-black text-zenith-indigo uppercase tracking-[0.5em]">Analytics Manifest</h3>
                        <p className="text-xl font-black text-white tracking-tight uppercase tracking-widest">Top Performing Links</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 px-6 py-3 rounded-full">
                        <BarChart3 size={14} className="text-white/40" />
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{sortedLinks.length} of {totalLinks} links</span>
                    </div>
                </div>

                <div className="divide-y divide-white/[0.03] relative z-10">
                    {sortedLinks.map((link, idx) => {
                        const linkClicks = link.click_count || 0
                        const linkCtr = totalViews > 0 ? ((linkClicks / totalViews) * 100).toFixed(1) : '0.0'
                        const shareOfClicks = totalClicks > 0 ? ((linkClicks / totalClicks) * 100).toFixed(0) : '0'

                        return (
                            <div key={link.id} className="px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-8 group/item hover:bg-white/[0.02] transition-all duration-500">
                                <div className="flex items-center gap-8">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/20 font-black text-xs group-hover/item:bg-white group-hover/item:text-black transition-all">
                                        {idx + 1}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-black text-white uppercase tracking-wider">{link.title}</p>
                                        <div className="flex items-center gap-3">
                                            <LinkIcon size={12} className="text-white/20" />
                                            <p className="text-[10px] font-bold text-white/40 tracking-tight truncate max-w-[200px] border-b border-white/10 pb-1">{link.url}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="text-center sm:text-right">
                                        <p className="text-2xl font-black text-white tracking-tighter">{linkClicks}</p>
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Clicks</p>
                                    </div>
                                    <div className="w-px h-10 bg-white/5" />
                                    <div className="text-center sm:text-right">
                                        <p className="text-2xl font-black text-zenith-indigo tracking-tighter">{linkCtr}%</p>
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">CTR</p>
                                    </div>
                                    <div className="w-px h-10 bg-white/5" />
                                    <div className="text-center sm:text-right">
                                        <p className="text-2xl font-black text-white/60 tracking-tighter">{shareOfClicks}%</p>
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Share</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {links.length === 0 && (
                        <div className="text-center py-32 bg-white/[0.01]">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em]">No link data yet — add links and start sharing!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
