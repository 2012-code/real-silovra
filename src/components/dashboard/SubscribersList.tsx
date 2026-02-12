'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Subscriber } from '@/types'
import { Users, Download, Trash2, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

interface SubscribersListProps {
    userId: string
}

export default function SubscribersList({ userId }: SubscribersListProps) {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchSubscribers = async () => {
            const { data } = await supabase
                .from('subscribers')
                .select('*')
                .eq('user_id', userId)
                .order('subscribed_at', { ascending: false })
            setSubscribers(data || [])
            setLoading(false)
        }
        fetchSubscribers()
    }, [userId, supabase])

    const deleteSubscriber = async (id: string) => {
        await supabase.from('subscribers').delete().eq('id', id)
        setSubscribers(subscribers.filter(s => s.id !== id))
    }

    const exportCSV = () => {
        const csv = 'Email,Subscribed At\n' + subscribers.map(s =>
            `${s.email},${new Date(s.subscribed_at).toLocaleDateString()}`
        ).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'subscribers.csv'
        a.click()
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zenith-indigo/10 rounded-2xl text-zenith-indigo">
                        <Users size={16} />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Email Subscribers</h3>
                        <p className="text-sm font-black text-white">{subscribers.length} total</p>
                    </div>
                </div>
                {subscribers.length > 0 && (
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-5 py-3 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-black text-white/60 uppercase tracking-widest hover:bg-white/[0.06] transition-all"
                    >
                        <Download size={12} />
                        Export CSV
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-zenith-indigo" />
                </div>
            ) : subscribers.length === 0 ? (
                <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/[0.05] rounded-[2rem]">
                    <Mail size={24} className="text-white/10 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No subscribers yet</p>
                    <p className="text-[9px] text-white/10 mt-2">Enable email collection in your profile settings</p>
                </div>
            ) : (
                <div className="bg-black/40 backdrop-blur-[60px] rounded-[2.5rem] border border-white/[0.08] overflow-hidden">
                    {subscribers.map((sub, idx) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className="flex items-center justify-between px-8 py-5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-zenith-indigo/10 flex items-center justify-center">
                                    <span className="text-[10px] font-black text-zenith-indigo">
                                        {sub.email[0].toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white/70">{sub.email}</p>
                                    <p className="text-[9px] text-white/20">
                                        {new Date(sub.subscribed_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteSubscriber(sub.id)}
                                className="p-2 text-white/10 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
