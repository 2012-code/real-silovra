'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Lock, User, Loader2, Sparkles } from 'lucide-react'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import { getBaseUrl } from '@/lib/auth-utils'

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const baseUrl = getBaseUrl()
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${baseUrl}/auth/callback`,
                data: {
                    username: username,
                }
            }
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        if (authData.user) {
            if (authData.session) {
                router.push('/dashboard')
                router.refresh()
            } else {
                setError("Please check your email to confirm your account.")
                setLoading(false)
                return
            }
        }
        setLoading(false)
    }

    const isSuccess = error?.includes('check your email')

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Gradient Background — shifted hue from login for variety */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#1e1035] to-[#0d1b2a]" />

            {/* Animated Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    x: [0, -30, 0],
                    y: [0, 25, 0],
                }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[5%] right-[15%] w-[420px] h-[420px] rounded-full bg-violet-600/20 blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1.15, 1, 1.15],
                    x: [0, 35, 0],
                    y: [0, -25, 0],
                }}
                transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[15%] left-[10%] w-[350px] h-[350px] rounded-full bg-indigo-500/15 blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.25, 1],
                    x: [0, 15, 0],
                }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[50%] left-[40%] w-[180px] h-[180px] rounded-full bg-fuchsia-500/10 blur-[80px]"
            />

            {/* Subtle Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                }}
            />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-10 w-full max-w-[440px] mx-4"
            >
                {/* Glow behind card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-fuchsia-500/20 rounded-[2.5rem] blur-xl opacity-60" />

                <div className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
                    {/* Logo / Brand */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-6 shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                        >
                            <Sparkles size={28} className="text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
                            Create your account
                        </h1>
                        <p className="text-sm text-white/40 font-medium">
                            Join Silovra and build your link identity
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pl-1">Email</label>
                            <div className="relative group">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white text-sm font-medium placeholder:text-white/15 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pl-1">Username</label>
                            <div className="relative group">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white text-sm font-medium placeholder:text-white/15 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                                    placeholder="your-unique-handle"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                {username && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/20 tracking-wide">
                                        silovra.online/{username}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pl-1">Password</label>
                            <div className="relative group">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white text-sm font-medium placeholder:text-white/15 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Error / Success */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-sm text-center py-3 px-4 rounded-2xl border ${isSuccess
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-bold uppercase tracking-[0.15em] rounded-2xl shadow-[0_10px_40px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_50px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </motion.button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-xs font-bold text-white/20 uppercase tracking-widest">Or continue with</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        <GoogleSignInButton />
                    </form>

                    {/* Footer Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-white/30">
                            Already have an account?{' '}
                            <Link
                                href="/auth/login"
                                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Bottom Branding */}
            <div className="absolute bottom-6 text-center">
                <p className="text-[10px] text-white/15 font-bold uppercase tracking-[0.4em]">Silovra</p>
            </div>
        </div>
    )
}
