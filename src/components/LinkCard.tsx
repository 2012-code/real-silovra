'use client'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LinkCardProps {
    id: string
    title: string
    url: string
    icon?: string
    theme?: any // TODO: Define Theme Type
    index: number
}

const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    }),
    hover: {
        scale: 1.02,
        y: -2,
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
}

export default function LinkCard({ id, title, url, icon, index }: LinkCardProps) {
    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={variants}
            className={cn(
                'w-full max-w-md p-4 mb-3 flex items-center justify-between',
                'bg-white/80 backdrop-blur-md rounded-xl border border-white/20 shadow-sm',
                'hover:bg-white/95 transition-colors duration-200',
                'group cursor-pointer'
            )}
        >
            <div className="flex items-center gap-3">
                {/* Placeholder for Icon Component based on 'icon' string */}
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden">
                    {icon ? <img src={icon} alt="" className="w-full h-full object-cover" /> : <ExternalLink size={20} />}
                </div>
                <span className="font-medium text-gray-800 group-hover:text-black">
                    {title}
                </span>
            </div>

            {/* Optional: Arrow or indicator */}
        </motion.a>
    )
}
