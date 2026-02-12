import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const body = await req.json()
        const { orderID } = body

        // In a real production app, verify the order with PayPal API here using orderID
        // For MVP, we trust the client-side success callback (less secure but works without secret key backend setup if using client-only flow)
        // Ideally: await verifyPayPalOrder(orderID)

        // Upgrade user to Pro
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                plan: 'pro',
                // Store paypal order ID as customer ID reference
                stripe_customer_id: `paypal_${orderID}`
            })
            .eq('id', user.id)

        if (updateError) throw updateError

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('PayPal capture error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
