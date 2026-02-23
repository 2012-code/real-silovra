import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const PAYPAL_BASE = 'https://api-m.paypal.com'

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

    if (!response.ok) throw new Error('Failed to get PayPal token')
    const data = await response.json()
    return data.access_token
}

// This route is called by PayPal after the user approves the payment
// URL: /api/paypal/capture-return?token=ORDER_ID&PayerID=PAYER_ID
export async function GET(req: NextRequest) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://silovra.online'

    try {
        const { searchParams } = new URL(req.url)
        const token = searchParams.get('token') // This is the PayPal order ID
        const payerId = searchParams.get('PayerID')

        if (!token || !payerId) {
            return NextResponse.redirect(`${appUrl}/pricing?error=missing_params`)
        }

        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.redirect(`${appUrl}/auth/login?redirect=/pricing`)
        }

        // Capture the order
        const accessToken = await getPayPalAccessToken()
        const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${token}/capture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })

        if (!captureRes.ok) {
            const err = await captureRes.json()
            console.error('PayPal capture failed:', err)
            return NextResponse.redirect(`${appUrl}/pricing?error=capture_failed`)
        }

        const captureData = await captureRes.json()
        const captureStatus = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.status

        if (captureStatus !== 'COMPLETED') {
            console.error('PayPal capture not COMPLETED:', captureStatus)
            return NextResponse.redirect(`${appUrl}/pricing?error=not_completed`)
        }

        // Upgrade the user to Pro
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                plan: 'pro',
                stripe_customer_id: `paypal_${token}`,
            })
            .eq('id', user.id)

        if (updateError) {
            console.error('Supabase update error:', updateError)
            return NextResponse.redirect(`${appUrl}/pricing?error=db_error`)
        }

        return NextResponse.redirect(`${appUrl}/dashboard?upgraded=true`)

    } catch (err: any) {
        console.error('PayPal capture-return error:', err)
        return NextResponse.redirect(`${appUrl}/pricing?error=unknown`)
    }
}
