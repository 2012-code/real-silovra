'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Profile } from '@/types'
import { motion } from 'framer-motion'

interface ProfileEditorProps {
    initialProfile: Profile | null
    userId: string
}

export default function ProfileEditor({ initialProfile, userId }: ProfileEditorProps) {
    const [profile, setProfile] = useState<Partial<Profile>>(initialProfile || {})
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (initialProfile) setProfile(initialProfile)
    }, [initialProfile])

    const handleSave = async () => {
        setLoading(true)
        setMessage(null)

        const updates = {
            username: profile.username,
            display_name: profile.display_name,
            bio: profile.bio,
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('profiles')
            .upsert({ id: userId, ...updates })

        if (error) {
            console.error('Error updating profile:', error)
            setMessage('Error saving profile.')
        } else {
            setMessage('Profile saved successfully!')
            setTimeout(() => setMessage(null), 3000)
        }
        setLoading(false)
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Details</h2>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mb-4 p-3 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                >
                    {message}
                </motion.div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-900 px-3 text-gray-500 sm:text-sm">
                            ultra.link/
                        </span>
                        <input
                            type="text"
                            id="username"
                            value={profile.username || ''}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                            className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                    <input
                        type="text"
                        id="display_name"
                        value={profile.display_name || ''}
                        onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border shadow-sm"
                    />
                </div>

                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                    <textarea
                        id="bio"
                        rows={3}
                        value={profile.bio || ''}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border shadow-sm"
                        placeholder="Tell the world about yourself..."
                    />
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <ThemeSelector
                        currentTheme={profile.custom_theme}
                        onSelect={(theme) => setProfile({ ...profile, theme_id: 'custom', custom_theme: theme })}
                    />
                </div>
            </div>
        </div>
    )
}
