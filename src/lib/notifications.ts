import { createClient } from '@/utils/supabase/client'

const MILESTONES = {
    views: [10, 50, 100, 500, 1000, 5000, 10000],
    clicks: [10, 50, 100, 500, 1000, 5000, 10000],
}

export async function checkMilestones(userId: string, totalViews: number, totalClicks: number) {
    const supabase = createClient()

    // Get existing milestone notifications to avoid duplicates
    const { data: existing } = await supabase
        .from('notifications')
        .select('message')
        .eq('user_id', userId)
        .eq('type', 'milestone')

    const existingMessages = new Set((existing || []).map(n => n.message))

    const newNotifications: { user_id: string; type: string; title: string; message: string }[] = []

    for (const threshold of MILESTONES.views) {
        if (totalViews >= threshold) {
            const msg = `Your profile has reached ${threshold.toLocaleString()} views!`
            if (!existingMessages.has(msg)) {
                newNotifications.push({
                    user_id: userId,
                    type: 'milestone',
                    title: `🎉 ${threshold.toLocaleString()} Views`,
                    message: msg,
                })
            }
        }
    }

    for (const threshold of MILESTONES.clicks) {
        if (totalClicks >= threshold) {
            const msg = `Your links have received ${threshold.toLocaleString()} total clicks!`
            if (!existingMessages.has(msg)) {
                newNotifications.push({
                    user_id: userId,
                    type: 'milestone',
                    title: `🔥 ${threshold.toLocaleString()} Clicks`,
                    message: msg,
                })
            }
        }
    }

    if (newNotifications.length > 0) {
        await supabase.from('notifications').insert(newNotifications)
    }
}

export async function getNotifications(userId: string) {
    const supabase = createClient()
    const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
    return data || []
}
