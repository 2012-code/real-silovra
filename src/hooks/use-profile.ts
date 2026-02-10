import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Profile } from '@/types'

export function useProfile(username: string) {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        async function fetchProfile() {
            if (!username) return
            setLoading(true)
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single()

            if (error) {
                setError(error)
            } else {
                setProfile(data)
            }
            setLoading(false)
        }

        fetchProfile()
    }, [username])

    return { profile, loading, error }
}
