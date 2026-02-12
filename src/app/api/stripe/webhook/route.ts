import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

// Use service role key for webhook (no user session)
function getAdminClient() {
    return createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )
}

export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    if (!sig) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        )
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = getAdminClient()

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object
            const userId = session.metadata?.supabase_user_id
            if (userId) {
                await supabase
                    .from('profiles')
                    .update({ plan: 'pro', stripe_customer_id: session.customer as string })
                    .eq('id', userId)
            }
            break
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object
            const customerId = subscription.customer as string
            // Downgrade to free
            await supabase
                .from('profiles')
                .update({ plan: 'free' })
                .eq('stripe_customer_id', customerId)
            break
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object
            const customerId = invoice.customer as string
            // Optionally downgrade on payment failure
            await supabase
                .from('profiles')
                .update({ plan: 'free' })
                .eq('stripe_customer_id', customerId)
            break
        }
    }

    return NextResponse.json({ received: true })
}
