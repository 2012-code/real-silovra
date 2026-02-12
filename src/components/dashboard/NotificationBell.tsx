'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Notification } from '@/types'
import { Bell, Check, Trophy, Eye, MousePointer2, Star, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NotificationBellProps {
    userId: string
}

const NOTIFICATION_ICONS: Record<string, typeof Trophy> = {
    milestone: Trophy,
    views: Eye,
    clicks: MousePointer2,
    achievement: Star,
    default: Zap,
}

export default function NotificationBell({ userId }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20)
            setNotifications(data || [])
        }
        fetchNotifications()
    }, [userId, supabase])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const unreadCount = notifications.filter(n => !n.is_read).length

    const markAsRead = async (id: string) => {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id)
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
    }

    const markAllAsRead = async () => {
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
        setNotifications(notifications.map(n => ({ ...n, is_read: true })))
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-3 text-white/40 hover:text-white transition-colors"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-zenith-indigo rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-lg"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-black/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Notifications</span>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[9px] font-bold text-zenith-indigo hover:text-zenith-indigo/80 transition-colors"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="text-center py-10">
                                    <Bell size={20} className="text-white/10 mx-auto mb-3" />
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No notifications yet</p>
                                </div>
                            ) : notifications.map(notif => {
                                const Icon = NOTIFICATION_ICONS[notif.type] || NOTIFICATION_ICONS.default
                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => !notif.is_read && markAsRead(notif.id)}
                                        className={cn(
                                            "px-5 py-4 border-b border-white/[0.03] last:border-0 cursor-pointer transition-colors",
                                            notif.is_read ? "opacity-50" : "hover:bg-white/[0.03]"
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                "mt-0.5 p-2 rounded-lg",
                                                notif.is_read ? "bg-white/[0.03]" : "bg-zenith-indigo/10"
                                            )}>
                                                <Icon size={12} className={notif.is_read ? "text-white/20" : "text-zenith-indigo"} />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-xs font-bold text-white/80">{notif.title}</p>
                                                <p className="text-[10px] text-white/40">{notif.message}</p>
                                                <p className="text-[8px] text-white/20">
                                                    {new Date(notif.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            {!notif.is_read && (
                                                <div className="w-2 h-2 rounded-full bg-zenith-indigo mt-2" />
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
