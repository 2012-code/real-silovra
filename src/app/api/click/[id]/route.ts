import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

function parseDeviceType(ua: string): string {
    if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return 'mobile'
    if (/tablet/i.test(ua)) return 'tablet'
    return 'desktop'
}

function parseBrowser(ua: string): string {
    if (/firefox/i.test(ua)) return 'Firefox'
    if (/edg/i.test(ua)) return 'Edge'
    if (/chrome/i.test(ua)) return 'Chrome'
    if (/safari/i.test(ua)) return 'Safari'
    if (/opera|opr/i.test(ua)) return 'Opera'
    return 'Other'
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch the link
    const { data: link, error } = await supabase
        .from('links')
        .select('url, click_count, user_id')
        .eq('id', id)
        .single()

    if (error || !link) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || null

    // Increment click count (legacy)
    await supabase
        .from('links')
        .update({ click_count: (link.click_count || 0) + 1 })
        .eq('id', id)

    // Insert detailed click event
    await supabase
        .from('link_clicks')
        .insert({
            link_id: id,
            user_id: link.user_id,
            referrer: referrer,
            device_type: parseDeviceType(userAgent),
            browser: parseBrowser(userAgent),
        })

    // Redirect to the actual URL
    return NextResponse.redirect(link.url)
}
