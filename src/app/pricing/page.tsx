'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Zap, Crown, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLANS } from '@/lib/plans'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

export default function PricingPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handlePayPalApprove = async (data: any, actions: any) => {
        setLoading(true)
        try {
            const order = await actions.order.capture()
            // Call our API to upgrade the user
            const res = await fetch('/api/paypal/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID: order.id })
            })

            if (res.ok) {
                router.push('/dashboard?upgraded=true')
            }
        } catch (err) {
            console.error('PayPal error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test" }}>
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 py-24">
                <div className="max-w-4xl w-full space-y-16">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4"
                    >
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <Sparkles size={20} className="text-zenith-indigo" />
                            <span className="text-[10px] font-black text-zenith-indigo uppercase tracking-[0.5em]">Pricing</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                            Choose Your Plan
                        </h1>
                        <p className="text-sm text-white/40 max-w-md mx-auto">
                            Start free, upgrade when you need more power. Simple pricing, no hidden fees.
                        </p>
                    </motion.div>

                    {/* Plan Cards */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Free Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-[2.5rem] p-10 space-y-8 hover:border-white/10 transition-all duration-500"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/[0.05] rounded-xl">
                                        <Zap size={16} className="text-white/40" />
                                    </div>
                                    <h3 className="text-xs font-black text-white/60 uppercase tracking-widest">Free</h3>
                                </div>
                                <div className="flex items-baseline gap-1 pt-4">
                                    <span className="text-5xl font-black text-white">$0</span>
                                    <span className="text-xs text-white/30 font-bold">/month</span>
                                </div>
                                <p className="text-[10px] text-white/30 font-bold">Perfect to get started</p>
                            </div>

                            <div className="space-y-3">
                                {PLANS.free.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Check size={14} className="text-white/20" />
                                        <span className="text-xs text-white/50">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black text-white/50 uppercase tracking-widest hover:bg-white/[0.06] transition-all"
                            >
                                Get Started Free
                            </button>
                        </motion.div>

                        {/* Pro Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative bg-gradient-to-br from-zenith-indigo/[0.08] to-transparent backdrop-blur-xl border border-zenith-indigo/20 rounded-[2.5rem] p-10 space-y-8 hover:border-zenith-indigo/30 transition-all duration-500 shadow-xl shadow-zenith-indigo/5"
                        >
                            {/* Popular Badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <span className="px-5 py-2 bg-zenith-indigo text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-zenith-indigo/30">
                                    Most Popular
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zenith-indigo/10 rounded-xl">
                                        <Crown size={16} className="text-zenith-indigo" />
                                    </div>
                                    <h3 className="text-xs font-black text-zenith-indigo uppercase tracking-widest">Pro</h3>
                                </div>
                                <div className="flex items-baseline gap-1 pt-4">
                                    <span className="text-5xl font-black text-white">$9</span>
                                    <span className="text-xs text-white/30 font-bold">/month</span>
                                </div>
                                <p className="text-[10px] text-white/30 font-bold">Everything unlimited</p>
                            </div>

                            <div className="space-y-3">
                                {PLANS.pro.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Check size={14} className="text-zenith-indigo" />
                                        <span className="text-xs text-white/70">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* PayPal Button */}
                            <div className="z-10 relative">
                                <PayPalButtons
                                    style={{ layout: "horizontal", label: "subscribe", height: 45, tagline: false }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            intent: "CAPTURE",
                                            purchase_units: [{
                                                description: "Silovra Pro Subscription",
                                                amount: { currency_code: "USD", value: "9.00" }
                                            }]
                                        })
                                    }}
                                    onApprove={handlePayPalApprove}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center text-[10px] text-white/20 font-bold"
                    >
                        Cancel anytime · Secure payments via PayPal · No long-term contracts
                    </motion.p>
                </div>
            </div>
        </PayPalScriptProvider>
    )
}
