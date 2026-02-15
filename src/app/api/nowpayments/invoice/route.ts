import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// Use Environment Variables
const API_URL = 'https://api.nowpayments.io/v1' // Production

export async function POST(req: NextRequest) {
    try {
        const API_KEY = process.env.NOWPAYMENTS_API_KEY
        if (!API_KEY) {
            console.error('NOWPAYMENTS_API_KEY is missing')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const body = await req.json()
        const { email } = body

        // Create Invoice (Standard Payment Link) because Subscriptions require JWT/Custody
        const response = await fetch(`${API_URL}/invoice`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                price_amount: 9,
                price_currency: 'usd',
                order_id: user.id, // Important: Link payment to User ID
                order_description: 'Pro Subscription (1 Month)',
                ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/api/webhooks/nowpayments`,
                success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/dashboard?upgraded=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/pricing`
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            console.error('NOWPayments Error:', error)
            return NextResponse.json({ error: error.message || 'Failed to create invoice' }, { status: 500 })
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (err: any) {
        console.error('Subscription creation error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
