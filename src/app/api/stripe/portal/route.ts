import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single()

        if (!profile?.stripe_customer_id) {
            return NextResponse.json({ error: 'No subscription found' }, { status: 400 })
        }

        const origin = req.headers.get('origin') || 'http://localhost:3000'

        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${origin}/dashboard`,
        })

        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error('Portal session error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
