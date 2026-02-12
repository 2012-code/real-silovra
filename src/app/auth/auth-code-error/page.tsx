'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl text-center space-y-6"
            >
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                        <AlertCircle className="text-rose-500" size={32} />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-white">Authentication Error</h1>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        The authentication link was invalid or has expired. Please try signing in again.
                    </p>
                </div>

                <div className="pt-4">
                    <Link
                        href="/auth/login"
                        className="block w-full py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
                    >
                        Return to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
