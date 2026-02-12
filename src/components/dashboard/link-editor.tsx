'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Link as LinkType, LinkGroup } from '@/types'
import { Reorder, useDragControls, motion, AnimatePresence } from 'framer-motion'
import { GripVertical, Trash2, Plus, ExternalLink, Eye, EyeOff, BarChart3, Palette, Pin, PinOff, Calendar, Tag, Image, Loader2, FolderOpen, ShoppingBag, Play, Link as LinkIcon, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LinkEditorProps {
    links: LinkType[]
    onUpdate: (links: LinkType[]) => void
    userId: string
}

const CATEGORIES = ['Music', 'Social', 'Shop', 'Content', 'Business', 'Personal', 'Other']
const LINK_TYPES = [
    { id: 'link', label: 'Link', icon: LinkIcon },
    { id: 'product', label: 'Product', icon: ShoppingBag },
    { id: 'embed', label: 'Embed', icon: Play },
] as const

export default function LinkEditor({ links, onUpdate, userId }: LinkEditorProps) {
    const [loading, setLoading] = useState(false)
    const [groups, setGroups] = useState<LinkGroup[]>([])
    const [newGroupName, setNewGroupName] = useState('')
    const [showGroupManager, setShowGroupManager] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const fetchGroups = async () => {
            const { data } = await supabase
                .from('link_groups')
                .select('*')
                .eq('user_id', userId)
                .order('position', { ascending: true })
            setGroups(data || [])
        }
        fetchGroups()
    }, [userId, supabase])

    const addLink = async () => {
        setLoading(true)
        const newLink = {
            user_id: userId,
            title: 'NEW ASSET',
            url: 'https://',
            position: links.length,
            is_visible: true,
            is_pinned: false,
            link_type: 'link',
        }

        const { data, error } = await supabase
            .from('links')
            .insert(newLink)
            .select()
            .single()

        if (error) {
            console.error('Full error adding link:', error)
            alert(`Failed to add link: ${error.message}.`)
        } else if (data) {
            onUpdate([...links, data])
        }
        setLoading(false)
    }

    const updateLink = async (id: string, updates: Partial<LinkType>) => {
        const updatedLinks = links.map(l => l.id === id ? { ...l, ...updates } : l)
        onUpdate(updatedLinks)

        const { error } = await supabase
            .from('links')
            .update(updates)
            .eq('id', id)

        if (error) console.error('Error updating link:', error)
    }

    const deleteLink = async (id: string) => {
        if (!confirm('ABORT ASSET? This cannot be undone.')) return
        onUpdate(links.filter(l => l.id !== id))
        await supabase.from('links').delete().eq('id', id)
    }

    const handleReorder = async (newOrder: LinkType[]) => {
        onUpdate(newOrder)
        const updates = newOrder.map((link, index) => ({
            id: link.id,
            position: index,
            user_id: userId
        }))
        await supabase.from('links').upsert(updates, { onConflict: 'id' })
    }

    const addGroup = async () => {
        if (!newGroupName.trim()) return
        const { data, error } = await supabase
            .from('link_groups')
            .insert({ user_id: userId, name: newGroupName.trim(), position: groups.length })
            .select()
            .single()
        if (data) {
            setGroups([...groups, data])
            setNewGroupName('')
        }
    }

    const deleteGroup = async (groupId: string) => {
        await supabase.from('link_groups').delete().eq('id', groupId)
        setGroups(groups.filter(g => g.id !== groupId))
        // Unassign links from this group
        const updatedLinks = links.map(l => l.group_id === groupId ? { ...l, group_id: null } : l)
        onUpdate(updatedLinks)
        await supabase.from('links').update({ group_id: null }).eq('group_id', groupId)
    }

    return (
        <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Asset Management Shell</h3>
                    <p className="text-[11px] text-white/60 font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-zenith-indigo animate-pulse"></span>
                        {links.length} Connected Nodes
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowGroupManager(!showGroupManager)}
                        className="flex items-center gap-3 px-6 py-4 bg-white/[0.03] border border-white/10 text-white/60 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/[0.06] transition-all"
                    >
                        <FolderOpen size={14} />
                        Groups
                    </button>
                    <button
                        onClick={addLink}
                        disabled={loading}
                        className="group flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-zenith-indigo hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50"
                    >
                        <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                        Deploy New Node
                    </button>
                </div>
            </div>

            {/* Group Manager */}
            <AnimatePresence>
                {showGroupManager && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-black/40 backdrop-blur-[60px] rounded-[2.5rem] border border-white/[0.08] p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <FolderOpen size={16} className="text-zenith-indigo" />
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Link Groups</span>
                            </div>
                            <div className="flex gap-3">
                                <input
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addGroup()}
                                    placeholder="Group name..."
                                    className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3 text-white text-xs font-bold focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/10"
                                />
                                <button
                                    onClick={addGroup}
                                    className="px-6 py-3 bg-zenith-indigo/20 text-zenith-indigo rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zenith-indigo/30 transition-all"
                                >
                                    Add
                                </button>
                            </div>
                            {groups.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {groups.map(group => (
                                        <div key={group.id} className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-4 py-2">
                                            <span className="text-[10px] font-bold text-white/60">{group.name}</span>
                                            <button onClick={() => deleteGroup(group.id)} className="text-white/20 hover:text-red-400 transition-colors">
                                                <Trash2 size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Reorder.Group axis="y" values={links} onReorder={handleReorder} className="space-y-8">
                <AnimatePresence initial={false}>
                    {links.map((link, idx) => (
                        <LinkItem
                            key={link.id}
                            link={link}
                            index={idx}
                            onUpdate={updateLink}
                            onDelete={deleteLink}
                            userId={userId}
                            groups={groups}
                        />
                    ))}
                </AnimatePresence>
            </Reorder.Group>

            {links.length === 0 && (
                <div className="text-center py-32 bg-white/[0.01] border border-dashed border-white/[0.05] rounded-[3rem]">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em]">Registry Void: No active nodes detected</p>
                </div>
            )}
        </div>
    )
}

function LinkItem({ link, index, onUpdate, onDelete, userId, groups }: { link: LinkType, index: number, onUpdate: Function, onDelete: Function, userId: string, groups: LinkGroup[] }) {
    const controls = useDragControls()
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        const ext = file.name.split('.').pop()
        const path = `${userId}/${link.id}.${ext}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(path, file, { upsert: true })

        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(path)
            onUpdate(link.id, { thumbnail_url: publicUrl })
        }
        setUploading(false)
    }

    const linkType = link.link_type || 'link'

    return (
        <Reorder.Item
            value={link}
            dragListener={false}
            dragControls={controls}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "group relative backdrop-blur-[60px] rounded-[3.5rem] border shadow-2xl transition-all duration-700 overflow-hidden",
                link.is_pinned
                    ? "bg-yellow-500/[0.04] border-yellow-500/20 hover:border-yellow-500/40"
                    : index % 2 === 0
                        ? "bg-zenith-indigo/[0.03] border-zenith-indigo/10 hover:border-zenith-indigo/30"
                        : "bg-zenith-violet/[0.03] border-zenith-violet/10 hover:border-zenith-violet/30"
            )}
        >
            {/* Pin indicator */}
            {link.is_pinned && (
                <div className="absolute top-4 right-4 z-20">
                    <Pin size={12} className="text-yellow-400 fill-yellow-400" />
                </div>
            )}

            {/* Dynamic Color Sweep */}
            <div className={cn(
                "absolute top-0 left-0 w-1.5 h-full transition-all duration-700",
                link.is_pinned
                    ? "bg-yellow-500/40 group-hover:bg-yellow-500"
                    : index % 2 === 0 ? "bg-zenith-indigo/40 group-hover:bg-zenith-indigo" : "bg-zenith-violet/40 group-hover:bg-zenith-violet"
            )} />

            <div className="flex flex-col md:flex-row items-stretch min-h-[140px] relative z-10">
                {/* Drag Handle */}
                <div
                    className="px-10 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-white/[0.02] transition-colors"
                    onPointerDown={(e) => controls.start(e)}
                >
                    <div className="grid grid-cols-2 gap-2 opacity-10 group-hover:opacity-40 transition-opacity">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                index % 2 === 0 ? "bg-zenith-indigo" : "bg-zenith-violet"
                            )} />
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-10 pl-6 space-y-6">
                    {/* Link Type Selector */}
                    <div className="flex items-center gap-2">
                        {LINK_TYPES.map(type => (
                            <button
                                key={type.id}
                                onClick={() => onUpdate(link.id, { link_type: type.id })}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                                    linkType === type.id
                                        ? "bg-zenith-indigo/20 text-zenith-indigo border border-zenith-indigo/30"
                                        : "text-white/20 hover:text-white/50 border border-transparent hover:border-white/10"
                                )}
                            >
                                <type.icon size={10} />
                                {type.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Node Label</label>
                            <input
                                type="text"
                                value={link.title || ''}
                                onChange={(e) => onUpdate(link.id, { title: e.target.value })}
                                placeholder="ASSET_IDENTIFIER"
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-white text-[12px] font-black uppercase tracking-[0.1em] focus:border-zenith-indigo/40 focus:bg-white/[0.04] outline-none transition-all placeholder:text-white/10"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Destination URL</label>
                            <input
                                type="text"
                                value={link.url || ''}
                                onChange={(e) => onUpdate(link.id, { url: e.target.value })}
                                placeholder="ZENITH_REMOTE_HUB"
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-white/40 text-[10px] font-bold tracking-tight focus:border-zenith-indigo/40 focus:bg-white/[0.04] focus:text-white/80 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Product Fields */}
                    {linkType === 'product' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <DollarSign size={10} /> Price
                                </label>
                                <input
                                    type="text"
                                    value={link.price || ''}
                                    onChange={(e) => onUpdate(link.id, { price: e.target.value })}
                                    placeholder="$29.99"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-white text-xs font-bold focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/10"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">CTA Button Text</label>
                                <input
                                    type="text"
                                    value={link.cta_text || ''}
                                    onChange={(e) => onUpdate(link.id, { cta_text: e.target.value })}
                                    placeholder="Buy Now"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-white text-xs font-bold focus:border-zenith-indigo/40 outline-none transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>
                    )}

                    {/* Embed Preview */}
                    {linkType === 'embed' && link.url && link.url !== 'https://' && (
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                            <Play size={14} className="text-zenith-indigo mb-2" />
                            Embed will auto-detect: YouTube, Spotify, TikTok
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/[0.03] flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/[0.03] rounded-lg text-white/20 group-hover:text-zenith-indigo transition-colors">
                                <BarChart3 size={12} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-white uppercase tracking-tighter">{link.click_count || 0} Hits</p>
                                <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">Registry Load</p>
                            </div>
                        </div>

                        {/* Pin Toggle */}
                        <button
                            onClick={() => onUpdate(link.id, { is_pinned: !link.is_pinned })}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                                link.is_pinned
                                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                    : "text-white/20 hover:text-white/60 border border-transparent hover:border-white/10"
                            )}
                        >
                            {link.is_pinned ? <PinOff size={10} /> : <Pin size={10} />}
                            {link.is_pinned ? 'Unpin' : 'Pin'}
                        </button>

                        {/* Thumbnail Upload */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black text-white/20 hover:text-white/60 uppercase tracking-widest transition-all border border-transparent hover:border-white/10"
                        >
                            {uploading ? <Loader2 size={10} className="animate-spin" /> : <Image size={10} />}
                            {link.thumbnail_url ? 'Change Icon' : 'Add Icon'}
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />

                        {/* Toggle Advanced */}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black text-white/20 hover:text-white/60 uppercase tracking-widest transition-all border border-transparent hover:border-white/10 ml-auto"
                        >
                            <Calendar size={10} />
                            Advanced
                        </button>
                    </div>

                    {/* Advanced Options */}
                    <AnimatePresence>
                        {showAdvanced && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                                            <Tag size={10} /> Category
                                        </label>
                                        <select
                                            value={link.category || ''}
                                            onChange={(e) => onUpdate(link.id, { category: e.target.value || null })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white text-[10px] font-bold uppercase tracking-widest focus:border-zenith-indigo/40 outline-none transition-all appearance-none"
                                        >
                                            <option value="" className="bg-zinc-900">No Category</option>
                                            {CATEGORIES.map(c => (
                                                <option key={c} value={c} className="bg-zinc-900">{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                                            <FolderOpen size={10} /> Group
                                        </label>
                                        <select
                                            value={link.group_id || ''}
                                            onChange={(e) => onUpdate(link.id, { group_id: e.target.value || null })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white text-[10px] font-bold uppercase tracking-widest focus:border-zenith-indigo/40 outline-none transition-all appearance-none"
                                        >
                                            <option value="" className="bg-zinc-900">No Group</option>
                                            {groups.map(g => (
                                                <option key={g.id} value={g.id} className="bg-zinc-900">{g.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={10} /> Starts
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={link.schedule_start ? new Date(link.schedule_start).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => onUpdate(link.id, { schedule_start: e.target.value ? new Date(e.target.value).toISOString() : null })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white text-[10px] font-bold focus:border-zenith-indigo/40 outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={10} /> Ends
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={link.schedule_end ? new Date(link.schedule_end).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => onUpdate(link.id, { schedule_end: e.target.value ? new Date(e.target.value).toISOString() : null })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white text-[10px] font-bold focus:border-zenith-indigo/40 outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                {/* Thumbnail preview */}
                                {link.thumbnail_url && (
                                    <div className="mt-4 flex items-center gap-4">
                                        <img src={link.thumbnail_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                                        <button
                                            onClick={() => onUpdate(link.id, { thumbnail_url: null })}
                                            className="text-[8px] font-black text-red-400/60 hover:text-red-400 uppercase tracking-widest transition-colors"
                                        >
                                            Remove Icon
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action Control Tower */}
                <div className="p-10 flex flex-row md:flex-col items-center justify-between border-l border-white/[0.05] bg-white/[0.02] gap-10">
                    <div className="space-y-3 text-center">
                        <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] block">Status</label>
                        <button
                            onClick={() => onUpdate(link.id, { is_visible: !link.is_visible })}
                            className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-all duration-500 ease-in-out focus:outline-none",
                                link.is_visible ? "bg-zenith-indigo zenith-glow shadow-[0_0_20px_rgba(99,102,241,0.4)]" : "bg-white/5 border border-white/10"
                            )}
                        >
                            <span
                                className={cn(
                                    "pointer-events-none inline-block h-4 w-4 transform rounded-full transition duration-500 ease-in-out mt-1 ml-1",
                                    link.is_visible ? "translate-x-5 bg-white shadow-xl" : "translate-x-0 bg-white/20"
                                )}
                            />
                        </button>
                    </div>

                    <button
                        onClick={() => onDelete(link.id)}
                        className="p-4 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group/trash"
                    >
                        <Trash2 size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </Reorder.Item>
    )
}
