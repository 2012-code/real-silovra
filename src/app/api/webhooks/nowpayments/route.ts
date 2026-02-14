import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'

const IPN_SECRET = '8LMsDLB5Pm07KEge4IDsaTbnaI6cKfWv'

export async function POST(req: NextRequest) {
    try {
        const sig = req.headers.get('x-nowpayments-sig')
        if (!sig) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 })
        }

        const body = await req.json()

        // Verify Signature
        // Sort keys and join
        const sortedKeys = Object.keys(body).sort()
        const sortedParams = sortedKeys.map(key => `${key}=${body[key]}`).join('&')
        const hmac = crypto.createHmac('sha512', IPN_SECRET)
        hmac.update(sortedParams)
        const calculatedSig = hmac.digest('hex')

        if (sig !== calculatedSig) {
            console.error('Invalid signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        const { order_id, payment_status } = body

        console.log('NOWPayments Webhook:', { order_id, payment_status })

        // Check for 'finished' or 'confirmed' status
        // In Sandbox, 'finished' is likely the goal.
        if (payment_status === 'finished' || payment_status === 'confirmed') {
            if (!order_id) {
                console.error('No order_id in webhook')
                return NextResponse.json({ error: 'No order_id' }, { status: 400 })
            }

            const supabase = await createClient()

            // Upgrade User
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    plan: 'pro',
                    stripe_customer_id: `nowpayments_${body.payment_id}`
                })
                .eq('id', order_id)

            if (updateError) {
                console.error('Supabase update error:', updateError)
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
            }
        }

        return NextResponse.json({ success: true })

    } catch (err: any) {
        console.error('Webhook error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
