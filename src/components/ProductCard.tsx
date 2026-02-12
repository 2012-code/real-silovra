'use client'
import { motion } from 'framer-motion'
import { ShoppingBag, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
    id: string
    title: string
    url: string
    thumbnail_url?: string
    price?: string
    cta_text?: string
    buttonStyle?: string
    textColor?: string
    index?: number
    trackClicks?: boolean
}

export default function ProductCard({
    id, title, url, thumbnail_url, price, cta_text = 'Shop Now',
    buttonStyle = 'glass', textColor, index = 0, trackClicks = false
}: ProductCardProps) {
    const href = trackClicks ? `/api/click/${id}` : url

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.6 }}
        >
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-[2rem] overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-zenith-indigo/5"
            >
                {/* Product Image */}
                {thumbnail_url && (
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                        <img
                            src={thumbnail_url}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {price && (
                            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full">
                                <span className="text-sm font-black text-white">{price}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">{title}</h3>
                            {!thumbnail_url && price && (
                                <p className="text-lg font-black text-zenith-indigo mt-1">{price}</p>
                            )}
                        </div>
                        <ShoppingBag size={16} className="text-white/20 group-hover:text-zenith-indigo transition-colors" />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                        <span className="text-[10px] font-black text-zenith-indigo uppercase tracking-widest flex items-center gap-2">
                            {cta_text}
                            <ExternalLink size={10} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        {thumbnail_url && price && (
                            <span className="text-sm font-black text-white/60">{price}</span>
                        )}
                    </div>
                </div>
            </a>
        </motion.div>
    )
}
