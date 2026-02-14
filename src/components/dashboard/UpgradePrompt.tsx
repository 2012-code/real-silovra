'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Crown, ArrowRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { isPro } from '@/lib/plans'

interface UpgradePromptProps {
    plan?: string
}

export default function UpgradePrompt({ plan }: UpgradePromptProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const userIsPro = isPro(plan)

    const handleUpgrade = () => {
        router.push('/pricing')
    }



    if (userIsPro) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-zenith-indigo/[0.06] to-transparent border border-zenith-indigo/10 rounded-[2rem] p-8 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zenith-indigo/10 rounded-xl">
                        <Crown size={18} className="text-zenith-indigo" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white">Pro Plan Active</p>
                        <p className="text-[10px] text-white/40 font-bold">All features unlocked</p>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-zenith-indigo/[0.06] to-transparent border border-zenith-indigo/10 rounded-[2rem] p-8 space-y-6"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/[0.03] rounded-xl">
                        <Crown size={18} className="text-white/30" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white">Free Plan</p>
                        <p className="text-[10px] text-white/40 font-bold">5 links · Basic features</p>
                    </div>
                </div>
                <button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="px-6 py-3 bg-zenith-indigo text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-zenith-indigo/80 transition-all flex items-center gap-2 shadow-lg shadow-zenith-indigo/20 disabled:opacity-50"
                >
                    {loading ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
                    Upgrade to Pro — $9/mo
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Unlimited links', 'Advanced analytics', 'Product cards', 'Email collection'].map((feat, i) => (
                    <div key={i} className="text-center py-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                        <p className="text-[9px] font-bold text-white/30">{feat}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
