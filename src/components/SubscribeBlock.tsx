'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Mail, Check, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SubscribeBlockProps {
    userId: string
}

export default function SubscribeBlock({ userId }: SubscribeBlockProps) {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const supabase = createClient()

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return

        setStatus('loading')
        const { error } = await supabase
            .from('subscribers')
            .insert({ user_id: userId, email: email.trim() })

        if (error) {
            if (error.code === '23505') {
                setMessage('Already subscribed!')
                setStatus('success')
            } else {
                setMessage('Something went wrong.')
                setStatus('error')
            }
        } else {
            setMessage('Subscribed!')
            setStatus('success')
            setEmail('')
        }

        setTimeout(() => {
            setStatus('idle')
            setMessage('')
        }, 3000)
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-6 space-y-4"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zenith-indigo/10 rounded-xl">
                        <Mail size={14} className="text-zenith-indigo" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-white uppercase tracking-wider">Stay Updated</p>
                        <p className="text-[9px] text-white/40 font-bold">Get updates directly to your inbox</p>
                    </div>
                </div>

                <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/20"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zenith-indigo hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {status === 'loading' ? <Loader2 size={12} className="animate-spin" /> :
                            status === 'success' ? <Check size={12} /> :
                                <Mail size={12} />}
                        {status === 'success' ? 'Done' : 'Join'}
                    </button>
                </form>

                <AnimatePresence>
                    {message && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`text-[10px] font-bold text-center ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
