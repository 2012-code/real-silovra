import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Link } from '@/types'

export function useLinks(userId: string | undefined) {
    const [links, setLinks] = useState<Link[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchLinks() {
            if (!userId) return
            setLoading(true)
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .eq('user_id', userId)
                .order('position', { ascending: true })

            if (error) {
                console.error('Error fetching links:', error)
            } else {
                setLinks(data || [])
            }
            setLoading(false)
        }

        fetchLinks()
    }, [userId])

    return { links, loading }
}
