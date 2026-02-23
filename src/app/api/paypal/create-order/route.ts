import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const PAYPAL_BASE = 'https://api-m.paypal.com' // Production

async function getPayPalAccessToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials are not configured')
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const response = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })

    if (!response.ok) {
        const err = await response.text()
        throw new Error(`Failed to get PayPal token: ${err}`)
    }

    const data = await response.json()
    return data.access_token
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const accessToken = await getPayPalAccessToken()

        const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: '9.00',
                    },
                    description: 'Silovra Pro – 1 Month',
                    custom_id: user.id, // Link order to user
                }],
                application_context: {
                    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
                    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
                    brand_name: 'Silovra',
                    user_action: 'PAY_NOW',
                },
            }),
        })

        if (!response.ok) {
            const err = await response.json()
            console.error('PayPal create order error:', err)
            return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
        }

        const order = await response.json()
        return NextResponse.json({ id: order.id })

    } catch (err: any) {
        console.error('PayPal create-order error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
