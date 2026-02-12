'use client'
import { motion } from 'framer-motion'

interface EmbedBlockProps {
    url: string
    index?: number
}

function getEmbedUrl(url: string): { type: string; embedUrl: string } | null {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (ytMatch) return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}` }

    // Spotify
    const spotifyMatch = url.match(/spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/)
    if (spotifyMatch) return { type: 'spotify', embedUrl: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}?theme=0` }

    // TikTok
    const tiktokMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)
    if (tiktokMatch) return { type: 'tiktok', embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}` }

    // SoundCloud
    if (url.includes('soundcloud.com')) {
        return { type: 'soundcloud', embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%236366f1&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true` }
    }

    return null
}

export default function EmbedBlock({ url, index = 0 }: EmbedBlockProps) {
    const embed = getEmbedUrl(url)
    if (!embed) return null

    const heights: Record<string, string> = {
        youtube: '315',
        spotify: '152',
        tiktok: '540',
        soundcloud: '166',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.6 }}
            className="w-full rounded-[2rem] overflow-hidden bg-black/20 backdrop-blur-xl border border-white/[0.08]"
        >
            <iframe
                src={embed.embedUrl}
                width="100%"
                height={heights[embed.type] || '300'}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="w-full"
                style={{ borderRadius: '2rem' }}
            />
        </motion.div>
    )
}
