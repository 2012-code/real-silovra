'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Link as LinkType } from '@/types'
import { Reorder, useDragControls, motion, AnimatePresence } from 'framer-motion'
import { GripVertical, Trash2, Plus, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LinkEditorProps {
    initialLinks: LinkType[]
    userId: string
}

export default function LinkEditor({ initialLinks, userId }: LinkEditorProps) {
    const [links, setLinks] = useState<LinkType[]>(initialLinks)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        setLinks(initialLinks)
    }, [initialLinks])

    const addLink = async () => {
        setLoading(true)
        const newLink = {
            user_id: userId,
            title: 'New Link',
            url: 'https://',
            position: links.length,
            is_visible: true,
        }

        const { data, error } = await supabase
            .from('links')
            .insert(newLink)
            .select()
            .single()

        if (error) {
            console.error('Error adding link:', error)
        } else if (data) {
            setLinks([...links, data])
        }
        setLoading(false)
    }

    const updateLink = async (id: string, updates: Partial<LinkType>) => {
        // Optimistic update
        setLinks(links.map(l => l.id === id ? { ...l, ...updates } : l))

        const { error } = await supabase
            .from('links')
            .update(updates)
            .eq('id', id)

        if (error) {
            console.error('Error updating link:', error)
            // Revert on error (could be improved)
        }
    }

    const deleteLink = async (id: string) => {
        if (!confirm('Are you sure you want to delete this link?')) return

        setLinks(links.filter(l => l.id !== id))

        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting link:', error)
        }
    }

    const handleReorder = async (newOrder: LinkType[]) => {
        setLinks(newOrder)

        // Batch update positions
        // In a real app, you'd want to debounce this or use a more efficient strategy
        const updates = newOrder.map((link, index) => ({
            id: link.id,
            position: index,
            user_id: userId // RLS requires this sometimes depending on policy
        }))

        const { error } = await supabase
            .from('links')
            .upsert(updates, { onConflict: 'id' })

        if (error) {
            console.error('Error reordering links:', error)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Links</h2>
                <button
                    onClick={addLink}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                    <Plus size={18} />
                    Add Link
                </button>
            </div>

            <Reorder.Group axis="y" values={links} onReorder={handleReorder} className="space-y-4">
                <AnimatePresence initial={false}>
                    {links.map((link) => (
                        <LinkItem
                            key={link.id}
                            link={link}
                            onUpdate={updateLink}
                            onDelete={deleteLink}
                        />
                    ))}
                </AnimatePresence>
            </Reorder.Group>

            {links.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
                    <p>No links yet. Click "Add Link" to get started.</p>
                </div>
            )}
        </div>
    )
}

function LinkItem({ link, onUpdate, onDelete }: { link: LinkType, onUpdate: Function, onDelete: Function }) {
    const controls = useDragControls()
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <Reorder.Item
            value={link}
            dragListener={false}
            dragControls={controls}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden"
        >
            <div className="p-4 flex items-center gap-4 bg-white dark:bg-zinc-800 relative z-10">
                <div
                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    onPointerDown={(e) => controls.start(e)}
                >
                    <GripVertical size={20} />
                </div>

                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        value={link.title || ''}
                        onChange={(e) => onUpdate(link.id, { title: e.target.value })}
                        placeholder="Link Title"
                        className="block w-full text-sm font-medium text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 p-0 placeholder-gray-400"
                    />
                    <input
                        type="text"
                        value={link.url || ''}
                        onChange={(e) => onUpdate(link.id, { url: e.target.value })}
                        placeholder="URL (https://...)"
                        className="block w-full text-xs text-gray-500 dark:text-gray-400 bg-transparent border-none focus:ring-0 p-0"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onUpdate(link.id, { is_visible: !link.is_visible })}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            link.is_visible
                                ? "text-gray-400 hover:bg-gray-100 hover:text-green-600 dark:hover:bg-zinc-700"
                                : "text-gray-300 bg-gray-50 dark:bg-zinc-900"
                        )}
                        title={link.is_visible ? "Visible" : "Hidden"}
                    >
                        {link.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>

                    <button
                        onClick={() => onDelete(link.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </Reorder.Item>
    )
}
