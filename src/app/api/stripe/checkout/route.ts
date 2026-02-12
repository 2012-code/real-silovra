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

        // Get profile to check for existing stripe_customer_id
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id, username')
            .eq('id', user.id)
            .single()

        let customerId = profile?.stripe_customer_id

        // Create Stripe customer if none exists
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { supabase_user_id: user.id },
            })
            customerId = customer.id

            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id)
        }

        const priceId = process.env.STRIPE_PRO_PRICE_ID
        if (!priceId) {
            return NextResponse.json({ error: 'Stripe price not configured' }, { status: 500 })
        }

        const origin = req.headers.get('origin') || 'http://localhost:3000'

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${origin}/dashboard?upgraded=true`,
            cancel_url: `${origin}/dashboard?cancelled=true`,
            metadata: { supabase_user_id: user.id },
        })

        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error('Stripe checkout error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
